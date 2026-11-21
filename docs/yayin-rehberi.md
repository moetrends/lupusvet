# Yayın Rehberi – lupusveteriner.com

Site Vercel'de yayında. Aşağıdaki adımlar hesap girişi gerektirdiği için sizin tarafınızdan yapılır.

## 1. Domaini bağlama

**Mevcut durum (2026-11-21 kontrolü):** `.com` kaydı domaini `lin27.isimtescil.net` ve `lin28.isimtescil.net` sunucularına yönlendiriyor, ama bu sunucular `lupusveteriner.com` sorgularını reddediyor (`REFUSED`). Yani İsimtescil'de domain için aktif bir DNS bölgesi yok. Kayıt eklemeden önce aşağıdaki iki yoldan birini seçin.

### Yol A (önerilen): Nameserver'ları Vercel'e çevirmek

1. Vercel → proje → **Settings → Domains** → `lupusveteriner.com` ekleyin. `www.lupusveteriner.com`'u da ekleyip `lupusveteriner.com`'a yönlendirin (Redirect, 308).
2. Vercel "Nameservers" seçeneğini gösterir: `ns1.vercel-dns.com` ve `ns2.vercel-dns.com`.
3. İsimtescil → Alan Adlarım → `lupusveteriner.com` → **Ad Sunucuları (Nameserver)** → "Özel ad sunucusu" → bu iki değeri yazıp kaydedin.
4. Yayılma birkaç dakika ile 24 saat sürebilir. Vercel'de domain "Valid Configuration" olunca SSL otomatik gelir.
5. Search Console TXT kaydı bu durumda **Vercel → Domains → DNS Records** bölümüne eklenir.

### Yol B: İsimtescil DNS'ini kullanmak

1. İsimtescil panelinde domain için **DNS Yönetimi**'ni etkinleştirin (bölge yoksa destekten açtırın).
2. Şu kayıtları ekleyin:

| Tür | Ad (Host) | Değer | TTL |
|---|---|---|---|
| A | @ | `76.76.21.21` | 3600 |
| CNAME | www | `cname.vercel-dns.com` | 3600 |

3. Vercel → Settings → Domains → iki domaini ekleyin, `www`'yu ana domaine yönlendirin. Vercel farklı bir değer gösterirse onu kullanın.

### Kontrol

Terminalde (değer `76.76.21.21` veya Vercel IP'si dönmeli):

```bash
dig +short lupusveteriner.com
```

Site kanonik adresi `https://lupusveteriner.com` (www'suz). Site haritası, kanonik etiketler ve şema bu adrese göre üretiliyor; Vercel'de ana domain olarak bunu seçin.

## 2. Google Search Console

1. https://search.google.com/search-console → **Mülk ekle** → **Alan adı** → `lupusveteriner.com`.
2. Google bir `TXT` kaydı verir (ör. `google-site-verification=...`). İsimtescil DNS'ine ekleyin: Tür `TXT`, Ad `@`, Değer: Google'ın verdiği metin.
3. Search Console'da **Doğrula**.
4. Sol menü → **Site haritaları** → `sitemap-index.xml` yazıp **Gönder**.
5. **URL Denetimi** → `https://lupusveteriner.com/` → **Dizine eklenmesini iste**. Aynısını `/hizmetler` ve `/veteriner-hekim-yunus-kurt` için yapın.

## 3. Google İşletme Profili (Haritalar)

https://business.google.com → Lupus Veteriner Kliniği:

- **Web sitesi:** `https://lupusveteriner.com` (zaten yazılı, kontrol edin).
- **Randevu bağlantısı:** `https://www.vetimiz.com/klinikler/lupus-veteriner-klinigi`
- **Hizmetler:** sitedeki 11 hizmeti aynı adlarla ekleyin.
- **Saatler:** Pazar 12:00–16:00 (klinik teyidi). Google İşletme Profili'ndeki 16:30'u 16:00 yapın. Değişirse `src/data/clinic.ts` içindeki `hours` satırı güncellenmeli.
- **Fotoğraflar:** düzenli yeni fotoğraf ekleyin (ayda birkaç tane).
- **Yorumlar:** her yoruma kısa da olsa yanıt verin.

## 4. Vercel Analytics

Vercel → proje → **Analytics** → **Enable**. Çerezsizdir, KVKK çerez banner'ı gerektirmez.

## 5. İçerik güncelleme

- **Yeni blog yazısı:** `src/content/blog/` içine yeni bir `.mdx` dosyası (mevcut yazılardan birini kopyalayın), fotoğrafı `src/assets/photos/` içine.
- **Hekim bilgileri:** `docs/yunus-kurt-bilgi-formu.md` doldurulunca `src/data/clinic.ts` → `vet` alanı ve hekim sayfası güncellenecek.
- **Yorumlar:** `src/data/reviews.ts`.
- Değişiklikten sonra: `npm run build && npm run check` (11 test geçmeli), sonra `vercel deploy --prod`.

## Yayından önce Yunus Kurt'un kontrol etmesi gerekenler

- 11 hizmet sayfası ve 8 blog yazısının tıbbi doğruluğu.
- Kullanılan Google Haritalar fotoğraflarının (`klinik-*`, `hasta-toy-poodle`, `hasta-siyam`, `hasta-pitbull`, `hasta-beyaz-iran`, `hasta-british-yavru`, `pug-yavrulari`) klinik tarafından yüklenmiş olması. Müşteri yüklediyse değiştirilmeli.
- Pazar kapanış saati ve "evde hizmet" bilgisi.
