import { describe, it, expect } from 'vitest';
import { hashPassword, verificarPassword } from '../src/utils/hash.js';

describe('hash de contraseñas', () => {
  it('verifica una contraseña correcta', async () => {
    const hash = await hashPassword('Clave-segura-123');
    expect(await verificarPassword(hash, 'Clave-segura-123')).toBe(true);
  });

  it('rechaza una contraseña incorrecta', async () => {
    const hash = await hashPassword('Clave-segura-123');
    expect(await verificarPassword(hash, 'otra-clave')).toBe(false);
  });

  it('no guarda la contraseña en texto plano y usa argon2id', async () => {
    const hash = await hashPassword('Clave-segura-123');
    expect(hash).not.toContain('Clave-segura-123');
    expect(hash.startsWith('$argon2id$')).toBe(true);
  });

  it('dos hashes de la misma contraseña son distintos (sal aleatoria)', async () => {
    const h1 = await hashPassword('Clave-segura-123');
    const h2 = await hashPassword('Clave-segura-123');
    expect(h1).not.toBe(h2);
  });
});