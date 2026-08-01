import { RegisterForm } from "@/components/auth/RegisterForm";
import { FadeIn } from "@/components/ui/FadeIn";

export default function RegisterPage() {
  return (
    <FadeIn>
      <main className="min-h-screen flex items-center justify-center bg-white px-5">
        <RegisterForm />
      </main>
    </FadeIn>
  );
}
