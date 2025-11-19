import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from 'three'

/**
 * Enhanced sampler that exports data in the format needed for paths
 */
export function PathDataCollector({ nodes, roadNames = [] }) {
    const { camera, gl, scene } = useThree();
    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const mouse = useMemo(() => new THREE.Vector2(), []);
    
    const [currentCategory, setCurrentCategory] = useState("portfolio");
    const [currentLocation, setCurrentLocation] = useState("");
    const [pathsData, setPathsData] = useState({
      portfolio: [],
      historical: [],
      recreational: [],
      clubs: [],
      schools: [],
      hotels: [],
      hospitals: [],
      connectivity_present: [],
      connectivity_future: [],
    });
    const [currentPoints, setCurrentPoints] = useState([]);
    const markers = useRef([]);
  
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
  
    useEffect(() => {
      const panel = document.createElement("div");
      panel.style.cssText = `
        position: fixed;
        left: 12px;
        top: 12px;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 16px;
        font-family: monospace;
        font-size: 12px;
        border-radius: 8px;
        min-width: 280px;
      `;
  
      const updatePanel = () => {
        panel.innerHTML = `
          <div style="font-weight: 600; margin-bottom: 12px; font-size: 14px;">
            🛣️ Path Data Collector
          </div>
          
          <div style="margin-bottom: 8px;">
            <label style="display: block; margin-bottom: 4px;">Category:</label>
            <select id="category-select" style="
              width: 100%;
              padding: 6px;
              background: #1f2937;
              color: white;
              border: 1px solid #374151;
              border-radius: 4px;
            ">
              <option value="portfolio">Rustomjee Portfolio</option>
              <option value="historical">Historical</option>
              <option value="recreational">Recreational</option>
              <option value="clubs">Clubs</option>
              <option value="schools">Schools</option>
              <option value="hotels">Hotels</option>
              <option value="hospitals">Hospitals</option>
              <option value="connectivity_present">Present Connectivity</option>
              <option value="connectivity_future">Future Connectivity</option>
            </select>
          </div>
  
          <div style="margin-bottom: 8px;">
            <label style="display: block; margin-bottom: 4px;">Location Name:</label>
            <input 
              id="location-input" 
              type="text" 
              placeholder="e.g., Mount Mary Church"
              style="
                width: 100%;
                padding: 6px;
                background: #1f2937;
                color: white;
                border: 1px solid #374151;
                border-radius: 4px;
              "
            />
          </div>
  
          <div style="margin-bottom: 12px; padding: 8px; background: #1f2937; border-radius: 4px;">
            <div>Points collected: <strong>${currentPoints.length}</strong></div>
            ${currentLocation ? `<div>Current: <strong>${currentLocation}</strong></div>` : ""}
          </div>
  
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <button id="save-location-btn" style="
              padding: 8px;
              background: #22c55e;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-weight: 600;
            ">
              Save Location
            </button>
  
            <button id="clear-points-btn" style="
              padding: 8px;
              background: #f59e0b;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">
              Clear Current Points
            </button>
  
            <button id="export-all-btn" style="
              padding: 8px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-weight: 600;
            ">
              📥 Export All Data
            </button>
          </div>
        `;
  
        // Event listeners
        const categorySelect = panel.querySelector("#category-select");
        const locationInput = panel.querySelector("#location-input");
        const saveBtn = panel.querySelector("#save-location-btn");
        const clearBtn = panel.querySelector("#clear-points-btn");
        const exportBtn = panel.querySelector("#export-all-btn");
  
        categorySelect.value = currentCategory;
        locationInput.value = currentLocation;
  
        categorySelect.addEventListener("change", (e) => {
          setCurrentCategory(e.target.value);
        });
  
        locationInput.addEventListener("input", (e) => {
          setCurrentLocation(e.target.value);
        });
  
        saveBtn.addEventListener("click", () => {
          if (!currentLocation.trim() || currentPoints.length === 0) {
            alert("Please enter a location name and collect some points!");
            return;
          }
  
          setPathsData((prev) => ({
            ...prev,
            [currentCategory]: [
              ...prev[currentCategory],
              {
                name: currentLocation,
                points: [...currentPoints],
              },
            ],
          }));
  
          setCurrentPoints([]);
          setCurrentLocation("");
          markers.current.forEach((m) => scene.remove(m));
          markers.current = [];
          
          alert(`Saved ${currentLocation}!`);
        });
  
        clearBtn.addEventListener("click", () => {
          setCurrentPoints([]);
          markers.current.forEach((m) => scene.remove(m));
          markers.current = [];
        });
  
        exportBtn.addEventListener("click", () => {
          const blob = new Blob([JSON.stringify(pathsData, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "bandra-paths-data.json";
          a.click();
          URL.revokeObjectURL(url);
        });
      };
  
      updatePanel();
      document.body.appendChild(panel);
  
      return () => {
        try {
          document.body.removeChild(panel);
        } catch (e) {}
      };
    }, [currentCategory, currentLocation, currentPoints, pathsData, scene]);
  
    // Click handler
    useEffect(() => {
      const handleClick = (event) => {
        if (event.button !== 0) return;
  
        const rect = gl.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
  
        const hits = raycaster.intersectObjects(roadObjects, true);
        if (!hits.length) return;
  
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
  
        setCurrentPoints((prev) => [...prev, [p.x, p.y, p.z]]);
  
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffd54f })
        );
        marker.position.copy(p);
        scene.add(marker);
        markers.current.push(marker);
  
        console.log("Point added:", [p.x, p.y, p.z]);
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