// useOceanMaterial.js
import * as THREE from "three";
import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export const useOceanMaterial = (meshRef) => {
  const { gl, scene, camera } = useThree();

  // ----- Render targets -----
  const depthRT = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    rt.depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight);
    rt.depthTexture.format = THREE.DepthFormat;
    rt.depthTexture.type = THREE.FloatType;
    return rt;
  }, []);

  const reflectionRT = useMemo(
    () =>
      new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }),
    []
  );

  // ----- Controls (put your Leva here if you want) -----
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDepthTexture: { value: null },
      uReflectionTexture: { value: null },
      uReflectionStrength: { value: 0.35 }, // tweakable
      uCameraNear: { value: camera.near },
      uCameraFar: { value: camera.far },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },

      // Add your existing ocean + foam uniforms here
      uWavesAmplitude: { value: 0.12 },
      uWavesSpeed: { value: 0.12 },
      uWavesFrequency: { value: 0.25 },
      uWavesPersistence: { value: 0.35 },
      uWavesLacunarity: { value: 2.4 },
      uWavesIterations: { value: 6 },
      uTroughColor: { value: new THREE.Color("#001b2e") },
      uSurfaceColor: { value: new THREE.Color("#055080") },
      uPeakColor: { value: new THREE.Color("#4ec8ff") },
      uFoamColor: { value: new THREE.Color("#ffffff") },
      uFoamDistance: { value: 0.25 },
      uFoamStrength: { value: 0.8 },
      uFoamNoiseScale: { value: 2.0 },
      uFoamNoiseSpeed: { value: 0.8 },
      uFoamCutoff: { value: 0.64 },
      uFoamEdgeSoftness: { value: 0.2 },
      uFresnelScale: { value: 0.55 },
      uFresnelPower: { value: 2.5 },
    }),
    []
  );

  // ----- Per-frame Reflection + Depth Pass -----
  useFrame((state) => {
    if (!meshRef.current) return;

    uniforms.uTime.value = state.clock.elapsedTime;

    // ---- Reflection Pass ----
    const origY = camera.position.y;
    const mirrorCam = camera.clone();
    mirrorCam.position.y = -origY;
    mirrorCam.lookAt(0, 0, -1);

    meshRef.current.visible = false;
    gl.setRenderTarget(reflectionRT);
    gl.render(scene, mirrorCam);
    gl.setRenderTarget(null);
    meshRef.current.visible = true;

    uniforms.uReflectionTexture.value = reflectionRT.texture;

    // ---- Depth Pass ----
    meshRef.current.visible = false;
    gl.setRenderTarget(depthRT);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    meshRef.current.visible = true;

    uniforms.uDepthTexture.value = depthRT.depthTexture;
  });

  return uniforms;
};
