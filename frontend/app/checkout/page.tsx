"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ProductImage, Shell } from "../components";
import { useStore } from "../store";
import { api, post } from "../api-client";

export default function Checkout() {
  const { cartDetailed, cartTotal, profile, clearCart } = useStore();
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [city, setCity] = useState("");
  const [payment, setPayment] = useState("Cash on delivery");
  const [cardAvailable,setCardAvailable]=useState(false);
  const [cardMessage,setCardMessage]=useState("");
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(()=>{api<{methods:{card:boolean},reason?:string}>("/payments/methods").then(r=>{setCardAvailable(r.methods.card);setCardMessage(r.reason||"");}).catch(()=>setCardMessage("Payment provider availability could not be checked."));},[]);
  const delivery = cartTotal >= 1500 ? 0 : 350;
  const total = cartTotal + delivery + 50;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) { setError("Please complete your delivery details."); return; }
    if (cartDetailed.some(({product})=>product.rx)) {setError("Prescription medicines require pharmacist approval before payment.");return;}
    setBusy(true);setError("");
    try {
      const created=await post<{order:{id:string}}>("/orders",{items:cartDetailed.map(({product,quantity})=>({sku:product.id,quantity})),address:`${name}; ${phone}; ${address}, ${city}`});
      if(payment==="Card payment") {
        if(!cardAvailable)throw new Error("Card checkout is not enabled by the payment provider. Please choose cash on delivery.");
        const words=name.trim().split(/\s+/);const firstName=words.shift()||name;const lastName=words.join(" ")||"Customer";
        const info=await post<{action:string,fields:Record<string,string>}>("/payhere/create-checkout",{orderId:created.order.id,firstName,lastName,email:profile?.email||"",phone,address,city});
        const paymentForm=document.createElement("form");paymentForm.method="POST";paymentForm.action=info.action;
        for(const [key,value] of Object.entries(info.fields)){const hidden=document.createElement("input");hidden.type="hidden";hidden.name=key;hidden.value=value;paymentForm.appendChild(hidden)}
        document.body.appendChild(paymentForm);try{sessionStorage.setItem("medilink_pending_card_order",created.order.id);}catch{};
        paymentForm.submit();return;
      }
      if(payment==="PayPal") {
        const result=await post<{approveUrl:string}>("/paypal/create-order",{orderId:created.order.id});
        if(!result.approveUrl)throw new Error("PayPal approval URL missing");
        window.location.assign(result.approveUrl);return;
      }
      await post(`/orders/${created.order.id}/cod`,{});
      setOrderId(created.order.id);
      clearCart();
    } catch (e) {setError(e instanceof Error?e.message:"Order could not be saved");}finally{setBusy(false);}
  };
  if (orderId) return <Shell><section className="emptyPage section"><span className="successIcon">✓</span><h1>Order confirmed!</h1><p>Thank you, {name}. Your order number is <b>{orderId}</b>.</p><div className="heroActions"><Link className="primaryBtn" href="/orders">Track order</Link><Link className="secondaryBtn" href="/">Back home</Link></div></section></Shell>;
  if (!cartDetailed.length) return <Shell><section className="emptyPage section"><span>🛒</span><h1>Your cart is empty</h1><p>Add a product before starting checkout.</p><Link className="primaryBtn" href="/products">Browse medicines</Link></section></Shell>;
  return (
    <Shell><section className="checkoutPage section"><div className="sectionHead"><div><span className="kicker">SECURE CHECKOUT</span><h1>Delivery & payment</h1></div><Link href="/cart">← Back to cart</Link></div><div className="checkoutGrid"><form className="checkoutForm" onSubmit={submit}><div className="formSection"><h2>1. Delivery details</h2><div className="formGrid"><label>Full name *<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name"/></label><label>Phone number *<input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="077 123 4567" inputMode="tel"/></label><label className="full">Address *<textarea value={address} onChange={(event) => setAddress(event.target.value)} placeholder="House number, street and area"/></label><label className="full">City *<input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Colombo"/></label></div></div><div className="formSection"><h2>2. Choose your payment method</h2><p className="paymentDescription">Pay securely using an available method. Your card number and CVV are entered only on the hosted payment provider page, never on MEDILINK.</p><label className={`paymentOption ${payment === "Cash on delivery" ? "selected" : ""}`}><input type="radio" name="payment" checked={payment === "Cash on delivery"} onChange={() => setPayment("Cash on delivery")}/><span><b>Cash on delivery</b><small>Pay when your order arrives</small></span></label><label className={`paymentOption ${payment === "Card payment" ? "selected" : ""}`}><input type="radio" name="payment" checked={payment === "Card payment"} disabled={!cardAvailable} onChange={() => setPayment("Card payment")}/><span><b>💳 Pay by card · Visa / Mastercard</b><small>{cardAvailable?"Secure PayHere hosted checkout — card details never touch MEDILINK":"Card gateway requires PayHere merchant setup"}</small></span></label><label className="paymentOption" style={{opacity:.6}}><input type="radio" name="payment" disabled/><span><b>Google Pay</b><small>Available only after approval from a supported processor; not enabled</small></span></label><label className={`paymentOption ${payment === "PayPal" ? "selected" : ""}`}><input type="radio" name="payment" checked={payment === "PayPal"} disabled onChange={() => setPayment("PayPal")}/><span><b>PayPal checkout</b><small>Unavailable until supported LKR→USD conversion is configured</small></span></label></div>{cardMessage && <p className="gatewayNotice" role="status">{cardAvailable?"✓ Card gateway ready. ":"ℹ Card gateway unavailable. "}{cardMessage}</p>}{error && <p className="formError">{error}</p>}<button className="primaryBtn checkoutSubmit" disabled={busy || (payment === "Card payment" && !cardAvailable)} type="submit">{payment === "Card payment" ? "Continue to secure card payment" : "Place order"} · Rs. {total.toLocaleString()}</button></form><aside className="summaryCard checkoutSummary"><h2>Your order</h2>{cartDetailed.map(({ product, quantity }) => <div className="checkoutItem" key={product.id}><ProductImage product={product}/><span><b>{product.name}</b><small>{quantity} × Rs. {product.price.toLocaleString()}</small></span></div>)}<hr/><div><span>Subtotal</span><b>Rs. {cartTotal.toLocaleString()}</b></div><div><span>Delivery</span><b className={delivery === 0 ? "free" : ""}>{delivery === 0 ? "FREE" : `Rs. ${delivery}`}</b></div><div><span>Service fee</span><b>Rs. 50</b></div><div className="total"><span>Total</span><b>Rs. {total.toLocaleString()}</b></div></aside></div></section></Shell>
  );
}
