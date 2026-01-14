// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string; // Optional custom keywords
  image?: string;
  url?: string;
}

export default function SEO({ title, description, keywords, image, url }: SEOProps) {
  // Default Keywords (Jo har page par hone chahiye)
  const defaultKeywords = "student crowdfunding platform, education crowdfunding platform, student funding India, raise money for education, innovation crowdfunding platform";
  
  const siteTitle = `${title} | Student Crowdfunding Platform`;
  const siteDescription = description || "India's trusted education crowdfunding platform. Raise money for college projects, research, and innovation.";

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords} />
      
      {/* Open Graph (Social Media Sharing) */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:url" content={url || 'https://yourdomain.com'} />
      <meta property="og:image" content={image || '/og-image.jpg'} />
      <meta property="og:type" content="website" />

      {/* Trust & Safety Tags */}
      <meta name="author" content="Your Brand Name" />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
}