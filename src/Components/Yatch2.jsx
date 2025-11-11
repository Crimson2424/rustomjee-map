import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Yatch2(props) {
  const { nodes, materials } = useGLTF('models/Yatch2.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Boat.geometry}
        material={materials.lambert3SG}
      />
    </group>
  )
}

useGLTF.preload('models/Yatch2.glb')