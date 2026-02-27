'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import CryptoTracker from '@/components/CryptoTracker';

const InteractiveParticles = dynamic(() => import('@/components/InteractiveParticles'), {
  ssr: false,
});

const translations = {
  es: {
    heroTitle: 'ARCHITECTING THE',
    heroGradient: 'DECENTRALIZED FUTURE.',
    heroSubtitle: 'Desarrollador especializado en soluciones descentralizadas e inteligencia artificial.',
    navServices: 'Servicios',
    navPlayground: 'Laboratorio',
    ctaPrimary: 'Ver Proyectos',
    ctaSecondary: 'Hablemos',
    servicesTitle: 'Servicios',
    playgroundTitle: 'Technical Laboratory',
    playgroundSubtitle: 'Experimentos con IA y Web3. Demostraciones de agentes inteligentes.',
    launchButton: 'Launch AI Agent Demo',
    connectWallet: 'Connect Wallet',
  },
  en: {
    heroTitle: 'ARCHITECTING THE',
    heroGradient: 'DECENTRALIZED FUTURE.',
    heroSubtitle: 'Developer specialized in decentralized solutions and artificial intelligence.',
    navServices: 'Services',
    navPlayground: 'Lab',
    ctaPrimary: 'View Projects',
    ctaSecondary: "Let's Talk",
    servicesTitle: 'Services',
    playgroundTitle: 'Technical Laboratory',
    playgroundSubtitle: 'Experiments with AI and Web3. Intelligent agent demonstrations.',
    launchButton: 'Launch AI Agent Demo',
    connectWallet: 'Connect Wallet',
  },
};

const services = [
  { title: 'Smart Contract Auditing', description: 'Security analysis and vulnerability detection for Solidity contracts', icon: '🛡️', colSpan: 'lg:col-span-2' },
  { title: 'dApp Development', description: 'Decentralized applications with Next.js and Ethers.js', icon: '⚡', colSpan: 'lg:col-span-1' },
  { title: 'Tokenomics Design', description: 'Economic models and token distribution strategies', icon: '📊', colSpan: 'lg:col-span-1' },
  { title: 'AI x Web3 Integration', description: 'Intelligent automation using LLMs and blockchain', icon: '🤖', colSpan: 'lg:col-span-2' },
];

export default function Home() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const t = translations[lang];

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 font-sans">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial_gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-emerald-500/10 blur-[120px] pointer-events-none" />
        <InteractiveParticles />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex flex-wrap justify-between items-center p-4 md:p-6 max-w-7xl mx-auto gap-4">
          <div className="text-xl font-black tracking-tighter italic">MIGUEL<span className="text-cyan-400 font-bold">.DEV</span></div>
          <div className="flex items-center gap-2 md:gap-4">
            <a href="#services" className="px-3 md:px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
              {t.navServices}
            </a>
            <a href="#playground" className="px-3 md:px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
              {t.navPlayground}
            </a>
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all"
            >
              {lang.toUpperCase()}
            </button>
            <button className="bg-white text-black px-4 md:px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)]">
              {t.connectWallet}
            </button>
          </div>
        </div>
      </nav>

      <CryptoTracker lang={lang} />

      <section id="hero" className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-24">
        <div className="mb-4 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/60 border border-white/10 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-zinc-400 font-mono">Gas: 15 gwei</span>
          <span className="text-zinc-600">|</span>
          <span className="text-xs text-zinc-400 font-mono">ETH: $3,200</span>
        </div>
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-tight">
            {t.heroTitle} <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400">
              {t.heroGradient}
            </span>
          </h1>
          <p className="text-zinc-400 text-xl md:text-2xl max-w-2xl leading-relaxed mb-10">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#services" className="inline-block bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 px-8 py-4 rounded-2xl font-bold transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              {t.ctaPrimary}
            </a>
            <button className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 px-8 py-4 rounded-2xl font-bold transition-all">
              {t.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      <section id="services" className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8"
        >
          {t.servicesTitle}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${service.colSpan} group relative p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]`}
            >
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-zinc-400 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="playground" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/10 p-12 md:p-20"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                BETA
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-4">{t.playgroundTitle}</h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
                {t.playgroundSubtitle}
              </p>
              <button className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]">
                <span>🚀</span>
                {t.launchButton}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
