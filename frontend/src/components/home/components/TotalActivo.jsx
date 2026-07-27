"use client";

import React from 'react';

export const TotalActivo = ({ 
  sumaTotal = 0, 
  totalPresupuestos = 0, 
  aceptados = 0, 
  rechazados = 0 
}) => {
  return (
    <>
      {/* Tarjeta Principal: Total Activo */}
      <div className="absolute w-[361px] h-[145px] left-[6px] top-[142px] bg-gradient-to-t from-black/20 to-black/20 bg-[#013364] shadow-[0px_4px_16px_rgba(0,31,77,0.10)] rounded-[10px]">
        <div className="absolute w-[129px] h-[59px] left-[15px] top-[14px]">
          <div className="absolute w-[129px] left-0 top-0 text-white/70 text-sm font-normal leading-[22px]">
            Total activo este mes
          </div>
          <div className="absolute w-[129px] left-0 top-[28px] text-center text-white text-2xl font-bold leading-8">
            ${sumaTotal.toLocaleString()}
          </div>
        </div>
        <div className="absolute w-[148px] left-[33px] top-[77px] text-white/70 text-sm font-normal leading-[22px]">
          12 % vs el mes anterior
        </div>
        <div className="absolute w-[14px] h-[14px] left-[15px] top-[81px]">
          <div className="absolute w-[7.58px] h-[8.26px] left-[2.92px] top-[3.41px] bg-white/70"></div>
        </div>
        
        {/* Chips de estadísticas (Presupuestos, Aceptados, Rechazados) */}
        <div className="absolute w-[100px] h-[20px] left-[19px] top-[111px] bg-[#718EBF]/50 rounded-[6px]">
          <div className="absolute left-[7px] top-0 text-[#E7EBF4]/80 text-[11px] font-normal leading-5">
            Presupuestos
          </div>
          <div className="absolute left-[78px] top-0 text-white text-[13px] font-bold leading-5">
            {totalPresupuestos}
          </div>
        </div>
        <div className="absolute w-[91px] h-[20px] left-[137px] top-[111px] bg-[#718EBF]/50 rounded-[6px]">
          <div className="absolute left-[7px] top-0 text-[#E7EBF4]/80 text-[11px] font-normal leading-5">
            Aceptados
          </div>
          <div className="absolute left-[68px] top-0 text-white text-[13px] font-bold leading-5">
            {aceptados}
          </div>
        </div>
        <div className="absolute w-[95px] h-[20px] left-[246px] top-[111px] bg-[#718EBF]/50 rounded-[6px]">
          <div className="absolute left-[7px] top-0 text-[#E7EBF4]/80 text-[11px] font-normal leading-5">
            Rechazados
          </div>
          <div className="absolute left-[74px] top-0 text-white text-[13px] font-bold leading-5">
            {rechazados}
          </div>
        </div>
      </div>
    </>
  );
};