# CarpLog — Carpet Catalog Manager

**CarpLog** is a premium, full-stack catalog management system designed specifically for the luxury carpet industry. It provides a seamless experience for managing product inventories, organizing collections into catalogs, and generating high-fidelity PDF exports with sophisticated layouts.

![Aesthetic](https://img.shields.io/badge/Design-Warm_Sand_%26_Charcoal-C2692A?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React_|_Node_|_Prisma-1C1917?style=flat-square)

---

## ✨ Features

### 🏢 Product Inventory
- **Smart Management**: Full CRUD for carpet products with SKUs, dimensions, materials, and pricing in INR.
- **AI Vision**: Automatic description generation using Anthropic Claude Vision based on uploaded product photos.
- **AI Enhancement**: Instant image upscaling and restoration via Real-ESRGAN (Replicate).
- **Category Filing**: Organize inventory into logical groups like "Living Room", "Oriental", or "Modern".

### 📖 Catalog Studio
- **Curated Collections**: Group specific products together into themed catalogs.
- **PDF Generation**: High-performance PDF export using Puppeteer.
- **Visual Templates**: Choose between **Standard** (detailed), **Minimal** (clean grid), and **Luxury** (editorial dark mode) layouts.
- **Custom Pricing**: Set catalog-specific prices for products without affecting the master inventory.

### ⚡ Premium UX
- **Command Palette**: Global action trigger with `⌘ K` (or `Ctrl K`) for lightning-fast navigation.
- **Collapsible Sidebar**: Maximize workspace with a persistent, collapsible sidebar (saved to local storage).
- **Modern UI**: A "Warm Sand & Charcoal" aesthetic with zero-line separators and frosted glass headers.
- **Optimistic UI**: Instant feedback on template switches and status updates with robust toast notifications.

---

## 🚀 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS 4.0, Zustand, TanStack Query.
- **Backend**: Node.js, Express, Prisma ORM.
- **Database**: PostgreSQL.
- **Services**: Anthropic (AI Vision), Replicate (Upscaling), Puppeteer (PDF).

---

## 🛠️ Setup & Installation

### 1. Backend Setup
```bash
cd backend
npm install
# Configure your .env (see .env.example)
npx prisma migrate dev
npm run dev # Runs on port 5001
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev # Runs on port 5173
```

### 3. Environment Variables (`backend/.env`)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/carplog"
ANTHROPIC_API_KEY="your_key"
REPLICATE_API_TOKEN="your_token"
PORT=5001
```

---

## 🎨 Design System

CarpLog uses a custom-tuned "Warm Sand & Charcoal" color palette:
- **Charcoal** (`#1C1917`): Primary surface and sidebar background.
- **Warm Sand** (`#FAFAF8`): Primary background and neutral surfaces.
- **Burnt Orange** (`#C2692A`): Primary accent for actions and status.
- **Typography**: Inter (Variable font weights for a premium editorial feel).

---

© 2026 CarpLog. Crafted for excellence.
