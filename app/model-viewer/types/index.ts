export type Vector3 = [number, number, number];

export interface CollectParamsButtonProps {
  cameraPosition: Vector3;
  cameraRotation: Vector3;
  lightPosition: Vector3;
  lightIntensity: number;
  lightColor: string;
  lightDistance: number;
  lightDecay: number;
  secondLightPosition: Vector3;
  secondLightIntensity: number;
  secondLightColor: string;
  secondLightDistance: number;
  secondLightDecay: number;
}

export interface CameraParams {
  position: Vector3;
  rotation: Vector3;
}

export interface DevCameraParams extends CameraParams {
  moveSpeed: number;
}

export interface LightParams extends CameraParams {
  intensity: number;
  color: string;
  distance: number;
  decay: number;
}

export interface CameraControllerProps {
  isDevMode: boolean;
  moveSpeed: number;
  position: Vector3;
  rotation: Vector3;
  onCameraUpdate: (position: Vector3, rotation: Vector3) => void;
}

export interface LightControlsProps {
  position: Vector3;
  intensity: number;
  color: string;
  distance: number;
  decay: number;
  setPosition: (value: Vector3) => void;
  setIntensity: (value: number) => void;
  setColor: (value: string) => void;
  setDistance: (value: number) => void;
  setDecay: (value: number) => void;
}

export interface LightControllerProps {
  position: Vector3;
  intensity: number;
  color: string;
  distance: number;
  decay: number;
  isDevMode: boolean;
  onClick?: () => void;
}

export interface LightIconProps {
  position: Vector3;
  color: string;
}

export interface MovementSpeedControlProps {
  moveSpeed: number;
  setMoveSpeed: (value: number) => void;
}

export interface ModelProps {
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  onClick?: () => void;
}

export interface AssetParametersProps {
  selectedAsset: {
    type: 'light' | 'model' | 'secondLight';
    position: Vector3;
    rotation?: Vector3;
    intensity?: number;
    color?: string;
    distance?: number;
    decay?: number;
  };
  onUpdate: (params: any) => void;
} 