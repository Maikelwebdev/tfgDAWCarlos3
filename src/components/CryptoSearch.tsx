'use client';

import { useState, useEffect, useRef } from 'react';

interface CryptoDetails {
  id: string;
  name: string;
  symbol: string;
  image: { large: string; small: string };
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    ath: { usd: number };
    circulating_supply: number;
  };
}

interface SearchResult {
  id: string;
  name: string;
  symbol: string;
}

interface CryptoSearchProps {
  lang: 'es' | 'en';
  onSelect?: (cryptoId: string) => void;
}

const SkeletonCard = () => (
  <div className="mt-4 p-4 bg-zinc-900/60 border border-white/10 rounded-xl backdrop-blur-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
      <div className="space-y-2">
        <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse" />
        <div className="w-12 h-3 bg-zinc-800/50 rounded animate-pulse" />
      </div>
    </div>
    <div className="mb-4 space-y-2">
      <div className="w-40 h-10 bg-zinc-800 rounded animate-pulse" />
      <div className="w-20 h-4 bg-zinc-800/50 rounded animate-pulse" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-3 rounded-lg bg-zinc-800/30 space-y-2">
          <div className="w-16 h-3 bg-zinc-800/50 rounded animate-pulse" />
          <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-3 rounded-lg bg-zinc-800/50 animate-fade-in">
    <p className="text-zinc-500 text-xs">{label}</p>
    <p className="text-white text-sm font-medium">{value}</p>
  </div>
);

const EmptyState = ({ lang }: { lang: 'es' | 'en' }) => (
  <div className="mt-4 p-8 bg-zinc-900/40 border border-white/5 rounded-xl backdrop-blur-sm">
    <div className="flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center">
        <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-zinc-500 text-sm">
        {lang === 'es' 
          ? 'Selecciona una moneda para analizar los datos en tiempo real' 
          : 'Select a coin to analyze real-time data'}
      </p>
    </div>
  </div>
);

export default function CryptoSearch({ lang, onSelect }: CryptoSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoDetails | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const searchCryptos = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${searchTerm}`,
          { signal: abortControllerRef.current?.signal }
        );

        if (!response.ok) {
          if (response.status === 429) {
            setError(lang === 'es' ? 'Demasiadas peticiones. Espera un momento...' : 'Too many requests. Please wait...');
            setResults([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setError(null);
        setResults(data.coins?.slice(0, 5) || []);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error searching cryptos:', err);
          setError(lang === 'es' ? 'Error al buscar. Intenta de nuevo.' : 'Search error. Try again.');
          setResults([]);
        }
      }
    };

    const debounce = setTimeout(searchCryptos, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm, lang]);

  const fetchCryptoDetails = async (cryptoId: string, retryCount = 0) => {
    setLoadingDetails(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}?localization=false&tickers=false&community_data=false&developer_data=false`
      );

      if (!response.ok) {
        if (response.status === 429 && retryCount < 3) {
          const msg = lang === 'es' ? 'Límite de API alcanzado, reintentando en 60s...' : 'API limit reached, retrying in 60s...';
          setError(msg);
          await new Promise(resolve => setTimeout(resolve, 60000));
          return fetchCryptoDetails(cryptoId, retryCount + 1);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSelectedCrypto(data);
    } catch (err) {
      console.error('Error fetching crypto details:', err);
      setError(lang === 'es' ? 'Error al cargar detalles. Intenta de nuevo.' : 'Error loading details. Try again.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelect = (crypto: SearchResult) => {
    setSearchTerm(crypto.name);
    setResults([]);
    setSelectedCrypto(null);
    onSelect?.(crypto.id);
    fetchCryptoDetails(crypto.id);
  };

  const handleClear = () => {
    setSearchTerm('');
    setResults([]);
    setSelectedCrypto(null);
    onSelect?.('bitcoin');
  };

  const formatPrice = (price: number) =>
    price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A';

  const formatCompact = (value: number, suffix = 'B') =>
    value ? `$${(value / 1e9).toFixed(2)}${suffix}` : 'N/A';

  if (!isMounted) {
    return (
      <div className="w-full">
        <div className="h-10 bg-zinc-800/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  const isPositive = (selectedCrypto?.market_data?.price_change_percentage_24h ?? 0) >= 0;
  const priceChange = Math.abs(selectedCrypto?.market_data?.price_change_percentage_24h || 0).toFixed(2);

  return (
    <div className="w-full">
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={handleClear}
        placeholder={lang === 'es' ? 'Buscar criptomoneda...' : 'Search cryptocurrency...'}
        showClear={!!searchTerm || !!selectedCrypto}
      />

      {error && <ErrorMessage message={error} />}

      {results.length > 0 && (
        <SearchResults results={results} onSelect={handleSelect} />
      )}

      {loadingDetails && <SkeletonCard />}

      {selectedCrypto && !loadingDetails && (
        <CryptoDetailsCard
          crypto={selectedCrypto}
          isPositive={isPositive}
          priceChange={priceChange}
          lang={lang}
          formatPrice={formatPrice}
          formatCompact={formatCompact}
        />
      )}

      {!searchTerm && !selectedCrypto && !loadingDetails && <EmptyState lang={lang} />}
    </div>
  );
}

function SearchInput({ value, onChange, onClear, placeholder, showClear }: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  placeholder: string;
  showClear: boolean;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-10 bg-zinc-900/80 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
      />
      {showClear && (
        <button onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mt-2 px-3 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-xs">
      {message}
    </div>
  );
}

function SearchResults({ results, onSelect }: { results: SearchResult[]; onSelect: (c: SearchResult) => void }) {
  return (
    <div className="mt-2 bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden z-50">
      {results.map((crypto) => (
        <button
          key={crypto.id}
          onClick={() => onSelect(crypto)}
          className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3"
        >
          <span className="text-zinc-400 text-sm uppercase">{crypto.symbol}</span>
          <span className="text-white">{crypto.name}</span>
        </button>
      ))}
    </div>
  );
}

function CryptoDetailsCard({ crypto, isPositive, priceChange, lang, formatPrice, formatCompact }: {
  crypto: CryptoDetails;
  isPositive: boolean;
  priceChange: string;
  lang: 'es' | 'en';
  formatPrice: (p: number) => string;
  formatCompact: (v: number, s?: string) => string;
}) {
  return (
    <div className="mt-4 p-4 bg-zinc-900/60 border border-white/10 rounded-xl backdrop-blur-sm animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        {crypto.image?.small && (
          <img src={crypto.image.small} alt={crypto.name} className="w-8 h-8 rounded-full" />
        )}
        <div>
          <h3 className="text-white font-bold">{crypto.name}</h3>
          <span className="text-zinc-400 text-sm uppercase">{crypto.symbol}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-4xl font-bold text-white">${formatPrice(crypto.market_data?.current_price?.usd)}</p>
        <span className={`inline-flex items-center gap-1 text-sm font-medium mt-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
          {priceChange}%
          <span className="text-zinc-500 text-xs ml-1">24h</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label={lang === 'es' ? 'Market Cap' : 'Market Cap'} value={formatCompact(crypto.market_data?.market_cap?.usd)} />
        <StatCard label={lang === 'es' ? 'Volumen 24h' : 'Volume 24h'} value={formatCompact(crypto.market_data?.total_volume?.usd)} />
        <StatCard label={lang === 'es' ? 'Máximo 24h' : 'High 24h'} value={`$${formatPrice(crypto.market_data?.high_24h?.usd)}`} />
        <StatCard label={lang === 'es' ? 'Mínimo 24h' : 'Low 24h'} value={`$${formatPrice(crypto.market_data?.low_24h?.usd)}`} />
      </div>
    </div>
  );
}

function ArrowUpIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
