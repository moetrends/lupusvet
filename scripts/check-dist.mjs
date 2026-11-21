// Build çıktısını (dist/) SEO ve bütünlük açısından doğrular. Çalıştır: npm run build && npm run check
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// google*.html: Search Console doğrulama dosyası, sayfa değil.
const htmlFiles = existsSync(DIST)
  ? walk(DIST).filter((f) => f.endsWith('.html') && !/\/google[0-9a-f]+\.html$/.test(f))
  : [];
const pages = htmlFiles.map((file) => {
  const html = readFileSync(file, 'utf8');
  let route = '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\.html$/, '');
  if (route.length > 1) route = route.replace(/\/$/, '');
  return { file, route, html };
});
const contentPages = pages.filter((p) => p.route !== '/404');
const get = (route) => pages.find((p) => p.route === route);
const attr = (html, re) => (html.match(re) || [])[1];
const jsonLd = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const flatTypes = (blocks) =>
  blocks.flatMap((b) => (b['@graph'] ? b['@graph'] : [b])).flatMap((n) => [].concat(n['@type']));

test('dist var ve sayfa üretildi', () => {
  assert.ok(contentPages.length > 0, 'dist/ içinde HTML yok');
});

test('her sayfada lang=tr, viewport, canonical, description, telefon linki', () => {
  for (const p of contentPages) {
    assert.match(p.html, /<html lang="tr"/, `${p.route}: lang`);
    assert.match(p.html, /name="viewport"/, `${p.route}: viewport`);
    assert.match(p.html, /rel="canonical" href="https:\/\/lupusveteriner\.com/, `${p.route}: canonical`);
    const d = attr(p.html, /name="description" content="([^"]*)"/);
    assert.ok(d && d.length >= 50 && d.length <= 170, `${p.route}: description uzunluğu ${d?.length}`);
    assert.match(p.html, /href="tel:\+905372115005"/, `${p.route}: tel linki`);
  }
});

test('title benzersiz', () => {
  const seen = new Map();
  for (const p of contentPages) {
    const t = attr(p.html, /<title>([^<]*)<\/title>/);
    assert.ok(t, `${p.route}: title yok`);
    assert.ok(!seen.has(t), `title tekrar: "${t}" (${seen.get(t)} ve ${p.route})`);
    seen.set(t, p.route);
  }
});

test('site içi linkler kırık değil', () => {
  for (const p of pages) {
    for (const [, href] of p.html.matchAll(/<a [^>]*href="(\/[^"#?]*)/g)) {
      const clean = href.replace(/\/$/, '') || '/';
      const ok =
        get(clean) || existsSync(join(DIST, clean)) || existsSync(join(DIST, clean, 'index.html'));
      assert.ok(ok, `${p.route}: kırık link ${href}`);
    }
  }
});

test('görsellerde alt, width, height var', () => {
  for (const p of pages) {
    for (const [tag] of p.html.matchAll(/<img [^>]*>/g)) {
      assert.match(tag, / alt(="|[ >])/, `${p.route}: alt yok ${tag.slice(0, 80)}`);
      assert.match(tag, / width="\d+"/, `${p.route}: width yok ${tag.slice(0, 80)}`);
      assert.match(tag, / height="\d+"/, `${p.route}: height yok ${tag.slice(0, 80)}`);
    }
  }
});

test('JSON-LD geçerli ve aggregateRating içermiyor', () => {
  for (const p of contentPages) {
    const blocks = jsonLd(p.html);
    assert.ok(blocks.length > 0, `${p.route}: JSON-LD yok`);
    assert.doesNotMatch(JSON.stringify(blocks), /aggregateRating/i, `${p.route}: aggregateRating yasak`);
  }
});

test('ana sayfa: VeterinaryCare şeması ve 2 çalışma saati kaydı', () => {
  const home = get('/');
  assert.ok(home, 'ana sayfa yok');
  const blocks = jsonLd(home.html);
  const nodes = blocks.flatMap((b) => (b['@graph'] ? b['@graph'] : [b]));
  const vet = nodes.find((n) => [].concat(n['@type']).includes('VeterinaryCare'));
  assert.ok(vet, 'VeterinaryCare yok');
  assert.equal(vet.openingHoursSpecification.length, 2);
  assert.equal(vet.telephone, '+905372115005');
  assert.equal(vet.email, 'lupusveteriner@gmail.com');
  const sunday = vet.openingHoursSpecification.find((h) => h.dayOfWeek.some((d) => d.endsWith('Sunday')));
  assert.equal(sunday.closes, '16:00', 'Pazar kapanışı 16:00 olmalı');
});

const SERVICES = [
  'cerrahi', 'dahiliye', 'ortopedi-ve-travmatoloji', 'dogum-ve-jinekoloji', 'ultrasonografi',
  'ekokardiyografi', 'dermatoloji', 'onkoloji', 'agiz-ve-dis-hastaliklari', 'laboratuvar', 'goruntuleme',
];

test('11 hizmet sayfası var ve FAQPage + Service şeması taşıyor', () => {
  for (const s of SERVICES) {
    const p = get(`/hizmetler/${s}`);
    assert.ok(p, `/hizmetler/${s} yok`);
    const types = flatTypes(jsonLd(p.html));
    assert.ok(types.includes('FAQPage'), `${s}: FAQPage yok`);
    assert.ok(types.includes('Service'), `${s}: Service yok`);
  }
});

test('randevu linkleri Vetimiz’e gidiyor', () => {
  const r = get('/randevu');
  assert.ok(r, '/randevu yok');
  assert.match(r.html, /href="https:\/\/www\.vetimiz\.com\/klinikler\/lupus-veteriner-klinigi"/);
});

test('blog: 8 yazı, her biri BlogPosting', () => {
  const posts = pages.filter((p) => /^\/blog\/[^/]+$/.test(p.route));
  assert.ok(posts.length >= 8, `blog yazısı sayısı ${posts.length}`);
  for (const p of posts) assert.ok(flatTypes(jsonLd(p.html)).includes('BlogPosting'), `${p.route}: BlogPosting yok`);
});

test('hekim sayfası doğrulanmış özgeçmişi taşıyor', () => {
  const p = get('/veteriner-hekim-yunus-kurt');
  assert.match(p.html, /Ankara Üniversitesi Veteriner Fakültesi/);
  const person = jsonLd(p.html).flatMap((b) => b['@graph'] ?? [b]).find((n) => n['@type'] === 'Person');
  assert.equal(person.alumniOf.name, 'Ankara Üniversitesi Veteriner Fakültesi');
});

test('sitemap, robots.txt, llms.txt var', () => {
  assert.ok(existsSync(join(DIST, 'sitemap-index.xml')), 'sitemap-index.xml');
  assert.match(readFileSync(join(DIST, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/lupusveteriner\.com\/sitemap-index\.xml/);
  assert.ok(existsSync(join(DIST, 'llms.txt')), 'llms.txt');
});

test('Search Console doğrulama dosyası değişmeden yayında', () => {
  const f = join(DIST, 'google24163d6dd3ce3531.html');
  assert.ok(existsSync(f), 'doğrulama dosyası yok');
  assert.equal(readFileSync(f, 'utf8').trim(), 'google-site-verification: google24163d6dd3ce3531.html');
});
