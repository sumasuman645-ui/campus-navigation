/**
 * Campus Compass - Digital Twin Campus Dataset & Pathway Graph
 * Real university campus layout with exact landmarks from reference map:
 * Gates, SAC, COE, Admin, OAT, Cafe, Parking, Laboratories, Hostels,
 * Health Centre, Auditorium, Academic Blocks (A, B, C), Mess, Sports Area, Library.
 */

const CAMPUS_DATA = {
  name: "National Institute of Science & Technology - North Campus",
  tagline: "Futuristic Campus Digital Twin & Smart Navigation System",
  bounds: { width: 1200, height: 850 },
  
  // Categorized campus locations
  locations: [
    // Gates
    {
      id: "gate_1",
      name: "Main Gate (Gate 1)",
      shortCode: "G1",
      category: "gates",
      nodeId: "n_gate1",
      x: 600,
      y: 800,
      width: 90,
      height: 40,
      type: "gate",
      description: "South ceremonial entrance from University Avenue. Visitor check-in, EV shuttle terminal, and automated security barrier.",
      hours: "24 Hours (Open)",
      isOpen: true,
      accessible: true,
      amenities: ["Security Kiosk", "EV Shuttle Stop", "Visitor Parking", "Bicycle Share", "Automated Boom Barrier"],
      emergency: { isExit: true, guardPost: true },
      popular: true,
      image: "gate1.jpg"
    },
    {
      id: "gate_2",
      name: "North Gate (Gate 2)",
      shortCode: "G2",
      category: "gates",
      nodeId: "n_gate2",
      x: 600,
      y: 40,
      width: 90,
      height: 35,
      type: "gate",
      description: "Direct pedestrian & rapid-transit access connecting campus to the Metro Station and Innovation Highway.",
      hours: "05:00 AM - 11:30 PM",
      isOpen: true,
      accessible: true,
      amenities: ["Metro Footbridge", "Smart Turnstiles", "Security Booth", "E-Rickshaw Bay"],
      emergency: { isExit: true, guardPost: true },
      popular: false
    },
    {
      id: "gate_3",
      name: "West Gate (Gate 3)",
      shortCode: "G3",
      category: "gates",
      nodeId: "n_gate3",
      x: 40,
      y: 420,
      width: 40,
      height: 80,
      type: "gate",
      description: "West perimeter gate providing immediate vehicle access to the Sports Stadium, Auditorium, and Gymnasium.",
      hours: "06:00 AM - 10:00 PM",
      isOpen: true,
      accessible: true,
      amenities: ["Sports Arena Entrance", "Heavy Vehicle Access", "Security Office"],
      emergency: { isExit: true, guardPost: true },
      popular: false
    },
    {
      id: "gate_4",
      name: "Hostel Gate (Gate 4)",
      shortCode: "G4",
      category: "gates",
      nodeId: "n_gate4",
      x: 1150,
      y: 420,
      width: 40,
      height: 80,
      type: "gate",
      description: "East residential security checkpost restricted to students, residential faculty, and authorized delivery staff.",
      hours: "06:00 AM - 11:00 PM (Biometric post 10 PM)",
      isOpen: true,
      accessible: true,
      amenities: ["Biometric Verification", "Parcel Delivery Locker", "Security Guard Post"],
      emergency: { isExit: true, guardPost: true },
      popular: false
    },

    // Administrative & Central Landmark
    {
      id: "admin",
      name: "Administrative Block (Admin)",
      shortCode: "ADM",
      category: "admin",
      nodeId: "n_admin",
      x: 600,
      y: 650,
      width: 140,
      height: 80,
      type: "building",
      floors: 4,
      description: "Grand central administrative complex housing the Vice-Chancellor's Secretariat, Registrar, Academic Dean, Student Affairs, and Finance counters.",
      hours: "09:00 AM - 05:30 PM (Mon - Sat)",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      hasElevator: true,
      amenities: ["Fee Payment Kiosks", "Admissions Helpdesk", "Dean Office", "ATM (HDFC / SBI)", "Accessible Ramp & Lift", "Information Desk"],
      emergency: { hasDefib: true, assemblyPointNearby: "assembly_a" },
      popular: true
    },
    {
      id: "coe",
      name: "Center of Excellence (COE)",
      shortCode: "COE",
      category: "labs",
      nodeId: "n_coe",
      x: 360,
      y: 610,
      width: 130,
      height: 75,
      type: "building",
      floors: 3,
      description: "Advanced multidisciplinary research hub dedicated to Artificial Intelligence, Robotics, Quantum Computing, and AR/VR Virtual Reality simulators.",
      hours: "08:00 AM - 10:00 PM",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      hasElevator: true,
      amenities: ["GPU Supercomputing Cluster", "Cleanroom", "Robotics Arena", "Brain-Computer Interface Lab", "Collaborative Lounge"],
      emergency: { hasDefib: false, assemblyPointNearby: "assembly_a" },
      popular: true
    },
    {
      id: "auditorium",
      name: "Dr. APJ Abdul Kalam Central Auditorium",
      shortCode: "AUD",
      category: "academic",
      nodeId: "n_auditorium",
      x: 200,
      y: 530,
      width: 140,
      height: 100,
      type: "auditorium",
      floors: 2,
      description: "State-of-the-art 1,500-seat acoustic auditorium hosting convocations, national symposiums, cultural nights, and industry keynotes.",
      hours: "08:30 AM - 09:30 PM (Event Dependent)",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      hasElevator: true,
      amenities: ["Tiered Seating", "Green Rooms", "Acoustic Stage", "Assistive Listening System", "Wheelchair Designated Seating"],
      emergency: { emergencyExits: 6, hasDefib: true, assemblyPointNearby: "assembly_b" },
      popular: true
    },

    // Student Activity Centre & Cultural
    {
      id: "sac",
      name: "Student Activity Centre (SAC)",
      shortCode: "SAC",
      category: "student_life",
      nodeId: "n_sac",
      x: 820,
      y: 590,
      width: 130,
      height: 85,
      type: "building",
      floors: 3,
      description: "Vibrant epicentre of student life: Student Council chambers, Music & Dance studios, Photography darkroom, Coding clubs, and Indoor Games.",
      hours: "07:00 AM - 11:00 PM",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      hasElevator: true,
      amenities: ["Music Jam Room", "Dance Studio", "Hackerspace", "Indoor Billiards & TT", "Student Union Lounge", "Snack Vending Machines"],
      emergency: { hasDefib: true, assemblyPointNearby: "assembly_a" },
      popular: true
    },
    {
      id: "oat",
      name: "Open Air Theatre (OAT)",
      shortCode: "OAT",
      category: "student_life",
      nodeId: "n_oat",
      x: 600,
      y: 470,
      width: 120,
      height: 90,
      type: "amphitheatre",
      floors: 1,
      description: "Greek-inspired stepped amphitheatre seating 2,000 spectators under the stars. Venue for Annual Tech Fests, rock shows, and film club screenings.",
      hours: "Open 24x7 (Performances as scheduled)",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      amenities: ["Open Tier Seating", "Central Acoustic Stage", "Lush Lawn Perimeter", "Night Spotlights"],
      emergency: { assemblyPointNearby: "assembly_a" },
      popular: true
    },

    // Food, Dining & Mess
    {
      id: "cafe",
      name: "Central Campus Cafe & Food Court",
      shortCode: "CAF",
      category: "food",
      nodeId: "n_cafe",
      x: 750,
      y: 460,
      width: 110,
      height: 70,
      type: "cafe",
      floors: 2,
      description: "Favorite student hangout offering artisan coffee, fresh sandwiches, smoothies, dosa counter, and an open-air umbrella patio with high-speed campus Wi-Fi.",
      hours: "07:30 AM - 11:30 PM",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      amenities: ["Artisan Espresso Bar", "Fast-food Kiosks", "Outdoor Patio Seating", "Charging Points", "Juice Bar"],
      emergency: { fireExtinguishers: 4 },
      popular: true
    },
    {
      id: "mess",
      name: "Central Dining Hall & Student Mess",
      shortCode: "MSS",
      category: "food",
      nodeId: "n_mess",
      x: 950,
      y: 440,
      width: 140,
      height: 95,
      type: "mess",
      floors: 2,
      description: "Two-story multi-cuisine student dining hall serving breakfast, lunch, high tea, and dinner. North and South dining wings catering to 1,800 students simultaneously.",
      hours: "Breakfast: 07:30-09:30 | Lunch: 12:00-14:30 | Dinner: 19:30-22:00",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      hasElevator: true,
      amenities: ["North & South Indian Counters", "Salad Bar", "Filtered Water Dispensers", "Hand Wash Stations", "Special Dietary Options"],
      emergency: { fireSafetySystem: true, emergencyDoors: 4 },
      popular: true
    },

    // Academic Blocks
    {
      id: "ab_a",
      name: "Academic Block A (Engineering & Computing)",
      shortCode: "AB-A",
      category: "academic",
      nodeId: "n_ab_a",
      x: 420,
      y: 350,
      width: 130,
      height: 90,
      type: "academic",
      floors: 4,
      hasIndoorMap: true,
      description: "Department of Computer Science & Artificial Intelligence, Software Engineering, and Cybernetics. Includes Smart Lecture Halls 101-404.",
      hours: "08:00 AM - 09:00 PM",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      hasElevator: true,
      amenities: ["Smart Classrooms", "Faculty Cabins", "Elevators A & B", "Accessible Restrooms on Every Floor", "Water Coolers", "Wi-Fi 6 Mesh"],
      emergency: { hasDefib: true, fireStairs: 2, assemblyPointNearby: "assembly_a" },
      popular: true
    },
    {
      id: "ab_b",
      name: "Academic Block B (Applied Sciences & Electronics)",
      shortCode: "AB-B",
      category: "academic",
      nodeId: "n_ab_b",
      x: 600,
      y: 280,
      width: 130,
      height: 85,
      type: "academic",
      floors: 4,
      description: "Houses Electronics & Communication, VLSI Design, Applied Physics, and Advanced Mathematical Modeling laboratories.",
      hours: "08:00 AM - 08:30 PM",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      hasElevator: true,
      amenities: ["Lecture Halls 201-220", "VLSI Research Center", "Faculty Offices", "Elevator", "Restrooms"],
      emergency: { fireStairs: 2, assemblyPointNearby: "assembly_a" },
      popular: false
    },
    {
      id: "ab_c",
      name: "Academic Block C (Design, Humanities & Mgmt)",
      shortCode: "AB-C",
      category: "academic",
      nodeId: "n_ab_c",
      x: 770,
      y: 320,
      width: 120,
      height: 80,
      type: "academic",
      floors: 3,
      description: "Home to the School of Design, Human-Centered Interaction, Industrial Architecture, and Department of Management Studies.",
      hours: "08:30 AM - 07:30 PM",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      hasElevator: true,
      amenities: ["Design Studios", "UX Testing Lab", "Seminar Halls", "Exhibition Gallery", "Accessible Facilities"],
      emergency: { fireStairs: 2, assemblyPointNearby: "assembly_a" },
      popular: false
    },

    // Central Library
    {
      id: "library",
      name: "Central Knowledge Resource Centre (Library)",
      shortCode: "LIB",
      category: "academic",
      nodeId: "n_library",
      x: 580,
      y: 160,
      width: 150,
      height: 90,
      type: "library",
      floors: 5,
      hasIndoorMap: true,
      description: "Flagship 5-story glass dome digital library holding 180,000 volumes, 400+ online database access terminals, 24x7 silent study pods, and research carrels.",
      hours: "08:00 AM - Midnight (Reading Room 24/7)",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      hasElevator: true,
      amenities: ["24x7 Quiet Study Pods", "Digital Archive", "Book Issue Kiosks", "Research Cubicles", "Coffee Vending Corner", "High-Speed Scanners"],
      emergency: { hasDefib: true, emergencyExits: 4, assemblyPointNearby: "assembly_a" },
      popular: true
    },

    // Laboratories Complex
    {
      id: "labs_computing",
      name: "Advanced Computing & AI Laboratories",
      shortCode: "LAB-CS",
      category: "labs",
      nodeId: "n_labs_comp",
      x: 380,
      y: 220,
      width: 120,
      height: 75,
      type: "lab",
      floors: 2,
      description: "High-spec workstations with NVIDIA A100 GPU servers for deep learning, cybersecurity war-room simulations, and cloud virtualization testing.",
      hours: "08:00 AM - 10:00 PM",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      amenities: ["High-Performance Workstations", "Server Room", "Dual Monitored Desks", "Gigabit LAN"],
      emergency: { gasSuppressionSystem: true, assemblyPointNearby: "assembly_b" },
      popular: true
    },
    {
      id: "labs_fablab",
      name: "Mechanical Workshop & Maker FabLab",
      shortCode: "FAB",
      category: "labs",
      nodeId: "n_fablab",
      x: 230,
      y: 320,
      width: 120,
      height: 85,
      type: "lab",
      floors: 2,
      description: "Hands-on rapid prototyping lab equipped with industrial 5-axis CNC mills, laser cutters, composite 3D printers, and automotive chassis test rigs.",
      hours: "08:30 AM - 07:00 PM",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      amenities: ["Industrial 3D Printers", "CNC Mills", "Welding Bay", "Safety Eyewash Stations"],
      emergency: { fireSafetySystem: true, industrialSafetyGear: true },
      popular: false
    },
    {
      id: "labs_biotech",
      name: "Biotechnology & Environmental Sciences Lab",
      shortCode: "LAB-BIO",
      category: "labs",
      nodeId: "n_biotech",
      x: 770,
      y: 200,
      width: 110,
      height: 70,
      type: "lab",
      floors: 3,
      description: "Biosafety Level-2 research facility researching genetic engineering, water purification nanofiltration, and sustainable biomaterials.",
      hours: "09:00 AM - 07:00 PM",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      amenities: ["BSL-2 Cleanroom", "Centrifuges & PCR", "Chemical Storage Vault", "Fume Hoods"],
      emergency: { chemicalShower: true, eyewashStation: true },
      popular: false
    },

    // Health Centre (Medical 24x7)
    {
      id: "health_centre",
      name: "Campus Health & Wellness Centre (24x7)",
      shortCode: "HC",
      category: "medical",
      nodeId: "n_health",
      x: 950,
      y: 620,
      width: 120,
      height: 75,
      type: "medical",
      floors: 2,
      description: "24-Hour full-service medical clinic with licensed duty physicians, trauma emergency room, inpatient observation beds, pharmacy, and ambulance fleet.",
      hours: "24 Hours (Emergency Active)",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      hasElevator: true,
      amenities: ["24x7 Emergency Room", "Pharmacy", "Doctor Consultation", "Ambulance Bay", "Pathology Lab", "Wheelchair Fleet"],
      emergency: { isPrimaryMedical: true, phone: "+91 11 2659-1111", ambulanceOnCall: true },
      popular: true
    },

    // Residential & Hostels
    {
      id: "hostel_b1",
      name: "Boys Hostel 1 (Aravali Hall)",
      shortCode: "BH-1",
      category: "hostels",
      nodeId: "n_hostel_b1",
      x: 1040,
      y: 190,
      width: 110,
      height: 75,
      type: "hostel",
      floors: 4,
      description: "Men's undergraduate residential block with central landscaped courtyard, badminton court, reading room, and laundry facilities.",
      hours: "24 Hours (Curfew 10:30 PM)",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      amenities: ["Courtyard Badminton", "Common TV Room", "RO Purifiers", "Biometric Entry", "Laundromat"],
      emergency: { wardenPhone: "+91 98112-40011" },
      popular: false
    },
    {
      id: "hostel_b2",
      name: "Boys Hostel 2 (Nilgiri Hall)",
      shortCode: "BH-2",
      category: "hostels",
      nodeId: "n_hostel_b2",
      x: 1040,
      y: 290,
      width: 110,
      height: 75,
      type: "hostel",
      floors: 4,
      description: "Senior men's residential hall equipped with single occupancy air-cooled rooms, gym annex, and high-speed Wi-Fi network.",
      hours: "24 Hours",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      amenities: ["Indoor Mini-Gym", "Study Library", "Table Tennis", "Cycle Parking"],
      emergency: { wardenPhone: "+91 98112-40012" },
      popular: false
    },
    {
      id: "hostel_g1",
      name: "Girls Hostel 1 (Shivalik Hall)",
      shortCode: "GH-1",
      category: "hostels",
      nodeId: "n_hostel_g1",
      x: 1040,
      y: 570,
      width: 110,
      height: 75,
      type: "hostel",
      floors: 4,
      description: "Women's residential hall featuring 24x7 security surveillance, private reading halls, recreational garden, and round-the-clock power backup.",
      hours: "24 Hours (Security In-check 10:00 PM)",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      hasElevator: true,
      amenities: ["Private Garden", "Fitness Room", "Sanitary Dispensers", "24x7 Female Guard Post", "Quiet Reading Wing"],
      emergency: { wardenPhone: "+91 98112-40021", emergencyPanicButtons: true },
      popular: false
    },
    {
      id: "hostel_g2",
      name: "Girls Hostel 2 (Vindhya Hall)",
      shortCode: "GH-2",
      category: "hostels",
      nodeId: "n_hostel_g2",
      x: 1040,
      y: 670,
      width: 110,
      height: 75,
      type: "hostel",
      floors: 4,
      description: "Modern women's residential hall with attached bathroom suites, solar water heating, music room, and yoga deck.",
      hours: "24 Hours (Security In-check 10:00 PM)",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      hasElevator: true,
      amenities: ["Solar Water Heating", "Yoga Deck", "Music Practice Room", "High-speed Wi-Fi"],
      emergency: { wardenPhone: "+91 98112-40022" },
      popular: false
    },

    // Sports & Recreation
    {
      id: "sports_complex",
      name: "Indoor Sports Complex & Gymnasium",
      shortCode: "SPO",
      category: "sports",
      nodeId: "n_sports",
      x: 140,
      y: 380,
      width: 120,
      height: 90,
      type: "sports",
      floors: 2,
      description: "Comprehensive sports arena: Olympic wooden badminton courts, indoor basketball court, squash courts, weight training gym, and martial arts dojo.",
      hours: "06:00 AM - 10:00 PM",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      amenities: ["4 Badminton Courts", "Basketball Arena", "Olympic Weight Gym", "Locker Rooms & Showers", "Physiotherapy Room"],
      emergency: { firstAidRoom: true, hasDefib: true },
      popular: true
    },
    {
      id: "cricket_ground",
      name: "Cricket & Football Pavilion Stadium",
      shortCode: "STAD",
      category: "sports",
      nodeId: "n_ground",
      x: 170,
      y: 170,
      width: 160,
      height: 120,
      type: "stadium",
      floors: 1,
      description: "Full-scale athletic stadium with natural turf football pitch, international standard cricket pavilion, and 400m synthetic 8-lane running track.",
      hours: "05:30 AM - 09:30 PM (Floodlit until 10 PM)",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      amenities: ["400m Synthetic Track", "Floodlights", "Spectator Grandstand (3,000 capacity)", "Commentary Box"],
      emergency: { assemblyPointNearby: "assembly_b" },
      popular: true
    },
    {
      id: "tennis_courts",
      name: "Lawn Tennis & Outdoor Courts",
      shortCode: "TEN",
      category: "sports",
      nodeId: "n_tennis",
      x: 320,
      y: 90,
      width: 100,
      height: 65,
      type: "sports",
      floors: 1,
      description: "Three floodlit synthetic acrylic tennis courts and adjacent volleyball and synthetic basketball outdoor courts.",
      hours: "06:00 AM - 09:00 PM",
      isOpen: true,
      accessible: true,
      hasRamp: true,
      amenities: ["3 Floodlit Courts", "Practice Wall", "Equipment Locker"],
      emergency: {},
      popular: false
    },

    // Parking Areas
    {
      id: "parking_north",
      name: "North Staff & Faculty Parking Lot",
      shortCode: "PKG-N",
      category: "parking",
      nodeId: "n_pkg_north",
      x: 760,
      y: 60,
      width: 130,
      height: 60,
      type: "parking",
      description: "Covered solar-canopy parking lot reserved for faculty cars, campus service vans, and 12 fast EV charging stations.",
      hours: "24 Hours",
      isOpen: true,
      accessible: true,
      amenities: ["12 DC Fast EV Chargers", "Solar Canopy", "Automated RFID Entry", "Accessible Parking Bays"],
      emergency: {},
      popular: false
    },
    {
      id: "parking_visitor",
      name: "Visitor & Main Gate Parking Area",
      shortCode: "PKG-V",
      category: "parking",
      nodeId: "n_pkg_visitor",
      x: 440,
      y: 750,
      width: 120,
      height: 50,
      type: "parking",
      description: "Designated visitor automobile parking with valet assistance during major convocations, festivals, and campus placement drives.",
      hours: "06:00 AM - Midnight",
      isOpen: true,
      accessible: true,
      amenities: ["Visitor Passes", "Security Monitoring", "EV Charging Point", "Designated Disability Bays"],
      emergency: {},
      popular: false
    },
    {
      id: "parking_student",
      name: "Student Two-Wheeler & Bicycle Bay",
      shortCode: "PKG-S",
      category: "parking",
      nodeId: "n_pkg_student",
      x: 770,
      y: 730,
      width: 130,
      height: 50,
      type: "parking",
      description: "Expansive shaded parking bays accommodating over 800 motorbikes, electric scooters, and automated dock bicycle rentals.",
      hours: "24 Hours",
      isOpen: true,
      accessible: true,
      amenities: ["E-Scooter Charging Docks", "Smart Lock Bicycle Racks", "Tire Air Refill Pump"],
      emergency: {},
      popular: false
    },

    // Security & Safe Assembly Areas
    {
      id: "security_hq",
      name: "Security Central Command & CCTV Post",
      shortCode: "SEC",
      category: "medical",
      nodeId: "n_security",
      x: 520,
      y: 770,
      width: 60,
      height: 45,
      type: "security",
      description: "24x7 Central Campus Security Headquarters. Monitors 350+ campus CCTV streams, manages emergency SOS dispatch, and lost & found office.",
      hours: "24 Hours (Emergency Active)",
      isOpen: true,
      accessible: true,
      amenities: ["Lost & Found", "Emergency SOS Dispatch", "Visitor ID Registration", "Security Patrol Hub"],
      emergency: { isSecurityHQ: true, directLine: "1800-CAMPUS-SAFE" },
      popular: false
    },
    {
      id: "assembly_a",
      name: "Safe Assembly Area A (Central Great Lawn)",
      shortCode: "SAFE-A",
      category: "emergency",
      nodeId: "n_assembly_a",
      x: 600,
      y: 570,
      width: 100,
      height: 50,
      type: "assembly",
      description: "Primary wide-open emergency muster zone designated for rapid evacuation from Academic Blocks, Admin, SAC, and Central Library.",
      hours: "Always Accessible (24x7)",
      isOpen: true,
      accessible: true,
      amenities: ["Emergency Megaphone Post", "First Aid Muster Kit", "Solar Emergency Lighting", "Zero Overhead Obstacles"],
      emergency: { isAssemblyArea: true, capacity: 5000 },
      popular: false
    },
    {
      id: "assembly_b",
      name: "Safe Assembly Area B (Sports Field Arena)",
      shortCode: "SAFE-B",
      category: "emergency",
      nodeId: "n_assembly_b",
      x: 230,
      y: 240,
      width: 100,
      height: 50,
      type: "assembly",
      description: "Secondary large-scale emergency muster point serving the Auditorium, Sports Complex, FabLab, and Computing Lab blocks.",
      hours: "Always Accessible (24x7)",
      isOpen: true,
      accessible: true,
      amenities: ["Wide Evacuation Gates", "Helipad Capability", "Emergency Water Station"],
      emergency: { isAssemblyArea: true, capacity: 8000 },
      popular: false
    }
  ],

  // Navigation Pathway Network Graph (Nodes and Edges for Dijkstra routing)
  graph: {
    nodes: {
      // Gate Nodes
      n_gate1: { id: "n_gate1", x: 600, y: 790, label: "Main Gate 1 Plaza", buildingId: "gate_1" },
      n_gate2: { id: "n_gate2", x: 600, y: 65, label: "North Gate 2 Metro Link", buildingId: "gate_2" },
      n_gate3: { id: "n_gate3", x: 75, y: 420, label: "West Gate 3 Entrance", buildingId: "gate_3" },
      n_gate4: { id: "n_gate4", x: 1120, y: 420, label: "Hostel Gate 4 Post", buildingId: "gate_4" },

      // Building Entrance Nodes
      n_admin: { id: "n_admin", x: 600, y: 650, label: "Admin Block Main Entrance (Ramp)", buildingId: "admin" },
      n_coe: { id: "n_coe", x: 390, y: 620, label: "COE Research Atrium", buildingId: "coe" },
      n_auditorium: { id: "n_auditorium", x: 230, y: 530, label: "Auditorium Grand Foyer", buildingId: "auditorium" },
      n_sac: { id: "n_sac", x: 820, y: 590, label: "SAC Student Plaza", buildingId: "sac" },
      n_oat: { id: "n_oat", x: 600, y: 470, label: "OAT Amphitheatre Steps", buildingId: "oat" },
      n_cafe: { id: "n_cafe", x: 750, y: 460, label: "Central Cafe Patio Entrance", buildingId: "cafe" },
      n_mess: { id: "n_mess", x: 950, y: 440, label: "Dining Hall Main Portico", buildingId: "mess" },
      n_ab_a: { id: "n_ab_a", x: 440, y: 350, label: "Academic Block A Portico", buildingId: "ab_a" },
      n_ab_b: { id: "n_ab_b", x: 600, y: 280, label: "Academic Block B Glass Foyer", buildingId: "ab_b" },
      n_ab_c: { id: "n_ab_c", x: 770, y: 320, label: "Academic Block C Design Atrium", buildingId: "ab_c" },
      n_library: { id: "n_library", x: 600, y: 175, label: "Library Grand Portico & Ramp", buildingId: "library" },
      n_labs_comp: { id: "n_labs_comp", x: 390, y: 220, label: "Computing Labs Entrance", buildingId: "labs_computing" },
      n_fablab: { id: "n_fablab", x: 250, y: 330, label: "FabLab Workshop Bay", buildingId: "labs_fablab" },
      n_biotech: { id: "n_biotech", x: 770, y: 200, label: "Biotech Science Portico", buildingId: "labs_biotech" },
      n_health: { id: "n_health", x: 950, y: 630, label: "Health Centre Emergency Bay", buildingId: "health_centre" },
      n_hostel_b1: { id: "n_hostel_b1", x: 1040, y: 190, label: "Aravali Boys Hostel 1", buildingId: "hostel_b1" },
      n_hostel_b2: { id: "n_hostel_b2", x: 1040, y: 290, label: "Nilgiri Boys Hostel 2", buildingId: "hostel_b2" },
      n_hostel_g1: { id: "n_hostel_g1", x: 1040, y: 570, label: "Shivalik Girls Hostel 1", buildingId: "hostel_g1" },
      n_hostel_g2: { id: "n_hostel_g2", x: 1040, y: 670, label: "Vindhya Girls Hostel 2", buildingId: "hostel_g2" },
      n_sports: { id: "n_sports", x: 170, y: 390, label: "Sports Complex Foyer", buildingId: "sports_complex" },
      n_ground: { id: "n_ground", x: 230, y: 180, label: "Pavilion Stadium Entrance", buildingId: "cricket_ground" },
      n_tennis: { id: "n_tennis", x: 340, y: 95, label: "Tennis Court Gate", buildingId: "tennis_courts" },
      n_pkg_north: { id: "n_pkg_north", x: 760, y: 75, label: "North Parking Gate", buildingId: "parking_north" },
      n_pkg_visitor: { id: "n_pkg_visitor", x: 460, y: 740, label: "Visitor Parking Gate", buildingId: "parking_visitor" },
      n_pkg_student: { id: "n_pkg_student", x: 770, y: 720, label: "Student Two-Wheeler Bay", buildingId: "parking_student" },
      n_security: { id: "n_security", x: 535, y: 760, label: "Security Control Post", buildingId: "security_hq" },
      n_assembly_a: { id: "n_assembly_a", x: 600, y: 565, label: "Central Assembly Point A", buildingId: "assembly_a" },
      n_assembly_b: { id: "n_assembly_b", x: 230, y: 250, label: "Sports Assembly Point B", buildingId: "assembly_b" },

      // Strategic Avenue Junctions & Pathway Crossings
      j_south_1: { id: "j_south_1", x: 600, y: 720, label: "Ceremonial South Avenue Crossing" },
      j_south_west: { id: "j_south_west", x: 440, y: 700, label: "South-West Boulevard Split" },
      j_south_east: { id: "j_south_east", x: 760, y: 690, label: "South-East Promenade Split" },
      j_admin_west: { id: "j_admin_west", x: 480, y: 640, label: "Admin-COE Connector" },
      j_admin_east: { id: "j_admin_east", x: 720, y: 630, label: "Admin-SAC Promenade" },
      j_central_plaza: { id: "j_central_plaza", x: 600, y: 530, label: "Grand Central Campus Plaza" },
      j_oat_west: { id: "j_oat_west", x: 480, y: 470, label: "OAT West Walkway" },
      j_oat_east: { id: "j_oat_east", x: 700, y: 470, label: "Cafe Terrace Boulevard" },
      j_academic_cross: { id: "j_academic_cross", x: 600, y: 370, label: "Central Academic Quad Intersection" },
      j_ab_a_hub: { id: "j_ab_a_hub", x: 460, y: 410, label: "Engineering Quad Junction" },
      j_west_avenue: { id: "j_west_avenue", x: 190, y: 440, label: "Auditorium & Stadium Crossway" },
      j_west_north: { id: "j_west_north", x: 230, y: 300, label: "Maker & Stadium Link" },
      j_north_academic: { id: "j_north_academic", x: 600, y: 220, label: "Library Forecourt Circle" },
      j_north_west: { id: "j_north_west", x: 410, y: 150, label: "Computing Quad - Tennis Link" },
      j_north_east: { id: "j_north_east", x: 760, y: 150, label: "Biotech & North Parking Concourse" },
      j_north_gate_hub: { id: "j_north_gate_hub", x: 600, y: 110, label: "North Metro Transit Promenade" },
      j_east_dining: { id: "j_east_dining", x: 890, y: 460, label: "Dining Walkway Hub" },
      j_east_hostel_south: { id: "j_east_hostel_south", x: 990, y: 610, label: "Girls Hostel Access Quad" },
      j_east_hostel_north: { id: "j_east_hostel_north", x: 990, y: 250, label: "Boys Hostel Access Quad" },
      j_east_gate_link: { id: "j_east_gate_link", x: 1080, y: 420, label: "East Gate 4 Perimeter Road" }
    },

    // Edges (Weighted campus pathways)
    // accessible: true (ramped, wide, step-free) | false (stairs/steep curbs)
    // sheltered: true (covered colonnades)
    // wellLit: true (illuminated for night safety)
    // congestion: 1.0 (clear) to 2.5 (heavy rush)
    // status: 'open' | 'closed' (for temporary path closures)
    edges: [
      // South Ceremonial Avenue
      { from: "n_gate1", to: "j_south_1", distance: 75, accessible: true, sheltered: false, wellLit: true, congestion: 1.2, name: "Main University Boulevard" },
      { from: "j_south_1", to: "n_admin", distance: 70, accessible: true, sheltered: true, wellLit: true, congestion: 1.3, name: "Ceremonial Admin Colonnade" },
      { from: "j_south_1", to: "n_security", distance: 70, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Security Check Road" },
      { from: "j_south_1", to: "j_south_west", distance: 160, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "South-West Perimeter Avenue" },
      { from: "j_south_1", to: "j_south_east", distance: 165, accessible: true, sheltered: false, wellLit: true, congestion: 1.1, name: "South-East Perimeter Avenue" },
      { from: "j_south_west", to: "n_pkg_visitor", distance: 45, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Visitor Parking Lane" },
      { from: "j_south_east", to: "n_pkg_student", distance: 35, accessible: true, sheltered: false, wellLit: true, congestion: 1.4, name: "Two-Wheeler Access Path" },

      // Admin & Center of Excellence Links
      { from: "n_admin", to: "j_admin_west", distance: 120, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Admin West Covered Walkway" },
      { from: "j_admin_west", to: "n_coe", distance: 95, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "COE Research Path" },
      { from: "j_admin_west", to: "j_south_west", distance: 80, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "South-West Connector" },
      { from: "n_admin", to: "j_admin_east", distance: 120, accessible: true, sheltered: true, wellLit: true, congestion: 1.2, name: "Admin East Colonnade" },
      { from: "j_admin_east", to: "n_sac", distance: 105, accessible: true, sheltered: true, wellLit: true, congestion: 1.3, name: "SAC Promenade" },
      { from: "j_admin_east", to: "j_south_east", distance: 70, accessible: true, sheltered: false, wellLit: true, congestion: 1.1, name: "South-East Promenade" },

      // Central Plaza & Assembly Area A
      { from: "n_admin", to: "n_assembly_a", distance: 85, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Great Lawn South Walkway" },
      { from: "n_assembly_a", to: "j_central_plaza", distance: 40, accessible: true, sheltered: false, wellLit: true, congestion: 1.1, name: "Central Plaza Walk" },
      { from: "j_central_plaza", to: "n_oat", distance: 60, accessible: false, hasStairs: true, sheltered: false, wellLit: true, congestion: 1.5, name: "OAT Amphitheatre Steps (Stairs)", stairsWarning: "Steep amphitheatre stone stairs" },
      { from: "j_central_plaza", to: "j_oat_west", distance: 135, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "OAT West Accessible Rampway" },
      { from: "j_central_plaza", to: "j_oat_east", distance: 115, accessible: true, sheltered: true, wellLit: true, congestion: 1.6, name: "Cafe East Walkway" },
      { from: "j_admin_west", to: "j_oat_west", distance: 170, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "COE-OAT Garden Path" },
      { from: "j_admin_east", to: "j_oat_east", distance: 160, accessible: true, sheltered: false, wellLit: true, congestion: 1.4, name: "SAC-Cafe Tree Promenade" },

      // Cafe, SAC & Mess
      { from: "j_oat_east", to: "n_cafe", distance: 55, accessible: true, sheltered: false, wellLit: true, congestion: 1.8, name: "Central Cafe Patio" },
      { from: "j_oat_east", to: "j_east_dining", distance: 190, accessible: true, sheltered: true, wellLit: true, congestion: 1.7, name: "Student Dining Boulevard" },
      { from: "n_sac", to: "j_east_dining", distance: 150, accessible: true, sheltered: false, wellLit: true, congestion: 1.3, name: "SAC-Mess Shaded Walkway" },
      { from: "j_east_dining", to: "n_mess", distance: 65, accessible: true, sheltered: true, wellLit: true, congestion: 2.2, name: "Dining Hall Portico" },

      // West Campus (Auditorium & Sports)
      { from: "j_admin_west", to: "n_auditorium", distance: 270, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Auditorium South Avenue" },
      { from: "n_auditorium", to: "j_west_avenue", distance: 95, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Auditorium Concourse" },
      { from: "j_west_avenue", to: "n_gate3", distance: 120, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "West Gate 3 Access Road" },
      { from: "j_west_avenue", to: "n_sports", distance: 55, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Sports Arena Rampway" },
      { from: "j_west_avenue", to: "j_west_north", distance: 145, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Athletics Boulevard" },
      { from: "j_west_north", to: "n_ground", distance: 120, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Pavilion Stadium Path" },
      { from: "j_west_north", to: "n_assembly_b", distance: 50, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Sports Assembly Field Link" },
      { from: "j_west_north", to: "n_fablab", distance: 35, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Maker FabLab Access Path" },

      // Academic Quad Links (AB-A, AB-B, AB-C)
      { from: "j_oat_west", to: "j_ab_a_hub", distance: 65, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Engineering Quad South" },
      { from: "j_ab_a_hub", to: "n_ab_a", distance: 65, accessible: true, sheltered: true, wellLit: true, congestion: 1.3, name: "Academic Block A Portico" },
      { from: "j_ab_a_hub", to: "j_academic_cross", distance: 145, accessible: true, sheltered: true, wellLit: true, congestion: 1.2, name: "Central Academic Boulevard" },
      { from: "n_oat", to: "j_academic_cross", distance: 100, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "OAT North Garden Path" },
      { from: "j_oat_east", to: "j_academic_cross", distance: 145, accessible: true, sheltered: true, wellLit: true, congestion: 1.4, name: "Cafe-Academic Quadway" },
      { from: "j_academic_cross", to: "n_ab_b", distance: 90, accessible: true, sheltered: true, wellLit: true, congestion: 1.2, name: "Academic Block B Covered Walkway" },
      { from: "j_academic_cross", to: "n_ab_c", distance: 175, accessible: true, sheltered: true, wellLit: true, congestion: 1.1, name: "Design & Humanities Concourse" },
      { from: "j_academic_cross", to: "j_north_academic", distance: 150, accessible: true, sheltered: true, wellLit: true, congestion: 1.3, name: "Library Avenue" },

      // Computing Labs & FabLab connections
      { from: "n_ab_a", to: "n_labs_comp", distance: 140, accessible: true, sheltered: true, wellLit: true, congestion: 1.1, name: "CS Labs Colonnade" },
      { from: "n_ab_a", to: "j_west_north", distance: 215, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Engineering-FabLab Connector" },
      { from: "n_labs_comp", to: "j_north_west", distance: 75, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "North-West Labs Lane" },
      { from: "j_north_west", to: "n_ground", distance: 185, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Stadium North Promenade" },
      { from: "j_north_west", to: "n_tennis", distance: 90, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Tennis Courts Path" },
      { from: "j_north_west", to: "j_north_academic", distance: 200, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Library-Computing Skywalk Path" },

      // Central Library & North Gate (Metro)
      { from: "j_north_academic", to: "n_library", distance: 50, accessible: true, sheltered: true, wellLit: true, congestion: 1.4, name: "Central Library Grand Ramp" },
      { from: "j_north_academic", to: "j_north_gate_hub", distance: 110, accessible: true, sheltered: true, wellLit: true, congestion: 1.5, name: "Metro Transit Spine" },
      { from: "j_north_gate_hub", to: "n_gate2", distance: 45, accessible: true, sheltered: true, wellLit: true, congestion: 1.5, name: "North Gate 2 Turnstile Path" },
      { from: "j_north_gate_hub", to: "n_pkg_north", distance: 165, accessible: true, sheltered: false, wellLit: true, congestion: 1.1, name: "North Faculty Parking Road" },
      { from: "j_north_academic", to: "j_north_east", distance: 175, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Biotech Science Walk" },
      { from: "j_north_east", to: "n_biotech", distance: 55, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Biotech Lab Portico" },
      { from: "j_north_east", to: "n_pkg_north", distance: 90, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Faculty Parking North Link" },

      // Eastern Hostels & Health Centre Zone
      { from: "n_ab_c", to: "j_east_dining", distance: 190, accessible: true, sheltered: false, wellLit: true, congestion: 1.2, name: "Design to Dining Path" },
      { from: "n_sac", to: "n_health", distance: 135, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Health Centre Direct Ramp" },
      { from: "n_health", to: "j_east_hostel_south", distance: 45, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Medical Emergency Lane" },
      { from: "j_east_dining", to: "j_east_hostel_south", distance: 180, accessible: true, sheltered: false, wellLit: true, congestion: 1.2, name: "Girls Hostel South Avenue" },
      { from: "j_east_hostel_south", to: "n_hostel_g1", distance: 65, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Shivalik Hostel Foyer" },
      { from: "j_east_hostel_south", to: "n_hostel_g2", distance: 80, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Vindhya Hostel Foyer" },
      { from: "j_east_dining", to: "j_east_hostel_north", distance: 220, accessible: true, sheltered: false, wellLit: true, congestion: 1.2, name: "Boys Hostel North Avenue" },
      { from: "j_east_hostel_north", to: "n_hostel_b1", distance: 75, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Aravali Hostel Entrance" },
      { from: "j_east_hostel_north", to: "n_hostel_b2", distance: 65, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Nilgiri Hostel Entrance" },
      { from: "j_east_hostel_north", to: "j_north_east", distance: 250, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "North-East Perimeter Walk" },

      // East Gate 4
      { from: "j_east_dining", to: "j_east_gate_link", distance: 195, accessible: true, sheltered: false, wellLit: true, congestion: 1.1, name: "East Perimeter Road" },
      { from: "j_east_gate_link", to: "n_gate4", distance: 40, accessible: true, sheltered: true, wellLit: true, congestion: 1.0, name: "Hostel Gate 4 Security Check" },
      { from: "j_east_gate_link", to: "j_east_hostel_north", distance: 190, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Hostel North Ring Road" },
      { from: "j_east_gate_link", to: "j_east_hostel_south", distance: 210, accessible: true, sheltered: false, wellLit: true, congestion: 1.0, name: "Hostel South Ring Road" }
    ]
  },

  // Indoor Floor Maps for multi-story buildings
  indoorMaps: {
    ab_a: {
      name: "Academic Block A - Engineering & AI",
      floors: [
        {
          level: 1,
          name: "Level 1 (Ground Floor)",
          rooms: [
            { id: "ab_a_101", name: "Hall 101 - Turing Lecture Theatre", type: "lecture", x: 60, y: 50, w: 100, h: 70, capacity: 180 },
            { id: "ab_a_102", name: "Hall 102 - Lovelace Smart Classroom", type: "lecture", x: 180, y: 50, w: 90, h: 70, capacity: 90 },
            { id: "ab_a_rob", name: "Robotics & Embedded Systems Lab", type: "lab", x: 290, y: 50, w: 110, h: 70, capacity: 45 },
            { id: "ab_a_elev1", name: "Accessible Elevators A & B", type: "elevator", x: 200, y: 140, w: 45, h: 35 },
            { id: "ab_a_rest1", name: "Accessible Restrooms & Braille Sign", type: "restroom", x: 260, y: 140, w: 55, h: 35 },
            { id: "ab_a_exit1", name: "Emergency Fire Exit West (Ramp)", type: "exit", x: 40, y: 140, w: 50, h: 35 }
          ]
        },
        {
          level: 2,
          name: "Level 2 (Classrooms & Faculty)",
          rooms: [
            { id: "ab_a_201", name: "Room 201 - Operating Systems Lab", type: "lab", x: 60, y: 50, w: 100, h: 70, capacity: 50 },
            { id: "ab_a_202", name: "Room 202 - Database Systems Lab", type: "lab", x: 180, y: 50, w: 100, h: 70, capacity: 50 },
            { id: "ab_a_fac", name: "CS & AI Faculty Cabins (Dean)", type: "office", x: 300, y: 50, w: 100, h: 70, capacity: 25 },
            { id: "ab_a_elev2", name: "Accessible Elevators A & B", type: "elevator", x: 200, y: 140, w: 45, h: 35 },
            { id: "ab_a_water2", name: "UV Purified Water Station", type: "water", x: 150, y: 140, w: 35, h: 35 }
          ]
        },
        {
          level: 3,
          name: "Level 3 (AI Research Suites)",
          rooms: [
            { id: "ab_a_301", name: "Deep Learning & Neural Net Lab", type: "lab", x: 60, y: 50, w: 120, h: 70, capacity: 40 },
            { id: "ab_a_302", name: "Quantum Computing Simulation Unit", type: "lab", x: 200, y: 50, w: 110, h: 70, capacity: 30 },
            { id: "ab_a_conf", name: "Faculty Senate Conference Suite", type: "conference", x: 330, y: 50, w: 80, h: 70, capacity: 40 },
            { id: "ab_a_elev3", name: "Accessible Elevators A & B", type: "elevator", x: 200, y: 140, w: 45, h: 35 }
          ]
        }
      ]
    },
    library: {
      name: "Central Knowledge Resource Centre (Library)",
      floors: [
        {
          level: 1,
          name: "Level 1 (Ground - Circulation & Cafe)",
          rooms: [
            { id: "lib_circ", name: "Circulation & Book Issue Desk", type: "service", x: 70, y: 50, w: 110, h: 70, capacity: 20 },
            { id: "lib_catalog", name: "Digital OPAC Terminal Station", type: "tech", x: 200, y: 50, w: 80, h: 70, capacity: 16 },
            { id: "lib_cafe", name: "Library Coffee & Snack Kiosk", type: "cafe", x: 300, y: 50, w: 100, h: 70, capacity: 30 },
            { id: "lib_lift", name: "Glass Panoramic Elevator", type: "elevator", x: 200, y: 140, w: 45, h: 35 }
          ]
        },
        {
          level: 2,
          name: "Level 2 (Quiet Study & Periodicals)",
          rooms: [
            { id: "lib_pods", name: "Acoustic Silent Study Pods 1-12", type: "study", x: 60, y: 50, w: 130, h: 70, capacity: 24 },
            { id: "lib_periodicals", name: "Journals & IEEE Periodical Stacks", type: "reading", x: 210, y: 50, w: 110, h: 70, capacity: 60 },
            { id: "lib_braille", name: "Assistive Audio & Braille Station", type: "accessibility", x: 340, y: 50, w: 70, h: 70, capacity: 10 },
            { id: "lib_lift2", name: "Glass Panoramic Elevator", type: "elevator", x: 200, y: 140, w: 45, h: 35 }
          ]
        },
        {
          level: 3,
          name: "Level 3 (Group Discussion & Media)",
          rooms: [
            { id: "lib_gd1", name: "Group Discussion Room Alpha", type: "group", x: 60, y: 50, w: 90, h: 70, capacity: 12 },
            { id: "lib_gd2", name: "Group Discussion Room Beta", type: "group", x: 170, y: 50, w: 90, h: 70, capacity: 12 },
            { id: "lib_media", name: "Digital Media & Podcast Studio", type: "media", x: 280, y: 50, w: 120, h: 70, capacity: 15 },
            { id: "lib_lift3", name: "Glass Panoramic Elevator", type: "elevator", x: 200, y: 140, w: 45, h: 35 }
          ]
        }
      ]
    }
  },

  // First-Day Orientation Quests (Gamified Fresher / Visitor Tour)
  quests: [
    {
      id: "quest_welcome",
      step: 1,
      targetId: "gate_1",
      title: "Step 1: Welcome to Campus!",
      desc: "Check in at Main Gate (Gate 1) and receive your digital RFID campus badge.",
      badge: "Campus Arrival",
      completed: true
    },
    {
      id: "quest_admin",
      step: 2,
      targetId: "admin",
      title: "Step 2: Submit Verification Documents",
      desc: "Visit the Academic Section at the Admin Block to confirm your student ID.",
      badge: "Verified Scholar",
      completed: false
    },
    {
      id: "quest_library",
      step: 3,
      targetId: "library",
      title: "Step 3: Activate Library Access",
      desc: "Explore the 5-story Central Library and link your digital card for 24x7 study pods.",
      badge: "Knowledge Seeker",
      completed: false
    },
    {
      id: "quest_cafe",
      step: 4,
      targetId: "cafe",
      title: "Step 4: Grab Coffee at Central Cafe",
      desc: "Visit the student food court and discover the shaded outdoor Wi-Fi patio.",
      badge: "Caffeine Fueled",
      completed: false
    },
    {
      id: "quest_sac",
      step: 5,
      targetId: "sac",
      title: "Step 5: Join Student Clubs at SAC",
      desc: "Register for robotics, photography, music, or coding hackathons at the SAC.",
      badge: "Campus Explorer Pioneer",
      completed: false
    }
  ],

  // Realistic sample student timetable for timetable-aware routing
  timetable: [
    {
      id: "cls_1",
      courseCode: "CS-302",
      name: "Operating Systems & Concurrency Lab",
      instructor: "Prof. Ananya Sen",
      room: "Room 201, 2nd Floor",
      buildingId: "ab_a",
      startTime: "10:15 AM",
      endTime: "12:15 PM",
      status: "Upcoming (In 14 mins)",
      attendanceRequired: true
    },
    {
      id: "cls_2",
      courseCode: "AI-401",
      name: "Autonomous Robotics & Perception",
      instructor: "Dr. Vikram Seth",
      room: "Robotics Arena, COE",
      buildingId: "coe",
      startTime: "02:00 PM",
      endTime: "03:30 PM",
      status: "Later Today",
      attendanceRequired: true
    },
    {
      id: "cls_3",
      courseCode: "DES-104",
      name: "Human-Centered Design Thinking",
      instructor: "Prof. Kavita Rao",
      room: "Studio 2, Academic Block C",
      buildingId: "ab_c",
      startTime: "04:00 PM",
      endTime: "05:15 PM",
      status: "Later Today",
      attendanceRequired: false
    }
  ],

  // Live Campus Events for event navigation
  campusEvents: [
    {
      id: "evt_1",
      title: "Genesis 2026: 36-Hour National AI Hackathon",
      locationName: "Student Activity Centre (SAC)",
      buildingId: "sac",
      time: "Today, 05:00 PM - Sunday",
      category: "Hackathon",
      attendees: 450,
      urgent: true
    },
    {
      id: "evt_2",
      title: "Distinguished Lecture: Quantum Neural Networks",
      locationName: "Dr. APJ Abdul Kalam Central Auditorium",
      buildingId: "auditorium",
      time: "Tomorrow, 11:00 AM",
      category: "Keynote",
      attendees: 900,
      urgent: false
    },
    {
      id: "evt_3",
      title: "Inter-University Football Championship Finals",
      locationName: "Cricket & Football Pavilion Stadium",
      buildingId: "cricket_ground",
      time: "Saturday, 04:30 PM",
      category: "Sports",
      attendees: 1800,
      urgent: false
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CAMPUS_DATA;
}

