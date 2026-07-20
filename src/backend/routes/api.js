const express = require("express");

const router = express.Router();

router
// Placeholders ONLY with Temporary FUNCTION
.get("/webhook/sms", (req,res) => {
    return res.status(200).json({test: "Testing Server-GET", status: "Webhook Endpoint placeholder"})
})
.post("/transactions", (req,res) => {
    return res.status(200).json({test: "Testing Server-POST", status: "Transaction Endpoint placeholder"})
})


module.exports = router;