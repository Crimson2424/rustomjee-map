import React, { useRef } from "react";
import gsap from "gsap";

const Disclaimer = ({ onStart }) => {
  const containerRef = useRef(null);

  const handleStart = () => {
    // GSAP exit animation
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.92,
      duration: 0.6,
      ease: "power2.out",
      onComplete: onStart, // remove component after animation
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center text-white p-6"
    >
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Disclaimer
      </h1>

      <p className="max-w-xl text-center text-lg mb-8 leading-relaxed">
        This work is for <strong>presentation purposes only</strong> and does not
        represent the <strong>actual location</strong>. All models and visuals
        are conceptual and not exact representations of real-world locations.
      </p>

      <button
        onClick={handleStart}
        className="px-8 py-3 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-200 transition"
      >
        Start
      </button>
    </div>
  );
};

export default Disclaimer;
