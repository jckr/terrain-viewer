import { PerlinNoise } from './perlin-noise';

describe('PerlinNoise', () => {
  test('should generate consistent noise values with the same seed', () => {
    const perlin1 = new PerlinNoise(12345);
    const perlin2 = new PerlinNoise(12345);

    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 10;
      const y = Math.random() * 10;
      const z = Math.random() * 10;
      expect(perlin1.noise(x, y, z)).toBe(perlin2.noise(x, y, z));
    }
  });

  test('should generate different noise values with different seeds', () => {
    const perlin1 = new PerlinNoise(12345);
    const perlin2 = new PerlinNoise(67890);

    let differentValues = false;
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 10;
      const y = Math.random() * 10;
      const z = Math.random() * 10;
      if (perlin1.noise(x, y, z) !== perlin2.noise(x, y, z)) {
        differentValues = true;
        break;
      }
    }
    expect(differentValues).toBe(true);
  });
});
