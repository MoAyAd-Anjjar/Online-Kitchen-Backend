import express, { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { log } from "console";

const router: Router = Router();
const db = new Database("./Kitchen.db");
const UPLOADS_FOLDER = path.basename("../uploads/"); // Ensure correct path

// Setup Multer for File Uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const foodName = req.body.FoodName || "default";
    cb(null, `${foodName}`);
  },
});

const upload = multer({ storage });

// Serve Uploaded Files
router.use("/uploads", express.static("uploads"));

// Upload Image Route
router.post(
  "/upload",
  upload.single("image"),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    res.json({
      imageUrl: `${process.env.BASE_URL}/uploads/${req.file.filename}`,
      foodName: req.body.FoodName,

    });
  }
);

// Store Food Item in Database
router.post("/CreateFood", (req: Request, res: Response) => {
  const { id, name, price, category, description, image, rate, quantity } =
    req.body;

  if (!name || !image) {
    res.status(400).json({ error: "Food name and image are required" });
    return;
  }

  try {
    db.prepare(
      `INSERT INTO Foods (id, name, price, category, description, image, rate,quantity) VALUES (?, ?, ?, ?, ?, ?, ?,?)`
    ).run(id, name, price, category, description, image, rate, quantity);

    res.status(201).json({ message: "Food successfully inserted!" });
  } catch (error: any) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch All Food Items
router.get("/GetFoods", (req: Request, res: Response) => {
  try {
    // Get all food data from the database
    const foods = db.prepare("SELECT * FROM Foods").all();

    // Read the uploads folder to get images
    fs.readdir(UPLOADS_FOLDER, (err, files) => {
      if (err) {
        console.error("Error reading upload folder:", err);
        return res.status(500).json({ error: "Failed to retrieve images" });
      }

      // Map file names to full image URLs
      const imageUrls = files.map((file) => ({
        imageUrl: `${process.env.BASE_URL}/uploads/${file}`,
      }));
      

      
      const foodsWithImages = foods.map((food: any) => {
      const foundImage = imageUrls.find(imageObj => imageObj.imageUrl == food.image);
        return {
          ...food,
          image: foundImage?.imageUrl || null,
        };
      });
      res
        .status(200)
        .json({
          message: "Foods retrieved successfully",
          foods: foodsWithImages,
        });
    });
  } catch (error: any) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
