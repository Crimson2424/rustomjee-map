import React from "react";
import { MultiMaterial, useGLTF } from "@react-three/drei";
import { PerformantOceanMaterial } from "./Performantoceanmaterial";

export function Sea({ foamObjects = [], foamRadius, foamStrength, ...props }) {
  const { nodes } = useGLTF("models/Sea-Basicglb.glb");

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sea.geometry}
        position={[0, 1.2, 0]}
      >
        <MultiMaterial>
          <PerformantOceanMaterial
            foamObjects={foamObjects}
            foamRadius={foamRadius}
            foamStrength={foamStrength}
          />
        </MultiMaterial>
      </mesh>
    </group>
  );
}

useGLTF.preload("models/Sea-Basicglb.glb");
