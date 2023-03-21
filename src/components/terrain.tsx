import React, { useRef, useEffect, useState } from 'react';
import { TerrainGenerator } from '../lib/terrain-generator';
import { createIsoTransform } from '@/lib/iso-transform';
import { drawTriangle } from '@/lib/draw-triangle';

function renderTerrain(
  context: CanvasRenderingContext2D,
  terrain: number[][],
  alpha: number,
  canvasWidth: number,
  canvasHeight: number,
  scale: number = 0.5,
  lightDirection: [number, number, number] = [0.5, 0.5, 0.5],
  lightIntensity: number = 0.5,
  lightColor: string = '#fffffff',
  waterLevel: number = 0,
  waterBaseColor: string = '#0000ff',
  landBaseColor: string = '#00ff00'
) {
  const size = terrain.length;
  const tileSize = 32;
  const heightScale = 100;

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = '#fff';
  context.lineWidth = 0;
  // context.lineWidth = 2 * scale;
  const isoTransform = createIsoTransform(
    alpha,
    canvasWidth,
    canvasHeight,
    scale,
    size * tileSize
  );
  for (let i = 0; i < size - 1; i++) {
    for (let j = 0; j < size - 1; j++) {
      const x = tileSize * i;
      const y = tileSize * j;

      const points = [
        isoTransform(x, Math.max(terrain[i][j] * heightScale, waterLevel), y),
        isoTransform(
          x + tileSize,
          Math.max(terrain[i + 1][j] * heightScale, waterLevel),
          y
        ),
        isoTransform(
          x,
          Math.max(terrain[i][j + 1] * heightScale, waterLevel),
          y + tileSize
        ),
        isoTransform(
          x + tileSize,
          Math.max(terrain[i + 1][j + 1] * heightScale, waterLevel),
          y + tileSize
        ),
      ];

      // Determine the base color for each triangle based on the altitude
      const baseColor1 =
        (terrain[i][j] + terrain[i + 1][j] + terrain[i][j + 1]) / 3 <=
        waterLevel
          ? waterBaseColor
          : landBaseColor;
      const baseColor2 =
        (terrain[i + 1][j] + terrain[i][j + 1] + terrain[i + 1][j + 1]) / 3 <=
        waterLevel
          ? waterBaseColor
          : landBaseColor;

      drawTriangle(
        context,
        [points[0], points[1], points[2]],
        baseColor1,
        lightColor,
        lightDirection,
        lightIntensity
      );
      drawTriangle(
        context,
        [points[1], points[2], points[3]],
        baseColor2,
        lightColor,
        lightDirection,
        lightIntensity
      );
    }
  }
}

interface TerrainProps {
  seed?: number;
  canvasWidth: number;
  canvasHeight: number;
  terrainSize: number;
  scaleFactor: number;
  alpha: number;
  lightDirection: [number, number, number];
  lightColor: string;
  lightIntensity: number;
  waterLevel: number;
  landBaseColor: string;
  waterBaseColor: string;
  cells: number;
  scale: number;
}

export const Terrain: React.FC<TerrainProps> = ({
  seed,
  scaleFactor = 10,
  alpha,
  canvasHeight = 600,
  canvasWidth = 800,
  cells,
  scale = 1,
  lightDirection,
  lightColor,
  lightIntensity,
  waterLevel,
  landBaseColor,
  waterBaseColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [terrain, setTerrain] = useState<number[][]>([]);

  useEffect(() => {
    const terrainGenerator = new TerrainGenerator(seed, scaleFactor);
    const generatedTerrain = terrainGenerator.generate(cells);
    setTerrain(generatedTerrain);
  }, [seed, cells, scaleFactor]);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      renderTerrain(
        context,
        terrain,
        alpha,
        canvasWidth,
        canvasHeight,
        scale,
        lightDirection,
        lightIntensity,
        lightColor,
        waterLevel,
        landBaseColor,
        waterBaseColor
      );
    }
  }, [
    terrain,
    alpha,
    canvasWidth,
    canvasHeight,
    scale,
    lightDirection,
    lightIntensity,
    lightColor,
    waterLevel,
    landBaseColor,
    waterBaseColor,
  ]);

  return (
    <div>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </div>
  );
};

export default Terrain;
