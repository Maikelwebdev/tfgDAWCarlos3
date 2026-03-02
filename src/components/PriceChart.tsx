'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface PriceChartProps {
  cryptoId: string;
  lang: 'es' | 'en';
}

interface ChartDataPoint {
  day: number;
  price: number;
}

export default function PriceChart({ cryptoId, lang }: PriceChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `/api/crypto?endpoint=coins/${cryptoId}/market_chart&vs_currency=usd&days=7&interval=daily`
        );

        if (!response.ok) {
          if (response.status === 429) {
            setError(lang === 'es' 
              ? 'Estamos sincronizando con la red blockchain, por favor espera un momento.' 
              : 'We are syncing with the blockchain network, please wait a moment.');
          } else {
            setError(lang === 'es' 
              ? 'Error al cargar datos del gráfico.' 
              : 'Error loading chart data.');
          }
          setChartData([
            { day: 0, price: 100 },
            { day: 1, price: 120 },
            { day: 2, price: 115 },
            { day: 3, price: 130 },
            { day: 4, price: 125 },
            { day: 5, price: 140 },
            { day: 6, price: 135 },
          ]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        if (isCancelled) return;
        
        const prices: ChartDataPoint[] = data.prices?.map((p: number[], index: number) => ({
          day: index,
          price: p[1],
        })) || [];
        setChartData(prices);
      } catch (error) {
        if (isCancelled) return;
        
        console.error('Error fetching chart data:', error);
        setError(lang === 'es' ? 'Error al cargar datos.' : 'Error loading data.');
        setChartData([
          { day: 0, price: 100 },
          { day: 1, price: 120 },
          { day: 2, price: 115 },
          { day: 3, price: 130 },
          { day: 4, price: 125 },
          { day: 5, price: 140 },
          { day: 6, price: 135 },
        ]);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchChartData();

    return () => {
      isCancelled = true;
    };
  }, [cryptoId, lang]);

  if (!isMounted) {
    return (
      <div className="w-full h-64 bg-zinc-800/50 rounded-lg animate-pulse" />
    );
  }

  const isPositive = chartData.length > 1 
    ? chartData[chartData.length - 1].price >= chartData[0].price 
    : true;

  const gradientColor = isPositive ? '#10b981' : '#ef4444';
  const strokeColor = isPositive ? '#34d399' : '#f87171';

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-white text-sm font-mono">
            ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 px-3 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg">
          <span className="text-amber-400 text-xs">{error}</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">
          {lang === 'es' ? 'Gráfico de Precios (7 días)' : 'Price Chart (7 days)'}
        </h3>
        {!error && chartData.length > 0 && (
          <div className="flex gap-2">
            <span className="text-zinc-400 text-sm">
              {lang === 'es' ? 'Mín' : 'Min'}: ${Math.min(...chartData.map(d => d.price)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400 text-sm">
              {lang === 'es' ? 'Máx' : 'Max'}: ${Math.max(...chartData.map(d => d.price)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="h-64 rounded-lg space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <div className="h-64" data-testid="crypto-price-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                hide 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                hide 
                domain={['dataMin - 10', 'dataMax + 10']}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                fill="url(#priceGradient)"
                animationDuration={800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
