export type Photo = {
  filename: string;
  url: string;
  width: number;
  height: number;
  title?: string;
};

export type SubAlbum = {
  name: string;
  slug: string;
  coverUrl: string;
  photoCount: number;
  photos: Photo[];
};

export type Album = {
  name: string;
  slug: string;
  coverUrl: string;
  photoCount: number;
  subAlbums: SubAlbum[];
};

export type Manifest = {
  generated: string;
  albums: Album[];
};
