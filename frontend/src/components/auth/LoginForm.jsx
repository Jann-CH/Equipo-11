"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { loginService } from "@/services/authService"; 
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export const LoginForm = () => {
  const router = useRouter(); 
  
  // Estado para manejar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError, 
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await loginService(data);
      router.push("/dashboard");
    } catch (error) {
      setError("password", {
        type: "manual",
        message: error.response?.data?.message || "Credenciales inválidas. Verificá tu email y contraseña.",
      });
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Bienvenido a InnovaLab</h2>
        <p className="text-sm text-gray-500">Ingresa a tu cuenta para continuar</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="ejemplo@empresa.com"
          {...register("email")}
          error={errors.email?.message}
        />

        {/* Contenedor relativo para posicionar el botón del ojo */}
        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />
          
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Link: Olvidé mi contraseña*/}
        <div className="flex justify-end mt-1">
          <Link
            href="#"
            onClick={(e) => e.preventDefault()} // Previene la navegación
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Autenticando..." : "Iniciar Sesión"}
        </button>
      </form>

      {/* Link: Registro */}
      <div className="mt-6 text-center text-sm text-gray-600 border-t pt-4">
        ¿Aún no tenés cuenta?{" "}
        <Link
          href="#"
          onClick={(e) => e.preventDefault()} // Previene la navegación
          className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
        >
          Registrate
        </Link>
      </div>
    </div>
  );
};