"use client";
import React from "react";
import { DateAndImg } from "./components/DateAndImg";
import { TotalActivo } from "./components/TotalActivo";
import { ActividadSemanal } from "./components/ActividadSemanal";
import { ClientesRecientes } from "@/components/ui/ClientesRecientes";
import { useDashboard } from "./hooks/useDashboard";
import { useFiltroPresupuestos } from "./hooks/usePresupuestosLista";
import Loading from "@/components/ui/loading/Loading";

export default function Home() {
  const { data, loading, error, periodo, cambiarPeriodo } = useDashboard();

  const {
    presupuestos: listaData,
    paginaActual: pagina,
    totalPaginas,
    cambiarPagina,
    loading: listaLoading,
  } = useFiltroPresupuestos(5);

  if (loading && !data) {
    return <Loading text="Cargando inicio..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full px-4 text-center">
        <span className="text-sm text-red-500 font-medium">{error}</span>
      </div>
    );
  }

  const estadisticas = data?.estadisticas || {};
  const actividadSemanal = data?.actividadSemanal || [];

  return (
    <>
      {/* Quitamos max-w-xl/md y usamos w-full con un padding lateral fluido (px-4 o px-5) */}

      <div className="min-h-screen bg-gray-50 pb-24 p-4 max-w-md mx-auto">
       
          <DateAndImg
            nombre={estadisticas.usuarioNombre}
            apellido={estadisticas.usuarioApellido}
          />

          <TotalActivo
            sumaTotal={estadisticas.sumaTotal}
            totalPresupuestos={estadisticas.totalPresupuestos}
            aceptados={estadisticas.aceptados}
            rechazados={estadisticas.rechazados}
          />

          <ActividadSemanal
            actividadSemanal={actividadSemanal}
            periodo={periodo}
            cambiarPeriodo={cambiarPeriodo}
          />

          <ClientesRecientes
            presupuestos={listaData || []}
            paginaActual={pagina}
            totalPaginas={totalPaginas}
            cambiarPagina={cambiarPagina}
            loading={listaLoading}
            esVistaCompleta={false}
          />
   
      </div>
    </>
  );
}
