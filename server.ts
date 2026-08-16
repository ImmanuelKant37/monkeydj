import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Aura Sound & Eventos Platform', version: '2.0.0' });
  });

  // Simulated / Real Email Dispatcher
  app.post('/api/send-email', (req, res) => {
    const { to, subject, type, payload } = req.body;
    console.log(`[AURA EMAIL ENGINE] Dispatching notification type "${type}" to:`, to);
    console.log(`Subject: ${subject}`);
    console.log(`Payload preview:`, JSON.stringify(payload).substring(0, 150));

    res.json({
      success: true,
      message: `Notificación enviada con éxito a ${Array.isArray(to) ? to.join(', ') : to}`,
      timestamp: new Date().toISOString()
    });
  });

  // SEO Endpoints: Sitemap & Robots.txt
  app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://aurasound.com.ar/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://aurasound.com.ar/#servicios</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://aurasound.com.ar/#cotizador</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://aurasound.com.ar/#galeria</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://aurasound.com.ar/#testimonios</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
</urlset>`);
  });

  app.get('/robots.txt', (req, res) => {
    res.header('Content-Type', 'text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://aurasound.com.ar/sitemap.xml`);
  });

  // Vite Middleware in dev, or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Aura Sound Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
