import { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import AnimatedPath from "./AnimatedPath";
import { usePaths } from "./PathsContext";
import { pathData } from "./PathData";

// Marker component with animation timing
function PathMarker({ position, duration, isActive }) {
  const [showMarker, setShowMarker] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Show marker after path animation completes
      const timer = setTimeout(() => {
        setShowMarker(true);
      }, duration * 1000);

      return () => {
        clearTimeout(timer);
        setShowMarker(false);
      };
    } else {
      setShowMarker(false);
    }
  }, [isActive, duration]);

  if (!showMarker) return null;

  // Offset the marker upward
  const elevatedPosition = [
    position[0] + 5,
    position[1] + 60,
    position[2] + 5
  ];

  return (
    <Html
      position={elevatedPosition}
      center
      style={{
        pointerEvents: 'none',
      }}
    >
      <svg
  width="45"
  height="45"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  style={{
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 8px rgba(34, 121, 192, 0.9))',
    animation: 'markerEntrance 0.6s ease-out forwards',
  }}
>
  <style>
    {`
      @keyframes markerEntrance {
        0% {
          opacity: 0;
          transform: scale(0) translateY(-50px);
        }
        60% {
          opacity: 1;
          transform: scale(1.15) translateY(5px);
        }
        80% {
          transform: scale(0.95) translateY(-2px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `}
  </style>
  {/* White outline behind */}
  <path
    fill="white"
    stroke="white"
    strokeWidth="1.5"
    d="M14,10a2,2,0,1,1-2-2A2.006,2.006,0,0,1,14,10Zm5.5,0c0,6.08-4.67,9.89-6.67,11.24a1.407,1.407,0,0,1-.83.26,1.459,1.459,0,0,1-.84-.26C9.16,19.89,4.5,16.09,4.5,10A7.33,7.33,0,0,1,12,2.5,7.336,7.336,0,0,1,19.5,10ZM16,10a4,4,0,1,0-4,4A4,4,0,0,0,16,10Z"
  />
  {/* Blue fill on top */}
  <path
    fill="#2279C0"
    d="M14,10a2,2,0,1,1-2-2A2.006,2.006,0,0,1,14,10Zm5.5,0c0,6.08-4.67,9.89-6.67,11.24a1.407,1.407,0,0,1-.83.26,1.459,1.459,0,0,1-.84-.26C9.16,19.89,4.5,16.09,4.5,10A7.33,7.33,0,0,1,12,2.5,7.336,7.336,0,0,1,19.5,10ZM16,10a4,4,0,1,0-4,4A4,4,0,0,0,16,10Z"
  />
  {/* White center dot */}
  {/* <circle cx="12" cy="10" r="2" fill="white" /> */}
</svg>
    </Html>
  );
}

export default function AllPaths({}) {
  const { selectedPath, selectedCategory } = usePaths();

  // safety check
  const selected = Array.isArray(pathData[selectedCategory]) ? pathData[selectedCategory] : [];
  const filteredPath = selectedPath ? selected.filter((item) => selectedPath === item.name) : selected;

  const pathDuration = 4;

  // Check if category is active (has paths)
  const isCategoryActive = selected.length > 0;

  return (
    <>
      {filteredPath.map((path, i) => {
        const lastPoint = path.points[path.points.length - 1];
        const endPosition = Array.isArray(lastPoint)
          ? lastPoint
          : [lastPoint.x, lastPoint.y, lastPoint.z];

        // Show marker if:
        // 1. A specific path is selected and this is that path, OR
        // 2. No specific path is selected but the category is active
        const isActive = selectedPath 
          ? selectedPath === path.name 
          : isCategoryActive;

        return (
          <group key={path.name || i}>
            <AnimatedPath
              name={path.name}
              points={path.points}
              color="#2279C0"
              duration={pathDuration}
              glowIntensity={3.0}
              pulseSpeed={3.0}
              tubeRadius={5}
              packetSpeed={1}
              packetCount={3}
              packetWidth={0.15}
            />

            {lastPoint && (
              <PathMarker
                position={endPosition}
                duration={pathDuration}
                isActive={isActive}
              />
            )}
          </group>
        );
      })}
    </>
  );
}