"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, Calendar, ChevronDown } from "lucide-react";

import { BuscarCliente } from "@/components/presupuesto/BuscarCliente";
import { BuscarItem } from "@/components/presupuesto/BuscarItem";
import { ItemCard } from "@/components/presupuesto/ItemCard";
import { ObservacionesCard } from "@/components/presupuesto/ObservacionesCard";
import { ObservacionesModal } from "@/components/presupuesto/ObservacionesModal";
import { ClientesForm } from "@/components/clientes/ClientesForm";
import { createPresupuestoService } from "@/services/presupuestos.service";

export const PresupuestoForm = () => {
  const hoy = new Date().toISOString().split("T")[0];

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { fecha: hoy, observaciones: "" },
  });

  const [cliente, setCliente] = useState(null);
  const [items, setItems] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [validez, setValidez] = useState("30");
  const [mostrarValidez, setMostrarValidez] = useState(false);
  const [clienteKey, setClienteKey] = useState(0);
  const [modalObservaciones, setModalObservaciones] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);

  const fechaActual = watch("fecha");
  const observacionesActual = watch("observaciones");

  const agregarItem = (item) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.id === item.id);
      if (existe) {
        return prev.map((i) => (i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad: Number(cantidad) } : item))
    );
  };

  const eliminarItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = items.reduce(
    (acc, item) => acc + Number(item.precio) * Number(item.cantidad),
    0
  );

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
    setClienteKey((prev) => prev + 1);
  };

  const enviarPresupuesto = async (data, estado) => {
    try {
      if (!cliente) return setMensaje("Seleccioná un cliente");
      if (items.length === 0) return setMensaje("Agregá al menos un servicio");

      const presupuesto = {
        cliente_id: cliente.id,
        fecha: data.fecha,
        fecha_vencimiento: calcularVencimiento(data.fecha, validez),
        estado,
        observaciones: data.observaciones,
        detalles: items.map((item) => ({ item_id: item.id, cantidad: item.cantidad })),
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
      <form onSubmit={handleSubmit((data) => enviarPresupuesto(data, "Guardado"))} className="space-y-4">
        <h2 className="text-lg font-bold text-[#123B5D]">Datos básicos</h2>

        <BuscarCliente
          key={clienteKey}
          clienteSeleccionado={cliente}
          onSelect={setCliente}
          onNuevoCliente={() => setModalCliente(true)}
        />

        <BuscarItem onAgregarItem={agregarItem} />

        <div className="space-y-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onDelete={eliminarItem}
              onCantidadChange={cambiarCantidad}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-2 text-sm font-medium text-[#123B5D]">Fecha</label>
            <div className="relative">
              <Calendar size={18} strokeWidth={2.2} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#123B5D]" />
              <input
                type="date"
                min={hoy}
                value={fechaActual}
                {...register("fecha")}
                className="w-full h-12 rounded-xl border border-gray-300 pl-10 pr-3 text-sm font-medium text-[#123B5D] outline-none focus:ring-0 focus:border-gray-300 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-[#123B5D]">Validez del presupuesto</label>
            <button
              type="button"
              onClick={() => setMostrarValidez(!mostrarValidez)}
              className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Calendar size={18} strokeWidth={2.2} className="text-[#123B5D]" />
                <span className="text-sm font-medium text-[#123B5D]">{validez} días</span>
              </div>
              <ChevronDown size={18} className={`text-[#123B5D] transition-transform ${mostrarValidez ? "rotate-180" : ""}`} />
            </button>

            {mostrarValidez && (
              <div className="absolute top-full mt-0 w-full bg-white border border-gray-200 rounded-b-xl shadow-lg overflow-hidden z-30">
                {["05", "10", "15", "20", "25", "30"].map((dia) => (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => {
                      setValidez(String(Number(dia)));
                      setMostrarValidez(false);
                    }}
                    className="w-full py-3 text-[#123B5D] hover:bg-[#123B5D] hover:text-white transition"
                  >
                    {dia}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <ObservacionesCard observaciones={observacionesActual} onOpen={() => setModalObservaciones(true)} />
        </div>

        {/* TOTAL */}
        <div className="mt-3">
          <div className="border-t border-[#D0D9D5] mb-1" />
          <div className="px-1 flex items-center justify-between">
            <span className="text-lg font-semibold text-[#123B5D]">Total:</span>
            <span className="text-2xl font-semibold text-[#123B5D]">
              ${total.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-2 pb-5">
          <button
            type="button"
            onClick={handleSubmit((data) => enviarPresupuesto(data, "Borrador"))}
            className="flex-1 h-11 rounded-xl border border-[#123B5D] bg-white text-[#123B5D] font-medium flex items-center justify-center gap-2 transition hover:bg-[#F8FAF9]"
          >
            <Eye size={18} />
            Guardar borrador
          </button>

          <button
            type="submit"
            className="flex-1 h-11 rounded-xl bg-[#528A72] text-white font-semibold transition hover:bg-[#467761]"
          >
            Generar presupuesto
          </button>
        </div>
      </form>

      <ObservacionesModal open={modalObservaciones} onClose={() => setModalObservaciones(false)} register={register} />
      
      <ClientesForm
        isOpen={modalCliente}
        onClose={() => setModalCliente(false)}
        onSuccess={(response) => {
          const nuevo = response.cliente || response;
          setCliente(nuevo);
          setModalCliente(false);
          setClienteKey((prev) => prev + 1);
        }}
      />
    </>
  );
};