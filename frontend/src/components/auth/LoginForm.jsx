"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { loginService } from "@/services/authService"; 
import { useRouter } from "next/navigation"; 

export const LoginForm = () => {
  const router = useRouter(); 
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

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Autenticando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
};