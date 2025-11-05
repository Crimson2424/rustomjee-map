import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';

// Custom hook for ocean material
export const useOceanMaterial = () => {
  const { gl, scene, camera } = useThree();
  
  // Create depth render target
  const depthTexture = useMemo(() => {
    const renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
      }
    );
    renderTarget.depthTexture = new THREE.DepthTexture(
      window.innerWidth,
      window.innerHeight
    );
    renderTarget.depthTexture.format = THREE.DepthFormat;
    renderTarget.depthTexture.type = THREE.FloatType;
    return renderTarget;
  }, []);
  
  // Leva debug controls
  const controls = useControls('Ocean Waves', {
    wavesAmplitude: { value: 0.11, min: 0, max: 1.0, step: 0.01 },
    wavesSpeed: { value: 0.12, min: 0, max: 2, step: 0.01 },
    wavesFrequency: { value: 0.3, min: 0.1, max: 10, step: 0.1 },
    wavesPersistence: { value: 0.31, min: 0, max: 1, step: 0.01 },
    wavesLacunarity: { value: 2.4, min: 1, max: 4, step: 0.1 },
    wavesIterations: { value: 6, min: 1, max: 10, step: 1 },
  });

  const colorControls = useControls('Ocean Colors', {
    troughColor: { value: '#001a33' },
    surfaceColor: { value: '#004d73' },
    peakColor: { value: '#2aa5ce' },
    peakThreshold: { value: 0.15, min: -0.5, max: 0.5, step: 0.01 },
    peakTransition: { value: 0.1, min: 0, max: 0.5, step: 0.01 },
    troughThreshold: { value: -0.1, min: -0.5, max: 0.5, step: 0.01 },
    troughTransition: { value: 0.15, min: 0, max: 0.5, step: 0.01 },
  });

  const fresnelControls = useControls('Fresnel', {
    fresnelScale: { value: 0.6, min: 0, max: 1, step: 0.01 },
    fresnelPower: { value: 2.5, min: 0, max: 10, step: 0.1 },
  });

  const foamControls = useControls('Foam Settings', {
    foamDistance: { value: 0.3, min: 0, max: 2, step: 0.01 },
    foamStrength: { value: 0.8, min: 0, max: 1, step: 0.01 },
    foamColor: { value: '#ffffff' },
    foamNoiseScale: { value: 2.5, min: 0.1, max: 10, step: 0.1 },
    foamNoiseSpeed: { value: 0.8, min: 0, max: 2, step: 0.01 },
    foamCutoff: { value: 0.65, min: 0, max: 1, step: 0.01 },
    foamEdgeSoftness: { value: 0.2, min: 0, max: 1, step: 0.01 },
  });
  
  // Load environment map
  const environmentMap = useMemo(() => {
    const loader = new THREE.CubeTextureLoader();
    const urls = [
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/px.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nx.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/py.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/ny.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/pz.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nz.jpg',
    ];
    return loader.load(urls);
  }, []);
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWavesAmplitude: { value: 0 },
      uWavesSpeed: { value: 0 },
      uWavesFrequency: { value: 0 },
      uWavesPersistence: { value: 0 },
      uWavesLacunarity: { value: 0 },
      uWavesIterations: { value: 0 },
      uOpacity: { value: 1.0 },
      uTroughColor: { value: new THREE.Color() },
      uSurfaceColor: { value: new THREE.Color() },
      uPeakColor: { value: new THREE.Color() },
      uPeakThreshold: { value: 0 },
      uPeakTransition: { value: 0 },
      uTroughThreshold: { value: 0 },
      uTroughTransition: { value: 0 },
      uFresnelScale: { value: 0 },
      uFresnelPower: { value: 0 },
      uEnvironmentMap: { value: environmentMap },
      uDepthTexture: { value: null },
      uFoamDistance: { value: 0 },
      uFoamStrength: { value: 0 },
      uFoamColor: { value: new THREE.Color() },
      uFoamNoiseScale: { value: 0 },
      uFoamNoiseSpeed: { value: 0 },
      uFoamCutoff: { value: 0 },
      uFoamEdgeSoftness: { value: 0 },
      uCameraNear: { value: camera.near },
      uCameraFar: { value: camera.far },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }),
    [environmentMap, camera]
  );

  // Function to update uniforms from controls
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
    uniforms.uPeakThreshold.value = colorControls.peakThreshold;
    uniforms.uPeakTransition.value = colorControls.peakTransition;
    uniforms.uTroughThreshold.value = colorControls.troughThreshold;
    uniforms.uTroughTransition.value = colorControls.troughTransition;
    
    uniforms.uFresnelScale.value = fresnelControls.fresnelScale;
    uniforms.uFresnelPower.value = fresnelControls.fresnelPower;
    
    uniforms.uFoamDistance.value = foamControls.foamDistance;
    uniforms.uFoamStrength.value = foamControls.foamStrength;
    uniforms.uFoamColor.value.set(foamControls.foamColor);
    uniforms.uFoamNoiseScale.value = foamControls.foamNoiseScale;
    uniforms.uFoamNoiseSpeed.value = foamControls.foamNoiseSpeed;
    uniforms.uFoamCutoff.value = foamControls.foamCutoff;
    uniforms.uFoamEdgeSoftness.value = foamControls.foamEdgeSoftness;
  };

  const vertexShader = `
    precision highp float;
    
    uniform float uTime;
    uniform float uWavesAmplitude;
    uniform float uWavesSpeed;
    uniform float uWavesFrequency;
    uniform float uWavesPersistence;
    uniform float uWavesLacunarity;
    uniform float uWavesIterations;
    
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    varying vec4 vScreenPos;
    
    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    // Helper function to calculate elevation at any point
    float getElevation(float x, float z) {
      vec2 pos = vec2(x, z);
      float elevation = 0.0;
      float amplitude = 1.0;
      float frequency = uWavesFrequency;
      vec2 p = pos.xy;
      
      for(float i = 0.0; i < 10.0; i++) {
        if(i >= uWavesIterations) break;
        float noiseValue = snoise(p * frequency + uTime * uWavesSpeed);
        elevation += amplitude * noiseValue;
        amplitude *= uWavesPersistence;
        frequency *= uWavesLacunarity;
      }
      
      elevation *= uWavesAmplitude;
      return elevation;
    }
    
    void main() {
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      float elevation = getElevation(modelPosition.x, modelPosition.z);
      modelPosition.y += elevation;
      
      // Calculate normal using partial derivatives
      float eps = 0.001;
      vec3 tangent = normalize(vec3(eps, getElevation(modelPosition.x - eps, modelPosition.z) - elevation, 0.0));
      vec3 bitangent = normalize(vec3(0.0, getElevation(modelPosition.x, modelPosition.z - eps) - elevation, eps));
      vec3 objectNormal = normalize(cross(tangent, bitangent));
      
      vNormal = objectNormal;
      vWorldPosition = modelPosition.xyz;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      vScreenPos = projectedPosition;
      
      gl_Position = projectedPosition;
    }
  `;

  const fragmentShader = `
    precision highp float;
    
    uniform float uTime;
    uniform float uOpacity;
    uniform vec3 uTroughColor;
    uniform vec3 uSurfaceColor;
    uniform vec3 uPeakColor;
    uniform float uPeakThreshold;
    uniform float uPeakTransition;
    uniform float uTroughThreshold;
    uniform float uTroughTransition;
    uniform float uFresnelScale;
    uniform float uFresnelPower;
    uniform samplerCube uEnvironmentMap;
    
    // Foam uniforms
    uniform sampler2D uDepthTexture;
    uniform float uFoamDistance;
    uniform float uFoamStrength;
    uniform vec3 uFoamColor;
    uniform float uFoamNoiseScale;
    uniform float uFoamNoiseSpeed;
    uniform float uFoamCutoff;
    uniform float uFoamEdgeSoftness;
    uniform float uCameraNear;
    uniform float uCameraFar;
    uniform vec2 uResolution;
    
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    varying vec4 vScreenPos;
    
    // Simplex 2D noise for foam texture
    vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    float linearizeDepth(float depth) {
      float z = depth * 2.0 - 1.0;
      return (2.0 * uCameraNear * uCameraFar) / (uCameraFar + uCameraNear - z * (uCameraFar - uCameraNear));
    }
    
    void main() {
      // Calculate screen coordinates for depth sampling
      vec2 screenUV = (vScreenPos.xy / vScreenPos.w) * 0.5 + 0.5;
      
      // Sample depth texture
      float sceneDepth = texture2D(uDepthTexture, screenUV).r;
      float sceneLinearDepth = linearizeDepth(sceneDepth);
      float waterLinearDepth = linearizeDepth(gl_FragCoord.z);
      
      // Calculate depth difference (how close objects are to water surface)
      float depthDifference = sceneLinearDepth - waterLinearDepth;
      
      // Generate foam based on depth difference
      float foamFactor = 0.0;
      if (depthDifference > 0.0 && depthDifference < uFoamDistance) {
        // Basic foam from depth
        foamFactor = 1.0 - (depthDifference / uFoamDistance);
        foamFactor = smoothstep(0.0, 1.0, foamFactor);
        
        // Add noise to foam for more realistic appearance
        vec2 foamUV = vWorldPosition.xz * uFoamNoiseScale;
        float foamNoise1 = snoise(foamUV + uTime * uFoamNoiseSpeed * 0.5);
        float foamNoise2 = snoise(foamUV * 2.1 - uTime * uFoamNoiseSpeed * 0.3);
        float foamNoise3 = snoise(foamUV * 4.3 + uTime * uFoamNoiseSpeed * 0.7);
        
        // Combine noise layers
        float foamPattern = (foamNoise1 * 0.5 + foamNoise2 * 0.3 + foamNoise3 * 0.2);
        foamPattern = foamPattern * 0.5 + 0.5; // Normalize to 0-1
        
        // Apply cutoff to create foam patches
        foamPattern = smoothstep(uFoamCutoff - uFoamEdgeSoftness, uFoamCutoff + uFoamEdgeSoftness, foamPattern);
        
        // Combine depth-based foam with noise pattern
        foamFactor *= foamPattern * uFoamStrength;
        
        // Add extra foam at very close distances (splash effect)
        float splashFoam = 1.0 - smoothstep(0.0, uFoamDistance * 0.3, depthDifference);
        foamFactor = max(foamFactor, splashFoam * 0.9);
      }
      
      // Calculate vector from camera to the vertex
      vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
      vec3 reflectedDirection = reflect(viewDirection, vNormal);
      reflectedDirection.x = -reflectedDirection.x;
      
      // Sample environment map to get the reflected color
      vec4 reflectionColor = textureCube(uEnvironmentMap, reflectedDirection);
      
      // Calculate fresnel effect
      float fresnel = uFresnelScale * pow(1.0 - clamp(dot(viewDirection, vNormal), 0.0, 1.0), uFresnelPower);
      
      // Calculate elevation-based color
      float elevation = vWorldPosition.y;
      
      // Calculate transition factors using smoothstep
      float peakFactor = smoothstep(uPeakThreshold - uPeakTransition, uPeakThreshold + uPeakTransition, elevation);
      float troughFactor = smoothstep(uTroughThreshold - uTroughTransition, uTroughThreshold + uTroughTransition, elevation);
      
      // Mix between trough and surface colors based on trough transition
      vec3 mixedColor1 = mix(uTroughColor, uSurfaceColor, troughFactor);
      
      // Mix between surface and peak colors based on peak transition
      vec3 mixedColor2 = mix(mixedColor1, uPeakColor, peakFactor);
      
      // Mix the water color with the reflection color
      vec3 waterColor = mix(mixedColor2, reflectionColor.rgb, fresnel);
      
      // Apply foam on top
      vec3 finalColor = mix(waterColor, uFoamColor, foamFactor);
      
      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `;

  return {
    uniforms,
    vertexShader,
    fragmentShader,
    depthTexture,
    gl,
    scene,
    camera,
    updateUniforms
  };
};

// Component that can be used as a child of any mesh
export const OceanMaterial = React.forwardRef((props, ref) => {
  const materialData = useOceanMaterial();
  const materialRef = useRef();
  const parentMeshRef = useRef();
  
  // Combine refs
  React.useImperativeHandle(ref, () => materialRef.current);
  
  useFrame((state) => {
    if (materialRef.current) {
      // Update uniforms from Leva controls every frame
      materialData.updateUniforms();
      
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Find parent mesh
      if (!parentMeshRef.current && materialRef.current.parent) {
        let current = materialRef.current.parent;
        while (current && !current.isMesh) {
          current = current.parent;
        }
        parentMeshRef.current = current;
      }
      
      // Render scene depth to texture (excluding water)
      if (parentMeshRef.current) {
        parentMeshRef.current.visible = false;
        const currentRenderTarget = materialData.gl.getRenderTarget();
        materialData.gl.setRenderTarget(materialData.depthTexture);
        materialData.gl.render(materialData.scene, materialData.camera);
        materialData.gl.setRenderTarget(currentRenderTarget);
        parentMeshRef.current.visible = true;
        
        // Update depth texture uniform
        materialRef.current.uniforms.uDepthTexture.value = materialData.depthTexture.depthTexture;
      }
    }
  });
  
  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={materialData.uniforms}
      vertexShader={materialData.vertexShader}
      fragmentShader={materialData.fragmentShader}
      transparent={true}
      side={THREE.DoubleSide}
      {...props}
    />
  );
});