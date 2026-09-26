# PassionFlow Studio storefront

Next.js (App Router) storefront for passionflowstudio.com, hosted on Netlify.
Shopify is the commerce source of truth (products, prices, cart, checkout, orders).

## Develop

```bash
npm install
cp .env.example .env.local   # fill in values; never commit secrets
npm run dev
```

## Layout

- `app/` — routes, layout, metadata, API routes
- `components/site/` — header, footer, sale banner, signup, analytics
- `components/home/` — homepage sections
- `lib/site-config.ts` — site-wide settings (banner text, nav, social proof)
- `lib/home-content.ts` — homepage merchandising content
- `app/globals.css` — brand tokens and styles (source of truth for the design)
