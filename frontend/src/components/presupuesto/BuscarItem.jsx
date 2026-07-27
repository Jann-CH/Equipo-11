"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { getItemsService } from "@/services/items.service";

export const BuscarItem = ({ onAgregarItem }) => {
  const [items, setItems] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await getItemsService();
        setItems(data.items || data);
      } catch (error) {
        console.error(error);
      }
    };

    loadItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setMostrarLista(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const itemsFiltrados = useMemo(() => {
    if (!busqueda) return items;

    return items.filter(item => item.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  }, [items, busqueda]);

  const agregarItem = (item) => {
    onAgregarItem({ ...item, cantidad: 1 });
    setBusqueda("");
    setMostrarLista(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block mb-2 text-sm font-medium text-[#123B5D]">
        Nombre del servicio
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

        <input
          type="text"
          value={busqueda}
          placeholder="Agregar servicio o producto"
          onFocus={() => setMostrarLista(true)}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setMostrarLista(true);
          }}
          className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-[#528A72]"
        />
      </div>

      {mostrarLista && (
        <div className="absolute z-30 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-lg max-h-72 overflow-y-auto">
          {itemsFiltrados.length > 0 ? (
            itemsFiltrados.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => agregarItem(item)}
                className="w-full px-4 py-3 flex justify-between items-center hover:bg-[#F4F8F6] transition"
              >
                <div className="text-left">
                  <p className="font-medium text-[#123B5D]">{item.nombre}</p>
                  <p className="text-xs text-gray-500">${Number(item.precio).toLocaleString()}</p>
                </div>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-gray-500">No se encontraron servicios.</p>
          )}
        </div>
      )}
    </div>
  );
};