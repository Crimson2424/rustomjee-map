import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { usePaths } from "./PathsContext";

export default function AnimatedPath({
  points,
  color = "cyan",
  duration = 4,
  glowIntensity = 2.5,
  packetSpeed = 2.0,
  packetCount = 3,
  packetWidth = 0.03,
  tubeRadius = 0.05
}) {
  const { selectedPath, selectedCategory } = usePaths();
  const meshRef = useRef();
  const materialRef = useRef();
  const progressRef = useRef(0);

  // Convert raw points to Vector3 curve
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
      false,
      "catmullrom",
      0.08
    );
  }, [points]);

  // Custom shader material with traveling packets
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uBaseColor: { value: new THREE.Color(color) },
        uPacketColor: { value: new THREE.Color("white") },
        uGlowIntensity: { value: glowIntensity },
        uPacketSpeed: { value: packetSpeed },
        uPacketCount: { value: packetCount },
        uPacketWidth: { value: packetWidth }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uBaseColor;
        uniform vec3 uPacketColor;
        uniform float uTime;
        uniform float uProgress;
        uniform float uGlowIntensity;
        uniform float uPacketSpeed;
        uniform float uPacketCount;
        uniform float uPacketWidth;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Hide fragments beyond current progress
          if (vUv.x > uProgress) {
            discard;
          }
          
          // Smooth radial shading for base tube (for 3D effect)
          float radialDist = abs(vUv.y - 0.5) * 2.0;
          float radialShading = smoothstep(1.0, 0.0, radialDist);
          radialShading = pow(radialShading, 0.8);
          
          // Solid base color with smooth shading
          vec3 baseColor = uBaseColor * (0.5 + radialShading * 0.5);
          
          // Calculate traveling packets (short pulses)
          float packetBrightness = 0.0;
          
          for (float i = 0.0; i < 10.0; i++) {
            if (i >= uPacketCount) break;
            
            // Each packet travels from 0 to 1 and loops
            float packetPosition = mod(uTime * uPacketSpeed * 0.2 + (i / uPacketCount), 1.0);
            
            // Distance from current position to packet center (only along X/length)
            float distanceToPacket = abs(vUv.x - packetPosition);
            
            // Create sharp, short pulse
            float packet = 1.0 - smoothstep(0.0, uPacketWidth, distanceToPacket);
            packet = pow(packet, 3.0); // Sharp falloff
            
            packetBrightness += packet;
          }
          
          // Pulse covers entire tube - only slight radial variation for depth
          float pulseRadialEffect = 0.7 + radialShading * 0.3;
          packetBrightness *= pulseRadialEffect;
          
          // Bright packet overlay
          vec3 packetGlow = uPacketColor * packetBrightness * uGlowIntensity;
          
          // Combine: solid base + bright packets (no edge glow)
          vec3 finalColor = baseColor + packetGlow;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: false,
      blending: THREE.NormalBlending,
      depthWrite: true,
      side: THREE.DoubleSide
    });
  }, [color, glowIntensity, packetSpeed, packetCount, packetWidth]);

  // Create tube geometry
  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(
      curve,
      512,  // tubular segments
      tubeRadius,  // radius
      16,   // radial segments
      false // closed
    );
  }, [curve, tubeRadius]);

  // Animate progress
  useEffect(() => {
    const obj = { t: 0 };
    progressRef.current = 0;
    
    gsap.to(obj, {
      t: 1,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        progressRef.current = obj.t;
        if (materialRef.current) {
          materialRef.current.uniforms.uProgress.value = obj.t;
        }
      }
    });
  }, [selectedPath, selectedCategory, duration]);

  // Update time uniform for animation
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  if (!points || points.length < 2) return null;

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0,15,0]}>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}