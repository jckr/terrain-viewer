import { applyLightingToColor, blendColors, calculateLighting } from './color-helpers';

export type Point = {
  x: number;
  y: number;
  z: number;
};

const calculateNormal = (p1: Point, p2: Point, p3: Point): [number, number, number] => {
  const edge1 = {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
    z: p2.z - p1.z,
  };

  const edge2 = {
    x: p3.x - p1.x,
    y: p3.y - p1.y,
    z: p3.z - p1.z,
  };

  const normal = {
    x: edge1.y * edge2.z - edge1.z * edge2.y,
    y: edge1.z * edge2.x - edge1.x * edge2.z,
    z: edge1.x * edge2.y - edge1.y * edge2.x,
  };

  const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);

  return [normal.x / length, normal.y / length, normal.z / length];
};

export function drawTriangle(
  context: CanvasRenderingContext2D,
  points: Point[],
  baseColor: string,
  lightColor: string,
  lightDirection: [number, number, number],
  lightIntensity: number
) {
  // Calculate the normal vector for the triangle
  const normal = calculateNormal(points[0], points[1], points[2]);

  // Calculate the lighting value based on the normal vector and light parameters
  const lighting = calculateLighting(normal, lightDirection, lightIntensity);

  // Blend the base color with the light color based on the lighting value
  const color = blendColors(baseColor, lightColor, lighting);
  // console.log(points);
  // Draw the triangle with the final color
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  context.lineTo(points[1].x, points[1].y);
  context.lineTo(points[2].x, points[2].y);
  context.closePath();
  context.fillStyle = color;
  context.strokeStyle = color;
  context.fill();
  context.stroke();
}
