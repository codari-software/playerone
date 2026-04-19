'use client';

import { TrendingUp } from 'lucide-react';

interface MonthlyProgressChartProps {
  data: { day: number; value: number }[];
}

export function MonthlyProgressChart({ data }: MonthlyProgressChartProps) {
  const width = 800;
  const height = 200;
  const padding = 40;

  // Gerar o caminho do SVG (Path)
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - (d.value / 100) * (height - padding * 2) - padding;
    return { x, y };
  });

  const linePath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x},${p.y}` : `${path} L ${p.x},${p.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  return (
    <div className="p-8 pixel-corners bg-[#18181b] border-2 border-[#222] space-y-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <h3 className="font-press-start text-white text-lg">PROGRESSO MENSAL</h3>
          <p className="font-vt323 text-xl text-gray-500 uppercase tracking-widest">Progresso dos seus hábitos ao longo do mês</p>
        </div>
        <TrendingUp className="w-8 h-8 text-[#ff6b6b] animate-pulse" />
      </div>

      <div className="w-full overflow-x-auto no-scrollbar pt-4">
        <div className="min-w-[600px] h-[250px] relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Grid lines */}
            {[0, 20, 40, 60, 80, 100].map((v) => {
              const y = height - (v / 100) * (height - padding * 2) - padding;
              return (
                <g key={v}>
                  <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#222" strokeWidth="1" />
                  <text x={padding - 10} y={y + 3} textAnchor="end" className="fill-gray-600 font-press-start text-[6px]">{v}%</text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path
              d={areaPath}
              fill="url(#gradient)"
              className="animate-in fade-in duration-1000"
            />

            {/* The Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#ff6b6b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-in fade-in slide-in-from-left duration-1000"
            />

            {/* Data Points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4"
                className="fill-[#18181b] stroke-[#ff6b6b] stroke-[2px] hover:r-6 transition-all cursor-crosshair"
              >
                <title>Dia {data[i].day}: {data[i].value}%</title>
              </circle>
            ))}

            {/* Definitions */}
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[#222] font-press-start text-[8px] text-gray-600">
         <span>TOTAL DE CHECK-INS: {data.reduce((acc, d) => acc + (d.value > 0 ? 1 : 0), 0)}</span>
         <span className="text-[#ff6b6b]">META: 80% DE CONSISTÊNCIA</span>
      </div>
    </div>
  );
}
