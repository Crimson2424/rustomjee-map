  import { Canvas } from "@react-three/fiber";
  import React, { Suspense, useState } from "react";
  import Scene from "./Scene";
  import { Environment, Preload } from "@react-three/drei";
  import Loader from "./Loader";
  import { PathsProvider } from "./PathsContext";
  import UIButtons from "./UiButtons";
  import OrientationGuard from "./OrientationGaurd";
import Disclaimer from "./Disclaimer";
import MusicController from "./MusicController";
import MobileOrientationAndFullscreen from "./MobileOrientationAndFullscreen";


  const Experience = () => {
    const [deviceReady, setDeviceReady] = useState(false);
    const [started, setStarted] = useState(false);

    return (
      <>
      {/* <OrientationGuard> */}

      {/* 1. MOBILE FULLSCREEN + ORIENTATION HANDLER */}
      {!deviceReady && (
        <MobileOrientationAndFullscreen onReady={() => setDeviceReady(true)} />
      )}

      {deviceReady && !started && (
        <Disclaimer onStart={() => setStarted(true)} />
      )}

      {/* AFTER START → RENDER EVERYTHING */}
      {deviceReady && started && (
        <PathsProvider>
          {/* MUSIC CONTROLLER */}
          <MusicController play={true} />

          {/* UI Buttons */}
          <UIButtons />

          {/* SCENE */}
          <div className="h-screen w-screen">
            <Loader />

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
              <fog attach="fog" args={["#7fa4c9", 2500, 6000]} />

              <Environment preset="city" />

              <Suspense fallback={null}>
                <Scene />
                <Preload all />
              </Suspense>
            </Canvas>
          </div>
        </PathsProvider>
      )}
        {/* </OrientationGuard> */}
      </>
    );
  };

  export default Experience;
