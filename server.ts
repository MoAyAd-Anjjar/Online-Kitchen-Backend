import dotenv from "dotenv";
import express, { Express } from "express";
import multer from "multer";
import UserRouter from "./Route/User";
import FoodRouter from "./Route/Food";
import CartRouter from "./Route/Cart";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));  
app.use(bodyParser.json());
app.use("/User", UserRouter);
app.use("/Food", FoodRouter,express.static("Food"));
app.use("/Cart", CartRouter);



const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Welcome to 👩🏻‍🍳👩🏻‍🍳👩🏻‍🍳 Backend!");
});
app.listen(port, () => {
  console.log(`🗄️ 🗄️ 🗄️ ─•──── on 🚪 ${port} ` + "💻");
});
