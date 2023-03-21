import { PerlinNoise } from './perlin-noise';

export class TerrainGenerator {
  private perlin: PerlinNoise;
  private scaleFactor: number;

  constructor(seed?: number, scaleFactor: number = 10) {
    this.perlin = new PerlinNoise(seed);
    this.scaleFactor = scaleFactor;
  }

  generate(n: number): number[][] {
    const terrain: number[][] = [];

    for (let i = 0; i < n; i++) {
      terrain[i] = [];
      for (let j = 0; j < n; j++) {
        const x = i / this.scaleFactor;
        const y = j / this.scaleFactor;
        const altitude = this.perlin.noise(x, y);
        terrain[i][j] = altitude;
      }
    }

    return terrain;
  }
}