const parseSmsStatic = (rawSmsText) => {
    if (!rawSmsText || typeof rawSmsText !== 'string') {
        return { amount: 0, merchantName: "UNKNOWN", category: "UNKNOWN" };
    }

    const amountRegex = /(?:rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/i;
    const amountMatch = rawSmsText.match(amountRegex);
    let amount = 0;

    if (amountMatch && amountMatch[1]) {
        amount = parseFloat(amountMatch[1].replace(/,/g, ""));
    }

    const merchantRegex = /(?:at|to|vpa)\s+([a-zA-Z0-9\s&'-]+?)(?=\s+(?:on|ref|via|avail|bal|using|a\/c|\.|$))/i;
    const merchantMatch = rawSmsText.match(merchantRegex);
    let merchantName = "UNKNOWN"

    if (merchantMatch && merchantMatch) {
        merchantName = merchantMatch[1].trim();
    }

    let category = "UNKNOWN";
    const lowerMerchant = merchantName.toLowerCase();
    const lowerText = rawSmsText.toLowerCase();

    if (/swiggy|zomato|chai|coffee|restaurant|kfc|mcdonald|food/i.test(lowerMerchant + lowerText)) {
        category = "FOOD";
    } else if (/blinkit|zepto|instamart|dmart|grocery|supermarket/i.test(lowerMerchant + lowerText)) {
        category = "GROCERIES";
    } else if (/uber|ola|rapido|metro|fuel|petrol/i.test(lowerMerchant + lowerText)) {
        category = "TRANSPORT";
    } else if (/amazon|flipkart|myntra|zara/i.test(lowerMerchant + lowerText)) {
        category = "SHOPPING";
    } else if (/electricity|bill|recharge|jio|airtel/i.test(lowerMerchant + lowerText)) {
        category = "UTILITIES";
    }

    return {
        amount: isNaN(amount) ? 0 : amount,
        merchantName,
        category
    };
};

module.exports = {parseSmsStatic}