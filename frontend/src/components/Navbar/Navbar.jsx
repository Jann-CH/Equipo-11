import Link from "next/link";
import { HomeIcon, PlusCircleIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon as UserIconSolid } from "@heroicons/react/24/solid";

export const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        
        <Link href="/" className="text-[#0B376D]">
          <HomeIcon className="h-8 w-8" />
        </Link>
        
        <Link href="/items" className="text-[#0B376D]">
          <PlusCircleIcon className="h-10 w-10" />
        </Link>
        
        <Link href="/clientes" className="text-[#0B376D]">
          <ListBulletIcon className="h-8 w-8" />
        </Link>
        
        <Link href="/perfil" className="text-[#0B376D]">
          <UserIconSolid className="h-9 w-9" />
        </Link>
        
      </div>
    </nav>
  );
};