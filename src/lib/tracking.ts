// Takip kodları ve doğrulama etiketleri: panelde "Reklam ve SEO → Takip kodları" bölümünden girilir.
import t from '../data/takip.json';

export const tracking = {
  ga4Id: t.ga4Id.trim(),
  gtmId: t.gtmId.trim(),
  googleAdsId: t.googleAdsId.trim(),
  metaPixelId: t.metaPixelId.trim(),
};

// Çerez kullanan bir takip kodu girildiyse KVKK gereği onay bandı gösterilir.
export const trackersEnabled = Object.values(tracking).some(Boolean);

export const verificationMeta: { name: string; content: string }[] = [
  ...t.googleVerification.map((c) => ({ name: 'google-site-verification', content: c })),
  { name: 'msvalidate.01', content: t.bingVerification },
  { name: 'facebook-domain-verification', content: t.facebookDomainVerification },
  { name: 'yandex-verification', content: t.yandexVerification },
  ...t.extraMeta,
]
  .map((m) => ({ name: m.name.trim(), content: m.content.trim() }))
  .filter((m) => m.name && m.content);
