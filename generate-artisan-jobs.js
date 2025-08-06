import fs from 'fs';

// Job titles and their corresponding categories
const jobTypes = {
  'Electric Fence': 'Electrical',
  'House Cleaning': 'General',
  'Tile Replacement': 'AC Services',
  'Water Heater Fix': 'Water Heater Installation',
  'Generator Service': 'General',
  'Pool Cleaning': 'General',
  'Plumbing Leak Repair': 'Plumbing',
  'Curtain Installation': 'General',
  'AC Maintenance': 'AC Services',
  'Door Repair': 'Carpentry',
  'AC Installation': 'AC Services',
  'Window Fixing': 'General',
  'Interior Painting': 'Painting',
  'Garden Setup': 'General',
  'Furniture Assembly': 'General',
  'Garage Door Repair': 'Carpentry',
  'Fence Painting': 'Painting',
  'Roof Leakage': 'Plumbing'
};

// Customer names pool
const customerNames = [
  'Adebayo Johnson', 'Chinwe Okafor', 'Fatima Hassan', 'Emeka Nwosu',
  'Aisha Abdullahi', 'Tunde Adeyemi', 'Ngozi Ezeh', 'Ibrahim Musa',
  'Blessing Okoro', 'Yusuf Bello', 'Grace Onyeka', 'Chinedu Obi',
  'Kemi Adebayo', 'Suleiman Garba', 'Funmi Ogundipe', 'Ahmed Tijani',
  'Chioma Ugwu', 'Musa Yakubu', 'Ronke Adesanya', 'Aliyu Danjuma',
  'Nneka Anyanwu', 'Bashir Usman', 'Folake Adebisi', 'Hamza Shehu',
  'Amaka Nwankwo', 'Salisu Mohammed', 'Bimbo Ogundimu', 'Nasir Ahmad',
  'Chidinma Okechukwu', 'Garba Abubakar'
];

// Locations
const locations = ['Lagos', 'Abuja', 'Enugu', 'Port Harcourt', 'Ibadan', 'Kano'];

// Status options for different tabs
const statusOptions = {
  ongoing: ['In Progress'],
  completed: ['Completed'],
  newRequests: null,
  scheduled: ['Scheduled'],
  cancelled: ['Cancelled'],
  pending: ['Pending']
};

// Generate random date within the last 2 years
function getRandomDate() {
  const start = new Date(2023, 0, 1);
  const end = new Date(2023, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

// Generate random time
function getRandomTime() {
  const hours = Math.floor(Math.random() * 12) + 1;
  const period = Math.random() > 0.5 ? 'AM' : 'PM';
  return `${hours}:00 ${period}`;
}

// Generate random price in Naira
function getRandomPrice() {
  return `₦${Math.floor(Math.random() * 15000) + 5000}`;
}

// Generate random rating
function getRandomRating() {
  const rating = (Math.random() * 1 + 4).toFixed(1);
  const reviews = Math.floor(Math.random() * 50) + 10;
  return `${rating} (${reviews} reviews)`;
}

// Generate random phone number
function getRandomPhone() {
  return `0803 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`;
}

// Generate a single job
function generateJob(tab) {
  const jobTitles = Object.keys(jobTypes);
  const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
  const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
  const date = getRandomDate();
  const time = getRandomTime();
  const price = getRandomPrice();
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  const job = {
    title,
    customer: customerName,
    date,
    time,
    category: jobTypes[title],
    jobDetails: {
      dateTime: `${date}, ${time}`,
      agreedPrice: price,
      jobDescription: `Detailed description for ${title}. ${tab === 'newRequests' ? 'This is a new request awaiting response.' : tab === 'ongoing' ? 'This job is currently in progress.' : 'This job has been completed successfully.'}`,
      attachedPhotos: [
        "https://images.pexels.com/photos/5076460/pexels-photo-5076460.jpeg",
        "https://images.pexels.com/photos/271633/pexels-photo-271633.jpeg",
        "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg"
      ],
      jobLocation: {
        address: "23 Adeyemi Street, Yaba, Lagos. Near Yaba Tech Main Gate"
      },
      customerDetails: {
        image: "/img/avatar1.jpg",
        name: customerName,
        rating: getRandomRating(),
        phoneNumber: getRandomPhone(),
        email: `${customerName.toLowerCase().replace(' ', '.')}@gmail.com`,
        location: location
      }
    },
    tab
  };

  // Add status for tabs that have defined statuses
  if (statusOptions[tab]) {
    job.status = statusOptions[tab][0];
    job.jobDetails.updates = [
      `Job was ${tab} on 6/30/2025`,
      `Job status: ${statusOptions[tab][0]}`
    ];
  }

  return job;
}

// Generate jobs for all tabs
function generateArtisanJobs() {
  const artisanJobs = [];
  const tabs = ['ongoing', 'completed', 'newRequests', 'scheduled', 'cancelled', 'pending'];
  
  tabs.forEach(tab => {
    for (let i = 0; i < 50; i++) {
      artisanJobs.push(generateJob(tab));
    }
  });
  
  return artisanJobs;
}

// Generate and save the data
const artisanJobsData = generateArtisanJobs();

// Save to JSON file
fs.writeFileSync('artisan-jobs.json', JSON.stringify(artisanJobsData, null, 2));

console.log('Artisan jobs data generated successfully!');
console.log(`Total jobs created: ${artisanJobsData.length}`);
console.log('Jobs per tab:');
console.log(`- Ongoing: 50`);
console.log(`- Completed: 50`);
console.log(`- New Requests: 50`);
console.log(`- Scheduled: 50`);
console.log(`- Cancelled: 50`);
console.log(`- Pending: 50`);

// Display sample data structure
console.log('\nSample job structure:');
console.log(JSON.stringify(artisanJobsData[0], null, 2));