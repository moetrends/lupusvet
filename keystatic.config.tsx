// Yönetim paneli (lupusveteriner.com/keystatic) yapılandırması.
// Panelde yapılan her değişiklik GitHub'a kaydedilir, Vercel siteyi 1-2 dakikada yeniden yayınlar.
import { config, collection, singleton, fields } from '@keystatic/core';

const cloudProject = import.meta.env.PUBLIC_KEYSTATIC_PROJECT as string | undefined;

// Görsel alanı: dosyalar src/assets/content altına, sayfaya özel klasöre kaydedilir.
const img = (dir: string, label: string, publicFrom = '../../assets/content') =>
  fields.image({
    label,
    directory: `src/assets/content/${dir}`,
    publicPath: `${publicFrom}/${dir}/`,
    validation: { isRequired: true },
  });
const alt = (label = 'Görselin açıklaması (alt metin)') =>
  fields.text({
    label,
    description: 'Görselde ne olduğunu bir cümleyle yazın. Google ve görme engelli ziyaretçiler için gerekli.',
    validation: { isRequired: true },
  });
const req = (label: string, opts: { multiline?: boolean; description?: string } = {}) =>
  fields.text({ label, ...opts, validation: { isRequired: true } });
const seo = (label = 'Google görünümü') =>
  fields.object(
    {
      title: fields.text({
        label: 'Sayfa başlığı (Google’da mavi başlık)',
        description: '10-70 karakter. Hizmet ve şehir adı geçsin.',
        validation: { length: { min: 10, max: 70 } },
      }),
      description: fields.text({
        label: 'Sayfa açıklaması (Google’da başlığın altındaki metin)',
        description: '50-170 karakter.',
        multiline: true,
        validation: { length: { min: 50, max: 170 } },
      }),
    },
    { label },
  );
const time = (label: string) =>
  fields.text({ label, validation: { pattern: { regex: /^([01]\d|2[0-3]):[0-5]\d$/, message: 'SS:DD biçiminde yazın, örneğin 09:00' } } });
const DAYS = [
  { label: 'Pazartesi', value: 'Monday' },
  { label: 'Salı', value: 'Tuesday' },
  { label: 'Çarşamba', value: 'Wednesday' },
  { label: 'Perşembe', value: 'Thursday' },
  { label: 'Cuma', value: 'Friday' },
  { label: 'Cumartesi', value: 'Saturday' },
  { label: 'Pazar', value: 'Sunday' },
] as const;

export default config({
  storage:
    import.meta.env.PROD && cloudProject ? { kind: 'cloud' } : { kind: 'local' },
  ...(cloudProject ? { cloud: { project: cloudProject } } : {}),
  locale: 'en-US',
  ui: {
    brand: { name: 'Lupus Veteriner' },
    navigation: {
      'Klinik': ['klinik', 'yorumlar'],
      'Sayfalar': ['anasayfa', 'hakkimizda', 'hekim', 'hastaDuvari'],
      'İçerik': ['services', 'blog'],
      'Reklam ve SEO': ['takip'],
    },
  },
  singletons: {
    klinik: singleton({
      label: 'Klinik bilgileri',
      path: 'src/data/klinik',
      format: { data: 'json' },
      schema: {
        name: req('Klinik adı'),
        shortName: req('Kısa ad'),
        phone: req('Telefon', { description: 'Örnek: 0537 211 50 05. Sitedeki tüm “Ara” düğmeleri bu numarayı kullanır.' }),
        whatsappPhone: fields.text({ label: 'WhatsApp numarası', description: 'Telefonla aynıysa boş bırakın.' }),
        email: req('E-posta'),
        address: fields.object(
          {
            street: req('Sokak, bina, kapı no'),
            district: req('İlçe'),
            city: req('İl'),
            postalCode: req('Posta kodu'),
            landmark: req('Tarif (örnek: “İkram Dondurma’nın 150 metre ilerisi”)'),
          },
          { label: 'Adres' },
        ),
        geo: fields.object(
          {
            lat: fields.number({ label: 'Enlem', step: 0.000001, validation: { isRequired: true, min: 35, max: 43 } }),
            lng: fields.number({ label: 'Boylam', step: 0.000001, validation: { isRequired: true, min: 25, max: 45 } }),
          },
          {
            label: 'Harita konumu',
            description:
              'Google Haritalar’da kliniğin üstüne sağ tıklayın, en üstteki sayıları kopyalayın (örnek: 37.030914, 35.2966). İlk sayı enlem, ikincisi boylam. Taşınırsanız Google İşletme Profili’ndeki adresi de ayrıca güncelleyin.',
          },
        ),
        hours: fields.array(
          fields.object({
            label: req('Gösterilecek ad (örnek: Pazartesi – Cumartesi)'),
            days: fields.multiselect({ label: 'Günler', options: DAYS }),
            opens: time('Açılış'),
            closes: time('Kapanış'),
          }),
          {
            label: 'Çalışma saatleri',
            description: 'Listede olmayan günler “kapalı” görünür. Google İşletme Profili’ndeki saatlerle aynı tutun.',
            itemLabel: (p) => `${p.fields.label.value}: ${p.fields.opens.value}–${p.fields.closes.value}`,
          },
        ),
        bookingUrl: fields.url({ label: 'Online randevu linki (Vetimiz)', validation: { isRequired: true } }),
        mapsUrl: fields.url({ label: 'Google Haritalar kısa linki', validation: { isRequired: true } }),
        mapsCidUrl: fields.url({ label: 'Google Haritalar işletme linki (yorumlar için)', validation: { isRequired: true } }),
        instagramUrl: fields.url({ label: 'Instagram', validation: { isRequired: true } }),
        rating: fields.object(
          {
            value: fields.number({ label: 'Google puanı', step: 0.1, validation: { isRequired: true, min: 1, max: 5 } }),
            count: fields.integer({ label: 'Yorum sayısı', validation: { isRequired: true, min: 0 } }),
          },
          { label: 'Google puanı', description: 'Google Haritalar’daki güncel puan ve yorum sayısı.' },
        ),
        founded: fields.integer({ label: 'Kuruluş yılı', validation: { isRequired: true, min: 1990, max: 2100 } }),
        vet: fields.object(
          {
            name: req('Ad soyad'),
            title: req('Unvan'),
            alumniOf: req('Mezun olduğu fakülte'),
            graduationYear: fields.integer({ label: 'Mezuniyet yılı', validation: { isRequired: true } }),
            postgrad: fields.object(
              { field: req('Alan'), year: fields.integer({ label: 'Yıl', validation: { isRequired: true } }) },
              { label: 'Yüksek lisans' },
            ),
            experienceYears: fields.integer({ label: 'Deneyim (yıl)', validation: { isRequired: true } }),
            previous: req('Önceki çalıştığı yerler'),
            focus: fields.array(req('İlgi alanı'), { label: 'İlgi alanları', itemLabel: (p) => p.value }),
            trainings: req('Eğitimler'),
            memberOf: req('Üyelik'),
            pets: req('Evcil hayvanları', { multiline: true }),
          },
          { label: 'Kurucu hekim' },
        ),
        team: fields.array(
          fields.object({ name: req('Ad'), title: req('Unvan') }),
          { label: 'Ekip', itemLabel: (p) => `${p.fields.title.value} ${p.fields.name.value}` },
        ),
        species: fields.array(req('Tür'), { label: 'Bakılan hayvanlar', itemLabel: (p) => p.value }),
        emergency: req('Acil durum notu', { multiline: true }),
        homeVisit: req('Evde muayene notu', { multiline: true }),
        equipment: fields.array(
          fields.object({ name: req('Cihaz'), use: req('Ne için kullanılıyor') }),
          { label: 'Cihazlar', itemLabel: (p) => p.fields.name.value },
        ),
        areaServed: fields.array(req('Bölge'), { label: 'Hizmet verilen bölgeler', itemLabel: (p) => p.value }),
      },
    }),

    yorumlar: singleton({
      label: 'Google yorumları',
      path: 'src/data/yorumlar',
      format: { data: 'json' },
      schema: {
        reviews: fields.array(
          fields.object({
            author: req('Yorum yapan'),
            text: req('Yorum', { multiline: true, description: 'Google’daki yorumu olduğu gibi kopyalayın.' }),
            when: req('Tarih (örnek: Kasım 2026)'),
          }),
          { label: 'Yorumlar', description: 'İlk üç yorum ana sayfada görünür.', itemLabel: (p) => p.fields.author.value },
        ),
      },
    }),

    takip: singleton({
      label: 'Takip kodları ve doğrulamalar',
      path: 'src/data/takip',
      format: { data: 'json' },
      schema: {
        ga4Id: fields.text({
          label: 'Google Analytics 4 ölçüm kimliği',
          description: 'G- ile başlar. Analytics → Yönetici → Veri akışları.',
          validation: { pattern: { regex: /^(G-[A-Z0-9]+)?$/, message: 'G-XXXXXXX biçiminde olmalı' } },
        }),
        gtmId: fields.text({
          label: 'Google Tag Manager kimliği',
          description: 'GTM- ile başlar. Tag Manager kullanıyorsanız Analytics ve Ads etiketlerini oradan ekleyin, yukarıdaki alanı boş bırakın.',
          validation: { pattern: { regex: /^(GTM-[A-Z0-9]+)?$/, message: 'GTM-XXXXXXX biçiminde olmalı' } },
        }),
        googleAdsId: fields.text({
          label: 'Google Ads etiketi',
          description: 'AW- ile başlar.',
          validation: { pattern: { regex: /^(AW-\d+)?$/, message: 'AW-123456789 biçiminde olmalı' } },
        }),
        metaPixelId: fields.text({
          label: 'Meta (Facebook/Instagram) Pixel kimliği',
          description: 'Yalnızca rakamlardan oluşur. Meta Events Manager → Veri kaynakları.',
          validation: { pattern: { regex: /^(\d{10,20})?$/, message: 'Yalnızca rakam olmalı' } },
        }),
        googleVerification: fields.array(fields.text({ label: 'Kod' }), {
          label: 'Google doğrulama kodları (Search Console, Merchant Center)',
          description: 'google-site-verification meta etiketindeki content="..." değeri. Sadece tırnak içindeki kodu yapıştırın.',
          itemLabel: (p) => p.value,
        }),
        bingVerification: fields.text({ label: 'Bing Webmaster doğrulama kodu', description: 'msvalidate.01 etiketindeki content değeri.' }),
        facebookDomainVerification: fields.text({ label: 'Meta alan adı doğrulama kodu', description: 'facebook-domain-verification etiketindeki content değeri.' }),
        yandexVerification: fields.text({ label: 'Yandex doğrulama kodu' }),
        extraMeta: fields.array(
          fields.object({ name: req('name'), content: req('content') }),
          {
            label: 'Diğer doğrulama etiketleri',
            description: 'Başka bir servis <meta name="..." content="..."> isterse buraya ekleyin.',
            itemLabel: (p) => p.fields.name.value,
          },
        ),
      },
    }),

    anasayfa: singleton({
      label: 'Ana sayfa',
      path: 'src/content/pages/anasayfa',
      format: { data: 'json' },
      schema: {
        seo: seo(),
        hero: fields.object(
          {
            title: req('Büyük başlık'),
            lead: req('Başlık altı metin', { multiline: true }),
            image: img('anasayfa', 'Büyük fotoğraf'),
            imageAlt: alt(),
            caption: req('Fotoğraf üstündeki etiket'),
            inClinic: req('“Klinik içinde” kutusundaki metin'),
          },
          { label: 'Üst bölüm' },
        ),
        services: fields.object(
          { title: req('Başlık'), intro: req('Açıklama', { multiline: true }) },
          { label: 'Hizmetler bölümü' },
        ),
        vet: fields.object(
          { image: img('anasayfa', 'Fotoğraf'), imageAlt: alt(), text: req('Metin', { multiline: true }) },
          { label: 'Hekim bölümü' },
        ),
        wall: fields.object(
          { title: req('Başlık'), text: req('Metin', { multiline: true }) },
          { label: 'Hasta duvarı bölümü', description: 'Fotoğraflar “Hasta duvarı” sayfasından yönetilir.' },
        ),
        location: fields.object(
          { image: img('anasayfa', 'Fotoğraf'), imageAlt: alt() },
          { label: 'Konum bölümü' },
        ),
      },
    }),

    hakkimizda: singleton({
      label: 'Kliniğimiz',
      path: 'src/content/pages/hakkimizda',
      format: { data: 'json' },
      schema: {
        seo: seo(),
        title: req('Başlık'),
        body: req('Metin', { multiline: true, description: 'Paragrafları boş bir satırla ayırın.' }),
        image: img('hakkimizda', 'Fotoğraf'),
        imageAlt: alt(),
        equipmentTitle: req('Donanım başlığı'),
        equipmentIntro: req('Donanım açıklaması', { multiline: true }),
        highlights: fields.array(
          fields.object({
            image: img('hakkimizda', 'Fotoğraf'),
            alt: alt(),
            title: req('Başlık'),
            text: req('Metin', { multiline: true }),
          }),
          { label: 'Öne çıkan cihazlar', description: 'Üç kart önerilir. Cihaz listesi “Klinik bilgileri”nden gelir.', itemLabel: (p) => p.fields.title.value },
        ),
        roomImage: img('hakkimizda', 'Cihaz listesinin yanındaki fotoğraf'),
        roomImageAlt: alt(),
      },
    }),

    hekim: singleton({
      label: 'Hekimimiz',
      path: 'src/content/pages/hekim',
      format: { data: 'json' },
      schema: {
        seo: seo(),
        subtitle: req('Başlık altı'),
        bio: req('Özgeçmiş', { multiline: true, description: 'Paragrafları boş bir satırla ayırın. Eğitim, deneyim ve üyelik kutuları “Klinik bilgileri”nden gelir.' }),
        portrait: img('hekim', 'Portre fotoğrafı'),
        portraitAlt: alt(),
        whyLupus: req('“Neden Lupus?” metni', { multiline: true }),
        drawing: fields.image({ label: 'Karikatür', directory: 'src/assets/content/hekim', publicPath: '../../assets/content/hekim/' }),
        drawingAlt: fields.text({ label: 'Karikatür açıklaması' }),
        drawingCaption: fields.text({ label: 'Karikatür altı yazı' }),
        gallery: fields.array(
          fields.object({ image: img('hekim', 'Fotoğraf'), alt: alt() }),
          { label: 'Hastalarıyla galerisi', description: '3’ün katı (3, 6, 9) fotoğraf en düzgün görünür.', itemLabel: (p) => p.fields.alt.value },
        ),
        examSteps: fields.array(req('Adım'), { label: '“Bir muayene nasıl geçer?” adımları', itemLabel: (p) => p.value }),
        examImage: img('hekim', 'Muayene fotoğrafı'),
        examImageAlt: alt(),
      },
    }),

    hastaDuvari: singleton({
      label: 'Hasta duvarı',
      path: 'src/content/pages/hasta-duvari',
      format: { data: 'json' },
      schema: {
        photos: fields.array(
          fields.object({ image: img('hasta-duvari', 'Fotoğraf'), alt: alt() }),
          { label: 'Fotoğraflar', description: 'Ana sayfada ve Kliniğimiz sayfasında polaroid olarak görünür. 8-16 fotoğraf önerilir.', itemLabel: (p) => p.fields.alt.value },
        ),
      },
    }),
  },

  collections: {
    services: collection({
      label: 'Hizmetler',
      path: 'src/content/services/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'order'],
      schema: {
        title: fields.slug({
          name: { label: 'Hizmet adı' },
          slug: { label: 'Adres (URL)', description: 'Yayındaki bir hizmetin adresini değiştirmeyin, Google’daki sıralama kaybolur.' },
        }),
        seoTitle: fields.text({ label: 'Google başlığı', description: '10-70 karakter.', validation: { length: { min: 10, max: 70 } } }),
        short: fields.text({ label: 'Kısa açıklama (Google açıklaması)', multiline: true, description: '50-170 karakter.', validation: { length: { min: 50, max: 170 } } }),
        order: fields.integer({ label: 'Sıra', description: 'Küçük sayı önce görünür.', validation: { isRequired: true } }),
        hero: img('services', 'Kapak fotoğrafı'),
        heroAlt: alt(),
        includes: fields.array(req('Madde'), { label: 'Kapsadığı işlemler', itemLabel: (p) => p.value }),
        faq: fields.array(
          fields.object({ q: req('Soru'), a: req('Cevap', { multiline: true }) }),
          { label: 'Sık sorulan sorular', description: 'En az 3 soru. Google’da “Benzer sorular” kutusunda çıkabilir.', itemLabel: (p) => p.fields.q.value, validation: { length: { min: 3 } } },
        ),
        related: fields.array(fields.relationship({ label: 'Hizmet', collection: 'services' }), { label: 'İlgili hizmetler', itemLabel: (p) => p.value ?? '' }),
        content: fields.mdx({
          label: 'Sayfa metni',
          options: { image: { directory: 'src/assets/content/services', publicPath: '../../assets/content/services/' } },
        }),
      },
    }),

    blog: collection({
      label: 'Blog yazıları',
      path: 'src/content/blog/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Başlık' }, slug: { label: 'Adres (URL)' } }),
        description: fields.text({ label: 'Özet (Google açıklaması)', multiline: true, description: '50-170 karakter.', validation: { length: { min: 50, max: 170 } } }),
        date: fields.date({ label: 'Tarih', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        category: fields.select({
          label: 'Tür',
          options: [
            { label: 'Bilgi yazısı', value: 'bilgi' },
            { label: 'Vaka', value: 'vaka' },
          ],
          defaultValue: 'bilgi',
        }),
        hero: img('blog', 'Kapak fotoğrafı'),
        heroAlt: alt(),
        service: fields.relationship({ label: 'İlgili hizmet', collection: 'services' }),
        source: fields.url({ label: 'Kaynak (Instagram gönderisi vb.)' }),
        content: fields.mdx({
          label: 'Yazı',
          options: { image: { directory: 'src/assets/content/blog', publicPath: '../../assets/content/blog/' } },
        }),
      },
    }),
  },
});
