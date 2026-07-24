"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

import { createItemsService } from "@/services/items.service";


export const ItemsForm = ({
  isOpen,
  onClose,
  onSuccess,
  tipoInicial = "producto",
}) => {

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

      const data = {
        nombre,
        precio: Number(precio),
        tipo,
      };


      console.log("ENVIANDO ITEM:", data);


      const response = await createItemsService(data);


      console.log("RESPUESTA BACK:", response);


      if (onSuccess) {

        onSuccess(response);

      }


      onClose();


    } catch (error) {

      console.error(
        "ERROR CREANDO ITEM:",
        error
      );


      console.log(
        "ERROR BACK:",
        error.response?.data
      );


      setErrorServer(
        error.response?.data?.message ||
        "Error creando item"
      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo item"
    >

      <form
        onSubmit={enviar}
        className="space-y-4"
      >

        <Input
          label={
            <span>
              Nombre <span className="text-red-500">*</span>
            </span>
          }
          placeholder="Instalación eléctrica"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />


        <input
          type="hidden"
          value={tipo}
        />


        <Input
          label={
            <span>
              Precio <span className="text-red-500">*</span>
            </span>
          }
          type="number"
          placeholder="$ 150.000"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />


        {
          errorServer && (

            <p className="text-center text-sm text-red-500 mt-1">
              {errorServer}
            </p>

          )
        }


        <div className="pt-2">

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-[#528A72]
              hover:bg-[#43725d]
              text-white
              font-medium
              py-3
              rounded-2xl
              transition-colors
              shadow-md
              disabled:opacity-50
            "
          >

            {
              loading
                ? "Creando..."
                : "Crear item"
            }

          </button>

        </div>

      </form>

    </Modal>

  );

};