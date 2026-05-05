import { useEffect } from 'react';

const BASE = 'AYAA — Atse Yohannes Alumni Association';

/**
 * Sets the browser tab title and the meta description for SEO. Restores the
 * defaults when the component unmounts. Google does execute JS so per-page
 * titles still help search; non-JS social crawlers fall back to index.html.
 */
export const useDocumentTitle = (title?: string, description?: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute('content') ?? null;

    document.title = title ? `${title} · ${BASE}` : BASE;
    if (description && metaDesc) metaDesc.setAttribute('content', description);

    return () => {
      document.title = prevTitle;
      if (prevDesc !== null && metaDesc) metaDesc.setAttribute('content', prevDesc);
    };
  }, [title, description]);
};
