import React from 'react';
import { recordsData } from '../data/records';
import { useSettings } from '../context/SettingsContext';

const RecordsPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="animate-page-enter pt-4 space-y-16 md:space-y-24 pb-24">
      {recordsData.map((section) => (
        <div key={section.id} className="space-y-6">
          {/* Section Header - Kept existing style */}
          <div className="flex items-center gap-4">
             <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">
               {section.title}
             </h3>
             <div className="h-px header-divider flex-1" />
          </div>

          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-[1.6fr_0.8fr_0.8fr] px-6 py-3 border-b text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]" style={{ borderColor: 'var(--divider)' }}>
            <div>Record</div>
            <div className="text-center">Value</div>
            <div className="text-right">Holder</div>
          </div>

          {/* Records List */}
          <div className="flex flex-col">
            {section.items.map((record) => (
              <div 
                key={record.id}
                className="group border-b last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors"
                style={{ borderColor: 'var(--divider)' }}
              >
                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-[1.6fr_0.8fr_0.8fr] items-center px-6 py-6">
                  {/* Column 1: Record Name */}
                  <div className="text-left">
                    <span className="text-base font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">
                      {record.title}
                    </span>
                  </div>

                  {/* Column 2: Value */}
                  <div className="flex flex-col items-center justify-center">
                    <span 
                      className="text-2xl font-black tabular-nums tracking-tighter leading-none"
                      style={{ color: 'var(--accent)' }}
                    >
                      {record.value}
                    </span>
                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mt-1.5">
                      {record.valueLabel}
                    </span>
                  </div>

                  {/* Column 3: Holder */}
                  <div className="flex flex-col items-end">
                    <span className="text-base font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                      {record.holder}
                    </span>
                    {record.context && record.context !== '—' && (
                      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-600 mt-1 italic">
                        {record.context}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mobile Layout (Stacked) */}
                <div className="md:hidden flex flex-col gap-3 px-2 py-5">
                  {/* Line 1: Record Name */}
                  <div className="text-left">
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-snug">
                      {record.title}
                    </span>
                  </div>
                  
                  {/* Line 2: Value (Left) and Holder (Right) */}
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-2">
                      <span 
                        className="text-xl font-black tabular-nums tracking-tighter"
                        style={{ color: 'var(--accent)' }}
                      >
                        {record.value}
                      </span>
                      <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                        {record.valueLabel}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {record.holder}
                      </span>
                      {record.context && record.context !== '—' && (
                        <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-600 italic">
                          {record.context}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecordsPage;