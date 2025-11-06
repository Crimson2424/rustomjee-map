import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function SmallSand(props) {
  const { nodes, materials } = useGLTF('models/Small-Sand-v1.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sea_Land.geometry}
        position={[0, -0.07, 0]}
        scale={0.025}
      >
        <meshBasicMaterial attach="material" map={materials['Small-Sand']?.map} />
      </mesh>
    </group>
  )
}

useGLTF.preload('models/Small-Sand-v1.glb')
