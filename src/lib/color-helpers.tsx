export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

export function normalize(vector: [number, number, number]): [number, number, number] {
  const [x, y, z] = vector;
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
}

export function dot(vector1: [number, number, number], vector2: [number, number, number]): number {
  const [x1, y1, z1] = vector1;
  const [x2, y2, z2] = vector2;

  return x1 * x2 + y1 * y2 + z1 * z2;
}

export function blendColors(color1: string, color2: string, ratio: number): string {
  const c1 = parseInt(color1.substring(1), 16);
  const c2 = parseInt(color2.substring(1), 16);
  const r1 = (c1 >> 16) & 255;
  const g1 = (c1 >> 8) & 255;
  const b1 = c1 & 255;

  const r2 = (c2 >> 16) & 255;
  const g2 = (c2 >> 8) & 255;
  const b2 = c2 & 255;

  const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio);

  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function calculateLighting(
  normal: [number, number, number],
  lightDirection: [number, number, number],
  lightIntensity: number
): number {
  // Normalize the normal vector and light direction vector
  const normalizedNormal = normalize(normal);
  const normalizedLightDirection = normalize(lightDirection);

  // Calculate the dot product of the normal vector and light direction vector
  let dotProduct = dot(normalizedNormal, normalizedLightDirection);

  // If the dot product is negative, flip the normal vector
  if (dotProduct < 0) {
    dotProduct = -dotProduct;
  }

  // Calculate the lighting value by multiplying the dot product with the light intensity
  const lighting = dotProduct * lightIntensity;

  return lighting;
}

export const applyLightingToColor = (color: string, lighting: number) => {
  const colorRgb = hexToRgb(color);
  if (!colorRgb) {
    return color;
  }
  const newColorRgb = {
    r: Math.min(colorRgb.r * lighting, 255),
    g: Math.min(colorRgb.g * lighting, 255),
    b: Math.min(colorRgb.b * lighting, 255),
  };
  return rgbToHex(newColorRgb.r, newColorRgb.g, newColorRgb.b);
};