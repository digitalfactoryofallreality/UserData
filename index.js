const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. DATABASE MODELS
const UserSchema = new mongoose.Schema({
    email: String,
    name: String,
    age: Number,
    otp: String,
    isVerified: { type: Boolean, default: false },
    friends: [String], // Doston ki emails yahan save hongi
    balance: { type: Number, default: 0 } // + matlab lene hain, - matlab dene hain
});
const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String // 'Snack' or 'Drink'
});
const Product = mongoose.model('Product', ProductSchema);

// 2. EMAIL SETUP (Nodemailer)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'Aapki_Email@gmail.com', // Apna Gmail yahan
        pass: 'jilccetpyeftsllo'      // Aapka App Password
    }
});

// 3. ROUTES
// A. OTP Bhejna
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await User.findOneAndUpdate({ email }, { otp }, { upsert: true });
    try {
        await transporter.sendMail({
            from: 'Snack Manager',
            to: email,
            subject: 'Login OTP',
            text: `Aapka code hai: ${otp}`
        });
        res.json({ message: "OTP Bhej diya!" });
    } catch (err) { res.status(500).json(err); }
});

// B. Verify OTP aur Profile Banana
app.post('/verify-and-setup', async (req, res) => {
    const { email, otp, name, age } = req.body;
    const user = await User.findOne({ email, otp });
    if (user) {
        user.name = name;
        user.age = age;
        user.isVerified = true;
        user.otp = ""; // OTP clear karein
        await user.save();
        res.json({ success: true, message: "Account Ready!" });
    } else {
        res.status(400).json({ message: "Galat OTP" });
    }
});

// C. Admin: Snacks Add Karna
app.post('/admin/add-item', async (req, res) => {
    const { name, price, category } = req.body;
    const item = new Product({ name, price, category });
    await item.save();
    res.json({ message: "Snack Added!" });
});

// D. View All Snacks
app.get('/items', async (req, res) => {
    const items = await Product.find();
    res.json(items);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server started!`));
