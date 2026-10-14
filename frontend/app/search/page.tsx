import { CatalogView, Shell } from "../components";
import { products } from "../data";

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return <Shell><CatalogView items={products} title="Search MEDILINK" description="Search across medicines, health essentials, personal care and wellness products." initialSearch={q} eyebrow="FIND WHAT YOU NEED"/></Shell>;
}
