"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { ClientesForm } from "@/components/clientes/ClientesForm";
import { getClientesService } from "@/services/clientes.service";


export const ClientesPage = () => {


  const router = useRouter();


  const [openForm, setOpenForm] = useState(false);

  const [clientes, setClientes] = useState([]);

  const [clienteEditar, setClienteEditar] = useState(null);



  const loadClientes = async () => {

    try {

      const data = await getClientesService();

      console.log("Clientes recibidos:", data);


      const lista = data.clientes || data;


      setClientes(lista);


    } catch (error) {

      console.error("Error cargando clientes:", error);

    }

  };




  useEffect(() => {

    loadClientes();

  }, []);





  return (

    <div className="bg-white min-h-screen p-5">


      <div className="flex items-center justify-between mb-8">


        <button
          onClick={() => router.back()}
        >

          <ArrowLeftIcon className="w-6 h-6 text-[#123B5D]" />

        </button>



        <h1 className="text-xl font-semibold text-[#123B5D]">

          Mis clientes

        </h1>



        <div className="w-6" />


      </div>




      <div className="flex items-center justify-between mb-5">


        <h2 className="text-sm font-medium text-[#123B5D]">

          Cartera de clientes

        </h2>




        <button

          onClick={() => {

            setClienteEditar(null);

            setOpenForm(true);

          }}

          className="
            flex items-center gap-1
            border border-[#528A72]
            text-[#528A72]
            rounded-lg
            px-3 py-1.5
            text-sm
            hover:bg-[#528A72]
            hover:text-white
            transition
          "

        >

          <PlusIcon className="w-4 h-4" />

          Nuevo


        </button>


      </div>






      <div className="space-y-3">


        {clientes.map((cliente) => (


          <div

            key={cliente.id}

            className="
              flex items-center justify-between
              bg-[#F8FAF9]
              rounded-xl
              p-3
              shadow-sm
            "

          >



            <div className="flex items-center gap-3">



              <div

                className="
                  w-10 h-10
                  rounded-full
                  bg-[#003B6F]
                  text-white
                  flex items-center justify-center
                  font-medium
                  text-sm
                "

              >

                {cliente.nombre?.charAt(0)}

                {cliente.apellido?.charAt(0)}


              </div>





              <span className="text-[#123B5D] font-semibold">

                {cliente.nombre} {cliente.apellido}

              </span>



            </div>






            <button

              onClick={() => {

                setClienteEditar(cliente);

                setOpenForm(true);

              }}

            >

              <PencilIcon

                className="
                  w-5 h-5
                  text-[#003B6F]
                  hover:text-[#528A72]
                  transition
                "

              />


            </button>



          </div>



        ))}





        {clientes.length === 0 && (

          <p className="text-center text-gray-500 mt-10">

            No hay clientes registrados.

          </p>

        )}



      </div>







      <ClientesForm


        isOpen={openForm}


        clienteId={clienteEditar?.id || null}



        onClose={() => {

          setOpenForm(false);

          setClienteEditar(null);

        }}




        onSuccess={() => {

          setOpenForm(false);

          setClienteEditar(null);

          loadClientes();

        }}


      />



    </div>

  );

};
