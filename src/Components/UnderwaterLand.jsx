import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function UnderwaterLand(props) {
  const { nodes, materials } = useGLTF('models/Underwater-land-4.glb')
  return (
    <group {...props} dispose={null}>
      
      <mesh
       castShadow
       receiveShadow
       geometry={nodes.Retopo_Sea_Land_2001.geometry}
      >
        <meshBasicMaterial attach="material" map={materials['New-Sand']?.map} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Circle001.geometry}
        position={[525.036, 1.051, 2620.362]}
      >
         <meshBasicMaterial color={"#20475c"} />
      </mesh>
    </group>
  )
}

useGLTF.preload('models/Underwater-land-4.glb')