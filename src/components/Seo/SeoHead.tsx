import { useEffect } from 'react';
import { BASE_URL, DEFAULT_SEO, TWITTER_HANDLE } from '@/config/seo';

type Props = {
  title?: string;
  description?: string;
  canonicalPath?: string; // e.g., '/shop/sarees'
  image?: string;
  noindex?: boolean;
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export const SeoHead = ({ title, description, canonicalPath, image, noindex }: Props) => {
  useEffect(() => {
    const t = title || DEFAULT_SEO.title;
    const d = description || DEFAULT_SEO.description;
    const img = image || DEFAULT_SEO.image;
    const canonical = canonicalPath ? `${BASE_URL}${canonicalPath}` : BASE_URL;

    document.title = t;
    upsertMeta('name', 'description', d);

    // Open Graph
    upsertMeta('property', 'og:title', t);
    upsertMeta('property', 'og:description', d);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', img);

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:site', TWITTER_HANDLE);
    upsertMeta('name', 'twitter:image', img);

    setCanonical(canonical);

    if (noindex) {
      upsertMeta('name', 'robots', 'noindex, nofollow');
    } else {
      const robots = document.head.querySelector('meta[name="robots"]');
      if (robots) robots.parentElement?.removeChild(robots);
    }
  }, [title, description, canonicalPath, image, noindex]);

  return null;
};

export default SeoHead;

