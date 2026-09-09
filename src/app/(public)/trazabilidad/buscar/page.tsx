import { redirect } from "next/navigation";

export default async function BuscarTrazabilidadPage({
  searchParams,
}: {
  searchParams: Promise<{ codigo?: string }>;
}) {
  const params = await searchParams;
  const codigo = params.codigo ? params.codigo.trim() : "TRAM-SCZ-2026-000102";
  redirect(`/trazabilidad/${encodeURIComponent(codigo)}`);
}
