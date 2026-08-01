import { PerfilHome } from "@/components/auth/perfilHome/PerfilHome";
import { FadeIn } from "@/components/ui/FadeIn";

export default function PerfilHomePage() {
  return (
    <FadeIn>
      <main className="min-h-screen bg-gray-50 pb-24">
        <div className="max-w-md mx-auto">
          <PerfilHome />
        </div>
      </main>
    </FadeIn>
  );
}
