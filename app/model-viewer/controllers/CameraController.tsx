import { useThree, useFrame } from '@react-three/fiber';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CameraControllerProps, Vector3 } from '../types';
import { FIXED_CAMERA_PARAMS } from '../constants';

export function CameraController({
  position,
  rotation,
  moveSpeed,
  isDevMode,
  onCameraUpdate
}: CameraControllerProps) {
  const { camera } = useThree();
  const isDragging = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const cameraPositionRef = useRef(new THREE.Vector3(...position));
  const cameraRotationRef = useRef(new THREE.Euler(...rotation, 'YXZ'));
  const targetPosition = useRef(new THREE.Vector3(...position));
  const targetRotation = useRef(new THREE.Euler(...rotation, 'YXZ'));
  const [keys, setKeys] = useState(new Set<string>());
  
  // Configurações de movimento
  const rotateSpeed = 0.002;
  const moveAcceleration = 0.1;
  const moveDeceleration = 0.05;
  const maxSpeed = moveSpeed;
  const currentVelocity = useRef(new THREE.Vector3());
  const smoothFactor = 0.1;

  useEffect(() => {
    if (!isDevMode) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(event.key.toLowerCase()));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(event.key.toLowerCase());
        return newKeys;
      });
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 2) return;
      isDragging.current = true;
      lastMousePosition.current = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = (event.clientX - lastMousePosition.current.x) * rotateSpeed;
      const deltaY = (event.clientY - lastMousePosition.current.y) * rotateSpeed;

      // Atualiza a rotação alvo
      targetRotation.current.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, targetRotation.current.x - deltaY)
      );
      targetRotation.current.y = targetRotation.current.y - deltaX;

      lastMousePosition.current = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isDevMode]);

  useFrame((_, delta) => {
    if (!isDevMode) {
      camera.position.set(
        FIXED_CAMERA_PARAMS.position[0],
        FIXED_CAMERA_PARAMS.position[1],
        FIXED_CAMERA_PARAMS.position[2]
      );
      camera.rotation.set(
        FIXED_CAMERA_PARAMS.rotation[0],
        FIXED_CAMERA_PARAMS.rotation[1],
        FIXED_CAMERA_PARAMS.rotation[2]
      );
      if (onCameraUpdate) {
        onCameraUpdate(FIXED_CAMERA_PARAMS.position, FIXED_CAMERA_PARAMS.rotation);
      }
      return;
    }

    // Calcula a direção do movimento baseado nas teclas pressionadas
    const forward = keys.has('w') ? 1 : keys.has('s') ? -1 : 0;
    const right = keys.has('d') ? 1 : keys.has('a') ? -1 : 0;
    const up = keys.has('e') ? 1 : keys.has('q') ? -1 : 0;

    // Calcula o vetor de movimento desejado
    const moveDirection = new THREE.Vector3(right, up, forward);
    moveDirection.normalize();

    // Aplica aceleração e desaceleração
    if (moveDirection.length() > 0) {
      currentVelocity.current.add(
        moveDirection.multiplyScalar(moveAcceleration * delta * 60)
      );
    } else {
      currentVelocity.current.multiplyScalar(1 - moveDeceleration * delta * 60);
    }

    // Limita a velocidade máxima
    if (currentVelocity.current.length() > maxSpeed) {
      currentVelocity.current.normalize().multiplyScalar(maxSpeed);
    }

    // Aplica o movimento
    const moveX = Math.sin(cameraRotationRef.current.y) * -currentVelocity.current.z + 
                 Math.cos(cameraRotationRef.current.y) * currentVelocity.current.x;
    const moveZ = Math.cos(cameraRotationRef.current.y) * -currentVelocity.current.z - 
                 Math.sin(cameraRotationRef.current.y) * currentVelocity.current.x;

    targetPosition.current.x += moveX;
    targetPosition.current.y += currentVelocity.current.y;
    targetPosition.current.z += moveZ;

    // Interpola suavemente a posição atual para a posição alvo
    cameraPositionRef.current.lerp(targetPosition.current, smoothFactor);
    camera.position.copy(cameraPositionRef.current);

    // Interpola suavemente a rotação atual para a rotação alvo
    cameraRotationRef.current.x = THREE.MathUtils.lerp(
      cameraRotationRef.current.x,
      targetRotation.current.x,
      smoothFactor
    );
    cameraRotationRef.current.y = THREE.MathUtils.lerp(
      cameraRotationRef.current.y,
      targetRotation.current.y,
      smoothFactor
    );

    // Aplica a rotação à câmera
    camera.rotation.copy(cameraRotationRef.current);

    if (onCameraUpdate) {
      onCameraUpdate(
        [cameraPositionRef.current.x, cameraPositionRef.current.y, cameraPositionRef.current.z],
        [cameraRotationRef.current.x, cameraRotationRef.current.y, cameraRotationRef.current.z]
      );
    }
  });

  return null;
} 