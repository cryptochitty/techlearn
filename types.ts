
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage: string;
  published: boolean;
  createdAt: number;
  author: string;
  metaDescription?: string;
  metaKeywords?: string;
  groundingUrls?: { uri: string; title: string }[];
}

export interface Ad {
  id: string;
  title: string;
  image: string;
  link: string;
  position: 'header' | 'sidebar' | 'footer' | 'in-post';
  active: boolean;
  isAdSense?: boolean;
}

export interface AppSettings {
  adSenseClientId: string;
  adSenseEnabled: boolean;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  category: 'crypto' | 'stock' | 'commodity';
}

export type View = 'home' | 'post' | 'admin' | 'login' | 'ai' | 'dev' | 'future';
