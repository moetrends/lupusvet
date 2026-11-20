// Tek kaynak: klinik bilgileri. Google Haritalar işletme profiliyle birebir aynı tutun.
export const clinic = {
  name: 'Lupus Veteriner Kliniği',
  shortName: 'Lupus Veteriner',
  url: 'https://lupusveteriner.com',
  phone: '0537 211 50 05',
  phoneE164: '+905372115005',
  whatsapp: 'https://wa.me/905372115005',
  email: 'lupusveteriner@gmail.com',
  address: {
    street: 'Toros Mah. Mavi Bulvarı Kahyalar Apt. No:62/B',
    district: 'Çukurova',
    city: 'Adana',
    postalCode: '01160',
    country: 'TR',
    landmark: 'Mavi Bulvar, İkram Dondurma’nın 150 metre ilerisi',
  },
  geo: { lat: 37.030914, lng: 35.2966 },
  // Klinik teyidi (2026-11-21): Pazar 12:00–16:00.
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], label: 'Pazartesi – Cumartesi', opens: '09:00', closes: '19:30' },
    { days: ['Sunday'], label: 'Pazar', opens: '12:00', closes: '16:00' },
  ],
  bookingUrl: 'https://www.vetimiz.com/klinikler/lupus-veteriner-klinigi',
  mapsUrl: 'https://maps.app.goo.gl/sbud2GCFRcm4emvE6',
  mapsCidUrl: 'https://www.google.com/maps?cid=6415303664903804325',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=37.030914,35.2966',
  instagramUrl: 'https://www.instagram.com/lupus_vet/',
  rating: { value: 4.8, count: 108 },
  founded: 2019,
  vet: {
    name: 'Yunus Kurt',
    title: 'Veteriner Hekim',
    instagram: 'https://www.instagram.com/ykurtt/',
    // Kaynak: Yunus Kurt'un doldurduğu bilgi formu (2026-11-21).
    alumniOf: 'Ankara Üniversitesi Veteriner Fakültesi' as string | undefined,
    graduationYear: 2015 as number | undefined,
    postgrad: { field: 'Hayvan Besleme ve Beslenme Hastalıkları', year: 2017 },
    experienceYears: 12,
    previous: 'Ankara’da çeşitli hayvan hastaneleri',
    focus: ['Kalp hastalıkları', 'Ekokardiyografi'] as string[] | undefined,
    trainings: '50’nin üzerinde eğitim ve sertifika programı',
    memberOf: 'Adana Veteriner Hekimleri Odası',
    pets: 'Üç kedisi var: Ponçik ve Ramo evde, Çiçek klinikte yaşıyor.',
  },
  team: [
    { name: 'Fulya', title: 'Veteriner Hekim' },
    { name: 'Meryem', title: 'Veteriner Hekim' },
  ],
  species: ['Kedi', 'Köpek', 'Tavşan'],
  emergency: 'Mesai dışında acil durumlarda telefonla ulaşabilirsiniz.',
  homeVisit: 'Adana içinde evde muayene hizmeti verilmektedir.',
  equipment: [
    { name: 'Fujifilm CR dijital röntgen', use: 'Kırık, eklem, göğüs ve karın görüntüleme' },
    { name: 'Mindray Vetus 50 Doppler ultrasonografi', use: 'Karın organları, gebelik ve ekokardiyografi' },
    { name: 'Mindray BC30 tam kan cihazı', use: 'Hemogram, aynı gün sonuç' },
    { name: 'Mindray biyokimya cihazı', use: 'Böbrek, karaciğer ve metabolik değerler' },
    { name: 'Mindray hormon cihazı', use: 'Tiroid ve diğer hormon testleri' },
    { name: 'Petbrooder yoğun bakım kabini', use: 'Ameliyat sonrası ve yoğun bakım takibi' },
  ],
  areaServed: ['Çukurova', 'Seyhan', 'Sarıçam', 'Yüreğir', 'Adana'],
} as const;

export const fullAddress = `${clinic.address.street}, ${clinic.address.postalCode} ${clinic.address.district}/${clinic.address.city}`;
export const telHref = `tel:${clinic.phoneE164}`;
