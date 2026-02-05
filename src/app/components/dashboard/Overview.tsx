import React from 'react';
import { ChevronDown, Info, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan 7', current: 4000, previous: 2400 },
  { name: 'Jan 8', current: 5600, previous: 1398 },
  { name: 'Jan 9', current: 3000, previous: 9800 },
  { name: 'Jan 10', current: 6000, previous: 3908 },
  { name: 'Jan 11', current: 8000, previous: 4800 },
  { name: 'Jan 12', current: 7000, previous: 3800 },
  { name: 'Jan 13', current: 8500, previous: 4300 },
];

const OVERVIEW_STATS = [
  { label: "Collected amount", value: "₹ 39,000.00", change: "+14%", subtext: "₹5600 more than previous week", active: true },
  { label: "Refunds", value: "₹ 10,000.00", change: "+14%", subtext: "₹5600 more than previous week" },
  { label: "Disputes", value: "₹ 10,000.00", change: "+14%", subtext: "₹5600 more than previous week" },
];

export const Overview: React.FC = () => {
  return (
    <div className="mb-8 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800">Payments overview</h2>
        <button className="flex items-center gap-1 text-sm text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50">
          This week <ChevronDown size={14} />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-100 w-full overflow-hidden">
        <div className="flex flex-col md:flex-row border-b border-slate-100">
            {OVERVIEW_STATS.map((stat, i) => (
                <StatBox key={i} {...stat} />
            ))}
        </div>

        <div className="p-6">
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 10 }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="current" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorCurrent)" 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="previous" 
                            stroke="#cbd5e1" 
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            fill="none" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                        This week
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-3 h-3 bg-slate-300 rounded-sm"></div>
                        Last week
                    </div>
                </div>
                <a href="#" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
                    View details <ArrowRight size={14} />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

interface StatBoxProps {
    label: string;
    value: string;
    change: string;
    subtext: string;
    active?: boolean;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, change, subtext, active }) => {
    return (
        <div className={`flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-100 last:border-r-0 last:border-b-0 cursor-pointer transition-colors min-w-0 ${active ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
            <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
                {label} <Info size={14} />
            </div>
            <div className="flex items-end gap-3 mb-2">
                <div className="text-2xl font-bold text-slate-800">{value}</div>
                <div className="text-green-600 text-sm font-medium mb-1">{change}</div>
            </div>
            <div className="text-xs text-slate-400">
                {subtext}
            </div>
            {active && <div className="h-0.5 w-full bg-blue-600 mt-6 -mb-6"></div>}
        </div>
    );
};