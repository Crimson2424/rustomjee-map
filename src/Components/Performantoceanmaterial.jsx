import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const usePerformantOceanMaterial = () => {
  const { scene, camera } = useThree();

  

  // Environment Cubemap
  const environmentMap = useMemo(() => {
    const loader = new THREE.CubeTextureLoader();
    loader.setPath('/environment/');
    
    return loader.load([
      'px.jpg',
      'nx.jpg',
      'py.jpg',
      'ny.jpg',
      'pz.jpg',
      'nz.jpg',
    ]);
  }, []);

  /* ------------------- Uniforms ------------------- */
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uWavesAmplitude: { value: 0.04 },
    uWavesSpeed: { value: 0.11 },
    uWavesFrequency: { value: 0.04 },
    uWavesPersistence: { value: 0.24 },
    uWavesLacunarity: { value: 2.7 },
    uWavesIterations: { value: 6 },
    uWaterAlpha: { value:0.25 },
    uTroughColor: { value: new THREE.Color('#00f5ff') },
    uSurfaceColor: { value: new THREE.Color('#488378') },
    uPeakColor: { value: new THREE.Color('#4d8cb3') },
    uColorMixStrength: { value: 0 },
    uFresnelScale: { value: 0.7 },
    uFresnelPower: { value: 2.8 },
    uReflectionStrength: { value: 0.75 },
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
    // uniform vec3  uAbsorption;
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
    
  };
};

/* ---------------- Material Component ---------------- */
export const PerformantOceanMaterial = React.forwardRef((props, ref) => {
  const mat = usePerformantOceanMaterial();
  const materialRef = useRef();

  React.useImperativeHandle(ref, () => materialRef.current);

  useFrame((state) => {
    if (!materialRef.current) return;
    
   
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