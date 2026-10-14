"use client";
import {useMemo} from "react";

type Position={latitude:number;longitude:number;updatedAt?:string};
export default function DeliveryMap({position,title="Delivery rider location",compact=false}:{position?:Position|null;title?:string;compact?:boolean}){
 const coordinates=useMemo(()=>{
  if(!position)return null;
  const lat=Number(position.latitude),lon=Number(position.longitude);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return null;
  return {lat,lon};
 },[position?.latitude,position?.longitude]);
 if(!coordinates)return <div className="deliveryMapEmpty" role="status">Location not available. The assigned rider must explicitly share GPS from the Rider Console.</div>;
 const {lat,lon}=coordinates;
 const span=0.008;
 const bbox=[lon-span,lat-span,lon+span,lat+span].join(",");
 const src=`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
 const google=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lon}`)}`;
 const osm=`https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(lon)}#map=16/${lat}/${lon}`;
 return <div className={`deliveryMap ${compact?'deliveryMapCompact':''}`}>
  <div className="deliveryMapTitle"><strong>{title}</strong><span>Last reported GPS point · not a calculated route or ETA</span></div>
  <iframe title={`${title} on OpenStreetMap`} src={src} loading="lazy" referrerPolicy="no-referrer" allowFullScreen />
  <div className="deliveryMapBottom"><span>{lat.toFixed(5)}, {lon.toFixed(5)}{position?.updatedAt?` · ${new Date(position.updatedAt).toLocaleString()}`:''}</span><div><a target="_blank" rel="noopener noreferrer" href={google}>Open in Google Maps ↗</a><a target="_blank" rel="noopener noreferrer" href={osm}>Open in OSM ↗</a></div></div>
 </div>;
}
