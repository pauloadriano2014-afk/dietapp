'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  data: any[];
}

export default function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="h-64 w-full bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Evolução de Peso (kg)</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            hide={true}
          />
          <YAxis 
            domain={['dataMin - 2', 'dataMax + 2']} 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#2563eb" 
            strokeWidth={4} 
            dot={{ r: 4, fill: '#2563eb' }} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}