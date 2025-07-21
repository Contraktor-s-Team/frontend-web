import { writeFileSync } from 'fs';

const generateJobScenarios = (count) => {
  const categories = ["Electrical Repairs", "Plumbing", "Painting"];
  const titles = ["Light Fix", "Pipe Leak Repair", "Wall Painting"];
  const descriptions = [
    "Needs inspection due to sparking.",
    "Requires fixing due to leakage.",
    "Needs repainting due to wear."
  ];
  const customerNames = ["Musa Ibrahim", "Amina Yusuf", "Tunde Adebayo"];
  const customerPhones = ["0803 123 4567", "0804 567 8901", "0805 432 1098"];
  const customerEmails = ["musaibrahim@gmail.com", "aminayusuf@gmail.com", "tundeadebayo@gmail.com"];
  const locations = ["Lekki Phase 1", "Surulere, Lagos", "Ikeja GRA", "Victoria Island"];
  const statuses = ["posted", "direct"];
  const dates = ["10 Jul, 2025", "14 Jun, 2025", "15 Jul, 2025", "16 Jul, 2025"];
  const times = ["10:00 AM", "02:00 PM", "11:00 AM"];

  // Static real image URLs
  const realImages = [
    "https://images.pexels.com/photos/5076460/pexels-photo-5076460.jpeg",
    "https://images.pexels.com/photos/271633/pexels-photo-271633.jpeg",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg"
  ];

  const jobScenarios = [];

  for (let i = 0; i < count; i++) {
    const job = {
      category: categories[Math.floor(Math.random() * categories.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      customer: {
        name: customerNames[Math.floor(Math.random() * customerNames.length)],
        phone: customerPhones[Math.floor(Math.random() * customerPhones.length)],
        email: customerEmails[Math.floor(Math.random() * customerEmails.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        address: i % 2 === 0 ? `${i + 1} Random Street, Lagos` : undefined
      },
      dateTime: `${dates[Math.floor(Math.random() * dates.length)]} - ${times[Math.floor(Math.random() * times.length)]}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      images: realImages, // 3 real images
      id: i + 1
    };
    jobScenarios.push(job);
  }

  writeFileSync('jobScenarios.json', JSON.stringify(jobScenarios, null, 2), 'utf8');
  console.log(`Generated ${count} job scenarios and written to jobScenarios.json`);
};

// Run with a specific count (e.g., 50 jobs)
generateJobScenarios(50);
