import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trazabilidad de Trámites Municipales | AI-DLC Oriente Boliviano",
  description:
    "Sistema de apoyo a la decisión socioambiental y trazabilidad inmutable de trámites municipales para el oriente boliviano.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full antialiased flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
