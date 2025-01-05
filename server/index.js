import authRouter from './author.js';
import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';
import crypto from 'crypto';
import mysql from 'mysql';
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'payment'
});
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEYID,
      key_secret: process.env.RAZORPAY_KEYSECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEYSECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "failed" });
  }
  function storePayment(orderId, paymentId, message,status) {
    const query = 'INSERT INTO payment (order_id, payment_id, message,status) VALUES (?, ?, ?, ?)';
    connection.query(query, [orderId, paymentId, message,status], (err, results) => {
      if (err) {
        console.error('Error inserting payment information:', err.stack);
        return;
      }
      console.log('Payment information stored successfully:', results);
    });
  }
  if (digest !== razorpay_signature) { 
    storePayment('', '', 'failed', 0); 
    res.json({
      msg: "failed",
      orderId: "failed",
      paymentId: "failed",
      status:0
    });
    return res.status(400).json({ msg: "failed", orderId: "failed", paymentId: "failed", status:0});
    } 
  storePayment(razorpay_order_id, razorpay_payment_id, 'success',1);
  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    status:1
  });
});
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));
app.use(express.json());
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  console.log("req.body");
});
app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
process.on('SIGINT', () => {
  connection.end(err => {
    if (err) {
      console.error('Error closing the database connection:', err.stack);
    }
    console.log('Database connection closed.');
    process.exit();
  });
});
