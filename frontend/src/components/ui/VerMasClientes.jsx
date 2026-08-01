"use client";

import ClienteConPresupuesto from "@/components/ui/ClientesConPresupuesto";
import { BackButton } from "@/components/ui/BackButton";
export default function VerMasClientes({
  presupuestos,
  loading,
  paginaActual,
  totalRegistros,  
  totalPaginas,
  onCambiarPagina,
  onVolver,
}) {
  return (
    <div className="w-full max-w-md mx-auto font-sans bg-gray-50 min-h-screen pb-28 p-4">
      {/* Cabecera con botón de retroceso hacia el Home */}
      <div className="sticky top-0 bg-gray-50 z-40 py-4 border-b border-gray-100 mb-4 flex items-center gap-3">
          <BackButton onClick={onVolver} />
        <h1 className="text-xl font-bold text-[#0B376D]">
          Todos los Presupuestos
        </h1>
      </div>

      {/* Lista de presupuestos de a 10 */}
      <ClienteConPresupuesto
        presupuestos={presupuestos}
        loading={loading}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        totalRegistros={totalRegistros}
        cambiarPagina={onCambiarPagina}
        esVistaCompleta={true}
      />
    </div>
  );
}
