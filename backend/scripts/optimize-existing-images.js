/**
 * One-time migration script: Generate thumbnails and optimized versions
 * for all existing uploaded images that don't have them yet.
 * 
 * Run with: node scripts/optimize-existing-images.js
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const thumbDir = path.join(uploadDir, 'thumbnails');
const optimizedDir = path.join(uploadDir, 'optimized');

// Ensure directories exist
[thumbDir, optimizedDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function optimizeExistingImages() {
  const files = fs.readdirSync(uploadDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && !f.startsWith('.');
  });

  console.log(`Found ${files.length} images to process...`);
  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const originalPath = path.join(uploadDir, file);

    const thumbPath = path.join(thumbDir, `${baseName}_thumb.webp`);
    const optimizedPath = path.join(optimizedDir, `${baseName}_optimized.webp`);

    // Skip if already processed
    if (fs.existsSync(thumbPath) && fs.existsSync(optimizedPath)) {
      skipped++;
      continue;
    }

    try {
      const originalSize = fs.statSync(originalPath).size;
      const metadata = await sharp(originalPath).metadata();

      // Thumbnail
      if (!fs.existsSync(thumbPath)) {
        await sharp(originalPath)
          .resize({
            width: 500,
            height: 500,
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 75 })
          .toFile(thumbPath);
      }

      // Optimized
      if (!fs.existsSync(optimizedPath)) {
        const maxPdfWidth = 2400;
        const needsResize = metadata.width > maxPdfWidth;

        await sharp(originalPath)
          .resize(needsResize ? {
            width: maxPdfWidth,
            fit: 'inside',
            withoutEnlargement: true
          } : undefined)
          .webp({ quality: 85 })
          .toFile(optimizedPath);
      }

      const thumbSize = fs.statSync(thumbPath).size;
      const optimizedSize = fs.statSync(optimizedPath).size;

      console.log(
        `[${processed + 1}/${files.length}] ${file}: ` +
        `${(originalSize / 1024 / 1024).toFixed(1)}MB → ` +
        `thumb: ${(thumbSize / 1024).toFixed(0)}KB, ` +
        `optimized: ${(optimizedSize / 1024).toFixed(0)}KB`
      );
      processed++;
    } catch (err) {
      console.error(`[FAILED] ${file}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone! Processed: ${processed}, Skipped: ${skipped}, Failed: ${failed}`);

  // Now update the database
  console.log('\nUpdating database records...');
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const products = await prisma.product.findMany({
      where: {
        imageUrl: { not: null },
        thumbnailUrl: null,
      }
    });

    console.log(`Found ${products.length} products needing thumbnail URLs...`);

    for (const product of products) {
      const imageUrl = product.imageUrl;
      // Extract the filename from the imageUrl (e.g., /uploads/12345-67890.jpg)
      const filename = path.basename(imageUrl);
      const ext = path.extname(filename);
      const baseName = path.basename(filename, ext);

      const thumbFile = `${baseName}_thumb.webp`;
      const optimizedFile = `${baseName}_optimized.webp`;

      const thumbExists = fs.existsSync(path.join(thumbDir, thumbFile));
      const optimizedExists = fs.existsSync(path.join(optimizedDir, optimizedFile));

      if (thumbExists) {
        const updateData = {
          thumbnailUrl: `/uploads/thumbnails/${thumbFile}`,
        };
        
        // Also update imageUrl to optimized version if available
        if (optimizedExists) {
          updateData.imageUrl = `/uploads/optimized/${optimizedFile}`;
        }

        await prisma.product.update({
          where: { id: product.id },
          data: updateData,
        });

        console.log(`Updated product ${product.id}: ${product.name}`);
      }
    }

    await prisma.$disconnect();
    console.log('Database update complete!');
  } catch (err) {
    console.error('Database update failed:', err.message);
  }
}

optimizeExistingImages();
