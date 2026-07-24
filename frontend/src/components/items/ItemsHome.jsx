"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { ItemsForm } from "@/components/items/ItemsForm";
import { getItemsService } from "@/services/items.service";

export const ItemsPage = () => {
  const router = useRouter();

  const [openForm, setOpenForm] = useState(false);
  const [items, setItems] = useState([]);
  const [itemEditar, setItemEditar] = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("producto");
  const [tipoFormulario, setTipoFormulario] = useState("producto");
  const [busqueda, setBusqueda] = useState("");

  const loadItems = async () => {
    try {
      const data = await getItemsService();
      const lista = data.items || data;
      setItems(lista);
    } catch (error) {
      console.error("Error cargando items:", error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const itemsFiltrados = useMemo(() => {
    return items.filter((item) => {
      const coincideTipo = item.tipo === tipoSeleccionado;
      const coincideBusqueda = item.nombre?.toLowerCase().includes(busqueda.toLowerCase());

      return coincideTipo && coincideBusqueda;
    });
  }, [items, tipoSeleccionado, busqueda]);

  const obtenerIniciales = (nombre = "") => {
    return nombre
      .split(" ")
      .slice(0, 2)
      .map((p) => p.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen p-5">

      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="w-6 h-6 text-[#123B5D]" />
        </button>

        <h1 className="text-lg font-semibold text-[#123B5D] text-center">
          Mis productos y servicios
        </h1>

        <div className="w-6" />
      </div>

      <div className="grid grid-cols-2 rounded-xl overflow-hidden border border-[#003B6F] mb-5">
        <button
          onClick={() => setTipoSeleccionado("producto")}
          className={`py-3 text-sm font-medium transition ${
            tipoSeleccionado === "producto"
              ? "bg-[#003B6F] text-white"
              : "bg-white text-[#003B6F]"
          }`}
        >
          Productos
        </button>

        <button
          onClick={() => setTipoSeleccionado("servicio")}
          className={`py-3 text-sm font-medium transition ${
            tipoSeleccionado === "servicio"
              ? "bg-[#003B6F] text-white"
              : "bg-white text-[#003B6F]"
          }`}
        >
          Servicios
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />

          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={`Buscar ${
              tipoSeleccionado === "producto" ? "productos" : "servicios"
            }`}
            className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 bg-white outline-none focus:border-[#003B6F]"
          />
        </div>

        <select className="rounded-xl border border-gray-300 px-3 bg-white">
          <option>Todos</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#123B5D]">
          Activos
        </h2>

        <button
          onClick={() => {
            setItemEditar(null);
            setTipoFormulario(tipoSeleccionado);
            setOpenForm(true);
          }}
          className="flex items-center gap-1 rounded-full border border-[#528A72] text-[#528A72] px-3 py-1.5 text-sm hover:bg-[#528A72] hover:text-white transition"
        >
          <PlusIcon className="w-4 h-4" />
          Agregar
        </button>
      </div>

      <div className="space-y-3">
        {itemsFiltrados.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-start"
          >
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-[#003B6F] text-white flex items-center justify-center font-semibold">
                {obtenerIniciales(item.nombre)}
              </div>

              <div>
                <p className="font-semibold text-[#123B5D]">
                  {item.nombre}
                </p>

                <p className="text-[#003B6F] mt-1 font-medium">
                  ${Number(item.precio).toLocaleString("es-AR")}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setItemEditar(item);
                setTipoFormulario(item.tipo);
                setOpenForm(true);
              }}
            >
              <EllipsisHorizontalIcon className="w-6 h-6 text-[#003B6F]" />
            </button>
          </div>
        ))}

        {itemsFiltrados.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No hay {tipoSeleccionado === "producto" ? "productos" : "servicios"} registrados.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-semibold text-[#123B5D] mb-3">
          Inactivos
        </h2>

        <div className="bg-[#EAF1F8] rounded-2xl p-4 text-sm text-[#123B5D]">
          Los productos y servicios inactivos no estarán disponibles para nuevos presupuestos.
        </div>
      </div>

      <ItemsForm
        isOpen={openForm}
        itemId={itemEditar?.id || null}
        tipoInicial={tipoFormulario}
        onClose={() => {
          setOpenForm(false);
          setItemEditar(null);
        }}
        onSuccess={() => {
          setOpenForm(false);
          setItemEditar(null);
          loadItems();
        }}
      />

    </div>
  );
};