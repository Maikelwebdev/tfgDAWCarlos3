'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import CryptoTracker from '@/components/CryptoTracker';
import Navbar from '@/components/Navbar';
import CryptoSearch from '@/components/CryptoSearch';
import PriceChart from '@/components/PriceChart';
import Footer from '@/components/layout/Footer';
import Laboratory from '@/components/Laboratory';

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
    searchPlaceholder: 'Herramientas de Análisis',
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
    searchPlaceholder: 'Analysis Tools',
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
  const [selectedCrypto, setSelectedCrypto] = useState<string>('bitcoin');
  const t = translations[lang];

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 font-sans">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 via-purple-950/20 to-emerald-950/30" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial_gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-emerald-500/10 blur-[120px] pointer-events-none" />
        <InteractiveParticles />
      </div>

      <Navbar lang={lang} onLangChange={setLang} />

      <CryptoTracker lang={lang} />

      <section id="hero" className="relative z-10 max-w-7xl mx-auto px-8 pt-40 pb-24">
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
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 via-transparent to-emerald-950/10 pointer-events-none" />
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8"
        >
          {t.servicesTitle}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
            className="lg:col-span-2 group relative p-8 rounded-3xl bg-zinc-900/20 border border-white/10 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />
            <div className="relative text-5xl mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">🛡️</div>
            <h3 className="text-2xl font-bold text-white mb-2">{services[0].title}</h3>
            <p className="text-zinc-400">{services[0].description}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative p-6 rounded-3xl bg-zinc-900/20 border border-white/10 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />
            <div className="relative text-4xl mb-4 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">⚡</div>
            <h3 className="text-lg font-bold text-white mb-2">{services[1].title}</h3>
            <p className="text-zinc-400 text-sm">{services[1].description}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative p-6 rounded-3xl bg-zinc-900/20 border border-white/10 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />
            <div className="relative text-4xl mb-4 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]">📊</div>
            <h3 className="text-lg font-bold text-white mb-2">{services[2].title}</h3>
            <p className="text-zinc-400 text-sm">{services[2].description}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 group relative p-8 rounded-3xl bg-zinc-900/20 border border-white/10 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />
            <div className="relative text-5xl mb-4 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-2">{services[3].title}</h3>
            <p className="text-zinc-400">{services[3].description}</p>
          </motion.div>
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
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-purple-500/5 to-emerald-500/5 pointer-events-none" />
            
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
              
              <div className="mt-12">
                <Laboratory />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="tools" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            {t.searchPlaceholder}
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-sm">
              <CryptoSearch lang={lang} onSelect={setSelectedCrypto} />
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-sm">
              <PriceChart key={selectedCrypto} cryptoId={selectedCrypto} lang={lang} />
            </div>
          </div>
        </div>
        </section>

      <Footer />
    </main>
  );
}
