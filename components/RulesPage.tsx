
import React, { useState } from 'react';
import { rulesData } from '../data/rules';

const RulesAccordion: React.FC<{ section: typeof rulesData[0], accentText: string, accentBg: string }> = ({ section, accentText, accentBg }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-100 dark:border-zinc-800 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left transition-colors"
      >
        <div className="flex items-center">
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{section.title}</span>
        </div>
        <svg className={`w-5 h-5 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-6 pt-2 animate-page-enter">
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
  const accentBg = 'bg-[#D60A07]';

  return (
    <div className="flex flex-col -mt-6">
      <div className="w-full max-w-4xl flex flex-col gap-16 md:gap-20">
        <div className="md:hidden">
          {rulesData.map((section) => (
            <RulesAccordion key={section.id} section={section} accentText="text-[#D60A07]" accentBg={accentBg} />
          ))}
        </div>
        <div className="hidden md:block space-y-16">
          {rulesData.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-48 space-y-8 group">
              <div className="flex items-center">
                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{section.title}</h3>
              </div>
              <div>
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
      </div>
    </div>
  );
};

export default RulesPage;
