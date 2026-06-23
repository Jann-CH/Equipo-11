import pool from "../database/connection.js";
import { uploadPresupuestoService } from "./files.service.js";

export const createPresupuestoCompletoService = async ({ usuarioId, clienteId, fechaVencimiento, estado, detalles }, file, nombreEmprendimiento) => {
    if (!detalles || detalles.length === 0) {
        throw new Error("No podés generar un presupuesto sin detalles o ítems cargados");
    }

    // 1. Calcular de manera exacta subtotales y totales en el Backend
    let subtotalCalculado = 0;
    const detallesProcesados = detalles.map(det => {
        const itemSubtotal = Number(det.cantidad) * Number(det.precio_unitario);
        subtotalCalculado += itemSubtotal;
        return { ...det, subtotal: itemSubtotal };
    });
    const totalCalculado = subtotalCalculado;

    // 2. Control del archivo PDF de Cloudinary 
    let pdfUrl = null;
    if (file) {
        const uploadResult = await uploadPresupuestoService(file.path, nombreEmprendimiento);
        pdfUrl = uploadResult.url;
    }

    // 3. Inicio del bloque transaccional ACID
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const insertPresupuestoQuery = `
            INSERT INTO presupuestos (usuario_id, cliente_id, fecha_vencimiento, subtotal, total, estado, pdf_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, fecha_creacion, subtotal, total, estado, pdf_url;
        `;
        const pResult = await client.query(insertPresupuestoQuery, [
            usuarioId, clienteId, fechaVencimiento, subtotalCalculado, totalCalculado, estado || 'Borrador', pdfUrl
        ]);
        
        const nuevoPresupuesto = pResult.rows[0];

        const insertDetalleQuery = `
            INSERT INTO detalle_presupuesto (presupuesto_id, item_id, cantidad, precio_unitario, subtotal)
            VALUES ($1, $2, $3, $4, $5);
        `;

        for (const det of detallesProcesados) {
            await client.query(insertDetalleQuery, [
                nuevoPresupuesto.id, det.item_id, det.cantidad, det.precio_unitario, det.subtotal
            ]);
        }

        await client.query("COMMIT");
        return { ...nuevoPresupuesto, detalles: detallesProcesados };

    } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Falla crítica en la transacción: ${error.message}`);
    } finally {
        client.release();
    }
};