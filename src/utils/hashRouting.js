import { useEffect, useState } from 'react';

const BASENAME = '/pros-mip6';

const normalizePath = (path) => {
  if (!path) return '/';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized;
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
    const syncPath = () => setPath(getCurrentPath());
    window.addEventListener('hashchange', syncPath);
    window.addEventListener('popstate', syncPath);

    return () => {
      window.removeEventListener('hashchange', syncPath);
      window.removeEventListener('popstate', syncPath);
    };
  }, []);

  return path;
};
