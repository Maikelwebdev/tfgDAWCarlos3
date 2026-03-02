'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

interface NavbarProps {
  lang: 'es' | 'en';
  onLangChange: (lang: 'es' | 'en') => void;
}

export default function Navbar({ lang, onLangChange }: NavbarProps) {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const translations = {
    es: {
      navServices: 'Servicios',
      navPlayground: 'Laboratorio',
      connectWallet: 'Entrar con Google',
      signOut: 'Salir',
    },
    en: {
      navServices: 'Services',
      navPlayground: 'Lab',
      connectWallet: 'Sign in with Google',
      signOut: 'Sign Out',
    },
  };

  const t = translations[lang];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/', redirect: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex flex-wrap justify-between items-center p-4 md:p-6 max-w-7xl mx-auto gap-4">
        <div className="text-xl font-black tracking-tighter italic">MIGUEL<span className="text-cyan-400 font-bold">DEVELOPER</span></div>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="#services" className={cn(
                  "px-3 md:px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors",
                  "focus:text-white focus:outline-none"
                )}>
                  {t.navServices}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="#playground" className={cn(
                  "px-3 md:px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors",
                  "focus:text-white focus:outline-none"
                )}>
                  {t.navPlayground}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLangChange(lang === 'es' ? 'en' : 'es')}
            className="bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 rounded-full text-xs md:text-sm font-medium"
          >
            <Badge variant="secondary" className="mr-1 bg-white/20 text-white border-none">
              {lang.toUpperCase()}
            </Badge>
          </Button>
          
          {isMounted && status === 'authenticated' && session && (
            <div className="flex items-center gap-3">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-9 h-9 rounded-full border-2 border-cyan-500/50"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {session.user?.name?.[0] || 'U'}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="bg-zinc-800/80 hover:bg-zinc-700 border-white/10 text-zinc-300 hover:text-white rounded-full text-xs md:text-sm"
              >
                {t.signOut}
              </Button>
            </div>
          )}
          
          {isMounted && status === 'unauthenticated' && (
            <Button 
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="bg-white text-black hover:bg-zinc-200 px-4 md:px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)]"
            >
              {t.connectWallet}
            </Button>
          )}
          
          {isMounted && status === 'loading' && (
            <div className="w-9 h-9 border-2 border-zinc-700 border-t-cyan-500 rounded-full animate-spin" />
          )}
        </div>
      </div>
    </nav>
  );
}
