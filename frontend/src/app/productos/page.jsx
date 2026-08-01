import { ItemsPage } from "@/components/items/ItemsHome";
import { FadeIn } from "@/components/ui/FadeIn";

export default function Page() {
  return (
    <FadeIn>
      <main className="min-h-screen bg-gray-50 pb-24">
        <div className="max-w-md mx-auto">
          <ItemsPage />
        </div>
      </main>
    </FadeIn>
  );
}
