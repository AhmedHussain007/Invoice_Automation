import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Support for ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to manage invoice numbers
function invoiceManagerPlugin() {
  const jsonPath = path.resolve(__dirname, 'invoices.json');

  // Ensure file exists
  if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, JSON.stringify([]));
  }

  const generateId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const getPart = (len) => Array.from({ length: len }).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    return `INV-${getPart(4)}-${getPart(3)}`;
  };

  return {
    name: 'invoice-manager',
    configureServer(server) {
      // 1. Generate unique invoice number
      server.middlewares.use('/api/invoice-number', (req, res, next) => {
        if (req.method === 'GET') {
          const usedInvoices = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
          let newId;
          do {
            newId = generateId();
          } while (usedInvoices.includes(newId));
          
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ invoiceNo: newId }));
          return;
        }
        next();
      });

      // 2. Save used invoice number
      server.middlewares.use('/api/save-invoice', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { invoiceNo } = JSON.parse(body);
              if (invoiceNo) {
                const usedInvoices = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
                if (!usedInvoices.includes(invoiceNo)) {
                  usedInvoices.push(invoiceNo);
                  fs.writeFileSync(jsonPath, JSON.stringify(usedInvoices, null, 2));
                }
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (error) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to save' }));
            }
          });
          return;
        }
        next();
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), invoiceManagerPlugin()],
})
