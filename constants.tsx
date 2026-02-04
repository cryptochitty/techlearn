
import React from 'react';

export const CATEGORIES = [
  'Artificial Intelligence', 
  'Crypto & Web3', 
  'Software Development', 
  'Cloud Computing', 
  'Hardware & Gadgets', 
  'Cybersecurity', 
  'Future Tech', 
  'Tutorials'
];

export const INITIAL_POSTS = [
  {
    id: '1',
    title: 'The Evolution of Large Language Models in 2025',
    slug: 'evolution-llm-2025',
    excerpt: 'Beyond chat interfaces: How agentic workflows are reshaping software development and automation.',
    content: 'Large Language Models (LLMs) have moved past the initial hype phase. In 2025, we are seeing the rise of agentic AI—systems that dont just answer questions but execute complex workflows. This shift is fundamentally changing how we approach software architecture and human-computer interaction.',
    category: 'Artificial Intelligence',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=400',
    published: true,
    createdAt: Date.now() - 86400000 * 2,
    author: 'Admin'
  },
  {
    id: '2',
    title: 'Quantum Computing: Crossing the Utility Threshold',
    slug: 'quantum-computing-utility',
    excerpt: 'How recent breakthroughs in error correction are bringing us closer to practical quantum advantage.',
    content: 'For years, quantum computing was relegated to laboratory experiments. However, new developments in logical qubits and error correction codes have significantly lowered the barrier to entry. We are now entering an era where quantum-classical hybrid systems can solve real-world optimization problems.',
    category: 'Future Tech',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800&h=400',
    published: true,
    createdAt: Date.now() - 86400000,
    author: 'Admin'
  },
  {
    id: '3',
    title: 'The Rise of Distributed Systems in Cloud Infrastructure',
    slug: 'distributed-systems-cloud',
    excerpt: 'Why Software Development is shifting towards serverless edge computing in 2025.',
    content: 'In the modern landscape of Software Development, the focus has shifted from monolithic architectures to highly distributed, edge-computing based systems. This transition is driven by the need for low-latency responses and global scalability.',
    category: 'Software Development',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800&h=400',
    published: true,
    createdAt: Date.now() - 86400000 * 3,
    author: 'Admin'
  }
];

export const INITIAL_ADS = [
  {
    id: 'ad1',
    title: 'Premium Cloud Hosting',
    image: 'https://picsum.photos/seed/ads1/1200/200',
    link: 'https://vercel.com',
    position: 'header' as const,
    active: true
  },
  {
    id: 'ad2',
    title: 'Master AI Engineering',
    image: 'https://picsum.photos/seed/ads2/400/600',
    link: 'https://deeplearning.ai',
    position: 'sidebar' as const,
    active: true
  }
];
