"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { productById } from "./data";
import { api } from "./api-client";

export type CartLine = { productId: string; quantity: number };
export type Profile = { name: string; email: string; phone: string; address: string };
export type Prescription = {
  id: string;
  patientName: string;
  contact: string;
  fileName: string;
  notes: string;
  status: string;
  submittedAt: string;
};
export type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
  items: CartLine[];
  address: string;
  payment: string;
};

type StoreState = {
  cart: CartLine[];
  favourites: string[];
  profile: Profile | null;
  prescriptions: Prescription[];
  orders: Order[];
};

type StoreValue = StoreState & {
  cartCount: number;
  cartTotal: number;
  cartDetailed: Array<CartLine & { product: NonNullable<ReturnType<typeof productById>> }>;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavourite: (productId: string) => void;
  isFavourite: (productId: string) => boolean;
  saveProfile: (profile: Profile) => void;
  signOut: () => void;
  submitPrescription: (input: Omit<Prescription, "id" | "status" | "submittedAt">) => Prescription;
  placeOrder: (input: { address: string; payment: string; total: number }) => Order;
};

const initialState: StoreState = {
  cart: [],
  favourites: [],
  profile: null,
  prescriptions: [],
  orders: [],
};

const StoreContext = createContext<StoreValue | null>(null);
const storageKey = "medilink-store-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) setState({ ...initialState, ...JSON.parse(saved) });
      } catch {
        // Keep the clean initial state if browser storage is unavailable or invalid.
      } finally {
        setReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    api<{user:{name:string;email:string;phone:string;favourites:string[]}}>("/auth/me").then(({user}) => {
      setState(current=>({...current,profile:{name:user.name,email:user.email,phone:user.phone||"",address:current.profile?.address||""},favourites:user.favourites||[]}));
      return api<{orders:Array<any>}>("/orders");
    }).then(({orders})=>setState(current=>({...current,orders:orders.map(o=>({id:o._id,date:o.createdAt,total:o.totalMinor/100,status:o.status,items:o.items.map((i:any)=>({productId:i.sku,quantity:i.quantity})),address:o.address,payment:o.status==="cod_pending"?"Cash on delivery":"PayPal"}))}))).catch(()=>setState(current=>({...current,profile:null,orders:[]})));
  }, []);
  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [ready, state]);

  const addToCart = (productId: string, quantity = 1) => {
    setState((current) => {
      const exists = current.cart.find((line) => line.productId === productId);
      const cart = exists
        ? current.cart.map((line) => line.productId === productId ? { ...line, quantity: line.quantity + quantity } : line)
        : [...current.cart, { productId, quantity }];
      return { ...current, cart };
    });
  };

  const removeFromCart = (productId: string) => {
    setState((current) => ({ ...current, cart: current.cart.filter((line) => line.productId !== productId) }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setState((current) => ({
      ...current,
      cart: current.cart.map((line) => line.productId === productId ? { ...line, quantity } : line),
    }));
  };

  const clearCart = () => setState((current) => ({ ...current, cart: [] }));

  const toggleFavourite = (productId: string) => {
    setState((current) => ({
      ...current,
      favourites: current.favourites.includes(productId)
        ? current.favourites.filter((id) => id !== productId)
        : [...current.favourites, productId],
    }));
  };

  const saveProfile = (profile: Profile) => setState((current) => ({ ...current, profile }));
  const signOut = () => { api("/auth/logout",{method:"POST"}).finally(()=>setState(current=>({...current,profile:null,orders:[],favourites:[]}))); };

  const submitPrescription = (input: Omit<Prescription, "id" | "status" | "submittedAt">) => {
    const prescription: Prescription = {
      ...input,
      id: `RX-${Date.now().toString().slice(-7)}`,
      status: "Awaiting pharmacist review",
      submittedAt: new Date().toISOString(),
    };
    setState((current) => ({ ...current, prescriptions: [prescription, ...current.prescriptions] }));
    return prescription;
  };

  const placeOrder = (input: { address: string; payment: string; total: number }) => {
    const order: Order = {
      id: `ML-${Date.now().toString().slice(-7)}`,
      date: new Date().toISOString(),
      total: input.total,
      status: "Order confirmed",
      items: state.cart,
      address: input.address,
      payment: input.payment,
    };
    setState((current) => ({ ...current, orders: [order, ...current.orders], cart: [] }));
    return order;
  };

  const cartDetailed = useMemo(() => state.cart.flatMap((line) => {
    const product = productById(line.productId);
    return product ? [{ ...line, product }] : [];
  }), [state.cart]);
  const cartCount = state.cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cartDetailed.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  const value: StoreValue = {
    ...state,
    cartCount,
    cartTotal,
    cartDetailed,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleFavourite,
    isFavourite: (productId) => state.favourites.includes(productId),
    saveProfile,
    signOut,
    submitPrescription,
    placeOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
