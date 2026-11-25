import 'dotenv/config';
import { z } from 'zod'; //Zod sirve para validar datos, definis como tienen que ser y zod chequea si lo cumplen

const Schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'), //en que modo corre la app y que el valor solo puede ser uno de esos tres textos
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
      DB_FILE: z.string().default('kinoo.db'),
}); //variable que no se puede reasignar, espera un objeto con esas propiedades

const parsed = Schema.safeParse(process.env); //en lugar de explotar con un error, devuelve un objeto que dice si salio bien o mal
if(!parsed.success){
    console.error('Configuración inválida: ', parsed.error.flatten().fieldErrors);
    process.exit(1);
} //si no tuvo exito imprime un mensaje de error en la terminal, 1 es que termino con error, 0 que todo bien

export const env = parsed.data;
