"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import type { Product, ProductSection } from "./data";
import { sectionDetails } from "./data";
import { useStore } from "./store";
import { api } from "./api-client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Find Medicine" },
  { href: "/products", label: "Medicines" },
  { href: "/health-essentials", label: "Health Essentials" },
  { href: "/personal-care", label: "Personal Care" },
  { href: "/services", label: "Services" },

];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useStore();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn,setSignedIn] = useState(false);
  useEffect(()=>{let alive=true;const refresh=()=>api("/auth/me").then(()=>{if(alive)setSignedIn(true)}).catch(()=>{if(alive)setSignedIn(false)});refresh();window.addEventListener("medilink:session-changed",refresh);return()=>{alive=false;window.removeEventListener("medilink:session-changed",refresh)}},[pathname]);
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const value = search.trim();
    router.push(!signedIn?"/account":value ? `/search?q=${encodeURIComponent(value)}` : "/search");
    setMenuOpen(false);
  };
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/products") return pathname.startsWith("/products");
    return pathname.startsWith(href);
  };
  return (
    <>
      <div className="notice"><span>✓ Licensed pharmacy</span><span>Islandwide delivery</span><span>Pharmacist verified</span><a href="mailto:medilinklankapharma@gmail.com">Email MEDILINK</a></div>
      <header className="header">
        <Link className="brand" href="/" aria-label="MEDILINK home"><span className="brandMark">+</span><span>MEDI<b>LINK</b></span></Link>
        <button className="menuBtn" onClick={() => setMenuOpen((open) => !open)} aria-label="Open menu" aria-expanded={menuOpen}>☰</button>
        <nav className={`nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          {navLinks.filter(item=>signedIn||item.href==="/").map((item) => <Link key={item.href} className={isActive(item.href) ? "active" : ""} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
        </nav>
        <div className="headerActions">
          <form className="headerSearch" onSubmit={submitSearch}><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search medicines..." aria-label="Search products" /></form>
          <Link className="accountLink" href="/account" aria-label="Account"><span>●</span><b>Account</b></Link>
          {signedIn && <Link className="cartLink" href="/cart" aria-label={`Cart with ${cartCount} items`}><span>🛒</span>{cartCount > 0 && <b>{cartCount}</b>}</Link>}
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footerGrid">
        <div className="footerAbout"><div className="brand light"><span className="brandMark">+</span><span>MEDI<b>LINK</b></span></div><p>Safe, convenient access to medicines and everyday healthcare essentials across Sri Lanka.</p><div className="footerTrust"><span>✓ Pharmacist verified</span><span>✓ Secure checkout</span></div></div>
        <div><h3>Shop</h3><Link href="/discover">Find Medicine</Link><Link href="/products">Medicines</Link><Link href="/health-essentials">Health Essentials</Link><Link href="/personal-care">Personal Care</Link><Link href="/wellness">Wellness</Link></div>
        <div><h3>Services</h3><Link href="/services">All Services</Link><Link href="/prescription">Upload Prescription</Link><Link href="/orders">Track Orders</Link><Link href="/delivery-information">Delivery Information</Link><Link href="/returns-refunds">Returns &amp; Refunds</Link><Link href="/community">Refills &amp; Reviews</Link><Link href="/enhanced-services">Pharmacist Support</Link></div>
        <div><h3>Need help?</h3><a href="mailto:medilinklankapharma@gmail.com">medilinklankapharma@gmail.com</a><a href="mailto:medilinklankapharma@gmail.com">Email MEDILINK</a><span>Mon–Sat: 8.00 AM–8.00 PM</span><span>Sun: 9.00 AM–5.00 PM</span></div>
      </div>
      <div className="footerBottom"><span>© 2026 MEDILINK Online Pharmacy.</span><span><Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms &amp; Conditions</Link></span></div>
    </footer>
  );
}

export function Shell({ children }: { children: ReactNode }) { return <><Header /><main>{children}</main><Footer /></>; }

export function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  const col = product.spriteIndex % product.columns;
  const row = Math.floor(product.spriteIndex / product.columns);
  const x = product.columns === 1 ? 0 : (col / (product.columns - 1)) * 100;
  const y = product.rows === 1 ? 0 : (row / (product.rows - 1)) * 100;
  const style = { backgroundImage: `url("${product.sheet}")`, backgroundSize: `${product.columns * 100}% ${product.rows * 100}%`, backgroundPosition: `${x}% ${y}%`, aspectRatio: product.cellRatio } as CSSProperties;
  return <div className={`spriteImage ${className}`} style={style} role="img" aria-label={product.name} />;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleFavourite, isFavourite } = useStore();
  const saved = isFavourite(product.id);
  const [added, setAdded] = useState(false);
  const add = async () => { try { await api("/auth/me"); addToCart(product.id); setAdded(true); window.setTimeout(() => setAdded(false), 1200); } catch { window.location.href="/account"; } };
  return (
    <article className="productCard">
      <div className="productImageWrap"><Link href={`/products/${product.id}`} aria-label={`View ${product.name}`}><ProductImage product={product} className="productImage" /></Link>{product.rx && <span className="rxBadge">Rx</span>}<button className={`heart ${saved ? "saved" : ""}`} onClick={() => toggleFavourite(product.id)} aria-label={`${saved ? "Remove" : "Save"} ${product.name}`}>{saved ? "♥" : "♡"}</button></div>
      <p className="eyebrow">{product.type}</p><Link href={`/products/${product.id}`} className="productName">{product.name}</Link><p className="productForm">{product.form}</p>
      <div className="rating" aria-label={`${product.rating} out of 5 stars`}>★★★★★ <span>{product.rating} ({product.reviews})</span></div>
      <div className="priceRow"><strong>Rs. {product.price.toLocaleString()}</strong><del>Rs. {product.old.toLocaleString()}</del></div>
      <button className={`addBtn ${added ? "added" : ""}`} onClick={add}>{added ? "✓ Added to cart" : "Add to cart"}</button>
    </article>
  );
}

type CatalogViewProps = { items: Product[]; title: string; description: string; initialSearch?: string; eyebrow?: string };

export function CatalogView({ items, title, description, initialSearch = "", eyebrow = "MEDILINK PHARMACY" }: CatalogViewProps) {
  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.type))), [items]);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("All Products");
  const [rxFilter, setRxFilter] = useState<"all" | "otc" | "rx">("all");
  const [stockOnly, setStockOnly] = useState(false);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const chooseCategory = (value: string) => { setCategory(value); setPage(1); };
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = items.filter((item) => {
      const matchesSearch = !query || `${item.name} ${item.type} ${item.description}`.toLowerCase().includes(query);
      const matchesCategory = category === "All Products" || item.type === category;
      const matchesRx = rxFilter === "all" || (rxFilter === "rx" ? item.rx : !item.rx);
      return matchesSearch && matchesCategory && matchesRx && (!stockOnly || item.stock > 0);
    });
    return [...list].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : b.reviews - a.reviews);
  }, [items, search, category, rxFilter, stockOnly, sort]);
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return (
    <>
      <section className="pageTop"><div className="section"><span className="kicker">{eyebrow}</span><h1>{title}</h1><p>{description}</p><form className="searchBox" onSubmit={(event) => event.preventDefault()}><span>⌕</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} aria-label="Search products" placeholder="Search products, brands or conditions..."/><button type="submit">Search</button></form></div></section>
      <section className="catalog section">
        <aside className="filters"><h3>Categories</h3>{["All Products", ...categories].map((name) => <button className={category === name ? "selected" : ""} onClick={() => chooseCategory(name)} key={name}><span>{name}</span><b>{name === "All Products" ? items.length : items.filter((item) => item.type === name).length}</b></button>)}<hr/><h3>Prescription</h3><label><input type="radio" name="rx" checked={rxFilter === "all"} onChange={() => { setRxFilter("all"); setPage(1); }}/> All products</label><label><input type="radio" name="rx" checked={rxFilter === "otc"} onChange={() => { setRxFilter("otc"); setPage(1); }}/> No prescription required</label><label><input type="radio" name="rx" checked={rxFilter === "rx"} onChange={() => { setRxFilter("rx"); setPage(1); }}/> Prescription required</label><hr/><label className="stockFilter"><input type="checkbox" checked={stockOnly} onChange={(event) => { setStockOnly(event.target.checked); setPage(1); }}/> In stock only</label></aside>
        <div className="catalogMain"><div className="results"><span>Showing <b>{visible.length}</b> of <b>{filtered.length}</b> products</span><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} aria-label="Sort products"><option value="popular">Most popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Highest rated</option></select></div>{visible.length ? <div className="productGrid four">{visible.map((product) => <ProductCard key={product.id} product={product}/>)}</div> : <div className="emptyState"><span>⌕</span><h2>No products found</h2><p>Try a different search or filter.</p><button className="secondaryBtn" onClick={() => { setSearch(""); setCategory("All Products"); setRxFilter("all"); setStockOnly(false); }}>Clear filters</button></div>}{pageCount > 1 && <div className="pagination"><button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} aria-label="Previous page">‹</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button className={currentPage === number ? "active" : ""} onClick={() => setPage(number)} key={number}>{number}</button>)}<button onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount} aria-label="Next page">›</button></div>}</div>
      </section>
    </>
  );
}

export function CategoryLanding({ section, items }: { section: Exclude<ProductSection, "medicines">; items: Product[] }) {
  const details = sectionDetails[section];
  return <CatalogView items={items} title={details.title} description={details.description} eyebrow={details.eyebrow}/>;
}
