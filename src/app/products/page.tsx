import { CharacterSelect } from "@/components/CharacterSelect";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Zambezi Duffel Bags",
  description: "Explore the HYDE Zambezi founders' drop: bold vegan leather duffel bags designed in Lagos, Nigeria. Compare the leopard and dark editions.",
  path: "/products",
  image: "/images/bag-001-leopard.jpg",
});

export default function ProductsPage() {
  return <CharacterSelect />;
}
