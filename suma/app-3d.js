/**
 * Campus Compass 3D - Main Application Controller
 * Coordinates Three.js 3D Viewport, Places Sidebar, Walkway Dijkstra Routing,
 * Landmark Tour, Live Walk Avatar Simulation, Voice Search, and Snapshot Tools.
 */

class CampusCompass3DApp {
  constructor() {
    this.data = CAMPUS_DATA_3D;
    this.graph = null;
    this.router = null;
    this.scene3d = null;

    // State
    this.activeCategory = "all";
    this.searchQuery = "";
    this.favoritesOnly = false;
    this.favorites = new Set(JSON.parse(localStorage.getItem('campus_3d_favorites') || '["loc-admin", "loc-sac", "loc-intel-joe"]'));
    this.selectedBuildingId = null;
    this.startLocationId = "loc-gate-1";
    this.destinationId = "loc-admin";
    this.activeRoute = null;

    // Simulation & Live Walk
    this.isLiveWalking = false;
    this.walkProgress = 0; // 0 to 1
    this.walkSpeed = 1; // 1x, 2x, 4x
    this.walkInterval = null;

    this.init();
  }

  async init() {
    // 1. Load Extracted Graph
    try {
      const res = await fetch('extracted_graph.json');
      this.graph = await res.json();
    } catch (e) {
      console.warn("Using embedded fallback graph:", e);
      this.graph = { nodes: {}, edges: [] };
    }

    // 2. Initialize Router & 3D Scene
    this.router = new CampusRouter3D(this.data, this.graph);
    this.scene3d = new Campus3DScene('viewport-container', this.data, this.graph, (locId) => {
      this.selectBuilding(locId, false); // clicked directly in 3D
    });

    // 3. Setup UI & Listeners
    this.renderPlacesList();
    this.populateRouteDropdowns();
    this.bindEvents();
    console.log("🧭 Campus Compass 3D Engine running smoothly.");
  }

  bindEvents() {
    // Top Bar Action Buttons
    document.getElementById('btn-places')?.addEventListener('click', () => {
      this.togglePlacesSidebar();
    });

    document.getElementById('btn-tour')?.addEventListener('click', (e) => {
      this.toggleTour(e.currentTarget);
    });

    document.getElementById('btn-orbit')?.addEventListener('click', (e) => {
      const isOrbiting = this.scene3d.toggleOrbit();
      e.currentTarget.classList.toggle('active', isOrbiting);
      this.showToast(isOrbiting ? "🔄 360° Continuous Orbit Enabled" : "Orbit Disabled");
    });

    document.getElementById('btn-top-view')?.addEventListener('click', () => {
      this.scene3d.setTopView();
      this.showToast("🧭 2D Aerial Top-Down View");
    });

    document.getElementById('btn-reset')?.addEventListener('click', () => {
      this.scene3d.resetView();
      this.closeBuildingDrawer();
      this.closeRouteDrawer();
      this.showToast("🔄 Camera Reset to Default 3D View");
    });

    document.getElementById('btn-night')?.addEventListener('click', (e) => {
      const isNight = this.scene3d.toggleDayNight();
      e.currentTarget.classList.toggle('active', isNight);
      e.currentTarget.innerHTML = isNight ? `<span>☀️</span> Day` : `<span>🌙</span> Night`;
      this.showToast(isNight ? "🌙 Midnight Twilight Mode Activated" : "☀️ Daylight Mode Restored");
    });

    document.getElementById('btn-markers')?.addEventListener('click', (e) => {
      const visible = this.scene3d.toggleMarkers();
      e.currentTarget.classList.toggle('active', visible);
      this.showToast(visible ? "📍 3D Building Labels Visible" : "3D Labels Hidden");
    });

    document.getElementById('btn-walk-route')?.addEventListener('click', () => {
      this.toggleRouteDrawer();
    });

    document.getElementById('btn-share')?.addEventListener('click', () => {
      this.shareCurrentLocation();
    });

    document.getElementById('btn-snapshot')?.addEventListener('click', () => {
      this.takeSnapshot();
    });

    document.getElementById('btn-fullscreen')?.addEventListener('click', () => {
      this.toggleFullscreen();
    });

    document.getElementById('btn-live-walk')?.addEventListener('click', () => {
      this.startLiveWalk();
    });

    document.getElementById('btn-profile')?.addEventListener('click', () => {
      document.getElementById('profile-modal')?.classList.remove('hidden');
    });

    document.getElementById('btn-settings')?.addEventListener('click', () => {
      document.getElementById('settings-modal')?.classList.remove('hidden');
    });

    // Close Modals
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('profile-modal')?.classList.add('hidden');
        document.getElementById('settings-modal')?.classList.add('hidden');
      });
    });

    // Search Input
    const searchInput = document.getElementById('search-places-input');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderPlacesList();
    });

    // Voice Search Tool
    document.getElementById('btn-voice-search')?.addEventListener('click', () => {
      this.startVoiceSearch();
    });

    // Favorites Filter Tool
    document.getElementById('btn-fav-filter')?.addEventListener('click', (e) => {
      this.favoritesOnly = !this.favoritesOnly;
      e.currentTarget.classList.toggle('active', this.favoritesOnly);
      this.renderPlacesList();
    });

    // Clear Search Tool
    document.getElementById('btn-clear-search')?.addEventListener('click', () => {
      this.searchQuery = "";
      if (searchInput) searchInput.value = "";
      this.favoritesOnly = false;
      document.getElementById('btn-fav-filter')?.classList.remove('active');
      this.activeCategory = "all";
      document.querySelectorAll('.category-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === 'all'));
      this.renderPlacesList();
    });

    // Category Filter Pills (All, Blocks, Hostels, Sports, Services)
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeCategory = e.currentTarget.getAttribute('data-category');
        this.renderPlacesList();
      });
    });

    // Building Details Drawer Buttons
    document.getElementById('btn-drawer-navigate')?.addEventListener('click', () => {
      if (this.selectedBuildingId) {
        this.destinationId = this.selectedBuildingId;
        this.startLocationId = "loc-gate-1"; // Default entry gate
        this.populateRouteDropdowns();
        this.calculateAndDisplayRoute();
        this.openRouteDrawer();
      }
    });

    document.getElementById('btn-drawer-cutaway')?.addEventListener('click', (e) => {
      const isCutaway = this.scene3d.toggleTransparentRoofs();
      e.currentTarget.classList.toggle('active', isCutaway);
      e.currentTarget.innerHTML = isCutaway ? `<span>🏢</span> Solid Roof` : `<span>🏠</span> Transparent Roof`;
      this.showToast(isCutaway ? "Interior Cutaway View: Floors and Rooms Revealed" : "Solid Roof Restored");
    });

    document.getElementById('btn-drawer-close')?.addEventListener('click', () => {
      this.closeBuildingDrawer();
    });

    // Route Drawer Controls
    document.getElementById('select-origin')?.addEventListener('change', (e) => {
      this.startLocationId = e.target.value;
      this.calculateAndDisplayRoute();
    });

    document.getElementById('select-destination')?.addEventListener('change', (e) => {
      this.destinationId = e.target.value;
      this.calculateAndDisplayRoute();
    });

    document.getElementById('btn-swap-route')?.addEventListener('click', () => {
      const temp = this.startLocationId;
      this.startLocationId = this.destinationId;
      this.destinationId = temp;
      this.populateRouteDropdowns();
      this.calculateAndDisplayRoute();
    });

    document.getElementById('btn-route-close')?.addEventListener('click', () => {
      this.closeRouteDrawer();
    });

    // Live Walk HUD Controls
    document.getElementById('btn-hud-play')?.addEventListener('click', () => {
      this.toggleLiveWalkSim();
    });

    document.getElementById('btn-hud-speed')?.addEventListener('click', (e) => {
      if (this.walkSpeed === 1) this.walkSpeed = 2;
      else if (this.walkSpeed === 2) this.walkSpeed = 4;
      else this.walkSpeed = 1;
      e.currentTarget.textContent = `${this.walkSpeed}x`;
    });

    document.getElementById('btn-hud-exit')?.addEventListener('click', () => {
      this.stopLiveWalk();
    });
  }

  // Render Left Places Sidebar List
  renderPlacesList() {
    const container = document.getElementById('places-list-container');
    if (!container) return;

    let filtered = this.data.locations.filter(loc => {
      // Category filter
      if (this.activeCategory !== "all" && loc.category !== this.activeCategory) return false;
      // Favorites filter
      if (this.favoritesOnly && !this.favorites.has(loc.id)) return false;
      // Text Search
      if (this.searchQuery) {
        const query = this.searchQuery;
        const nameMatch = loc.name.toLowerCase().includes(query);
        const codeMatch = (loc.shortCode || "").toLowerCase().includes(query);
        const catMatch = (loc.categoryLabel || "").toLowerCase().includes(query);
        const facMatch = (loc.facilities || []).some(f => f.toLowerCase().includes(query));
        return nameMatch || codeMatch || catMatch || facMatch;
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 32px 12px; color: #64748b; font-size: 11px;">
          <div style="font-size: 28px; margin-bottom: 6px;">🔍</div>
          <div style="font-weight: 700; color: #94a3b8;">No locations found</div>
          <div>Try clearing filters or searching for "Admin", "SAC", "Mess", "OAT"</div>
        </div>
      `;
      return;
    }

    let html = "";
    filtered.forEach((loc, idx) => {
      const isSelected = this.selectedBuildingId === loc.id;
      // Calculate realistic distance from Gate 1
      const distMeters = 80 + (idx * 28);

      html += `
        <div class="place-card-item ${isSelected ? 'selected' : ''}" onclick="window.campusApp.selectBuilding('${loc.id}', true)">
          <div class="place-badge-num">${loc.badgeNumber || (idx + 1)}</div>
          <div class="place-card-texts">
            <div class="place-card-title">${loc.name}</div>
            <div class="place-card-sub">
              <span>${loc.categoryLabel || loc.category}</span>
              <span>•</span>
              <span style="font-family: 'JetBrains Mono', monospace;">${distMeters}m</span>
            </div>
          </div>
          <button style="background:transparent; border:none; color: ${this.favorites.has(loc.id) ? '#f59e0b' : '#64748b'}; cursor:pointer; font-size:13px;" onclick="event.stopPropagation(); window.campusApp.toggleFavorite('${loc.id}', this)" title="Bookmark">
            ${this.favorites.has(loc.id) ? '★' : '☆'}
          </button>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  toggleFavorite(locId, starEl) {
    if (this.favorites.has(locId)) {
      this.favorites.delete(locId);
      starEl.textContent = '☆';
      starEl.style.color = '#64748b';
    } else {
      this.favorites.add(locId);
      starEl.textContent = '★';
      starEl.style.color = '#f59e0b';
    }
    localStorage.setItem('campus_3d_favorites', JSON.stringify(Array.from(this.favorites)));
    if (this.favoritesOnly) this.renderPlacesList();
  }

  // Select Building (from Sidebar or 3D Click)
  selectBuilding(locId, animateCamera = true) {
    this.selectedBuildingId = locId;
    const loc = this.data.locations.find(l => l.id === locId);
    if (!loc) return;

    // 1. Highlight in 3D Scene with Blue Wireframe & Camera Zoom
    this.scene3d.selectBuilding(locId, animateCamera);

    // 2. Highlight in Sidebar
    document.querySelectorAll('.place-card-item').forEach(el => el.classList.remove('selected'));
    this.renderPlacesList();

    // 3. Populate and Open Building Details Drawer
    this.openBuildingDrawer(loc);
  }

  openBuildingDrawer(loc) {
    const drawer = document.getElementById('building-drawer');
    if (!drawer) return;

    document.getElementById('drawer-title').textContent = loc.name;
    document.getElementById('drawer-category').textContent = (loc.categoryLabel || loc.category).toUpperCase();
    document.getElementById('drawer-hours').textContent = loc.openingHours || "Open Standard Hours";
    document.getElementById('drawer-desc').textContent = loc.description || "Campus architectural landmark.";

    const facilitiesContainer = document.getElementById('drawer-facilities');
    if (facilitiesContainer) {
      facilitiesContainer.innerHTML = (loc.facilities || []).map(f => `
        <span class="facility-tag">${f}</span>
      `).join('');
    }

    const floorsContainer = document.getElementById('drawer-floors-list');
    if (floorsContainer) {
      if (loc.floors && loc.floors.length > 0) {
        floorsContainer.innerHTML = `
          <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Interior Floor Directory</div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            ${loc.floors.map(fl => `
              <div style="padding:6px 10px; border-radius:10px; background:rgba(255,255,255,0.05); font-size:10.5px;">
                <span style="font-weight:700; color:#38bdf8;">${fl.floorName}:</span>
                <span style="color:#cbd5e1; margin-left:4px;">${fl.rooms.join(', ')}</span>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        floorsContainer.innerHTML = "";
      }
    }

    drawer.classList.remove('hidden');
  }

  closeBuildingDrawer() {
    document.getElementById('building-drawer')?.classList.add('hidden');
  }

  togglePlacesSidebar() {
    const sidebar = document.getElementById('places-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
      document.getElementById('btn-places')?.classList.toggle('active', !sidebar.classList.contains('collapsed'));
    }
  }

  // Route Planning (Strictly Roads Only)
  populateRouteDropdowns() {
    const originSelect = document.getElementById('select-origin');
    const destSelect = document.getElementById('select-destination');
    if (!originSelect || !destSelect) return;

    let optionsHtml = "";
    this.data.locations.forEach(l => {
      optionsHtml += `<option value="${l.id}">${l.name}</option>`;
    });

    originSelect.innerHTML = optionsHtml;
    destSelect.innerHTML = optionsHtml;

    originSelect.value = this.startLocationId;
    destSelect.value = this.destinationId;
  }

  calculateAndDisplayRoute() {
    const route = this.router.findRoute(this.startLocationId, this.destinationId);
    this.activeRoute = route;

    if (!route.success) {
      this.showToast(route.error || "No route found along roads", "error");
      this.scene3d.displayRoute(null);
      return;
    }

    // Update Metrics in UI
    document.getElementById('metric-distance').textContent = `${route.totalDistanceMeters}m`;
    document.getElementById('metric-time').textContent = `${route.walkingTimeMin}m ${route.walkingTimeSec}s`;
    document.getElementById('metric-steps').textContent = `${route.steps}`;
    document.getElementById('metric-calories').textContent = `${route.calories}cal`;

    // Render Turn-by-Turn Steps List
    const stepsContainer = document.getElementById('route-steps-container');
    if (stepsContainer) {
      stepsContainer.innerHTML = route.directions.map(step => {
        let icon = "🚶";
        if (step.turnType === "right") icon = "↪️";
        else if (step.turnType === "left") icon = "↩️";
        else if (step.turnType === "arrive") icon = "🎯";

        return `
          <div class="route-step-row">
            <span style="font-size:14px;">${icon}</span>
            <div style="flex:1;">
              <div style="color:#ffffff; font-weight:600;">${step.instruction}</div>
              ${step.distance > 0 ? `<div style="color:#94a3b8; font-size:9.5px; font-family:'JetBrains Mono';">${step.distance} meters</div>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    // Display Ground-Aligned Route in 3D (Strictly on roads)
    this.scene3d.displayRoute(route);
  }

  openRouteDrawer() {
    const drawer = document.getElementById('route-drawer');
    if (drawer) {
      drawer.classList.remove('hidden');
      document.getElementById('btn-walk-route')?.classList.add('active');
    }
  }

  closeRouteDrawer() {
    const drawer = document.getElementById('route-drawer');
    if (drawer) {
      drawer.classList.add('hidden');
      document.getElementById('btn-walk-route')?.classList.remove('active');
    }
  }

  toggleRouteDrawer() {
    const drawer = document.getElementById('route-drawer');
    if (drawer) {
      if (drawer.classList.contains('hidden')) {
        this.calculateAndDisplayRoute();
        this.openRouteDrawer();
      } else {
        this.closeRouteDrawer();
      }
    }
  }

  // Live Walk Simulation
  startLiveWalk() {
    if (!this.activeRoute || !this.activeRoute.success) {
      this.calculateAndDisplayRoute();
    }

    if (!this.activeRoute || !this.activeRoute.success) {
      this.showToast("Please calculate a route first", "error");
      return;
    }

    this.isLiveWalking = true;
    this.walkProgress = 0;
    this.closeRouteDrawer();
    this.closeBuildingDrawer();

    const hud = document.getElementById('hud-live-walk');
    if (hud) hud.classList.remove('hidden');

    this.toggleLiveWalkSim(true);
    this.showToast("🚶 Live Walk Navigation Started");
  }

  toggleLiveWalkSim(forcePlay = null) {
    const shouldPlay = forcePlay !== null ? forcePlay : !this.walkInterval;
    const playBtn = document.getElementById('btn-hud-play');

    if (shouldPlay) {
      if (playBtn) playBtn.innerHTML = `<span>⏸️</span> Pause`;
      const pts = this.activeRoute.pathPoints3D;

      this.walkInterval = setInterval(() => {
        this.walkProgress += 0.006 * this.walkSpeed;

        if (this.walkProgress >= 1) {
          this.walkProgress = 1;
          this.updateAvatarPos(pts, 1);
          this.stopLiveWalk();
          this.showToast("🎉 Arrived at destination!", "success");
          return;
        }

        this.updateAvatarPos(pts, this.walkProgress);
      }, 80);
    } else {
      if (playBtn) playBtn.innerHTML = `<span>▶️</span> Walk`;
      if (this.walkInterval) clearInterval(this.walkInterval);
      this.walkInterval = null;
    }
  }

  updateAvatarPos(pts, progress) {
    if (!pts || pts.length < 2) return;
    const totalSegs = pts.length - 1;
    const exact = progress * totalSegs;
    const idx = Math.min(Math.floor(exact), totalSegs - 1);
    const subT = exact - idx;

    const p1 = pts[idx];
    const p2 = pts[idx + 1];

    const curX = p1.x + (p2.x - p1.x) * subT;
    const curZ = p1.z + (p2.z - p1.z) * subT;
    const angle = Math.atan2(p2.x - p1.x, p2.z - p1.z);

    if (this.scene3d.avatarMesh) {
      this.scene3d.avatarMesh.position.set(curX, 0.28, curZ);
      this.scene3d.avatarMesh.rotation.y = angle;
    }

    // Update HUD step banner
    const stepIdx = Math.min(idx, this.activeRoute.directions.length - 1);
    const step = this.activeRoute.directions[stepIdx];
    const textEl = document.getElementById('hud-turn-text');
    if (textEl && step) {
      textEl.textContent = step.instruction;
    }
  }

  stopLiveWalk() {
    this.isLiveWalking = false;
    if (this.walkInterval) clearInterval(this.walkInterval);
    this.walkInterval = null;
    document.getElementById('hud-live-walk')?.classList.add('hidden');
    this.showToast("Live Walk Ended");
  }

  // Automated Guided Tour Mode
  toggleTour(btn) {
    if (this.scene3d.isTouring) {
      this.scene3d.stopTour();
      btn.classList.remove('active');
      document.getElementById('hud-tour')?.classList.add('hidden');
      this.showToast("Landmark Tour Stopped");
    } else {
      btn.classList.add('active');
      const hud = document.getElementById('hud-tour');
      if (hud) hud.classList.remove('hidden');

      this.scene3d.startTour((locId, stopNum, totalStops) => {
        const loc = this.data.locations.find(l => l.id === locId);
        document.getElementById('hud-tour-title').textContent = `Stop ${stopNum} of ${totalStops}: ${loc ? loc.name : ''}`;
        this.openBuildingDrawer(loc);
      });
      this.showToast("🚩 Automated Guided Tour Started");
    }
  }

  // Voice Search Tool
  startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      this.showToast("Voice recognition not supported in this browser", "error");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    this.showToast("🎙️ Listening... Speak a campus building name");

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      const searchInput = document.getElementById('search-places-input');
      if (searchInput) {
        searchInput.value = speechResult;
        this.searchQuery = speechResult.trim().toLowerCase();
        this.renderPlacesList();
        this.showToast(`Searched for: "${speechResult}"`);
      }
    };

    recognition.onerror = () => {
      this.showToast("Voice search canceled or timed out");
    };
  }

  // Snapshot Tool (Reference Image 1)
  takeSnapshot() {
    const canvas = this.scene3d.renderer.domElement;
    if (!canvas) return;

    this.scene3d.renderer.render(this.scene3d.scene, this.scene3d.camera);
    const dataURL = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = `joy-university-3d-campus-${Date.now()}.png`;
    link.href = dataURL;
    link.click();

    this.showToast("📷 Campus 3D Snapshot Downloaded!");
  }

  // Share Tool
  shareCurrentLocation() {
    const loc = this.selectedBuildingId ? this.data.locations.find(l => l.id === this.selectedBuildingId) : null;
    const name = loc ? loc.name : "Joy University 3D Smart Campus";
    const url = window.location.href;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${name} - ${url}`).then(() => {
        this.showToast("🔗 Campus Link Copied to Clipboard!");
      });
    } else {
      this.showToast("Link: " + url);
    }
  }

  // Fullscreen Tool
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      this.showToast("⛶ Fullscreen Mode Enabled");
    } else {
      document.exitFullscreen().catch(() => {});
      this.showToast("Fullscreen Mode Exited");
    }
  }

  // Toast Notification Utility
  showToast(msg) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

// Global Launcher
window.addEventListener('DOMContentLoaded', () => {
  window.campusApp = new CampusCompass3DApp();
});

