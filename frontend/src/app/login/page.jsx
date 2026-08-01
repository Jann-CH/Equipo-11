import { LoginForm } from "@/components/auth/LoginForm";
import { FadeIn } from "@/components/ui/FadeIn";
export default function LoginPage() {
  return (
    <FadeIn>
      <main className="min-h-screen flex items-center justify-center bg-white px-5">
        <LoginForm />
      </main>
    </FadeIn>
  );
}
