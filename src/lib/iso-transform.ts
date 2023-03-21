import { Point } from './draw-triangle';

export const createIsoTransform = (
  alpha: number,
  canvasWidth: number,
  canvasHeight: number,
  scaleFactor: number,
  terrainSize: number
) => {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const angleRad = (alpha * Math.PI) / 180;

  return (x: number, y: number, z: number): Point => {
    // Translate the point by half the terrain size in the x and z directions
    const translatedX = x - terrainSize / 2;
    const translatedZ = z - terrainSize / 2;

    // Apply the rotation
    const rotatedX = translatedX * Math.cos(angleRad) - translatedZ * Math.sin(angleRad);
    const rotatedZ = translatedX * Math.sin(angleRad) + translatedZ * Math.cos(angleRad);

    // Apply the original isometric projection
    const screenX = centerX + (rotatedX - rotatedZ) * scaleFactor;
    const screenY = centerY + (rotatedX + rotatedZ) * scaleFactor / 2 - y * scaleFactor;

    return { x: screenX, y: screenY, z: y };
  };
};