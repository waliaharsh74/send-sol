import * as THREE from 'three';
import { useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';

function Scene() {
    const { scene, camera, renderer } = useThree();

    useEffect(() => {
        // Set up camera position
        camera.position.z = 5;

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        // Create a plane geometry
        const geometry = new THREE.PlaneGeometry(5, 5);

        // Load the image texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('https://odm2zvzlsaenzdogms4fsizanwysl4hpderdib4kctdhpuuslyqa.arweave.net/cNms1yuQCNyNxmS4WSMgbbEl8O8ZIjQHihTGd9KSXiA', (texture) => {
            // Create a material with the loaded texture
            const material = new THREE.MeshBasicMaterial({ map: texture });

            // Create a mesh with the geometry and material
            const plane = new THREE.Mesh(geometry, material);

            // Add the plane to the scene
            scene.add(plane);
        });
    }, [scene, camera]);

    // Animation loop
    useFrame(() => {
        // Example: Rotate the plane
        scene.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                child.rotation.y += 0.01;
            }
        });
    });

    return null;
}

export default function App() {
    return (
        <Canvas>
            <Scene />
        </Canvas>
    );
}
