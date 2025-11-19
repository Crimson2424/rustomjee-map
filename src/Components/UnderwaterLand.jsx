import React, { useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'

export function Underwaterland(props) {
  const { nodes, materials } = useGLTF('models/Sea-Land_Latest4.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sea_Land001.geometry}
        material={materials['Material.002']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Retopo_Sea_Land_1002.geometry}
        material={materials['Sand.001']}
      />
    </group>
  )
}

useGLTF.preload('models/Sea-Land_Latest4.glb')