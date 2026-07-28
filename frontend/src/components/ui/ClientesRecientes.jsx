"use client";

import React from "react";
import Link from "next/link";

export const ClientesRecientes = ({
  presupuestos = [],
  paginaActual = 1,
  totalPaginas = 1,
  cambiarPagina,
  loading = false,
  esVistaCompleta = false,
}) => {
  return (
    <div
      className={`bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.06)] rounded-[20px] p-5 flex flex-col justify-between w-full ${
        esVistaCompleta ? "min-h-[500px]" : "min-h-[340px]"
      }`}
    >
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[#0B376D] text-lg font-bold">
          {esVistaCompleta ? "Todos los Presupuestos" : "Recientes"}
        </span>

        {!esVistaCompleta && (
          <Link
            href="/home/historial"
            className="text-[#2E7D5B] text-[13px] font-bold cursor-pointer hover:underline"
          >
            Ver más
          </Link>
        )}
      </div>

      {/* Lista de Presupuestos */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1 my-1">
        {loading ? (
          <p className="text-center text-black/40 text-xs py-10">Cargando...</p>
        ) : presupuestos.length > 0 ? (
          presupuestos.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white border border-gray-100 shadow-sm p-4 rounded-[16px] transition-all hover:shadow-md"
            >
              {/* Lado izquierdo: Avatar y Datos del cliente */}
              <div className="flex items-center gap-3.5">
                {/* Avatar iniciales */}
                <div className="w-12 h-12 rounded-full bg-[#0B376D] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-inner">
                  {item?.cliente_nombre
                    ? `${item.cliente_nombre[0]}${item?.cliente_apellido ? item.cliente_apellido[0] : ''}`.toUpperCase()
                    : "CL"}
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-[#0B376D] text-base truncate max-w-[160px]">
                    {item?.cliente_nombre ?? "Cliente"}{" "}
                    {item?.cliente_apellido ?? ""}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-black/50 font-medium">
                      {item.numero || `#P-${item.id.substring(0, 4)}`}
                    </span>
                    <span className="text-[#2E7D5B] font-medium">
                      {item.fecha_vencimiento ? "Vence en 28 días" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lado derecho: Estado y Monto */}
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                    item.estado === "Aceptado" || item.estado === "Aprobado"
                      ? "bg-[#E8F5E9] text-[#2E7D5B]"
                      : item.estado === "Rechazado"
                        ? "bg-[#FFEBEE] text-[#C62828]"
                        : "bg-[#FFF8E1] text-[#F57F17]" // Naranja para Pendiente / Guardado
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {/* Si en la DB está como "Guardado", se muestra como "Pendiente" */}
                  {item.estado === "Guardado" ? "Pendiente" : item.estado}
                </span>

                <span className="font-extrabold text-[#0B376D] text-base tracking-tight">
                  ${parseFloat(item.total || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-black/40 text-xs py-10">
            No hay presupuestos registrados
          </div>
        )}
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center text-xs text-black/50 pt-4 border-t border-gray-100 mt-2">
        <span className="font-medium">
          Página {paginaActual} {esVistaCompleta && `de ${totalPaginas}`}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => cambiarPagina(Math.max(paginaActual - 1, 1))}
            disabled={paginaActual === 1 || loading}
            className="px-3.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 font-medium transition"
          >
            Anterior
          </button>
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={
              (esVistaCompleta && paginaActual >= totalPaginas) ||
              presupuestos.length === 0 ||
              loading
            }
            className="px-3.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 font-medium transition"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};