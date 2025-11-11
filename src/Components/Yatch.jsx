
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Yatch(props) {
  const { nodes, materials } = useGLTF('models/Yatch1.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[0, 0.73, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Fast_Boat_18009.geometry}
          material={materials['Material.007']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Fast_Boat_18009_1.geometry}
          material={materials.Material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Fast_Boat_18009_2.geometry}
          material={materials['Material.002']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Fast_Boat_18009_3.geometry}
          material={materials['Material.006']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Fast_Boat_18009_4.geometry}
          material={materials['Material.005']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Fast_Boat_18009_5.geometry}
          material={materials['Material.010']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Fast_Boat_18009_6.geometry}
          material={materials['Material.003']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Fast_Boat_18009_7.geometry}
          material={materials['Material.004']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Fast_Boat_18009_8.geometry}
          material={materials['Material.008']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Fast_Boat_18009_9.geometry}
          material={materials['Material.009']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Fast_Boat_18009_10.geometry}
          material={materials['Material.001']}
        />
      </group>
    </group>
  )
}

useGLTF.preload('models/Yatch1.glb')