"use client";

import Link from "next/link";
import {useEffect,useState} from "react";
import {api} from "../api-client";
import { ProductImage, Shell } from "../components";
import { productById } from "../data";
import { useStore } from "../store";

const TRACKING = ["Confirmed", "Pharmacist review", "Packed", "Delivered"];
function trackingIndex(status: string) {
  const value = status.toLowerCase();
  if (value.includes("deliver")) return 3;
  if (value.includes("pack") || value.includes("ship") || value.includes("dispatch")) return 2;
  if (value.includes("pharmacist") || value.includes("approv") || value.includes("review")) return 1;
  if (value.includes("confirm") || value.includes("cod_pending") || value.includes("paid")) return 0;
  return -1;
}
function readableStatus(status: string) { return status.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()); }
export default function Orders() {
  const { orders,clearCart } = useStore();
  const [paymentNotice,setPaymentNotice]=useState("");const [deliveryRecords,setDeliveryRecords]=useState<any[]>([]);const [positions,setPositions]=useState<Record<string,any>>({});
  useEffect(()=>{let active=true;const refresh=async()=>{try{const result=await api<{deliveries:any[]}>("/deliveries");if(!active)return;setDeliveryRecords(result.deliveries);for(const d of result.deliveries){try{const loc=await api<any>(`/deliveries/${d._id}/location`);if(active)setPositions(prev=>({...prev,[d._id]:loc}));}catch{}}}catch{}};void refresh();const t=setInterval(refresh,30000);return()=>{active=false;clearInterval(t)};},[]);
  useEffect(()=>{
    let alive=true;
    let id="";try{id=sessionStorage.getItem("medilink_pending_card_order")||"";}catch{}
    if(!id)return;
    const check=async()=>{
      try{
        const result=await api<{orders:Array<{_id:string,status:string}>}>("/orders");
        if(!alive)return;
        const order=result.orders.find(o=>String(o._id)===id);
        if(!order){setPaymentNotice("We could not find your payment order. Contact support with your order number.");return;}
        if(["paid","shipped","delivered"].includes(order.status)){
          clearCart();sessionStorage.removeItem("medilink_pending_card_order");
          setPaymentNotice("Your payment is confirmed and your shopping cart has been cleared.");
        }else if(["cancelled","refunded"].includes(order.status)){
          sessionStorage.removeItem("medilink_pending_card_order");
          setPaymentNotice("Payment was not completed. Items remain in your cart.");
        }else setPaymentNotice("Card payment is awaiting verified gateway confirmation. Your cart will clear only after payment is confirmed.");
      }catch{if(alive)setPaymentNotice("Payment status could not be verified. Your cart has been preserved.");}
    };
    void check();const timer=window.setInterval(check,5000);
    return()=>{alive=false;window.clearInterval(timer);};
  },[]);
  return <Shell><section className="ordersPage section ordersWide">
    <div className="ordersHero"><div><span className="kicker">MEDILINK • ORDER CENTER</span><h1>Your orders</h1><p>Review your orders, payment methods and available tracking updates.</p></div><Link className="secondaryBtn ordersShopButton" href="/products">Continue shopping →</Link></div>
    {paymentNotice&&<p role="status" className="gatewayNotice">{paymentNotice}</p>}<div className="ordersDashboardGrid"><div className="ordersPrimary">
      <div className="ordersSectionCaption"><h2>Order history</h2><span>{orders.length} {orders.length === 1 ? "order" : "orders"}</span></div>
      {!orders.length ? <div className="emptyPage compact"><span>▣</span><h2>No orders yet</h2><p>When you place an order, it will appear here after it is loaded from your account.</p><Link className="primaryBtn" href="/products">Browse medicines</Link></div> : <div className="orderList">{orders.map((order) => { const current = trackingIndex(order.status); return <article className="orderCard" key={order.id}>
        <div className="orderHead"><div><small>Order reference</small><b className="orderReference">{order.id}</b><span>{new Date(order.date).toLocaleString()}</span></div><span className="statusBadge">{readableStatus(order.status)}</span></div>
        <div className="trackingSteps" aria-label="Order progress">{TRACKING.map((label,index)=><span key={label} className={index <= current ? "done" : ""} aria-current={index===current?"step":undefined}>{label}</span>)}</div>
        <div className="orderProducts">{order.items.map((line) => { const product = productById(line.productId); return product ? <div key={line.productId}><ProductImage product={product}/><span><b>{product.name}</b><small>Quantity: {line.quantity}</small></span></div> : <div key={line.productId}><span><b>Product reference: {line.productId}</b><small>Quantity: {line.quantity}</small></span></div>; })}</div>
        <div className="orderFoot"><span><b>{order.payment}</b><br/><small>{order.address}</small></span><div className="orderTotal"><small>Total</small><b>Rs. {order.total.toLocaleString()}</b></div></div>
        {deliveryRecords.filter(d=>String(d.order)===String(order.id)).map(d=>{const current=positions[d._id];return <div className="orderInfoNotice" key={d._id}><strong>Delivery: {d.status.replaceAll('_',' ')}</strong><p>{current?.position&&!current.stale?`Rider location updated ${new Date(current.position.updatedAt).toLocaleTimeString()}`:'Live GPS unavailable — rider must enable sharing.'}</p><DeliveryMap compact position={current?.position&&!current.stale?current.position:null} title="Your delivery location"/></div>})}
        <div className="orderInfoNotice">ℹ Tracking steps update when the pharmacy records a new status. A pending payment status does not confirm pharmacist approval.</div>
      </article>; })}</div>}
    </div><aside className="ordersAside" aria-label="Pharmacy services"><div className="ordersSidebarCard"><span className="kicker">QUICK ACCESS</span><h2>How can we help?</h2><Link href="/account">♙ <span>My account <small>Profile and login</small></span> →</Link><Link href="/prescription">▤ <span>Prescriptions <small>Submit a prescription</small></span> →</Link><Link href="/products">✚ <span>Browse medicines <small>Explore the catalogue</small></span> →</Link><Link href="/cart">▣ <span>View cart <small>Review selected items</small></span> →</Link></div><div className="ordersCareCard"><h3>Pharmacy safety</h3><p>Prescription medicines should be dispensed only after review by a licensed pharmacist. If your order needs a prescription, upload it for review.</p><Link href="/prescription">Go to prescriptions →</Link></div><div className="ordersCareCard"><h3>About order tracking</h3><p>Status information shown here reflects records currently provided by the system; GPS displays the last position that your assigned rider voluntarily shared. It is not a route or ETA.</p></div></aside></div>
  </section></Shell>;
}
