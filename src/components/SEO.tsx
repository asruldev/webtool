import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website' 
}: SEOProps) {
  const location = useLocation();
  
  useEffect(() => {
    const baseUrl = 'https://webtool.asrul.dev';
    const currentUrl = url || `${baseUrl}${location.pathname}`;
    const currentTitle = title || 'Free Online JSON Tools - Formatter, Validator, Tree View & Regex Tester';
    const currentDescription = description || 'Free online JSON formatter, validator, tree viewer, and regex tester. Format, validate, and beautify your JSON data with our powerful web tools.';
    const currentImage = image || `${baseUrl}/og-image.png`;
    
    // Update document title
    document.title = currentTitle;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    const updatePropertyMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    // Update primary meta tags
    updateMetaTag('title', currentTitle);
    updateMetaTag('description', currentDescription);
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    
    // Update Open Graph tags
    updatePropertyMetaTag('og:title', currentTitle);
    updatePropertyMetaTag('og:description', currentDescription);
    updatePropertyMetaTag('og:url', currentUrl);
    updatePropertyMetaTag('og:image', currentImage);
    updatePropertyMetaTag('og:type', type);
    
    // Update Twitter tags
    updatePropertyMetaTag('twitter:title', currentTitle);
    updatePropertyMetaTag('twitter:description', currentDescription);
    updatePropertyMetaTag('twitter:url', currentUrl);
    updatePropertyMetaTag('twitter:image', currentImage);
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;
    
  }, [title, description, keywords, image, url, type, location.pathname]);
  
  return null; // This component doesn't render anything
}
