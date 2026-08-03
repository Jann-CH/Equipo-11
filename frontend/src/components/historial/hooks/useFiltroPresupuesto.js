"use client";
import { useState, useEffect, useCallback } from "react";
import {
    getPresupuestosFiltroService,
} from "@/services/presupuesto.service";

export function useFiltroPresupuestos(initialLimite = 10, initialEstado = "") { // Corregido el typo "initilialLimite"

    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(initialLimite); // Corregido el typo "initilialLimite"
    const [filtros, setFiltros] = useState(initialEstado ? { estado: initialEstado } : {});
    const [resultado, setResultado] = useState({ data: [], meta: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Limpiamos los parámetros para que coincidan (p, l, f)
    const cargarPresupuestos = useCallback(async (p, l, f) => {
        try {
            setLoading(true);
            setError(null);
            const res = await getPresupuestosFiltroService({
                pagina: p,
                limite: l,
                filtro: JSON.stringify(f),
            });
            setResultado(res);
        } catch (err) { // Cambiado a "err" para que coincida con "err.response"
            setError(err.response?.data?.message || "Error al cargar los presupuestos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarPresupuestos(pagina, limite, filtros);
    }, [pagina, limite, filtros, cargarPresupuestos]);

    const actualizarFiltros = (nuevosFiltros) => {
        setFiltros((prevFiltros) => ({
            ...prevFiltros,
            ...nuevosFiltros,
        }));
        setPagina(1); // Volver a la página 1 al filtrar es una excelente práctica
    };

    const limpiarFiltros = () => {
        setFiltros({});
        setPagina(1);
    };

    const cambiarPagina = (nuevaPagina) => {
        setPagina(nuevaPagina);
    };

    return {
        presupuestos: resultado.data || [],
        totalPaginas: resultado.meta?.totalPaginas || 1, // Ajustado a cómo estructuraste el service (.meta)
        totalRegistros: resultado.meta?.total || 0,     // Ajustado a cómo estructuraste el service (.meta.total)
        paginaActual: pagina,
        limite,
        loading,
        error,
        cambiarPagina,
        actualizarFiltros,
        limpiarFiltros,
    };
}