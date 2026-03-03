import { createNoise2D } from 'simplex-noise';
import seedrandom from 'seedrandom';

export interface TerrainConfig {
    seed: string;
    size: number;
    dropoff: number;    
    falloff: number;    
    noiseScale: number; 
    islandSize: number; 
    smoothness: number;
}


self.onmessage = (event: MessageEvent<TerrainConfig>) => {
    const { seed, size, dropoff, falloff, noiseScale, islandSize, smoothness } = event.data;

    const rng = seedrandom(seed);
    const noise2D = createNoise2D(rng);
    console.log("SMOOTHNESS IN WORKER:", smoothness);
    console.log("SMOOTHNESS IN WORKER:", smoothness);
   
    const heightMap = new Float32Array(size * size);

    
    const octaves = 4;       // How many layers of noise to stack
    const persistence = 1.0 - smoothness; // How much height each successive layer loses 
    const lacunarity = 2.0;  // How much detail each successive layer gains 
    


    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
        
            const nx = 2 * (x / size) - 1;
            const ny = 2 * (y / size) - 1;

            const distance = Math.sqrt(nx * nx + ny * ny) / islandSize;

            //smoothing the spikes
            let noiseHeight = 0;
            let amplitude = 1.0;
            let frequency = 1.0;
            let maxAmplitude = 0; 

            //generates noise

            for (let i = 0; i < octaves; i++) {
                const layerNoise = noise2D(nx * noiseScale * frequency, ny * noiseScale * frequency);
                noiseHeight += layerNoise * amplitude;
                maxAmplitude += amplitude;
                amplitude *= persistence;
                frequency *= lacunarity;
            }
            noiseHeight = noiseHeight / maxAmplitude;
            const normalizedNoise = (noiseHeight + 1) / 2;

            let finalHeight = normalizedNoise - (dropoff * Math.pow(distance, falloff));
            finalHeight = Math.max(-1.0, finalHeight);
            const index = (y * size) + x;
            heightMap[index] = finalHeight;
            

            
        }
    }

    const workerScope = self as unknown as DedicatedWorkerGlobalScope;
    workerScope.postMessage(heightMap.buffer, [heightMap.buffer]);
};