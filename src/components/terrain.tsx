import React, { useRef, useEffect, useState } from 'react';
import { TerrainGenerator } from '../lib/terrain-generator';
import { createIsoTransform } from '@/lib/iso-transform';
import { drawTriangle } from '@/lib/draw-triangle';

function renderTerrain(
  context: CanvasRenderingContext2D,
  terrain: number[][],
  {
    alpha,
    canvasWidth,
    canvasHeight,
    heightScaleFactor,
    lightDirection,
    lightIntensity,
    lightColor,
    scale,
    waterLevel,
    waterBaseColor,
    landBaseColor,
  }: {
    alpha: number;
    canvasWidth: number;
    canvasHeight: number;
    heightScaleFactor: number;
    lightDirection: [number, number, number];
    lightIntensity: number;
    lightColor: string;
    scale: number;
    waterLevel: number;
    waterBaseColor: string;
    landBaseColor: string;
  }
) {
  const size = terrain.length;
  const tileSize = Math.max(canvasWidth, canvasHeight) / size;

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.lineWidth = 0;
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
        isoTransform(
          x,
          Math.max(terrain[i][j] * heightScaleFactor, waterLevel),
          y
        ),
        isoTransform(
          x + tileSize,
          Math.max(terrain[i + 1][j] * heightScaleFactor, waterLevel),
          y
        ),
        isoTransform(
          x,
          Math.max(terrain[i][j + 1] * heightScaleFactor, waterLevel),
          y + tileSize
        ),
        isoTransform(
          x + tileSize,
          Math.max(terrain[i + 1][j + 1] * heightScaleFactor, waterLevel),
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
  heightScaleFactor: number;
  alpha: number;
  lightDirection: [number, number, number];
  lightColor: string;
  lightIntensity: number;
  waterLevel: number;
  landBaseColor: string;
  waterBaseColor: string;
  scale: number;
}

export const Terrain: React.FC<TerrainProps> = ({
  seed,
  scaleFactor = 10,
  alpha,
  canvasHeight = 600,
  canvasWidth = 800,
  terrainSize = 32,
  heightScaleFactor = 100,
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
    const generatedTerrain = terrainGenerator.generate(terrainSize);
    setTerrain(generatedTerrain);
  }, [seed, terrainSize, scaleFactor]);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      renderTerrain(context, terrain, {
        alpha,
        canvasWidth,
        canvasHeight,
        heightScaleFactor,
        landBaseColor,
        lightDirection,
        lightIntensity,
        lightColor,
        scale,
        waterBaseColor,
        waterLevel,
      });
    }
  }, [
    terrain,
    alpha,
    canvasWidth,
    canvasHeight,
    scale,
    heightScaleFactor,
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
