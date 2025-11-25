import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import AnimatedPath from "./AnimatedPath";
import { usePaths } from "./PathsContext";
import { pathData } from "./PathData";

export default function AllPaths({}) {
  const { selectedPath, selectedCategory } = usePaths();
  

  
  // safety check
  const selected = Array.isArray(pathData[selectedCategory]) ? pathData[selectedCategory] : [];
  const filteredPath = selectedPath?selected.filter((item)=> selectedPath===item.name) : selected

  

  return (
    <>
      {filteredPath.map((path, i) => (
        <AnimatedPath
          key={i}
          name={path.name}
          points={path.points}
          color="#2279C0"
          duration={4}
          glowIntensity={3.0}  // Higher = more glow
          pulseSpeed={3.0}      // Higher = faster pulse
          tubeRadius={5}     // Thicker tube
          packetSpeed = {1}
          packetCount = {3}
          packetWidth = {0.15}
        />
      ))}
    </>
  );
}
