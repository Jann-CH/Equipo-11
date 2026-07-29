import PDFDocument from "pdfkit";
import axios from "axios";

const AZUL = "#123B5D";
const CELESTE = "#DDEFF8";

const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const date = new Date(fecha);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const dinero = (valor) => {
    return `$ ${Number(valor || 0).toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
};

export const generarPresupuestoPDF = async (presupuesto) => {

    let logoBuffer = null;

    if (presupuesto.logo_url) {
        try {
            const response = await axios.get(presupuesto.logo_url, { responseType: "arraybuffer" });
            logoBuffer = Buffer.from(response.data);
        } catch (error) {
            console.log("Error cargando logo:", error.message);
        }
    }

    return new Promise((resolve) => {

        const doc = new PDFDocument({ size: "A4", margin: 40 });
        const buffers = [];

        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        if (logoBuffer) {
            doc.image(logoBuffer, 40, 40, { width: 130, fit: [130, 60] });
        }

        const bloqueX = 340;
        const bloqueWidth = 160;

        doc
            .fillColor("black")
            .font("Helvetica-Bold")
            .fontSize(24)
            .text("PRESUPUESTO", 300, 45, { width: 220, align: "right" });

        doc
            .fillColor("black")
            .font("Helvetica")
            .fontSize(10)
            .text(`# ${presupuesto.numero || "-"}`, 300, 82, { width: 220, align: "right" });

        doc.text(`Fecha: ${formatearFecha(presupuesto.fecha)}`, bloqueX, 105, { width: bloqueWidth, align: "left" });
        doc.text(`Vencimiento: ${formatearFecha(presupuesto.fecha_vencimiento)}`, bloqueX, 123, { width: bloqueWidth, align: "left" });

        doc
            .fillColor("black")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(presupuesto.nombre_emprendimiento || "Empresa", 40, 150);

        doc
            .fillColor("black")
            .font("Helvetica")
            .fontSize(10)
            .text(`${presupuesto.usuario_nombre || ""} ${presupuesto.usuario_apellido || ""}`, 40, 170)
            .text(`Tel: ${presupuesto.usuario_telefono || "-"}`, 40, 188)
            .text(`Email: ${presupuesto.usuario_email || "-"}`, 40, 206);

        doc
            .fillColor("black")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text("CLIENTE", 40, 250);

        doc
            .fillColor("black")
            .font("Helvetica")
            .fontSize(10)
            .text(`${presupuesto.cliente_nombre || "-"} ${presupuesto.cliente_apellido || ""}`, 40, 270)
            .text(`Tel: ${presupuesto.cliente_telefono || "-"}`, 40, 288)
            .text(`Email: ${presupuesto.cliente_email || "-"}`, 40, 306);

        let y = 350;

        doc.strokeColor("#70B7E8").lineWidth(0.9).moveTo(10, y).lineTo(585, y).stroke();

        y += 15;

        doc
            .fillColor("black")
            .font("Helvetica-Bold")
            .fontSize(9)
            .text("Servicio", 45, y)
            .text("Precio", 280, y)
            .text("Cantidad", 385, y)
            .text("Subtotal", 490, y);

        y += 18;

        doc.strokeColor("#70B7E8").moveTo(40, y).lineTo(535, y).stroke();

        y += 15;

        doc.fillColor("#333").font("Helvetica").fontSize(9);

        presupuesto.detalles.forEach((item) => {
            doc.text(item.nombre_item, 45, y, { width: 220 });
            doc.text(dinero(item.precio_unitario), 280, y);
            doc.text(String(item.cantidad), 402, y);
            doc.text(dinero(item.subtotal), 490, y);
            y += 25;
        });

        doc.strokeColor("#70B7E8").moveTo(10, y).lineTo(585, y).stroke();

        y += 25;

        doc.fillColor(CELESTE).rect(370, y, 170, 35).fill();

        doc
            .fillColor(AZUL)
            .font("Helvetica-Bold")
            .fontSize(13)
            .text("Total:", 380, y + 10);

        doc.text(dinero(presupuesto.total), 470, y + 10);

        doc
            .fillColor("black")
            .font("Helvetica-Bold")
            .fontSize(11)
            .text("Observaciones:", 40, 700);

        doc
            .fillColor("black")
            .font("Helvetica-Bold")
            .fontSize(11)
            .text(presupuesto.observaciones || "Sin observaciones.", 128, 700, { width: 415 });

        doc.end();

    });

};