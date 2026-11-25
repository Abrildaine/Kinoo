import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const carpeta = dirname(fileURLToPath(import.meta.url));

export function abrirDb(archivo) {
    const db = new Database(archivo);
    db,pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.exec(readFileSync(join(carpeta, 'schema.sql'), 'utf-8'));
    return db;
}