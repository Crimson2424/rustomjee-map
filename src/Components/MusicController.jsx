import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const MusicController = ({ play }) => {
  const audioRef = useRef(null);

  const bars = useRef([]);
  const tl = useRef(null);

  const [muted, setMuted] = useState(false);

  // Play audio after disclaimer
  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {
        console.log("User gesture required to play audio");
      });
    }
  }, [play]);

  // GSAP Equalizer Animation
  useEffect(() => {
    if (!play) return;

    tl.current = gsap.timeline({ repeat: -1 });

    bars.current.forEach((bar, i) => {
      tl.current.to(
        bar,
        {
          height: `${10 + Math.random() * 20}px`,
          duration: 0.35 + Math.random() * 0.3,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        },
        i * 0.1 // stagger
      );
    });

    return () => tl.current?.kill();
  }, [play]);

  // Handle mute toggle
  const toggleMute = () => {
    setMuted(!muted);
    audioRef.current.muted = !audioRef.current.muted;

    if (!muted) {
      // Mute → stop animation + fade out bars
      tl.current.pause();
      gsap.to(bars.current, { opacity: 0.2, duration: 0.3 });
    } else {
      // Unmute → resume animation
      gsap.to(bars.current, { opacity: 1, duration: 0.3 });
      tl.current.resume();
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/beach-loop.mp3" loop />

      {play && (
        <button
          onClick={toggleMute}
          className="
            fixed top-6 right-6 z-[120]
             
            border border-black/10
            rounded-full p-3 shadow-lg
            hover:bg-white transition
            flex items-center justify-center
          "
        >
          {/* Equalizer bars */}
          <div className="flex gap-[3px] items-end h-[24px]">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                ref={(el) => (bars.current[i] = el)}
                className="w-[4px] bg-black rounded-sm"
                style={{ height: "10px", opacity: 1 }}
              ></div>
            ))}
          </div>
        </button>
      )}
    </>
  );
};

export default MusicController;
