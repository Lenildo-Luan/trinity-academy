"use client";

import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

type RouterId = "R1" | "R2" | "R3" | "R4" | "R5";

type RouterNode = {
  id: RouterId;
  x: number;
  y: number;
};

type RouterEdge = {
  from: RouterId;
  to: RouterId;
  w: number;
};

type Button = { id: string; x: number; y: number; w: number; h: number };

type DistTable = Record<RouterId, number>;

type PrevTable = Partial<Record<RouterId, RouterId>>;

const ROUTER_IDS: RouterId[] = ["R1", "R2", "R3", "R4", "R5"];

const ROUTER_NODES: RouterNode[] = [
  { id: "R1", x: 90, y: 72 },
  { id: "R2", x: 220, y: 128 },
  { id: "R3", x: 220, y: 36 },
  { id: "R4", x: 360, y: 128 },
  { id: "R5", x: 360, y: 36 },
];

const ROUTER_EDGES: RouterEdge[] = [
  { from: "R1", to: "R2", w: 1 },
  { from: "R1", to: "R3", w: 4 },
  { from: "R2", to: "R3", w: 2 },
  { from: "R2", to: "R4", w: 2 },
  { from: "R3", to: "R4", w: 3 },
  { from: "R3", to: "R5", w: 1 },
  { from: "R4", to: "R5", w: 5 },
];

const START_NODE: RouterId = "R1";

function initDistances(): DistTable {
  return {
    R1: 0,
    R2: Number.POSITIVE_INFINITY,
    R3: Number.POSITIVE_INFINITY,
    R4: Number.POSITIVE_INFINITY,
    R5: Number.POSITIVE_INFINITY,
  };
}

function getNodeById(id: RouterId): RouterNode {
  const node = ROUTER_NODES.find((item) => item.id === id);
  if (!node) {
    throw new Error(`Router node not found: ${id}`);
  }
  return node;
}

function buildAdjacency() {
  const adjacency: Record<RouterId, Array<{ to: RouterId; w: number }>> = {
    R1: [],
    R2: [],
    R3: [],
    R4: [],
    R5: [],
  };

  ROUTER_EDGES.forEach((edge) => {
    adjacency[edge.from].push({ to: edge.to, w: edge.w });
    adjacency[edge.to].push({ to: edge.from, w: edge.w });
  });

  return adjacency;
}

function edgeIsInTree(edge: RouterEdge, prev: PrevTable) {
  return prev[edge.to] === edge.from || prev[edge.from] === edge.to;
}

function drawButton(
  p: p5,
  buttons: Button[],
  id: string,
  x: number,
  y: number,
  text: string,
  active = false,
) {
  const w = 82;
  const h = 23;
  buttons.push({ id, x, y, w, h });

  p.stroke(active ? 115 : 90, active ? 220 : 150, 255, active ? 230 : 125);
  p.fill(active ? 22 : 12, active ? 40 : 24, 52);
  p.rect(x, y, w, h, 6);
  p.noStroke();
  p.fill(210);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(9);
  p.text(text, x + w / 2, y + h / 2 + 0.5);
}

function drawRoutingGraph(
  p: p5,
  opts: {
    prev: PrevTable;
    visited: Set<RouterId>;
    current: RouterId | null;
    title: string;
    subtitle: string;
    graphX?: number;
  },
) {
  const graphX = opts.graphX ?? 0;

  p.noStroke();
  p.fill(205);
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(11);
  p.text(opts.title, graphX + 20, 14);
  p.fill(135);
  p.textSize(8.5);
  p.text(opts.subtitle, graphX + 20, 30);

  ROUTER_EDGES.forEach((edge) => {
    const from = getNodeById(edge.from);
    const to = getNodeById(edge.to);
    const tree = edgeIsInTree(edge, opts.prev);

    p.stroke(tree ? 120 : 84, tree ? 220 : 130, tree ? 255 : 150, tree ? 225 : 120);
    p.strokeWeight(tree ? 2.5 : 1.5);
    p.line(graphX + from.x, from.y, graphX + to.x, to.y);

    const mx = graphX + (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    p.noStroke();
    p.fill(7, 14, 28);
    p.rect(mx - 9, my - 7, 18, 13, 3);
    p.fill(188);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(8);
    p.text(String(edge.w), mx, my - 0.5);
  });

  ROUTER_NODES.forEach((node) => {
    const isVisited = opts.visited.has(node.id);
    const isCurrent = opts.current === node.id;
    const color: [number, number, number] = isVisited
      ? [120, 220, 145]
      : isCurrent
        ? [255, 220, 90]
        : [132, 145, 170];

    p.stroke(color[0], color[1], color[2], 225);
    p.strokeWeight(2);
    p.fill(14, 22, 35);
    p.circle(graphX + node.x, node.y, 34);

    p.noStroke();
    p.fill(color[0], color[1], color[2]);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(10.5);
    p.text(node.id, graphX + node.x, node.y);
  });
}

export function RoutingTopologyR1R5Visualizer() {
  let hoveredNode: RouterId | null = null;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    hoveredNode = null;

    ROUTER_NODES.forEach((node) => {
      const dx = p.mouseX - node.x;
      const dy = p.mouseY - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= 18) {
        hoveredNode = node.id;
      }
    });

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("Topologia da rede corporativa (R1-R5)", 18, 12);
    p.fill(135);
    p.textSize(8.5);
    p.text("Passe o mouse sobre um roteador para destacar seus enlaces.", 18, 28);

    ROUTER_EDGES.forEach((edge) => {
      const from = getNodeById(edge.from);
      const to = getNodeById(edge.to);
      const highlighted = hoveredNode === edge.from || hoveredNode === edge.to;

      p.stroke(highlighted ? 130 : 84, highlighted ? 220 : 130, highlighted ? 255 : 150, highlighted ? 230 : 120);
      p.strokeWeight(highlighted ? 2.8 : 1.6);
      p.line(from.x, from.y, to.x, to.y);

      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      p.noStroke();
      p.fill(8, 14, 28);
      p.rect(mx - 10, my - 7, 20, 13, 3);
      p.fill(highlighted ? 255 : 188);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(8);
      p.text(String(edge.w), mx, my - 0.5);
    });

    ROUTER_NODES.forEach((node) => {
      const isHovered = hoveredNode === node.id;
      const color: [number, number, number] = isHovered ? [255, 220, 95] : [132, 145, 170];

      p.stroke(color[0], color[1], color[2], 225);
      p.strokeWeight(2);
      p.fill(14, 22, 35);
      p.circle(node.x, node.y, 36);

      p.noStroke();
      p.fill(color[0], color[1], color[2]);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(10.5);
      p.text(node.id, node.x, node.y);
    });

    p.fill(12, 20, 35);
    p.stroke(120, 145, 175, 90);
    p.rect(430, 14, p.width - 444, 154, 8);

    p.noStroke();
    p.fill(195);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9.2);
    p.text("Tabela de enlaces", 440, 24);

    const rows: string[] = [
      "R1-R2: 1",
      "R1-R3: 4",
      "R2-R3: 2",
      "R2-R4: 2",
      "R3-R4: 3",
      "R3-R5: 1",
      "R4-R5: 5",
    ];

    rows.forEach((row, idx) => {
      p.fill(150 + (hoveredNode ? 20 : 0));
      p.text(row, 440, 42 + idx * 16);
    });

    if (hoveredNode) {
      p.fill(255, 220, 95);
      p.text(`Roteador selecionado: ${hoveredNode}`, 440, 154);
    }
  };

  return <P5Sketch setup={setup} draw={draw} height={190} />;
}

export function DijkstraRoutingStepSimulator() {
  const adjacency = buildAdjacency();
  const buttons: Button[] = [];

  let dist: DistTable = initDistances();
  let prev: PrevTable = {};
  let visited = new Set<RouterId>();
  let current: RouterId | null = null;
  let playing = true;
  let phase: "select" | "relax" = "select";
  let iteration = 0;
  let finished = false;
  let lastStepFrame = 0;

  const reset = () => {
    dist = initDistances();
    prev = {};
    visited = new Set<RouterId>();
    current = null;
    playing = false;
    phase = "select";
    iteration = 0;
    finished = false;
  };

  const pickNext = () => {
    let best: RouterId | null = null;
    let bestDist = Number.POSITIVE_INFINITY;

    ROUTER_IDS.forEach((id) => {
      if (!visited.has(id) && dist[id] < bestDist) {
        best = id;
        bestDist = dist[id];
      }
    });

    return best;
  };

  const step = () => {
    if (finished) return;

    if (phase === "select") {
      const next = pickNext();
      if (!next) {
        finished = true;
        return;
      }
      current = next;
      phase = "relax";
      return;
    }

    if (!current) return;
    const currentRouter = current;

    adjacency[currentRouter].forEach((neighbor) => {
      if (visited.has(neighbor.to)) return;
      const candidate = dist[currentRouter] + neighbor.w;
      if (candidate < dist[neighbor.to]) {
        dist[neighbor.to] = candidate;
        prev[neighbor.to] = currentRouter;
      }
    });

    visited.add(currentRouter);
    iteration += 1;
    current = null;
    phase = "select";

    if (visited.size === ROUTER_IDS.length) {
      finished = true;
    }
  };

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    buttons.length = 0;

    if (playing && !finished && p.frameCount - lastStepFrame > 34) {
      step();
      lastStepFrame = p.frameCount;
    }

    drawRoutingGraph(p, {
      prev,
      visited,
      current,
      title: "Dijkstra passo a passo (origem: R1)",
      subtitle: "amarelo = no em processamento | verde = distancia fixada",
    });

    const panelX = 452;
    const panelY = 14;
    const panelW = p.width - panelX - 14;

    p.fill(12, 20, 35);
    p.stroke(120, 145, 175, 90);
    p.rect(panelX, panelY, panelW, 248, 8);

    p.noStroke();
    p.fill(195);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(
      `iteracao: ${iteration}${finished ? " (concluido)" : ""} | fase: ${phase}`,
      panelX + 10,
      panelY + 10,
    );

    p.fill(132);
    p.textSize(8.5);
    p.text("No", panelX + 10, panelY + 30);
    p.text("Distancia", panelX + 52, panelY + 30);
    p.text("Prev", panelX + 138, panelY + 30);
    p.text("Estado", panelX + 190, panelY + 30);

    ROUTER_IDS.forEach((id, idx) => {
      const y = panelY + 44 + idx * 24;

      p.noStroke();
      p.fill(idx % 2 === 0 ? 255 : 255, 255, 255, idx % 2 === 0 ? 10 : 6);
      p.rect(panelX + 8, y - 3, panelW - 16, 19, 3);

      const state = visited.has(id) ? "fixado" : current === id ? "ativo" : "pendente";
      const color: [number, number, number] =
        state === "fixado" ? [120, 220, 145] : state === "ativo" ? [255, 220, 90] : [150, 160, 180];

      p.fill(192);
      p.textSize(9);
      p.text(id, panelX + 10, y);
      p.text(dist[id] === Number.POSITIVE_INFINITY ? "inf" : String(dist[id]), panelX + 52, y);
      p.text(prev[id] ?? "-", panelX + 138, y);
      p.fill(color[0], color[1], color[2]);
      p.text(state, panelX + 190, y);
    });

    const nextHopForR5 = prev.R5 ? `R1 -> ${prev.R5} -> R5` : "aguardando";

    p.noStroke();
    p.fill(130);
    p.textSize(8.5);
    p.text(`caminho para R5: ${nextHopForR5}`, panelX + 10, panelY + 170);

    drawButton(p, buttons, "toggle", panelX + 10, panelY + 188, playing ? "Pause" : "Play", playing);
    drawButton(p, buttons, "step", panelX + 100, panelY + 188, "Passo", false);
    drawButton(p, buttons, "reset", panelX + 190, panelY + 188, "Reiniciar", false);

    p.noStroke();
    p.fill(125);
    p.textSize(8);
    p.text("Resultados esperados: R2=1, R3=3, R4=3, R5=4", panelX + 10, panelY + 220);
  };

  const mousePressed = (p: p5) => {
    const hit = buttons.find(
      (btn) =>
        p.mouseX >= btn.x &&
        p.mouseX <= btn.x + btn.w &&
        p.mouseY >= btn.y &&
        p.mouseY <= btn.y + btn.h,
    );

    if (!hit) return;

    if (hit.id === "toggle") {
      playing = !playing;
      return;
    }

    if (hit.id === "step") {
      step();
      return;
    }

    if (hit.id === "reset") {
      reset();
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={278} />;
}

function runDistanceVectorRounds(maxRounds = 8) {
  const adjacency = buildAdjacency();

  const round0: Record<RouterId, DistTable> = {
    R1: { R1: 0, R2: 1, R3: 4, R4: Number.POSITIVE_INFINITY, R5: Number.POSITIVE_INFINITY },
    R2: { R1: 1, R2: 0, R3: 2, R4: 2, R5: Number.POSITIVE_INFINITY },
    R3: { R1: 4, R2: 2, R3: 0, R4: 3, R5: 1 },
    R4: { R1: Number.POSITIVE_INFINITY, R2: 2, R3: 3, R4: 0, R5: 5 },
    R5: { R1: Number.POSITIVE_INFINITY, R2: Number.POSITIVE_INFINITY, R3: 1, R4: 5, R5: 0 },
  };

  const rounds: Array<Record<RouterId, DistTable>> = [round0];

  for (let round = 1; round <= maxRounds; round += 1) {
    const prevRound = rounds[round - 1];
    const nextRound: Record<RouterId, DistTable> = {
      R1: { ...prevRound.R1 },
      R2: { ...prevRound.R2 },
      R3: { ...prevRound.R3 },
      R4: { ...prevRound.R4 },
      R5: { ...prevRound.R5 },
    };

    ROUTER_IDS.forEach((source) => {
      ROUTER_IDS.forEach((dest) => {
        if (source === dest) {
          nextRound[source][dest] = 0;
          return;
        }

        let best = prevRound[source][dest];

        adjacency[source].forEach((neighbor) => {
          const candidate = neighbor.w + prevRound[neighbor.to][dest];
          if (candidate < best) {
            best = candidate;
          }
        });

        nextRound[source][dest] = best;
      });
    });

    rounds.push(nextRound);

    const stable = ROUTER_IDS.every((src) =>
      ROUTER_IDS.every((dst) => rounds[round][src][dst] === rounds[round - 1][src][dst]),
    );

    if (stable) break;
  }

  return rounds;
}

export function DistanceVectorBellmanFordIterativeVisualizer() {
  const rounds = runDistanceVectorRounds();
  const buttons: Button[] = [];

  let currentRound = 0;
  let playing = true;
  let lastStepFrame = 0;

  const reset = () => {
    currentRound = 0;
    playing = false;
  };

  const step = () => {
    if (currentRound < rounds.length - 1) {
      currentRound += 1;
      return;
    }
    playing = false;
  };

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    buttons.length = 0;

    if (playing && p.frameCount - lastStepFrame > 48) {
      step();
      lastStepFrame = p.frameCount;
    }

    const roundData = rounds[currentRound];
    const prevRound = currentRound > 0 ? rounds[currentRound - 1] : null;
    const converged = currentRound === rounds.length - 1;

    drawRoutingGraph(p, {
      prev: {},
      visited: new Set<RouterId>(),
      current: null,
      title: "Distance Vector (Bellman-Ford) por rodadas",
      subtitle: "amarelo = celula atualizada nesta rodada",
    });

    const matrixX = 448;
    const matrixY = 14;
    const matrixW = p.width - matrixX - 14;
    const rowH = 32;
    const colW = 62;

    p.fill(12, 20, 35);
    p.stroke(120, 145, 175, 90);
    p.rect(matrixX, matrixY, matrixW, 280, 8);

    p.noStroke();
    p.fill(195);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(
      `rodada t=${currentRound} de ${rounds.length - 1}${converged ? " (convergiu)" : ""}`,
      matrixX + 10,
      matrixY + 10,
    );

    ROUTER_IDS.forEach((dest, idx) => {
      p.fill(132);
      p.textSize(8.5);
      p.textAlign(p.CENTER, p.TOP);
      p.text(dest, matrixX + 94 + idx * colW, matrixY + 30);
    });

    ROUTER_IDS.forEach((source, rowIdx) => {
      const y = matrixY + 48 + rowIdx * rowH;

      p.noStroke();
      p.fill(255, 255, 255, rowIdx % 2 === 0 ? 9 : 6);
      p.rect(matrixX + 8, y - 2, matrixW - 16, rowH - 4, 4);

      p.fill(168);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(9);
      p.text(source, matrixX + 14, y + 12);

      ROUTER_IDS.forEach((dest, colIdx) => {
        const x = matrixX + 74 + colIdx * colW;
        const value = roundData[source][dest];
        const changed = !!prevRound && prevRound[source][dest] !== value;

        if (changed) {
          p.noStroke();
          p.fill(255, 220, 90, 48);
          p.rect(x - 8, y + 2, colW - 8, rowH - 10, 3);
        }

        p.noStroke();
        p.fill(changed ? 255 : 200, changed ? 220 : 205, changed ? 90 : 205);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(9.5);
        p.text(value === Number.POSITIVE_INFINITY ? "inf" : String(value), x + 20, y + 12);
      });
    });

    const changedCells = prevRound
      ? ROUTER_IDS.reduce((acc, src) => {
          return (
            acc + ROUTER_IDS.filter((dst) => prevRound[src][dst] !== roundData[src][dst]).length
          );
        }, 0)
      : 0;

    p.noStroke();
    p.fill(130);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(8.3);
    p.text(`celulas atualizadas nesta rodada: ${changedCells}`, matrixX + 10, matrixY + 220);
    p.text("esperado: R1->R5 converge para custo 4 via R3", matrixX + 10, matrixY + 234);

    drawButton(p, buttons, "toggle", matrixX + 10, matrixY + 248, playing ? "Pause" : "Play", playing);
    drawButton(p, buttons, "step", matrixX + 100, matrixY + 248, "Prox rodada", false);
    drawButton(p, buttons, "reset", matrixX + 190, matrixY + 248, "Reiniciar", false);
  };

  const mousePressed = (p: p5) => {
    const hit = buttons.find(
      (btn) =>
        p.mouseX >= btn.x &&
        p.mouseX <= btn.x + btn.w &&
        p.mouseY >= btn.y &&
        p.mouseY <= btn.y + btn.h,
    );

    if (!hit) return;

    if (hit.id === "toggle") {
      playing = !playing;
      return;
    }

    if (hit.id === "step") {
      step();
      return;
    }

    if (hit.id === "reset") {
      reset();
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={308} />;
}

export function LinkStateVsDistanceVectorConvergenceComparator() {
  const rounds = runDistanceVectorRounds();
  const maxRound = rounds.length - 1;
  const buttons: Button[] = [];

  let tick = 0;
  let playing = true;
  let lastTickFrame = 0;

  const reset = () => {
    tick = 0;
    playing = false;
  };

  const step = () => {
    if (tick < maxRound + 2) {
      tick += 1;
      return;
    }
    playing = false;
  };

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const drawSidePanel = (
    p: p5,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    subtitle: string,
    progress: number,
    color: [number, number, number],
    details: string,
  ) => {
    p.fill(12, 20, 35);
    p.stroke(120, 145, 175, 90);
    p.rect(x, y, w, h, 8);

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10.5);
    p.text(title, x + 10, y + 10);

    p.fill(132);
    p.textSize(8.5);
    p.text(subtitle, x + 10, y + 25);

    p.noFill();
    p.stroke(100, 120, 150, 120);
    p.rect(x + 10, y + 50, w - 20, 14, 4);

    const clamped = Math.max(0, Math.min(1, progress));
    p.noStroke();
    p.fill(color[0], color[1], color[2], 210);
    p.rect(x + 11, y + 51, (w - 22) * clamped, 12, 3);

    p.fill(188);
    p.textSize(8.7);
    p.text(`convergencia: ${Math.round(clamped * 100)}%`, x + 10, y + 70);
    p.text(details, x + 10, y + 84, w - 20);
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    buttons.length = 0;

    if (playing && p.frameCount - lastTickFrame > 44) {
      step();
      lastTickFrame = p.frameCount;
    }

    const lsProgress = tick >= 1 ? 1 : tick * 0.75;
    const dvProgress = Math.min(1, tick / Math.max(1, maxRound));

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("Comparador de convergencia: Link State vs Distance Vector", 20, 14);
    p.fill(135);
    p.textSize(8.5);
    p.text("mesma topologia, metodos diferentes de disseminar informacao", 20, 30);

    drawRoutingGraph(p, {
      prev: {},
      visited: new Set<RouterId>(),
      current: null,
      title: "",
      subtitle: "",
      graphX: 0,
    });

    drawSidePanel(
      p,
      22,
      172,
      356,
      116,
      "Link State (OSPF/Dijkstra)",
      "todos recebem estado de enlace e calculam localmente",
      lsProgress,
      [120, 220, 255],
      `t=${tick}: topologia completa disponivel em 1 rodada de flooding.`,
    );

    const dvRound = Math.min(maxRound, tick);
    drawSidePanel(
      p,
      402,
      172,
      356,
      116,
      "Distance Vector (RIP/Bellman-Ford)",
      "apenas vizinhos trocam vetores em rodadas sucessivas",
      dvProgress,
      [255, 210, 100],
      `t=${tick}: vetor atual em t=${dvRound}/${maxRound}.`,
    );

    p.noStroke();
    p.fill(130);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(8.3);
    p.text(
      "LS: convergencia rapida e custo de sinalizacao maior. DV: convergencia gradual e risco de loops transitorios.",
      22,
      294,
      p.width - 44,
    );

    drawButton(p, buttons, "toggle", 22, 316, playing ? "Pause" : "Play", playing);
    drawButton(p, buttons, "step", 112, 316, "Prox t", false);
    drawButton(p, buttons, "reset", 202, 316, "Reiniciar", false);
  };

  const mousePressed = (p: p5) => {
    const hit = buttons.find(
      (btn) =>
        p.mouseX >= btn.x &&
        p.mouseX <= btn.x + btn.w &&
        p.mouseY >= btn.y &&
        p.mouseY <= btn.y + btn.h,
    );

    if (!hit) return;

    if (hit.id === "toggle") {
      playing = !playing;
      return;
    }

    if (hit.id === "step") {
      step();
      return;
    }

    if (hit.id === "reset") {
      reset();
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={352} />;
}


