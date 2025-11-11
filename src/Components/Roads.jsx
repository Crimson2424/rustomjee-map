import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Roads(props) {
  const { nodes, materials } = useGLTF('models/Roads-v1.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Road-Main'].geometry}
        material={materials.Road}
        position={[0, 1.051, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Road-Bridge'].geometry}
        material={materials.Road}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Airport-Road'].geometry}
        material={materials.Road}
        position={[2704.214, -136.59, -4769.057]}
        scale={33.706}
      />
    </group>
  )
}

useGLTF.preload('models/Roads-v1.glb')