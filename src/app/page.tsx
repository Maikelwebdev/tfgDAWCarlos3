import React from 'react';
import ProjectCard from '@/components/ProjectCard';

const projects = [
  { title: 'DeFi Dashboard', description: 'Panel de análisis en tiempo real para protocolos DeFi' },
  { title: 'NFT Marketplace', description: 'Mercadoplace de NFTs con integración IPFS' },
  { title: 'DAO Governance', description: 'Sistema de gobernanza descentralizada' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent blur-[120px] pointer-events-none" />

      <nav className="relative z-10 flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="text-xl font-black tracking-tighter italic">MIGUEL<span className="text-purple-500 font-bold">.DEV</span></div>
        <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform">
          Connect Wallet
        </button>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-32">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-tight">
            CRAFTING THE <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
              NEW INTERNET.
            </span>
          </h1>
          <p className="text-zinc-400 text-xl md:text-2xl max-w-2xl leading-relaxed mb-10">
            Arquitecto de soluciones Web3, especializado en dApps de alta fidelidad y ecosistemas descentralizados.
          </p>
          <div className="flex gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]">
              Ver Proyectos
            </button>
            <button className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 px-8 py-4 rounded-2xl font-bold transition-all">
              Hablemos
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-32">
        <h2 className="text-3xl font-bold mb-8">Proyectos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
            />
          ))}
        </div>
      </section>
    </main>
  );
}