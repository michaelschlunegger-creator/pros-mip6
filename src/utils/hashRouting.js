import { useEffect, useState } from 'react';

const BASENAME = '/pros-mip6';

const normalizePath = (path) => {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
};

const stripBase = (path) => {
  if (path.startsWith(`${BASENAME}/`)) return path.slice(BASENAME.length);
  if (path === BASENAME) return '/';
  return path;
};

export const getCurrentPath = () => {
  const hashPath = window.location.hash.replace(/^#/, '');
  if (hashPath) return normalizePath(hashPath);

  const pathname = stripBase(window.location.pathname || '/');
  return normalizePath(pathname);
};

export const navigateTo = (path) => {
  const normalized = normalizePath(path);
  window.location.hash = `#${normalized}`;
};

export const useHashPath = () => {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const onHashChange = () => setPath(getCurrentPath());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return path;
};
