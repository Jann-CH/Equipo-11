// app/perfil/page.jsx (o donde tengas tu PerfilScreen)
'use client';
import { useState, useEffect } from 'react';
import { getMeService } from '@/services/authService';
import { MenuItem } from './MenuItem';
import { 
  UserIcon, BuildingOfficeIcon, ShieldCheckIcon, 
  DocumentTextIcon, Cog6ToothIcon, BellIcon, 
  PaintBrushIcon, QuestionMarkCircleIcon, 
  DocumentIcon, InformationCircleIcon 
} from '@heroicons/react/24/outline';

export const PerfilHome = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMeService().then(res => setUser(res.user)).catch(console.error);
  }, []);

  console.log("USUARIO: ", user);

  if (!user) return <div>Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <main className="p-6 pt-16 max-w-md mx-auto">
        <h1 className="mb-6 text-3xl font-extrabold text-[#0B376D]">Perfil</h1>

        {/* Tarjeta de usuario */}
        <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#0B376D] flex items-center justify-center text-white font-bold text-xl">
              {user.nombre[0]}{user.apellido[0]}
            </div>
            <div>
              <p className="text-lg font-bold text-[#0B376D]">{user.nombre} {user.apellido}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Menú de navegación */}
        <div className="rounded-3xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <MenuItem icon={<UserIcon />} title="Mis datos" subtitle="Editar info personal" href="/perfil/editar" />
          <MenuItem icon={<BuildingOfficeIcon />} title="Mi empresa" subtitle="Datos de configuración" href="/perfil/empresa" />
          <MenuItem icon={<ShieldCheckIcon />} title="Seguridad" subtitle="Cambiar contraseña" href="/perfil/seguridad" />
          <MenuItem icon={<DocumentTextIcon />} title="Mis productos" subtitle="Gestionar servicios" href="/productos" />
          <MenuItem icon={<Cog6ToothIcon />} title="Mis clientes" subtitle="Cartera de clientes" href="/clientes" />
        </div>

        <div className="mt-8 rounded-3xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <MenuItem icon={<BellIcon />} title="Notificaciones" subtitle="Alertas" href="/notificaciones" />
          <MenuItem icon={<PaintBrushIcon />} title="Apariencia" subtitle="Personalización" href="/apariencia" />
        </div>
      </main>
    </div>
  );
};
