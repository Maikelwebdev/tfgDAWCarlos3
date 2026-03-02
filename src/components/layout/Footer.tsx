'use client';

import versionData from '@/config/version.json';

export default function Footer() {
  return (
    <footer className="w-full py-4 px-6 text-right">
      <p className="text-slate-500 text-xs">
        v{versionData.version} | {versionData.author}
      </p>
    </footer>
  );
}
