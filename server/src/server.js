import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${env.PORT}`); //las comillas invertidas permiten meter variables dentro del texto
});