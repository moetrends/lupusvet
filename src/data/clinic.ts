// Tek kaynak: klinik bilgileri. Google Haritalar işletme profiliyle birebir aynı tutun.
export const clinic = {
  name: 'Lupus Veteriner Kliniği',
  shortName: 'Lupus Veteriner',
  url: 'https://lupusveteriner.com',
  phone: '0537 211 50 05',
  phoneE164: '+905372115005',
  whatsapp: 'https://wa.me/905372115005',
  address: {
    street: 'Toros Mah. Mavi Bulvarı Kahyalar Apt. No:62/B',
    district: 'Çukurova',
    city: 'Adana',
    postalCode: '01160',
    country: 'TR',
    landmark: 'Mavi Bulvar, İkram Dondurma’nın 150 metre ilerisi',
  },
  geo: { lat: 37.030914, lng: 35.2966 },
  // Pazar kapanışı Maps'e göre 16:30 (Instagram'da 16:00 yazıyor, teyit bekliyor).
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], label: 'Pazartesi – Cumartesi', opens: '09:00', closes: '19:30' },
    { days: ['Sunday'], label: 'Pazar', opens: '12:00', closes: '16:30' },
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
    // Bilgi formu (docs/yunus-kurt-bilgi-formu.md) gelince doldurulacak:
    alumniOf: undefined as string | undefined,
    graduationYear: undefined as number | undefined,
    focus: undefined as string[] | undefined,
  },
  areaServed: ['Çukurova', 'Seyhan', 'Sarıçam', 'Yüreğir', 'Adana'],
} as const;

export const fullAddress = `${clinic.address.street}, ${clinic.address.postalCode} ${clinic.address.district}/${clinic.address.city}`;
export const telHref = `tel:${clinic.phoneE164}`;
