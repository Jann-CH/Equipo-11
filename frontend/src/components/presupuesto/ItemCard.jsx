"use client";

import { TrashIcon } from "@heroicons/react/24/outline";

export const ItemCard = ({ item, onDelete, onCantidadChange }) => {
  const subtotal = item.precio * item.cantidad;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Nombre */}
      <div className="mb-4">
        <h3 className="font-semibold text-[#123B5D]">{item.nombre}</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {/* Cantidad */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Cantidad</p>
          <input
            type="number"
            min="1"
            value={item.cantidad}
            onChange={(e) => onCantidadChange(item.id, Number(e.target.value))}
            className="w-full text-center rounded-lg border border-gray-300 py-2"
          />
        </div>

        {/* Precio */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Precio unitario</p>
          <p className="font-semibold text-[#123B5D] mt-2">${Number(item.precio).toLocaleString()}</p>
        </div>

        {/* Subtotal */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Subtotal</p>
          <p className="font-semibold text-[#123B5D] mt-2">${Number(subtotal).toLocaleString()}</p>
        </div>
      </div>

      {/* Eliminar */}
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="mt-4 w-full flex justify-center items-center gap-2 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition"
      >
        <TrashIcon className="w-5 h-5" />
        Eliminar
      </button>
    </div>
  );
};