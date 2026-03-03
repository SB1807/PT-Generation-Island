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
        const colors = new Float32Array(positions.length);

        for (let index = 0; index < heightMap.length; index++) {
            const height = heightMap[index];
            positions[index * 3 + 2] = height * elevation; // push the Z-axis up. Z is every 3rd element in the position array

            // apply  colors
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

    
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.attributes.position.needsUpdate = true;
        
        geometry.computeVertexNormals(); //recalculation of the light

    }, [heightMap, elevation]);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry 
                ref={geometryRef} 
                args={[size, size, size - 1, size - 1]} 
            />
            <meshStandardMaterial vertexColors={true} wireframe={false} />
        </mesh>
    );
}