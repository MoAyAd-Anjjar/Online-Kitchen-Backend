"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = (0, express_1.Router)();
const db = new better_sqlite3_1.default("./Kitchen.db");
// Route to get users
router.post("/CreateUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email, userid, phone, uservalidateanswer, role, } = req.body;
        // Input validation (you can expand on this as needed)
        if (!username || !password || !email || !userid || !phone) {
            res.status(400).json({ message: "Missing required fields" });
        }
        // Check if user already exists
        const Userquery = db.prepare("SELECT * FROM Users WHERE username =? AND email =?");
        if (Userquery) {
            const users = Userquery.all(username, email);
            if (users.length > 0) {
                return res.sendStatus(209).end();
            }
        }
        // Hash password before storing
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Insert new user into the database
        const query = db.prepare("INSERT INTO Users (username, password, email, userid, phone, uservalidateanswer, role) VALUES (?, ?, ?, ?, ?, ?, ?)");
        query.run(username, hashedPassword, email, userid, phone, uservalidateanswer || "", role);
        return res.status(201).json({ message: "User Created Successfully" });
    }
    catch (err) {
        console.error("Error creating user:", err.message);
        res.status(500).json({ error: "An error occurred while creating user" });
    }
}));
router.get("/GetUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.query;
    try {
        // Validate that username, password, and email are provided
        if (!username || !password || !email) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const query = db.prepare("SELECT * FROM Users WHERE username =? AND email =?");
        const users = query.all(username, email);
        // If no user is found, return a 401 (Unauthorized)
        if (users.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }
        // Check if the password matches the hashed password in the database
        const user = users[0]; // Assuming we only expect one result based on username and email
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        // If user and password match, return the user details
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ error: "An error occurred while fetching user" });
    }
}));
exports.default = router;
