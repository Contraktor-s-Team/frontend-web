import fs from "fs";

// ──────────────────────────────
// Data Pools
// ──────────────────────────────
const names = [
  "Chinedu Okafor", "Amina Sule", "Tunde Bakare", "Ngozi Ibe", "Ibrahim Musa",
  "Femi Johnson", "Blessing Umeh", "Samuel Obasi", "Joy Etim", "Emeka Nwosu",
  "Chisom Anene", "Rasheed Lawal", "Esther Ojo", "Kelechi Udo", "Peter Agbaje",
  "Halima Bello", "Tope Ajayi", "Adaeze Nwachukwu", "Sulaimon Kareem", "Jane Igbokwe",
  "David Oyeniyi", "Bukky Salami", "Joseph Anibaba", "Tosin Aluko", "Victoria Okon",
  "Amaka Obi", "Ahmed Danjuma", "Chuka Eze", "Yetunde Adebayo", "Gbenga Ogunleye"
];

const specialties = [
  "Electrical Repairs", "Plumbing", "AC Installation", "Painting", "Carpentry",
  "Tiling", "Roofing", "Masonry", "Welding", "Generator Repairs", "POP Design",
  "Furniture Assembly", "Gate Installation", "Glass Work", "Floor Screeding",
  "Interlocking", "Bathroom Fittings", "Wall Finishing", "Satellite Installation",
  "Security Systems", "CCTV Setup", "Solar Panel Installation", "Borehole Drilling",
  "Interior Decoration", "Ceiling Mounting", "Soundproofing", "Wall Paneling",
  "Water Heater Installation", "Fence Wiring", "Water Tank Fixing"
];

const allServices = {
  "Electrical Repairs": ["Wiring", "Socket Replacement", "Lighting Installation", "Switch Fixing", "Generator Hookup"],
  "Plumbing": ["Pipe Fixing", "Drain Cleaning", "Toilet Repairs", "Tap Installation", "Bathroom Leak Fix"],
  "AC Installation": ["Split AC Setup", "Window Unit Installation", "Gas Refill", "AC Cleaning"],
  "Painting": ["Interior", "Exterior", "POP Painting", "Color Blending", "Graffiato"],
  "Carpentry": ["Furniture Assembly", "Wardrobe Fixing", "Door Repairs", "Wood Polishing", "TV Shelf Installation"],
  "Tiling": ["Floor Tiling", "Wall Tiling", "Re-grouting", "Tile Removal"],
  "Roofing": ["Leak Repairs", "New Roof Setup", "Gutter Fixing", "Zinc Replacement"],
  "Masonry": ["Block Laying", "Cement Finishing", "Foundation Work", "Plastering"],
  "Welding": ["Gate Welding", "Door Frames", "Security Bars", "Window Grills"],
  "Generator Repairs": ["Engine Servicing", "Starter Fixing", "Fuel Line Replacement", "Oil Change"],
  "POP Design": ["Ceiling Layout", "Screeding", "Bulkhead Design", "Lighting Integration"],
  "Furniture Assembly": ["Table Fixing", "Sofa Setup", "Custom Bed Frames"],
  "Gate Installation": ["Gate Hanging", "Security Lock Integration", "Painting & Finishing"],
  "Glass Work": ["Shower Glass Installation", "Mirror Hanging", "Glass Door Repairs"],
  "Floor Screeding": ["Cement Screeding", "Waterproof Screeding", "Leveling"],
  "Interlocking": ["Driveway", "Walkway", "Edge Cutting"],
  "Bathroom Fittings": ["Shower Installation", "Sink Mounting", "Tap Fixing"],
  "Wall Finishing": ["Cement Finish", "Smooth Coating", "Sandtex Painting"],
  "Satellite Installation": ["Dish Mounting", "Signal Setup", "Cable Routing"],
  "Security Systems": ["Alarm Setup", "Door Sensor Mounting", "Gate Buzzers"],
  "CCTV Setup": ["Indoor Cams", "Outdoor Setup", "Cable Management"],
  "Solar Panel Installation": ["Roof Mounting", "Battery Hookup", "Inverter Wiring"],
  "Borehole Drilling": ["Drilling", "Pump Setup", "Water Analysis"],
  "Interior Decoration": ["Curtain Rails", "Wall Art", "Lighting Setup"],
  "Ceiling Mounting": ["Suspended Ceiling", "PVC Ceilings", "LED Integration"],
  "Soundproofing": ["Room Padding", "Studio Insulation", "Wall Paneling"],
  "Wall Paneling": ["3D Panels", "Wooden Panels", "PVC Panels"],
  "Water Heater Installation": ["Heater Mounting", "Pipe Connection", "Electrical Wiring"],
  "Fence Wiring": ["Barbed Wire", "Electric Fence", "Security Integration"],
  "Water Tank Fixing": ["Tank Installation", "Tap Hookup", "Stand Welding"]
};

const locations = [
  "Surulere, Lagos", "Ikeja, Lagos", "Yaba, Lagos", "Gbagada, Lagos", "Mushin, Lagos",
  "Ajah, Lagos", "Lekki, Lagos", "Oshodi, Lagos", "Ikorodu, Lagos", "Apapa, Lagos",
  "Victoria Island, Lagos", "Agege, Lagos", "Festac, Lagos", "Egbeda, Lagos",
  "Ojota, Lagos", "Ogba, Lagos", "Isolo, Lagos", "Maryland, Lagos", "Sango-Ota, Ogun",
  "Ibadan, Oyo", "Abeokuta, Ogun", "Ilorin, Kwara", "Akure, Ondo", "Benin City, Edo",
  "Abuja, FCT", "Port Harcourt, Rivers", "Uyo, Akwa Ibom", "Onitsha, Anambra",
  "Enugu, Enugu", "Jos, Plateau"
];

const languages = [
  ["English", "Yoruba"], ["English", "Igbo"], ["English", "Hausa"], ["English"],
  ["English", "Pidgin"], ["English", "Tiv"], ["English", "Fulfulde"], ["English", "Efik"],
  ["English", "Urhobo"], ["English", "Ibibio"]
];

const reviewTemplates = [
  "{{name}} was fast and professional. Fixed everything quickly. Highly recommend!",
  "Very polite. {{name}} explained the issue clearly and did great work.",
  "One of the best I’ve worked with. I’ll definitely call {{name}} again.",
  "{{name}} showed up on time and cleaned up afterward. Excellent service.",
  "Friendly and skilled — {{name}} knows what they’re doing.",
  "{{name}} completed the job earlier than expected and it was flawless.",
  "I’m impressed by how neat and efficient {{name}} was.",
  "Top-notch work! {{name}} handled it like a pro.",
  "Great experience with {{name}} — punctual, skilled, and respectful.",
  "{{name}} did a fantastic job and even gave helpful advice."
];

// ──────────────────────────────
// Helpers
// ──────────────────────────────
const getFirstName = (fullName) => fullName.split(" ")[0];

const getRandomReviews = (artisanName) => {
  const firstName = getFirstName(artisanName);
  const shuffled = [...reviewTemplates].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map((template, idx) => ({
    user: `Customer ${String.fromCharCode(65 + idx)}`,
    comment: template.replace("{{name}}", firstName),
    rating: +(4.5 + Math.random() * 0.5).toFixed(1)
  }));
};

const generateWorkPhotos = (id) => {
  return [
    `https://picsum.photos/seed/artisan-${id}-1/400/300`,
    `https://picsum.photos/seed/artisan-${id}-2/400/300`,
    `https://picsum.photos/seed/artisan-${id}-3/400/300`
  ];
};

// ──────────────────────────────
// Main Generator
// ──────────────────────────────
const generateArtisans = (count = 50) => {
  const artisans = [];

  for (let i = 1; i <= count; i++) {
    const name = names[i % names.length];
    const specialty = specialties[i % specialties.length];
    const all = allServices[specialty] || ["General Work"];
    const serviceCount = Math.min(6, Math.floor(Math.random() * all.length) + 4); // 4–6 services
    const services = [...all].sort(() => 0.5 - Math.random()).slice(0, serviceCount);

    artisans.push({
      id: i,
      name,
      specialty,
      services,
      image: "/img/avatar1.jpg",
      languages: languages[i % languages.length],
      biography: `I'm a professional ${specialty.toLowerCase()} specialist with over ${
        3 + (i % 10)
      } years of experience in residential and commercial projects.`,
      priceRange: "₦6,000 – ₦15,000",
      availabilitySchedule: "Mon–Sat, 9 AM – 6 PM",
      baseLocation: "Yaba, Lagos",
      location: locations[i % locations.length],
      rating: +(4.4 + Math.random() * 0.6).toFixed(1),
      reviewCount: Math.floor(Math.random() * 80) + 20,
      available: i % 3 !== 0,
      saved: i % 5 === 0,
      workPhotos: generateWorkPhotos(i),
      reviews: getRandomReviews(name)
    });
  }

  return artisans;
};

// ──────────────────────────────
// Run and Save
// ──────────────────────────────
const artisanData = generateArtisans(50);
fs.writeFileSync("artisans.json", JSON.stringify(artisanData, null, 2));
console.log("✅ artisans.json created with extended services and personalized reviews.");
