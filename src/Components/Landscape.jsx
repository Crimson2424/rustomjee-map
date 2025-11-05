import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Landscape(props) {
  const { nodes, materials } = useGLTF('models/low_poly_landscape_with_rocks-v1.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={434.783}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.pPlatonic19_Rocks_0.geometry}
            material={materials.Rocks}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.pPlatonic19_lambert1_0.geometry}
            material={materials.lambert1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.pPlatonic19_Sand_0.geometry}
            material={materials.Sand}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.pPlatonic19_dirt3_0.geometry}
            material={materials.dirt3}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.pPlatonic19_Dirt_0.geometry}
            material={materials.Dirt}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.pPlatonic19_dirt2_0.geometry}
            material={materials.dirt2}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.pPlatonic19_Grass_0.geometry}
            material={materials.Grass}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.pPlatonic19_Snow_0.geometry}
            material={materials.Snow}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.pPlatonic19_Water_0.geometry}
            material={materials.Water}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('models/low_poly_landscape_with_rocks-v1.glb')