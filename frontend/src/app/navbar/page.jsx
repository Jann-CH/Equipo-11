import { Navbar } from "@/components/Navbar/Navbar";
import { FadeIn } from "@/components/ui/FadeIn";
export default function NavbarPage() {
  return (
    <FadeIn>
      <main className="min-h-screen flex items-center justify-center bg-white px-5">
        <div className="max-w-md mx-auto">
          <Navbar />
        </div>
      </main>
    </FadeIn>
  );
}
