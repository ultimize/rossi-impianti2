# Rossi Impianti — Brief di build per Antigravity

Ricostruzione del sito **Rossi Impianti srl** in **Next.js (App Router) + TypeScript + Tailwind**, deploy su **Vercel**, dati su **Supabase** (backend già pronto). Comprende sito pubblico, **Blog/News SEO**, **Shop e-commerce** e **area admin**.

> Il backend Supabase (schema, RLS, categorie, articoli migrati da WordPress, redirect 301) **è già stato creato**. Antigravity deve costruire **solo il frontend Next.js** e collegarlo. Non ricreare le tabelle.

---

## 0) Stack e regole

- **Next.js 14+ App Router**, TypeScript, **Tailwind CSS**.
- Rendering **SEO-first**: pagine pubbliche in **SSG + ISR** (`export const revalidate = 3600`). Le pagine articolo e prodotto devono uscire **renderizzate server-side** con `<head>` completo.
- Client Supabase con **`@supabase/ssr`** (server + browser).
- Deploy Vercel. Immagini con `next/image`.
- I file `design-reference/*.dc.html` sono **prototipi di design**: ricostruirli fedelmente come componenti React, **senza importarne l'HTML** e **senza portare `support.js`**.

### Variabili d'ambiente (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://kbhfrqksazdrmboeuftd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_2ySEibpBqd565vKZs2YBQA_a-u1byu4
SUPABASE_SERVICE_ROLE_KEY=__da_dashboard_Settings_API__   # SOLO server (admin, checkout). Mai client-side.
NEXT_PUBLIC_SITE_URL=https://www.rossimpiantisrl.it
```

---

## 1) Design tokens (dal handoff)

```
Colori   bg #101214 · surface #16191d · surface2 #0d0f11 · border #20242a · border2 #2c3137
         text #ffffff · text2 #c7ccd2 · muted #9aa1a9 · muted2 #7c848d · faint #5a626b
         rosso #E11D17 (hover #c2160f) · azzurro #2BB3EF · stella #F5A623
         stripe #635BFF · paypal #FFC439
Font     Saira Condensed (titoli, uppercase, letter-spacing negativo) · IBM Plex Sans (corpo) · Archivo (wordmark)
Layout   container 1240px · padding laterale 48px · radius card 6–8px · radius bottoni 2–3px
Spacing  sezioni 48–90px verticali · gap griglie 16–18px
```
Mappare questi in `tailwind.config.ts` (theme.extend.colors / fontFamily) e in CSS variabili. Caricare i font da Google Fonts via `next/font`.

**Header** (sticky, `rgba(16,18,20,.86)` + blur, bordo inferiore `#20242a`): logo testuale "ROSSI IMPIANTI srl" con sottotitoli RISCALDAMENTO (rosso) / CONDIZIONAMENTO (azzurro); nav Home, Chi siamo, Servizi, Settori, Marchi, News, **Shop** (azzurro) + bottone **Contatti** rosso. ⚠️ lo sticky si rompe con `overflow:hidden` su un antenato → usare `overflow-x:clip` sul wrapper.

**Footer** (sfondo `#0d0f11`, bordo superiore 3px rosso): 4 colonne (brand+logo bianco, Navigazione, Servizi, Contatti) + barra copyright/P.IVA.

---

## 2) Backend Supabase — già pronto (sola lettura per il frontend pubblico)

Tabelle in `public`: `categories`, `articles`, `products`, `reviews`, `orders`, `redirects`, `admins`. **RLS attiva**: il pubblico legge solo `articles.status='published'`, `products.status='published'`, `reviews.approved=true`, tutte le `categories` e `redirects`; scrittura solo admin; `orders` solo service-role/admin.

### Tipi TypeScript (`lib/types.ts`)
```ts
export type Category = {
  id: string; slug: string; name: string;
  kind: 'article' | 'product';
  color_bg: string | null; color_text: string | null;
};

export type Article = {
  id: string; slug: string; title: string;
  excerpt: string | null;
  body_html: string | null;     // contenuto WordPress migrato, RENDER COME HTML
  body: unknown[] | null;       // formato strutturato (solo nuovi articoli da admin)
  cover_url: string | null; cover_alt: string | null;
  category_id: string | null;
  author: string; read_time: string | null;
  keywords: string[]; takeaways: string[];
  faq: { q: string; a: string }[];
  status: 'draft' | 'published';
  published_at: string | null; updated_at: string;
  wp_post_id: number | null; legacy_url: string | null;
};

export type Product = {
  id: string; slug: string; name: string;
  category_id: string | null;
  price_cents: number; short: string | null; description: string | null;
  specs: { k: string; v: string }[]; image_urls: string[];
  rating: number; in_stock: boolean; status: 'draft' | 'published';
};

export type Review = {
  id: string; product_id: string; name: string; city: string | null;
  rating: number; title: string | null; text: string | null;
  verified: boolean; approved: boolean; created_at: string;
};
```

### Categorie articoli reali (già seedate)
`news` · `efficienza-energetica-sostenibilita` · `incentivi-fiscali-normative` · `manutenzione-sicurezza` · `case-study-innovazione`. Ognuna ha `color_bg`/`color_text` per il badge. Categorie shop: `riscaldamento`, `climatizzazione`, `accessori`.

### Client Supabase (`lib/supabase/server.ts` e `client.ts`)
Usare `@supabase/ssr` con `createServerClient` (server components, legge la anon key) e `createBrowserClient` (componenti client). La service-role key si usa **solo** in route handler server-side (checkout, admin mutations).

---

## 3) Struttura route (App Router)

```
app/
  (site)/                     # layout pubblico con <SiteHeader/> + <SiteFooter/>
    layout.tsx
    page.tsx                  # HOME
    chi-siamo/page.tsx
    servizi/page.tsx
    settori/page.tsx
    marchi/page.tsx
    contatti/page.tsx
    blog/
      page.tsx                # LISTA articoli (ISR)
      [slug]/page.tsx         # ARTICOLO (ISR + generateMetadata + JSON-LD)
    shop/
      page.tsx                # CATALOGO
      [slug]/page.tsx         # DETTAGLIO prodotto
      carrello/page.tsx       # CARRELLO + checkout
  admin/                      # protetto (Supabase Auth)
    layout.tsx
    page.tsx
    articoli/...  prodotti/...  recensioni/...  ordini/...  categorie/...
  api/
    checkout/stripe/route.ts  # (il backend lo fornisce Claude via MCP)
    checkout/paypal/route.ts
    webhooks/stripe/route.ts
  sitemap.ts                  # sitemap.xml dinamica
  robots.ts
middleware.ts                 # redirect 301 da tabella redirects
```

---

## 4) Blog — la parte SEO critica ⚠️

### Lista `/blog`
Hero + **articolo in evidenza** (card grande 2 colonne = il più recente) + griglia 3 colonne. Ogni card: badge categoria colorato (usa `category.color_bg/color_text`), data + `read_time`, titolo, `excerpt`, "Leggi →". Query: `articles` where `status='published'` order by `published_at desc`, join `categories`.

### Articolo `/blog/[slug]`
1. **Fetch** server-side: `select * from articles join categories where slug = params.slug and status='published'`. Se assente → `notFound()`.
2. **Render del contenuto**: il campo **`body_html`** contiene l'articolo migrato da WordPress, pulito. Renderlo con `dangerouslySetInnerHTML` dentro un contenitore stile "prose" coerente col tema scuro (h2/h3 Saira, p IBM Plex 16.5px line-height 1.75, liste con bullet rosso, tabelle bordate, blockquote bordo rosso, immagini arrotondate, iframe responsive 16:9). Per i **nuovi** articoli scritti in admin si userà `body` (strutturato); gestire entrambi: se `body_html` presente → render HTML, altrimenti render del `body` strutturato.
3. **Indice laterale (aside sticky `top:104px`)**: costruirlo estraendo gli `<h2 id="...">` da `body_html` (parse lato server con una regex/`linkedom`), elencando id+testo → ancore. Gli id sono **già presenti** in tutti gli h2.
4. **Box "In sintesi"**: se `takeaways[]` non vuoto, lista con check rossi e bordo sinistro rosso.
5. **FAQ**: se `faq[]` non vuoto, sezione H2 "Domande frequenti" con card Q/A.
6. **Header articolo**: breadcrumb (Home / News / Categoria / Titolo), badge categoria, H1 (Saira 52px), lead = `excerpt`, riga meta (autore, "Pubblicato il `published_at` · Aggiornato il `updated_at`", badge `read_time`), cover (`cover_url` con `cover_alt`).
7. **Tag**: chip `#keyword` da `keywords[]`.
8. **Correlati**: 3 articoli stessa `category_id`.

### SEO server-side (obbligatorio)
- **`generateMetadata({ params })`**: title `"{title} | Rossi Impianti"`, description = `excerpt`, keywords = `keywords`, **canonical** = `${SITE_URL}/blog/${slug}`, OpenGraph `type:article` (title/description/`cover_url`/publishedTime/modifiedTime), `twitter:card=summary_large_image`.
- **JSON-LD** server-side in `<script type="application/ld+json">`:
  - `Article` (headline, image, datePublished, dateModified, author Organization "Rossi Impianti srl", mainEntityOfPage).
  - `BreadcrumbList` (Home → News → Categoria → Articolo).
  - `FAQPage` **solo** se `faq[]` presente.

### Migrazione SEO — preservare l'indicizzazione
- **Slug invariati**: i nuovi URL sono `/blog/{slug}` con lo stesso slug di WordPress.
- **`middleware.ts`**: per ogni richiesta, lookup in `redirects` (`from_path` = vecchio `/slug/`) → risposta **301** verso `to_path` (`/blog/slug`). I 39 redirect sono già nel DB. Implementazione consigliata: caricare la mappa redirects una volta (ISR/cache) e fare match sul `pathname`.
- **`app/sitemap.ts`**: tutti gli `articles` published (`/blog/{slug}`, `lastModified=updated_at`) + `products` published + pagine statiche. Inviarla in Search Console.
- **`app/robots.ts`**: allow + riferimento alla sitemap.

### Config immagini (`next.config.js`)
`images.remotePatterns` deve includere `www.rossimpiantisrl.it` (le 19 cover sono ancora su WordPress) e il dominio Supabase Storage `kbhfrqksazdrmboeuftd.supabase.co`.
> Nota: le cover puntano ancora al vecchio WordPress. Quando il WP verrà spento andranno spostate su Supabase Storage (Claude prepara lo script lato backend). 13 articoli storici hanno perso immagini inline (erano temporanee scadute): da reillustrare col tempo, non bloccante.

---

## 5) Shop

- **Catalogo `/shop`**: hero, filtro categorie (chip, attivo rosso), griglia 3 colonne prodotti (immagine, badge categoria, nome, `short`, prezzo `price_cents/100` €, "Scopri →"). Query `products` published + join categorie.
- **Dettaglio `/shop/[slug]`**: 2 colonne (immagine 480px / info). Info: badge categoria azzurro, H1 nome, **rating a stelle** (piene `#F5A623`, vuote `#39404a`, `Math.round(rating)`) + media + "N recensioni" (link a #recensioni), prezzo 40px, "IVA inclusa", descrizione, bottoni **Aggiungi al carrello** (rosso) / **Vai al carrello** (outline), tabella `specs` k/v, riga pagamenti. Fascia 4 servizi (spedizione/garanzia/installazione/reso). Sezione **recensioni** (riepilogo media + barre distribuzione 5→1 a sinistra; lista a destra con avatar iniziali, "Acquisto verificato", città·data, stelle, titolo, testo) — solo `approved=true`. Form invio recensione → insert con `approved=false` (moderazione admin).
- **Carrello `/shop/carrello`**: stato lato client (Context/Zustand), stepper quantità, riepilogo (subtotale/spedizione/totale), bottoni **Stripe** e **PayPal**. Il calcolo prezzi finale e la creazione `orders` avvengono **server-side** (vedi §7).

---

## 6) Admin `/admin`

Protetta da **Supabase Auth** (email/password o magic link). Middleware/layout: consentire solo utenti presenti in `admins` (`is_admin()` è già definita lato DB). Tema scuro coerente.
- **Articoli**: lista (bozze/pubblicati, ricerca, filtro categoria) + editor (title, slug auto-editabile, excerpt, **body strutturato** per i nuovi / **body_html** per i migrati, cover upload su Storage, categoria, autore, read_time, keywords, takeaways, FAQ ripetibili, stato, data) + anteprima SEO.
- **Shop**: CRUD prodotti (specs k/v, immagini su Storage, stock), moderazione recensioni (approva → aggiorna media `rating`), ordini (stato pending/paid/shipped/cancelled).
- **Categorie**: CRUD con colori badge.

---

## 7) Divisione del lavoro

- **Antigravity (frontend)**: scaffolding Next.js, tutti i componenti/pagine dai prototipi, wiring Supabase in lettura, SEO (generateMetadata/JSON-LD/sitemap/robots/middleware), UI carrello e admin, upload immagini su Storage.
- **Claude (backend, via MCP)**: schema/RLS (fatto), migrazione articoli (fatto), **edge functions / route handler pagamenti** (Stripe Checkout + PayPal Orders + webhook che scrive `orders`), bucket Storage + policy, eventuale script per spostare le cover da WordPress a Storage.

---

## 8) Ordine di build consigliato

1. Scaffold Next + Tailwind + token + font; client Supabase; `next.config.js` immagini.
2. Shell pubblica: `(site)/layout` con Header/Footer + **Home**.
3. Pagine istituzionali (Chi siamo, Servizi, Settori, Marchi, Contatti).
4. **Blog**: lista + articolo + `generateMetadata` + JSON-LD + `middleware.ts` redirect + `sitemap.ts` + `robots.ts`. ← priorità SEO.
5. **Shop**: catalogo + dettaglio + recensioni + carrello (UI). Pagamenti dopo, con il backend.
6. **Admin**: auth + CRUD.

> Prima di partire col blog assicurarsi che il file `rossi_migration.sql` sia stato eseguito nel SQL Editor di Supabase (popola i 39 articoli + 39 redirect).
```
```
