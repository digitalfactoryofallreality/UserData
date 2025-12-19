app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
        // Pehle database check karein
        await User.findOneAndUpdate({ email }, { otp }, { upsert: true });

        // Mail bhejne ki koshish karein
        let info = await transporter.sendMail({
            from: '"Snack Manager" <Aapki_Email@gmail.com>', 
            to: email,
            subject: 'Login OTP',
            text: `Aapka code hai: ${otp}`
        });

        console.log("Email sent: " + info.response);
        res.json({ message: "OTP Bhej diya!" });

    } catch (err) {
        console.error("Email Error:", err); // Ye error Render ke logs mein dikhega
        res.status(500).json({ error: "Email nahi gaya", details: err.message });
    }
});
