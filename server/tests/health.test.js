import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { crearApp } from '../src/app.js';
import { abrirDb } from '../src/db/index.js';

const app = crearApp(abrirDb(':memory:'));

describe('API base', () => {
  it('GET /health responde ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('no expone el header X-Powered-By', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('ruta inexistente devuelve 404', async () => {
    const res = await request(app).get('/nada');
    expect(res.status).toBe(404);
  });

  it('JSON malformado devuelve 400 sin filtrar detalles', async () => {
    const res = await request(app)
      .post('/health')
      .set('Content-Type', 'application/json')
      .send('{roto');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'JSON inválido' });
  });
});