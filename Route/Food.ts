import { Router, Request, Response } from "express";
import Database from "better-sqlite3";
import multer from "multer";
import path from "path";

const router: Router = Router();
const db = new Database("./Kitchen.db");

const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    return   cb(null, "uploads"); // Use the new name
    },
  filename: (req, file, cb) => {
  return   cb(null, `${Date.now()}_${file.originalname}`); // Use the new name
  },
});
const upload = multer({ storage: storage });


router.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return 
  }

  res.json({ imageUrl: `https://online-kitchen-backend.onrender.com//uploads/${req.file.originalname}` });
});

// Route to Create Food
router.post("/CreateFood", async (req: Request, res: Response) => {
  const { id, name, price, category, description, image, rate } = req.body;

  if (!name || !image) {
    res.status(400).json({ error: "Food name and image are required" });
    return;
  }

  

  const query = `INSERT INTO Foods (id, name, price, category, description, image, rate) VALUES (?,?,?,?,?,?,?)`;

  try {
    db.prepare(query).run(
      id,
      name,
      price,
      category,
      description,
      image,
      rate
    );
    res.status(201).json({ message: "Food was successfully inserted" });
  } catch (error: any) {
    console.error("Unexpected error:", error.message);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// Route to get products by category
router.get("/GetFoods", async (req: Request, res: any) => {
  const query = `SELECT * FROM Foods`;

  try {
    const Data = db.prepare(query).all();
    res.status(200).send({ Message: "Food Retrieve successfully ", Data });
    return;
  } catch (error: any) {
    console.error("Unexpected error:", error.message);
    res.status(500).send("An unexpected error occurred");
    return;
  }
});

export default router;
