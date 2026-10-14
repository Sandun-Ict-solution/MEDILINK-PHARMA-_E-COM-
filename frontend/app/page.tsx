import Image from "next/image";
import CampaignSlider from "./campaign-slider";
import Link from "next/link";
import { ProductCard, Shell } from "./components";
import { productsBySection } from "./data";

const medicines = productsBySection("medicines");
const categories = [
  { href: "/products", icon: "Rx", title: "Medicines", text: "Pain relief, allergy care and prescription items" },
  { href: "/health-essentials", icon: "+", title: "Health Essentials", text: "Devices, first aid and everyday hygiene" },
  { href: "/personal-care", icon: "◌", title: "Personal Care", text: "Skin, hair, oral and baby care" },
  { href: "/wellness", icon: "⌁", title: "Wellness", text: "Nutrition, fitness and sleep support" },
];

export default function Home() {
  return (
    <Shell>
      <div className="welcomeMotionScope">
      <CampaignSlider />
      <section className="hero section">
        <div className="heroCopy"><span className="pill">Your trusted online pharmacy</span><h1>Healthcare made <em>simple, safe</em> and accessible.</h1><p>Order genuine medicines and wellness essentials from home. Every prescription order is checked by a pharmacist.</p><div className="heroActions"><Link className="primaryBtn" href="/account">Sign in to discover <span>→</span></Link><Link className="secondaryBtn" href="/account">Get started</Link></div><div className="trustRow"><span>✓ Licensed pharmacy</span><span>✓ Secure checkout</span><span>✓ Fast delivery</span></div></div>
        <div className="heroVisual"><Image src="/assets/hero-pharmacy.png" alt="Pharmacy medicines and healthcare products" width={1693} height={929} priority/><div className="floatCard verified"><b>✓ Pharmacist verified</b><small>Safe & genuine medicines</small></div><div className="floatCard delivery"><b>🚚 Islandwide delivery</b><small>Track your orders</small></div></div>
      </section>
      <section className="benefits section"><article><i>⌕</i><div><b>Find your medicine</b><span>Search by name or category</span></div></article><article><i>▣</i><div><b>Upload prescription</b><span>Quick pharmacist review</span></div></article><article><i>⌂</i><div><b>Delivered to your door</b><span>Safe, discreet and trackable</span></div></article></section>
      <section className="section block categoriesBlock"><div className="sectionHead"><div><span className="kicker">SHOP BY CATEGORY</span><h2>Everything for everyday health</h2></div></div><div className="categoryGrid">{categories.map((category) => <Link href={category.href} key={category.href}><i>{category.icon}</i><h3>{category.title}</h3><p>{category.text}</p><span>Explore →</span></Link>)}</div></section>
      <section className="section block softBlock"><div className="sectionHead"><div><span className="kicker">POPULAR PICKS</span><h2>Everyday medicines</h2></div><Link href="/products">View all products →</Link></div><div className="productGrid four">{medicines.slice(0, 4).map((product) => <ProductCard key={product.id} product={product}/>)}</div></section>
      <section className="rxBanner section"><div><span className="rxIcon">Rx</span></div><div><span className="kicker">HAVE A PRESCRIPTION?</span><h2>Upload it in less than a minute</h2><p>Our pharmacist will review it, confirm availability and help prepare the correct medicines.</p></div><Link className="whiteBtn" href="/account">Sign in to upload →</Link></section>
      </div>
    </Shell>
  );
}
