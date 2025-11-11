import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function FishingBoat(props) {
  const { nodes, materials } = useGLTF('models/FishingBoat.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Boat.geometry}
        material={materials.boat}
        scale={0.025}
      />
    </group>
  )
}

useGLTF.preload('models/FishingBoat.glb')