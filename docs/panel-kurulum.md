# Yönetim paneli kurulumu (bir kerelik)

Panel Keystatic ile yapıldı. Yunus Bey `https://lupusveteriner.com/keystatic` adresinden girer, formları doldurur, **Save**'e basar. Değişiklik GitHub'daki `moetrends/lupusvet` reposuna kaydedilir. Vercel siteyi 1-2 dakika içinde yeniden yayınlar.

Girişi **Keystatic Cloud** yönetir. Yunus Bey'in GitHub hesabı olması gerekmez, e-postasıyla giriş yapar. Ücretsiz planda bir takımda en fazla 3 kullanıcı olabilir.

Proje kimliği girilmediği sürece canlı sitede panel içerik kaydedemez (API 404 döner). Yani kurulum bitene kadar kimse siteyi panelden değiştiremez.

## 1. Keystatic Cloud projesi (repo sahibi yapar)

1. https://keystatic.cloud adresine gidin. **moetrends** GitHub hesabıyla giriş yapın.
2. Bir takım (team) oluşturun, örneğin `lupus`.
3. Takımın içinde **New project** deyin. Repo olarak `moetrends/lupusvet`'i seçin. Keystatic GitHub uygulamasını bu repoya kurmanızı isterse onaylayın; yalnızca bu repoya izin verin.
4. Proje oluşunca proje kimliğini kopyalayın. `takım/proje` biçimindedir, örneğin `lupus/lupusvet`.
5. Proje ayarlarında site adresi sorulursa `https://lupusveteriner.com` yazın.

## 2. Vercel ortam değişkeni

1. Vercel → proje → **Settings → Environment Variables**.
2. Yeni değişken ekleyin:
   - **Key:** `PUBLIC_KEYSTATIC_PROJECT`
   - **Value:** 1. adımda kopyaladığınız kimlik, örneğin `lupus/lupusvet`
   - **Environments:** Production (Preview da seçilebilir)
3. **Deployments** → son deploy → **Redeploy**. Değişken ancak yeni bir build'de devreye girer.

## 3. Yunus Bey'i davet etme

1. keystatic.cloud → takım → **Members** → **Invite**.
2. Yunus Bey'in e-posta adresini yazın.
3. Yunus Bey e-postadaki daveti kabul edip `https://lupusveteriner.com/keystatic` adresinden giriş yapar.

## 4. Kontrol

- `https://lupusveteriner.com/keystatic` açılınca Keystatic Cloud giriş ekranı gelmeli.
- Giriş yaptıktan sonra küçük bir değişiklik yapıp **Save**'e basın.
- GitHub'da yeni bir commit, Vercel'de yeni bir deploy görünmeli.

## Yerelde çalıştırma (geliştirici için)

```bash
npm run dev
```

`http://localhost:4321/keystatic` adresinde panel yerel dosyalara yazar (giriş gerekmez). Değişiklikleri git ile commit edip push etmek gerekir.

## Teknik notlar

- Panel yapılandırması: `keystatic.config.tsx`.
- Düzenlenen dosyalar:
  - `src/data/klinik.json` (klinik bilgileri)
  - `src/data/yorumlar.json`
  - `src/data/takip.json` (takip kodları)
  - `src/content/pages/*.json` (sayfa metinleri)
  - `src/content/services/*.mdx`, `src/content/blog/*.mdx`
- Panelden yüklenen görseller `src/assets/content/<bölüm>/` altına kaydedilir. Astro bunları WebP'ye çevirip boyutlandırır.
- Panel hatalı veri kaydederse (örneğin zorunlu bir alan boş kalırsa) Vercel build'i başarısız olur. Bu durumda **eski site yayında kalır**. `npm run build && npm run check` yerelde aynı kontrolleri yapar.
- Takip kodları (GA4, Ads, GTM, Meta Pixel) yalnızca ziyaretçi çerez bandında “Kabul et” derse yüklenir (KVKK). Kod girilmemişse bant hiç görünmez.
- `llms.txt` artık `src/pages/llms.txt.ts` tarafından klinik bilgilerinden otomatik üretiliyor.
