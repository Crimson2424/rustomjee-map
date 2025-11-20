import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { IoCarSportOutline, IoWalkOutline, IoBicycleOutline, IoBusOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";

export default function PathCard({ path, onClose, cardRef }) {
  const internalCardRef = useRef(null);
  const [selectedTransport, setSelectedTransport] = useState("car");
  const [currentPath, setCurrentPath] = useState(path);
  const [isAnimating, setIsAnimating] = useState(false);

  const transportModes = [
    { id: "car", icon: IoCarSportOutline, label: "Car" },
    { id: "walk", icon: IoWalkOutline, label: "Walk" },
    { id: "bike", icon: IoBicycleOutline, label: "Bike" },
    { id: "transport", icon: IoBusOutline, label: "Bus" },
  ];

  // Calculate distance based on transport mode
  const getDistance = () => {
    const baseDistance = currentPath.distance || 5;
    switch (selectedTransport) {
      case "car":
        return `${baseDistance} km`;
      case "walk":
        return `${(baseDistance * 1.2).toFixed(1)} km`;
      case "bike":
        return `${(baseDistance * 1.1).toFixed(1)} km`;
      case "transport":
        return `${(baseDistance * 1.3).toFixed(1)} km`;
      default:
        return `${baseDistance} km`;
    }
  };

  // Calculate time based on transport mode
  const getTime = () => {
    const baseDistance = currentPath.distance || 5;
    switch (selectedTransport) {
      case "car":
        return `${Math.round(baseDistance * 2)} min`;
      case "walk":
        return `${Math.round(baseDistance * 12)} min`;
      case "bike":
        return `${Math.round(baseDistance * 5)} min`;
      case "transport":
        return `${Math.round(baseDistance * 3)} min`;
      default:
        return "";
    }
  };

  // Initial animation on mount
  useEffect(() => {
    if (internalCardRef.current) {
      gsap.fromTo(
        internalCardRef.current,
        {
          x: -400,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        }
      );
    }
  }, []);

  // Handle path change with animation
  useEffect(() => {
    if (path.name !== currentPath.name && !isAnimating) {
      setIsAnimating(true);
      
      // Slide out current card
      if (internalCardRef.current) {
        gsap.to(internalCardRef.current, {
          x: -400,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
          onComplete: () => {
            // Update to new path
            setCurrentPath(path);
            setSelectedTransport("car"); // Reset transport mode
            
            // Slide in new card
            gsap.fromTo(
              internalCardRef.current,
              {
                x: -400,
                opacity: 0,
              },
              {
                x: 0,
                opacity: 1,
                duration: 0.5,
                ease: "power3.out",
                onComplete: () => {
                  setIsAnimating(false);
                }
              }
            );
          },
        });
      }
    }
  }, [path]);

  const handleClose = () => {
    if (internalCardRef.current) {
      gsap.to(internalCardRef.current, {
        x: -400,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: onClose,
      });
    }
  };

  const handleTransportClick = (transportId) => {
    setSelectedTransport(transportId);
  };

  return (
    <div
      ref={(el) => {
        internalCardRef.current = el;
        if (cardRef) cardRef.current = el;
      }}
      className="absolute left-0 top-0  w-96 bg-white rounded-md shadow-2xl overflow-hidden z-40"
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md"
      >
        <MdClose className="text-xl text-gray-700" />
      </button>

      {/* Image */}
      <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
        {currentPath.image ? (
          <img
            src={currentPath.image}
            alt={currentPath.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">📍</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{currentPath.name}</h2>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {currentPath.description || "Explore this amazing location and discover what it has to offer."}
        </p>

        {/* Distance Display */}
        <div className="bg-[#CE9A52] bg-opacity-10 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Distance</p>
              <p className="text-2xl font-bold text-[#CE9A52]">{getDistance()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Est. Time</p>
              <p className="text-2xl font-bold text-[#CE9A52]">{getTime()}</p>
            </div>
          </div>
        </div>

        {/* Transport Buttons */}
        <div className="space-y-2">
          <p className="text-sm text-gray-500 mb-3">Choose transport mode:</p>
          <div className="grid grid-cols-4 gap-2">
            {transportModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleTransportClick(mode.id)}
                className={`
                  flex flex-col items-center justify-center gap-2 p-3 rounded-lg
                  transition-all duration-300 relative overflow-hidden
                  ${
                    selectedTransport === mode.id
                      ? "bg-[#CE9A52] text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
              >
                <mode.icon className="text-2xl" />
                <span className="text-xs font-medium">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}