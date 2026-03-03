# Procedural Island Generator using Noise  (work in progress)

This project is a study on real-time procedural terrain generator built with **React, TypeScript and Vite and Three.js** to explore multi-threading and 3D graphics on the web. **By generating an island with realistic geographical features based on a seed**.

## Key Features 

* Dedicated Web Worker to offload hevay mathemathical computations to a background thread, ensuring the main user interfcae remains responsive
* The terrain elevation data is calculated using deterministic Simplex noise combined with Fractional Brownian Motion to generate geographical features.
* A field mask is applied to the raw noise array, shaping the infinite terrain into a defined, centralized island surrounded by ocean.
* Users can manipulate the island core proprieties --such as the randomized seed, physical size, edgedrop-off, and surface smoothness in real time .
* Users can choose between 2D topographic map  and 3D env

## Instalation and Setup 

1. **Node.js** needs to be instaled on your system to run the development server

2. ```npm install three @react-three/fiber @react-three/drei simplex-noise seedrandom ```

3. ```npm run dev```

## Preview 

### 2D MODE
![](images\2D_island.png)

### 3D MODE
![](images\3D_island.png)


### Future work:

1. Adding more noise models to chose from  (e.g Perlin Noise, Cellular Noise)
2. Adding biomes
3. Adding randomly generated for drcoration (trees, rocks, etc)

