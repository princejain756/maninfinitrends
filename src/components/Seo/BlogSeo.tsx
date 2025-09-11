import { useEffect } from 'react';
import { BASE_URL, DEFAULT_SEO } from '@/config/seo';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  image: string;
};

type BlogSeoProps = {
  post?: BlogPost;
  isBlogIndex?: boolean;
};

export const BlogSeo = ({ post, isBlogIndex = false }: BlogSeoProps) => {
  useEffect(() => {
    if (isBlogIndex) {
      // Blog index page SEO
      const title = `Fashion Blog | Latest Trends, Style Guides & Sustainable Fashion | ${DEFAULT_SEO.title}`;
      const description = `Discover the latest fashion trends, sustainable style guides, and expert insights on ethnic wear, jewelry, and eco-fashion. Your ultimate destination for fashion inspiration and style advice.`;
      const canonical = `${BASE_URL}/blog`;
      const image = `${BASE_URL}/api/placeholder/1200/630`;

      // Update meta tags
      updateMetaTag('name', 'description', description);
      updateMetaTag('property', 'og:title', title);
      updateMetaTag('property', 'og:description', description);
      updateMetaTag('property', 'og:type', 'website');
      updateMetaTag('property', 'og:url', canonical);
      updateMetaTag('property', 'og:image', image);

      // Twitter
      updateMetaTag('name', 'twitter:card', 'summary_large_image');
      updateMetaTag('name', 'twitter:title', title);
      updateMetaTag('name', 'twitter:description', description);
      updateMetaTag('name', 'twitter:image', image);

      // Update canonical
      updateCanonical(canonical);

      // Update document title
      document.title = title;

      // Add structured data for blog index
      addBlogIndexStructuredData();
    } else if (post) {
      // Individual blog post SEO
      const title = `${post.title} | ${DEFAULT_SEO.title}`;
      const description = post.excerpt;
      const canonical = `${BASE_URL}/blog/${post.id}`;
      const image = post.image.startsWith('http') ? post.image : `${BASE_URL}${post.image}`;

      // Update meta tags
      updateMetaTag('name', 'description', description);
      updateMetaTag('property', 'og:title', title);
      updateMetaTag('property', 'og:description', description);
      updateMetaTag('property', 'og:type', 'article');
      updateMetaTag('property', 'og:url', canonical);
      updateMetaTag('property', 'og:image', image);
      updateMetaTag('property', 'article:published_time', post.publishedAt);
      updateMetaTag('property', 'article:author', post.author.name);
      updateMetaTag('property', 'article:section', post.category);
      post.tags.forEach(tag => {
        updateMetaTag('property', 'article:tag', tag);
      });

      // Twitter
      updateMetaTag('name', 'twitter:card', 'summary_large_image');
      updateMetaTag('name', 'twitter:title', title);
      updateMetaTag('name', 'twitter:description', description);
      updateMetaTag('name', 'twitter:image', image);

      // Update canonical
      updateCanonical(canonical);

      // Update document title
      document.title = title;

      // Add structured data for blog post
      addBlogPostStructuredData(post, canonical, image);
    }
  }, [post, isBlogIndex]);

  return null;
};

function updateMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function updateCanonical(url: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function addBlogIndexStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Maninfini Trends Fashion Blog",
    "description": "Discover the latest fashion trends, sustainable style guides, and expert insights on ethnic wear, jewelry, and eco-fashion.",
    "url": `${BASE_URL}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "Maninfini Trends",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/api/placeholder/300/100`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog`
    }
  };

  addStructuredDataScript(structuredData);
}

function addBlogPostStructuredData(post: BlogPost, canonical: string, image: string) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": image,
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "image": post.author.avatar
    },
    "publisher": {
      "@type": "Organization",
      "name": "Maninfini Trends",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/api/placeholder/300/100`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonical
    },
    "articleSection": post.category,
    "keywords": post.tags.join(', '),
    "url": canonical
  };

  addStructuredDataScript(structuredData);
}

function addStructuredDataScript(data: Record<string, unknown>) {
  // Remove existing structured data
  const existingScript = document.head.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}
