"use client";

import React from 'react';

export const ActividadSemanal = ({ actividadSemanal = [], periodo, cambiarPeriodo }) => {
  return (
    <div className="w-full bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.10)] rounded-[14px] p-4 flex flex-col justify-between">
      
      {/* Cabecera: Título y Ver más */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-black/80 text-lg font-semibold">
          Actividad semanal
        </span>
        <span className="text-[#4D8F72] text-[13px] font-extrabold cursor-pointer hover:underline">
          Ver más
        </span>
      </div>

      {/* Filtros superiores interactivos (Diario, Semanal, Mensual) */}
      <div className="w-full bg-gray-50 p-1 rounded-[10px] flex items-center justify-between mb-4 border border-gray-100">
        <button 
          onClick={() => cambiarPeriodo('diario')}
          className={`flex-1 text-xs py-1.5 rounded-[8px] transition-all font-medium ${periodo === 'diario' ? 'bg-[#013364] text-white font-semibold shadow-sm' : 'text-black/60'}`}
        >
          Diario
        </button>
        <button 
          onClick={() => cambiarPeriodo('semanal')}
          className={`flex-1 text-xs py-1.5 rounded-[8px] transition-all font-medium ${periodo === 'semanal' ? 'bg-[#013364] text-white font-semibold shadow-sm' : 'text-black/60'}`}
        >
          Semanal
        </button>
        <button 
          onClick={() => cambiarPeriodo('mensual')}
          className={`flex-1 text-xs py-1.5 rounded-[8px] transition-all font-medium ${periodo === 'mensual' ? 'bg-[#013364] text-white font-semibold shadow-sm' : 'text-black/60'}`}
        >
          Mensual
        </button>
      </div>

      {/* Gráfico de Barras */}
      <div className="flex justify-between items-end h-[100px] px-2 mb-4 border-b border-gray-100 pb-3">
        {actividadSemanal.length > 0 ? (
          actividadSemanal.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="flex items-end gap-1 h-[70px]">
                {/* Barra Aprobados */}
                <div 
                  style={{ height: `${Math.max(Math.min(item.aprobados * 8, 60), 4)}px` }}
                  className="w-[6px] bg-[#013364] rounded-t-[4px]"
                  title={`Aprobados: ${item.aprobados}`}
                ></div>
                {/* Barra Pendientes */}
                <div 
                  style={{ height: `${Math.max(Math.min(item.pendientes * 8, 60), 4)}px` }}
                  className="w-[6px] bg-[#4D7093] rounded-t-[4px]"
                  title={`Pendientes: ${item.pendientes}`}
                ></div>
                {/* Barra Rechazados */}
                <div 
                  style={{ height: `${Math.max(Math.min(item.rechazados * 8, 60), 4)}px` }}
                  className="w-[6px] bg-[#B3C2D0] rounded-t-[4px]"
                  title={`Rechazados: ${item.rechazados}`}
                ></div>
              </div>
              <span className="text-[11px] text-black/50 font-medium">{item.dia}</span>
            </div>
          ))
        ) : (
          <span className="text-xs text-black/30 m-auto">Sin actividad registrada</span>
        )}
      </div>

      {/* Leyenda inferior */}
      <div className="flex justify-center items-center gap-6 text-xs text-black/60">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#013364] rounded-[2px]"></div>
          <span>Aprobados</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#4D7093] rounded-[2px]"></div>
          <span>Pendientes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#B3C2D0] rounded-[2px]"></div>
          <span>Rechazados</span>
        </div>
      </div>

    </div>
  );
};