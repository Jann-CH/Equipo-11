"use client";
import Image from "next/image";

export const DateAndImg = ({ nombre, apellido }) => {
  return (
    <div className="w-full h-[64px] bg-white border border-[#DFEAF9] shadow-sm rounded-full px-5 flex items-center justify-between mb-4">
      
      {/* Contenedor unificado: Logo + Nombre */}
      <div className="flex items-center gap-3.5">
        
        {/* Imagen del Logo */}
        <div className="w-11 h-11 relative flex-shrink-0 overflow-hidden rounded-full border border-gray-100 flex items-center justify-center bg-white">
          <Image
            src={"/logo.png"}
            alt="Logo InnovaLab"
            width={44}
            height={44}
            className="object-contain"
            priority
          />
        </div>

        {/* Nombre y Apellido */}
        <div className="flex items-center">
          <span className="text-[#0B376D] text-sm font-semibold block leading-none">
            {nombre || "Agustín"} {apellido || "López"}
          </span>
        </div>
      </div>

      <div></div>
    </div>
  );
};