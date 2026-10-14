"use client";

import Link from "next/link";
import { ProductImage, Shell } from "../components";
import { useStore } from "../store";

export default function Cart() {
  const { cartDetailed, cartTotal, updateQuantity, removeFromCart } = useStore();
  const delivery = cartTotal === 0 || cartTotal >= 1500 ? 0 : 350;
  const serviceFee = cartTotal > 0 ? 50 : 0;
  const total = cartTotal + delivery + serviceFee;
  return (
    <Shell><section className="cartPage section"><div className="sectionHead"><div><span className="kicker">YOUR ORDER</span><h1>Shopping cart</h1></div><Link href="/products">← Continue shopping</Link></div>
      {!cartDetailed.length ? <div className="emptyPage compact"><span>🛒</span><h2>Your cart is empty</h2><p>Add medicines or healthcare products to start your order.</p><Link className="primaryBtn" href="/products">Browse products</Link></div> : <div className="cartLayout"><div className="cartItems">{cartDetailed.map(({ product, quantity }) => <article className="cartItem" key={product.id}><Link href={`/products/${product.id}`}><ProductImage product={product} className="miniImage"/></Link><div className="itemInfo"><span>{product.type}</span><h3><Link href={`/products/${product.id}`}>{product.name}</Link></h3><small>{product.form}</small><button onClick={() => removeFromCart(product.id)}>Remove</button></div><div className="qty"><button onClick={() => updateQuantity(product.id, quantity - 1)} aria-label="Decrease quantity">−</button><span>{quantity}</span><button onClick={() => updateQuantity(product.id, quantity + 1)} aria-label="Increase quantity">+</button></div><b>Rs. {(product.price * quantity).toLocaleString()}</b></article>)}<div className="deliveryNote"><span>🚚</span><div><b>{cartTotal >= 1500 ? "You qualify for free delivery!" : `Add Rs. ${(1500 - cartTotal).toLocaleString()} more for free delivery`}</b><p>Your order will usually arrive within 1–3 working days.</p></div></div></div><aside className="summaryCard"><h2>Order summary</h2><div><span>Subtotal</span><b>Rs. {cartTotal.toLocaleString()}</b></div><div><span>Delivery</span><b className={delivery === 0 ? "free" : ""}>{delivery === 0 ? "FREE" : `Rs. ${delivery}`}</b></div><div><span>Service fee</span><b>Rs. {serviceFee}</b></div><hr/><div className="total"><span>Total</span><b>Rs. {total.toLocaleString()}</b></div><small>Taxes included where applicable</small><Link href="/checkout" className="primaryBtn">Proceed to checkout →</Link><p className="secure">🔒 Secure checkout</p></aside></div>}
    </section></Shell>
  );
}
