// Product data is separated from UI logic to keep the app modular.
export const products = [
  {id:"mug-01",name:"Everyday Ceramic Mug",category:"Home",price:599,tag:"Bestseller",color:"Moss",description:"A balanced, hand-feel ceramic mug for slow mornings and long work sessions. Dishwasher safe and made for everyday use.",image:"assets/mug.svg"},
  {id:"lamp-02",name:"Arc Table Lamp",category:"Home",price:2499,tag:"New",color:"Sand",description:"Soft ambient light with a clean silhouette. Designed to make desks and bedside tables feel calmer.",image:"assets/lamp.svg"},
  {id:"bag-03",name:"Weekender Tote",category:"Accessories",price:1799,tag:"Popular",color:"Olive",description:"A sturdy everyday carry-all with a roomy main compartment and minimal hardware.",image:"assets/bag.svg"},
  {id:"bottle-04",name:"Insulated Bottle",category:"Accessories",price:999,tag:"",color:"Sage",description:"A double-wall bottle that keeps drinks cold or warm while fitting neatly into your daily routine.",image:"assets/bottle.svg"},
  {id:"speaker-05",name:"Pebble Bluetooth Speaker",category:"Tech",price:3299,tag:"New",color:"Charcoal",description:"Compact, clear sound in a tactile pebble-shaped body. A simple companion for your room or desk.",image:"assets/speaker.svg"},
  {id:"headphones-06",name:"Studio Headphones",category:"Tech",price:4599,tag:"",color:"Graphite",description:"Comfortable over-ear headphones with a focused, minimal design for study, travel and downtime.",image:"assets/headphones.svg"},
  {id:"notebook-07",name:"Daily Notes Set",category:"Stationery",price:449,tag:"Value set",color:"Cream",description:"Three compact notebooks with smooth paper for notes, lists, sketches and ideas.",image:"assets/notebook.svg"},
  {id:"planter-08",name:"Mini Stone Planter",category:"Home",price:799,tag:"",color:"Stone",description:"A softly textured planter that brings a small bit of green to shelves and desks. Plant not included.",image:"assets/planter.svg"}
];
export const categories = ["All", ...new Set(products.map(product => product.category))];
export const formatPrice = amount => new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:0}).format(amount);
