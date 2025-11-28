import React, { useEffect, useRef } from "react";
import { AdaptiveDpr, CameraControls, Html } from "@react-three/drei";
import  City  from "./City";
import { Birds } from "./Birds";
import Effects from "./Effects";
import CameraAnimations from "./CameraAnimations";

const Scene = () => {
  const cameraControlRef = useRef();
  const disableAutoRotate = useRef(false);
  const targetMouse = useRef({ x: 0, y: 0 });

  // if you want to log camera positions
  // useControls({
  //   "Log Camera Pos/Target": button(
  //     () => {
  //       if (!cameraControlRef.current) return;

  //       const pos = cameraControlRef.current.getPosition();
  //       const target = cameraControlRef.current.getTarget();

  //       console.log("📌 Camera Position:", pos);
  //       console.log("🎯 Camera Target:", target);
  //     },
  //     { collapsed: true }
  //   ),
  // });

  // const {posx, posz} = useControls({
  //   posx:{
  //     value:390,
  //     min: -1000,
  //     max: 2000
  //   },
  //   posz:{
  //     value:1830,
  //     min: -1000,
  //     max: 2000
  //   }
  // })
  

  // ✅ Track mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse position to -1 to 1 range
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      targetMouse.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ✅ Smooth camera fly on load
  useEffect(() => {
    if (!cameraControlRef.current) return;

    const cam = cameraControlRef.current;

    const x = -1844.5376947483708; // final camera position
    const y = 563.2002337610148;
    const z = 881.884785452135;

    const tx = 13.893999128697848; // target
    const ty = -92.36630585124054;
    const tz = 112.90388205168148;

    // First align to current pos quickly so animation starts clean
    cam.setLookAt(
      cam.camera.position.x,
      cam.camera.position.y,
      cam.camera.position.z,
      tx,
      ty,
      tz,
      false
    );

    // ✅ Smooth animation
    // ✅ Smooth animation to final position
    cam.setLookAt(x, y, z, tx, ty, tz, false);

    // Handle user interaction - pause auto-rotate when user controls camera
    const onControlStart = () => {
      disableAutoRotate.current = true;
    };

    const onControlEnd = () => {
      disableAutoRotate.current = false;
    };

    cam.addEventListener("controlstart", onControlStart);
    cam.addEventListener("controlend", onControlEnd);

    return () => {
      cam.removeEventListener("controlstart", onControlStart);
      cam.removeEventListener("controlend", onControlEnd);
    };
  }, []);


  return (
    <>
      <CameraControls makeDefault ref={cameraControlRef} 
      mouseButtons={{left:0, middle:0, right:0, wheel:0}} 
      touches={{one:0, two:0, three:0}}
      />
      <Html center position={[0,200,0]} distanceFactor={1900} zIndexRange={[0, 0]} >
        <div className="w-30 pointer-events-none">

        <img className="w-full"  src="/Cliff_Tower.png"/>
        </div>
       
      </Html>
      <CameraAnimations cameraControlRef={cameraControlRef}/>
      <City />
      <Effects />
      <directionalLight position={[0, 5, 0]} />
      <ambientLight />

      <Birds radius={1000} />
      <Birds position={[390,0,1830]} radius={800}/>
      <AdaptiveDpr  pixelated />
    </>
  );
};

export default Scene;
