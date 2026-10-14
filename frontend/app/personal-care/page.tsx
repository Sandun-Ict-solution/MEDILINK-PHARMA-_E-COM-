import { CategoryLanding, Shell } from "../components";
import { productsBySection } from "../data";

export default function PersonalCare() {
  return <Shell><CategoryLanding section="personal" items={productsBySection("personal")}/></Shell>;
}
