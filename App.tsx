
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
  const [isLoggedIn, setIsLoggedIn] = useState(storage.getAuth());
  const [posts, setPosts] = useState<Post[]>(storage.getPosts());
  const [ads, setAds] = useState<Ad[]>(storage.getAds());
  const [lastAutoUpdate, setLastAutoUpdate] = useState(storage.getLastAutoUpdate());

  // Google AdSense Initialization
  useEffect(() => {
    const settings = storage.getSettings();
    if (settings.adSenseEnabled && settings.adSenseClientId) {
      const existingScript = document.getElementById('adsense-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'adsense-script';
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adSenseClientId}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    }
  }, []);

  // Autonomous Content Loop
  useEffect(() => {
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
              author: 'AI Analyst',
              metaDescription: draft.metaDescription,
              metaKeywords: draft.metaKeywords,
              groundingUrls: draft.groundingUrls
            };
            const updatedPosts = [newPost, ...storage.getPosts()];
            storage.savePosts(updatedPosts);
            setPosts(updatedPosts);
            storage.setLastAutoUpdate(now);
            setLastAutoUpdate(now);
          }
        } catch (error) {
          console.error("AI Generation failed:", error);
        }
      }
    };
    runAutoPilot();
  }, [lastAutoUpdate]);

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

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="border-b border-gray-900 pb-10">
          <h1 className="text-6xl font-black lowercase tracking-tighter text-white mb-2">
            {title}<span className="text-indigo-600">.</span>
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
                className="group cursor-pointer bg-gray-900/30 border border-gray-800 rounded-[3rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-500"
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
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-3">{new Date(post.createdAt).toDateString()}</span>
                  <h2 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight mb-4">{post.title}</h2>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-gray-900/20 border border-gray-800 rounded-[3rem]">
            <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">No entries found in the {title} archives.</p>
          </div>
        )}
      </div>
    );
  };

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

      <footer className="bg-black border-t border-gray-900 py-16 mt-20 text-center md:text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-sm">t</div>
              <span className="text-xl font-black text-white">techlearn<span className="text-indigo-600">.</span></span>
            </div>
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em]">Global Singularity Monitoring</p>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
             <button onClick={() => handleNavigate('home')} className="hover:text-indigo-400">Index</button>
             <button onClick={() => handleNavigate('ai')} className="hover:text-indigo-400">Neural</button>
             <button onClick={() => handleNavigate('dev')} className="hover:text-indigo-400">Syntax</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
