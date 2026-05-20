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

/**
 * Middleware that runs AFTER multer uploads the raw file.
 * Creates two optimized variants:
 *  - thumbnail  (400px wide, ~20-50KB)  → for grid views, modals, previews
 *  - optimized  (1800px wide, ~200-400KB) → for PDF generation (still high quality)
 * The original file is kept but never served to the browser directly.
 */
async function optimizeImage(req, res, next) {
  if (!req.file) return next();

  const ext = path.extname(req.file.filename);
  const baseName = path.basename(req.file.filename, ext);
  const originalPath = req.file.path;

  try {
    const image = sharp(originalPath);
    const metadata = await image.metadata();

    // ── Thumbnail (for UI grid views) ──
    const thumbFilename = `${baseName}_thumb.webp`;
    const thumbPath = path.join(thumbDir, thumbFilename);

    await sharp(originalPath)
      .resize({
        width: 500,
        height: 500,
        fit: 'inside',           // preserve aspect ratio, never crop
        withoutEnlargement: true // don't upscale small images
      })
      .webp({ quality: 75 })
      .toFile(thumbPath);

    // ── Optimized (for PDF / detail view — high quality but compressed) ──
    const optimizedFilename = `${baseName}_optimized.webp`;
    const optimizedPath = path.join(optimizedDir, optimizedFilename);

    // For PDF we need good quality but don't need 8000x6000px raw camera images
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

    // Attach the generated paths to the request for the route handler
    req.optimizedImages = {
      thumbnail: `/uploads/thumbnails/${thumbFilename}`,
      optimized: `/uploads/optimized/${optimizedFilename}`,
      original: `/uploads/${req.file.filename}`,
    };

    // Log size savings
    const originalSize = fs.statSync(originalPath).size;
    const thumbSize = fs.statSync(thumbPath).size;
    const optimizedSize = fs.statSync(optimizedPath).size;
    console.log(
      `[ImageOptimizer] ${req.file.originalname}: ` +
      `Original=${(originalSize / 1024 / 1024).toFixed(1)}MB → ` +
      `Thumb=${(thumbSize / 1024).toFixed(0)}KB, ` +
      `Optimized=${(optimizedSize / 1024).toFixed(0)}KB`
    );

    next();
  } catch (err) {
    console.error('[ImageOptimizer] Failed to optimize image:', err.message);
    // Don't fail the upload — just skip optimization
    req.optimizedImages = {
      thumbnail: `/uploads/${req.file.filename}`,
      optimized: `/uploads/${req.file.filename}`,
      original: `/uploads/${req.file.filename}`,
    };
    next();
  }
}

module.exports = { optimizeImage };
