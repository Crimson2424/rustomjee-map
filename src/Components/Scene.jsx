import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { CameraControls, ScreenSpace } from "@react-three/drei";
import { BlendFunction } from 'postprocessing'
import gsap from "gsap/all";
import { City } from "./City";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  SSAO,
  ToneMapping,
} from "@react-three/postprocessing";
import { Birds } from "./Birds";
import { button, folder, useControls } from "leva";
import { useFrame } from "@react-three/fiber";

const Scene = () => {
  const birdsRef = useRef();
  const cameraControlRef = useRef();
  const disableAutoRotate = useRef(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });

  // const {position, glareSize, opacity, starPoints,animated} = useControls({
  //   LensFlare: folder({
  //     position: { value: {x:-6000, y: 300, z: 1786}, step: 1, label: "position" },
  //     glareSize: { value: 0.35, min: 0.01, max: 1.0, label: "glareSize" },
  //     opacity: { value: 1.0, min: 0.0, max: 1.0, label: "opacity" },
  //     starPoints: {
  //       value: 6.0,
  //       step: 1.0,
  //       min: 0,
  //       max: 32.0,
  //       label: "starPoints",
  //     },
  //     animated: { value: true, label: "animated?" },
  //   })
  // }
  // )

  // const lensFlareProps = useControls({
  //   LensFlare: folder(
  //     {
  //       enabled: { value: true, label: "enabled?" },
  //       opacity: { value: 1.0, min: 0.0, max: 1.0, label: "opacity" },
  //       position: { value: { x: -25, y: 6, z: -60 }, step: 1, label: "position" },
  //       glareSize: { value: 0.35, min: 0.01, max: 1.0, label: "glareSize" },
  //       starPoints: {
  //         value: 6.0,
  //         step: 1.0,
  //         min: 0,
  //         max: 32.0,
  //         label: "starPoints",
  //       },
  //       animated: { value: true, label: "animated?" },
  //       followMouse: { value: false, label: "followMouse?" },
  //       anamorphic: { value: false, label: "anamorphic?" },
  //       colorGain: { value: new THREE.Color(56, 22, 11), label: "colorGain" },
  
  //       Flare: folder({
  //         flareSpeed: {
  //           value: 0.4,
  //           step: 0.001,
  //           min: 0.0,
  //           max: 1.0,
  //           label: "flareSpeed",
  //         },
  //         flareShape: {
  //           value: 0.1,
  //           step: 0.001,
  //           min: 0.0,
  //           max: 1.0,
  //           label: "flareShape",
  //         },
  //         flareSize: {
  //           value: 0.005,
  //           step: 0.001,
  //           min: 0.0,
  //           max: 0.01,
  //           label: "flareSize",
  //         },
  //       }),
  
  //       SecondaryGhosts: folder({
  //         secondaryGhosts: { value: true, label: "secondaryGhosts?" },
  //         ghostScale: { value: 0.1, min: 0.01, max: 1.0, label: "ghostScale" },
  //         aditionalStreaks: { value: true, label: "aditionalStreaks?" },
  //       }),
  
  //       StartBurst: folder({
  //         starBurst: { value: true, label: "starBurst?" },
  //         haloScale: { value: 0.5, step: 0.01, min: 0.3, max: 1.0 },
  //       }),
  //     },
  //     { collapsed: true }
  //   ),
  // });


  useControls({
    "Log Camera Pos/Target": button(() => {
      if (!cameraControlRef.current) return;

      const pos = cameraControlRef.current.getPosition();
      const target = cameraControlRef.current.getTarget();

      console.log("📌 Camera Position:", pos);
      console.log("🎯 Camera Target:", target);
    }, { collapsed: true }),
  });

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
    cam.setLookAt(x, y, z, tx, ty, tz, false)


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

  // ✅ Auto-rotate in animation loop (like the native example)
  useFrame((state, delta) => {
    if (!cameraControlRef.current) return;

    const cam = cameraControlRef.current;

    // Auto-rotate by incrementing azimuth angle
    if (!disableAutoRotate.current) {
      cam.azimuthAngle -= 5 * delta * THREE.MathUtils.DEG2RAD;
    }

    // Update camera controls
    cam.update(delta);
  });

  useEffect(() => {
    if (!birdsRef.current) return;

    // Animate with GSAP
    gsap.to(birdsRef.current.group.position, {
      x: 30,
      y: 20,
      duration: 5,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
    });

    gsap.to(birdsRef.current.behavior, {
      maxSpeed: 5,
      separationForce: 2.5,
      duration: 3,
      yoyo: true,
      repeat: -1,
    });
  }, []);
  return (
    <>
      <CameraControls makeDefault ref={cameraControlRef} />
      <City />
      {/* <EffectComposer> */}
        {/* <SSAO />
        <ChromaticAberration />
        <ToneMapping />
        <Bloom /> */}
        {/* <Bloom /> */}
        {/* <ChromaticAberration /> */}
        {/* <ToneMapping  blendFunction={BlendFunction.NORMAL}/> */}
        {/* <LensFlare enabled dirtTextureFile={"/lensDirtTexture.png"} position={position} glareSize={glareSize} opacity starPoints animated/> */}
      {/* </EffectComposer> */}
      <directionalLight position={[0, 5, 0]} />
      <ambientLight />

      <Birds position={[0, 400, 300]} />
    </>
  );
};

export default Scene;
