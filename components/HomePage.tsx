
import React from 'react';

interface HomePageProps {
  onBack: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-8">
      <div className="max-w-2xl space-y-8">
        <h2 className="text-4xl font-bold tracking-tight text-[#D60A07]">welcome to the league</h2>
        <p className="text-zinc-400 text-lg">
          the dashboard is currently being prepared for the upcoming season. 
          check back soon for live stats, legacy highlights, and team standings.
        </p>
        <button
          onClick={onBack}
          className="text-white hover:text-[#D60A07] transition-colors flex items-center gap-2 mx-auto font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          return to entry
        </button>
      </div>

      {/* Stats Mockup Grid */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse" />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
