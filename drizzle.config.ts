/* Aqui configuraremos drizzle */

import "dotenv/config";
import { Config } from "drizzle-kit"

export default {
    dialect: "postgresql",
    schema: "./db/schema.ts",
    /* según la documentación ahora hay q especificar el 'dialecto' de BD que se está conectando (opciones: mysql, postgresql, o sqlite) */
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    }, 
} satisfies Config
