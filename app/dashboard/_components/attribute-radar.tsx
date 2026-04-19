'use client';

interface Attributes {
  strength: number;
  intelligence: number;
  constitution: number;
  energy: number;
  willpower: number;
}

export function AttributeRadar({ stats }: { stats: Attributes }) {
  const max = 20; // Escala máxima para o radar
  
  // Coordenadas calculadas para um pentágono
  const points = [
    { x: 50, y: 10 },  // Topo (Força)
    { x: 90, y: 40 },  // Direita Superior (Inteligência)
    { x: 75, y: 85 },  // Direita Inferior (Vontade)
    { x: 25, y: 85 },  // Esquerda Inferior (Energia)
    { x: 10, y: 40 },  // Esquerda Superior (Constituição)
  ];

  const calculatePoint = (index: number, value: number) => {
    const p = points[index];
    const factor = Math.min(value, max) / max;
    const centerX = 50;
    const centerY = 50;
    return {
      x: centerX + (p.x - centerX) * factor,
      y: centerY + (p.y - centerY) * factor,
    };
  };

  const statValues = [
    stats.strength,
    stats.intelligence,
    stats.willpower,
    stats.energy / 5, // Normalizando energia para a escala 20
    stats.constitution
  ];

  const dataPoints = statValues.map((val, i) => {
    const p = calculatePoint(i, val);
    return `${p.x},${p.y}`;
  }).join(' ');

  return (
    <div className="relative w-full aspect-square max-w-[300px] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background Grid */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((f) => (
          <polygon
            key={f}
            points={points.map(p => `${50 + (p.x - 50) * f},${50 + (p.y - 50) * f}`).join(' ')}
            fill="none"
            stroke="#333"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Radar Shape */}
        <polygon
          points={dataPoints}
          fill="rgba(255, 107, 107, 0.4)"
          stroke="#ff6b6b"
          strokeWidth="1.5"
          className="animate-in fade-in duration-1000"
        />
        
        {/* Labels (simplified icons or small text) */}
        <text x="50" y="5" textAnchor="middle" className="fill-gray-500 font-press-start text-[4px]">FOR</text>
        <text x="95" y="40" textAnchor="start" className="fill-gray-500 font-press-start text-[4px]">INT</text>
        <text x="80" y="95" textAnchor="start" className="fill-gray-500 font-press-start text-[4px]">VON</text>
        <text x="20" y="95" textAnchor="end" className="fill-gray-500 font-press-start text-[4px]">ENE</text>
        <text x="5" y="40" textAnchor="end" className="fill-gray-500 font-press-start text-[4px]">CON</text>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-2 h-2 bg-[#ff6b6b] rounded-full blur-[2px]" />
      </div>
    </div>
  );
}
