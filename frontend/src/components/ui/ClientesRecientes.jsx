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
    <div className={`bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.10)] overflow-hidden rounded-[10px] p-4 flex flex-col justify-between ${
      esVistaCompleta ? "w-full min-h-[500px]" : "absolute w-[364px] h-[340px] left-[6px] top-[525px]"
    }`}>
      
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-black/60 text-lg font-semibold leading-[26px]">
          {esVistaCompleta ? "Todos los Presupuestos" : "Presupuestos Recientes"}
        </span>
        
        {/* Si NO es la vista completa, mostramos el link "Ver más" para ir a la otra pantalla */}
        {!esVistaCompleta && (
          <Link href="/historial" className="text-[#4D8F72] text-[13px] font-extrabold cursor-pointer hover:underline">
            Ver más
          </Link>
        )}
      </div>

      {/* Lista de Presupuestos */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1 my-2">
        {loading ? (
          <p className="text-center text-black/40 text-xs py-10">Cargando...</p>
        ) : presupuestos.length > 0 ? (
          presupuestos.map((item) => (
            <div 
              key={item.presupuesto_id} 
              className="flex justify-between items-center bg-[#F4F7FC] p-3 rounded-[8px] text-xs"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-[#013364] text-sm">
                  {item.cliente_nombre} {item.cliente_apellido}
                </span>
                <span className="text-black/50 text-[11px] truncate max-w-[180px]">
                  {item.nombres_items || "Sin items"}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-extrabold text-black text-sm">
                  ${parseFloat(item.total || 0).toLocaleString()}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  item.estado === 'Aceptado' ? 'bg-green-100 text-green-700' :
                  item.estado === 'Rechazado' ? 'bg-red-100 text-red-700' : 
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.estado}
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
      <div className="flex justify-between items-center text-xs text-black/50 pt-3 border-t border-gray-100">
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