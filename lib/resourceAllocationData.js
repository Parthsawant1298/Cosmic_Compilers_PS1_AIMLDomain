// Static Resource Allocation Data - 50 Entries
export const resourceAllocationData = [
  // Mumbai Suburban - High Crime Areas
  { id: 1, location: "Borivali Police Station", district: "Mumbai Suburban", latitude: 19.2403, longitude: 72.8567, officers: 45, vehicles: 8, budget: 2500000, equipment_score: 85, crime_density: "High", recommended_officers: 55, recommended_vehicles: 10, patrol_efficiency: 78 },
  { id: 2, location: "Bandra Police Station", district: "Mumbai Suburban", latitude: 19.0596, longitude: 72.8295, officers: 52, vehicles: 10, budget: 3200000, equipment_score: 90, crime_density: "Very High", recommended_officers: 65, recommended_vehicles: 12, patrol_efficiency: 82 },
  { id: 3, location: "Andheri Police Station", district: "Mumbai Suburban", latitude: 19.1136, longitude: 72.8697, officers: 48, vehicles: 9, budget: 2800000, equipment_score: 88, crime_density: "High", recommended_officers: 58, recommended_vehicles: 11, patrol_efficiency: 80 },
  { id: 4, location: "Kurla Police Station", district: "Mumbai Suburban", latitude: 19.0728, longitude: 72.8826, officers: 42, vehicles: 7, budget: 2300000, equipment_score: 82, crime_density: "Very High", recommended_officers: 60, recommended_vehicles: 11, patrol_efficiency: 75 },
  { id: 5, location: "Ghatkopar Police Station", district: "Mumbai Suburban", latitude: 19.0860, longitude: 72.9081, officers: 40, vehicles: 7, budget: 2200000, equipment_score: 80, crime_density: "High", recommended_officers: 52, recommended_vehicles: 9, patrol_efficiency: 77 },
  { id: 6, location: "Mulund Police Station", district: "Mumbai Suburban", latitude: 19.1722, longitude: 72.9565, officers: 35, vehicles: 6, budget: 1900000, equipment_score: 78, crime_density: "Medium", recommended_officers: 42, recommended_vehicles: 8, patrol_efficiency: 73 },
  { id: 7, location: "Vikhroli Police Station", district: "Mumbai Suburban", latitude: 19.1083, longitude: 72.9320, officers: 38, vehicles: 6, budget: 2000000, equipment_score: 79, crime_density: "Medium", recommended_officers: 45, recommended_vehicles: 8, patrol_efficiency: 74 },
  { id: 8, location: "Powai Police Station", district: "Mumbai Suburban", latitude: 19.1176, longitude: 72.9060, officers: 32, vehicles: 5, budget: 1700000, equipment_score: 75, crime_density: "Low", recommended_officers: 38, recommended_vehicles: 7, patrol_efficiency: 71 },
  { id: 9, location: "Goregaon Police Station", district: "Mumbai Suburban", latitude: 19.1663, longitude: 72.8526, officers: 44, vehicles: 8, budget: 2400000, equipment_score: 84, crime_density: "High", recommended_officers: 54, recommended_vehicles: 10, patrol_efficiency: 79 },
  { id: 10, location: "Malad Police Station", district: "Mumbai Suburban", latitude: 19.1868, longitude: 72.8454, officers: 46, vehicles: 8, budget: 2500000, equipment_score: 86, crime_density: "High", recommended_officers: 56, recommended_vehicles: 10, patrol_efficiency: 81 },
  
  // Mumbai City - Commercial Areas
  { id: 11, location: "Colaba Police Station", district: "Mumbai City", latitude: 18.9067, longitude: 72.8147, officers: 55, vehicles: 12, budget: 3500000, equipment_score: 92, crime_density: "Very High", recommended_officers: 70, recommended_vehicles: 15, patrol_efficiency: 85 },
  { id: 12, location: "Marine Drive Police Station", district: "Mumbai City", latitude: 18.9432, longitude: 72.8236, officers: 50, vehicles: 10, budget: 3000000, equipment_score: 90, crime_density: "High", recommended_officers: 62, recommended_vehicles: 12, patrol_efficiency: 83 },
  { id: 13, location: "Worli Police Station", district: "Mumbai City", latitude: 19.0176, longitude: 72.8161, officers: 48, vehicles: 9, budget: 2900000, equipment_score: 89, crime_density: "High", recommended_officers: 60, recommended_vehicles: 11, patrol_efficiency: 82 },
  { id: 14, location: "Dadar Police Station", district: "Mumbai City", latitude: 19.0189, longitude: 72.8428, officers: 52, vehicles: 10, budget: 3100000, equipment_score: 91, crime_density: "Very High", recommended_officers: 65, recommended_vehicles: 13, patrol_efficiency: 84 },
  { id: 15, location: "Byculla Police Station", district: "Mumbai City", latitude: 18.9784, longitude: 72.8343, officers: 45, vehicles: 8, budget: 2600000, equipment_score: 87, crime_density: "High", recommended_officers: 58, recommended_vehicles: 10, patrol_efficiency: 80 },
  
  // Thane - Emerging Areas
  { id: 16, location: "Thane City Police Station", district: "Thane", latitude: 19.2183, longitude: 72.9781, officers: 40, vehicles: 7, budget: 2300000, equipment_score: 83, crime_density: "Medium", recommended_officers: 50, recommended_vehicles: 9, patrol_efficiency: 76 },
  { id: 17, location: "Kalyan Police Station", district: "Thane", latitude: 19.2403, longitude: 73.1305, officers: 38, vehicles: 7, budget: 2100000, equipment_score: 81, crime_density: "Medium", recommended_officers: 48, recommended_vehicles: 9, patrol_efficiency: 75 },
  { id: 18, location: "Dombivli Police Station", district: "Thane", latitude: 19.2167, longitude: 73.0879, officers: 36, vehicles: 6, budget: 2000000, equipment_score: 80, crime_density: "Medium", recommended_officers: 45, recommended_vehicles: 8, patrol_efficiency: 74 },
  { id: 19, location: "Bhiwandi Police Station", district: "Thane", latitude: 19.2969, longitude: 73.0630, officers: 35, vehicles: 6, budget: 1900000, equipment_score: 78, crime_density: "High", recommended_officers: 48, recommended_vehicles: 9, patrol_efficiency: 72 },
  { id: 20, location: "Ulhasnagar Police Station", district: "Thane", latitude: 19.2166, longitude: 73.1544, officers: 34, vehicles: 6, budget: 1850000, equipment_score: 77, crime_density: "Medium", recommended_officers: 42, recommended_vehicles: 8, patrol_efficiency: 73 },
  
  // Accident-Prone Zones with Resource Needs
  { id: 21, location: "Eastern Express Highway - Mulund", district: "Mumbai Suburban", latitude: 19.1642, longitude: 72.9550, officers: 8, vehicles: 4, budget: 800000, equipment_score: 70, crime_density: "Medium", recommended_officers: 12, recommended_vehicles: 6, patrol_efficiency: 65, zone_type: "Accident Hotspot" },
  { id: 22, location: "Western Express Highway - Goregaon", district: "Mumbai Suburban", latitude: 19.1695, longitude: 72.8500, officers: 10, vehicles: 5, budget: 900000, equipment_score: 72, crime_density: "High", recommended_officers: 15, recommended_vehicles: 7, patrol_efficiency: 68, zone_type: "Accident Hotspot" },
  { id: 23, location: "Bandra-Worli Sea Link Toll Plaza", district: "Mumbai City", latitude: 19.0308, longitude: 72.8152, officers: 12, vehicles: 6, budget: 1100000, equipment_score: 75, crime_density: "Medium", recommended_officers: 16, recommended_vehicles: 8, patrol_efficiency: 70, zone_type: "Accident Hotspot" },
  { id: 24, location: "LBS Marg - Ghatkopar", district: "Mumbai Suburban", latitude: 19.0869, longitude: 72.9081, officers: 9, vehicles: 4, budget: 850000, equipment_score: 71, crime_density: "High", recommended_officers: 14, recommended_vehicles: 7, patrol_efficiency: 67, zone_type: "Accident Hotspot" },
  { id: 25, location: "Jogeshwari-Vikhroli Link Road", district: "Mumbai Suburban", latitude: 19.1300, longitude: 72.9100, officers: 7, vehicles: 3, budget: 700000, equipment_score: 68, crime_density: "Medium", recommended_officers: 11, recommended_vehicles: 5, patrol_efficiency: 64, zone_type: "Accident Hotspot" },
  
  // Strategic Checkpoints
  { id: 26, location: "Bandra Terminus Entry", district: "Mumbai Suburban", latitude: 19.0625, longitude: 72.8408, officers: 15, vehicles: 3, budget: 1200000, equipment_score: 88, crime_density: "High", recommended_officers: 20, recommended_vehicles: 4, patrol_efficiency: 82, zone_type: "Strategic Checkpoint" },
  { id: 27, location: "Chhatrapati Shivaji Terminus", district: "Mumbai City", latitude: 18.9398, longitude: 72.8355, officers: 25, vehicles: 5, budget: 2000000, equipment_score: 95, crime_density: "Very High", recommended_officers: 35, recommended_vehicles: 7, patrol_efficiency: 88, zone_type: "Strategic Checkpoint" },
  { id: 28, location: "Mumbai Central Station", district: "Mumbai City", latitude: 18.9685, longitude: 72.8191, officers: 20, vehicles: 4, budget: 1600000, equipment_score: 90, crime_density: "High", recommended_officers: 28, recommended_vehicles: 6, patrol_efficiency: 85, zone_type: "Strategic Checkpoint" },
  { id: 29, location: "Dadar Railway Station", district: "Mumbai City", latitude: 19.0176, longitude: 72.8428, officers: 18, vehicles: 4, budget: 1400000, equipment_score: 87, crime_density: "Very High", recommended_officers: 26, recommended_vehicles: 6, patrol_efficiency: 83, zone_type: "Strategic Checkpoint" },
  { id: 30, location: "Andheri Railway Station", district: "Mumbai Suburban", latitude: 19.1197, longitude: 72.8464, officers: 16, vehicles: 3, budget: 1300000, equipment_score: 85, crime_density: "High", recommended_officers: 22, recommended_vehicles: 5, patrol_efficiency: 80, zone_type: "Strategic Checkpoint" },
  
  // Commercial & Market Areas
  { id: 31, location: "Crawford Market", district: "Mumbai City", latitude: 18.9467, longitude: 72.8342, officers: 22, vehicles: 4, budget: 1700000, equipment_score: 89, crime_density: "Very High", recommended_officers: 30, recommended_vehicles: 6, patrol_efficiency: 84, zone_type: "Commercial Hub" },
  { id: 32, location: "Zaveri Bazaar", district: "Mumbai City", latitude: 18.9489, longitude: 72.8347, officers: 20, vehicles: 3, budget: 1500000, equipment_score: 86, crime_density: "Very High", recommended_officers: 28, recommended_vehicles: 5, patrol_efficiency: 82, zone_type: "Commercial Hub" },
  { id: 33, location: "Linking Road Market", district: "Mumbai Suburban", latitude: 19.0544, longitude: 72.8294, officers: 14, vehicles: 3, budget: 1100000, equipment_score: 82, crime_density: "High", recommended_officers: 20, recommended_vehicles: 4, patrol_efficiency: 78, zone_type: "Commercial Hub" },
  { id: 34, location: "Phoenix Mall Kurla", district: "Mumbai Suburban", latitude: 19.0825, longitude: 72.8903, officers: 12, vehicles: 2, budget: 950000, equipment_score: 80, crime_density: "Medium", recommended_officers: 16, recommended_vehicles: 3, patrol_efficiency: 76, zone_type: "Commercial Hub" },
  { id: 35, location: "Infiniti Mall Malad", district: "Mumbai Suburban", latitude: 19.1876, longitude: 72.8357, officers: 10, vehicles: 2, budget: 850000, equipment_score: 78, crime_density: "Medium", recommended_officers: 14, recommended_vehicles: 3, patrol_efficiency: 74, zone_type: "Commercial Hub" },
  
  // Residential High-Density Areas
  { id: 36, location: "Dharavi", district: "Mumbai City", latitude: 19.0433, longitude: 72.8540, officers: 30, vehicles: 5, budget: 2200000, equipment_score: 85, crime_density: "Very High", recommended_officers: 45, recommended_vehicles: 8, patrol_efficiency: 78, zone_type: "Residential Dense" },
  { id: 37, location: "Chembur", district: "Mumbai Suburban", latitude: 19.0633, longitude: 72.8997, officers: 28, vehicles: 5, budget: 2000000, equipment_score: 84, crime_density: "High", recommended_officers: 38, recommended_vehicles: 7, patrol_efficiency: 77, zone_type: "Residential Dense" },
  { id: 38, location: "Santacruz", district: "Mumbai Suburban", latitude: 19.0806, longitude: 72.8417, officers: 26, vehicles: 5, budget: 1900000, equipment_score: 83, crime_density: "High", recommended_officers: 36, recommended_vehicles: 7, patrol_efficiency: 76, zone_type: "Residential Dense" },
  { id: 39, location: "Juhu", district: "Mumbai Suburban", latitude: 19.0989, longitude: 72.8269, officers: 24, vehicles: 4, budget: 1750000, equipment_score: 82, crime_density: "Medium", recommended_officers: 32, recommended_vehicles: 6, patrol_efficiency: 75, zone_type: "Residential Dense" },
  { id: 40, location: "Kandivali", district: "Mumbai Suburban", latitude: 19.2039, longitude: 72.8501, officers: 22, vehicles: 4, budget: 1650000, equipment_score: 81, crime_density: "Medium", recommended_officers: 30, recommended_vehicles: 6, patrol_efficiency: 74, zone_type: "Residential Dense" },
  
  // Night Patrol Zones
  { id: 41, location: "Girgaon Chowpatty", district: "Mumbai City", latitude: 18.9542, longitude: 72.8117, officers: 8, vehicles: 2, budget: 700000, equipment_score: 75, crime_density: "Medium", recommended_officers: 12, recommended_vehicles: 3, patrol_efficiency: 70, zone_type: "Night Patrol Zone" },
  { id: 42, location: "Juhu Beach", district: "Mumbai Suburban", latitude: 19.0989, longitude: 72.8269, officers: 10, vehicles: 3, budget: 850000, equipment_score: 78, crime_density: "Medium", recommended_officers: 15, recommended_vehicles: 4, patrol_efficiency: 72, zone_type: "Night Patrol Zone" },
  { id: 43, location: "Versova Beach", district: "Mumbai Suburban", latitude: 19.1350, longitude: 72.8086, officers: 7, vehicles: 2, budget: 650000, equipment_score: 73, crime_density: "Low", recommended_officers: 10, recommended_vehicles: 3, patrol_efficiency: 68, zone_type: "Night Patrol Zone" },
  { id: 44, location: "Marine Drive Promenade", district: "Mumbai City", latitude: 18.9432, longitude: 72.8236, officers: 12, vehicles: 3, budget: 1000000, equipment_score: 80, crime_density: "High", recommended_officers: 18, recommended_vehicles: 4, patrol_efficiency: 75, zone_type: "Night Patrol Zone" },
  { id: 45, location: "Powai Lake Area", district: "Mumbai Suburban", latitude: 19.1195, longitude: 72.9050, officers: 6, vehicles: 2, budget: 600000, equipment_score: 72, crime_density: "Low", recommended_officers: 9, recommended_vehicles: 3, patrol_efficiency: 67, zone_type: "Night Patrol Zone" },
  
  // Critical Infrastructure
  { id: 46, location: "Mumbai Airport - Terminal 1", district: "Mumbai Suburban", latitude: 19.0896, longitude: 72.8656, officers: 35, vehicles: 7, budget: 2800000, equipment_score: 93, crime_density: "High", recommended_officers: 50, recommended_vehicles: 10, patrol_efficiency: 87, zone_type: "Critical Infrastructure" },
  { id: 47, location: "Mumbai Airport - Terminal 2", district: "Mumbai Suburban", latitude: 19.0886, longitude: 72.8678, officers: 40, vehicles: 8, budget: 3200000, equipment_score: 95, crime_density: "High", recommended_officers: 55, recommended_vehicles: 12, patrol_efficiency: 89, zone_type: "Critical Infrastructure" },
  { id: 48, location: "Navi Mumbai Airport Zone", district: "Navi Mumbai", latitude: 19.0968, longitude: 73.0228, officers: 25, vehicles: 5, budget: 2000000, equipment_score: 88, crime_density: "Medium", recommended_officers: 35, recommended_vehicles: 7, patrol_efficiency: 82, zone_type: "Critical Infrastructure" },
  { id: 49, location: "BKC Business District", district: "Mumbai Suburban", latitude: 19.0665, longitude: 72.8689, officers: 30, vehicles: 6, budget: 2500000, equipment_score: 90, crime_density: "High", recommended_officers: 42, recommended_vehicles: 9, patrol_efficiency: 85, zone_type: "Critical Infrastructure" },
  { id: 50, location: "Mumbai Port Trust Area", district: "Mumbai City", latitude: 18.9567, longitude: 72.8454, officers: 28, vehicles: 6, budget: 2200000, equipment_score: 87, crime_density: "Medium", recommended_officers: 38, recommended_vehicles: 8, patrol_efficiency: 83, zone_type: "Critical Infrastructure" }
];

// Budget Summary
export const budgetSummary = {
  total_budget: 95250000,
  allocated: 85750000,
  remaining: 9500000,
  total_officers: 1015,
  recommended_officers: 1380,
  officer_deficit: 365,
  total_vehicles: 285,
  recommended_vehicles: 385,
  vehicle_deficit: 100,
  average_efficiency: 77.2
};

// District-wise Summary
export const districtSummary = [
  { district: "Mumbai Suburban", officers: 485, vehicles: 130, budget: 35400000, stations: 20, avg_efficiency: 76.8, crime_density: "High" },
  { district: "Mumbai City", officers: 380, vehicles: 95, budget: 28500000, stations: 15, avg_efficiency: 83.5, crime_density: "Very High" },
  { district: "Thane", officers: 150, vehicles: 60, budget: 10050000, stations: 10, avg_efficiency: 74.0, crime_density: "Medium" }
];

// Equipment Categories
export const equipmentInventory = [
  { category: "Patrol Vehicles", current: 285, required: 385, gap: 100, cost_per_unit: 800000, total_cost: 80000000 },
  { category: "Communication Devices", current: 1200, required: 1500, gap: 300, cost_per_unit: 15000, total_cost: 4500000 },
  { category: "Body Cameras", current: 650, required: 1380, gap: 730, cost_per_unit: 25000, total_cost: 18250000 },
  { category: "Night Vision Equipment", current: 180, required: 385, gap: 205, cost_per_unit: 45000, total_cost: 9225000 },
  { category: "GPS Trackers", current: 285, required: 385, gap: 100, cost_per_unit: 8000, total_cost: 800000 },
  { category: "First Aid Kits", current: 320, required: 400, gap: 80, cost_per_unit: 5000, total_cost: 400000 }
];
