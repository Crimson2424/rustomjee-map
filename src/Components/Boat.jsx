import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Boat(props) {
  const { nodes, materials } = useGLTF('models/low_poly_fishing_boat-v1.glb')
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <group position={[-6.788, 63.218, 3.685]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_Material001_0.geometry}
            material={materials['Material.001']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_Material_0.geometry}
            material={materials.Material}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_Material004_0.geometry}
            material={materials['Material.004']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_Material011_0.geometry}
            material={materials['Material.011']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_Material002_0.geometry}
            material={materials['Material.002']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_Material003_0.geometry}
            material={materials['Material.003']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_Material007_0.geometry}
            material={materials['Material.007']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_Material008_0.geometry}
            material={materials['Material.008']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_Material010_0.geometry}
            material={materials['Material.010']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_Material006_0.geometry}
            material={materials['Material.006']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_Material009_0.geometry}
            material={materials['Material.009']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_Material005_0.geometry}
            material={materials['Material.005']}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('models/low_poly_fishing_boat-v1.glb')