import React, { useRef } from 'react'
import { MeshReflectorMaterial, useGLTF } from '@react-three/drei'

export function SeaRetop(props) {
  const { nodes, materials } = useGLTF('models/Sea_Retop2.glb')
  return (
    <group {...props} dispose={null}>
      
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.SeaUp_ReTop.geometry}
        material={materials['water.001']}
      >
        <MeshReflectorMaterial color={'blue'}
        blur={500}
        />
      </mesh>
    </group>
  )
}

useGLTF.preload('models/Sea_Retop2.glb')