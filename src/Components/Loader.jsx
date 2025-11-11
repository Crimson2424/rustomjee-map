import React, { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";

const Loader = () => {
  const { progress, active, loaded, total, item } = useProgress();
  const [hidden, setHidden] = useState(false);
  const wrapRef = useRef(null);
  const barRef = useRef(null);
  const numRef = useRef(null);

  // animate bar + number as progress updates
  useEffect(() => {
    if (!barRef.current || !numRef.current) return;
    gsap.to(barRef.current, {
      width: `${Math.round(progress)}%`,
      duration: 0.25,
      ease: "power1.out",
    });
    gsap.to(numRef.current, {
      textContent: Math.round(progress),
      snap: { textContent: 1 },
      duration: 0.25,
      ease: "power1.out",
    });
  }, [progress]);

  // fade out when loading done
  useEffect(() => {
    if (!active && wrapRef.current) {
      gsap.to(wrapRef.current, {
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => setHidden(true),
      });
    }
  }, [active]);

  if (hidden) return null;

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b1220]/70 backdrop-blur-md"
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      <div className="w-[min(380px,80vw)]">
        {/* Tiny brand dot + title */}
        <div className="mb-4 flex items-center gap-2 text-white/90">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-white/90" />
          <span className="text-sm tracking-widest uppercase">Loading</span>
        </div>

        {/* Progress rail */}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            ref={barRef}
            className="h-full rounded-full bg-white/90"
            style={{ width: "0%" }}
          />
        </div>

        {/* Meta row */}
        <div className="mt-3 flex items-center justify-between text-xs text-white/70">
          <div className="truncate max-w-[70%]">
            {item ? item.split("/").pop() : "Preparing…"}
          </div>
          <div className="tabular-nums">
            <span ref={numRef}>0</span>% · {loaded}/{total}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
