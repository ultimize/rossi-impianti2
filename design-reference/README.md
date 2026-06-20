# Handoff: Sito Rossi Impianti — Next.js + Vercel + Supabase

## Overview
Redesign completo del sito **Rossi Impianti srl** (riscaldamento, condizionamento, impianti
industriali — Sarego/Vicenza). Comprende sito pubblico (Home, Chi siamo, Servizi, Settori,
Marchi, News/Blog, Contatti), uno **Shop e-commerce** (catalogo, dettaglio prodotto con
recensioni, carrello, checkout Stripe/PayPal) e un **Blog/News** con pagine articolo
ottimizzate SEO. Va aggiunta un'**area backend (admin)** per gestire articoli e shop.

Obiettivo dell'implementazione:
1. Ricostruire i design in **Next.js (App Router) + TypeScript**, deploy su **Vercel**.
2. **Supabase** come database (Postgres), autenticazione admin e storage immagini.
3. Migrare gli articoli dal **WordPress** esistente **senza perdere l'indicizzazione SEO**.
4. Pannello **admin** protetto per CRUD articoli e gestione prodotti/ordini.

---

## About the Design Files
I file in questo bundle (`*.dc.html`) sono **reference di design create in HTML** — prototipi
che mostrano look & feel e comportamento previsti, **non codice di produzione da copiare
così com'è**. Sono "Design Components": HTML con stili inline e un piccolo runtime
(`support.js`). Il compito è **ricostruire questi design in Next.js/React** usando i pattern
del nuovo codebase (componenti React, Tailwind o CSS Modules a scelta del dev), non importare
l'HTML direttamente.

`support.js` è solo il runtime dei prototipi: **non va portato** nel progetto reale.

## Fidelity
**High-fidelity.** Colori, tipografia, spaziature e interazioni sono definitivi. Ricostruire
l'UI fedelmente. I contenuti testuali (articoli, prodotti, recensioni) sono **placeholder
realistici** da sostituire con i dati reali / migrati da WordPress.

---

## Architettura consigliata

```
Next.js (App Router, TypeScript)  ──deploy──►  Vercel
        │
        ├── Sito pubblico (SSG/ISR per SEO: pagine statiche rigenerate)
        ├── /shop          (catalogo + prodotto + carrello + checkout)
        ├── /blog (o /news) (lista + articolo, ISR)
        └── /admin         (protetto, SSR, Supabase Auth)
        │
Supabase
        ├── Postgres (articles, products, reviews, orders, categories, redirects)
        ├── Auth (admin login — email/password o magic link)
        └── Storage (immagini articoli e prodotti)

Pagamenti: Stripe (carte) + PayPal — via API routes / serverless su Vercel.
```

### Scelte chiave
- **Rendering SEO-first**: pagine pubbliche con **SSG + ISR** (`revalidate`) o SSR. Le pagine
  articolo e prodotto devono uscire già renderizzate lato server, con `<head>` completo.
- **Metadata API di Next**: usare `generateMetadata()` per title/description/OG/canonical per
  ogni pagina. Il JSON-LD va emesso server-side in un `<script type="application/ld+json">`.
- **Immagini**: `next/image` + Supabase Storage (o Vercel Blob). Nei prototipi sono
  placeholder a righe diagonali — sostituire con foto reali.

### Variabili d'ambiente (`.env`)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # solo server (admin, migrazioni)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
NEXT_PUBLIC_SITE_URL=https://www.rossimpiantisrl.it
```

---

## Schema Supabase (Postgres)

```sql
-- CATEGORIE (condivise blog/shop dove utile)
create table categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  kind        text not null check (kind in ('article','product')),
  color_bg    text,          -- es. '#E11D17'
  color_text  text           -- es. '#ffffff'
);

-- ARTICOLI / NEWS
create table articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,           -- DEVE combaciare con lo slug WordPress
  title         text not null,
  excerpt       text not null,                  -- usato come meta description + lead
  body          jsonb not null,                 -- array di sezioni {id,h,paras[],bullets[]}
  cover_url     text,
  cover_alt     text,
  category_id   uuid references categories(id),
  author        text default 'Ufficio Tecnico Rossi Impianti',
  read_time     text,                           -- es. '5 min'
  keywords      text[] default '{}',
  takeaways     text[] default '{}',
  faq           jsonb default '[]',             -- [{q,a}]
  status        text default 'draft' check (status in ('draft','published')),
  published_at  timestamptz,
  updated_at    timestamptz default now(),
  -- campi SEO ereditati da WordPress
  wp_post_id    integer,                        -- id originale (riconciliazione)
  legacy_url    text                            -- vecchio permalink completo
);
create index on articles (status, published_at desc);

-- PRODOTTI SHOP
create table products (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  category_id   uuid references categories(id),
  price_cents   integer not null,               -- in centesimi (€ 890 -> 89000)
  short         text,
  description   text,
  specs         jsonb default '[]',             -- [{k,v}]
  image_urls    text[] default '{}',
  rating        numeric(2,1) default 0,         -- media (denormalizzata, ricalcolabile)
  in_stock      boolean default true,
  status        text default 'published',
  created_at    timestamptz default now()
);

-- RECENSIONI PRODOTTO
create table reviews (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid references products(id) on delete cascade,
  name          text not null,
  city          text,
  rating        integer not null check (rating between 1 and 5),
  title         text,
  text          text,
  verified      boolean default false,
  approved      boolean default false,          -- moderazione da admin
  created_at    timestamptz default now()
);

-- ORDINI
create table orders (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  items         jsonb not null,                 -- [{product_id,name,qty,price_cents}]
  subtotal_cents integer not null,
  shipping_cents integer default 0,
  total_cents   integer not null,
  status        text default 'pending' check (status in ('pending','paid','shipped','cancelled')),
  provider      text,                           -- 'stripe' | 'paypal'
  provider_ref  text,                           -- id transazione
  created_at    timestamptz default now()
);

-- REDIRECT 301 (preservazione SEO WordPress)
create table redirects (
  id          uuid primary key default gen_random_uuid(),
  from_path   text unique not null,             -- vecchio path WP, es. '/2024/03/antincendio/'
  to_path     text not null,                    -- nuovo path, es. '/blog/impianti-antincendio-aziende'
  status      integer default 301
);
```

### Row Level Security (RLS)
- Lettura pubblica su `articles` (status='published'), `products` (status='published'),
  `reviews` (approved=true), `categories`.
- Scrittura su tutto **solo** per utenti autenticati con ruolo admin (policy basata su
  `auth.uid()` / tabella `admins`, o claim JWT). `orders`: insert via service role
  lato server al checkout; lettura solo admin.

---

## Migrazione WordPress + preservazione SEO  ⚠️ critico

Il sito attuale ha articoli **già indicizzati** su Google. Per non perdere posizionamento:

1. **Estrarre i contenuti** dal WordPress via REST API (`/wp-json/wp/v2/posts?per_page=100`)
   oppure export XML (WXR). Raccogliere per ogni post: `id`, `slug`, `title`, `content`,
   `excerpt`, `date`, `modified`, immagine in evidenza, categorie, tag, e il **permalink
   completo** attuale (`link`).
2. **Mappare gli slug**: la regola d'oro è **mantenere lo stesso slug** quando possibile, così
   l'URL nuovo somiglia al vecchio. Salvare `wp_post_id` e `legacy_url` in `articles`.
3. **Redirect 301** dai vecchi URL ai nuovi per ogni caso in cui il path cambia (es. WP usa
   `/2024/03/titolo/` e il nuovo sito usa `/blog/slug`). Implementare via:
   - tabella `redirects` + **`middleware.ts`** di Next che fa il lookup e risponde 301, **o**
   - `redirects()` in `next.config.js` se l'elenco è statico.
   Un 301 (permanente) trasferisce il "link juice" al nuovo URL.
4. **Canonical**: ogni pagina articolo emette `<link rel="canonical" href="{NEXT_PUBLIC_SITE_URL}/blog/{slug}">`.
5. **Sitemap**: generare `app/sitemap.ts` (sitemap.xml dinamica) con tutti gli articoli e
   prodotti pubblicati + `lastModified`. Inviarla in **Google Search Console**.
6. **robots.txt** (`app/robots.ts`) che punta alla sitemap.
7. **Verifica post-migrazione**: in Search Console controllare copertura/indicizzazione e che i
   vecchi URL rispondano 301 verso i nuovi (non 404). Tenere i redirect attivi a lungo.
8. **Structured data**: già previsto nel design (Article + FAQPage + BreadcrumbList) — vedi
   sotto. Mantenere coerenza con i dati reali.

---

## Area Admin (backend) — da realizzare

Route `/admin`, protetta da **Supabase Auth** (login email/password o magic link; tabella
`admins` per la whitelist). Layout coerente col tema scuro del sito.

**Sezione Articoli**
- Lista articoli (bozze/pubblicati) con ricerca e filtro categoria.
- Editor articolo: title, slug (auto da title, editabile), excerpt, **body strutturato**
  (sezioni con heading + paragrafi + bullet), cover image (upload su Supabase Storage),
  categoria, autore, read time, **keywords**, **takeaways**, **FAQ** (q/a ripetibili),
  stato draft/published, data pubblicazione.
- Anteprima SEO (come appare su Google: title + description + URL).

**Sezione Shop**
- Prodotti: CRUD (nome, slug, categoria, prezzo, short, descrizione, **specs** k/v, immagini,
  stock, stato).
- Recensioni: moderazione (approva/rifiuta), le approvate compaiono sul prodotto e aggiornano
  la media `rating`.
- Ordini: elenco con stato (pending/paid/shipped/cancelled), dettaglio items, cambio stato.

**Sezione Categorie**: CRUD categorie articolo/prodotto con colori badge.

---

## Screens / Views (riferimento ai file di design)

> Tema globale: sfondo `#101214`, superfici card `#16191d`, bordi `#20242a`, testo `#fff` /
> secondario `#9aa1a9` / muted `#7c848d`. Accenti: **rosso `#E11D17`**, **azzurro `#2BB3EF`**.
> Font: titoli **Saira Condensed** (700/800, uppercase, letter-spacing negativo); corpo
> **IBM Plex Sans**; wordmark **Archivo**. Container max-width **1240px**, padding lat. **48px**.

### Header — `SiteHeader.dc.html` (riusato in tutte le pagine)
- Sticky top, `z-index:50`, sfondo `rgba(16,18,20,.86)` + `backdrop-filter:blur(10px)`,
  bordo inferiore `1px #20242a`. **Nota implementativa**: lo sticky si rompe se un antenato ha
  `overflow:hidden` — usare `overflow-x:clip` sul wrapper di pagina, non `overflow:hidden`.
- Sinistra: logo testuale "ROSSI IMPIANTI srl" + sottotitolo "RISCALDAMENTO" (rosso) /
  "CONDIZIONAMENTO" (azzurro). Destra: nav (Home, Chi siamo, Servizi, Settori, Marchi, News,
  Shop in azzurro) + bottone **Contatti** rosso. Voce attiva via prop `active`.

### Footer — `SiteFooter.dc.html` (riusato ovunque, **incluso lo shop**)
- Sfondo `#0d0f11`, bordo superiore **3px rosso**. 4 colonne: brand+logo (immagine
  `assets/logo-rossi-white.png` — versione testo bianco su trasparente) + claim + bottone
  "Richiedi un preventivo"; Navigazione; Servizi; Contatti (indirizzo, tel, email).
- Barra inferiore: copyright + P.IVA/SDI.

### Home — `Home.dc.html`
- **Hero** full-width scura con **video di sfondo** (impianti industriali) in `object-fit:cover`
  `opacity:.78`, overlay a gradiente per leggibilità, numero "44" decorativo animato.
  *Nota autoplay*: impostare `muted` come **proprietà DOM** + `playsInline` + `.play()` via JS,
  altrimenti il browser blocca l'autoplay. Titolo "PROGETTIAMO E COSTRUIAMO IMPIANTI
  INDUSTRIALI." con ultima riga in rosso.
- Sezioni a seguire: contatori animati, servizi, settori, marchi, CTA. (Vedi file.)

### News / Blog — `News.dc.html`  ← contiene il pattern SEO
Due viste (nel sito reale = due route):
- **Lista** (`/blog`): hero, **articolo in evidenza** (card grande 2 colonne), griglia 3 colonne
  di card (badge categoria colorato, data + read time, titolo, excerpt, "Leggi →").
- **Articolo** (`/blog/[slug]`):
  - **Breadcrumb** Home / News / Categoria / Titolo (anche come BreadcrumbList JSON-LD).
  - Header centrato (max 820px): badge categoria, **H1** (Saira Condensed 52px), **lead** =
    excerpt (20px, `#c7ccd2`), riga meta con avatar autore, "Pubblicato il … · Aggiornato il …",
    badge tempo di lettura.
  - Hero immagine (max 1080px, h 440px).
  - **Body in 2 colonne** (`1fr / 248px`): a sinistra contenuto, a destra **aside sticky**
    (`top:104px`) con indice ancore + CTA preventivo.
  - Contenuto: box **"In sintesi"** (takeaways con check rossi, bordo sinistro rosso), **sezioni
    con H2** (`id` ancorato, `scroll-margin-top:96px`), paragrafi 16.5px `line-height:1.75`,
    liste con bullet rosso, **FAQ** (H2 "Domande frequenti", card Q/A), **tag** `#keyword`,
    **bio autore**.
  - **Correlati**: fascia `#0d0f11`, 3 card.
  - **CTA** preventivo.
- **SEO (già implementato nel prototipo, da replicare server-side con `generateMetadata`)**:
  `<title>` = "{titolo} | Rossi Impianti", meta description = excerpt, meta keywords, OG
  (title/description/type=article), twitter:card, e **JSON-LD**: `Article` + `FAQPage` +
  `BreadcrumbList`. Nel prototipo è iniettato via JS; nel sito reale **deve essere SSR**.

### Shop — `Shop.dc.html`
Tre viste (nel sito reale = route `/shop`, `/shop/[slug]`, `/shop/carrello`):
- **Catalogo**: hero shop, filtro categorie (chip, attivo rosso), griglia 3 colonne prodotti
  (immagine, badge categoria, nome, short, prezzo, "Scopri →").
- **Dettaglio prodotto**:
  - 2 colonne (`1.05fr / 1fr`): immagine 480px + colonna info.
  - Info: badge categoria (azzurro), **H1** nome, **rating a stelle** (★ `#F5A623`, vuote
    `#39404a`) + media + "N recensioni" (link a #recensioni), prezzo 40px, "IVA inclusa…",
    descrizione, bottoni **Aggiungi al carrello** (rosso) / **Vai al carrello** (outline),
    tabella **specs** k/v, riga pagamenti sicuri.
  - **Fascia servizi** (4 card): Spedizione tracciata, Garanzia ufficiale, Installazione &
    assistenza, Reso facile (ciascuna con icona SVG, titolo, testo).
  - **Recensioni** (`#recensioni`): griglia `300px / 1fr`. Sinistra = riepilogo (media grande,
    stelle, "su N recensioni", **barre distribuzione** 5→1 stelle). Destra = lista recensioni
    (avatar iniziali su sfondo colorato, nome, badge "Acquisto verificato", città · data,
    stelle, titolo, testo).
- **Carrello**: lista item con stepper quantità +/−, riepilogo (subtotale, spedizione, totale),
  bottoni **Stripe** (`#635BFF`) e **PayPal** (`#FFC439`). *Mockup*: collegare i pagamenti reali
  con API routes (Stripe Checkout / PayPal Orders) e webhook che crea/aggiorna `orders`.

### Altre pagine
- `Chisiamo.dc.html`, `Servizi.dc.html`, `Settori.dc.html`, `Marchi.dc.html`,
  `Contatti.dc.html` — pagine istituzionali, stesso sistema visivo (header/footer condivisi,
  hero con immagine in `assets/hero/`).

---

## Interactions & Behavior
- **Navigazione SPA nei prototipi** (shop/news) è simulata con stato `view`; nel sito reale =
  **route Next** (`app/blog/[slug]/page.tsx`, `app/shop/[slug]/page.tsx`, ecc.).
- **Hover card**: `border-color:#E11D17` + `translateY(-4px)`, transizione `.25s`; immagine
  interna `scale(1.06)` con `.6s ease`.
- **Stelle rating**: piene `#F5A623`, vuote `#39404a`, calcolate da `Math.round(rating)`.
- **Carrello**: quantità +/−, rimozione, ricalcolo subtotale (prezzi in centesimi lato server).
- **Contatori Home**: animati on-scroll (IntersectionObserver).

## Design Tokens
```
Colori   bg #101214 · surface #16191d · surface2 #0d0f11 · border #20242a · border2 #2c3137
         text #ffffff · text2 #c7ccd2 · muted #9aa1a9 · muted2 #7c848d · faint #5a626b
         rosso #E11D17 (hover #c2160f) · azzurro #2BB3EF · stella #F5A623
         stripe #635BFF · paypal #FFC439
Font     Saira Condensed (titoli, uppercase) · IBM Plex Sans (corpo) · Archivo (wordmark)
Layout   container 1240px · padding lat. 48px · radius card 6–8px · radius bottoni 2–3px
Spacing  sezioni 48–90px verticali · gap griglie 16–18px
```

## Assets
- `assets/logo-rossi.png` — logo originale (testo scuro su bianco).
- `assets/logo-rossi-white.png` — logo bianco su trasparente (per footer scuro; generato dal
  precedente). **Da rifornire in alta risoluzione/SVG dal cliente per produzione.**
- `assets/hero/*.png` — immagini hero delle pagine (chisiamo, contatti, marchi, news, servizi,
  settori). Placeholder/temporanee — sostituire con foto reali dei cantieri.
- Hero Home: video di sfondo (nel prototipo è una clip stock) — **sostituire con riprese reali**.
- Immagini prodotto/articolo: placeholder a righe — sostituire con foto reali via Supabase Storage.

## Files (in questo bundle)
- `Home.dc.html`, `Chisiamo.dc.html`, `Servizi.dc.html`, `Settori.dc.html`, `Marchi.dc.html`,
  `News.dc.html`, `Contatti.dc.html`, `Shop.dc.html`
- `SiteHeader.dc.html`, `SiteFooter.dc.html` (componenti condivisi)
- `assets/` (logo + hero)
- I file usano stili **inline**. `support.js` è incluso **solo per poter aprire/anteprimare i
  prototipi in locale** (è il runtime dei Design Component): **non va portato** nel progetto Next.js.
