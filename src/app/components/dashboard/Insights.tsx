import React from 'react';
import { ChevronDown, Info, ArrowRight, ArrowUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const sparkData1 = [{v: 10}, {v: 15}, {v: 8}, {v: 12}, {v: 20}, {v: 16}, {v: 25}];
const sparkData2 = [{v: 25}, {v: 20}, {v: 15}, {v: 10}, {v: 12}, {v: 8}, {v: 5}];
const sparkData3 = [{v: 5}, {v: 8}, {v: 12}, {v: 15}, {v: 10}, {v: 18}, {v: 12}];
const sparkData4 = [{v: 15}, {v: 10}, {v: 15}, {v: 20}, {v: 18}, {v: 12}, {v: 14}];

const pieData = [
  { name: 'Credit Cards', value: 40000, color: '#3b82f6' }, // Blue
  { name: 'UPI', value: 20000, color: '#6366f1' }, // Indigo
  { name: 'Netbanking', value: 10000, color: '#93c5fd' }, // Light Blue
  { name: 'Others', value: 5000, color: '#e2e8f0' }, // Slate
];

const INSIGHTS_DATA = [
  { label: "Payment Count", value: "20", change: "12 more since last week", data: sparkData1, color: "#10b981" },
  { label: "Refunds", value: "10", change: "5 more since last week", data: sparkData2, color: "#ef4444", isNegative: true },
  { label: "Payment failure count", value: "20", change: "12 more since last week", data: sparkData3, color: "#ef4444", isNegative: true },
  { label: "Dispute count", value: "10", change: "5 more since last week", data: sparkData4, color: "#ef4444", isNegative: true }
];

export const Insights: React.FC = () => {
  return (
    <div className="mb-8 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800">Top insights</h2>
        <button className="flex items-center gap-1 text-sm text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50">
          This week <ChevronDown size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
        {INSIGHTS_DATA.map((insight, i) => (
            <InsightCard key={i} {...insight} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 w-full overflow-hidden">
        <div className="flex-1 w-full min-w-0">
            <div className="flex items-center gap-1 text-slate-800 font-medium mb-1">
                Payment method split <Info size={14} className="text-slate-400" />
            </div>
            <div className="text-xs text-slate-500 mb-6">Last 7 days</div>

            <div className="space-y-3">
                {pieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                            <span className="text-slate-600">{item.name}</span>
                        </div>
                        <span className="font-medium text-slate-800 whitespace-nowrap">₹{item.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex-shrink-0 flex justify-center items-center h-48">
            <PieChart width={200} height={200}>
                <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
            </PieChart>
        </div>
      </div>
    </div>
  );
};

interface InsightCardProps {
    label: string;
    value: string;
    change: string;
    data: any[];
    color: string;
    isNegative?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ label, value, change, data, color, isNegative }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex justify-between items-end">
            <div>
                <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
                    {label} <Info size={14} />
                </div>
                <div className="text-xs text-slate-400 mb-2">Last 7 days</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-800">{value}</span>
                    <span className={`text-xs font-medium flex items-center ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
                        <ArrowUp size={12} className="mr-0.5" /> {change}
                    </span>
                </div>
            </div>
            <div className="w-24 h-12">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line 
                            type="monotone" 
                            dataKey="v" 
                            stroke={isNegative ? '#ef4444' : '#10b981'} 
                            strokeWidth={2} 
                            dot={false} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};