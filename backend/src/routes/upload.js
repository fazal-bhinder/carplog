const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');

router.post('/image', upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, data: { imageUrl } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
