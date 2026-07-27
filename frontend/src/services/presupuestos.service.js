"use client";

import api from "@/lib/axios";


export const createPresupuestoService = async (presupuestoData) => {

  const { data } = await api.post(
    "/presupuestos",
    presupuestoData
  );

  return data;

};