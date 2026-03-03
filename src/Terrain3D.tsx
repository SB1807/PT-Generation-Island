import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Terrain3DProps {
    heightMap: Float32Array;
    size: number;
    elevation: number;
}

export default function Terrain3D({ heightMap, size, elevation }: Terrain3DProps) {
    const geometryRef = useRef<THREE.PlaneGeometry>(null);

    useEffect(() => {
        if (!geometryRef.current || !heightMap) return;

        const geometry = geometryRef.current;
        const positions = geometry.attributes.position.array;

        
        // We also want to keep our biome colors! We do this using Vertex Colors.
        const colors = new Float32Array(positions.length);

        // Loop through the geometry's vertices
        for (let index = 0; index < heightMap.length; index++) {
            const height = heightMap[index];
            
            // 1. DISPLACE THE GEOMETRY
            // A vertex has 3 coordinates (X, Y, Z). 
            // We want to push the Z-axis up. Z is every 3rd element in the position array.
            positions[index * 3 + 2] = height * elevation; // Multiply by 50 to make mountains tall

            // 2. APPLY BIOME COLORS
            let color = new THREE.Color();
            if (height < 0.0) {
                color.setRGB(0.1, 0.3 + (height * 0.2), 0.8 + (height * 0.2)); // Ocean
            } else if (height < 0.05) {
                color.setHex(0xd2be82); // Sand
            } else if (height < 0.4) {
                color.setRGB(0.2, 0.6 - (height * 0.8), 0.2); // Grass
            } else if (height < 0.7) {
                color.setHex(0x828282); // Rock
            } else {
                color.setHex(0xfafafa); // Snow
            }

            colors[index * 3] = color.r;
            colors[index * 3 + 1] = color.g;
            colors[index * 3 + 2] = color.b;
        }

        // 3. Update the GPU
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.attributes.position.needsUpdate = true;
        
        // Recalculate how light bounces off the new jagged mountains
        geometry.computeVertexNormals(); 

    }, [heightMap, elevation]);

    return (
        // Rotate the plane so it lays flat like the ground, instead of standing up like a wall
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry 
                ref={geometryRef} 
                args={[size, size, size - 1, size - 1]} 
            />
            {/* vertexColors={true} tells the material to use our custom biome array */}
            <meshStandardMaterial vertexColors={true} wireframe={false} />
        </mesh>
    );
}