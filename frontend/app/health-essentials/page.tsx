import { CategoryLanding, Shell } from "../components";
import { productsBySection } from "../data";

export default function HealthEssentials() {
  return <Shell><CategoryLanding section="health" items={productsBySection("health")}/></Shell>;
}
