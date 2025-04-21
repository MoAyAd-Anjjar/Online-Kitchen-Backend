import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import multer from "multer";
import UserRouter from "./Route/User";
import FoodRouter from "./Route/Food";
import CartRouter from "./Route/Cart";
import cors from "cors";
import bodyParser from "body-parser";
// import Stripe from "stripe";

dotenv.config();
const app: Express = express();

// // Stripe Setup
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);



app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/User", UserRouter);
app.use("/Food", FoodRouter);
app.use("/Cart", CartRouter);
app.use("/uploads", express.static("uploads"));

// Stripe Payment Route

// app.post('/create-payment-intent', async (req, res) => {
//   const { amount } = req.body;
  
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount:  100, // amount in cents
//     currency: 'usd',
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send(`Welcome to ${process.env.BASE_URL} Backend!`);
});

app.listen(port, () => {
  console.log(`🗄️ Backend running on 🚪 ${port} 💻`);
});
