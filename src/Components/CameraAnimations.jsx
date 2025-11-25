import React, { useEffect, useRef } from "react";
import { usePaths } from "./PathsContext";
import { pathData } from "./PathData";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three'

const categorycamera = {
  portfolio: {
    position: {
      x: 350.3830609205853,
      y: 2006.4728088262566,
      z: -1370.5783458353324,
    },
    target: {
      x: 350.385045086649,
      y: 18.21462412324886,
      z: -1370.578218337721,
    },
  },

  historical: {
    position: {
      x: 263.8662604526274,
      y: 1693.9989258271416,
      z: -753.6446428086755,
    },
    target: {
      x: 263.86793278797086,
      y: 18.214577345245967,
      z: -753.6445353485361,
    },
  },
  recreational: {
    position: {
      x: 2054.6927918743268,
      y: 3200.3767785745927,
      z: -1571.890186914421,
    },
    target: {
      x: 2054.6907528693923,
      y: 52.39544705293635,
      z: -1571.8925852983232,
    },
  },
  clubs: {
    position: {
      x: 1778.0234893201803,
      y: 2418.4384036178562,
      z: -420.7899669016788,
    },
    target: {
      x: 1639.606074718079,
      y: -64.74498555560595,
      z: -997.8790879002545,
    },
  },
  schools: {
    position: {
      x: 1773.3947139278193,
      y: 2712.690361664751,
      z: 779.7860166024109,
    },
    target: {
      x: 2114.617869674974,
      y: -606.1434587693626,
      z: -1203.7889575206918,
    },
  },
  hotels: {
    position: {
      x: -742.5149910168099,
      y: 1640.8254803239188,
      z: 415.5704602201766,
    },
    target: {
      x: -205.63996004956763,
      y: -597.4355166502778,
      z: 94.97689164856017,
    },
  },
  hospitals: {
    position: {
      x: 1446.8913248024417,
      y: 2921.3505124063836,
      z: -1918.960306142563,
    },
    target: {
      x: 1607.2265451657158,
      y: -547.4540890770551,
      z: -1681.4506757916688,
    },
  },
  connectivity_present: {
    position: {
      x: 1891.6725139583014,
      y: 1492.4722514889793,
      z: 787.0325111973762,
    },
    target: {
      x: 906.2004230592254,
      y: -301.239367485342,
      z: -1314.7525021354181,
    },
  },
};

const CameraAnimations = ({ cameraControlRef }) => {
  const disableAutoRotate = useRef(false);
  const rotationOffset = useRef(0); // Track rotation offset for smooth resume
  const lastTime = useRef(0);
  const { selectedPath, selectedCategory } = usePaths();

  const goToPosition = (px, py, pz, tx, ty, tz) => {
    if (!cameraControlRef.current) return;
    const cam = cameraControlRef.current;
    cam.smoothTime = 0.7;

    // Just one setLookAt call for smooth transition
    cam.setLookAt(px, py, pz, tx, ty, tz, true);
  };

  const resetPosition = () => {
    const x = -1844.5376947483708;
    const y = 563.2002337610148;
    const z = 881.884785452135;

    const tx = 13.893999128697848;
    const ty = -92.36630585124054;
    const tz = 112.90388205168148;

    goToPosition(x, y, z, tx, ty, tz);
  };

  useEffect(() => {
    const cameraData = selectedPath
      ? pathData[selectedCategory].find((path) => path.name === selectedPath)
      : categorycamera[selectedCategory];

    if (cameraData) {
      const { x: px, y: py, z: pz } = cameraData.position;
      const { x: tx, y: ty, z: tz } = cameraData.target;

      // Store current azimuth angle before transitioning
      if (cameraControlRef.current) {
        rotationOffset.current = cameraControlRef.current.azimuthAngle;
      }

      goToPosition(px, py, pz, tx, ty, tz);
    } else {
      // When returning to auto-rotate, capture current angle for smooth resume
      if (cameraControlRef.current) {
        rotationOffset.current = cameraControlRef.current.azimuthAngle;
        lastTime.current = 0; // Reset time tracking
      }
      resetPosition();
    }
  }, [selectedCategory, selectedPath]);

  useFrame((state, delta) => {
    if (!cameraControlRef.current) return;
    if (selectedCategory || selectedPath) return;

    const cam = cameraControlRef.current;

    if (!disableAutoRotate.current) {
      const rotationSpeed = 0.1; // Positive for counter-clockwise
      
      // Smoothly continue rotation from where it left off
      lastTime.current += delta;
      const rotation = lastTime.current * rotationSpeed;
      
      // Add offset and normalize to 0-2π range
      cam.azimuthAngle = (rotationOffset.current - rotation) % (Math.PI * 2);
    }

    cam.update(delta);
  });

  return null;
};

export default CameraAnimations;