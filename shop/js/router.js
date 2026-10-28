// Hash routing keeps this static project deployable on GitHub Pages, Netlify and Vercel.
export function currentRoute(){
  const parts=location.hash.replace(/^#\/?/,"").split("/").filter(Boolean);
  if(parts[0]==="product"&&parts[1])return {page:"product",id:decodeURIComponent(parts[1])};
  if(parts[0]==="cart")return {page:"cart"};
  if(parts[0]==="about")return {page:"about"};
  return {page:"shop"};
}
export function navigate(route){if(location.hash===route){window.dispatchEvent(new HashChangeEvent("hashchange"));return;}location.hash=route;}
