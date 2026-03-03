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
<img width="1898" height="919" alt="2D_island" src="https://github.com/user-attachments/assets/a1a1649b-9c77-4f8b-87ac-a38229790454" />


### 3D MODE

<img width="1885" height="911" alt="3D_island" src="https://github.com/user-attachments/assets/794da83f-6708-445c-a879-c482e9df38a2" />


### Future work:

1. Adding more noise models to chose from  (e.g Perlin Noise, Cellular Noise)
2. Adding biomes
3. Adding randomly generated for drcoration (trees, rocks, etc)

