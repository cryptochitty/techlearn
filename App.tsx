
import React, { useState, useEffect, useCallback } from 'react';
import { Post, Ad, View } from './types';
import { storage } from './services/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AdBanner } from './components/AdBanner';
import { AdminDashboard } from './components/AdminDashboard';
import { PostDetail } from './components/PostDetail';
import { generateDraft } from './services/gemini';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [lastAutoUpdate, setLastAutoUpdate] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Robust boot sequence
  useEffect(() => {
    const init = () => {
      try {
        const p = storage.getPosts();
        const a = storage.getAds();
        const auth = storage.getAuth();
        const update = storage.getLastAutoUpdate();
        
        setPosts(p || []);
        setAds(a || []);
        setIsLoggedIn(auth || false);
        setLastAutoUpdate(update || 0);
        setIsInitialized(true);
      } catch (err) {
        console.error("Critical storage failure:", err);
        setIsInitialized(true);
      }
    };
    init();
  }, []);

  // AI Content Loop
  useEffect(() => {
    if (!isInitialized || posts.length === 0) return;
    
    const runAutoPilot = async () => {
      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000;
      if (now - lastAutoUpdate >= ONE_DAY) {
        try {
          const draft = await generateDraft();
          if (draft) {
            const newPost: Post = {
              id: Math.random().toString(36).substr(2, 9),
              title: draft.title,
              slug: draft.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
              excerpt: draft.excerpt,
              content: draft.content,
              category: draft.category || 'Future Tech',
              coverImage: `https://picsum.photos/seed/${Math.random()}/1200/600`,
              published: true,
              createdAt: now,
              author: 'AI Specialist',
              groundingUrls: draft.groundingUrls
            };
            const updated = [newPost, ...storage.getPosts()];
            storage.savePosts(updated);
            setPosts(updated);
            storage.setLastAutoUpdate(now);
            setLastAutoUpdate(now);
          }
        } catch (error) {
          console.error("AI Generation failed:", error);
        }
      }
    };
    runAutoPilot();
  }, [isInitialized, lastAutoUpdate, posts.length]);

  const handleNavigate = useCallback((newView: View, params?: any) => {
    if (newView === 'post' && params?.post) {
      setCurrentPost(params.post);
    } else {
      setCurrentPost(null);
    }
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    storage.setAuth(true);
    setIsLoggedIn(true);
    setView('admin');
  };

  const handleLogout = () => {
    storage.setAuth(false);
    setIsLoggedIn(false);
    setView('home');
  };

  const updatePosts = (newPosts: Post[]) => {
    storage.savePosts(newPosts);
    setPosts(newPosts);
  };

  const updateAds = (newAds: Ad[]) => {
    storage.saveAds(newAds);
    setAds(newAds);
  };

  const renderPostFeed = (title: string, tag: string, categoryFilter?: string) => {
    const filtered = categoryFilter 
      ? posts.filter(p => p.published && p.category === categoryFilter)
      : posts.filter(p => p.published);

    // Static mapping for theme colors to ensure Tailwind CDN detects them
    const themeStyles = {
      neural: 'text-indigo-600 group-hover:text-indigo-400 border-indigo-500/30',
      syntax: 'text-emerald-600 group-hover:text-emerald-400 border-emerald-500/30',
      beyond: 'text-purple-600 group-hover:text-purple-400 border-purple-500/30',
      horizon: 'text-indigo-600 group-hover:text-indigo-400 border-indigo-500/30'
    }[title] || 'text-indigo-600 group-hover:text-indigo-400 border-indigo-500/30';

    const accentColor = themeStyles.split(' ')[0];

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="border-b border-gray-900 pb-10">
          <h1 className="text-6xl font-black lowercase tracking-tighter text-white mb-2">
            {title}<span className={accentColor}>.</span>
          </h1>
          <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px]">
            {tag}
          </p>
        </div>
        
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filtered.map(post => (
              <article 
                key={post.id} 
                className={`group cursor-pointer bg-gray-900/30 border border-gray-800 rounded-[3rem] overflow-hidden hover:border-gray-700 transition-all duration-500`}
                onClick={() => handleNavigate('post', { post })}
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-10">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-3">
                    {new Date(post.createdAt).toDateString()}
                  </span>
                  <h2 className={`text-2xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight mb-4`}>
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-gray-900/10 border border-dashed border-gray-800 rounded-[3rem]">
            <p className="text-gray-600 font-black uppercase tracking-widest text-xs">Repository empty.</p>
          </div>
        )}
      </div>
    );
  };

  if (!isInitialized) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="font-black text-white tracking-widest uppercase text-[10px]">Syncing Terminal...</div>
      </div>
    </div>
  );

  const headerAd = ads.find(a => a.position === 'header' && a.active);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-indigo-500/30">
      <Navbar onNavigate={handleNavigate} isLoggedIn={isLoggedIn} activeView={view} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {headerAd && <AdBanner ad={headerAd} className="mb-12" />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {view === 'home' && renderPostFeed('horizon', 'Autonomous insight engine')}
            {view === 'ai' && renderPostFeed('neural', 'AI & Neural Architectures', 'Artificial Intelligence')}
            {view === 'dev' && renderPostFeed('syntax', 'Modern Software Protocols', 'Software Development')}
            {view === 'future' && renderPostFeed('beyond', 'Frontier Technologies', 'Future Tech')}

            {view === 'post' && currentPost && (
              <PostDetail post={currentPost} onBack={() => handleNavigate('home')} />
            )}

            {view === 'login' && (
              <div className="max-w-md mx-auto pt-24">
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                  <h2 className="text-3xl font-black mb-10 text-center lowercase tracking-tighter text-white">admin<span className="text-indigo-600">.</span>access</h2>
                  <form onSubmit={handleLogin} className="space-y-6">
                    <input type="email" placeholder="Operator ID" className="w-full bg-black border border-gray-800 rounded-2xl px-6 py-4 outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-white font-bold" />
                    <input type="password" placeholder="Access Key" className="w-full bg-black border border-gray-800 rounded-2xl px-6 py-4 outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-white font-bold" />
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs">Login</button>
                  </form>
                </div>
              </div>
            )}

            {view === 'admin' && isLoggedIn && (
              <AdminDashboard 
                posts={posts} ads={ads} onUpdatePosts={updatePosts} onUpdateAds={updateAds}
                onLogout={handleLogout} onNavigate={handleNavigate} lastAutoUpdate={lastAutoUpdate}
              />
            )}
          </div>

          <div className="lg:col-span-4">
            <Sidebar ads={ads} />
          </div>
        </div>
      </main>

      <footer className="bg-black border-t border-gray-900 py-20 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div>
              <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-sm">t</div>
                <span className="text-xl font-black text-white">techlearn<span className="text-indigo-600">.</span></span>
              </div>
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em]">Global Singularity Monitoring</p>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500 flex-wrap justify-center">
               <button onClick={() => handleNavigate('home')} className="hover:text-white transition-colors">Horizon</button>
               <button onClick={() => handleNavigate('ai')} className="hover:text-white transition-colors">Neural</button>
               <button onClick={() => handleNavigate('dev')} className="hover:text-white transition-colors">Syntax</button>
               <button onClick={() => handleNavigate('future')} className="hover:text-white transition-colors">Beyond</button>
               {isLoggedIn ? (
                 <button onClick={() => handleNavigate('admin')} className="text-indigo-400">Dashboard</button>
               ) : (
                 <button onClick={() => handleNavigate('login')} className="hover:text-white transition-colors">Access</button>
               )}
            </div>
          </div>
          <div className="mt-16 text-center text-[9px] font-bold text-gray-800 uppercase tracking-[0.8em]">
            &copy; {new Date().getFullYear()} TECHLEARN SYSTEMS CORP
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
