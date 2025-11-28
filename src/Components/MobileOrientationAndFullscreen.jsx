import React, { useState, useEffect } from "react";

const isMobile = () =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

const MobileOrientationAndFullscreen = ({ onReady }) => {
  const [landscape, setLandscape] = useState(false);
  const [fullscreen, setFullscreen] = useState(
    document.fullscreenElement != null
  );

  // Detect orientation changes
  useEffect(() => {
    const checkOrientation = () => {
      setLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // Detect fullscreen
  useEffect(() => {
    const handler = () => {
      setFullscreen(document.fullscreenElement != null);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // If not mobile → allow directly
  if (!isMobile()) {
    onReady();
    return null;
  }

  // If both conditions satisfied → allow Experience to continue
  if (landscape && fullscreen) {
    onReady();
    return null;
  }

  const requestFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center text-center p-6 z-[9999]">
      {!landscape && (
        <p className="text-xl font-semibold mb-4">
          Please rotate your device to <span className="text-blue-400">landscape</span> mode
        </p>
      )}

      {landscape && !fullscreen && (
        <>
          <p className="text-lg font-medium mb-3">
            Tap the button below to enter fullscreen mode
          </p>
          <button
            onClick={requestFullscreen}
            className="bg-blue-500 px-6 py-3 rounded-xl text-lg font-semibold"
          >
            Enter Fullscreen
          </button>
        </>
      )}
    </div>
  );
};

export default MobileOrientationAndFullscreen;
