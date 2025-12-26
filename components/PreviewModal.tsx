
import React from 'react';

interface PreviewModalProps {
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-scale-in">
        {/* Header */}
        <div className="bg-zinc-900/50 border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#D60A07]" />
            <span className="text-sm font-bold tracking-widest text-white/50">experience preview</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Mock Content (Preview of Home Page) */}
        <div className="p-12 overflow-y-auto max-h-[80vh] custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-12 text-center">
            <header className="space-y-4">
              <h2 className="text-4xl font-black text-[#D60A07] tracking-tight">preview: the arena</h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                you're getting a sneak peek at the nbll dashboard. this is where legends manage their legacy and fans track every highlight.
              </p>
            </header>

            {/* Placeholder Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'active legends', value: '42' },
                { label: 'upcoming games', value: '12' },
                { label: 'legacy points', value: '1.2m' }
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <div className="text-[#D60A07] text-2xl font-black">{stat.value}</div>
                  <div className="text-white/30 text-[10px] font-bold tracking-tighter mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Placeholder Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="aspect-video bg-zinc-900 rounded-2xl border border-white/5 flex items-center justify-center group cursor-not-allowed">
                <span className="text-white/10 group-hover:text-[#D60A07]/20 transition-colors font-black text-xl tracking-widest">live stream</span>
              </div>
              <div className="aspect-video bg-zinc-900 rounded-2xl border border-white/5 flex items-center justify-center group cursor-not-allowed">
                <span className="text-white/10 group-hover:text-[#D60A07]/20 transition-colors font-black text-xl tracking-widest">player stats</span>
              </div>
            </div>
            
            <footer className="pt-8">
              <button 
                onClick={onClose}
                className="text-[#D60A07] text-sm font-bold tracking-widest hover:underline"
              >
                close preview
              </button>
            </footer>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(214, 10, 7, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(214, 10, 7, 0.4);
        }
      `}</style>
    </div>
  );
};

export default PreviewModal;
