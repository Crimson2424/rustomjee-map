import React from 'react'
import { useGLTF } from '@react-three/drei'

export function TreeGood(props) {
  const { nodes, materials } = useGLTF('models/Tree-goodlookinghehe.glb')
  return (
    <group {...props} dispose={null} scale={20} position={[0,90,0]}>
      <group position={[34.462, 15.141, -49.644]} rotation={[0.271, -0.227, 1.567]} scale={2.306}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plano308.geometry}
        >
          <meshBasicMaterial map={materials.leaf2 && materials.leaf2.map} transparent depthTest={false}/>
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plano308_1.geometry}
        >
          <meshBasicMaterial map={materials.leaf1 && materials.leaf1.map} transparent depthTest={false}/>
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plano308_2.geometry}
        >
          <meshBasicMaterial map={materials.leaf4 && materials.leaf4.map} transparent depthTest={false}/>
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plano308_3.geometry}
        >
          <meshBasicMaterial map={materials.leaf3 && materials.leaf3.map} transparent depthTest={false}/>
        </mesh>
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.tree005.geometry}
        position={[34.624, 0, -49.199]}
        rotation={[0, -1.571, 0]}
        scale={2.306}
      >
        <meshBasicMaterial map={materials.brown && materials.brown.map} transparent depthTest={false}/>
      </mesh>
    </group>
  )
}

useGLTF.preload('models/Tree-goodlookinghehe.glb')