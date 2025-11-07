export interface ContentPart {
  id: string;
  title: string;
  adUrl: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  parts: ContentPart[];
}

export interface Category {
  id: string;
  title: string;
  emoji: string;
  books: Book[];
}

export interface AdSettings {
  url: string;
  duration: number; // in seconds
}

export interface DeveloperInfo {
  name: string;
  email: string;
  copyright: string;
}

export interface PromotionalAd {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  linkUrl: string;
}

export interface GistSyncSettings {
  rawUrl: string;
  token: string;
}

export interface AppSettings {
  siteName: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    cardBg: string;
  };
  ad: AdSettings;
  developer: DeveloperInfo;
  categories: Category[];
  promotionalAds: PromotionalAd[];
  about: {
    title: string;
    content: string;
  };
  gistSync: GistSyncSettings;
}
