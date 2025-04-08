import { Vector3 } from '../types';

export const MODEL_PARAMS = {
  position: [0, 0, 0] as Vector3,
  rotation: [0, 0, 0] as Vector3,
  scale: [1, 1, 1] as Vector3,
};

export const FIXED_CAMERA_PARAMS = {
  position: [0.34910332419795015, 1.9000000000000035, 0.7866617532576897] as Vector3,
  rotation: [-0.06499999999999988, -0.16000000000000245, 1.5650840187446283e-17] as Vector3
};

export const DEV_CAMERA_PARAMS = {
  position: [0, 3, 2] as Vector3,
  rotation: [0, 0, 0] as Vector3,
  moveSpeed: 0.1,
};

export const FIXED_LIGHT_PARAMS = {
  position: [0, 2, 1] as Vector3,
  intensity: 2,
  color: '#ffffff',
  distance: 1.3,
  decay: 2
};

export const FIXED_SECOND_LIGHT_PARAMS = {
  position: [0, 2.9, -0.6] as Vector3,
  intensity: 2.5,
  color: '#908aea',
  distance: 1.8,
  decay: 2.2
};

export const DEV_LIGHT_PARAMS = {
  position: [0, 2, 0] as Vector3,
  rotation: [0, 0, 0] as Vector3,
  intensity: 1,
  color: '#ffffff',
  distance: 10,
  decay: 2
}; 