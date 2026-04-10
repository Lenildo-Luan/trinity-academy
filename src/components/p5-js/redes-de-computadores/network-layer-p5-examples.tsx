"use client";

import { P5Sketch } from "../p5-sketch";
import type p5 from "p5";

type RouterId = "R1" | "R2" | "R3" | "R4" | "R5" | "R6";
type HostId = "HA" | "HB";
type NodeId = RouterId | HostId;

type Point = { x: number; y: number };
type GraphEdge = { to: RouterId; cost: number };
type RoutingEntry = {
  destination: NodeId;
  nextHop: NodeId;
  outInterface: string;
  cost: number;
};
type Packet = {
  flowId: string;
  color: [number, number, number];
  route: NodeId[];
  segment: number;
  t: number;
  speed: number;
};

type Flow = {
  id: string;
  source: HostId;
  destination: HostId;
  color: [number, number, number];
  intervalFrames: number;
  speed: number;
  label: string;
};

const ROUTERS: RouterId[] = ["R1", "R2", "R3", "R4", "R5", "R6"];
const HOST_ATTACHMENTS: Record<HostId, RouterId> = {
  HA: "R1",
  HB: "R6",
};
const ROUTER_LINKS: Array<[RouterId, RouterId]> = [
  ["R1", "R2"],
  ["R1", "R3"],
  ["R2", "R3"],
  ["R2", "R4"],
  ["R3", "R5"],
  ["R4", "R5"],
  ["R4", "R6"],
  ["R5", "R6"],
  ["R2", "R5"],
];

const FLOWS: Flow[] = [
  {
    id: "f1",
    source: "HA",
    destination: "HB",
    color: [0, 180, 255],
    intervalFrames: 85,
    speed: 0.015,
    label: "Fluxo A -> B",
  },
  {
    id: "f2",
    source: "HB",
    destination: "HA",
    color: [255, 180, 60],
    intervalFrames: 110,
    speed: 0.013,
    label: "Fluxo B -> A",
  },
  {
    id: "f3",
    source: "HA",
    destination: "HB",
    color: [120, 230, 120],
    intervalFrames: 140,
    speed: 0.011,
    label: "Fluxo premium A -> B",
  },
];

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function interfaceName(neighbors: RouterId[], nextHop: NodeId) {
  if (nextHop === "HA" || nextHop === "HB") return "lan0";
  const index = neighbors.indexOf(nextHop);
  return index >= 0 ? `eth${index}` : "-";
}

export function RoutingForwardingDataPlaneSimulator() {
  let nodePositions = {} as Record<NodeId, Point>;
  let adjacency = {} as Record<RouterId, GraphEdge[]>;
  let routingTables = {} as Record<RouterId, RoutingEntry[]>;
  let selectedRouter: RouterId = "R3";
  let packets: Packet[] = [];
  let deliveredByFlow: Record<string, number> = { f1: 0, f2: 0, f3: 0 };

  const dijkstra = (start: RouterId, goal: RouterId): RouterId[] => {
    const dist = {} as Record<RouterId, number>;
    const prev = {} as Partial<Record<RouterId, RouterId>>;
    const unvisited = new Set<RouterId>(ROUTERS);

    ROUTERS.forEach((router) => {
      dist[router] = Number.POSITIVE_INFINITY;
    });
    dist[start] = 0;

    while (unvisited.size > 0) {
      let current: RouterId | null = null;
      let bestDist = Number.POSITIVE_INFINITY;

      for (const candidate of unvisited.values()) {
        if (dist[candidate] < bestDist) {
          bestDist = dist[candidate];
          current = candidate;
        }
      }

      if (!current) break;
      const currentRouter: RouterId = current;
      unvisited.delete(currentRouter);
      if (currentRouter === goal) break;

      for (const edge of adjacency[currentRouter]) {
        if (!unvisited.has(edge.to)) continue;
        const alt = dist[currentRouter] + edge.cost;
        if (alt < dist[edge.to]) {
          dist[edge.to] = alt;
          prev[edge.to] = currentRouter;
        }
      }
    }

    const path: RouterId[] = [goal];
    let cursor: RouterId = goal;

    while (cursor !== start) {
      const previous = prev[cursor];
      if (!previous) return [start, goal];
      path.unshift(previous);
      cursor = previous;
    }

    return path;
  };

  const pathCost = (routerPath: RouterId[]) => {
    let cost = 0;
    for (let i = 0; i < routerPath.length - 1; i += 1) {
      const from = routerPath[i];
      const to = routerPath[i + 1];
      const edge = adjacency[from].find((item) => item.to === to);
      if (edge) cost += edge.cost;
    }
    return cost;
  };

  const endToEndRoute = (source: HostId, destination: HostId): NodeId[] => {
    const srcRouter = HOST_ATTACHMENTS[source];
    const dstRouter = HOST_ATTACHMENTS[destination];
    return [source, ...dijkstra(srcRouter, dstRouter), destination];
  };

  const rebuildGraph = () => {
    adjacency = {
      R1: [],
      R2: [],
      R3: [],
      R4: [],
      R5: [],
      R6: [],
    };

    ROUTER_LINKS.forEach(([a, b]) => {
      const cost = distance(nodePositions[a], nodePositions[b]);
      adjacency[a].push({ to: b, cost });
      adjacency[b].push({ to: a, cost });
    });
  };

  const rebuildRoutingTables = () => {
    routingTables = {
      R1: [],
      R2: [],
      R3: [],
      R4: [],
      R5: [],
      R6: [],
    };

    ROUTERS.forEach((router) => {
      const neighbors = adjacency[router].map((item) => item.to);
      const destinations: NodeId[] = ["HA", "HB", ...ROUTERS.filter((r) => r !== router)];

      routingTables[router] = destinations.map((destination) => {
        if (destination === "HA" || destination === "HB") {
          const targetRouter = HOST_ATTACHMENTS[destination];
          if (targetRouter === router) {
            return {
              destination,
              nextHop: destination,
              outInterface: "lan0",
              cost: 1,
            };
          }

          const route = dijkstra(router, targetRouter);
          const nextHop = route[1] ?? targetRouter;
          return {
            destination,
            nextHop,
            outInterface: interfaceName(neighbors, nextHop),
            cost: Math.round(pathCost(route) + 1),
          };
        }

        const route = dijkstra(router, destination);
        const nextHop = route[1] ?? destination;
        return {
          destination,
          nextHop,
          outInterface: interfaceName(neighbors, nextHop),
          cost: Math.round(pathCost(route)),
        };
      });
    });
  };

  const spawnPacket = (flow: Flow) => {
    packets.push({
      flowId: flow.id,
      color: flow.color,
      route: endToEndRoute(flow.source, flow.destination),
      segment: 0,
      t: 0,
      speed: flow.speed + Math.random() * 0.002,
    });
  };

  const setup = (p: p5) => {
    p.textFont("monospace");

    nodePositions = {
      HA: { x: p.width * 0.08, y: 165 },
      R1: { x: p.width * 0.19, y: 165 },
      R2: { x: p.width * 0.33, y: 88 },
      R3: { x: p.width * 0.33, y: 242 },
      R4: { x: p.width * 0.5, y: 88 },
      R5: { x: p.width * 0.5, y: 242 },
      R6: { x: p.width * 0.65, y: 165 },
      HB: { x: p.width * 0.76, y: 165 },
    };

    rebuildGraph();
    rebuildRoutingTables();
  };

  const drawPacketTrail = (p: p5, packet: Packet) => {
    const points: Point[] = [];
    for (let i = 0; i <= packet.segment; i += 1) {
      points.push(nodePositions[packet.route[i]]);
    }

    const from = nodePositions[packet.route[packet.segment]];
    const to = nodePositions[packet.route[packet.segment + 1]];
    points.push({
      x: p.lerp(from.x, to.x, packet.t),
      y: p.lerp(from.y, to.y, packet.t),
    });

    p.noFill();
    p.stroke(packet.color[0], packet.color[1], packet.color[2], 110);
    p.strokeWeight(3);
    p.beginShape();
    points.forEach((pt) => p.vertex(pt.x, pt.y));
    p.endShape();
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);

    FLOWS.forEach((flow) => {
      if (p.frameCount % flow.intervalFrames === 0) {
        spawnPacket(flow);
      }
    });

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Simulador de Roteamento e Repasse (Data Plane)", p.width / 2, 8);

    p.textSize(10);
    p.fill(120);
    p.text("Clique em um roteador para inspecionar a tabela de roteamento", p.width / 2, 28);

    // Draw base links between routers
    p.stroke(80);
    p.strokeWeight(1.5);
    ROUTER_LINKS.forEach(([a, b]) => {
      const from = nodePositions[a];
      const to = nodePositions[b];
      p.line(from.x, from.y, to.x, to.y);
    });

    // Draw host-to-router access links
    p.stroke(70, 110, 150);
    p.line(nodePositions.HA.x, nodePositions.HA.y, nodePositions.R1.x, nodePositions.R1.y);
    p.line(nodePositions.HB.x, nodePositions.HB.y, nodePositions.R6.x, nodePositions.R6.y);

    // Update and draw packet trails (highlight path already traversed)
    packets = packets.filter((packet) => {
      packet.t += packet.speed * (p.deltaTime / 16.67);

      while (packet.t >= 1) {
        packet.t -= 1;
        packet.segment += 1;

        if (packet.segment >= packet.route.length - 1) {
          deliveredByFlow[packet.flowId] += 1;
          return false;
        }
      }

      drawPacketTrail(p, packet);
      return true;
    });

    // Draw packets as small moving squares
    packets.forEach((packet) => {
      const from = nodePositions[packet.route[packet.segment]];
      const to = nodePositions[packet.route[packet.segment + 1]];
      const x = p.lerp(from.x, to.x, packet.t);
      const y = p.lerp(from.y, to.y, packet.t);

      p.noStroke();
      p.fill(packet.color[0], packet.color[1], packet.color[2]);
      p.rectMode(p.CENTER);
      p.rect(x, y, 10, 10, 2);
      p.rectMode(p.CORNER);
    });

    // Draw routers
    ROUTERS.forEach((router) => {
      const pos = nodePositions[router];
      const selected = router === selectedRouter;

      p.fill(selected ? 80 : 25, selected ? 80 : 30, selected ? 120 : 40);
      p.stroke(selected ? 180 : 130, selected ? 130 : 140, selected ? 255 : 190, selected ? 220 : 110);
      p.strokeWeight(selected ? 3 : 2);
      p.circle(pos.x, pos.y, 40);

      p.noStroke();
      p.fill(220);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(router, pos.x, pos.y);
    });

    // Draw hosts
    (["HA", "HB"] as HostId[]).forEach((host) => {
      const pos = nodePositions[host];
      p.fill(14, 25, 38);
      p.stroke(90, 170, 255, 140);
      p.strokeWeight(1.5);
      p.rectMode(p.CENTER);
      p.rect(pos.x, pos.y, 42, 28, 5);
      p.rectMode(p.CORNER);

      p.noStroke();
      p.fill(140, 210, 255);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(host === "HA" ? "Host A" : "Host B", pos.x, pos.y);
    });

    // Small legend for flows and delivered counters
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(9);
    FLOWS.forEach((flow, index) => {
      const y = 56 + index * 16;
      p.noStroke();
      p.fill(flow.color[0], flow.color[1], flow.color[2]);
      p.rect(18, y - 5, 10, 10, 2);
      p.fill(150);
      p.text(`${flow.label} | entregues: ${deliveredByFlow[flow.id]}`, 34, y);
    });

    // Routing table panel for selected router
    const panelX = 20;
    const panelY = p.height - 175;
    const panelW = p.width - 40;
    const rowHeight = 16;

    p.fill(10, 16, 28, 240);
    p.stroke(110, 130, 180, 90);
    p.strokeWeight(1);
    p.rect(panelX, panelY, panelW, 155, 8);

    p.noStroke();
    p.fill(190);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text(`Tabela de Roteamento - ${selectedRouter}`, panelX + 12, panelY + 10);

    const headerY = panelY + 30;
    p.fill(120);
    p.textSize(9);
    p.text("Destino", panelX + 12, headerY);
    p.text("Proximo Salto", panelX + 122, headerY);
    p.text("Interface", panelX + 255, headerY);
    p.text("Custo", panelX + 360, headerY);

    const entries = routingTables[selectedRouter];
    entries.forEach((entry, index) => {
      const y = headerY + 14 + index * rowHeight;

      if (index % 2 === 0) {
        p.noStroke();
        p.fill(255, 255, 255, 10);
        p.rect(panelX + 8, y - 1, panelW - 16, rowHeight - 1, 2);
      }

      p.noStroke();
      p.fill(entry.destination === "HB" ? 255 : 170, entry.destination === "HB" ? 210 : 180, 120);
      p.text(entry.destination, panelX + 12, y);
      p.fill(170);
      p.text(entry.nextHop, panelX + 122, y);
      p.fill(130, 190, 255);
      p.text(entry.outInterface, panelX + 255, y);
      p.fill(150);
      p.text(String(entry.cost), panelX + 360, y);
    });
  };

  const mousePressed = (p: p5) => {
    ROUTERS.forEach((router) => {
      const pos = nodePositions[router];
      if (distance({ x: p.mouseX, y: p.mouseY }, pos) <= 22) {
        selectedRouter = router;
      }
    });
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={470} />;
}


