"use client";

import { use } from "react";
import PresupuestoDetalle from "@/components/ui/PresupuestoDetalle"; 
import { FadeIn } from "@/components/ui/FadeIn";

export default function Page({ params }) {
  // Resolvemos la promesa de los params de Next.js de forma segura
  const resolvedParams = use(params);
  const { id } = resolvedParams || {};

  return (
     <FadeIn>
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto">
        <PresupuestoDetalle params={{ id }} />
      </div>
    </main>
    </FadeIn>
  );
}