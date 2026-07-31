"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useDetallePresupuesto } from "@/hooks/useDetallePresupuesto";
import Loading from "@/components/ui/loading/Loading";
import { BackButton } from "@/components/ui/BackButton";

export default function PresupuestoDetalle({ params }) {
  // Si la ruta dinámica de Next.js pasa el id como params.id (ej: /presupuestos/[id])
  const { id } = params || {};
  const { presupuesto, loading, error } = useDetallePresupuesto(id);

  console.log("Presupuesto: ", presupuesto);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
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
      <div className="flex gap-3 mt-2">
        <button className="flex-1 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-[#0B376D] flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
          <Pencil className="w-5 h-5 text-[#0B376D]" />
          Editar
        </button>
        <button className="flex-1 py-3 bg-white border border-red-200 rounded-2xl font-bold text-red-600 flex items-center justify-center gap-2 shadow-sm hover:bg-red-50 transition-colors">
          <Trash2 className="w-5 h-5 text-red-600" />
          Eliminar
        </button>
      </div>
    </section>
  );
}
