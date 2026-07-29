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
            c.telefono AS cliente_telefono,
            c.email AS cliente_email,

            u.nombre AS usuario_nombre,
            u.apellido AS usuario_apellido,
            u.telefono AS usuario_telefono,
            u.email AS usuario_email,
            u.nombre_emprendimiento,
            u.logo_url,

            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', dp.id,
                    'item_id', dp.item_id,
                    'nombre_item', dp.nombre_item,
                    'cantidad', dp.cantidad,
                    'precio_unitario', dp.precio_unitario,
                    'subtotal', dp.subtotal
                )
                ORDER BY dp.created_at
            ) AS detalles

        FROM presupuestos p
        JOIN clientes c
            ON p.cliente_id = c.id
        JOIN usuarios u
            ON p.usuario_id = u.id
        LEFT JOIN detalle_presupuesto dp
            ON dp.presupuesto_id = p.id

        WHERE p.id = $1
        AND p.usuario_id = $2
        AND p.deleted_at IS NULL

        GROUP BY
            p.id,
            c.nombre,
            c.apellido,
            c.telefono,
            c.email,
            u.nombre,
            u.apellido,
            u.telefono,
            u.email,
            u.nombre_emprendimiento,
            u.logo_url;
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


export const getDashboardDataRepository = async (usuarioId, periodo = 'semanal') => {
    let filtroFecha = "created_at >= NOW() - INTERVAL '7 days'";
    let agrupacion = "TO_CHAR(created_at, 'Dy')";
    let ordenNumero = "EXTRACT(ISODOW FROM MIN(created_at)) ASC";

    if (periodo === 'diario') {
        filtroFecha = "created_at >= CURRENT_DATE";
        agrupacion = "TO_CHAR(created_at, 'HH24:00')";
        ordenNumero = "MIN(created_at) ASC";
    } else if (periodo === 'mensual') {
        filtroFecha = "created_at >= NOW() - INTERVAL '30 days'";
        agrupacion = "TO_CHAR(created_at, 'DD/MM')";
        ordenNumero = "MIN(created_at) ASC";
    }

    const query = `
        WITH estadisticas AS (
            SELECT
                COALESCE(SUM(p.total), 0) AS suma_total,
                COUNT(p.id) FILTER(WHERE p.estado = 'Guardado') AS guardados,
                COUNT(p.id) FILTER(WHERE p.estado = 'Aceptado') AS aceptados,
                COUNT(p.id) FILTER(WHERE p.estado = 'Rechazado') AS rechazados,
                COUNT(p.id) AS total_presupuestos,
                u.nombre AS usuario_nombre,
                u.apellido AS usuario_apellido
            FROM usuarios u
            LEFT JOIN presupuestos p ON u.id = p.usuario_id AND p.deleted_at IS NULL
            WHERE u.id = $1
            AND u.deleted_at IS NULL
            GROUP BY u.nombre, u.apellido
        ),
        actividad AS (
            SELECT 
                ${agrupacion} AS dia_corto,
                COUNT(*) FILTER (WHERE estado = 'Guardado') AS guardados,
                COUNT(*) FILTER (WHERE estado = 'Aceptado') AS aceptados,
                COUNT(*) FILTER (WHERE estado = 'Rechazado') AS rechazados
            FROM presupuestos
            WHERE usuario_id = $1 
              AND deleted_at IS NULL
              AND ${filtroFecha}
            GROUP BY dia_corto
            ORDER BY ${ordenNumero}
        )
        SELECT
            (SELECT ROW_TO_JSON(estadisticas) FROM estadisticas) AS stats,
            (SELECT COALESCE(JSON_AGG(actividad), '[]'::json) FROM actividad) AS semanal;
    `;

    const { rows } = await pool.query(query, [usuarioId]);
    const resultado = rows[0] || {};
    const statsData = resultado.stats || {};

    return {
        estadisticas: {
            sumaTotal: parseFloat(statsData.suma_total || 0),
            guardados: parseInt(statsData.guardados || 0, 10),
            aceptados: parseInt(statsData.aceptados || 0, 10),
            rechazados: parseInt(statsData.rechazados || 0, 10),
            totalPresupuestos: parseInt(statsData.total_presupuestos || 0, 10),
            usuarioNombre: statsData.usuario_nombre || "",
            usuarioApellido: statsData.usuario_apellido || ""
        },
        actividadSemanal: (resultado.semanal || []).map(row => ({
            dia: row.dia_corto,
            pendientes: parseInt(row.guardados, 10),
            aprobados: parseInt(row.aceptados, 10),
            rechazados: parseInt(row.rechazados, 10)
        }))
    };
};

export const getBudgetRepository = async (usuarioId, limit = null, offset = 0) => {
    let query = `
        SELECT 
            p.id AS presupuesto_id, 
            p.numero,
            p.fecha,
            p.fecha_vencimiento, 
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
        GROUP BY p.id, c.id, c.nombre, c.apellido
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