const prisma = require('../prisma/client');
const { generateCarpetDescription } = require('../services/aiService');
const { upscaleImage } = require('../services/upscaleService');

exports.getAllProducts = async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    const filter = categoryId ? { categoryId: parseInt(categoryId) } : {};
    const products = await prisma.product.findMany({
      where: filter,
      include: { category: true }
    });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true }
    });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, sku, price, offerPrice, categoryId, imageUrl } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        sku,
        price: parseFloat(price),
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        imageUrl
      }
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, sku, price, offerPrice, categoryId, imageUrl } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        description,
        sku,
        price: price ? parseFloat(price) : undefined,
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        imageUrl
      }
    });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, data: { message: 'Product deleted' } });
  } catch (error) {
    next(error);
  }
};

exports.enhanceProductImage = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product || !product.imageUrl) return res.status(400).json({ success: false, error: 'Product or image not found' });
    
    // Ensure the image URL is accessible by Replicate (it needs to be public, if local testing, this will fail unless exposed via ngrok)
    // For this prototype, we'll assume the imageUrl passed is somehow accessible or we handle it gracefully.
    
    const enhancedUrl = await upscaleImage(product.imageUrl);
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: { enhancedImageUrl: enhancedUrl, isEnhanced: true }
    });
    
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

exports.describeProductImage = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    // This can be used on unsaved products if imageUrl is passed in body, but prompt implies POST /products/:id/describe
    let imageUrl = req.body.imageUrl || (product ? product.imageUrl : null);
    if (!imageUrl) return res.status(400).json({ success: false, error: 'No image URL provided' });
    
    // Convert to full URL if relative
    if (imageUrl.startsWith('/')) {
      const host = req.get('host');
      const protocol = req.protocol;
      imageUrl = `${protocol}://${host}${imageUrl}`;
    }

    const description = await generateCarpetDescription(imageUrl);
    res.json({ success: true, data: { description } });
  } catch (error) {
    next(error);
  }
};
