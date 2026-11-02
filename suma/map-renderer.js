/**
 * Campus Compass - Interactive Digital Twin SVG Map Renderer
 * Renders an architectural vector campus map with interactive building footprints,
 * animated route lines, congestion heatmaps, night safety lighting, and live markers.
 */

class CampusMapRenderer {
  constructor(containerId, campusData, onLocationSelect) {
    this.container = document.getElementById(containerId);
    this.data = campusData;
    this.onLocationSelect = onLocationSelect;
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.startPan = { x: 0, y: 0 };
    this.isTilt3D = false;
    this.activeLayers = {
      buildings: true,
      labels: true,
      paths: true,
      congestion: false,
      nightLighting: false,
      accessibility: true,
      parking: true,
      amenities: true
    };
    this.currentRoute = null;
    this.selectedLocationId = null;
    this.userLocationNodeId = 'n_gate1';
    this.avatarProgress = 0; // 0.0 to 1.0 along current route
    this.simulationMarker = null;

    this.init();
  }

  init() {
    this.renderBaseSvg();
    this.setupInteractivity();
  }

  renderBaseSvg() {
    const { width, height } = this.data.bounds;
    this.container.innerHTML = `
      <div class="map-viewport relative w-full h-full overflow-hidden select-none bg-slate-900 cursor-grab" id="map-viewport">
        <!-- SVG Canvas -->
        <svg id="campus-svg" viewBox="0 0 ${width} ${height}" class="w-full h-full transition-transform duration-100 ease-out origin-center" preserveAspectRatio="xMidYMid meet">
          <defs>
            <!-- Filters & Gradients -->
            <filter id="building-shadow" x="-10%" y="-10%" width="130%" height="135%">
              <feDropShadow dx="3" dy="6" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.3" />
            </filter>
            <filter id="route-glow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="route-glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="route-glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <!-- Pattern: Campus Tile Plaza -->
            <pattern id="plaza-tiles" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="0.8" opacity="0.4" />
            </pattern>
            <pattern id="hazard-stripes" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="8" height="16" fill="#ef4444" opacity="0.6"/>
              <rect x="8" width="8" height="16" fill="#fbbf24" opacity="0.6"/>
            </pattern>
            <pattern id="solar-panel" width="8" height="6" patternUnits="userSpaceOnUse">
              <rect width="7" height="5" fill="#1e3a8a" stroke="#60a5fa" stroke-width="0.5"/>
            </pattern>
            <pattern id="track-lanes" width="10" height="10" patternUnits="userSpaceOnUse">
              <line x1="0" y1="5" x2="10" y2="5" stroke="#ffffff" stroke-width="0.6" stroke-dasharray="2,2" opacity="0.5"/>
            </pattern>

            <!-- Gradients -->
            <linearGradient id="lawn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ecfdf5"/>
              <stop offset="100%" stop-color="#d1fae5"/>
            </linearGradient>
            <linearGradient id="lake-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0284c7"/>
              <stop offset="100%" stop-color="#0369a1"/>
            </linearGradient>
            <linearGradient id="track-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ea580c"/>
              <stop offset="100%" stop-color="#c2410c"/>
            </linearGradient>
            <radialGradient id="night-light-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fef08a" stop-opacity="0.8"/>
              <stop offset="60%" stop-color="#fef08a" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="congestion-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.65"/>
              <stop offset="70%" stop-color="#f59e0b" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <!-- Layer 0: Campus Base Geography -->
          <g id="layer-terrain">
            <!-- Background Ground -->
            <rect width="${width}" height="${height}" fill="#f8fafc" class="ground-bg"/>
            
            <!-- Campus Boundary Line -->
            <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" class="campus-inner-lot"/>

            <!-- Manicured Great Lawns & Green Belts -->
            <path d="M 460 480 Q 600 450 740 480 Q 760 560 740 630 Q 600 660 460 630 Z" fill="url(#lawn-grad)" stroke="#a7f3d0" stroke-width="1.5" class="lawn-zone"/>
            <rect x="520" y="540" width="160" height="60" rx="30" fill="#a7f3d0" opacity="0.4"/>
            <!-- Sports Oval Grass -->
            <rect x="90" y="110" width="230" height="200" rx="40" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1.5"/>
            <!-- Hostel Quad Gardens -->
            <rect x="1000" y="210" width="80" height="60" rx="12" fill="url(#lawn-grad)"/>
            <rect x="1000" y="590" width="80" height="60" rx="12" fill="url(#lawn-grad)"/>
            <!-- North Green Belt -->
            <rect x="420" y="90" width="140" height="50" rx="16" fill="url(#lawn-grad)"/>

            <!-- Central Reflection Lake & Fountain -->
            <ellipse cx="600" cy="530" rx="50" ry="24" fill="url(#lake-grad)" opacity="0.85"/>
            <ellipse cx="600" cy="530" rx="20" ry="9" fill="#e0f2fe" opacity="0.6" class="animate-pulse"/>
            <circle cx="600" cy="530" r="4" fill="#38bdf8"/>

            <!-- Athletic Synthetic 400m Track -->
            <rect x="100" y="120" width="200" height="170" rx="60" fill="url(#track-grad)" stroke="#fed7aa" stroke-width="2"/>
            <rect x="115" y="135" width="170" height="140" rx="50" fill="#22c55e" stroke="#ffffff" stroke-width="1.5"/>
            <!-- Football Pitch Markings -->
            <rect x="135" y="150" width="130" height="110" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.75"/>
            <circle cx="200" cy="205" r="18" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.75"/>
            <line x1="200" y1="150" x2="200" y2="260" stroke="#ffffff" stroke-width="1.5" opacity="0.75"/>

            <!-- Tennis Courts Area -->
            <rect x="320" y="90" width="100" height="65" rx="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1"/>
            <line x1="370" y1="90" x2="370" y2="155" stroke="#ffffff" stroke-width="1.2"/>
            <rect x="330" y="98" width="80" height="49" fill="none" stroke="#ffffff" stroke-width="1"/>
          </g>

          <!-- Layer 1: Road & Pedestrian Network -->
          <g id="layer-paths" class="pathway-network">
            ${this.renderPathwayNetwork()}
          </g>

          <!-- Layer 2: Congestion Heatmap Overlays -->
          <g id="layer-congestion" class="transition-opacity duration-300" style="display: none;">
            <!-- Cafe Lunch Rush -->
            <circle cx="750" cy="460" r="85" fill="url(#congestion-glow)"/>
            <!-- Central Mess Rush -->
            <circle cx="950" cy="440" r="105" fill="url(#congestion-glow)"/>
            <!-- Admin Counter -->
            <circle cx="600" cy="650" r="70" fill="url(#congestion-glow)"/>
          </g>

          <!-- Layer 3: Night Safety Lighting Layer -->
          <g id="layer-night-lighting" class="transition-opacity duration-300" style="display: none;">
            ${this.renderNightSafetyCones()}
          </g>

          <!-- Layer 4: Buildings & Architectural Structures -->
          <g id="layer-buildings">
            ${this.renderBuildings()}
          </g>

          <!-- Layer 5: Route Display & Overlays -->
          <g id="layer-route">
            <!-- Animated path polyline will be injected here -->
          </g>

          <!-- Layer 6: Temporary Roadblocks / Hazard Barriers -->
          <g id="layer-roadblocks">
            <!-- Dynamic closure indicators -->
          </g>

          <!-- Layer 7: Interactive Markers & Pins -->
          <g id="layer-markers">
            ${this.renderInteractiveMarkers()}
          </g>

          <!-- Layer 8: Live Avatar & Turn Simulator -->
          <g id="layer-avatar">
            <g id="avatar-marker" style="display: none;">
              <!-- Pulsing Blue Dot with Directional Heading Cone -->
              <circle cx="0" cy="0" r="18" fill="#3b82f6" fill-opacity="0.25" class="animate-ping"/>
              <circle cx="0" cy="0" r="10" fill="#2563eb" stroke="#ffffff" stroke-width="2.5" filter="url(#building-shadow)"/>
              <path d="M 0 -13 L 5 -5 L -5 -5 Z" fill="#ffffff"/>
            </g>
          </g>
        </svg>

        <!-- Floating Quick Map Controls -->
        <div class="absolute bottom-6 right-5 flex flex-col gap-2 z-20 pointer-events-auto">
          <button id="map-zoom-in" class="w-10 h-10 rounded-xl bg-white/90 backdrop-blur shadow-md hover:bg-slate-100 active:scale-95 text-slate-800 font-bold flex items-center justify-center border border-slate-200 text-lg transition" title="Zoom In">
            +
          </button>
          <button id="map-zoom-out" class="w-10 h-10 rounded-xl bg-white/90 backdrop-blur shadow-md hover:bg-slate-100 active:scale-95 text-slate-800 font-bold flex items-center justify-center border border-slate-200 text-lg transition" title="Zoom Out">
            -
          </button>
          <button id="map-reset" class="w-10 h-10 rounded-xl bg-white/90 backdrop-blur shadow-md hover:bg-slate-100 active:scale-95 text-slate-800 font-semibold flex items-center justify-center border border-slate-200 text-xs transition" title="Recenter Campus">
            <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
          </button>
          <button id="map-toggle-3d" class="w-10 h-10 rounded-xl bg-white/90 backdrop-blur shadow-md hover:bg-slate-100 active:scale-95 text-slate-800 font-semibold flex items-center justify-center border border-slate-200 text-xs transition" title="Toggle 2.5D Isometric Tilt">
            3D
          </button>
        </div>

        <!-- Campus Compass Legend Pill -->
        <div class="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-4 text-xs font-medium z-10 hidden sm:flex">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
            <span class="text-slate-700">Fastest Route</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span class="text-slate-700">Accessible (Ramps)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span class="text-slate-700">Congested</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span class="text-slate-700">Emergency / Closed</span>
          </div>
        </div>

        <!-- Map Layer Quick Filters Pill -->
        <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-1 text-xs z-10 overflow-x-auto max-w-[90vw]">
          <button id="btn-layer-all" class="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-semibold border border-blue-200 transition">All</button>
          <button id="btn-layer-accessible" class="px-2.5 py-1 rounded-xl text-slate-600 hover:bg-slate-100 transition flex items-center gap-1">
            <span>♿</span> Ramps
          </button>
          <button id="btn-layer-congestion" class="px-2.5 py-1 rounded-xl text-slate-600 hover:bg-slate-100 transition flex items-center gap-1">
            <span>🔥</span> Crowds
          </button>
          <button id="btn-layer-night" class="px-2.5 py-1 rounded-xl text-slate-600 hover:bg-slate-100 transition flex items-center gap-1">
            <span>🌙</span> Night Lights
          </button>
        </div>
      </div>
    `;

    this.svgElement = document.getElementById('campus-svg');
    this.viewport = document.getElementById('map-viewport');
  }

  // Renders the realistic pathway network
  renderPathwayNetwork() {
    const nodes = this.data.graph.nodes;
    let pathsHtml = '';

    // Draw wide boulevard underlays
    for (const edge of this.data.graph.edges) {
      const u = nodes[edge.from];
      const v = nodes[edge.to];
      if (!u || !v) continue;

      // Base path pavement
      const strokeWidth = edge.sheltered ? 14 : (edge.accessible ? 10 : 8);
      const strokeColor = edge.sheltered ? '#e2e8f0' : '#f1f5f9';
      pathsHtml += `
        <line x1="${u.x}" y1="${u.y}" x2="${v.x}" y2="${v.y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" class="path-base" />
      `;

      // If sheltered colonnade, draw decorative overhead pillars
      if (edge.sheltered) {
        pathsHtml += `
          <line x1="${u.x}" y1="${u.y}" x2="${v.x}" y2="${v.y}" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,8" class="sheltered-colonnade" />
        `;
      }

      // If dedicated accessible ramp pathway, draw subtle green guide
      if (edge.accessible && !edge.hasStairs) {
        pathsHtml += `
          <line x1="${u.x}" y1="${u.y}" x2="${v.x}" y2="${v.y}" stroke="#10b981" stroke-width="1.2" stroke-dasharray="3,6" opacity="0.4" class="accessible-guide-line" />
        `;
      }

      // If path has stairs, draw staircase hatch markings
      if (edge.hasStairs) {
        pathsHtml += `
          <line x1="${u.x}" y1="${u.y}" x2="${v.x}" y2="${v.y}" stroke="#dc2626" stroke-width="6" stroke-dasharray="3,3" opacity="0.75" class="stairs-mark" />
        `;
      }
    }

    return pathsHtml;
  }

  // Night lighting cones along primary campus avenues
  renderNightSafetyCones() {
    const nodes = this.data.graph.nodes;
    let conesHtml = '';

    // High-lumen lamps at strategic junctions & pedestrian paths
    const litNodeKeys = ['n_gate1', 'n_gate2', 'n_gate3', 'n_gate4', 'n_admin', 'n_sac', 'n_cafe', 'n_health', 'n_library', 'n_ab_a', 'j_central_plaza', 'j_academic_cross', 'j_east_dining', 'j_east_hostel_south', 'j_east_hostel_north'];

    for (const key of litNodeKeys) {
      const node = nodes[key];
      if (!node) continue;
      conesHtml += `
        <circle cx="${node.x}" cy="${node.y}" r="65" fill="url(#night-light-glow)" class="night-lamp-cone"/>
        <!-- Lamp post fixture -->
        <circle cx="${node.x}" cy="${node.y}" r="3" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
      `;
    }

    return conesHtml;
  }

  // 2.5D Architectural Building Footprints
  renderBuildings() {
    let buildingsHtml = '';

    for (const loc of this.data.locations) {
      const x = loc.x - loc.width / 2;
      const y = loc.y - loc.height / 2;
      const w = loc.width;
      const h = loc.height;

      // Category color schemes
      let wallColor = '#ffffff';
      let roofColor = '#f1f5f9';
      let strokeColor = '#94a3b8';
      let badgeBg = '#3b82f6';
      let badgeText = loc.shortCode || 'B';

      switch (loc.category) {
        case 'academic':
          wallColor = '#eff6ff';
          roofColor = '#dbeafe';
          strokeColor = '#3b82f6';
          badgeBg = '#2563eb';
          break;
        case 'labs':
          wallColor = '#f0fdf4';
          roofColor = '#dcfce7';
          strokeColor = '#10b981';
          badgeBg = '#059669';
          break;
        case 'student_life':
          wallColor = '#faf5ff';
          roofColor = '#f3e8ff';
          strokeColor = '#a855f7';
          badgeBg = '#9333ea';
          break;
        case 'food':
          wallColor = '#fffbeb';
          roofColor = '#fef3c7';
          strokeColor = '#f59e0b';
          badgeBg = '#d97706';
          break;
        case 'hostels':
          wallColor = '#fdf4ff';
          roofColor = '#fae8ff';
          strokeColor = '#ec4899';
          badgeBg = '#db2777';
          break;
        case 'sports':
          wallColor = '#f0fdf4';
          roofColor = '#bbf7d0';
          strokeColor = '#16a34a';
          badgeBg = '#15803d';
          break;
        case 'medical':
          wallColor = '#fef2f2';
          roofColor = '#fee2e2';
          strokeColor = '#ef4444';
          badgeBg = '#dc2626';
          break;
        case 'parking':
          wallColor = '#f8fafc';
          roofColor = '#e2e8f0';
          strokeColor = '#64748b';
          badgeBg = '#475569';
          break;
        case 'emergency':
          wallColor = '#ecfdf5';
          roofColor = '#d1fae5';
          strokeColor = '#059669';
          badgeBg = '#047857';
          break;
        case 'gates':
          wallColor = '#f8fafc';
          roofColor = '#f1f5f9';
          strokeColor = '#0284c7';
          badgeBg = '#0284c7';
          break;
        case 'admin':
          wallColor = '#eff6ff';
          roofColor = '#bfdbfe';
          strokeColor = '#1d4ed8';
          badgeBg = '#1e40af';
          break;
      }

      // Special architectural shapes
      if (loc.type === 'amphitheatre') {
        // Open Air Theatre (Stepped concentric semi-circles)
        buildingsHtml += `
          <g class="building-group cursor-pointer transition hover:opacity-90" data-id="${loc.id}">
            <!-- Base Shadow -->
            <path d="M ${x} ${y + h} A ${w/2} ${h/2} 0 0 1 ${x + w} ${y + h} Z" fill="#cbd5e1" opacity="0.5"/>
            <!-- Tier 1 -->
            <path d="M ${x} ${y + h - 5} A ${w/2} ${h/2} 0 0 1 ${x + w} ${y + h - 5} Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
            <!-- Tier 2 -->
            <path d="M ${x + 15} ${y + h - 10} A ${w/2 - 15} ${h/2 - 15} 0 0 1 ${x + w - 15} ${y + h - 10} Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
            <!-- Tier 3 -->
            <path d="M ${x + 30} ${y + h - 15} A ${w/2 - 30} ${h/2 - 30} 0 0 1 ${x + w - 30} ${y + h - 15} Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
            <!-- Stage Center -->
            <ellipse cx="${loc.x}" cy="${y + h - 20}" rx="18" ry="8" fill="#f59e0b"/>
            <!-- Label -->
            <text x="${loc.x}" y="${loc.y - 5}" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">${loc.name}</text>
          </g>
        `;
      } else if (loc.type === 'library') {
        // Central Library (Iconic circular rotunda with dome)
        buildingsHtml += `
          <g class="building-group cursor-pointer transition hover:opacity-90" data-id="${loc.id}" filter="url(#building-shadow)">
            <!-- Outer Plaza Pedestal -->
            <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>
            <!-- 3D Extrusion -->
            <rect x="${x}" y="${y - 8}" width="${w}" height="${h}" rx="18" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
            <!-- Glass Rotunda Rings -->
            <circle cx="${loc.x}" cy="${loc.y - 8}" r="32" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5"/>
            <circle cx="${loc.x}" cy="${loc.y - 8}" r="22" fill="#7dd3fc" stroke="#0369a1" stroke-width="1.2"/>
            <circle cx="${loc.x}" cy="${loc.y - 8}" r="12" fill="#38bdf8" stroke="#0284c7" stroke-width="1"/>
            <circle cx="${loc.x}" cy="${loc.y - 8}" r="4" fill="#ffffff"/>
            <!-- Label -->
            <text x="${loc.x}" y="${y + h + 14}" text-anchor="middle" font-size="11" font-weight="700" fill="#0f172a">${loc.name}</text>
          </g>
        `;
      } else if (loc.type === 'gate') {
        // Campus Security Gate Arch
        buildingsHtml += `
          <g class="building-group cursor-pointer transition hover:opacity-90" data-id="${loc.id}">
            <!-- Road Barrier Line -->
            <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#f1f5f9" stroke="${strokeColor}" stroke-width="1.5"/>
            <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="4" fill="#0284c7" fill-opacity="0.15"/>
            <!-- Gate Pillars -->
            <rect x="${x}" y="${y}" width="12" height="${h}" rx="3" fill="#0284c7"/>
            <rect x="${x + w - 12}" y="${y}" width="12" height="${h}" rx="3" fill="#0284c7"/>
            <!-- Label -->
            <text x="${loc.x}" y="${loc.y < 200 ? y - 8 : y + h + 14}" text-anchor="middle" font-size="11" font-weight="700" fill="#0369a1">${loc.name}</text>
          </g>
        `;
      } else if (loc.type === 'assembly') {
        // Safe Assembly Lawn Marker
        buildingsHtml += `
          <g class="building-group cursor-pointer transition hover:opacity-90" data-id="${loc.id}">
            <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#10b981" fill-opacity="0.12" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4"/>
            <!-- Assembly Icon Cross -->
            <circle cx="${loc.x}" cy="${loc.y}" r="14" fill="#10b981"/>
            <text x="${loc.x}" y="${loc.y + 4}" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">SOS</text>
            <!-- Label -->
            <text x="${loc.x}" y="${y + h + 12}" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">${loc.name}</text>
          </g>
        `;
      } else if (loc.type === 'parking') {
        // Parking Bay with Bays & Solar Rooftop
        buildingsHtml += `
          <g class="building-group cursor-pointer transition hover:opacity-90" data-id="${loc.id}">
            <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
            <!-- Solar Panel Canopy Pattern -->
            <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="4" fill="url(#solar-panel)" opacity="0.8"/>
            <circle cx="${x + 18}" cy="${y + 18}" r="10" fill="#3b82f6"/>
            <text x="${x + 18}" y="${y + 22}" text-anchor="middle" font-size="10" font-weight="800" fill="#ffffff">P</text>
            <text x="${loc.x}" y="${y + h + 12}" text-anchor="middle" font-size="10" font-weight="700" fill="#475569">${loc.name}</text>
          </g>
        `;
      } else {
        // Standard 2.5D Architectural Block with 3D Depth Extrusion
        buildingsHtml += `
          <g class="building-group cursor-pointer transition hover:scale-[1.01]" data-id="${loc.id}" filter="url(#building-shadow)">
            <!-- 3D Base Shadow Wall -->
            <rect x="${x}" y="${y + 6}" width="${w}" height="${h}" rx="10" fill="#94a3b8" opacity="0.6"/>
            
            <!-- 3D Wall Extrusion -->
            <rect x="${x}" y="${y + 3}" width="${w}" height="${h}" rx="10" fill="${wallColor}" stroke="${strokeColor}" stroke-width="1.5"/>
            
            <!-- Top Roof Slab -->
            <rect x="${x}" y="${y - 4}" width="${w}" height="${h}" rx="10" fill="${roofColor}" stroke="${strokeColor}" stroke-width="1.5"/>
            
            <!-- Roof Architectural Details (Solar array / Atrium / Skylight) -->
            <rect x="${x + 8}" y="${y + 4}" width="${w - 16}" height="${h - 18}" rx="6" fill="#ffffff" fill-opacity="0.45" stroke="${strokeColor}" stroke-width="0.8"/>

            <!-- Badge ShortCode Pill -->
            <rect x="${x + 8}" y="${y}" width="42" height="18" rx="6" fill="${badgeBg}"/>
            <text x="${x + 29}" y="${y + 13}" text-anchor="middle" font-size="10" font-weight="800" fill="#ffffff">${badgeText}</text>

            <!-- Building Name Label -->
            <text x="${loc.x}" y="${y + h + 14}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a" class="building-label">${loc.name}</text>

            <!-- Accessible Ramp Indicator Dot if applicable -->
            ${loc.accessible ? `
              <circle cx="${x + w - 12}" cy="${y + 8}" r="7" fill="#10b981"/>
              <text x="${x + w - 12}" y="${y + 11}" text-anchor="middle" font-size="8" font-weight="bold" fill="#ffffff">♿</text>
            ` : ''}
          </g>
        `;
      }
    }

    return buildingsHtml;
  }

  // Interactive Marker Pins over every destination
  renderInteractiveMarkers() {
    let markersHtml = '';

    for (const loc of this.data.locations) {
      let icon = '📍';
      let pinColor = '#3b82f6';

      switch (loc.category) {
        case 'academic': pinColor = '#2563eb'; icon = '🎓'; break;
        case 'labs': pinColor = '#059669'; icon = '🔬'; break;
        case 'student_life': pinColor = '#9333ea'; icon = '🎭'; break;
        case 'food': pinColor = '#d97706'; icon = '☕'; break;
        case 'hostels': pinColor = '#db2777'; icon = '🛏️'; break;
        case 'sports': pinColor = '#16a34a'; icon = '⚽'; break;
        case 'medical': pinColor = '#dc2626'; icon = '🏥'; break;
        case 'parking': pinColor = '#475569'; icon = '🚗'; break;
        case 'emergency': pinColor = '#047857'; icon = '🛡️'; break;
        case 'gates': pinColor = '#0284c7'; icon = '🚪'; break;
        case 'admin': pinColor = '#1e40af'; icon = '🏛️'; break;
      }

      markersHtml += `
        <g class="interactive-marker cursor-pointer transition transform hover:scale-125" data-id="${loc.id}" transform="translate(${loc.x}, ${loc.y})">
          <!-- Animated Pulse Ring -->
          <circle cx="0" cy="0" r="14" fill="${pinColor}" fill-opacity="0.2" class="marker-pulse"/>
          <!-- Pin Head -->
          <circle cx="0" cy="0" r="11" fill="${pinColor}" stroke="#ffffff" stroke-width="2" filter="url(#building-shadow)"/>
          <!-- Icon / Emoji -->
          <text x="0" y="4" text-anchor="middle" font-size="9" fill="#ffffff">${icon}</text>
        </g>
      `;
    }

    return markersHtml;
  }

  // Setup Pan, Zoom, Pinch, and Click Handlers
  setupInteractivity() {
    const vp = this.viewport;

    // Pan Handlers
    vp.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      this.isPanning = true;
      this.startPan = { x: e.clientX - this.panX, y: e.clientY - this.panY };
      vp.classList.add('cursor-grabbing');
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPanning) return;
      this.panX = e.clientX - this.startPan.x;
      this.panY = e.clientY - this.startPan.y;
      this.applyTransform();
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
      vp.classList.remove('cursor-grabbing');
    });

    // Touch Support for Mobile
    let touchStartDist = 0;
    vp.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isPanning = true;
        this.startPan = { x: e.touches[0].clientX - this.panX, y: e.touches[0].clientY - this.panY };
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    vp.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isPanning) {
        this.panX = e.touches[0].clientX - this.startPan.x;
        this.panY = e.touches[0].clientY - this.startPan.y;
        this.applyTransform();
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / touchStartDist;
        this.zoom = Math.max(0.6, Math.min(3.5, this.zoom * (factor > 1 ? 1.02 : 0.98)));
        touchStartDist = dist;
        this.applyTransform();
      }
    }, { passive: true });

    vp.addEventListener('touchend', () => {
      this.isPanning = false;
    });

    // Wheel Zoom
    vp.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      this.zoom = Math.max(0.6, Math.min(3.5, this.zoom * zoomFactor));
      this.applyTransform();
    }, { passive: false });

    // Buttons
    document.getElementById('map-zoom-in')?.addEventListener('click', () => {
      this.zoom = Math.min(3.5, this.zoom * 1.25);
      this.applyTransform();
    });

    document.getElementById('map-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.6, this.zoom * 0.8);
      this.applyTransform();
    });

    document.getElementById('map-reset')?.addEventListener('click', () => {
      this.resetView();
    });

    document.getElementById('map-toggle-3d')?.addEventListener('click', () => {
      this.isTilt3D = !this.isTilt3D;
      document.getElementById('map-toggle-3d').classList.toggle('bg-blue-600', this.isTilt3D);
      document.getElementById('map-toggle-3d').classList.toggle('text-white', this.isTilt3D);
      this.applyTransform();
    });

    // Layer Filters
    document.getElementById('btn-layer-all')?.addEventListener('click', () => {
      this.setAllLayers(true);
    });

    document.getElementById('btn-layer-congestion')?.addEventListener('click', (e) => {
      this.activeLayers.congestion = !this.activeLayers.congestion;
      e.currentTarget.classList.toggle('bg-amber-100', this.activeLayers.congestion);
      e.currentTarget.classList.toggle('text-amber-800', this.activeLayers.congestion);
      const layer = document.getElementById('layer-congestion');
      if (layer) layer.style.display = this.activeLayers.congestion ? 'block' : 'none';
    });

    document.getElementById('btn-layer-night')?.addEventListener('click', (e) => {
      this.activeLayers.nightLighting = !this.activeLayers.nightLighting;
      e.currentTarget.classList.toggle('bg-yellow-100', this.activeLayers.nightLighting);
      e.currentTarget.classList.toggle('text-yellow-800', this.activeLayers.nightLighting);
      const layer = document.getElementById('layer-night-lighting');
      if (layer) layer.style.display = this.activeLayers.nightLighting ? 'block' : 'none';
    });

    // Building and Marker Click Handlers
    this.svgElement.addEventListener('click', (e) => {
      const targetGroup = e.target.closest('.building-group') || e.target.closest('.interactive-marker');
      if (targetGroup) {
        const id = targetGroup.getAttribute('data-id');
        if (id && this.onLocationSelect) {
          this.selectLocation(id);
          this.onLocationSelect(id);
        }
      }
    });
  }

  applyTransform() {
    if (!this.svgElement) return;
    const tiltStyle = this.isTilt3D 
      ? `perspective(1000px) rotateX(25deg) translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`
      : `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    this.svgElement.style.transform = tiltStyle;
  }

  resetView() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.isTilt3D = false;
    document.getElementById('map-toggle-3d')?.classList.remove('bg-blue-600', 'text-white');
    this.applyTransform();
  }

  focusLocation(locId) {
    const loc = this.data.locations.find(l => l.id === locId);
    if (!loc) return;
    const { width, height } = this.data.bounds;
    this.zoom = 1.6;
    // Center on location
    this.panX = (width / 2 - loc.x) * 1.6;
    this.panY = (height / 2 - loc.y) * 1.6;
    this.applyTransform();
    this.selectLocation(locId);
  }

  selectLocation(locId) {
    this.selectedLocationId = locId;
    // Highlight active pin
    this.svgElement.querySelectorAll('.interactive-marker').forEach(el => {
      if (el.getAttribute('data-id') === locId) {
        el.querySelector('.marker-pulse')?.setAttribute('r', '24');
        el.querySelector('.marker-pulse')?.setAttribute('fill', '#ef4444');
      } else {
        el.querySelector('.marker-pulse')?.setAttribute('r', '14');
        el.querySelector('.marker-pulse')?.setAttribute('fill', '#3b82f6');
      }
    });
  }

  // Draw Animated Route Polyline
  displayRoute(routeResult) {
    const routeLayer = document.getElementById('layer-route');
    if (!routeLayer) return;

    if (!routeResult || routeResult.error || !routeResult.nodes || routeResult.nodes.length < 2) {
      routeLayer.innerHTML = '';
      this.currentRoute = null;
      document.getElementById('avatar-marker')?.style.setProperty('display', 'none');
      return;
    }

    this.currentRoute = routeResult;
    const pointsStr = routeResult.nodes.map(n => `${n.x},${n.y}`).join(' ');

    let strokeColor = '#2563eb'; // Blue default
    let glowFilter = 'url(#route-glow-blue)';

    if (routeResult.mode === 'accessible') {
      strokeColor = '#10b981'; // Green for accessible
      glowFilter = 'url(#route-glow-green)';
    } else if (routeResult.mode === 'emergency') {
      strokeColor = '#dc2626'; // Red for emergency
      glowFilter = 'url(#route-glow-red)';
    }

    const startNode = routeResult.nodes[0];
    const endNode = routeResult.nodes[routeResult.nodes.length - 1];

    routeLayer.innerHTML = `
      <!-- Route Halo Glow -->
      <polyline points="${pointsStr}" fill="none" stroke="${strokeColor}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.35" filter="${glowFilter}"/>
      
      <!-- Route Solid Track -->
      <polyline points="${pointsStr}" fill="none" stroke="${strokeColor}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      
      <!-- Animated Directional Chevrons / Dashes -->
      <polyline points="${pointsStr}" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="10,14" stroke-linecap="round" stroke-linejoin="round" class="animate-route-flow"/>

      <!-- Origin Marker Pin (Green) -->
      <g transform="translate(${startNode.x}, ${startNode.y})">
        <circle cx="0" cy="0" r="14" fill="#10b981" fill-opacity="0.3" class="animate-ping"/>
        <circle cx="0" cy="0" r="10" fill="#10b981" stroke="#ffffff" stroke-width="2.5"/>
        <text x="0" y="4" text-anchor="middle" font-size="10" font-weight="900" fill="#ffffff">A</text>
      </g>

      <!-- Destination Marker Pin (Blue/Red) -->
      <g transform="translate(${endNode.x}, ${endNode.y})">
        <circle cx="0" cy="0" r="16" fill="${strokeColor}" fill-opacity="0.35" class="animate-ping"/>
        <circle cx="0" cy="0" r="12" fill="${strokeColor}" stroke="#ffffff" stroke-width="2.5"/>
        <text x="0" y="4" text-anchor="middle" font-size="10" font-weight="900" fill="#ffffff">B</text>
      </g>
    `;

    // Position Avatar at Start
    this.updateAvatarPosition(0);
  }

  // Update Avatar Marker Position during Live Turn-by-Turn Simulation
  updateAvatarPosition(progress) {
    if (!this.currentRoute || !this.currentRoute.nodes || this.currentRoute.nodes.length < 2) return;
    this.avatarProgress = Math.max(0, Math.min(1, progress));

    const nodes = this.currentRoute.nodes;
    const totalSegments = nodes.length - 1;
    const exactIndex = this.avatarProgress * totalSegments;
    const segIndex = Math.min(Math.floor(exactIndex), totalSegments - 1);
    const subT = exactIndex - segIndex;

    const p1 = nodes[segIndex];
    const p2 = nodes[segIndex + 1];

    const currentX = p1.x + (p2.x - p1.x) * subT;
    const currentY = p1.y + (p2.y - p1.y) * subT;
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI) + 90;

    const avatarGroup = document.getElementById('avatar-marker');
    if (avatarGroup) {
      avatarGroup.style.display = 'block';
      avatarGroup.setAttribute('transform', `translate(${currentX}, ${currentY}) rotate(${angle})`);
    }
  }

  // Display Temporary Roadblocks (Hazard Stripes)
  displayRoadblock(nodeAId, nodeBId, isBlocked) {
    const layer = document.getElementById('layer-roadblocks');
    if (!layer) return;

    const id = `roadblock_${nodeAId}_${nodeBId}`;
    const existing = document.getElementById(id);

    if (!isBlocked && existing) {
      existing.remove();
      return;
    }

    if (isBlocked && !existing) {
      const n1 = this.data.graph.nodes[nodeAId];
      const n2 = this.data.graph.nodes[nodeBId];
      if (!n1 || !n2) return;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.id = id;
      g.innerHTML = `
        <line x1="${n1.x}" y1="${n1.y}" x2="${n2.x}" y2="${n2.y}" stroke="url(#hazard-stripes)" stroke-width="12" stroke-linecap="round"/>
        <circle cx="${(n1.x + n2.x)/2}" cy="${(n1.y + n2.y)/2}" r="12" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
        <text x="${(n1.x + n2.x)/2}" y="${(n1.y + n2.y)/2 + 4}" text-anchor="middle" font-size="10" font-weight="bold" fill="#ffffff">⛔</text>
      `;
      layer.appendChild(g);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CampusMapRenderer;
}

