const Transaction = require("../models/Transactions");
const { parseSmsWithGemini } = require("../services/geminiService");

const receiveSms = async (req, res) => {
    try {
        const { senderId, messageBody } = req.body;

        // 1. Basic Payload Validation
        if (!messageBody || typeof messageBody !== "string" || messageBody.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Invalid payload: 'messageBody' is required and must be a non-empty string.",
            });
        }

        // 2. Safety Filter: Catch OTPs & Security terms
        const sensitivePatterns = [
            /\botp\b/i,
            /one time password/i,
            /verification code/i,
            /auth code/i,
            /secret code/i,
            /login code/i,
        ];

        const isSensitive = sensitivePatterns.some((pattern) => pattern.test(messageBody));

        if (isSensitive) {
            return res.status(400).json({
                success: false,
                error: "Message rejected: Sensitive or non-financial content detected (OTP/Auth Code).",
            });
        }

        // 3. Authenticated User attached by auth middleware
        const user = req.user;

        // 4. Parse SMS using Gemini AI
        const parsedFinancials = await parseSmsWithGemini(messageBody);

        // If Gemini could not extract a valid amount (> 0), don't log as transaction
        if (!parsedFinancials || parsedFinancials.amount <= 0) {
            return res.status(200).json({
                success: true,
                message: "SMS analyzed but no valid debit transaction detected.",
                data: parsedFinancials
            });
        }

        // 5. Save to Database
        const transaction = await Transaction.create({
            userID: user._id,
            rawSmsText: messageBody,
            amount: parsedFinancials.amount,
            merchantName: parsedFinancials.merchantName,
            category: parsedFinancials.category,
            transactionTimestamp: new Date()
        });

        return res.status(201).json({
            success: true,
            message: "Transaction parsed and logged successfully.",
            data: transaction,
        });
    } catch (error) {
        console.error("Error in receiveSms:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error while processing webhook.",
        });
    }
};

module.exports = { receiveSms };