"use client";

import React from 'react';

export const ActividadSemanal = ({ actividadSemanal = [], periodo, cambiarPeriodo }) => {
  return (
    <div className="w-full bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.06)] rounded-[20px] p-5 flex flex-col justify-between mb-4">
      
      {/* Cabecera: Título y Ver más */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[#0B376D] text-lg font-bold">
          Actividad semanal
        </span>
        <span className="text-[#2E7D5B] text-[13px] font-bold cursor-pointer hover:underline">
          Ver más
        </span>
      </div>

      {/* Filtros superiores interactivos (Diario, Semanal, Mensual) */}
      <div className="w-full bg-gray-50 p-1.5 rounded-[12px] flex items-center justify-between mb-5 border border-gray-100">
        <button 
          onClick={() => cambiarPeriodo('diario')}
          className={`flex-1 text-xs py-2 rounded-[9px] transition-all font-medium ${periodo === 'diario' ? 'bg-[#013364] text-white font-semibold shadow-sm' : 'text-black/60 hover:text-black'}`}
        >
          Diario
        </button>
        <button 
          onClick={() => cambiarPeriodo('semanal')}
          className={`flex-1 text-xs py-2 rounded-[9px] transition-all font-medium ${periodo === 'semanal' ? 'bg-[#013364] text-white font-semibold shadow-sm' : 'text-black/60 hover:text-black'}`}
        >
          Semanal
        </button>
        <button 
          onClick={() => cambiarPeriodo('mensual')}
          className={`flex-1 text-xs py-2 rounded-[9px] transition-all font-medium ${periodo === 'mensual' ? 'bg-[#013364] text-white font-semibold shadow-sm' : 'text-black/60 hover:text-black'}`}
        >
          Mensual
        </button>
      </div>

      {/* Gráfico de Barras */}
      <div className="flex justify-around items-end h-[120px] px-2 mb-4 border-b border-gray-100 pb-4">
        {actividadSemanal.length > 0 ? (
          actividadSemanal.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="flex items-end gap-1.5 h-[85px]">
                {/* Barra Aprobados */}
                <div 
                  style={{ height: `${Math.max(Math.min(item.aprobados * 8, 75), 4)}px` }}
                  className="w-[7px] bg-[#013364] rounded-t-[4px]"
                  title={`Aprobados: ${item.aprobados}`}
                ></div>
                {/* Barra Pendientes */}
                <div 
                  style={{ height: `${Math.max(Math.min(item.pendientes * 8, 75), 4)}px` }}
                  className="w-[7px] bg-[#4D7093] rounded-t-[4px]"
                  title={`Pendientes: ${item.pendientes}`}
                ></div>
                {/* Barra Rechazados */}
                <div 
                  style={{ height: `${Math.max(Math.min(item.rechazados * 8, 75), 4)}px` }}
                  className="w-[7px] bg-[#B3C2D0] rounded-t-[4px]"
                  title={`Rechazados: ${item.rechazados}`}
                ></div>
              </div>
              <span className="text-xs text-black/50 font-semibold">{item.dia}</span>
            </div>
          ))
        ) : (
          <span className="text-xs text-black/30 m-auto">Sin actividad registrada</span>
        )}
      </div>

      {/* Leyenda inferior */}
      <div className="flex justify-center items-center gap-6 text-xs text-black/60 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#013364] rounded-[3px]"></div>
          <span>Aprobados</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#4D7093] rounded-[3px]"></div>
          <span>Pendientes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#B3C2D0] rounded-[3px]"></div>
          <span>Rechazados</span>
        </div>
      </div>

    </div>
  );
};