import { MyDateForm } from "@/components/auth/MyDateForm";
import { FadeIn } from "@/components/ui/FadeIn";

export default function EditarPerfilPage() {
  return (
    <FadeIn>
      <main className="min-h-screen bg-gray-50 pb-24 p-4 max-w-md mx-auto">
        <MyDateForm />
      </main>
    </FadeIn>
  );
}
