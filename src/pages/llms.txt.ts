// Yapay zekâ arama motorları için özet (llms.txt). Panelde değişen bilgilerle birlikte her yayında yeniden üretilir.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { clinic, fullAddress, hoursSummary } from '../data/clinic';

export const GET: APIRoute = async () => {
  const site = clinic.url;
  const services = (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection('blog')).sort((a, b) => +b.data.date - +a.data.date);
  const v = clinic.vet;
  const team = clinic.team.map((t) => `${t.title} ${t.name}`).join(', ');
  const body = `# ${clinic.name}

> ${clinic.address.district}, ${clinic.address.city}'da ${clinic.founded}'dan beri hizmet veren veteriner kliniği. Kurucu hekim: ${v.title} ${v.name}. ${clinic.species.join(', ')} için muayene, cerrahi, ortopedi, görüntüleme (röntgen, ultrason, ekokardiyografi) ve klinik içi laboratuvar.

- Adres: ${fullAddress} (${clinic.address.landmark})
- Telefon / WhatsApp: ${clinic.phone}
- E-posta: ${clinic.email}
- Baktığı hayvanlar: ${clinic.species.join(', ')}. ${clinic.homeVisit}
- Kurucu hekim: ${v.title} ${v.name} (${v.alumniOf} ${v.graduationYear}; yüksek lisans ${v.postgrad.field} ${v.postgrad.year}; ${v.experienceYears} yıllık deneyim; ilgi alanı ${v.focus.join(', ')})
- Ekip: ${team}
- Cihazlar: ${clinic.equipment.map((e) => e.name).join(', ')}
- Çalışma saatleri: ${hoursSummary}. ${clinic.emergency}
- Hizmet bölgesi: ${clinic.areaServed.join(', ')}
- Online randevu: ${clinic.bookingUrl}
- Google Haritalar: ${clinic.mapsCidUrl} (${clinic.rating.value.toLocaleString('tr-TR')} puan, ${clinic.rating.count} yorum)
- Instagram: ${clinic.instagramUrl}

## Sayfalar

- [Ana sayfa](${site}/)
- [${v.title} ${v.name}](${site}/veteriner-hekim-yunus-kurt)
- [Kliniğimiz](${site}/hakkimizda)
- [Hizmetler](${site}/hizmetler)
- [Yorumlar](${site}/yorumlar)
- [İletişim](${site}/iletisim)
- [Randevu](${site}/randevu)

## Hizmetler

${services.map((s) => `- [${s.data.title}](${site}/hizmetler/${s.id}): ${s.data.short}`).join('\n')}

## Blog

${posts.map((p) => `- [${p.data.title}](${site}/blog/${p.id})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
