import { ClientesPage } from "@/components/clientes/ClientesHome";
import { FadeIn } from "@/components/ui/FadeIn";


export default function Page() {

  return (
    <FadeIn>
    <main className="min-h-screen bg-gray-50 pb-24">

      <div className="max-w-md mx-auto">

        <ClientesPage />

      </div>

    </main>
    </FadeIn>
  );
}
