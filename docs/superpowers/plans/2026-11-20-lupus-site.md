# Lupus Veteriner Kliniği Sitesi – Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** lupusveteriner.com için Astro ile statik, SEO odaklı tanıtım sitesi; Vercel'e yayına hazır.

**Architecture:** Astro statik çıktı. Klinik bilgileri tek kaynaktan (`src/data/clinic.ts`). Hizmetler ve blog MDX içerik koleksiyonları. JSON-LD üreticileri `src/lib/schema.ts`. Build sonrası `scripts/check-dist.mjs` çıktıyı doğrular (SEO testleri).

**Tech Stack:** Astro 7, Tailwind CSS 4 (`@tailwindcss/vite`), `@astrojs/mdx`, `@astrojs/sitemap`, `@vercel/analytics` yok → Vercel Web Analytics script'i, `node:test` doğrulama.

**Spec:** `docs/superpowers/specs/2026-11-20-lupus-site-design.md`

## Global Constraints

- Site URL: `https://lupusveteriner.com`, `lang="tr"`, `trailingSlash: 'never'`.
- NAP her yerde birebir: `Lupus Veteriner Kliniği` · `Kahyalar Apt, Toros Mah., Mavi Bulvarı No:62/B, 01160 Çukurova/Adana` · `0537 211 50 05` (tel: `+905372115005`).
- Saatler: Pzt–Cmt 09:00–19:30, Pazar 12:00–16:30.
- Randevu linki: `https://www.vetimiz.com/klinikler/lupus-veteriner-klinigi` (`target="_blank" rel="noopener"`).
- Geo: 37.030914, 35.2966. Maps: `https://maps.app.goo.gl/sbud2GCFRcm4emvE6`. Instagram: `https://www.instagram.com/lupus_vet/`.
- `aggregateRating` JSON-LD YASAK. Stok/AI görsel YASAK (yalnız `assets-raw/` gerçek fotoğraflar, `maps-03.jpg` hariç).
- Inter/Poppins/Roboto fontları, mor/neon gradyan, emoji ikon YASAK.
- `assets-raw/`, `.playwright-mcp/` git'e girmez.
- Hekim bilgisi: yalnız doğrulanmış gerçekler; form cevapları gelince eklenecek alanlar `clinic.ts`'te opsiyonel.

## Review Focus

1. Mobilde (360 px) menü, sabit alt bar ve hero taşmadan görünmeli → check: viewport meta + alt bar her sayfada.
2. Her sayfanın benzersiz `<title>` ve `description`'ı olmalı → check-dist testi.
3. Site içi her link 200 dönmeli (kırık link yok) → check-dist testi.
4. Görseller `alt` metni taşımalı, boyutlu olmalı (CLS yok) → check-dist testi.
5. JSON-LD her sayfada geçerli JSON olmalı ve `aggregateRating` içermemeli → check-dist testi.

---

### Task 1: İskelet, git, tasarım sistemi

**Files:** Create `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/styles/global.css`, `src/data/clinic.ts`, `src/layouts/Base.astro`, `src/components/{Header,Footer,MobileBar,Logo}.astro`, `public/favicon.svg`, `scripts/check-dist.mjs`.

**Interfaces — Produces:**
- `clinic` (default export of `src/data/clinic.ts`): `{ name, phone, phoneE164, whatsapp, address:{street, district:'Çukurova', city:'Adana', postalCode:'01160', country:'TR'}, geo:{lat,lng}, hours: {days:string[], opens:string, closes:string}[], bookingUrl, mapsUrl, instagramUrl, rating:{value:4.8,count:108}, founded:2019, vet:{name:'Yunus Kurt', title:'Veteriner Hekim', instagram:'https://www.instagram.com/ykurtt/', alumniOf?:string, bio?:string} }`.
- `Base.astro` props: `{ title: string; description: string; image?: ImageMetadata|string; schema?: object[]; breadcrumbs?: {name:string; url:string}[] }`.

- [ ] Step 1: `npm create astro` yerine elle `package.json` (astro, @astrojs/mdx, @astrojs/sitemap, tailwindcss, @tailwindcss/vite), `git init`.
- [ ] Step 2: `scripts/check-dist.mjs` (node:test) yaz: `dist/**/*.html` için benzersiz title, description var, `lang="tr"`, canonical var, iç linkler dosyaya çözülüyor, `<img>` alt+width+height, JSON-LD parse oluyor ve `aggregateRating` yok, `sitemap-index.xml` ve `robots.txt` var.
- [ ] Step 3: `npm run build && npm run check` → henüz sayfa yok, FAIL beklenir.
- [ ] Step 4: Logo SVG (lacivert köpek+kedi silüeti, kırmızı LUPUS bandı, yeşil yaprak), renk token'ları, fontlar (frontend-design skill'iyle seç), Base/Header/Footer/MobileBar, geçici `src/pages/index.astro`.
- [ ] Step 5: build + check PASS. Commit `chore: astro iskeleti ve tasarım sistemi`.

### Task 2: Görseller ve içerik koleksiyonları

**Files:** Create `src/assets/photos/*.jpg` (seçilmiş, yeniden adlandırılmış), `src/content.config.ts`, `src/content/services/*.mdx` (11), `src/data/reviews.ts`.

**Interfaces — Produces:** koleksiyon `services` şema: `{ title, slug, short, keywords:string[], hero: image(), order:number, faq:{q,a}[], related?: string[] }`; koleksiyon `blog`: `{ title, description, date: Date, category:'bilgi'|'vaka', hero:image(), service?: string }`. `reviews`: `{ author, text, when }[]` (5 adet, Maps'ten).

- [ ] Step 1: `assets-raw/instagram` ve `maps` içinden ~30 fotoğraf seç, anlamlı adlarla `src/assets/photos/` altına kopyala (ör. `yunus-kurt-pomeranian.jpg`, `rontgen-on-kol-kirik.jpg`).
- [ ] Step 2: 11 hizmet MDX: spec §5 eşlemesine göre içerik (belirtiler, süreç, SSS 3–5). Türkçe, klinik tonu.
- [ ] Step 3: build + check PASS. Commit.

### Task 3: Sayfalar

**Files:** Create `src/pages/{index,hakkimizda,veteriner-hekim-yunus-kurt,yorumlar,iletisim,randevu,kvkk,404}.astro`, `src/pages/hizmetler/{index,[slug]}.astro`, `src/components/{Hero,ServiceGrid,ReviewList,HoursTable,MapEmbed,CtaBand,Faq,Breadcrumbs,PhotoStrip}.astro`.

- [ ] Step 1: Bileşenler ve sayfalar. Harita: tıklayınca yüklenen Google Maps iframe (`output=embed` + koordinat).
- [ ] Step 2: check-dist'e ek: `/hizmetler/<slug>` 11 sayfa var; `/randevu` Vetimiz linkini içeriyor; her sayfada `tel:+905372115005`.
- [ ] Step 3: build + check PASS; tarayıcıda 360 px ve 1280 px kontrol. Commit.

### Task 4: SEO katmanı

**Files:** Create `src/lib/schema.ts`, `public/robots.txt`, `public/llms.txt`, OG görseli `public/og.jpg`.

**Interfaces — Produces:** `vetClinicSchema(): object` (`@type: ['VeterinaryCare','LocalBusiness']`), `personSchema(): object`, `serviceSchema(entry): object`, `faqSchema(faq): object`, `breadcrumbSchema(items): object`, `blogPostingSchema(entry, url): object`.

- [ ] Step 1: check-dist'e ek: ana sayfada `VeterinaryCare` JSON-LD ve `openingHoursSpecification` 2 kayıt; hizmet sayfalarında `FAQPage`.
- [ ] Step 2: FAIL gör, uygula, PASS. Commit.

### Task 5: Blog

**Files:** Create `src/pages/blog/{index,[slug]}.astro`, `src/content/blog/*.mdx` (8 yazı, spec §7).

- [ ] Step 1: 8 yazı; vaka yazıları Instagram açıklamalarına ve fotoğraflarına dayanır, uydurma tıbbi detay yok.
- [ ] Step 2: check-dist: `/blog` 8 yazıya link veriyor, her yazıda `BlogPosting`. PASS. Commit.

### Task 6: Cila, performans, yayın hazırlığı

- [ ] Step 1: Hareket (az, `prefers-reduced-motion`), break-ui/emil-design-eng gözden geçirme.
- [ ] Step 2: Lighthouse (mobil) performans ≥ 90, SEO 100.
- [ ] Step 3: `docs/yayin-rehberi.md`: Vercel, İsimtescil DNS, Search Console, Google İşletme Profili adımları.
- [ ] Step 4: Commit.
