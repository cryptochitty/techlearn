
import React, { useEffect, useRef } from 'react';
import { Ad } from '../types';
import { storage } from '../services/storage';

interface AdBannerProps {
  ad: Ad | undefined;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ ad, className = "" }) => {
  const settings = storage.getSettings();
  const adInitialized = useRef(false);

  // Initialize AdSense unit only once per mount if active
  useEffect(() => {
    if (settings.adSenseEnabled && settings.adSenseClientId && !ad?.active && !adInitialized.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adInitialized.current = true;
      } catch (e) {
        console.warn("AdSense unit initialization pending or failed", e);
      }
    }
  }, [ad, settings]);

  // Priority 1: Display custom active ad campaign
  if (ad && ad.active) {
    return (
      <div className={`overflow-hidden rounded-[2.5rem] bg-gray-900 border border-gray-800 shadow-2xl ${className} group`}>
        <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block relative">
          <img 
            src={ad.image} 
            alt={ad.title} 
            className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute top-4 right-6 bg-black/60 backdrop-blur-md text-[9px] text-white px-4 py-1.5 rounded-full uppercase font-black tracking-[0.2em] border border-white/10 shadow-lg">
            Sponsorship
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </a>
      </div>
    );
  }

  // Priority 2: Fallback to Google AdSense unit if enabled
  if (settings.adSenseEnabled && settings.adSenseClientId) {
    return (
      <div className={`overflow-hidden rounded-[2.5rem] bg-gray-900/30 border border-dashed border-gray-800/60 min-h-[140px] flex flex-col items-center justify-center p-6 ${className}`}>
        <div className="text-[9px] text-gray-700 font-black uppercase tracking-[0.4em] mb-6">
          System Advertisement
        </div>
        <div className="w-full flex justify-center">
          <ins className="adsbygoogle"
               style={{ display: 'block', width: '100%', minWidth: '250px' }}
               data-ad-client={settings.adSenseClientId}
               data-ad-slot="auto"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      </div>
    );
  }

  return null;
};
