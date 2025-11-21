import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';

export const usePerformantOceanMaterial = () => {
  const { scene, camera } = useThree();

  /* ........... Existing LEVA CONTROLS .......... */
  const controls = useControls('Ocean Waves', {
    wavesAmplitude: { value: 0.04 , min: 0, max: 2.0, step: 0.01 },
    wavesSpeed: { value: 0.11, min: 0, max: 2, step: 0.01 },
    wavesFrequency: { value: 0.04, min: -1, max: 5, step: 0.001 },
    wavesPersistence: { value: 0.24, min: 0, max: 1, step: 0.01 },
    wavesLacunarity: { value: 2.7 , min: 1, max: 4, step: 0.1 },
    wavesIterations: { value: 6, min: 1, max: 10, step: 1 },
  },{ collapsed: true });

  const colorControls = useControls('Ocean Colors', {
    troughColor: '#00f5ff',
    surfaceColor: '#488378',
    peakColor: '#4d8cb3',
    colorMixStrength: { value: 0.6, min: 0, max: 1 },
  },{ collapsed: true });

  const fresnelControls = useControls('Fresnel & Reflection', {
    fresnelScale: { value: 0.7, min: 0, max: 1 },
    fresnelPower: { value: 2.8 , min: 0, max: 10 },
    reflectionStrength: { value: 0.75, min: 0, max: 1 },
  },{ collapsed: true });

  const transparencyControls = useControls('Water Alpha', {
    waterAlpha: { value: 0.25, min: 0.0, max: 1.0 },
  },{ collapsed: true });

  const depthFade = useControls('Depth Transparency', {
    depthToOpaque: { value: 4.0, min: 0.2, max: 50 },
    minAlpha: { value: 0.05, min: 0, max: 1 },
    maxAlpha: { value: 0.95, min: 0, max: 1 },
    absorption: { r: 0.15, g: 0.35, b: 0.45 },
    tint: '#1e6b7a'
  },{ collapsed: true });

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
    uFresnelScale: { value: 0 },
    uFresnelPower: { value: 0 },
    uReflectionStrength: { value: 0 },
    uEnvironmentMap: { value: environmentMap },

    // Depth fade uniforms
    uDepthToOpaque: { value: 4.0 },
    uMinAlpha: { value: 0.05 },
    uMaxAlpha: { value: 0.95 },
    uAbsorption: { value: new THREE.Vector3(0.15, 0.35, 0.45) },
    uDepthTint: { value: new THREE.Color('#1e6b7a') },

    // Fog uniforms
    uFogColor: { value: new THREE.Color() },
    uFogNear: { value: 1 },
    uFogFar: { value: 1000 },
    uFogDensity: { value: 0.00025 },
    uUseFog: { value: 0 },
  }), [environmentMap]);

  // Cache for uniform updates - only update when values change
  const uniformCache = useRef({});

  /* ---------------- Optimized Uniform Updates ---------------- */
  const updateUniforms = () => {
    const cache = uniformCache.current;
    
    // Only update if values have changed
    if (cache.wavesAmplitude !== controls.wavesAmplitude) {
      uniforms.uWavesAmplitude.value = controls.wavesAmplitude;
      cache.wavesAmplitude = controls.wavesAmplitude;
    }
    if (cache.wavesSpeed !== controls.wavesSpeed) {
      uniforms.uWavesSpeed.value = controls.wavesSpeed;
      cache.wavesSpeed = controls.wavesSpeed;
    }
    if (cache.wavesFrequency !== controls.wavesFrequency) {
      uniforms.uWavesFrequency.value = controls.wavesFrequency;
      cache.wavesFrequency = controls.wavesFrequency;
    }
    if (cache.wavesPersistence !== controls.wavesPersistence) {
      uniforms.uWavesPersistence.value = controls.wavesPersistence;
      cache.wavesPersistence = controls.wavesPersistence;
    }
    if (cache.wavesLacunarity !== controls.wavesLacunarity) {
      uniforms.uWavesLacunarity.value = controls.wavesLacunarity;
      cache.wavesLacunarity = controls.wavesLacunarity;
    }
    if (cache.wavesIterations !== controls.wavesIterations) {
      uniforms.uWavesIterations.value = controls.wavesIterations;
      cache.wavesIterations = controls.wavesIterations;
    }
    
    if (cache.troughColor !== colorControls.troughColor) {
      uniforms.uTroughColor.value.set(colorControls.troughColor);
      cache.troughColor = colorControls.troughColor;
    }
    if (cache.surfaceColor !== colorControls.surfaceColor) {
      uniforms.uSurfaceColor.value.set(colorControls.surfaceColor);
      cache.surfaceColor = colorControls.surfaceColor;
    }
    if (cache.peakColor !== colorControls.peakColor) {
      uniforms.uPeakColor.value.set(colorControls.peakColor);
      cache.peakColor = colorControls.peakColor;
    }
    if (cache.colorMixStrength !== colorControls.colorMixStrength) {
      uniforms.uColorMixStrength.value = colorControls.colorMixStrength;
      cache.colorMixStrength = colorControls.colorMixStrength;
    }
    
    if (cache.fresnelScale !== fresnelControls.fresnelScale) {
      uniforms.uFresnelScale.value = fresnelControls.fresnelScale;
      cache.fresnelScale = fresnelControls.fresnelScale;
    }
    if (cache.fresnelPower !== fresnelControls.fresnelPower) {
      uniforms.uFresnelPower.value = fresnelControls.fresnelPower;
      cache.fresnelPower = fresnelControls.fresnelPower;
    }
    if (cache.reflectionStrength !== fresnelControls.reflectionStrength) {
      uniforms.uReflectionStrength.value = fresnelControls.reflectionStrength;
      cache.reflectionStrength = fresnelControls.reflectionStrength;
    }
    
    if (cache.waterAlpha !== transparencyControls.waterAlpha) {
      uniforms.uWaterAlpha.value = transparencyControls.waterAlpha;
      cache.waterAlpha = transparencyControls.waterAlpha;
    }

    // Depth fade
    if (cache.depthToOpaque !== depthFade.depthToOpaque) {
      uniforms.uDepthToOpaque.value = depthFade.depthToOpaque;
      cache.depthToOpaque = depthFade.depthToOpaque;
    }
    if (cache.minAlpha !== depthFade.minAlpha) {
      uniforms.uMinAlpha.value = depthFade.minAlpha;
      cache.minAlpha = depthFade.minAlpha;
    }
    if (cache.maxAlpha !== depthFade.maxAlpha) {
      uniforms.uMaxAlpha.value = depthFade.maxAlpha;
      cache.maxAlpha = depthFade.maxAlpha;
    }
    
    const a = depthFade.absorption;
    const absKey = `${a.r}_${a.g}_${a.b}`;
    if (cache.absorption !== absKey) {
      uniforms.uAbsorption.value.set(a.r, a.g, a.b);
      cache.absorption = absKey;
    }
    
    if (cache.tint !== depthFade.tint) {
      uniforms.uDepthTint.value.set(depthFade.tint);
      cache.tint = depthFade.tint;
    }
  };

  /* ---------------- Vertex Shader ---------------- */
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vec4 viewPosition = viewMatrix * worldPosition;
      vViewPosition = viewPosition.xyz;
      gl_Position = projectionMatrix * viewPosition;
    }
  `;

  /* ---------------- Optimized Fragment Shader (No Depth or Reflections) ---------------- */
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
    uniform float uFresnelScale;
    uniform float uFresnelPower;
    uniform float uReflectionStrength;
    uniform samplerCube uEnvironmentMap;
    uniform float uWaterAlpha;

    // depth fade
    uniform float uDepthToOpaque;
    uniform float uMinAlpha;
    uniform float uMaxAlpha;
    uniform vec3  uAbsorption;
    uniform vec3  uDepthTint;

    // fog
    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;
    uniform float uFogDensity;
    uniform float uUseFog;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    varying vec3 vViewPosition;

    // Optimized permute function
    vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

    // Optimized simplex noise
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

    // OPTIMIZED: Combined wave elevation and normal calculation in single pass
    void getWaveData(out float elevation, out vec3 normal) {
      vec2 pos = vWorldPosition.xz;
      float e = 0.0;
      vec3 n = vec3(0.0, 1.0, 0.0);
      float a = 1.0;
      float f = uWavesFrequency;
      float ampScale = uWavesAmplitude;
      float timeOffset = uTime * uWavesSpeed;
      
      // Single loop for both elevation and normal - major optimization
      for(float i = 0.0; i < 10.0; i++){
        if(i >= uWavesIterations) break;
        vec2 p = pos * f + timeOffset;
        float noiseVal = snoise(p);
        e += a * noiseVal;
        
        // Calculate gradient for normal (optimized with constants)
        const float eps = 0.01;
        float dx = snoise(p + vec2(eps, 0.0)) - noiseVal;
        float dz = snoise(p + vec2(0.0, eps)) - noiseVal;
        
        // Accumulate normal contributions
        float normalScale = a * ampScale * 20.0;
        n.x += dx * normalScale;
        n.z += dz * normalScale;
        
        a *= uWavesPersistence;
        f *= uWavesLacunarity;
      }
      
      elevation = e * ampScale;
      normal = normalize(n);
    }

    void main() {
      // Get wave data in single pass
      float waveElev;
      vec3 waveNorm;
      getWaveData(waveElev, waveNorm);
      
      // Optimize normal and view calculations
      vec3 n = normalize(vNormal + waveNorm * 0.7);
      vec3 viewDir = normalize(vViewPosition);

      // Environment-only reflection
      vec3 refl = reflect(viewDir, n);
      refl = (inverse(viewMatrix) * vec4(refl, 0.0)).xyz;
      refl.x = -refl.x;
      vec3 reflectionColor = textureCube(uEnvironmentMap, refl).rgb;

      // Fresnel calculation
      float fres = uFresnelScale * pow(1.0 - abs(dot(viewDir, n)), uFresnelPower);

      // Optimized color mixing
      float peakT = smoothstep(0.05, 0.25, waveElev);
      float troughT = smoothstep(-0.25, 0.15, waveElev);
      vec3 c = mix(uTroughColor, uSurfaceColor, troughT);
      c = mix(c, uPeakColor, peakT);
      vec3 waterColor = mix(uSurfaceColor, c, uColorMixStrength);
      vec3 finalColor = mix(waterColor, reflectionColor, fres * uReflectionStrength);

      // Simplified depth-based tinting using view distance as proxy
      float viewDepth = length(vViewPosition);
      float depthFactor = smoothstep(0.0, uDepthToOpaque, viewDepth);
      
      // Beer–Lambert attenuation based on view depth
      vec3 trans = exp(-uAbsorption * viewDepth * 0.1);
      vec3 absorbed = finalColor * trans;
      float maxTrans = max(max(trans.r, trans.g), trans.b);
      vec3 tinted = mix(absorbed, uDepthTint, clamp(1.0 - maxTrans, 0.0, 1.0));
      finalColor = tinted;

      // Alpha calculation using view depth
      float alphaDepth = smoothstep(0.0, uDepthToOpaque * 2.0, viewDepth);
      float depthAlpha = mix(uMinAlpha, uMaxAlpha, alphaDepth);
      float alpha = min(uWaterAlpha, depthAlpha);
      alpha = mix(alpha, 1.0, fres * 0.8);

      // Apply fog
      if (uUseFog > 0.5) {
        float depth = viewDepth;
        float fogFactor = (uUseFog < 1.5) 
          ? smoothstep(uFogNear, uFogFar, depth)
          : 1.0 - exp(-uFogDensity * uFogDensity * depth * depth);
        
        finalColor = mix(finalColor, uFogColor, fogFactor);
      }

      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  return {
    uniforms, 
    vertexShader, 
    fragmentShader, 
    scene, 
    camera, 
    updateUniforms
  };
};

/* ---------------- Material Component ---------------- */
export const PerformantOceanMaterial = React.forwardRef((props, ref) => {
  const mat = usePerformantOceanMaterial();
  const materialRef = useRef();

  React.useImperativeHandle(ref, () => materialRef.current);

  useFrame((state) => {
    if (!materialRef.current) return;
    
    mat.updateUniforms();
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Update fog uniforms only when fog exists
    if (mat.scene.fog) {
      materialRef.current.uniforms.uFogColor.value.copy(mat.scene.fog.color);
      if (mat.scene.fog.isFog) {
        materialRef.current.uniforms.uUseFog.value = 1;
        materialRef.current.uniforms.uFogNear.value = mat.scene.fog.near;
        materialRef.current.uniforms.uFogFar.value = mat.scene.fog.far;
      } else if (mat.scene.fog.isFogExp2) {
        materialRef.current.uniforms.uUseFog.value = 2;
        materialRef.current.uniforms.uFogDensity.value = mat.scene.fog.density;
      }
    } else {
      materialRef.current.uniforms.uUseFog.value = 0;
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