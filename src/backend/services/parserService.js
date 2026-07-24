/**
 * Static Regex Parser for Bank SMS Messages
 * Supports multi-line HDFC Bank messages, single-line SMS, and common Indian formats.
 */
const parseSmsStatic = (rawSmsText) => {
    if (!rawSmsText || typeof rawSmsText !== "string") {
        return { amount: 0, merchantName: "UNKNOWN", category: "UNKNOWN" };
    }

    const cleanText = rawSmsText.trim();

    // 1. Extract Amount (Matches "Sent Rs.1.00", "Rs 1,200.00", "INR 80.00", "Rs.1.00")
    const amountRegex = /(?:sent\s+|paid\s+|debited\s+)?(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i;
    const amountMatch = cleanText.match(amountRegex);
    let amount = 0;

    if (amountMatch && amountMatch[1]) {
        // Remove commas from formatted numbers like "1,200.00" -> "1200.00"
        amount = parseFloat(amountMatch[1].replace(/,/g, ""));
    }

    // 2. Extract Merchant / Recipient Name
    let merchantName = "UNKNOWN";

    // Check Pattern A: Explicit "To <Recipient>" format (common in HDFC multi-line messages)
    const explicitToRegex = /To\s+([^\n\r]+?)(?=\s*(?:\r?\n|On|Ref|via|using|a\/c|\.|$))/i;
    const explicitToMatch = cleanText.match(explicitToRegex);

    if (explicitToMatch && explicitToMatch[1]) {
        merchantName = explicitToMatch[1].trim();
    } else {
        // Check Pattern B: Inline "at <Merchant>" or "vpa <Merchant>"
        const inlineMerchantRegex = /(?:at|vpa)\s+([a-zA-Z0-9\s&'-]+?)(?=\s+(?:on|ref|via|avail|bal|using|a\/c|\.|$))/i;
        const inlineMatch = cleanText.match(inlineMerchantRegex);
        if (inlineMatch && inlineMatch[1]) {
            merchantName = inlineMatch[1].trim();
        }
    }

    // 3. Categorize based on Merchant Keywords & Raw SMS text
    let category = "UNKNOWN";
    const searchString = (merchantName + " " + cleanText).toLowerCase();

    if (/swiggy|zomato|chai|coffee|restaurant|kfc|mcdonald|food/i.test(searchString)) {
        category = "FOOD";
    } else if (/blinkit|zepto|instamart|dmart|grocery|supermarket/i.test(searchString)) {
        category = "GROCERIES";
    } else if (/uber|ola|rapido|metro|fuel|petrol/i.test(searchString)) {
        category = "TRANSPORT";
    } else if (/amazon|flipkart|myntra|zara/i.test(searchString)) {
        category = "SHOPPING";
    } else if (/electricity|bill|recharge|jio|airtel/i.test(searchString)) {
        category = "UTILITIES";
    } else if (/ali rale|transfer|upi/i.test(searchString)) {
        category = "TRANSFER"; // Added category for direct person-to-person transfers
    }

    return {
        amount: isNaN(amount) ? 0 : amount,
        merchantName,
        category
    };
};

module.exports = { parseSmsStatic };