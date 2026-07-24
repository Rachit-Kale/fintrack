const mongoose = require("mongoose");


const transactionSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        rawSmsText: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required:true,
            default: 0,
            index: true
        },
        merchantName: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            enum: ['FOOD', 'GROCERIES', 'SHOPPING', 'TRANSPORT', 'UTILITIES', 'UNKNOWN'],
            default: 'UNKNOWN'
        }
    },
    {
        transactionTimestamp: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);