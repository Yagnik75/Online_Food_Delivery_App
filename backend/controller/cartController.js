import Product from "../model/productModel.js";
import Cart from "../model/cartModel.js";
import Order from "../model/orderModel.js";

/** * GET /api/shop/products
 * Fetches all products marked as available for the shop front-end.
 */
export const showProducts = async (req, res) => {
  try {
    // Queries the Product collection for items where isAvailable is true
    const products = await Product.find({ isAvailable: true });
    // Returns the list of products with a 200 OK status
    return res.status(200).json({ products });
  } catch (error) {
    // Logs the error to the console for debugging
    console.log("Error in showProducts:", error);
    // Returns a 500 status if a database or server error occurs
    return res.status(500).json({ message: "Server error" });
  }
};

/** * POST /api/shop/cart/add
 * Adds a specific product to the user's cart or increments quantity if it exists.
 */
export const addToCart = async (req, res) => {
    try {
        // Extract the logged-in user's ID from the request object (provided by auth middleware)
        const customerId = req.user.id;
        // Destructure product info from the request body
        const { productId, quantity } = req.body;

        // Find the product in the DB to ensure it exists and is currently for sale
        const product = await Product.findById(productId);
        if (!product || !product.isAvailable) {
            return res.status(404).json({ message: "Product not found or unavailable" });
        }

        // Look for an existing cart belonging to this specific customer
        let cart = await Cart.findOne({ customerId });

        if (!cart) {
            // If no cart exists, create a new Cart instance
            // Note: We don't store the price here to ensure pricing stays dynamic (live)
            cart = new Cart({
                customerId,
                items: [{ productId, quantity: quantity || 1 }],
            });
        } else {
            // If cart exists, check if the product is already inside the items array
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (itemIndex > -1) {
                // If product is found, increment the quantity by the amount requested
                cart.items[itemIndex].quantity += quantity || 1;
            } else {
                // If product is new to this cart, push it into the items array
                cart.items.push({ productId, quantity: quantity || 1 });
            }
        }

        // Save the new or updated cart document to MongoDB
        await cart.save();
        return res.status(200).json({ message: "Item added to cart!", cart });
    } catch (error) {
        console.log("Error in addToCart:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/** * GET /api/shop/cart
 * Retrieves the user's cart and populates product details to handle live price updates.
 */
export const getCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    
    // Finds the user's cart and uses .populate() to join the Product data into the cart items
    let cart = await Cart.findOne({ customerId }).populate("items.productId");

    // If no cart document is found, return an empty items array structure
    if (!cart) {
      return res.status(200).json({ cart: { items: [] } });
    }

    // Capture the number of items before cleaning "ghost" items
    const originalLength = cart.items.length;
    // Filter out items where the productId is null (happens if a product was deleted from the DB)
    cart.items = cart.items.filter(item => item.productId !== null);

    // If items were removed during filtering, save the "cleaned" cart back to the database
    if (cart.items.length !== originalLength) {
      await cart.save();
    }

    // Return the populated cart (now containing live prices and product names)
    return res.status(200).json({ cart });
  } catch (error) {
    console.log("Error fetching cart:", error);
    return res.status(500).json({ message: "Server error fetching cart" });
  }
};

/** * DELETE /api/shop/cart/remove/:productId
 * Removes a specific product entirely from the user's cart.
 */
export const removeFromCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { productId } = req.params;

    // Find the customer's cart
    const cart = await Cart.findOne({ customerId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Use filter to create a new array excluding the product the user wants to remove
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    // Save the updated cart
    await cart.save();

    return res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.log("Error in removeFromCart:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** * PUT /api/shop/cart/update/:productId
 * Updates the quantity of a specific item (e.g., clicking + or - in the UI).
 */
export const updateQuantity = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validation to prevent setting quantity to zero or negative numbers
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Find the cart
    const cart = await Cart.findOne({ customerId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Locate the index of the product within the items array
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Update the quantity to the specific number provided by the frontend
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      return res.status(200).json({ message: "Quantity updated", cart });
    } else {
      // Product wasn't in the cart to begin with
      return res.status(404).json({ message: "Item not in cart" });
    }
  } catch (error) {
    console.log("Error in updateQuantity:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** * POST /api/shop/checkout
 * Converts cart items into actual Order documents, splits them by seller, and clears the cart.
 */
export const placeOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { deliveryAddress } = req.body;

    // Ensure user provided a location for delivery
    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    // Get cart and populate product data to access current price, stock, and seller identity
    const cart = await Cart.findOne({ customerId }).populate("items.productId");

    // Block checkout if cart is non-existent or empty
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ── 1. STOCK PRE-CHECK ─────────────────────────────────────────────────
    // Loop through all items to ensure stock is available BEFORE processing any payment/orders
    for (const item of cart.items) {
      const product = item.productId;
      if (product.stock < item.quantity) {
        // If one item fails, the whole checkout process stops
        return res.status(400).json({
          message: `Checkout failed: Insufficient stock for ${product.name}. Only ${product.stock} left.`,
        });
      }
    }

    // ── 2. SPLIT ORDERS & DYNAMIC PRICING ──────────────────────────────────
    // Object to hold items grouped by their respective seller IDs
    const ordersBySeller = {};

    cart.items.forEach((item) => {
      const product = item.productId;
      const sellerId = product.sellerId.toString();

      // If this is the first item from this seller, initialize their order object
      if (!ordersBySeller[sellerId]) {
        ordersBySeller[sellerId] = { items: [], totalAmount: 0 };
      }

      // Add the item to that specific seller's list with the CURRENT price
      ordersBySeller[sellerId].items.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price, // Captures price at moment of purchase
      });

      // Increment the total cost for this specific seller's portion
      ordersBySeller[sellerId].totalAmount += product.price * item.quantity;
    });

    // ── 3. CREATE MULTIPLE ORDERS ──────────────────────────────────────────
    // Iterate through the grouped object to save a separate Order for each seller
    const createdOrders = [];
    for (const sellerId in ordersBySeller) {
      const newOrder = new Order({
        customerId,
        sellerId,
        items: ordersBySeller[sellerId].items,
        totalAmount: ordersBySeller[sellerId].totalAmount,
        deliveryAddress,
      });
      // Save order to DB and add to our tracking array for the response
      await newOrder.save();
      createdOrders.push(newOrder);
    }

    // ── 4. DEDUCT STOCK FROM INVENTORY ─────────────────────────────────────
    // Note: This logic is currently commented out in your code. 
    // Usually, stock is deducted when the order is 'Delivered' or 'Confirmed' by the seller.

    // ── 5. CLEAR THE CART ──────────────────────────────────────────────────
    // After successful order creation, wipe the items from the user's cart
    cart.items = [];
    await cart.save();

    // Respond with all orders created (useful for the order success page)
    return res.status(201).json({
      message: "Orders placed successfully with up-to-date pricing!",
      orders: createdOrders,
    });
  } catch (error) {
    console.log("Error in placeOrder:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** * GET /api/shop/orders
 * Fetches the order history for the logged-in customer.
 */
export const getOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    // Find orders for this user and sort by newest first (descending date)
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    console.log("Error in getOrders:", error);
    return res.status(500).json({ message: "Server error" });
  }
};