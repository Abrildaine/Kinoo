import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { RegisterSchema } from '../utils/schemas.js';
import { hashPassword } from '../utils/hash.js';

export function crearAuthRouter(db) {
  const router = Router();

  const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos, probá más tarde' },
  });

  router.post('/register', registerLimiter, async (req, res, next) => {
    try {
      const datos = RegisterSchema.safeParse(req.body);
      if (!datos.success) {
        return res.status(400).json({ error: 'Datos inválidos' });
      }
      const { nombre, email, password } = datos.data;

      const existe = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (!existe) {
        const hash = await hashPassword(password);
        db.prepare(
          'INSERT INTO users (email, nombre, password_hash) VALUES (?, ?, ?)'
        ).run(email, nombre, hash);
      }

      // misma respuesta exista o no el mail (anti-enumeración)
      res.status(202).json({
        mensaje: 'Si el correo es válido, te enviamos un mensaje para continuar.',
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}