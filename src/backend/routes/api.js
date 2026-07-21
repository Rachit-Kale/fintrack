const express = require("express");
const router = express.Router();

const protectDevice = require("../middleware/auth");
const { receiveSms } = require("../controllers/webhookController");
const { getTransactions, getMicroDrainStats } = require("../controllers/analyticsController");

// 1. Webhook endpoint (SMS Ingestion)
router.post("/webhook/sms", protectDevice, receiveSms);

// 2. Transaction Feed
router.get("/transactions", protectDevice, getTransactions);

// 3. Analytics & Micro-drain Widget Data
router.get("/analytics/micro-drain", protectDevice, getMicroDrainStats);

module.exports = router;