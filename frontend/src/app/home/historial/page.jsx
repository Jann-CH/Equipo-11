"use client";

import React from "react";
import Link from "next/link";
import { useFiltroPresupuestos } from "@/components/home/hooks/usePresupuestosLista";
import { ClientesRecientes } from "@/components/ui/ClientesRecientes";
import { BackButton } from "@/components/ui/BackButton";
import { FadeIn } from "@/components/ui/FadeIn";

export default function HistorialPage() {
  const { presupuestos, totalPaginas, paginaActual, loading, cambiarPagina } =
    useFiltroPresupuestos(10);

  return (
    <FadeIn>
      <div className="w-full max-w-md mx-auto font-sans bg-gray-50 min-h-screen pb-28 p-4">
        {/* Cabecera con botón de retroceso hacia el Home */}
        <div className="sticky top-0 bg-gray-50 z-40 py-4 border-b border-gray-100 mb-4 flex items-center gap-3">
          <Link href="/home" className="flex items-center">
            <BackButton />
          </Link>
          <h1 className="text-xl font-bold text-[#0B376D]">
            Todos los Presupuestos
          </h1>
        </div>

        {/* Lista de presupuestos de a 10 */}
        <ClientesRecientes
          presupuestos={presupuestos}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          cambiarPagina={cambiarPagina}
          loading={loading}
          esVistaCompleta={true}
        />
      </div>
    </FadeIn>
  );
}
