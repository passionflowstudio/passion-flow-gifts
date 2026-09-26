# Passion Flow Studio storefront: agent handoff

Read this whole file before changing anything. It is the source of truth for
decisions already made with the owner. When you finish a meaningful step,
update the **Status** and **Next steps** sections.

## 1. What this project is

An owned, mobile-first ecommerce storefront for **Passion Flow Studio** (two
words, with a space, everywhere in copy and the logo). The shop sells proven
digital, Canva-editable personalized gift templates that already sold 2,800+
on Etsy (Couple Matchbook is the flagship with ~700 historical orders).

The goal is to convert owned traffic (Instagram, TikTok, Pinterest, email,
ads) better than Etsy and raise order value through this funnel:

    content/ad → exact product page → bundle upsell → All Access (yearly) → post-purchase

Rules from the owner's brief:
- Ads link to the exact product page (message match), never the homepage.
- Progressive disclosure: product first, then bundle, then All Access. Never
  three equal choices above the fold.
- **Shopify is the commerce source of truth** (products, prices, cart,
  checkout, orders, payments). Shopify-hosted checkout only. Never build a
  custom checkout, payment form or order database.
- No fake urgency, fake scarcity, fabricated reviews or fake discounts.
  (Owner decisions on this are recorded in §6.)
- Don't overbuild: no custom membership backend, no interactive gift
  products, no AI generator. V1 validates conversion and AOV.
- Etsy stays a sales channel. Don't remove Etsy links; just stop sending
  owned traffic there.

## 2. Stack and repo

- Next.js 16 (App Router, TypeScript), React 19, lucide-react. No UI kit;
  styles are hand-written in `app/globals.css` using brand tokens.
- Repo: github.com/passionflowstudio/passion-flow-gifts. Local path:
  `~/Projects/passionflow`.
- **Work on branch `v2`.** Draft PR #1 (`v2` → `main`) is the holding PR.
  **Never merge to `main` without the owner's explicit OK.** Merging to `main`
  replaces the live site at passionflowstudio.com.
- Hosting: Netlify. `netlify.toml` skips every build except production
  (`main`), because the owner doesn't want to spend build credits on
  previews. **Preview locally instead:**
  `npm run build && npx next start -p 3000`, then open http://localhost:3000.
  On a phone on the same Wi-Fi, use the Mac's LAN IP.
- Checks: `npm run typecheck` and `npx next build` must pass before you commit.
- Commits end with a co-author trailer if your tool adds one. Push `v2` after
  each meaningful step.

## 3. Shopify

- Store: `wa6e8d-0m.myshopify.com` (Basic plan, USD). Store name is
  "Passion Flow Studio".
- **Storefront API 2026-07, tokenless.** No token is needed; the store
  answers product and cart queries without one. Optional Headless-channel
  tokens are read from env (see `.env.example`), but aren't set.
- Checkout domain: **`checkout.passionflowstudio.com`** (CNAME at Namecheap
  → shops.myshopify.com, primary domain for the Online Store). Cart
  `checkoutUrl`s already use it.
- The Online Store theme has a redirect in `layout/theme.liquid` sending all
  storefront pages to https://passionflowstudio.com/. At launch, change it to
  keep product paths (`/products/{{ product.handle }}`); the Next app already
  301s Shopify handles to short slugs.
- An admin MCP/connector may be available to you. Ask the owner before
  store-changing actions.

Products (IDs are stable; prices live in Shopify):

| Slug (site URL) | Shopify handle | Product ID | Variant ID | Status |
|---|---|---|---|---|
| couple-matchbook | couple-matchbook-custom-printable-art-poster | 11175336640679 | 51331315925159 | Active, $11.99, compare-at $29.98 |
| playing-cards | custom-playing-cards-personalized-couple-gift | 11175336706215 | 51331315990695 | Active, $11.99 |
| couple-photo-book | couple-photo-book-custom-printable-memory-book | 11175336738983 | 51331316023463 | Active, $11.99 |
| couple-newspaper | couple-newspaper-custom-printable-newspaper-print | 11175336771751 | 51331316056231 | **Draft** (owner will finish and activate) |
| couples-gift-bundle | couple-gift-bundle-4-in-1-romantic-digital-gift-set | 11175336804519 | 51331316088999 | Active, $24.99, compare-at $47.96 (4 × $11.99) |
| bestie-matchbook | best-friend-matchbook-poster-custom-birthday-gift | 11187615006887 | 51395163390119 | Draft |
| birthday-photo-book | best-friend-photo-book-custom-birthday-keepsake | 11187614810279 | 51395162374311 | Draft |
| all-access (planned) | `passion-flow-studio-all-access` | not created yet | | Planned |

Matchbook and bundle media (14 or 15 images plus a video each) were imported
from their Etsy listings with descriptive alt text. Descriptions and SEO
fields were rewritten (see §7).

## 4. Architecture map

- `app/layout.tsx`: fonts (Playfair Display, DM Sans), metadata,
  CartProvider, header, footer, CartDrawer, GA4.
- `app/page.tsx`: homepage. It is still a port of the old site, and its shop
  buttons still go to Etsy (Phase 4 repoints them).
- `app/products/[slug]/page.tsx`: product template. Renders on first request
  (not at build), `revalidate = 60`. Gallery and reviews on the left, sticky
  purchase column on the right. Includes JSON-LD Product (no aggregateRating:
  reviews come from Etsy), a two-line title for "Main: Subtitle" titles,
  `error.tsx`, and `not-found.tsx` (drafts 404).
- `lib/catalog.ts`: slug → handle map, display names, bundle relationships,
  All Access config. **No prices here.**
- `lib/product-content.ts`: per-slug merchandising: badge, Etsy reviews
  (verbatim, labeled as Etsy), FAQs.
- `lib/shopify/*`:
  - `client.ts`: fetch with one retry for reads only.
  - `fragments.ts`, `types.ts`.
  - `products.ts`: server-only; `getProduct` and `getSubscriptionOffer`.
  - `cart.ts`: browser cart mutations. Errors are classified by the flagged
    field: `cartId` means expired, `merchandiseId` means unavailable.
- `components/cart/CartProvider.tsx`: the only cart state.
  - addItem, buyNow (separate one-item cart → redirect), upgradeToBundle
    (in-place `cartLinesUpdate` merchandise swap), updateQuantity,
    removeLine, checkout.
  - Cart ID in localStorage (`pf_cart_id`); its `?key=` part is secret, so
    use `publicCartToken()` anywhere else.
  - Digital items are limited to one copy per cart.
- `lib/attribution.ts`: UTMs plus fbclid/ttclid/epik/gclid → first-party
  cookie `pf_attr` (first and last touch) → hidden cart attributes (`_utm_*`,
  `_landing_page`, …), which land on the Shopify order.
- `lib/analytics/*`: central `track()`. Events: product_viewed,
  product_added_to_cart, product_removed_from_cart, cart_viewed,
  checkout_started, upsell_viewed, upsell_clicked. GA4 adapter only so far.
  Every event gets an `eventId` for future dedup. `window.__pfEvents` holds
  a QA log.
- `components/product/`: ProductGallery (Etsy-style arrows, thumbnails,
  swipe, video), ProductPurchase (price with compare-at %, gradient buttons,
  3 feature icons), ProductReviews, Stars, BundleUpsell,
  BundleUpsellActions, UpsellViewTracker.
- `components/allaccess/`: AllAccessTeaser, AllAccessLink, AllAccessJoin,
  content.ts.

Non-negotiable engineering rules (all tested):
- Emit `product_added_to_cart` only after Shopify returns a cart containing
  the line. A failed add shows an error and emits nothing.
- Never fire Purchase from the storefront. Shopify checkout and the ad
  platforms' Shopify apps report purchases.
- Prices, sale prices and savings come only from Shopify. Savings math shows
  only when every bundle component is priced live.
- Never expose secrets. Only `NEXT_PUBLIC_*` values reach the browser.

## 5. Design system (keep it)

- Tokens in `:root` of `globals.css`: cream `#faf5ef`, blush, rose `#c9878d`,
  wine `#8e3f46`, deep-wine, espresso. Paper-grain overlay.
- `--brand-gradient` (rose → wine → deep-wine, 135deg) is used for every
  primary button, the Bestseller badge, the % off pill and the gradient icon
  circles. The owner explicitly wants this gradient on buttons.
- Headings: Playfair Display. `h1 em`/`h2 em` are wine italic on their own
  line. The product title copies the homepage hero headline: Playfair, the
  line after ":" in wine italic, each line forced onto one line and sized
  with container query units.
- Body text: DM Sans.
- **Heading rule (owner, 2026-09-25): every heading follows the hero pattern.**
  - Main words in espresso, then a key phrase in `<em>` on its own line in
    wine italic.
  - The italic phrase is at least 2 words, so no single-word line.
  - Balanced line breaks (`text-wrap: balance` on h1–h3) and no orphans at
    375px.
  - Product titles use "Main: Subtitle". Description hooks mark the italic
    phrase with `<em>` in Shopify.
  - To check: collect each heading's words by line (Range rects) at 375px
    and look for any one-word line.
- Mobile first. Check 375px width, and that nothing scrolls sideways.
- Product page elements the owner asked for: a Bestseller badge on the
  gallery; eyebrow "MEANINGFUL GIFTS MADE FROM YOUR MEMORIES"; "Passion Flow
  Studio ★★★★★ (15)" under the title, linking to #reviews; "Now $X ~~$Y~~ N%
  off"; a single-row feature strip: Instant Digital Download · Edit with
  Canva Free · Includes Video Tutorial.

## 6. Owner decisions (don't relitigate)

- The Shopify price is intentionally higher than Etsy's.
- **Keep** the top sale banner with the "60% off" midnight countdown
  (`lib/site-config.ts`). Matchbook compare-at is $29.98 (60% off $11.99).
  This was flagged to the owner twice. Keep discount copy consistent with
  Shopify compare-at prices.
- Social proof: "Loved by 2,800+ customers" (Etsy shows 2,849 sales,
  4.9★, 86 reviews).
- All Access: $49/year auto-renewing subscription via the free **Shopify
  Subscriptions** app. Delivery is a link to the whole template library.
  **Real checkout, not a waitlist.** The price lives in Shopify.
- Digital delivery: Shopify's free **Digital Downloads** app.
- Bundle upsell on the product page shows all 4 gifts side by side. The
  bundle's own page uses the Etsy bundle photos, plus a "What's inside"
  breakdown.

## 7. Copy framework (all product copy)

1. Hook: a question of 8–10 words about the buyer's pain point. For these
   templates the pain point is "a meaningful gift, fast and easy".
   Matchbook: "Want to make a meaningful gift in minutes?"
2. Solution line: "…already designed for you. Drop your photos into Canva,
   ready in about 5 minutes."
3. Short emotional body, then "Why couples love it" benefits (bold lead-ins),
   What's included (exact deliverables), How it works (4 steps), Perfect for,
   Good to know (digital only, no refunds, personal use), then a CTA line
   ending in "Tap Add to Cart…".
4. No Etsy keyword stuffing or misspelled tag words. Titles use the
   "Main: Subtitle" format.

Confirmed facts:
- Matchbook: 3 designs (blush pink, red "The Perfect Match", blue "How Lucky
  Are We") plus a bonus Anniversary Edition; sizes 8×10, 11×14, 12×18,
  18×24, 20×30; video tutorial included; about 5 minutes.
- Photo book: 50+ pages; 6×6, 8×8, 12×12.
- Playing cards: 8 photo cards plus king and queen.

## 8. Status (as of 2026-09-25)

Done and verified in a browser (desktop and 375px mobile):
- Next.js rebuild of the homepage.
- Real Shopify cart and drawer, Buy Now, checkout handoff to
  checkout.passionflowstudio.com.
- Attribution to cart attributes; analytics layer.
- Error, expired-cart and draft-product handling.
- Matchbook page: gallery, video, badge, price with sale, byline, features,
  15 Etsy reviews.

Also done (2026-09-25, verified desktop + 375px):
- Product page sections below the hero: BundleUpsell (4 tiles with live
  prices, "Get the complete bundle", or "Upgrade for $X more" as an in-place
  swap), AllAccessTeaser, FAQ accordion (`ProductFaq`), `FinalCta`, and
  `StickyBuyBar` (phone only; appears after the purchase buttons scroll away).
- The upgrade flow is tested: the matchbook line becomes the bundle line
  ($24.99); events fire in order: upsell_clicked:upgrade →
  product_removed_from_cart → product_added_to_cart:bundle_upgrade.
- `/all-access` page: hero, perks, price per year and per month, steps, a
  comparison with live prices, FAQ, and AllAccessJoin (buyNow with
  sellingPlanId). If there's no offer, it shows "opening soon" plus signup.
- **Local preview:** `ALL_ACCESS_PREVIEW=1` in `.env.local` (gitignored)
  makes `getSubscriptionOffer` return a non-purchasable $49 preview offer
  with a "Preview" tag. **Never set it on Netlify.**
- The bundle's Newspaper tile uses `fallbackImage` from the catalog while
  the product is a draft; the savings line is hidden until all 4 gifts are
  priced live.

Offer picker (2026-09-25, owner request after reviewing high-converting
Shopify stores): the purchase box shows two option cards above Add to cart.
- Card 1: this gift, selected by default for ad message match.
- Card 2: "Complete Couple Gift Bundle", with the basket photo (the bundle's
  first Shopify image), a "Best value · Save $X" flag from its compare-at
  price, and the included gift names.
- The price block and the "Add to cart · $X" button follow the selection.
- Choosing the bundle when the single gift is already in the cart swaps it
  in place. With the bundle in the cart, the single gift shows "Included in
  your bundle" (the purchase box, sticky bar and final CTA all check this).
- Benefit tags under the title and a review highlight under the buttons come
  from `product-content.ts` (`tags`, `highlightReview`, `offerDetail`).
- Events: upsell_clicked with action select, add or upgrade.
- The lower BundleUpsell section stays as a reminder for people who scroll.
- The gallery follows the selection (`OfferSelectionProvider` +
  `OfferGallery`). Choosing the bundle shows the bundle's Shopify media with
  a "Best value" badge.
- `hiddenMedia` in `product-content.ts` hides specific Shopify images on the
  site. Bundle image `7944361983` is hidden because it shows the Etsy price;
  it stays in Shopify.
- Test later: pre-selecting the bundle (A/B).
- Open question: the Etsy bundle copy listed sizes 8×10, 11×14, 12×16, 16×20,
  18×24 and 20×30, but the product images show 8×10, 11×14, 12×18, 18×24,
  20×30 (posters) and 6×6, 8×8, 12×12 (photo book). The Shopify copy uses
  the image sizes; confirm with the owner.

Product page section order (owner, 2026-09-25):
1. Hero: gallery and reviews on the left; purchase column with the offer
   picker on the right.
2. BundleUpsell.
3. AllAccessTeaser: wine gradient card at every width (owner, 2026-09-25), text left, and a full-height 3×3 `GiftGrid`
   right with a white center tile ("This could be *all your gifts.*").
   Stacks with the grid first below 1024px.
4. FAQ ("Questions? *We've got you.*").

There's no final CTA box; the sticky buy bar covers phones.
"Reviews for *this gift*" stays on one line (`.heading-inline`).
**Collapsible description (owner, 2026-09-25):** the Shopify description
splits at the "What's included" heading.
- The preview (hook, promise, story, "Why couples love it") shows, with a
  fade and an Etsy-style "Learn more about this item" toggle.
- The details stay in the DOM for SEO.
- Opens are tracked as `description_expanded`.
- Keep every description's "What's included" heading so the split works.
**Responsive rule:** verify every UI change at 375, 768, 1024 and 1280px.

Playing Cards page (2026-09-25):
- Shopify now has 18 Etsy photos plus the video (video second), the title
  "Custom Playing Card Poster: Editable Canva Template", new
  description/SEO, and compare-at $29.98.
- `product-content.ts` has the badge (Bestseller, 580 Etsy orders), tags,
  offer detail, FAQs and reviews.
- Ratings: the listing's own Etsy average is 4.1 across 10 reviews. The
  owner asked for 4.8; that was declined, because fabricated ratings
  violate the FTC reviews rule and the brief.
- Instead, Playing Cards and the bundle show the **labeled Etsy shop
  rating** (4.9, 86 reviews, `scope: 'shop'`) with "Selected reviews", and
  no item stat rings.
- Never invent or inflate a rating. Only show positive written reviews as
  "selected", with no implied item average.
- Owner's all-time Etsy orders: Matchbook 713, Playing Cards 580, Birthday
  Photo Book 392, Couple Photo Book 343, Bestie Matchbook 270, BF Birthday
  Bundle 40, Bestie Playing Cards 25. Shop: 2,815 orders, ~1.8% conversion.

Couple Photo Book page (2026-09-25):
- Shopify: Etsy media imported (12 photos plus the video), title "Couple
  Photo Book: Editable Canva Template", new description/SEO, compare-at
  $29.98.
- Honest item stats: 4.9 average, 17 reviews, item quality 4.9, customer
  service 5.0, 100% recommend.
- 15 selected reviews. Omitted: "Bob" (mildly critical) and "Joshua" (same
  name as the owner; confirm it isn't an insider review before using it).
- Etsy image #11 (7222461124) was NOT imported: it shows named testimonials
  (Sarah L., Emily R., Jasmine K., Leah B.) and "Rated 5 stars", which
  don't match the real reviews. Ask the owner if those are real.
- The FAQ overrides the "about 5 minutes" answer; 50+ pages takes longer.

Couple Newspaper Print (2026-09-25):
- Shopify: now ACTIVE (was a draft). 17 Etsy photos, the video (second) and
  the local bouquet photo (third). Title "Couple Newspaper Print: Editable
  Canva Template", new description/SEO, compare-at $29.98.
- The listing has no reviews. The owner asked for fake reviews; that was
  declined. The page uses `shopReviews`: real 5-star Etsy shop reviews, each
  labeled with its product, under "Reviews from our shop"
  (`about: 'shop'`), plus the 4.9 shop rating.
- The catalog name is now "Newspaper Print". With all 4 gifts live, the
  bundle "Bought separately $47.96 · You save $22.97 (48%)" line shows.

Best Friend Birthday Photo Book (2026-09-25):
- Shopify: now ACTIVE. 12 photos plus the video, title "Best Friend
  Birthday Photo Book: Editable Canva Template", new description/SEO,
  compare-at $29.98.
- Honest stats: 4.8 average, 10 reviews, item quality 4.9, customer service
  4.9, 100% recommend. 6 selected reviews.
- Etsy image #11 (7287883327-style testimonial graphic: Emily R., Tiana A.,
  Sophie L., Jenna M.) was not imported; ask the owner.
- No bundle yet: there's no best-friend bundle in Shopify.

## 9. Next steps (in order)

1. DONE: the sections below are wired in (kept for reference). Remaining:
   the "included in your bundle" gap above, and a bundle-page review pass.
   Order on `app/products/[slug]/page.tsx`, below the hero:
   - `<BundleUpsell bundleSlug={entry.bundle} current={{ slug, variantId, price }} />`
     for products that have a `bundle`.
   - `<BundleUpsell bundleSlug={entry.slug} />` on bundle pages (the "What's
     inside" breakdown).
   - `<AllAccessTeaser fromProduct={slug} />`.
   - A FAQ accordion (native `<details>`, no JS) from `productContent(slug).faqs`.
   - A final CTA band (price plus Add to cart).
   - A sticky mobile Add-to-cart bar that appears after the purchase buttons
     scroll out of view.

   Style every new section with the existing tokens and gradient. Test at
   375px and on desktop.
2. DONE (preview until the Shopify product and plan exist). Original spec,
   `/all-access` (`app/all-access/page.tsx`):
   - Hero: "Never run out of meaningful gift ideas." Price per year from the
     selling plan, plus "about $X/month".
   - Perks, how it works, and a comparison (single $11.99 / bundle $24.99 /
     All Access $49 per year, all live from Shopify).
   - FAQ covering renewal and cancelling.
   - `AllAccessJoin` with a clear auto-renew note: "Renews at $49/year until
     you cancel. Cancel anytime." If `getSubscriptionOffer` is null, show a
     tasteful "opening soon" state with the MailerLite signup.
   - Confirm with the owner exactly what the library includes before
     publishing claims.
3. Test the whole funnel: add the matchbook, upgrade to the bundle (one
   line; the matchbook line is removed), then check out. Check the analytics
   events in `window.__pfEvents`.
4. Phase 3: roll the same treatment to Playing Cards and Couple Photo Book.
   That means importing Etsy photos and video into Shopify, verbatim Etsy
   reviews in `product-content.ts`, and copy per §7. Then the best-friend
   products once they're active.
5. Phase 4: homepage and collections (`/collections/couples`, etc.). Repoint
   the homepage CTAs from Etsy to on-site pages. Add product routes to the
   sitemap.
6. Phase 5: Meta, Pinterest and TikTok browser pixels as adapters in
   `lib/analytics/`, loaded after interaction. Verify current event names in
   official docs. Purchase comes only from the Shopify channel apps. Dedup
   via `eventId`. Add a consent approach.
7. Phase 6: post-purchase and delivery (Digital Downloads app), a
   thank-you-page upsell, and email flows.
8. Phase 7: the QA matrix from the brief (Tests A–H). Then, only with the
   owner's OK, merge `v2` → `main` and update the theme.liquid redirect to
   keep product paths.

## 10. Owner to-do list (blocks real sales)

- [ ] **Payments:** checkout currently says "This store can't accept
      payments right now." Set up Shopify Payments.
- [ ] Install **Digital Downloads** and attach each product's PDF, which
      holds the Canva link and tutorial.
- [ ] Install **Shopify Subscriptions** and create the All Access product
      (handle `passion-flow-studio-all-access`) with a $49/year plan.
- [ ] Finish and activate **Couple Newspaper**. The bundle savings line
      appears automatically once all 4 gifts are live.
- [ ] The bundle's 2nd image shows the Etsy price ("$18.99 / Save Over
      50%"), which conflicts with $24.99. Edit the graphic or remove it. The
      Etsy image with the same price (#15) was intentionally not imported.
- [ ] Optional: the "Email me with news and offers" box at checkout is
      pre-ticked (a Shopify checkout setting).

## 11. Gotchas

- AVIF is disabled in `next.config.ts`: the local image encoder hung on some
  images at certain widths.
- Product pages aren't prerendered at build, so a Shopify hiccup can't fail
  a deploy.
- After Shopify edits, the site updates within about 60 seconds (ISR).
- Muted video autoplay retries after the slide's fade finishes, because
  browsers block play on hidden elements.
- Shopify's `cartLinesAdd` with an expired cart returns an error on `cartId`
  and also a new, unrelated cart. Ignore that cart.
