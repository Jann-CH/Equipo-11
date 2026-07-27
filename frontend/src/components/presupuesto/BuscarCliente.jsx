"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { getClientesService } from "@/services/clientes.service";

export const BuscarCliente = ({ clienteSeleccionado, onSelect }) => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const data = await getClientesService();
        setClientes(data.clientes || data);
      } catch (error) {
        console.error("Error cargando clientes", error);
      }
    };

    cargarClientes();
  }, []);

  useEffect(() => {
    if (clienteSeleccionado) {
      setBusqueda(`${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`);
    } else {
      setBusqueda("");
    }
  }, [clienteSeleccionado]);

  useEffect(() => {
    const clickFuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setMostrarLista(false);
      }
    };

    document.addEventListener("mousedown", clickFuera);

    return () => {
      document.removeEventListener("mousedown", clickFuera);
    };
  }, []);

  const filtrados = useMemo(() => {
    if (!busqueda) return clientes;

    return clientes.filter(cliente => {
      const nombre = `${cliente.nombre} ${cliente.apellido}`.toLowerCase();
      const email = cliente.email?.toLowerCase() || "";

      return nombre.includes(busqueda.toLowerCase()) || email.includes(busqueda.toLowerCase());
    });
  }, [clientes, busqueda]);

  const seleccionar = (cliente) => {
    setBusqueda(`${cliente.nombre} ${cliente.apellido}`);
    onSelect(cliente);
    setMostrarLista(false);
  };

  return (
    <div ref={ref} className="relative">
      <label className="text-sm font-medium text-[#123B5D]">
        Cliente
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div className="relative mt-1">
        <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

        <input
          value={busqueda}
          onFocus={() => setMostrarLista(true)}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setMostrarLista(true);
          }}
          placeholder="Buscar o crear cliente..."
          className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-[#528A72]"
        />
      </div>

      {mostrarLista && (
        <div className="absolute z-20 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filtrados.length > 0 ?
            filtrados.map(cliente => (
              <button
                key={cliente.id}
                type="button"
                onClick={() => seleccionar(cliente)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50"
              >
                <p className="font-medium text-[#123B5D]">{cliente.nombre} {cliente.apellido}</p>
                <p className="text-xs text-gray-500">{cliente.email}</p>
              </button>
            ))
            :
            <p className="p-3 text-sm text-gray-500">No hay clientes</p>
          }
        </div>
      )}
    </div>
  );
};