"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

export const ObservacionesCard = ({
  observaciones,
  onOpen,
}) => {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="
        w-full
        bg-white
        border
        rounded-xl
        p-4
        shadow-sm
        flex
        justify-between
        items-center
      "
    >
      <div className="text-left">

        <p className="font-semibold text-[#123B5D]">
          Observaciones
        </p>

        <p className="text-sm text-gray-500 mt-1 truncate">
          {
            observaciones?.trim()
              ? observaciones
              : "Sin observaciones."
          }
        </p>

      </div>

      <ChevronDownIcon
        className="w-5 h-5 text-[#123B5D]"
      />
    </button>
  );
};