const express = require("express");
const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../../.env")});
const apiRoutes = require("./routes/api.js")

const app = express();

const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db.js");

app.use(express.json());

connectDB();

//Mounting Router
app.use("/api/v1", apiRoutes)

app.listen(PORT, (err) => {
    err ? console.log("== ERROR STARTING SERVER ==", err) : console.log("Server Started on PORT:",PORT)
})