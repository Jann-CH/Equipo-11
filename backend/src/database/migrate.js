import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './connection.js'; // Ajusta la ruta a tu archivo connection.js

// Esto es necesario para obtener la ruta actual si usas "import" (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runMigration = async () => {
  try {
   // Ruta a tu carpeta migrations (subiendo un nivel desde src)
    const migrationsDir = path.join(__dirname, '../migrations');

    // 1. Lee todos los archivos de la carpeta
    const files = fs.readdirSync(migrationsDir); 

    // 2. Filtra solo los que terminan en .sql y ordénalos alfabéticamente
    // (Por eso es útil nombrarlos con números: 01_usuarios.sql, 02_clientes.sql)
    const sqlFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log("No se encontraron archivos .sql para migrar.");
      return;
    

    // 3. Itera y ejecuta cada archivo SQL de forma ordenada
    for (const file of sqlFiles) {
      const filePath = path.join(migrationsDir, file);
      const sqlQuery = fs.readFileSync(filePath, 'utf8');

      console.log(`Ejecutando migración: ${file}...`);
      await pool.query(sqlQuery);
    }

    console.log("¡Todas las migraciones se ejecutaron exitosamente!");
  } catch (error) {
    console.error("Error al ejecutar las migraciones SQL:", error);
  }

};