"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import Spinner from "@/components/ui/loading/Spinner";
import { createItemsService } from "@/services/items.service";

export const ItemsForm = ({ isOpen, onClose, onSuccess, tipoInicial = "producto" }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipo, setTipo] = useState(tipoInicial);
  const [errorServer, setErrorServer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNombre("");
      setPrecio("");
      setTipo(tipoInicial);
      setErrorServer(null);
    }
  }, [isOpen, tipoInicial]);

  const enviar = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorServer(null);

      const data = { nombre, precio: Number(precio), tipo };
      const response = await createItemsService(data);

      if (onSuccess) onSuccess(response);
      onClose();
    } catch (error) {
      console.error("ERROR CREANDO ITEM:", error);
      setErrorServer(error.response?.data?.message || "Error creando item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <form onSubmit={enviar} className="space-y-2 -mt-10">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-2">Agregar producto o servicio</h2>
          <p className="text text-gray-500">Completá la información para crear un nuevo ítem.</p>
        </div>

        {/* Selector producto / servicio */}
        <div className="flex gap-1 mb-5">
          <button
            type="button"
            onClick={() => setTipo("producto")}
            className={`flex-1 h-8 text-sm rounded-xl border transition ${
              tipo === "producto" ? "bg-[#003B6F] text-white border-[#003B6F]" : "bg-white text-[#123B5D] border-gray-300"
            }`}
          >
            Producto
          </button>

          <button
            type="button"
            onClick={() => setTipo("servicio")}
            className={`flex-1 h-8 text-sm rounded-xl border transition ${
              tipo === "servicio" ? "bg-[#003B6F] text-white border-[#003B6F]" : "bg-white text-[#123B5D] border-gray-300"
            }`}
          >
            Servicio
          </button>
        </div>

        <Input
          label={
            <span>
              {tipo === "producto" ? "Producto" : "Servicio"}
              <span className="text-red-500">*</span>
            </span>
          }
          placeholder="Item a presupuestar"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <Input
          label={
            <span>
              Precio unitario
              <span className="text-red-500">*</span>
            </span>
          }
          type="number"
          placeholder="Valor"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        {errorServer && <p className="text-center text-sm text-red-500">{errorServer}</p>}

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-[50%] h-10 rounded-full bg-[#528A72] hover:bg-[#43725d] text-white text-sm font-normal transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                Guardando...
              </>
            ) : (
              <>Guardar {tipo}</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};