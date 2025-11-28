import React, { useState, useEffect, useRef, useCallback } from "react";

// Better mobile detection
const isMobile = () =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

// Helper to check fullscreen status across browsers
const isInFullscreen = () => {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
};

const MobileOrientationAndFullscreen = ({ onReady }) => {
  const [isLandscape, setIsLandscape] = useState(
    () => window.innerWidth > window.innerHeight
  );
  const [isFullscreen, setIsFullscreen] = useState(isInFullscreen);
  const [showOverlay, setShowOverlay] = useState(true);
  const hasCalledReady = useRef(false);
  const resizeTimer = useRef(null);

  /* -------------------------------
     Orientation Detection (Debounced)
     ------------------------------- */
  useEffect(() => {
    const updateOrientation = () => {
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(landscape);
    };

    const onResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(updateOrientation, 120);
    };

    // Listen to both resize and orientationchange for better mobile support
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", () => {
      // Delay to let the browser finish rotating
      setTimeout(updateOrientation, 100);
    });

    return () => {
      clearTimeout(resizeTimer.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  /* -------------------------------
     Fullscreen Detection
     ------------------------------- */
  useEffect(() => {
    const handler = () => {
      const fullscreen = isInFullscreen();
      console.log("Fullscreen changed:", fullscreen); // Debug log
      setIsFullscreen(fullscreen);
    };

    // Listen to all vendor-prefixed fullscreen change events
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    document.addEventListener("mozfullscreenchange", handler);
    document.addEventListener("MSFullscreenChange", handler);

    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
      document.removeEventListener("mozfullscreenchange", handler);
      document.removeEventListener("MSFullscreenChange", handler);
    };
  }, []);

  /* -------------------------------
     Core Enforcement Logic
     ------------------------------- */
  useEffect(() => {
    // Desktop → allow immediately
    if (!isMobile()) {
      setShowOverlay(false);
      if (!hasCalledReady.current) {
        hasCalledReady.current = true;
        onReady?.();
      }
      return;
    }

    console.log("State check - Landscape:", isLandscape, "Fullscreen:", isFullscreen); // Debug log

    // If both conditions are satisfied → hide overlay, notify parent
    if (isLandscape && isFullscreen) {
      setShowOverlay(false);
      if (!hasCalledReady.current) {
        hasCalledReady.current = true;
        onReady?.();
      }
    } else {
      // If user breaks any condition → show overlay again
      setShowOverlay(true);
    }
  }, [isLandscape, isFullscreen, onReady]);

  /* -------------------------------
     Fullscreen Request
     ------------------------------- */
  const requestFullscreen = useCallback(() => {
    const el = document.documentElement;

    const request =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;

    if (request) {
      request.call(el).catch((err) => {
        console.warn("Fullscreen request failed:", err);
      });
    }
  }, []);

  /* -------------------------------
     UI Overlay
     ------------------------------- */
  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 text-center bg-black/95 backdrop-blur-md text-white z-[99999] flex flex-col items-center justify-center p-6 transition-opacity">
      {!isLandscape && (
        <div className="animate-fade-in flex flex-col items-center gap-4">
          <div className="w-20 h-10 border-4 border-white/70 rounded-xl rotate-90" />
          <p className="text-xl font-semibold">
            Rotate your device to <span className="">landscape</span>
          </p>
        </div>
      )}

      {isLandscape && !isFullscreen && (
        <div className="animate-fade-in flex flex-col items-center">
          <p className="text-lg mb-4 opacity-90">
            Tap below to enter fullscreen mode
          </p>
          <button
            onClick={requestFullscreen}
            className="bg-blue-600 px-8 py-3 rounded-xl shadow-lg active:scale-95 transition"
          >
            Enter Fullscreen
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileOrientationAndFullscreen;