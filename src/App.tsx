import { useState, useEffect, useRef } from 'react';
import { useTerrainWorker } from './useTerrainWorker';
import { renderTerrain } from './Renderer'; // 
import Terrain3D from './Terrain3D';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './index.css';

export default function App() {
    
    const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');

    const [seed, setSeed] = useState<string>("Seed");
    const [size, setSize] = useState<number>(256); 
    const [dropoff, setDropoff] = useState<number>(1.2);
    const [falloff, setFalloff] = useState<number>(2.5);
    const [noiseScale, setNoiseScale] = useState<number>(4.0);
    const [islandSize, setIslandSize] = useState<number>(1.5);
    const [smoothness, setSmoothness] = useState<number>(0.5); 
    const [elevation, setElevation] = useState<number>(50);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const heightMap = useTerrainWorker({ seed, size, dropoff, falloff, noiseScale, islandSize, smoothness });

    
    useEffect(() => {
        if (viewMode === '2D' && canvasRef.current && heightMap) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                renderTerrain(heightMap, size, ctx);
            }
        }
    }, [heightMap, size, viewMode]);

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
            
            {/* Left Panel: The Sidebar */}
            <div style={{ width: '320px', minWidth: '320px', backgroundColor: '#242424', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '4px 0 15px rgba(0,0,0,0.5)', zIndex: 10, overflowY: 'auto' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#4CAF50' }}>Island Generator</h2>
                
                {/*Toggle Buttons  */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                    <button 
                        onClick={() => setViewMode('2D')}
                        style={{ flex: 1, padding: '10px', cursor: 'pointer', border: 'none', borderRadius: '4px', fontWeight: 'bold', backgroundColor: viewMode === '2D' ? '#4CAF50' : '#444', color: 'white' }}
                    >
                        2D Map
                    </button>
                    <button 
                        onClick={() => setViewMode('3D')}
                        style={{ flex: 1, padding: '10px', cursor: 'pointer', border: 'none', borderRadius: '4px', fontWeight: 'bold', backgroundColor: viewMode === '3D' ? '#4CAF50' : '#444', color: 'white' }}
                    >
                        3D Mesh
                    </button>
                    
                </div>

                {/* Sliders */}
                
                <label>Seed Text:<input type="text" value={seed} onChange={(e) => setSeed(e.target.value)} /></label>
                <label>Smoothness ({smoothness}):<input type="range" min="0.1" max="0.9" step="0.05" value={smoothness} onChange={(e) => setSmoothness(parseFloat(e.target.value))} /></label>
                {viewMode === '3D' && (
                    <label>3D Elevation ({elevation}):<input type="range" min="10" max="150" step="5" value={elevation} onChange={(e) => setElevation(parseInt(e.target.value))} /></label>
                )}
                <label>Drop-off ({dropoff}):<input type="range" min="0" max="3" step="0.1" value={dropoff} onChange={(e) => setDropoff(parseFloat(e.target.value))} /></label>
                <label>Falloff ({falloff}):<input type="range" min="0.1" max="5" step="0.1" value={falloff} onChange={(e) => setFalloff(parseFloat(e.target.value))} /></label>
                <label>Noise Scale ({noiseScale}):<input type="range" min="1" max="20" step="0.5" value={noiseScale} onChange={(e) => setNoiseScale(parseFloat(e.target.value))} /></label>
                <label>Island Size ({islandSize}):<input type="range" min="0.5" max="3" step="0.1" value={islandSize} onChange={(e) => setIslandSize(parseFloat(e.target.value))} /></label>
            </div>

            {/* Right Panel */}
            <div style={{ flex: 1, backgroundColor: viewMode === '3D' ? '#87CEEB' : '#111', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                
                {/* Conditional Rendering: Show 2D Canvas OR 3D Canvas */}
                {viewMode === '2D' ? (
                    
                    <canvas 
                        ref={canvasRef} 
                        width={size} 
                        height={size} 
                        style={{ 
                            border: '2px solid #333', 
                            borderRadius: '8px', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                            width: '512px', 
                            height: '512px', 
                            imageRendering: 'pixelated' 
                        }}
                    />

                ) : (

                    <Canvas camera={{ position: [0, 150, 250], fov: 60 }}>
                        <OrbitControls makeDefault />
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[100, 200, 50]} intensity={1.5} castShadow />

                        {heightMap && <Terrain3D heightMap={heightMap} size={size} elevation={elevation} />}
                        
                        {/* The 3D Water Plane */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
                            <planeGeometry args={[size, size]} />
                            <meshStandardMaterial color="#0055ff" transparent={true} opacity={0.6} roughness={0.1} metalness={0.5} />
                        </mesh>
                    </Canvas>

                )}
            </div>
            
        </div>
    );
}