import { useRef } from 'react';
import { Vector3 } from '../types';
import * as THREE from 'three';
import { LightIcon } from './LightIcon';

interface LightControllerProps {
  position: Vector3;
  intensity: number;
  color: string;
  distance: number;
  decay: number;
  isDevMode: boolean;
  onClick?: () => void;
}

export function LightController({
  position,
  intensity,
  color,
  distance,
  decay,
  isDevMode,
  onClick
}: LightControllerProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <>
      <pointLight 
        position={position}
        intensity={intensity} 
        color={color}
        distance={distance}
        decay={decay}
      />
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        visible={isDevMode}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity}
        />
      </mesh>
      {isDevMode && <LightIcon position={position} color={color} />}
    </>
  );
} 