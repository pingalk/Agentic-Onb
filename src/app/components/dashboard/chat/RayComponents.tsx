import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, ThumbsUp, ThumbsDown, Share2, Download, Maximize2, ExternalLink, AlertCircle, Check, CreditCard, Sparkles } from 'lucide-react';
import clsx from 'clsx';

// --- 2. Smart Table (Animation + Context + Dock) ---
const tableContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
};

const tableRow = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
};

export const SmartTable = ({ headers, rows }: { headers: string[], rows: any[] }) => {
  return (
    <div className="relative group/table mt-5 mb-4">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F9FAFB] border-b border-slate-200 text-[11px] uppercase text-slate-500 font-medium tracking-wider">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <motion.tbody variants={tableContainer} initial="hidden" animate="visible" className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <motion.tr 
                variants={tableRow}
                key={idx}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group/row"
              >
                {Object.entries(row).map(([key, value]: any, cIdx) => {
                   const isCopyable = key.toLowerCase().includes('rrn') || key.toLowerCase().includes('id');
                   const isAmount = key === 'amount';
                   const isStatus = key === 'status';

                   return (
                     <td key={cIdx} className="px-4 py-3.5 relative group/cell">
                        <div className="flex items-center gap-2">
                          {/* Cell Content Logic */}
                          {isStatus ? (
                              <div className={clsx(
                                "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border",
                                value === 'Refunded'
                                  ? "bg-red-50 text-red-700 border-red-100"
                                  : "bg-green-50 text-green-700 border-green-100"
                              )}>
                                {value === 'Refunded' ? <AlertCircle size={10} /> : <Check size={10} />}
                                {value}
                              </div>
                          ) : (
                              <span className={clsx(
                                "truncate max-w-[140px]",
                                isAmount ? "font-mono font-medium text-slate-900" : "text-slate-600"
                              )}>
                                {value}
                              </span>
                          )}

                          {/* Hover Action: Copy */}
                          {isCopyable && (
                             <button className="opacity-0 group-hover/cell:opacity-100 text-slate-400 hover:text-blue-600 transition-all p-1 hover:bg-slate-100 rounded">
                               <Copy size={12} />
                             </button>
                          )}
                        </div>
                     </td>
                   );
                })}
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* Pinned Action Dock (Visible on Table Hover) */}
      <div className="absolute -bottom-4 -right-2 opacity-0 group-hover/table:opacity-100 transition-all duration-300 translate-y-2 group-hover/table:translate-y-0 z-20">
         <div className="flex items-center gap-1 bg-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)] border border-slate-200 rounded-lg p-1">
            <button className="p-1.5 hover:bg-slate-50 rounded-md text-slate-500 hover:text-slate-800 transition-colors" title="Download CSV">
               <Download size={13} />
            </button>
            <div className="w-px h-3 bg-slate-200 mx-0.5" />
            <button className="p-1.5 hover:bg-slate-50 rounded-md text-slate-500 hover:text-slate-800 transition-colors" title="Expand View">
               <Maximize2 size={13} />
            </button>
         </div>
      </div>
    </div>
  );
};

// --- 3. Footer Strip ---
export const MessageFooter = () => (
  <div className="flex items-center gap-2 mt-4 opacity-60 hover:opacity-100 transition-opacity">
    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><ThumbsUp size={14} /></button>
    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><ThumbsDown size={14} /></button>
    <div className="w-px h-3 bg-slate-200 mx-1" />
    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Copy size={14} /></button>
    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Share2 size={14} /></button>
  </div>
);

// --- 4. Suggestion Stack (Numbered) ---
export const SuggestionStack = ({ items }: { items: string[] }) => (
  <div className="flex flex-col gap-2 mt-6 w-full">
    <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Suggestions</h4>
    {items.map((item, i) => (
      <button 
        key={i}
        className="text-left px-3 py-2.5 rounded-lg bg-slate-50 border border-transparent hover:border-blue-200 hover:bg-blue-50/50 text-[13px] text-slate-700 transition-all duration-200 flex items-center gap-3 group"
      >
        <span className="flex items-center justify-center size-5 rounded bg-white text-[10px] font-bold text-slate-400 shadow-sm border border-slate-100 group-hover:text-blue-500 group-hover:border-blue-100">
            {i + 1}
        </span>
        <span className="flex-1">{item}</span>
      </button>
    ))}
  </div>
);
