import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';

const formatBytes = (bytes) => {
  if (!bytes || isNaN(bytes)) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const COLORS = {
  in: '#6366f1',    
  out: '#ef4444'    
};

export default function TrafficChart({ data, onSelect }) {
  const chartData = data.map(c => ({
    name: c.ip,
    in: Number(c.bytes_in),
    out: Number(c.bytes_out),
    fullData: c
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4"> Tráfego por IP (IN/OUT)</h3>
      
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 40, bottom: 20, left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatBytes} />
            <YAxis type="category" dataKey="name" />
            <Tooltip
              formatter={(value, name) => [formatBytes(value), name === 'in' ? 'Entrada (IN)' : 'Saída (OUT)']}
              labelFormatter={label => `IP: ${label}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            />
            <Legend
              payload={[
                { value: 'Entrada (IN)', type: 'rect', color: COLORS.in },
                { value: 'Saída (OUT)', type: 'rect', color: COLORS.out }
              ]}
              wrapperStyle={{ paddingTop: 10 }}
            />
            
            <Bar dataKey="in" stackId="a" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`bar-in-${index}`}
                  fill={COLORS.in}
                  cursor="pointer"
                  onClick={() => onSelect?.(entry.fullData)}
                />
              ))}
            </Bar>

            <Bar dataKey="out" stackId="a" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`bar-out-${index}`}
                  fill={COLORS.out}
                  cursor="pointer"
                  onClick={() => onSelect?.(entry.fullData)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-sm text-gray-600"> Clique em uma barra para ver detalhes por IP.</p>
    </div>
  );
}
