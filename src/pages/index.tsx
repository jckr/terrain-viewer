import React, { useState } from 'react';
import { Terrain } from '@/components/terrain';

interface State {
  waterLevel: number;
  heightScaleFactor: number;
  terrainSize: number;
  alpha: number;
  scale: number;
}

type Action =
  | { type: 'SET_WATER_LEVEL'; payload: number }
  | { type: 'SET_HEIGHT_SCALE_FACTOR'; payload: number }
  | { type: 'SET_TERRAIN_SIZE'; payload: number }
  | { type: 'SET_ALPHA'; payload: number }
  | { type: 'SET_SCALE'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_WATER_LEVEL':
      return { ...state, waterLevel: action.payload };
    case 'SET_HEIGHT_SCALE_FACTOR':
      return { ...state, heightScaleFactor: action.payload };
    case 'SET_TERRAIN_SIZE':
      return { ...state, terrainSize: action.payload };
    case 'SET_ALPHA':
      return { ...state, alpha: action.payload };
    case 'SET_SCALE':
      return { ...state, scale: action.payload };
    default:
      return state;
  }
}

const initialState: State = {
  waterLevel: 0,
  heightScaleFactor: 50,
  terrainSize: 64,
  alpha: 100,
  scale: 0.5,
};

const TerrainPage: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { alpha, heightScaleFactor, terrainSize, scale, waterLevel } = state;

  const handleAlphaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_ALPHA', payload: parseFloat(event.target.value) });
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_SCALE',
      payload: parseFloat(event.target.value),
    });
  };

  const handleHeightScaleFactor = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: 'SET_HEIGHT_SCALE_FACTOR',
      payload: parseFloat(event.target.value),
    });
  };

  const handleTerrainSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: 'SET_TERRAIN_SIZE',
      payload: parseFloat(event.target.value),
    });
  };

  const handleWaterLevelChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: 'SET_WATER_LEVEL',
      payload: parseFloat(event.target.value),
    });
  };

  return (
    <div>
      <Terrain
        canvasHeight={600}
        canvasWidth={800}
        seed={12345}
        alpha={alpha}
        scale={scale}
        terrainSize={terrainSize}
        scaleFactor={10}
        heightScaleFactor={heightScaleFactor}
        lightDirection={[0.5, 0.5, 0.5]}
        lightColor={'#ffff00'}
        lightIntensity={0.5}
        waterLevel={waterLevel}
        landBaseColor={'#228b22'}
        waterBaseColor={'#0077be'}
      />
      <div>
        <label htmlFor='alpha'>Alpha:</label>
        <input
          type='range'
          id='alpha'
          name='alpha'
          min='0'
          max='360'
          step='1'
          value={alpha}
          onChange={handleAlphaChange}
        />
        <span>{alpha.toFixed(1)}</span>
      </div>
      <div>
        <label htmlFor='scale'>Scale:</label>
        <input
          type='range'
          id='scale'
          name='scale'
          min='0.1'
          max='2'
          step='0.05'
          value={scale}
          onChange={handleScaleChange}
        />
        <span>{scale.toFixed(1)}</span>
      </div>
      {/* handleHeightScaleFactor */}
      <div>
        <label htmlFor='scale'>Height Scale:</label>
        <input
          type='range'
          id='heightScaleFactor'
          name='heightScaleFactor'
          min='1'
          max='200'
          step='1'
          value={heightScaleFactor}
          onChange={handleHeightScaleFactor}
        />
        <span>{heightScaleFactor.toFixed(1)}</span>
      </div>
      {/* handleTerrainSizeChange */}
      <div>
        <label htmlFor='scale'>Terrain Size:</label>
        <input
          type='range'
          id='TerrainSize'
          name='TerrainSize'
          min='10'
          max='256'
          step='1'
          value={terrainSize}
          onChange={handleTerrainSizeChange}
        />
        <span>{terrainSize.toFixed(1)}</span>
      </div>
      {/* handleWaterLevelChange */}
      <div>
        <label htmlFor='scale'>Water Level:</label>
        <input
          type='range'
          id='waterLevel'
          name='waterLevel'
          min='-100'
          max='100'
          step='1'
          value={waterLevel}
          onChange={handleWaterLevelChange}
        />
        <span>{waterLevel.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default TerrainPage;
