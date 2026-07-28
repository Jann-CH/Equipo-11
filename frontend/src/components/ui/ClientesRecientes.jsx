"use client";

import React from 'react';
import Link from 'next/link';

export const ClientesRecientes = ({ 
  presupuestos = [], 
  paginaActual = 1, 
  totalPaginas = 1, 
  cambiarPagina, 
  loading = false,
  esVistaCompleta = false 
}) => {
  return (
    <div className={`bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.10)] rounded-[14px] p-4 flex flex-col justify-between w-full ${
      esVistaCompleta ? "min-h-[500px]" : "min-h-[340px]"
    }`}>
      
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-black/80 text-lg font-semibold">
          {esVistaCompleta ? "Todos los Presupuestos" : "Recientes"}
        </span>
        
        {!esVistaCompleta && (
          <Link href="/historial" className="text-[#4D8F72] text-[13px] font-extrabold cursor-pointer hover:underline">
            Ver más
          </Link>
        )}
      </div>

      {/* Lista de Presupuestos */}
      <div className="flex flex-col gap-2.5 overflow-y-auto flex-1 my-1">
        {loading ? (
          <p className="text-center text-black/40 text-xs py-10">Cargando...</p>
        ) : presupuestos.length > 0 ? (
          presupuestos.map((item) => (
            <div 
              key={item.presupuesto_id} 
              className="flex justify-between items-center bg-[#F8FAFC] border border-gray-100 p-3 rounded-[10px] text-xs"
            >
              <div className="flex items-center gap-3">
                {/* Iniciales o Avatar simulado con las letras del cliente */}
                <div className="w-10 h-10 rounded-full bg-[#013364] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {item?.cliente_nombre ? item.cliente_nombre.substring(0, 2).toUpperCase() : "CL"}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-[#013364] text-sm truncate max-w-[140px]">
                    {item?.cliente_nombre ?? "Cliente"} {item?.cliente_apellido ?? ""}
                  </span>
                  <span className="text-black/40 text-[11px]">
                    {item.nombres_items || `#P-${item.presupuesto_id || '0040'}`}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="font-extrabold text-black text-sm">
                  ${parseFloat(item.total || 0).toLocaleString()}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  item.estado === 'Aceptado' || item.estado === 'Aprobado' ? 'bg-green-100 text-green-700' :
                  item.estado === 'Rechazado' ? 'bg-red-100 text-red-700' : 
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  ● {item.estado}
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
      <div className="flex justify-between items-center text-xs text-black/50 pt-3 border-t border-gray-100 mt-2">
        <span>Página {paginaActual} {esVistaCompleta && `de ${totalPaginas}`}</span>
        <div className="flex gap-2">
          <button 
            onClick={() => cambiarPagina(Math.max(paginaActual - 1, 1))}
            disabled={paginaActual === 1 || loading}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-40 transition"
          >
            Anterior
          </button>
          <button 
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={(esVistaCompleta && paginaActual >= totalPaginas) || (presupuestos.length === 0) || loading}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-40 transition"
          >
            Siguiente
          </button>
        </div>
      </div>

    </div>
  );
};