import { useEffect, useState } from 'react';
import { PointLightControls } from './PointLightControls';
import { AssetParametersProps } from '../types';

export function AssetParameters({ selectedAsset, onUpdate }: AssetParametersProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(selectedAsset.type !== null);
  }, [selectedAsset]);

  if (!isVisible) return null;

  const handleNumberInput = (value: string, field: string, index: number) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    if (field === 'position') {
      const newPosition = [...selectedAsset.position];
      newPosition[index] = numValue;
      onUpdate({ ...selectedAsset, position: newPosition });
    } else if (field === 'rotation') {
      const newRotation = [...selectedAsset.rotation];
      newRotation[index] = numValue;
      onUpdate({ ...selectedAsset, rotation: newRotation });
    }
  };

  const renderParameters = () => {
    switch (selectedAsset.type) {
      case 'light':
      case 'secondLight':
        return (
          <PointLightControls
            position={selectedAsset.position}
            intensity={selectedAsset.intensity || 0}
            color={selectedAsset.color || '#ffffff'}
            distance={selectedAsset.distance || 0}
            decay={selectedAsset.decay || 0}
            setPosition={(pos) => onUpdate({ ...selectedAsset, position: pos })}
            setIntensity={(intensity) => onUpdate({ ...selectedAsset, intensity })}
            setColor={(color) => onUpdate({ ...selectedAsset, color })}
            setDistance={(distance) => onUpdate({ ...selectedAsset, distance })}
            setDecay={(decay) => onUpdate({ ...selectedAsset, decay })}
          />
        );
      case 'model':
        return (
          <div className="fixed top-4 right-4 z-10 bg-black bg-opacity-80 p-4 rounded-lg border border-opacity-20 border-white text-white font-mono text-sm">
            <div className="text-yellow-500 mb-2">Model Parameters</div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs mb-1">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs">X</label>
                    <input
                      type="number"
                      value={selectedAsset.position[0] || 0}
                      onChange={(e) => handleNumberInput(e.target.value, 'position', 0)}
                      className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs">Y</label>
                    <input
                      type="number"
                      value={selectedAsset.position[1] || 0}
                      onChange={(e) => handleNumberInput(e.target.value, 'position', 1)}
                      className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs">Z</label>
                    <input
                      type="number"
                      value={selectedAsset.position[2] || 0}
                      onChange={(e) => handleNumberInput(e.target.value, 'position', 2)}
                      className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1">Rotation</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs">X</label>
                    <input
                      type="number"
                      value={selectedAsset.rotation[0] || 0}
                      onChange={(e) => handleNumberInput(e.target.value, 'rotation', 0)}
                      className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs">Y</label>
                    <input
                      type="number"
                      value={selectedAsset.rotation[1] || 0}
                      onChange={(e) => handleNumberInput(e.target.value, 'rotation', 1)}
                      className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs">Z</label>
                    <input
                      type="number"
                      value={selectedAsset.rotation[2] || 0}
                      onChange={(e) => handleNumberInput(e.target.value, 'rotation', 2)}
                      className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-xs"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderParameters();
} 