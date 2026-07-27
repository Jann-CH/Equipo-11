"use client";

import React from 'react';

export const ActividadSemanal = ({ actividadSemanal = [], periodo, cambiarPeriodo }) => {
  return (
    <>
      {/* Actividad Semanal (Gráfico) */}
      <div className="absolute w-[364px] h-[214px] left-[6px] top-[299px] bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.10)] overflow-hidden rounded-[10px]">
        <div className="absolute w-[154px] h-[31px] left-[12px] top-[10px]">
          <div className="absolute left-0 top-0 text-black/20 text-lg font-semibold leading-[26px]">
            Actividad
          </div>
        </div>
        <div className="absolute left-[305px] top-[16px] text-[#4D8F72] text-[13px] font-extrabold leading-5 cursor-pointer">
          Ver más
        </div>

        {/* Renderizado dinámico de barras según los datos del backend */}
        <div className="absolute inset-0 top-[80px] px-4 flex justify-around items-end h-[60px]">
          {actividadSemanal.length > 0 ? (
            actividadSemanal.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div className="flex items-end gap-[2px] h-[45px]">
                  {/* Barra Aprobados */}
                  <div 
                    style={{ height: `${Math.min(item.aprobados * 10, 40)}px` }}
                    className="w-[7px] bg-[#013364] rounded-t-[10px]"
                    title={`Aprobados: ${item.aprobados}`}
                  ></div>
                  {/* Barra Pendientes */}
                  <div 
                    style={{ height: `${Math.min(item.pendientes * 10, 40)}px` }}
                    className="w-[7px] bg-[#4D7093] rounded-t-[10px]"
                    title={`Pendientes: ${item.pendientes}`}
                  ></div>
                  {/* Barra Rechazados */}
                  <div 
                    style={{ height: `${Math.min(item.rechazados * 10, 40)}px` }}
                    className="w-[7px] bg-[#B3C2D0] rounded-t-[10px]"
                    title={`Rechazados: ${item.rechazados}`}
                  ></div>
                </div>
                {/* Etiqueta del día / fecha */}
                <span className="text-[10px] text-black/40">{item.dia}</span>
              </div>
            ))
          ) : (
            <span className="text-xs text-black/30">Sin actividad registrada</span>
          )}
        </div>

        {/* Leyenda */}
        <div className="absolute w-[9px] h-[9px] left-[31px] top-[177px] bg-[#013364] rounded-[2px]"></div>
        <div className="absolute w-[9px] h-[9px] left-[125px] top-[177px] bg-[#4D7093] rounded-[2px]"></div>
        <div className="absolute w-[9px] h-[9px] left-[219px] top-[177px] bg-[#B3C2D0] rounded-[2px]"></div>
        <div className="absolute left-[45px] top-[171px] text-black/20 text-[13px]">
          Aprobados
        </div>
        <div className="absolute left-[139px] top-[171px] text-black/20 text-[13px]">
          Pendientes
        </div>
        <div className="absolute left-[233px] top-[171px] text-black/20 text-[13px]">
          Rechazados
        </div>

        {/* Filtros superiores interactivos */}
        <div className="absolute w-[352px] h-[28px] left-[6px] top-[41px] bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.10)] overflow-hidden rounded-[10px] flex items-center justify-around px-2">
          <button 
            onClick={() => cambiarPeriodo('diario')}
            className={`text-[13px] px-3 py-1 rounded-[8px] transition-all ${periodo === 'diario' ? 'bg-[#013364] text-white font-semibold' : 'text-black'}`}
          >
            Diario
          </button>
          <button 
            onClick={() => cambiarPeriodo('semanal')}
            className={`text-[13px] px-3 py-1 rounded-[8px] transition-all ${periodo === 'semanal' ? 'bg-[#013364] text-white font-semibold' : 'text-black'}`}
          >
            Semanal
          </button>
          <button 
            onClick={() => cambiarPeriodo('mensual')}
            className={`text-[13px] px-3 py-1 rounded-[8px] transition-all ${periodo === 'mensual' ? 'bg-[#013364] text-white font-semibold' : 'text-black'}`}
          >
            Mensual
          </button>
        </div>
      </div>
    </>
  );
};