import argon2 from 'argon2';

const OPCIONES = {
    type: argon2.argon2id,
    memoryCost: 19456, //aprox 19MiB
    timeCost: 2, //cantidad de iteraciones
    parallelism: 1, //cantidad de hilos
};

export const hashPassword = (plain)=> argon2.hash(plain, OPCIONES);
export const verificarPassword = (hash, plain) => argon2.verify(hash, plain);
