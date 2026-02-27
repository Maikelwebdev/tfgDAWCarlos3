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

export default function CryptoTracker({ lang }: CryptoTrackerProps) {
  const [data, setData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=3&page=1&sparkline=false'
        );
        const result = await response.json();
        const dataArray = Array.isArray(result) ? result : Object.values(result);
        setData(dataArray);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-3 px-4 bg-white/5 backdrop-blur-md border-y border-white/5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 md:gap-10 overflow-x-auto">
        {loading || !data.length ? (
          <span className="text-zinc-500 text-sm">Loading prices...</span>
        ) : (
          data.filter(c => c && c.id && c.current_price !== undefined).map((crypto) => {
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
                <span className="text-zinc-400 font-medium text-sm">{cryptoSymbols[crypto.id]}</span>
                <span className="text-white font-mono">
                  ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

export { cryptoSymbols };
