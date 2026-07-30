"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import FiltrarPresupuesto from "./FiltrarPresupuesto";

export default function FiltrosPresupuestos({ onFiltrar, totalRegistros }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [ordenSeleccionado, setOrdenSeleccionado] = useState("reciente");

    const handleSearchChange = (e) => {
        const valor = e.target.value;
        setBusqueda(valor);
        onFiltrar({ busqueda: valor });
    };

    const handleOrdenChange = (e) => {
        const orden = e.target.value;
        setOrdenSeleccionado(orden);
        // Enviamos el criterio de ordenamiento junto con los filtros actuales
        onFiltrar({ orden });
    };

    return (
        <div className="space-y-3 mb-4">
            {/* Barra de búsqueda y botón de filtros avanzados */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        placeholder="Buscar presupuesto / cliente..."
                        value={busqueda}
                        onChange={handleSearchChange}
                        className="w-full pl-4 pr-4 py-2 bg-white rounded-2xl border border-gray-200 shadow-sm text-sm"
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-3 bg-white rounded-2xl border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {/* Icono de filtro */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </button>
            </div>

            {/* Sección de total de registros y selector de orden */}
            <div className="flex items-center justify-between px-1">
                <div>
                    <p className="text-sm font-semibold text-[#013364]">
                        {totalRegistros} {totalRegistros === 1 ? "presupuesto" : "presupuestos"}
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-1.5 shadow-sm">
                    {/* Icono de flechas arriba y abajo */}
                    <svg className="w-4 h-4 text-[#013364]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    
                    {/* Selector de orden: Más reciente, más antiguo, etc. */}
                    <select
                        value={ordenSeleccionado}
                        onChange={handleOrdenChange}
                        className="bg-transparent text-xs font-medium text-[#013364] focus:outline-none cursor-pointer"
                    >
                        <option value="reciente">Ordenar: Más recientes</option>
                        <option value="antiguo">Ordenar: Más antiguos</option>
                        <option value="monto_alto">Ordenar: Mayor monto</option>
                        <option value="monto_bajo">Ordenar: Menor monto</option>
                    </select>
                </div>
            </div>

            {/* Modal o Panel de Filtros Avanzados */}
            {isModalOpen && (
                <FiltrarPresupuesto
                    onClose={() => setIsModalOpen(false)}
                    onAplicar={(filtrosAvanzados) => {
                        onFiltrar(filtrosAvanzados);
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}