import { useEffect, useState } from 'react';

export const getHashPath = () => {
  const raw = window.location.hash.replace(/^#/, '');
  return raw || '/';
};

export const navigateTo = (path) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  window.location.hash = `#${normalized}`;
};

export const useHashPath = () => {
  const [path, setPath] = useState(getHashPath());

  useEffect(() => {
    const onHashChange = () => setPath(getHashPath());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return path;
};
