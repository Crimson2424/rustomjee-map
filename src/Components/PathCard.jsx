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
    { id: "transport", icon: IoBusOutline, label: "Other" },
  ];

  // Distance is constant regardless of transport mode
  const getDistance = () => {
    const distance = currentPath.distance || 5;
    return `${distance} km`;
  };

  // Time changes based on transport mode
  const getTime = () => {
    // Check if transport data exists in the path
    if (currentPath.transport && currentPath.transport[selectedTransport]) {
      return `${currentPath.transport[selectedTransport]} min`;
    }
    
    // Fallback to calculation if data not provided
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
 // Handle path change with animation
useEffect(() => {
  if (path.name !== currentPath.name && !isAnimating) {
    setIsAnimating(true);
    
    // Preload the new image
    const preloadImage = (src) => {
      return new Promise((resolve) => {
        if (!src) {
          resolve();
          return;
        }
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // Resolve even on error to not block animation
        img.src = src;
      });
    };

    // Slide out current card
    if (internalCardRef.current) {
      gsap.to(internalCardRef.current, {
        x: -400,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: async () => {
          // Preload new image before updating state
          await preloadImage(path.image);
          
          // Update to new path
          setCurrentPath(path);
          setSelectedTransport("car");
          
          // Slide in new card (image is now cached)
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
}, [path, currentPath.name, isAnimating]);

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
      className="absolute left-0 top-0 w-75 h-full flex flex-col justify-between bg-white rounded-md shadow-2xl overflow-hidden z-40 max-sm:w-27 max-sm:rounded-sm max-sm:justify-normal max-sm:gap-0 max-md:w-27 max-md:rounded-sm max-md:justify-normal max-md:gap-0 max-lg:w-48 max-lg:rounded-sm max-lg:justify-normal max-lg:gap-0 max-xl:w-55 max-xl:rounded-sm max-xl:justify-normal max-xl:gap-0"
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md max-sm:top-1 max-sm:right-1 max-sm:p-1  max-md:top-1 max-md:right-1 max-md:p-1 max-lg:top-1 max-lg:right-1 max-lg:p-1 max-xl:top-1 max-xl:right-1 max-xl:p-1"
      >
        <MdClose className="text-xl text-gray-700 max-sm:text-[10px] max-md:text-[12px] max-lg:text-md max-xl:text-md" />
      </button>

      {/* Image */}
      <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden max-sm:h-18 max-md:h-20 max-lg:h-40 max-xl:h-50">
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
      <div className="p-6  flex flex-col gap-6 h-125 max-sm:p-2 max-sm:h-40 max-sm:gap-1 max-md:p-2 max-md:h-40 max-md:gap-1 max-lg:p-2 max-lg:h-40 max-lg:gap-3 max-xl:p-2 max-xl:h-40 max-xl:gap-6 ">
        {/* Heading */}
        <div className="">

        <h2 className="text-2xl font-bold text-gray-800 mb-3 max-sm:text-[12px] max-sm:mb-0 max-md:text-[12px] max-md:mb-1 max-lg:text-md max-lg:mb-1 max-xl:text-md max-xl:mb-2">{currentPath.name}</h2>

        {/* Description */}
        <p className="text-gray-600  text-sm leading-relaxed max-sm:text-[10px] max-md:text-[10px]  max-lg:text-sm max-xl:text-sm">
          {currentPath.description || "Explore this amazing location and discover what it has to offer."}
        </p>
        </div>

        {/* Distance Displ  ay */}
        <div className="bg-[#4A5568] text-white bg-opacity-10 rounded-lg p-4 max-sm:p-1 max-sm:rounded-sm max-md:p-1 max-md:rounded-sm max-lg:p-2 max-lg:rounded-sm max-xl:p-2 max-xl:rounded-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs max-sm:text-[10px] max-md:text-[10px] max-lg:text-md max-xl:text-md">Distance</p>
              <p className="text-2xl font-bold max-sm:text-[10px] max-md:text-[10px] max-lg:text-sm  max-xl:text-sm">{getDistance()}</p>
            </div>
            <div>
              <p className="text-xs max-sm:text-[10px]  max-md:text-[10px] max-lg:text-md max-xl:text-md">Est. Time</p>
              <p className="text-2xl font-bold max-sm:text-[10px] max-md:text-[10px] max-lg:text-sm max-xl:text-sm">{getTime()}</p>
            </div>
          </div>
        </div>

        {/* Transport Buttons */}
        <div className=" flex flex-col  gap-5 max-sm:gap-1 max-sm:justify-between max-md:gap-1 max-md:justify-between max-lg:gap-2 max-lg:justify-between max-xl:gap-1 max-xl:justify-between">
          <p className="text-sm text-gray-500 max-sm:text-[10px] max-md:text-[10px] max-lg:text-xs">Choose transport mode:</p>
          <div className="grid grid-cols-4 gap-1 max-sm:gap-0.5 max-sm:grid-cols-2 max-md:gap-0.5 max-md:grid-cols-2 max-lg:gap-0.5 max-lg:grid-cols-2 max-xl:gap-0.5 max-xl:grid-cols-2">
            {transportModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleTransportClick(mode.id)}
                className={`
                  flex flex-col items-center justify-center gap-2 p-3 rounded-lg
                  transition-all duration-300 relative overflow-hidden
                  max-sm:gap-0 max-sm:p-0.5 max-sm:rounded-sm
                  max-md:gap-0 max-md:p-0.5 max-md:rounded-sm
                  max-lg:gap-0.5 max-lg:p-1 max-lg:rounded-sm
                  max-xl:gap-0.5 max-xl:p-1 max-xl:rounded-sm
                  ${
                    selectedTransport === mode.id
                      ? "bg-[#4A5568] text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
              >
                <mode.icon className="text-2xl max-sm:text-[12px] max-md:text-[12px] max-lg:text-[20px] max-xl:text-[20px]" />
                <span className="text-xs font-medium max-sm:text-[10px] max-md:text-[10px] max-lg:text-xs max-xl:text-xs">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}