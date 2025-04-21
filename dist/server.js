"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("./Route/User"));
const Food_1 = __importDefault(require("./Route/Food"));
const Cart_1 = __importDefault(require("./Route/Cart"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
// import Stripe from "stripe";
dotenv_1.default.config();
const app = (0, express_1.default)();
// // Stripe Setup
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*", credentials: true }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use("/User", User_1.default);
app.use("/Food", Food_1.default);
app.use("/Cart", Cart_1.default);
app.use("/uploads", express_1.default.static("uploads"));
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
