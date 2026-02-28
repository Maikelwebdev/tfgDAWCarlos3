'use client';

import { useState, useEffect } from 'react';

interface CryptoSearchProps {
  lang: 'es' | 'en';
}

export default function CryptoSearch({ lang }: CryptoSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Array<{ id: string; name: string; symbol: string }>>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const searchCryptos = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${searchTerm}`
        );
        const data = await response.json();
        setResults(data.coins?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error searching cryptos:', error);
      }
    };

    const debounce = setTimeout(searchCryptos, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  if (!isMounted) {
    return (
      <div className="w-full max-w-md">
        <div className="h-10 bg-zinc-800/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={lang === 'es' ? 'Buscar criptomoneda...' : 'Search cryptocurrency...'}
        className="w-full px-4 py-3 bg-zinc-900/80 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
      />
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden z-50">
          {results.map((crypto) => (
            <button
              key={crypto.id}
              onClick={() => {
                setSearchTerm('');
                setResults([]);
              }}
              className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3"
            >
              <span className="text-zinc-400 text-sm uppercase">{crypto.symbol}</span>
              <span className="text-white">{crypto.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
