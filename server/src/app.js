import express from 'express';
import helmet from 'helmet';

export const app = express();

//middlewares
app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

app.get('/health', (req, res) => {
    res.json({ status: 'ok'});
});

app.use((req, res) => {
    res.status(404).json({ error:'No encontrado' });
});

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'JSON inválido' });
    }

    console.error(err);  //el detalle va al log no al cliente
    res.status(500).json({ error: 'Error interno '});
});