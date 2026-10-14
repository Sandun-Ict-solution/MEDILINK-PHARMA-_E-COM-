import { CatalogView, Shell } from "../components";
import { productsBySection } from "../data";

export default async function Products({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return <Shell><CatalogView items={productsBySection("medicines")} title="Medicines & Healthcare" description="Find genuine medicines and everyday healthcare essentials from trusted pharmacy suppliers." initialSearch={q}/></Shell>;
}
