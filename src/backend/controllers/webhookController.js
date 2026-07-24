const Transaction = require("../models/Transactions");
const { parseSmsStatic } = require("../services/parserService"); // Static parser import

const receiveSms = async (req, res) => {
    try {
        const { senderId, messageBody } = req.body;

        
        if (!messageBody || typeof messageBody !== "string" || messageBody.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Invalid payload: 'messageBody' is required and must be a non-empty string.",
            });
        }

        
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

        
        const user = req.user;

        
        const parsedFinancials = parseSmsStatic(messageBody);

        
        if (!parsedFinancials || parsedFinancials.amount <= 0) {
            return res.status(200).json({
                success: true,
                message: "SMS analyzed statically but no valid spend amount detected.",
                data: parsedFinancials
            });
        }

        
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
            message: "Transaction parsed via static logic and saved.",
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