import { useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MODEL_PARAMS } from '../constants';
import { Vector3 } from '../types';

interface ModelProps {
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  onClick?: () => void;
}

export function Model({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], onClick }: ModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('https://huggingface.co/datasets/dodipituca/Synthetica_3D_Assets/resolve/main/Robot_Rotate.glb');
  const { actions } = useAnimations(animations, scene);
  const START_FRAME = 220;
  const FPS = 30;

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.setEffectiveTimeScale(1);
        firstAction.setEffectiveWeight(1);
        firstAction.time = START_FRAME * (1/FPS);
        firstAction.setLoop(THREE.LoopOnce, 0);
        firstAction.clampWhenFinished = true;
        firstAction.play();
      }
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        if (firstAction.time >= firstAction.getClip().duration) {
          firstAction.reset();
          firstAction.time = START_FRAME * (1/FPS);
          firstAction.play();
        }
      }
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} onClick={onClick}>
      <primitive 
        object={scene}
        position={MODEL_PARAMS.position}
        rotation={MODEL_PARAMS.rotation}
        scale={MODEL_PARAMS.scale}
      />
    </group>
  );
}

useGLTF.preload('/model.glb'); 