import Seller from "../model/sellerModel.js";
import Order from "../model/orderModel.js";
import Blacklist from "../model/blacklistModel.js";
import Product from "../model/productModel.js";
import { hashPassword, comparePassword, generateToken } from "../helper/authHelper.js";

// POST /api/seller/register
export const register = async (req, res) => {
    try {
        const { name, shopName, email, phoneno, password } = req.body;

        if (!name || !shopName || !email || !phoneno || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingSeller = await Seller.findOne({ $or: [{ email }, { phoneno }] });
        if (existingSeller) {
            return res.status(400).json({ message: "Email or phone already registered" });
        }

        const hashedPassword = await hashPassword(password);

        const newSeller = new Seller({ name, shopName, email, phoneno, password: hashedPassword });
        await newSeller.save();

        return res.status(201).json({ message: "Seller registered successfully!" });
    } catch (error) {
        console.log("Error in seller register:", error);
        return res.status(500).json({ message: "Server error in register" });
    }
};

// POST /api/seller/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await comparePassword(password, seller.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(seller._id, "seller");

        return res.status(200).json({
            message: "Login successful!",
            token,
            seller: { id: seller._id, name: seller.name, shopName: seller.shopName },
        });
    } catch (error) {
        console.log("Error in seller login:", error);
        return res.status(500).json({ message: "Server error in login" });
    }
};

// POST /api/seller/logout
// export const logout = async (req, res) => {
//     try {
//         return res.status(200).json({ message: "Seller logged out successfully" });
//     } catch (error) {
//         return res.status(500).json({ message: "Server error in logout" });
//     }
// };

export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        await new Blacklist({ token }).save();
        return res.status(200).json({ message: "Logged out securely" });
    } catch (error) {
        return res.status(500).json({ message: "Server error in logout" });
    }
};

export const getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// export const updateOrderStatus = async (req, res) => {
//     try {
//         const { status } = req.body;
//         const order = await Order.findOneAndUpdate(
//             { _id: req.params.id, sellerId: req.user.id }, 
//             { status }, 
//             { new: true }
//         );
//         if (!order) return res.status(404).json({ message: "Order not found" });
//         return res.status(200).json({ message: "Status updated", order });
//     } catch (error) {
//         return res.status(500).json({ message: "Server error" });
//     }
// };

//Logic for Quantity Decrement
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        // 1. Find the order first
        const order = await Order.findOne({ _id: req.params.id, sellerId: req.user.id });
        if (!order) return res.status(404).json({ message: "Order not found" });


        // If the order is ALREADY delivered, block any further changes
        if (order.status === "Delivered") {
            return res.status(400).json({ message: "This order is already delivered and cannot be modified." });
        }

        // 2. NEW LOGIC: If status changes to "Delivered", deduct stock!
        if (status === "Delivered" && order.status !== "Delivered") {
            for (const item of order.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock -= item.quantity; // Deduct the ordered amount
                    
                    // Auto-hide if stock runs out
                    if (product.stock <= 0) {
                        product.isAvailable = false;
                    }
                    await product.save();
                }
            }
        }

        // 3. Update and save the new status
        order.status = status;
        await order.save();

        return res.status(200).json({ message: "Status updated successfully", order });
    } catch (error) {
        console.log("Error updating order status:", error);
        return res.status(500).json({ message: "Server error" });
    }
};