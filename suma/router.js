/**
 * Campus Compass - Intelligent Multi-Criteria Routing Engine
 * Implements Dijkstra's Shortest Path Algorithm with dynamic edge weights:
 * - Distance
 * - 100% Step-Free Accessibility (zero stairs, ramp prioritization)
 * - Weather Shelter (covered colonnades)
 * - Night Safety (high lumen illumination, CCTV visibility)
 * - Real-Time Crowd Congestion avoidance
 * - Dynamic Temporary Roadblocks / Path Closures
 */

class CampusRouter {
  constructor(campusData) {
    this.data = campusData;
    this.closedEdges = new Set(); // Set of "from_id:to_id"
    this.congestionMultipliers = {}; // Custom live congestion overrides
  }

  // Admin Roadblock Management
  toggleRoadblock(nodeA, nodeB) {
    const key1 = `${nodeA}:${nodeB}`;
    const key2 = `${nodeB}:${nodeA}`;
    if (this.closedEdges.has(key1) || this.closedEdges.has(key2)) {
      this.closedEdges.delete(key1);
      this.closedEdges.delete(key2);
      return false; // opened
    } else {
      this.closedEdges.add(key1);
      this.closedEdges.add(key2);
      return true; // closed
    }
  }

  isRoadBlocked(nodeA, nodeB) {
    return this.closedEdges.has(`${nodeA}:${nodeB}`) || this.closedEdges.has(`${nodeB}:${nodeA}`);
  }

  // Calculate Edge Cost based on Routing Mode
  getEdgeWeight(edge, mode = 'fastest') {
    // If road is temporarily closed by campus administration
    if (this.isRoadBlocked(edge.from, edge.to) || edge.status === 'closed') {
      return Infinity;
    }

    const baseDist = edge.distance;
    const congestionFactor = this.congestionMultipliers[`${edge.from}:${edge.to}`] || edge.congestion || 1.0;

    switch (mode) {
      case 'accessible':
        // Strict accessibility requirement: NO stairs, prioritize ramps
        if (edge.hasStairs || edge.accessible === false) {
          return Infinity; // Completely un-traversable for wheelchairs & mobility aids
        }
        // Slightly favor dedicated gentle ramp pathways
        return baseDist * 0.95;

      case 'sheltered':
        // Favor covered colonnades & indoor links during rain or harsh heat
        if (edge.sheltered) {
          return baseDist * 0.7; // 30% bonus
        }
        return baseDist * 1.3;

      case 'night_safety':
        // Prioritize well-lit boulevards with security coverage
        if (edge.wellLit) {
          return baseDist * 0.8;
        }
        return baseDist * 2.5; // Avoid poorly lit shortcuts

      case 'crowd_aware':
        // Heavily penalize crowded corridors (e.g. mess at lunch)
        return baseDist * congestionFactor * 1.5;

      case 'fastest':
      default:
        // Pure shortest distance with slight congestion penalty
        return baseDist * (1 + (congestionFactor - 1) * 0.3);
    }
  }

  // Build Adjacency List
  buildAdjacencyList(mode = 'fastest') {
    const adj = {};
    const nodes = this.data.graph.nodes;

    for (const nodeId in nodes) {
      adj[nodeId] = [];
    }

    for (const edge of this.data.graph.edges) {
      const weight = this.getEdgeWeight(edge, mode);
      if (weight === Infinity) continue;

      adj[edge.from].push({ node: edge.to, weight, edge });
      adj[edge.to].push({ node: edge.from, weight, edge }); // All campus walkways are bidirectional
    }

    return adj;
  }

  // Dijkstra Algorithm
  findPath(startNodeId, endNodeId, mode = 'fastest') {
    if (!this.data.graph.nodes[startNodeId] || !this.data.graph.nodes[endNodeId]) {
      return { error: "Invalid start or destination node" };
    }

    if (startNodeId === endNodeId) {
      const node = this.data.graph.nodes[startNodeId];
      return {
        path: [startNodeId],
        nodes: [node],
        totalDistance: 0,
        walkingTimeMin: 0,
        walkingTimeSec: 0,
        calories: 0,
        steps: 0,
        mode,
        accessible: true,
        stepsDirections: [{
          instruction: "You have arrived at your destination.",
          distance: 0,
          landmark: node.label,
          type: "arrive"
        }]
      };
    }

    const adj = this.buildAdjacencyList(mode);
    const distances = {};
    const previous = {};
    const edgeUsed = {};
    const unvisited = new Set(Object.keys(this.data.graph.nodes));

    for (const nodeId of unvisited) {
      distances[nodeId] = Infinity;
      previous[nodeId] = null;
    }
    distances[startNodeId] = 0;

    while (unvisited.size > 0) {
      // Find unvisited node with smallest distance
      let current = null;
      let minDistance = Infinity;

      for (const nodeId of unvisited) {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          current = nodeId;
        }
      }

      if (current === null || minDistance === Infinity) {
        break; // Remaining nodes are unreachable
      }

      if (current === endNodeId) {
        break; // Destination reached
      }

      unvisited.delete(current);

      const neighbors = adj[current] || [];
      for (const { node: neighbor, weight, edge } of neighbors) {
        if (!unvisited.has(neighbor)) continue;

        const candidateDist = distances[current] + weight;
        if (candidateDist < distances[neighbor]) {
          distances[neighbor] = candidateDist;
          previous[neighbor] = current;
          edgeUsed[neighbor] = edge;
        }
      }
    }

    if (distances[endNodeId] === Infinity) {
      // If accessible mode failed because only stairs exist, fallback with explanation
      if (mode === 'accessible') {
        return {
          error: "No completely step-free accessible route found between these locations. A ramp or elevator bypass may be under maintenance.",
          isBlocked: true,
          mode
        };
      }
      return {
        error: "Route blocked by active campus maintenance. Please try an alternate gate or pathway.",
        isBlocked: true,
        mode
      };
    }

    // Reconstruct Path
    const pathNodes = [];
    const edgesList = [];
    let curr = endNodeId;

    while (curr !== null) {
      pathNodes.unshift(curr);
      if (edgeUsed[curr]) {
        edgesList.unshift(edgeUsed[curr]);
      }
      curr = previous[curr];
    }

    // Compute actual real-world meters from edge definitions
    let realDistanceMeters = 0;
    let isFullyAccessible = true;
    let isFullySheltered = true;

    for (let i = 0; i < pathNodes.length - 1; i++) {
      const u = pathNodes[i];
      const v = pathNodes[i + 1];
      const edge = this.data.graph.edges.find(e => 
        (e.from === u && e.to === v) || (e.from === v && e.to === u)
      );
      if (edge) {
        realDistanceMeters += edge.distance;
        if (edge.hasStairs || edge.accessible === false) isFullyAccessible = false;
        if (!edge.sheltered) isFullySheltered = false;
      }
    }

    // Walking speed: Average 5.0 km/h (1.38 m/s); accessible wheelchair/pace: 3.6 km/h (1.0 m/s)
    const speedMps = mode === 'accessible' ? 1.05 : 1.35;
    const totalSeconds = Math.round(realDistanceMeters / speedMps);
    const walkingTimeMin = Math.floor(totalSeconds / 60);
    const walkingTimeSec = totalSeconds % 60;
    const calories = Math.round(realDistanceMeters * 0.05); // Approx 50 kcal per km
    const steps = Math.round(realDistanceMeters * 1.32); // Approx 1320 steps per km

    // Generate Landmark-Annotated Step-by-Step Directions
    const stepsDirections = this.generateStepDirections(pathNodes);

    return {
      path: pathNodes,
      nodes: pathNodes.map(id => this.data.graph.nodes[id]),
      edges: edgesList,
      totalDistance: Math.round(realDistanceMeters),
      walkingTimeMin,
      walkingTimeSec,
      totalSeconds,
      calories,
      steps,
      mode,
      accessible: isFullyAccessible,
      sheltered: isFullySheltered,
      stepsDirections
    };
  }

  // Turn-by-turn instruction generator with landmark awareness
  generateStepDirections(pathNodes) {
    const directions = [];
    const nodes = this.data.graph.nodes;

    for (let i = 0; i < pathNodes.length - 1; i++) {
      const curr = nodes[pathNodes[i]];
      const next = nodes[pathNodes[i + 1]];
      const edge = this.data.graph.edges.find(e => 
        (e.from === curr.id && e.to === next.id) || (e.from === next.id && e.to === curr.id)
      );

      const dist = edge ? edge.distance : Math.round(Math.hypot(next.x - curr.x, next.y - curr.y));
      const edgeName = edge && edge.name ? edge.name : "campus pathway";

      // Compute angle to determine direction (left, right, straight)
      let turnType = "straight";
      let actionText = "Proceed straight along";

      if (i > 0) {
        const prev = nodes[pathNodes[i - 1]];
        const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
        const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
        let diff = (angle2 - angle1) * (180 / Math.PI);
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;

        if (diff > 35 && diff < 140) {
          turnType = "right";
          actionText = "Turn right onto";
        } else if (diff < -35 && diff > -140) {
          turnType = "left";
          actionText = "Turn left onto";
        } else if (diff >= 140 || diff <= -140) {
          turnType = "uturn";
          actionText = "Make a sharp turn onto";
        } else if (diff > 15) {
          turnType = "slight_right";
          actionText = "Bear slightly right along";
        } else if (diff < -15) {
          turnType = "slight_left";
          actionText = "Bear slightly left along";
        }
      }

      // Check nearby landmarks for descriptive cues
      let landmarkCue = "";
      if (curr.buildingId) {
        const b = this.data.locations.find(loc => loc.id === curr.buildingId);
        if (b && i === 0) {
          landmarkCue = `Depart from ${b.name}`;
        }
      }

      if (edge && edge.sheltered) {
        landmarkCue += landmarkCue ? " (Covered walkway)" : "Follow covered walkway";
      }
      if (edge && edge.accessible && !edge.hasStairs) {
        landmarkCue += landmarkCue ? " [Step-Free Ramp]" : "Use accessible ramp";
      }

      directions.push({
        stepNumber: i + 1,
        instruction: `${actionText} ${edgeName} for ${dist} m.`,
        detail: landmarkCue || `Passing near ${curr.label}`,
        distance: dist,
        turnType,
        sourceNode: curr.id,
        targetNode: next.id,
        edgeName,
        isSheltered: !!(edge && edge.sheltered),
        isAccessible: !(edge && edge.hasStairs)
      });
    }

    // Final Arrival step
    const destNode = nodes[pathNodes[pathNodes.length - 1]];
    const destBuilding = this.data.locations.find(l => l.nodeId === destNode.id || l.id === destNode.buildingId);
    directions.push({
      stepNumber: pathNodes.length,
      instruction: `Arrive at ${destBuilding ? destBuilding.name : destNode.label}`,
      detail: destBuilding ? `Hours: ${destBuilding.hours} | Accessible: ${destBuilding.accessible ? 'Yes (Ramp & Lift)' : 'Standard'}` : "Destination on campus",
      distance: 0,
      turnType: "arrive",
      sourceNode: destNode.id,
      targetNode: destNode.id
    });

    return directions;
  }

  // Find Nearest Emergency Location (Gate, Health Centre, Security, Safe Assembly)
  findNearestEmergency(startNodeId, emergencyType = 'any') {
    const candidates = [];
    const locs = this.data.locations;

    for (const loc of locs) {
      if (emergencyType === 'medical' && loc.id === 'health_centre') {
        candidates.push(loc);
      } else if (emergencyType === 'security' && (loc.id === 'security_hq' || loc.category === 'gates')) {
        candidates.push(loc);
      } else if (emergencyType === 'assembly' && loc.type === 'assembly') {
        candidates.push(loc);
      } else if (emergencyType === 'gate' && loc.type === 'gate') {
        candidates.push(loc);
      } else if (emergencyType === 'any') {
        if (loc.id === 'health_centre' || loc.id === 'security_hq' || loc.type === 'assembly' || loc.type === 'gate') {
          candidates.push(loc);
        }
      }
    }

    let bestRoute = null;
    let shortestDist = Infinity;
    let bestTarget = null;

    for (const candidate of candidates) {
      const route = this.findPath(startNodeId, candidate.nodeId, 'fastest');
      if (!route.error && route.totalDistance < shortestDist) {
        shortestDist = route.totalDistance;
        bestRoute = route;
        bestTarget = candidate;
      }
    }

    return {
      target: bestTarget,
      route: bestRoute
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CampusRouter;
}

