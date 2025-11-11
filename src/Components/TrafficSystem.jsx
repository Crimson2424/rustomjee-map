import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Traffic particles that follow the *actual mesh path* of the roads.
 */
export function ImprovedTrafficSystem({
  roadNodes,
  nodes,
  particleCount = 100,
  showDebug = true,
}) {
  const instancedRef = useRef();
  const dummy = new THREE.Object3D();

  // 🧠 Helper: create an ordered path from a mesh’s geometry
  function extractPathFromGeometry(node) {
    let geom = node.geometry.clone();
    geom = BufferGeometryUtils.mergeVertices(geom);

    // Get position array
    const pos = geom.attributes.position.array;
    const verts = [];
    for (let i = 0; i < pos.length; i += 3) {
      const v = new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]);
      v.applyMatrix4(node.matrixWorld);
      verts.push(v);
    }

    // --- Simplify to 2D and remove duplicates
    const unique = [];
    const seen = new Set();
    for (let v of verts) {
      const key = `${v.x.toFixed(1)}_${v.z.toFixed(1)}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(new THREE.Vector2(v.x, v.z));
      }
    }

    // --- Try to order points along their nearest neighbors
    const ordered = [unique[0]];
    const remaining = unique.slice(1);

    while (remaining.length > 0) {
      const last = ordered[ordered.length - 1];
      let nearestIdx = 0;
      let nearestDist = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const d = last.distanceTo(remaining[i]);
        if (d < nearestDist) {
          nearestDist = d;
          nearestIdx = i;
        }
      }

      ordered.push(remaining.splice(nearestIdx, 1)[0]);
    }

    // --- Convert back to 3D path slightly above ground
    const pts3D = ordered.map(
      (v) => new THREE.Vector3(v.x, node.position.y + 0.3, v.y)
    );

    // --- Build smooth spline
    if (pts3D.length > 3) {
      return new THREE.CatmullRomCurve3(pts3D, false, "centripetal", 0.5);
    }
    return null;
  }

  // 🔹 1. Build road curves
  const roadCurves = useMemo(() => {
    const curves = [];
    for (let name of roadNodes) {
      const node = nodes[name];
      if (!node?.geometry) continue;
      const curve = extractPathFromGeometry(node);
      if (curve) curves.push(curve);
    }
    console.log("✅ Curves built:", curves.length);
    return curves;
  }, [roadNodes, nodes]);

  // 🔹 2. Create particles
  const particles = useMemo(() => {
    const arr = [];
    if (!roadCurves.length) return arr;

    for (let i = 0; i < particleCount; i++) {
      const curve = roadCurves[Math.floor(Math.random() * roadCurves.length)];
      arr.push({
        curve,
        offset: Math.random(),
        speed: 0.02 + Math.random() * 0.05,
        color: Math.random() > 0.5 ? 0xff2222 : 0xffffff,
      });
    }
    console.log("✅ Particles created:", arr.length);
    return arr;
  }, [roadCurves, particleCount]);

  // 🔹 3. Animate
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!instancedRef.current) return;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const u = (t * p.speed + p.offset) % 1;
      const pos = p.curve.getPointAt(u);
      const next = p.curve.getPointAt((u + 0.01) % 1);
      dummy.position.copy(pos);
      dummy.lookAt(next);
      dummy.scale.set(0.5, 0.5, 2.0);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(i, dummy.matrix);
    }

    instancedRef.current.instanceMatrix.needsUpdate = true;
  });

  // 🔹 4. Draw
  return (
    <>
      {showDebug &&
        roadCurves.map((curve, i) => {
          const pts = curve.getPoints(100);
          return (
            <line key={i} geometry={new THREE.BufferGeometry().setFromPoints(pts)}>
              <lineBasicMaterial color="yellow" />
            </line>
          );
        })}
      <instancedMesh ref={instancedRef} args={[null, null, particleCount]}>
        <boxGeometry args={[0.5, 0.5, 2]} />
        <meshBasicMaterial
          color={0xffffff}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
    </>
  );
}
