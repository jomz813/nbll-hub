
import React, { useState } from 'react';
import { rulesData } from '../data/rules';

const RulesAccordion: React.FC<{ section: typeof rulesData[0], accentText: string, accentBg: string }> = ({ section, accentText, accentBg }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm mb-4 transition-colors`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={accentText}>{section.icon}</span>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{section.title}</span>
        </div>
        <svg className={`w-5 h-5 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 animate-page-enter">
          <ul className="space-y-4">
            {section.content.map((item, idx) => {
              if (typeof item === 'string') {
                return (
                  <li key={idx} className="flex gap-3 text-zinc-600 dark:text-zinc-400 font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full ${accentBg} shrink-0 mt-2`} />
                    <span>{item}</span>
                  </li>
                );
              } else {
                return (
                  <li key={idx} className="space-y-2">
                    <div className="flex gap-3 text-zinc-900 dark:text-zinc-200 font-bold">
                      <span className={`w-1.5 h-1.5 rounded-full ${accentBg} shrink-0 mt-2`} />
                      <span>{item.text}</span>
                    </div>
                    <ul className="ml-8 space-y-2">
                      {item.subRules.map((sub, sIdx) => (
                        <li key={sIdx} className="flex gap-3 text-zinc-500 dark:text-zinc-500 font-medium italic text-sm">
                          <span className="text-zinc-300 dark:text-zinc-600">—</span>
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

const RulesPage: React.FC = () => {
  const accentText = 'text-[#D60A07]';
  const accentBg = 'bg-[#D60A07]';
  const accentBgSoft = 'bg-[#D60A07]/5 dark:bg-[#D60A07]/10';
  const isHOF = false; // Rules page always uses standard accent

  return (
    <div className="flex flex-col -mt-6">
      <div className="w-full max-w-4xl flex flex-col gap-16 md:gap-20">
        <div className="md:hidden">
          {rulesData.map((section) => (
            <RulesAccordion key={section.id} section={section} accentText={accentText} accentBg={accentBg} />
          ))}
        </div>
        <div className="hidden md:block space-y-20">
          {rulesData.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-48 space-y-8 group">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${accentBgSoft} ${accentText}`}>
                  {section.icon}
                </div>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{section.title}</h3>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm group-hover:shadow-md transition-shadow">
                <ul className="space-y-6">
                  {section.content.map((item, idx) => {
                    if (typeof item === 'string') {
                      return (
                        <li key={idx} className="flex gap-4 text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                          <span className={`w-1.5 h-1.5 rounded-full ${accentBg} shrink-0 mt-2.5 opacity-40`} />
                          <span>{item}</span>
                        </li>
                      );
                    } else {
                      return (
                        <li key={idx} className="space-y-3">
                          <div className="flex gap-4 text-zinc-900 dark:text-zinc-200 font-bold leading-relaxed">
                            <span className={`w-1.5 h-1.5 rounded-full ${accentBg} shrink-0 mt-2.5 opacity-40`} />
                            <span>{item.text}</span>
                          </div>
                          <ul className="ml-10 space-y-3">
                            {item.subRules.map((sub, sIdx) => (
                              <li key={sIdx} className="flex gap-3 text-zinc-500 dark:text-zinc-500 font-medium italic">
                                <span className="text-zinc-300 dark:text-zinc-600">/</span>
                                <span>{sub}</span>
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            </section>
          ))}
        </div>
        <div className={`p-8 rounded-[2.5rem] ${accentBgSoft} border ${isHOF ? 'border-[#D4AF37]/20' : 'border-[#D60A07]/10'} space-y-4`}>
          <div className="flex items-center gap-3">
            <svg className={`w-6 h-6 ${accentText}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <h4 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Enforcement Policy</h4>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            The League Administration reserves the right to issue warnings, suspensions, or permanent bans based on behavioral patterns. Punishments scale based on severity and repeat offenses.
          </p>
        </div>
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
          <span>© NBLL</span>
          <span>Last updated: Q4 2025</span>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
