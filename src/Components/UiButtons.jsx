import { usePaths } from "./PathsContext";
import { pathData } from "./PathData";
import { RiPagesLine } from "react-icons/ri";
import { GiGreekTemple } from "react-icons/gi";
import { CiAt, CiHeart } from "react-icons/ci";
import { IoSchoolOutline } from "react-icons/io5";
import { LuHotel } from "react-icons/lu";
import { PiHospitalLight, PiMapPinSimpleArea } from "react-icons/pi";

export default function UIButtons() {
  const { setSelectedCategory, setSelectedPath, selectedCategory } = usePaths();

  const categories = [
    { id: "portfolio", icon: RiPagesLine, label: "Portfolio" },
    { id: "historical", icon: GiGreekTemple, label: "Historical" },
    { id: "recreational", icon: CiAt, label: "Recreational" },
    { id: "clubs", icon: CiHeart, label: "Clubs" },
    { id: "schools", icon: IoSchoolOutline, label: "Schools" },
    { id: "hotels", icon: LuHotel, label: "Hotels" },
    { id: "hospitals", icon: PiHospitalLight, label: "Hospitals" },
    { id: "connectivity_present", icon: PiMapPinSimpleArea, label: "Connectivity (Present)" },
    { id: "connectivity_future", icon: PiMapPinSimpleArea, label: "Connectivity (Future)" },
  ];

  return (
    <div style={{ position: "absolute", top: 20, left: 20, zIndex: 999, color: "#fff" }}>
      
      {/* CATEGORY BUTTONS */}
      <div className="flex gap-2">

      {categories.map((cat) => (
        
        <button
        className="p-2 bg-gray-900 rounded-2xl flex gap-2 items-center"
        key={cat.id}
        onClick={() => {
          setSelectedCategory(cat.id);
          setSelectedPath(null);    // close previous
        }}
        >
          <cat.icon />
          {cat.label}
        </button>
      ))}
      </div>

      {/* PATH BUTTONS */}
      {selectedCategory && (
        <div className="mt-10 flex gap-2">
          {pathData[selectedCategory].map((item, i) => (
            <button
             className="p-2 bg-gray-700 rounded-md flex gap-2 items-center"
              key={i}
              onClick={() => setSelectedPath(item.name)}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
