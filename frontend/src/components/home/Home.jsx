"use client";
import React from "react";
import { DateAndImg } from "./components/DateAndImg";
import { TotalActivo } from "./components/TotalActivo";
import { ActividadSemanal } from "./components/ActividadSemanal";
import { ClientesRecientes } from "../ui/ClientesRecientes";
import { useDashboard } from "./hooks/useDashboard";
import { useFiltroPresupuestos } from "./hooks/usePresupuestosLista";

export default function Home() {
  const { data, loading, error, periodo, cambiarPeriodo } = useDashboard();
  const { 
    presupuestos: listaData, 
    paginaActual: pagina, 
    totalPaginas, 
    cambiarPagina, 
    loading: listaLoading 
  } = useFiltroPresupuestos(5);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full max-w-md mx-auto p-4">
        <span className="text-sm text-black/55 font-medium">Cargando dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full max-w-md mx-auto p-4 text-center">
        <span className="text-sm text-red-500 font-medium">{error}</span>
      </div>
    );
  }

  const estadisticas = data?.estadisticas || {};
  const actividadSemanal = data?.actividadSemanal || [];

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-md mx-auto px-4 py-6 flex flex-col justify-between pb-28">
      
      {/* Contenedor general en columna que distribuye el espacio disponible */}
      <div className="flex flex-col gap-4 w-full flex-1">
        
        {/* Perfil / Usuario */}
        <DateAndImg 
          nombre={estadisticas.usuarioNombre} 
          apellido={estadisticas.usuarioApellido}
        />

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
          totalPaginas={totalPaginas}
          cambiarPagina={cambiarPagina}
          loading={listaLoading}
          esVistaCompleta={false} 
        />

      </div>
    </div>
  );
}