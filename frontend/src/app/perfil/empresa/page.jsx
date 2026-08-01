import { MyCompanyForm } from "@/components/auth/MyCompanyForm";
import { FadeIn } from "@/components/ui/FadeIn";

export default function EditarCompanyPage() {
  return (
    <FadeIn>
      <main className="min-h-screen bg-gray-50 pb-24 p-4 max-w-md mx-auto">
        <MyCompanyForm />
      </main>
    </FadeIn>
  );
}
