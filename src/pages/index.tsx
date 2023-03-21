import React, { useState } from "react";
import { Terrain } from '@/components/terrain'

const TerrainPage: React.FC = () => {
  const [alpha, setAlpha] = useState(0);
  const [scale, setScale] = useState(0.3);

  const handleAlphaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlpha(parseFloat(event.target.value));
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(event.target.value));
  };

  return (
    <div>
      <Terrain canvasHeight={600} canvasWidth={800} cells={32} seed={12345} alpha={alpha} scale={scale} />
      <div>
        <label htmlFor="alpha">Alpha:</label>
        <input
          type="range"
          id="alpha"
          name="alpha"
          min="0"
          max="360"
          step="1"
          value={alpha}
          onChange={handleAlphaChange}
        />
        <span>{alpha.toFixed(1)}</span>
      </div>
      <div>
        <label htmlFor="scale">Scale:</label>
        <input
          type="range"
          id="scale"
          name="scale"
          min="0.1"
          max="2"
          step="0.05"
          value={scale}
          onChange={handleScaleChange}
        />
        <span>{scale.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default TerrainPage;