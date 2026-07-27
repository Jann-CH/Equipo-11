import pool from "../database/connection.js";
import { AppError } from "../utils/AppError.util.js";

export const findPresupuestoConClienteRepository = async (presupuestoId, usuarioId) => {
    const query = `
        SELECT
            p.id,
            p.estado,
            p.cliente_id,
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,
            c.email AS cliente_email
        FROM presupuestos p
        JOIN clientes c ON p.cliente_id = c.id
        WHERE p.id = $1
        AND p.usuario_id = $2
        AND p.deleted_at IS NULL;
    `;

    const result = await pool.query(query, [presupuestoId, usuarioId]);

    return result.rows[0] || null;
};

/**
 * ==================================================
 * Obtiene un presupuesto completo con sus detalles
 * y datos del cliente
 * ==================================================
 */
export const findPresupuestoConDetallesRepository = async (presupuestoId, usuarioId) => {
    const query = `
        SELECT
            p.id,
            p.numero,
            p.fecha,
            p.fecha_vencimiento,
            p.subtotal,
            p.total,
            p.estado,
            p.observaciones,

            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,

            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id',dp.id,
                    'item_id',dp.item_id,
                    'nombre_item',dp.nombre_item,
                    'cantidad',dp.cantidad,
                    'precio_unitario',dp.precio_unitario,
                    'subtotal',dp.subtotal
                )
                ORDER BY dp.created_at
            ) AS detalles

        FROM presupuestos p
        JOIN clientes c ON p.cliente_id = c.id
        LEFT JOIN detalle_presupuesto dp ON dp.presupuesto_id = p.id

        WHERE p.id = $1
        AND p.usuario_id = $2
        AND p.deleted_at IS NULL

        GROUP BY p.id,c.nombre,c.apellido;
    `;

    const result = await pool.query(query, [presupuestoId, usuarioId]);

    return result.rows[0] || null;
};

/**
 * ==================================================
 * REPOSITORY: Crear presupuesto
 * ==================================================
 **/
export const createPresupuestoTransaccionRepository = async ({
    usuarioId,
    clienteId,
    fecha,
    fechaVencimiento,
    estado,
    observaciones,
    subtotal,
    total,
    detallesProcesados,
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Generar número de presupuesto por usuario
        const {rows:[contador]} = await client.query(
            `
            SELECT COUNT(*) + 1 AS numero
            FROM presupuestos
            WHERE usuario_id = $1;
            `,
            [usuarioId]
        );

        const numero = `P-${String(contador.numero).padStart(3,"0")}`;

        // 2. Insertar cabecera del presupuesto
        const {rows:[nuevoPresupuesto]} = await client.query(
            `
            INSERT INTO presupuestos
            (
                usuario_id,
                cliente_id,
                numero,
                fecha,
                fecha_vencimiento,
                estado,
                observaciones,
                subtotal,
                total
            )
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING
                id,
                numero,
                fecha,
                fecha_vencimiento,
                observaciones,
                created_at,
                subtotal,
                total,
                estado;
            `,
            [
                usuarioId,
                clienteId,
                numero,
                fecha,
                fechaVencimiento,
                estado,
                observaciones || null,
                subtotal,
                total
            ]
        );

        // 3. Insertar cada ítem del detalle
        for (const det of detallesProcesados) {
            await client.query(
                `
                INSERT INTO detalle_presupuesto
                (
                    presupuesto_id,
                    item_id,
                    nombre_item,
                    cantidad,
                    precio_unitario,
                    subtotal
                )
                VALUES($1,$2,$3,$4,$5,$6);
                `,
                [
                    nuevoPresupuesto.id,
                    det.item_id,
                    det.nombre_item,
                    det.cantidad,
                    det.precio_unitario,
                    det.subtotal
                ]
            );
        }

        await client.query("COMMIT");

        return { ...nuevoPresupuesto, detalles: detallesProcesados };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

/**
 * ===================================================
 * REPOSITORY: GUARDAR PRESUPUESTO PDF
 * ===================================================
 */
export const addPdfRepository = async (dato) => {
    const { usuarioId, presupuestoId, pdf_url, pdf_public_id, estado } = dato;

    const query = `
        UPDATE presupuestos
        SET
            pdf_url = $1,
            pdf_public_id = $2,
            estado = $3,
            updated_at = NOW()
        WHERE id = $4
        AND usuario_id = $5
        AND deleted_at IS NULL
        RETURNING id,pdf_url,estado;
    `;

    const result = await pool.query(query, [pdf_url, pdf_public_id, estado, presupuestoId, usuarioId]);

    // Si no encuentra presupuesto o no pertenece al usuario
    if (result.rows.length === 0)
        throw new AppError("No se pudo actualizar el PDF", 404);

    return result.rows[0];
};

/**
 * =================================================
 * REPOSITORY: FILTROS POR FECHA, ESTADO Y CLIENTE
 * =================================================
 */
export const findPresupuestosConFiltrosRepository = async (usuarioId, filtros, limite, skip) => {
    const conditions = ["p.usuario_id = $1", "p.deleted_at IS NULL"];
    const values = [usuarioId];

    if (filtros.estado) {
        conditions.push(`p.estado = $${values.length + 1}`);
        values.push(filtros.estado);
    }

    if (filtros.busqueda) {
        conditions.push(
            `(c.nombre ILIKE $${values.length + 1}
            OR c.apellido ILIKE $${values.length + 1})`
        );
        values.push(`%${filtros.busqueda}%`);
    }

    const query = `
        SELECT
            p.*,
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido
        FROM presupuestos p
        JOIN clientes c ON p.cliente_id = c.id
        WHERE ${conditions.join(" AND ")}
        ORDER BY p.created_at DESC
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2};
    `;

    values.push(limite, skip);

    const result = await pool.query(query, values);

    return result.rows;
};

export const contarPresupuestosConFiltrosRepository = async (usuarioId, filtros) => {
    const conditions = ["p.usuario_id = $1", "p.deleted_at IS NULL"];
    const values = [usuarioId];

    if (filtros.estado) {
        conditions.push(`p.estado = $${values.length + 1}`);
        values.push(filtros.estado);
    }

    const query = `
        SELECT COUNT(*)
        FROM presupuestos p
        WHERE ${conditions.join(" AND ")};
    `;

    const result = await pool.query(query, values);

    // Retornamos cantidad como número
    return parseInt(result.rows[0].count, 10);
};

/**
 * DASHBOARD
 * SUMA TOTAL DE PRESUPUESTO
 * CANTIDAD DE PRESUPUESTO ESTADOS
 * ACTIVIDAD SEMANAL
 */
export const getDashboardDataRepository = async (usuarioId) => {
    const query = `
        WITH estadisticas AS (
            SELECT
                COALESCE(SUM(total),0) AS suma_total,
                COUNT(*) FILTER(WHERE estado = 'Guardado') AS guardados,
                COUNT(*) FILTER(WHERE estado = 'Aceptado') AS aceptados,
                COUNT(*) FILTER(WHERE estado = 'Rechazado') AS rechazados,
                COUNT(*) AS total_presupuestos
            FROM presupuestos
            WHERE usuario_id = $1
            AND deleted_at IS NULL
        ),

        actividad AS (
            SELECT
                TO_CHAR(created_at,'Dy') AS dia_corto,
                EXTRACT(ISODOW FROM created_at) AS dia_num,
                COUNT(*) FILTER(WHERE estado='Guardado') AS guardados,
                COUNT(*) FILTER(WHERE estado='Aceptado') AS aceptados,
                COUNT(*) FILTER(WHERE estado='Rechazado') AS rechazados
            FROM presupuestos
            WHERE usuario_id = $1
            AND deleted_at IS NULL
            AND created_at >= NOW() - INTERVAL '7 days'
            GROUP BY dia_num,dia_corto
            ORDER BY dia_num
        )

        SELECT
            (SELECT ROW_TO_JSON(estadisticas) FROM estadisticas) AS stats,
            (SELECT COALESCE(JSON_AGG(actividad), '[]'::json) FROM actividad) AS semanal;
    `;

    const {rows} = await pool.query(query, [usuarioId]);

    const resultado = rows[0];

    return {
        estadisticas: {
            sumaTotal: Number(resultado.stats.suma_total),
            guardados: Number(resultado.stats.guardados),
            aceptados: Number(resultado.stats.aceptados),
            rechazados: Number(resultado.stats.rechazados),
            totalPresupuestos: Number(resultado.stats.total_presupuestos)
        },

        actividadSemanal: resultado.semanal
    };
};

export const getBudgetRepository = async (usuarioId, limit = null, offset = 0) => {
    let query = `
        SELECT
            p.id AS presupuesto_id,
            p.numero,
            p.fecha,
            p.total,
            p.estado,
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,
            STRING_AGG(dp.nombre_item, ', ') AS nombres_items
        FROM presupuestos p
        INNER JOIN clientes c ON p.cliente_id = c.id
        LEFT JOIN detalle_presupuesto dp ON p.id = dp.presupuesto_id
        WHERE p.usuario_id=$1
        AND p.deleted_at IS NULL
        GROUP BY p.id,c.id
        ORDER BY p.created_at DESC
    `;

    const params = [usuarioId];

    // Si se manda límite agregamos paginación
    if (limit !== null) {
        query += `
            LIMIT $2 OFFSET $3
        `;
        params.push(limit, offset);
    }

    const {rows} = await pool.query(query, params);

    return rows;
};