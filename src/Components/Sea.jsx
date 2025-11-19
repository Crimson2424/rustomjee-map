import React from "react";
import { MultiMaterial, useGLTF } from "@react-three/drei";
import { PerformantOceanMaterial } from "./Performantoceanmaterial";

export function Sea({ foamObjects = [], foamRadius, foamStrength, ...props }) {
  const { nodes, materials  } = useGLTF("models/Sea-Latest.glb");

  return (
    <group {...props} dispose={null}>
      {/* <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sea.geometry}
        material={materials['water.001']}
        scale={0.0254}
      >
        <PerformantOceanMaterial
            foamObjects={foamObjects}
            foamRadius={foamRadius}
            foamStrength={foamStrength}
          />
      </mesh> */}
      <mesh
        castShadow
        receiveShadow
        userData={{ lensflare: 'no-occlusion' }}
        geometry={nodes.Sea.geometry}
        scale={0.0254}
        position={[0, -0.7, 0]}
      >
        
          <PerformantOceanMaterial
            foamObjects={foamObjects}
            foamRadius={foamRadius}
            foamStrength={foamStrength}
          />
        
      </mesh>
      <mesh
        castShadow
        receiveShadow
        userData={{ lensflare: 'no-occlusion' }}
        geometry={nodes['Sea-Small'].geometry}
        scale={0.0254}
        // position={[0, -1.2, 0]}
      >
       
          <PerformantOceanMaterial
            foamObjects={foamObjects}
            foamRadius={foamRadius}
            foamStrength={foamStrength}
          />
        
      </mesh>
    </group>
  );
}

useGLTF.preload("models/Sea-Latest.glb");
