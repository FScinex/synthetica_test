import { Vector3 } from '../types';
import { useState, useEffect } from 'react';

interface PointLightControlsProps {
  position: Vector3;
  intensity: number;
  color: string;
  distance: number;
  decay: number;
  setPosition: (pos: Vector3) => void;
  setIntensity: (intensity: number) => void;
  setColor: (color: string) => void;
  setDistance: (distance: number) => void;
  setDecay: (decay: number) => void;
}

export function PointLightControls({
  position,
  intensity,
  color,
  distance,
  decay,
  setPosition,
  setIntensity,
  setColor,
  setDistance,
  setDecay
}: PointLightControlsProps) {
  const [positionInputs, setPositionInputs] = useState<string[]>(position.map(String));
  const [intensityInput, setIntensityInput] = useState(String(intensity));
  const [distanceInput, setDistanceInput] = useState(String(distance));
  const [decayInput, setDecayInput] = useState(String(decay));

  useEffect(() => {
    setPositionInputs(position.map(String));
    setIntensityInput(String(intensity));
    setDistanceInput(String(distance));
    setDecayInput(String(decay));
  }, [position, intensity, distance, decay]);

  const handlePositionChange = (value: string, index: number) => {
    const newInputs = [...positionInputs];
    newInputs[index] = value;
    setPositionInputs(newInputs);

    if (value === '' || value === '-') return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const newPosition = [...position];
    newPosition[index] = numValue;
    setPosition(newPosition as Vector3);
  };

  const handleIntensityChange = (value: string) => {
    setIntensityInput(value);
    if (value === '' || value === '-') return;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    setIntensity(numValue);
  };

  const handleDistanceChange = (value: string) => {
    setDistanceInput(value);
    if (value === '' || value === '-') return;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    setDistance(numValue);
  };

  const handleDecayChange = (value: string) => {
    setDecayInput(value);
    if (value === '' || value === '-') return;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    setDecay(numValue);
  };

  return (
    <div className="fixed top-4 right-4 z-10 bg-black bg-opacity-80 p-4 rounded-lg border border-opacity-20 border-white text-white font-mono text-sm">
      <div className="text-yellow-500 mb-2">Point Light Parameters</div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs mb-1">Position</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs">X</label>
              <input
                type="number"
                value={positionInputs[0]}
                onChange={(e) => handlePositionChange(e.target.value, 0)}
                className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs">Y</label>
              <input
                type="number"
                value={positionInputs[1]}
                onChange={(e) => handlePositionChange(e.target.value, 1)}
                className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs">Z</label>
              <input
                type="number"
                value={positionInputs[2]}
                onChange={(e) => handlePositionChange(e.target.value, 2)}
                className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
                step="0.1"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs mb-1">Intensity</label>
          <input
            type="number"
            value={intensityInput}
            onChange={(e) => handleIntensityChange(e.target.value)}
            className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Distance</label>
          <input
            type="number"
            value={distanceInput}
            onChange={(e) => handleDistanceChange(e.target.value)}
            className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Decay</label>
          <input
            type="number"
            value={decayInput}
            onChange={(e) => handleDecayChange(e.target.value)}
            className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
} 