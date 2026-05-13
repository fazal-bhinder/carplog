const prisma = require('../prisma/client');
const { generateCatalogPDF } = require('../services/pdfService');

exports.getAllCatalogs = async (req, res, next) => {
  try {
    const catalogs = await prisma.catalog.findMany({
      include: { _count: { select: { products: true } } }
    });
    res.json({ success: true, data: catalogs });
  } catch (error) {
    next(error);
  }
};

exports.getCatalog = async (req, res, next) => {
  try {
    const catalog = await prisma.catalog.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        products: {
          include: { product: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    if (!catalog) return res.status(404).json({ success: false, error: 'Catalog not found' });
    res.json({ success: true, data: catalog });
  } catch (error) {
    next(error);
  }
};

exports.createCatalog = async (req, res, next) => {
  try {
    const { name, status, template } = req.body;
    const catalog = await prisma.catalog.create({
      data: { name, status: status || 'draft', template: template || 'standard' }
    });
    res.status(201).json({ success: true, data: catalog });
  } catch (error) {
    next(error);
  }
};

exports.updateCatalog = async (req, res, next) => {
  try {
    const { name, status, template } = req.body;
    const catalog = await prisma.catalog.update({
      where: { id: parseInt(req.params.id) },
      data: { name, status, template }
    });
    res.json({ success: true, data: catalog });
  } catch (error) {
    next(error);
  }
};

exports.deleteCatalog = async (req, res, next) => {
  try {
    await prisma.catalog.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, data: { message: 'Catalog deleted' } });
  } catch (error) {
    next(error);
  }
};

exports.addProductToCatalog = async (req, res, next) => {
  try {
    const catalogId = parseInt(req.params.id);
    const { productId, customPrice } = req.body;
    const parsedProductId = parseInt(productId);

    // Use upsert to avoid duplicate constraint errors if product is already in catalog
    const cp = await prisma.catalogProduct.upsert({
      where: { catalogId_productId: { catalogId, productId: parsedProductId } },
      update: { customPrice: customPrice ? parseFloat(customPrice) : null },
      create: { catalogId, productId: parsedProductId, customPrice: customPrice ? parseFloat(customPrice) : null },
    });
    res.json({ success: true, data: cp });
  } catch (error) {
    next(error);
  }
};

exports.removeProductFromCatalog = async (req, res, next) => {
  try {
    const catalogId = parseInt(req.params.id);
    const productId = parseInt(req.params.pid);
    await prisma.catalogProduct.delete({
      where: { catalogId_productId: { catalogId, productId } }
    });
    res.json({ success: true, data: { message: 'Product removed from catalog' } });
  } catch (error) {
    next(error);
  }
};

exports.generatePDF = async (req, res, next) => {
  try {
    const catalog = await prisma.catalog.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        products: {
          include: { product: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    if (!catalog) return res.status(404).json({ success: false, error: 'Catalog not found' });
    
    // Create absolute URLs for images in products if they are relative
    const host = req.get('host');
    const protocol = req.protocol;
    catalog.products.forEach(cp => {
      if (cp.product.imageUrl && cp.product.imageUrl.startsWith('/')) {
        cp.product.imageUrl = `${protocol}://${host}${cp.product.imageUrl}`;
      }
    });

    const pdfBuffer = await generateCatalogPDF(catalog);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${catalog.name.replace(/\\s+/g, '-')}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
