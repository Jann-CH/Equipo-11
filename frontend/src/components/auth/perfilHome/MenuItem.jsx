import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export const MenuItem = ({ icon: Icon, title, subtitle, href }) => (
  <Link 
    href={href} 
    className="flex w-full items-center gap-4 py-4 px-4 hover:bg-gray-50 transition-colors"
  >
    {/* Contenedor del icono (usamos el color #0B376D) */}
    <div className="shrink-0 text-[#0B376D] text-2xl">
      {Icon}
    </div>
    
    <div className="flex grow flex-col text-left">
      <span className="text-base font-semibold text-[#0B376D]">{title}</span>
      {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
    </div>
    
    <div className="shrink-0">
      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
    </div>
  </Link>
);