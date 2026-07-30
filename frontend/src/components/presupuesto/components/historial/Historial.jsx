"use client";

import { useState } from "react";
import ButtonListadoCalendario from "./components/ButtonListadoCalendario";
import FiltrosPresupuestos from "./components/FiltrosPresupuestos";
import CalendarioPresupuestos from "./components/CalendarioPresupuesto";
import ClientesConPresupuesto from "./components/ClientesConPresupuesto";
import Spinner from "@/components/ui/loading/Spinner";
import { useFiltroPresupuestos } from "./hooks/useFiltroPresupuesto";

export default function Historial() {
  // Estado para controlar la vista activa: "listado" o "calendario"
  const [vistaActiva, setVistaActiva] = useState("listado");

  const {
    presupuestos,
    totalPaginas,
    totalRegistros,
    paginaActual,
    loading,
    error,
    cambiarPagina,
    actualizarFiltros,
    limpiarFiltros,
  } = useFiltroPresupuestos(5);

  console.log("Total Registro: ", totalRegistros);

  // Función para manejar el cambio de vista y limpiar/ajustar filtros si es necesario
  const cambiarVista = (nuevaVista) => {
    setVistaActiva(nuevaVista);
    limpiarFiltros(); // Opcional: limpia los filtros al cambiar de pestaña
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 p-4 max-w-md mx-auto">
      {/* Componente para alternar entre Listado y Calendario */}
      <ButtonListadoCalendario
        vistaActiva={vistaActiva}
        onCambiarVista={cambiarVista}
      />

      {/* Renderizado condicional según la pestaña elegida */}
      {vistaActiva === "listado" ? (
        <>
          <FiltrosPresupuestos onFiltrar={actualizarFiltros} totalRegistros={totalRegistros} />

          {loading && <Spinner />}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {!loading && !error && (
            <ClientesConPresupuesto
              presupuestos={presupuestos}
              loading={loading}
              totalRegistros={totalRegistros}
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onCambiarPagina={cambiarPagina}
            />
          )}
        </>
      ) : (
        /* Vista de Calendario: al hacer clic en un día, llama a actualizarFiltros con las fechas */
        <CalendarioPresupuestos
          presupuestos={presupuestos}
          loading={loading}
          onSeleccionarFecha={(fechaSeleccionada) => {
            actualizarFiltros({
              fechaInicio: fechaSeleccionada,
              fechaFin: fechaSeleccionada,
            });
          }}
          totalRegistros={totalRegistros}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={cambiarPagina}
        />
      )}
    </div>
  );
}
