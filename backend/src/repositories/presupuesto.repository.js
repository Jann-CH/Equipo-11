import pool from "../database/connection.js";

/**
 * Obtiene un presupuesto completo con sus detalles y datos del cliente
 */
export const findPresupuestoConDetallesRepository = async (presupuestoId, usuarioId) => {
    const query = `
        SELECT
            p.id, p.fecha_vencimiento,
            p.subtotal, p.total, p.estado,
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,

            -- JSON_AGG junta todas las filas de detalle_presupuesto de ESTE presupuesto
            -- en un solo array JSON, para no traer un renglón por cada ítem.
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', dp.id,
                    'item_nombre', i.nombre,
                    'cantidad', dp.cantidad,
                    'precio_unitario', dp.precio_unitario,
                    'subtotal', dp.subtotal
                -- ORDER BY adentro del JSON_AGG: sin esto, Postgres no garantiza
                -- el orden de los ítems dentro del array (podría cambiar entre consultas).
                ) ORDER BY dp.created_at
            ) AS detalles

        FROM presupuesto p

        -- INNER JOIN: si el cliente no existiera no debería pasar nunca
        -- (cliente_id es NOT NULL y tiene FK), así que este sí puede quedar INNER.
        JOIN clientes c ON p.cliente_id = c.id

        -- LEFT JOIN (antes era JOIN): si el presupuesto todavía no tiene ítems
        -- cargados (ej. un borrador a medio hacer), igual queremos que aparezca,
        -- con 'detalles' como un array vacío en vez de que la fila desaparezca entera.
        LEFT JOIN detalle_presupuesto dp ON dp.presupuesto_id = p.id

      
        -- 'items_id' (así quedó definida en detalle_presupuesto), no 'item_id'.
        LEFT JOIN item i ON dp.items_id = i.id

        WHERE p.id = $1 AND p.usuario_id = $2 AND p.deleted_at IS NULL

        -- Alcanza con agrupar por p.id: como es la Primary Key de presupuesto,
        -- Postgres permite traer el resto de columnas de 'p' (fecha_vencimiento,
        -- subtotal, total, estado) sin listarlas acá, por dependencia funcional.
        -- c.nombre y c.apellido sí hay que listarlos porque vienen de otra tabla.
        GROUP BY p.id, c.nombre, c.apellido;
    `;

    const result = await pool.query(query, [presupuestoId, usuarioId]);

    // Si no hay ninguna fila (el presupuesto no existe, no es de este usuario,
    // o está borrado lógicamente), devolvemos null en vez de undefined.
    return result.rows[0] || null;
};

/**
 * Crea presupuesto y sus detalles mediante una Transacción ACID
 */
export const createPresupuestoTransaccionRepository = async ({
    usuarioId,
    clienteId,
    fechaVencimiento,
    subtotal,
    total,
    estado,
    pdfUrl,
    pdfPublicId,
    detalles // Array de objetos: { item_id, cantidad, precio_unitario, subtotal }
}) => {
    // Pedimos una conexión DEDICADA del pool (no una cualquiera).
    // Es obligatorio para transacciones: todas las queries de la transacción
    // tienen que correr sobre la MISMA conexión, si no Postgres no las asocia entre sí.
    const client = await pool.connect();

    try {
        // Arranca la transacción. A partir de acá, nada de lo que insertemos
        // queda escrito "en serio" en la base hasta que llegue el COMMIT.
        await client.query("BEGIN");

        // 1. Insertar Cabecera del presupuesto
        // OJO: la tabla se llama 'presupuesto' (singular), no 'presupuestos'.
        const queryPresupuesto = `
            INSERT INTO presupuesto (usuario_id, cliente_id, fecha_vencimiento, subtotal, total, estado, pdf_url, pdf_public_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id;
        `;
        // client.query devuelve un objeto con la propiedad 'rows' (array de filas).
        // Como insertamos 1 sola fila, desestructuramos directo la primera posición.
        // RETURNING id nos da el UUID generado por gen_random_uuid(), que necesitamos
        // para poder engancharle las líneas del detalle en el paso siguiente.
        const { rows: [presupuesto] } = await client.query(queryPresupuesto, [
            usuarioId, clienteId, fechaVencimiento, subtotal, total, estado, pdfUrl, pdfPublicId
        ]);

        // 2. Insertar todas las líneas de detalle en UNA sola query (insert en lote)
        // en vez de un INSERT por cada ítem dentro de un for. Menos viajes a la base
        // cuando el presupuesto tiene varios ítems.
        if (detalles.length > 0) {
            // Vamos a armar algo como:
            // INSERT INTO detalle_presupuesto (presupuesto_id, items_id, cantidad, precio_unitario, subtotal)
            // VALUES ($1,$2,$3,$4,$5), ($6,$7,$8,$9,$10), ...
            const values = []; // acá van TODOS los valores, en orden, para los placeholders $1, $2, $3...
            const placeholders = detalles.map((det, i) => {
                // Cada línea usa 5 columnas, así que el bloque de placeholders
                // de la línea i arranca en (i*5 + 1) y ocupa 5 números seguidos.
                const base = i * 5;
                values.push(presupuesto.id, det.item_id, det.cantidad, det.precio_unitario, det.subtotal);
                return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`;
            }).join(", "); // separamos cada grupo "(...)" con una coma

            // OJO: la columna se llama 'items_id' (así quedó definida en la migración
            // 006_create_detallePresupuesto.sql), no 'item_id'.
            const queryDetalle = `
                INSERT INTO detalle_presupuesto (presupuesto_id, items_id, cantidad, precio_unitario, subtotal)
                VALUES ${placeholders};
            `;

            await client.query(queryDetalle, values);
        }

        // Si llegamos hasta acá sin errores, confirmamos todo lo insertado
        // (la cabecera + todas las líneas) de una vez.
        await client.query("COMMIT");
        return { id: presupuesto.id, success: true };

    } catch (error) {
        // Si CUALQUIER paso de arriba falla (cabecera o cualquier línea de detalle),
        // deshacemos todo lo que se haya insertado en esta transacción.
        // Así evitamos presupuestos "fantasma": una cabecera guardada sin sus ítems,
        // o con solo algunos ítems porque el resto falló.
        await client.query("ROLLBACK");
        throw error; // se lo pasamos al controller/service que llamó a esta función
    } finally {
        // Devolvemos la conexión al pool SIEMPRE, haya salido bien o mal.
        // Si no hacemos esto, con el tiempo se agotan las conexiones disponibles.
        client.release();
    }
};