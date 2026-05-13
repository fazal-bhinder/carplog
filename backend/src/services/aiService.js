const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateCarpetDescription(imageUrl) {
  try {
    const imageBuffer = await fetch(imageUrl).then(r => r.arrayBuffer());
    const base64 = Buffer.from(imageBuffer).toString('base64');
    const ext = imageUrl.split('.').pop().toLowerCase();
    const mediaType = ext === 'png' ? 'image/png' : 'image/jpeg';

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: `You are a carpet product expert writing for a retail catalog.
Analyze this carpet image and write a compelling product description.
Include: pattern style, dominant colors, texture feel, likely material,
ideal room placement (living room / bedroom / hallway etc.), and a
2-sentence persuasive sales pitch. Keep total response under 120 words.
Return only the description text, no headings or labels.` }
        ]
      }]
    });
    return response.content[0].text;
  } catch (error) {
    console.error('Error generating description:', error);
    throw new Error('Failed to generate description');
  }
}

module.exports = { generateCarpetDescription };
