// ── SUCHI'S FILE ──────────────────────────────────────────────────────────────
import Product from "../model/productModel.js";

/**
 * POST /api/product/add
 * Allows a seller to create a new product listing.
 */
export const addProduct = async (req, res) => {
  try {
    // Extracting product details from the request body sent by the frontend
    const { name, description, price, category, stock, image } = req.body;
    // Getting the seller's ID from the authenticated user object (set by middleware)
    const sellerId = req.user.id; 

    // Basic validation: ensure the most critical fields are not empty
    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "Name, price and category are required" });
    }

    // STRICT FIX: Convert stock to a base-10 integer to avoid "string math" bugs
    const exactStock = parseInt(stock, 10) || 0; 
    // STRICT FIX: Convert price to a float (decimal number) for financial accuracy
    const exactPrice = parseFloat(price);

    // Safety Check: Ensure the seller isn't entering negative values
    if (exactStock < 0 || exactPrice < 0) {
      return res.status(400).json({ message: "Stock and price cannot be negative." });
    }

    // Create a new instance of the Product model with the sanitized data
    const newProduct = new Product({
      name,
      description,
      price: exactPrice, // Using the strictly parsed float
      category,
      stock: exactStock, // Using the strictly parsed integer
      image,
      sellerId,
      // Logic: If stock is 0, isAvailable is false; if stock > 0, it's true
      isAvailable: exactStock > 0, 
    });
    
    // Save the new product document to the MongoDB database
    await newProduct.save();

    // Send a success response back to the seller
    return res
      .status(201)
      .json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    // Log any unexpected errors to the server console
    console.log("Error in addProduct:", error);
    return res.status(500).json({ message: "Server error in add product" });
  }
};

/**
 * GET /api/product/all
 * Fetches all products with pagination (splitting results into pages).
 */
export const getAllProducts = async (req, res) => {
  try {
    // Determine which page to show, defaulting to page 1
    const page = parseInt(req.query.page) || 1;
    // Determine how many items to show per page, defaulting to 20
    const limit = parseInt(req.query.limit) || 20;
    // Calculate how many documents to skip based on the current page
    const skip = (page - 1) * limit;

    // Fetch products from the DB using the skip and limit values
    const products = await Product.find({ /*isAvailable: true*/ }) 
      .skip(skip)
      .limit(limit);
    
    // Count the total number of available products to help the frontend build pagination buttons
    const total = await Product.countDocuments({ isAvailable: true });

    // Return the specific page of products and the calculated total pages
    return res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/product/:id
 * Fetches the full details of a single product by its unique ID.
 */
export const getProductById = async (req, res) => {
  try {
    // Search the database for the product matching the ID in the URL parameters
    const product = await Product.findById(req.params.id);
    // If no product matches that ID, return a 404 error
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Return the product details to the user
    return res.status(200).json({ product });
  } catch (error) {
    console.log("Error in getProductById:", error);
    return res.status(500).json({ message: "Server error in get product" });
  }
};

/**
 * PUT /api/product/update/:id
 * Allows the owner (seller) to update the product details.
 */
export const updateProduct = async (req, res) => {
  try {
    // Get the ID of the seller making the request
    const sellerId = req.user.id;
    // Find the product to be updated
    const product = await Product.findById(req.params.id);

    // If product doesn't exist, stop and return error
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Security check: Only the seller who created the product can edit it
    if (product.sellerId.toString() !== sellerId) {
      return res.status(403).json({ message: "You can only update your own products" });
    }

    // STRICT FIX: If the user is updating stock, ensure it's a valid integer
    if (req.body.stock !== undefined) {
      req.body.stock = parseInt(req.body.stock, 10);
      
      // If the new stock is above 0, make sure the product is visible to customers
      if (req.body.stock > 0) {
        req.body.isAvailable = true; 
      } else {
        // If stock is 0 or less, hide the product and force stock to be exactly 0
        req.body.stock = 0; 
        req.body.isAvailable = false; 
      }
    }

    // STRICT FIX: If the user is updating price, ensure it's a valid float
    if (req.body.price !== undefined) {
      req.body.price = parseFloat(req.body.price);
    }

    // STRICT FIX: Using $set ensures we only overwrite specific fields provided in the body
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } }, 
      { new: true, runValidators: true } // 'new: true' returns the updated document
    );

    return res.status(200).json({ message: "Product updated strictly!", product: updatedProduct });
  } catch (error) {
    console.log("Error in updateProduct:", error);
    return res.status(500).json({ message: "Server error in update product" });
  }
};

/**
 * DELETE /api/product/delete/:id
 * Removes a product from the database entirely.
 */
export const deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const product = await Product.findById(req.params.id);

    // Ensure the product exists before trying to delete it
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Security check: Only the seller who owns the product can delete it
    if (product.sellerId.toString() !== sellerId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own products" });
    }

    // Delete the product from the collection
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct:", error);
    return res.status(500).json({ message: "Server error in delete product" });
  }
};