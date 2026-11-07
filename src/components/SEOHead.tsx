import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string;
  author?: string;
  structuredData?: Record<string, unknown>;
}

export const DEFAULT_SEO = {
  title: 'Shubham Nayani — Web Developer',
  description: 'Portfolio of Shubham Nayani, a web developer from Gujarat building fast, mobile-first websites that help local businesses grow online.',
  image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=1800&auto=format&fit=crop',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://shubhamnayani.dev',
  type: 'website' as const,
  keywords: 'Shubham Nayani, Web Developer Gujarat, Nakhatrana Web Developer, Mobile-First Websites, React Developer, Tailwind CSS, Local Business Web Design',
  author: 'Shubham Nayani'
};

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  image = DEFAULT_SEO.image,
  url,
  type = DEFAULT_SEO.type,
  keywords = DEFAULT_SEO.keywords,
  author = DEFAULT_SEO.author,
  structuredData
}) => {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : DEFAULT_SEO.url);

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Shubham Nayani Portfolio" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Optional Schema.org JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
