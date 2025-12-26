
import React from 'react';

const StatsPage: React.FC = () => {
  const accentText = 'text-[#D60A07]';
  const accentBg = 'bg-[#D60A07]';
  const accentShadow = 'hover:shadow-[#D60A07]/5';
  
  const embedUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ40oM4VxQKSbZoD6NQXO3vb9GYVP6bQvZczPVAYaw-6lcLsGlWIdEhJUshk2lOe5wp2flh3QsLP4As/pubhtml?gid=0&single=true&widget=true&headers=false';

  return (
    <div className="space-y-16 pt-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">S11 Stats</h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${accentBg} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${accentBg}`}></span>
            </span>
            <span className={`text-[10px] font-black ${accentText} tracking-[0.2em] uppercase`}>
              live data
            </span>
          </div>
        </div>
        <div className={`w-full rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-zinc-50 dark:bg-zinc-900 relative aspect-[4/5] md:aspect-video lg:h-[750px] transition-all duration-700 ${accentShadow} hover:border-zinc-300 dark:hover:border-zinc-700`}>
          <iframe 
            src={embedUrl}
            className="w-full h-full border-none"
            title="S11 Stats"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">All-Time Stats (S1–S10)</h3>
        </div>
        <div className={`w-full rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-zinc-50 dark:bg-zinc-900 relative aspect-[4/5] md:aspect-video lg:h-[750px] transition-all duration-700 hover:shadow-zinc-500/5 hover:border-zinc-300 dark:hover:border-zinc-700`}>
          <iframe 
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQpbI0iBshMjG0A-ilbu2Tc0OEJuHGYZlIjH9e2mPCIGX2vGp6HfMPVBsglH1givd9AGTWRKxaH0_Ek/pubhtml?widget=true&headers=false"
            className="w-full h-full border-none"
            title="All-Time Stats"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
