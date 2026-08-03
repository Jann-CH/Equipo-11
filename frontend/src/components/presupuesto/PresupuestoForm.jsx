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
import { ItemsForm } from "@/components/items/ItemsForm";
import Spinner from "@/components/ui/loading/Spinner";
import { createPresupuestoService, downloadPresupuestoService } from "@/services/presupuestos.service";
import { PresupuestoCreadoModal } from "@/components/presupuesto/PresupuestoCreadoModal";

export const PresupuestoForm = () => {
  const hoy = new Date().toISOString().split("T")[0];
  const { register, handleSubmit, reset, watch } = useForm({ defaultValues: { fecha: hoy, observaciones: "" } });
  const [cliente, setCliente] = useState(null);
  const [items, setItems] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [validez, setValidez] = useState("30");
  const [mostrarValidez, setMostrarValidez] = useState(false);
  const [clienteKey, setClienteKey] = useState(0);
  const [itemKey, setItemKey] = useState(0);
  const [modalItem, setModalItem] = useState(false);
  const [modalObservaciones, setModalObservaciones] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);
  const [modalExito, setModalExito] = useState(false);
  const [tipoModal, setTipoModal] = useState("presupuesto");
  const [presupuestoId, setPresupuestoId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loadingAction, setLoadingAction] = useState(null);
  const fechaActual = watch("fecha");
  const observacionesActual = watch("observaciones");

  const agregarItem = (item) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.id === item.id);
      if (existe) return prev.map((i) => (i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i));
      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, cantidad: Number(cantidad) } : item)));
  };

  const eliminarItem = (id) => setItems((prev) => prev.filter((item) => item.id !== id));
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
    setClienteKey((prev) => prev + 1);
    setItemKey((prev) => prev + 1);
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
      setLoadingAction(estado);
      setMensaje("");
      const presupuesto = {
        cliente_id: cliente.id,
        fecha: data.fecha,
        fecha_vencimiento: calcularVencimiento(data.fecha, validez),
        estado,
        observaciones: data.observaciones,
        detalles: items.map((item) => ({ item_id: item.id, cantidad: item.cantidad })),
      };
      const response = await createPresupuestoService(presupuesto);
      setPresupuestoId(response.presupuesto.id);
      setPdfUrl(response.presupuesto.pdf_url);
      setTipoModal(estado === "Guardado" ? "presupuesto" : "borrador");
      setMensaje("");
      setModalExito(true);
    } catch (error) {
      console.error(error);
      setMensaje(error.response?.data?.message || "Error creando presupuesto");
    } finally {
      setLoadingAction(null);
    }
  };

  const descargarPDF = async () => {
    try {
      const blob = await downloadPresupuestoService(presupuestoId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Presupuesto-${presupuestoId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando PDF:", error);
    }
  };

  const compartirPresupuesto = async () => {
    try {
      // Descargar PDF generado
      const blob = await downloadPresupuestoService(presupuestoId);
      const archivo = new File([blob], `Presupuesto-${presupuestoId}.pdf`, { type: "application/pdf" });
      // Crear URL pública de Vercel automáticamente
      const urlPublica = `${window.location.origin}/presupuesto/${presupuestoId}`;
      // Compartir PDF + mensaje + link
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [archivo] })) {
        await navigator.share({
          files: [archivo],
          title: "Presupuesto",
          text: `Hola, te envío el presupuesto solicitado.\n\nPodés aceptar o rechazarlo desde este enlace:\n${urlPublica}\n\nSaludos.`,
        });
      } else {
        // Si el dispositivo no soporta compartir archivos
        await navigator.share({
          title: "Presupuesto",
          text: `Hola, te envío el presupuesto solicitado.\n\nPodés aceptar o rechazarlo desde este enlace:\n${urlPublica}\n\nSaludos.`,
        });
      }
    } catch (error) {}
  };

  return (
    <>
      <form onSubmit={handleSubmit((data) => enviarPresupuesto(data, "Guardado"))} className="space-y-4">
        <h2 className="text-lg font-bold text-[#123B5D]">Datos básicos</h2>
        <BuscarCliente key={clienteKey} clienteSeleccionado={cliente} onSelect={setCliente} onNuevoCliente={() => setModalCliente(true)} />
        <div className="space-y-3">
          <BuscarItem key={itemKey} onAgregarItem={agregarItem} />
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-lg font-bold text-[#123B5D]">Items del presupuesto</h2>
            <button type="button" onClick={() => setModalItem(true)} className="flex items-center gap-2 rounded-xl border border-[#D0D9D5] bg-white px-3 py-2 text-sm font-medium text-[#123B5D] hover:bg-gray-50 transition-colors">
              <span className="text-base leading-none">+</span>
              Agregar ítem
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={eliminarItem} onCantidadChange={cambiarCantidad} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-2 text-sm font-medium text-[#123B5D]">Fecha</label>
            <div className="relative">
              <Calendar size={18} strokeWidth={2.2} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#123B5D]" />
              <input type="date" min={hoy} value={fechaActual} {...register("fecha")} className="w-full h-12 rounded-xl border border-gray-300 pl-10 pr-3 text-sm font-medium text-[#123B5D]" />
            </div>
          </div>
          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-[#123B5D]">Validez del presupuesto</label>
            <button type="button" onClick={() => setMostrarValidez(!mostrarValidez)} className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#123B5D]" />
                <span className="text-sm font-medium text-[#123B5D]">{validez} días</span>
              </div>
              <ChevronDown size={18} className="text-[#123B5D]" />
            </button>
            {mostrarValidez && (
              <div className="absolute top-full w-full bg-white border rounded-b-xl shadow-lg z-30">
                {["05", "10", "15", "20", "25", "30"].map((dia) => (
                  <button key={dia} type="button" onClick={() => { setValidez(String(Number(dia))); setMostrarValidez(false); }} className="w-full py-3 text-[#123B5D] hover:bg-[#123B5D] hover:text-white">
                    {dia}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <ObservacionesCard observaciones={observacionesActual} onOpen={() => setModalObservaciones(true)} />
        <div>
          <div className="border-t border-[#D0D9D5]" />
          <div className="flex justify-between items-center px-1 mt-2">
            <span className="text-lg font-semibold text-[#123B5D]">Total:</span>
            <span className="text-2xl font-semibold text-[#123B5D]">
              ${total.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        <div className="flex gap-3 pt-2 pb-5">
          <button type="button" disabled={loadingAction !== null} onClick={handleSubmit((data) => enviarPresupuesto(data, "Borrador"))} className="flex-1 h-11 rounded-xl border border-[#123B5D] text-[#123B5D] flex items-center justify-center gap-2 disabled:opacity-70 transition-all">
            {loadingAction === "Borrador" ? (
              <>
                <Spinner size="sm" />
                <span className="text-sm font-medium">Guardando...</span>
              </>
            ) : (
              <>
                <Eye size={18} />
                <span className="text-sm font-medium">Guardar borrador</span>
              </>
            )}
          </button>
          <button type="button" disabled={loadingAction !== null} onClick={handleSubmit((data) => enviarPresupuesto(data, "Guardado"))} className="flex-1 h-11 rounded-xl bg-[#528A72] hover:bg-[#43725d] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-70 transition-all">
            {loadingAction === "Guardado" ? (
              <>
                <Spinner size="sm" />
                <span className="text-sm">Generando...</span>
              </>
            ) : (
              <span>Generar presupuesto</span>
            )}
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

      <ItemsForm
        isOpen={modalItem}
        onClose={() => setModalItem(false)}
        onSuccess={(response) => {
          const nuevo = response.item || response;
          setModalItem(false);
          setItemKey((prev) => prev + 1);
          agregarItem(nuevo);
        }}
      />

      <PresupuestoCreadoModal
        open={modalExito}
        tipo={tipoModal}
        onClose={() => {
          setModalExito(false);
          limpiarFormulario();
          setPresupuestoId(null);
          setPdfUrl("");
        }}
        onPrimary={async () => {
          if (tipoModal === "presupuesto" && presupuestoId) {
            await descargarPDF();
          }
        }}
        onSecondary={compartirPresupuesto}
      />
    </>
  );
};