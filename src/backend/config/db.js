const mongoose = require("mongoose");
const path = require("path")

require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });


const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log("MongoDB Connected Successfully!!"))
        .catch((err) => console.log("== ERROR IN CONNECTION TO DB ==", err))
}

module.exports = connectDB;