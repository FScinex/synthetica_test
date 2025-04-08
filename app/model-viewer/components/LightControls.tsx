import { useState, useEffect } from 'react';
import { LightControlsProps } from '../types';

export function LightControls({ 
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
}: LightControlsProps) {
  const [positionInputs, setPositionInputs] = useState<[string, string, string]>(['0', '0', '0']);
  const [intensityInput, setIntensityInput] = useState('0');
  const [distanceInput, setDistanceInput] = useState('0');
  const [decayInput, setDecayInput] = useState('0');

  useEffect(() => {
    if (position) {
      setPositionInputs([
        position[0]?.toString() || '0',
        position[1]?.toString() || '0',
        position[2]?.toString() || '0'
      ]);
    }
    if (intensity !== undefined) {
      setIntensityInput(intensity.toString());
    }
    if (distance !== undefined) {
      setDistanceInput(distance.toString());
    }
    if (decay !== undefined) {
      setDecayInput(decay.toString());
    }
  }, [position, intensity, distance, decay]);

  const handlePositionChange = (index: number, value: string) => {
    const newInputs = [...positionInputs] as [string, string, string];
    newInputs[index] = value;
    setPositionInputs(newInputs);

    if (value === '' || value === '-') return;
    
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      const newPosition = [...position] as [number, number, number];
      newPosition[index] = newValue;
      setPosition(newPosition);
    }
  };

  const handleIntensityChange = (value: string) => {
    setIntensityInput(value);
    if (value === '' || value === '-') return;
    const newValue = parseFloat(value);
    if (!isNaN(newValue) && newValue >= 0) {
      setIntensity(newValue);
    }
  };

  const handleDistanceChange = (value: string) => {
    setDistanceInput(value);
    if (value === '' || value === '-') return;
    const newValue = parseFloat(value);
    if (!isNaN(newValue) && newValue >= 0) {
      setDistance(newValue);
    }
  };

  const handleDecayChange = (value: string) => {
    setDecayInput(value);
    if (value === '' || value === '-') return;
    const newValue = parseFloat(value);
    if (!isNaN(newValue) && newValue >= 0) {
      setDecay(newValue);
    }
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
                onChange={(e) => handlePositionChange(0, e.target.value)}
                className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs">Y</label>
              <input
                type="number"
                value={positionInputs[1]}
                onChange={(e) => handlePositionChange(1, e.target.value)}
                className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs">Z</label>
              <input
                type="number"
                value={positionInputs[2]}
                onChange={(e) => handlePositionChange(2, e.target.value)}
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
            min="0"
            value={intensityInput}
            onChange={(e) => handleIntensityChange(e.target.value)}
            className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Distance</label>
          <input
            type="number"
            min="0"
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
            min="0"
            value={decayInput}
            onChange={(e) => handleDecayChange(e.target.value)}
            className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Color</label>
          <input
            type="color"
            value={color || '#ffffff'}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-8 bg-transparent rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
} 