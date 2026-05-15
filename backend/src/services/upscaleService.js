const { InferenceClient } = require("@huggingface/inference");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Use the token user provided in REPLICATE_API_TOKEN as instructed
const hf = new InferenceClient(process.env.REPLICATE_API_TOKEN);

async function upscaleImage(product) {
  try {
    // PRE-WRITTEN PROMPT for luxury carpet enhancement
    const prompt = `A professional, high-end editorial interior design photograph of the "${product.name}" carpet. ${product.description ? `The carpet design features ${product.description}.` : ''} The carpet is the absolute central focus, laid perfectly flat on a clean, premium luxury hardwood floor in a sun-drenched, modern minimalist high-end living room. Cinematic and warm lighting, soft atmospheric shadows, extreme sharp focus on the intricate textile weave, fiber details, and vibrant rich colors. 8k resolution, photorealistic, architectural digest style, stunning texture, luxury home staging.`;

    console.log(`Generating enhanced image for: ${product.name}...`);

    const response = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
      parameters: {
        num_inference_steps: 4, 
      },
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Generate unique filename
    const fileName = `enhanced-${uuidv4()}.png`;
    const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
    const filePath = path.join(uploadDir, fileName);

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    // Return the relative URL for frontend use
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Error generating enhanced image with FLUX:', error);
    throw new Error('Failed to generate enhanced image');
  }
}

module.exports = { upscaleImage };
