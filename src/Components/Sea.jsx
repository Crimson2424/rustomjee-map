
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { PerformantOceanMaterial } from './Performantoceanmaterial'

export function Sea(props) {
  const { nodes, materials } = useGLTF('models/Sea-Basicglb.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sea.geometry}
        position={[0, 1.2, 0]}
       
      >
        <PerformantOceanMaterial />
      </mesh>
    </group>
  )
}

useGLTF.preload('models/Sea-Basicglb.glb')
