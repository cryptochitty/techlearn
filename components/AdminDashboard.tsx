
import React, { useState } from 'react';
import { Post, Ad, View, AppSettings } from '../types';
import { CATEGORIES } from '../constants';
import { storage } from '../services/storage';

interface AdminDashboardProps {
  posts: Post[];
  ads: Ad[];
  onUpdatePosts: (posts: Post[]) => void;
  onUpdateAds: (ads: Ad[]) => void;
  onLogout: () => void;
  onNavigate: (view: View, params?: any) => void;
  lastAutoUpdate: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  posts, ads, onUpdatePosts, onUpdateAds, onLogout, onNavigate, lastAutoUpdate
}) => {
  const [tab, setTab] = useState<'posts' | 'ads' | 'settings'>('posts');
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [editingAd, setEditingAd] = useState<Partial<Ad> | null>(null);
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title) return;
    
    const newPost: Post = {
      id: editingPost.id || Math.random().toString(36).substr(2, 9),
      title: editingPost.title || 'Untitled',
      slug: editingPost.slug || (editingPost.title || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      excerpt: editingPost.excerpt || '',
      content: editingPost.content || '',
      category: editingPost.category || 'Future Tech',
      coverImage: editingPost.coverImage || `https://picsum.photos/seed/${Math.random()}/800/400`,
      published: editingPost.published ?? true,
      createdAt: editingPost.createdAt || Date.now(),
      author: editingPost.author || 'Admin',
      metaDescription: editingPost.metaDescription || '',
      metaKeywords: editingPost.metaKeywords || '',
      groundingUrls: editingPost.groundingUrls || []
    };

    if (editingPost.id) {
      onUpdatePosts(posts.map(p => p.id === newPost.id ? newPost : p));
    } else {
      onUpdatePosts([newPost, ...posts]);
    }
    setEditingPost(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveSettings(settings);
    alert("Settings synchronized successfully.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900/40 p-6 rounded-[2rem] border border-gray-800 gap-4">
        <div className="flex gap-2">
          {(['posts', 'ads', 'settings'] as const).map(t => (
            <button 
              key={t} onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <button onClick={onLogout} className="px-6 py-2 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-red-500 hover:text-white transition-all">Logout</button>
      </div>

      {tab === 'posts' && (
        <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Inventory</h3>
            <button onClick={() => setEditingPost({})} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white">Create New</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800/20 border-b border-gray-800">
                  <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Article</th>
                  <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Status</th>
                  <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-800/10 transition-colors">
                    <td className="p-6">
                      <div className="font-bold text-white mb-1">{post.title}</div>
                      <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{post.category}</div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${post.published ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                        {post.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-6 text-right space-x-2">
                      <button 
                        onClick={() => setEditingPost(post)} 
                        className="px-4 py-1.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => { if(confirm('Are you sure?')) onUpdatePosts(posts.filter(p => p.id !== post.id)) }} 
                        className="px-4 py-1.5 bg-red-600/10 text-red-500 border border-red-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-10 max-w-2xl">
           <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8">System Configuration</h3>
           <form onSubmit={handleSaveSettings} className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">AdSense Publisher ID</label>
                <input 
                  type="text" 
                  value={settings.adSenseClientId} 
                  onChange={e => setSettings({...settings, adSenseClientId: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white font-bold" 
                  placeholder="pub-xxxxxxxxxxxxxxxx"
                />
             </div>
             <div className="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  checked={settings.adSenseEnabled} 
                  onChange={e => setSettings({...settings, adSenseEnabled: e.target.checked})}
                  className="w-5 h-5 accent-indigo-600"
                />
                <span className="text-sm font-bold text-gray-300">Enable AdSense Units</span>
             </div>
             <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Save Config</button>
           </form>
        </div>
      )}

      {editingPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setEditingPost(null)}></div>
          <div className="relative bg-gray-900 border border-gray-800 rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 border-b border-gray-800 flex justify-between items-center">
              <h4 className="text-xl font-black text-white lowercase">Edit Content & SEO</h4>
              <button onClick={() => setEditingPost(null)} className="text-gray-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </button>
            </div>
            <form onSubmit={handleSavePost} className="p-8 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Article Title</label>
                  <input type="text" className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white font-bold" value={editingPost.title || ''} onChange={e => setEditingPost({...editingPost, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sector</label>
                  <select className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white font-bold" value={editingPost.category || ''} onChange={e => setEditingPost({...editingPost, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Main Body (Markdown)</label>
                <textarea rows={10} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-gray-300 font-medium leading-relaxed" value={editingPost.content || ''} onChange={e => setEditingPost({...editingPost, content: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Verified Citations (JSON grounding data)</label>
                <textarea rows={3} placeholder='[{"uri": "...", "title": "..."}]' className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-indigo-400 font-mono text-xs" value={JSON.stringify(editingPost.groundingUrls || [])} onChange={e => { try { setEditingPost({...editingPost, groundingUrls: JSON.parse(e.target.value)}); } catch(e){} }} />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black text-white uppercase tracking-widest text-xs">Commit Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
