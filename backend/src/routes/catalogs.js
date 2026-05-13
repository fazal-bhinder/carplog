const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

router.get('/', catalogController.getAllCatalogs);
router.get('/:id', catalogController.getCatalog);
router.post('/', catalogController.createCatalog);
router.put('/:id', catalogController.updateCatalog);
router.delete('/:id', catalogController.deleteCatalog);

router.post('/:id/products', catalogController.addProductToCatalog);
router.delete('/:id/products/:pid', catalogController.removeProductFromCatalog);
router.get('/:id/pdf', catalogController.generatePDF);

module.exports = router;
