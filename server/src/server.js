import { crearApp } from './app.js';
import { abrirDb } from './db/index.js';
import { env } from './config/env.js';

const db = abrirDb(env.DB_FILE);
const app = crearApp(db);

app.listen(env.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${env.PORT}`);
});