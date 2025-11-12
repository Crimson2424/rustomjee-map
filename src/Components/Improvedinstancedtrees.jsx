import { useGLTF, useKTX2, useTexture } from "@react-three/drei";
import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

/**
 * InstancedTrees component with baked texture support
 */
export function InstancedTrees({
  meshName,
  jsonFile,
  nodes,
  materials,
  texturePath = null, // ✅ Default to null to ensure hook is always called
  yPosition = 0,
  terrainRef = null,
  heightOffset = 0,
  useTerrainFollowing = false,
}) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const [instances, setInstances] = useState(null);

  // ✅ Always call useTexture (pass null if no texture path)
  // This ensures hook order remains consistent
  const bakedTexture = texturePath ? useKTX2(texturePath) : null;

  // Configure texture
  useEffect(() => {
    if (bakedTexture) {
      bakedTexture.flipY = false;
      bakedTexture.colorSpace = THREE.SRGBColorSpace; // Updated for Three.js r152+
      bakedTexture.needsUpdate = true;
    }
  }, [bakedTexture]);

  useEffect(() => {
    fetch(`/tree-data/${jsonFile}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Loaded ${data.count} instances from ${jsonFile}`);
        setInstances(data.instances);
      })
      .catch((err) => console.error(`Error loading ${jsonFile}:`, err));
  }, [jsonFile]);

  useEffect(() => {
    if (!instances || !meshRef.current) return;

    const terrain = terrainRef?.current;
    const shouldRaycast = useTerrainFollowing && terrain;

    instances.forEach((t, i) => {
      let yPos = yPosition;

      if (shouldRaycast) {
        const x = t.position.x;
        const z = t.position.z;
        const rayOrigin = new THREE.Vector3(x, 1000, z);
        const rayDirection = new THREE.Vector3(0, -1, 0);

        raycaster.set(rayOrigin, rayDirection);
        const intersects = raycaster.intersectObject(terrain, true);

        if (intersects.length > 0) {
          yPos = intersects[0].point.y + heightOffset;
        }
      }

      dummy.position.set(t.position.x, yPos, t.position.z);
      dummy.rotation.set(t.rotation.x, t.rotation.z, -t.rotation.y);
      dummy.scale.set(t.scale.x, t.scale.z, t.scale.y);
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

  // ✅ Create material - use baked texture if provided, otherwise fall back to GLB material
  const material = useMemo(() => {
    if (bakedTexture) {
      return new THREE.MeshStandardMaterial({
        map: bakedTexture,
        transparent: false,
        alphaTest: 0.2,
        opacity: 1.0,
        // alphaToCoverage: true
      });
    } else {
      // Fallback to original GLB material
      const originalMat = materials[nodes[meshName].material.name];
      return new THREE.MeshStandardMaterial({
        map: originalMat?.map || null,
        transparent: true,
        alphaTest: 0.1,
        opacity: 1.0,
      });
    }
  }, [bakedTexture, materials, nodes, meshName]);

  if (!instances) return null;

  const geometry = nodes[meshName].geometry;

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