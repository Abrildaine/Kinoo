import { z } from 'zod';

const email = z 
.string()
.trim()
.toLowerCase()
.email()
.max(254);

//largo minimo 10, maximo 128(el maximo evita que alguien
//mande contraseñas muy largas y sature el servidor)
const password = z.string().min(10).max(128);

export const RegisterSchema = z.object({
    nombre: z.string().trim().min(1).max(60),
    email,
    password,
});

export const LoginSchema = z.object({
    email,
    password: z.string().min(1).max(128),
});


