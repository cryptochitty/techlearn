
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  onNavigate: (view: View, params?: any) => void;
  isLoggedIn: boolean;
  activeView: View;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, isLoggedIn, activeView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">t</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white lowercase">
                techlearn<span className="text-indigo-500">.</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-black uppercase tracking-widest">
            <button 
              onClick={() => onNavigate('home')} 
              className={`transition-colors ${activeView === 'home' ? 'text-indigo-400' : 'text-gray-500 hover:text-indigo-400'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('ai')} 
              className={`transition-colors ${activeView === 'ai' ? 'text-indigo-400' : 'text-gray-500 hover:text-indigo-400'}`}
            >
              AI
            </button>
            <button 
              onClick={() => onNavigate('dev')} 
              className={`transition-colors ${activeView === 'dev' ? 'text-indigo-400' : 'text-gray-500 hover:text-indigo-400'}`}
            >
              Dev
            </button>
            <button 
              onClick={() => onNavigate('future')} 
              className={`transition-colors ${activeView === 'future' ? 'text-indigo-400' : 'text-gray-500 hover:text-indigo-400'}`}
            >
              Future
            </button>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={() => onNavigate('admin')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}`}
              >
                Admin Panel
              </button>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
