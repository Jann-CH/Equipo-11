"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

export const ObservacionesModal = ({ open, onClose, register }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-5 w-[92%] max-w-sm">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-[#123B5D]">Observaciones</h2>

          <button type="button" onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <textarea
          {...register("observaciones")}
          rows={5}
          placeholder="Sin observaciones."
          className="mt-4 w-full rounded-xl border p-3 resize-none"
        />

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full bg-[#528A72] text-white rounded-xl py-3"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};