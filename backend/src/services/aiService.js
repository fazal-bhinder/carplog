const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with Gemini API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCarpetDescription(imageUrl) {
  try {
    // Handle local/relative URLs
    let fullUrl = imageUrl;
    if (imageUrl.startsWith('/')) {
      fullUrl = `http://localhost:5001${imageUrl}`;
    }

    const imageResponse = await fetch(fullUrl);
    const buffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    
    // Determine mime type
    const ext = imageUrl.split('.').pop().toLowerCase();
    const mimeType = (ext === 'png') ? 'image/png' : 'image/jpeg';

    console.log(`Generating description for image via Google Gemini (gemini-1.5-flash)...`);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a luxury carpet product expert writing for a high-end retail catalog.
Analyze this carpet image and write a compelling product description.
Include: pattern style, dominant colors, texture feel, likely material, ideal room placement (living room / bedroom / hallway etc.), and a 2-sentence persuasive sales pitch. Keep total response under 120 words. Return only the description text, no headings or labels.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating description with Gemini:', error);
    throw new Error('Failed to generate description');
  }
}

module.exports = { generateCarpetDescription };
