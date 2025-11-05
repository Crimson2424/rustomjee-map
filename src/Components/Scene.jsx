import React, { useEffect, useRef } from "react";
import { Landscape } from "./Landscape";
import { CameraControls } from "@react-three/drei";
import gsap from "gsap/all";
import BirdsFlocking from "./Birds";
import { City } from "./City";

const Scene = () => {
  const birdsRef = useRef();

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
      <CameraControls />
      <City />
      <directionalLight position={[0, 5, 0]} />
      <ambientLight />

      {/* <BirdsFlocking /> */}
    </>
  );
};

export default Scene;
