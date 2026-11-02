/**
 * Campus Compass - Application State Controller & Navigation Engine
 * Coordinates UI screens, Dijkstra routing, voice guidance, indoor navigation,
 * orientation quests, search with typo-tolerance, and emergency dispatch.
 */

class CampusCompassApp {
  constructor() {
    this.data = CAMPUS_DATA;
    this.router = new CampusRouter(this.data);
    this.mapRenderer = null;

    // State
    this.currentScreen = 'home'; // home, map, search, preview, turn_by_turn, emergency, admin
    this.activeTheme = 'light'; // light, dark, high_contrast
    this.isMobileFrame = false; // Toggle between full screen and phone mockup
    this.selectedPlace = null;
    this.startLocationId = 'gate_1';
    this.destinationId = 'ab_a';
    this.selectedRouteMode = 'fastest'; // fastest, accessible, sheltered, night_safety, crowd_aware
    this.activeRoute = null;
    
    // Live Navigation & Simulation
    this.navCurrentStep = 0;
    this.navSimProgress = 0; // 0 to 1
    this.isSimulating = false;
    this.simSpeed = 1; // 1x, 2x, 4x
    this.simInterval = null;
    this.voiceEnabled = true;

    // Search & History
    this.recentSearches = JSON.parse(localStorage.getItem('campus_recent_searches') || '["Central Library", "Academic Block A", "Central Cafe", "SAC"]');

    // Quests & Gamification
    this.quests = JSON.parse(localStorage.getItem('campus_quests') || JSON.stringify(this.data.quests));

    // Admin state
    this.activeBroadcast = "Welcome to Campus Compass v2.4. All pathways clear. Tech Fest registration open at SAC.";
    this.isOffline = false;
    this.isGpsWeak = false;

    this.init();
  }

  init() {
    // Initialize Map Renderer
    this.mapRenderer = new CampusMapRenderer('map-container', this.data, (locationId) => {
      this.openPlaceDetails(locationId);
    });

    this.bindEvents();
    this.renderScreen(this.currentScreen);
    this.renderTimetableCard();
    this.renderQuestsProgress();
    this.renderRecentSearches();
    this.renderAdminControls();

    // Check query params or defaults
    console.log("Campus Compass Core initialized successfully.");
  }

  // Bind Global Event Listeners
  bindEvents() {
    // Navigation items (Desktop Sidebar & Mobile Bottom Bar)
    document.querySelectorAll('[data-nav-screen]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const screen = e.currentTarget.getAttribute('data-nav-screen');
        if (screen) this.navigateTo(screen);
      });
    });

    // Theme toggles
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      this.cycleTheme();
    });

    // Device frame preview toggle (Mobile simulator vs Full desktop)
    document.getElementById('btn-device-frame-toggle')?.addEventListener('click', () => {
      this.toggleDeviceFrame();
    });

    // Search Input with Typo Tolerance
    const searchInput = document.getElementById('search-input-field');
    searchInput?.addEventListener('input', (e) => {
      this.handleSearchInput(e.target.value);
    });

    // Category Filter Chips in Search Screen
    document.querySelectorAll('.search-category-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.search-category-chip').forEach(c => c.classList.remove('bg-blue-600', 'text-white'));
        e.currentTarget.classList.add('bg-blue-600', 'text-white');
        const cat = e.currentTarget.getAttribute('data-category');
        this.filterSearchResults(cat, searchInput ? searchInput.value : '');
      });
    });

    // Quick Action: "Take Me to Class"
    document.getElementById('btn-take-me-to-class')?.addEventListener('click', () => {
      this.startTimetableRouting();
    });

    // Quick Action: Emergency SOS Button
    document.getElementById('btn-sos-global')?.addEventListener('click', () => {
      this.navigateTo('emergency');
    });

    // Place Details Modal Buttons
    document.getElementById('btn-place-navigate')?.addEventListener('click', () => {
      if (this.selectedPlace) {
        this.destinationId = this.selectedPlace.id;
        this.startLocationId = 'gate_1'; // Default current position
        this.closePlaceDetails();
        this.planRoute();
        this.navigateTo('preview');
      }
    });

    document.getElementById('btn-place-meetup')?.addEventListener('click', () => {
      if (this.selectedPlace) {
        this.generateMeetupLink(this.selectedPlace);
      }
    });

    document.getElementById('btn-place-indoor')?.addEventListener('click', () => {
      if (this.selectedPlace) {
        this.openIndoorModal(this.selectedPlace.id);
      }
    });

    document.getElementById('btn-close-place-sheet')?.addEventListener('click', () => {
      this.closePlaceDetails();
    });

    // Route Preview: Mode Selector Chips
    document.querySelectorAll('.route-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.route-mode-btn').forEach(b => {
          b.classList.remove('bg-blue-600', 'bg-emerald-600', 'text-white', 'shadow-md');
          b.classList.add('bg-slate-100', 'text-slate-700');
        });
        const mode = e.currentTarget.getAttribute('data-mode');
        this.selectedRouteMode = mode;
        if (mode === 'accessible') {
          e.currentTarget.classList.add('bg-emerald-600', 'text-white', 'shadow-md');
        } else {
          e.currentTarget.classList.add('bg-blue-600', 'text-white', 'shadow-md');
        }
        this.calculateAndPreviewRoute();
      });
    });

    // Route Preview: Start Live Navigation
    document.getElementById('btn-start-navigation')?.addEventListener('click', () => {
      this.startLiveNavigation();
    });

    // Turn-by-Turn: Voice Toggle
    document.getElementById('btn-toggle-voice')?.addEventListener('click', (e) => {
      this.voiceEnabled = !this.voiceEnabled;
      e.currentTarget.classList.toggle('text-blue-600', this.voiceEnabled);
      e.currentTarget.classList.toggle('text-slate-400', !this.voiceEnabled);
      this.speakInstruction(this.voiceEnabled ? "Voice guidance enabled" : "Voice muted");
    });

    // Turn-by-Turn: Simulation Play/Pause
    document.getElementById('btn-sim-play')?.addEventListener('click', () => {
      this.toggleSimWalk();
    });

    // Turn-by-Turn: Speed Multiplier
    document.getElementById('btn-sim-speed')?.addEventListener('click', (e) => {
      if (this.simSpeed === 1) this.simSpeed = 2;
      else if (this.simSpeed === 2) this.simSpeed = 4;
      else this.simSpeed = 1;
      e.currentTarget.textContent = `${this.simSpeed}x`;
    });

    // Turn-by-Turn: Reroute simulation
    document.getElementById('btn-sim-reroute')?.addEventListener('click', () => {
      this.showToast("Rerouting... recalculating via next accessible junction", "info");
      this.speakInstruction("Recalculating route to avoid delay.");
      setTimeout(() => {
        this.calculateAndPreviewRoute();
        this.startLiveNavigation();
      }, 900);
    });

    // Turn-by-Turn: Exit Navigation
    document.getElementById('btn-exit-navigation')?.addEventListener('click', () => {
      this.stopSimWalk();
      this.navigateTo('map');
    });

    // Emergency Quick Actions
    document.getElementById('btn-emg-health')?.addEventListener('click', () => {
      this.dispatchEmergency('medical');
    });
    document.getElementById('btn-emg-security')?.addEventListener('click', () => {
      this.dispatchEmergency('security');
    });
    document.getElementById('btn-emg-gate')?.addEventListener('click', () => {
      this.dispatchEmergency('gate');
    });
    document.getElementById('btn-emg-assembly')?.addEventListener('click', () => {
      this.dispatchEmergency('assembly');
    });

    // Offline & GPS Error Simulation Toggles
    document.getElementById('btn-toggle-offline')?.addEventListener('click', () => {
      this.isOffline = !this.isOffline;
      const banner = document.getElementById('offline-alert-banner');
      if (banner) banner.style.display = this.isOffline ? 'flex' : 'none';
      this.showToast(this.isOffline ? "Offline Campus Twin active (Local cache)" : "Online sync restored", "info");
    });

    document.getElementById('btn-toggle-gps')?.addEventListener('click', () => {
      this.isGpsWeak = !this.isGpsWeak;
      const banner = document.getElementById('gps-alert-banner');
      if (banner) banner.style.display = this.isGpsWeak ? 'flex' : 'none';
      this.showToast(this.isGpsWeak ? "GPS signal weak - using Wi-Fi beacons" : "GPS High-Accuracy restored", "warning");
    });

    // Route Select dropdowns
    document.getElementById('select-start-loc')?.addEventListener('change', (e) => {
      this.startLocationId = e.target.value;
      this.calculateAndPreviewRoute();
    });
    document.getElementById('select-dest-loc')?.addEventListener('change', (e) => {
      this.destinationId = e.target.value;
      this.calculateAndPreviewRoute();
    });
    document.getElementById('btn-swap-locations')?.addEventListener('click', () => {
      const temp = this.startLocationId;
      this.startLocationId = this.destinationId;
      this.destinationId = temp;
      this.populateRouteSelects();
      this.calculateAndPreviewRoute();
    });
  }

  // Screen Router
  navigateTo(screenName) {
    this.currentScreen = screenName;
    document.querySelectorAll('.screen-view').forEach(screen => {
      screen.classList.add('hidden');
    });

    const target = document.getElementById(`screen-${screenName}`);
    if (target) {
      target.classList.remove('hidden');
    }

    // Update active state in bottom nav and sidebar
    document.querySelectorAll('[data-nav-screen]').forEach(btn => {
      const s = btn.getAttribute('data-nav-screen');
      if (s === screenName) {
        btn.classList.add('text-blue-600', 'font-bold');
        btn.classList.remove('text-slate-500');
        btn.querySelector('.nav-icon-indicator')?.classList.remove('opacity-0');
      } else {
        btn.classList.remove('text-blue-600', 'font-bold');
        btn.classList.add('text-slate-500');
        btn.querySelector('.nav-icon-indicator')?.classList.add('opacity-0');
      }
    });

    if (screenName === 'map' || screenName === 'preview' || screenName === 'turn_by_turn') {
      setTimeout(() => this.mapRenderer.resetView(), 100);
    }

    if (screenName === 'preview') {
      this.populateRouteSelects();
      this.calculateAndPreviewRoute();
    }
  }

  // Populate Start & Destination dropdowns
  populateRouteSelects() {
    const startSelect = document.getElementById('select-start-loc');
    const destSelect = document.getElementById('select-dest-loc');
    if (!startSelect || !destSelect) return;

    let optionsHtml = '';
    for (const loc of this.data.locations) {
      optionsHtml += `<option value="${loc.id}">${loc.name} (${loc.shortCode || loc.category})</option>`;
    }

    startSelect.innerHTML = `<option value="my_location">📍 My Current Location (Main Gate)</option>` + optionsHtml;
    destSelect.innerHTML = optionsHtml;

    startSelect.value = this.startLocationId;
    destSelect.value = this.destinationId;
  }

  // Calculate route and update UI preview
  calculateAndPreviewRoute() {
    let startNode = 'n_gate1';
    if (this.startLocationId !== 'my_location') {
      const startLoc = this.data.locations.find(l => l.id === this.startLocationId);
      if (startLoc) startNode = startLoc.nodeId;
    }

    const destLoc = this.data.locations.find(l => l.id === this.destinationId);
    if (!destLoc) return;

    const result = this.router.findPath(startNode, destLoc.nodeId, this.selectedRouteMode);
    this.activeRoute = result;

    const statDist = document.getElementById('route-stat-distance');
    const statTime = document.getElementById('route-stat-time');
    const statCalories = document.getElementById('route-stat-calories');
    const statSteps = document.getElementById('route-stat-steps');
    const stepsContainer = document.getElementById('route-steps-list');

    if (result.error) {
      if (statDist) statDist.textContent = "--";
      if (statTime) statTime.textContent = "--";
      if (stepsContainer) {
        stepsContainer.innerHTML = `
          <div class="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
            <div class="font-bold mb-1">⚠️ ${result.error}</div>
            <p>Try switching to standard route or selecting an alternative entry gate.</p>
          </div>
        `;
      }
      this.mapRenderer.displayRoute(null);
      return;
    }

    if (statDist) statDist.textContent = `${result.totalDistance} m`;
    if (statTime) statTime.textContent = `${result.walkingTimeMin} min ${result.walkingTimeSec}s`;
    if (statCalories) statCalories.textContent = `${result.calories} kcal`;
    if (statSteps) statSteps.textContent = `${result.steps} steps`;

    // Render Steps List
    if (stepsContainer) {
      let stepsHtml = '';
      result.stepsDirections.forEach((step, idx) => {
        let icon = '🚶';
        if (step.turnType === 'right') icon = '↪️';
        else if (step.turnType === 'left') icon = '↩️';
        else if (step.turnType === 'arrive') icon = '🎯';

        stepsHtml += `
          <div class="flex items-start gap-3 p-3 rounded-2xl transition hover:bg-slate-50 border border-transparent hover:border-slate-200">
            <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              ${icon}
            </div>
            <div class="flex-1">
              <div class="text-sm font-semibold text-slate-800">${step.instruction}</div>
              <div class="text-xs text-slate-500 mt-0.5">${step.detail}</div>
            </div>
            ${step.distance > 0 ? `<div class="text-xs font-mono font-medium text-slate-400 shrink-0">${step.distance}m</div>` : ''}
          </div>
        `;
      });
      stepsContainer.innerHTML = stepsHtml;
    }

    // Render on Map
    this.mapRenderer.displayRoute(result);
  }

  // Turn-by-Turn Navigation Engine
  startLiveNavigation() {
    if (!this.activeRoute || this.activeRoute.error) {
      this.showToast("No active route calculated", "error");
      return;
    }

    this.navCurrentStep = 0;
    this.navSimProgress = 0;
    this.navigateTo('turn_by_turn');
    this.updateTurnHud();
    this.speakInstruction(`Starting navigation to ${this.data.locations.find(l => l.id === this.destinationId)?.name || 'destination'}. ${this.activeRoute.stepsDirections[0]?.instruction || ''}`);
  }

  updateTurnHud() {
    if (!this.activeRoute) return;
    const step = this.activeRoute.stepsDirections[this.navCurrentStep] || this.activeRoute.stepsDirections[0];
    const totalSteps = this.activeRoute.stepsDirections.length;

    const hudInstruction = document.getElementById('turn-hud-instruction');
    const hudDetail = document.getElementById('turn-hud-detail');
    const hudStepCounter = document.getElementById('turn-hud-step-count');
    const progressBar = document.getElementById('turn-progress-bar');

    if (hudInstruction) hudInstruction.textContent = step.instruction;
    if (hudDetail) hudDetail.textContent = step.detail;
    if (hudStepCounter) hudStepCounter.textContent = `Step ${this.navCurrentStep + 1} of ${totalSteps}`;
    if (progressBar) progressBar.style.width = `${((this.navCurrentStep + 1) / totalSteps) * 100}%`;

    // Update avatar on map
    const prog = this.navCurrentStep / Math.max(1, totalSteps - 1);
    this.mapRenderer.updateAvatarPosition(prog);
  }

  // Simulation controls
  toggleSimWalk() {
    if (this.isSimulating) {
      this.stopSimWalk();
    } else {
      this.startSimWalk();
    }
  }

  startSimWalk() {
    this.isSimulating = true;
    const playBtn = document.getElementById('btn-sim-play');
    if (playBtn) playBtn.innerHTML = `<span>⏸️</span> Pause`;

    const totalSteps = this.activeRoute.stepsDirections.length;
    this.simInterval = setInterval(() => {
      this.navSimProgress += 0.015 * this.simSpeed;

      if (this.navSimProgress >= 1) {
        this.navSimProgress = 1;
        this.navCurrentStep = totalSteps - 1;
        this.updateTurnHud();
        this.stopSimWalk();
        this.showArrivalCelebration();
        return;
      }

      this.mapRenderer.updateAvatarPosition(this.navSimProgress);

      const targetStep = Math.min(Math.floor(this.navSimProgress * totalSteps), totalSteps - 1);
      if (targetStep !== this.navCurrentStep) {
        this.navCurrentStep = targetStep;
        this.updateTurnHud();
        const step = this.activeRoute.stepsDirections[targetStep];
        this.speakInstruction(step.instruction);
      }
    }, 150);
  }

  stopSimWalk() {
    this.isSimulating = false;
    if (this.simInterval) clearInterval(this.simInterval);
    const playBtn = document.getElementById('btn-sim-play');
    if (playBtn) playBtn.innerHTML = `<span>▶️</span> Walk Simulation`;
  }

  showArrivalCelebration() {
    this.speakInstruction("You have arrived at your destination. Welcome to " + (this.data.locations.find(l => l.id === this.destinationId)?.name || "campus landmark"));
    this.showToast("🎉 Destination Reached! Navigation Complete.", "success");
    // Confetti or celebratory modal
    const dest = this.data.locations.find(l => l.id === this.destinationId);
    if (dest) {
      this.checkQuestCompletion(dest.id);
    }
  }

  // Voice Guidance (SpeechSynthesis)
  speakInstruction(text) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis unavailable:", e);
    }
  }

  // Search with Typo Tolerance (Levenshtein Distance + Substring matching)
  handleSearchInput(query) {
    this.filterSearchResults('all', query);
  }

  filterSearchResults(category = 'all', query = '') {
    const resultsContainer = document.getElementById('search-results-list');
    if (!resultsContainer) return;

    const q = query.trim().toLowerCase();
    const matches = [];

    for (const loc of this.data.locations) {
      // Category filter
      if (category !== 'all' && loc.category !== category) continue;

      let score = 0;
      if (!q) {
        matches.push({ loc, score: 1 });
        continue;
      }

      const name = loc.name.toLowerCase();
      const code = (loc.shortCode || '').toLowerCase();
      const desc = loc.description.toLowerCase();

      if (name.includes(q)) score += 100;
      else if (code.includes(q)) score += 90;
      else if (desc.includes(q)) score += 40;
      else {
        // Typo tolerance check
        const dist = this.levenshtein(q, name.slice(0, q.length + 2));
        if (dist <= 2) score += (10 - dist * 3);
      }

      if (score > 0) {
        matches.push({ loc, score });
      }
    }

    matches.sort((a, b) => b.score - a.score);

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="py-12 text-center text-slate-400">
          <div class="text-4xl mb-2">🔍</div>
          <p class="font-semibold text-slate-600">No destinations found for "${query}"</p>
          <p class="text-xs mt-1">Try searching by building name, code (e.g. "SAC", "AB-A"), or category.</p>
        </div>
      `;
      return;
    }

    let html = '';
    matches.forEach(({ loc }) => {
      html += `
        <div class="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-sm transition cursor-pointer" onclick="window.campusApp.openPlaceDetails('${loc.id}')">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
              ${loc.shortCode || '📍'}
            </div>
            <div>
              <div class="font-bold text-slate-800 text-sm">${loc.name}</div>
              <div class="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span class="capitalize text-blue-600 font-medium">${loc.category}</span>
                <span>•</span>
                <span>${loc.hours}</span>
                ${loc.accessible ? '<span class="text-emerald-600 font-semibold">♿ Ramp</span>' : ''}
              </div>
            </div>
          </div>
          <button class="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 font-semibold text-xs hover:bg-blue-600 hover:text-white transition" onclick="event.stopPropagation(); window.campusApp.planRouteTo('${loc.id}')">
            Navigate
          </button>
        </div>
      `;
    });

    resultsContainer.innerHTML = html;
  }

  // Levenshtein distance for typo tolerance
  levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  // Open Detailed Place Card
  openPlaceDetails(locId) {
    const loc = this.data.locations.find(l => l.id === locId);
    if (!loc) return;
    this.selectedPlace = loc;

    const sheet = document.getElementById('place-details-sheet');
    const nameEl = document.getElementById('place-title');
    const categoryEl = document.getElementById('place-category-badge');
    const hoursEl = document.getElementById('place-hours-text');
    const descEl = document.getElementById('place-description');
    const amenitiesEl = document.getElementById('place-amenities-tags');
    const indoorBtn = document.getElementById('btn-place-indoor');

    if (nameEl) nameEl.textContent = loc.name;
    if (categoryEl) categoryEl.textContent = loc.category.toUpperCase();
    if (hoursEl) hoursEl.textContent = loc.hours;
    if (descEl) descEl.textContent = loc.description;

    if (amenitiesEl) {
      amenitiesEl.innerHTML = (loc.amenities || []).map(a => `
        <span class="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium">${a}</span>
      `).join('');
    }

    if (indoorBtn) {
      indoorBtn.style.display = (loc.hasIndoorMap || this.data.indoorMaps[loc.id]) ? 'flex' : 'none';
    }

    if (sheet) {
      sheet.classList.remove('translate-y-full');
      sheet.classList.add('translate-y-0');
    }

    this.mapRenderer.focusLocation(locId);
  }

  closePlaceDetails() {
    const sheet = document.getElementById('place-details-sheet');
    if (sheet) {
      sheet.classList.add('translate-y-full');
      sheet.classList.remove('translate-y-0');
    }
  }

  planRouteTo(destId) {
    this.destinationId = destId;
    this.startLocationId = 'gate_1';
    this.navigateTo('preview');
  }

  // Emergency SOS Navigation
  dispatchEmergency(type) {
    const startNode = 'n_gate1';
    const nearest = this.router.findNearestEmergency(startNode, type);

    if (nearest && nearest.target && nearest.route) {
      this.selectedRouteMode = 'emergency';
      this.activeRoute = nearest.route;
      this.destinationId = nearest.target.id;
      this.showToast(`🚨 Emergency Route to ${nearest.target.name} (${nearest.route.totalDistance}m)`, "error");
      this.speakInstruction(`Alert: Directing you immediately to the nearest emergency station: ${nearest.target.name}. Follow illuminated red path.`);
      this.navigateTo('preview');
    }
  }

  // Timetable-Aware routing
  startTimetableRouting() {
    const nextClass = this.data.timetable[0];
    if (nextClass) {
      this.destinationId = nextClass.buildingId;
      this.startLocationId = 'gate_1';
      this.selectedRouteMode = 'fastest';
      this.showToast(`🧭 Route set for next class: ${nextClass.courseCode} (${nextClass.room})`, "info");
      this.navigateTo('preview');
    }
  }

  // Orientation Quest gamification
  renderQuestsProgress() {
    const list = document.getElementById('quests-list-container');
    if (!list) return;

    let html = '';
    let completedCount = 0;

    this.quests.forEach(q => {
      if (q.completed) completedCount++;
      html += `
        <div class="p-3 rounded-2xl border ${q.completed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-slate-200'} flex items-center justify-between transition">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${q.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}">
              ${q.completed ? '✓' : q.step}
            </div>
            <div>
              <div class="font-bold text-sm ${q.completed ? 'text-emerald-900 line-through' : 'text-slate-800'}">${q.title}</div>
              <div class="text-xs text-slate-500">${q.desc}</div>
            </div>
          </div>
          ${!q.completed ? `
            <button class="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition" onclick="window.campusApp.checkInQuest('${q.id}')">
              Check In
            </button>
          ` : `
            <span class="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg">Badge Earned</span>
          `}
        </div>
      `;
    });

    list.innerHTML = html;

    const progressEl = document.getElementById('quest-progress-percentage');
    if (progressEl) progressEl.textContent = `${Math.round((completedCount / this.quests.length) * 100)}%`;
  }

  checkInQuest(questId) {
    const q = this.quests.find(item => item.id === questId);
    if (q) {
      q.completed = true;
      localStorage.setItem('campus_quests', JSON.stringify(this.quests));
      this.renderQuestsProgress();
      this.showToast(`🎉 Quest Completed! You unlocked: "${q.badge}"`, "success");
      this.speakInstruction(`Congratulations! You earned the ${q.badge} badge!`);
    }
  }

  checkQuestCompletion(locId) {
    const q = this.quests.find(item => item.targetId === locId && !item.completed);
    if (q) {
      this.checkInQuest(q.id);
    }
  }

  // Indoor Multi-Level Floor Plan Modal
  openIndoorModal(buildingId) {
    const indoorData = this.data.indoorMaps[buildingId] || this.data.indoorMaps['ab_a'];
    const modal = document.getElementById('indoor-modal');
    const titleEl = document.getElementById('indoor-modal-title');
    const floorTabs = document.getElementById('indoor-floor-tabs');
    const roomsList = document.getElementById('indoor-rooms-list');

    if (!modal) return;
    if (titleEl) titleEl.textContent = indoorData.name;

    // Floor buttons
    let tabsHtml = '';
    indoorData.floors.forEach((fl, idx) => {
      tabsHtml += `
        <button class="px-3 py-1.5 rounded-xl font-bold text-xs ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'} indoor-floor-tab transition" onclick="window.campusApp.switchIndoorFloor('${buildingId}', ${fl.level})">
          ${fl.name}
        </button>
      `;
    });
    if (floorTabs) floorTabs.innerHTML = tabsHtml;

    this.renderIndoorFloorRooms(indoorData.floors[0]);
    modal.classList.remove('hidden');
  }

  switchIndoorFloor(buildingId, level) {
    const indoorData = this.data.indoorMaps[buildingId] || this.data.indoorMaps['ab_a'];
    const fl = indoorData.floors.find(f => f.level === level);
    if (!fl) return;

    document.querySelectorAll('.indoor-floor-tab').forEach(btn => {
      if (btn.textContent.includes(`Level ${level}`)) {
        btn.classList.add('bg-blue-600', 'text-white');
        btn.classList.remove('bg-slate-100', 'text-slate-700');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
      }
    });

    this.renderIndoorFloorRooms(fl);
  }

  renderIndoorFloorRooms(floor) {
    const list = document.getElementById('indoor-rooms-list');
    const canvas = document.getElementById('indoor-canvas-svg');
    if (!list) return;

    let html = '';
    let svgRooms = '';

    floor.rooms.forEach(rm => {
      let icon = '🚪';
      let fillCol = '#e0f2fe';
      let strokeCol = '#0284c7';

      if (rm.type === 'elevator') { icon = '🛗'; fillCol = '#ecfdf5'; strokeCol = '#10b981'; }
      else if (rm.type === 'restroom') { icon = '🚻'; fillCol = '#fef3c7'; strokeCol = '#d97706'; }
      else if (rm.type === 'exit') { icon = '🚨'; fillCol = '#fee2e2'; strokeCol = '#ef4444'; }
      else if (rm.type === 'lab') { icon = '🔬'; fillCol = '#f0fdf4'; strokeCol = '#15803d'; }

      html += `
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div class="flex items-center gap-2">
            <span>${icon}</span>
            <span class="font-semibold text-slate-800">${rm.name}</span>
          </div>
          ${rm.capacity ? `<span class="text-slate-400">Cap: ${rm.capacity}</span>` : ''}
        </div>
      `;

      svgRooms += `
        <rect x="${rm.x}" y="${rm.y}" width="${rm.w}" height="${rm.h}" rx="6" fill="${fillCol}" stroke="${strokeCol}" stroke-width="1.5"/>
        <text x="${rm.x + rm.w/2}" y="${rm.y + rm.h/2 + 4}" text-anchor="middle" font-size="9" font-weight="700" fill="#0f172a">${rm.name.split(' - ')[0]}</text>
      `;
    });

    list.innerHTML = html;
    if (canvas) {
      canvas.innerHTML = `
        <rect width="450" height="220" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="12"/>
        <!-- Central corridor -->
        <rect x="30" y="125" width="390" height="15" fill="#e2e8f0" rx="4"/>
        <text x="225" y="136" text-anchor="middle" font-size="9" fill="#94a3b8" font-weight="600">CENTRAL ACCESSIBLE CORRIDOR (BRAILLE GUIDES)</text>
        ${svgRooms}
      `;
    }
  }

  closeIndoorModal() {
    document.getElementById('indoor-modal')?.classList.add('hidden');
  }

  // Group Meetup Pin generator
  generateMeetupLink(place) {
    const code = `${place.shortCode || 'CMP'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const url = `https://campuscompass.nist.edu/meet?pin=${code}&loc=${place.id}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast(`📋 Meetup Pin Copied: ${code}`, "success");
      });
    } else {
      this.showToast(`📍 Meetup Pin: ${code}`, "info");
    }
  }

  // Timetable Card Rendering
  renderTimetableCard() {
    const container = document.getElementById('timetable-card-slot');
    if (!container) return;
    const nextCls = this.data.timetable[0];
    container.innerHTML = `
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div class="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
        <div class="flex items-center justify-between text-xs text-blue-100 font-semibold mb-2">
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> ${nextCls.status}</span>
          <span>${nextCls.startTime}</span>
        </div>
        <h3 class="text-lg font-bold tracking-tight">${nextCls.name}</h3>
        <p class="text-xs text-blue-100 mt-1">${nextCls.room} • ${nextCls.instructor}</p>
        <div class="mt-4 flex items-center gap-3">
          <button id="btn-take-me-to-class" class="px-4 py-2 rounded-xl bg-white text-blue-700 font-bold text-xs shadow hover:bg-blue-50 transition active:scale-95 flex items-center gap-1.5" onclick="window.campusApp.startTimetableRouting()">
            <span>🧭</span> Take Me to Class
          </button>
          <span class="text-xs text-blue-200">5 mins walking</span>
        </div>
      </div>
    `;
  }

  // Recent Searches
  renderRecentSearches() {
    const container = document.getElementById('recent-searches-chips');
    if (!container) return;
    container.innerHTML = this.recentSearches.map(term => `
      <button class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition" onclick="document.getElementById('search-input-field').value = '${term}'; window.campusApp.handleSearchInput('${term}');">
        ${term}
      </button>
    `).join('');
  }

  // Admin Controls (Roadblocks & Congestion)
  renderAdminControls() {
    const list = document.getElementById('admin-roadblocks-list');
    if (!list) return;

    const sampleRoads = [
      { from: 'n_oat', to: 'j_central_plaza', name: 'OAT Amphitheatre Steps' },
      { from: 'j_oat_east', to: 'n_cafe', name: 'Central Cafe Patio Walkway' },
      { from: 'n_ab_a', to: 'j_west_north', name: 'Engineering to FabLab Walkway' }
    ];

    list.innerHTML = sampleRoads.map(r => {
      const isBlocked = this.router.isRoadBlocked(r.from, r.to);
      return `
        <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <div class="font-bold text-slate-800">${r.name}</div>
            <div class="text-slate-500 text-[11px]">${r.from} ↔ ${r.to}</div>
          </div>
          <button class="px-3 py-1.5 rounded-xl font-bold transition ${isBlocked ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'}" onclick="window.campusApp.toggleAdminRoadblock('${r.from}', '${r.to}', this)">
            ${isBlocked ? '⛔ Closed' : '🟢 Open'}
          </button>
        </div>
      `;
    }).join('');
  }

  toggleAdminRoadblock(from, to, btn) {
    const isNowClosed = this.router.toggleRoadblock(from, to);
    btn.textContent = isNowClosed ? '⛔ Closed' : '🟢 Open';
    btn.classList.toggle('bg-rose-600', isNowClosed);
    btn.classList.toggle('text-white', isNowClosed);
    btn.classList.toggle('bg-slate-200', !isNowClosed);
    btn.classList.toggle('text-slate-700', !isNowClosed);

    this.mapRenderer.displayRoadblock(from, to, isNowClosed);
    this.showToast(isNowClosed ? `Path closed. Rerouting will bypass this zone.` : `Path reopened.`, isNowClosed ? "warning" : "success");

    // Recalculate preview route if currently displayed
    if (this.activeRoute) {
      this.calculateAndPreviewRoute();
    }
  }

  // Theme Switching
  cycleTheme() {
    if (this.activeTheme === 'light') {
      this.activeTheme = 'dark';
      document.body.classList.add('dark-mode');
      document.body.classList.remove('high-contrast');
      this.showToast("Dark Mode activated", "info");
    } else if (this.activeTheme === 'dark') {
      this.activeTheme = 'high_contrast';
      document.body.classList.remove('dark-mode');
      document.body.classList.add('high-contrast');
      this.showToast("High-Contrast Mode (WCAG AAA) activated", "info");
    } else {
      this.activeTheme = 'light';
      document.body.classList.remove('dark-mode', 'high-contrast');
      this.showToast("Light Mode activated", "info");
    }
  }

  // Device Frame Preview Switcher
  toggleDeviceFrame() {
    const shell = document.getElementById('app-shell-container');
    const toggleBtn = document.getElementById('btn-device-frame-toggle');
    if (!shell) return;

    this.isMobileFrame = !this.isMobileFrame;
    if (this.isMobileFrame) {
      shell.classList.add('device-frame-wrapper');
      toggleBtn?.classList.add('bg-blue-600', 'text-white');
      this.showToast("Mobile Device Simulator Frame Enabled", "info");
    } else {
      shell.classList.remove('device-frame-wrapper');
      toggleBtn?.classList.remove('bg-blue-600', 'text-white');
      this.showToast("Desktop Full-Window View Enabled", "info");
    }
  }

  // UI Toast notification
  showToast(message, type = 'info') {
    const toast = document.getElementById('global-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold z-50 transition-all duration-300 pointer-events-none `;
    
    if (type === 'error') toast.className += ' bg-rose-600 text-white';
    else if (type === 'warning') toast.className += ' bg-amber-500 text-slate-900';
    else if (type === 'success') toast.className += ' bg-emerald-600 text-white';
    else toast.className += ' bg-slate-900 text-white';

    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 20px)';
    }, 3200);
  }
}

// Global bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window.campusApp = new CampusCompassApp();
});

