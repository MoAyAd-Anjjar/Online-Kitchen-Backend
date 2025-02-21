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
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const db = new better_sqlite3_1.default("./Kitchen.db");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, "uploads"); // Use the new name
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`); // Use the new name
    },
});
const upload = (0, multer_1.default)({ storage: storage });
router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }
    res.json({ imageUrl: `http://localhost:3030/uploads/${req.file.originalname}` });
});
// Route to Create Food
router.post("/CreateFood", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, price, category, description, image, rate } = req.body;
    if (!name || !image) {
        res.status(400).json({ error: "Food name and image are required" });
        return;
    }
    const query = `INSERT INTO Foods (id, name, price, category, description, image, rate) VALUES (?,?,?,?,?,?,?)`;
    try {
        db.prepare(query).run(id, name, price, category, description, image, rate);
        res.status(201).json({ message: "Food was successfully inserted" });
    }
    catch (error) {
        console.error("Unexpected error:", error.message);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
}));
// Route to get products by category
router.get("/GetFoods", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM Foods`;
    try {
        const Data = db.prepare(query).all();
        res.status(200).send({ Message: "Food Retrieve successfully ", Data });
        return;
    }
    catch (error) {
        console.error("Unexpected error:", error.message);
        res.status(500).send("An unexpected error occurred");
        return;
    }
}));
exports.default = router;
