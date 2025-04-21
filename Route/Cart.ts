import { Router, Request, Response } from "express";
import Database from "better-sqlite3";
import { ICartType } from "../Types";
import { log } from "console";

const router: Router = Router();
const db = new Database("./Kitchen.db");

router.put("/CartUpdate", (req: Request, res: any) => {
 

  const query = "SELECT * FROM Cart WHERE username = ? AND userid = ?";
  const rows: any = db.prepare(query).all(req.body.username, req.body.userid);
  try {
    if (rows && req.body.username && req.body.userid) {
      const deleteQuery = "DELETE FROM Cart WHERE username = ? AND userid = ?";
      db.prepare(deleteQuery).run(req.body.username, req.body.userid);
      const insertQuery =
        "INSERT INTO Cart (username, userid, userList) VALUES (?, ?, ?)";
      db.prepare(insertQuery).run(
        req.body.username,
        req.body.userid,
        JSON.stringify(req.body.userList)
      );
    }

    return res.status(201).json({ message: "Cart updated successfully" });
  } catch (error: any) {
    console.error("Error updating cart:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while updating cart" });
  }
});

router.get("/CartList", (req: Request, res: Response) => {
  const query = "SELECT * FROM Cart WHERE username = ? AND userid = ?";
  const rows: any[] = db
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
  } else {
    res
      .status(200)
      .json({
        username: req.query.username,
        userid: req.query.userid,
        userList: [],
      });
  }
});
export default router;
