import { useState } from 'react';
import { MovementSpeedControlProps } from '../types';

export function MovementSpeedControl({ moveSpeed, setMoveSpeed }: MovementSpeedControlProps) {
  const [speedInput, setSpeedInput] = useState(moveSpeed.toString());

  const handleSpeedChange = (value: string) => {
    setSpeedInput(value);
    if (value === '' || value === '-') return;
    const newValue = parseFloat(value);
    if (!isNaN(newValue) && newValue >= 0) {
      setMoveSpeed(newValue);
    }
  };

  return (
    <div className="absolute top-32 left-4 z-10 bg-black/80 p-4 rounded-lg border border-white/20 text-white font-mono text-sm">
      <div className="text-yellow-500 mb-2">Movement Speed</div>
      <div>
        <label className="block text-xs mb-1">Speed</label>
        <input
          type="number"
          min="0"
          value={speedInput}
          onChange={(e) => handleSpeedChange(e.target.value)}
          className="w-full bg-white/10 rounded px-2 py-1 text-xs"
          step="0.01"
        />
      </div>
    </div>
  );
} 