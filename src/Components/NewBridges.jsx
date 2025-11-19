import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { RoadClickSampler } from './Roadsampler'

export function NewBridges(props) {
  const { nodes, materials } = useGLTF('models/New-Bridges.glb')
  const roadNames = [
    "NewBridge-1_Baked",
   'NewBridge-2_Baked'
  ];
  return (
    <group {...props} dispose={null}>
        {/* <RoadClickSampler nodes={nodes} roadNames={roadNames} /> */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['NewBridge-1_Baked'].geometry}
        material={nodes['NewBridge-1_Baked'].material}
        position={[-4016.668, 0, 8916.129]}
      >
        <meshBasicMaterial map={props.newBridgeOneTexture}/>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['NewBridge-2_Baked'].geometry}
        material={nodes['NewBridge-2_Baked'].material}
        position={[10118.178, 0, 5718.215]}
      >
        <meshBasicMaterial map={props.newBridgeTwoTexture}/>
      </mesh>
    </group>
  )
}

useGLTF.preload('models/New-Bridges.glb')