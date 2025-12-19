const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Aapka MongoDB link
const dbURI = "mongodb+srv://UserData:Farhan808@userdata.ievetdl.mongodb.net/myDatabase?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log("✅ MongoDB Atlas Connected!"))
    .catch(err => console.log("❌ Connection Error:", err));

app.get('/', (req, res) => {
    res.send("Server online hai!");
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));