const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
    {
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    dailyBudgetCap: {
        type: Number,
        required: true,
        default: 500
    },
    currentStreakDays: {
        type: Number,
        required: true,
        default: 0
    },
    totalXp: {
        type: Number,
        default: 0,
    },
    devicePairingToken: {
        type: String,
        required: true,
        unique: true,
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("User", userSchema);