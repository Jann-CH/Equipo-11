"use client";

import React from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const ActividadSemanal = ({ actividadSemanal = [], periodo, cambiarPeriodo }) => {
  // 1. Definimos los días base en orden de la semana y su etiqueta en español
  const estructuraSemana = [
    { keyEn: "Mon", keyEs: "Lun" },
    { keyEn: "Tue", keyEs: "Mar" },
    { keyEn: "Wed", keyEs: "Mié" },
    { keyEn: "Thu", keyEs: "Jue" },
    { keyEn: "Fri", keyEs: "Vie" },
    { keyEn: "Sat", keyEs: "Sáb" },
    { keyEn: "Sun", keyEs: "Dom" },
  ];

  // 2. Mapeamos los datos para asegurar que los 7 días estén presentes siempre
  const datosCompletos = estructuraSemana.map((diaObj) => {
    // Buscamos si la API trajo datos para este día (coincidiendo en inglés o español)
    const encontrado = actividadSemanal.find(
      (item) => 
        item.dia?.toLowerCase() === diaObj.keyEn.toLowerCase() || 
        item.dia?.toLowerCase() === diaObj.keyEs.toLowerCase()
    );

    return {
      dia: diaObj.keyEs,
      aprobados: encontrado ? encontrado.aprobados : 0,
      pendientes: encontrado ? encontrado.pendientes : 0,
      rechazados: encontrado ? encontrado.rechazados : 0,
    };
  });

  return (
    <div className="w-full bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.06)] rounded-[20px] p-5 flex flex-col justify-between mb-4">
      
      {/* Cabecera: Título y Ver más */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[#0B376D] text-lg font-bold">
          Actividad semanal
        </span>
        <Link
          href="/dashboard/modo-dashboard" 
          className="text-[#2E7D5B] text-[13px] font-bold cursor-pointer hover:underline"
        >
          Ver más
        </Link>
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

      {/* Gráfico de Barras con Recharts (Muestra siempre los 7 días) */}
      <div className="h-[140px] w-full mb-4 border-b border-gray-100 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datosCompletos} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="dia" stroke="#9ca3af" fontSize={11} tickLine={false} />
            <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderColor: "#e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="aprobados" name="Aprobados" fill="#013364" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pendientes" name="Pendientes" fill="#4D7093" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rechazados" name="Rechazados" fill="#B3C2D0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
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