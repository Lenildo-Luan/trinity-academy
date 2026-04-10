"use client";

import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

type Button = { id: string; x: number; y: number; w: number; h: number };
type Node = { id: string; x: number; y: number };

const BUTTON_W = 92;
const BUTTON_H = 24;

const QUAD_NODES: Node[] = [
  { id: "A", x: 120, y: 110 },
  { id: "B", x: 300, y: 70 },
  { id: "C", x: 300, y: 150 },
  { id: "D", x: 490, y: 110 },
];

function getNode(id: string): Node {
  const node = QUAD_NODES.find((item) => item.id === id);
  if (!node) {
    throw new Error(`Node not found: ${id}`);
  }
  return node;
}

function drawButton(
  p: p5,
  buttons: Button[],
  id: string,
  x: number,
  y: number,
  label: string,
  active = false,
) {
  buttons.push({ id, x, y, w: BUTTON_W, h: BUTTON_H });

  p.stroke(active ? 110 : 90, active ? 210 : 150, 255, active ? 230 : 120);
  p.fill(active ? 18 : 12, active ? 40 : 26, 52);
  p.rect(x, y, BUTTON_W, BUTTON_H, 6);

  p.noStroke();
  p.fill(210);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(9);
  p.text(label, x + BUTTON_W / 2, y + BUTTON_H / 2 + 0.5);
}

function hitButton(p: p5, buttons: Button[]) {
  return buttons.find(
    (button) =>
      p.mouseX >= button.x &&
      p.mouseX <= button.x + button.w &&
      p.mouseY >= button.y &&
      p.mouseY <= button.y + button.h,
  );
}

function drawNode(p: p5, node: Node, color: [number, number, number]) {
  p.stroke(color[0], color[1], color[2], 220);
  p.strokeWeight(2);
  p.fill(14, 22, 35);
  p.circle(node.x, node.y, 36);

  p.noStroke();
  p.fill(color[0], color[1], color[2]);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(11);
  p.text(node.id, node.x, node.y + 0.5);
}

function drawEdge(
  p: p5,
  from: Node,
  to: Node,
  color: [number, number, number],
  weight: number,
  traffic: number,
) {
  p.stroke(color[0], color[1], color[2], 200);
  p.strokeWeight(1.5 + traffic * 4);
  p.line(from.x, from.y, to.x, to.y);

  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  p.noStroke();
  p.fill(8, 14, 28);
  p.rect(mx - 16, my - 10, 32, 16, 4);
  p.fill(220);
  p.textSize(8.5);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(String(weight), mx, my - 1);
}

function colorByCost(cost: number): [number, number, number] {
  if (cost <= 2) return [120, 220, 145];
  if (cost <= 5) return [255, 220, 100];
  if (cost <= 8) return [255, 175, 95];
  return [255, 120, 110];
}

export function RouteOscillationVisualizer() {
  const buttons: Button[] = [];

  let playing = true;
  let dynamicMetric = true;
  let topTraffic = 0.5;
  let topCongestion = 0.5;
  let bottomCongestion = 0.5;
  let tieFlip = false;
  let tick = 0;
  let lastTick = 0;

  const reset = () => {
    playing = false;
    dynamicMetric = true;
    topTraffic = 0.5;
    topCongestion = 0.5;
    bottomCongestion = 0.5;
    tieFlip = false;
    tick = 0;
  };

  const step = () => {
    const targetTop = (() => {
      const topCost = 1 + Math.round(topCongestion * 9);
      const bottomCost = 1 + Math.round(bottomCongestion * 9);
      if (topCost === bottomCost) {
        tieFlip = !tieFlip;
        return tieFlip ? 1 : 0;
      }
      return topCost < bottomCost ? 1 : 0;
    })();

    topTraffic += (targetTop - topTraffic) * 0.48;

    if (dynamicMetric) {
      topCongestion = topCongestion * 0.65 + topTraffic * 0.35;
      bottomCongestion = bottomCongestion * 0.65 + (1 - topTraffic) * 0.35;
    } else {
      topCongestion = 0.5;
      bottomCongestion = 0.5;
    }

    tick += 1;
  };

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    buttons.length = 0;

    if (playing && p.frameCount - lastTick > 24) {
      step();
      lastTick = p.frameCount;
    }

    const nodeA = getNode("A");
    const nodeB = getNode("B");
    const nodeC = getNode("C");
    const nodeD = getNode("D");

    const costTop = 1 + Math.round(topCongestion * 9);
    const costBottom = 1 + Math.round(bottomCongestion * 9);
    const totalTop = 1 + costTop;
    const totalBottom = 1 + costBottom;

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("Oscilacao de rota em Link State", 18, 14);
    p.fill(132);
    p.textSize(8.4);
    p.text("Metrica dinamica + mudanca global de rota pode gerar alternancia continua.", 18, 30);

    drawEdge(p, nodeA, nodeB, [120, 190, 255], 1, topTraffic);
    drawEdge(p, nodeB, nodeD, colorByCost(costTop), costTop, topTraffic);
    drawEdge(p, nodeA, nodeC, [120, 190, 255], 1, 1 - topTraffic);
    drawEdge(p, nodeC, nodeD, colorByCost(costBottom), costBottom, 1 - topTraffic);

    drawNode(p, nodeA, [140, 180, 255]);
    drawNode(p, nodeB, [165, 190, 215]);
    drawNode(p, nodeC, [165, 190, 215]);
    drawNode(p, nodeD, [140, 180, 255]);

    for (let i = 0; i < 12; i += 1) {
      const flowTop = ((p.frameCount * 0.01 + i / 12) % 1);
      const xTop = p.lerp(nodeA.x, nodeD.x, flowTop);
      const yTop = p.lerp(nodeA.y, nodeD.y, flowTop < 0.5 ? flowTop * 2 * 0.5 : (1 - flowTop) * 2 * 0.5);
      p.noStroke();
      p.fill(120, 220, 255, 130 * topTraffic + 20);
      p.circle(xTop, yTop + (flowTop < 0.5 ? -20 : -20), 3);

      const flowBottom = ((p.frameCount * 0.012 + i / 12 + 0.3) % 1);
      const xBottom = p.lerp(nodeA.x, nodeD.x, flowBottom);
      const yBottom = p.lerp(nodeA.y, nodeD.y, flowBottom < 0.5 ? flowBottom * 2 * 0.5 : (1 - flowBottom) * 2 * 0.5);
      p.fill(255, 220, 110, 130 * (1 - topTraffic) + 20);
      p.circle(xBottom, yBottom + (flowBottom < 0.5 ? 20 : 20), 3);
    }

    const panelX = 560;
    const panelY = 14;
    const panelW = p.width - panelX - 14;

    p.fill(12, 20, 35);
    p.stroke(120, 145, 175, 90);
    p.rect(panelX, panelY, panelW, 190, 8);

    p.noStroke();
    p.fill(190);
    p.textSize(9.5);
    p.text(`tick: ${tick}`, panelX + 10, panelY + 12);
    p.text(`caminho A-B-D: ${totalTop}`, panelX + 10, panelY + 30);
    p.text(`caminho A-C-D: ${totalBottom}`, panelX + 10, panelY + 46);
    p.text(`trafego via B: ${(topTraffic * 100).toFixed(0)}%`, panelX + 10, panelY + 62);
    p.text(`trafego via C: ${((1 - topTraffic) * 100).toFixed(0)}%`, panelX + 10, panelY + 78);

    p.fill(130);
    p.textSize(8.2);
    p.text(
      "Quando todos mudam para o caminho mais barato ao mesmo tempo, o custo pode inverter e gerar oscilacao.",
      panelX + 10,
      panelY + 98,
      panelW - 18,
    );

    drawButton(p, buttons, "toggle", panelX + 10, panelY + 145, playing ? "Pause" : "Play", playing);
    drawButton(p, buttons, "metric", panelX + 110, panelY + 145, dynamicMetric ? "Metrica ON" : "Metrica OFF", dynamicMetric);
    drawButton(p, buttons, "reset", panelX + 210, panelY + 145, "Reiniciar", false);
  };

  const mousePressed = (p: p5) => {
    const hit = hitButton(p, buttons);
    if (!hit) return;

    if (hit.id === "toggle") {
      playing = !playing;
      return;
    }

    if (hit.id === "metric") {
      dynamicMetric = !dynamicMetric;
      return;
    }

    if (hit.id === "reset") {
      reset();
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={224} />;
}

export function CountToInfinityVisualizer() {
  const buttons: Button[] = [];

  const RIP_INF = 16;
  let playing = true;
  let splitHorizon = false;
  let iteration = 0;
  let r2ToD = 2;
  let r15ToD = 2;
  let valuesR2 = [2];
  let valuesR15 = [2];
  let lastTick = 0;

  const reset = () => {
    playing = false;
    iteration = 0;
    r2ToD = 2;
    r15ToD = 2;
    valuesR2 = [2];
    valuesR15 = [2];
  };

  const step = () => {
    if (splitHorizon) {
      if (iteration === 0) {
        r2ToD = RIP_INF;
        r15ToD = RIP_INF;
      }
      iteration += 1;
      valuesR2.push(r2ToD);
      valuesR15.push(r15ToD);
      return;
    }

    if (r2ToD >= RIP_INF && r15ToD >= RIP_INF) {
      iteration += 1;
      valuesR2.push(r2ToD);
      valuesR15.push(r15ToD);
      return;
    }

    if (iteration % 2 === 0) {
      r2ToD = Math.min(RIP_INF, r15ToD + 1);
    } else {
      r15ToD = Math.min(RIP_INF, r2ToD + 1);
    }

    iteration += 1;
    valuesR2.push(r2ToD);
    valuesR15.push(r15ToD);
  };

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    buttons.length = 0;

    if (playing && p.frameCount - lastTick > 34) {
      step();
      lastTick = p.frameCount;
    }

    const leftX = 18;
    const topY = 16;

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("Count-to-Infinity (Distance Vector)", leftX, topY);
    p.fill(132);
    p.textSize(8.4);
    p.text("Sem Split Horizon os custos podem subir em loop: 3,4,5,...,inf.", leftX, topY + 16);

    const nR2: Node = { id: "R2", x: 120, y: 94 };
    const nR15: Node = { id: "R1.5", x: 250, y: 48 };
    const nR3: Node = { id: "R3", x: 250, y: 140 };
    const nD: Node = { id: "D", x: 390, y: 94 };

    drawEdge(p, nR2, nR15, [130, 180, 240], 1, 0.4);
    drawEdge(p, nR2, nR3, [130, 180, 240], 1, 0.7);
    drawEdge(p, nR3, nD, [255, 110, 100], RIP_INF, 0.1);

    p.stroke(255, 120, 110);
    p.strokeWeight(2);
    p.line(314, 106, 342, 82);
    p.line(314, 82, 342, 106);

    drawNode(p, nR2, [160, 200, 255]);
    drawNode(p, nR15, [160, 200, 255]);
    drawNode(p, nR3, [160, 200, 255]);
    drawNode(p, nD, [255, 150, 130]);

    const panelX = 430;
    const panelY = 16;
    const panelW = p.width - panelX - 14;

    p.fill(12, 20, 35);
    p.stroke(120, 145, 175, 90);
    p.rect(panelX, panelY, panelW, 236, 8);

    p.noStroke();
    p.fill(190);
    p.textSize(9.4);
    p.text(`iteracao: ${iteration}`, panelX + 10, panelY + 12);
    p.text(`modo: ${splitHorizon ? "Com Split Horizon" : "Sem Split Horizon"}`, panelX + 10, panelY + 28);
    p.text(`R2 -> D: ${r2ToD >= RIP_INF ? "inf" : r2ToD}`, panelX + 10, panelY + 44);
    p.text(`R1.5 -> D: ${r15ToD >= RIP_INF ? "inf" : r15ToD}`, panelX + 10, panelY + 60);

    p.fill(132);
    p.textSize(8.2);
    p.text(
      splitHorizon
        ? "Poison reverse evita o feedback entre vizinhos e acelera a convergencia."
        : "Vizinho aprende valor antigo do outro e reforca um caminho fantasma.",
      panelX + 10,
      panelY + 78,
      panelW - 18,
    );

    const chartX = panelX + 10;
    const chartY = panelY + 116;
    const chartW = panelW - 20;
    const chartH = 68;

    p.noFill();
    p.stroke(100, 120, 150, 120);
    p.rect(chartX, chartY, chartW, chartH, 5);

    const maxPoints = Math.max(2, valuesR2.length - 1);
    const maxY = RIP_INF;

    p.noFill();
    p.stroke(255, 170, 110);
    p.beginShape();
    valuesR2.forEach((value, idx) => {
      const x = chartX + (idx / maxPoints) * (chartW - 8) + 4;
      const y = chartY + chartH - (Math.min(value, maxY) / maxY) * (chartH - 10) - 4;
      p.vertex(x, y);
    });
    p.endShape();

    p.stroke(120, 220, 255);
    p.beginShape();
    valuesR15.forEach((value, idx) => {
      const x = chartX + (idx / maxPoints) * (chartW - 8) + 4;
      const y = chartY + chartH - (Math.min(value, maxY) / maxY) * (chartH - 10) - 4;
      p.vertex(x, y);
    });
    p.endShape();

    p.noStroke();
    p.fill(255, 170, 110);
    p.textSize(7.8);
    p.text("R2", chartX + 4, chartY + 8);
    p.fill(120, 220, 255);
    p.text("R1.5", chartX + 28, chartY + 8);

    drawButton(p, buttons, "toggle", panelX + 10, panelY + 198, playing ? "Pause" : "Play", playing);
    drawButton(p, buttons, "step", panelX + 110, panelY + 198, "Passo", false);
    drawButton(p, buttons, "mode", panelX + 210, panelY + 198, splitHorizon ? "Split ON" : "Split OFF", splitHorizon);
    drawButton(p, buttons, "reset", panelX + 310, panelY + 198, "Reiniciar", false);
  };

  const mousePressed = (p: p5) => {
    const hit = hitButton(p, buttons);
    if (!hit) return;

    if (hit.id === "toggle") {
      playing = !playing;
      return;
    }

    if (hit.id === "step") {
      step();
      return;
    }

    if (hit.id === "mode") {
      splitHorizon = !splitHorizon;
      reset();
      return;
    }

    if (hit.id === "reset") {
      reset();
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={266} />;
}

export function OspfVsRipConvergenceRaceVisualizer() {
  const buttons: Button[] = [];

  let playing = true;
  let timeSec = 0;
  let speed = 1;

  const reset = () => {
    playing = false;
    timeSec = 0;
  };

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const drawHalf = (
    p: p5,
    x: number,
    title: string,
    convergedAt: number,
    color: [number, number, number],
  ) => {
    const w = p.width / 2 - 20;
    const y = 48;

    p.fill(12, 20, 35);
    p.stroke(120, 145, 175, 90);
    p.rect(x, y, w, 220, 8);

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(title, x + 10, y + 10);

    const progress = Math.max(0, Math.min(1, timeSec / convergedAt));

    const r1: Node = { id: "R1", x: x + 70, y: y + 80 };
    const r2: Node = { id: "R2", x: x + 170, y: y + 80 };
    const r3: Node = { id: "R3", x: x + 270, y: y + 80 };

    const failColor: [number, number, number] = [255, 120, 110];
    const altColor: [number, number, number] = progress > 0.7 ? [120, 220, 145] : [120, 170, 220];

    drawEdge(p, r1, r2, [120, 170, 220], 1, 0.5);
    drawEdge(p, r2, r3, failColor, 99, 0.1);
    drawEdge(p, r1, r3, altColor, 2, progress);

    p.stroke(255, 120, 110);
    p.strokeWeight(2);
    p.line(x + 206, y + 66, x + 234, y + 94);
    p.line(x + 234, y + 66, x + 206, y + 94);

    drawNode(p, r1, [160, 200, 255]);
    drawNode(p, r2, [160, 200, 255]);
    drawNode(p, r3, [160, 200, 255]);

    p.noFill();
    p.stroke(100, 120, 150, 120);
    p.rect(x + 10, y + 132, w - 20, 14, 4);

    p.noStroke();
    p.fill(color[0], color[1], color[2], 220);
    p.rect(x + 11, y + 133, (w - 22) * progress, 12, 3);

    p.fill(190);
    p.textSize(8.4);
    p.text(`tempo: ${timeSec.toFixed(2)}s`, x + 10, y + 154);
    p.text(`convergencia: ${(progress * 100).toFixed(0)}%`, x + 10, y + 168);
    p.text(progress >= 1 ? "status: convergiu" : "status: propagando", x + 10, y + 182);
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    buttons.length = 0;

    if (playing) {
      timeSec = Math.min(3.2, timeSec + (p.deltaTime / 1000) * speed);
      if (timeSec >= 3.2) {
        playing = false;
      }
    }

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("OSPF vs RIP: corrida de convergencia", 18, 14);
    p.fill(132);
    p.textSize(8.4);
    p.text("Mesma falha, tempos diferentes: flooding + Dijkstra (OSPF) vs iteracoes (RIP).", 18, 30);

    drawHalf(p, 18, "OSPF (Link State)", 0.25, [120, 220, 145]);
    drawHalf(p, p.width / 2 + 2, "RIP (Distance Vector)", 3.0, [255, 210, 100]);

    p.noStroke();
    p.fill(130);
    p.textSize(8.3);
    p.text(
      "Leitura: no painel OSPF a barra fecha quase instantaneamente. No RIP a convergencia ocorre por rodadas.",
      18,
      278,
      p.width - 36,
    );

    drawButton(p, buttons, "toggle", 18, 300, playing ? "Pause" : "Play", playing);
    drawButton(p, buttons, "slow", 118, 300, speed < 1 ? "Vel 0.5x" : "Vel 1x", speed < 1);
    drawButton(p, buttons, "reset", 218, 300, "Reiniciar", false);
  };

  const mousePressed = (p: p5) => {
    const hit = hitButton(p, buttons);
    if (!hit) return;

    if (hit.id === "toggle") {
      playing = !playing;
      return;
    }

    if (hit.id === "slow") {
      speed = speed < 1 ? 1 : 0.5;
      return;
    }

    if (hit.id === "reset") {
      reset();
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={334} />;
}

export function MultipathLoadDistributionVisualizer() {
  const buttons: Button[] = [];

  let playing = true;
  let adaptive = true;
  let topTraffic = 0.5;
  let topCongestion = 0.5;
  let bottomCongestion = 0.5;
  let tieFlip = false;
  let tick = 0;
  let lastTick = 0;

  const reset = () => {
    playing = false;
    adaptive = true;
    topTraffic = 0.5;
    topCongestion = 0.5;
    bottomCongestion = 0.5;
    tieFlip = false;
    tick = 0;
  };

  const step = () => {
    const topCost = 1 + Math.round(topCongestion * 9);
    const bottomCost = 1 + Math.round(bottomCongestion * 9);

    let targetTop = 0.5;

    if (adaptive) {
      const invTop = 1 / Math.max(1, topCost);
      const invBottom = 1 / Math.max(1, bottomCost);
      targetTop = invTop / (invTop + invBottom);
    } else {
      if (topCost === bottomCost) {
        tieFlip = !tieFlip;
        targetTop = tieFlip ? 1 : 0;
      } else {
        targetTop = topCost < bottomCost ? 1 : 0;
      }
    }

    const alpha = adaptive ? 0.18 : 0.5;
    topTraffic += (targetTop - topTraffic) * alpha;

    topCongestion = topCongestion * 0.7 + topTraffic * 0.3;
    bottomCongestion = bottomCongestion * 0.7 + (1 - topTraffic) * 0.3;

    tick += 1;
  };

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    buttons.length = 0;

    if (playing && p.frameCount - lastTick > 24) {
      step();
      lastTick = p.frameCount;
    }

    const nodeA = getNode("A");
    const nodeB = getNode("B");
    const nodeC = getNode("C");
    const nodeD = getNode("D");

    const costTop = 1 + Math.round(topCongestion * 9);
    const costBottom = 1 + Math.round(bottomCongestion * 9);

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("Multipath load distribution", 18, 14);
    p.fill(132);
    p.textSize(8.4);
    p.text("Adaptive mode divide carga. Sem adaptive, rede tende a pular entre 100/0 e 0/100.", 18, 30);

    drawEdge(p, nodeA, nodeB, [120, 190, 255], 1, topTraffic);
    drawEdge(p, nodeB, nodeD, colorByCost(costTop), costTop, topTraffic);
    drawEdge(p, nodeA, nodeC, [120, 190, 255], 1, 1 - topTraffic);
    drawEdge(p, nodeC, nodeD, colorByCost(costBottom), costBottom, 1 - topTraffic);

    drawNode(p, nodeA, [140, 180, 255]);
    drawNode(p, nodeB, [165, 190, 215]);
    drawNode(p, nodeC, [165, 190, 215]);
    drawNode(p, nodeD, [140, 180, 255]);

    const panelX = 560;
    const panelY = 14;
    const panelW = p.width - panelX - 14;

    p.fill(12, 20, 35);
    p.stroke(120, 145, 175, 90);
    p.rect(panelX, panelY, panelW, 200, 8);

    p.noStroke();
    p.fill(190);
    p.textSize(9.4);
    p.text(`tick: ${tick}`, panelX + 10, panelY + 12);
    p.text(`modo: ${adaptive ? "Adaptive multipath" : "Single best path"}`, panelX + 10, panelY + 30);
    p.text(`via B: ${(topTraffic * 100).toFixed(0)}%`, panelX + 10, panelY + 46);
    p.text(`via C: ${((1 - topTraffic) * 100).toFixed(0)}%`, panelX + 10, panelY + 62);
    p.text(`custo B-D: ${costTop}`, panelX + 10, panelY + 78);
    p.text(`custo C-D: ${costBottom}`, panelX + 10, panelY + 94);

    p.fill(132);
    p.textSize(8.2);
    p.text(
      adaptive
        ? "Distribuicao proporcional reduz picos de congestionamento e evita alternancia brusca."
        : "Sem multipath, o algoritmo escolhe um caminho por vez e pode oscilar.",
      panelX + 10,
      panelY + 114,
      panelW - 18,
    );

    drawButton(p, buttons, "toggle", panelX + 10, panelY + 158, playing ? "Pause" : "Play", playing);
    drawButton(p, buttons, "mode", panelX + 110, panelY + 158, adaptive ? "Adaptive ON" : "Adaptive OFF", adaptive);
    drawButton(p, buttons, "reset", panelX + 210, panelY + 158, "Reiniciar", false);
  };

  const mousePressed = (p: p5) => {
    const hit = hitButton(p, buttons);
    if (!hit) return;

    if (hit.id === "toggle") {
      playing = !playing;
      return;
    }

    if (hit.id === "mode") {
      adaptive = !adaptive;
      return;
    }

    if (hit.id === "reset") {
      reset();
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={232} />;
}

export function DistanceVectorLoopTopologyVisualizer() {
  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("Topologia com loop implicito (count-to-infinity)", 18, 14);
    p.fill(132);
    p.textSize(8.4);
    p.text("R2 aprende rota para D por dois vizinhos e pode reforcar caminho fantasma.", 18, 30);

    const r1: Node = { id: "R1", x: 90, y: 94 };
    const r2: Node = { id: "R2", x: 190, y: 94 };
    const r3: Node = { id: "R3", x: 300, y: 94 };
    const r4: Node = { id: "R4", x: 410, y: 94 };
    const r15: Node = { id: "R1.5", x: 190, y: 36 };

    drawEdge(p, r1, r2, [120, 170, 220], 1, 0.35);
    drawEdge(p, r2, r3, [120, 170, 220], 1, 0.5);
    drawEdge(p, r3, r4, [255, 120, 110], 1, 0.15);
    drawEdge(p, r2, r15, [120, 170, 220], 1, 0.4);

    p.stroke(255, 120, 110);
    p.strokeWeight(2);
    p.line(338, 78, 372, 110);
    p.line(372, 78, 338, 110);

    drawNode(p, r1, [160, 200, 255]);
    drawNode(p, r2, [160, 200, 255]);
    drawNode(p, r3, [160, 200, 255]);
    drawNode(p, r4, [255, 150, 130]);
    drawNode(p, r15, [160, 200, 255]);

    p.noStroke();
    p.fill(255, 170, 110);
    p.textSize(8.3);
    p.text("falha R3-R4", 338, 118);

    p.fill(130);
    p.textSize(8.1);
    p.text(
      "Sem Split Horizon: R2 e R1.5 podem se retroalimentar com metricas antigas (3,4,5,...).",
      18,
      132,
      p.width - 36,
    );
  };

  return <P5Sketch setup={setup} draw={draw} height={162} />;
}

export function OspfAreasHierarchyVisualizer() {
  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("OSPF Areas: backbone e areas perifericas", 18, 14);
    p.fill(132);
    p.textSize(8.4);
    p.text("ABRs conectam areas ao backbone (Area 0).", 18, 30);

    const area = (
      x: number,
      y: number,
      w: number,
      h: number,
      label: string,
      count: string,
      color: [number, number, number],
    ) => {
      p.fill(color[0], color[1], color[2], 28);
      p.stroke(color[0], color[1], color[2], 120);
      p.rect(x, y, w, h, 8);
      p.noStroke();
      p.fill(color[0], color[1], color[2]);
      p.textSize(8.5);
      p.text(`${label} (${count})`, x + 8, y + 8);
    };

    area(300, 44, 190, 72, "Area 1", "10 R", [120, 180, 255]);
    area(518, 88, 150, 66, "Area 2", "8 R", [120, 220, 145]);
    area(300, 156, 190, 66, "Area 3", "6 R", [255, 185, 120]);
    area(86, 96, 180, 72, "Area 0", "5 R", [190, 190, 210]);

    const abr0a: Node = { id: "ABR", x: 270, y: 120 };
    const abr1a: Node = { id: "ABR", x: 306, y: 82 };
    const abr2a: Node = { id: "ABR", x: 520, y: 118 };
    const abr3a: Node = { id: "ABR", x: 306, y: 186 };

    drawEdge(p, abr0a, abr1a, [170, 210, 255], 1, 0.5);
    drawEdge(p, abr0a, abr2a, [170, 210, 255], 1, 0.5);
    drawEdge(p, abr0a, abr3a, [170, 210, 255], 1, 0.5);

    [abr0a, abr1a, abr2a, abr3a].forEach((node) => {
      p.stroke(255, 210, 110, 220);
      p.strokeWeight(2);
      p.fill(14, 22, 35);
      p.circle(node.x, node.y, 26);
      p.noStroke();
      p.fill(255, 210, 110);
      p.textSize(7.6);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("ABR", node.x, node.y + 0.2);
    });

    p.noStroke();
    p.fill(130);
    p.textSize(8.2);
    p.text(
      "Dijkstra roda por area. Inter-area passa por ABRs e Area 0, reduzindo overhead global.",
      18,
      232,
      p.width - 36,
    );
  };

  return <P5Sketch setup={setup} draw={draw} height={258} />;
}

export function OspfInterAreaFlowVisualizer() {
  const buttons: Button[] = [];

  const steps = [
    "1) R1 consulta LSDB local",
    "2) R1 envia para ABR-1-0",
    "3) ABR-1-0 usa Area 0",
    "4) Backbone encaminha pacote",
    "5) Backbone envia para ABR-2-0",
    "6) ABR-2-0 entra na Area 2",
    "7) ABR-2-0 envia para R6",
    "8) R6 recebe o pacote",
  ];

  let playing = true;
  let stepIndex = 0;
  let lastTick = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    buttons.length = 0;

    if (playing && p.frameCount - lastTick > 34) {
      stepIndex = (stepIndex + 1) % steps.length;
      lastTick = p.frameCount;
    }

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("Fluxo inter-area (Area 1 -> Area 0 -> Area 2)", 18, 14);
    p.fill(132);
    p.textSize(8.4);
    p.text("Pacote sai de R1, cruza ABRs no backbone e chega em R6.", 18, 30);

    const areaCard = (
      x: number,
      y: number,
      w: number,
      h: number,
      label: string,
      color: [number, number, number],
    ) => {
      p.fill(color[0], color[1], color[2], 28);
      p.stroke(color[0], color[1], color[2], 120);
      p.rect(x, y, w, h, 8);
      p.noStroke();
      p.fill(color[0], color[1], color[2]);
      p.textSize(8.4);
      p.text(label, x + 8, y + 8);
    };

    areaCard(70, 58, 180, 132, "Area 1", [120, 180, 255]);
    areaCard(276, 96, 190, 58, "Area 0 (Backbone)", [190, 190, 210]);
    areaCard(492, 58, 180, 132, "Area 2", [120, 220, 145]);

    const r1: Node = { id: "R1", x: 130, y: 124 };
    const abr10: Node = { id: "A1", x: 224, y: 124 };
    const b0: Node = { id: "B0", x: 372, y: 124 };
    const abr20: Node = { id: "A2", x: 518, y: 124 };
    const r6: Node = { id: "R6", x: 622, y: 124 };

    const activeSeg =
      stepIndex <= 1 ? 0 : stepIndex <= 4 ? 1 : stepIndex <= 6 ? 2 : 2;

    drawEdge(p, r1, abr10, activeSeg === 0 ? [120, 220, 255] : [120, 170, 220], 5, activeSeg === 0 ? 0.7 : 0.22);
    drawEdge(p, abr10, b0, activeSeg === 1 ? [255, 220, 110] : [120, 170, 220], 3, activeSeg === 1 ? 0.7 : 0.22);
    drawEdge(p, b0, abr20, activeSeg === 1 ? [255, 220, 110] : [120, 170, 220], 3, activeSeg === 1 ? 0.7 : 0.22);
    drawEdge(p, abr20, r6, activeSeg === 2 ? [120, 220, 145] : [120, 170, 220], 1, activeSeg === 2 ? 0.7 : 0.22);

    drawNode(p, r1, [140, 190, 255]);
    drawNode(p, abr10, [255, 210, 110]);
    drawNode(p, b0, [185, 190, 215]);
    drawNode(p, abr20, [255, 210, 110]);
    drawNode(p, r6, [140, 220, 160]);

    p.noStroke();
    p.fill(170);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("ABR-1-0", abr10.x, abr10.y + 22);
    p.text("ABR-2-0", abr20.x, abr20.y + 22);

    let px = r1.x;
    let py = r1.y;
    if (stepIndex === 1) {
      const t = ((p.frameCount - lastTick + 34) % 34) / 34;
      px = p.lerp(r1.x, abr10.x, t);
      py = p.lerp(r1.y, abr10.y, t);
    } else if (stepIndex === 3 || stepIndex === 4) {
      const t = ((p.frameCount - lastTick + 34) % 34) / 34;
      if (stepIndex === 3) {
        px = p.lerp(abr10.x, b0.x, t);
        py = p.lerp(abr10.y, b0.y, t);
      } else {
        px = p.lerp(b0.x, abr20.x, t);
        py = p.lerp(b0.y, abr20.y, t);
      }
    } else if (stepIndex === 6) {
      const t = ((p.frameCount - lastTick + 34) % 34) / 34;
      px = p.lerp(abr20.x, r6.x, t);
      py = p.lerp(abr20.y, r6.y, t);
    } else if (stepIndex >= 7) {
      px = r6.x;
      py = r6.y;
    } else if (stepIndex === 2) {
      px = abr10.x;
      py = abr10.y;
    } else if (stepIndex === 5) {
      px = abr20.x;
      py = abr20.y;
    }

    p.fill(120, 220, 255);
    p.circle(px, py - 14, 10);

    const panelX = 700;
    const panelY = 14;
    const panelW = p.width - panelX - 14;
    p.fill(12, 20, 35);
    p.stroke(120, 145, 175, 90);
    p.rect(panelX, panelY, panelW, 210, 8);

    p.noStroke();
    p.fill(195);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text(`Passo atual: ${stepIndex + 1}/8`, panelX + 10, panelY + 12);

    steps.forEach((item, idx) => {
      p.fill(idx === stepIndex ? 255 : 140);
      p.text(item, panelX + 10, panelY + 30 + idx * 18);
    });

    drawButton(p, buttons, "toggle", panelX + 10, panelY + 180, playing ? "Pause" : "Play", playing);
    drawButton(p, buttons, "step", panelX + 110, panelY + 180, "Passo", false);
    drawButton(p, buttons, "reset", panelX + 210, panelY + 180, "Reiniciar", false);
  };

  const mousePressed = (p: p5) => {
    const hit = hitButton(p, buttons);
    if (!hit) return;

    if (hit.id === "toggle") {
      playing = !playing;
      return;
    }

    if (hit.id === "step") {
      stepIndex = (stepIndex + 1) % steps.length;
      return;
    }

    if (hit.id === "reset") {
      stepIndex = 0;
      playing = false;
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={236} />;
}

export function BgpSessionsTopologyVisualizer() {
  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("Topologia conceitual de sessoes BGP", 18, 14);
    p.fill(132);
    p.textSize(8.3);
    p.text("eBGP conecta ASes diferentes; iBGP distribui rotas dentro do mesmo AS.", 18, 30);

    const asCard = (x: number, y: number, w: number, h: number, label: string, c: [number, number, number]) => {
      p.fill(c[0], c[1], c[2], 26);
      p.stroke(c[0], c[1], c[2], 120);
      p.rect(x, y, w, h, 8);
      p.noStroke();
      p.fill(c[0], c[1], c[2]);
      p.textSize(8.5);
      p.text(label, x + 8, y + 8);
    };

    asCard(60, 54, 300, 150, "Google AS15169", [120, 180, 255]);
    asCard(410, 54, 300, 150, "AT&T AS701", [255, 185, 120]);

    const r1: Node = { id: "R1", x: 155, y: 106 };
    const r3: Node = { id: "R3", x: 275, y: 150 };
    const r2: Node = { id: "R2", x: 475, y: 106 };
    const r4: Node = { id: "R4", x: 565, y: 138 };
    const r5: Node = { id: "R5", x: 655, y: 138 };

    drawEdge(p, r1, r2, [255, 220, 110], 1, 0.7);
    drawEdge(p, r1, r3, [120, 175, 220], 1, 0.35);
    drawEdge(p, r2, r4, [120, 175, 220], 1, 0.35);
    drawEdge(p, r4, r5, [120, 175, 220], 1, 0.35);

    drawNode(p, r1, [140, 190, 255]);
    drawNode(p, r3, [140, 190, 255]);
    drawNode(p, r2, [255, 195, 130]);
    drawNode(p, r4, [255, 195, 130]);
    drawNode(p, r5, [255, 195, 130]);

    p.noStroke();
    p.fill(255, 220, 110);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(8.2);
    p.text("eBGP", (r1.x + r2.x) / 2, 80);

    p.fill(140);
    p.text("iBGP", (r1.x + r3.x) / 2, 132);
    p.text("iBGP", (r2.x + r4.x) / 2, 118);

    p.textAlign(p.LEFT, p.TOP);
    p.fill(130);
    p.textSize(8.2);
    p.text("R1 anuncia 8.8.8.0/24 para R2 via eBGP.", 18, 214);
    p.text("R1 replica rotas externas para R3 via iBGP.", 18, 228);
  };

  return <P5Sketch setup={setup} draw={draw} height={250} />;
}

export function BgpRouteAnnouncementVisualizer() {
  const buttons: Button[] = [];
  const steps = [
    "R2 anuncia prefixo 12.0.0.0/8 para R1",
    "R1 define NEXT-HOP=R2 e AS-PATH=[701]",
    "R1 anuncia 8.8.8.0/24 para R2",
    "R2 redistribui para R4 (iBGP)",
  ];

  let stepIndex = 0;
  let playing = true;
  let lastTick = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    buttons.length = 0;

    if (playing && p.frameCount - lastTick > 40) {
      stepIndex = (stepIndex + 1) % steps.length;
      lastTick = p.frameCount;
    }

    const r1: Node = { id: "R1", x: 170, y: 114 };
    const r2: Node = { id: "R2", x: 360, y: 114 };
    const r4: Node = { id: "R4", x: 560, y: 114 };

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("Anuncio e aprendizado de rotas BGP", 18, 14);
    p.fill(132);
    p.textSize(8.2);
    p.text("Observe prefixo, AS-PATH e NEXT-HOP mudando ao longo das etapas.", 18, 30);

    drawEdge(p, r1, r2, stepIndex === 0 || stepIndex === 2 ? [255, 220, 110] : [120, 170, 220], 1, stepIndex === 0 || stepIndex === 2 ? 0.7 : 0.22);
    drawEdge(p, r2, r4, stepIndex === 3 ? [120, 220, 145] : [120, 170, 220], 1, stepIndex === 3 ? 0.7 : 0.22);

    drawNode(p, r1, [140, 190, 255]);
    drawNode(p, r2, [255, 195, 130]);
    drawNode(p, r4, [255, 195, 130]);

    let from = r2;
    let to = r1;
    if (stepIndex === 2) {
      from = r1;
      to = r2;
    } else if (stepIndex === 3) {
      from = r2;
      to = r4;
    }

    const t = ((p.frameCount - lastTick + 40) % 40) / 40;
    const px = p.lerp(from.x, to.x, t);
    const py = p.lerp(from.y, to.y, t);
    p.noStroke();
    p.fill(120, 220, 255);
    p.circle(px, py - 16, 10);

    const panelX = 18;
    const panelY = 178;
    p.fill(12, 20, 35);
    p.stroke(120, 145, 175, 90);
    p.rect(panelX, panelY, p.width - 36, 130, 8);

    p.noStroke();
    p.fill(195);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(8.8);
    p.text(`Etapa ${stepIndex + 1}/4: ${steps[stepIndex]}`, panelX + 10, panelY + 12);

    const attrs =
      stepIndex <= 1
        ? [
            "Prefixo: 12.0.0.0/8",
            "AS-PATH: [701]",
            "NEXT-HOP: R2",
          ]
        : stepIndex === 2
          ? [
              "Prefixo: 8.8.8.0/24",
              "AS-PATH: [15169]",
              "NEXT-HOP: R1",
            ]
          : [
              "Prefixo: 8.8.8.0/24",
              "AS-PATH: [15169]",
              "NEXT-HOP: R1 (via R2)",
              "LOCAL-PREF: 75",
            ];

    attrs.forEach((line, idx) => {
      p.fill(140);
      p.text(line, panelX + 10, panelY + 32 + idx * 15);
    });

    drawButton(p, buttons, "toggle", panelX + 10, panelY + 98, playing ? "Pause" : "Play", playing);
    drawButton(p, buttons, "step", panelX + 112, panelY + 98, "Passo", false);
    drawButton(p, buttons, "reset", panelX + 214, panelY + 98, "Reiniciar", false);
  };

  const mousePressed = (p: p5) => {
    const hit = hitButton(p, buttons);
    if (!hit) return;
    if (hit.id === "toggle") {
      playing = !playing;
      return;
    }
    if (hit.id === "step") {
      stepIndex = (stepIndex + 1) % steps.length;
      return;
    }
    if (hit.id === "reset") {
      stepIndex = 0;
      playing = false;
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={320} />;
}

export function HotPotatoRoutingVisualizer() {
  const buttons: Button[] = [];
  let preferNyc = true;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    buttons.length = 0;

    const core: Node = { id: "CORE", x: 170, y: 124 };
    const nyc: Node = { id: "NYC", x: 360, y: 84 };
    const mia: Node = { id: "MIA", x: 360, y: 164 };
    const dst: Node = { id: "DST", x: 560, y: 124 };

    const nycCost = preferNyc ? 5 : 60;
    const miaCost = preferNyc ? 50 : 8;
    const chooseNyc = nycCost <= miaCost;

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("Hot-potato routing: sair rapido do AS", 18, 14);
    p.fill(132);
    p.textSize(8.2);
    p.text("BGP desempata por menor custo IGP ate o NEXT-HOP de saida.", 18, 30);

    drawEdge(p, core, nyc, chooseNyc ? [120, 220, 145] : [120, 170, 220], nycCost, chooseNyc ? 0.7 : 0.2);
    drawEdge(p, core, mia, !chooseNyc ? [120, 220, 145] : [120, 170, 220], miaCost, !chooseNyc ? 0.7 : 0.2);
    drawEdge(p, nyc, dst, chooseNyc ? [255, 220, 110] : [120, 170, 220], 1, chooseNyc ? 0.7 : 0.2);
    drawEdge(p, mia, dst, !chooseNyc ? [255, 220, 110] : [120, 170, 220], 1, !chooseNyc ? 0.7 : 0.2);

    drawNode(p, core, [140, 190, 255]);
    drawNode(p, nyc, [255, 195, 130]);
    drawNode(p, mia, [255, 195, 130]);
    drawNode(p, dst, [140, 220, 160]);

    const source = chooseNyc ? nyc : mia;
    const t = (p.frameCount % 45) / 45;
    const px = p.lerp(core.x, source.x, t);
    const py = p.lerp(core.y, source.y, t);
    p.noStroke();
    p.fill(120, 220, 255);
    p.circle(px, py - 14, 10);

    p.fill(135);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(8.5);
    p.text(`Custo IGP para NYC: ${nycCost} ms`, 18, 214);
    p.text(`Custo IGP para MIA: ${miaCost} ms`, 18, 228);
    p.fill(chooseNyc ? 120 : 255, chooseNyc ? 220 : 180, chooseNyc ? 145 : 120);
    p.text(`Saida escolhida: ${chooseNyc ? "NYC" : "MIA"}`, 18, 242);

    drawButton(p, buttons, "toggle", 18, 264, "Alternar cenario", false);
  };

  const mousePressed = (p: p5) => {
    const hit = hitButton(p, buttons);
    if (!hit) return;
    if (hit.id === "toggle") {
      preferNyc = !preferNyc;
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={300} />;
}

export function InterAsPacketFlowVisualizer() {
  const buttons: Button[] = [];

  const steps = [
    "Host AS1000 -> Roteador interno (OSPF)",
    "Roteador interno -> Borda AS1000 (OSPF)",
    "Borda AS1000 escolhe caminho BGP",
    "Saida AS1000 -> AS3000",
    "AS3000 encaminha internamente",
    "Borda AS3000 -> Borda AS2000 (BGP)",
    "Borda AS2000 -> host destino (OSPF)",
  ];

  let stepIndex = 0;
  let playing = true;
  let lastTick = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    buttons.length = 0;

    if (playing && p.frameCount - lastTick > 36) {
      stepIndex = (stepIndex + 1) % steps.length;
      lastTick = p.frameCount;
    }

    const card = (
      x: number,
      y: number,
      w: number,
      h: number,
      label: string,
      color: [number, number, number],
    ) => {
      p.fill(color[0], color[1], color[2], 25);
      p.stroke(color[0], color[1], color[2], 120);
      p.rect(x, y, w, h, 8);
      p.noStroke();
      p.fill(color[0], color[1], color[2]);
      p.textAlign(p.LEFT, p.TOP);
      p.textSize(8.5);
      p.text(label, x + 8, y + 8);
    };

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("Fluxo de pacote entre ASes (AS1000 -> AS3000 -> AS2000)", 18, 14);
    p.fill(132);
    p.textSize(8.2);
    p.text("OSPF atua dentro de cada AS e BGP decide os saltos entre ASes.", 18, 30);

    card(30, 58, 250, 130, "AS1000 (origem)", [120, 180, 255]);
    card(320, 58, 210, 130, "AS3000 (ISP)", [255, 185, 120]);
    card(570, 58, 250, 130, "AS2000 (destino)", [120, 220, 145]);

    const h1: Node = { id: "H1", x: 74, y: 124 };
    const i1: Node = { id: "I1", x: 150, y: 124 };
    const b1: Node = { id: "B1", x: 245, y: 124 };
    const p3: Node = { id: "P3", x: 425, y: 124 };
    const b3: Node = { id: "B3", x: 512, y: 124 };
    const b2: Node = { id: "B2", x: 610, y: 124 };
    const h2: Node = { id: "H2", x: 770, y: 124 };

    drawEdge(p, h1, i1, stepIndex === 0 ? [120, 220, 255] : [120, 165, 210], 1, stepIndex === 0 ? 0.7 : 0.2);
    drawEdge(p, i1, b1, stepIndex === 1 ? [120, 220, 255] : [120, 165, 210], 1, stepIndex === 1 ? 0.7 : 0.2);
    drawEdge(p, b1, p3, stepIndex === 3 ? [255, 200, 110] : [120, 165, 210], 1, stepIndex === 3 ? 0.7 : 0.2);
    drawEdge(p, p3, b3, stepIndex === 4 ? [255, 200, 110] : [120, 165, 210], 1, stepIndex === 4 ? 0.7 : 0.2);
    drawEdge(p, b3, b2, stepIndex === 5 ? [255, 200, 110] : [120, 165, 210], 1, stepIndex === 5 ? 0.7 : 0.2);
    drawEdge(p, b2, h2, stepIndex === 6 ? [120, 220, 145] : [120, 165, 210], 1, stepIndex === 6 ? 0.7 : 0.2);

    drawNode(p, h1, [140, 190, 255]);
    drawNode(p, i1, [140, 190, 255]);
    drawNode(p, b1, [255, 210, 110]);
    drawNode(p, p3, [255, 180, 130]);
    drawNode(p, b3, [255, 210, 110]);
    drawNode(p, b2, [255, 210, 110]);
    drawNode(p, h2, [140, 220, 160]);

    p.noStroke();
    p.fill(170);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(8);
    p.text("Host", h1.x, h1.y + 22);
    p.text("Interno", i1.x, i1.y + 22);
    p.text("Borda", b1.x, b1.y + 22);
    p.text("Core ISP", p3.x, p3.y + 22);
    p.text("Borda", b3.x, b3.y + 22);
    p.text("Borda", b2.x, b2.y + 22);
    p.text("Host", h2.x, h2.y + 22);

    p.fill(140);
    p.textAlign(p.LEFT, p.TOP);
    p.text("OSPF", 90, 172);
    p.text("BGP", 324, 172);
    p.text("OSPF", 690, 172);

    let from = h1;
    let to = i1;
    if (stepIndex === 1) {
      from = i1;
      to = b1;
    } else if (stepIndex === 2) {
      from = b1;
      to = b1;
    } else if (stepIndex === 3) {
      from = b1;
      to = p3;
    } else if (stepIndex === 4) {
      from = p3;
      to = b3;
    } else if (stepIndex === 5) {
      from = b3;
      to = b2;
    } else if (stepIndex >= 6) {
      from = b2;
      to = h2;
    }

    const t = stepIndex === 2 ? 1 : ((p.frameCount - lastTick + 36) % 36) / 36;
    const px = p.lerp(from.x, to.x, t);
    const py = p.lerp(from.y, to.y, t);
    p.fill(120, 220, 255);
    p.circle(px, py - 14, 10);

    const panelX = 18;
    const panelY = 200;
    p.fill(12, 20, 35);
    p.stroke(120, 145, 175, 90);
    p.rect(panelX, panelY, p.width - 36, 98, 8);

    p.noStroke();
    p.fill(195);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text(`Etapa ${stepIndex + 1}/${steps.length}: ${steps[stepIndex]}`, panelX + 10, panelY + 12);

    p.fill(135);
    p.textSize(8.2);
    p.text("Rota escolhida por BGP: AS1000 -> AS3000 -> AS2000", panelX + 10, panelY + 30);

    drawButton(p, buttons, "toggle", panelX + 10, panelY + 62, playing ? "Pause" : "Play", playing);
    drawButton(p, buttons, "step", panelX + 112, panelY + 62, "Passo", false);
    drawButton(p, buttons, "reset", panelX + 214, panelY + 62, "Reiniciar", false);
  };

  const mousePressed = (p: p5) => {
    const hit = hitButton(p, buttons);
    if (!hit) return;

    if (hit.id === "toggle") {
      playing = !playing;
      return;
    }

    if (hit.id === "step") {
      stepIndex = (stepIndex + 1) % steps.length;
      return;
    }

    if (hit.id === "reset") {
      stepIndex = 0;
      playing = false;
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={312} />;
}

export function BgpAsPathPolicyVisualizer() {
  const buttons: Button[] = [];
  let policyBlockCompetitor = true;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const drawAsNode = (p: p5, x: number, y: number, label: string, accent: [number, number, number]) => {
    p.stroke(accent[0], accent[1], accent[2], 220);
    p.strokeWeight(2);
    p.fill(14, 22, 35);
    p.circle(x, y, 72);
    p.noStroke();
    p.fill(accent[0], accent[1], accent[2]);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(8.8);
    p.text(label, x, y + 0.5);
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    buttons.length = 0;

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text("BGP: AS_PATH e politica de selecao", 18, 14);
    p.fill(132);
    p.textSize(8.4);
    p.text("A mesma rota pode ser aceita ou bloqueada por politica administrativa.", 18, 30);

    const google = { x: 120, y: 118 };
    const isp = { x: 320, y: 118 };
    const user = { x: 520, y: 118 };
    const competitor = { x: 320, y: 208 };

    drawAsNode(p, google.x, google.y, "AS 1\nGoogle", [120, 220, 255]);
    drawAsNode(p, isp.x, isp.y, "AS 2\nISP A", [160, 200, 255]);
    drawAsNode(p, user.x, user.y, "AS 3\nCliente", [120, 220, 145]);
    drawAsNode(p, competitor.x, competitor.y, "AS 4\nConcorrente", [255, 170, 110]);

    drawEdge(p, { id: "g", ...google }, { id: "i", ...isp }, [120, 180, 255], 1, 0.5);
    drawEdge(p, { id: "i", ...isp }, { id: "u", ...user }, [120, 180, 255], 1, 0.5);
    drawEdge(p, { id: "c", ...competitor }, { id: "i2", ...isp }, [255, 170, 110], 1, 0.35);

    p.noStroke();
    p.fill(200);
    p.textSize(8.2);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Rota A: AS_PATH [1]", 72, 172);
    p.text("Rota B: AS_PATH [4, 1]", 278, 250);

    const acceptedB = !policyBlockCompetitor;
    p.fill(acceptedB ? 120 : 255, acceptedB ? 220 : 140, acceptedB ? 145 : 120);
    p.text(
      policyBlockCompetitor
        ? "Politica ativa: bloquear AS 4 (concorrente)"
        : "Politica desativada: aceitar AS 4",
      18,
      274,
    );

    p.fill(130);
    p.textSize(8.1);
    p.text(
      "Decisao final: rota A permanece preferida quando a politica bloqueia o caminho via concorrente.",
      18,
      290,
      p.width - 36,
    );

    drawButton(
      p,
      buttons,
      "policy",
      18,
      310,
      policyBlockCompetitor ? "Politica ON" : "Politica OFF",
      policyBlockCompetitor,
    );
  };

  const mousePressed = (p: p5) => {
    const hit = hitButton(p, buttons);
    if (!hit) return;
    if (hit.id === "policy") {
      policyBlockCompetitor = !policyBlockCompetitor;
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={344} />;
}


