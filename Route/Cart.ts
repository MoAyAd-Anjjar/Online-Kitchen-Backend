import { Router, Request, Response } from "express";
import Database from "better-sqlite3";
import { ICartType } from "../Types";

const router: Router = Router();
const db = new Database("./Kitchen.db");
  

// Route to get user cart
router.post("/GetUserCart", (req: Request, res: any) => {
  try {
    const query = "SELECT * FROM cart WHERE username = ? AND user_id = ?";
    const rows: any = db.prepare(query).all(req.body.username, req.body.user_id);

    if (rows.length === 0) {
      const insertQuery = "INSERT INTO cart (username, user_id, cartList) VALUES (?, ?, ?)";
      db.prepare(insertQuery).run(req.body.username, req.body.user_id, JSON.stringify([]));

      return res.status(201).json({ message: "Cart created successfully" });
    }

    // Sanitize control characters
    let updatedCartList: any = rows[0].cartList;
    updatedCartList = updatedCartList.replace(/[\x00-\x1F\x7F]/g, '');

    try {
      const cartList = updatedCartList ? JSON.parse(updatedCartList) : [];
      rows[0].cartList = cartList;
      return res.status(200).json(rows[0]);
    } catch (parseError: any) {
      console.error("Error parsing cart list:", parseError.message);
      return res.status(400).json({ error: "Invalid cart list format" });
    }
  } catch (error: any) {
    console.error("Error fetching cart items:", error.message);
    return res.status(500).json({ error: "An error occurred while fetching products" });
  }
});

// Route to update the cart
router.put("/CartUpdate", (req: Request, res: any) => {
  try {
    const deleteQuery = "DELETE FROM cart WHERE username = ? AND user_id = ?";
    db.prepare(deleteQuery).run(req.body.username, req.body.user_id);

    const insertQuery = "INSERT INTO cart (username, user_id, cartList) VALUES (?, ?, ?)";
    db.prepare(insertQuery).run(req.body.username, req.body.user_id, JSON.stringify(req.body.cartList));

    console.log(req.body);
    return res.status(201).json({ message: "Cart updated successfully" });
  } catch (error: any) {
    console.error("Error updating cart:", error.message);
    return res.status(500).json({ error: "An error occurred while updating cart" });
  }
});

export default router;
