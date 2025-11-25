import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState } from "react";
import Scene from "./Scene";
import { Environment, Preload } from "@react-three/drei";
import Loader from "./Loader";
import { PathsProvider } from "./PathsContext";
import UIButtons from "./UiButtons";
import OrientationGuard from "./OrientationGaurd";


const Experience = () => {

  return (
    <>
    <OrientationGuard>
    <PathsProvider>
    <UIButtons/>

      <div className="h-screen w-screen">
      <Loader /> {/* minimal overlay loader */}
        <Canvas
          camera={{
            position: [80, 120, 200],
            fov: 50,
            near: 10,
            far: 5500,
          }}
          
          shadows
          >
          <color attach="background" args={["#7fa4c9"]} />
          <fog attach={"fog"} args={["#7fa4c9", 2000, 6000]} />
          {/* <HorizontalFog
            color="#a5b9c7"
            density={0.0005}
            heightFalloff={0.001}
            waterHeight={0} // your ocean Y position
            /> */}
          <Environment preset="city" />
          <Suspense fallback={null}>
          
          <Scene />
          <Preload all />
        </Suspense>
        </Canvas>
        

        
      </div>
      </PathsProvider>
      </OrientationGuard>
    </>
  );
};

export default Experience;
