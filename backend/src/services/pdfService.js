const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

function buildProductsHTML(products) {
  if (!products || products.length === 0) return '<p>No products in this catalog.</p>';
  
  let html = '<div class="product-grid">';
  products.forEach(cp => {
    const p = cp.product;
    let imgUrl = p.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image';
    if (imgUrl.startsWith('/')) imgUrl = `http://localhost:5001${imgUrl}`;
    const price = cp.customPrice || p.price;
    html += `
      <div class="product-card">
        <img src="${imgUrl}" alt="${p.name}" class="product-image" />
        <div class="product-details">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-price">₹${price.toFixed(2)}</p>
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
  const templateName = 'luxury-catalog-template';
  const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template ${templateName} not found`);
  }
  
  let html = fs.readFileSync(templatePath, 'utf8');

  if (templateName === 'luxury-catalog-template') {
    const templateData = {
      name: catalog.name,
      shop: {
        shopName: "Carpet Story", shopPhone: "+91 9602492022",
        shopEmail: "gargaashrit@gmail.com", shopInstagram: "@carpetstory",
        shopWebsite: "carpetstory.co"
      },
      products: catalog.products.map(cp => {
        const p = cp.product;
        return {
          name: p.name,
          sku: p.sku || p.name,
          price: cp.customPrice || p.price,
          description: p.description || '',
          imageUrl: p.imageUrl ? (p.imageUrl.startsWith('/') ? `http://localhost:5001${p.imageUrl}` : p.imageUrl) : null,
          enhancedImageUrl: p.enhancedImageUrl ? (p.enhancedImageUrl.startsWith('/') ? `http://localhost:5001${p.enhancedImageUrl}` : p.enhancedImageUrl) : null,
          colorSwatches: ["#F5F0E8","#C9A84C","#6B3A3A","#3D0C11"],
          category: { name: p.category ? p.category.name : 'Uncategorized' },
          dimensions: p.dimensions || ''
        };
      })
    };
    
    const injectedScript = `<script>
      document.addEventListener('DOMContentLoaded', () => {
        const realData = ${JSON.stringify(templateData)};
        document.getElementById('zone2').innerHTML = '';
        document.getElementById('zone3').innerHTML = '';
        if (typeof buildCatalog === 'function') {
          buildCatalog(realData);
        }
      });
    </script>`;
    html = html.replace('</body>', `${injectedScript}</body>`);
    html = html.replace('buildCatalog(sampleCatalog);', '');
  } else {
    // Inject data for legacy templates
    html = html.replace(/{{catalogName}}/g, catalog.name || 'Catalog');
    html = html.replace('{{productsHTML}}', buildProductsHTML(catalog.products));
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  
  // Disable timeouts entirely for massive PDFs
  page.setDefaultNavigationTimeout(0);
  page.setDefaultTimeout(0);

  const isLandscape = templateName === 'luxury-catalog-template';
  
  await page.setContent(html, { waitUntil: 'networkidle2', timeout: 0 });
  
  const pdfOptions = {
    format: 'A4',
    landscape: isLandscape,
    printBackground: true,
    timeout: 0,
    displayHeaderFooter: !isLandscape,
    margin: isLandscape ? { top: 0, bottom: 0, left: 0, right: 0 } : { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
  };
  
  if (!isLandscape) {
    pdfOptions.headerTemplate = '<div></div>';
    pdfOptions.footerTemplate = `
      <div style="width: 100%; font-size: 10px; padding: 0 15mm; display: flex; justify-content: space-between; font-family: Helvetica, sans-serif;">
        <span style="color: #6B7280;">${catalog.name || 'Catalog'}</span>
        <span style="color: #6B7280;">Page <span class="pageNumber"></span></span>
      </div>
    `;
  }
  
  const pdf = await page.pdf(pdfOptions);
  
  await browser.close();
  return pdf;
}

module.exports = { generateCatalogPDF };
