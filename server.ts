import dotenv from "dotenv";
import express, { Express } from "express";
import multer from "multer";
import UserRouter from "./Route/User";
import FoodRouter from "./Route/Food";
import CartRouter from "./Route/Cart";
import cors from "cors";
import bodyParser from "body-parser";
dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.urlencoded({ extended: true }));  
app.use(bodyParser.json());
app.use("/User", UserRouter);
app.use("/Food", FoodRouter);
app.use("/Cart", CartRouter);
app.use("/uploads", express.static("uploads"));


const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send(`Welcome to ${process.env.BASE_URL} Backend!`);
});
app.listen(port, () => {
  console.log(`🗄️ 🗄️ 🗄️ ─•──── on 🚪 ${port} ` + "💻");
});
