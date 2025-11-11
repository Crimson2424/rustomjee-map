import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

/**
 * RoadClickSampler
 *  - Left-click to sample points on top of road meshes.
 *  - Yellow sphere marker appears at each point.
 *  - “Download JSON” and “Clear Samples” panel in top-right corner.
 */
export function RoadClickSampler({ nodes, roadNames = [] }) {
  const { camera, gl, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);
  const [samples, setSamples] = useState([]);
  const markers = useRef([]);
  const overlayRef = useRef();

  // collect all road meshes to intersect
  const roadObjects = useMemo(() => {
    const arr = [];
    roadNames.forEach((name) => {
      const node = nodes[name];
      if (!node) return;
      if (node.isMesh) arr.push(node);
      else node.traverse?.((c) => c.isMesh && arr.push(c));
    });
    return arr;
  }, [nodes, roadNames]);

  // add overlay UI (download / clear)
  useEffect(() => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.right = "12px";
    overlay.style.top = "12px";
    overlay.style.zIndex = 9999;
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.color = "white";
    overlay.style.padding = "10px";
    overlay.style.fontFamily = "monospace";
    overlay.style.fontSize = "12px";
    overlay.style.borderRadius = "6px";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.gap = "6px";
    overlay.innerHTML = `
      <div style="font-weight:600;margin-bottom:4px">Road Click Sampler</div>
      <div>Left-click to sample road points.<br>Right-click drag to rotate.</div>
    `;

    // download button
    const btn = document.createElement("button");
    btn.textContent = "Download JSON";
    btn.style.cursor = "pointer";
    btn.style.padding = "6px 8px";
    btn.style.border = "none";
    btn.style.borderRadius = "4px";
    btn.style.background = "#22c55e";
    btn.style.color = "#042";
    btn.onclick = () => {
      const blob = new Blob([JSON.stringify(samples, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "road-samples.json";
      a.click();
      URL.revokeObjectURL(url);
    };
    overlay.appendChild(btn);

    // clear button
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear Samples";
    clearBtn.style.cursor = "pointer";
    clearBtn.style.padding = "6px 8px";
    clearBtn.style.border = "none";
    clearBtn.style.borderRadius = "4px";
    clearBtn.style.background = "#ef4444";
    clearBtn.style.color = "white";
    clearBtn.onclick = () => {
      markers.current.forEach((m) => scene.remove(m));
      markers.current = [];
      setSamples([]);
    };
    overlay.appendChild(clearBtn);

    document.body.appendChild(overlay);
    overlayRef.current = overlay;

    return () => {
      try {
        document.body.removeChild(overlay);
      } catch (e) {}
    };
  }, [samples, scene]);

  // handle click sampling
  useEffect(() => {
    const handleClick = (event) => {
      // ✅ only left mouse button
      if (event.button !== 0) return;

      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const hits = raycaster.intersectObjects(roadObjects, true);
      if (!hits.length) return;

      // choose first top-facing hit
      let chosen = null;
      for (const hit of hits) {
        const n = hit.face?.normal?.clone()?.transformDirection(hit.object.matrixWorld);
        if (n && n.y > 0.3) {
          chosen = hit;
          break;
        }
      }
      if (!chosen) chosen = hits[0];

      const p = chosen.point.clone();
      p.y += 0.12;

      // store
      setSamples((prev) => [...prev, [p.x, p.y, p.z]]);

      // marker
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffd54f })
      );
      marker.position.copy(p);
      scene.add(marker);
      markers.current.push(marker);

      console.log("Sampled:", [p.x, p.y, p.z]);
    };

    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handleClick);
    return () => {
      canvas.removeEventListener("pointerdown", handleClick);
      markers.current.forEach((m) => scene.remove(m));
      markers.current = [];
    };
  }, [gl, camera, raycaster, mouse, roadObjects, scene]);

  return null;
}
