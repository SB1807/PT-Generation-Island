import { useEffect, useState, useRef } from "react";
import type { TerrainConfig } from './terrainWorker';
import TerrainWorker from './terrainWorker?worker';

export function useTerrainWorker(config: TerrainConfig) {
    const [heightMap, setHeightMap] = useState<Float32Array | null>(null);
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        // 3. We simply instantiate the magic import here! No URLs needed.
        workerRef.current = new TerrainWorker();

        // Listen for the completed ArrayBuffer from the background thread
        workerRef.current.onmessage = (event: MessageEvent<ArrayBuffer>) => {
            // Re-wrap the raw memory back into a Float32Array
            setHeightMap(new Float32Array(event.data));
        };

        // Kill the background thread if we close the app
        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    useEffect(() => {
        if (workerRef.current) {
            workerRef.current.postMessage(config);
        }
    }, [config.seed, config.size, config.dropoff, config.falloff, config.noiseScale, config.islandSize, config.smoothness]);
    
    return heightMap;
}