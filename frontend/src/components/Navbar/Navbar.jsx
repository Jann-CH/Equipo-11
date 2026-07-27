"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Importamos la versión outline para los estados inactivos
import {
  HomeIcon as HomeIconOutline,
  PlusCircleIcon as PlusCircleIconOutline,
  ListBulletIcon as ListBulletIconOutline,
  UserIcon as UserIconOutline,
} from "@heroicons/react/24/outline";

// Importamos la versión solid para los estados activos
import {
  HomeIcon as HomeIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  ListBulletIcon as ListBulletIconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid";

export const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path) => {
    if (!pathname) return false;

    // Si la ruta es /home, validamos que coincida exactamente
    if (path === "/home") return pathname === "/home" || pathname === "/";

    return pathname === path || pathname.startsWith(path + "/");
  };

  // Estilo para Home, Clientes y Perfil: Cuadro de fondo azul al seleccionar
  const getBoxLinkStyles = (path) => {
    const active = isActive(path);

    return `flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 ${
      active
        ? "bg-[#0B376D] text-white shadow-md"
        : "text-[#0B376D] hover:bg-gray-100"
    }`;
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {/* --- HOME (Cuadro azul al seleccionar) --- */}
        <Link href="/home" className={getBoxLinkStyles("/")}>
          {isActive("/home") ? (
            <HomeIconSolid className="h-7 w-7" />
          ) : (
            <HomeIconOutline className="h-7 w-7" />
          )}
        </Link>

        {/* --- PRESUPUESTOS --- */}
        <Link
          href="/presupuestos"
          className="flex items-center justify-center p-1 rounded-full transition-all duration-200 hover:scale-105"
        >
          {isActive("/presupuestos") ? (
            <PlusCircleIconSolid className="h-9 w-9 text-[#0B376D]" />
          ) : (
            <PlusCircleIconOutline className="h-9 w-9 text-[#0B376D]" />
          )}
        </Link>

        {/* --- CLIENTES (Cuadro azul al seleccionar) --- */}
        <Link href="/clientes" className={getBoxLinkStyles("/clientes")}>
          {isActive("/clientes") ? (
            <ListBulletIconSolid className="h-7 w-7" />
          ) : (
            <ListBulletIconOutline className="h-7 w-7" />
          )}
        </Link>

        {/* --- PERFIL (Cuadro azul al seleccionar) --- */}
        <Link href="/perfil" className={getBoxLinkStyles("/perfil")}>
          {isActive("/perfil") ? (
            <UserIconSolid className="h-7 w-7" />
          ) : (
            <UserIconOutline className="h-7 w-7" />
          )}
        </Link>
      </div>
    </nav>
  );
};
