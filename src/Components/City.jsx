import { MeshReflectorMaterial, useGLTF } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OceanMaterial } from "./OceanMaterial";
import { useSubdividedGeometry } from "./Usesubdividedgeometry";
import { PerformantOceanMaterial } from "./Performantoceanmaterial";
import { UnderwaterLand } from "./UnderwaterLand";
import { Sea } from "./Sea";

function InstancedTrees({ meshName, jsonFile, nodes, materials }) {
  const meshRef = useRef();
  const dummy = new THREE.Object3D();
  const [instances, setInstances] = useState(null);

  useEffect(() => {
    fetch(`/tree-data/${jsonFile}`)
      .then((res) => res.json())
      .then((data) => setInstances(data));
  }, [jsonFile]);

  useEffect(() => {
    if (!instances || !meshRef.current) return;

    instances.forEach((t, i) => {
      dummy.position.set(t.position[0], t.position[1], -t.position[2]);
      dummy.rotation.set(...t.rotation);
      dummy.scale.set(...t.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [instances]);

  if (!instances) return null;

  const geometry = nodes[meshName].geometry;
  const originalMat = materials[nodes[meshName].material.name];

  // ✅ Force MeshBasicMaterial for tree
  const material = new THREE.MeshBasicMaterial({
    map: originalMat?.map || null,
    transparent: true,
    alphaTest: 0.5,
    opacity: 1.0,
    side: THREE.DoubleSide,
  });

  if (material.map) {
    material.map.anisotropy = 16;
    material.map.minFilter = THREE.LinearMipmapLinearFilter;
    material.map.magFilter = THREE.LinearFilter;
    material.map.needsUpdate = true;
  }

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, instances.length]}>
      <primitive attach="geometry" object={geometry} />
      <primitive attach="material" object={material} />
    </instancedMesh>
  );
}

export function City(props) {
  const { nodes, materials } = useGLTF(
    "models/Rustomjee-3d-without-treess.glb"
  );

  const subdividedGeometry = useSubdividedGeometry(
    nodes.Retopo_Sea.geometry,
    2
  );

  // ✅ Convert ALL GLTF materials to MeshBasicMaterial
  Object.keys(materials).forEach((key) => {
    const old = materials[key];
    materials[key] = new THREE.MeshBasicMaterial({
      map: old.map ?? null,
      color: old.color ?? new THREE.Color(1, 1, 1),
      transparent: old.transparent ?? false,
      opacity: old.opacity ?? 1,
      alphaTest: old.alphaTest ?? 0,
      side: old.side ?? THREE.FrontSide,
    });

    if (materials[key].map) {
      materials[key].map.needsUpdate = true;
    }
  });

  return (
    <group {...props} dispose={null}>
      {/* <mesh position={[0, 1.2, 0]} geometry={nodes.Retopo_Sea.geometry}>
        <PerformantOceanMaterial />
      </mesh> */}

      <Sea />

      {/* Buildings & scene geometry */}
      {Object.keys(nodes).map((key) => {
        const n = nodes[key];
        if (!n.geometry || key.includes("Tree") || key.includes("Scatter"))
          return null;

        let mat = materials[n.material?.name];

        if (key === 'Sea_Land_1' || key === 'Sea_Land') {
          return null
          
        }

        if (key === 'Sea_Land_2' ) {
          return null
        }

        if(key === 'Retopo_Sea'){
          return null
        }

        return (
          <mesh
          castShadow
          receiveShadow
            key={key}
            geometry={n.geometry}
            material={mat}
            position={n.position}
            rotation={n.rotation}
            scale={n.scale}
          />
        );
      })}
      <UnderwaterLand position={[0,-0.2,0]}/>

      {/* Instanced trees */}
      <InstancedTrees
        meshName="Tree-Variant-4182_Baked"
        jsonFile="Tree-Variant-1-data2.json"
        nodes={nodes}
        materials={materials}
      />
      <InstancedTrees
        meshName="Tree-Variant-6499_Baked"
        jsonFile="Tree-Variant-2-data2.json"
        nodes={nodes}
        materials={materials}
      />
      <InstancedTrees
        meshName="Tree-Variant-5442_Baked"
        jsonFile="Tree-Variant-3-data2.json"
        nodes={nodes}
        materials={materials}
      />
      <InstancedTrees
        meshName="Tree-variant-1-Baked"
        jsonFile="Tree-Variant-4-data2.json"
        nodes={nodes}
        materials={materials}
      />
      <InstancedTrees
        meshName="Tree-Variant-3807_Baked"
        jsonFile="Tree-Variant-5-data2.json"
        nodes={nodes}
        materials={materials}
      />
      <InstancedTrees
        meshName="Tree-Variant-2991_Baked"
        jsonFile="Tree-Variant-6-data2.json"
        nodes={nodes}
        materials={materials}
      />
    </group>
  );
}

useGLTF.preload("models/Rustomjee-3d-without-treess.glb");
