import { useEffect, useRef } from "react";

const cellHeight = 7;
const cellWidth = 7;

export type Terrain = {
    altitudes: number[][]
}

type Viewer = {
    height: number;
    width: number;
}

type RenderTerrainProps = Terrain & {
    project: Project,
    canvas: HTMLCanvasElement | null
}

type Coordinates = {
    x: number;
    y: number;
    z?: number;
}

function altitudesToCoordinates(altitudes: number[][]): Coordinates[][] {
    if (altitudes.length === 0) {return [];}
    if (altitudes[0].length === 0) {return [];}
    const height = altitudes.length;
    const width = altitudes[0].length;
    const result = [] as Coordinates[][];
    for (let y = 0; y < height; y++) {
        const row = [] as Coordinates[];
        for (let x = 0; x < width; x++) {
            row.push({x, y, z: altitudes[y][x]});
        }
        result.push(row)
    }
    return result;
}

export const TerrainViewer = ({altitudes, height, width}: Terrain & Viewer) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const project = new Project(altitudesToCoordinates(altitudes));
            console.log(project);
            renderTerrain({altitudes, project, canvas});
        }}, [altitudes]);
    
    return <canvas ref={canvasRef} height={height} width={width} />;
}

class Project {
    constructor(private coordinates: Coordinates[][]) {}
    get(column: number, row: number) {
        if (!this.coordinates[row] || !this.coordinates[row][column]) {
            console.log('coordinate not found at ', row, column);
            return [0, 0];
        }
        const coords = this.coordinates[row][column];
        const x = 50 + coords.x * cellWidth + Math.SQRT1_2 * coords.y * cellHeight;
        const y = 50 + coords.y * cellHeight * Math.SQRT1_2 - (coords.z || 0);
        return [x, y];
    }
    drawFacet(ctx: CanvasRenderingContext2D, column: number, row: number) {
        const coords = [
            [column + 1, row],
            [column + 1, row + 1],
            [column, row + 1],
            [column, row]
        ].map(([column, row]) => this.get(column, row))
        
        const firstPoint = this.get(column, row);
        ctx.moveTo(firstPoint[0], firstPoint[1]);

        for (const [x, y] of coords) {
            ctx.lineTo(x, y);
        }
    }
}


function renderTerrain({altitudes, project, canvas}: RenderTerrainProps) {
    if (canvas === null || altitudes.length === 0) {return;}
    const ctx = canvas.getContext('2d');
    if (ctx === null) {return;}
    const {height, width} = canvas;
    
    ctx.beginPath();
    for (let row = 0; row < altitudes.length - 1; row++) {
        for (let col = 0; col < altitudes[row].length - 1; col++) {
            project.drawFacet(ctx, col, row);
        }
    }
    ctx.closePath();
    ctx.stroke();
}
