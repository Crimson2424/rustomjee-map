import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';

export const usePerformantOceanMaterial = () => {
  const { gl, scene, camera } = useThree();

  // Depth RT
  const depthTarget = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    });
    rt.depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight);
    rt.depthTexture.format = THREE.DepthFormat;
    return rt;
  }, []);

  // Resize RT on window resize
  useEffect(() => {
    const resize = () => {
      depthTarget.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [depthTarget]);

  /* ........... Existing LEVA CONTROLS .......... */
  const controls = useControls('Ocean Waves', {
    wavesAmplitude: { value: 0.04 , min: 0, max: 2.0, step: 0.01 },
    wavesSpeed: { value: 0.11, min: 0, max: 2, step: 0.01 },
    wavesFrequency: { value: 0.04, min: -1, max: 5, step: 0.001 },
    wavesPersistence: { value: 0.24, min: 0, max: 1, step: 0.01 },
    wavesLacunarity: { value: 2.7 , min: 1, max: 4, step: 0.1 },
    wavesIterations: { value: 6, min: 1, max: 10, step: 1 },
  });

  const colorControls = useControls('Ocean Colors', {
    troughColor: '#00f5ff',
    surfaceColor: '#488378',
    peakColor: '#4d8cb3',
    colorMixStrength: { value: 0.6, min: 0, max: 1 },
  });

  const fresnelControls = useControls('Fresnel & Reflection', {
    fresnelScale: { value: 0.7, min: 0, max: 1 },
    fresnelPower: { value: 2.8 , min: 0, max: 10 },
    reflectionStrength: { value: 0.75, min: 0, max: 1 },
  });

  const foamControls = useControls('Foam Settings', {
    foamDistance: 0.5,
    foamStrength: 1.0,
    foamNoiseScale: 3.0,
    foamNoiseSpeed: 0.6,
    foamCutoff: 0.5,
    foamEdgeSoftness: 0.25,
  });

  const transparencyControls = useControls('Water Alpha', {
    waterAlpha: { value: 0.6, min: 0.0, max: 1.0 },
  });

  // NEW depth fade controls
  const depthFade = useControls('Depth Transparency', {
    depthToOpaque: { value: 4.0, min: 0.2, max: 50 },
    minAlpha: { value: 0.05, min: 0, max: 1 },
    maxAlpha: { value: 0.95, min: 0, max: 1 },
    absorption: { r: 0.15, g: 0.35, b: 0.45 },
    tint: '#1e6b7a'
  });

  // Environment Cubemap
  const environmentMap = useMemo(() => {
    const loader = new THREE.CubeTextureLoader();
    return loader.load([
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/px.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nx.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/py.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/ny.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/pz.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nz.jpg',
    ]);
  }, []);

  /* ------------------- Uniforms ------------------- */
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uWavesAmplitude: { value: 0 },
    uWavesSpeed: { value: 0 },
    uWavesFrequency: { value: 0 },
    uWavesPersistence: { value: 0 },
    uWavesLacunarity: { value: 0 },
    uWavesIterations: { value: 0 },
    uWaterAlpha: { value: 0.6 },
    uTroughColor: { value: new THREE.Color() },
    uSurfaceColor: { value: new THREE.Color() },
    uPeakColor: { value: new THREE.Color() },
    uColorMixStrength: { value: 0 },
    uFoamColor: { value: new THREE.Color('#ffffff') },
    uFresnelScale: { value: 0 },
    uFresnelPower: { value: 0 },
    uReflectionStrength: { value: 0 },
    uEnvironmentMap: { value: environmentMap },
    uDepthTexture: { value: null },
    uFoamDistance: { value: 0 },
    uFoamStrength: { value: 0 },
    uFoamNoiseScale: { value: 0 },
    uFoamNoiseSpeed: { value: 0 },
    uFoamCutoff: { value: 0 },
    uFoamEdgeSoftness: { value: 0 },
    uCameraNear: { value: camera.near },
    uCameraFar: { value: camera.far },

    // **Depth fade uniforms**
    uDepthToOpaque: { value: 4.0 },
    uMinAlpha: { value: 0.05 },
    uMaxAlpha: { value: 0.95 },
    uAbsorption: { value: new THREE.Vector3(0.15, 0.35, 0.45) },
    uDepthTint: { value: new THREE.Color('#1e6b7a') },
  }), [environmentMap, camera]);

  /* ---------------- Uniform Updates ---------------- */
  const updateUniforms = () => {
    uniforms.uWavesAmplitude.value = controls.wavesAmplitude;
    uniforms.uWavesSpeed.value = controls.wavesSpeed;
    uniforms.uWavesFrequency.value = controls.wavesFrequency;
    uniforms.uWavesPersistence.value = controls.wavesPersistence;
    uniforms.uWavesLacunarity.value = controls.wavesLacunarity;
    uniforms.uWavesIterations.value = controls.wavesIterations;
    uniforms.uTroughColor.value.set(colorControls.troughColor);
    uniforms.uSurfaceColor.value.set(colorControls.surfaceColor);
    uniforms.uPeakColor.value.set(colorControls.peakColor);
    uniforms.uColorMixStrength.value = colorControls.colorMixStrength;
    uniforms.uFresnelScale.value = fresnelControls.fresnelScale;
    uniforms.uFresnelPower.value = fresnelControls.fresnelPower;
    uniforms.uReflectionStrength.value = fresnelControls.reflectionStrength;
    uniforms.uFoamDistance.value = foamControls.foamDistance;
    uniforms.uFoamStrength.value = foamControls.foamStrength;
    uniforms.uFoamNoiseScale.value = foamControls.foamNoiseScale;
    uniforms.uFoamNoiseSpeed.value = foamControls.foamNoiseSpeed;
    uniforms.uFoamCutoff.value = foamControls.foamCutoff;
    uniforms.uFoamEdgeSoftness.value = foamControls.foamEdgeSoftness;
    uniforms.uWaterAlpha.value = transparencyControls.waterAlpha;

    // Depth fade
    uniforms.uDepthToOpaque.value = depthFade.depthToOpaque;
    uniforms.uMinAlpha.value = depthFade.minAlpha;
    uniforms.uMaxAlpha.value = depthFade.maxAlpha;
    const a = depthFade.absorption;
    uniforms.uAbsorption.value.set(a.r, a.g, a.b);
    uniforms.uDepthTint.value.set(depthFade.tint);
  };

  /* ---------------- Vertex Shader ---------------- */
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    varying vec4 vScreenPos;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vec4 viewPosition = viewMatrix * worldPosition;
      vViewPosition = viewPosition.xyz;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      vScreenPos = projectedPosition;
      gl_Position = projectedPosition;
    }
  `;

  /* ---------------- Fragment Shader ---------------- */
  const fragmentShader = `
    precision highp float;
    uniform float uTime;
    uniform float uWavesAmplitude;
    uniform float uWavesSpeed;
    uniform float uWavesFrequency;
    uniform float uWavesPersistence;
    uniform float uWavesLacunarity;
    uniform float uWavesIterations;
    uniform vec3 uTroughColor;
    uniform vec3 uSurfaceColor;
    uniform vec3 uPeakColor;
    uniform float uColorMixStrength;
    uniform vec3 uFoamColor;
    uniform float uFresnelScale;
    uniform float uFresnelPower;
    uniform float uReflectionStrength;
    uniform samplerCube uEnvironmentMap;
    uniform float uWaterAlpha;
    uniform sampler2D uDepthTexture;
    uniform float uFoamDistance;
    uniform float uFoamStrength;
    uniform float uFoamNoiseScale;
    uniform float uFoamNoiseSpeed;
    uniform float uFoamCutoff;
    uniform float uFoamEdgeSoftness;
    uniform float uCameraNear;
    uniform float uCameraFar;

    // depth fade
    uniform float uDepthToOpaque;
    uniform float uMinAlpha;
    uniform float uMaxAlpha;
    uniform vec3  uAbsorption;
    uniform vec3  uDepthTint;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    varying vec4 vScreenPos;
    varying vec3 vViewPosition;

    vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p*C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314*(a0*a0+h*h);
      vec3 g;
      g.x = a0.x*x0.x + h.x*x0.y;
      g.yz = a0.yz*x12.xz + h.yz*x12.yw;
      return 130.0*dot(m, g);
    }

    float linearizeDepth(float d) {
      float z = d * 2.0 - 1.0;
      return (2.0 * uCameraNear * uCameraFar) / (uCameraFar + uCameraNear - z * (uCameraFar - uCameraNear));
    }

    float getWaveElevation() {
      vec2 pos = vWorldPosition.xz;
      float e = 0.0;
      float a = 1.0;
      float f = uWavesFrequency;
      for(float i=0.0; i<10.0; i++){
        if(i >= uWavesIterations) break;
        float n = snoise(pos*f + uTime*uWavesSpeed);
        e += a*n;
        a *= uWavesPersistence;
        f *= uWavesLacunarity;
      }
      return e * uWavesAmplitude;
    }

    vec3 getWaveNormal() {
      vec2 pos = vWorldPosition.xz;
      float a = 1.0;
      float f = uWavesFrequency;
      vec3 n = vec3(0.0,1.0,0.0);
      for(float i=0.0; i<10.0; i++){
        if(i >= uWavesIterations) break;
        vec2 p = pos*f + uTime*uWavesSpeed;
        float v = snoise(p);
        float eps = 0.01;
        float dx = snoise(p + vec2(eps,0.0)) - v;
        float dz = snoise(p + vec2(0.0,eps)) - v;
        n.x += dx*a*uWavesAmplitude*20.0;
        n.z += dz*a*uWavesAmplitude*20.0;
        a *= uWavesPersistence;
        f *= uWavesLacunarity;
      }
      return normalize(n);
    }

    void main() {
      float waveElev = getWaveElevation();
      vec3 waveNorm = getWaveNormal();
      vec3 n = normalize(vNormal + waveNorm * 0.7);
      vec3 viewDir = normalize(vViewPosition);
      vec3 refl = reflect(viewDir, n);
      refl = (inverse(viewMatrix) * vec4(refl,0.0)).xyz;
      refl.x = -refl.x;
      vec4 env = textureCube(uEnvironmentMap, refl);
      float fres = uFresnelScale * pow(1.0 - abs(dot(viewDir,n)), uFresnelPower);

      float peakT = smoothstep(0.05,0.25,waveElev);
      float troughT = smoothstep(-0.25,0.15,waveElev);
      vec3 c = mix(uTroughColor, uSurfaceColor, troughT);
      c = mix(c, uPeakColor, peakT);
      vec3 waterColor = mix(uSurfaceColor, c, uColorMixStrength);
      vec3 finalColor = mix(waterColor, env.rgb, fres*uReflectionStrength);

      vec2 uv = (vScreenPos.xy / vScreenPos.w)*0.5+0.5;
      float sd = texture2D(uDepthTexture, uv).r;
      float sceneD = linearizeDepth(sd);
      float waterD = linearizeDepth(gl_FragCoord.z);
      float diff = sceneD - waterD;
      bool noOcc = sd >= 0.9999;
      float wDepth = noOcc ? 0.0 : max(0.0, diff);

      // Beer–Lambert attenuation
      vec3 trans = exp(-uAbsorption * wDepth);
      vec3 absorbed = finalColor * trans;
      vec3 tinted = mix(absorbed, uDepthTint, clamp(1.0 - max(max(trans.r, trans.g), trans.b), 0.0,1.0));
      finalColor = tinted;

      float alphaDepth = smoothstep(0.0, uDepthToOpaque, wDepth);
      float depthAlpha = mix(uMinAlpha, uMaxAlpha, alphaDepth);
      float alpha = min(uWaterAlpha, depthAlpha);
      alpha = mix(alpha, 1.0, fres * 0.8);

      // Foam
      float foam=0.0;
      if(diff > 0.0 && diff < uFoamDistance){
        foam = 1.0 - (diff/uFoamDistance);
        foam = pow(foam,0.7);
        vec2 fuv = vWorldPosition.xz * uFoamNoiseScale;
        float n1=snoise(fuv + uTime*uFoamNoiseSpeed*0.5);
        float n2=snoise(fuv*2.1 - uTime*uFoamNoiseSpeed*0.3);
        float n3=snoise(fuv*4.3 + uTime*uFoamNoiseSpeed*0.7);
        float pat = (n1*0.5 + n2*0.3 + n3*0.2)*0.5+0.5;
        pat = smoothstep(uFoamCutoff-uFoamEdgeSoftness, uFoamCutoff+uFoamEdgeSoftness, pat);
        foam *= pat;
        float spl = 1.0 - smoothstep(0.0, uFoamDistance*0.3, diff);
        foam = max(foam, spl*0.8);
        foam *= uFoamStrength;
        foam = clamp(foam,0.0,1.0);
      }

      finalColor = mix(finalColor, uFoamColor, foam);

      alpha = clamp(alpha + foam*0.15, 0.0, 1.0);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  return {
    uniforms, vertexShader, fragmentShader, depthTarget, gl, scene, camera, updateUniforms
  };
};

/* ---------------- Material Component ---------------- */
export const PerformantOceanMaterial = React.forwardRef((props, ref) => {
  const mat = usePerformantOceanMaterial();
  const materialRef = useRef();
  const parentRef = useRef();

  React.useImperativeHandle(ref, () => materialRef.current);

  useFrame((state) => {
    if (!materialRef.current) return;
    mat.updateUniforms();
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    if (!parentRef.current && materialRef.current.parent) {
      let p = materialRef.current.parent;
      while (p && !p.isMesh) p = p.parent;
      parentRef.current = p;
    }

    if (parentRef.current) {
      parentRef.current.visible = false;
      const prev = mat.gl.getRenderTarget();
      mat.gl.setRenderTarget(mat.depthTarget);
      mat.gl.render(mat.scene, mat.camera);
      mat.gl.setRenderTarget(prev);
      parentRef.current.visible = true;
      materialRef.current.uniforms.uDepthTexture.value = mat.depthTarget.depthTexture;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={mat.uniforms}
      vertexShader={mat.vertexShader}
      fragmentShader={mat.fragmentShader}
      transparent
      depthWrite={false}
      {...props}
    />
  );
});
