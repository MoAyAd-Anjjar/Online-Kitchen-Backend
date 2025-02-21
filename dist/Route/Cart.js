"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const router = (0, express_1.Router)();
const db = new better_sqlite3_1.default("./Kitchen.db");
// Route to get user cart
router.post("/GetUserCart", (req, res) => {
    try {
        const query = "SELECT * FROM cart WHERE username = ? AND user_id = ?";
        const rows = db.prepare(query).all(req.body.username, req.body.user_id);
        if (rows.length === 0) {
            const insertQuery = "INSERT INTO cart (username, user_id, cartList) VALUES (?, ?, ?)";
            db.prepare(insertQuery).run(req.body.username, req.body.user_id, JSON.stringify([]));
            return res.status(201).json({ message: "Cart created successfully" });
        }
        // Sanitize control characters
        let updatedCartList = rows[0].cartList;
        updatedCartList = updatedCartList.replace(/[\x00-\x1F\x7F]/g, '');
        try {
            const cartList = updatedCartList ? JSON.parse(updatedCartList) : [];
            rows[0].cartList = cartList;
            return res.status(200).json(rows[0]);
        }
        catch (parseError) {
            console.error("Error parsing cart list:", parseError.message);
            return res.status(400).json({ error: "Invalid cart list format" });
        }
    }
    catch (error) {
        console.error("Error fetching cart items:", error.message);
        return res.status(500).json({ error: "An error occurred while fetching products" });
    }
});
// Route to update the cart
router.put("/CartUpdate", (req, res) => {
    try {
        const deleteQuery = "DELETE FROM cart WHERE username = ? AND user_id = ?";
        db.prepare(deleteQuery).run(req.body.username, req.body.user_id);
        const insertQuery = "INSERT INTO cart (username, user_id, cartList) VALUES (?, ?, ?)";
        db.prepare(insertQuery).run(req.body.username, req.body.user_id, JSON.stringify(req.body.cartList));
        console.log(req.body);
        return res.status(201).json({ message: "Cart updated successfully" });
    }
    catch (error) {
        console.error("Error updating cart:", error.message);
        return res.status(500).json({ error: "An error occurred while updating cart" });
    }
});
exports.default = router;
