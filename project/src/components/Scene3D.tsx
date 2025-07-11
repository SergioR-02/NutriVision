import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Componente del modelo 3D
function Model() {
  const { scene } = useGLTF('/sandwich_assembly.glb');
  const meshRef = useRef<THREE.Group>(null);

  // Animación de rotación sutil
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive 
        object={scene} 
        scale={1.4} 
        position={[0, -0.5, 0]} 
        rotation={[+0.9, 0, 0]}
      />
    </group>
  );
}

// Precargar el modelo
useGLTF.preload('/sandwich_assembly.glb');

// Componente principal de la escena 3D
export default function Scene3D() {
  return (
    <div className="w-full h-80 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl overflow-hidden shadow-lg">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Model />
        </Suspense>

        {/* OrbitControls para zoom con scroll y movimiento con click - más libre */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={8}
          enableDamping={true}
          dampingFactor={0.05}
          autoRotate={false}
          autoRotateSpeed={0}
        />

        {/* Iluminación */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} />

        {/* Entorno HDR para reflexiones */}
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
