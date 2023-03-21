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
  lightColor: string = '#fff'
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
        isoTransform(x, terrain[i][j] * heightScale, y),
        isoTransform(x + tileSize, terrain[i + 1][j] * heightScale, y),
        isoTransform(x, terrain[i][j + 1] * heightScale, y + tileSize),
        isoTransform(
          x + tileSize,
          terrain[i + 1][j + 1] * heightScale,
          y + tileSize
        ),
      ];

      drawTriangle(
        context,
        [points[0], points[1], points[2]],
        '#008000',
        lightColor,
        lightDirection,
        lightIntensity
      );
      drawTriangle(
        context,
        [points[1], points[2], points[3]],
        '#008000',
        lightColor,
        lightDirection,
        lightIntensity
      );
    }
  }
}

interface TerrainProps {
  seed?: number;
  scaleFactor?: number;
  alpha: number;
  canvasHeight: number;
  canvasWidth: number;
  cells: number;
  scale: number;
  lightDirection: [number, number, number];
  lightColor: string;
  lightIntensity: number;
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
        lightColor
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
  ]);

  return (
    <div>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </div>
  );
};

export default Terrain;
