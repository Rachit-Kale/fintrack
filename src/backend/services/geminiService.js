const { GoogleGenAI, Type } = require("@google/genai");

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Utility function to sleep for a given number of milliseconds
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calls an async function with exponential backoff retries.
 */
const callWithRetry = async (fn, maxRetries = 5, initialDelayMs = 3000) => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      
      // Don't retry if maximum retries reached
      if (attempt >= maxRetries) {
        console.error(`[Gemini API] Max retries (${maxRetries}) reached. Error:`, error.message);
        throw error;
      }

      // Calculate exponential delay (e.g. 1000ms, 2000ms, 4000ms...)
      const delay = initialDelayMs * Math.pow(2, attempt - 1);
      console.warn(`[Gemini API] Attempt ${attempt} failed (${error.message}). Retrying in ${delay}ms...`);
      
      await sleep(delay);
    }
  }
};

/**
 * Parses raw bank SMS text into a structured JSON object using Gemini with retry logic.
 * @param {string} rawSmsText 
 * @returns {Promise<{amount: number, merchantName: string, category: string}>}
 */
const parseSmsWithGemini = async (rawSmsText) => {
  try {
    // Wrap the API call in our custom retry helper
    return await callWithRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Extract the financial transaction details from this bank SMS message: "${rawSmsText}"`,
        config: {
          systemInstruction: `You are an expert Indian bank SMS financial parser. Extract the transaction amount, merchant or recipient name, and assign a category.
Allowed categories: 'FOOD', 'GROCERIES', 'SHOPPING', 'TRANSPORT', 'UTILITIES', 'UNKNOWN'.
If the merchant is unclear or missing, set merchantName to 'UNKNOWN'.
If amount is not found, set amount to 0.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER, description: "Total amount spent in INR" },
              merchantName: { type: Type.STRING, description: "Name of the merchant or store" },
              category: { 
                type: Type.STRING, 
                enum: ['FOOD', 'GROCERIES', 'SHOPPING', 'TRANSPORT', 'UTILITIES', 'UNKNOWN'] 
              }
            },
            required: ["amount", "merchantName", "category"]
          }
        }
      });

      const parsedData = JSON.parse(response.text);
      return parsedData;
    }, 3, 1000); // 3 total attempts, starting at 1000ms delay

  } catch (error) {
    console.error("Error in parseSmsWithGemini after retries:", error);
    // Safe fallback if all retries fail
    return {
      amount: 0,
      merchantName: "UNKNOWN",
      category: "UNKNOWN"
    };
  }
};

module.exports = { parseSmsWithGemini };