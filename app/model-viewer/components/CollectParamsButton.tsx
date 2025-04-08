import { Vector3 } from '../types';
import { useState } from 'react';
import { CollectParamsButtonProps } from '../types';

export function CollectParamsButton({
  cameraPosition,
  cameraRotation,
  lightPosition,
  lightIntensity,
  lightColor,
  lightDistance,
  lightDecay,
  secondLightPosition,
  secondLightIntensity,
  secondLightColor,
  secondLightDistance,
  secondLightDecay
}: CollectParamsButtonProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const params = {
    camera: {
      position: cameraPosition,
      rotation: cameraRotation
    },
    light: {
      position: lightPosition,
      intensity: lightIntensity,
      color: lightColor,
      distance: lightDistance,
      decay: lightDecay
    },
    secondLight: {
      position: secondLightPosition,
      intensity: secondLightIntensity,
      color: secondLightColor,
      distance: secondLightDistance,
      decay: secondLightDecay
    }
  };

  const formattedParams = JSON.stringify(params, null, 2);

  const handleCollectParams = async () => {
    try {
      await navigator.clipboard.writeText(formattedParams);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar texto: ', err);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <button
        onClick={handleCollectParams}
        className={`${
          copySuccess ? 'bg-green-500' : 'bg-yellow-500 hover:bg-yellow-600'
        } text-black font-mono text-sm px-4 py-2 rounded-lg transition-colors`}
      >
        {copySuccess ? 'Copiado!' : 'Coletar Parâmetros'}
      </button>
    </div>
  );
} 