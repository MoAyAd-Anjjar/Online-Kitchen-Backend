import { Router, Request, Response, ErrorRequestHandler } from "express";
import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import { IUser } from "../Types";
const router: Router = Router();
const db = new Database("./Kitchen.db");

// Route to get users

router.post("/CreateUser", async (req: Request, res: Response | any) => {
  try {
    const {
      username,
      password,
      email,
      userid,
      phone,
      uservalidateanswer,
      role,
    } = req.body;

    // Input validation (you can expand on this as needed)
    if (!username || !password || !email || !userid || !phone) {
      res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const Userquery = db.prepare(
      "SELECT * FROM Users WHERE username =? AND email =?"
    );
    if (Userquery) {
      const users = Userquery.all(username, email);
      if (users.length > 0) {
        return res.sendStatus(209).end();
      }
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const query = db.prepare(
      "INSERT INTO Users (username, password, email, userid, phone, uservalidateanswer, role) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    query.run(
      username,
      hashedPassword,
      email,
      userid,
      phone,
      uservalidateanswer || "",
      role
    );

    return res.status(201).json({ message: "User Created Successfully" });
  } catch (err: any) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ error: "An error occurred while creating user" });
  }
});





router.get("/GetUser", async (req: Request, res: any) => {
  const { username, password, email } = req.query;

  try {
    // Validate that username, password, and email are provided
    if (!username || !password || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = db.prepare(
      "SELECT * FROM Users WHERE username =? AND email =?"
    );
    const users = query.all(username, email);

    // If no user is found, return a 401 (Unauthorized)
    if (users.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if the password matches the hashed password in the database
    const user: any = users[0]; // Assuming we only expect one result based on username and email
    const isPasswordValid = await bcrypt.compare(password as string, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If user and password match, return the user details
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "An error occurred while fetching user" });
  }
});

export default router;
