
import React, { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, TorusKnot } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

// UI component for toolbar buttons
const ToolbarButton: React.FC<{ title: string; onClick: () => void; children: React.ReactNode }> = ({ title, onClick, children }) => (
    <button
        title={title}
        onClick={onClick}
        className="w-9 h-9 flex items-center justify-center bg-gray-800/60 hover:bg-gray-700/80 rounded-md text-gray-200 transition-colors backdrop-blur-sm"
    >
        {children}
    </button>
);


// Component to load and display the geometry
const Model: React.FC<{ 
    file: File | null; 
    onLoad: () => void; 
    onError: (err: string) => void;
    setWireframe: (setter: (v: boolean) => void) => void;
}> = ({ file, onLoad, onError, setWireframe }) => {
    const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

    useEffect(() => {
        // Expose a function to the parent to toggle wireframe without re-rendering this component
        setWireframe((v: boolean) => {
            if (materialRef.current) {
                materialRef.current.wireframe = v;
            }
        });
    }, [setWireframe]);

    useEffect(() => {
        if (file) {
            if (!file.name.toLowerCase().endsWith('.stl')) {
                onError(`.${file.name.split('.').pop()} preview is not supported. Displaying placeholder.`);
                setGeometry(null); // Fallback to placeholder
                return;
            }

            const loader = new STLLoader();
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                try {
                    const contents = e.target?.result;
                    if (contents) {
                        const geom = loader.parse(contents as ArrayBuffer);
                        geom.computeBoundingBox();
                        if (geom.boundingBox) {
                            const center = new THREE.Vector3();
                            geom.boundingBox.getCenter(center);
                            geom.translate(-center.x, -center.y, -center.z);
                        }
                        setGeometry(geom);
                        onLoad();
                    } else {
                        throw new Error("File content is empty.");
                    }
                } catch (err) {
                    console.error("Failed to parse STL file:", err);
                    onError("Error loading STL file. Displaying placeholder.");
                    setGeometry(null);
                }
            };
            fileReader.onerror = () => {
                 onError("Failed to read file. Displaying placeholder.");
                 setGeometry(null);
            };
            fileReader.readAsArrayBuffer(file);
        } else {
            setGeometry(null); // No file, so use placeholder
        }
    }, [file, onLoad, onError]);

    return (
        <Suspense fallback={null}>
            {geometry ? (
                 <mesh geometry={geometry}>
                    <meshStandardMaterial ref={materialRef} color="#3b82f6" />
                </mesh>
            ) : (
                <TorusKnot args={[1, 0.4, 128, 16]}>
                    <meshStandardMaterial ref={materialRef} color="#3b82f6" />
                </TorusKnot>
            )}
        </Suspense>
    );
};

// Main Viewport Component
export const ModelViewport: React.FC<{ geometryFile: File | null }> = ({ geometryFile }) => {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const [copied, setCopied] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const wireframeSetter = useRef<((v: boolean) => void) | null>(null);
    const isWireframeOn = useRef(false);

    const setView = useCallback((position: [number, number, number]) => {
        if (controlsRef.current) {
            controlsRef.current.object.position.fromArray(position);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }
    }, []);

    const resetView = useCallback(() => {
        controlsRef.current?.reset();
    }, []);

    const toggleWireframe = useCallback(() => {
        isWireframeOn.current = !isWireframeOn.current;
        wireframeSetter.current?.(isWireframeOn.current);
    }, []);

    const handleSetWireframe = useCallback((setter: (v: boolean) => void) => {
        wireframeSetter.current = setter;
    }, []);

    const handleShare = async () => {
        const shareData = {
            title: 'EnsumuSpace 3D Model',
            text: 'Check out this 3D model in the EnsumuSpace Unification Platform!',
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error('Sharing/Copying failed:', err);
        }
    };
    
    const handleModelError = useCallback((message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 5000); // Hide after 5 seconds
    }, []);

    const handleModelLoad = useCallback(() => {
        setNotification(null); // Clear any previous errors on successful load
    }, []);

    return (
        <div className="w-full h-full bg-gray-800/50 rounded-lg border border-gray-700 shadow-xl flex flex-col">
            <div className="p-3 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-white">Geometry Viewport (Three.js)</h3>
            </div>
            <div className="flex-1 min-h-0 relative">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <Stage environment="city" intensity={0.6} adjustCamera={1.2}>
                         <Model 
                            file={geometryFile} 
                            onError={handleModelError} 
                            onLoad={handleModelLoad}
                            setWireframe={handleSetWireframe}
                         />
                    </Stage>
                    <OrbitControls ref={controlsRef} makeDefault />
                </Canvas>

                {notification && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-yellow-600/80 text-white text-xs font-semibold px-3 py-1.5 rounded-md backdrop-blur-sm animate-fade-in">
                        {notification}
                    </div>
                )}

                <div className="absolute top-2 left-2 flex flex-col space-y-1.5 p-1.5 rounded-lg border border-gray-700/50 bg-gray-900/40">
                    <ToolbarButton title="Reset View" onClick={resetView}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5"/></svg>
                    </ToolbarButton>
                    <ToolbarButton title="Top View" onClick={() => setView([0, 5, 0.01])}>
                        <span className="font-mono font-bold">T</span>
                    </ToolbarButton>
                    <ToolbarButton title="Front View" onClick={() => setView([0, 0, 5])}>
                        <span className="font-mono font-bold">F</span>
                    </ToolbarButton>
                    <ToolbarButton title="Side View" onClick={() => setView([5, 0, 0])}>
                        <span className="font-mono font-bold">S</span>
                    </ToolbarButton>
                    <ToolbarButton title="Toggle Wireframe" onClick={toggleWireframe}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    </ToolbarButton>
                    <ToolbarButton title="Share Model" onClick={handleShare}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/></svg>
                    </ToolbarButton>

                    {copied && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md animate-fade-in">
                            Copied!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};