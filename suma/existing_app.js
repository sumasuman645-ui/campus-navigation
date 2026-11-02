/**
 * CampusNav – Smart Campus Navigation System
 * Integrated with Official University 3D Blueprint Campus Map
 * Includes Login System, Dijkstra Graph Pathfinding & Interactive SVG Overlays
 */

// ==========================================================================
// 1. CAMPUS LOCATIONS DIRECTORY (CALIBRATED TO OFFICIAL MAP BLUEPRINT)
// ==========================================================================

const CAMPUS_LOCATIONS = [
  {
    id: "loc-gate-1",
    name: "GATE 1 (Main Entrance)",
    code: "GATE-01",
    category: "gates",
    categoryLabel: "Campus Gate",
    coords: { x: 378, y: 68 },
    shape: { x: 345, y: 15, width: 68, height: 42, rx: 6 },
    color: "#475569",
    icon: "fa-door-open",
    openingHours: "Open 24/7 (Security Checkpoint)",
    contact: "Ext. 101 (Gate 1 Watchhouse)",
    description: "Main north campus entrance facing the university boulevard. Security checkpoint, automated boom barriers, visitor registration and shuttle terminus.",
    facilities: ["Visitor Reception", "RFID Shuttle Terminal", "Security Watchtower", "CCTV Monitoring"],
    accessibleFeatures: ["Level Paved Entry", "Direct Ramp Access"],
    floors: [{ floorName: "Ground Level", rooms: ["Gatehouse 1", "Visitor Log Desk", "Lost & Found Depot"] }],
    isPopular: true
  },
  {
    id: "loc-gate-2",
    name: "GATE 2 (North East)",
    code: "GATE-02",
    category: "gates",
    categoryLabel: "Campus Gate",
    coords: { x: 670, y: 68 },
    shape: { x: 640, y: 15, width: 60, height: 42, rx: 6 },
    color: "#475569",
    icon: "fa-door-open",
    openingHours: "06:00 AM – 10:00 PM",
    contact: "Ext. 102 (Gate 2 Post)",
    description: "Secondary north gate providing direct pedestrian and vehicle access to North Parking lots and GINO (SOP) block.",
    facilities: ["Vehicle Parking Access", "Pedestrian Turnstile"],
    accessibleFeatures: ["Barrier-free Pavement"],
    floors: [{ floorName: "Ground Level", rooms: ["Security Post 2"] }],
    isPopular: false
  },
  {
    id: "loc-gate-3",
    name: "GATE 3 (East Gate)",
    code: "GATE-03",
    category: "gates",
    categoryLabel: "Campus Gate",
    coords: { x: 835, y: 68 },
    shape: { x: 860, y: 65, width: 45, height: 50, rx: 6 },
    color: "#475569",
    icon: "fa-door-open",
    openingHours: "06:00 AM – 09:30 PM",
    contact: "Ext. 103 (Gate 3)",
    description: "East boundary entrance adjacent to Soosai blocks and healthcare training clinics.",
    facilities: ["East Parking Access", "Bicycle Stands"],
    accessibleFeatures: ["Level Paved Path"],
    floors: [{ floorName: "Ground Level", rooms: ["Security Outpost 3"] }],
    isPopular: false
  },
  {
    id: "loc-gate-4",
    name: "GATE 4 (South East)",
    code: "GATE-04",
    category: "gates",
    categoryLabel: "Campus Gate",
    coords: { x: 905, y: 630 },
    shape: { x: 935, y: 605, width: 45, height: 55, rx: 6 },
    color: "#475569",
    icon: "fa-door-open",
    openingHours: "06:00 AM – 10:00 PM",
    contact: "Ext. 104 (Gate 4)",
    description: "Direct access to S A RAJA Memorial Block, Community Health Centre and Legal Aid Clinic.",
    facilities: ["Health Centre Ambulance Access", "Public Transit Bus Stop"],
    accessibleFeatures: ["Ambulance Ramp Access"],
    floors: [{ floorName: "Ground Level", rooms: ["Security Post 4"] }],
    isPopular: false
  },
  {
    id: "loc-gate-5",
    name: "GATE 5 (South Gate)",
    code: "GATE-05",
    category: "gates",
    categoryLabel: "Campus Gate",
    coords: { x: 920, y: 745 },
    shape: { x: 950, y: 725, width: 45, height: 55, rx: 6 },
    color: "#475569",
    icon: "fa-door-open",
    openingHours: "Open 24/7",
    contact: "Ext. 105 (Gate 5)",
    description: "South campus perimeter gate closest to Muthraj block, Annam block and NCC headquarters.",
    facilities: ["Security Post", "Pedestrian Gate"],
    accessibleFeatures: ["Level Surface Entry"],
    floors: [{ floorName: "Ground Level", rooms: ["Security Gatehouse 5"] }],
    isPopular: false
  },
  {
    id: "loc-admin",
    name: "Admin & COE",
    code: "ADM-COE",
    category: "academic",
    categoryLabel: "Administration",
    coords: { x: 315, y: 180 },
    shape: { x: 340, y: 150, width: 175, height: 60, rx: 6 },
    color: "#1E40AF",
    icon: "fa-building-columns",
    openingHours: "08:30 AM – 05:30 PM (Mon-Fri)",
    contact: "Ext. 2000 (Registrar & COE)",
    description: "Central administrative nerve center and Controller of Examinations (COE). Houses Vice Chancellor's Secretariat, Registrar, Examination Hall, and Student Accounts.",
    facilities: ["Admissions Office", "Controller of Examinations", "Student Affairs", "ATM Kiosk", "High-Speed Wi-Fi"],
    accessibleFeatures: ["North Ramp Entrance", "Dual Elevators", "Braille Signage"],
    floors: [
      { floorName: "Ground Floor", rooms: ["Admissions & Information Desk", "Fee Counter", "Examination Help Desk"] },
      { floorName: "1st Floor", rooms: ["Registrar Office", "Academic Records Cell", "COE Confidential Section"] },
      { floorName: "2nd Floor", rooms: ["Vice Chancellor Secretariat", "Executive Boardroom"] }
    ],
    isPopular: true
  },
  {
    id: "loc-intel-joe",
    name: "Intel JOE & E-Learning",
    code: "INTEL-01",
    category: "academic",
    categoryLabel: "Digital Hub",
    coords: { x: 600, y: 395 },
    shape: { x: 505, y: 360, width: 75, height: 75, rx: 6 },
    color: "#7C3AED",
    icon: "fa-laptop-code",
    openingHours: "07:30 AM – 10:00 PM",
    contact: "Ext. 4015 (Digital Learning Director)",
    description: "Iconic circular high-tech innovation center 'Intel JOE' connected to the multi-level E-Learning Centre. Contains AI computing stations, digital lecture capture studios, and interactive coding pods.",
    facilities: ["Intel AI Innovation Hub", "E-Learning Smart Theatres", "Gigabit Cloud Pods", "Virtual Classroom Studio", "Air Conditioned"],
    accessibleFeatures: ["Elevator to all tiers", "Wheelchair-friendly digital pods", "Tactile guides"],
    floors: [
      { floorName: "Intel JOE Rotunda", rooms: ["Advanced Computing Rotunda", "AI & Robotics Showcase", "Demo Stage"] },
      { floorName: "E-Learning Ground", rooms: ["Room 101 (Smart Media)", "Digital Content Recording Studio"] },
      { floorName: "E-Learning 1st Floor", rooms: ["Room 204 (Data Science)", "Software Testing Lab", "Seminar Room A"] }
    ],
    isPopular: true
  },
  {
    id: "loc-arul-mess",
    name: "ARUL (MESS)",
    code: "MES-01",
    category: "amenities",
    categoryLabel: "Dining Commons",
    coords: { x: 365, y: 480 },
    shape: { x: 405, y: 440, width: 75, height: 80, rx: 6 },
    color: "#059669",
    icon: "fa-utensils",
    openingHours: "06:30 AM – 09:30 PM (Daily)",
    contact: "Ext. 5100 (Mess Supervisor)",
    description: "Primary student mess and food court. Serves nutritious daily breakfast, lunch, snacks, and dinner with hygienic central kitchens and open seating.",
    facilities: ["Central Dining Hall", "Purified RO Water Station", "Digital Food Token Kiosk", "Hand Wash Stations"],
    accessibleFeatures: ["Wide step-free doors", "Reserved accessible seating rows"],
    floors: [{ floorName: "Ground Floor", rooms: ["Main Mess Dining Hall", "Student Mess Counter", "Staff Dining"] }],
    isPopular: true
  },
  {
    id: "loc-auditorium",
    name: "Conventional Hall Auditorium",
    code: "AUD-01",
    category: "amenities",
    categoryLabel: "Auditorium & Events",
    coords: { x: 365, y: 575 },
    shape: { x: 415, y: 550, width: 150, height: 50, rx: 6 },
    color: "#D97706",
    icon: "fa-masks-theater",
    openingHours: "08:00 AM – 09:00 PM (During Events)",
    contact: "Ext. 2550 (Hall Management)",
    description: "Grand multi-purpose Conventional Hall and Auditorium with tiered seating, acoustic panelling, theatrical stage and state-of-the-art sound systems.",
    facilities: ["1,500 Audience Seats", "Dolby Sound Acoustics", "Green Rooms", "VIP Lounge", "Foyer Reception"],
    accessibleFeatures: ["Ramps on both sides of stage", "Reserved wheelchair bays"],
    floors: [
      { floorName: "Ground Level", rooms: ["Auditorium Main Orchestra", "Stage", "Green Rooms 1 & 2"] },
      { floorName: "Balcony", rooms: ["Upper Balcony Seating", "Sound & Lighting Console"] }
    ],
    isPopular: true
  },
  {
    id: "loc-sac",
    name: "SAC (Student Activity Centre)",
    code: "SAC-01",
    category: "academic",
    categoryLabel: "Student Centre",
    coords: { x: 280, y: 335 },
    shape: { x: 95, y: 295, width: 160, height: 80, rx: 6 },
    color: "#0891B2",
    icon: "fa-cubes",
    openingHours: "07:00 AM – 10:00 PM",
    contact: "Ext. 3500 (SAC Coordinator)",
    description: "Large 3D multi-level Student Activity Centre with iconic blue roof. Houses student council offices, robotics club, cultural practice studios, indoor recreation tables, and project maker-space.",
    facilities: ["Robotics Maker-Space", "Cultural Dance & Music Studios", "Indoor Games (Table Tennis, Chess)", "Student Council Chambers"],
    accessibleFeatures: ["Front Step-Free Ramp", "Spacious Double Entry Doors"],
    floors: [
      { floorName: "Ground Floor", rooms: ["Recreation Arena", "Table Tennis Tables", "Equipment Checkout"] },
      { floorName: "1st Floor", rooms: ["Student Club Hub", "Media Production Lab", "Meeting Hall"] }
    ],
    isPopular: true
  },
  {
    id: "loc-tech-block",
    name: "Technology Block & Labs",
    code: "ENG-LABS",
    category: "academic",
    categoryLabel: "Engineering Laboratories",
    coords: { x: 280, y: 460 },
    shape: { x: 115, y: 415, width: 140, height: 95, rx: 6 },
    color: "#2563EB",
    icon: "fa-gears",
    openingHours: "08:00 AM – 06:30 PM",
    contact: "Ext. 3300 (Labs Superintendent)",
    description: "Engineering research complex encompassing CIVIL LAB, MECH/AUTO LAB, and advanced testing instrumentation with heavy machinery and simulation workstations.",
    facilities: ["Civil Concrete & Surveying Lab", "Mechanical Engines Testing Bay", "Automobile Chassis Workshop", "CAD/CAM Workstations"],
    accessibleFeatures: ["Ground Level Roll-in Bays", "Automated Workshop Overhead Doors"],
    floors: [
      { floorName: "Civil Wing (North)", rooms: ["Hydraulics Lab", "Soil Mechanics Testing Room", "Materials Strength Lab"] },
      { floorName: "Mech/Auto Wing (South)", rooms: ["IC Engines Dynamometer Lab", "Transmission Systems Bay", "Robotic Welding Cell"] }
    ],
    isPopular: true
  },
  {
    id: "loc-soans",
    name: "Julianna (SOANS & SOEM)",
    code: "SOANS-01",
    category: "academic",
    categoryLabel: "School of Allied Health",
    coords: { x: 280, y: 68 },
    shape: { x: 135, y: 35, width: 120, height: 60, rx: 6 },
    color: "#4F46E5",
    icon: "fa-stethoscope",
    openingHours: "08:00 AM – 05:30 PM",
    contact: "Ext. 4100 (Dean SOANS)",
    description: "Julianna Block housing School of Allied Nursing Sciences (SOANS) and School of Emergency Medicine (SOEM). Features clinical nursing wards, emergency triage simulation suites, and smart auditoriums.",
    facilities: ["Simulated Clinical Nursing Ward", "Emergency Triage Lab", "Anatomy Observation Lab", "Digital Classrooms"],
    accessibleFeatures: ["Ramp Approach", "Elevator Servicing All Levels"],
    floors: [
      { floorName: "Ground Floor", rooms: ["Dean SOANS Office", "Lecture Hall J1", "Clinical Skills Lab A"] },
      { floorName: "1st Floor", rooms: ["Emergency Medicine Simulator", "Nursing Simulation Ward", "Faculty Lounge"] }
    ],
    isPopular: false
  },
  {
    id: "loc-soci",
    name: "Joveena (SOCI)",
    code: "SOCI-01",
    category: "academic",
    categoryLabel: "School of Computing",
    coords: { x: 50, y: 155 },
    shape: { x: 75, y: 125, width: 50, height: 70, rx: 6 },
    color: "#2563EB",
    icon: "fa-computer",
    openingHours: "08:00 AM – 06:00 PM",
    contact: "Ext. 3101 (SOCI Reception)",
    description: "School of Computing & Informatics (SOCI) west wing. High-density software development labs, cyber defense range, and specialized cloud server architecture rooms.",
    facilities: ["Cyber Security Cyber-Range", "Cloud Infrastructure Lab", "Coding Hackathon Lounge", "Server Rack Room"],
    accessibleFeatures: ["Elevator Access", "Braille Door Nameplates"],
    floors: [
      { floorName: "Ground Floor", rooms: ["Lab 101 (Linux Dev)", "Lab 102 (Network Architecture)", "Server Room"] },
      { floorName: "1st Floor", rooms: ["Lab 201 (Cloud Computing)", "Faculty Chambers", "AI Cluster Room"] }
    ],
    isPopular: false
  },
  {
    id: "loc-soag",
    name: "Joshuva (SOAG / SOD)",
    code: "SOAG-01",
    category: "academic",
    categoryLabel: "Agriculture & Design",
    coords: { x: 280, y: 240 },
    shape: { x: 105, y: 215, width: 125, height: 50, rx: 6 },
    color: "#16A34A",
    icon: "fa-seedling",
    openingHours: "08:30 AM – 05:30 PM",
    contact: "Ext. 4500 (SOAG HOD)",
    description: "Joshuva block dedicated to School of Agriculture (SOAG) and School of Design (SOD). Features soil chemistry research units, drafting and model drafting studios, and agricultural incubation suites.",
    facilities: ["Agronomy & Soil Analysis Lab", "Architectural Drafting Studio", "Industrial Design Workshop", "Herbarium"],
    accessibleFeatures: ["Ramped Entrance", "Wheelchair Friendly Studio Tables"],
    floors: [
      { floorName: "Ground Floor", rooms: ["Soil Science Lab", "Plant Pathology Bay", "Greenhouse Annex"] },
      { floorName: "1st Floor", rooms: ["Design Studio 1", "3D Printing & Prototyping Lab", "Faculty Cabins"] }
    ],
    isPopular: false
  },
  {
    id: "loc-francis",
    name: "Francis Block (2nd Yr SOCI)",
    code: "SOCI-02",
    category: "academic",
    categoryLabel: "Computing Second Year",
    coords: { x: 280, y: 680 },
    shape: { x: 105, y: 635, width: 155, height: 75, rx: 6 },
    color: "#3B82F6",
    icon: "fa-users-rectangle",
    openingHours: "08:00 AM – 05:30 PM",
    contact: "Ext. 3120 (Francis Block Office)",
    description: "Francis Block hosting dedicated academic classrooms, laboratories, and lecture auditoriums for 2nd Year SOCI undergraduate students.",
    facilities: ["4 Smart Lecture Halls (F1-F4)", "Object Oriented Programming Lab", "Student Seminar Hall", "Tutorial Rooms"],
    accessibleFeatures: ["Dual Access Ramps", "Elevator To Upper Floors"],
    floors: [
      { floorName: "Ground Floor", rooms: ["Classroom F1", "Classroom F2", "SOCI 2nd Yr Staff Room"] },
      { floorName: "1st Floor", rooms: ["Classroom F3", "Classroom F4", "Algorithms Lab"] }
    ],
    isPopular: false
  },
  {
    id: "loc-arch",
    name: "Campus Monument Arch",
    code: "ARCH-01",
    category: "amenities",
    categoryLabel: "Landmark Monument",
    coords: { x: 360, y: 740 },
    shape: { x: 385, y: 720, width: 45, height: 35, rx: 6 },
    color: "#0F172A",
    icon: "fa-archway",
    openingHours: "Open 24/7",
    contact: "Ext. 100 (Campus Security)",
    description: "Historic ceremonial gateway and campus monument archway. Central pedestrian crossing point between the hostel avenues, Francis block, and central lawns.",
    facilities: ["Pedestrian Gateway", "Illuminated Night Walkway", "Campus Photospot"],
    accessibleFeatures: ["Flat Paved Pathway"],
    floors: [{ floorName: "Ground Level", rooms: ["Ceremonial Archway Passage"] }],
    isPopular: false
  },
  {
    id: "loc-genset",
    name: "GENSET / Power Room",
    code: "PWR-01",
    category: "emergency",
    categoryLabel: "Utilities Substation",
    coords: { x: 280, y: 570 },
    shape: { x: 130, y: 545, width: 115, height: 50, rx: 6 },
    color: "#DC2626",
    icon: "fa-bolt",
    openingHours: "Authorized Personnel Only (24/7 Active)",
    contact: "Ext. 999 (Power Operations Dispatch)",
    description: "Central electrical substation and heavy generator plant ensuring uninterruptible power supply (UPS) across all labs, servers, and hospital facilities.",
    facilities: ["Dual 500kVA Diesel Generators", "Main Distribution Board (MDB)", "Solar Inverter Array"],
    accessibleFeatures: ["Restricted Safety Perimeter"],
    floors: [{ floorName: "Ground Level", rooms: ["Generator Hall 1", "Substation Control Room", "Battery Bank Room"] }],
    isPopular: false
  },
  {
    id: "loc-teresa-grace",
    name: "Teresa Hostel & Grace Block",
    code: "HST-01",
    category: "amenities",
    categoryLabel: "Student Residential",
    coords: { x: 365, y: 660 },
    shape: { x: 420, y: 635, width: 140, height: 55, rx: 6 },
    color: "#9333EA",
    icon: "fa-hotel",
    openingHours: "Resident Access 24/7 (Curfew 09:30 PM)",
    contact: "Ext. 6100 (Hostel Warden Office)",
    description: "Cozy student residential complex comprising Teresa Hostel and Grace block. Features furnished student suites, study lounges, indoor laundry, and round-the-clock wardens.",
    facilities: ["Resident Rooms", "High-Speed Wi-Fi", "Common Room & TV Lounge", "Laundry Facility", "24/7 Security Guard"],
    accessibleFeatures: ["Step-Free Ground Floor Rooms", "Ramp Entryway"],
    floors: [
      { floorName: "Ground Floor", rooms: ["Warden Office", "Visitor Lounge", "Rooms 101–120"] },
      { floorName: "1st Floor", rooms: ["Study Library", "Rooms 201–230"] }
    ],
    isPopular: true
  },
  {
    id: "loc-adhiharam",
    name: "Adhiharam Block (SOCI)",
    code: "SOCI-03",
    category: "academic",
    categoryLabel: "Academic Complex",
    coords: { x: 615, y: 550 },
    shape: { x: 640, y: 520, width: 220, height: 60, rx: 6 },
    color: "#2563EB",
    icon: "fa-graduation-cap",
    openingHours: "08:00 AM – 06:00 PM",
    contact: "Ext. 3150 (Adhiharam Office)",
    description: "Massive east academic block housing advanced computing classrooms, lecture halls, faculty offices, and post-graduate project labs.",
    facilities: ["6 Lecture Theatres", "AI Research Lab", "Post-Graduate Project Bays", "Faculty Chambers", "Water Dispenser Units"],
    accessibleFeatures: ["Ramped North and West Porticos", "Elevator Hub"],
    floors: [
      { floorName: "Ground Floor", rooms: ["Lecture Halls A1–A3", "Faculty Reception"] },
      { floorName: "1st Floor", rooms: ["Lecture Halls A4–A6", "AI & Data Lab"] }
    ],
    isPopular: true
  },
  {
    id: "loc-gino",
    name: "GINO (SOP)",
    code: "SOP-01",
    category: "academic",
    categoryLabel: "School of Pharmacy",
    coords: { x: 800, y: 165 },
    shape: { x: 610, y: 140, width: 170, height: 55, rx: 6 },
    color: "#0891B2",
    icon: "fa-pills",
    openingHours: "08:00 AM – 06:00 PM",
    contact: "Ext. 4300 (Dean SOP)",
    description: "School of Pharmacy (SOP) flagship academic block. Houses pharmaceutical chemistry laboratories, pharmacology animal-cell research suites, and drug formulation machinery.",
    facilities: ["Pharmaceutics Lab", "Pharmacognosy Lab", "Medicinal Chemistry Unit", "Clean Room Formulation Suite"],
    accessibleFeatures: ["Direct North Ramp", "Elevator To All Floors"],
    floors: [
      { floorName: "Ground Floor", rooms: ["Dean SOP Office", "Pharmaceutics Lab 1", "Instrument Room"] },
      { floorName: "1st Floor", rooms: ["Pharmacology Lab", "Seminar Theatre", "Staff Lounge"] }
    ],
    isPopular: true
  },
  {
    id: "loc-lawns-church",
    name: "Quadrangle Lawns & Chapel",
    code: "LAWN-01",
    category: "amenities",
    categoryLabel: "Scenic Lawns & Chapel",
    coords: { x: 700, y: 380 },
    shape: { x: 730, y: 350, width: 60, height: 60, rx: 6 },
    color: "#16A34A",
    icon: "fa-church",
    openingHours: "Open Daily 06:00 AM – 09:00 PM",
    contact: "Ext. 500 (Campus Chaplaincy)",
    description: "The serene heart of the campus. Features beautifully manicured Quadrangle lawns with criss-crossing walkways, North Open Air Theatre (OAT), and the iconic Campus Chapel sanctuary.",
    facilities: ["Open Air Theatre (OAT)", "Scenic Walking Lawns", "Campus Chapel", "Peace Garden & Shaded Benches"],
    accessibleFeatures: ["Smooth Paved Cross Walkways", "Wheelchair-Accessible Sanctuary Ramp"],
    floors: [{ floorName: "Ground Level", rooms: ["Main Chapel Sanctuary", "Meditation Foyer", "Chaplain Study"] }],
    isPopular: true
  },
  {
    id: "loc-soosai",
    name: "Soosai & Selvam Blocks",
    code: "SOW-01",
    category: "academic",
    categoryLabel: "Allied Health Wing",
    coords: { x: 835, y: 310 },
    shape: { x: 860, y: 160, width: 85, height: 260, rx: 6 },
    color: "#4F46E5",
    icon: "fa-building-shield",
    openingHours: "08:00 AM – 05:30 PM",
    contact: "Ext. 4200 (Soosai Admin)",
    description: "Eastern academic corridor comprising Social A (SOP), Social B (SOP), and Selrami (SOW). Hosts nursing research departments, social welfare institutes, and community outreach desks.",
    facilities: ["Community Medicine Lab", "Social Work Documentation Cell", "Lecture Halls S1–S4"],
    accessibleFeatures: ["Step-free east veranda", "Wheelchair ramp at Gate 3 connector"],
    floors: [
      { floorName: "Social A", rooms: ["Lecture Halls S1 & S2", "Seminar Room"] },
      { floorName: "Social B", rooms: ["Clinical Training Bay", "Staff Rooms"] },
      { floorName: "Selrami", rooms: ["Community Health Cell", "Outreach Desk"] }
    ],
    isPopular: false
  },
  {
    id: "loc-raja",
    name: "S A RAJA Memorial Block",
    code: "SOLHS-01",
    category: "academic",
    categoryLabel: "Proposed SOLHS",
    coords: { x: 595, y: 655 },
    shape: { x: 620, y: 630, width: 140, height: 55, rx: 6 },
    color: "#2563EB",
    icon: "fa-landmark-dome",
    openingHours: "08:00 AM – 06:00 PM",
    contact: "Ext. 4400 (SOLHS Director)",
    description: "Grand south academic block housing the Proposed School of Life & Health Sciences (SOLHS). Features modern lecture halls, molecular biology suites, and academic council chambers.",
    facilities: ["Molecular Biology Lab", "Genetic Research Suite", "Council Chambers", "Lecture Theatres R1–R4"],
    accessibleFeatures: ["Ramped Entryway", "Elevator Access"],
    floors: [
      { floorName: "Ground Floor", rooms: ["Dean Office", "Lecture Hall R1", "Lecture Hall R2"] },
      { floorName: "1st Floor", rooms: ["Genomics Lab", "Lecture Hall R3", "Faculty Lounge"] }
    ],
    isPopular: true
  },
  {
    id: "loc-pushbam",
    name: "Pushbam Block",
    code: "PSH-01",
    category: "academic",
    categoryLabel: "Academic Extension",
    coords: { x: 480, y: 745 },
    shape: { x: 505, y: 720, width: 45, height: 50, rx: 6 },
    color: "#64748B",
    icon: "fa-building",
    openingHours: "08:30 AM – 05:00 PM",
    contact: "Ext. 3800 (Pushbam Annex)",
    description: "Specialized academic annex housing tutorial classrooms, student club project offices, and examination evaluation centers.",
    facilities: ["Tutorial Rooms", "Project Discussion Pods"],
    accessibleFeatures: ["Ground Level Accessible"],
    floors: [{ floorName: "Ground Floor", rooms: ["Room P1", "Room P2", "Evaluation Cell"] }],
    isPopular: false
  },
  {
    id: "loc-muthraj",
    name: "Muthraj Block & OAT",
    code: "MTH-01",
    category: "amenities",
    categoryLabel: "Cultural & Amphitheatre",
    coords: { x: 435, y: 800 },
    shape: { x: 465, y: 800, width: 110, height: 70, rx: 6 },
    color: "#D97706",
    icon: "fa-masks-theater",
    openingHours: "08:00 AM – 08:00 PM",
    contact: "Ext. 5200 (Cultural Affairs)",
    description: "South cultural precinct featuring Muthraj block and the South Open Air Theatre (OAT). Primary venue for outdoor concerts, debates, and annual university festivals.",
    facilities: ["South Open Air Theatre (OAT)", "Cultural Green Rooms", "Sound Stage"],
    accessibleFeatures: ["Paved Stage Ramp"],
    floors: [{ floorName: "Ground Level", rooms: ["OAT Stage", "Audio Control Booth", "Dressing Rooms"] }],
    isPopular: false
  },
  {
    id: "loc-annam",
    name: "Annam Block",
    code: "ANM-01",
    category: "academic",
    categoryLabel: "Academic Facility",
    coords: { x: 610, y: 700 },
    shape: { x: 575, y: 720, width: 75, height: 55, rx: 6 },
    color: "#2563EB",
    icon: "fa-book-open-reader",
    openingHours: "08:00 AM – 06:00 PM",
    contact: "Ext. 3900 (Annam Admin)",
    description: "Academic building housing faculty research rooms, specialized seminar halls, and departmental archives.",
    facilities: ["Seminar Hall AN1", "Departmental Library", "Faculty Cabins"],
    accessibleFeatures: ["Ramp Accessible Entrance"],
    floors: [{ floorName: "Ground Floor", rooms: ["Classroom A1", "Seminar Hall", "Archives"] }],
    isPopular: false
  },
  {
    id: "loc-health",
    name: "Community Health Centre & Legal Aid",
    code: "HLT-01",
    category: "emergency",
    categoryLabel: "Emergency & Medical",
    coords: { x: 820, y: 690 },
    shape: { x: 765, y: 715, width: 110, height: 60, rx: 6 },
    color: "#DC2626",
    icon: "fa-truck-medical",
    openingHours: "24/7 Active SOS Emergency Care",
    contact: "Ext. 911 / 108 (Direct Emergency Line)",
    description: "24/7 campus hospital and primary medical trauma care centre, featuring Community Health Centre, Legal Aid Clinic, and Agri Extension Service with dedicated ambulance bays.",
    facilities: ["Emergency Trauma Unit", "24/7 Ambulance Fleet", "Doctor Consultation Suites", "Pharmacy Counter", "Legal Aid Advisory"],
    accessibleFeatures: ["Direct Ambulance Ramp", "Broad Gurney Double Doors", "Accessible Washrooms"],
    floors: [
      { floorName: "Ground Floor", rooms: ["Emergency Triage Desk", "Doctor Cabin 1", "Observation Ward", "Pharmacy"] },
      { floorName: "1st Floor", rooms: ["Legal Aid Clinic", "Agri Extension Consultancy", "Medical Records"] }
    ],
    isPopular: true
  },
  {
    id: "loc-ncc",
    name: "NCC Wing & South Cafe",
    code: "NCC-01",
    category: "amenities",
    categoryLabel: "Cadet Corps & Cafe",
    coords: { x: 705, y: 700 },
    shape: { x: 675, y: 720, width: 65, height: 55, rx: 6 },
    color: "#059669",
    icon: "fa-shield-halved",
    openingHours: "07:00 AM – 07:00 PM",
    contact: "Ext. 5300 (NCC Commander)",
    description: "National Cadet Corps (NCC) university headquarters and parade quartermaster, coupled with the popular South Cafe kiosk.",
    facilities: ["NCC Headquarters", "Armoury & Quartermaster Store", "South Cafe Snacks Kiosk"],
    accessibleFeatures: ["Direct Ground Concourse Access"],
    floors: [{ floorName: "Ground Level", rooms: ["NCC Officer Room", "Drill Equipment Store", "Cafe Counter"] }],
    isPopular: false
  },
  {
    id: "loc-fish-pond",
    name: "Fish Pond & Flag Square",
    code: "PND-01",
    category: "amenities",
    categoryLabel: "Campus Landmark",
    coords: { x: 415, y: 105 },
    shape: { x: 445, y: 85, width: 55, height: 45, rx: 6 },
    color: "#0284C7",
    icon: "fa-water",
    openingHours: "Open 24/7 (Illuminated Promenade)",
    contact: "Ext. 2000 (Central Admin)",
    description: "Centrally landscaped freshwater fish pond with decorative fountain, koi habitat, and official university ceremonial flagpole square.",
    facilities: ["Freshwater Pond", "Ceremonial Flagmast", "Surrounding Garden Benches"],
    accessibleFeatures: ["Smooth Brick-Paved Perimeter Promenade"],
    floors: [{ floorName: "Ground Level", rooms: ["Central Plaza & Flagpole Base"] }],
    isPopular: true
  },
  {
    id: "loc-cafe-north",
    name: "North Campus Cafe",
    code: "CAF-01",
    category: "amenities",
    categoryLabel: "Cafe & Refreshment",
    coords: { x: 540, y: 68 },
    shape: { x: 470, y: 20, width: 50, height: 40, rx: 6 },
    color: "#D97706",
    icon: "fa-mug-hot",
    openingHours: "07:30 AM – 08:30 PM",
    contact: "Ext. 5150 (Cafe North)",
    description: "Popular cafe situated near Gate 1 and north parking. Offers specialty coffee, tea, artisanal pastries, sandwiches, and fast breakfast wraps.",
    facilities: ["Barista Counter", "Outdoor Canopy Seating", "UPI QR Payment Ready", "Chilled Beverages"],
    accessibleFeatures: ["Wheelchair Accessible Outdoor Tables"],
    floors: [{ floorName: "Ground Level", rooms: ["Main Cafe Counter", "Patio Seating"] }],
    isPopular: true
  }
];

// ==========================================================================
// 2. WALKWAY GRAPH NODES & REALISTIC PATH NETWORK (CALIBRATED TO 1024x815 3D MODEL)
// ==========================================================================
// Graph of interconnected walkway intersections strictly along roads & paths, avoiding buildings!

const WALKWAY_NODES = {
  "W_GATE1": { id: "W_GATE1", x: 378, y: 68, label: "Gate 1 Concourse", tags: ["accessible", "main", "safe"] },
  "W_GATE1_W": { id: "W_GATE1_W", x: 315, y: 68, label: "Gate 1 West Concourse", tags: ["accessible", "main", "safe"] },
  "W_CAFE_W": { id: "W_CAFE_W", x: 445, y: 68, label: "North Cafe Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_CAFE_E": { id: "W_CAFE_E", x: 540, y: 68, label: "North Cafe Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_POND_W": { id: "W_POND_W", x: 415, y: 105, label: "Fish Pond Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_PARK_N": { id: "W_PARK_N", x: 585, y: 68, label: "North Parking Lane", tags: ["accessible", "main", "safe"] },
  "W_GATE2": { id: "W_GATE2", x: 670, y: 68, label: "Gate 2 Entrance", tags: ["accessible", "main", "safe"] },
  "W_PARK_NE": { id: "W_PARK_NE", x: 780, y: 68, label: "North East Parking Lane", tags: ["accessible", "main", "safe"] },
  "W_GATE3": { id: "W_GATE3", x: 835, y: 68, label: "Gate 3 Approach", tags: ["accessible", "main", "safe"] },
  "W_NW_CORNER": { id: "W_NW_CORNER", x: 50, y: 18, label: "Northwest Perimeter Road", tags: ["accessible", "main", "safe"] },
  "W_JULIANNA_NW": { id: "W_JULIANNA_NW", x: 115, y: 18, label: "Julianna NW Road", tags: ["accessible", "main", "safe"] },
  "W_JULIANNA_NE": { id: "W_JULIANNA_NE", x: 280, y: 18, label: "Julianna NE Road", tags: ["accessible", "main", "safe"] },
  "W_JULIANNA_E": { id: "W_JULIANNA_E", x: 280, y: 68, label: "Julianna East Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_AIRPLANE": { id: "W_AIRPLANE", x: 280, y: 155, label: "Aviation Square Lane", tags: ["accessible", "main", "safe"] },
  "W_SOAG": { id: "W_SOAG", x: 280, y: 240, label: "Joshuva Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_SAC_N": { id: "W_SAC_N", x: 280, y: 285, label: "SAC North-East Junction", tags: ["accessible", "main", "safe"] },
  "W_SAC_E": { id: "W_SAC_E", x: 280, y: 335, label: "SAC East Concourse (Right side)", tags: ["accessible", "main", "safe"] },
  "W_WEST_1": { id: "W_WEST_1", x: 50, y: 155, label: "Joveena West Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_WEST_2": { id: "W_WEST_2", x: 50, y: 240, label: "Joshuva West Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_WEST_3": { id: "W_WEST_3", x: 50, y: 335, label: "SAC West Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_WEST_4": { id: "W_WEST_4", x: 50, y: 460, label: "Tech Blocks West Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_WEST_5": { id: "W_WEST_5", x: 50, y: 570, label: "Maintenance West Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_WEST_6": { id: "W_WEST_6", x: 50, y: 680, label: "Francis Block West Way (Left side)", tags: ["accessible", "main", "safe"] },
  "W_PREP_AB": { id: "W_PREP_AB", x: 75, y: 760, label: "South Gate Boulevard", tags: ["accessible", "main", "safe"] },
  "W_TECH_N": { id: "W_TECH_N", x: 280, y: 390, label: "Tech Block North Junction", tags: ["accessible", "main", "safe"] },
  "W_TECH_MID": { id: "W_TECH_MID", x: 280, y: 460, label: "Tech Block Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_GENSET": { id: "W_GENSET", x: 280, y: 570, label: "Genset Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_FRANCIS": { id: "W_FRANCIS", x: 280, y: 680, label: "Francis Block Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_FRANCIS_S": { id: "W_FRANCIS_S", x: 280, y: 760, label: "Francis Block South Road", tags: ["accessible", "main", "safe"] },
  "W_ARCH": { id: "W_ARCH", x: 360, y: 740, label: "Arch Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_ADMIN_NW": { id: "W_ADMIN_NW", x: 315, y: 140, label: "Admin NW Corner", tags: ["accessible", "main", "safe"] },
  "W_ADMIN_NE": { id: "W_ADMIN_NE", x: 540, y: 140, label: "Admin NE Corner", tags: ["accessible", "main", "safe"] },
  "W_ADMIN_SW": { id: "W_ADMIN_SW", x: 315, y: 225, label: "Admin SW Corner (Left side)", tags: ["accessible", "main", "safe"] },
  "W_ADMIN_SE": { id: "W_ADMIN_SE", x: 540, y: 225, label: "Admin SE Corner (Right side)", tags: ["accessible", "main", "safe"] },
  "W_ADMIN_N": { id: "W_ADMIN_N", x: 425, y: 140, label: "Admin North Portico", tags: ["accessible", "main", "safe"] },
  "W_ADMIN_W": { id: "W_ADMIN_W", x: 315, y: 180, label: "Admin West Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_ADMIN_E": { id: "W_ADMIN_E", x: 540, y: 180, label: "Admin East Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_COURTYARD_N": { id: "W_COURTYARD_N", x: 425, y: 225, label: "Central Quad North (Below Admin)", tags: ["accessible", "main", "safe"] },
  "W_COURTYARD_C": { id: "W_COURTYARD_C", x: 365, y: 335, label: "Central Campus Spine", tags: ["accessible", "main", "safe"] },
  "W_INTEL_NW": { id: "W_INTEL_NW", x: 490, y: 335, label: "Intel JOE NW Road", tags: ["accessible", "main", "safe"] },
  "W_INTEL_NE": { id: "W_INTEL_NE", x: 600, y: 335, label: "Intel JOE NE Road", tags: ["accessible", "main", "safe"] },
  "W_INTEL_N": { id: "W_INTEL_N", x: 540, y: 335, label: "Intel JOE North Plaza", tags: ["accessible", "main", "safe"] },
  "W_INTEL_E": { id: "W_INTEL_E", x: 600, y: 395, label: "Intel JOE Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_INTEL_SE": { id: "W_INTEL_SE", x: 600, y: 450, label: "Intel JOE SE Road", tags: ["accessible", "main", "safe"] },
  "W_MESS_W": { id: "W_MESS_W", x: 365, y: 480, label: "ARUL Mess Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_MESS_NW": { id: "W_MESS_NW", x: 365, y: 425, label: "ARUL Mess NW Corner", tags: ["accessible", "main", "safe"] },
  "W_MESS_SW": { id: "W_MESS_SW", x: 365, y: 530, label: "ARUL Mess SW Corner", tags: ["accessible", "main", "safe"] },
  "W_MESS_E": { id: "W_MESS_E", x: 490, y: 480, label: "Corridor between Mess and Intel", tags: ["accessible", "main", "safe"] },
  "W_MESS_SE": { id: "W_MESS_SE", x: 490, y: 530, label: "ARUL Mess SE Corner", tags: ["accessible", "main", "safe"] },
  "W_AUDI_NW": { id: "W_AUDI_NW", x: 365, y: 535, label: "Auditorium NW Road", tags: ["accessible", "main", "safe"] },
  "W_AUDI_NE": { id: "W_AUDI_NE", x: 585, y: 535, label: "Auditorium NE Road", tags: ["accessible", "main", "safe"] },
  "W_AUDI_N": { id: "W_AUDI_N", x: 490, y: 535, label: "Auditorium North Road", tags: ["accessible", "main", "safe"] },
  "W_AUDI_W": { id: "W_AUDI_W", x: 365, y: 575, label: "Auditorium Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_AUDI_E": { id: "W_AUDI_E", x: 585, y: 575, label: "Auditorium Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_AUDI_SW": { id: "W_AUDI_SW", x: 365, y: 615, label: "Auditorium SW Road", tags: ["accessible", "main", "safe"] },
  "W_AUDI_SE": { id: "W_AUDI_SE", x: 585, y: 615, label: "Auditorium SE Road", tags: ["accessible", "main", "safe"] },
  "W_AUDI_S": { id: "W_AUDI_S", x: 490, y: 615, label: "Auditorium South Road", tags: ["accessible", "main", "safe"] },
  "W_HOSTEL_TG": { id: "W_HOSTEL_TG", x: 365, y: 660, label: "Teresa Hostel Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_GRACE_E": { id: "W_GRACE_E", x: 585, y: 660, label: "Grace Block Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_HOSTEL_SW": { id: "W_HOSTEL_SW", x: 365, y: 705, label: "Hostel SW Corner", tags: ["accessible", "main", "safe"] },
  "W_GRACE_SE": { id: "W_GRACE_SE", x: 585, y: 705, label: "Grace SE Corner", tags: ["accessible", "main", "safe"] },
  "W_GINO_NW": { id: "W_GINO_NW", x: 595, y: 115, label: "GINO NW Corner", tags: ["accessible", "main", "safe"] },
  "W_GINO_NE": { id: "W_GINO_NE", x: 800, y: 115, label: "GINO NE Corner", tags: ["accessible", "main", "safe"] },
  "W_GINO": { id: "W_GINO", x: 695, y: 115, label: "GINO North Road (Above GINO)", tags: ["accessible", "main", "safe"] },
  "W_GINO_E": { id: "W_GINO_E", x: 800, y: 165, label: "GINO East Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_GINO_SE": { id: "W_GINO_SE", x: 800, y: 210, label: "GINO SE Corner", tags: ["accessible", "main", "safe"] },
  "W_LAWN_NW": { id: "W_LAWN_NW", x: 605, y: 215, label: "Quadrangle Lawns NW Walk", tags: ["accessible", "main", "safe"] },
  "W_LAWN_NE": { id: "W_LAWN_NE", x: 810, y: 215, label: "Quadrangle Lawns NE Walk", tags: ["accessible", "main", "safe"] },
  "W_LAWN_C": { id: "W_LAWN_C", x: 700, y: 310, label: "Quadrangle Lawns Centre Cross", tags: ["accessible", "main", "safe"] },
  "W_CHAPEL": { id: "W_CHAPEL", x: 700, y: 380, label: "Campus Chapel Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_LAWN_SW": { id: "W_LAWN_SW", x: 605, y: 460, label: "Quadrangle Lawns SW Walk", tags: ["accessible", "main", "safe"] },
  "W_LAWN_SE": { id: "W_LAWN_SE", x: 810, y: 460, label: "Quadrangle Lawns SE Walk", tags: ["accessible", "main", "safe"] },
  "W_EAST_1": { id: "W_EAST_1", x: 835, y: 195, label: "Soosai Road North (Left side)", tags: ["accessible", "main", "safe"] },
  "W_EAST_2": { id: "W_EAST_2", x: 835, y: 295, label: "Soosai Road Mid (Left side)", tags: ["accessible", "main", "safe"] },
  "W_EAST_3": { id: "W_EAST_3", x: 835, y: 395, label: "Soosai Road South (Left side)", tags: ["accessible", "main", "safe"] },
  "W_SOOSAI": { id: "W_SOOSAI", x: 835, y: 310, label: "Soosai Main Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_ADHI_NW": { id: "W_ADHI_NW", x: 615, y: 500, label: "Adhiharam NW Road", tags: ["accessible", "main", "safe"] },
  "W_ADHI_NE": { id: "W_ADHI_NE", x: 885, y: 500, label: "Adhiharam NE Road", tags: ["accessible", "main", "safe"] },
  "W_ADHI_N": { id: "W_ADHI_N", x: 750, y: 500, label: "Adhiharam North Road", tags: ["accessible", "main", "safe"] },
  "W_ADHI_W": { id: "W_ADHI_W", x: 615, y: 550, label: "Adhiharam Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_ADHI_E": { id: "W_ADHI_E", x: 885, y: 550, label: "Adhiharam Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_ADHI_SW": { id: "W_ADHI_SW", x: 615, y: 595, label: "Adhiharam SW Road", tags: ["accessible", "main", "safe"] },
  "W_ADHI_SE": { id: "W_ADHI_SE", x: 885, y: 595, label: "Adhiharam SE Road", tags: ["accessible", "main", "safe"] },
  "W_RAJA_N": { id: "W_RAJA_N", x: 700, y: 605, label: "S A RAJA North Avenue", tags: ["accessible", "main", "safe"] },
  "W_RAJA_NW": { id: "W_RAJA_NW", x: 595, y: 605, label: "Raja NW Road", tags: ["accessible", "main", "safe"] },
  "W_RAJA_NE": { id: "W_RAJA_NE", x: 780, y: 605, label: "Raja NE Road", tags: ["accessible", "main", "safe"] },
  "W_RAJA_W": { id: "W_RAJA_W", x: 595, y: 655, label: "Raja Block Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_RAJA_E": { id: "W_RAJA_E", x: 780, y: 655, label: "Raja Block Road (Right side)", tags: ["accessible", "main", "safe"] },
  "W_RAJA_SW": { id: "W_RAJA_SW", x: 595, y: 700, label: "Raja SW Road", tags: ["accessible", "main", "safe"] },
  "W_RAJA_SE": { id: "W_RAJA_SE", x: 780, y: 700, label: "Raja SE Road", tags: ["accessible", "main", "safe"] },
  "W_RAJA_S": { id: "W_RAJA_S", x: 690, y: 700, label: "Raja Block South Road", tags: ["accessible", "main", "safe"] },
  "W_PUSHBAM_N": { id: "W_PUSHBAM_N", x: 480, y: 705, label: "Pushbam North Road", tags: ["accessible", "main", "safe"] },
  "W_PUSHBAM": { id: "W_PUSHBAM", x: 480, y: 745, label: "Pushbam Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_PUSHBAM_S": { id: "W_PUSHBAM_S", x: 480, y: 780, label: "Pushbam South Road", tags: ["accessible", "main", "safe"] },
  "W_ANNAM": { id: "W_ANNAM", x: 610, y: 700, label: "Annam Block Road (Top side)", tags: ["accessible", "main", "safe"] },
  "W_NCC": { id: "W_NCC", x: 705, y: 700, label: "NCC Wing Road (Top side)", tags: ["accessible", "main", "safe"] },
  "W_HEALTH": { id: "W_HEALTH", x: 820, y: 690, label: "Health Centre Road (Top side)", tags: ["accessible", "main", "safe"] },
  "W_HEALTH_NE": { id: "W_HEALTH_NE", x: 895, y: 690, label: "Health Centre NE Corner", tags: ["accessible", "main", "safe"] },
  "W_HEALTH_E": { id: "W_HEALTH_E", x: 895, y: 745, label: "Health Centre East (Right side)", tags: ["accessible", "main", "safe"] },
  "W_GATE4": { id: "W_GATE4", x: 905, y: 630, label: "Gate 4 Concourse", tags: ["accessible", "main", "safe"] },
  "W_MUTHRAJ": { id: "W_MUTHRAJ", x: 435, y: 800, label: "Muthraj Road (Left side)", tags: ["accessible", "main", "safe"] },
  "W_SOUTH_WAY": { id: "W_SOUTH_WAY", x: 360, y: 775, label: "South Perimeter Concourse", tags: ["accessible", "main", "safe"] },
  "W_GATE5": { id: "W_GATE5", x: 920, y: 745, label: "Gate 5 Concourse", tags: ["accessible", "main", "safe"] },
};

const WALKWAY_EDGES = [
  { u: "W_GATE1", v: "W_GATE1_W", distance: 63, tags: ["main", "accessible", "safe"] },
  { u: "W_GATE1", v: "W_POND_W", distance: 52, tags: ["main", "accessible", "safe"] },
  { u: "W_POND_W", v: "W_CAFE_W", distance: 47, tags: ["main", "accessible", "safe"] },
  { u: "W_CAFE_W", v: "W_CAFE_E", distance: 95, tags: ["main", "accessible", "safe"] },
  { u: "W_CAFE_E", v: "W_PARK_N", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_PARK_N", v: "W_GATE2", distance: 85, tags: ["main", "accessible", "safe"] },
  { u: "W_GATE2", v: "W_PARK_NE", distance: 110, tags: ["main", "accessible", "safe"] },
  { u: "W_PARK_NE", v: "W_GATE3", distance: 55, tags: ["main", "accessible", "safe"] },
  { u: "W_GATE1_W", v: "W_JULIANNA_E", distance: 35, tags: ["main", "accessible", "safe"] },
  { u: "W_GATE1_W", v: "W_ADMIN_NW", distance: 72, tags: ["main", "accessible", "safe"] },
  { u: "W_JULIANNA_E", v: "W_JULIANNA_NE", distance: 50, tags: ["main", "accessible", "safe"] },
  { u: "W_JULIANNA_NE", v: "W_JULIANNA_NW", distance: 165, tags: ["main", "accessible", "safe"] },
  { u: "W_JULIANNA_NW", v: "W_NW_CORNER", distance: 65, tags: ["main", "accessible", "safe"] },
  { u: "W_JULIANNA_E", v: "W_AIRPLANE", distance: 87, tags: ["main", "accessible", "safe"] },
  { u: "W_AIRPLANE", v: "W_SOAG", distance: 85, tags: ["main", "accessible", "safe"] },
  { u: "W_SOAG", v: "W_SAC_N", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_SAC_N", v: "W_SAC_E", distance: 50, tags: ["main", "accessible", "safe"] },
  { u: "W_NW_CORNER", v: "W_WEST_1", distance: 137, tags: ["main", "accessible", "safe"] },
  { u: "W_WEST_1", v: "W_WEST_2", distance: 85, tags: ["main", "accessible", "safe"] },
  { u: "W_WEST_2", v: "W_WEST_3", distance: 95, tags: ["main", "accessible", "safe"] },
  { u: "W_WEST_3", v: "W_WEST_4", distance: 125, tags: ["main", "accessible", "safe"] },
  { u: "W_WEST_4", v: "W_WEST_5", distance: 110, tags: ["main", "accessible", "safe"] },
  { u: "W_WEST_5", v: "W_WEST_6", distance: 110, tags: ["main", "accessible", "safe"] },
  { u: "W_WEST_6", v: "W_PREP_AB", distance: 83, tags: ["main", "accessible", "safe"] },
  { u: "W_PREP_AB", v: "W_FRANCIS_S", distance: 205, tags: ["main", "accessible", "safe"] },
  { u: "W_FRANCIS_S", v: "W_SOUTH_WAY", distance: 81, tags: ["main", "accessible", "safe"] },
  { u: "W_SAC_E", v: "W_TECH_N", distance: 55, tags: ["main", "accessible", "safe"] },
  { u: "W_TECH_N", v: "W_TECH_MID", distance: 70, tags: ["main", "accessible", "safe"] },
  { u: "W_TECH_MID", v: "W_GENSET", distance: 110, tags: ["main", "accessible", "safe"] },
  { u: "W_GENSET", v: "W_FRANCIS", distance: 110, tags: ["main", "accessible", "safe"] },
  { u: "W_FRANCIS", v: "W_FRANCIS_S", distance: 80, tags: ["main", "accessible", "safe"] },
  { u: "W_POND_W", v: "W_ADMIN_N", distance: 36, tags: ["main", "accessible", "safe"] },
  { u: "W_ADMIN_NW", v: "W_ADMIN_N", distance: 110, tags: ["main", "accessible", "safe"] },
  { u: "W_ADMIN_N", v: "W_ADMIN_NE", distance: 115, tags: ["main", "accessible", "safe"] },
  { u: "W_ADMIN_NW", v: "W_ADMIN_W", distance: 40, tags: ["main", "accessible", "safe"] },
  { u: "W_ADMIN_W", v: "W_ADMIN_SW", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_ADMIN_NE", v: "W_ADMIN_E", distance: 40, tags: ["main", "accessible", "safe"] },
  { u: "W_ADMIN_E", v: "W_ADMIN_SE", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_ADMIN_SW", v: "W_COURTYARD_N", distance: 110, tags: ["main", "accessible", "safe"] },
  { u: "W_COURTYARD_N", v: "W_ADMIN_SE", distance: 115, tags: ["main", "accessible", "safe"] },
  { u: "W_ADMIN_SW", v: "W_AIRPLANE", distance: 78, tags: ["main", "accessible", "safe"] },
  { u: "W_COURTYARD_N", v: "W_COURTYARD_C", distance: 125, tags: ["main", "accessible", "safe"] },
  { u: "W_SAC_E", v: "W_COURTYARD_C", distance: 85, tags: ["main", "accessible", "safe"] },
  { u: "W_COURTYARD_C", v: "W_INTEL_NW", distance: 125, tags: ["main", "accessible", "safe"] },
  { u: "W_INTEL_NW", v: "W_INTEL_N", distance: 50, tags: ["main", "accessible", "safe"] },
  { u: "W_INTEL_N", v: "W_INTEL_NE", distance: 60, tags: ["main", "accessible", "safe"] },
  { u: "W_INTEL_NE", v: "W_INTEL_E", distance: 60, tags: ["main", "accessible", "safe"] },
  { u: "W_INTEL_E", v: "W_INTEL_SE", distance: 55, tags: ["main", "accessible", "safe"] },
  { u: "W_INTEL_NW", v: "W_MESS_NW", distance: 154, tags: ["main", "accessible", "safe"] },
  { u: "W_MESS_NW", v: "W_MESS_W", distance: 55, tags: ["main", "accessible", "safe"] },
  { u: "W_MESS_W", v: "W_MESS_SW", distance: 50, tags: ["main", "accessible", "safe"] },
  { u: "W_MESS_SW", v: "W_AUDI_NW", distance: 10, tags: ["main", "accessible", "safe"] },
  { u: "W_INTEL_SE", v: "W_AUDI_NE", distance: 86, tags: ["main", "accessible", "safe"] },
  { u: "W_MESS_W", v: "W_TECH_MID", distance: 87, tags: ["main", "accessible", "safe"] },
  { u: "W_MESS_SW", v: "W_MESS_SE", distance: 125, tags: ["main", "accessible", "safe"] },
  { u: "W_MESS_SE", v: "W_AUDI_N", distance: 10, tags: ["main", "accessible", "safe"] },
  { u: "W_AUDI_NW", v: "W_AUDI_N", distance: 125, tags: ["main", "accessible", "safe"] },
  { u: "W_AUDI_N", v: "W_AUDI_NE", distance: 95, tags: ["main", "accessible", "safe"] },
  { u: "W_AUDI_NW", v: "W_AUDI_W", distance: 40, tags: ["main", "accessible", "safe"] },
  { u: "W_AUDI_W", v: "W_AUDI_SW", distance: 40, tags: ["main", "accessible", "safe"] },
  { u: "W_AUDI_NE", v: "W_AUDI_E", distance: 40, tags: ["main", "accessible", "safe"] },
  { u: "W_AUDI_E", v: "W_AUDI_SE", distance: 40, tags: ["main", "accessible", "safe"] },
  { u: "W_AUDI_SW", v: "W_AUDI_S", distance: 125, tags: ["main", "accessible", "safe"] },
  { u: "W_AUDI_S", v: "W_AUDI_SE", distance: 95, tags: ["main", "accessible", "safe"] },
  { u: "W_AUDI_SW", v: "W_HOSTEL_TG", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_HOSTEL_TG", v: "W_HOSTEL_SW", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_AUDI_SE", v: "W_GRACE_E", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_GRACE_E", v: "W_GRACE_SE", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_HOSTEL_SW", v: "W_ARCH", distance: 35, tags: ["main", "accessible", "safe"] },
  { u: "W_ARCH", v: "W_SOUTH_WAY", distance: 35, tags: ["main", "accessible", "safe"] },
  { u: "W_HOSTEL_SW", v: "W_PUSHBAM_N", distance: 115, tags: ["main", "accessible", "safe"] },
  { u: "W_PUSHBAM_N", v: "W_PUSHBAM", distance: 40, tags: ["main", "accessible", "safe"] },
  { u: "W_PUSHBAM", v: "W_PUSHBAM_S", distance: 35, tags: ["main", "accessible", "safe"] },
  { u: "W_PUSHBAM_S", v: "W_SOUTH_WAY", distance: 120, tags: ["main", "accessible", "safe"] },
  { u: "W_SOUTH_WAY", v: "W_MUTHRAJ", distance: 79, tags: ["main", "accessible", "safe"] },
  { u: "W_ADMIN_NE", v: "W_GINO_NW", distance: 60, tags: ["main", "accessible", "safe"] },
  { u: "W_GINO_NW", v: "W_GINO", distance: 100, tags: ["main", "accessible", "safe"] },
  { u: "W_GINO", v: "W_GINO_NE", distance: 105, tags: ["main", "accessible", "safe"] },
  { u: "W_GINO_NE", v: "W_PARK_NE", distance: 51, tags: ["main", "accessible", "safe"] },
  { u: "W_GINO_NE", v: "W_GINO_E", distance: 50, tags: ["main", "accessible", "safe"] },
  { u: "W_GINO_E", v: "W_GINO_SE", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_GINO_SE", v: "W_LAWN_NE", distance: 11, tags: ["main", "accessible", "safe"] },
  { u: "W_ADMIN_SE", v: "W_LAWN_NW", distance: 65, tags: ["main", "accessible", "safe"] },
  { u: "W_LAWN_NW", v: "W_LAWN_C", distance: 134, tags: ["main", "accessible", "safe"] },
  { u: "W_LAWN_NE", v: "W_EAST_1", distance: 32, tags: ["main", "accessible", "safe"] },
  { u: "W_LAWN_NE", v: "W_LAWN_C", distance: 145, tags: ["main", "accessible", "safe"] },
  { u: "W_LAWN_C", v: "W_CHAPEL", distance: 70, tags: ["main", "accessible", "safe"] },
  { u: "W_CHAPEL", v: "W_LAWN_SW", distance: 124, tags: ["main", "accessible", "safe"] },
  { u: "W_INTEL_E", v: "W_LAWN_SW", distance: 65, tags: ["main", "accessible", "safe"] },
  { u: "W_LAWN_SW", v: "W_ADHI_NW", distance: 41, tags: ["main", "accessible", "safe"] },
  { u: "W_EAST_1", v: "W_EAST_2", distance: 100, tags: ["main", "accessible", "safe"] },
  { u: "W_EAST_2", v: "W_SOOSAI", distance: 15, tags: ["main", "accessible", "safe"] },
  { u: "W_SOOSAI", v: "W_EAST_3", distance: 85, tags: ["main", "accessible", "safe"] },
  { u: "W_EAST_3", v: "W_LAWN_SE", distance: 69, tags: ["main", "accessible", "safe"] },
  { u: "W_LAWN_SE", v: "W_ADHI_NE", distance: 85, tags: ["main", "accessible", "safe"] },
  { u: "W_AUDI_E", v: "W_ADHI_NW", distance: 80, tags: ["main", "accessible", "safe"] },
  { u: "W_ADHI_NW", v: "W_ADHI_N", distance: 135, tags: ["main", "accessible", "safe"] },
  { u: "W_ADHI_N", v: "W_ADHI_NE", distance: 135, tags: ["main", "accessible", "safe"] },
  { u: "W_ADHI_NW", v: "W_ADHI_W", distance: 50, tags: ["main", "accessible", "safe"] },
  { u: "W_ADHI_W", v: "W_ADHI_SW", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_ADHI_NE", v: "W_ADHI_E", distance: 50, tags: ["main", "accessible", "safe"] },
  { u: "W_ADHI_E", v: "W_ADHI_SE", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_ADHI_SW", v: "W_RAJA_NW", distance: 22, tags: ["main", "accessible", "safe"] },
  { u: "W_ADHI_SE", v: "W_RAJA_NE", distance: 105, tags: ["main", "accessible", "safe"] },
  { u: "W_RAJA_NW", v: "W_RAJA_N", distance: 105, tags: ["main", "accessible", "safe"] },
  { u: "W_RAJA_N", v: "W_RAJA_NE", distance: 80, tags: ["main", "accessible", "safe"] },
  { u: "W_RAJA_NW", v: "W_RAJA_W", distance: 50, tags: ["main", "accessible", "safe"] },
  { u: "W_RAJA_W", v: "W_RAJA_SW", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_RAJA_NE", v: "W_RAJA_E", distance: 50, tags: ["main", "accessible", "safe"] },
  { u: "W_RAJA_E", v: "W_RAJA_SE", distance: 45, tags: ["main", "accessible", "safe"] },
  { u: "W_RAJA_SW", v: "W_RAJA_S", distance: 95, tags: ["main", "accessible", "safe"] },
  { u: "W_RAJA_S", v: "W_RAJA_SE", distance: 90, tags: ["main", "accessible", "safe"] },
  { u: "W_RAJA_SW", v: "W_ANNAM", distance: 15, tags: ["main", "accessible", "safe"] },
  { u: "W_ANNAM", v: "W_NCC", distance: 95, tags: ["main", "accessible", "safe"] },
  { u: "W_NCC", v: "W_HEALTH", distance: 115, tags: ["main", "accessible", "safe"] },
  { u: "W_HEALTH", v: "W_HEALTH_NE", distance: 75, tags: ["main", "accessible", "safe"] },
  { u: "W_HEALTH_NE", v: "W_HEALTH_E", distance: 55, tags: ["main", "accessible", "safe"] },
  { u: "W_HEALTH_NE", v: "W_GATE4", distance: 60, tags: ["main", "accessible", "safe"] },
  { u: "W_HEALTH_E", v: "W_GATE5", distance: 25, tags: ["main", "accessible", "safe"] },
  { u: "W_GATE4", v: "W_GATE5", distance: 115, tags: ["main", "accessible", "safe"] },
  { u: "W_PUSHBAM_N", v: "W_ANNAM", distance: 130, tags: ["main", "accessible", "safe"] },
];


// Associate each location with its nearest node
const LOCATION_NODE_MAP = {
  "loc-gate-1": "W_GATE1",
  "loc-gate-2": "W_GATE2",
  "loc-gate-3": "W_GATE3",
  "loc-gate-4": "W_GATE4",
  "loc-gate-5": "W_GATE5",
  "loc-admin": "W_ADMIN_W",
  "loc-intel-joe": "W_INTEL_E",
  "loc-arul-mess": "W_MESS_W",
  "loc-auditorium": "W_AUDI_W",
  "loc-sac": "W_SAC_E",
  "loc-tech-block": "W_TECH_MID",
  "loc-soans": "W_JULIANNA_E",
  "loc-soci": "W_WEST_1",
  "loc-soag": "W_SOAG",
  "loc-francis": "W_FRANCIS",
  "loc-arch": "W_ARCH",
  "loc-genset": "W_GENSET",
  "loc-teresa-grace": "W_HOSTEL_TG",
  "loc-adhiharam": "W_ADHI_W",
  "loc-gino": "W_GINO_E",
  "loc-lawns-church": "W_CHAPEL",
  "loc-soosai": "W_SOOSAI",
  "loc-raja": "W_RAJA_W",
  "loc-pushbam": "W_PUSHBAM",
  "loc-muthraj": "W_MUTHRAJ",
  "loc-annam": "W_ANNAM",
  "loc-health": "W_HEALTH",
  "loc-ncc": "W_NCC",
  "loc-fish-pond": "W_POND_W",
  "loc-cafe-north": "W_CAFE_E"
};

// Explicit Building Entrances mapped to nearest obstacle-free road walkway node
const BUILDING_ENTRANCES = {
  "loc-gate-1": { entrancePoint: { x: 378, y: 68 }, roadNodeKey: "W_GATE1", label: "Gate 1 Turnstile & Vehicle Boom" },
  "loc-gate-2": { entrancePoint: { x: 670, y: 68 }, roadNodeKey: "W_GATE2", label: "Gate 2 Pedestrian Turnstile" },
  "loc-gate-3": { entrancePoint: { x: 840, y: 68 }, roadNodeKey: "W_GATE3", label: "Gate 3 Security Post" },
  "loc-gate-4": { entrancePoint: { x: 915, y: 640 }, roadNodeKey: "W_GATE4", label: "Gate 4 Service Gate" },
  "loc-gate-5": { entrancePoint: { x: 925, y: 745 }, roadNodeKey: "W_GATE5", label: "Gate 5 Lower Campus Portal" },
  "loc-admin": { entrancePoint: { x: 320, y: 160 }, roadNodeKey: "W_ADMIN_SW", label: "Admin & COE West Portico Entrance" },
  "loc-intel-joe": { entrancePoint: { x: 615, y: 400 }, roadNodeKey: "W_INTEL_E", label: "Intel JOE East Promenade Entrance" },
  "loc-arul-mess": { entrancePoint: { x: 435, y: 480 }, roadNodeKey: "W_MESS_W", label: "ARUL Mess West Dining Hall Entry" },
  "loc-auditorium": { entrancePoint: { x: 430, y: 585 }, roadNodeKey: "W_AUDI_W", label: "Conventional Hall West Grand Foyer" },
  "loc-sac": { entrancePoint: { x: 285, y: 335 }, roadNodeKey: "W_SAC_E", label: "SAC East Main Entrance Ramp" },
  "loc-tech-block": { entrancePoint: { x: 285, y: 460 }, roadNodeKey: "W_TECH_MID", label: "Civil & Mech Tech Labs East Entry" },
  "loc-soans": { entrancePoint: { x: 270, y: 70 }, roadNodeKey: "W_JULIANNA_E", label: "Julianna Block East Ground Foyer" },
  "loc-soci": { entrancePoint: { x: 45, y: 140 }, roadNodeKey: "W_WEST_1", label: "Joveena Block West Accessible Entry" },
  "loc-soag": { entrancePoint: { x: 235, y: 220 }, roadNodeKey: "W_SOAG", label: "Joshua Block East Lobby Entrance" },
  "loc-francis": { entrancePoint: { x: 285, y: 680 }, roadNodeKey: "W_FRANCIS", label: "Francis Block East Portico" },
  "loc-arch": { entrancePoint: { x: 375, y: 740 }, roadNodeKey: "W_ARCH", label: "Monumental Arch Pedestrian Crossing" },
  "loc-genset": { entrancePoint: { x: 285, y: 570 }, roadNodeKey: "W_GENSET", label: "Substation & Genset Service Access" },
  "loc-teresa-grace": { entrancePoint: { x: 435, y: 660 }, roadNodeKey: "W_HOSTEL_TG", label: "Mother Teresa Hostel Reception Portico" },
  "loc-adhiharam": { entrancePoint: { x: 645, y: 580 }, roadNodeKey: "W_ADHI_W", label: "Adhinaram Block West Gateway" },
  "loc-gino": { entrancePoint: { x: 825, y: 140 }, roadNodeKey: "W_GINO_E", label: "GINO SOP Block East Covered Arcade" },
  "loc-lawns-church": { entrancePoint: { x: 820, y: 460 }, roadNodeKey: "W_CHAPEL", label: "Campus Chapel West Sanctuary Portal" },
  "loc-soosai": { entrancePoint: { x: 920, y: 240 }, roadNodeKey: "W_SOOSAI", label: "Soosai Block West Portico Entry" },
  "loc-raja": { entrancePoint: { x: 645, y: 660 }, roadNodeKey: "W_RAJA_W", label: "S A RAJA Memorial Block Main Concourse" },
  "loc-pushbam": { entrancePoint: { x: 505, y: 745 }, roadNodeKey: "W_PUSHBAM", label: "Pushbam Block West Access Door" },
  "loc-muthraj": { entrancePoint: { x: 485, y: 800 }, roadNodeKey: "W_MUTHRAJ", label: "Muthraj Block West Reception" },
  "loc-annam": { entrancePoint: { x: 660, y: 835 }, roadNodeKey: "W_ANNAM", label: "Annam Block North Covered Arcade" },
  "loc-health": { entrancePoint: { x: 835, y: 825 }, roadNodeKey: "W_HEALTH", label: "Health Centre & Legal Aid Clinic North Entrance" },
  "loc-ncc": { entrancePoint: { x: 770, y: 845 }, roadNodeKey: "W_NCC", label: "NCC Wing North Enrolment Desk" },
  "loc-fish-pond": { entrancePoint: { x: 435, y: 105 }, roadNodeKey: "W_POND_W", label: "Fish Pond Plaza & Flag Concourse" },
  "loc-cafe-north": { entrancePoint: { x: 530, y: 68 }, roadNodeKey: "W_CAFE_E", label: "North Food Court East Entry" }
};


// ==========================================================================
// 1.5. OBSTACLE REPRESENTATION & GEOMETRIC COLLISION ENGINE
// ==========================================================================

const CAMPUS_OBSTACLE_POLYGONS = {
  "obs_gate_1": [
    {
      "x": 345,
      "y": 14
    },
    {
      "x": 415,
      "y": 14
    },
    {
      "x": 415,
      "y": 56
    },
    {
      "x": 345,
      "y": 56
    }
  ],
  "obs_gate_2": [
    {
      "x": 640,
      "y": 14
    },
    {
      "x": 700,
      "y": 14
    },
    {
      "x": 700,
      "y": 56
    },
    {
      "x": 640,
      "y": 56
    }
  ],
  "obs_gate_3": [
    {
      "x": 860,
      "y": 62
    },
    {
      "x": 905,
      "y": 62
    },
    {
      "x": 905,
      "y": 115
    },
    {
      "x": 860,
      "y": 115
    }
  ],
  "obs_gate_4": [
    {
      "x": 935,
      "y": 605
    },
    {
      "x": 980,
      "y": 605
    },
    {
      "x": 980,
      "y": 660
    },
    {
      "x": 935,
      "y": 660
    }
  ],
  "obs_gate_5": [
    {
      "x": 950,
      "y": 725
    },
    {
      "x": 995,
      "y": 725
    },
    {
      "x": 995,
      "y": 780
    },
    {
      "x": 950,
      "y": 780
    }
  ],
  "obs_cafe_north": [
    {
      "x": 470,
      "y": 20
    },
    {
      "x": 520,
      "y": 20
    },
    {
      "x": 520,
      "y": 60
    },
    {
      "x": 470,
      "y": 60
    }
  ],
  "obs_fish_pond": [
    {
      "x": 445,
      "y": 85
    },
    {
      "x": 500,
      "y": 85
    },
    {
      "x": 500,
      "y": 130
    },
    {
      "x": 445,
      "y": 130
    }
  ],
  "obs_julianna": [
    {
      "x": 135,
      "y": 35
    },
    {
      "x": 255,
      "y": 35
    },
    {
      "x": 255,
      "y": 95
    },
    {
      "x": 135,
      "y": 95
    }
  ],
  "obs_joveena": [
    {
      "x": 75,
      "y": 125
    },
    {
      "x": 125,
      "y": 125
    },
    {
      "x": 125,
      "y": 195
    },
    {
      "x": 75,
      "y": 195
    }
  ],
  "obs_joshua": [
    {
      "x": 105,
      "y": 215
    },
    {
      "x": 230,
      "y": 215
    },
    {
      "x": 230,
      "y": 265
    },
    {
      "x": 105,
      "y": 265
    }
  ],
  "obs_sac": [
    {
      "x": 95,
      "y": 295
    },
    {
      "x": 255,
      "y": 295
    },
    {
      "x": 255,
      "y": 375
    },
    {
      "x": 95,
      "y": 375
    }
  ],
  "obs_tech_labs": [
    {
      "x": 115,
      "y": 415
    },
    {
      "x": 255,
      "y": 415
    },
    {
      "x": 255,
      "y": 510
    },
    {
      "x": 115,
      "y": 510
    }
  ],
  "obs_genset": [
    {
      "x": 130,
      "y": 545
    },
    {
      "x": 245,
      "y": 545
    },
    {
      "x": 245,
      "y": 595
    },
    {
      "x": 130,
      "y": 595
    }
  ],
  "obs_francis": [
    {
      "x": 105,
      "y": 635
    },
    {
      "x": 260,
      "y": 635
    },
    {
      "x": 260,
      "y": 710
    },
    {
      "x": 105,
      "y": 710
    }
  ],
  "obs_admin": [
    {
      "x": 340,
      "y": 150
    },
    {
      "x": 515,
      "y": 150
    },
    {
      "x": 515,
      "y": 210
    },
    {
      "x": 340,
      "y": 210
    }
  ],
  "obs_intel_joe": [
    {
      "x": 505,
      "y": 360
    },
    {
      "x": 580,
      "y": 360
    },
    {
      "x": 580,
      "y": 435
    },
    {
      "x": 505,
      "y": 435
    }
  ],
  "obs_arul_mess": [
    {
      "x": 405,
      "y": 440
    },
    {
      "x": 480,
      "y": 440
    },
    {
      "x": 480,
      "y": 520
    },
    {
      "x": 405,
      "y": 520
    }
  ],
  "obs_auditorium": [
    {
      "x": 415,
      "y": 550
    },
    {
      "x": 565,
      "y": 550
    },
    {
      "x": 565,
      "y": 600
    },
    {
      "x": 415,
      "y": 600
    }
  ],
  "obs_teresa_hostel": [
    {
      "x": 420,
      "y": 635
    },
    {
      "x": 560,
      "y": 635
    },
    {
      "x": 560,
      "y": 690
    },
    {
      "x": 420,
      "y": 690
    }
  ],
  "obs_arch": [
    {
      "x": 385,
      "y": 720
    },
    {
      "x": 430,
      "y": 720
    },
    {
      "x": 430,
      "y": 755
    },
    {
      "x": 385,
      "y": 755
    }
  ],
  "obs_gino": [
    {
      "x": 610,
      "y": 140
    },
    {
      "x": 780,
      "y": 140
    },
    {
      "x": 780,
      "y": 195
    },
    {
      "x": 610,
      "y": 195
    }
  ],
  "obs_chapel": [
    {
      "x": 730,
      "y": 350
    },
    {
      "x": 790,
      "y": 350
    },
    {
      "x": 790,
      "y": 410
    },
    {
      "x": 730,
      "y": 410
    }
  ],
  "obs_soosai": [
    {
      "x": 860,
      "y": 160
    },
    {
      "x": 945,
      "y": 160
    },
    {
      "x": 945,
      "y": 420
    },
    {
      "x": 860,
      "y": 420
    }
  ],
  "obs_adhiharam": [
    {
      "x": 640,
      "y": 520
    },
    {
      "x": 860,
      "y": 520
    },
    {
      "x": 860,
      "y": 580
    },
    {
      "x": 640,
      "y": 580
    }
  ],
  "obs_raja": [
    {
      "x": 620,
      "y": 630
    },
    {
      "x": 760,
      "y": 630
    },
    {
      "x": 760,
      "y": 685
    },
    {
      "x": 620,
      "y": 685
    }
  ],
  "obs_pushbam": [
    {
      "x": 505,
      "y": 720
    },
    {
      "x": 550,
      "y": 720
    },
    {
      "x": 550,
      "y": 770
    },
    {
      "x": 505,
      "y": 770
    }
  ],
  "obs_annam": [
    {
      "x": 575,
      "y": 720
    },
    {
      "x": 650,
      "y": 720
    },
    {
      "x": 650,
      "y": 775
    },
    {
      "x": 575,
      "y": 775
    }
  ],
  "obs_ncc": [
    {
      "x": 675,
      "y": 720
    },
    {
      "x": 740,
      "y": 720
    },
    {
      "x": 740,
      "y": 775
    },
    {
      "x": 675,
      "y": 775
    }
  ],
  "obs_health": [
    {
      "x": 765,
      "y": 715
    },
    {
      "x": 875,
      "y": 715
    },
    {
      "x": 875,
      "y": 775
    },
    {
      "x": 765,
      "y": 775
    }
  ],
  "obs_muthraj": [
    {
      "x": 465,
      "y": 800
    },
    {
      "x": 575,
      "y": 800
    },
    {
      "x": 575,
      "y": 870
    },
    {
      "x": 465,
      "y": 870
    }
  ]
};

/**
 * Geometric Helper: Counter-Clockwise test for line orientation
 */
function ccw(A, B, C) {
  return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
}

/**
 * Geometric Helper: Check if line segment AB intersects line segment CD
 */
function segmentsIntersect(p1, p2, p3, p4) {
  return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
}

/**
 * Geometric Helper: Ray-casting point-in-polygon test
 */
function pointInPolygon(pt, poly) {
  let inside = false;
  const n = poly.length;
  let p1 = poly[0];
  for (let i = 0; i <= n; i++) {
    const p2 = poly[i % n];
    if (pt.y > Math.min(p1.y, p2.y)) {
      if (pt.y <= Math.max(p1.y, p2.y)) {
        if (pt.x <= Math.max(p1.x, p2.x)) {
          let xinters = pt.x;
          if (p1.y !== p2.y) {
            xinters = (pt.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
          }
          if (p1.x === p2.x || pt.x <= xinters) {
            inside = !inside;
          }
        }
      }
    }
    p1 = p2;
  }
  return inside;
}

/**
 * Geometric Helper: Check if segment p1 -> p2 intersects or penetrates an obstacle polygon
 */
function segmentIntersectsObstacle(p1, p2, poly) {
  if (pointInPolygon(p1, poly) || pointInPolygon(p2, poly)) {
    return true;
  }
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const q1 = poly[i];
    const q2 = poly[(i + 1) % n];
    if (segmentsIntersect(p1, p2, q1, q2)) {
      return true;
    }
  }
  return false;
}

/**
 * Validate a candidate path against all campus obstacle polygons
 */
function validateRouteAgainstObstacles(pathNodes) {
  if (!pathNodes || pathNodes.length < 2) return { valid: true };

  for (let i = 0; i < pathNodes.length - 1; i++) {
    const u = pathNodes[i];
    const v = pathNodes[i + 1];
    const p1 = WALKWAY_NODES[u];
    const p2 = WALKWAY_NODES[v];
    if (!p1 || !p2) continue;

    for (const [obsId, polygon] of Object.entries(CAMPUS_OBSTACLE_POLYGONS)) {
      if (segmentIntersectsObstacle(p1, p2, polygon)) {
        return {
          valid: false,
          details: `Segment ${u} -> ${v} intersects obstacle ${obsId}`
        };
      }
    }
  }
  return { valid: true };
}

/**
 * A* Pathfinding Algorithm over Walkway Graph with Obstacle Validation
 */
function aStarPathfind(startNodeKey, endNodeKey, mode = "fastest") {
  if (!WALKWAY_NODES[startNodeKey] || !WALKWAY_NODES[endNodeKey]) {
    return { success: false, nodes: [], error: "Invalid start or destination node key." };
  }

  if (startNodeKey === endNodeKey) {
    return { success: true, nodes: [startNodeKey], totalDistance: 0 };
  }

  // Build Adjacency Graph from WALKWAY_EDGES
  const adj = {};
  Object.keys(WALKWAY_NODES).forEach(nodeId => { adj[nodeId] = []; });

  WALKWAY_EDGES.forEach(edge => {
    let weight = edge.distance;
    if (mode === "accessible") {
      if (edge.tags && edge.tags.includes("accessible")) weight *= 0.8;
      else weight *= 2.2;
    } else if (mode === "safe") {
      if (edge.tags && edge.tags.includes("safe")) weight *= 0.7;
      else weight *= 2.4;
    } else if (mode === "eco") {
      if (edge.tags && edge.tags.includes("eco")) weight *= 0.7;
      else weight *= 1.6;
    }

    if (adj[edge.u] && adj[edge.v]) {
      adj[edge.u].push({ to: edge.v, weight, realDist: edge.distance });
      adj[edge.v].push({ to: edge.u, weight, realDist: edge.distance });
    }
  });

  const targetNode = WALKWAY_NODES[endNodeKey];
  function heuristic(nodeKey) {
    const n = WALKWAY_NODES[nodeKey];
    if (!n || !targetNode) return 0;
    return Math.hypot(n.x - targetNode.x, n.y - targetNode.y);
  }

  const gScore = {};
  const fScore = {};
  const realDistances = {};
  const previous = {};
  const openSet = new Set([startNodeKey]);
  const closedSet = new Set();

  Object.keys(WALKWAY_NODES).forEach(nodeId => {
    gScore[nodeId] = Infinity;
    fScore[nodeId] = Infinity;
    realDistances[nodeId] = 0;
  });

  gScore[startNodeKey] = 0;
  fScore[startNodeKey] = heuristic(startNodeKey);

  while (openSet.size > 0) {
    let current = null;
    let lowestF = Infinity;
    openSet.forEach(nodeId => {
      if (fScore[nodeId] < lowestF) {
        lowestF = fScore[nodeId];
        current = nodeId;
      }
    });

    if (current === endNodeKey) {
      // Reconstruct path
      const path = [];
      let curr = endNodeKey;
      while (curr) {
        path.unshift(curr);
        curr = previous[curr];
      }

      // Route Validation against obstacle polygons
      const validation = validateRouteAgainstObstacles(path);
      if (!validation.valid) {
        console.warn("Calculated route failed obstacle validation:", validation.details);
        return {
          success: false,
          nodes: [],
          error: `Calculated path intersects non-walkable obstacle (${validation.details}).`
        };
      }

      return {
        success: true,
        nodes: path,
        totalDistance: Math.round(realDistances[endNodeKey])
      };
    }

    openSet.delete(current);
    closedSet.add(current);

    const neighbors = adj[current] || [];
    for (let neighbor of neighbors) {
      if (closedSet.has(neighbor.to)) continue;

      const tentativeG = gScore[current] + neighbor.weight;
      if (tentativeG < gScore[neighbor.to]) {
        previous[neighbor.to] = current;
        gScore[neighbor.to] = tentativeG;
        realDistances[neighbor.to] = realDistances[current] + neighbor.realDist;
        fScore[neighbor.to] = tentativeG + heuristic(neighbor.to);

        if (!openSet.has(neighbor.to)) {
          openSet.add(neighbor.to);
        }
      }
    }
  }

  return {
    success: false,
    nodes: [],
    error: "No walkable pedestrian route found between start and destination."
  };
}

/**
 * Interactive Routing Debug Mode: Toggle visualization of Walkway Nodes, Edges, Obstacles & Entrances
 */
function toggleRoutingDebugMode() {
  AppState.routingDebugMode = !AppState.routingDebugMode;
  const debugLayer = document.getElementById("routingDebugLayer");
  const debugBtn = document.getElementById("btnToggleDebugRouting");

  if (debugLayer) {
    debugLayer.style.display = AppState.routingDebugMode ? "inline" : "none";
  }

  if (debugBtn) {
    if (AppState.routingDebugMode) {
      debugBtn.classList.add("active");
      debugBtn.style.color = "#06b6d4";
      debugBtn.style.background = "rgba(6, 182, 212, 0.2)";
    } else {
      debugBtn.classList.remove("active");
      debugBtn.style.color = "";
      debugBtn.style.background = "";
    }
  }

  if (AppState.routingDebugMode) {
    renderRoutingDebugOverlay();
    showToast("Pedestrian Routing Debug Overlay enabled (Nodes, Edges, Obstacles, Entrances).", "info");
  } else {
    showToast("Pedestrian Routing Debug Overlay disabled.", "info");
  }
}

function renderRoutingDebugOverlay() {
  const layer = document.getElementById("routingDebugLayer");
  if (!layer) return;

  let html = `<g class="routing-debug-content">`;

  // 1. Obstacle Boundaries
  Object.entries(CAMPUS_OBSTACLE_POLYGONS).forEach(([obsId, poly]) => {
    const pts = poly.map(p => `${p.x},${p.y}`).join(" ");
    html += `
      <polygon points="${pts}" fill="rgba(239, 68, 68, 0.16)" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="${poly[0].x + 4}" y="${poly[0].y + 12}" font-family="'Plus Jakarta Sans', monospace" font-size="8" font-weight="700" fill="#fca5a5" opacity="0.8">${obsId.replace("obs_", "")}</text>
    `;
  });

  // 2. Graph Walkway Edges
  WALKWAY_EDGES.forEach(edge => {
    const u = WALKWAY_NODES[edge.u];
    const v = WALKWAY_NODES[edge.v];
    if (u && v) {
      html += `<line x1="${u.x}" y1="${u.y}" x2="${v.x}" y2="${v.y}" stroke="#06b6d4" stroke-width="1.4" opacity="0.55"/>`;
    }
  });

  // 3. Walkway Nodes
  Object.entries(WALKWAY_NODES).forEach(([nId, node]) => {
    html += `
      <circle cx="${node.x}" cy="${node.y}" r="2.8" fill="#22d3ee" stroke="#0891b2" stroke-width="1">
        <title>${nId}: (${node.x}, ${node.y})</title>
      </circle>
    `;
  });

  // 4. Building Entrance Connections
  Object.entries(BUILDING_ENTRANCES).forEach(([locId, ent]) => {
    const road = WALKWAY_NODES[ent.roadNodeKey];
    if (road) {
      html += `
        <line x1="${ent.entrancePoint.x}" y1="${ent.entrancePoint.y}" x2="${road.x}" y2="${road.y}" stroke="#eab308" stroke-width="1.5" stroke-dasharray="3,3"/>
        <circle cx="${ent.entrancePoint.x}" cy="${ent.entrancePoint.y}" r="3" fill="#eab308" stroke="#713f12" stroke-width="1">
          <title>Entrance for ${locId} &rarr; ${ent.roadNodeKey}</title>
        </circle>
      `;
    }
  });

  html += `</g>`;
  layer.innerHTML = html;
}



const AppState = {
  currentUser: {
    role: "student", // "student" | "faculty" | "visitor"
    name: "Alex Rivera",
    id: "CS-2024-042",
    dept: "School of Computing & Info (SOCI)",
    roleTitle: "CS Undergrad • Year 4",
    initials: "AR"
  },
  currentLocationId: "loc-gate-3",
  viaLocationId: null,
  destinationLocationId: "loc-arch",
  activeRouteMode: "fastest", // "fastest" | "accessible" | "safe" | "eco" | "emergency"
  activeMapStyle: "blueprint", // "blueprint" | "vector",
  routingDebugMode: false,
  showDiagramPics: true,
  liveNavActive: false,
  liveNavStepIndex: 0,
  voiceGuidanceEnabled: false,
  isHeatmapActive: false,
  isShuttleActive: false,
  shuttleInterval: null,
  shuttlePositionIndex: 0,
  browserHistory: ["campus://explore"],
  browserHistoryIndex: 0,
  selectedLocation: null,
  activeRoute: null,
  activeMapFilter: "all",
  isWalkingSimulation: false,
  favorites: ["loc-intel-joe", "loc-admin", "loc-arul-mess"],
  recentDestinations: ["Campus Monument Arch", "Admin & COE", "Intel JOE & E-Learning"],
  mapZoom: 1.0
};

// ==========================================================================
// 4. INITIALIZATION & LIFECYCLE
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Cancel any lingering browser speech synthesis
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }

  // Load custom campus blocks created by Admin from persistent storage
  loadCustomLocationsFromStorage();

  initSvgMap();
  populateDropdowns();
  renderFavoritesAndRecents();
  setupEventListeners();
  initLoginGateway();
  checkExistingSession();

  // Run initial route calculation: Gate 3 -> Campus Monument Arch (without speaking)
  calculateAndRenderRoute("loc-gate-3", "loc-arch", "fastest");
  renderNotificationsFeed();
});

function initLoginGateway() {
  try {
    const savedPos = localStorage.getItem("campusnav_login_pos") || "right";
    setLoginPosition(savedPos);
  } catch (e) {
    setLoginPosition("right");
  }
  selectLoginRole("student");
}

function setLoginPosition(pos) {
  const wrapper = document.getElementById("loginLayoutWrapper");
  if (wrapper) {
    wrapper.classList.remove("pos-left", "pos-right", "pos-center");
    wrapper.classList.add(`pos-${pos}`);
  }

  document.querySelectorAll(".lpc-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-pos") === pos);
  });

  try {
    localStorage.setItem("campusnav_login_pos", pos);
  } catch (e) {}
}

function checkExistingSession() {
  try {
    const savedUser = sessionStorage.getItem("campusnav_user");
    if (savedUser) {
      AppState.currentUser = JSON.parse(savedUser);
      applyUserProfile();
    }
  } catch (e) {
    console.warn("Session check error", e);
  }
}

window.openLoginGateway = function() {
  document.getElementById("loginScreen")?.classList.remove("dismissed");
};

// ==========================================================================
// 5. CREATIVE 4-MODULE ROLE-BASED LOGIN SYSTEM (STUDENT, STAFF, VISITOR, ADMIN)
// ==========================================================================

let currentSelectedLoginRole = "student";

function autofillAdminCredentials() {
  selectLoginRole("admin");
  const inputName = document.getElementById("loginNameInput");
  const inputPass = document.getElementById("loginPasswordInput");
  if (inputName) inputName.value = "suma";
  if (inputPass) inputPass.value = "581200";
  showToast("Admin credentials autofilled (suma / 581200). Click 'Sign in' to enter! 🛡️", "info");
}

function selectLoginRole(role) {
  // Map legacy 'academic' to 'student'
  if (role === "academic") role = "student";
  currentSelectedLoginRole = role;

  // Highlight active role card & show checkmark badge
  document.querySelectorAll(".clg-module-card, .role-card-btn").forEach(card => {
    const cardRole = card.getAttribute("data-role");
    const isActive = cardRole === role || (role === "student" && cardRole === "academic");
    card.classList.toggle("active", isActive);
  });

  const labelName = document.getElementById("labelLoginName");
  const labelPass = document.getElementById("labelLoginPass");
  const inputName = document.getElementById("loginNameInput");
  const inputPass = document.getElementById("loginPasswordInput");
  const iconName = document.getElementById("iconLoginName");
  const btnSubmitText = document.getElementById("btnSubmitText");
  const adminHint = document.getElementById("adminAutofillHint");

  // Keep input fields clean without pre-filling
  if (inputName) inputName.value = "";
  if (inputPass) inputPass.value = "";

  if (adminHint) {
    adminHint.style.display = (role === "admin") ? "block" : "none";
  }

  if (role === "admin") {
    if (labelName) labelName.textContent = "Administrator Username";
    if (inputName) inputName.placeholder = "Enter administrator username (suma)";
    if (labelPass) labelPass.textContent = "Security PIN";
    if (inputPass) {
      inputPass.placeholder = "Enter security PIN (581200)";
      inputPass.required = true;
    }
    if (iconName) iconName.className = "fa-solid fa-user-shield clg-input-prefix text-amber";
  } else if (role === "visitor") {
    if (labelName) labelName.textContent = "Visitor Name";
    if (inputName) inputName.placeholder = "Enter visitor full name";
    if (labelPass) labelPass.textContent = "Phone / Passcode";
    if (inputPass) {
      inputPass.placeholder = "Enter passcode";
      inputPass.required = false;
    }
    if (iconName) iconName.className = "fa-solid fa-person-walking-luggage clg-input-prefix text-green";
  } else if (role === "staff") {
    if (labelName) labelName.textContent = "Staff Name";
    if (inputName) inputName.placeholder = "Enter staff full name";
    if (labelPass) labelPass.textContent = "Password";
    if (inputPass) {
      inputPass.placeholder = "Enter password";
      inputPass.required = true;
    }
    if (iconName) iconName.className = "fa-solid fa-id-badge clg-input-prefix text-cyan";
  } else {
    // Student
    if (labelName) labelName.textContent = "Student Name";
    if (inputName) inputName.placeholder = "Enter student full name";
    if (labelPass) labelPass.textContent = "Password";
    if (inputPass) {
      inputPass.placeholder = "Enter password";
      inputPass.required = true;
    }
    if (iconName) iconName.className = "fa-regular fa-user clg-input-prefix text-primary";
  }

  // Always display simply 'Sign in'
  if (btnSubmitText) btnSubmitText.textContent = "Sign in";
}

function handleLoginNameInput(value) {
  // Live feedback handler
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById("pwEyeIcon") || document.getElementById("eyeIcon");
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    if (icon) {
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    }
  } else {
    input.type = "password";
    if (icon) {
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  }
}

function handleForgotPassword() {
  const role = currentSelectedLoginRole;
  if (role === "admin") {
    showToast("Admin 'suma' One-Time Password is: 581200", "info");
  } else if (role === "visitor") {
    showToast("Visitor entry does not require a password; enter your name to proceed.", "info");
  } else if (role === "staff") {
    showToast("Staff members can use their Staff ID / Employee code to sign in.", "info");
  } else {
    showToast("Students can use their Student ID / Roll Number (e.g. 2024CS101) to sign in.", "info");
  }
}

function handleUnifiedLoginSubmit() {
  const inputName = document.getElementById("loginNameInput");
  const inputPass = document.getElementById("loginPasswordInput");
  const enteredName = inputName?.value.trim() || "";
  const enteredPass = inputPass?.value.trim() || "";

  if (currentSelectedLoginRole === "admin") {
    if (!enteredName || !enteredPass) {
      showToast("Please enter both administrator username and PIN.", "warning");
      return;
    }

    // Administrator authentication: suma / 581200
    if (enteredName.toLowerCase() !== "suma" || enteredPass !== "581200") {
      showToast("Access Denied: Incorrect administrator username or PIN.", "alert");
      return;
    }

    AppState.currentUser = {
      role: "admin",
      name: "Suma",
      id: "admin_suma",
      dept: "Office of University Administration",
      roleTitle: "Master Administrator",
      initials: "SU"
    };
  } else if (currentSelectedLoginRole === "visitor") {
    if (!enteredName) {
      showToast("Please enter your name to continue as a visitor.", "warning");
      return;
    }

    const initials = enteredName
      .split(" ")
      .filter(Boolean)
      .map(n => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "VG";

    AppState.currentUser = {
      role: "visitor",
      name: enteredName,
      id: enteredPass || ("VISITOR-" + Math.floor(Math.random() * 900 + 100)),
      dept: "Campus Guest Access Pass",
      roleTitle: "Campus Visitor",
      initials: initials
    };
  } else if (currentSelectedLoginRole === "staff") {
    if (!enteredName) {
      showToast("Please enter your Staff / Faculty name.", "warning");
      return;
    }
    if (!enteredPass) {
      showToast("Please enter your Staff ID.", "warning");
      return;
    }

    const initials = enteredName
      .split(/[\s-]+/)
      .filter(Boolean)
      .map(n => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST";

    AppState.currentUser = {
      role: "faculty",
      name: enteredName,
      id: enteredPass,
      dept: "Department of Academic & Administrative Staff",
      roleTitle: "Staff / Faculty",
      initials: initials
    };
  } else {
    // Student Module
    if (!enteredName) {
      showToast("Please enter your Student Name.", "warning");
      return;
    }
    if (!enteredPass) {
      showToast("Please enter your Student ID / Roll Number.", "warning");
      return;
    }

    const initials = enteredName
      .split(/[\s-]+/)
      .filter(Boolean)
      .map(n => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST";

    AppState.currentUser = {
      role: "student",
      name: enteredName,
      id: enteredPass,
      dept: "School of Computing & Engineering",
      roleTitle: "Student",
      initials: initials
    };
  }

  completeLogin();
}

function completeLogin() {
  try {
    sessionStorage.setItem("campusnav_user", JSON.stringify(AppState.currentUser));
  } catch (e) {}

  applyUserProfile();
  document.getElementById("loginScreen")?.classList.add("dismissed");
  showToast(`Welcome back, ${AppState.currentUser.name}! (${AppState.currentUser.roleTitle}) 👋`, "success");
}

function handleLogout() {
  try {
    sessionStorage.removeItem("campusnav_user");
    localStorage.removeItem("campusnav_user");
  } catch (e) {}

  AppState.currentUser = null;

  // Clear inputs - never leave automatic values
  const inputName = document.getElementById("loginNameInput");
  const inputPass = document.getElementById("loginPasswordInput");
  if (inputName) inputName.value = "";
  if (inputPass) inputPass.value = "";

  // Strictly hide admin tools for non-admin/logout
  document.getElementById("navAddBlock")?.classList.add("hidden");
  document.getElementById("btnHeaderAddBlock")?.classList.add("hidden");
  document.getElementById("navDeclareNotif")?.classList.add("hidden");
  document.getElementById("adminNotifComposer")?.classList.add("hidden");

  selectLoginRole("student");
  document.getElementById("loginScreen")?.classList.remove("dismissed");
  showToast("Session reset and logged out.", "info");
}

function selectCampusBranch(branchKey, targetLocId) {
  // Highlight active branch button
  document.querySelectorAll(".branch-item").forEach(item => {
    item.classList.toggle("active", item.getAttribute("data-branch") === branchKey);
  });

  const branchMap = {
    ds: { name: "Data Science & AI Hub", loc: "loc-intel-joe", sub: "Intel JOE & E-Learning Center (AI & Cloud Labs)" },
    cs: { name: "Computer Science & IT (SOCI)", loc: "loc-adhiharam", sub: "Adhiharam Block & Francis Block" },
    civil: { name: "Civil & Structural Engineering", loc: "loc-tech-block", sub: "Technology Block (CIVIL LAB)" },
    mech: { name: "Mechanical & Automobile Engineering", loc: "loc-tech-block", sub: "Technology Block (MECH / AUTO LAB)" },
    pharmacy: { name: "School of Pharmacy (SOP)", loc: "loc-gino", sub: "GINO SOP & Drug Chemistry Labs" },
    nursing: { name: "School of Nursing & Health (SON)", loc: "loc-soosai", sub: "Soosai A, Soosai B, & Selvam Blocks" },
    agri: { name: "School of Agriculture & Food (SOAG)", loc: "loc-soag", sub: "Joshuva SOAG Block & Soil Science" },
    law: { name: "School of Legal Studies (SOLHS)", loc: "loc-raja", sub: "S A RAJA Memorial Block & Moot Court" }
  };

  const branch = branchMap[branchKey];
  if (branch) {
    showToast(`📍 Selected Branch: ${branch.name} • ${branch.sub}`, "info");
    const locId = targetLocId || branch.loc;
    if (locId) {
      handleLocationSelect(locId);
    }
  }
}

function applyUserProfile() {
  const u = AppState.currentUser || {
    role: "student",
    name: "Campus User",
    roleTitle: "Student • Campus Member",
    initials: ""
  };
  
  const sbName = document.getElementById("sidebarUserName");
  const sbRole = document.getElementById("sidebarUserRole");
  const sbBranch = document.getElementById("sidebarUserBranch");
  const sbAvatar = document.getElementById("sidebarUserAvatar");
  const navAdmin = document.getElementById("navAdminPanel");
  const btnHdAdmin = document.getElementById("btnHeaderAdminPanel");
  const drawerAdminBar = document.getElementById("drawerAdminBar");

  if (sbName) sbName.textContent = u.name;
  if (sbRole) sbRole.textContent = u.roleTitle;

  if (sbBranch) {
    if (u.role === "admin") {
      sbBranch.innerHTML = `<i class="fa-solid fa-user-shield"></i> Administration Master`;
      sbBranch.style.color = "#FBBF24";
      sbBranch.style.background = "rgba(245, 158, 11, 0.15)";
      sbBranch.style.borderColor = "rgba(245, 158, 11, 0.3)";
    } else if (u.role === "faculty") {
      sbBranch.innerHTML = `<i class="fa-solid fa-chalkboard-user"></i> Faculty • Computer Science`;
      sbBranch.style.color = "#38BDF8";
      sbBranch.style.background = "rgba(2, 132, 199, 0.15)";
      sbBranch.style.borderColor = "rgba(56, 189, 248, 0.3)";
    } else if (u.role === "visitor") {
      sbBranch.innerHTML = `<i class="fa-solid fa-person-walking"></i> Campus Guest Pass`;
      sbBranch.style.color = "#34D399";
      sbBranch.style.background = "rgba(16, 185, 129, 0.15)";
      sbBranch.style.borderColor = "rgba(52, 211, 153, 0.3)";
    } else {
      sbBranch.innerHTML = `<i class="fa-solid fa-brain"></i> B.Tech Data Science &amp; AI`;
      sbBranch.style.color = "#C084FC";
      sbBranch.style.background = "rgba(139, 92, 246, 0.15)";
      sbBranch.style.borderColor = "rgba(192, 132, 252, 0.3)";
    }
  }

  const isAdmin = !!(AppState.currentUser && AppState.currentUser.role === "admin");
  document.getElementById("navAddBlock")?.classList.toggle("hidden", !isAdmin);
  document.getElementById("btnHeaderAddBlock")?.classList.toggle("hidden", !isAdmin);
  const navDeclareNotif = document.getElementById("navDeclareNotif");
  if (navDeclareNotif) navDeclareNotif.classList.toggle("hidden", !isAdmin);

  // Admin Notification Composer
  const adminNotifComposer = document.getElementById("adminNotifComposer");
  if (adminNotifComposer) adminNotifComposer.classList.toggle("hidden", !isAdmin);

  if (sbAvatar) {
    if (u.role === "admin") {
      sbAvatar.innerHTML = `<i class="fa-solid fa-user-shield"></i>`;
      sbAvatar.style.background = "#D97706";
    } else if (u.role === "faculty") {
      sbAvatar.innerHTML = `<i class="fa-solid fa-chalkboard-user"></i>`;
      sbAvatar.style.background = "#0284C7";
    } else if (u.role === "visitor") {
      sbAvatar.innerHTML = `<i class="fa-solid fa-street-view"></i>`;
      sbAvatar.style.background = "#059669";
    } else {
      sbAvatar.innerHTML = `<i class="fa-solid fa-user-graduate"></i>`;
      sbAvatar.style.background = "#2563EB";
    }
  }
}

// ==========================================================================
// 5B. ADMIN CONTROL PANEL & BUILDING EDITOR SUITE
// ==========================================================================

function openAdminAddBlockModal(tab = "create") {
  const modal = document.getElementById("adminAddBlockModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  switchAdminAddBlockTab(tab);
}

function closeAdminAddBlockModal() {
  document.getElementById("adminAddBlockModal")?.classList.add("hidden");
}

function openAdminPanel(targetLocIdOrTab) {
  openAdminAddBlockModal(targetLocIdOrTab === "manage-blocks" ? "manage" : "create");
}

function closeAdminPanel() {
  closeAdminAddBlockModal();
}

function switchAdminAddBlockTab(tab) {
  const btnCreate = document.getElementById("tabBtnCreateBlock");
  const btnManage = document.getElementById("tabBtnManageBlocks");
  const paneCreate = document.getElementById("paneCreateBlock");
  const paneManage = document.getElementById("paneManageCustomBlocks");

  if (tab === "create") {
    btnCreate?.classList.add("active");
    btnManage?.classList.remove("active");
    paneCreate?.classList.remove("hidden");
    paneManage?.classList.add("hidden");
  } else {
    btnCreate?.classList.remove("active");
    btnManage?.classList.add("active");
    paneCreate?.classList.add("hidden");
    paneManage?.classList.remove("hidden");
    renderCustomBlocksManagerList();
  }
}

function switchAdminTab(tabName) {
  switchAdminAddBlockTab(tabName === "manage-blocks" ? "manage" : "create");
}

function populateAdminBuildingSelect(selectedId) {
  const select = document.getElementById("adminSelectBuilding");
  if (!select) return;
  select.innerHTML = "";

  CAMPUS_LOCATIONS.forEach(loc => {
    const opt = document.createElement("option");
    opt.value = loc.id;
    opt.textContent = `${loc.name} (${loc.code})${loc.isCustom ? ' ⭐ [Custom Block]' : ''}`;
    if (selectedId && loc.id === selectedId) opt.selected = true;
    select.appendChild(opt);
  });

  const activeId = selectedId || select.value || (CAMPUS_LOCATIONS[0] ? CAMPUS_LOCATIONS[0].id : "");
  if (activeId) loadBuildingDataIntoEditor(activeId);
}

function loadBuildingDataIntoEditor(locId) {
  const loc = CAMPUS_LOCATIONS.find(l => l.id === locId);
  if (!loc) return;

  const nameInput = document.getElementById("editBuildingName");
  const codeInput = document.getElementById("editBuildingCode");
  const catInput = document.getElementById("editBuildingCategory");
  const statusInput = document.getElementById("editBuildingStatus");
  const hoursInput = document.getElementById("editBuildingHours");
  const contactInput = document.getElementById("editBuildingContact");
  const descInput = document.getElementById("editBuildingDesc");
  const facInput = document.getElementById("editBuildingFacilities");
  const themeInput = document.getElementById("editBuildingTheme");
  const colorInput = document.getElementById("editBuildingColor");

  if (nameInput) nameInput.value = loc.name || "";
  if (codeInput) codeInput.value = loc.code || "";
  if (catInput) catInput.value = loc.category || "academic";
  if (statusInput) statusInput.value = loc.status || "open";
  if (hoursInput) hoursInput.value = loc.openingHours || "";
  if (contactInput) contactInput.value = loc.contact || "";
  if (descInput) descInput.value = loc.description || "";
  if (facInput) facInput.value = (loc.facilities || []).join(", ");
  if (themeInput) themeInput.value = loc.theme || getThemeForLocation(loc);
  if (colorInput) colorInput.value = loc.color || "#1E40AF";

  updateLiveBuildingPreview();
}

function getThemeForLocation(loc) {
  if (loc.theme) return loc.theme;
  if (loc.id === "loc-admin") return "admin_pillars";
  if (loc.id === "loc-intel-joe") return "intel_rotunda";
  if (loc.id === "loc-arul-mess") return "dining_hall";
  if (loc.id === "loc-auditorium") return "auditorium_stage";
  if (loc.id === "loc-sac") return "sac_activity";
  if (loc.id === "loc-tech-block") return "tech_labs";
  if (loc.id === "loc-health") return "health_clinic";
  if (loc.id === "loc-lawns-church") return "chapel_lawns";
  if (loc.id === "loc-teresa-grace") return "hostel_towers";
  if (loc.id === "loc-arch") return "arch_monument";
  if (loc.id && loc.id.startsWith("loc-gate")) return "gate_entrance";
  return "intel_rotunda";
}

function updateLiveBuildingPreview() {
  const name = document.getElementById("editBuildingName")?.value || "Building Name";
  const color = document.getElementById("editBuildingColor")?.value || "#1E40AF";
  const theme = document.getElementById("editBuildingTheme")?.value || "admin_pillars";
  const status = document.getElementById("editBuildingStatus")?.value || "open";

  const hero = document.getElementById("adminPreviewHero");
  const title = document.getElementById("adminPreviewTitle");
  const badge = document.getElementById("adminPreviewBadge");

  if (hero) hero.style.background = `linear-gradient(135deg, ${color} 0%, #0F172A 100%)`;
  if (title) title.textContent = name;
  if (badge) badge.textContent = `Status: ${status.toUpperCase()}`;
}

function saveBuildingEdits() {
  const select = document.getElementById("adminSelectBuilding");
  const locId = select ? select.value : "";
  const loc = CAMPUS_LOCATIONS.find(l => l.id === locId);
  if (!loc) return;

  loc.name = document.getElementById("editBuildingName").value.trim();
  loc.code = document.getElementById("editBuildingCode").value.trim();
  loc.category = document.getElementById("editBuildingCategory").value;
  loc.status = document.getElementById("editBuildingStatus").value;
  loc.openingHours = document.getElementById("editBuildingHours").value.trim();
  loc.contact = document.getElementById("editBuildingContact").value.trim();
  loc.description = document.getElementById("editBuildingDesc").value.trim();
  loc.theme = document.getElementById("editBuildingTheme").value;
  loc.color = document.getElementById("editBuildingColor").value;

  const facText = document.getElementById("editBuildingFacilities").value;
  loc.facilities = facText.split(",").map(s => s.trim()).filter(Boolean);

  // Refresh map place name labels, custom blocks, and markers
  renderCustomBlocksLayer();
  renderHotspotsLayer();
  populateDropdowns();
  saveCustomLocationsToStorage();

  // If this building is open in Location Drawer, refresh it immediately
  if (AppState.selectedLocation && AppState.selectedLocation.id === loc.id) {
    handleLocationSelect(loc.id);
  }

  showToast(`Building '${loc.name}' updated live by Admin! ✅`, "success");
}

function revertCurrentBuildingEdits() {
  const select = document.getElementById("adminSelectBuilding");
  const locId = select ? select.value : "";
  if (locId) loadBuildingDataIntoEditor(locId);
  showToast("Reverted building fields to previous state.", "info");
}

/**
 * Handle Admin Adding a New Campus Block
 */
function handleAddNewLocation() {
  const nameInput = document.getElementById("newLocName");
  const codeInput = document.getElementById("newLocCode");
  const name = nameInput?.value.trim() || "";
  const code = codeInput?.value.trim() || "";

  if (!name || !code) {
    showToast("Please provide both Block Name and unique Block Code.", "warning");
    return;
  }

  const category = document.getElementById("newLocCategory")?.value || "academic";
  const icon = document.getElementById("newLocIcon")?.value || "fa-building";
  const x = parseInt(document.getElementById("newLocX")?.value) || 450;
  const y = parseInt(document.getElementById("newLocY")?.value) || 500;
  const width = parseInt(document.getElementById("newLocWidth")?.value) || 95;
  const height = parseInt(document.getElementById("newLocHeight")?.value) || 52;
  const theme = document.getElementById("newLocTheme")?.value || "intel_rotunda";
  const color = document.getElementById("newLocColor")?.value || "#2563EB";
  const hours = document.getElementById("newLocHours")?.value.trim() || "08:00 AM – 08:00 PM";
  const contact = document.getElementById("newLocContact")?.value.trim() || "Admin Ext. 350";
  const desc = document.getElementById("newLocDesc")?.value.trim() || `${name} facility on university campus.`;
  const facText = document.getElementById("newLocFacilities")?.value || "High-Speed Wi-Fi, Restrooms, Drinking Water";
  const floorsText = document.getElementById("newLocFloors")?.value || "Ground Floor: Reception, General Hall";
  const isAccessible = document.getElementById("newLocAccessible")?.checked ?? true;

  const categoryLabels = {
    academic: "Academic Block",
    amenities: "Dining & Canteen",
    living: "Student Residence",
    health: "Healthcare & Safety",
    sports: "Sports Complex",
    admin: "Administrative Block",
    gates: "Campus Entrance Gate"
  };
  const categoryLabel = categoryLabels[category] || "Campus Facility";

  // Parse floors and rooms
  const parsedFloors = [];
  if (floorsText) {
    const floorSegments = floorsText.split(";").map(s => s.trim()).filter(Boolean);
    floorSegments.forEach(seg => {
      const parts = seg.split(":");
      if (parts.length >= 2) {
        const floorName = parts[0].trim();
        const rooms = parts[1].split(",").map(r => r.trim()).filter(Boolean);
        parsedFloors.push({ floorName, rooms });
      } else {
        parsedFloors.push({ floorName: "Main Level", rooms: [seg] });
      }
    });
  }
  if (parsedFloors.length === 0) {
    parsedFloors.push({ floorName: "Ground Floor", rooms: [`${code}-101`, `${code}-Lab 1`] });
  }

  const facilities = facText.split(",").map(s => s.trim()).filter(Boolean);
  const accessibleFeatures = isAccessible ? ["Level Paved Entry", "Direct Wheelchair Ramp Access", "Stair-Free Entry"] : [];

  const newId = `loc-custom-${Date.now()}`;
  const newLocation = {
    id: newId,
    name: name,
    code: code,
    category: category,
    categoryLabel: categoryLabel,
    coords: { x: x, y: y },
    shape: { 
      x: Math.round(x - width / 2), 
      y: Math.round(y - height / 2), 
      width: width, 
      height: height, 
      rx: 6 
    },
    color: color,
    icon: icon,
    theme: theme,
    status: "open",
    openingHours: hours,
    contact: contact,
    description: desc,
    facilities: facilities,
    accessibleFeatures: accessibleFeatures,
    floors: parsedFloors,
    isPopular: true,
    isCustom: true,
    createdAt: new Date().toISOString()
  };

  // Add to campus locations array
  CAMPUS_LOCATIONS.push(newLocation);

  // Connect to Dijkstra walkway graph
  connectLocationToWalkwayGraph(newLocation);

  // Persist to localStorage
  saveCustomLocationsToStorage();

  // Re-render UI, map, dropdowns
  renderCustomBlocksLayer();
  renderHotspotsLayer();
  populateDropdowns();
  populateAdminBuildingSelect(newId);
  renderCustomBlocksManagerList();

  // Close modal and focus on the new block
  closeAdminAddBlockModal();
  handleLocationSelect(newId);

  // If user pulse placement marker exists, clear it
  document.getElementById("tempPlacementMarker")?.remove();

  showToast(`🎉 New block '${name}' (${code}) added and active on interactive campus map!`, "success");
}

/**
 * Storage & Graph Management for Custom Blocks
 */
function saveCustomLocationsToStorage() {
  try {
    const customList = CAMPUS_LOCATIONS.filter(l => l.isCustom);
    localStorage.setItem("campusnav_custom_blocks", JSON.stringify(customList));
  } catch (e) {
    console.warn("Could not save custom blocks to localStorage", e);
  }
}

function loadCustomLocationsFromStorage() {
  try {
    const raw = localStorage.getItem("campusnav_custom_blocks");
    if (!raw) return;
    const list = JSON.parse(raw);
    if (Array.isArray(list)) {
      list.forEach(item => {
        if (!CAMPUS_LOCATIONS.some(l => l.id === item.id)) {
          CAMPUS_LOCATIONS.push(item);
        }
        connectLocationToWalkwayGraph(item);
      });
    }
  } catch (e) {
    console.warn("Could not load custom blocks from localStorage", e);
  }
}

function connectLocationToWalkwayGraph(loc) {
  if (!loc || !loc.coords) return;
  const { x, y } = loc.coords;
  let closestNode = "W_GATE1";
  let minDist = Infinity;
  Object.entries(WALKWAY_NODES).forEach(([nodeKey, node]) => {
    const d = Math.hypot(node.x - x, node.y - y);
    if (d < minDist) {
      minDist = d;
      closestNode = nodeKey;
    }
  });
  LOCATION_NODE_MAP[loc.id] = closestNode;
}

function deleteCustomBlock(locId) {
  const idx = CAMPUS_LOCATIONS.findIndex(l => l.id === locId);
  if (idx === -1) return;
  const loc = CAMPUS_LOCATIONS[idx];

  if (!confirm(`Are you sure you want to delete the campus block '${loc.name}' (${loc.code})?`)) {
    return;
  }

  CAMPUS_LOCATIONS.splice(idx, 1);
  delete LOCATION_NODE_MAP[locId];

  saveCustomLocationsToStorage();

  // If drawer is open on this block, close it
  if (AppState.selectedLocation && AppState.selectedLocation.id === locId) {
    document.getElementById("locationDrawerBackdrop")?.classList.add("hidden");
    AppState.selectedLocation = null;
  }

  renderCustomBlocksLayer();
  renderHotspotsLayer();
  populateDropdowns();
  populateAdminBuildingSelect();
  renderCustomBlocksManagerList();

  showToast(`Block '${loc.name}' removed from campus map.`, "info");
}

function handleDeleteCurrentBlock() {
  if (AppState.selectedLocation && AppState.selectedLocation.isCustom) {
    deleteCustomBlock(AppState.selectedLocation.id);
  } else {
    showToast("Default blueprint campus buildings cannot be deleted. You can edit their parameters in Admin Editor.", "warning");
  }
}

function renderCustomBlocksManagerList() {
  const container = document.getElementById("customBlocksManageContainer");
  if (!container) return;

  const customBlocks = CAMPUS_LOCATIONS.filter(l => l.isCustom);
  if (customBlocks.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:30px 16px; background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:12px;">
        <i class="fa-solid fa-layer-group" style="font-size:2rem; color:#94A3B8; margin-bottom:8px;"></i>
        <h4 style="margin:0 0 4px; color:#334155; font-size:0.9rem;">No Custom Blocks Added Yet</h4>
        <p style="margin:0 0 14px; font-size:0.76rem; color:#64748B;">Use the 'Create New Block' tab to place new academic buildings, research centers or facilities.</p>
        <button type="button" class="btn-submit-add-block" style="margin:0 auto; padding:6px 14px; font-size:0.8rem;" onclick="switchAdminAddBlockTab('create')">
          <i class="fa-solid fa-plus-circle"></i> Add First Campus Block
        </button>
      </div>
    `;
    return;
  }

  let html = "";
  customBlocks.forEach(loc => {
    html += `
      <div class="custom-block-manage-card">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:40px; height:40px; border-radius:8px; background:${loc.color}; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0;">
            <i class="fa-solid ${loc.icon || 'fa-building'}"></i>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <strong style="color:var(--text-heading); font-size:0.88rem;">${escapeHtml(loc.name)}</strong>
              <span style="font-size:0.68rem; font-weight:700; background:rgba(2,132,199,0.1); color:#0284C7; padding:2px 6px; border-radius:4px;">${escapeHtml(loc.code)}</span>
            </div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;">
              ${escapeHtml(loc.categoryLabel)} • Coords: (${loc.coords.x}, ${loc.coords.y}) • ${loc.floors ? loc.floors.length : 1} Floor(s)
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="coord-chip" onclick="closeAdminAddBlockModal(); handleLocationSelect('${loc.id}');" title="View details and highlight on map">
            <i class="fa-solid fa-map-pin"></i> View
          </button>
          <button type="button" class="btn-delete-notif" onclick="deleteCustomBlock('${loc.id}')" title="Delete this block">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Interactive Map Coordinate Placement
 */
function startMapCoordinatePicker() {
  closeAdminAddBlockModal();
  AppState.isMapCoordinatePicking = true;

  const hud = document.getElementById("mapCoordPickerHud");
  if (hud) hud.classList.remove("hidden");

  const viewport = document.getElementById("mapViewport");
  if (viewport) viewport.classList.add("picking-active");

  showToast("Map placement active: click anywhere on the campus map canvas 🎯", "info");

  // Ensure map is visible
  const navMap = document.getElementById("navMap");
  if (navMap) navMap.click();

  const svg = document.getElementById("campusSvg");
  if (svg) {
    svg.addEventListener("click", onMapCoordinatePicked, { once: true });
  }
}

function onMapCoordinatePicked(evt) {
  if (!AppState.isMapCoordinatePicking) return;
  AppState.isMapCoordinatePicking = false;

  const hud = document.getElementById("mapCoordPickerHud");
  if (hud) hud.classList.add("hidden");

  const viewport = document.getElementById("mapViewport");
  if (viewport) viewport.classList.remove("picking-active");

  const svg = document.getElementById("campusSvg");
  let x = 450, y = 500;
  if (svg) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    x = Math.round(Math.max(30, Math.min(785, svgP.x)));
    y = Math.round(Math.max(30, Math.min(994, svgP.y)));
  }

  const xInput = document.getElementById("newLocX");
  const yInput = document.getElementById("newLocY");
  const dispX = document.getElementById("displayCoordX");
  const dispY = document.getElementById("displayCoordY");

  if (xInput) xInput.value = x;
  if (yInput) yInput.value = y;
  if (dispX) dispX.textContent = x;
  if (dispY) dispY.textContent = y;

  showTempPlacementMarker(x, y);

  openAdminAddBlockModal("create");
  showToast(`Coordinates set to (${x}, ${y})! Fill block details and save. 📍`, "success");
}

function cancelMapCoordinatePicker() {
  AppState.isMapCoordinatePicking = false;
  const hud = document.getElementById("mapCoordPickerHud");
  if (hud) hud.classList.add("hidden");
  const viewport = document.getElementById("mapViewport");
  if (viewport) viewport.classList.remove("picking-active");
  const svg = document.getElementById("campusSvg");
  if (svg) {
    svg.removeEventListener("click", onMapCoordinatePicked);
  }
  openAdminAddBlockModal("create");
}

function applyCoordinatePreset(x, y, name) {
  const xInput = document.getElementById("newLocX");
  const yInput = document.getElementById("newLocY");
  const dispX = document.getElementById("displayCoordX");
  const dispY = document.getElementById("displayCoordY");

  if (xInput) xInput.value = x;
  if (yInput) yInput.value = y;
  if (dispX) dispX.textContent = x;
  if (dispY) dispY.textContent = y;

  showTempPlacementMarker(x, y);
  showToast(`Preset chosen: ${name} (${x}, ${y})`, "info");
}

function showTempPlacementMarker(x, y) {
  const layer = document.getElementById("userPulseLayer");
  if (!layer) return;
  const existing = document.getElementById("tempPlacementMarker");
  if (existing) existing.remove();

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.id = "tempPlacementMarker";
  g.setAttribute("transform", `translate(${x}, ${y})`);
  g.innerHTML = `
    <circle cx="0" cy="0" r="26" fill="#F59E0B" opacity="0.35" class="user-pulse-ring"/>
    <circle cx="0" cy="0" r="14" fill="#F59E0B" stroke="#FFFFFF" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="5" fill="#FFFFFF"/>
    <text x="0" y="-18" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="#B45309" text-anchor="middle">NEW BLOCK POSITION</text>
  `;
  layer.appendChild(g);

  setTimeout(() => {
    document.getElementById("tempPlacementMarker")?.remove();
  }, 10000);
}

/**
 * Render Dynamic Custom Campus Blocks Layer in SVG
 */
function renderCustomBlocksLayer() {
  const container = document.getElementById("customBlocksLayer");
  if (!container) return;

  const customLocs = CAMPUS_LOCATIONS.filter(l => l.isCustom);
  let html = "";

  customLocs.forEach(loc => {
    const s = loc.shape || { x: loc.coords.x - 45, y: loc.coords.y - 25, width: 95, height: 52, rx: 6 };
    const col = loc.color || "#2563EB";
    const name = escapeHtml(loc.name);
    const code = escapeHtml(loc.code || "BLOCK");
    const catLabel = escapeHtml(loc.categoryLabel || loc.category || "");

    html += `
      <g class="svg-bp-block custom-campus-block" id="block-${loc.id}" onclick="handleLocationSelect('${loc.id}')" style="cursor: pointer;">
        <!-- Base Building Box -->
        <rect 
          x="${s.x}" y="${s.y}" 
          width="${s.width}" height="${s.height}" 
          rx="${s.rx || 6}" 
          fill="#FFFFFF" 
          stroke="${col}" 
          stroke-width="2.2" 
          filter="url(#buildingShadow)"
          class="custom-block-rect"
        />
        <!-- Top color accent stripe -->
        <rect x="${s.x}" y="${s.y}" width="${s.width}" height="5" rx="2" fill="${col}"/>
        <!-- Building Code Tag Pill -->
        <rect x="${s.x + 5}" y="${s.y + 8}" width="${Math.min(s.width - 10, 44)}" height="13" rx="3" fill="${col}" opacity="0.15"/>
        <text x="${s.x + 8}" y="${s.y + 17}" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="800" fill="${col}">${code}</text>
        <!-- Building Name Text -->
        <text x="${s.x + s.width / 2}" y="${s.y + s.height / 2 + 7}" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#0F172A" text-anchor="middle">
          ${name}
        </text>
        <!-- Category Subtext -->
        <text x="${s.x + s.width / 2}" y="${s.y + s.height - 5}" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="600" fill="#64748B" text-anchor="middle">
          ${catLabel}
        </text>
      </g>
    `;
  });

  container.innerHTML = html;
}

function handleAdminNoticeUpdate() {
  const noticeInput = document.getElementById("adminNoticeInput");
  const alertInput = document.getElementById("adminBroadcastAlert");
  const bannerText = document.getElementById("bannerNoticeText");

  if (noticeInput && bannerText) {
    bannerText.textContent = noticeInput.value;
  }

  if (alertInput && alertInput.value.trim()) {
    showToast(`📢 Admin Broadcast: ${alertInput.value.trim()}`, "alert");
    alertInput.value = "";
  }

  showToast("Campus Notice Banner updated live across all sessions! 📣", "success");
}

function setCampusGlobalStatus(status) {
  const dot = document.getElementById("sidebarStatusDot");
  const title = document.getElementById("sidebarStatusTitle");
  const sub = document.getElementById("sidebarStatusSub");

  document.querySelectorAll(".btn-status-toggle").forEach(btn => btn.classList.remove("active"));
  event?.currentTarget?.classList.add("active");

  if (status === "exam") {
    if (dot) dot.className = "status-dot blue";
    if (title) title.textContent = "Campus Status: Exam Session";
    if (sub) sub.textContent = "Silent zones in effect • Academic blocks restricted to pass holders";
    showToast("Campus mode changed to Exam Session (Silence Zone Active)", "info");
  } else if (status === "emergency") {
    if (dot) dot.className = "status-dot red";
    if (title) title.textContent = "Campus Status: Emergency Drill Active";
    if (sub) sub.textContent = "All gates open for evacuation • Healthcare services on high alert";
    showToast("Campus Emergency Drill Mode Activated!", "alert");
  } else {
    if (dot) dot.className = "status-dot green";
    if (title) title.textContent = "Campus Status: Open";
    if (sub) sub.textContent = "Gates 1–5 Active • Shuttle Running • Official Blueprint Live";
    showToast("Campus operational status reset to Normal / Open.", "success");
  }
}

function resetAllCampusDataToDefault() {
  if (confirm("Reset all modified building details and notices to the official default blueprint?")) {
    sessionStorage.clear();
    location.reload();
  }
}

function openAdminEditorForCurrentBuilding() {
  if (AppState.selectedLocation) {
    openAdminPanel(AppState.selectedLocation.id);
  } else {
    openAdminPanel();
  }
}

// ==========================================================================
// 5C. ARCHITECTURAL BLOCK PICTURES & VISUAL ARTWORK GENERATOR
// ==========================================================================

function getBuildingVisualArtwork(theme, color = "#1E40AF", name = "") {
  const primary = color;
  const secondary = "#0F172A";

  if (theme === "admin_pillars") {
    return `
      <svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#E0F2FE"/></linearGradient>
          <linearGradient id="bldgGrad1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${primary}"/><stop offset="100%" stop-color="#1E293B"/></linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#sky1)"/>
        <!-- Trees in background -->
        <circle cx="40" cy="140" r="28" fill="#15803D" opacity="0.8"/>
        <circle cx="360" cy="140" r="28" fill="#15803D" opacity="0.8"/>
        <!-- Main Admin Complex -->
        <rect x="60" y="70" width="280" height="110" rx="4" fill="url(#bldgGrad1)"/>
        <!-- Grand Neoclassical Pediment Roof -->
        <polygon points="200,20 110,70 290,70" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="200" cy="50" r="10" fill="${primary}"/>
        <!-- Clock Tower Dial -->
        <circle cx="200" cy="50" r="7" fill="#FFFFFF"/>
        <line x1="200" y1="50" x2="200" y2="46" stroke="#0F172A" stroke-width="1.5"/>
        <line x1="200" y1="50" x2="203" y2="50" stroke="#0F172A" stroke-width="1.5"/>
        <!-- Classical Ionic Columns -->
        <rect x="130" y="70" width="12" height="105" fill="#FFFFFF"/>
        <rect x="160" y="70" width="12" height="105" fill="#FFFFFF"/>
        <rect x="190" y="70" width="12" height="105" fill="#FFFFFF"/>
        <rect x="220" y="70" width="12" height="105" fill="#FFFFFF"/>
        <rect x="250" y="70" width="12" height="105" fill="#FFFFFF"/>
        <!-- Windows Grid -->
        <rect x="75" y="85" width="22" height="26" rx="2" fill="#BAE6FD"/><rect x="75" y="125" width="22" height="26" rx="2" fill="#BAE6FD"/>
        <rect x="300" y="85" width="22" height="26" rx="2" fill="#BAE6FD"/><rect x="300" y="125" width="22" height="26" rx="2" fill="#BAE6FD"/>
        <!-- Front Plaza Steps -->
        <rect x="30" y="175" width="340" height="25" fill="#94A3B8"/>
        <rect x="20" y="185" width="360" height="15" fill="#64748B"/>
      </svg>
    `;
  } else if (theme === "intel_rotunda") {
    return `
      <svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6366F1"/><stop offset="100%" stop-color="#E0E7FF"/></linearGradient>
          <linearGradient id="glassRotunda" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0284C7"/><stop offset="50%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#0369A1"/></linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#sky2)"/>
        <!-- High-tech Grid Background -->
        <ellipse cx="200" cy="130" rx="140" ry="40" fill="#CBD5E1"/>
        <!-- Main Circular Glass Rotunda -->
        <ellipse cx="200" cy="120" rx="90" ry="45" fill="url(#glassRotunda)"/>
        <rect x="110" y="55" width="180" height="65" fill="url(#glassRotunda)"/>
        <ellipse cx="200" cy="55" rx="90" ry="30" fill="#7DD3FC"/>
        <!-- Geometric Glass Panelling Lines -->
        <line x1="140" y1="55" x2="140" y2="120" stroke="#FFFFFF" stroke-width="2" opacity="0.8"/>
        <line x1="170" y1="55" x2="170" y2="120" stroke="#FFFFFF" stroke-width="2" opacity="0.8"/>
        <line x1="200" y1="55" x2="200" y2="120" stroke="#FFFFFF" stroke-width="2" opacity="0.8"/>
        <line x1="230" y1="55" x2="230" y2="120" stroke="#FFFFFF" stroke-width="2" opacity="0.8"/>
        <line x1="260" y1="55" x2="260" y2="120" stroke="#FFFFFF" stroke-width="2" opacity="0.8"/>
        <!-- Dome Halo -->
        <ellipse cx="200" cy="55" rx="70" ry="20" fill="#FFFFFF" opacity="0.6"/>
        <text x="200" y="100" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">INTEL JOE AI HUB</text>
        <rect x="10" y="170" width="380" height="30" fill="#475569"/>
      </svg>
    `;
  } else if (theme === "dining_hall") {
    return `
      <svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="200" fill="#FEF3C7"/>
        <rect x="50" y="60" width="300" height="115" rx="8" fill="#059669"/>
        <!-- Modern Sloped Overhang Roof -->
        <polygon points="30,60 370,40 370,60 30,80" fill="#047857"/>
        <!-- Cafe Glass Windows -->
        <rect x="70" y="90" width="60" height="60" rx="4" fill="#A7F3D0"/>
        <rect x="145" y="90" width="60" height="60" rx="4" fill="#A7F3D0"/>
        <rect x="220" y="90" width="60" height="60" rx="4" fill="#A7F3D0"/>
        <rect x="295" y="90" width="40" height="85" rx="4" fill="#F8FAFC"/>
        <text x="200" y="32" font-size="14" font-weight="900" fill="#065F46" text-anchor="middle">ARUL CAMPUS DINING COMMONS</text>
        <rect x="0" y="175" width="400" height="25" fill="#64748B"/>
      </svg>
    `;
  } else if (theme === "auditorium_stage") {
    return `
      <svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="200" fill="#FFFBEB"/>
        <polygon points="50,175 90,50 310,50 350,175" fill="#D97706"/>
        <polygon points="90,50 200,20 310,50" fill="#B45309"/>
        <!-- Grand Entrance Arches -->
        <path d="M120,175 A25,35 0 0,1 170,175 Z" fill="#FEF3C7"/>
        <path d="M175,175 A25,45 0 0,1 225,175 Z" fill="#FEF3C7"/>
        <path d="M230,175 A25,35 0 0,1 280,175 Z" fill="#FEF3C7"/>
        <text x="200" y="90" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle">CONVENTIONAL HALL AUDITORIUM</text>
        <rect x="0" y="175" width="400" height="25" fill="#78350F"/>
      </svg>
    `;
  } else if (theme === "chapel_lawns") {
    return `
      <svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="200" fill="#DCFCE7"/>
        <!-- Gothic Chapel Tower & Nave -->
        <polygon points="120,175 120,80 280,80 280,175" fill="#78350F"/>
        <polygon points="100,80 200,30 300,80" fill="#451A03"/>
        <!-- Belfry Spire -->
        <polygon points="180,30 200,2 220,30" fill="#B45309"/>
        <!-- Cross -->
        <rect x="198" y="-8" width="4" height="16" fill="#D97706"/>
        <rect x="194" y="-4" width="12" height="4" fill="#D97706"/>
        <!-- Stained Glass Window -->
        <path d="M180,130 A20,30 0 0,1 220,130 Z" fill="#38BDF8" stroke="#FDE68A" stroke-width="2"/>
        <!-- Rose Garden bushes -->
        <circle cx="70" cy="165" r="22" fill="#16A34A"/><circle cx="70" cy="160" r="6" fill="#E11D48"/>
        <circle cx="330" cy="165" r="22" fill="#16A34A"/><circle cx="330" cy="160" r="6" fill="#E11D48"/>
        <rect x="0" y="175" width="400" height="25" fill="#15803D"/>
      </svg>
    `;
  } else if (theme === "health_clinic") {
    return `
      <svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="200" fill="#EFF6FF"/>
        <rect x="60" y="60" width="280" height="115" rx="6" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="60" y="60" width="280" height="20" fill="#DC2626"/>
        <!-- Red Cross Emblem -->
        <circle cx="200" cy="115" r="24" fill="#FEE2E2"/>
        <rect x="194" y="98" width="12" height="34" rx="2" fill="#DC2626"/>
        <rect x="183" y="109" width="34" height="12" rx="2" fill="#DC2626"/>
        <text x="200" y="74" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle">COMMUNITY HEALTH &amp; EMERGENCY CLINIC</text>
        <rect x="0" y="175" width="400" height="25" fill="#334155"/>
      </svg>
    `;
  } else {
    // Default modern building
    return `
      <svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="200" fill="#F1F5F9"/>
        <rect x="50" y="50" width="300" height="125" rx="6" fill="${primary}"/>
        <rect x="70" y="70" width="45" height="40" rx="3" fill="#BAE6FD"/>
        <rect x="130" y="70" width="45" height="40" rx="3" fill="#BAE6FD"/>
        <rect x="190" y="70" width="45" height="40" rx="3" fill="#BAE6FD"/>
        <rect x="250" y="70" width="45" height="40" rx="3" fill="#BAE6FD"/>
        <rect x="70" y="125" width="45" height="40" rx="3" fill="#BAE6FD"/>
        <rect x="130" y="125" width="45" height="40" rx="3" fill="#BAE6FD"/>
        <rect x="190" y="125" width="45" height="40" rx="3" fill="#BAE6FD"/>
        <rect x="250" y="125" width="45" height="40" rx="3" fill="#BAE6FD"/>
        <text x="200" y="35" font-size="14" font-weight="800" fill="#1E293B" text-anchor="middle">${name || 'CAMPUS BLOCK'}</text>
        <rect x="0" y="175" width="400" height="25" fill="#475569"/>
      </svg>
    `;
  }
}

function renderBlockPictures(loc) {
  const heroWrap = document.getElementById("drawerHeroImgWrap");
  const theme = loc.theme || getThemeForLocation(loc);
  const color = loc.color || "#1E40AF";

  if (heroWrap) {
    heroWrap.innerHTML = getBuildingVisualArtwork(theme, color, loc.name);
  }

  // Update Status badge
  const statusBadge = document.getElementById("drawerStatusBadge");
  if (statusBadge) {
    const status = loc.status || "open";
    if (status === "crowded") {
      statusBadge.className = "drawer-status-badge crowded";
      statusBadge.innerHTML = `<i class="fa-solid fa-circle text-amber"></i> HIGH CROWD`;
    } else if (status === "maintenance") {
      statusBadge.className = "drawer-status-badge maintenance";
      statusBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> MAINTENANCE`;
    } else if (status === "restricted") {
      statusBadge.className = "drawer-status-badge maintenance";
      statusBadge.innerHTML = `<i class="fa-solid fa-lock"></i> RESTRICTED`;
    } else {
      statusBadge.className = "drawer-status-badge";
      statusBadge.innerHTML = `<i class="fa-solid fa-circle"></i> OPEN NOW`;
    }
  }

  // Render thumbnail gallery views
  const thumbExt = document.getElementById("thumbExteriorImg");
  const thumbLob = document.getElementById("thumbLobbyImg");
  const thumbPln = document.getElementById("thumbPlanImg");

  if (thumbExt) thumbExt.innerHTML = getBuildingVisualArtwork(theme, color, loc.name);
  if (thumbLob) {
    thumbLob.innerHTML = `
      <svg viewBox="0 0 100 60" width="100%" height="100%">
        <rect width="100" height="60" fill="#0F172A"/>
        <rect x="20" y="20" width="60" height="40" fill="#334155"/>
        <polygon points="10,60 20,20 80,20 90,60" fill="#1E293B"/>
        <circle cx="50" cy="15" r="4" fill="#FDE68A"/>
        <rect x="35" y="30" width="30" height="30" fill="#38BDF8" opacity="0.8"/>
      </svg>
    `;
  }
  if (thumbPln) {
    thumbPln.innerHTML = `
      <svg viewBox="0 0 100 60" width="100%" height="100%">
        <rect width="100" height="60" fill="#0284C7"/>
        <rect x="10" y="10" width="80" height="40" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="3,2"/>
        <line x1="45" y1="10" x2="45" y2="50" stroke="#FFFFFF" stroke-width="1.5"/>
        <line x1="10" y1="30" x2="90" y2="30" stroke="#FFFFFF" stroke-width="1.5"/>
        <text x="25" y="24" font-size="6" fill="#FFFFFF">R-101</text>
        <text x="65" y="24" font-size="6" fill="#FFFFFF">LAB-02</text>
      </svg>
    `;
  }
}

// ==========================================================================
// 6. SVG MAP RENDERING & BLUEPRINT OVERLAYS
// ==========================================================================

function initSvgMap() {
  renderWalkwaysLayer();
  renderCustomBlocksLayer();
  renderHotspotsLayer();
  renderPlaceNamesLayer();
  renderMarkersLayer();
  updateUserPulseIndicator();
  initMapHoverCard();
}

/**
 * Render subtle architectural blueprint dotted paths along actual roads and walkways,
 * strictly keeping the real 3D campus image completely untouched and visible!
 */
function renderWalkwaysLayer() {
  const container = document.getElementById("walkwayNetwork");
  if (!container) return;
  // Dotted lines removed from map per user request
  container.innerHTML = "";
}

function renderBuildingIllustrationsLayer() {
  // Untouched 3D model blueprint layer is displayed directly from campus_3d_blueprint.jpg
  const container = document.getElementById("buildingIllustrationsLayer");
  if (container) container.innerHTML = "";
}

/**
 * Render interactive clickable hotspots on top of the 3D campus blueprint
 */
function renderHotspotsLayer() {
  const container = document.getElementById("buildingsLayer");
  if (!container) return;

  let html = "";
  CAMPUS_LOCATIONS.forEach(loc => {
    const s = loc.shape;
    if (loc.id === "loc-intel-joe") {
      // Circular rotunda hotspot
      html += `
        <circle
          class="building-hotspot"
          id="hotspot-${loc.id}"
          data-id="${loc.id}"
          data-cat="${loc.category}"
          cx="${loc.coords.x}" cy="${loc.coords.y}"
          r="${s.rx || 45}"
          onclick="handleLocationSelect('${loc.id}')"
          onmouseenter="handleBuildingMouseEnter('${loc.id}', event)"
          onmouseleave="handleBuildingMouseLeave()"
        >
          <title>${loc.name} (${loc.code})</title>
        </circle>
      `;
    } else {
      html += `
        <rect 
          class="building-hotspot"
          id="hotspot-${loc.id}"
          data-id="${loc.id}"
          data-cat="${loc.category}"
          x="${s.x}" y="${s.y}"
          width="${s.width}" height="${s.height}"
          rx="${s.rx || 6}"
          onclick="handleLocationSelect('${loc.id}')"
          onmouseenter="handleBuildingMouseEnter('${loc.id}', event)"
          onmouseleave="handleBuildingMouseLeave()"
        >
          <title>${loc.name} (${loc.code})</title>
        </rect>
      `;
    }
  });

  container.innerHTML = html;
}

function renderPlaceNamesLayer() {
  const container = document.getElementById("placeNamesLayer");
  if (!container) return;
  container.innerHTML = "";
}

function renderMarkersLayer() {
  const container = document.getElementById("markersLayer");
  if (!container) return;

  // Pin badges for main locations
  let html = "";
  CAMPUS_LOCATIONS.forEach(loc => {
    if (loc.isPopular || loc.category === "emergency" || loc.category === "gates") {
      const { x, y } = loc.coords;
      html += `
        <g class="marker-group" id="marker-${loc.id}" transform="translate(${x}, ${y - 10})" onclick="handleLocationSelect('${loc.id}')" style="cursor: pointer;">
          <circle cx="0" cy="0" r="9" fill="${loc.color}" stroke="#FFFFFF" stroke-width="1.8" filter="url(#pinShadow)"/>
          <circle cx="0" cy="0" r="3" fill="#FFFFFF"/>
        </g>
      `;
    }
  });
  container.innerHTML = html;
}

function updateUserPulseIndicator() {
  const container = document.getElementById("userPulseLayer");
  if (!container) return;

  const currentLoc = CAMPUS_LOCATIONS.find(l => l.id === AppState.currentLocationId);
  if (!currentLoc) return;

  const { x, y } = currentLoc.coords;

  container.innerHTML = `
    <g id="userGpsMarker" transform="translate(${x}, ${y})">
      <circle cx="0" cy="0" r="16" fill="#7C3AED" class="user-pulse-ring" opacity="0.45"/>
      <circle cx="0" cy="0" r="9" fill="#FFFFFF" filter="url(#buildingShadow)"/>
      <circle cx="0" cy="0" r="6" fill="#7C3AED"/>
      <circle cx="0" cy="0" r="2" fill="#FFFFFF"/>
      <text x="0" y="20" font-family="Plus Jakarta Sans, sans-serif" font-size="8" font-weight="800" fill="#4C1D95" text-anchor="middle">YOU ARE HERE</text>
    </g>
  `;
}

// ==========================================================================
// 7. GRAPH PATHFINDING & ROUTE DRAWING
// ==========================================================================

function findShortestCampusRoute(startId, endId, mode = "fastest") {
  if (startId === endId) {
    const loc = CAMPUS_LOCATIONS.find(l => l.id === startId);
    return {
      success: true,
      nodes: [LOCATION_NODE_MAP[startId] || "W_GATE1"],
      totalDistance: 0,
      estimatedTimeMin: 0,
      steps: [{ text: `You are already at ${loc ? loc.name : 'this location'}.`, dist: "0 m", icon: "fa-location-dot" }]
    };
  }

  const startEntrance = BUILDING_ENTRANCES[startId];
  const endEntrance = BUILDING_ENTRANCES[endId];

  const startNodeKey = startEntrance ? startEntrance.roadNodeKey : (LOCATION_NODE_MAP[startId] || "W_GATE1");
  const endNodeKey = endEntrance ? endEntrance.roadNodeKey : (LOCATION_NODE_MAP[endId] || "W_INTEL_N");

  const pathResult = aStarPathfind(startNodeKey, endNodeKey, mode);

  if (!pathResult.success) {
    const startLoc = CAMPUS_LOCATIONS.find(l => l.id === startId);
    const endLoc = CAMPUS_LOCATIONS.find(l => l.id === endId);
    const sName = startLoc ? startLoc.name : startId;
    const eName = endLoc ? endLoc.name : endId;
    return {
      success: false,
      nodes: [],
      totalDistance: 0,
      estimatedTimeMin: 0,
      steps: [{
        text: `No clear pedestrian walkway without intersecting buildings between ${sName} and ${eName}.`,
        dist: "N/A",
        icon: "fa-triangle-exclamation"
      }],
      error: pathResult.error
    };
  }

  const path = pathResult.nodes;
  const totalDist = pathResult.totalDistance;
  const estMin = Math.max(1, Math.round(totalDist / 75));
  const steps = generateTurnByTurnSteps(path, startId, endId, totalDist);

  return {
    success: true,
    nodes: path,
    totalDistance: totalDist,
    estimatedTimeMin: estMin,
    steps: steps
  };
}

function generateTurnByTurnSteps(pathNodes, startLocId, endLocId, totalDist) {
  const steps = [];
  const startLoc = CAMPUS_LOCATIONS.find(l => l.id === startLocId);
  const endLoc = CAMPUS_LOCATIONS.find(l => l.id === endLocId);

  const startName = startLoc ? startLoc.name : "Starting Point";
  const endName = endLoc ? endLoc.name : "Destination";

  steps.push({
    text: `Depart from ${startName}. Follow designated campus walkway.`,
    dist: "Start",
    icon: "fa-play"
  });

  const landmarks = [
    { id: "W_POND_W", text: "Walk past the Fish Pond & Flag Square." },
    { id: "W_ADMIN_N", text: "Proceed along the Admin & COE North Portico." },
    { id: "W_ADMIN_SW", text: "Walk past the Admin West entrance." },
    { id: "W_CENTRAL_1", text: "Pass through the main Central Boulevard concourse." },
    { id: "W_INTEL_E", text: "Pass the Intel JOE promenade." },
    { id: "W_MESS_W", text: "Follow the paved road next to ARUL MESS." },
    { id: "W_AUDI_W", text: "Arrive at Conventional Hall Auditorium promenade." },
    { id: "W_LAWN_C", text: "Walk across the Quadrangle Lawns central crossing." },
    { id: "W_CHAPEL", text: "Pass the Campus Chapel sanctuary." },
    { id: "W_ARCH", text: "Pass through the historic Campus Monument Arch." },
    { id: "W_RAJA_ROAD_C", text: "Follow the wide avenue along S A RAJA Memorial Block." },
    { id: "W_HEALTH", text: "Proceed near Community Health Centre & Legal Aid Clinic." }
  ];

  let added = 0;
  pathNodes.forEach(nId => {
    const lm = landmarks.find(l => l.id === nId);
    if (lm && added < 3) {
      steps.push({ text: lm.text, dist: "Straight", icon: "fa-arrow-up" });
      added++;
    }
  });

  if (steps.length < 3) {
    steps.push({
      text: "Continue straight along the paved walkway corridor.",
      dist: `${Math.round(totalDist * 0.4)} m`,
      icon: "fa-person-walking"
    });
  }

  steps.push({
    text: `Arrive at ${endName}. Accessible entry point is immediately ahead.`,
    dist: "Goal",
    icon: "fa-flag-checkered"
  });

  return steps;
}

function drawSvgRoute(pathNodeIds, mode, startLocId, endLocId) {
  const container = document.getElementById("activeRouteLayer");
  if (!container) return;

  if (!pathNodeIds || pathNodeIds.length === 0) {
    container.innerHTML = "";
    return;
  }

  // Build points array strictly along verified road network (passing to the right or left of blocks on road)
  const points = [];
  pathNodeIds.forEach(nodeId => {
    const n = WALKWAY_NODES[nodeId];
    if (n) {
      const last = points[points.length - 1];
      if (!last || last.x !== n.x || last.y !== n.y) {
        points.push({ x: n.x, y: n.y });
      }
    }
  });

  if (points.length === 0) {
    container.innerHTML = "";
    return;
  }

  let d = "";
  points.forEach((pt, idx) => {
    if (idx === 0) d += `M ${pt.x} ${pt.y} `;
    else d += `L ${pt.x} ${pt.y} `;
  });

  const startPt = points[0];
  const endPt = points[points.length - 1];

  let modeClass = mode || "fastest";
  if (mode === "emergency") modeClass = "emergency";

  let html = `
    <!-- High-Contrast Neon Route Glow Underlay along road -->
    <path class="route-glow-path ${modeClass}" d="${d}"/>

    <!-- Solid Active Route Path Passing Along Real Roads and Avoiding Blocks -->
    <path class="svg-active-route ${modeClass}" d="${d}"/>
  `;

  // Start Marker (A) with glowing emerald pulse positioned on the road outside the block
  if (startPt) {
    html += `
      <g class="route-marker start-marker" transform="translate(${startPt.x}, ${startPt.y})">
        <circle cx="0" cy="0" r="18" fill="rgba(16, 185, 129, 0.35)" class="route-marker-pulse"/>
        <circle cx="0" cy="0" r="11" fill="#10B981" stroke="#FFFFFF" stroke-width="2.5" filter="url(#pinShadow)"/>
        <text x="0" y="4" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="900" fill="#FFFFFF">A</text>
        <g transform="translate(0, -18)">
          <rect x="-32" y="-13" width="64" height="15" rx="3" fill="rgba(6, 78, 59, 0.95)" stroke="#10B981" stroke-width="1"/>
          <text x="0" y="-3" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="800" fill="#34D399">START (A)</text>
        </g>
      </g>
    `;
  }

  // Destination Marker (B) with glowing crimson pulse positioned on the road outside the block
  if (endPt) {
    html += `
      <g class="route-marker dest-marker" transform="translate(${endPt.x}, ${endPt.y})">
        <circle cx="0" cy="0" r="18" fill="rgba(239, 68, 68, 0.35)" class="route-marker-pulse"/>
        <circle cx="0" cy="0" r="11" fill="#EF4444" stroke="#FFFFFF" stroke-width="2.5" filter="url(#pinShadow)"/>
        <text x="0" y="4" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="900" fill="#FFFFFF">B</text>
        <g transform="translate(0, -18)">
          <rect x="-42" y="-13" width="84" height="15" rx="3" fill="rgba(127, 29, 29, 0.95)" stroke="#EF4444" stroke-width="1"/>
          <text x="0" y="-3" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="800" fill="#FCA5A5">DESTINATION (B)</text>
        </g>
      </g>
    `;
  }

  container.innerHTML = html;
}

function calculateAndRenderRoute(startId, endId, mode) {
  AppState.currentLocationId = startId;
  AppState.destinationLocationId = endId;
  AppState.activeRouteMode = mode;

  let result;
  const viaId = AppState.viaLocationId;

  if (viaId && viaId !== startId && viaId !== endId) {
    const leg1 = findShortestCampusRoute(startId, viaId, mode);
    const leg2 = findShortestCampusRoute(viaId, endId, mode);

    if (!leg1.success || !leg2.success) {
      result = {
        success: false,
        nodes: [],
        totalDistance: 0,
        estimatedTimeMin: 0,
        steps: [{ text: "Unable to calculate multi-stop route without obstacle collision.", dist: "N/A", icon: "fa-triangle-exclamation" }]
      };
      showToast("Cannot complete route: blocked pedestrian path.", "warning");
    } else {
      const combinedNodes = [...leg1.nodes, ...leg2.nodes.slice(1)];
      const totalDist = leg1.totalDistance + leg2.totalDistance;
      const totalTime = Math.round(totalDist / 75) || 1;

      const viaLoc = CAMPUS_LOCATIONS.find(l => l.id === viaId);
      const viaName = viaLoc ? viaLoc.name : "Intermediate Stop";

      const combinedSteps = [
        ...leg1.steps,
        { text: `Arrive at intermediate stop: ${viaName}. Continue onward to destination.`, dist: "0 m", icon: "fa-diamond" },
        ...leg2.steps
      ];

      result = {
        success: true,
        nodes: combinedNodes,
        totalDistance: totalDist,
        estimatedTimeMin: totalTime,
        steps: combinedSteps,
        isMultiStop: true,
        viaName: viaName
      };
    }
  } else {
    result = findShortestCampusRoute(startId, endId, mode);
    if (!result.success) {
      showToast("No clear pedestrian route available without crossing buildings.", "warning");
    }
  }

  AppState.activeRoute = result;

  // Draw route strictly on walkways
  drawSvgRoute(result.nodes, mode, startId, endId);

  // Update user pulse position
  updateUserPulseIndicator();

  // Update UI panel
  updateRouteSummaryUI(result, startId, endId, mode);

  // Highlight hotspot boundaries
  highlightBuildingsOnMap(startId, endId);

  // Voice Guidance Speech
  if (AppState.voiceGuidanceEnabled && result.success && result.steps && result.steps.length > 0) {
    const startLoc = CAMPUS_LOCATIONS.find(l => l.id === startId);
    const endLoc = CAMPUS_LOCATIONS.find(l => l.id === endId);
    const startName = startLoc ? startLoc.name : "current spot";
    const endName = endLoc ? endLoc.name : "destination";
    const firstStep = result.steps[0].text;
    speakInstruction(`Starting route from ${startName} to ${endName}. ${firstStep}`);
  }
}

function updateRouteSummaryUI(result, startId, endId, mode) {
  const distEl = document.getElementById("summaryDistance");
  const durEl = document.getElementById("summaryDuration");
  const stepsEl = document.getElementById("statSteps") || document.getElementById("summarySteps");
  const typeTag = document.getElementById("summaryRouteType");
  const headlineEl = document.getElementById("routeHeadline") || document.getElementById("routeFlowBreadcrumb");
  const tbtList = document.getElementById("turnByTurnList");
  const tbtCount = document.getElementById("tbtStepsCount");

  if (distEl) distEl.textContent = `${result.totalDistance} m`;
  if (durEl) durEl.textContent = `${result.estimatedTimeMin} min walk`;
  if (stepsEl) stepsEl.textContent = `~${Math.round(result.totalDistance * 1.3)} steps`;

  const modeLabels = {
    fastest: "Fastest Direct Walk",
    accessible: "Wheelchair Accessible",
    safe: "Safe & Well-Lit Path",
    eco: "Scenic Lawns & Garden",
    emergency: "EMERGENCY PRIORITY"
  };

  if (typeTag) typeTag.textContent = modeLabels[mode] || "Fastest Direct Walk";

  const startLoc = CAMPUS_LOCATIONS.find(l => l.id === startId);
  const endLoc = CAMPUS_LOCATIONS.find(l => l.id === endId);
  const startName = startLoc ? startLoc.name : "Start";
  const endName = endLoc ? endLoc.name : "Destination";

  if (headlineEl) {
    let flow = `${startName} &rarr; Central Walkways &rarr; <strong style="color:#0F172A">${endName}</strong>`;
    headlineEl.innerHTML = flow;
  }

  if (tbtList) {
    let html = "";
    result.steps.forEach((step, idx) => {
      let arrow = "fa-arrow-up";
      let maneuver = "Straight";

      if (step.text.toLowerCase().includes("turn right")) {
        arrow = "fa-arrow-turn-down fa-rotate-270";
        maneuver = "Right";
      } else if (step.text.toLowerCase().includes("turn left")) {
        arrow = "fa-arrow-turn-down fa-rotate-90";
        maneuver = "Left";
      } else if (step.text.toLowerCase().includes("arrive") || step.text.toLowerCase().includes("goal")) {
        arrow = "fa-flag-checkered";
        maneuver = "Goal";
      }

      html += `
        <div class="tbt-step-item">
          <div class="step-num">${idx + 1}</div>
          <div class="step-text">
            <i class="fa-solid ${arrow} text-primary" style="margin-right:5px; font-size:0.75rem;"></i>
            ${step.text}
          </div>
          <span class="step-tag">${maneuver}</span>
        </div>
      `;
    });
    tbtList.innerHTML = html;
  }

  if (tbtCount) {
    tbtCount.textContent = `${result.steps.length} Steps`;
  }

  // Update Recents
  if (endLoc && !AppState.recentDestinations.includes(endLoc.name)) {
    AppState.recentDestinations.unshift(endLoc.name);
    if (AppState.recentDestinations.length > 5) AppState.recentDestinations.pop();
    renderFavoritesAndRecents();
  }
}

function highlightBuildingsOnMap(startId, endId) {
  document.querySelectorAll(".building-hotspot").forEach(el => {
    el.classList.remove("selected");
  });

  const hsStart = document.getElementById(`hotspot-${startId}`);
  const hsEnd = document.getElementById(`hotspot-${endId}`);

  if (hsStart) hsStart.classList.add("selected");
  if (hsEnd) hsEnd.classList.add("selected");
}

function simulateWalkAlongRoute() {
  if (!AppState.activeRoute || AppState.activeRoute.nodes.length < 2) return;
  if (AppState.isWalkingSimulation) return;

  AppState.isWalkingSimulation = true;
  AppState.liveNavActive = true;
  document.getElementById("liveNavHud")?.classList.remove("hidden");
  showToast("Simulating walk with Live In-Browser Turn Guidance 🚶‍♂️", "info");

  const nodes = AppState.activeRoute.nodes;
  const steps = AppState.activeRoute.steps || [];
  let idx = 0;

  const simInterval = setInterval(() => {
    if (idx >= nodes.length) {
      clearInterval(simInterval);
      AppState.isWalkingSimulation = false;
      showToast("Arrived at destination! 🎉", "success");
      if (steps.length > 0) updateLiveNavHudStep(steps.length - 1);
      updateUserPulseIndicator();
      return;
    }

    const nId = nodes[idx];
    const n = WALKWAY_NODES[nId];
    if (n) {
      updateUserPositionAtCoords(n.x, n.y);
      if (steps.length > 0) {
        const stepIdx = Math.min(steps.length - 1, Math.floor((idx / nodes.length) * steps.length));
        updateLiveNavHudStep(stepIdx);
      }
    }
    idx++;
  }, 750);
}

// ==========================================================================
// 8. LOCATION DETAILS DRAWER & INTERACTION
// ==========================================================================

function handleLocationSelect(locId) {
  const loc = CAMPUS_LOCATIONS.find(l => l.id === locId);
  if (!loc) return;

  AppState.selectedLocation = loc;

  document.getElementById("drawerName").textContent = loc.name;
  document.getElementById("drawerCode").textContent = `${loc.code} • ${loc.categoryLabel}`;
  document.getElementById("drawerCategory").textContent = loc.categoryLabel;
  document.getElementById("drawerHours").textContent = loc.openingHours;
  document.getElementById("drawerContact").textContent = loc.contact;
  document.getElementById("drawerDescription").textContent = loc.description;

  const routeSample = findShortestCampusRoute(AppState.currentLocationId, loc.id, "fastest");
  document.getElementById("drawerDistance").textContent = `${routeSample.totalDistance} m (~${routeSample.estimatedTimeMin} mins)`;

  const heroBg = document.getElementById("drawerHeroBg");
  if (heroBg) {
    heroBg.style.background = `linear-gradient(135deg, ${loc.color} 0%, #0F172A 100%)`;
  }

  // Render High-Resolution Block Pictures & Gallery
  renderBlockPictures(loc);

  // Highlight selected block on map
  document.querySelectorAll(".svg-bp-block").forEach(b => b.classList.remove("selected-active-block"));
  const clickedBlock = document.getElementById(`block-${loc.id.replace('loc-', '')}`) || 
                       document.querySelector(`.svg-bp-block[onclick*="${loc.id}"]`);
  if (clickedBlock) {
    clickedBlock.classList.add("selected-active-block");
  }

  const facContainer = document.getElementById("drawerFacilities");
  if (facContainer) {
    let facHtml = "";
    (loc.facilities || []).forEach(fac => {
      facHtml += `<span class="fac-tag"><i class="fa-solid fa-check"></i> ${fac}</span>`;
    });
    (loc.accessibleFeatures || []).forEach(acc => {
      facHtml += `<span class="fac-tag" style="background:#ECFDF5; color:#059669"><i class="fa-solid fa-wheelchair"></i> ${acc}</span>`;
    });
    facContainer.innerHTML = facHtml;
  }

  const floorList = document.getElementById("drawerFloorList");
  if (floorList) {
    let floorHtml = "";
    (loc.floors || []).forEach(f => {
      floorHtml += `
        <div class="floor-card">
          <div class="floor-head">
            <span><i class="fa-solid fa-layer-group text-primary" style="margin-right:6px;"></i>${f.floorName}</span>
            <span style="font-size:0.7rem; color:#64748B;">${f.rooms.length} Units</span>
          </div>
          <div class="floor-rooms-list">${f.rooms.join(" • ")}</div>
        </div>
      `;
    });
    floorList.innerHTML = floorHtml;
  }

  updateFavoriteIconState(loc.id);

  document.getElementById("locationDrawerBackdrop")?.classList.remove("hidden");
  highlightBuildingsOnMap(AppState.currentLocationId, loc.id);
}

function updateFavoriteIconState(locId) {
  const icon = document.getElementById("drawerFavIcon");
  if (!icon) return;
  if (AppState.favorites.includes(locId)) icon.className = "fa-solid fa-star text-amber";
  else icon.className = "fa-regular fa-star";
}

function toggleFavoriteLocation(locId) {
  const idx = AppState.favorites.indexOf(locId);
  if (idx > -1) {
    AppState.favorites.splice(idx, 1);
    showToast("Removed from favorites", "info");
  } else {
    AppState.favorites.push(locId);
    showToast("Saved to favorites ⭐", "success");
  }
  updateFavoriteIconState(locId);
  renderFavoritesAndRecents();
}

// ==========================================================================
// 9. SEARCH FUNCTIONALITY
// ==========================================================================

function handleGlobalSearch(query) {
  const searchDropdown = document.getElementById("searchDropdown");
  const resultsContainer = document.getElementById("searchResultsList");
  const clearBtn = document.getElementById("btnClearSearch");

  if (!query || query.trim().length === 0) {
    if (searchDropdown) searchDropdown.classList.add("hidden");
    if (clearBtn) clearBtn.classList.add("hidden");
    return;
  }

  if (clearBtn) clearBtn.classList.remove("hidden");

  const cleanQ = query.trim().toLowerCase();
  const matched = [];
  const matchedRooms = [];

  CAMPUS_LOCATIONS.forEach(loc => {
    let score = 0;
    if (loc.name.toLowerCase().includes(cleanQ)) score += 10;
    if (loc.code.toLowerCase().includes(cleanQ)) score += 8;
    if (loc.categoryLabel.toLowerCase().includes(cleanQ)) score += 5;
    if (loc.description.toLowerCase().includes(cleanQ)) score += 3;

    loc.floors.forEach(f => {
      f.rooms.forEach(r => {
        if (r.toLowerCase().includes(cleanQ)) {
          score += 7;
          matchedRooms.push({ room: r, floor: f.floorName, building: loc.name, buildingId: loc.id, icon: loc.icon, color: loc.color });
        }
      });
    });

    loc.facilities.forEach(fac => {
      if (fac.toLowerCase().includes(cleanQ)) score += 4;
    });

    if (score > 0) matched.push({ loc, score });
  });

  matched.sort((a, b) => b.score - a.score);

  if (resultsContainer) {
    if (matched.length === 0 && matchedRooms.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 16px; text-align: center; color: #64748B; font-size: 0.82rem;">
          No campus locations matching "<strong>${escapeHtml(query)}</strong>"
        </div>
      `;
    } else {
      let html = "";
      
      // Rooms and Labs matches
      matchedRooms.slice(0, 3).forEach(rm => {
        html += `
          <div class="search-item-row" onclick="selectSearchResult('${rm.buildingId}')">
            <div class="search-item-left">
              <div class="search-item-icon" style="background:#2563EB; color:#FFF;"><i class="fa-solid fa-chalkboard-user"></i></div>
              <div>
                <div class="search-item-name">${escapeHtml(rm.room)}</div>
                <div class="search-item-sub">${escapeHtml(rm.building)} • ${escapeHtml(rm.floor)}</div>
              </div>
            </div>
            <div class="search-item-actions" onclick="event.stopPropagation()">
              <button class="btn-mini-search" onclick="handleLocationSelect('${rm.buildingId}')">View</button>
              <button class="btn-mini-search primary" onclick="routeToSpecificRoom('${rm.buildingId}', '${escapeHtml(rm.room)}')">Navigate</button>
            </div>
          </div>
        `;
      });

      // Buildings matches
      matched.slice(0, 5).forEach(item => {
        const l = item.loc;
        const routeInfo = findShortestCampusRoute(AppState.currentLocationId, l.id, "fastest");
        html += `
          <div class="search-item-row" onclick="selectSearchResult('${l.id}')">
            <div class="search-item-left">
              <div class="search-item-icon" style="background:${l.color}; color:#FFF;"><i class="fa-solid ${l.icon}"></i></div>
              <div>
                <div class="search-item-name">${l.name}</div>
                <div class="search-item-sub">${l.categoryLabel} • ${routeInfo.totalDistance} m (${routeInfo.estimatedTimeMin}m walk)</div>
              </div>
            </div>
            <div class="search-item-actions" onclick="event.stopPropagation()">
              <button class="btn-mini-search" onclick="handleLocationSelect('${l.id}')">View</button>
              <button class="btn-mini-search primary" onclick="quickRouteToDestination('${l.id}')">Navigate</button>
            </div>
          </div>
        `;
      });
      resultsContainer.innerHTML = html;
    }
  }

  if (searchDropdown) searchDropdown.classList.remove("hidden");
}

function selectSearchResult(locId) {
  document.getElementById("searchDropdown")?.classList.add("hidden");
  handleLocationSelect(locId);
}

function quickRouteToDestination(destId) {
  document.getElementById("searchDropdown")?.classList.add("hidden");

  const destSelect = document.getElementById("routeDestSelect");
  if (destSelect) destSelect.value = destId;

  calculateAndRenderRoute(AppState.currentLocationId, destId, AppState.activeRouteMode);
  showToast("Optimal campus route computed on blueprint!", "success");

  const panel = document.getElementById("routePanel");
  if (panel && window.innerWidth < 1024) panel.scrollIntoView({ behavior: "smooth" });
}

// ==========================================================================
// 10. SMART CAMPUS FEATURES (QR, CLASSROOM, EMERGENCY)
// ==========================================================================

function handleSimulateQrScan(locId) {
  const loc = CAMPUS_LOCATIONS.find(l => l.id === locId);
  if (!loc) return;

  AppState.currentLocationId = loc.id;
  const originSelect = document.getElementById("routeOriginSelect");
  if (originSelect) originSelect.value = loc.id;

  updateUserPulseIndicator();
  closeAllModals();

  showToast(`QR Code Scanned! Current position: ${loc.name}`, "success");
  calculateAndRenderRoute(loc.id, AppState.destinationLocationId, AppState.activeRouteMode);
}

function handleClassroomSearch(query = "", filterDept = "all") {
  const container = document.getElementById("roomResultsList");
  if (!container) return;

  const cleanQ = query.trim().toLowerCase();
  const list = [];

  CAMPUS_LOCATIONS.forEach(loc => {
    loc.floors.forEach(f => {
      f.rooms.forEach(r => {
        let matchDept = true;
        if (filterDept === "Admin" && !loc.name.includes("Admin")) matchDept = false;
        if (filterDept === "Intel" && !loc.name.includes("Intel")) matchDept = false;
        if (filterDept === "Tech" && !loc.name.includes("Technology")) matchDept = false;
        if (filterDept === "Halls" && (!loc.name.includes("Auditorium") && !loc.name.includes("OAT"))) matchDept = false;

        let matchQuery = true;
        if (cleanQ.length > 0 && !r.toLowerCase().includes(cleanQ) && !loc.name.toLowerCase().includes(cleanQ)) {
          matchQuery = false;
        }

        if (matchDept && matchQuery) {
          list.push({ room: r, floor: f.floorName, building: loc.name, buildingId: loc.id });
        }
      });
    });
  });

  if (list.length === 0) {
    container.innerHTML = `<div style="padding:20px; text-align:center; color:#64748B;">No matching classrooms or labs found.</div>`;
    return;
  }

  let html = "";
  list.slice(0, 10).forEach(item => {
    html += `
      <div class="room-result-card">
        <div class="room-meta-left">
          <strong>${item.room}</strong>
          <span>${item.building} • ${item.floor}</span>
        </div>
        <button class="btn-route-room" onclick="routeToSpecificRoom('${item.buildingId}', '${item.room}')">
          <i class="fa-solid fa-diamond-turn-right"></i> Navigate
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function routeToSpecificRoom(buildingId, roomName) {
  closeAllModals();
  quickRouteToDestination(buildingId);
  showToast(`Navigating to ${roomName}`, "info");
}

function triggerEmergencyNavigation(targetLocId = "loc-health") {
  const loc = CAMPUS_LOCATIONS.find(l => l.id === targetLocId) || CAMPUS_LOCATIONS.find(l => l.id === "loc-health");
  if (!loc) return;

  closeAllModals();

  const origin = AppState.currentLocationId;
  const dest = loc.id;

  const destSelect = document.getElementById("routeDestSelect");
  if (destSelect) destSelect.value = dest;

  calculateAndRenderRoute(origin, dest, "emergency");
  showToast(`EMERGENCY SOS: Navigating directly to ${loc.name}!`, "alert");

  const panel = document.getElementById("routePanel");
  if (panel) panel.scrollIntoView({ behavior: "smooth" });
}

function highlightAllEmergencyPins() {
  document.querySelectorAll(".marker-group").forEach(el => {
    const cat = el.getAttribute("data-cat");
    if (cat === "emergency") {
      el.style.transform = "scale(1.5)";
      el.style.filter = "drop-shadow(0 0 10px #DC2626)";
    } else {
      el.style.opacity = "0.25";
    }
  });

  showToast("Highlighted Community Health Centre & SOS stations", "info");

  setTimeout(() => {
    document.querySelectorAll(".marker-group").forEach(el => {
      el.style.transform = "";
      el.style.filter = "";
      el.style.opacity = "";
    });
  }, 6000);
}

// ==========================================================================
// 11. MAP VIEW SWITCHER (BLUEPRINT vs VECTOR)
// ==========================================================================

function setMapViewMode(mode) {
  AppState.activeMapStyle = mode;
  const bpBtn = document.getElementById("btnViewBlueprint");
  const vecBtn = document.getElementById("btnViewVector");
  const bpLayer = document.getElementById("blueprintImageLayer");
  const vecLayer = document.getElementById("vectorBaseLayer");

  if (mode === "blueprint") {
    bpBtn?.classList.add("active");
    vecBtn?.classList.remove("active");
    bpLayer?.classList.remove("hidden");
    vecLayer?.classList.add("hidden");
    showToast("Official Campus Blueprint Map view loaded", "info");
  } else {
    vecBtn?.classList.add("active");
    bpBtn?.classList.remove("active");
    vecLayer?.classList.remove("hidden");
    bpLayer?.classList.add("hidden");
    showToast("Clean Digital Vector Map layout view loaded", "info");
  }
}

// ==========================================================================
// 12. DROPDOWNS POPULATION & EVENT LISTENERS
// ==========================================================================

function populateDropdowns() {
  const originSelect = document.getElementById("routeOriginSelect");
  const destSelect = document.getElementById("routeDestSelect");
  const viaSelect = document.getElementById("routeViaSelect");
  const lsOrigin = document.getElementById("lsOriginSelect");
  const lsDest = document.getElementById("lsDestSelect");

  const selects = [
    { el: originSelect, current: AppState.currentLocationId },
    { el: destSelect, current: AppState.destinationLocationId },
    { el: lsOrigin, current: AppState.currentLocationId },
    { el: lsDest, current: AppState.destinationLocationId }
  ];

  selects.forEach(({ el, current }) => {
    if (!el) return;
    el.innerHTML = "";
    CAMPUS_LOCATIONS.forEach(loc => {
      const opt = document.createElement("option");
      opt.value = loc.id;
      opt.textContent = `${loc.name} (${loc.code})`;
      if (loc.id === current) opt.selected = true;
      el.appendChild(opt);
    });
  });

  if (viaSelect) {
    viaSelect.innerHTML = `<option value="">-- Choose Via Stop (Optional) --</option>`;
    CAMPUS_LOCATIONS.forEach(loc => {
      const opt = document.createElement("option");
      opt.value = loc.id;
      opt.textContent = `${loc.name} (${loc.code})`;
      if (loc.id === AppState.viaLocationId) opt.selected = true;
      viaSelect.appendChild(opt);
    });
    viaSelect.onchange = (e) => {
      AppState.viaLocationId = e.target.value || null;
      const origin = document.getElementById("routeOriginSelect")?.value;
      const dest = document.getElementById("routeDestSelect")?.value;
      calculateAndRenderRoute(origin, dest, AppState.activeRouteMode);
    };
  }

  const currentLoc = CAMPUS_LOCATIONS.find(l => l.id === AppState.currentLocationId);
  if (currentLoc) {
    const lsGpsLoc = document.getElementById("lsGpsLocation");
    if (lsGpsLoc) lsGpsLoc.textContent = currentLoc.name;
  }
}

function renderFavoritesAndRecents() {
  const favContainer = document.getElementById("favoriteLocationsList");
  const recContainer = document.getElementById("recentDestinationsList");

  if (favContainer) {
    if (AppState.favorites.length === 0) {
      favContainer.innerHTML = `<span class="qa-empty">No favorites saved yet.</span>`;
    } else {
      let html = "";
      AppState.favorites.forEach(favId => {
        const loc = CAMPUS_LOCATIONS.find(l => l.id === favId);
        if (loc) {
          html += `
            <div class="qa-chip" onclick="handleLocationSelect('${loc.id}')">
              <i class="fa-solid ${loc.icon} text-amber"></i>
              <span>${loc.name}</span>
            </div>
          `;
        }
      });
      favContainer.innerHTML = html;
    }
  }

  if (recContainer) {
    if (AppState.recentDestinations.length === 0) {
      recContainer.innerHTML = `<span class="qa-empty">No recent routes yet.</span>`;
    } else {
      let html = "";
      AppState.recentDestinations.forEach(name => {
        const loc = CAMPUS_LOCATIONS.find(l => l.name === name || l.id === name);
        if (loc) {
          html += `
            <div class="qa-chip" onclick="quickRouteToDestination('${loc.id}')">
              <i class="fa-solid fa-clock-rotate-left"></i>
              <span>${loc.name}</span>
            </div>
          `;
        }
      });
      recContainer.innerHTML = html;
    }
  }

  renderSidebarFavoritesAndRecents();
}

function renderSidebarFavoritesAndRecents() {
  const lsFav = document.getElementById("lsFavoritesList");
  const lsRec = document.getElementById("lsRecentList");

  if (lsFav) {
    if (AppState.favorites.length === 0) {
      lsFav.innerHTML = `<div style="padding:8px 0; font-size:0.75rem; color:#94A3B8;">No saved places yet. Star any building to bookmark.</div>`;
    } else {
      let html = "";
      AppState.favorites.forEach(favId => {
        const loc = CAMPUS_LOCATIONS.find(l => l.id === favId);
        if (loc) {
          html += `
            <div class="ls-place-card-item" onclick="handleLocationSelect('${loc.id}'); closeSidebar();">
              <div class="ls-place-card-left">
                <div class="ls-place-card-icon" style="background:${loc.color}"><i class="fa-solid ${loc.icon}"></i></div>
                <span class="ls-place-card-text">${loc.name}</span>
              </div>
              <button class="ls-item-btn" onclick="event.stopPropagation(); quickRouteToDestination('${loc.id}'); closeSidebar();">
                <i class="fa-solid fa-diamond-turn-right"></i> Go
              </button>
            </div>
          `;
        }
      });
      lsFav.innerHTML = html;
    }
  }

  if (lsRec) {
    if (AppState.recentDestinations.length === 0) {
      lsRec.innerHTML = `<div style="padding:8px 0; font-size:0.75rem; color:#94A3B8;">No recent destinations yet.</div>`;
    } else {
      let html = "";
      AppState.recentDestinations.forEach(dest => {
        const loc = CAMPUS_LOCATIONS.find(l => l.name === dest || l.id === dest);
        if (loc) {
          html += `
            <div class="ls-place-card-item" onclick="quickRouteToDestination('${loc.id}'); closeSidebar();">
              <div class="ls-place-card-left">
                <div class="ls-place-card-icon" style="background:#64748B"><i class="fa-solid fa-clock-rotate-left"></i></div>
                <span class="ls-place-card-text">${loc.name}</span>
              </div>
              <button class="ls-item-btn" onclick="event.stopPropagation(); quickRouteToDestination('${loc.id}'); closeSidebar();">
                <i class="fa-solid fa-diamond-turn-right"></i>
              </button>
            </div>
          `;
        }
      });
      lsRec.innerHTML = html;
    }
  }
}

// ==========================================================================
// LEFT SIDEBAR CONTROL METHODS
// ==========================================================================

function toggleSidebar() {
  const sb = document.getElementById("leftSidebar");
  if (!sb) return;

  if (sb.classList.contains("open")) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function openSidebar() {
  const sb = document.getElementById("leftSidebar");
  const bd = document.getElementById("lsBackdrop");
  if (sb) sb.classList.add("open");
  if (bd) bd.classList.remove("hidden");
  renderSidebarFavoritesAndRecents();
}

function closeSidebar() {
  const sb = document.getElementById("leftSidebar");
  const bd = document.getElementById("lsBackdrop");
  if (sb) sb.classList.remove("open");
  if (bd) bd.classList.add("hidden");
}

function simulateGpsUpdate() {
  const randomLoc = CAMPUS_LOCATIONS[Math.floor(Math.random() * CAMPUS_LOCATIONS.length)];
  AppState.currentLocationId = randomLoc.id;

  const origin1 = document.getElementById("routeOriginSelect");
  const origin2 = document.getElementById("lsOriginSelect");
  if (origin1) origin1.value = randomLoc.id;
  if (origin2) origin2.value = randomLoc.id;

  const lsGpsLoc = document.getElementById("lsGpsLocation");
  if (lsGpsLoc) lsGpsLoc.textContent = randomLoc.name;

  const lat = (10.7900 + (randomLoc.coords.y * 0.000015)).toFixed(4);
  const lon = (78.8020 + (randomLoc.coords.x * 0.000015)).toFixed(4);
  const coordsEl = document.getElementById("lsGpsCoordsText");
  if (coordsEl) coordsEl.innerHTML = `Lat: ${lat} N &nbsp; Lon: ${lon} E`;

  updateUserPulseIndicator();
  showToast(`GPS Recalibrated to ${randomLoc.name} 📍`, "success");
}

function useGpsAsStart() {
  const origin1 = document.getElementById("routeOriginSelect");
  const origin2 = document.getElementById("lsOriginSelect");
  if (origin1) origin1.value = AppState.currentLocationId;
  if (origin2) origin2.value = AppState.currentLocationId;

  const loc = CAMPUS_LOCATIONS.find(l => l.id === AppState.currentLocationId);
  showToast(`Starting point set to ${loc ? loc.name : 'GPS position'}`, "info");
}

function swapRoutePoints() {
  const originSelect = document.getElementById("routeOriginSelect");
  const destSelect = document.getElementById("routeDestSelect");
  const lsOrigin = document.getElementById("lsOriginSelect");
  const lsDest = document.getElementById("lsDestSelect");

  if (originSelect && destSelect) {
    const temp = originSelect.value;
    originSelect.value = destSelect.value;
    destSelect.value = temp;

    if (lsOrigin && lsDest) {
      lsOrigin.value = originSelect.value;
      lsDest.value = destSelect.value;
    }

    calculateAndRenderRoute(originSelect.value, destSelect.value, AppState.activeRouteMode);
  }
}

function applyMapFilterFromSidebar(filter) {
  applyMapFilter(filter);
  document.querySelectorAll(".gmap-chip").forEach(c => {
    if (c.getAttribute("data-filter") === filter) c.classList.add("active");
    else c.classList.remove("active");
  });
  showToast(`Filter applied: ${filter.toUpperCase()}`, "info");
}

function toggleMapLayers() {
  const current = AppState.activeMapStyle;
  const next = current === "blueprint" ? "vector" : "blueprint";
  setMapViewMode(next);
}

function triggerSOSAlert() {
  const modal = document.getElementById("emergencyModal");
  if (modal) {
    modal.classList.remove("hidden");
  } else {
    triggerEmergencyNavigation("loc-health");
  }
}

function callEmergency(serviceName, ext) {
  showToast(`📞 Connecting to ${serviceName} (Ext. ${ext})... SOS Alert sent!`, "alert");
}

function handleSidebarSearch(query) {
  const resultsContainer = document.getElementById("lsSearchResults");
  const clearBtn = document.getElementById("lsSearchClear");

  if (!query || query.trim().length === 0) {
    if (resultsContainer) resultsContainer.classList.add("hidden");
    if (clearBtn) clearBtn.classList.add("hidden");
    return;
  }

  if (clearBtn) clearBtn.classList.remove("hidden");

  const cleanQ = query.trim().toLowerCase();
  const matchedBuildings = [];
  const matchedRooms = [];

  CAMPUS_LOCATIONS.forEach(loc => {
    if (
      loc.name.toLowerCase().includes(cleanQ) || 
      loc.code.toLowerCase().includes(cleanQ) || 
      loc.categoryLabel.toLowerCase().includes(cleanQ) ||
      loc.facilities.some(f => f.toLowerCase().includes(cleanQ))
    ) {
      matchedBuildings.push(loc);
    }

    loc.floors.forEach(f => {
      f.rooms.forEach(r => {
        if (r.toLowerCase().includes(cleanQ)) {
          matchedRooms.push({ room: r, floor: f.floorName, building: loc.name, buildingId: loc.id, color: loc.color });
        }
      });
    });
  });

  if (resultsContainer) {
    if (matchedBuildings.length === 0 && matchedRooms.length === 0) {
      resultsContainer.innerHTML = `<div style="padding:12px; text-align:center; color:#94A3B8; font-size:0.75rem;">No buildings or rooms found.</div>`;
    } else {
      let html = "";
      matchedRooms.slice(0, 4).forEach(item => {
        html += `
          <div class="ls-search-item" onclick="handleLocationSelect('${item.buildingId}'); closeSidebar();">
            <div class="ls-item-left">
              <span class="ls-item-title"><i class="fa-solid fa-chalkboard-user text-primary"></i> ${escapeHtml(item.room)}</span>
              <span class="ls-item-sub">${escapeHtml(item.building)} • ${escapeHtml(item.floor)}</span>
            </div>
            <button class="ls-item-btn" onclick="event.stopPropagation(); quickRouteToDestination('${item.buildingId}'); closeSidebar();">
              <i class="fa-solid fa-diamond-turn-right"></i> Go
            </button>
          </div>
        `;
      });
      matchedBuildings.slice(0, 5).forEach(loc => {
        html += `
          <div class="ls-search-item" onclick="handleLocationSelect('${loc.id}'); closeSidebar();">
            <div class="ls-item-left">
              <span class="ls-item-title"><i class="fa-solid ${loc.icon}" style="color:${loc.color}; margin-right:4px;"></i> ${escapeHtml(loc.name)}</span>
              <span class="ls-item-sub">${escapeHtml(loc.categoryLabel)} • ${escapeHtml(loc.code)}</span>
            </div>
            <button class="ls-item-btn" onclick="event.stopPropagation(); quickRouteToDestination('${loc.id}'); closeSidebar();">
              <i class="fa-solid fa-diamond-turn-right"></i> Go
            </button>
          </div>
        `;
      });
      resultsContainer.innerHTML = html;
    }
    resultsContainer.classList.remove("hidden");
  }
}

function initSidebarFeatures() {
  const sbSearch = document.getElementById("lsSidebarSearch");
  const sbClear = document.getElementById("lsSearchClear");
  if (sbSearch) {
    sbSearch.addEventListener("input", (e) => handleSidebarSearch(e.target.value));
  }
  if (sbClear) {
    sbClear.addEventListener("click", () => {
      if (sbSearch) sbSearch.value = "";
      document.getElementById("lsSearchResults")?.classList.add("hidden");
      sbClear.classList.add("hidden");
    });
  }

  document.getElementById("btnLsCalculateRoute")?.addEventListener("click", () => {
    const origin = document.getElementById("lsOriginSelect")?.value;
    const dest = document.getElementById("lsDestSelect")?.value;
    const activePill = document.querySelector(".ls-mode-pill.active");
    const mode = activePill ? activePill.getAttribute("data-lsmode") : "fastest";

    const route = findShortestCampusRoute(origin, dest, mode);
    calculateAndRenderRoute(origin, dest, mode);

    const summaryBox = document.getElementById("lsRouteSummary");
    const sTime = document.getElementById("lsSummaryTime");
    const sDist = document.getElementById("lsSummaryDist");
    const sVia = document.getElementById("lsSummaryVia");

    if (sTime) sTime.textContent = `${route.estimatedTimeMin} min`;
    if (sDist) sDist.textContent = `${route.totalDistance} m`;
    if (sVia) sVia.textContent = `${mode.toUpperCase()} route via campus concourse`;
    if (summaryBox) summaryBox.classList.remove("hidden");

    showToast(`Shortest Route Found: ${route.totalDistance} m (${route.estimatedTimeMin} min)`, "success");
  });

  document.getElementById("btnLsStartNav")?.addEventListener("click", () => {
    const origin = document.getElementById("lsOriginSelect")?.value;
    const dest = document.getElementById("lsDestSelect")?.value;
    const activePill = document.querySelector(".ls-mode-pill.active");
    const mode = activePill ? activePill.getAttribute("data-lsmode") : "fastest";

    closeSidebar();
    startLiveNavigation(origin, dest, mode);
  });

  document.querySelectorAll(".ls-mode-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".ls-mode-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const mode = pill.getAttribute("data-lsmode");
      const origin = document.getElementById("lsOriginSelect")?.value;
      const dest = document.getElementById("lsDestSelect")?.value;
      if (origin && dest) {
        calculateAndRenderRoute(origin, dest, mode);
      }
    });
  });
}

function setupEventListeners() {
  initSidebarFeatures();

  // Keyboard Shortcut: Ctrl+Shift+D to toggle Pedestrian Routing Debug Overlay
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "D" || e.key === "d")) {
      e.preventDefault();
      toggleRoutingDebugMode();
    }
  });

  // Password toggle
  document.getElementById("btnTogglePassword")?.addEventListener("click", () => {
    const pwInput = document.getElementById("loginPasswordInput");
    if (pwInput) {
      if (pwInput.type === "password") {
        pwInput.type = "text";
      } else {
        pwInput.type = "password";
      }
    }
  });

  // Logout triggers
  document.getElementById("btnSidebarLogout")?.addEventListener("click", handleLogout);
  document.getElementById("btnHeaderLogout")?.addEventListener("click", handleLogout);
  document.getElementById("linkSwitchUser")?.addEventListener("click", handleLogout);

  // Map view switcher (Blueprint vs Vector)
  document.getElementById("btnViewBlueprint")?.addEventListener("click", () => setMapViewMode("blueprint"));
  document.getElementById("btnViewVector")?.addEventListener("click", () => setMapViewMode("vector"));

  // Global search input
  const searchInput = document.getElementById("globalSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => handleGlobalSearch(e.target.value));
    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim().length > 0) {
        document.getElementById("searchDropdown")?.classList.remove("hidden");
      }
    });
  }

  document.getElementById("btnClearSearch")?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    document.getElementById("searchDropdown")?.classList.add("hidden");
    document.getElementById("btnClearSearch")?.classList.add("hidden");
  });

  // Popular search pills
  document.querySelectorAll(".search-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const targetName = pill.getAttribute("data-target");
      const loc = CAMPUS_LOCATIONS.find(l => l.name.toLowerCase().includes(targetName.toLowerCase()));
      if (loc) selectSearchResult(loc.id);
    });
  });

  // Route calculation button
  document.getElementById("btnCalculateRoute")?.addEventListener("click", () => {
    const origin = document.getElementById("routeOriginSelect")?.value;
    const dest = document.getElementById("routeDestSelect")?.value;
    calculateAndRenderRoute(origin, dest, AppState.activeRouteMode);
    showToast("Route computed on campus blueprint!", "success");
  });

  // Auto-display route immediately when destination is selected
  document.getElementById("routeDestSelect")?.addEventListener("change", (e) => {
    const origin = document.getElementById("routeOriginSelect")?.value || AppState.currentLocationId || "loc-gate-1";
    const dest = e.target.value;
    if (dest) {
      calculateAndRenderRoute(origin, dest, AppState.activeRouteMode || "fastest");
    }
  });

  // Auto-display route immediately when origin changes
  document.getElementById("routeOriginSelect")?.addEventListener("change", (e) => {
    const origin = e.target.value;
    const dest = document.getElementById("routeDestSelect")?.value;
    if (origin && dest && origin !== dest) {
      calculateAndRenderRoute(origin, dest, AppState.activeRouteMode || "fastest");
    }
  });

  // Swap Points button
  document.getElementById("btnSwapPoints")?.addEventListener("click", swapRoutePoints);

  // Use GPS button
  document.getElementById("btnUseCurrentAsStart")?.addEventListener("click", () => {
    const originSelect = document.getElementById("routeOriginSelect");
    if (originSelect) {
      originSelect.value = AppState.currentLocationId;
      showToast("Starting point set to current position", "info");
    }
  });

  // Mode tab selector
  document.querySelectorAll(".mode-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".mode-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const mode = tab.getAttribute("data-mode");
      const origin = document.getElementById("routeOriginSelect")?.value;
      const dest = document.getElementById("routeDestSelect")?.value;
      calculateAndRenderRoute(origin, dest, mode);
    });
  });

  // Simulate Walk & Clear Route
  document.getElementById("btnSimulateWalk")?.addEventListener("click", simulateWalkAlongRoute);
  document.getElementById("btnClearActiveRoute")?.addEventListener("click", () => {
    const routeLayer = document.getElementById("activeRouteLayer");
    if (routeLayer) routeLayer.innerHTML = "";
    document.querySelectorAll(".building-hotspot").forEach(p => p.classList.remove("selected"));
    showToast("Route cleared from map", "info");
  });

  // Map Filter Pills
  document.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const filter = pill.getAttribute("data-filter");
      applyMapFilter(filter);
    });
  });

  // Zoom controls
  document.getElementById("btnZoomIn")?.addEventListener("click", () => zoomMap(0.15));
  document.getElementById("btnZoomOut")?.addEventListener("click", () => zoomMap(-0.15));
  document.getElementById("btnResetMap")?.addEventListener("click", resetMapTransform);
  document.getElementById("btnLocateUser")?.addEventListener("click", () => {
    showToast("Located at " + (CAMPUS_LOCATIONS.find(l => l.id === AppState.currentLocationId)?.name || 'Campus'), "info");
    updateUserPulseIndicator();
  });

  document.getElementById("btnToggleAccessible")?.addEventListener("click", () => {
    document.querySelectorAll(".mode-tab").forEach(t => {
      if (t.getAttribute("data-mode") === "accessible") t.click();
    });
    showToast("Accessible route mode enabled", "success");
  });

  document.getElementById("btnToggleSafeMode")?.addEventListener("click", () => {
    document.querySelectorAll(".mode-tab").forEach(t => {
      if (t.getAttribute("data-mode") === "safe") t.click();
    });
    showToast("Safe Route mode enabled", "success");
  });

  document.getElementById("btnToggleEcoMode")?.addEventListener("click", () => {
    document.querySelectorAll(".mode-tab").forEach(t => {
      if (t.getAttribute("data-mode") === "eco") t.click();
    });
    showToast("Eco path enabled", "success");
  });

  document.getElementById("btnOpenEmergencyModal")?.addEventListener("click", () => {
    triggerEmergencyNavigation("loc-health");
  });

  // Emergency action buttons
  document.querySelectorAll(".btn-emg-route").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      triggerEmergencyNavigation(targetId);
    });
  });

  document.getElementById("btnShowAllEmergencyPins")?.addEventListener("click", highlightAllEmergencyPins);

  // Classroom search input & chips
  const roomSearchInput = document.getElementById("roomSearchInput");
  if (roomSearchInput) {
    roomSearchInput.addEventListener("input", (e) => {
      const activeChip = document.querySelector(".room-chip.active");
      const dept = activeChip ? activeChip.getAttribute("data-dept") : "all";
      handleClassroomSearch(e.target.value, dept);
    });
  }

  document.querySelectorAll(".room-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".room-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const dept = chip.getAttribute("data-dept");
      const q = document.getElementById("roomSearchInput")?.value || "";
      handleClassroomSearch(q, dept);
    });
  });

  // Notifications
  document.getElementById("btnNotification")?.addEventListener("click", () => {
    document.getElementById("notificationsModal")?.classList.remove("hidden");
    renderNotificationsFeed();
  });

  // Drawer buttons
  document.getElementById("btnDrawerNavigate")?.addEventListener("click", () => {
    if (AppState.selectedLocation) {
      document.getElementById("locationDrawerBackdrop")?.classList.add("hidden");
      quickRouteToDestination(AppState.selectedLocation.id);
    }
  });

  document.getElementById("btnDrawerSetStart")?.addEventListener("click", () => {
    if (AppState.selectedLocation) {
      AppState.currentLocationId = AppState.selectedLocation.id;
      const originSelect = document.getElementById("routeOriginSelect");
      if (originSelect) originSelect.value = AppState.selectedLocation.id;
      updateUserPulseIndicator();
      showToast(`Starting point set to ${AppState.selectedLocation.name}`, "info");
    }
  });

  document.getElementById("btnDrawerStreetView")?.addEventListener("click", () => {
    if (AppState.selectedLocation) {
      openStreetView(AppState.selectedLocation.id);
    }
  });

  document.getElementById("btnDrawerToggleFav")?.addEventListener("click", () => {
    if (AppState.selectedLocation) toggleFavoriteLocation(AppState.selectedLocation.id);
  });

  // Close modals
  document.getElementById("btnCloseDrawer")?.addEventListener("click", () => {
    document.getElementById("locationDrawerBackdrop")?.classList.add("hidden");
  });
  document.getElementById("locationDrawerBackdrop")?.addEventListener("click", (e) => {
    if (e.target.id === "locationDrawerBackdrop") {
      document.getElementById("locationDrawerBackdrop")?.classList.add("hidden");
    }
  });

  document.getElementById("btnCloseQrModal")?.addEventListener("click", closeAllModals);
  document.getElementById("btnCancelQr")?.addEventListener("click", closeAllModals);
  document.getElementById("btnCloseClassroomModal")?.addEventListener("click", closeAllModals);
  document.getElementById("btnCloseNotifModal")?.addEventListener("click", closeAllModals);
  document.getElementById("btnCloseNotif")?.addEventListener("click", closeAllModals);

  document.getElementById("btnCloseBanner")?.addEventListener("click", () => {
    document.getElementById("announcementBanner")?.classList.add("hidden");
  });

  // Clear Recents
  document.getElementById("btnClearRecent")?.addEventListener("click", () => {
    AppState.recentDestinations = [];
    renderFavoritesAndRecents();
    showToast("Recent history cleared", "info");
  });

  // Theme toggle
  document.getElementById("btnToggleTheme")?.addEventListener("click", () => {
    document.body.classList.toggle("theme-dark");
    const isDark = document.body.classList.contains("theme-dark");
    showToast(isDark ? "High-contrast dark mode enabled" : "Standard light mode enabled", "info");
  });

  // Mobile sidebar toggle
  document.getElementById("btnSidebarToggle")?.addEventListener("click", () => {
    document.getElementById("sidebar")?.classList.toggle("open");
  });

  // Mobile bottom bar navigation
  document.querySelectorAll(".m-nav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".m-nav-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const target = item.getAttribute("data-target");

      if (target === "map") document.getElementById("mapViewport")?.scrollIntoView({ behavior: "smooth" });
      else if (target === "route") document.getElementById("routePanel")?.scrollIntoView({ behavior: "smooth" });
      else if (target === "emergency") document.getElementById("emergencySection")?.scrollIntoView({ behavior: "smooth" });
      else document.getElementById("mainContent")?.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Sidebar navigation items
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
    item.addEventListener("click", () => {
      const view = item.getAttribute("data-view");
      if (view === "browser") openCampusBrowser("campus://explore");
      else if (view === "map") document.getElementById("mapViewport")?.scrollIntoView({ behavior: "smooth" });
      else if (view === "route") document.getElementById("routePanel")?.scrollIntoView({ behavior: "smooth" });
      else if (view === "classrooms") {
        document.getElementById("classroomFinderModal")?.classList.remove("hidden");
        handleClassroomSearch();
      }
      document.getElementById("sidebar")?.classList.remove("open");
    });
  });

  // Diagram Pics Toggle
  document.getElementById("btnToggleDiagrams")?.addEventListener("click", toggleDiagramVisuals);

  // Campus Web Browser open button in sidebar
  document.getElementById("navBrowser")?.addEventListener("click", () => {
    openCampusBrowser("campus://explore");
    document.getElementById("sidebar")?.classList.remove("open");
  });

  // Campus Browser Window actions
  document.getElementById("btnBrowserClose")?.addEventListener("click", closeCampusBrowser);
  document.getElementById("btnBrowserMinimize")?.addEventListener("click", closeCampusBrowser);
  document.getElementById("btnBrowserHome")?.addEventListener("click", () => loadBrowserUrl("campus://explore"));
  document.getElementById("btnBrowserReload")?.addEventListener("click", () => {
    const url = document.getElementById("browserUrlInput")?.value || "campus://explore";
    loadBrowserUrl(url);
    showToast("Reloaded " + url, "info");
  });
  document.getElementById("btnBrowserBack")?.addEventListener("click", () => {
    if (AppState.browserHistoryIndex > 0) {
      AppState.browserHistoryIndex--;
      const prevUrl = AppState.browserHistory[AppState.browserHistoryIndex];
      loadBrowserUrl(prevUrl);
    }
  });
  document.getElementById("btnBrowserForward")?.addEventListener("click", () => {
    if (AppState.browserHistoryIndex < AppState.browserHistory.length - 1) {
      AppState.browserHistoryIndex++;
      const nextUrl = AppState.browserHistory[AppState.browserHistoryIndex];
      loadBrowserUrl(nextUrl);
    }
  });
  document.getElementById("btnBrowserGo")?.addEventListener("click", () => {
    const val = document.getElementById("browserUrlInput")?.value;
    loadBrowserUrl(val);
  });
  document.getElementById("browserUrlInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      loadBrowserUrl(e.target.value);
    }
  });

  // Browser bookmarks click
  document.querySelectorAll(".b-bookmark").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      loadBrowserUrl("campus://" + target);
    });
  });

  // Live Nav HUD controls
  document.getElementById("btnHudExit")?.addEventListener("click", exitLiveNavigation);
  document.getElementById("btnHudPrev")?.addEventListener("click", () => {
    if (AppState.liveNavStepIndex > 0) {
      updateLiveNavHudStep(AppState.liveNavStepIndex - 1);
    }
  });
  document.getElementById("btnHudNext")?.addEventListener("click", () => {
    if (AppState.activeRoute && AppState.activeRoute.steps && AppState.liveNavStepIndex < AppState.activeRoute.steps.length - 1) {
      updateLiveNavHudStep(AppState.liveNavStepIndex + 1);
    }
  });
  document.getElementById("btnHudPlay")?.addEventListener("click", simulateWalkAlongRoute);
  document.getElementById("btnHudVoice")?.addEventListener("click", toggleVoiceGuidance);

  // 360 Street View controls
  document.getElementById("btnCloseStreetView")?.addEventListener("click", closeStreetView);
  document.getElementById("streetViewModal")?.addEventListener("click", (e) => {
    if (e.target.id === "streetViewModal") closeStreetView();
  });
  document.getElementById("btnStreetViewAudio")?.addEventListener("click", () => {
    showToast("Simulating peaceful campus garden ambience 🍃", "info");
  });

  // Tour
  document.getElementById("linkDemoTour")?.addEventListener("click", startInteractiveTour);
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.add("hidden"));
}

function applyMapFilter(category) {
  AppState.activeMapFilter = category;

  // Build lookup map for quick location metadata matching
  const locMap = {};
  CAMPUS_LOCATIONS.forEach(l => { locMap[l.id] = l; });

  // 1. Filter building hotspots
  document.querySelectorAll(".building-hotspot").forEach(item => {
    const locId = item.getAttribute("data-id");
    const loc = locMap[locId];
    const itemCat = item.getAttribute("data-cat") || loc?.category;
    let match = (category === "all");
    if (category === "academic" && (itemCat === "academic" || loc?.category === "academic")) match = true;
    else if (category === "amenities" && (itemCat === "amenities" || loc?.category === "amenities")) match = true;
    else if (category === "emergency" && (itemCat === "emergency" || loc?.category === "emergency")) match = true;
    else if (category === "gates" && (itemCat === "gates" || loc?.category === "gates" || locId?.includes("gate"))) match = true;
    else if (category === "parking" && (itemCat === "parking" || loc?.facilities?.some(f => f.toLowerCase().includes("parking")))) match = true;
    else if (category === "restrooms" && loc?.facilities?.some(f => f.toLowerCase().includes("restroom"))) match = true;
    else if (category === "water" && loc?.facilities?.some(f => f.toLowerCase().includes("water") || f.toLowerCase().includes("ro"))) match = true;
    else if (itemCat === category) match = true;

    item.style.display = match ? "" : "none";
  });

  // 2. Visually Highlight / Dim SVG Blueprint Blocks on the Map Canvas
  document.querySelectorAll(".svg-bp-block").forEach(block => {
    const onclickAttr = block.getAttribute("onclick") || "";
    const m = onclickAttr.match(/handleLocationSelect\(['"]([^'"]+)['"]\)/);
    const locId = m ? m[1] : (block.getAttribute("data-loc") || "");
    const loc = locMap[locId];

    if (category === "all") {
      block.style.opacity = "1";
      block.classList.remove("map-filtered-highlight", "map-filtered-dim");
      return;
    }

    let isMatch = false;
    if (loc) {
      if (category === "academic") isMatch = (loc.category === "academic");
      else if (category === "amenities") isMatch = (loc.category === "amenities");
      else if (category === "emergency") isMatch = (loc.category === "emergency");
      else if (category === "gates") isMatch = (loc.category === "gates" || loc.id.includes("gate"));
      else if (category === "parking") isMatch = (loc.category === "parking" || loc.facilities?.some(f => f.toLowerCase().includes("parking")));
      else if (category === "restrooms") isMatch = (loc.facilities?.some(f => f.toLowerCase().includes("restroom")));
      else if (category === "water") isMatch = (loc.facilities?.some(f => f.toLowerCase().includes("water") || f.toLowerCase().includes("ro")));
      else isMatch = (loc.category === category);
    } else {
      const bId = block.id || "";
      if (category === "gates" && bId.includes("gate")) isMatch = true;
      if (category === "academic" && (bId.includes("admin") || bId.includes("intel") || bId.includes("tech") || bId.includes("soans") || bId.includes("soci") || bId.includes("soag") || bId.includes("francis") || bId.includes("gino") || bId.includes("soosai") || bId.includes("raja") || bId.includes("pushbam") || bId.includes("muthraj"))) isMatch = true;
      if (category === "amenities" && (bId.includes("mess") || bId.includes("cafe") || bId.includes("teresa") || bId.includes("grace") || bId.includes("sac"))) isMatch = true;
      if (category === "emergency" && bId.includes("health")) isMatch = true;
    }

    if (isMatch) {
      block.style.opacity = "1";
      block.classList.add("map-filtered-highlight");
      block.classList.remove("map-filtered-dim");
    } else {
      block.style.opacity = "0.22";
      block.classList.remove("map-filtered-highlight");
      block.classList.add("map-filtered-dim");
    }
  });

  // 3. Filter Markers Layer
  document.querySelectorAll(".marker-group").forEach(marker => {
    const markerCat = marker.getAttribute("data-cat");
    if (category === "all" || markerCat === category) {
      marker.style.display = "";
    } else {
      marker.style.display = "none";
    }
  });

  const filterNames = {
    all: "All campus blocks",
    academic: "Academic Blocks & Departments",
    amenities: "Dining, Cafes & Mess Halls",
    emergency: "Health & Emergency SOS Points",
    gates: "Campus Gates & Entrances",
    parking: "Parking Zones",
    restrooms: "Restroom Facilities",
    water: "RO Drinking Water Points"
  };

  if (category !== "all") {
    showToast(`📍 Showing ${filterNames[category] || category} on map`, "info");
  }
}

function zoomMap(delta) {
  AppState.mapZoom = Math.min(2.5, Math.max(0.6, AppState.mapZoom + delta));
  const wrapper = document.getElementById("svgMapWrapper");
  if (wrapper) wrapper.style.transform = `scale(${AppState.mapZoom})`;
}

function resetMapTransform() {
  AppState.mapZoom = 1.0;
  const wrapper = document.getElementById("svgMapWrapper");
  if (wrapper) wrapper.style.transform = "scale(1)";
  showToast("Map view reset", "info");
}

function startInteractiveTour() {
  showToast("Starting Campus Navigation Demo Tour...", "info");
  setTimeout(() => {
    handleLocationSelect("loc-intel-joe");
    showToast("Tour 1: Intel JOE & E-Learning Centre", "info");
  }, 800);

  setTimeout(() => {
    document.getElementById("btnCloseDrawer")?.click();
    calculateAndRenderRoute("loc-gate-1", "loc-admin", "accessible");
    showToast("Tour 2: Accessible Routing from Gate 1 to Admin Block", "info");
  }, 3500);

  setTimeout(() => {
    simulateWalkAlongRoute();
  }, 6000);
}

// ==========================================================================
// MAP HOVER CARD & DIAGRAM DISPLAY HELPERS
// ==========================================================================

function initMapHoverCard() {
  document.getElementById("btnMhcDetails")?.addEventListener("click", () => {
    if (AppState.hoveredLocation) handleLocationSelect(AppState.hoveredLocation.id);
    hideMapHoverCard();
  });

  document.getElementById("btnMhcNav")?.addEventListener("click", () => {
    if (AppState.hoveredLocation) quickRouteToDestination(AppState.hoveredLocation.id);
    hideMapHoverCard();
  });
}

function handleBuildingMouseEnter(locId, event) {
  const loc = CAMPUS_LOCATIONS.find(l => l.id === locId);
  if (!loc) return;

  AppState.hoveredLocation = loc;
  const card = document.getElementById("mapHoverCard");
  const viewport = document.getElementById("mapViewport");
  if (!card || !viewport) return;

  const catEl = document.getElementById("mhcCategory");
  const titleEl = document.getElementById("mhcTitle");
  const descEl = document.getElementById("mhcDesc");
  const badge = document.getElementById("mhcIconBadge");

  if (catEl) catEl.textContent = loc.categoryLabel;
  if (titleEl) titleEl.textContent = loc.name;
  if (descEl) descEl.textContent = loc.description;
  if (badge) {
    badge.innerHTML = `<i class="fa-solid ${loc.icon}"></i>`;
    badge.style.color = loc.color;
  }

  const routeSample = findShortestCampusRoute(AppState.currentLocationId, loc.id, "fastest");
  const distEl = document.getElementById("mhcDistance");
  if (distEl) distEl.innerHTML = `<i class="fa-solid fa-person-walking"></i> ${routeSample.totalDistance} m (${routeSample.estimatedTimeMin}m walk)`;

  const vpRect = viewport.getBoundingClientRect();
  const svg = document.getElementById("campusSvg");
  if (!svg) return;

  const svgRect = svg.getBoundingClientRect();
  const scaleX = svgRect.width / 815;
  const scaleY = svgRect.height / 1024;

  const cardX = (loc.coords.x * scaleX) + (svgRect.left - vpRect.left);
  const cardY = (loc.coords.y * scaleY) + (svgRect.top - vpRect.top);

  card.style.left = `${Math.max(130, Math.min(vpRect.width - 130, cardX))}px`;
  card.style.top = `${Math.max(120, cardY - 20)}px`;
  card.classList.remove("hidden");
}

function handleBuildingMouseLeave() {
  hideMapHoverCard();
}

function hideMapHoverCard() {
  const card = document.getElementById("mapHoverCard");
  if (card) card.classList.add("hidden");
}

function toggleDiagramVisuals() {
  AppState.showDiagramPics = !AppState.showDiagramPics;
  const btn = document.getElementById("btnToggleDiagrams");
  const layer = document.getElementById("buildingIllustrationsLayer");

  if (AppState.showDiagramPics) {
    btn?.classList.add("active");
    layer?.classList.remove("hidden");
    showToast("Block diagrams & unique pictures enabled", "success");
  } else {
    btn?.classList.remove("active");
    layer?.classList.add("hidden");
    showToast("Block diagrams hidden (clean blueprint)", "info");
  }
}

// ==========================================================================
// LIVE IN-BROWSER TURN-BY-TURN HUD & SPEECH GUIDANCE
// ==========================================================================

function startLiveNavigation(startId, endId, mode = "fastest") {
  AppState.liveNavActive = true;
  AppState.liveNavStepIndex = 0;
  calculateAndRenderRoute(startId, endId, mode);

  const hud = document.getElementById("liveNavHud");
  if (hud) hud.classList.remove("hidden");

  updateLiveNavHudStep(0);
  showToast("In-Browser Turn-by-Turn Navigation Started 🚀", "success");
}

function exitLiveNavigation() {
  AppState.liveNavActive = false;
  AppState.liveNavStepIndex = 0;
  const hud = document.getElementById("liveNavHud");
  if (hud) hud.classList.add("hidden");
  showToast("Navigation ended", "info");
}

function updateLiveNavHudStep(stepIdx) {
  if (!AppState.activeRoute || !AppState.activeRoute.steps || AppState.activeRoute.steps.length === 0) return;
  const steps = AppState.activeRoute.steps;
  const safeIdx = Math.max(0, Math.min(steps.length - 1, stepIdx));
  AppState.liveNavStepIndex = safeIdx;

  const currentStep = steps[safeIdx];
  const hudDist = document.getElementById("hudNextDist");
  const hudText = document.getElementById("hudInstructionText");
  const hudIcon = document.getElementById("hudTurnIcon");
  const hudBar = document.getElementById("hudProgressBar");
  const hudEta = document.getElementById("hudEtaText");
  const hudRem = document.getElementById("hudRemainingDist");

  if (hudDist) hudDist.textContent = currentStep.dist || "Ahead";
  if (hudText) hudText.textContent = currentStep.text;

  let iconClass = "fa-person-walking";
  if (currentStep.text.toLowerCase().includes("turn right")) iconClass = "fa-arrow-turn-down fa-rotate-270";
  else if (currentStep.text.toLowerCase().includes("turn left")) iconClass = "fa-arrow-turn-down fa-rotate-90";
  else if (currentStep.text.toLowerCase().includes("arrive") || currentStep.text.toLowerCase().includes("destination")) iconClass = "fa-flag-checkered";
  else if (currentStep.text.toLowerCase().includes("straight")) iconClass = "fa-arrow-up";

  if (hudIcon) {
    hudIcon.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
    if (safeIdx === steps.length - 1) hudIcon.classList.add("arrive");
    else hudIcon.classList.remove("arrive");
  }

  const progressPercent = Math.round(((safeIdx + 1) / steps.length) * 100);
  if (hudBar) hudBar.style.width = `${progressPercent}%`;

  const remainingDist = Math.max(0, Math.round(AppState.activeRoute.totalDistance * (1 - (safeIdx / steps.length))));
  if (hudRem) hudRem.textContent = `${remainingDist} m remaining`;
  if (hudEta) hudEta.innerHTML = `<i class="fa-regular fa-clock"></i> Step ${safeIdx + 1} of ${steps.length}`;

  if (AppState.voiceGuidanceEnabled) {
    speakInstruction(currentStep.text);
  }

  if (AppState.activeRoute.nodes && AppState.activeRoute.nodes[safeIdx]) {
    const nodeKey = AppState.activeRoute.nodes[safeIdx];
    const node = WALKWAY_NODES[nodeKey];
    if (node) {
      updateUserPositionAtCoords(node.x, node.y);
    }
  }
}

function speakInstruction(text) {
  // Voice over of directions is strictly silenced unless explicitly turned on by user
  if (!AppState.voiceGuidanceEnabled || !('speechSynthesis' in window)) {
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[•\(\)]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Speech synthesis unavailable", e);
  }
}

function updateUserPositionAtCoords(x, y) {
  const container = document.getElementById("userPulseLayer");
  if (!container) return;
  container.innerHTML = `
    <g id="userGpsMarker" transform="translate(${x}, ${y})">
      <circle cx="0" cy="0" r="18" fill="#7C3AED" class="user-pulse-ring" opacity="0.5"/>
      <circle cx="0" cy="0" r="9" fill="#FFFFFF" filter="url(#buildingShadow)"/>
      <circle cx="0" cy="0" r="6" fill="#7C3AED"/>
      <circle cx="0" cy="0" r="2" fill="#FFFFFF"/>
      <text x="0" y="22" font-family="Plus Jakarta Sans, sans-serif" font-size="8" font-weight="800" fill="#4C1D95" text-anchor="middle">LIVE GUIDANCE</text>
    </g>
  `;
}

// ==========================================================================
// CAMPUS WEB BROWSER ENGINE (campus:// Explorer)
// ==========================================================================

function openCampusBrowser(initialUrl = "campus://explore") {
  const overlay = document.getElementById("campusBrowserOverlay");
  if (!overlay) return;

  overlay.classList.remove("hidden");
  loadBrowserUrl(initialUrl);
}

function closeCampusBrowser() {
  const overlay = document.getElementById("campusBrowserOverlay");
  if (overlay) overlay.classList.add("hidden");
}

function loadBrowserUrl(url) {
  if (!url) url = "campus://explore";
  const cleanUrl = url.trim();
  const input = document.getElementById("browserUrlInput");
  if (input) input.value = cleanUrl;

  if (AppState.browserHistory[AppState.browserHistoryIndex] !== cleanUrl) {
    AppState.browserHistory = AppState.browserHistory.slice(0, AppState.browserHistoryIndex + 1);
    AppState.browserHistory.push(cleanUrl);
    AppState.browserHistoryIndex = AppState.browserHistory.length - 1;
  }

  const container = document.getElementById("browserBody");
  if (!container) return;

  const targetSlug = cleanUrl.replace("campus://", "").toLowerCase();

  const matchedLoc = CAMPUS_LOCATIONS.find(l => 
    l.id.toLowerCase().includes(targetSlug) || 
    l.name.toLowerCase().includes(targetSlug) ||
    l.code.toLowerCase().includes(targetSlug)
  );

  if (targetSlug !== "explore" && matchedLoc) {
    renderBrowserBuildingPage(matchedLoc, container);
    return;
  }

  renderBrowserDirectoryPage(container);
}

function renderBrowserDirectoryPage(container) {
  let html = `
    <div class="browser-hero-banner">
      <div class="browser-hero-text">
        <h2>Campus Web Explorer &amp; Directory 🌐</h2>
        <p>Explore university blocks, lecture halls, laboratories, dining commons, and visual architectural guides in real-time.</p>
      </div>
      <div class="browser-hero-stats">
        <div class="b-stat">
          <span class="b-stat-num">${CAMPUS_LOCATIONS.length}</span>
          <span class="b-stat-lbl">Mapped Places</span>
        </div>
        <div class="b-stat">
          <span class="b-stat-num">5</span>
          <span class="b-stat-lbl">Entry Gates</span>
        </div>
        <div class="b-stat">
          <span class="b-stat-num">24/7</span>
          <span class="b-stat-lbl">Live Nav</span>
        </div>
      </div>
    </div>

    <div class="browser-filters-bar">
      <div class="browser-cat-pills" id="browserCatPills">
        <button class="b-filter-pill active" data-bcat="all">All Locations (${CAMPUS_LOCATIONS.length})</button>
        <button class="b-filter-pill" data-bcat="academic">Academic Blocks</button>
        <button class="b-filter-pill" data-bcat="amenities">Dining &amp; Living</button>
        <button class="b-filter-pill" data-bcat="emergency">Health &amp; Emergency</button>
        <button class="b-filter-pill" data-bcat="gates">Perimeter Gates</button>
      </div>
      <div class="browser-search-box">
        <i class="fa-solid fa-magnifying-glass text-muted"></i>
        <input type="text" id="browserSearchPlaces" placeholder="Search campus directory..." oninput="handleBrowserPlaceSearch(this.value)">
      </div>
    </div>

    <div class="browser-places-grid" id="browserPlacesGrid">
  `;

  CAMPUS_LOCATIONS.forEach(loc => {
    const routeSample = findShortestCampusRoute(AppState.currentLocationId, loc.id, "fastest");
    html += `
      <div class="browser-place-card" data-cat="${loc.category}" data-name="${loc.name.toLowerCase()}">
        <div class="b-card-banner" style="background: linear-gradient(135deg, ${loc.color} 0%, #0F172A 100%); position:relative; overflow:hidden;">
          <div style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0.35; pointer-events:none;">
            ${getBuildingVisualArtwork(loc.theme || getThemeForLocation(loc), loc.color, loc.name)}
          </div>
          <span class="b-card-badge">${loc.categoryLabel}</span>
          <span class="b-card-dist"><i class="fa-solid fa-person-walking"></i> ${routeSample.totalDistance} m</span>
          <i class="fa-solid ${loc.icon}" style="font-size: 2.5rem; color: rgba(255, 255, 255, 0.9); z-index:2; position:relative;"></i>
        </div>
        <div class="b-card-body">
          <div class="b-card-title-row">
            <h3 class="b-card-title">${loc.name}</h3>
            <span class="b-card-code">${loc.code}</span>
          </div>
          <p class="b-card-desc">${loc.description}</p>
          <div class="b-card-facilities">
            ${loc.facilities.slice(0, 3).map(f => `<span class="b-fac-pill"><i class="fa-solid fa-check"></i> ${f}</span>`).join("")}
          </div>
        </div>
        <div class="b-card-actions">
          <button class="b-btn-action details" onclick="handleLocationSelect('${loc.id}'); closeCampusBrowser();" title="View details in side panel">
            <i class="fa-solid fa-circle-info"></i> Details
          </button>
          <button class="b-btn-action street" onclick="openStreetView('${loc.id}')">
            <i class="fa-solid fa-street-view"></i> 360° View
          </button>
          <button class="b-btn-action route" onclick="browserLaunchRoute('${loc.id}')">
            <i class="fa-solid fa-diamond-turn-right"></i> Navigate
          </button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;

  document.querySelectorAll(".b-filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".b-filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const cat = pill.getAttribute("data-bcat");
      filterBrowserPlacesGrid(cat);
    });
  });
}

function handleBrowserPlaceSearch(q) {
  const cleanQ = q.trim().toLowerCase();
  document.querySelectorAll(".browser-place-card").forEach(card => {
    const name = card.getAttribute("data-name") || "";
    if (cleanQ.length === 0 || name.includes(cleanQ)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

function filterBrowserPlacesGrid(category) {
  document.querySelectorAll(".browser-place-card").forEach(card => {
    const cardCat = card.getAttribute("data-cat");
    if (category === "all" || cardCat === category) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

function renderBrowserBuildingPage(loc, container) {
  const routeSample = findShortestCampusRoute(AppState.currentLocationId, loc.id, "fastest");
  container.innerHTML = `
    <div style="background: var(--bg-card); border: 1px solid var(--glass-border); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow-md);">
      <div style="height: 180px; background: linear-gradient(135deg, ${loc.color} 0%, #0F172A 100%); position: relative; padding: 24px; color: #FFFFFF; display: flex; align-items: flex-end; justify-content: space-between;">
        <div>
          <span style="font-size: 0.72rem; font-weight: 700; background: rgba(255, 255, 255, 0.2); padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">${loc.categoryLabel}</span>
          <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin: 6px 0 2px 0;">${loc.name}</h2>
          <span style="font-size: 0.82rem; opacity: 0.9;">${loc.code} • Official Blueprint Landmark</span>
        </div>
        <button class="btn-class-nav primary" onclick="browserLaunchRoute('${loc.id}')" style="font-size: 0.85rem; padding: 10px 18px;">
          <i class="fa-solid fa-diamond-turn-right"></i> Start Navigation (${routeSample.totalDistance} m)
        </button>
      </div>

      <div style="padding: 24px; display: flex; flex-direction: column; gap: 20px;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: var(--bg-app); padding: 14px; border-radius: 10px;">
          <div><strong style="display:block; font-size: 0.9rem;">${loc.openingHours}</strong><span style="font-size:0.72rem; color:var(--text-muted);">Hours</span></div>
          <div><strong style="display:block; font-size: 0.9rem;">${routeSample.totalDistance} m (~${routeSample.estimatedTimeMin} min)</strong><span style="font-size:0.72rem; color:var(--text-muted);">Distance</span></div>
          <div><strong style="display:block; font-size: 0.9rem;">${loc.contact}</strong><span style="font-size:0.72rem; color:var(--text-muted);">Contact</span></div>
        </div>

        <div>
          <h4 style="font-family: var(--font-heading); font-size: 1rem; margin-bottom: 6px;"><i class="fa-solid fa-circle-info text-primary"></i> About ${loc.name}</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">${loc.description}</p>
        </div>

        <div>
          <h4 style="font-family: var(--font-heading); font-size: 1rem; margin-bottom: 8px;"><i class="fa-solid fa-boxes-stacked text-primary"></i> Facilities &amp; Amenities</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${loc.facilities.map(f => `<span class="fac-tag"><i class="fa-solid fa-check"></i> ${f}</span>`).join("")}
            ${loc.accessibleFeatures.map(a => `<span class="fac-tag" style="background:#ECFDF5; color:#059669"><i class="fa-solid fa-wheelchair"></i> ${a}</span>`).join("")}
          </div>
        </div>

        <div>
          <h4 style="font-family: var(--font-heading); font-size: 1rem; margin-bottom: 8px;"><i class="fa-solid fa-stairs text-primary"></i> Floor Directory &amp; Classrooms</h4>
          <div class="floor-accordion">
            ${loc.floors.map(f => `
              <div class="floor-card">
                <div class="floor-head">
                  <span><i class="fa-solid fa-layer-group text-primary" style="margin-right:6px;"></i>${f.floorName}</span>
                  <span style="font-size:0.7rem; color:#64748B;">${f.rooms.length} Units</span>
                </div>
                <div class="floor-rooms-list">${f.rooms.join(" • ")}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <div style="display:flex; gap:10px; border-top:1px solid var(--glass-border); padding-top:16px;">
          <button class="b-btn-action street" onclick="openStreetView('${loc.id}')" style="padding:10px 16px;">
            <i class="fa-solid fa-street-view"></i> Open 360° Street View
          </button>
          <button class="b-btn-action street" onclick="loadBrowserUrl('campus://explore')">
            <i class="fa-solid fa-arrow-left"></i> Back to Directory
          </button>
        </div>
      </div>
    </div>
  `;
}

function browserLaunchRoute(destId) {
  closeCampusBrowser();
  quickRouteToDestination(destId);
  startLiveNavigation(AppState.currentLocationId, destId, AppState.activeRouteMode);
}

function browserGoBack() {
  if (AppState.browserHistoryIndex > 0) {
    AppState.browserHistoryIndex--;
    const url = AppState.browserHistory[AppState.browserHistoryIndex];
    const input = document.getElementById("browserUrlInput");
    if (input) input.value = url;
    loadBrowserUrlDirect(url);
  }
}

function browserGoForward() {
  if (AppState.browserHistoryIndex < AppState.browserHistory.length - 1) {
    AppState.browserHistoryIndex++;
    const url = AppState.browserHistory[AppState.browserHistoryIndex];
    const input = document.getElementById("browserUrlInput");
    if (input) input.value = url;
    loadBrowserUrlDirect(url);
  }
}

function browserReload() {
  const currentUrl = AppState.browserHistory[AppState.browserHistoryIndex] || "campus://explore";
  loadBrowserUrlDirect(currentUrl);
  showToast("Page refreshed", "info");
}

function loadBrowserUrlDirect(url) {
  if (!url) url = "campus://explore";
  const cleanUrl = url.trim();
  const input = document.getElementById("browserUrlInput");
  if (input) input.value = cleanUrl;
  const container = document.getElementById("browserBody");
  if (!container) return;

  const targetSlug = cleanUrl.replace("campus://", "").toLowerCase();
  const matchedLoc = CAMPUS_LOCATIONS.find(l => 
    l.id.toLowerCase().includes(targetSlug) || 
    l.name.toLowerCase().includes(targetSlug) ||
    l.code.toLowerCase().includes(targetSlug)
  );

  if (targetSlug !== "explore" && matchedLoc) {
    renderBrowserBuildingPage(matchedLoc, container);
    return;
  }
  renderBrowserDirectoryPage(container);
}

// ==========================================================================
// ACADEMICS VIEW ON CAMPUS MAP
// ==========================================================================

function showAcademicsMap() {
  closeAllModals();
  // Close mobile sidebar if open
  document.getElementById("sidebar")?.classList.remove("open");

  // Activate Academic filter pill on map
  document.querySelectorAll(".filter-pill").forEach(p => {
    if (p.getAttribute("data-filter") === "academic") {
      p.classList.add("active");
    } else {
      p.classList.remove("active");
    }
  });

  applyMapFilter("academic");
  resetMapTransform();

  // Scroll map into view if on mobile
  const mapSection = document.getElementById("interactiveCampusMap");
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  showToast("🎓 Viewing Academic Blocks & Departments on Campus Map", "info");
}

// ==========================================================================
// CAMPUS NOTIFICATIONS & ADMIN BROADCAST ENGINE
// ==========================================================================

const CAMPUS_NOTIF_STORAGE_KEY = "suma_campus_notifications";

const DEFAULT_CAMPUS_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Semester Assessment Schedules Released",
    message: "Mid-semester schedule and allocated examination halls available at Admin COE Block.",
    category: "academic",
    sender: "Office of the Dean",
    time: "10 mins ago",
    read: false
  },
  {
    id: "notif-2",
    title: "Electric Shuttle Bus Route Active",
    message: "Autonomous shuttle Alpha loop running continuously connecting Gate 1, Admin COE, Tech Labs and Teresa Grace Hostels.",
    category: "facility",
    sender: "Campus Transit Command",
    time: "1 hour ago",
    read: false
  },
  {
    id: "notif-3",
    title: "Health Centre & 24/7 SOS Unit",
    message: "Community Health Centre & 24/7 Medical Response Unit is on active duty near Gate 3. Emergency hotline Ext. 911 / 108.",
    category: "urgent",
    sender: "Campus Emergency Unit",
    time: "Today",
    read: true
  }
];

function getStoredNotifications() {
  try {
    const raw = localStorage.getItem(CAMPUS_NOTIF_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Error reading notifications:", e);
  }
  return [...DEFAULT_CAMPUS_NOTIFICATIONS];
}

function saveNotifications(notifications) {
  try {
    localStorage.setItem(CAMPUS_NOTIF_STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.warn("Error saving notifications:", e);
  }
}

function renderNotificationsFeed() {
  const container = document.getElementById("notifFeedList");
  if (!container) return;

  const notifs = getStoredNotifications();
  const unreadCount = notifs.filter(n => !n.read).length;

  // Update notification dot on header bell button
  const notifDot = document.querySelector("#btnNotification .notif-dot");
  if (notifDot) {
    notifDot.style.display = unreadCount > 0 ? "block" : "none";
  }

  if (notifs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">
        <i class="fa-regular fa-bell-slash" style="font-size: 2rem; margin-bottom: 10px; display: block; opacity: 0.5;"></i>
        <p>No campus notifications at this time.</p>
      </div>
    `;
    return;
  }

  const isAdmin = !!(AppState.currentUser && AppState.currentUser.role === "admin");

  const badgeIcons = {
    urgent: { icon: "fa-triangle-exclamation", label: "Urgent Alert", color: "#EF4444", bg: "rgba(239, 68, 68, 0.12)" },
    academic: { icon: "fa-graduation-cap", label: "Academic", color: "#0284C7", bg: "rgba(2, 132, 199, 0.12)" },
    facility: { icon: "fa-building", label: "Facility Update", color: "#10B981", bg: "rgba(16, 185, 129, 0.12)" },
    general: { icon: "fa-bullhorn", label: "Campus Notice", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.12)" }
  };

  let html = "";
  notifs.forEach(n => {
    const badge = badgeIcons[n.category] || badgeIcons.general;
    html += `
      <div class="notif-card-item ${n.read ? 'read' : 'unread'}" id="notif-item-${n.id}">
        <div class="notif-card-top">
          <span class="notif-category-badge" style="color: ${badge.color}; background: ${badge.bg};">
            <i class="fa-solid ${badge.icon}"></i> ${badge.label}
          </span>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="notif-time">${n.time || "Recently"}</span>
            ${isAdmin ? `<button class="btn-delete-notif" onclick="adminDeleteNotification('${n.id}')" title="Delete Broadcast"><i class="fa-solid fa-trash-can"></i></button>` : ''}
          </div>
        </div>
        <h4 class="notif-title">${escapeHtml(n.title)}</h4>
        <p class="notif-body">${escapeHtml(n.message)}</p>
        <div class="notif-sender">
          <i class="fa-solid fa-shield-halved" style="color: var(--primary);"></i>
          <span>Declared by: <strong>${escapeHtml(n.sender || "Campus Administration")}</strong></span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function adminDeclareNotification() {
  const isAdmin = !!(AppState.currentUser && AppState.currentUser.role === "admin");
  if (!isAdmin) {
    showToast("⚠️ Permission denied: Only Campus Administrators can broadcast notifications.", "alert");
    return;
  }

  const titleInput = document.getElementById("adminBroadcastTitle");
  const messageInput = document.getElementById("adminBroadcastMessage");
  const categorySelect = document.getElementById("adminBroadcastCategory");

  const title = titleInput?.value.trim() || "";
  const message = messageInput?.value.trim() || "";
  const category = categorySelect?.value || "general";

  if (!title) {
    showToast("Please enter a title or subject for the broadcast.", "alert");
    titleInput?.focus();
    return;
  }

  if (!message) {
    showToast("Please type notification message to send to all loginers.", "alert");
    messageInput?.focus();
    return;
  }

  const notifs = getStoredNotifications();
  const newNotif = {
    id: "notif-" + Date.now(),
    title: title,
    message: message,
    category: category,
    sender: `Admin (${AppState.currentUser?.name || "Campus Administrator"})`,
    time: "Just now",
    read: false
  };

  notifs.unshift(newNotif);
  saveNotifications(notifs);

  // Update real-time banner on top of app
  const bannerText = document.getElementById("bannerNoticeText");
  if (bannerText) {
    bannerText.innerHTML = `<strong>[ADMIN BROADCAST] ${escapeHtml(title)}:</strong> ${escapeHtml(message)}`;
  }

  // Clear inputs
  if (titleInput) titleInput.value = "";
  if (messageInput) messageInput.value = "";

  renderNotificationsFeed();
  showToast("📢 Notification successfully declared & broadcasted to all loginers!", "success");
}

function adminDeleteNotification(notifId) {
  let notifs = getStoredNotifications();
  notifs = notifs.filter(n => n.id !== notifId);
  saveNotifications(notifs);
  renderNotificationsFeed();
  showToast("Broadcast notification removed.", "info");
}

function openDeclareNotificationModal() {
  const modal = document.getElementById("notificationsModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  renderNotificationsFeed();

  const composer = document.getElementById("adminNotifComposer");
  if (composer && AppState.currentUser && AppState.currentUser.role === "admin") {
    composer.classList.remove("hidden");
    composer.scrollIntoView({ behavior: "smooth" });
    document.getElementById("adminBroadcastTitle")?.focus();
  }
}

function markAllNotificationsAsRead() {
  const notifs = getStoredNotifications();
  notifs.forEach(n => { n.read = true; });
  saveNotifications(notifs);
  renderNotificationsFeed();
  showToast("All campus notifications marked as read.", "info");
}

// ==========================================================================
// 360 STREET-LEVEL VIEW SIMULATOR
// ==========================================================================

function openStreetView(locId) {
  const loc = CAMPUS_LOCATIONS.find(l => l.id === locId) || CAMPUS_LOCATIONS[0];
  const modal = document.getElementById("streetViewModal");
  if (!modal) return;

  const titleEl = document.getElementById("streetViewTitle");
  const nameEl = document.getElementById("streetViewLocName");
  const subEl = document.getElementById("streetViewLocSub");

  if (titleEl) titleEl.textContent = `360° Ground View • ${loc.name}`;
  if (nameEl) nameEl.textContent = loc.name;
  if (subEl) subEl.textContent = `${loc.categoryLabel} • ${loc.facilities[0] || 'Campus Promenade'}`;

  const artContainer = document.getElementById("panoramaArtwork");
  if (artContainer) {
    artContainer.innerHTML = `
      <div style="width: 100%; height: 100%; display:flex; align-items:flex-end; justify-content:center; gap: 30px; position:relative;">
        <div style="width: 170px; height: 150px; background: linear-gradient(180deg, ${loc.color} 0%, #0F172A 100%); border-radius: 8px 8px 0 0; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#FFF; box-shadow:0 10px 25px rgba(0,0,0,0.4); border:2px solid rgba(255,255,255,0.25);">
          <i class="fa-solid ${loc.icon}" style="font-size: 3rem; margin-bottom: 8px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"></i>
          <span style="font-weight:800; font-size:0.75rem; text-align:center; padding: 0 10px;">${loc.name}</span>
          <span style="font-size:0.6rem; opacity:0.8;">${loc.code}</span>
        </div>
        <div style="width: 120px; height: 100px; background: #475569; border-radius: 6px 6px 0 0; opacity: 0.7;"></div>
        <div style="width: 140px; height: 120px; background: #334155; border-radius: 6px 6px 0 0; opacity: 0.85;"></div>
      </div>
    `;
  }

  const hotspotsContainer = document.getElementById("streetViewHotspots");
  if (hotspotsContainer) {
    const nearby = CAMPUS_LOCATIONS.filter(l => l.id !== loc.id).slice(0, 3);
    let hHtml = "";
    const positions = [{ top: "45%", left: "22%" }, { top: "35%", left: "75%" }, { top: "50%", left: "82%" }];
    nearby.forEach((n, idx) => {
      const pos = positions[idx];
      hHtml += `
        <div class="sv-hotspot" style="top:${pos.top}; left:${pos.left};" onclick="openStreetView('${n.id}')">
          <i class="fa-solid ${n.icon}"></i>
          <span>Walk to ${n.name.split(" ")[0]}</span>
          <i class="fa-solid fa-arrow-right"></i>
        </div>
      `;
    });
    hotspotsContainer.innerHTML = hHtml;
  }

  const navBtn = document.getElementById("btnStreetViewNavHere");
  if (navBtn) {
    navBtn.onclick = () => {
      closeStreetView();
      quickRouteToDestination(loc.id);
      startLiveNavigation(AppState.currentLocationId, loc.id, AppState.activeRouteMode);
    };
  }

  modal.classList.remove("hidden");
}

function closeStreetView() {
  document.getElementById("streetViewModal")?.classList.add("hidden");
}

// ==========================================================================
// 13. TOAST NOTIFICATION UTILITY
// ==========================================================================

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let icon = "fa-circle-info";
  if (type === "success") icon = "fa-circle-check";
  if (type === "alert") icon = "fa-triangle-exclamation";

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================================================
// 14. UNIQUE SOFTWARE ENGINEERING MODULES
// ==========================================================================

/* 1. TURN-BY-TURN AUDIO VOICE GUIDANCE */
function toggleVoiceGuidance() {
  AppState.voiceGuidanceEnabled = !AppState.voiceGuidanceEnabled;
  const isEnabled = AppState.voiceGuidanceEnabled;

  const hdBtn = document.getElementById("btnHeaderVoice");
  if (hdBtn) {
    hdBtn.innerHTML = `<i class="fa-solid fa-volume-${isEnabled ? 'high' : 'xmark'}"></i>`;
    hdBtn.classList.toggle("muted", !isEnabled);
  }

  const hudBtn = document.getElementById("btnHudVoice");
  if (hudBtn) {
    hudBtn.innerHTML = `<i class="fa-solid fa-volume-${isEnabled ? 'high' : 'xmark'}"></i>`;
    hudBtn.classList.toggle("muted", !isEnabled);
  }

  const routeLbl = document.getElementById("routeVoiceLabel");
  if (routeLbl) routeLbl.textContent = `Voice: ${isEnabled ? 'ON' : 'OFF'}`;

  if (!isEnabled && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }

  showToast(isEnabled ? "🔊 Spoken voice guidance enabled" : "🔇 Voice guidance muted", "info");
  if (isEnabled) speakInstruction("Voice guidance activated.");
}

/* 2. MULTI-STOP INTERMEDIATE WAYPOINT PLANNER */
function toggleViaWaypoint() {
  const row = document.getElementById("routeViaGroup");
  if (!row) return;
  const isHidden = row.classList.contains("hidden");
  if (isHidden) {
    row.classList.remove("hidden");
    populateDropdowns();
    showToast("Select an intermediate stop along your route", "info");
  } else {
    removeViaStop();
  }
}

function removeViaStop() {
  const row = document.getElementById("routeViaGroup");
  if (row) row.classList.add("hidden");
  AppState.viaLocationId = null;
  const viaSelect = document.getElementById("routeViaSelect");
  if (viaSelect) viaSelect.value = "";
  const origin = document.getElementById("routeOriginSelect")?.value;
  const dest = document.getElementById("routeDestSelect")?.value;
  calculateAndRenderRoute(origin, dest, AppState.activeRouteMode);
  showToast("Intermediate via stop removed", "info");
}

/* 3. CLASSROOM & LAB FINDER */
let currentClassFilter = "all";

function filterClassrooms(tag) {
  currentClassFilter = tag;
  document.querySelectorAll(".class-filter-tags .c-tag").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-filter") === tag);
  });
  const q = document.getElementById("classroomSearchInput")?.value || "";
  handleClassroomSearch(q);
}

function clearClassroomSearch() {
  const input = document.getElementById("classroomSearchInput");
  if (input) input.value = "";
  document.getElementById("btnClearClassSearch")?.classList.add("hidden");
  handleClassroomSearch("");
}

function handleClassroomSearch(query = "") {
  const container = document.getElementById("classroomResultsGrid") || document.getElementById("roomResultsList");
  if (!container) return;

  const cleanQ = query.trim().toLowerCase();
  const clearBtn = document.getElementById("btnClearClassSearch");
  if (clearBtn) clearBtn.classList.toggle("hidden", cleanQ.length === 0);

  const list = [];
  CAMPUS_LOCATIONS.forEach(loc => {
    (loc.floors || []).forEach(f => {
      (f.rooms || []).forEach(r => {
        let matchesTag = true;
        const rLower = r.toLowerCase();
        if (currentClassFilter === "lab" && !rLower.includes("lab") && !rLower.includes("workshop")) matchesTag = false;
        if (currentClassFilter === "lecture" && !rLower.includes("room") && !rLower.includes("hall") && !rLower.includes("class")) matchesTag = false;
        if (currentClassFilter === "seminar" && !rLower.includes("seminar") && !rLower.includes("auditorium") && !rLower.includes("oat")) matchesTag = false;

        let matchesQuery = true;
        if (cleanQ.length > 0 && !rLower.includes(cleanQ) && !loc.name.toLowerCase().includes(cleanQ)) {
          matchesQuery = false;
        }

        if (matchesTag && matchesQuery) {
          list.push({ room: r, floor: f.floorName, building: loc.name, buildingId: loc.id, cat: loc.categoryLabel });
        }
      });
    });
  });

  if (list.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; padding:24px; text-align:center; color:#64748B;">No matching classrooms or laboratories found. Try another search.</div>`;
    return;
  }

  let html = "";
  list.slice(0, 18).forEach(item => {
    const isLab = /lab|workshop|centre/i.test(item.room);
    const icon = isLab ? "fa-flask-vial text-cyan" : "fa-door-closed text-primary";
    html += `
      <div class="room-card">
        <div>
          <div class="rc-room-title"><i class="fa-solid ${icon}"></i> ${escapeHtml(item.room)}</div>
          <div class="rc-room-meta">${escapeHtml(item.building)} &bull; ${escapeHtml(item.floor)}</div>
        </div>
        <button class="rc-btn-nav" onclick="routeToSpecificRoom('${item.buildingId}', '${escapeHtml(item.room)}')">
          <i class="fa-solid fa-diamond-turn-right"></i> Navigate
        </button>
      </div>
    `;
  });
  container.innerHTML = html;
}

/* ==========================================================================
   4. JOY UNIVERSITY OFFICIAL TIMETABLE & LECTURE ROUTING ENGINE
   ========================================================================== */

const JOY_UNIVERSITY_TIMETABLE = {
  institution: "JOY UNIVERSITY",
  school: "School of Computational Intelligence",
  program: "B.Tech Computer Science & Engineering - Artificial Intelligence and Data Science",
  academicYear: "Odd Semester TimeTable, A.Y. 2026-27",
  yearSem: "III / V",
  section: "G",
  lectureRoom: "FRANCIS, FIRST FLOOR: 001",
  roomBuildingId: "loc-francis",
  wef: "02-07-2026",
  totalCredits: 25,
  courses: [
    { sNo: 1, code: "24BTDS151", name: "Deep Learning", l: 3, t: 0, p: 0, hours: 3, credits: 3, faculty: "Dr.Anitha T", buildingId: "loc-francis", room: "Francis 001" },
    { sNo: 2, code: "24BTDS152", name: "Computer Networks", l: 3, t: 0, p: 0, hours: 3, credits: 3, faculty: "Dr. Preethi C", buildingId: "loc-francis", room: "Francis 001" },
    { sNo: 3, code: "24BTDS153", name: "Computer Architecture", l: 3, t: 0, p: 0, hours: 3, credits: 3, faculty: "Dr.Sofiya I", buildingId: "loc-francis", room: "Francis 001" },
    { sNo: 4, code: "24BTDS154", name: "Software Engineering", l: 3, t: 0, p: 0, hours: 3, credits: 3, faculty: "Ms.Ambika S", buildingId: "loc-francis", room: "Francis 001" },
    { sNo: 5, code: "24BTDS155", name: "Data Mining and Data Warehousing", l: 3, t: 0, p: 0, hours: 3, credits: 3, faculty: "Mr.Abraham David", buildingId: "loc-francis", room: "Francis 001" },
    { sNo: 6, code: "24BTDS156", name: "Theory of Computation", l: 3, t: 1, p: 0, hours: 4, credits: 4, faculty: "Dr.Berlin Shaheema", buildingId: "loc-francis", room: "Francis 001" },
    { sNo: 7, code: "24BTDS851", name: "Principles of Management", l: 3, t: 0, p: 0, hours: 3, credits: 3, faculty: "Ms. Mary Disilva Princy. J", buildingId: "loc-francis", room: "Francis 001" },
    { sNo: 8, code: "24BTDS251", name: "Deep Learning Lab", l: 0, t: 0, p: 2, hours: 2, credits: 1, faculty: "Dr.Anitha T", buildingId: "loc-intel-joe", room: "DL-NTA LAB (First Floor)" },
    { sNo: 9, code: "24BTDS252", name: "Computer Networks Lab", l: 0, t: 0, p: 2, hours: 2, credits: 1, faculty: "Dr. Preethi C", buildingId: "loc-intel-joe", room: "CNW-NTA LAB (First Floor)" },
    { sNo: 10, code: "24BTDS253", name: "Data Mining and Data Warehousing lab", l: 0, t: 0, p: 2, hours: 2, credits: 1, faculty: "Mr.Abraham David", buildingId: "loc-intel-joe", room: "DNW-NTA LAB (First Floor)" }
  ],
  periods: [
    { num: 1, time: "09:00 - 09:50 AM", label: "Period 1" },
    { num: 2, time: "09:50 - 10:40 AM", label: "Period 2" },
    { isBreak: true, label: "Tea Break", time: "10:40 - 11:00 AM" },
    { num: 3, time: "11:00 - 11:50 AM", label: "Period 3" },
    { num: 4, time: "11:50 - 12:40 PM", label: "Period 4" },
    { isBreak: true, label: "Lunch Break", time: "12:40 - 01:30 PM" },
    { num: 5, time: "01:30 - 02:20 PM", label: "Period 5" },
    { num: 6, time: "02:20 - 03:10 PM", label: "Period 6" },
    { num: 7, time: "03:10 - 04:00 PM", label: "Period 7" }
  ],
  schedule: {
    mon: [
      { p: "1", time: "09:00 - 09:50 AM", code: "24BTDS152", name: "Computer Networks", faculty: "Dr. Preethi C", room: "Francis 001", buildingId: "loc-francis" },
      { p: "2", time: "09:50 - 10:40 AM", code: "24BTDS151", name: "Deep Learning", faculty: "Dr.Anitha T", room: "Francis 001", buildingId: "loc-francis" },
      { isBreak: true, label: "Tea Break", time: "10:40 - 11:00 AM" },
      { p: "3", time: "11:00 - 11:50 AM", code: "24BTDS156", name: "Theory of Computation", faculty: "Dr.Berlin Shaheema", room: "Francis 001", buildingId: "loc-francis" },
      { p: "4", time: "11:50 - 12:40 PM", code: "DEV-01", name: "Protocol-Development", faculty: "Technical Mentor", room: "Francis 001", buildingId: "loc-francis" },
      { isBreak: true, label: "Lunch Break", time: "12:40 - 01:30 PM" },
      { p: "5", time: "01:30 - 02:20 PM", code: "24BTDS153", name: "Computer Architecture", faculty: "Dr.Sofiya I", room: "Francis 001", buildingId: "loc-francis" },
      { p: "6", time: "02:20 - 03:10 PM", code: "LIB-01", name: "Library", faculty: "Library Division", room: "Central Library", buildingId: "loc-library" },
      { p: "7", time: "03:10 - 04:00 PM", code: "MEN-01", name: "Mentoring", faculty: "Faculty Mentor", room: "Francis 001", buildingId: "loc-francis" }
    ],
    tue: [
      { p: "1-2", time: "09:00 - 10:40 AM", code: "24BTDS251", name: "Deep Learning Lab (DL-NTA LAB)", faculty: "Dr.Anitha T", room: "DL-NTA LAB (First Floor)", buildingId: "loc-intel-joe", isLab: true, span: 2 },
      { isBreak: true, label: "Tea Break", time: "10:40 - 11:00 AM" },
      { p: "3", time: "11:00 - 11:50 AM", code: "24BTDS153", name: "Computer Architecture", faculty: "Dr.Sofiya I", room: "Francis 001", buildingId: "loc-francis" },
      { p: "4", time: "11:50 - 12:40 PM", code: "24BTDS155", name: "Data Mining and Data Warehousing", faculty: "Mr.Abraham David", room: "Francis 001", buildingId: "loc-francis" },
      { isBreak: true, label: "Lunch Break", time: "12:40 - 01:30 PM" },
      { p: "5-6", time: "01:30 - 03:10 PM", code: "24BTDS252", name: "Computer Networks Lab (CNW-NTA LAB)", faculty: "Dr. Preethi C", room: "CNW-NTA LAB (First Floor)", buildingId: "loc-intel-joe", isLab: true, span: 2 },
      { p: "7", time: "03:10 - 04:00 PM", code: "PROJ-01", name: "Project", faculty: "Project Guide", room: "Francis 001 / Lab", buildingId: "loc-francis" }
    ],
    wed: [
      { p: "1", time: "09:00 - 09:50 AM", code: "24BTDS152", name: "Computer Networks", faculty: "Dr. Preethi C", room: "Francis 001", buildingId: "loc-francis" },
      { p: "2", time: "09:50 - 10:40 AM", code: "24BTDS156", name: "Theory of Computation", faculty: "Dr.Berlin Shaheema", room: "Francis 001", buildingId: "loc-francis" },
      { isBreak: true, label: "Tea Break", time: "10:40 - 11:00 AM" },
      { p: "3", time: "11:00 - 11:50 AM", code: "24BTDS154", name: "Software Engineering", faculty: "Ms.Ambika S", room: "Francis 001", buildingId: "loc-francis" },
      { p: "4", time: "11:50 - 12:40 PM", code: "24BTDS155", name: "Data Mining and Data Warehousing", faculty: "Mr.Abraham David", room: "Francis 001", buildingId: "loc-francis" },
      { isBreak: true, label: "Lunch Break", time: "12:40 - 01:30 PM" },
      { p: "5", time: "01:30 - 02:20 PM", code: "24BTDS151", name: "Deep Learning", faculty: "Dr.Anitha T", room: "Francis 001", buildingId: "loc-francis" },
      { p: "6", time: "02:20 - 03:10 PM", code: "24BTDS851", name: "Principles of Management", faculty: "Ms. Mary Disilva Princy. J", room: "Francis 001", buildingId: "loc-francis" },
      { p: "7", time: "03:10 - 04:00 PM", code: "PROJ-01", name: "Project", faculty: "Project Guide", room: "Francis 001 / Lab", buildingId: "loc-francis" }
    ],
    thu: [
      { p: "1", time: "09:00 - 09:50 AM", code: "24BTDS154", name: "Software Engineering", faculty: "Ms.Ambika S", room: "Francis 001", buildingId: "loc-francis" },
      { p: "2", time: "09:50 - 10:40 AM", code: "24BTDS152", name: "Computer Networks", faculty: "Dr. Preethi C", room: "Francis 001", buildingId: "loc-francis" },
      { isBreak: true, label: "Tea Break", time: "10:40 - 11:00 AM" },
      { p: "3-4", time: "11:00 - 12:40 PM", code: "24BTDS253", name: "Data Mining and Data Warehousing Lab (DNW-NTA LAB)", faculty: "Mr.Abraham David", room: "DNW-NTA LAB (First Floor)", buildingId: "loc-intel-joe", isLab: true, span: 2 },
      { isBreak: true, label: "Lunch Break", time: "12:40 - 01:30 PM" },
      { p: "5", time: "01:30 - 02:20 PM", code: "24BTDS156", name: "Theory of Computation", faculty: "Dr.Berlin Shaheema", room: "Francis 001", buildingId: "loc-francis" },
      { p: "6", time: "02:20 - 03:10 PM", code: "24BTDS851", name: "Principles of Management", faculty: "Ms. Mary Disilva Princy. J", room: "Francis 001", buildingId: "loc-francis" },
      { p: "7", time: "03:10 - 04:00 PM", code: "MEN-01", name: "Mentoring", faculty: "Faculty Mentor", room: "Francis 001", buildingId: "loc-francis" }
    ],
    fri: [
      { p: "1", time: "09:00 - 09:50 AM", code: "24BTDS151", name: "Deep Learning", faculty: "Dr.Anitha T", room: "Francis 001", buildingId: "loc-francis" },
      { p: "2", time: "09:50 - 10:40 AM", code: "24BTDS154", name: "Software Engineering", faculty: "Ms.Ambika S", room: "Francis 001", buildingId: "loc-francis" },
      { isBreak: true, label: "Tea Break", time: "10:40 - 11:00 AM" },
      { p: "3", time: "11:00 - 11:50 AM", code: "24BTDS155", name: "Data Mining and Data Warehousing", faculty: "Mr.Abraham David", room: "Francis 001", buildingId: "loc-francis" },
      { p: "4", time: "11:50 - 12:40 PM", code: "24BTDS851", name: "Principles of Management", faculty: "Ms. Mary Disilva Princy. J", room: "Francis 001", buildingId: "loc-francis" },
      { isBreak: true, label: "Lunch Break", time: "12:40 - 01:30 PM" },
      { p: "5", time: "01:30 - 02:20 PM", code: "24BTDS156", name: "Theory of Computation", faculty: "Dr.Berlin Shaheema", room: "Francis 001", buildingId: "loc-francis" },
      { p: "6", time: "02:20 - 03:10 PM", code: "24BTDS153", name: "Computer Architecture", faculty: "Dr.Sofiya I", room: "Francis 001", buildingId: "loc-francis" },
      { p: "7", time: "03:10 - 04:00 PM", code: "CLUB-01", name: "Club Activity", faculty: "Student Activity Coordinator", room: "Student Activity Centre (SAC)", buildingId: "loc-sac" }
    ]
  }
};

let currentTimetableActiveDay = "mon";

function openTimetableModal() {
  const modal = document.getElementById("classScheduleModal");
  if (!modal) return;

  // Determine current day of week (mon-fri)
  const dayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon, 5 is Fri, 6 is Sat
  const dayKeys = ["mon", "mon", "tue", "wed", "thu", "fri", "mon"];
  const targetDay = dayKeys[dayIndex] || "mon";

  switchTimetableDay(targetDay);
  modal.classList.remove("hidden");
}

function switchTimetableDay(dayKey) {
  currentTimetableActiveDay = dayKey;

  // Update tabs active state
  document.querySelectorAll("#ttDayTabs .tt-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-day") === dayKey);
  });

  const container = document.getElementById("timetableSlotsList");
  if (!container) return;

  if (dayKey === "week") {
    container.innerHTML = renderTimetableWeekMatrix();
  } else if (dayKey === "courses") {
    container.innerHTML = renderTimetableCourseDetails();
  } else {
    container.innerHTML = renderTimetableDayView(dayKey);
  }
}

function renderTimetableDayView(dayKey) {
  const daySchedule = JOY_UNIVERSITY_TIMETABLE.schedule[dayKey] || [];
  const dayNames = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday" };

  let html = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding:4px 2px;">
      <strong style="color:#FFFFFF;font-size:0.95rem;"><i class="fa-solid fa-calendar-day text-primary"></i> ${dayNames[dayKey]} Schedule</strong>
      <span style="color:#94A3B8;font-size:0.75rem;">7 Class Periods • 2 Breaks</span>
    </div>
    <div class="tt-slots-grid">
  `;

  daySchedule.forEach(slot => {
    if (slot.isBreak) {
      html += `
        <div class="tt-period-card is-break">
          <div style="display:flex;align-items:center;gap:10px;color:#FBBF24;">
            <i class="fa-solid ${slot.label.includes('Tea') ? 'fa-mug-hot' : 'fa-utensils'}"></i>
            <strong style="font-size:0.84rem;">${slot.label}</strong>
          </div>
          <span style="color:#FDE68A;font-size:0.75rem;font-weight:700;">${slot.time}</span>
        </div>
      `;
    } else {
      html += `
        <div class="tt-period-card ${slot.isLab ? 'is-lab' : ''}">
          <div class="tt-card-left">
            <div class="tt-time-pill">
              <span class="tt-p-num">Period ${slot.p}</span>
              <span class="tt-p-time">${slot.time}</span>
            </div>
            <div class="tt-card-info">
              <div class="tt-course-row">
                <span class="tt-course-code-badge">${slot.code}</span>
                <strong class="tt-subject-title">${slot.name}</strong>
              </div>
              <div class="tt-meta-chips">
                <span><i class="fa-regular fa-user"></i> ${slot.faculty}</span>
                <span><i class="fa-solid fa-location-dot text-primary"></i> ${slot.room}</span>
              </div>
            </div>
          </div>
          <div class="tt-card-right">
            <button type="button" class="tt-card-btn-route" onclick="routeToSpecificRoom('${slot.buildingId}', '${escapeHtml(slot.room)}')">
              <i class="fa-solid fa-diamond-turn-right"></i> Route
            </button>
          </div>
        </div>
      `;
    }
  });

  html += `</div>`;
  return html;
}

function renderTimetableWeekMatrix() {
  const days = [
    { key: "mon", name: "Mon" },
    { key: "tue", name: "Tue" },
    { key: "wed", name: "Wed" },
    { key: "thu", name: "Thu" },
    { key: "fri", name: "Fri" }
  ];

  return `
    <div class="tt-matrix-wrapper">
      <table class="tt-matrix-table">
        <thead>
          <tr>
            <th>Day/Time</th>
            <th>1<br><span style="font-size:0.62rem;font-weight:400;">09:00-09:50</span></th>
            <th>2<br><span style="font-size:0.62rem;font-weight:400;">09:50-10:40</span></th>
            <th style="background:#451a03;color:#FCD34D;">Tea<br>Break</th>
            <th>3<br><span style="font-size:0.62rem;font-weight:400;">11:00-11:50</span></th>
            <th>4<br><span style="font-size:0.62rem;font-weight:400;">11:50-12:40</span></th>
            <th style="background:#451a03;color:#FCD34D;">Lunch<br>Break</th>
            <th>5<br><span style="font-size:0.62rem;font-weight:400;">01:30-02:20</span></th>
            <th>6<br><span style="font-size:0.62rem;font-weight:400;">02:20-03:10</span></th>
            <th>7<br><span style="font-size:0.62rem;font-weight:400;">03:10-04:00</span></th>
          </tr>
        </thead>
        <tbody>
          <!-- MON -->
          <tr>
            <td class="tt-matrix-day">Mon</td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS152</span>
              <span class="tt-matrix-sub">Networks</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS151</span>
              <span class="tt-matrix-sub">Deep Learning</span>
            </td>
            <td rowspan="5" class="tt-matrix-cell break-col">TEA BREAK (10:40-11:00)</td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS156</span>
              <span class="tt-matrix-sub">Computation</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">Protocol-Dev</span>
              <span class="tt-matrix-sub">Technical</span>
            </td>
            <td rowspan="5" class="tt-matrix-cell break-col">LUNCH BREAK (12:40-01:30)</td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS153</span>
              <span class="tt-matrix-sub">Architecture</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-library', 'Central Library')">
              <span class="tt-matrix-code">Library</span>
              <span class="tt-matrix-sub">Resource</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">Mentoring</span>
              <span class="tt-matrix-sub">Counseling</span>
            </td>
          </tr>

          <!-- TUE -->
          <tr>
            <td class="tt-matrix-day">Tue</td>
            <td colspan="2" class="tt-matrix-cell lab-cell" onclick="routeToSpecificRoom('loc-intel-joe', 'DL-NTA LAB')">
              <span class="tt-matrix-code">24BTDS251 (DL-NTA LAB)</span>
              <span class="tt-matrix-sub">Deep Learning Lab (Dr.Anitha T)</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS153</span>
              <span class="tt-matrix-sub">Architecture</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS155</span>
              <span class="tt-matrix-sub">Data Mining</span>
            </td>
            <td colspan="2" class="tt-matrix-cell lab-cell" onclick="routeToSpecificRoom('loc-intel-joe', 'CNW-NTA LAB')">
              <span class="tt-matrix-code">24BTDS252 (CNW-NTA LAB)</span>
              <span class="tt-matrix-sub">Networks Lab (Dr. Preethi C)</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Project Lab')">
              <span class="tt-matrix-code">Project</span>
              <span class="tt-matrix-sub">Lab</span>
            </td>
          </tr>

          <!-- WED -->
          <tr>
            <td class="tt-matrix-day">Wed</td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS152</span>
              <span class="tt-matrix-sub">Networks</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS156</span>
              <span class="tt-matrix-sub">Computation</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS154</span>
              <span class="tt-matrix-sub">Software Eng.</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS155</span>
              <span class="tt-matrix-sub">Data Mining</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS151</span>
              <span class="tt-matrix-sub">Deep Learning</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS851</span>
              <span class="tt-matrix-sub">Management</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Project Lab')">
              <span class="tt-matrix-code">Project</span>
              <span class="tt-matrix-sub">Lab</span>
            </td>
          </tr>

          <!-- THU -->
          <tr>
            <td class="tt-matrix-day">Thu</td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS154</span>
              <span class="tt-matrix-sub">Software Eng.</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS152</span>
              <span class="tt-matrix-sub">Networks</span>
            </td>
            <td colspan="2" class="tt-matrix-cell lab-cell" onclick="routeToSpecificRoom('loc-intel-joe', 'DNW-NTA LAB')">
              <span class="tt-matrix-code">24BTDS253 (DNW-NTA LAB)</span>
              <span class="tt-matrix-sub">Data Mining Lab (Mr.Abraham David)</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS156</span>
              <span class="tt-matrix-sub">Computation</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS851</span>
              <span class="tt-matrix-sub">Management</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">Mentoring</span>
              <span class="tt-matrix-sub">Counseling</span>
            </td>
          </tr>

          <!-- FRI -->
          <tr>
            <td class="tt-matrix-day">Fri</td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS151</span>
              <span class="tt-matrix-sub">Deep Learning</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS154</span>
              <span class="tt-matrix-sub">Software Eng.</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS155</span>
              <span class="tt-matrix-sub">Data Mining</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS851</span>
              <span class="tt-matrix-sub">Management</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS156</span>
              <span class="tt-matrix-sub">Computation</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-francis', 'Francis 001')">
              <span class="tt-matrix-code">24BTDS153</span>
              <span class="tt-matrix-sub">Architecture</span>
            </td>
            <td class="tt-matrix-cell" onclick="routeToSpecificRoom('loc-sac', 'Student Activity Centre (SAC)')">
              <span class="tt-matrix-code">Club Activity</span>
              <span class="tt-matrix-sub">SAC Complex</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderTimetableCourseDetails() {
  const courses = JOY_UNIVERSITY_TIMETABLE.courses;

  let html = `
    <div class="tt-courses-table-wrap">
      <table class="tt-courses-table">
        <thead>
          <tr>
            <th style="width:40px;">S.No</th>
            <th style="width:105px;">Course Code</th>
            <th>Course Name</th>
            <th style="text-align:center;">L</th>
            <th style="text-align:center;">T</th>
            <th style="text-align:center;">P</th>
            <th style="text-align:center;">Hours</th>
            <th style="text-align:center;">Credit</th>
            <th>Course Instructor / Faculty</th>
            <th style="text-align:right;">Navigate</th>
          </tr>
        </thead>
        <tbody>
  `;

  courses.forEach(c => {
    html += `
      <tr>
        <td style="color:#94A3B8;font-weight:700;">${c.sNo}</td>
        <td><span class="tt-course-code-badge">${c.code}</span></td>
        <td><strong style="color:#FFFFFF;">${c.name}</strong></td>
        <td style="text-align:center;">${c.l}</td>
        <td style="text-align:center;">${c.t}</td>
        <td style="text-align:center;">${c.p}</td>
        <td style="text-align:center;color:#38BDF8;font-weight:700;">${c.hours}</td>
        <td style="text-align:center;color:#10B981;font-weight:700;">${c.credits}</td>
        <td><span style="color:#E2E8F0;"><i class="fa-regular fa-user" style="font-size:0.7rem;margin-right:4px;"></i> ${c.faculty}</span></td>
        <td style="text-align:right;">
          <button type="button" class="tt-card-btn-route" style="padding:4px 10px;font-size:0.72rem;" onclick="routeToSpecificRoom('${c.buildingId}', '${escapeHtml(c.room)}')">
            <i class="fa-solid fa-diamond-turn-right"></i> ${c.room.includes('NTA') ? 'Lab' : '001'}
          </button>
        </td>
      </tr>
    `;
  });

  html += `
        <tr class="tt-courses-footer-row">
          <td colspan="7" style="text-align:right;"><strong>Total Credits per semester:</strong></td>
          <td style="text-align:center;font-size:0.95rem;color:#10B981;"><strong>25</strong></td>
          <td colspan="2"></td>
        </tr>
      </tbody>
    </table>
  </div>
  `;

  return html;
}

/* 5. AR AUGMENTED REALITY HUD VIEWFINDER */
function openArModal() {
  const modal = document.getElementById("arViewfinderModal");
  if (!modal) return;

  const destLoc = CAMPUS_LOCATIONS.find(l => l.id === AppState.destinationLocationId);
  const nameEl = document.getElementById("arWaypointName");
  const distEl = document.getElementById("arWaypointDist");
  const guidEl = document.getElementById("arWaypointGuidance");

  if (nameEl && destLoc) nameEl.textContent = destLoc.name;
  if (distEl && AppState.activeRoute) distEl.textContent = `${AppState.activeRoute.totalDistance} m`;
  if (guidEl && AppState.activeRoute && AppState.activeRoute.steps && AppState.activeRoute.steps[0]) {
    guidEl.innerHTML = `<i class="fa-solid fa-diamond-turn-right"></i> ${AppState.activeRoute.steps[0].text}`;
  }

  modal.classList.remove("hidden");

  // Mouse interactive tilt simulation
  const viewport = document.getElementById("arViewportBody");
  if (viewport) {
    viewport.onmousemove = (e) => {
      const rect = viewport.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const anchor = document.getElementById("arWaypointAnchor");
      if (anchor) {
        anchor.style.transform = `translate(calc(-50% + ${x * 60}px), calc(-50% + ${y * 40}px))`;
      }
    };
  }
}

function toggleArNightVision() {
  const body = document.getElementById("arViewportBody");
  if (body) {
    body.classList.toggle("night-vision");
    const isNight = body.classList.contains("night-vision");
    showToast(isNight ? "AR Thermal / Night Vision HUD Active" : "AR Daylight Sensor Active", "info");
  }
}

/* 6. DIGITAL CAMPUS TRAVEL PASS & ITINERARY SHARE */
function openTravelPassModal() {
  const modal = document.getElementById("travelPassModal");
  if (!modal) return;

  const startLoc = CAMPUS_LOCATIONS.find(l => l.id === AppState.currentLocationId);
  const endLoc = CAMPUS_LOCATIONS.find(l => l.id === AppState.destinationLocationId);
  const dist = AppState.activeRoute ? AppState.activeRoute.totalDistance : 450;
  const dur = AppState.activeRoute ? AppState.activeRoute.estimatedTimeMin : 6;

  const orgEl = document.getElementById("tpOriginName");
  const dstEl = document.getElementById("tpDestName");
  const distEl = document.getElementById("tpDistance");
  const durEl = document.getElementById("tpDuration");
  const modeEl = document.getElementById("tpMode");
  const etaEl = document.getElementById("tpEta");
  const serialEl = document.getElementById("tpTicketSerial");

  if (orgEl) orgEl.textContent = startLoc ? startLoc.name : "Starting Point";
  if (dstEl) dstEl.textContent = endLoc ? endLoc.name : "Destination";
  if (distEl) distEl.textContent = `${dist} m`;
  if (durEl) durEl.textContent = `${dur} mins`;
  if (modeEl) modeEl.textContent = AppState.activeRouteMode.toUpperCase() + " ROUTE";

  const now = new Date();
  now.setMinutes(now.getMinutes() + dur);
  const etaTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (etaEl) etaEl.textContent = etaTime;

  if (serialEl) {
    serialEl.textContent = `PASS #CN-${Math.floor(1000 + Math.random() * 9000)}-${AppState.currentUser.initials}`;
  }

  modal.classList.remove("hidden");
}

function copyRouteShareLink() {
  const url = `${window.location.origin}${window.location.pathname}?from=${AppState.currentLocationId}&to=${AppState.destinationLocationId}&mode=${AppState.activeRouteMode}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast("📋 Route itinerary share link copied to clipboard!", "success");
  }).catch(() => {
    showToast(`Share URL: ${url}`, "info");
  });
}

function printTravelPass() {
  window.print();
}

/* 7. REAL-TIME CROWD HEATMAP LAYER */
function toggleCrowdHeatmap() {
  AppState.isHeatmapActive = !AppState.isHeatmapActive;
  const layer = document.getElementById("heatmapLayer");
  const btn = document.getElementById("btnToggleHeatmap");

  if (!layer) return;

  if (AppState.isHeatmapActive) {
    layer.classList.remove("hidden");
    btn?.classList.add("active");

    const hubs = [
      { x: 395, y: 780, r: 55, color: "rgba(239, 68, 68, 0.45)", label: "ARUL Mess (High Crowd)" },
      { x: 415, y: 340, r: 45, color: "rgba(245, 158, 11, 0.45)", label: "Admin COE (Moderate)" },
      { x: 235, y: 340, r: 42, color: "rgba(99, 102, 241, 0.4)", label: "Intel JOE (Active Labs)" },
      { x: 235, y: 530, r: 38, color: "rgba(16, 185, 129, 0.35)", label: "Library (Quiet Zone)" },
      { x: 235, y: 830, r: 40, color: "rgba(245, 158, 11, 0.4)", label: "Hostels (Moderate)" }
    ];

    let html = "";
    hubs.forEach(h => {
      html += `
        <circle class="heatmap-aura" cx="${h.x}" cy="${h.y}" r="${h.r}" fill="${h.color}" filter="url(#routeGlow)">
          <title>${h.label}</title>
        </circle>
      `;
    });
    layer.innerHTML = html;
    showToast("🔥 Real-time campus crowd density heatmap enabled", "info");
  } else {
    layer.classList.add("hidden");
    layer.innerHTML = "";
    btn?.classList.remove("active");
    showToast("Crowd heatmap disabled", "info");
  }
}

/* 8. AUTONOMOUS SHUTTLE BUS GPS TRACKER */
const SHUTTLE_WAYPOINTS = [
  { x: 415, y: 55 },
  { x: 415, y: 340 },
  { x: 415, y: 540 },
  { x: 415, y: 760 },
  { x: 240, y: 760 },
  { x: 240, y: 400 },
  { x: 240, y: 150 },
  { x: 415, y: 55 }
];

function toggleLiveShuttleRoute() {
  AppState.isShuttleActive = !AppState.isShuttleActive;
  const layer = document.getElementById("shuttleBusLayer");
  const btn = document.getElementById("btnToggleShuttle");

  if (!layer) return;

  if (AppState.isShuttleActive) {
    layer.classList.remove("hidden");
    btn?.classList.add("active");

    let d = "";
    SHUTTLE_WAYPOINTS.forEach((pt, i) => {
      d += (i === 0 ? `M ${pt.x} ${pt.y} ` : `L ${pt.x} ${pt.y} `);
    });
    d += "Z";

    let html = `
      <path d="${d}" stroke="rgba(6, 182, 212, 0.6)" stroke-width="3" stroke-dasharray="6,6" fill="none"/>
      <g id="shuttleVehicle1" class="shuttle-marker-group" transform="translate(${SHUTTLE_WAYPOINTS[0].x}, ${SHUTTLE_WAYPOINTS[0].y})" onclick="openShuttleModal()">
        <circle cx="0" cy="0" r="14" fill="#06B6D4" stroke="#FFFFFF" stroke-width="2.5" filter="url(#buildingShadow)"/>
        <text x="0" y="4" font-family="'Font Awesome 6 Free'" font-weight="900" font-size="10" fill="#FFFFFF" text-anchor="middle">&#xf55e;</text>
      </g>
    `;
    layer.innerHTML = html;

    if (AppState.shuttleInterval) clearInterval(AppState.shuttleInterval);
    AppState.shuttlePositionIndex = 0;
    AppState.shuttleInterval = setInterval(() => {
      AppState.shuttlePositionIndex = (AppState.shuttlePositionIndex + 1) % SHUTTLE_WAYPOINTS.length;
      const pt = SHUTTLE_WAYPOINTS[AppState.shuttlePositionIndex];
      const v = document.getElementById("shuttleVehicle1");
      if (v) v.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
    }, 2200);

    showToast("🚌 Autonomous Shuttle GPS tracking active on map", "info");
  } else {
    layer.classList.add("hidden");
    layer.innerHTML = "";
    btn?.classList.remove("active");
    if (AppState.shuttleInterval) clearInterval(AppState.shuttleInterval);
    showToast("Shuttle tracking layer closed", "info");
  }
}

function openShuttleModal() {
  document.getElementById("shuttleWeatherModal")?.classList.remove("hidden");
}

function highlightShuttleOnMap(id) {
  closeAllModals();
  if (!AppState.isShuttleActive) toggleLiveShuttleRoute();
  const pt = SHUTTLE_WAYPOINTS[AppState.shuttlePositionIndex || 0];
  updateUserPositionAtCoords(pt.x, pt.y);
  showToast(`Focusing on Autonomous Shuttle ${id === 1 ? 'Alpha' : 'Beta'} position`, "info");
}


// ==========================================================================
// SAVED PLACES FULL INTERFACE & MANAGEMENT (VIEW, ROUTE & REMOVE)
// ==========================================================================

window.openSavedPlacesModal = function() {
  renderSavedPlacesModal();
  document.getElementById("savedPlacesModal")?.classList.remove("hidden");
};

window.closeSavedPlacesModal = function() {
  document.getElementById("savedPlacesModal")?.classList.add("hidden");
};

window.renderSavedPlacesModal = function() {
  const container = document.getElementById("savedPlacesList");
  if (!container) return;

  // Initialize favorites from localStorage if needed
  if (!AppState.favorites || !Array.isArray(AppState.favorites)) {
    try {
      const stored = localStorage.getItem("campusnav_favorites");
      AppState.favorites = stored ? JSON.parse(stored) : ["loc-admin", "loc-intel-joe", "loc-sac"];
    } catch(e) {
      AppState.favorites = ["loc-admin", "loc-intel-joe", "loc-sac"];
    }
  }

  const count = AppState.favorites.length;
  const countEl = document.getElementById("headerSavedCount");
  const sidebarCountEl = document.getElementById("sidebarSavedBadge");
  if (countEl) countEl.textContent = count;
  if (sidebarCountEl) sidebarCountEl.textContent = `${count} Saved`;

  if (count === 0) {
    container.innerHTML = `
      <div class="saved-empty-state">
        <i class="fa-solid fa-star" style="font-size: 2.5rem; color: #F59E0B; margin-bottom: 12px; opacity: 0.7;"></i>
        <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px; color: #0F172A;">No Saved Places</h4>
        <p style="font-size: 0.82rem; color: #64748B; max-width: 320px; margin: 0 auto 16px auto; line-height: 1.4;">
          You haven't bookmarked any campus locations yet. Tap the star icon on any building to bookmark it for fast navigation.
        </p>
        <button type="button" class="btn-sp-route" onclick="closeAllModals()" style="padding: 8px 18px; margin: 0 auto; display: inline-flex; border-radius: 8px;">
          <i class="fa-solid fa-map-location-dot"></i> Browse Campus Map
        </button>
      </div>
    `;
    return;
  }

  let html = "";
  AppState.favorites.forEach(locId => {
    const loc = CAMPUS_LOCATIONS.find(l => l.id === locId);
    if (!loc) return;

    html += `
      <div class="saved-place-item" id="saved-item-${loc.id}">
        <div class="sp-main" onclick="handleLocationSelect('${loc.id}'); closeAllModals();" style="cursor: pointer;">
          <div class="sp-icon" style="background: ${loc.color}22; color: ${loc.color};">
            <i class="fa-solid ${loc.icon}"></i>
          </div>
          <div class="sp-info">
            <span class="sp-name">${loc.name}</span>
            <div class="sp-meta">
              <span class="sp-status-tag"><i class="fa-solid fa-circle" style="font-size: 5px;"></i> ${loc.categoryLabel || 'Academic'}</span>
              <span>•</span>
              <span>${loc.code}</span>
            </div>
          </div>
        </div>
        <div class="sp-actions">
          <button type="button" class="btn-sp-route" onclick="quickRouteToDestination('${loc.id}'); closeAllModals();" title="Calculate Route Here">
            <i class="fa-solid fa-diamond-turn-right"></i> Route
          </button>
          <button type="button" class="btn-sp-map" onclick="handleLocationSelect('${loc.id}'); closeAllModals();" title="View on Blueprint Map">
            <i class="fa-solid fa-eye"></i> View
          </button>
          <button type="button" class="btn-sp-remove" onclick="removeSavedPlace('${loc.id}')" title="Remove from Saved Places" aria-label="Remove ${loc.name}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
};

window.removeSavedPlace = function(locId) {
  if (!AppState.favorites) return;
  const idx = AppState.favorites.indexOf(locId);
  if (idx > -1) {
    AppState.favorites.splice(idx, 1);
    try {
      localStorage.setItem("campusnav_favorites", JSON.stringify(AppState.favorites));
    } catch(e) {}
    showToast("Removed from saved places", "info");
    updateFavoriteIconState(locId);
    renderSavedPlacesModal();
    renderFavoritesAndRecents();
  }
};

window.clearAllSavedPlaces = function() {
  if (!AppState.favorites || AppState.favorites.length === 0) return;
  AppState.favorites = [];
  try {
    localStorage.setItem("campusnav_favorites", JSON.stringify(AppState.favorites));
  } catch(e) {}
  showToast("All saved places removed", "info");
  renderSavedPlacesModal();
  renderFavoritesAndRecents();
};

window.enterAsGuest = function() {
  AppState.currentUser = {
    name: "Campus Visitor",
    role: "visitor",
    roleTitle: "Guest Explorer",
    initials: "CV",
    dept: "Campus Tour"
  };
  try {
    sessionStorage.setItem("campusnav_user", JSON.stringify(AppState.currentUser));
  } catch (e) {}
  applyUserProfile();
  document.getElementById("loginScreen")?.classList.add("dismissed");
  showToast("Welcome to Campus Navigation! 🗺️", "success");
};

