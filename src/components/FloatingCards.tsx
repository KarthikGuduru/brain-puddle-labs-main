import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Card = ({ position, rotation, scale, color }: any) => {
    const mesh = useRef<THREE.Mesh>(null);

    // Add subtle movement or interaction here if needed

    return (
        <Float
            speed={2} // Animation speed
            rotationIntensity={1} // XYZ rotation intensity
            floatIntensity={2} // Up/down float intensity
        >
            <RoundedBox
                ref={mesh}
                args={[1.8, 1.2, 0.1]} // Width, height, depth
                radius={0.1}
                smoothness={4}
                position={position}
                rotation={rotation}
                scale={scale}
            >
                <meshPhysicalMaterial
                    color={color}
                    roughness={0.1}
                    metalness={0.1}
                    transmission={0.5} // Glass-like
                    thickness={1.5}
                    clearcoat={1}
                />
            </RoundedBox>
        </Float>
    );
};

const FloatingCards: React.FC = () => {
    const { viewport } = useThree();
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            // Parallax effect based on mouse position
            const x = (state.mouse.x * viewport.width) / 10;
            const y = (state.mouse.y * viewport.height) / 10;

            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.2, 0.1);
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.2, 0.1);
        }
    });

    const cards = [
        { position: [0, 0, 0], rotation: [0, 0, 0.2], scale: 1.2, color: "#00D9FF" },
        { position: [-2, 1, -1], rotation: [0.2, 0.2, -0.2], scale: 0.9, color: "#7B61FF" },
        { position: [2, -1, -2], rotation: [-0.2, -0.2, 0.2], scale: 1, color: "#B84CFF" },
        { position: [-1.5, -2, -1.5], rotation: [0.1, 0, 0.5], scale: 0.8, color: "#FFFFFF" },
        { position: [1.8, 2, -1], rotation: [0, 0.2, -0.4], scale: 0.85, color: "#00D9FF" },
    ];

    return (
        <>
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} />
            <pointLight position={[-10, -10, -5]} intensity={1} color="#7B61FF" />

            {/* Environment for reflections */}
            <Environment preset="city" />

            <group ref={group}>
                {cards.map((card, index) => (
                    <Card key={index} {...card} />
                ))}
                {/* Central glowing orb for "magic" effect */}
                <mesh position={[0, 0, -2]}>
                    <sphereGeometry args={[1.5, 32, 32]} />
                    <meshBasicMaterial color="#7B61FF" transparent opacity={0.2} />
                </mesh>
            </group>
        </>
    );
};

export default FloatingCards;
