"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const router = (0, express_1.Router)();
const db = new better_sqlite3_1.default("./Kitchen.db");
const UPLOADS_FOLDER = path_1.default.basename("../uploads/"); // Ensure correct path
// Setup Multer for File Uploads
const storage = multer_1.default.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        const foodName = req.body.FoodName || "default";
        cb(null, `${foodName}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// Serve Uploaded Files
router.use("/uploads", express_1.default.static("uploads"));
// Upload Image Route
router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }
    res.json({
        imageUrl: `${process.env.BASE_URL}/uploads/${req.file.filename}`,
        foodName: req.body.FoodName,
    });
});
// Store Food Item in Database
router.post("/CreateFood", (req, res) => {
    const { id, name, price, category, description, image, rate, quantity } = req.body;
    if (!name || !image) {
        res.status(400).json({ error: "Food name and image are required" });
        return;
    }
    try {
        db.prepare(`INSERT INTO Foods (id, name, price, category, description, image, rate,quantity) VALUES (?, ?, ?, ?, ?, ?, ?,?)`).run(id, name, price, category, description, image, rate, quantity);
        res.status(201).json({ message: "Food successfully inserted!" });
    }
    catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Fetch All Food Items
router.get("/GetFoods", (req, res) => {
    try {
        // Get all food data from the database
        const foods = db.prepare("SELECT * FROM Foods").all();
        // Read the uploads folder to get images
        fs_1.default.readdir(UPLOADS_FOLDER, (err, files) => {
            if (err) {
                console.error("Error reading upload folder:", err);
                return res.status(500).json({ error: "Failed to retrieve images" });
            }
            // Map file names to full image URLs
            const imageUrls = files.map((file) => ({
                imageUrl: `${process.env.BASE_URL}/uploads/${file}`,
            }));
            const foodsWithImages = foods.map((food) => {
                const foundImage = imageUrls.find(imageObj => imageObj.imageUrl == food.image);
                return Object.assign(Object.assign({}, food), { image: (foundImage === null || foundImage === void 0 ? void 0 : foundImage.imageUrl) || null });
            });
            res
                .status(200)
                .json({
                message: "Foods retrieved successfully",
                foods: foodsWithImages,
            });
        });
    }
    catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
