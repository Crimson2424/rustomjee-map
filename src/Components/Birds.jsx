import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import gsap from "gsap/all";
import { useFrame } from "@react-three/fiber";

export function Birds(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("models/bird.glb");
  const { actions } = useAnimations(animations, group);
  const circleRef = useRef();
  const angleOffsets = useRef([])

  React.useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        action?.reset().play();
      });
    }
  }, [actions]);

  // GSAP circular motion
  React.useEffect(() => {
    if (!circleRef.current) return
    angleOffsets.current = circleRef.current.children.map(() =>
      Math.random() * Math.PI * 2
    )
  }, [])

  const radius = 500
  const speed = 0.1 // ✅ LOWER = SLOWER
  const height = 300

  useFrame((state, delta) => {
    if (!circleRef.current) return

    circleRef.current.children.forEach((bird, i) => {
      // update angle slowly
      angleOffsets.current[i] += speed * delta

      const t = angleOffsets.current[i]

      // circular position
      const x = Math.cos(t) * radius
      const z = Math.sin(t) * radius

      bird.position.set(x, height, z)

      // face direction of travel
      const nextX = Math.cos(t + 0.01) * radius
      const nextZ = Math.sin(t + 0.01) * radius
      bird.lookAt(nextX, height, nextZ)
    })
  })

  return (
    <group ref={circleRef}>
      <group ref={group} {...props} dispose={null}>
        <group name="Scene">
          <group
            name="Bird"
            position={[0.468, 2.379, 1.512]}
            rotation={[0.051, 0.029, 0.03]}
          >
            <mesh
              name="body"
              castShadow
              receiveShadow
              geometry={nodes.body.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing"
              castShadow
              receiveShadow
              geometry={nodes.lwing.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing"
              castShadow
              receiveShadow
              geometry={nodes.rwing.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
          <group
            name="Bird001"
            position={[-8.749, 0.152, -15.788]}
            rotation={[0, 0.233, 0]}
          >
            <mesh
              name="body001"
              castShadow
              receiveShadow
              geometry={nodes.body001.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing001"
              castShadow
              receiveShadow
              geometry={nodes.lwing001.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing001"
              castShadow
              receiveShadow
              geometry={nodes.rwing001.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
          <group name="Bird002" position={[17.395, 1.493, -16.163]}>
            <mesh
              name="body002"
              castShadow
              receiveShadow
              geometry={nodes.body002.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing002"
              castShadow
              receiveShadow
              geometry={nodes.lwing002.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing002"
              castShadow
              receiveShadow
              geometry={nodes.rwing002.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
          <group
            name="Bird003"
            position={[8.9, -3.36, -31.724]}
            rotation={[0.055, -0.101, 0.03]}
          >
            <mesh
              name="body003"
              castShadow
              receiveShadow
              geometry={nodes.body003.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing003"
              castShadow
              receiveShadow
              geometry={nodes.lwing003.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing003"
              castShadow
              receiveShadow
              geometry={nodes.rwing003.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
          <group
            name="Bird004"
            position={[-14.92, -3.063, -38.51]}
            rotation={[0.051, 0.029, 0.03]}
          >
            <mesh
              name="body004"
              castShadow
              receiveShadow
              geometry={nodes.body004.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing004"
              castShadow
              receiveShadow
              geometry={nodes.lwing004.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing004"
              castShadow
              receiveShadow
              geometry={nodes.rwing004.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
          <group name="Bird005" position={[28.456, 3.3, -34.134]}>
            <mesh
              name="body005"
              castShadow
              receiveShadow
              geometry={nodes.body005.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing005"
              castShadow
              receiveShadow
              geometry={nodes.lwing005.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing005"
              castShadow
              receiveShadow
              geometry={nodes.rwing005.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
          <group
            name="Bird006"
            position={[88.985, -12.447, -63.488]}
            rotation={[0.051, 0.029, 0.03]}
          >
            <mesh
              name="body006"
              castShadow
              receiveShadow
              geometry={nodes.body006.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing006"
              castShadow
              receiveShadow
              geometry={nodes.lwing006.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing006"
              castShadow
              receiveShadow
              geometry={nodes.rwing006.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
          <group
            name="Bird007"
            position={[55.362, -2.757, -49.718]}
            rotation={[0.051, 0.029, 0.03]}
          >
            <mesh
              name="body007"
              castShadow
              receiveShadow
              geometry={nodes.body007.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing007"
              castShadow
              receiveShadow
              geometry={nodes.lwing007.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing007"
              castShadow
              receiveShadow
              geometry={nodes.rwing007.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
          <group
            name="Bird008"
            position={[-31.649, 1.51, -30.992]}
            rotation={[0.045, 0.216, 0.031]}
          >
            <mesh
              name="body008"
              castShadow
              receiveShadow
              geometry={nodes.body008.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing008"
              castShadow
              receiveShadow
              geometry={nodes.lwing008.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing008"
              castShadow
              receiveShadow
              geometry={nodes.rwing008.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
          <group
            name="Bird009"
            position={[-30.249, 0.652, -83.305]}
            rotation={[0.051, 0.029, 0.03]}
          >
            <mesh
              name="body009"
              castShadow
              receiveShadow
              geometry={nodes.body009.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing009"
              castShadow
              receiveShadow
              geometry={nodes.lwing009.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing009"
              castShadow
              receiveShadow
              geometry={nodes.rwing009.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
          <group name="Bird010" position={[-53.895, 3.667, -63.396]}>
            <mesh
              name="body010"
              castShadow
              receiveShadow
              geometry={nodes.body010.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing010"
              castShadow
              receiveShadow
              geometry={nodes.lwing010.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing010"
              castShadow
              receiveShadow
              geometry={nodes.rwing010.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
          <group
            name="Bird011"
            position={[56.685, 7.473, -78.817]}
            rotation={[0, -0.168, 0]}
          >
            <mesh
              name="body011"
              castShadow
              receiveShadow
              geometry={nodes.body011.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing011"
              castShadow
              receiveShadow
              geometry={nodes.lwing011.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing011"
              castShadow
              receiveShadow
              geometry={nodes.rwing011.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
          <group
            name="Bird012"
            position={[115.378, -10.436, -115.378]}
            rotation={[-0.016, -0.036, -0.014]}
          >
            <mesh
              name="body012"
              castShadow
              receiveShadow
              geometry={nodes.body012.geometry}
              material={materials.Material}
              position={[-0.094, -0.001, -1.684]}
              scale={5.881}
            />
            <mesh
              name="lwing012"
              castShadow
              receiveShadow
              geometry={nodes.lwing012.geometry}
              material={materials.Material}
              position={[1.159, 0, 0]}
            />
            <mesh
              name="rwing012"
              castShadow
              receiveShadow
              geometry={nodes.rwing012.geometry}
              material={materials.Material}
              position={[-1.354, 0, 0]}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("models/bird.glb");
