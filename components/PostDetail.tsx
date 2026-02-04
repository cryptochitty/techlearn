
import React, { useEffect } from 'react';
import { Post } from '../types';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
  // Advanced AI SEO Meta Management
  useEffect(() => {
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.getAttribute('content') || '';

    document.title = `${post.title} | techlearn.`;
    if (metaDescription && post.metaDescription) {
      metaDescription.setAttribute('content', post.metaDescription);
    }

    return () => {
      document.title = originalTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
    };
  }, [post]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-400 mb-8 transition-colors group lowercase font-bold"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        back to insights
      </button>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-600/10 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-full border border-indigo-500/20 uppercase tracking-[0.2em]">
            {post.category}
          </span>
          <span className="text-gray-700 text-[10px] font-black uppercase tracking-widest">
            {new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter text-white">
          {post.title}
        </h1>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">AI</div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-gray-200 uppercase tracking-widest">Autonomous Analyst</span>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">techlearn core engine</span>
          </div>
        </div>
      </header>

      <div className="relative mb-12 group">
        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full aspect-[21/9] object-cover rounded-[2.5rem] shadow-2xl border border-gray-800 relative z-10" 
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="prose prose-invert prose-indigo prose-lg">
          <p className="text-2xl text-gray-300 leading-relaxed font-light mb-12 italic border-l-4 border-indigo-600 pl-8 py-2">
            {post.excerpt}
          </p>
          <div className="text-gray-400 space-y-8 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {post.groundingUrls && post.groundingUrls.length > 0 && (
          <div className="mt-16 p-8 bg-gray-900/50 border border-gray-800 rounded-3xl">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Verified Citations</h4>
            <div className="flex flex-col gap-4">
              {post.groundingUrls.map((url, i) => (
                <a 
                  key={i} 
                  href={url.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-2xl hover:border-indigo-500/50 transition-all group"
                >
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white line-clamp-1">{url.title}</span>
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 flex flex-wrap gap-3">
          {post.metaKeywords?.split(',').map((kw, i) => (
            <span key={i} className="text-[10px] font-black text-gray-600 bg-gray-900 border border-gray-800 px-4 py-1.5 rounded-full uppercase tracking-[0.15em] hover:text-indigo-400 hover:border-indigo-400 transition-all cursor-default">
              #{kw.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
