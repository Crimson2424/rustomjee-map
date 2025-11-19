/**
 * Category definitions for Bandra locations
 * Each category has an id, name, color, and icon
 */
export const CATEGORY_DEFINITIONS = [
    {
      id: "portfolio",
      name: "Rustomjee Portfolio",
      color: "#3b82f6",
      icon: "🏢",
    },
    {
      id: "historical",
      name: "Historical",
      color: "#f59e0b",
      icon: "🏛️",
    },
    {
      id: "recreational",
      name: "Recreational",
      color: "#10b981",
      icon: "🎭",
    },
    {
      id: "clubs",
      name: "Clubs",
      color: "#8b5cf6",
      icon: "🎾",
    },
    {
      id: "schools",
      name: "Schools",
      color: "#ec4899",
      icon: "🎓",
    },
    {
      id: "hotels",
      name: "Hotels",
      color: "#06b6d4",
      icon: "🏨",
    },
    {
      id: "hospitals",
      name: "Hospitals",
      color: "#ef4444",
      icon: "🏥",
    },
    {
      id: "connectivity_present",
      name: "Present Connectivity",
      color: "#14b8a6",
      icon: "🛣️",
    },
    {
      id: "connectivity_future",
      name: "Future Connectivity",
      color: "#a855f7",
      icon: "🚧",
    },
  ];
  
  /**
   * Get category label with icon
   */
  export function getCategoryLabel(categoryId) {
    const labels = {
      portfolio: "🏢 Portfolio",
      historical: "🏛️ Historical",
      recreational: "🎭 Recreational",
      clubs: "🎾 Clubs",
      schools: "🎓 Schools",
      hotels: "🏨 Hotels",
      hospitals: "🏥 Hospitals",
      connectivity_present: "🛣️ Present",
      connectivity_future: "🚧 Future",
    };
    return labels[categoryId] || categoryId;
  }
  
  /**
   * Initialize empty paths data structure
   */
  export function createEmptyPathsData() {
    return {
      portfolio: [],
      historical: [],
      recreational: [],
      clubs: [],
      schools: [],
      hotels: [],
      hospitals: [],
      connectivity_present: [],
      connectivity_future: [],
    };
  }