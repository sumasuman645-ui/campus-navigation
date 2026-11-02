/**
 * Campus Compass 3D - Three.js WebGL Campus Digital Twin Engine
 * Renders realistic architectural 3D buildings, road network, foliage,
 * wind turbines, day/night lighting, and ground-aligned road navigation routes.
 */

class Campus3DScene {
  constructor(canvasContainerId, campusData, graphData, onBuildingClick) {
    this.container = document.getElementById(canvasContainerId);
    this.data = campusData;
    this.graph = graphData;
    this.onBuildingClick = onBuildingClick;

    // Three.js Core Objects
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Scene Collections
    this.buildingMeshes = new Map(); // locId -> THREE.Group
    this.buildingOutlines = new Map(); // locId -> THREE.LineSegments
    this.floatingLabels = new Map(); // locId -> THREE.Sprite
    this.interiorGroups = new Map(); // locId -> THREE.Group
    this.roofMeshes = new Map(); // locId -> Array of roof meshes
    this.windTurbines = [];
    this.animatedObjects = [];

    // State
    this.isNight = false;
    this.showLabels = true;
    this.transparentRoofs = false;
    this.selectedBuildingId = null;
    this.activeRouteMesh = null;
    this.routeMarkers = [];
    this.avatarMesh = null;
    this.isOrbiting = false;
    this.isTouring = false;
    this.tourStopIndex = 0;
    this.tourTimeout = null;
    this.animatingCamera = false;

    // Initial Camera Views
    this.defaultCamPos = new THREE.Vector3(0, 155, 195);
    this.defaultCamTarget = new THREE.Vector3(0, 0, 10);

    this.init();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupLights();
    this.buildTerrain();
    this.buildRoadNetwork();
    this.buildCampusProps(); // Trees, pond, runway, parking, wind turbines, gates
    this.buildBuildings();
    this.buildAvatarMarker();
    this.setupEventListeners();
    this.animate();
  }

  setupRenderer() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x93C5FD); // Bright clear collegiate sky
    this.scene.fog = new THREE.FogExp2(0x93C5FD, 0.0022);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true, // For snapshot capture!
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.appendChild(this.renderer.domElement);
  }

  setupCamera() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    this.camera.position.copy(this.defaultCamPos);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.copy(this.defaultCamTarget);
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera going below ground
    this.controls.minDistance = 15;
    this.controls.maxDistance = 450;
    this.controls.update();
  }

  setupLights() {
    // Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(this.ambientLight);

    // Main Sunlight (Directional with Shadows)
    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.1);
    this.sunLight.position.set(120, 180, 100);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 400;
    const d = 140;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Secondary fill light
    this.fillLight = new THREE.DirectionalLight(0xbae6fd, 0.35);
    this.fillLight.position.set(-100, 100, -100);
    this.scene.add(this.fillLight);
  }

  // 1. Terrain, Lawns, and Courts
  buildTerrain() {
    // Master Ground Base (Lush Green Grass)
    const groundGeo = new THREE.PlaneGeometry(320, 260, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x2e7d32, // Realistic collegiate grass green
      roughness: 0.85,
      metalness: 0.05
    });
    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);

    // Campus Perimeter Curb / Roadway Border
    const borderGeo = new THREE.BoxGeometry(265, 0.6, 215);
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 });
    const borderMesh = new THREE.Mesh(borderGeo, borderMat);
    borderMesh.position.set(0, 0.1, 0);
    borderMesh.receiveShadow = true;
    this.scene.add(borderMesh);

    // Central Green Quadrangle Lawn (In front of Chapel & OAT)
    // Coords in 2D: x: 605..810, y: 215..460
    const lawnCenter = this.data.to3D(707.5, 337.5, 0.25);
    const lawnWidth = (810 - 605) * this.data.scale;
    const lawnDepth = (460 - 215) * this.data.scale;

    const lawnGeo = new THREE.BoxGeometry(lawnWidth, 0.4, lawnDepth);
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0x4caf50, // Vibrant lawn green
      roughness: 0.6
    });
    const lawnMesh = new THREE.Mesh(lawnGeo, lawnMat);
    lawnMesh.position.set(lawnCenter.x, 0.2, lawnCenter.z);
    lawnMesh.receiveShadow = true;
    this.scene.add(lawnMesh);

    // Open Sand/Clay Sports Ground (Below Admin & COE)
    // Coords in 2D: x: 440..580, y: 240..370
    const courtCenter = this.data.to3D(500, 305, 0.25);
    const courtWidth = (580 - 420) * this.data.scale;
    const courtDepth = (370 - 240) * this.data.scale;

    const courtGeo = new THREE.BoxGeometry(courtWidth, 0.35, courtDepth);
    const courtMat = new THREE.MeshStandardMaterial({
      color: 0xe0a96d, // Warm sand / clay sports court
      roughness: 0.9
    });
    const courtMesh = new THREE.Mesh(courtGeo, courtMat);
    courtMesh.position.set(courtCenter.x, 0.18, courtCenter.z);
    courtMesh.receiveShadow = true;
    this.scene.add(courtMesh);
  }

  // 2. Realistic 3D Road Network (Strictly from graph nodes & edges)
  buildRoadNetwork() {
    const roadGroup = new THREE.Group();
    const asphaltMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Dark slate asphalt
      roughness: 0.85,
      metalness: 0.1
    });

    const curbMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1, // Concrete sidewalk curb
      roughness: 0.9
    });

    const roadWidth = 2.8;
    const curbWidth = 3.6;

    // Draw all road segments
    for (const edge of this.graph.edges) {
      const u = this.graph.nodes[edge.u];
      const v = this.graph.nodes[edge.v];
      if (!u || !v) continue;

      const p1 = this.data.to3D(u.x, u.y, 0.25);
      const p2 = this.data.to3D(v.x, v.y, 0.25);

      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const len = Math.hypot(dx, dz);
      if (len < 0.1) continue;

      const midX = (p1.x + p2.x) / 2;
      const midZ = (p1.z + p2.z) / 2;
      const angle = Math.atan2(dz, dx);

      // Concrete Curb Underlay
      const curbGeo = new THREE.BoxGeometry(len, 0.2, curbWidth);
      const curb = new THREE.Mesh(curbGeo, curbMat);
      curb.position.set(midX, 0.1, midZ);
      curb.rotation.y = -angle;
      curb.receiveShadow = true;
      roadGroup.add(curb);

      // Asphalt Road Surface
      const roadGeo = new THREE.BoxGeometry(len, 0.22, roadWidth);
      const road = new THREE.Mesh(roadGeo, asphaltMat);
      road.position.set(midX, 0.12, midZ);
      road.rotation.y = -angle;
      road.receiveShadow = true;
      roadGroup.add(road);
    }

    // Pedestrian Walkways through Central Quadrangle Lawns (Cross Walkways)
    const pWalk1 = this.data.to3D(707.5, 215, 0.3);
    const pWalk2 = this.data.to3D(707.5, 460, 0.3);
    const crossGeo = new THREE.BoxGeometry(1.6, 0.24, Math.abs(pWalk2.z - pWalk1.z));
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
    const crossWalk = new THREE.Mesh(crossGeo, pathMat);
    crossWalk.position.set(pWalk1.x, 0.22, (pWalk1.z + pWalk2.z) / 2);
    crossWalk.receiveShadow = true;
    roadGroup.add(crossWalk);

    this.scene.add(roadGroup);
  }

  // 3. Realistic Props: Fish Pond, Airfield Runway, Parking Canopies, Trees, Turbines, Gates
  buildCampusProps() {
    const propsGroup = new THREE.Group();

    // A. Circular Ornamental Fish Pond & Fountain (North Center)
    const pondCenter = this.data.to3D(490, 115, 0);
    // Outer Stone Basin
    const basinGeo = new THREE.CylinderGeometry(7, 7.5, 1.2, 32);
    const basinMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
    const basin = new THREE.Mesh(basinGeo, basinMat);
    basin.position.set(pondCenter.x, 0.6, pondCenter.z);
    basin.castShadow = true;
    propsGroup.add(basin);

    // Blue Water Surface
    const waterGeo = new THREE.CylinderGeometry(6.6, 6.6, 0.2, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant aquatic blue
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.set(pondCenter.x, 1.1, pondCenter.z);
    propsGroup.add(water);

    // Center Fountain Spout & White Flagpole
    const spoutGeo = new THREE.CylinderGeometry(0.5, 0.8, 2.5, 16);
    const spoutMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const spout = new THREE.Mesh(spoutGeo, spoutMat);
    spout.position.set(pondCenter.x, 1.8, pondCenter.z);
    propsGroup.add(spout);

    const flagPoleGeo = new THREE.CylinderGeometry(0.12, 0.12, 16, 8);
    const flagPoleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8 });
    const flagPole = new THREE.Mesh(flagPoleGeo, flagPoleMat);
    flagPole.position.set(pondCenter.x + 8, 8, pondCenter.z);
    propsGroup.add(flagPole);

    // White Flag Mesh
    const flagGeo = new THREE.PlaneGeometry(3.5, 2.2);
    const flagMat = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(pondCenter.x + 9.8, 14.5, pondCenter.z);
    propsGroup.add(flag);

    // B. Model Airfield Runway & Miniature Airplanes (In front of Julianna)
    const rwyCenter = this.data.to3D(190, 155, 0);
    const rwyGeo = new THREE.BoxGeometry(32, 0.26, 12);
    const rwyMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });
    const runway = new THREE.Mesh(rwyGeo, rwyMat);
    runway.position.set(rwyCenter.x, 0.13, rwyCenter.z);
    runway.receiveShadow = true;
    propsGroup.add(runway);

    // Runway Dashed Markings
    for (let rx = -12; rx <= 12; rx += 5) {
      const markGeo = new THREE.PlaneGeometry(2.5, 0.4);
      const markMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mark = new THREE.Mesh(markGeo, markMat);
      mark.rotation.x = -Math.PI / 2;
      mark.position.set(rwyCenter.x + rx, 0.28, rwyCenter.z);
      propsGroup.add(mark);
    }

    // Miniature Aircraft on Apron
    this.createMiniPlane(propsGroup, rwyCenter.x - 8, 0.5, rwyCenter.z - 3, 0.3);
    this.createMiniPlane(propsGroup, rwyCenter.x + 6, 0.5, rwyCenter.z + 2, -0.4);

    // C. Parking Canopies (Blue Corrugated Sheds with Parked Cars)
    this.createParkingCanopy(propsGroup, 610, 105, 30, 10);
    this.createParkingCanopy(propsGroup, 780, 105, 24, 10);

    // D. Campus Gates (Gate 1 to Gate 5)
    this.createGateStructure(propsGroup, 380, 65, "GATE 1");
    this.createGateStructure(propsGroup, 670, 65, "GATE 2");
    this.createGateStructure(propsGroup, 885, 90, "GATE 3");
    this.createGateStructure(propsGroup, 955, 730, "GATE 4");
    this.createGateStructure(propsGroup, 970, 880, "GATE 5");

    // E. Realistic 3D Trees (Along Boulevards & Lawns)
    this.populateTrees(propsGroup);

    // F. Distant 3D Wind Turbines (Visible in Reference Image 1)
    this.createWindTurbine(propsGroup, -135, 0, -110);
    this.createWindTurbine(propsGroup, 125, 0, -120);
    this.createWindTurbine(propsGroup, 138, 0, -85);

    this.scene.add(propsGroup);
  }

  createMiniPlane(parent, x, y, z, rotation) {
    const plane = new THREE.Group();
    // Fuselage
    const fuseGeo = new THREE.CylinderGeometry(0.4, 0.2, 3.2, 8);
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const fuse = new THREE.Mesh(fuseGeo, whiteMat);
    fuse.rotation.z = Math.PI / 2;
    plane.add(fuse);

    // Wings
    const wingGeo = new THREE.BoxGeometry(4.2, 0.08, 0.9);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0.2, 0.1, 0);
    plane.add(wings);

    // Tail Fin
    const tailGeo = new THREE.BoxGeometry(0.1, 0.8, 0.6);
    const tail = new THREE.Mesh(tailGeo, wingMat);
    tail.position.set(-1.3, 0.5, 0);
    plane.add(tail);

    plane.position.set(x, y, z);
    plane.rotation.y = rotation;
    parent.add(plane);
  }

  createParkingCanopy(parent, mapX, mapY, width3D, depth3D) {
    const pos = this.data.to3D(mapX, mapY, 0);
    const canopy = new THREE.Group();

    // 4 Steel Support Posts
    const postMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
    const h = 4.2;
    const postGeo = new THREE.CylinderGeometry(0.15, 0.15, h, 8);

    const halfW = width3D / 2 - 0.5;
    const halfD = depth3D / 2 - 0.5;
    [[-halfW, -halfD], [halfW, -halfD], [-halfW, halfD], [halfW, halfD]].forEach(([px, pz]) => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(px, h / 2, pz);
      canopy.add(post);
    });

    // Blue Sloped Metal Roof
    const roofGeo = new THREE.BoxGeometry(width3D, 0.3, depth3D);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.6, roughness: 0.4 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, h + 0.15, 0);
    roof.castShadow = true;
    canopy.add(roof);

    // Miniature Parked Cars
    const carMat1 = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    const carMat2 = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const carMat3 = new THREE.MeshStandardMaterial({ color: 0x1e293b });

    for (let cx = -halfW + 2; cx < halfW - 2; cx += 3.2) {
      const car = new THREE.Group();
      const carBodyGeo = new THREE.BoxGeometry(2.4, 0.9, 1.4);
      const mat = (Math.abs(cx) % 2 === 0) ? carMat1 : (Math.abs(cx) % 3 === 0 ? carMat2 : carMat3);
      const carBody = new THREE.Mesh(carBodyGeo, mat);
      carBody.position.set(0, 0.5, 0);
      car.add(carBody);

      car.position.set(cx, 0, 0);
      canopy.add(car);
    }

    canopy.position.set(pos.x, 0, pos.z);
    parent.add(canopy);
  }

  createGateStructure(parent, mapX, mapY, labelText) {
    const pos = this.data.to3D(mapX, mapY, 0);
    const gate = new THREE.Group();

    // Twin Brick Gateposts
    const postGeo = new THREE.BoxGeometry(1.6, 6.5, 1.6);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });

    const post1 = new THREE.Mesh(postGeo, postMat);
    post1.position.set(-3.5, 3.25, 0);
    gate.add(post1);

    const post2 = new THREE.Mesh(postGeo, postMat);
    post2.position.set(3.5, 3.25, 0);
    gate.add(post2);

    // Overhead Sign Arch
    const archGeo = new THREE.BoxGeometry(9, 1.4, 1.2);
    const archMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 6.5, 0);
    gate.add(arch);

    // Security Cabin
    const cabinGeo = new THREE.BoxGeometry(2.5, 3.2, 2.5);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(5.8, 1.6, 0);
    gate.add(cabin);

    // Red/White Boom Barrier
    const boomGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.5, 8);
    const boomMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const boom = new THREE.Mesh(boomGeo, boomMat);
    boom.rotation.z = Math.PI / 2;
    boom.position.set(0, 1.2, 0);
    gate.add(boom);

    gate.position.set(pos.x, 0, pos.z);
    parent.add(gate);
  }

  populateTrees(parent) {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });
    const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    const foliageMat3 = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.7 });

    const trunkGeo = new THREE.CylinderGeometry(0.35, 0.45, 3.5, 8);
    const crownGeo1 = new THREE.SphereGeometry(2.5, 8, 8);
    const crownGeo2 = new THREE.ConeGeometry(2.6, 5, 8);

    // Strategic tree placements along boulevards, lawn borders, and perimeter
    const treeCoords = [
      // Along North Gate 1 Boulevard
      { x: 340, y: 110 }, { x: 340, y: 140 }, { x: 420, y: 110 }, { x: 440, y: 140 },
      // Surrounding Central Pond
      { x: 450, y: 80 }, { x: 530, y: 80 }, { x: 450, y: 135 }, { x: 530, y: 135 },
      // Surrounding Chapel & Lawns Quadrangle
      { x: 615, y: 230 }, { x: 615, y: 280 }, { x: 615, y: 340 }, { x: 615, y: 400 }, { x: 615, y: 450 },
      { x: 800, y: 230 }, { x: 800, y: 280 }, { x: 800, y: 340 }, { x: 800, y: 400 }, { x: 800, y: 450 },
      // Near SAC & West Boulevard
      { x: 90, y: 240 }, { x: 90, y: 380 }, { x: 300, y: 240 }, { x: 300, y: 380 },
      // South Perimeter
      { x: 300, y: 650 }, { x: 300, y: 720 }, { x: 600, y: 650 }, { x: 600, y: 720 },
      // East perimeter
      { x: 970, y: 250 }, { x: 970, y: 350 }, { x: 970, y: 450 }, { x: 970, y: 550 }
    ];

    treeCoords.forEach((tc, idx) => {
      const pos = this.data.to3D(tc.x, tc.y, 0);
      const tree = new THREE.Group();

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.75;
      trunk.castShadow = true;
      tree.add(trunk);

      const mat = idx % 3 === 0 ? foliageMat1 : (idx % 3 === 1 ? foliageMat2 : foliageMat3);
      const isCone = idx % 2 === 0;
      const crown = new THREE.Mesh(isCone ? crownGeo2 : crownGeo1, mat);
      crown.position.y = isCone ? 4.8 : 4.2;
      crown.castShadow = true;
      tree.add(crown);

      tree.position.set(pos.x, 0, pos.z);
      const scaleRnd = 0.85 + Math.random() * 0.35;
      tree.scale.set(scaleRnd, scaleRnd, scaleRnd);
      parent.add(tree);
    });
  }

  createWindTurbine(parent, x, y, z) {
    const turbine = new THREE.Group();
    // Tower
    const towerGeo = new THREE.CylinderGeometry(0.7, 1.4, 45, 12);
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const tower = new THREE.Mesh(towerGeo, whiteMat);
    tower.position.y = 22.5;
    tower.castShadow = true;
    turbine.add(tower);

    // Nacelle
    const nacelleGeo = new THREE.BoxGeometry(2.2, 2.2, 5.5);
    const nacelle = new THREE.Mesh(nacelleGeo, whiteMat);
    nacelle.position.set(0, 45, 0);
    turbine.add(nacelle);

    // Rotating Rotor Hub & 3 Blades
    const rotor = new THREE.Group();
    rotor.position.set(0, 45, 2.8);

    const hubGeo = new THREE.SphereGeometry(1.2, 12, 12);
    const hub = new THREE.Mesh(hubGeo, whiteMat);
    rotor.add(hub);

    // 3 Aerodynamic Blades
    for (let b = 0; b < 3; b++) {
      const blade = new THREE.Group();
      blade.rotation.z = (b * Math.PI * 2) / 3;

      const bladeGeo = new THREE.BoxGeometry(0.7, 18, 0.2);
      const bladeMesh = new THREE.Mesh(bladeGeo, whiteMat);
      bladeMesh.position.y = 9;
      bladeMesh.castShadow = true;
      blade.add(bladeMesh);

      rotor.add(blade);
    }

    turbine.add(rotor);
    turbine.position.set(x, y, z);
    parent.add(turbine);

    // Register rotor for continuous rotation in animation loop
    this.windTurbines.push(rotor);
  }

  // 4. Detailed 3D Buildings (Matching Reference Image 2!)
  buildBuildings() {
    for (const loc of this.data.locations) {
      const buildingGroup = new THREE.Group();
      buildingGroup.userData = { locationId: loc.id, locationData: loc };

      // Map coordinates to 3D space
      const pos3D = this.data.to3D(loc.coords.x, loc.coords.y, 0);
      const w3D = loc.shape.width * this.data.scale;
      const d3D = loc.shape.height * this.data.scale;
      const h3D = loc.shape.height3d || 14;

      // Base Building Walls
      const wallMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(loc.color || 0xfdf6e2),
        roughness: 0.75,
        metalness: 0.1
      });

      const wallGeo = new THREE.BoxGeometry(w3D, h3D, d3D);
      const walls = new THREE.Mesh(wallGeo, wallMat);
      walls.position.y = h3D / 2;
      walls.castShadow = true;
      walls.receiveShadow = true;
      buildingGroup.add(walls);

      // Window Bands / Grids on exterior walls
      this.addWindowDetails(buildingGroup, w3D, h3D, d3D);

      // Distinctive Architectural Roof
      const roofMeshes = this.buildCustomRoof(buildingGroup, loc, w3D, h3D, d3D);
      this.roofMeshes.set(loc.id, roofMeshes);

      // Interior Cutaway Floor Layout (for Transparent Roof mode)
      const interiorGroup = this.buildInteriorCutaway(loc, w3D, h3D, d3D);
      interiorGroup.visible = false;
      buildingGroup.add(interiorGroup);
      this.interiorGroups.set(loc.id, interiorGroup);

      // Selection Outline (Wireframe Bounding Box - Reference Image 1)
      const outlineGeo = new THREE.BoxGeometry(w3D + 0.8, h3D + 2, d3D + 0.8);
      const edges = new THREE.EdgesGeometry(outlineGeo);
      const outlineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
      const outline = new THREE.LineSegments(edges, outlineMat);
      outline.position.y = (h3D + 2) / 2;
      outline.visible = false;
      buildingGroup.add(outline);
      this.buildingOutlines.set(loc.id, outline);

      // Floating 3D Label Badge / Pin
      const sprite = this.createBuildingLabel(loc);
      sprite.position.set(0, h3D + 5, 0);
      buildingGroup.add(sprite);
      this.floatingLabels.set(loc.id, sprite);

      buildingGroup.position.set(pos3D.x, 0, pos3D.z);
      this.scene.add(buildingGroup);
      this.buildingMeshes.set(loc.id, buildingGroup);
    }
  }

  addWindowDetails(group, w, h, d) {
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Reflective dark blue glass
      roughness: 0.2,
      metalness: 0.8
    });

    const floors = Math.max(2, Math.floor(h / 4));
    for (let f = 1; f < floors; f++) {
      const y = (f * (h / floors));
      // Front window strip
      const winFront = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 1.1, 0.1), glassMat);
      winFront.position.set(0, y, d / 2 + 0.05);
      group.add(winFront);

      // Back window strip
      const winBack = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 1.1, 0.1), glassMat);
      winBack.position.set(0, y, -d / 2 - 0.05);
      group.add(winBack);
    }
  }

  buildCustomRoof(parent, loc, w, h, d) {
    const roofs = [];
    const roofColor = new THREE.Color(loc.roofColor || 0x475569);

    if (loc.roofType === "sloped_cyan" || loc.id === "loc-sac") {
      // SAC: Iconic curved sloped cyan roof
      const curveGeo = new THREE.CylinderGeometry(w / 1.7, w / 1.7, d, 24, 1, false, 0, Math.PI);
      const cyanMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7, // Vibrant cyan blue
        roughness: 0.4,
        metalness: 0.2
      });
      const cyanRoof = new THREE.Mesh(curveGeo, cyanMat);
      cyanRoof.rotation.z = Math.PI / 2;
      cyanRoof.rotation.y = Math.PI / 2;
      cyanRoof.position.set(0, h + 0.5, 0);
      cyanRoof.castShadow = true;
      parent.add(cyanRoof);
      roofs.push(cyanRoof);
    } else if (loc.roofType === "hipped_red" || loc.id === "loc-oat-north" || loc.id === "loc-muthraj") {
      // OAT: Distinctive terracotta red hipped roof
      const pyramidGeo = new THREE.ConeGeometry(Math.hypot(w, d) / 1.8, 3.8, 4);
      const redMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626, // Vivid red roof
        roughness: 0.6
      });
      const redRoof = new THREE.Mesh(pyramidGeo, redMat);
      redRoof.rotation.y = Math.PI / 4;
      redRoof.position.set(0, h + 1.9, 0);
      redRoof.castShadow = true;
      parent.add(redRoof);
      roofs.push(redRoof);
    } else if (loc.roofType === "circular_dome_blue" || loc.id === "loc-intel-joe") {
      // Intel JOE: Circular Glass cylinder and Blue Dome Rotunda
      const domeGeo = new THREE.SphereGeometry(w / 1.8, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const blueMat = new THREE.MeshStandardMaterial({
        color: 0x1d4ed8, // Deep blue rotunda dome
        roughness: 0.3,
        metalness: 0.3
      });
      const dome = new THREE.Mesh(domeGeo, blueMat);
      dome.position.set(0, h, 0);
      dome.castShadow = true;
      parent.add(dome);
      roofs.push(dome);

      // White cornice ring
      const ringGeo = new THREE.TorusGeometry(w / 1.75, 0.4, 8, 32);
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const ring = new THREE.Mesh(ringGeo, whiteMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, h, 0);
      parent.add(ring);
      roofs.push(ring);
    } else if (loc.roofType === "chapel_pitched_cross" || loc.id === "loc-lawns-church") {
      // Campus Chapel: Steep pitched gable roof with white peak cross
      const prismGeo = new THREE.ConeGeometry(w / 1.3, 4.5, 4);
      const chapelRoofMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 });
      const chapelRoof = new THREE.Mesh(prismGeo, chapelRoofMat);
      chapelRoof.rotation.y = Math.PI / 4;
      chapelRoof.position.set(0, h + 2.25, 0);
      chapelRoof.castShadow = true;
      parent.add(chapelRoof);
      roofs.push(chapelRoof);

      // White Cross at Peak
      const crossGroup = new THREE.Group();
      const crossMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.4 });
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 0.2), crossMat);
      crossV.position.y = 1.2;
      crossGroup.add(crossV);
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 0.2), crossMat);
      crossH.position.y = 1.6;
      crossGroup.add(crossH);

      crossGroup.position.set(0, h + 4.5, d / 2 - 0.5);
      parent.add(crossGroup);
      roofs.push(crossGroup);
    } else {
      // Standard Flat Roof with Parapet & AC Chillers
      const roofSlabGeo = new THREE.BoxGeometry(w + 0.4, 0.8, d + 0.4);
      const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.8 });
      const slab = new THREE.Mesh(roofSlabGeo, roofMat);
      slab.position.set(0, h + 0.4, 0);
      slab.castShadow = true;
      parent.add(slab);
      roofs.push(slab);

      // Rooftop AC chiller units
      const chillerGeo = new THREE.BoxGeometry(2.5, 1.2, 2);
      const chillerMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7 });
      const chiller1 = new THREE.Mesh(chillerGeo, chillerMat);
      chiller1.position.set(-w / 4, h + 1.2, 0);
      parent.add(chiller1);
      roofs.push(chiller1);

      // Front Colonnade Pillars for Admin & COE
      if (loc.id === "loc-admin") {
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
        const pillarGeo = new THREE.CylinderGeometry(0.35, 0.4, h, 8);
        for (let px = -w / 2 + 3; px <= w / 2 - 3; px += 4.5) {
          const pillar = new THREE.Mesh(pillarGeo, pillarMat);
          pillar.position.set(px, h / 2, d / 2 + 1.8);
          pillar.castShadow = true;
          parent.add(pillar);
        }
      }
    }

    return roofs;
  }

  // 5. Interior Cutaway View for Multi-Floor Inspection
  buildInteriorCutaway(loc, w, h, d) {
    const interior = new THREE.Group();
    const floorHeight = h / 3;

    // Interior Floor Slabs
    const slabMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });

    for (let f = 1; f <= 2; f++) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(w - 0.6, 0.2, d - 0.6), slabMat);
      slab.position.y = f * floorHeight;
      interior.add(slab);

      // Interior partitions (rooms)
      const part1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, floorHeight - 0.2, d * 0.7), wallMat);
      part1.position.set(-w / 4, f * floorHeight - floorHeight / 2, 0);
      interior.add(part1);

      const part2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, floorHeight - 0.2, d * 0.7), wallMat);
      part2.position.set(w / 4, f * floorHeight - floorHeight / 2, 0);
      interior.add(part2);
    }

    return interior;
  }

  // 6. Floating 3D Sprite Marker with Canvas Text
  createBuildingLabel(loc) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 72;
    const ctx = canvas.getContext('2d');

    // Rounded Pill Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = loc.accentColor || '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(4, 4, 248, 64, 20);
    ctx.fill();
    ctx.stroke();

    // Yellow Badge Number Circle
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(36, 36, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${loc.badgeNumber || '•'}`, 36, 36);

    // Building Title Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    const cleanName = loc.name.length > 18 ? loc.name.slice(0, 16) + '..' : loc.name;
    ctx.fillText(cleanName, 66, 36);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(16, 4.5, 1);

    return sprite;
  }

  // 7. Avatar Marker for Live Walk Simulation
  buildAvatarMarker() {
    this.avatarMesh = new THREE.Group();

    // Pulsing Outer Ring
    const ringGeo = new THREE.RingGeometry(1.2, 2.0, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    this.avatarMesh.add(ring);

    // Glowing Core Sphere
    const sphereGeo = new THREE.SphereGeometry(0.9, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, emissive: 0x1d4ed8, roughness: 0.2 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.y = 1.0;
    this.avatarMesh.add(sphere);

    // Heading Pointer Arrow
    const coneGeo = new THREE.ConeGeometry(0.6, 1.4, 8);
    const coneMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.rotation.x = Math.PI / 2;
    cone.position.set(0, 1.0, 1.4);
    this.avatarMesh.add(cone);

    this.avatarMesh.visible = false;
    this.scene.add(this.avatarMesh);
  }

  // 8. Ground-Aligned Walking Route Display (Strictly Roads Only)
  displayRoute(routeResult) {
    // Clear previous route
    if (this.activeRouteMesh) {
      this.scene.remove(this.activeRouteMesh);
      this.activeRouteMesh.geometry.dispose();
      this.activeRouteMesh.material.dispose();
      this.activeRouteMesh = null;
    }

    this.routeMarkers.forEach(m => this.scene.remove(m));
    this.routeMarkers = [];

    if (!routeResult || !routeResult.success || !routeResult.pathPoints3D || routeResult.pathPoints3D.length < 2) {
      this.avatarMesh.visible = false;
      return;
    }

    const pts = routeResult.pathPoints3D.map(p => new THREE.Vector3(p.x, 0.28, p.z));

    // Ground-Level Route Ribbon Geometry
    const curve = new THREE.CatmullRomCurve3(pts);
    curve.curveType = "catmullrom";
    curve.tension = 0.1;

    const tubeGeo = new THREE.TubeGeometry(curve, pts.length * 8, 0.45, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // High-visibility blue
      emissive: this.isNight ? 0x0284c7 : 0x1e40af,
      roughness: 0.3,
      metalness: 0.4
    });

    this.activeRouteMesh = new THREE.Mesh(tubeGeo, tubeMat);
    this.scene.add(this.activeRouteMesh);

    // Start Pin (Green)
    const startPos = pts[0];
    const startPin = this.createPinMarker(startPos, 0x10b981, "A");
    this.scene.add(startPin);
    this.routeMarkers.push(startPin);

    // Destination Pin (Red)
    const endPos = pts[pts.length - 1];
    const endPin = this.createPinMarker(endPos, 0xef4444, "B");
    this.scene.add(endPin);
    this.routeMarkers.push(endPin);

    // Position Avatar at Start
    this.avatarMesh.position.set(startPos.x, startPos.y, startPos.z);
    this.avatarMesh.visible = true;
  }

  createPinMarker(pos, colorHex, labelText) {
    const pin = new THREE.Group();

    // Pin Head Sphere
    const headGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, roughness: 0.3 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 4.2;
    pin.add(head);

    // Pin Shaft Cone
    const shaftGeo = new THREE.ConeGeometry(1.0, 3.5, 16);
    const shaft = new THREE.Mesh(shaftGeo, headMat);
    shaft.rotation.x = Math.PI;
    shaft.position.y = 2.2;
    pin.add(shaft);

    pin.position.set(pos.x, 0.3, pos.z);
    return pin;
  }

  // 9. Camera Controls & Navigation Helpers
  selectBuilding(locId, zoomIn = true) {
    this.selectedBuildingId = locId;

    // Reset previous outlines
    this.buildingOutlines.forEach(out => out.visible = false);

    // Highlight selected building with Blue wireframe outline (Reference Image 1)
    const targetOutline = this.buildingOutlines.get(locId);
    if (targetOutline) {
      targetOutline.visible = true;
    }

    if (zoomIn) {
      const bMesh = this.buildingMeshes.get(locId);
      if (bMesh) {
        const targetPos = bMesh.position.clone();
        const cameraTargetPos = targetPos.clone().add(new THREE.Vector3(25, 28, 35));
        this.animateCamera(cameraTargetPos, targetPos);
      }
    }
  }

  animateCamera(toPos, toTarget, duration = 1200) {
    this.animatingCamera = true;
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const startTime = performance.now();

    const tween = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      this.camera.position.lerpVectors(startPos, toPos, ease);
      this.controls.target.lerpVectors(startTarget, toTarget, ease);
      this.controls.update();

      if (progress < 1) {
        requestAnimationFrame(tween);
      } else {
        this.animatingCamera = false;
      }
    };

    requestAnimationFrame(tween);
  }

  resetView() {
    this.selectedBuildingId = null;
    this.buildingOutlines.forEach(out => out.visible = false);
    this.controls.autoRotate = false;
    this.isOrbiting = false;
    this.isTouring = false;
    if (this.tourTimeout) clearTimeout(this.tourTimeout);

    this.animateCamera(this.defaultCamPos, this.defaultCamTarget);
  }

  setTopView() {
    this.controls.autoRotate = false;
    this.isOrbiting = false;
    const topPos = new THREE.Vector3(0, 240, 5);
    const topTarget = new THREE.Vector3(0, 0, 5);
    this.animateCamera(topPos, topTarget);
  }

  toggleOrbit() {
    this.isOrbiting = !this.isOrbiting;
    this.controls.autoRotate = this.isOrbiting;
    this.controls.autoRotateSpeed = 1.2;
    return this.isOrbiting;
  }

  toggleDayNight() {
    this.isNight = !this.isNight;

    if (this.isNight) {
      // Midnight Twilight Theme
      this.scene.background = new THREE.Color(0x0b1329);
      this.scene.fog.color = new THREE.Color(0x0b1329);
      this.ambientLight.intensity = 0.25;
      this.sunLight.intensity = 0.2;
      this.sunLight.color.setHex(0x38bdf8);
      this.fillLight.intensity = 0.15;
      if (this.activeRouteMesh) {
        this.activeRouteMesh.material.emissive.setHex(0x38bdf8);
      }
    } else {
      // Daylight Clear Sky Theme
      this.scene.background = new THREE.Color(0x93c5fd);
      this.scene.fog.color = new THREE.Color(0x93c5fd);
      this.ambientLight.intensity = 0.65;
      this.sunLight.intensity = 1.1;
      this.sunLight.color.setHex(0xfffbeb);
      this.fillLight.intensity = 0.35;
      if (this.activeRouteMesh) {
        this.activeRouteMesh.material.emissive.setHex(0x1e40af);
      }
    }

    return this.isNight;
  }

  toggleMarkers() {
    this.showLabels = !this.showLabels;
    this.floatingLabels.forEach(lbl => lbl.visible = this.showLabels);
    return this.showLabels;
  }

  toggleTransparentRoofs() {
    this.transparentRoofs = !this.transparentRoofs;
    this.roofMeshes.forEach(roofs => {
      roofs.forEach(mesh => {
        if (mesh.material) {
          mesh.material.transparent = this.transparentRoofs;
          mesh.material.opacity = this.transparentRoofs ? 0.25 : 1.0;
        }
      });
    });

    this.interiorGroups.forEach(grp => {
      grp.visible = this.transparentRoofs;
    });

    return this.transparentRoofs;
  }

  // 10. Automated Landmark Tour Mode
  startTour(onStopChange) {
    this.isTouring = true;
    this.tourStopIndex = 0;
    const tourLandmarkIds = [
      "loc-gate-1",
      "loc-admin",
      "loc-fish-pond",
      "loc-intel-joe",
      "loc-lawns-church",
      "loc-oat-north",
      "loc-sac",
      "loc-airfield",
      "loc-health"
    ];

    const nextStop = () => {
      if (!this.isTouring) return;
      const id = tourLandmarkIds[this.tourStopIndex];
      this.selectBuilding(id, true);
      if (onStopChange) onStopChange(id, this.tourStopIndex + 1, tourLandmarkIds.length);

      this.tourStopIndex = (this.tourStopIndex + 1) % tourLandmarkIds.length;
      this.tourTimeout = setTimeout(nextStop, 5500);
    };

    nextStop();
  }

  stopTour() {
    this.isTouring = false;
    if (this.tourTimeout) clearTimeout(this.tourTimeout);
  }

  // 11. Raycasting and Event Listeners
  setupEventListeners() {
    const el = this.renderer.domElement;

    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const meshes = Array.from(this.buildingMeshes.values());
      const intersects = this.raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj && !obj.userData.locationId) {
          obj = obj.parent;
        }

        if (obj && obj.userData.locationId) {
          const locId = obj.userData.locationId;
          this.selectBuilding(locId, true);
          if (this.onBuildingClick) {
            this.onBuildingClick(locId);
          }
        }
      }
    });

    window.addEventListener('resize', () => {
      const w = this.container.clientWidth || window.innerWidth;
      const h = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  // 12. Main Animation Loop
  animate() {
    requestAnimationFrame(() => this.animate());

    // Spin Wind Turbine Blades continuously (Reference Image 1)
    for (const rotor of this.windTurbines) {
      rotor.rotation.z += 0.035;
    }

    if (!this.animatingCamera) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Campus3DScene;
}

