'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ApiHealthData {
  status: 'checking' | 'operational' | 'error';
  latency: number | null;
}

export default function Laboratory() {
  const [apiHealth, setApiHealth] = useState<ApiHealthData>({ status: 'checking', latency: null });
  const [btcAmount, setBtcAmount] = useState<string>('');
  const [satoshis, setSatoshis] = useState<string>('');

  useEffect(() => {
    const checkApiHealth = async () => {
      const startTime = performance.now();
      try {
        const response = await fetch('/api/crypto?endpoint=ping', {
          method: 'GET',
          cache: 'no-store',
        });
        const latency = Math.round(performance.now() - startTime);
        
        if (response.ok || response.status === 200) {
          setApiHealth({ status: 'operational', latency });
        } else {
          setApiHealth({ status: 'error', latency: null });
        }
      } catch {
        setApiHealth({ status: 'error', latency: null });
      }
    };

    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBtcChange = (value: string) => {
    setBtcAmount(value);
    const btc = parseFloat(value);
    if (!isNaN(btc) && btc >= 0) {
      setSatoshis((btc * 100000000).toLocaleString('en-US', { maximumFractionDigits: 0 }));
    } else {
      setSatoshis('');
    }
  };

  const handleSatoshisChange = (value: string) => {
    setSatoshis(value);
    const sat = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(sat) && sat >= 0) {
      setBtcAmount((sat / 100000000).toFixed(8));
    } else {
      setBtcAmount('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-zinc-900/80 border-zinc-800 relative overflow-hidden group">
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500/30 rounded-xl transition-all duration-300" 
             style={{ background: 'linear-gradient(90deg, transparent 0%, transparent 100%)' }} 
        />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">API Health Monitor</CardTitle>
            <Badge 
              variant={apiHealth.status === 'operational' ? 'default' : 'destructive'}
              className={apiHealth.status === 'operational' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}
            >
              {apiHealth.status === 'checking' ? 'Checking...' : apiHealth.status === 'operational' ? 'Operacional' : 'Error'}
            </Badge>
          </div>
          <CardDescription className="text-zinc-400">
            Estado de la conexión con CoinGecko
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-3xl font-bold text-white font-mono">
                {apiHealth.latency !== null ? (
                  <>
                    <span className="text-cyan-400">{apiHealth.latency}</span>
                    <span className="text-zinc-500 text-lg ml-1">ms</span>
                  </>
                ) : (
                  <span className="text-zinc-500 text-lg">--</span>
                )}
              </div>
              <p className="text-zinc-500 text-xs mt-1">Tiempo de respuesta</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.2)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={apiHealth.status === 'operational' ? '#10b981' : '#ef4444'}
                  strokeWidth="3"
                  strokeDasharray={`${apiHealth.latency ? Math.min(apiHealth.latency / 2, 100) : 0}, 100`}
                  className="transition-all duration-500"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/80 border-zinc-800 relative overflow-hidden group">
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/30 rounded-xl transition-all duration-300" />
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Calculadora Satoshis</CardTitle>
          <CardDescription className="text-zinc-400">
            Convierte Bitcoin a Satoshis (1 BTC = 100,000,000 Satoshis)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-zinc-500 text-xs mb-1 block">Bitcoin (BTC)</label>
            <Input
              type="text"
              inputMode="decimal"
              value={btcAmount}
              onChange={(e) => handleBtcChange(e.target.value)}
              placeholder="0.00000000"
              className="bg-zinc-800/50 border-zinc-700 text-white font-mono focus-visible:ring-cyan-500"
            />
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
          <div>
            <label className="text-zinc-500 text-xs mb-1 block">Satoshis (SAT)</label>
            <Input
              type="text"
              inputMode="numeric"
              value={satoshis}
              onChange={(e) => handleSatoshisChange(e.target.value)}
              placeholder="0"
              className="bg-zinc-800/50 border-zinc-700 text-white font-mono focus-visible:ring-purple-500"
            />
          </div>
          <div className="pt-2 text-center">
            <Badge variant="outline" className="border-zinc-700 text-zinc-400">
              1 BTC = 100,000,000 SAT
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
