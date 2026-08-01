"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; 

export const BackButton = ({ onClick }) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Si le pasamos una función (como cerrar el "Ver más"), la ejecuta
    } else {
      router.back(); // Si no, hace la navegación normal de Next.js
    }
  };

  return (
    <button 
      onClick={handleClick} 
      className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
    >
      <ArrowLeft size={24} className="text-black" />
    </button>
  );
};