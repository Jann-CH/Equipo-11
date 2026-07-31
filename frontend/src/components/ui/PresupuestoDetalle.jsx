"use client";

import { useDetallePresupuesto } from "@/hooks/useDetallePresupuesto";
import Loading from "@/components/ui/loading/Loading";
import Spinner from "@/components/ui/loading/Spinner";
import { BackButton } from "@/components/ui/BackButton";
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  Loader2,
} from "lucide-react";

export default function PresupuestoDetalle({ params }) {
  // Si la ruta dinámica de Next.js pasa el id como params.id (ej: /presupuestos/[id])
  const { id } = params || {};
  const { presupuesto, loading, error, actualizandoEstado, cambiarEstado } =
    useDetallePresupuesto(id);

  const ESTADOS_VALIDOS = [
    "Borrador",
    "Guardado",
    "Enviado",
    "Aceptado",
    "Rechazado",
  ];
  // Función auxiliar para retornar el icono según el estado actual
  const obtenerIconoEstado = (estado) => {
    const props = { className: "w-3.5 h-3.5" };

    switch (estado) {
      case "Aceptado":
      case "Aprobado":
        return <CheckCircle2 {...props} />;
      case "Rechazado":
        return <XCircle {...props} />;
      case "Enviado":
        return <Send {...props} />;
      case "Guardado":
        return <Clock {...props} />;
      case "Borrador":
      default:
        return <FileText {...props} />;
    }
  };

  if (loading) {
    return <Loading text={"Cargando detalle de presupuesto..."} />;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!presupuesto) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No se encontró el presupuesto</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pb-24 p-4 max-w-md mx-auto flex flex-col gap-4">
      {/* Cabecera */}
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-xl font-bold text-[#0B376D]">Presupuesto</h1>
      </div>

      {/* Tarjeta Principal / Info del Cliente */}
      <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-[20px] flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {/* Avatar iniciales */}
            <div className="w-12 h-12 rounded-full bg-[#0B376D] text-white flex items-center justify-center font-bold text-sm shadow-inner">
              {presupuesto?.cliente_nombre
                ? `${presupuesto.cliente_nombre[0]}${presupuesto?.cliente_apellido ? presupuesto.cliente_apellido[0] : ""}`.toUpperCase()
                : "CL"}
            </div>
            <div>
              <h2 className="font-bold text-[#0B376D] text-lg">
                {presupuesto?.cliente_nombre ?? "Cliente"}{" "}
                {presupuesto?.cliente_apellido ?? ""}
              </h2>
              <span className="text-sm text-gray-500 font-medium">
                {presupuesto.numero || `#P-${presupuesto.id?.substring(0, 4)}`}
              </span>
            </div>
          </div>

          {/* Estado */}
          <span
            className={`text-[11px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${
              presupuesto.estado === "Aceptado" ||
              presupuesto.estado === "Aprobado"
                ? "bg-[#E8F5E9] text-[#4CAF50]"
                : presupuesto.estado === "Rechazado"
                  ? "bg-[#FFEBEE] text-[#C62828]"
                  : "bg-[#FFF8E1] text-[#FFC107]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {presupuesto.estado === "Guardado"
              ? "Pendiente"
              : presupuesto.estado}
          </span>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex flex-col items-center text-center">
            <span className="text-xs text-gray-400 font-medium">
              Fecha de creación
            </span>
            <span className="text-sm font-bold text-[#0B376D] mt-0.5">
              {presupuesto.fecha
                ? new Date(presupuesto.fecha).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex flex-col items-center text-center">
            <span className="text-xs text-gray-400 font-medium">Vence en</span>
            <span className="text-sm font-bold text-[#0B376D] mt-0.5">
              {presupuesto.fecha_vencimiento
                ? new Date(presupuesto.fecha_vencimiento).toLocaleDateString(
                    "es-AR",
                    { day: "2-digit", month: "long", year: "numeric" },
                  )
                : "-"}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-lg font-semibold text-[#0B376D]">Total:</span>
          <span className="text-2xl font-bold text-[#0B376D]">
            ${" "}
            {parseFloat(presupuesto.total || 0).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Lista de Detalles / Ítems */}
        <div className="flex flex-col gap-2 pt-2">
          <h3 className="text-center font-bold text-sm text-[#0B376D] tracking-wider uppercase">
            Detalles
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            {presupuesto.detalles && presupuesto.detalles.length > 0 ? (
              presupuesto.detalles.map((detalle) => (
                <div
                  key={detalle.id}
                  className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex flex-col gap-1"
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-[#0B376D] text-base">
                      {detalle.nombre_item}
                    </strong>
                    <span className="font-extrabold text-[#0B376D]">
                      ${" "}
                      {parseFloat(detalle.subtotal || 0).toLocaleString(
                        "es-AR",
                        { minimumFractionDigits: 2 },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Cantidad: {detalle.cantidad}</span>
                    <span>
                      Precio unit.: ${" "}
                      {parseFloat(detalle.precio_unitario || 0).toLocaleString(
                        "es-AR",
                        { minimumFractionDigits: 2 },
                      )}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                Sin ítems especificados
              </p>
            )}
          </div>
        </div>

        {/* Observación */}
        <div className="flex flex-col gap-1 pt-2">
          <span className="font-bold text-sm text-[#0B376D]">Observación:</span>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            {presupuesto.observaciones || "Sin observaciones."}
          </p>
        </div>
      </div>

      {/* Botones de acción inferior */}
      <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-[20px] flex flex-col gap-2">
        <h3 className="font-bold text-sm text-[#0B376D]">Actualizar estado</h3>

        {/* Contenedor relativo para posicionar el spinner adentro */}
        <div className="relative flex items-center">
          <select
            value={presupuesto.estado}
            onChange={(e) => cambiarEstado(e.target.value)}
            disabled={actualizandoEstado}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 pr-10 text-xs bg-gray-50 text-[#0B376D] font-medium focus:outline-none focus:ring-2 focus:ring-[#0B376D]/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {ESTADOS_VALIDOS.map((est) => (
              <option key={est} value={est}>
                {est === "Guardado" ? "Guardado (Pendiente)" : est}
              </option>
            ))}
          </select>

          {/* Spinner posicionado absolutamente a la derecha del select */}
          {actualizandoEstado && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded-xl pointer-events-none">
              <Spinner className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
