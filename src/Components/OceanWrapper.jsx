import { CubeCamera } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

export default function OceanWrapper({ children }) {
  const cubeRT = new THREE.WebGLCubeRenderTarget(256, { type: THREE.FloatType });
  const group = useRef();

  return (
    <group ref={group}>
      <CubeCamera
        resolution={256}
        frames={Infinity} // if scene static use 1
      >
        {(cubeCamera) => {
          // save reference for shader to use later
          if (group.current) {
            group.current.userData.cubeCamera = cubeCamera;
          }

          return null;
        }}
      </CubeCamera>

      {children}
    </group>
  );
}
