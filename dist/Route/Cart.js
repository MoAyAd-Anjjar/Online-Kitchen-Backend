"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const router = (0, express_1.Router)();
const db = new better_sqlite3_1.default("./Kitchen.db");
router.put("/CartUpdate", (req, res) => {
    const query = "SELECT * FROM Cart WHERE username = ? AND userid = ?";
    const rows = db.prepare(query).all(req.body.username, req.body.userid);
    try {
        if (rows && req.body.username && req.body.userid) {
            const deleteQuery = "DELETE FROM Cart WHERE username = ? AND userid = ?";
            db.prepare(deleteQuery).run(req.body.username, req.body.userid);
            const insertQuery = "INSERT INTO Cart (username, userid, userList) VALUES (?, ?, ?)";
            db.prepare(insertQuery).run(req.body.username, req.body.userid, JSON.stringify(req.body.userList));
        }
        return res.status(201).json({ message: "Cart updated successfully" });
    }
    catch (error) {
        console.error("Error updating cart:", error.message);
        return res
            .status(500)
            .json({ error: "An error occurred while updating cart" });
    }
});
router.get("/CartList", (req, res) => {
    const query = "SELECT * FROM Cart WHERE username = ? AND userid = ?";
    const rows = db
        .prepare(query)
        .all(req.query.username, req.query.userid);
    if (rows.length > 0) {
        // Ensure 'userList' is parsed correctly for each row
        rows.forEach((row) => {
            if (row.userList) {
                row.userList = JSON.parse(row.userList); // Convert JSON string to array
            }
        });
        res.status(200).json(...rows); // Return the updated rows with the parsed 'userList'
    }
    else {
        res
            .status(200)
            .json({
            username: req.query.username,
            userid: req.query.userid,
            userList: [],
        });
    }
});
exports.default = router;
