'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PriceChartProps {
  cryptoId: string;
  lang: 'es' | 'en';
}

export default function PriceChart({ cryptoId, lang }: PriceChartProps) {
  const [chartData, setChartData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=7&interval=daily`
        );
        const data = await response.json();
        const prices = data.prices?.map((p: number[]) => p[1]) || [];
        setChartData(prices);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setChartData([100, 120, 115, 130, 125, 140, 135]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [cryptoId]);

  if (!isMounted) {
    return (
      <div className="w-full h-48 bg-zinc-800/50 rounded-lg animate-pulse" />
    );
  }

  const maxPrice = Math.max(...chartData);
  const minPrice = Math.min(...chartData);
  const range = maxPrice - minPrice || 1;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">
          {lang === 'es' ? 'Gráfico de Precios (7 días)' : 'Price Chart (7 days)'}
        </h3>
        <div className="flex gap-2">
          <span className="text-zinc-400 text-sm">
            {lang === 'es' ? 'Mín' : 'Min'}: ${minPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400 text-sm">
            {lang === 'es' ? 'Máx' : 'Max'}: ${maxPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      
      {loading ? (
        <div className="h-48 bg-zinc-800/50 rounded-lg animate-pulse" />
      ) : (
        <div className="h-48 flex items-end gap-1">
          {chartData.map((price, index) => {
            const height = ((price - minPrice) / range) * 100;
            const isUp = index === 0 || price >= chartData[index - 1];
            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 5)}%` }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className={`flex-1 rounded-t-sm ${isUp ? 'bg-emerald-500/70' : 'bg-red-500/70'}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
