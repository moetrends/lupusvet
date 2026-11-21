// Klinik bilgileri yönetim panelinden (/keystatic → Klinik bilgileri) düzenlenir ve klinik.json'a yazılır.
// Burada yalnızca türetilen alanlar (uluslararası telefon, WhatsApp, yol tarifi linki) hesaplanır.
import data from './klinik.json';

// "0537 211 50 05" → "+905372115005"
const toE164 = (p: string) => {
  const d = p.replace(/\D/g, '');
  if (d.startsWith('90')) return `+${d}`;
  return `+90${d.replace(/^0/, '')}`;
};

const phoneE164 = toE164(data.phone);
const whatsappE164 = toE164(data.whatsappPhone || data.phone);

export const clinic = {
  ...data,
  url: 'https://lupusveteriner.com',
  phoneE164,
  whatsapp: `https://wa.me/${whatsappE164.slice(1)}`,
  address: { ...data.address, country: 'TR' },
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${data.geo.lat},${data.geo.lng}`,
};

export const fullAddress = `${clinic.address.street}, ${clinic.address.postalCode} ${clinic.address.district}/${clinic.address.city}`;
export const telHref = `tel:${clinic.phoneE164}`;
// "Pazartesi – Cumartesi 09:00-19:30, Pazar 12:00-16:00"
export const hoursSummary = clinic.hours.map((h) => `${h.label} ${h.opens}-${h.closes}`).join(', ');
