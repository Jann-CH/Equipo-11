"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PresupuestoForm } from "./PresupuestoForm";

export const PresupuestoPage = () => {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen px-7 py-5">
      <div className="flex items-center justify-between mb-10">
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="w-6 h-6 text-[#123B5D]" />
        </button>

        <h1 className="text-2xl font-semibold text-[#123B5D]">
          Nuevo presupuesto
        </h1>

        <div className="w-6" />
      </div>

      <div className="max-w-md mx-auto">
        <PresupuestoForm />
      </div>
    </div>
  );
};