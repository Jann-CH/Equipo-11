"use client";

import { useState } from "react";

export default function FiltrarPresupuesto({ onClose, onAplicar }) {
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mes");
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
    const [montoMin, setMontoMin] = useState("");
    const [montoMax, setMontoMax] = useState("");

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const seleccionarPeriodo = (tipo) => {
        setPeriodoSeleccionado(tipo);
        const hoy = new Date();
        let inicio = new Date();

        if (tipo === "hoy") {
            inicio = hoy;
        } else if (tipo === "semana") {
            inicio.setDate(hoy.getDate() - 7);
        } else if (tipo === "mes") {
            inicio.setMonth(hoy.getMonth() - 1);
        } else {
            return;
        }

        const formatear = (d) => d.toISOString().split("T")[0];
        setFechaInicio(formatear(inicio));
        setFechaFin(formatear(hoy));
    };

    const handleBorrar = () => {
        setPeriodoSeleccionado(null);
        setEstadoSeleccionado("");
        setMontoMin("");
        setMontoMax("");
        setFechaInicio("");
        setFechaFin("");
    };

    const handleAplicar = () => {
        onAplicar({
            fechaInicio,
            fechaFin,
            estado: estadoSeleccionado,
            montoMin,
            montoMax,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            {/* AQUÍ ESTABA EL ERROR: Cambiamos h-full por h-screen para forzar el alto real de la pantalla */}
            <div className="w-full max-w-md bg-white h-screen relative flex flex-col shadow-2xl">
                
                {/* Cabecera */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white z-10 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="text-gray-800 font-bold text-lg">✕</button>
                        <h2 className="text-lg font-bold text-gray-900">Filtrar presupuestos</h2>
                    </div>
                    <button onClick={handleBorrar} className="text-emerald-700 font-medium text-sm hover:underline">
                        Borrar
                    </button>
                </div>

                {/* Contenido scrolleable con espacio abajo para que no lo tape el botón */}
                <div className="overflow-y-auto flex-1 p-4 space-y-6 pb-24">
                    
                    {/* ESTADOS */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#0A1B2A] mb-3">Estado</h3>
                        <div className="flex flex-col gap-2">
                            {[
                                { label: "Pendientes", val: "Pendiente" },
                                { label: "Aprobados", val: "Aprobado" },
                                { label: "Rechazados", val: "Rechazado" },
                                { label: "Borradores", val: "Borrador" }
                            ].map((est) => (
                                <button
                                    key={est.val}
                                    onClick={() => setEstadoSeleccionado(estadoSeleccionado === est.val ? "" : est.val)}
                                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                                        estadoSeleccionado === est.val 
                                            ? "text-[#0A1B2A] font-bold bg-gray-100" 
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {est.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PERIODO DE TIEMPO */}
                    <div className="space-y-2">
                        {[
                            { id: "hoy", label: "Hoy" },
                            { id: "semana", label: "Última semana" },
                            { id: "mes", label: "Último mes" },
                            { id: "personalizado", label: "Personalizado" }
                        ].map((item) => (
                            <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="periodo"
                                    checked={periodoSeleccionado === item.id}
                                    onChange={() => seleccionarPeriodo(item.id)}
                                    className="w-4 h-4 text-[#0A1B2A] accent-[#0A1B2A]"
                                />
                                <span className="text-sm text-gray-800">{item.label}</span>
                            </label>
                        ))}

                        {/* FECHA PERSONALIZADA */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Desde</label>
                                <input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => { setFechaInicio(e.target.value); setPeriodoSeleccionado("personalizado"); }}
                                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-gray-200 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Hasta</label>
                                <input
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => { setFechaFin(e.target.value); setPeriodoSeleccionado("personalizado"); }}
                                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-gray-200 text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* MONTO */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#0A1B2A] mb-3">Monto</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Desde</label>
                                <input
                                    type="number"
                                    placeholder="$"
                                    value={montoMin}
                                    onChange={(e) => setMontoMin(e.target.value)}
                                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-gray-200 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Hasta</label>
                                <input
                                    type="number"
                                    placeholder="$"
                                    value={montoMax}
                                    onChange={(e) => setMontoMax(e.target.value)}
                                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-gray-200 text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* BOTÓN APLICAR FIJO ABAJO */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg">
                    <button
                        onClick={handleAplicar}
                        className="w-full py-3.5 bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md hover:bg-emerald-800 transition-all"
                    >
                        Aplicar filtro
                    </button>
                </div>

            </div>
        </div>
    );
}