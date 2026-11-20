# Lupus Veteriner Kliniği – Web Sitesi Tasarım Dokümanı

Tarih: 2026-11-20 · Durum: onay bekliyor

## 1. Amaç ve neden

Lupus Veteriner Kliniği (Çukurova/Adana, kuruluş 2019, Vet. Hekim Yunus Kurt) için tanıtım sitesi.
Hedef: Adana'da veteriner arayan kişi Google'da (organik + Maps) kliniği bulsun, hekime ve kliniğe güvensin, randevuya geçsin.

Başarı ölçütü:
- "Çukurova veteriner", "Adana veteriner", "Mavi Bulvar veteriner", "Adana kedi kısırlaştırma", "Adana veteriner ortopedi" gibi aramalarda ilk sayfa.
- Ziyaretçinin Vetimiz randevu sayfasına veya telefona tıklaması.

## 2. Hedefler / Hedef olmayanlar / Başarısızlık sayılacaklar

Hedefler
- 11 ana hizmetin her biri için ayrı, aranabilir sayfa.
- Yunus Kurt için güven veren hekim sayfası.
- Blog: bilgilendirici yazılar + gerçek vaka hikâyeleri.
- Google yorumlarını gösterme.
- Google Search Console, Google Haritalar (işletme profili), Vercel yayını, `lupusveteriner.com` domaini.

Hedef olmayanlar
- Ödeme, üyelik, kendi randevu sistemi, yönetim paneli (CMS), çoklu dil.

Başarısızlık sayılacaklar (çalışsa bile)
- Sitenin "AI yapmış/şablon" gibi görünmesi: stok fotoğraf, mor-mavi gradyanlar, emoji ikonlar, jenerik "Evcil dostunuz bizim için değerli" metinleri.
- Yavaş yüklenmesi (mobil Lighthouse performans < 90).
- Tıbbi olarak yanlış veya hekimin onaylamadığı içerik.

## 3. Bilinen gerçekler (kaynaklı)

| Bilgi | Değer | Kaynak |
|---|---|---|
| Ad | Lupus Veteriner Kliniği | Maps, Vetimiz, Instagram |
| Adres | Kahyalar Apt, Toros Mah., Mavi Bulvarı No:62/B, 01160 Çukurova/Adana | Maps, Vetimiz |
| Tarif | Mavi Bulvar İkram Dondurma 150 m ilerisi | Instagram |
| Konum | 37.030914, 35.2966 · Plus code 27JW+9J | Maps |
| Telefon | 0537 211 50 05 | Maps, Instagram |
| Saatler | Pzt–Cmt 09:00–19:30, Pazar 12:00–16:30 (Instagram: 16:00 → teyit bekliyor) | Maps |
| Puan | 4,8 · 108 yorum | Maps |
| Hekim | Yunus Kurt (kişisel Instagram: @ykurtt) | Vetimiz, Maps yorumları |
| Ekip | Şükran Hanım (yorumda geçiyor), asistanlar | Maps yorumları |
| Randevu | https://www.vetimiz.com/klinikler/lupus-veteriner-klinigi | Kullanıcı |
| Instagram | https://www.instagram.com/lupus_vet/ | Kullanıcı |
| Maps | Place CID hex `0x152889b733b8dcfd:0x5907bcb188da55a5`, kısa link https://maps.app.goo.gl/sbud2GCFRcm4emvE6 | Maps |
| Domain | lupusveteriner.com (İsimtescil, 2027-12'ye kadar, şu an DNS boş) | whois |
| Ek hizmet | Evde hizmet (Vetimiz etiketi – teyit bekliyor) | Vetimiz |

Toplanan materyal (`assets-raw/`, git'e girmeyecek):
- `instagram/` 183 gönderi görseli + `index.json` (açıklamalar). İçinde Yunus Kurt'un hastalarla ~15 portresi, röntgen, ultrason, laboratuvar, muayene, klinik içi fotoğraflar ve vaka açıklamaları var.
- `maps/` 10 fotoğraf (klinik içi, hastalar). `maps-03` AI çizimi → kullanılmayacak.
- `maps-reviews.json` 5 adet 5 yıldızlı yorum.
- Logo yalnızca 150×150 px var.

## 4. Yaklaşımlar

1. **Astro (statik) + Vercel — seçildi.** İçerik sitesi için yapılmış. Sayfalar HTML olarak üretilir, neredeyse sıfır JavaScript. Otomatik görsel optimizasyonu (WebP/AVIF, boyutlandırma) var. Blog ve hizmetler Markdown dosyası. Hız ve SEO için en iyi seçenek. Kullanıcı "SEO'da üstte çıkaracaksa Astro" dedi.
2. Next.js + Vercel. Aynı SEO yapılabilir ama bu iş için gereksiz JavaScript ve karmaşıklık getiriyor.
3. Open SaaS (Wasp). Üyelik/ödeme altyapısı. Bu projede ihtiyaç yok, elendi.

## 5. Site yapısı

```
/                         Ana sayfa
/hakkimizda               Klinik hikâyesi, ekip, donanım, galeri
/veteriner-hekim-yunus-kurt  Hekim sayfası
/hizmetler                Hizmetler özeti
/hizmetler/<slug>         11 hizmet sayfası (aşağıda)
/blog                     Yazılar listesi (kategori: Bilgi, Vaka)
/blog/<slug>              Yazı
/yorumlar                 Google yorumları + Google'da yorum yaz bağlantısı (ana sayfaya da özet)
/iletisim                 Adres, harita, saatler, telefon, WhatsApp, yol tarifi
/randevu                  Kısa açıklama + Vetimiz'e yönlendirme butonu
/kvkk                     Aydınlatma metni (iletişim bilgisi toplanmasa da yasal sayfa)
404
```

Hizmet sayfaları (slug → kapsadığı Vetimiz kalemleri):
- `cerrahi` → kısırlaştırma (kedi/köpek, tüm kilo grupları), sezaryen, tümör, fıtık, gastrointestinal, göz operasyonları, küçük operasyon, prolapsus, genel/lokal anestezi
- `dahiliye` → serum tedavisi, hospitalizasyon, iç hastalıkları
- `ortopedi-ve-travmatoloji` → osteosentez, eksternal fiksatör, kırıklar, çapraz bağ, bandaj
- `dogum-ve-jinekoloji` → gebelik muayenesi, sezaryen, prolapsus uteri/vagina
- `ultrasonografi` → abdomen USG, gebelik takibi
- `ekokardiyografi` → kalp taraması, yatkın ırklar
- `dermatoloji` → deri kazıntısı, sitoloji, mantar, parazit
- `onkoloji` → kitle/tümör tanı ve operasyonu, sitoloji
- `agiz-ve-dis-hastaliklari` → diş çekimi, süt dişi, gingivitis, diş taşı
- `laboratuvar` → tam kan, biyokimya panel, idrar, gaita, mikroskopi, sitoloji
- `goruntuleme` → röntgen, USG, ekokardiyografi (çapraz link)
Ek olarak her sayfada ilgili: mikroçip, aşı, tırnak kesimi, tıraş, pansuman gibi rutin işlemler "Diğer hizmetler" bloğunda.

Her hizmet sayfası: ne zaman gerekir (belirtiler), klinikte nasıl yapılıyor, gerçek fotoğraf/röntgen, ilgili vaka yazıları, SSS (3–5 soru), randevu butonu.

## 6. SEO planı

- Her sayfada benzersiz `title`/`description`, canonical, Open Graph görseli, `lang="tr"`.
- Yapısal veri (JSON-LD):
  - `VeterinaryCare` (LocalBusiness alt tipi): ad, adres, geo, telefon, saatler, `sameAs` (Instagram, Maps, Vetimiz), `hasMap`, `areaServed` (Çukurova, Seyhan, Sarıçam, Yüreğir, Adana).
  - `Person` Yunus Kurt (`jobTitle`, `alumniOf`, `worksFor`) – form gelince.
  - `Service` her hizmet sayfası, `FAQPage` SSS'ler, `BreadcrumbList`, `BlogPosting` (yazar Yunus Kurt).
  - **`aggregateRating` eklenmeyecek**: Google, işletmenin kendi sitesinde kendi yorumlarına yıldız şemasını "self-serving" sayıp yok sayıyor/ceza riski var. Yorumlar görsel olarak gösterilecek.
- `sitemap.xml`, `robots.txt`, `llms.txt` (AI arama motorları için – geo-optimizer skill).
- Yerel sinyaller: her sayfada NAP (ad-adres-telefon) Maps ile birebir aynı yazım; footer'da harita linki; iletişim sayfasında gömülü Google Haritası (tıklayınca yüklenen, hız için).
- İçerik anahtar kelimeleri `openseo-keyword-research` / `openseo-local-seo` skilleriyle netleşecek.
- Performans: statik HTML, optimize görseller, font self-host, harita ve Instagram gömmeleri tembel yükleme.

## 7. Blog başlangıç içeriği (8 yazı)

Instagram'daki kendi içeriklerinden türetilecek, Türkçe, hekim adına yazılmış, yayından önce Yunus Kurt onayı:
Bilgi: 1) Kedi kısırlaştırma: adım adım süreç ve sonrası bakım 2) İç ve dış parazitler: kene, pire, sivrisinek takvimi 3) Kediler yüksekten düşer mi? (yüksek apartman sendromu) 4) Kalp hastalığına yatkın köpek ırkları ve ekokardiyografi 5) Süt dişi düşmeyen minyatür ırklar
Vaka: 6) Tarçın: çapraz bağ kopması 7) Eksternal fiksatörle kırık tedavisi 8) Entropion operasyonu (Gece)
Vaka yazıları gerçek fotoğrafları ve klinikteki açıklamaları kullanır, hasta sahibinin kimliği paylaşılmaz.

## 8. Görsel tasarım

- Renkler logodan: lacivert (ana), logo kırmızısı (vurgu, butonlar), yaprak yeşili (küçük detay), krem/kırık beyaz zemin. Mor, neon, gradyan yok.
- Tipografi: karakterli bir başlık fontu + okunaklı gövde fontu, Türkçe karakter desteği şart. Inter/Poppins gibi "varsayılan" fontlar yok. Kesin seçim `frontend-design` skill'iyle.
- Fotoğraf merkezli: hero'da Yunus Kurt'un gerçek bir hasta fotoğrafı, büyük ve kadrajlı. Röntgen/ultrason görüntüleri hizmet sayfalarında "gerçek vaka" hissi verir.
- Ton: sıcak, samimi, abartısız; klinik Instagram'daki dil ("Dostumuz Tarçın…").
- Hareket: az ve anlamlı (sayfa geçişi, fotoğraf belirmesi); `prefers-reduced-motion` desteği. (`animate`, `emil-design-eng` skilleri)
- Mobil öncelikli: sabit alt bar "Ara · Yol tarifi · Randevu".
- Logo: 150 px kaynaktan net SVG'ye yeniden çizilecek; orijinal dosya gelirse o kullanılır.

## 9. Teknik

- Astro 5, Tailwind CSS, MDX içerik koleksiyonları (`src/content/services`, `src/content/blog`), `astro:assets` görsel optimizasyonu, `@astrojs/sitemap`.
- Tamamen statik çıktı, Vercel'de yayın. İletişim formu yok (telefon/WhatsApp/Vetimiz yeterli, KVKK yükü yok).
- Analitik: Vercel Web Analytics (çerezsiz → çerez banner'ı gerekmiyor). Search Console ayrıca.
- Git deposu; GitHub'a push → Vercel otomatik deploy (kullanıcı hesabı gerekir).

## 10. Kullanıcının yapacağı adımlar (Claude yapamaz – hesap girişi)

1. Vercel hesabıyla giriş, projeyi içe aktarma (Claude komutları hazırlar).
2. İsimtescil DNS: `A @ 76.76.21.21`, `CNAME www cname.vercel-dns.com` (Vercel'in gösterdiği değerler esas).
3. Search Console: domain mülkü, DNS TXT doğrulama, `sitemap.xml` gönderme.
4. Google İşletme Profili: web sitesi alanı zaten `lupusveteriner.com`; randevu linki olarak Vetimiz URL'si eklenebilir.

## 11. Bekleyen girdiler

- `docs/yunus-kurt-bilgi-formu.md` cevapları (hekim sayfası bunlar gelene kadar yer tutucu metinle değil, eldeki doğrulanmış bilgilerle yayına hazır olur; form gelince zenginleşir).
- Pazar kapanış saati teyidi, evde hizmet teyidi.
- Varsa yüksek çözünürlüklü logo.
- Maps fotoğraflarının klinik tarafından mı yüklendiği (müşteri yüklediyse kullanmayız; Instagram fotoğrafları yeterli).

## 12. Builder'a bırakılanlar

Kesin font ve renk kodları, bileşen detayları, animasyon değerleri, hangi fotoğrafın nerede kullanılacağı, metinlerin son hali (yukarıdaki ton ve gerçeklere bağlı kalarak).
