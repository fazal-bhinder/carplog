const Replicate = require('replicate');

// Initialize inside function to ensure env variable is read if not set at module load
function getReplicate() {
  return new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
}

async function upscaleImage(imageUrl) {
  try {
    const replicate = getReplicate();
    const output = await replicate.run(
      'nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b',
      { input: { image: imageUrl, scale: 4, face_enhance: false } }
    );
    return output; // Replicate might return array or stream depending on version, usually output or output[0]
  } catch (error) {
    console.error('Error upscaling image:', error);
    throw new Error('Failed to upscale image');
  }
}

module.exports = { upscaleImage };
