'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=3&page=1&sparkline=false'
        );
        const result = await response.json();
        const dataArray = Array.isArray(result) ? result : Object.values(result);
        console.log('Datos en el Ticker:', dataArray);
        
        if (dataArray.length > 0) {
          setData(dataArray);
        } else {
          setData(fallbackData);
        }
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-[73px] left-0 right-0 z-50 w-full py-3 px-4 bg-zinc-900/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 md:gap-10 overflow-x-auto">
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
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
