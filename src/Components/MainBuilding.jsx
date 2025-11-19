import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function MainBuilding(props) {
  const { nodes, materials } = useGLTF('models/Main-building-ao.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Main-Building_Baked'].geometry}
        // material={materials['Main-Building_Baked']}
        position={[-0.86, 100.58, 7.849]}
        rotation={[-Math.PI, 0, -Math.PI]}
      >
        <meshBasicMaterial {...materials['Main-Building_Baked']} color={'#F7F7EE'}/>
      </mesh>
    </group>
  )
}

useGLTF.preload('models/Main-building-ao.glb')
