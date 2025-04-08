import { LightIconProps } from '../types';

export function LightIcon({ position, color }: LightIconProps) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </mesh>
  );
} 