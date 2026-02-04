
import { Post, Ad, AppSettings } from '../types';
import { INITIAL_POSTS, INITIAL_ADS } from '../constants';

const POSTS_KEY = 'techlearn_posts';
const ADS_KEY = 'techlearn_ads';
const AUTH_KEY = 'techlearn_auth';
const SETTINGS_KEY = 'techlearn_settings';
const LAST_AUTO_UPDATE_KEY = 'techlearn_last_auto_update';

const DEFAULT_SETTINGS: AppSettings = {
  adSenseClientId: 'pub-9388637648234484',
  adSenseEnabled: true
};

const safeGet = (key: string, defaultValue: any) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.warn(`Storage read error for ${key}:`, e);
    return defaultValue;
  }
};

const safeSet = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Storage write error for ${key}:`, e);
  }
};

export const storage = {
  getPosts: (): Post[] => {
    const posts = safeGet(POSTS_KEY, null);
    if (!posts) {
      safeSet(POSTS_KEY, INITIAL_POSTS);
      return INITIAL_POSTS;
    }
    return posts;
  },
  savePosts: (posts: Post[]) => safeSet(POSTS_KEY, posts),
  getAds: (): Ad[] => {
    const ads = safeGet(ADS_KEY, null);
    if (!ads) {
      safeSet(ADS_KEY, INITIAL_ADS);
      return INITIAL_ADS;
    }
    return ads;
  },
  saveAds: (ads: Ad[]) => safeSet(ADS_KEY, ads),
  getSettings: (): AppSettings => safeGet(SETTINGS_KEY, DEFAULT_SETTINGS),
  saveSettings: (settings: AppSettings) => safeSet(SETTINGS_KEY, settings),
  setAuth: (isLoggedIn: boolean) => safeSet(AUTH_KEY, isLoggedIn),
  getAuth: (): boolean => safeGet(AUTH_KEY, false),
  getLastAutoUpdate: (): number => safeGet(LAST_AUTO_UPDATE_KEY, 0),
  setLastAutoUpdate: (timestamp: number) => safeSet(LAST_AUTO_UPDATE_KEY, timestamp)
};
