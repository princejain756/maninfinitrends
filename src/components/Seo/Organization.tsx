import { BASE_URL, BRAND } from '@/config/seo';
import JsonLd from './JsonLd';

export const OrganizationJsonLd = () => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      // Add your social profiles when ready
    ],
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'manita4599@gmail.com',
      telephone: '+91-98765-43210',
      areaServed: 'IN'
    }],
  };
  return <JsonLd data={data} />;
};

export const WebSiteJsonLd = () => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: BASE_URL,
    name: BRAND,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  return <JsonLd data={data} />;
};

export default OrganizationJsonLd;

