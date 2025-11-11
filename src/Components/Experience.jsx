import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState } from "react";
import Scene from "./Scene";
import { RiPagesLine } from "react-icons/ri";
import { GiGreekTemple } from "react-icons/gi";
import { CiAt, CiHeart } from "react-icons/ci";
import { IoIosSchool } from "react-icons/io";
import { LuHotel } from "react-icons/lu";
import { FaRegHospital } from "react-icons/fa";
import { PiHospitalLight, PiMapPinSimpleArea } from "react-icons/pi";
import { IoSchoolOutline } from "react-icons/io5";
import { Environment, Preload } from "@react-three/drei";
import Loader from "./Loader";

const Experience = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: "portfolio", icon: RiPagesLine, label: "Portfolio" },
    { id: "historical", icon: GiGreekTemple, label: "Historical" },
    { id: "recreational", icon: CiAt, label: "Recreational" },
    { id: "club", icon: CiHeart, label: "Club" },
    { id: "schools", icon: IoSchoolOutline, label: "Schools" },
    { id: "hotel", icon: LuHotel, label: "Hotel" },
    { id: "hospital", icon: PiHospitalLight, label: "Hospital" },
    { id: "connectivity", icon: PiMapPinSimpleArea, label: "Connectivity" },
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <>
      <div className="h-screen w-screen">
      <Loader /> {/* minimal overlay loader */}
        <Canvas
          camera={{
            position: [80, 120, 200],
            fov: 50,
            near: 10,
            far: 20000,
          }}
          shadows
        >
          <color attach="background" args={["#7fa4c9"]} />
          <fog attach={"fog"} args={["#7fa4c9", 2000, 6000]} />
          {/* <HorizontalFog
            color="#a5b9c7"
            density={0.0005}
            heightFalloff={0.001}
            waterHeight={0} // your ocean Y position
          /> */}
          <Environment preset="city" />
          <Suspense fallback={null}>
          <Scene />
          <Preload all />
        </Suspense>
        </Canvas>

        {/* <div className="w-fit fixed bg-[#F5F7FA] bottom-4 left-1/2 -translate-x-1/2 flex gap-3 p-2 py-3 items-center shadow-lg rounded-lg">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`text-center p-2 flex flex-col justify-center items-center cursor-pointer transition-colors`}
              >
                <Icon className={`text-2xl ${isActive ? 'text-blue-600' : 'text-gray-700'}`} />
                <h1 className={`text-sm ${isActive ? 'text-blue-800 font-semibold' : 'text-gray-800'}`}>
                  {category.label}
                </h1>
              </button>
            );
          })}
        </div>
        
        {selectedCategory && (
          <div className="fixed w-auto px-6 py-4 bg-white bottom-28 left-1/2 -translate-x-1/2 shadow-xl rounded-lg">
            <p className="text-gray-800 font-medium">
              Selected: <span className="text-blue-600">{selectedCategory}</span>
            </p>
          </div>
        )} */}
      </div>
    </>
  );
};

export default Experience;
