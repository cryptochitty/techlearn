
import React, { useState } from 'react';
import { MarketData, Ad } from '../types';
import { AdBanner } from './AdBanner';

interface SidebarProps {
  ads: Ad[];
}

export const Sidebar: React.FC<SidebarProps> = ({ ads }) => {
  const [market] = useState<MarketData[]>([
    // Crypto
    { symbol: 'BTC', name: 'Bitcoin', price: 64500.21, change24h: 2.5, category: 'crypto' },
    { symbol: 'ETH', name: 'Ethereum', price: 3450.12, change24h: -1.2, category: 'crypto' },
    // Stocks
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 124.56, change24h: 3.8, category: 'stock' },
    { symbol: 'AAPL', name: 'Apple Inc', price: 216.78, change24h: 0.45, category: 'stock' },
    { symbol: 'TSLA', name: 'Tesla, Inc', price: 248.12, change24h: -2.3, category: 'stock' },
    // Commodities
    { symbol: 'GOLD', name: 'Gold Spot', price: 2415.60, change24h: 0.15, category: 'commodity' },
    { symbol: 'WTI', name: 'Crude Oil', price: 81.45, change24h: -0.85, category: 'commodity' },
  ]);

  const sidebarAd = ads.find(a => a.position === 'sidebar' && a.active);

  const renderMarketSection = (title: string, category: MarketData['category']) => {
    const items = market.filter(m => m.category === category);
    return (
      <div className="mb-6 last:mb-0">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 px-2">
          {title}
        </h4>
        <div className="space-y-1">
          {items.map((coin) => (
            <div key={coin.symbol} className="flex justify-between items-center p-2 rounded-xl hover:bg-gray-800/50 transition-all border border-transparent hover:border-gray-800 group">
              <div className="flex flex-col">
                <span className="font-bold text-sm text-gray-200 group-hover:text-indigo-400 transition-colors">{coin.symbol}</span>
                <span className="text-[10px] text-gray-500 font-medium">{coin.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-semibold text-gray-200">
                  ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className={`text-[10px] font-bold ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <aside className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 shadow-sm backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Global Pulse
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase">Live</span>
        </h3>
        
        {renderMarketSection('Digital Assets', 'crypto')}
        <div className="h-px bg-gray-800 my-4 mx-2"></div>
        {renderMarketSection('Equities', 'stock')}
        <div className="h-px bg-gray-800 my-4 mx-2"></div>
        {renderMarketSection('Commodities', 'commodity')}
      </div>

      <AdBanner ad={sidebarAd} />

      <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        <h3 className="font-bold text-indigo-400 mb-2 relative z-10">Newsletter</h3>
        <p className="text-xs text-gray-400 mb-4 relative z-10 leading-relaxed">
          The week's most critical tech breakthroughs, summarized for busy professionals.
        </p>
        <div className="flex flex-col gap-3 relative z-10">
          <input 
            type="email" 
            placeholder="name@email.com" 
            className="bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-gray-600 transition-all"
          />
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95">
            Join the inner circle
          </button>
        </div>
      </div>
    </aside>
  );
};
