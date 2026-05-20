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
    const { name, description, sku, price, offerPrice, categoryId, imageUrl, thumbnailUrl, dimensions, material } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        sku,
        price: price ? parseFloat(price) : null,
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        dimensions,
        material,
        categoryId: categoryId ? parseInt(categoryId) : null,
        imageUrl,
        thumbnailUrl
      }
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, sku, price, offerPrice, categoryId, imageUrl, thumbnailUrl, dimensions, material } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        description,
        sku,
        price: price ? parseFloat(price) : null,
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        dimensions,
        material,
        categoryId: categoryId ? parseInt(categoryId) : null,
        imageUrl,
        thumbnailUrl
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
    const { id } = req.params;
    let product;
    let name, description;

    if (id && id !== 'enhance') { // Check if ID is present and not the string 'enhance'
      product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
      name = product.name;
      description = product.description;
    } else {
      // For unsaved products, use data from body
      name = req.body.name || 'Luxurious Carpet';
      description = req.body.description || '';
      product = { name, description };
    }
    
    const enhancedUrl = await upscaleImage(product);

    // If it was an existing product, update it
    if (product.id) {
      await prisma.product.update({
        where: { id: product.id },
        data: { enhancedImageUrl: enhancedUrl, isEnhanced: true }
      });
    }
    
    res.json({ success: true, data: { imageUrl: enhancedUrl } });
  } catch (error) {
    next(error);
  }
};

exports.describeProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let imageUrl = req.body.imageUrl;

    if (!imageUrl && id && id !== 'describe') {
      const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
      imageUrl = product ? product.imageUrl : null;
    }

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
