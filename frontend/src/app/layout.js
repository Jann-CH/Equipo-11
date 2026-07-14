import { Geist, Geist_Mono } from "next/font/google";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Innova Lab",
    template: "%s | Innova Lab",
  },
  description: "Plataforma de gestión de presupuestos para emprendedores",
  robots: {
    index: false, // No indexar la app en buscadores (es una app privada)
    follow: false,
  },
};



export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* pb-24 asegura que el contenido no quede detrás del nav en las rutas protegidas */}
        <main className="flex-grow pb-24">
          {children}
        </main>
        
        {/* El wrapper decidirá internamente si mostrarse o no */}
        <NavbarWrapper />
      </body>
    </html>
  );
}
