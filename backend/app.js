const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./src/middleware/errorHandler');

// Routes
const productsRouter = require('./src/routes/products');
const catalogsRouter = require('./src/routes/catalogs');
const categoriesRouter = require('./src/routes/categories');
const uploadRouter = require('./src/routes/upload');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically with aggressive caching
// (filenames include timestamps so they're effectively immutable)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1y',
  immutable: true,
}));

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/catalogs', catalogsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/upload', uploadRouter);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
