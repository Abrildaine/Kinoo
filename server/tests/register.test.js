import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { crearApp } from '../src/app.js';
import { abrirDb } from '../src/db/index.js';

let app, db;

beforeEach(() => {
  db = abrirDb(':memory:');
  app = crearApp(db);
});

const valido = { nombre: 'Ana', email: 'ana@mail.com', password: 'Clave-segura-123' };

describe('POST /api/auth/register', () => {
  it('crea el usuario y guarda un hash, no la contraseña', async () => {
    const res = await request(app).post('/api/auth/register').send(valido);
    expect(res.status).toBe(202);
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get('ana@mail.com');
    expect(user.password_hash.startsWith('$argon2id$')).toBe(true);
    expect(user.password_hash).not.toContain(valido.password);
  });

  it('responde igual si el mail ya existe (sin enumeración)', async () => {
    const r1 = await request(app).post('/api/auth/register').send(valido);
    const r2 = await request(app).post('/api/auth/register').send(valido);
    expect(r2.status).toBe(r1.status);
    expect(r2.body).toEqual(r1.body);
  });

  it('rechaza contraseñas cortas', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...valido, password: 'corta' });
    expect(res.status).toBe(400);
  });

  it('normaliza el email a minúsculas', async () => {
    await request(app).post('/api/auth/register').send({ ...valido, email: 'ANA@Mail.com' });
    const user = db.prepare('SELECT email FROM users').get();
    expect(user.email).toBe('ana@mail.com');
  });
});