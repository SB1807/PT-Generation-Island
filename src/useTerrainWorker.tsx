import { useEffect, useState, useRef } from "react";
import type { TerrainConfig } from './terrainWorker';
import TerrainWorker from './terrainWorker?worker';

export function useTerrainWorker(config: TerrainConfig) {
    const [heightMap, setHeightMap] = useState<Float32Array | null>(null);
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        
        workerRef.current = new TerrainWorker();
        workerRef.current.onmessage = (event: MessageEvent<ArrayBuffer>) => {
            setHeightMap(new Float32Array(event.data));
        };

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