"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ProductCard, ProductImage, Shell } from "../../components";
import { productById, products } from "../../data";
import { useStore } from "../../store";

export default function ProductDetails() {
  const params = useParams<{ id: string }>();
  const product = productById(params.id);
  const { addToCart, toggleFavourite, isFavourite } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"details" | "usage" | "safety">("details");
  const [added, setAdded] = useState(false);
  if (!product) return <Shell><section className="emptyPage section"><span>?</span><h1>Product not found</h1><p>The product may have moved or is no longer available.</p><Link className="primaryBtn" href="/products">Back to medicines</Link></section></Shell>;
  const sectionPath = product.section === "medicines" ? "/products" : product.section === "health" ? "/health-essentials" : product.section === "personal" ? "/personal-care" : "/wellness";
  const related = products.filter((item) => item.section === product.section && item.id !== product.id).slice(0, 4);
  const add = () => { addToCart(product.id, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1500); };
  return (
    <Shell>
      <section className="detail section">
        <p className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href={sectionPath}>{product.section === "medicines" ? "Medicines" : product.type}</Link><span>/</span>{product.name}</p>
        <div className="detailGrid"><div className="detailMedia"><ProductImage product={product} className="detailImage"/><div className="imageNote">Actual packaging may vary slightly</div></div><div className="detailCopy"><span className="kicker">{product.type}</span><h1>{product.name}</h1><p className="productCode">In stock · {product.form} · Product ID: {product.id.toUpperCase()}</p><div className="rating big">★★★★★ <span>{product.rating} · {product.reviews} verified reviews</span></div><p className="summary">{product.description}</p>{product.rx && <div className="warning"><b>Prescription required</b><span>A pharmacist must verify a valid prescription before this item can be dispatched.</span><Link href="/prescription">Upload prescription →</Link></div>}<div className="detailPrice">Rs. {product.price.toLocaleString()} <del>Rs. {product.old.toLocaleString()}</del><small>You save Rs. {(product.old - product.price).toLocaleString()} · Tax included</small></div><div className="purchase"><div className="qty"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">−</button><span>{quantity}</span><button onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} aria-label="Increase quantity">+</button></div><button className="primaryBtn grow" onClick={add}>{added ? "✓ Added to cart" : "Add to cart"}</button><button className={`wishBtn ${isFavourite(product.id) ? "saved" : ""}`} onClick={() => toggleFavourite(product.id)} aria-label="Toggle favourite">{isFavourite(product.id) ? "♥" : "♡"}</button></div><div className="serviceNotes"><span>✓ Genuine product guarantee</span><span>🚚 Delivery in 1–3 working days</span><span>☎ Pharmacist help available</span></div></div></div>
        <div className="tabs" role="tablist"><button className={tab === "details" ? "active" : ""} onClick={() => setTab("details")}>Product details</button><button className={tab === "usage" ? "active" : ""} onClick={() => setTab("usage")}>Usage guidance</button><button className={tab === "safety" ? "active" : ""} onClick={() => setTab("safety")}>Safety information</button></div>
        <div className="infoPanel">{tab === "details" && <><h2>About this product</h2><p>{product.description} This product is supplied through MEDILINK’s trusted pharmacy network. Always inspect the seal and expiry date when you receive it.</p><ul><li>Pack: {product.form}</li><li>Available stock: {product.stock} units</li><li>Prescription: {product.rx ? "Required" : "Not required"}</li></ul></>}{tab === "usage" && <><h2>How to use</h2><p>{product.usage}</p><p>For medicine products, follow advice from your doctor or pharmacist. Do not exceed the stated dose.</p></>}{tab === "safety" && <><h2>Important safety information</h2><p>{product.safety}</p><p>Stop use and seek medical advice if you experience an unexpected reaction.</p></>}</div>
      </section>
      <section className="section related block"><div className="sectionHead"><div><span className="kicker">YOU MAY ALSO LIKE</span><h2>Related products</h2></div><Link href={sectionPath}>View all →</Link></div><div className="productGrid four">{related.map((item) => <ProductCard key={item.id} product={item}/>)}</div></section>
    </Shell>
  );
}
