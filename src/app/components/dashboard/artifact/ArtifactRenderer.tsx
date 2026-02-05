import React, { useState, useEffect } from 'react';
import { Check, CreditCard, AlertCircle, Copy, Download, ExternalLink, Wallet } from 'lucide-react';
import { RayThinking } from '../RayThinking';
import { OrchestratedBubble } from '../OrchestratedBubble';
import clsx from "clsx";
import { motion } from "motion/react";

// --- Animation Primitives ---
const containerVar = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVar = { hidden: { opacity: 0, y: 5, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0)' } };

// --- Icons & Shared Components ---
const UpiIcon = () => (<svg width="20" height="21" viewBox="0 0 20 21" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M7.62351 3.00002C6.93911 2.99687 6.34704 3.47588 6.20725 4.14587L3.03088 19.3689C2.84464 20.2615 3.52431 21.1002 4.43609 21.1031L5.0262 21.1049C5.39218 21.106 5.74487 20.9677 6.01257 20.7182L9.72559 17.2566L9.30317 19.3867C9.12621 20.279 9.81071 21.1098 10.7204 21.1068L10.9498 21.1061C11.2947 21.1049 11.6277 20.9801 11.8883 20.7541L19.7601 13.9295C20.2769 13.4815 20.4072 12.7318 20.072 12.1356L15.3483 3.73538C15.0933 3.28187 14.6134 3.0012 14.0931 3.0012H13.8573C13.1806 3.0012 12.5952 3.47234 12.4506 4.13337L11.6352 7.85928L8.90663 3.65627C8.64235 3.24919 8.19079 3.00262 7.70545 3.00039L7.62351 3.00002ZM12.2282 12.2986L7.86864 5.58345L5.07629 18.9661L12.2282 12.2986ZM13.1052 10.1235L14.0579 11.5909C14.4384 12.1771 14.3431 12.9518 13.832 13.4283L12.1269 15.0179L11.4113 18.6266L18.2065 12.7353L14.1228 5.47325L13.1052 10.1235Z" fill="#192839"/></svg>);
const NetbankingIcon = () => (<svg width="20" height="21" viewBox="0 0 20 21" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.0122 2.53569C11.5777 2.04084 12.4221 2.04084 12.9877 2.53568L19.657 8.3713C20.6993 9.28336 20.0542 11.0002 18.6692 11.0002H5.33065C3.94561 11.0002 3.30053 9.28337 4.34289 8.3713L11.0122 2.53569ZM11.9999 4.32893L6.66137 9.00017H17.3385L11.9999 4.32893ZM7.99992 12.0002C8.55221 12.0002 8.99992 12.4479 8.99992 13.0002V17.0002C8.99992 17.5525 8.55221 18.0002 7.99992 18.0002C7.44764 18.0002 6.99992 17.5525 6.99992 17.0002V13.0002C6.99992 12.4479 7.44764 12.0002 7.99992 12.0002ZM11.9999 12.0002C12.5522 12.0002 12.9999 12.4479 12.9999 13.0002V17.0002C12.9999 17.5525 12.5522 18.0002 11.9999 18.0002C11.4476 18.0002 10.9999 17.5525 10.9999 17.0002V13.0002C10.9999 12.4479 11.4476 12.0002 11.9999 12.0002ZM15.9999 12.0002C16.5522 12.0002 16.9999 12.4479 16.9999 13.0002V17.0002C16.9999 17.5525 16.5522 18.0002 15.9999 18.0002C15.4476 18.0002 14.9999 17.5525 14.9999 17.0002V13.0002C14.9999 12.4479 15.4476 12.0002 15.9999 12.0002ZM19.9999 20.0002C19.9999 20.5525 19.5522 21.0002 18.9999 21.0002L4.99992 21.0002C4.44764 21.0002 3.99992 20.5525 3.99992 20.0002C3.99992 19.4479 4.44764 19.0002 4.99992 19.0002L18.9999 19.0002C19.5522 19.0002 19.9999 19.4479 19.9999 20.0002Z" fill="#192839"/></svg>);

const RowHoverActions = () => (
  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white shadow-sm border border-slate-200 rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
    <button className="p-1.5 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-600"><Copy size={14} /></button>
    <button className="p-1.5 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-600"><Download size={14} /></button>
    <button className="p-1.5 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-600"><ExternalLink size={14} /></button>
  </div>
);

// --- The Investigation Artifact (Matches Image 2 Exactly) ---
const InvestigationReportArtifact = ({ data, onRowClick }: any) => {
  return (
    <motion.div className="flex flex-col gap-6 w-full mt-2" initial="hidden" animate="visible" variants={containerVar}>
      
      {/* 1. Header: Icon + Bold Text */}
      <motion.div variants={itemVar} className="flex gap-4 items-start">
         <div className="shrink-0 bg-[#ea580c] p-2 rounded-[8px] text-white mt-0.5 shadow-sm">
            <Wallet size={18} strokeWidth={2.5} />
         </div>
         <div className="flex flex-col gap-4">
            <h3 className="text-[18px] leading-[1.4] font-medium text-[#020202]">
               {data.headline}
            </h3>
            <p className="text-[16px] text-[#40566d] leading-[1.5]">
               {data.subtext}
            </p>
         </div>
      </motion.div>

      {/* 2. Stats List (using native list-disc) */}
      <motion.ul variants={itemVar} className="flex flex-col gap-2 pl-12 list-disc ml-3">
         {data.stats.map((stat: any, i: number) => (
            <li key={i} className="text-[16px] leading-[1.5] text-[#40566d]">
               <span className="text-[#40566d]">{stat.label}: </span>
               <span className="font-medium text-[#192839]">{stat.value}</span>
            </li>
         ))}
      </motion.ul>

      {/* 3. Table Section */}
      <motion.div variants={itemVar} className="pl-0 mt-2">
         <h4 className="text-[15px] font-bold text-slate-900 mb-3">Your recent refunds:</h4>
         
         <div className="w-full">
            {/* Table Header */}
            <div className="flex h-[32px] text-[11px] font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200">
                <div className="w-[110px] flex items-center">Amount</div>
                <div className="w-[100px] flex items-center">Status</div>
                <div className="w-[120px] flex items-center">Issued On</div>
                <div className="w-[120px] flex items-center">Bank RRN</div>
                <div className="flex-1 flex items-center">Customer Email</div>
            </div>
            {/* Table Rows */}
            <div className="text-[14px] text-slate-900 font-medium">
               {data.table.rows.map((row: any) => (
                 <div key={row.id} onClick={() => onRowClick && onRowClick(row.id)} className="relative flex h-[48px] items-center border-b border-slate-100 hover:bg-slate-50 cursor-pointer group">
                    <div className="w-[110px] font-medium font-mono">{row.amount}</div>
                    <div className="w-[100px]">
                        <span className={clsx("px-2 py-0.5 rounded text-[12px]", row.status === 'Refunded' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600")}>
                            {row.status}
                        </span>
                    </div>
                    <div className="w-[120px] text-slate-600 text-[13px]">{row.date}</div>
                    <div className="w-[120px] text-slate-500 font-mono text-[12px]">{row.rrn}</div>
                    <div className="flex-1 text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-blue-600 truncate">{row.email}</div>
                    <RowHoverActions />
                 </div>
               ))}
            </div>
            {/* View All Link */}
            <div className="mt-3 text-[14px] text-slate-800 hover:text-blue-600 cursor-pointer w-fit transition-colors">
                [View all 47 refunds this week →]
            </div>
         </div>
      </motion.div>

      {/* 4. Resolution */}
      <motion.div variants={itemVar} className="pt-4">
         <p className="text-[15px] leading-relaxed text-slate-800">
            <span className="font-bold text-slate-900 block mb-1">{data.resolution.title}</span>
            {data.resolution.content}
         </p>
      </motion.div>

      {/* 5. Numbered Suggestions */}
      {data.suggestions && (
        <motion.div variants={itemVar} className="flex flex-col gap-2 mt-2">
           {data.suggestions.map((sug: string, i: number) => (
             <button key={i} className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 hover:text-blue-700 transition-colors w-full md:w-fit text-left group">
               <span className="flex items-center justify-center size-5 bg-blue-50 text-blue-600 rounded text-[11px] font-bold">{i+1}</span>
               {sug}
             </button>
           ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// --- Main Switcher ---
export const ArtifactRenderer: React.FC<any> = ({ type, data, onAction }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 800); }, [type]);

  if (loading) return <RayThinking />;

  // Force render InvestigationReportArtifact for the 'investigation_report' type
  if (type === 'investigation_report') {
    return (
        <div className="w-full">
           <OrchestratedBubble 
              heading="" // Important: We handle headline inside the artifact now
              subtext=""
              dataAsset={<InvestigationReportArtifact data={data} onRowClick={(id) => onAction && onAction('row_click', id)} />}
           />
        </div>
    );
  }
  return null;
};