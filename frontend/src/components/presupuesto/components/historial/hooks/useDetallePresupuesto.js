"use client";
import { useState, useEffect, useCallback } from "react";
import { getDetallePresupuestosService } from "@/services/presupuesto.service";

export function useDetallePresupuesto(presupuestoId) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarDetalle = useCallback(async () => {
        if (!presupuestoId) return;
        
        try {
            setLoading(true);
            setError(null);
            const resultado = await getDetallePresupuestosService(presupuestoId);
            setData(resultado);
        } catch (err) {
            setError(err.response?.data?.message || "Error al cargar el detalle del presupuesto");
        } finally {
            setLoading(false);
        }
    }, [presupuestoId]);

    useEffect(() => {
        cargarDetalle();
    }, [cargarDetalle]);

    return {
        presupuesto: data,
        loading,
        error,
        recargarDetalle: cargarDetalle
    };
}