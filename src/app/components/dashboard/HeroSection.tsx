import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="bg-[#6097FF] rounded-lg p-6 text-white shadow-sm mb-8 relative overflow-hidden w-full">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 transform rotate-45 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="flex justify-center items-center mb-6 relative z-10 text-center">
        <div>
          <h1 className="text-2xl font-bold">Good morning, Hari!</h1>
          <p className="text-blue-100 text-sm">Tue, Jan 13</p>
        </div>
      </div>

      <div className="rounded-lg p-0 text-slate-800 shadow-md flex flex-col md:flex-row relative z-10 overflow-hidden w-full" style={{ background: "linear-gradient(to bottom right, #E5EFFF, rgba(255, 255, 255, 0.61))" }}>
        {/* Left: Current Balance */}
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-[#CBD5E2] relative flex flex-col justify-center min-w-0">
          <div className="text-slate-500 text-sm font-medium mb-1">Current balance</div>
          <div className="text-3xl font-bold flex items-baseline gap-1">
            <span className="text-slate-500 text-lg">₹</span>
            10,13,000<span className="text-slate-500 text-lg">.00</span>
          </div>
        
        </div>

        {/* Right: Today's Settlement */}
        <div className="flex-[2] p-6 relative min-w-0">
          <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
            <div className="min-w-0 w-full">
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                 <span className="text-slate-700 font-medium">Today's settlement</span>
              </div>
              <div className="text-2xl font-bold flex items-baseline gap-1 mb-2">
                <span className="text-slate-500 text-sm">₹</span>
                3,63,000<span className="text-slate-500 text-sm">.00</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap">On Track</span>
                <span className="text-slate-500">• To be deposited in your bank account by 9:00 am tomorrow</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#CBD5E2] flex flex-wrap items-center gap-2 text-sm">
            <CheckCircle2 size={16} className="text-white fill-green-500 flex-shrink-0" />
            <span className="text-slate-600">₹5,11,256.00 deposited yesterday</span>
            <span className="text-slate-300">•</span>
            <a href="#" className="text-blue-600 font-medium hover:underline flex items-center gap-1 whitespace-nowrap">
              View All Settlements <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};