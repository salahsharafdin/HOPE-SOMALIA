import React, { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function SEO({ title, description, image, canonicalUrl }) {
  const { settings } = useSettings();
  const defaultTitle = settings.site_name || 'Hope Somalia Foundation';
  const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const metaDesc = description || settings.hero_description || 'Hope Somalia Foundation works with local communities to create sustainable solutions in education, healthcare, clean water, and emergency response.';

  useEffect(() => {
    document.title = fullTitle;
    
    // Meta description
    let metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (!metaDescriptionTag) {
      metaDescriptionTag = document.createElement('meta');
      metaDescriptionTag.setAttribute('name', 'description');
      document.head.appendChild(metaDescriptionTag);
    }
    metaDescriptionTag.setAttribute('content', metaDesc);

    // Open Graph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', fullTitle);
  }, [fullTitle, metaDesc]);

  return null;
}
