import Historial from "@/components/historial/Historial";
import { FadeIn } from "@/components/ui/FadeIn";

export default function PresupuestoHistorial() {
  return (
    <FadeIn>
      <main className="min-h-screen bg-gray-50 pb-24">
        <div className="max-w-md mx-auto">
          <Historial />
        </div>
      </main>
    </FadeIn>
  );
}
