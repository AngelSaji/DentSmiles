// web/src/components/ToothChart.tsx
import React from 'react';

type Props = {
  onToothClick: (toothNumber: number, toothId: string) => void;
  selectedTooth?: string;
};

export default function ToothChart({ onToothClick, selectedTooth }: Props) {
  function handleClick(e: React.MouseEvent<SVGElement>) {
    const el = e.target as SVGElement;
    const id = el.id;
    if (!id.startsWith('tooth-')) return;
    const num = parseInt(id.split('-')[1], 10);
    onToothClick(num, id);
  }

  return (
    <svg
      width="600"
      height="300"
      viewBox="0 0 600 300"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      style={{ border: '1px solid #ccc' }}
    >
      {[...Array(16)].map((_, i) => {
        const id = `tooth-${i + 1}`;
        const isSelected = id === selectedTooth;
        return (
          <g key={id}>
            <rect
              id={id}
              x={i * 35 + 10}
              y={40}
              width="30"
              height="50"
              fill={isSelected ? '#ffcccb' : '#fff'}
              stroke="#000"
            />
            <text x={i * 35 + 25} y={35} fontSize="10" textAnchor="middle">
              {i + 1}
            </text>
          </g>
        );
      })}
      {[...Array(16)].map((_, i) => {
        const id = `tooth-${i + 17}`;
        const isSelected = id === selectedTooth;
        return (
          <g key={id}>
            <rect
              id={id}
              x={i * 35 + 10}
              y={150}
              width="30"
              height="50"
              fill={isSelected ? '#ffcccb' : '#fff'}
              stroke="#000"
            />
            <text x={i * 35 + 25} y={215} fontSize="10" textAnchor="middle">
              {i + 17}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
