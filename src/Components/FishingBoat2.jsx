
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function FishingBoat2(props) {
  const { nodes, materials } = useGLTF('models/FishingBoat2.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Fishing_Boat.geometry}
        material={materials.Fishing_Boat}
        position={[0.001, 1.081, -5.478]}
        rotation={[0, -1.571, 0]}
        scale={1.902}
      />
    </group>
  )
}

useGLTF.preload('models/FishingBoat2.glb')