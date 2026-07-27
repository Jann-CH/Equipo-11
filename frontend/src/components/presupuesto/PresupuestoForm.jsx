"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { EyeIcon } from "@heroicons/react/24/outline";

import { BuscarCliente } from "@/components/presupuesto/BuscarCliente";
import { BuscarItem } from "@/components/presupuesto/BuscarItem";
import { ItemCard } from "@/components/presupuesto/ItemCard";
import { ObservacionesCard } from "@/components/presupuesto/ObservacionesCard";
import { ObservacionesModal } from "@/components/presupuesto/ObservacionesModal";

import { createPresupuestoService } from "@/services/presupuestos.service";

export const PresupuestoForm = () => {
  const hoy = new Date().toISOString().split("T")[0];

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { fecha: hoy, observaciones: "" }
  });

  const [cliente, setCliente] = useState(null);
  const [items, setItems] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [validez, setValidez] = useState("30");
  const [mostrarValidez, setMostrarValidez] = useState(false);
  const [clienteKey, setClienteKey] = useState(0);
  const [modalObservaciones, setModalObservaciones] = useState(false);

  const fechaActual = watch("fecha");
  const observacionesActual = watch("observaciones");

  const agregarItem = (item) => {
    setItems(prev => {
      const existe = prev.find(i => i.id === item.id);
      if (existe) {
        return prev.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;
    setItems(prev => prev.map(item => item.id === id ? { ...item, cantidad: Number(cantidad) } : item));
  };

  const eliminarItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const total = items.reduce((acc, item) => acc + Number(item.precio) * Number(item.cantidad), 0);

  const calcularVencimiento = (fecha, dias) => {
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + Number(dias));
    return nueva.toISOString().split("T")[0];
  };

  const limpiarFormulario = () => {
    reset({ fecha: hoy, observaciones: "" });
    setCliente(null);
    setItems([]);
    setValidez("30");
    setMostrarValidez(false);
    setModalObservaciones(false);
    setClienteKey(prev => prev + 1);
  };

  const enviarPresupuesto = async (data, estado) => {
    try {
      if (!cliente) {
        setMensaje("Seleccioná un cliente");
        return;
      }

      if (items.length === 0) {
        setMensaje("Agregá al menos un servicio");
        return;
      }

      const presupuesto = {
        cliente_id: cliente.id,
        fecha: data.fecha,
        fecha_vencimiento: calcularVencimiento(data.fecha, validez),
        estado,
        observaciones: data.observaciones,
        detalles: items.map(item => ({ item_id: item.id, cantidad: item.cantidad }))
      };

      await createPresupuestoService(presupuesto);
      limpiarFormulario();
      setMensaje("Presupuesto creado correctamente");
    } catch (error) {
      console.error(error);
      setMensaje(error.response?.data?.message || "Error creando presupuesto");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(data => enviarPresupuesto(data, "Guardado"))} className="space-y-3">
        <h2 className="text-lg font-semibold text-[#123B5D]">Datos básicos</h2>

        <BuscarCliente key={clienteKey} clienteSeleccionado={cliente} onSelect={setCliente} />

        <BuscarItem onAgregarItem={agregarItem} />

        <div className="space-y-2">
          {items.map(item => (
            <ItemCard key={item.id} item={item} onDelete={eliminarItem} onCantidadChange={cambiarCantidad} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-[#123B5D]">Fecha</label>
            <input
              type="date"
              min={hoy}
              value={fechaActual}
              {...register("fecha")}
              className="mt-1 w-full rounded-lg border px-2 py-2"
            />
          </div>

          <div className="relative">
            <label className="text-xs text-[#123B5D]">Validez del presupuesto</label>
            <button
              type="button"
              onClick={() => setMostrarValidez(!mostrarValidez)}
              className="mt-1 w-full rounded-lg border px-2 py-2 bg-white"
            >
              {validez} días
            </button>

            {mostrarValidez &&
              <div className="absolute z-30 w-full bg-white border rounded-lg shadow-lg">
                {["05", "10", "15", "20", "25", "30"].map(dia => (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => {
                      setValidez(String(Number(dia)));
                      setMostrarValidez(false);
                    }}
                    className="w-full py-2 hover:bg-[#F4F8F6]"
                  >
                    {dia} días
                  </button>
                ))}
              </div>
            }
          </div>
        </div>

        <ObservacionesCard observaciones={observacionesActual} onOpen={() => setModalObservaciones(true)} />

        <div className="flex justify-between bg-[#F8FAF9] rounded-xl p-3">
          <span className="font-semibold text-[#123B5D]">Total</span>
          <span className="font-bold text-[#123B5D]">${total.toLocaleString()}</span>
        </div>

        {mensaje &&
          <p className="text-center text-sm text-[#123B5D]">{mensaje}</p>
        }

        <div className="flex gap-2 pb-5">
          <button
            type="button"
            onClick={handleSubmit(data => enviarPresupuesto(data, "Borrador"))}
            className="flex-1 border border-[#123B5D] text-[#123B5D] rounded-xl py-3 flex justify-center items-center gap-2"
          >
            <EyeIcon className="w-5 h-5" />
            Guardar borrador
          </button>

          <button type="submit" className="flex-1 bg-[#528A72] text-white rounded-xl py-3">
            Generar presupuesto
          </button>
        </div>
      </form>

      <ObservacionesModal open={modalObservaciones} onClose={() => setModalObservaciones(false)} register={register} />
    </>
  );
};