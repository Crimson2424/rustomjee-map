import { usePaths } from "./PathsContext";
import { pathData } from "./PathData";
import { RiPagesLine } from "react-icons/ri";
import { GiGreekTemple } from "react-icons/gi";
import { CiAt, CiHeart } from "react-icons/ci";
import { IoSchoolOutline } from "react-icons/io5";
import { LuHotel } from "react-icons/lu";
import { PiHospitalLight, PiMapPinSimpleArea } from "react-icons/pi";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import PathCard from "./PathCard";

export default function UIButtons() {
  const { setSelectedCategory, setSelectedPath, selectedCategory, selectedPath } = usePaths();
  const buttonRefs = useRef({});
  const liquidRefs = useRef({});
  const iconRefs = useRef({});
  const textRefs = useRef({});
  const containerRef = useRef(null);
  const pathButtonsRef = useRef(null);
  const pathCardRef = useRef(null);
  const [pathButtonsPosition, setPathButtonsPosition] = useState({ left: 0 });
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    { id: "portfolio", icon: RiPagesLine, label: "Portfolio" },
    { id: "historical", icon: GiGreekTemple, label: "Historical" },
    { id: "recreational", icon: CiAt, label: "Recreational" },
    { id: "clubs", icon: CiHeart, label: "Clubs" },
    { id: "schools", icon: IoSchoolOutline, label: "Schools" },
    { id: "hotels", icon: LuHotel, label: "Hotels" },
    { id: "hospitals", icon: PiHospitalLight, label: "Hospitals" },
    {
      id: "connectivity_present",
      icon: PiMapPinSimpleArea,
      label: "Connectivity",
    },
    
  ];

  useEffect(() => {
    if (selectedCategory && buttonRefs.current[selectedCategory]) {
      const button = buttonRefs.current[selectedCategory];
      const rect = button.getBoundingClientRect();
      const container = button.closest(".flex.gap-2");
      const containerRect = container.getBoundingClientRect();

      // Calculate position relative to the container
      const leftPosition = rect.left - containerRect.left + rect.width / 2;
      setPathButtonsPosition({ left: leftPosition });
    }
  }, [selectedCategory]);

  // Animate path buttons appearing/disappearing
  useEffect(() => {
    if (pathButtonsRef.current) {
      if (selectedCategory) {
        gsap.fromTo(
          pathButtonsRef.current,
          {
            opacity: 0,
            y: 20,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)",
          }
        );

        // Animate individual path buttons
        const buttons = pathButtonsRef.current.querySelectorAll("button");
        gsap.fromTo(
          buttons,
          {
            opacity: 0,
            x: -20,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          }
        );
      }
    }
  }, [selectedCategory]);

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is inside the container OR the path card
      const isInsideContainer = containerRef.current && containerRef.current.contains(event.target);
      const isInsidePathCard = pathCardRef.current && pathCardRef.current.contains(event.target);
      
      if (!isInsideContainer && !isInsidePathCard) {
        // Reset all button liquids
        Object.keys(liquidRefs.current).forEach((key) => {
          const liquid = liquidRefs.current[key];
          const icon = iconRefs.current[key];
          const text = textRefs.current[key];

          if (liquid) {
            gsap.killTweensOf(liquid);
            gsap.to(liquid, {
              scaleY: 0,
              duration: 0.4,
              ease: "power2.inOut",
            });
          }

          if (icon) {
            gsap.to(icon, {
              color: "#4A5568",
              duration: 0.3,
            });
          }

          if (text) {
            gsap.to(text, {
              color: "#4A5568",
              duration: 0.3,
            });
          }
        });

        setHoveredCategory(null);

        if (pathButtonsRef.current) {
          gsap.to(pathButtonsRef.current, {
            opacity: 0,
            y: 10,
            scale: 0.9,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
              setSelectedCategory(null);
              setSelectedPath(null);
            },
          });
        } else {
          setSelectedCategory(null);
          setSelectedPath(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelectedCategory, setSelectedPath]);

  // Liquid hover animations
  const handleMouseEnter = (e, catId) => {
    setHoveredCategory(catId);
    const liquid = liquidRefs.current[catId];
    const icon = iconRefs.current[catId];
    const text = textRefs.current[catId];

    if (liquid) {
      gsap.killTweensOf(liquid);
      gsap.to(liquid, {
        scaleY: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    }

    if (icon) {
      gsap.to(icon, {
        color: "#FFFFFF",
        duration: 0.3,
      });
    }

    if (text) {
      gsap.to(text, {
        color: "#FFFFFF",
        duration: 0.3,
      });
    }
  };

  const handleMouseLeave = (e, catId) => {
    setHoveredCategory(null);
    const isSelected = selectedCategory === catId;
    const liquid = liquidRefs.current[catId];
    const icon = iconRefs.current[catId];
    const text = textRefs.current[catId];

    if (liquid && !isSelected) {
      gsap.killTweensOf(liquid);
      gsap.to(liquid, {
        scaleY: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    if (!isSelected) {
      if (icon) {
        gsap.to(icon, {
          color: "#4A5568",
          duration: 0.3,
        });
      }

      if (text) {
        gsap.to(text, {
          color: "#4A5568",
          duration: 0.3,
        });
      }
    }
  };

  const handleCategoryClick = (catId) => {
    // Reset previous selected category's liquid and colors
    if (selectedCategory && selectedCategory !== catId) {
      const prevLiquid = liquidRefs.current[selectedCategory];
      const prevIcon = iconRefs.current[selectedCategory];
      const prevText = textRefs.current[selectedCategory];

      if (prevLiquid) {
        gsap.killTweensOf(prevLiquid);
        gsap.to(prevLiquid, {
          scaleY: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
      }

      if (prevIcon) {
        gsap.to(prevIcon, {
          color: "#4A5568",
          duration: 0.3,
        });
      }

      if (prevText) {
        gsap.to(prevText, {
          color: "#4A5568",
          duration: 0.3,
        });
      }
    }

    // Fill the new selected category
    const liquid = liquidRefs.current[catId];
    const icon = iconRefs.current[catId];
    const text = textRefs.current[catId];

    if (liquid) {
      gsap.killTweensOf(liquid);
      gsap.to(liquid, {
        scaleY: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    }

    if (icon) {
      gsap.to(icon, {
        color: "#FFFFFF",
        duration: 0.3,
      });
    }

    if (text) {
      gsap.to(text, {
        color: "#FFFFFF",
        duration: 0.3,
      });
    }

    setSelectedCategory(catId);
    setSelectedPath(null);
  };

  const handlePathClick = (pathName) => {
    setSelectedPath(pathName);
  };

  const handleCloseCard = () => {
    setSelectedPath(null);
  };

  // Get the current path data
  const getCurrentPathData = () => {
    if (selectedCategory && selectedPath) {
      const paths = pathData[selectedCategory];
      return paths.find((p) => p.name === selectedPath);
    }
    return null;
  };

  return (
    <>
      {/* Path Card */}
      {selectedPath && getCurrentPathData() && (
        <PathCard 
          path={getCurrentPathData()} 
          onClose={handleCloseCard}
          cardRef={pathCardRef}
        />
      )}

      <div
        className="absolute bottom-8 z-50 left-1/2 -translate-x-1/2 max-sm:bottom-2 max-md:bottom-2 max-lg:bottom-2 max-xl:bottom-2 max-2xl:bottom-2"
        ref={containerRef}
      >
        {/* CATEGORY BUTTONS */}

        <div className="flex gap-2 bg-white p-1 rounded-xs shadow-2xl text-[#4A5568] relative max-sm:gap-0.5 max-sm:p-0.5 max-md:gap-0.5 max-md:p-0.5 max-lg:gap-0.5 max-lg:p-1 max-xl:gap-0.5 max-xl:p-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              ref={(el) => (buttonRefs.current[cat.id] = el)}
              data-selected={selectedCategory === cat.id}
              className="
            p-2
            flex flex-col items-center justify-center gap-1
            rounded-md
            relative
            overflow-hidden
            max-sm:p-1
            max-sm:rounded-sm
            max-sm:gap-0
            max-sm:px-0.5
            max-md:p-1
            max-md:rounded-sm
            max-md:gap-0
            max-md:px-0.5
            max-lg:p-1
            max-lg:rounded-xs
            max-lg:gap-0
            max-lg:px-0.5
            
            "
              onClick={() => handleCategoryClick(cat.id)}
              onMouseEnter={(e) => handleMouseEnter(e, cat.id)}
              onMouseLeave={(e) => handleMouseLeave(e, cat.id)}
            >
              {/* Liquid Fill */}
              <div
                ref={(el) => (liquidRefs.current[cat.id] = el)}
                className="absolute inset-0 bg-[#4A5568] rounded-md origin-bottom max-sm:rounded-sm max-md:rounded-sm max-lg:rounded-xs  max-xl:rounded-xs"
                style={{ transform: "scaleY(0)" }}
              />

              {/* Content */}
              <cat.icon
                ref={(el) => (iconRefs.current[cat.id] = el)}
                className="text-xl  z-10  max-sm:xs max-md:text-xs max-lg:text-sm max-xl:text-md  max-2xl:text-lg"
              />
              <span
                ref={(el) => (textRefs.current[cat.id] = el)}
                className="text-xs text-center uppercase tracking-tight font-futura-medium  z-10 max-sm:text-[7.5px] max-md:text-[10px] max-lg:text-[10.5px] max-xl:text-[12px] "
              >
                {cat.label}
              </span>
            </button>
          ))}

          {/* PATH BUTTONS */}
          {selectedCategory && (
            <div
              ref={pathButtonsRef}
              className="absolute bottom-full font-futura-medium  tracking-tight p-2 mb-2 bg-white text-[#4A5568] flex flex-col rounded-md shadow-2xl gap-2 -translate-x-1/2 max-sm:p-1 max-sm:gap-0.5 max-sm:rounded-xs max-md:p-1 max-md:gap-0.5 max-md:rounded-xs max-lg:p-1 max-lg:gap-0.5 max-lg:rounded-xs max-xl:p-2 max-xl:gap-0.5 max-xl:rounded-xs"
              style={{ left: `${pathButtonsPosition.left}px` }}
            >
              {pathData[selectedCategory].map((item, i) => (
                <button
                  className={`p-2 rounded-md flex justify-center text-nowrap ${item.name === selectedPath ? 'bg-[#4A5568] text-white': 'hover:bg-gray-200'}  gap-2 items-center transition-colors max-sm:p-0.5 max-sm:rounded-xs max-sm:text-[7px] max-sm:gap-0.5 max-md:p-0.5 max-md:rounded-xs max-md:text-[10px] max-md:gap-0.5 max-lg:p-1 max-lg:rounded-xs max-lg:text-[14px] max-lg:gap-0.5 max-xl:p-1 max-xl:rounded-xs max-xl:text-[14px] max-xl:gap-0.5  max-2xl:p-2 max-2xl:rounded-sm max-2xl:text-[20px] max-2xl:gap-0.5`}
                  key={i}
                  onClick={() => handlePathClick(item.name)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}