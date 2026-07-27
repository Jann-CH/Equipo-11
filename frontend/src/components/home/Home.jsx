"use client";
import React from "react";
import { DateAndImg } from "./components/DateAndImg";
import { TotalActivo } from "./components/TotalActivo";
import { ActividadSemanal } from "./components/ActividadSemanal";
import { ClientesRecientes } from "../ui/ClientesRecientes";
import { useDashboard } from "./hooks/useDashboard";

export default function Home() {
  const { data, loading, error, periodo, cambiarPeriodo } = useDashboard();

  // Si está cargando por primera vez o hay un error, puedes mostrar indicadores visuales
  if (loading && !data) {
    return (
      <div className="relative w-[375px] h-[935px] bg-white flex items-center justify-center mx-auto shadow-2xl font-['Lato']">
        <span className="text-sm text-black/50">Cargando dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-[375px] h-[935px] bg-white flex items-center justify-center mx-auto shadow-2xl font-['Lato'] px-4 text-center">
        <span className="text-sm text-red-500">{error}</span>
      </div>
    );
  }

  // Extraemos las propiedades de la respuesta del backend
  const estadisticas = data?.estadisticas || {};
  const actividadSemanal = data?.actividadSemanal || [];

  return (
    <div className="relative w-[375px] h-[935px] bg-white overflow-hidden mx-auto shadow-2xl font-['Lato']">
      {/* Perfil / Usuario */}
      <DateAndImg />

      {/* Tarjeta Principal: Total Activo */}

      <TotalActivo 
        sumaTotal={estadisticas.sumaTotal}
        totalPresupuestos={estadisticas.totalPresupuestos}
        aceptados={estadisticas.aceptados}
        rechazados={estadisticas.rechazados}
      />

      {/* Actividad Semanal (Gráfico) */}

      <ActividadSemanal 
        actividadSemanal={actividadSemanal}
        periodo={periodo}
        cambiarPeriodo={cambiarPeriodo}
      />

      {/* Sección Recientes & Lista */}
      <ClientesRecientes 
        presupuestos={listaData || []} 
        paginaActual={pagina}
        cambiarPagina={cambiarPagina}
        loading={listaLoading}
        esVistaCompleta={false} 
      />
    </div>
  );
}
