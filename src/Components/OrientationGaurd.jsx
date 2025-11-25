import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const OrientationGuard = ({ children }) => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [needsFullscreen, setNeedsFullscreen] = useState(false);

  const cardRef = useRef(null);

  // Detect iOS Safari (no fullscreen support)
  const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Detect portrait-native devices (phones)
  const isPortraitNativeDevice = () => {
    return window.screen.height > window.screen.width;
  };

  // Determines whether fullscreen SHOULD be required
  const shouldRequireFullscreen = () => {
    // Desktop / laptop / tablets → no fullscreen needed
    if (!isPortraitNativeDevice()) return false;

    // iPhone Safari → fullscreen impossible
    if (isIOS()) return false;

    // Android phones, iPhone Chrome, desktop Safari mobile emulation
    return true;
  };

  // GSAP entrance animation
  const animateCard = () => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.85, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "power3.out" }
    );
  };

  const checkOrientation = () => {
    const landscape = window.innerWidth > window.innerHeight;
    setIsLandscape(landscape);

    if (landscape) {
      setNeedsFullscreen(shouldRequireFullscreen());
    }
  };

  const checkFullscreen = () => {
    const full =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    setIsFullscreen(!!full);
  };

  useEffect(() => {
    checkOrientation();
    checkFullscreen();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("webkitfullscreenchange", checkFullscreen);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("webkitfullscreenchange", checkFullscreen);
    };
  }, []);

  useEffect(() => {
    animateCard();
  }, [isLandscape, needsFullscreen, isFullscreen]);

  // 1. Portrait mode → show rotate popup
  if (!isLandscape) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex items-center justify-center p-6">
        <div
          ref={cardRef}
          className="bg-slate-800 rounded-xl shadow-2xl p-10 max-w-sm text-center border border-slate-700"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-100 mb-2">
            Rotate Your Device
          </h2>
          <p className="text-slate-400 text-sm">
            Switch to landscape mode to continue
          </p>
        </div>
      </div>
    );
  }

  // 2. Landscape + fullscreen required + not fullscreen yet → show fullscreen instructions
  if (needsFullscreen && !isFullscreen) {
    const mobileBrowser = navigator.userAgent.toLowerCase();

    const isChromeAndroid =
      mobileBrowser.includes("android") && mobileBrowser.includes("chrome");

    const isIphoneChrome =
      mobileBrowser.includes("iphone") && mobileBrowser.includes("crios");

    return (
      <div className="h-screen w-screen bg-slate-900 flex items-center justify-center p-6">
        <div
          ref={cardRef}
          className="bg-slate-800 rounded-xl shadow-2xl p-6 max-w-xs text-center border border-slate-700"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-slate-100 mb-1">
            Enter Fullscreen
          </h2>

          {/* Safari Info */}
          {isIOS() ? (
            <p className="text-slate-400 text-sm">
              Fullscreen is not supported on iOS Safari.  
              Continue normally.
            </p>
          ) : (
            <p className="text-slate-400 text-sm">
              Please enter fullscreen using your browser controls.
            </p>
          )}

          {/* Browser-specific tips */}
          {!isIOS() && (
            <p className="text-xs text-slate-500 mt-3">
              {isChromeAndroid && "Tap the menu → Fullscreen"}
              {isIphoneChrome && "Tap Chrome’s menu → Fullscreen"}
              {!isChromeAndroid && !isIphoneChrome && "Press F11 or use browser fullscreen"}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 3. All conditions satisfied → render app
  return <>{children}</>;
};

export default OrientationGuard;
