// IMPORTANTE: env.config.js debe ser el PRIMER import.
// Valida todas las variables de entorno y carga dotenv
// antes de que cualquier otro módulo las consuma.
import { env } from "./src/config/env.config.js";
import app from "./src/app.js";
import { connectDB } from "./src/config/dataBase.config.js";

await connectDB();

app.listen(env.PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${env.PORT} [${env.NODE_ENV}]`);
});