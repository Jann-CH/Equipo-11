"use client";

import React from 'react';

export const TotalActivo = ({ 
  sumaTotal = 0, 
  totalPresupuestos = 0, 
  aceptados = 0, 
  rechazados = 0 
}) => {
  return (
    <div className="w-full bg-[#013364] bg-gradient-to-t from-black/10 to-black/10 shadow-[0px_4px_16px_rgba(0,31,77,0.10)] rounded-[14px] p-4 text-white flex flex-col justify-between">
      {/* Parte superior: Título y Monto */}
      <div>
        <span className="text-white/70 text-sm font-normal block">
          Total activo este mes
        </span>
        <div className="text-white text-2xl font-bold mt-1">
          ${sumaTotal.toLocaleString()}
        </div>
      </div>

      {/* Porcentaje vs mes anterior */}
      <div className="flex items-center gap-1.5 text-white/70 text-sm my-3">
        <span>↑</span>
        <span>12 % vs el mes anterior</span>
      </div>

      {/* Chips de estadísticas (Presupuestos, Aceptados, Rechazados) */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="bg-[#718EBF]/40 rounded-[8px] px-2 py-1.5 flex items-center justify-between">
          <span className="text-[#E7EBF4]/80 text-[11px] font-normal">Presupuestos</span>
          <span className="text-white text-[13px] font-bold">{totalPresupuestos}</span>
        </div>
        <div className="bg-[#718EBF]/40 rounded-[8px] px-2 py-1.5 flex items-center justify-between">
          <span className="text-[#E7EBF4]/80 text-[11px] font-normal">Aceptados</span>
          <span className="text-white text-[13px] font-bold">{aceptados}</span>
        </div>
        <div className="bg-[#718EBF]/40 rounded-[8px] px-2 py-1.5 flex items-center justify-between">
          <span className="text-[#E7EBF4]/80 text-[11px] font-normal">Rechazados</span>
          <span className="text-white text-[13px] font-bold">{rechazados}</span>
        </div>
      </div>
    </div>
  );
};