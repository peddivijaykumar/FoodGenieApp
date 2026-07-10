const axios = require("axios");

exports.generateDishDescription = async ({
  name,
  category,
  spiceLevel,
  price,
}) => {
  const prompt = `
You are a professional food classification assistant.

Generate ONLY valid JSON.
No markdown.
No explanation text.

IMPORTANT RULES:
- Tags must be accurate restaurant-style tags
- Do NOT misclassify dishes
- Do NOT label main courses as desserts
- Allergens must be realistic
- Serves must be realistic (1 or 2)
- bestFor must be meal timings only

Dish Name: ${name}
Category: ${category}
Spice Level: ${spiceLevel}
Base Price: ${price}

Return JSON in this EXACT format:
{
  "description": "string",
  "tags": ["string"],
  "allergens": ["string"],
  "serves": "string",
  "bestFor": ["string"]
}
`;

  // If no GROQ_API_KEY provided, return a mock response to keep dev workflow fast.
  if (!process.env.GROQ_API_KEY) {
    return {
      description: `${name} is a delicious ${category.toLowerCase()} dish with ${spiceLevel} spice, priced at ${price}.`,
      tags: [category, spiceLevel, "chef-special"],
      allergens: ["none"],
      serves: "1",
      bestFor: ["lunch"],
    };
  }
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (err) {
    console.error("GROQ API call failed, falling back to mock:", err.response?.status || err.message);
    // Fallback mock
    return {
      description: `${name} is a delicious ${category.toLowerCase()} dish with ${spiceLevel} spice, priced at ${price}.`,
      tags: [category, spiceLevel, "chef-special"],
      allergens: ["none"],
      serves: "1",
      bestFor: ["lunch"],
    };
  }
};