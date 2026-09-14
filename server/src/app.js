import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ticketRoutes from '../routes/ticketRoutes.js';
import '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, '../../client/dist');

export const app = express();
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => { res.setHeader('X-Content-Type-Options','nosniff'); next(); });

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'ticket-api' }));
app.use('/api/tickets', ticketRoutes);

// Serve the React production build from Express when deployed as one service.
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Route not found.' });
  res.sendFile(path.join(clientDist, 'index.html'), err => {
    if (err && !res.headersSent) res.status(404).json({ error: 'Frontend build not found.' });
  });
});

app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: 'Internal server error.' }); });
