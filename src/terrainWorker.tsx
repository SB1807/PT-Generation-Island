import { createNoise2D } from 'simplex-noise';
import seedrandom from 'seedrandom';

// 1. The Strict Contract
export interface TerrainConfig {
    seed: string;
    size: number;
    dropoff: number;    
    falloff: number;    
    noiseScale: number; 
    islandSize: number; 
    smoothness: number;
}

// 2. The Background Listener
self.onmessage = (event: MessageEvent<TerrainConfig>) => {
    const { seed, size, dropoff, falloff, noiseScale, islandSize, smoothness } = event.data;

    // Initialize Math Engines
    const rng = seedrandom(seed);
    const noise2D = createNoise2D(rng);
    console.log("SMOOTHNESS IN WORKER:", smoothness);

    // Allocate memory
    const heightMap = new Float32Array(size * size);

    // --- FBM SETTINGS ---
    // (Engineering tip: If you want, you can make these React sliders later!)
    const octaves = 4;       // How many layers of noise to stack
    const persistence = 1.0 - smoothness; // How much height each successive layer loses (50%)
    const lacunarity = 2.0;  // How much detail each successive layer gains (200%)
    

    // 3. The Generation Loop
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            
            // Step A: Normalize grid coordinates (-1.0 to 1.0)
            const nx = 2 * (x / size) - 1;
            const ny = 2 * (y / size) - 1;

            // Step B: Calculate Euclidean distance from center, scaled by islandSize
            const distance = Math.sqrt(nx * nx + ny * ny) / islandSize;

            // --- THE FBM ALGORITHM (Smoothing the Spikes) ---
            let noiseHeight = 0;
            let amplitude = 1.0;
            let frequency = 1.0;
            let maxAmplitude = 0; 

            for (let i = 0; i < octaves; i++) {
                // Generate noise for this specific layer
                const layerNoise = noise2D(nx * noiseScale * frequency, ny * noiseScale * frequency);
                
                // Add it to the total height
                noiseHeight += layerNoise * amplitude;
                
                // Track max amplitude to normalize later
                maxAmplitude += amplitude;
                
                // Adjust variables for the next, smaller layer of detail
                amplitude *= persistence;
                frequency *= lacunarity;
            }

            // Normalize the final noiseHeight back down to a -1.0 to 1.0 range
            noiseHeight = noiseHeight / maxAmplitude;

            // Convert to 0.0 to 1.0 range for our math
            const normalizedNoise = (noiseHeight + 1) / 2;

            // Step C: Apply the Island Distance Mask
            let finalHeight = normalizedNoise - (dropoff * Math.pow(distance, falloff));

            // Clamp so the deep ocean floor flatlines instead of infinitely dropping
            finalHeight = Math.max(-1.0, finalHeight);

            // Step D: Map 2D coordinate to 1D array index
            const index = (y * size) + x;
            heightMap[index] = finalHeight;
            

            
        }
    }

    // 4. Transfer ownership of the memory buffer back to React
    const workerScope = self as unknown as DedicatedWorkerGlobalScope;
    workerScope.postMessage(heightMap.buffer, [heightMap.buffer]);
};