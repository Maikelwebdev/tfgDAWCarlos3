'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const cryptoIds = ['bitcoin', 'ethereum', 'solana'];

const cryptoLogos: Record<string, string> = {
  bitcoin: '₿',
  ethereum: 'Ξ',
  solana: '◎',
};

const cryptoSymbols: Record<string, string> = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  solana: 'SOL',
};

interface CryptoTrackerProps {
  lang: 'es' | 'en';
}

const fallbackData: CryptoData[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 90000, price_change_percentage_24h: 2.5 },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 2500, price_change_percentage_24h: 1.8 },
  { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 180, price_change_percentage_24h: -0.5 },
];

export default function CryptoTracker({ lang }: CryptoTrackerProps) {
  const [data, setData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=3&page=1&sparkline=false'
        );

        if (!response.ok) {
          if (response.status === 429) {
            setError(lang === 'es' ? 'Rate limit. Usando datos de respaldo.' : 'Rate limit. Using fallback data.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (isCancelled) return;
        
        const dataArray = Array.isArray(result) ? result : Object.values(result);
        
        if (dataArray.length > 0) {
          setData(dataArray);
          setIsUsingFallback(false);
        } else {
          setData(fallbackData);
          setIsUsingFallback(true);
        }
      } catch (error) {
        if (isCancelled) return;
        console.error('Error fetching crypto data:', error);
        setData(fallbackData);
        setIsUsingFallback(true);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  const displayData = loading || !data.length ? fallbackData : data.filter(c => c && c.id && c.current_price !== undefined);

  if (!isMounted) {
    return (
      <div className="fixed top-[73px] left-0 right-0 z-50 w-full py-3 px-4 bg-zinc-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 md:gap-10">
          <span className="text-white text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const isLoggedIn = status === 'authenticated' && session;

  if (!isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-[73px] left-0 right-0 z-50 w-full py-3 px-4 bg-zinc-900/80 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 md:gap-10 overflow-x-auto">
          <div className="flex items-center gap-2 mr-2">
            <div className="w-2 h-2 rounded-full bg-zinc-500" />
            <span className="text-xs font-medium text-zinc-500">
              OFFLINE
            </span>
          </div>
          <div className="relative flex items-center gap-2 whitespace-nowrap blur-[8px] select-none opacity-50">
            <span className="text-white font-bold text-lg">₿</span>
            <span className="text-white font-medium text-sm">BTC</span>
            <span className="text-white font-mono">$**,***</span>
            <span className="text-white text-xs">↑ *.**%</span>
          </div>
          <div className="relative flex items-center gap-2 whitespace-nowrap blur-[8px] select-none opacity-50">
            <span className="text-white font-bold text-lg">Ξ</span>
            <span className="text-white font-medium text-sm">ETH</span>
            <span className="text-white font-mono">$*,***</span>
            <span className="text-white text-xs">↑ *.**%</span>
          </div>
          <div className="relative flex items-center gap-2 whitespace-nowrap blur-[8px] select-none opacity-50">
            <span className="text-white font-bold text-lg">◎</span>
            <span className="text-white font-medium text-sm">SOL</span>
            <span className="text-white font-mono">$***</span>
            <span className="text-white text-xs">↓ *.**%</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm">
            <div className="flex items-center gap-3 px-6 py-3 bg-zinc-800/90 rounded-xl border border-white/10 shadow-xl">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-white text-sm font-medium">
                Contenido exclusivo. Inicia sesión para ver datos en tiempo real.
              </span>
              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="ml-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-sm font-bold rounded-lg transition-all"
              >
                {lang === 'es' ? 'Entrar' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-[73px] left-0 right-0 z-50 w-full py-3 px-4 bg-zinc-900/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 md:gap-10 overflow-x-auto">
        {error && (
          <div className="mr-4 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
            <span className="text-amber-400 text-xs">{error}</span>
          </div>
        )}
        <div className="flex items-center gap-2 mr-2">
          <div className={`w-2 h-2 rounded-full ${isUsingFallback ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
          <span className={`text-xs font-medium ${isUsingFallback ? 'text-amber-500' : 'text-emerald-500'}`}>
            {isUsingFallback ? 'ESTIMATED' : 'LIVE'}
          </span>
        </div>
        {displayData.map((crypto) => {
          const isPositive = (crypto.price_change_percentage_24h ?? 0) >= 0;
          const price = crypto.current_price ?? 0;
          const change = crypto.price_change_percentage_24h ?? 0;
          return (
            <motion.div
              key={crypto.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <span className="text-white font-bold text-lg">{cryptoLogos[crypto.id]}</span>
              <span className="text-white font-medium text-sm">{cryptoSymbols[crypto.id]}</span>
              <span className="text-white font-mono">
                {price != null ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
              </span>
              <span className={`text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export { cryptoSymbols };
