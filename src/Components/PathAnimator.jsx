import { useRef, useState, useEffect } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export function AnimatedPath({ points, color, isAnimating, onComplete }) {
  const lineRef = useRef();
  const materialRef = useRef();
  const [visiblePoints, setVisiblePoints] = useState([]);

  useEffect(() => {
    if (!isAnimating || !points || points.length === 0) return;

    // Reset to first point
    setVisiblePoints([points[0]]);

    // Animate the path
    const tween = { progress: 0 };
    
    gsap.to(tween, {
      progress: 1,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => {
        const index = Math.floor(tween.progress * (points.length - 1));
        const newVisiblePoints = points.slice(0, index + 1);
        setVisiblePoints(newVisiblePoints);
      },
      onComplete: () => {
        setVisiblePoints(points);
        onComplete?.();
      }
    });

    return () => {
      tween.kill?.();
    };
  }, [isAnimating, points]);

  if (visiblePoints.length < 2) return null;

  return (
    <Line
      ref={lineRef}
      points={visiblePoints.map(p => [p[0], p[1], p[2]])}
      color={color}
      lineWidth={3}
      dashed={false}
    >
      <lineBasicMaterial 
        ref={materialRef} 
        attach="material" 
        color={color}
        transparent
        opacity={0.9}
      />
    </Line>
  );
}

export function PathAnimator({ pathData }) {
  const [activePaths, setActivePaths] = useState({});

  const startAnimation = (category, pathName) => {
    const key = `${category}-${pathName}`;
    setActivePaths(prev => ({
      ...prev,
      [key]: { category, pathName, isAnimating: true }
    }));
  };

  const stopAnimation = (category, pathName) => {
    const key = `${category}-${pathName}`;
    setActivePaths(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  const clearAll = () => {
    setActivePaths({});
  };

  const getCategoryColor = (category) => {
    const colors = {
      portfolio: '#00ff00',
      historical: '#ffaa00',
      recreational: '#00aaff',
      clubs: '#ff00ff',
      schools: '#ffff00',
      hotels: '#ff0000',
      hospitals: '#00ffff',
      connectivity_present: '#00ff88',
      connectivity_future: '#8800ff',
    };
    return colors[category] || '#ffffff';
  };

  return (
    <>
      {/* Render all active animated paths */}
      {Object.entries(activePaths).map(([key, { category, pathName, isAnimating }]) => {
        const path = pathData[category]?.find(p => p.name === pathName);
        if (!path) return null;

        return (
          <AnimatedPath
            key={key}
            points={path.points}
            color={getCategoryColor(category)}
            isAnimating={isAnimating}
            onComplete={() => {
              // Keep the path visible after animation completes
              setActivePaths(prev => ({
                ...prev,
                [key]: { ...prev[key], isAnimating: false }
              }));
            }}
          />
        );
      })}

      
    </>
  );
}

// Separate UI component (rendered outside Canvas)
export function PathControls({ 
  pathData, 
  onStartAnimation, 
  onStopAnimation, 
  onClearAll, 
  activePaths,
  getCategoryColor 
}) {
  if (!pathData) return null;

  return (
    <div className="absolute top-4 right-4 max-w-sm max-h-[90vh] overflow-y-auto bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Path Animator</h2>
        <button
          onClick={onClearAll}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      {Object.entries(pathData).map(([category, paths]) => (
        <div key={category} className="mb-6">
          <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2">
            {category.replace(/_/g, ' ')}
          </h3>
          <div className="space-y-2">
            {paths.map((path) => {
              const key = `${category}-${path.name}`;
              const isActive = activePaths[key];
              
              return (
                <button
                  key={path.name}
                  onClick={() => {
                    if (isActive) {
                      onStopAnimation(category, path.name);
                    } else {
                      onStartAnimation(category, path.name);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-md text-left text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  style={{
                    borderLeft: `4px solid ${getCategoryColor(category)}`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{path.name}</span>
                    {isActive && (
                      <span className="text-xs bg-black/30 px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}