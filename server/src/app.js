import express from 'express';
import helmet from 'helmet';
import { crearAuthRouter } from './routes/auth.routes.js';

export function crearApp(db) {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', crearAuthRouter(db));

  app.use((req, res) => {
    res.status(404).json({ error: 'No encontrado' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'JSON inválido' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  });

  return app;
}