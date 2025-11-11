import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * TrafficFromSamples
 *
 * Props:
 * - samples: array of [x,y,z] points (ordered along the road path)
 * - particleCount: number of particles to spawn
 * - particleScale: base size for particles
 * - laneOffset: small lateral offset to create multiple lanes (optional)
 * - showDebug: draw spline and sample points
 * - reversed: if true, particles move in opposite direction
 */
export function TrafficFromSamples({
  samples = [],
  particleCount = 120,
  particleScale = 1.2,
  laneOffset = 0, // e.g. 1.2 to offset particles laterally
  showDebug = true,
  speedRange = [0.02, 0.06], // min, max
  reversed = false,
}) {
  const instancedRef = useRef();
  const dummy = useRef(new THREE.Object3D()).current;

  // Build smooth 3D curve from samples (lift slightly above to avoid z-fighting)
  const curve = useMemo(() => {
    if (!samples || samples.length < 4) return null;
    const pts = samples.map((p) => new THREE.Vector3(p[0], p[1] + 0.12, p[2]));
    // if path is mostly straight, CatmullRom still OK; use centripetal for stability
    return new THREE.CatmullRomCurve3(pts, false, "centripetal");
  }, [samples]);

  // Particle pool data
  const particles = useMemo(() => {
    if (!curve) return [];
    const arr = [];
    for (let i = 0; i < particleCount; i++) {
      const offset = Math.random(); // start offset along curve 0..1
      const speed =
        speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]);
      const color = Math.random() > 0.5 ? 0xffffff : 0xff2222;
      // lane lateral offset sign
      const side = Math.random() > 0.5 ? 1 : -1;
      arr.push({ offset, speed, color, side });
    }
    return arr;
  }, [curve, particleCount, speedRange]);

  // Precompute curve length and small step to compute forward direction
  const curveLen = useMemo(() => (curve ? curve.getLength() : 0), [curve]);
  const deltaU = useMemo(() => (curve ? 1 / Math.max(100, curveLen) : 0.001), [
    curve,
    curveLen,
  ]);

  // Animation loop
  useFrame((state) => {
    if (!curve || !instancedRef.current) return;
    const t = state.clock.elapsedTime;
    const direction = reversed ? -1 : 1;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      // Calculate position with direction multiplier, ensure proper wrapping
      let u = (t * p.speed * direction + p.offset) % 1;
      if (u < 0) u += 1; // Handle negative modulo

      // main position and tangent
      const pos = curve.getPointAt(u);
      let nextU = (u + deltaU * direction) % 1;
      if (nextU < 0) nextU += 1;
      const next = curve.getPointAt(nextU);
      const tangent = next.clone().sub(pos).normalize();

      // create lateral vector (cross tangent with up)
      const lateral = new THREE.Vector3().crossVectors(
        tangent,
        new THREE.Vector3(0, 1, 0)
      ).normalize();

      // apply optional lane offset (small lateral move)
      const lateralAmount = laneOffset ? lateral.multiplyScalar(p.side * laneOffset) : new THREE.Vector3(0,0,0);
      const finalPos = pos.clone().add(lateralAmount);

      // orient the particle along the tangent
      dummy.position.copy(finalPos);
      // look slightly ahead to align orientation
      dummy.lookAt(next.clone().add(lateralAmount));

      // scale: elongated streak along forward (z) direction
      const lengthScale = THREE.MathUtils.lerp(0.6, 1.8, (p.speed - speedRange[0]) / (speedRange[1] - speedRange[0] || 1));
      dummy.scale.set(particleScale * 0.4, particleScale * 0.4, particleScale * lengthScale);

      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(i, dummy.matrix);

      // set color per instance via instance color attribute (if material supports vertexColors)
      // We will set a uniform material color here; you can expand to instance colors if needed.
    }

    instancedRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!curve) return null;

  return (
    <>
      {/* Debug: spline line and sample points */}
      {showDebug && (
        <>
          <line
            geometry={new THREE.BufferGeometry().setFromPoints(
              curve.getPoints(Math.max(64, samples.length * 2))
            )}
          >
            <lineBasicMaterial attach="material" color="yellow" linewidth={2} />
          </line>

          {samples.map((p, i) => (
            <mesh
              key={`pt-${i}`}
              position={[p[0], p[1] + 0.12, p[2]]}
            >
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshBasicMaterial color={0x00ff88} />
            </mesh>
          ))}
        </>
      )}

      {/* Instanced particles (single-color material; additive blending for glow) */}
      <instancedMesh ref={instancedRef} args={[null, null, particles.length]}>
        {/* use a thin box to create directionality; adjust size via scale */}
        <boxGeometry args={[0.6, 0.2, 1.0]} />
        <meshBasicMaterial
          color={0xffffff}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
    </>
  );
}