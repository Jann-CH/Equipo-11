"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PresupuestoForm } from "./PresupuestoForm";

export const PresupuestoPage = () => {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen p-5">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="w-6 h-6 text-[#123B5D]" />
        </button>

        <h1 className="text-xl font-semibold text-[#123B5D]">
          Nuevo presupuesto
        </h1>

        <div className="w-6" />
      </div>

      <PresupuestoForm />
    </div>
  );
};