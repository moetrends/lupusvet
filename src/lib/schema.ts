import { clinic, fullAddress } from '../data/clinic';

const ORG_ID = `${clinic.url}/#klinik`;
const VET_ID = `${clinic.url}/#yunus-kurt`;
const abs = (path: string) => new URL(path, clinic.url).href;

// Not: aggregateRating bilerek yok. Google işletmenin kendi sitesindeki kendi yorumlarına
// yıldız şemasını "self-serving" sayar; yorumlar sayfada görsel olarak gösteriliyor.
export function vetClinicSchema(image?: string) {
  return {
    '@type': ['VeterinaryCare', 'LocalBusiness'],
    '@id': ORG_ID,
    name: clinic.name,
    url: clinic.url,
    telephone: clinic.phoneE164,
    email: clinic.email,
    image: image ? abs(image) : undefined,
    logo: abs('/favicon.png'),
    foundingDate: String(clinic.founded),
    priceRange: '₺₺',
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.district,
      addressRegion: clinic.address.city,
      postalCode: clinic.address.postalCode,
      addressCountry: clinic.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: clinic.geo.lat, longitude: clinic.geo.lng },
    hasMap: clinic.mapsCidUrl,
    openingHoursSpecification: clinic.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: clinic.areaServed.map((name) => ({ '@type': 'Place', name })),
    sameAs: [clinic.instagramUrl, clinic.mapsCidUrl, clinic.bookingUrl],
    employee: { '@id': VET_ID },
    knowsAbout: clinic.species.map((s) => `${s} sağlığı`),
    potentialAction: {
      '@type': 'ReserveAction',
      target: { '@type': 'EntryPoint', urlTemplate: clinic.bookingUrl },
      name: 'Randevu al',
    },
  };
}

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': VET_ID,
    name: clinic.vet.name,
    jobTitle: clinic.vet.title,
    url: abs('/veteriner-hekim-yunus-kurt'),
    worksFor: { '@id': ORG_ID },
    sameAs: [clinic.vet.instagram],
    alumniOf: clinic.vet.alumniOf ? { '@type': 'CollegeOrUniversity', name: clinic.vet.alumniOf } : undefined,
    knowsAbout: clinic.vet.focus,
    memberOf: { '@type': 'Organization', name: clinic.vet.memberOf },
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: `Veteriner Hekimlik (${clinic.vet.graduationYear})`, recognizedBy: { '@type': 'CollegeOrUniversity', name: clinic.vet.alumniOf } },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: `Yüksek lisans: ${clinic.vet.postgrad.field} (${clinic.vet.postgrad.year})` },
    ],
  };
}

export function serviceSchema(s: { title: string; short: string; slug: string }) {
  return {
    '@type': 'Service',
    name: s.title,
    description: s.short,
    url: abs(`/hizmetler/${s.slug}`),
    serviceType: s.title,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'City', name: 'Adana' },
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.url) })),
  };
}

export function blogPostingSchema(p: { title: string; description: string; date: Date; slug: string; image: string }) {
  return {
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    datePublished: p.date.toISOString(),
    dateModified: p.date.toISOString(),
    url: abs(`/blog/${p.slug}`),
    mainEntityOfPage: abs(`/blog/${p.slug}`),
    image: abs(p.image),
    inLanguage: 'tr-TR',
    author: { '@id': VET_ID, '@type': 'Person', name: clinic.vet.name },
    publisher: { '@id': ORG_ID },
  };
}

export function graph(nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export { fullAddress };
