# Yayın Rehberi – lupusveteriner.com

Site Vercel'de yayında. Aşağıdaki adımlar hesap girişi gerektirdiği için sizin tarafınızdan yapılır.

## 1. Domaini bağlama (İsimtescil)

1. https://www.isimtescil.net → Giriş → Alan Adlarım → `lupusveteriner.com` → **DNS Yönetimi**.
2. Varsa eski `A` ve `CNAME (www)` kayıtlarını silin.
3. Şu kayıtları ekleyin:

| Tür | Ad (Host) | Değer | TTL |
|---|---|---|---|
| A | @ | `76.76.21.21` | 3600 |
| CNAME | www | `cname.vercel-dns.com` | 3600 |

4. Vercel panelinde (vercel.com → proje `lupus-veteriner` → Settings → Domains) iki domain de "Valid Configuration" olana kadar bekleyin (genelde 10 dk – birkaç saat). Vercel farklı bir değer gösterirse onu kullanın.
5. SSL sertifikası Vercel tarafından otomatik verilir.

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
