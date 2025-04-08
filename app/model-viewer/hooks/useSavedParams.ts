import { useState, useCallback } from 'react';
import { Vector3 } from '../types';

interface SavedCamera {
  position: Vector3;
  rotation: Vector3;
}

export function useSavedParams() {
  const [savedCamera, setSavedCamera] = useState<SavedCamera | null>(null);

  const saveCurrentCamera = useCallback((params: SavedCamera) => {
    setSavedCamera(params);
  }, []);

  const getSavedCamera = useCallback(() => {
    return savedCamera;
  }, [savedCamera]);

  return {
    saveCurrentCamera,
    getSavedCamera
  };
} 