const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

function buildProductsHTML(products) {
  if (!products || products.length === 0) return '<p>No products in this catalog.</p>';
  
  let html = '<div class="product-grid">';
  products.forEach(cp => {
    const p = cp.product;
    // ensure absolute url or data URI for images in puppeteer, assuming imageUrl is absolute
    const imgUrl = p.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image';
    const price = cp.customPrice || p.price;
    html += `
      <div class="product-card">
        <img src="${imgUrl}" alt="${p.name}" class="product-image" />
        <div class="product-details">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-price">$${price.toFixed(2)}</p>
          <p class="product-sku">SKU: ${p.sku || 'N/A'}</p>
          <p class="product-description">${p.description || ''}</p>
        </div>
      </div>
    `;
  });
  html += '</div>';
  return html;
}

async function generateCatalogPDF(catalog) {
  const templateName = catalog.template || 'standard';
  const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template ${templateName} not found`);
  }
  
  let html = fs.readFileSync(templatePath, 'utf8');

  // Inject data
  html = html.replace(/{{catalogName}}/g, catalog.name || 'Catalog');
  html = html.replace('{{productsHTML}}', buildProductsHTML(catalog.products));

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Intercept requests if needed or just wait for network idle
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="width: 100%; font-size: 10px; padding: 0 15mm; display: flex; justify-content: space-between; font-family: Helvetica, sans-serif;">
        <span style="color: #6B7280;">${catalog.name || 'Catalog'}</span>
        <span style="color: #6B7280;">Page <span class="pageNumber"></span></span>
      </div>
    `,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
  });
  
  await browser.close();
  return pdf;
}

module.exports = { generateCatalogPDF };
