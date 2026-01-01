import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to top on every route change.
// If a hash is present, scrolls to the element with that id.
export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // If there's a hash, try to scroll to the element
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
    }
    // Otherwise scroll to top instantly
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash]);

  return null;
}

