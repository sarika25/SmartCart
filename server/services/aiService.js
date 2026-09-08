const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeShoppingRequest(
  message,
  conversationHistory = [],
  previousRequirements = null,
) {
  const historyText = conversationHistory
    .map(
      (item) =>
        `${item.role === "user" ? "Customer" : "SmartCart AI"}: ${item.text}`,
    )
    .join("\n");

  const previousRequirementsText = previousRequirements
    ? JSON.stringify(previousRequirements)
    : "None";

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",

    contents: `
You are SmartCart AI.

Your job is to extract shopping information ONLY from the customer's
CURRENT message.

The backend will handle previous conversation requirements and merge them.

====================================================
PREVIOUS REQUIREMENTS
====================================================

${previousRequirementsText}

====================================================
CONVERSATION HISTORY
====================================================

${historyText}

====================================================
CURRENT CUSTOMER MESSAGE
====================================================

${message}

====================================================
DEPARTMENT
====================================================

Identify the broad shopping department ONLY if the CURRENT message
contains enough information to identify it.

Possible departments:

- Electronics
- Beauty
- Fashion
- Home
- Mobiles
- Appliances
- Toys
- Baby Care
- Grocery
- Sports
- Furniture
- Books
- Media
- Health Care

Examples:

"phone" → department = "Electronics"

"mobile" → department = "Electronics"

"smartphone" → department = "Electronics"

"headphones" → department = "Electronics"

"facewash" → department = "Beauty"

"lipstick" → department = "Beauty"

"shoes" → department = "Fashion"

"book" → department = "Books"

====================================================
PRODUCT TYPE
====================================================

Identify the specific product type ONLY if the CURRENT message
contains a product.

Use these standard product types:

mobile → productType "phone", department "Mobiles"

smartphone → productType "phone", department "Mobiles"

phone → productType "phone", department "Mobiles"

headphones → "headphones"

laptop → "laptop"

mouse → "mouse"

keyboard → "keyboard"

facewash → "facewash"

face wash → "facewash"

moisturizer → "moisturizer"

serum → "serum"

lipstick → "lipstick"

shoes → "shoes"

running shoes → "shoes"

shirt → "shirt"

jeans → "jeans"

book → "book"

rice → "rice"

IMPORTANT:

Never use a broad department as productType.

For example:

WRONG:
productType = "Electronics"

CORRECT:
productType = "phone"

====================================================
BUDGET
====================================================

Extract budget ONLY from the CURRENT message.

Examples:

"under 30000"
→ maxBudget = 30000

"below ₹30000"
→ maxBudget = 30000

"less than 30000"
→ maxBudget = 30000

"above 70000"
→ minBudget = 70000

"over ₹70000"
→ minBudget = 70000

"between 30000 and 50000"
→ minBudget = 30000
→ maxBudget = 50000

If the CURRENT message contains no budget:

minBudget = null
maxBudget = null

IMPORTANT:

If the customer says only:

"40000"

interpret it as:

maxBudget = 40000

====================================================
FEATURES
====================================================

Extract features ONLY if they are present in the CURRENT message.

Examples:

"good camera"
→ ["good camera"]

"wireless"
→ ["wireless"]

"noise cancellation"
→ ["noise cancellation"]

"long battery"
→ ["long battery"]

====================================================
USE CASE
====================================================

Extract use case ONLY if present in the CURRENT message.

Examples:

office
gaming
coding
study
travel
music
movies
fitness

====================================================
BRAND
====================================================

Extract brand ONLY if present in the CURRENT message.

Examples:

Samsung
Apple
OnePlus
Sony
Nike
Adidas

====================================================
IMPORTANT RULE
====================================================

DO NOT merge previous requirements into your response.

Only extract what the CURRENT customer message says.

The backend will merge the current information with previous information.

For example:

Previous requirements:

{
  "department": "Electronics",
  "productType": "phone"
}

Current message:

"40000"

Return:

{
  "department": null,
  "productType": null,
  "minBudget": null,
  "maxBudget": 40000,
  "features": [],
  "useCase": null,
  "brand": null,
  "intent": "refine",
  "missingInformation": [],
  "nextQuestion": null
}

DO NOT return:

productType = "phone"

because that information came from the previous requirements.

The backend will add it later.

====================================================
ANOTHER EXAMPLE
====================================================

Current message:

"smartphone"

Return:

{
  "department": "Electronics",
  "productType": "phone",
  "minBudget": null,
  "maxBudget": null,
  "features": [],
  "useCase": null,
  "brand": null,
  "intent": "refine",
  "missingInformation": [],
  "nextQuestion": null
}

====================================================
NO INVENTED INFORMATION
====================================================

Do not invent:

- product type
- department
- budget
- features
- use case
- brand

Only extract information supported by the CURRENT message.

====================================================
OUTPUT
====================================================

Return ONLY valid JSON.

Use exactly this structure:

{
  "department": null,
  "productType": null,
  "minBudget": null,
  "maxBudget": null,
  "features": [],
  "useCase": null,
  "brand": null,
  "intent": "general",
  "missingInformation": [],
  "nextQuestion": null
}
`,
  });

  return response.text;
}

module.exports = {
  analyzeShoppingRequest,
};
