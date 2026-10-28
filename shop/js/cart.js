import { products } from "./products.js";
const KEY = "northstar-cart-v1";
export function getCart(){try{const value=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(value)?value.filter(row=>products.some(p=>p.id===row.id)&&Number.isInteger(row.quantity)&&row.quantity>0):[]}catch{return []}}
function save(cart){localStorage.setItem(KEY,JSON.stringify(cart))}
export function addToCart(id){const cart=getCart();const row=cart.find(item=>item.id===id);if(row)row.quantity+=1;else if(products.some(p=>p.id===id))cart.push({id,quantity:1});save(cart)}
export function updateQuantity(id,delta){const cart=getCart().map(row=>row.id===id?{...row,quantity:row.quantity+delta}:row).filter(row=>row.quantity>0);save(cart)}
export function removeFromCart(id){save(getCart().filter(row=>row.id!==id))}
export function cartCount(){return getCart().reduce((sum,row)=>sum+row.quantity,0)}
export function cartTotal(){return getCart().reduce((sum,row)=>sum+(products.find(p=>p.id===row.id)?.price||0)*row.quantity,0)}
