const express = require("express");
const path = require("path");
const cors = require('cors');
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const apiRoutes = require("./routes/api.js")

const app = express();

const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db.js");

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow your React Vite dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom auth headers
    credentials: true
}));

app.use(express.json());

connectDB();

//Mounting Router
app.use("/api/v1", apiRoutes)

app.listen(PORT, (err) => {
    err ? console.log("== ERROR STARTING SERVER ==", err) : console.log("Server Started on PORT:", PORT)
})