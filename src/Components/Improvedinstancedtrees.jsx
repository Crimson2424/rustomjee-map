import { useGLTF } from "@react-three/drei";
import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

/**
 * InstancedTrees component for YOUR JSON format:
 * {
 *   "count": 753,
 *   "exportMode": {...},
 *   "instances": [
 *     {
 *       "position": { "x": ..., "y": ..., "z": ... },
 *       "rotation": { "x": ..., "y": ..., "z": ... },
 *       "scale": { "x": ..., "y": ..., "z": ... }
 *     }
 *   ]
 * }
 */

export function InstancedTrees({
  meshName,
  jsonFile,
  nodes,
  materials,
  yPosition = 0, // Fixed Y position for all trees (default: 0)
  terrainRef = null, // Optional: terrain mesh for height following
  heightOffset = 0, // Optional: additional height above terrain
  useTerrainFollowing = false, // Enable terrain following (overrides yPosition)
}) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const [instances, setInstances] = useState(null);

  useEffect(() => {
    fetch(`/tree-data/${jsonFile}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Loaded ${data.count} instances from ${jsonFile}`);
        setInstances(data.instances); // ✅ Extract instances array from object
      })
      .catch((err) => console.error(`Error loading ${jsonFile}:`, err));
  }, [jsonFile]);

  useEffect(() => {
    if (!instances || !meshRef.current) return;

    const terrain = terrainRef?.current;
    const shouldRaycast = useTerrainFollowing && terrain;

    instances.forEach((t, i) => {
      let yPos = yPosition; // ✅ Default to fixed Y position

      // Terrain following: raycast to find ground height (only if enabled)
      if (shouldRaycast) {
        const x = t.position.x; // ✅ Use t.position.x (not t.position[0])
        const z = t.position.z; // ✅ Use t.position.z (not t.position[2])

        // Cast ray from above
        const rayOrigin = new THREE.Vector3(x, 1000, z);
        const rayDirection = new THREE.Vector3(0, -1, 0);

        raycaster.set(rayOrigin, rayDirection);
        const intersects = raycaster.intersectObject(terrain, true);

        if (intersects.length > 0) {
          yPos = intersects[0].point.y + heightOffset;
        }
      }

      // ✅ Set transform with proper Blender → Three.js conversion

      // Position: Blender (X, Y, Z) → Three.js (X, Y, Z)
      // Note: Your JSON already has Z negated, so we use it directly
      dummy.position.set(t.position.x, yPos, t.position.z);

      // Rotation: Convert Blender Z-up to Three.js Y-up
      // Blender rotation.x → Three.js rotation.x (same axis)
      // Blender rotation.z → Three.js rotation.y (Z-up becomes Y-up)
      // Blender rotation.y → Three.js rotation.z (negated)
      dummy.rotation.set(
        t.rotation.x, // X rotation stays the same
        t.rotation.z, // Blender Z rotation → Three.js Y rotation
        -t.rotation.y // Blender Y rotation → Three.js Z rotation (negated)
      );

      // Scale: Convert Blender Z-up to Three.js Y-up
      dummy.scale.set(
        t.scale.x, // X scale stays the same
        t.scale.z, // Blender Z scale → Three.js Y scale
        t.scale.y // Blender Y scale → Three.js Z scale
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    console.log(
      `✅ Updated ${instances.length} instances of ${meshName} at Y=${yPosition}`
    );
  }, [
    instances,
    meshName,
    yPosition,
    terrainRef,
    heightOffset,
    useTerrainFollowing,
    dummy,
    raycaster,
  ]);

  if (!instances) return null;

  const geometry = nodes[meshName].geometry;
  const originalMat = materials[nodes[meshName].material.name];

  // Create material (matching your setup)
  const material = new THREE.MeshStandardMaterial({
    map: originalMat?.map || null,
    transparent: false,
    alphaTest: 0.1,
    opacity: 1.0,
    // side: THREE.DoubleSide,
  });

  if (material.map) {
    // material.map.anisotropy = 16;
    // material.map.minFilter = THREE.LinearMipmapLinearFilter;
    // material.map.magFilter = THREE.LinearFilter;
    // Enable alphaToCoverage for smooth edges
    // material.alphaToCoverage = true;
    // material.blending = THREE.NormalBlending;
    material.map.needsUpdate = true;
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, instances.length]}
      castShadow
      receiveShadow
    >
      <primitive attach="geometry" object={geometry} />
      <primitive attach="material" object={material} />
    </instancedMesh>
  );
}

/**
 * Helper component to manage all tree variants easily
 */
export function AllTreeVariants({
  nodes,
  materials,
  yPosition = 0,
  terrainRef = null,
  heightOffset = 0,
}) {
  const treeVariants = [
    {
      meshName: "Tree-Variant-4182_Baked",
      jsonFile: "Tree-Variation-1-final.json",
    },
    {
      meshName: "Tree-Variant-6499_Baked",
      jsonFile: "Tree-Variation-2-final.json",
    },
    {
      meshName: "Tree-Variant-5442_Baked",
      jsonFile: "Tree-Variation-3-final.json",
    },
    {
      meshName: "Tree-variant-1-Baked",
      jsonFile: "Tree-Variation-4-final.json",
    },
    {
      meshName: "Tree-Variant-3807_Baked",
      jsonFile: "Tree-Variation-5-final.json",
    },
    {
      meshName: "Tree-Variant-2991_Baked",
      jsonFile: "Tree-Variation-6-final.json",
    },
  ];

  const useTerrainFollowing = terrainRef !== null;

  return (
    <>
      {treeVariants.map((variant) => (
        <InstancedTrees
          key={variant.meshName}
          meshName={variant.meshName}
          jsonFile={variant.jsonFile}
          nodes={nodes}
          materials={materials}
          yPosition={yPosition}
          terrainRef={terrainRef}
          heightOffset={heightOffset}
          useTerrainFollowing={useTerrainFollowing}
        />
      ))}
    </>
  );
}

/**
 * Hook to get terrain reference from your scene
 */
export function useTerrainRef(nodes, terrainMeshName = "Retopo_Sea") {
  const terrainRef = useRef();

  useEffect(() => {
    if (nodes[terrainMeshName]) {
      const geometry = nodes[terrainMeshName].geometry;
      const mesh = new THREE.Mesh(geometry);
      terrainRef.current = mesh;
      console.log(`Terrain reference set for ${terrainMeshName}`);
    }
  }, [nodes, terrainMeshName]);

  return terrainRef;
}
