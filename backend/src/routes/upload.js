const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { optimizeImage } = require('../middleware/imageOptimizer');

router.post('/image', upload.single('image'), optimizeImage, (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const images = req.optimizedImages || {
      thumbnail: `/uploads/${req.file.filename}`,
      optimized: `/uploads/${req.file.filename}`,
      original: `/uploads/${req.file.filename}`,
    };

    // Return the optimized URL as the main imageUrl (used for PDF)
    // and the thumbnail URL for fast UI rendering
    res.json({
      success: true,
      data: {
        imageUrl: images.optimized,
        thumbnailUrl: images.thumbnail,
        originalUrl: images.original,
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
