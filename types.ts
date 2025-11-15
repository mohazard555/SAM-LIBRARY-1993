export interface ContentPart {
  id: string;
  title: string;
  watchUrl?: string;
  adUrl: string;
  adDuration?: number;
  content: string;
}

export interface Book {
  id:string;
  title: string;
  author: string;
  coverColor: string;
  parts: ContentPart[];
  clickCount?: number;
}

export interface Category {
  id: string;
  title: string;
  emoji: string;
  books: Book[];
}

export interface AdSettings {
  url: string; // Kept for fallback compatibility
  duration: number; // in seconds
  urlList?: string[];
  youtubeUrls?: string[];
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
  siteLogoUrl: string;
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