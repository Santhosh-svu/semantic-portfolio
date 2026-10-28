# Northstar — Full-Stack Deployment & Project Architecture (Task 5)

A responsive product-catalog capstone built with modular HTML, CSS and JavaScript. It is a static frontend demo (no backend or real payments) and can be deployed on GitHub Pages, Netlify or Vercel.

## Features
- Modular app structure: product data (`js/products.js`), cart state (`js/cart.js`), routing (`js/router.js`), UI (`js/app.js`).
- Client-side hash routing: shop, product detail, story/about and cart pages.
- Search, category filters, sorting, product detail views and add/remove/update cart actions.
- Cart persistence with `localStorage`.
- Responsive layout, accessible labels, skip link, semantic landmarks and keyboard navigation for product cards.
- Lightweight, local SVG product artwork; lazy-loaded product images; service worker cache for core files.
- Indian Rupee formatting and responsive mobile layout.

## Run locally
1. Open this folder in VS Code.
2. Use the Live Server extension, or run a local static server from the `shop` folder:
   - Python: `python -m http.server 8000`
3. Open `http://localhost:8000` (if serving from inside `shop`) or `http://localhost:8000/shop/` (if serving from repository root).

ES modules and service workers require HTTP/HTTPS; opening `index.html` directly as a `file://` URL may not work correctly.

## Deploy to GitHub Pages
1. Upload the complete `shop` folder to the root of your existing `semantic-portfolio` repository.
2. Commit the changes to `main`.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish your repository.
6. Open: `https://santhosh-svu.github.io/semantic-portfolio/shop/`

If your GitHub username/repository casing differs, use the URL shown in Settings → Pages.

## Deploy to Netlify
1. Sign in to Netlify and choose **Add new site → Import an existing project**.
2. Connect GitHub and select `semantic-portfolio`.
3. Set the publish directory to `shop` and leave the build command empty.
4. Deploy. The app uses hash routes, so refreshes work without rewrite rules.

## Deploy to Vercel
Import the GitHub repository in Vercel. Configure the project root directory as `shop`, framework preset **Other**, and leave build/install commands empty. Deploy.

## Performance notes
- Product illustrations are local SVG files rather than large raster photos.
- Product images below the fold use `loading="lazy"`.
- Hero illustration is preloaded and uses `fetchpriority="high"`.
- The service worker caches core static assets after the first visit.
- No third-party JavaScript libraries or build step are required.

## Important scope note
This is a frontend capstone demo. Cart state is stored in the visitor's browser only. It does not include server-side inventory, authentication, order processing, or payment integration, and checkout deliberately does not collect payment details.
