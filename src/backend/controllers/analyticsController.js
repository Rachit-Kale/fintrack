const Transaction = require("../models/Transactions");

/**
 * Get all transactions for the logged-in user.
 * Route: GET /api/v1/transactions
 */
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userID: req.user._id })
            .sort({ transactionTimestamp: -1 })
            .limit(20);

        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch transactions." });
    }
};

/**
 * Get micro-drain statistics (transactions <= ₹100 over trailing 30 days).
 * Route: GET /api/v1/analytics/micro-drain
 */
const getMicroDrainStats = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const microDrainData = await Transaction.aggregate([
            {
                $match: {
                    userID: req.user._id,
                    amount: { $lte: 100 },
                    transactionTimestamp: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalSpent: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const grandTotal = microDrainData.reduce((acc, curr) => acc + curr.totalSpent, 0);
        const totalCount = microDrainData.reduce((acc, curr) => acc + curr.count, 0);

        return res.status(200).json({
            success: true,
            data: {
                totalMicroDrainAmount: grandTotal,
                totalMicroTransactions: totalCount,
                breakdownByCategory: microDrainData
            }
        });
    } catch (error) {
        console.error("Error calculating micro-drain analytics:", error);
        return res.status(500).json({ success: false, error: "Failed to compute analytics." });
    }
};

module.exports = {
    getTransactions,
    getMicroDrainStats
};