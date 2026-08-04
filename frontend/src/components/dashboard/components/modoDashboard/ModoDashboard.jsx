"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Spinner from "@/components/ui/loading/Spinner";
import { BackButton } from "@/components/ui/BackButton";
import { useDashboard } from "@/components/dashboard/hooks/useDashboard";
import { useFiltroPresupuestos } from "@/components/historial/hooks/useFiltroPresupuesto";

export default function Dashboard() {
  const { data, loading } = useDashboard();

  const {
    presupuestos,
    loading: loadingPresupuestos,  
  } = useFiltroPresupuestos(1);

  const estadisticas = data?.estadisticas || {};

  const total =
    estadisticas.totalPresupuestos > 0 ? estadisticas.totalPresupuestos : 1;
  const porcAprobados = Math.round(((estadisticas.aceptados || 0) / total) * 100);
  const porcRechazados = Math.round(((estadisticas.rechazados || 0) / total) * 100);
  const porcPendientes = Math.max(0, 100 - (porcAprobados + porcRechazados));

  // --- DATOS PARA EL GRÁFICO DE DONA (Estado de presupuestos) ---
  const dataDona = [
    { name: "Aprobados", value: estadisticas.aceptados || 0, color: "#012950" },
    { name: "Pendientes", value: estadisticas.pendientes || 0, color: "#4D7093" },
    { name: "Rechazados", value: estadisticas.rechazados || 0, color: "#B3C2D1" },
  ];

  // --- PROCESAMIENTO DE DATOS PARA EL GRÁFICO (RECHARTS) ---
  // Definimos los meses que quieres mostrar en orden cronológico visual
  const mesesEstructura = [
    { key: "01", name: "Ene" },
    { key: "02", name: "Feb" },
    { key: "03", name: "Mar" },
    { key: "04", name: "Abr" },
    { key: "05", name: "May" },
    { key: "06", name: "Jun" },
    { key: "07", name: "Jul" },
    { key: "08", name: "Ago" },
    { key: "09", name: "Sep" },
    { key: "10", name: "Oct" },
    { key: "11", name: "Nov" },
    { key: "12", name: "Dic" },
  ];

  // Acumulamos los montos reales sacados de los presupuestos por mes
  const acumuladoMeses = {};
  presupuestos.forEach((item) => {
    if (item.fecha) {
      const mesStr = item.fecha.substring(5, 7); // Extrae el mes ("07", "08", etc.)
      const monto = parseFloat(item.total) || 0;
      acumuladoMeses[mesStr] = (acumuladoMeses[mesStr] || 0) + monto;
    }
  });

  // Mapeamos al formato que lee Recharts
  const dataGrafico = mesesEstructura.map((m) => ({
    mes: m.name,
    total: acumuladoMeses[m.key] || 0,
  }));

  if (loading) {
    return (
      
        <Spinner />
      
    );
  }

  return (
    <div>
      {/* Contenido principal */}
      <div className=" flex flex-col gap-6">
        {/* Cabecera / Título */}
        <div className="flex items-center gap-3">
          <BackButton/>
          <h1 className="text-2xl font-bold text-[#0B1001]">Dashboard</h1>
        </div>

        {/* 1. SECCIÓN: Estado de presupuestos */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[#012950]/80">
            Estado de presupuestos
          </h2>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            {/* Gráfico de Dona */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataDona}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {dataDona.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Texto central con el total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-[#0B1001]">
                  {estadisticas.totalPresupuestos || 0}
                </span>
              </div>
            </div>

            {/* Leyenda y porcentajes */}
            <div className="flex flex-col gap-2 text-sm w-48">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#012950] rounded-sm"></span>
                  <span className="text-gray-600 font-normal">Aprobados</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {porcAprobados}%
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#4D7093] rounded-sm"></span>
                  <span className="text-gray-600 font-normal">Pendientes</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {porcPendientes}%
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#B3C2D1] rounded-sm"></span>
                  <span className="text-gray-600 font-normal">Rechazados</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {porcRechazados}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SECCIÓN: Historial de presupuestos (Con Recharts escalable) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[#012950]/80">
            Historial de presupuestos
          </h2>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
            <div className="w-full h-44 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dataGrafico}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="mes"
                    stroke="#9ca3af"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderColor: "#e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#4D7093"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#4D7093" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 3. SECCIÓN: Últimos clientes */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[#012950]/80">
            Últimos clientes
          </h2>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-start gap-4 overflow-x-auto">
            {loadingPresupuestos ? (
              <p className="text-xs text-gray-400 py-2">Cargando clientes...</p>
            ) : presupuestos.length > 0 ? (
              presupuestos.map((item) => {
                const iniciales =
                  `${item.cliente_nombre?.[0] || ""}${item.cliente_apellido?.[0] || ""}`.toUpperCase();

                return (
                  <Link
                    key={item.id}
                    href={`/historial/${item.id}`}
                    className="flex flex-col items-center gap-1 min-w-[70px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#4D7093] flex items-center justify-center text-white font-medium text-sm shadow-md">
                      {iniciales || "CL"}
                    </div>
                    <span className="text-xs text-gray-600 text-center truncate w-full">
                      {item.cliente_nombre}
                    </span>
                  </Link>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 py-2">
                No hay clientes recientes
              </p>
            )}

            <Link
              href="/historial/lista"
              className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 shrink-0 ml-auto"
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        </section>

        {/* 4. SECCIÓN: Borradores */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#012950]/80">
              Borradores
            </h2>
            <Link
              href="/historial?estado=Borradores"
              className="text-sm font-extrabold text-[#4D8F72] hover:underline"
            >
              Ver más
            </Link>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#B3C2D1] flex items-center justify-center text-[#012950] font-bold text-lg shrink-0">
              {String(estadisticas.guardados || 0).padStart(2, "0")}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                Presupuestos en borrador
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
