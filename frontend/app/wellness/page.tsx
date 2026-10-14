import { CategoryLanding, Shell } from "../components";
import { productsBySection } from "../data";

export default function Wellness() {
  return <Shell><CategoryLanding section="wellness" items={productsBySection("wellness")}/></Shell>;
}
