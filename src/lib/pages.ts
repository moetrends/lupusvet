// Panelden düzenlenen sayfa metinlerini okur. Her koleksiyonda tek kayıt vardır.
import { getCollection, type CollectionKey } from 'astro:content';

export async function pageData<K extends 'anasayfa' | 'hakkimizda' | 'hekim' | 'hastaDuvari'>(key: K) {
  const [entry] = await getCollection(key as CollectionKey & K);
  if (!entry) throw new Error(`Sayfa verisi bulunamadı: ${key}`);
  return entry.data;
}

// Boş satırla ayrılmış metni paragraflara böler.
export const paragraphs = (text: string) =>
  text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
