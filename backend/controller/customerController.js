// ── SOURAV'S FILE ─────────────────────────────────────────────────────────────
import Customer from "../model/customerModel.js";
import { hashPassword, comparePassword, generateToken } from "../helper/authHelper.js";

// POST /api/customer/register
export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, phoneno, password } = req.body;

        if (!firstname || !lastname || !email || !phoneno || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingCustomer = await Customer.findOne({ $or: [{ email }, { phoneno }] });
        if (existingCustomer) {
            return res.status(400).json({ message: "Email or phone number already registered" });
        }

        const hashedPassword = await hashPassword(password);

        const newCustomer = new Customer({
            firstname, lastname, email, phoneno,
            password: hashedPassword,
        });
        await newCustomer.save();

        return res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        console.log("Error in customer register:", error);
        return res.status(500).json({ message: "Server error in register" });
    }
};

// POST /api/customer/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await comparePassword(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(customer._id, "customer");

        return res.status(200).json({
            message: "Login successful!",
            token,
            customer: {
                id: customer._id,
                firstname: customer.firstname,
                email: customer.email,
            },
        });
    } catch (error) {
        console.log("Error in customer login:", error);
        return res.status(500).json({ message: "Server error in login" });
    }
};

// POST /api/customer/logout
export const logout = async (req, res) => {
    try {
        // JWT is stateless — logout is handled on the frontend by deleting the token
        // If you need server-side logout, implement a token blacklist here
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in customer logout:", error);
        return res.status(500).json({ message: "Server error in logout" });
    }
};

// DELETE /api/customer/delete-account
export const deleteAccount = async (req, res) => {
    try {
        const customerId = req.user.id; // comes from customerAuthMiddleware
        const { password } = req.body;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Account not found" });
        }

        const isMatch = await comparePassword(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        await Customer.findByIdAndDelete(customerId);
        console.log("Password received:", password)
        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.log("Error in delete account:", error);
        return res.status(500).json({ message: "Server error in delete account" });
    }
};
