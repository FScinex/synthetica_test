'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect, useCallback } from 'react';
import { Vector3 } from './types';
import { FIXED_CAMERA_PARAMS, DEV_CAMERA_PARAMS, FIXED_LIGHT_PARAMS, DEV_LIGHT_PARAMS, FIXED_SECOND_LIGHT_PARAMS } from './constants';
import { CameraController } from './controllers/CameraController';
import { LightController } from './components/LightController';
import { LightControls } from './components/LightControls';
import { MovementSpeedControl } from './components/MovementSpeedControl';
import { Model } from './components/Model';
import { CollectParamsButton } from './components/CollectParamsButton';
import { useSavedParams } from './hooks/useSavedParams';
import SaveMessage from './components/SaveMessage';
import { AssetParameters } from './components/AssetParameters';
import { ReturnButton } from './components/ReturnButton';
import { Chat } from './components/Chat';
import { RobotSubtitle } from './components/RobotSubtitle';

export default function ModelViewer() {
  const [isDevMode, setIsDevMode] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<Vector3>(isDevMode ? DEV_CAMERA_PARAMS.position : FIXED_CAMERA_PARAMS.position);
  const [cameraRotation, setCameraRotation] = useState<Vector3>(isDevMode ? DEV_CAMERA_PARAMS.rotation : FIXED_CAMERA_PARAMS.rotation);
  const [moveSpeed, setMoveSpeed] = useState(DEV_CAMERA_PARAMS.moveSpeed);
  const [lightPosition, setLightPosition] = useState<Vector3>(isDevMode ? DEV_LIGHT_PARAMS.position : FIXED_LIGHT_PARAMS.position);
  const [lightRotation, setLightRotation] = useState<Vector3>([0, 0, 0]);
  const [lightIntensity, setLightIntensity] = useState(isDevMode ? DEV_LIGHT_PARAMS.intensity : FIXED_LIGHT_PARAMS.intensity);
  const [lightColor, setLightColor] = useState(isDevMode ? DEV_LIGHT_PARAMS.color : FIXED_LIGHT_PARAMS.color);
  const [lightDistance, setLightDistance] = useState(isDevMode ? DEV_LIGHT_PARAMS.distance : FIXED_LIGHT_PARAMS.distance);
  const [lightDecay, setLightDecay] = useState(isDevMode ? DEV_LIGHT_PARAMS.decay : FIXED_LIGHT_PARAMS.decay);
  const [secondLightPosition, setSecondLightPosition] = useState<Vector3>(FIXED_SECOND_LIGHT_PARAMS.position);
  const [secondLightIntensity, setSecondLightIntensity] = useState(FIXED_SECOND_LIGHT_PARAMS.intensity);
  const [secondLightColor, setSecondLightColor] = useState(FIXED_SECOND_LIGHT_PARAMS.color);
  const [secondLightDistance, setSecondLightDistance] = useState(FIXED_SECOND_LIGHT_PARAMS.distance);
  const [secondLightDecay, setSecondLightDecay] = useState(FIXED_SECOND_LIGHT_PARAMS.decay);
  const [modelPosition, setModelPosition] = useState<Vector3>([0, 0, 0]);
  const [modelRotation, setModelRotation] = useState<Vector3>([0, 0, 0]);
  const [modelScale, setModelScale] = useState<Vector3>([1, 1, 1]);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [robotMessage, setRobotMessage] = useState<string>('');
  
  const [selectedAsset, setSelectedAsset] = useState<{
    type: 'light' | 'model' | 'secondLight';
    position: Vector3;
    rotation?: Vector3;
    intensity?: number;
    color?: string;
    distance?: number;
    decay?: number;
  } | null>(null);

  const { saveCurrentCamera, getSavedCamera } = useSavedParams();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isDevMode) return;

    console.log('Tecla pressionada:', e.key, 'CTRL:', e.ctrlKey);

    if (e.ctrlKey && e.key === '1') {
      e.preventDefault();
      console.log('CTRL + 1 detectado');
      
      // Salvar os parâmetros atuais
      const currentParams = {
        position: [...cameraPosition] as Vector3,
        rotation: [...cameraRotation] as Vector3
      };
      
      saveCurrentCamera(currentParams);
      setShowSaveMessage(true);
      
      // Esconder a mensagem após 2 segundos
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 2000);
      
      console.log('=== PARÂMETROS SALVOS ===');
      console.log('Posição:', currentParams.position);
      console.log('Rotação:', currentParams.rotation);
    } else if (e.key === '1' && !e.ctrlKey) {
      const saved = getSavedCamera();
      if (saved) {
        console.log('=== PARÂMETROS RESTAURADOS ===');
        console.log('Posição:', saved.position);
        console.log('Rotação:', saved.rotation);
        
        // Atualizar a posição e rotação da câmera
        setCameraPosition([...saved.position] as Vector3);
        setCameraRotation([...saved.rotation] as Vector3);
        
        // Forçar a atualização da câmera no Canvas
        const canvas = document.querySelector('canvas');
        if (canvas) {
          canvas.focus();
          canvas.dispatchEvent(new Event('update'));
        }
      }
    } else if (e.key === '2' && !e.ctrlKey) {
      console.log('=== PARÂMETROS DA CÂMERA ATUALIZADOS PARA MODO USUÁRIO ===');
      console.log('Posição:', FIXED_CAMERA_PARAMS.position);
      console.log('Rotação:', FIXED_CAMERA_PARAMS.rotation);
      
      // Atualizar a posição e rotação da câmera para os parâmetros fixos
      setCameraPosition([...FIXED_CAMERA_PARAMS.position] as Vector3);
      setCameraRotation([...FIXED_CAMERA_PARAMS.rotation] as Vector3);
      
      // Forçar a atualização da câmera no Canvas
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.focus();
        canvas.dispatchEvent(new Event('update'));
      }
    }
  }, [cameraPosition, cameraRotation, saveCurrentCamera, getSavedCamera, isDevMode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    (window as any).toggleDevMode = () => {
      setIsDevMode(prev => !prev);
      console.log(`Dev Mode: ${!isDevMode ? 'ON' : 'OFF'}`);
    };
  }, [isDevMode]);

  const handleLightClick = () => {
    setSelectedAsset({
      type: 'light',
      position: lightPosition,
      intensity: lightIntensity,
      color: lightColor,
      distance: lightDistance,
      decay: lightDecay
    });
  };

  const handleSecondLightClick = () => {
    setSelectedAsset({
      type: 'secondLight',
      position: secondLightPosition,
      intensity: secondLightIntensity,
      color: secondLightColor,
      distance: secondLightDistance,
      decay: secondLightDecay
    });
  };

  const handleAssetUpdate = (updatedParams: any) => {
    if (!selectedAsset) return;

    setSelectedAsset(prev => ({
      ...prev!,
      ...updatedParams
    }));

    // Atualizar os estados globais baseado no tipo do asset
    if (updatedParams.type === 'light') {
      setLightPosition(updatedParams.position);
      setLightIntensity(updatedParams.intensity);
      setLightColor(updatedParams.color);
      setLightDistance(updatedParams.distance);
      setLightDecay(updatedParams.decay);
    } else if (updatedParams.type === 'secondLight') {
      setSecondLightPosition(updatedParams.position);
      setSecondLightIntensity(updatedParams.intensity);
      setSecondLightColor(updatedParams.color);
      setSecondLightDistance(updatedParams.distance);
      setSecondLightDecay(updatedParams.decay);
    } else if (updatedParams.type === 'model') {
      setModelPosition(updatedParams.position);
      setModelRotation(updatedParams.rotation);
    }
  };

  const handleCameraUpdate = useCallback((newPosition: Vector3, newRotation: Vector3) => {
    if (isDevMode) {
      setCameraPosition(newPosition);
      setCameraRotation(newRotation);
    }
  }, [isDevMode]);

  return (
    <div className="w-full h-screen bg-black relative">
      {!isDevMode && (
        <>
          <ReturnButton />
          <Chat onResponse={setRobotMessage} />
          {robotMessage && <RobotSubtitle message={robotMessage} />}
        </>
      )}
      {isDevMode && (
        <>
          {showSaveMessage && <SaveMessage />}
          <div className="absolute top-4 left-4 z-10 text-white font-mono text-sm">
            <div>Posição da Câmera: {cameraPosition.join(', ')}</div>
            <div>Rotação da Câmera: {cameraRotation.join(', ')}</div>
            <div className="mt-2">
              <div>CTRL + 1: Salvar posição atual</div>
              <div>1: Restaurar posição salva</div>
              <div>2: Resetar para posição padrão</div>
            </div>
          </div>
          <MovementSpeedControl moveSpeed={moveSpeed} setMoveSpeed={setMoveSpeed} />
          {selectedAsset && (
            <AssetParameters
              selectedAsset={{
                type: selectedAsset.type,
                position: selectedAsset.position,
                rotation: selectedAsset.rotation,
                intensity: selectedAsset.intensity,
                color: selectedAsset.color,
                distance: selectedAsset.distance,
                decay: selectedAsset.decay
              }}
              onUpdate={handleAssetUpdate}
            />
          )}
          <CollectParamsButton
            cameraPosition={cameraPosition}
            cameraRotation={cameraRotation}
            lightPosition={lightPosition}
            lightIntensity={lightIntensity}
            lightColor={lightColor}
            lightDistance={lightDistance}
            lightDecay={lightDecay}
            secondLightPosition={secondLightPosition}
            secondLightIntensity={secondLightIntensity}
            secondLightColor={secondLightColor}
            secondLightDistance={secondLightDistance}
            secondLightDecay={secondLightDecay}
          />
        </>
      )}
      
      <Canvas
        camera={{
          position: cameraPosition,
          rotation: cameraRotation,
          fov: 75,
          near: 0.1,
          far: 1000
        }}
      >
        <CameraController
          position={cameraPosition}
          rotation={cameraRotation}
          moveSpeed={moveSpeed}
          isDevMode={isDevMode}
          onCameraUpdate={handleCameraUpdate}
        />
        <ambientLight intensity={0.5} />
        <LightController
          position={lightPosition}
          intensity={lightIntensity}
          color={lightColor}
          distance={lightDistance}
          decay={lightDecay}
          isDevMode={isDevMode}
          onClick={handleLightClick}
        />
        <LightController
          position={secondLightPosition}
          intensity={secondLightIntensity}
          color={secondLightColor}
          distance={secondLightDistance}
          decay={secondLightDecay}
          isDevMode={isDevMode}
          onClick={handleSecondLightClick}
        />
        <Suspense fallback={null}>
          <Model
            position={modelPosition}
            rotation={modelRotation}
            scale={modelScale}
            onClick={() => handleAssetUpdate({
              type: 'model',
              position: modelPosition,
              rotation: modelRotation
            })}
          />
        </Suspense>
      </Canvas>
    </div>
  );
} 