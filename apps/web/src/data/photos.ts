import type { Manifest } from '../types/photos';

export const getManifest = async (): Promise<Manifest> => {
  const response = await fetch('/api/photos/manifest');
  if (!response.ok) {
    throw new Error('Failed to fetch photo manifest');
  }
  return response.json();
};
