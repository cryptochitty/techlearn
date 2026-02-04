
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

export const storage = {
  getPosts: (): Post[] => {
    const data = localStorage.getItem(POSTS_KEY);
    if (!data) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(data);
  },
  savePosts: (posts: Post[]) => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },
  getAds: (): Ad[] => {
    const data = localStorage.getItem(ADS_KEY);
    if (!data) {
      localStorage.setItem(ADS_KEY, JSON.stringify(INITIAL_ADS));
      return INITIAL_ADS;
    }
    return JSON.parse(data);
  },
  saveAds: (ads: Ad[]) => {
    localStorage.setItem(ADS_KEY, JSON.stringify(ads));
  },
  getSettings: (): AppSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(data);
  },
  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
  setAuth: (isLoggedIn: boolean) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(isLoggedIn));
  },
  getAuth: (): boolean => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : false;
  },
  getLastAutoUpdate: (): number => {
    const data = localStorage.getItem(LAST_AUTO_UPDATE_KEY);
    return data ? JSON.parse(data) : 0;
  },
  setLastAutoUpdate: (timestamp: number) => {
    localStorage.setItem(LAST_AUTO_UPDATE_KEY, JSON.stringify(timestamp));
  }
};
