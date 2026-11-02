# 🧭 Joy University • 3D Smart Campus Navigation System

**Joy University • 3D Smart Campus Navigation System** is a professional, interactive 3D WebGL digital twin and navigation platform for university students, faculty, staff, and campus visitors.

It faithfully upgrades the Smart Campus Navigation system using the provided design references:
- **Reference Image 1**: The complete web application interface, top toolbar (`Places`, `Tour`, `Orbit`, `Top`, `Reset`, `Night`, `Markers`, `Walk route`, `Share`, `Snapshot`, `Fullscreen`, `Live Walk`, `Profile`, `Settings`), collapsible places sidebar with category filtering (`All`, `Blocks`, `Hostels`, `Sports`, `Services`), search with typo tolerance, and voice recognition.
- **Reference Image 2**: Detailed 3D architectural miniature campus map featuring individual 3D buildings (separate walls, roofs, entrances, windows), asphalt roads, pedestrian walkways, lawns, trees, central fish pond, airfield runway with miniature airplanes, parking sheds, campus gates, and wind turbines.

---

## 🌟 Key Capabilities & Upgrades

### 1. Detailed 3D Campus Miniature Map (Reference Image 2)
- **3D Buildings & Architecture**:
  - **Administrative Block & COE**: Long building with front columned portico pillars, entrance stairs, and rooftop AC chillers.
  - **SAC (Student Activity Centre)**: Iconic cyan-blue arched roof with silver edge gutters.
  - **Intel JOE & E-Learning**: Circular glass cylinder tower with deep blue rotunda dome roof.
  - **Campus Chapel**: Historic brick walls, pitched terracotta gable roof, arched portal, and white cross on the peak.
  - **OAT (North & South)**: Distinctive terracotta red hipped roofs.
  - **Conventional Hall Auditorium**: High-ceiling acoustic auditorium with grand proscenium lobby.
  - **Julianna, Joveena, Joshuva, Francis Block, Adhinaram Block, S A RAJA Block, Social Hostels**: Authentic multi-story blocks with window grids, entry doors, balconies, and parapets.
- **Campus Environment**:
  - **Paved Road Network**: Asphalt road ribbons (`#334155`) with concrete curbs (`#CBD5E1`) and pedestrian crosswalks.
  - **Central Ornamental Fish Pond**: Stone coping basin with blue transparent water, wave ripple, and fountain spout.
  - **Campus Model Airfield**: Paved landing strip with dashed runway markings and 2 miniature model airplanes on the apron.
  - **Parking Canopies**: Steel corrugated blue metal sheds with miniature parked automobiles.
  - **Gates 1 to 5**: Arched entrance portals with security guardhouses and red/white boom barriers.
  - **3D Wind Turbines**: 3 wind turbines along the distant perimeter hills with smoothly spinning 3-blade propellers.
  - **3D Trees**: Realistically shaped wooden trunks and bushy foliage canopies lining all campus boulevards and garden lawns.

### 2. Correct Walking Routes — Roads Only (Strict Pathfinding)
- **Zero Building Collision Guarantee**: Walking routes are calculated using Dijkstra's shortest path algorithm over the calibrated network of 103 road nodes and 121 walkway edges.
- **Ground-Aligned 3D Route Ribbon**: Renders a glowing road ribbon with animated directional chevron pulses directly along the road surface.
- **Turn-by-Turn Guidance**: Step-by-step instructions ("Go straight along Main Entrance Boulevard for 65m", "Turn right at Intel JOE Concourse", etc.) with distance, walking time at 4.5 km/h, calorie burn, and step count.
- **Live Walk Simulation**: Interactive 3D avatar marker that smoothly navigates along the road path with follow-camera tracking and speed multipliers (1x, 2x, 4x).

### 3. Click-to-Inspect 3D Building Structure
- Clicking any building (in 3D viewport or from the Places list):
  1. Highlights the building with a **glowing blue wireframe outline** (Reference Image 1).
  2. Smoothly animates and glides the camera toward it.
  3. Displays complete building info (hours, contact, description, facilities, and floor directory).
  4. Allows full 360-degree rotation and inspection from any angle.
  5. Includes **"Transparent Roof / Interior Cutaway"** toggle to reveal interior rooms, corridors, and floors!

### 4. Interface Features (Reference Image 1)
- **Top Navigation Toolbar**:
  - `≡ Places`: Toggles the collapsible left search & places sidebar.
  - `🚩 Tour`: Starts an automated camera flight visiting key campus landmarks with HUD.
  - `🔄 Orbit`: Toggles continuous smooth 360-degree rotation around the campus.
  - `🧭 Top`: Smoothly transitions to top-down 2D orthographic aerial view.
  - `🔄 Reset`: Resets camera to default 3D isometric perspective.
  - `🌙 Night`: Toggles day/night lighting (realistic shadows in day; glowing windows and street lamps in night).
  - `📍 Markers`: Toggles 3D floating sprite labels above buildings.
  - `🚶 Walk route`: Opens the A-to-B route planner drawer.
  - `🔗 Share`: Copies shareable link to clipboard.
  - `📷 Snapshot`: Captures high-res 3D WebGL screenshot and triggers PNG download.
  - `⛶ Fullscreen`: Toggles full screen.
  - `📍 Live Walk`: Simulates walking along the calculated road route.
  - `👤 Profile`: User role switcher (Student, Faculty, Visitor, Admin).
  - `⚙️ Settings`: Settings modal with interior cutaway and graphics toggles.
- **Left Places Sidebar**:
  - Search box with typo-tolerant fuzzy matching across building names, codes, and facilities.
  - `🎙️ Voice`: Web Speech API voice recognition for searching buildings.
  - `★ Favorites`: Filter bookmarked campus locations.
  - `✕ Clear`: Resets search query and filters.
  - Category filter pills: `All`, `Blocks`, `Hostels`, `Sports`, `Services`.
  - Scrollable list with yellow numbered circular badges (1, 2, 3...), building names, categories, and distance from campus entrance.

---

## 🚀 Quick Start Guide

### Option 1: Direct in Browser
Open [`index.html`](file:///c:/Users/Harshita/OneDrive/Desktop/suma/index.html) in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Node.js Server
Run the built-in HTTP server:
```bash
node server.js
```
Then open:
```
http://localhost:3000
```

---

## 📁 Project Structure
```
suma/
├── index.html              # Main application entry point (UI matching Reference Image 1)
├── styles-3d.css           # Glassmorphism styling, toolbar, sidebar, HUD, drawers
├── campus-data-3d.js       # Complete 30-location database with coordinates, shapes, floors
├── router-3d.js            # Dijkstra shortest path engine (Roads & Walkways only)
├── campus-3d-scene.js      # Three.js 3D WebGL Engine (buildings, roads, trees, turbines)
├── app-3d.js               # Application state, voice search, live walk, tour, snapshot
├── extracted_graph.json    # 103 walkway nodes & 121 road edges calibrated to physical map
├── extracted_obstacles.json# 30 building obstacle boundary polygons
├── three.min.js            # Three.js r128 3D library (offline bundle)
├── OrbitControls.js        # Three.js OrbitControls (offline bundle)
├── server.js               # Zero-dependency Node.js HTTP server
├── package.json            # Package configuration
└── README.md               # Complete documentation
```
