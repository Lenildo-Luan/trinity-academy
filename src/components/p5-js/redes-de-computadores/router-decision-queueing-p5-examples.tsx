"use client";

import type p5 from "p5";
import { P5Sketch } from "../p5-sketch";

type Vec2 = { x: number; y: number };

type PrefixRoute = {
  prefix: string;
  iface: string;
  bits: number;
  match: (ip: [number, number, number, number]) => boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function drawTitle(p: p5, title: string) {
  p.noStroke();
  p.fill(215);
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(13);
  p.text(title, p.width / 2, 8);
}

function drawNode(p: p5, pos: Vec2, label: string, color: [number, number, number], w = 86, h = 30) {
  p.fill(14, 20, 35);
  p.stroke(color[0], color[1], color[2], 140);
  p.strokeWeight(1.3);
  p.rect(pos.x - w / 2, pos.y - h / 2, w, h, 7);
  p.noStroke();
  p.fill(color[0], color[1], color[2]);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(9);
  p.text(label, pos.x, pos.y + 0.5);
}

function drawPacket(p: p5, x: number, y: number, color: [number, number, number], id?: number) {
  p.noStroke();
  p.fill(color[0], color[1], color[2]);
  p.rect(x - 6, y - 4, 12, 8, 2);
  if (id !== undefined) {
    p.fill(240);
    p.textSize(7);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(String(id), x, y - 6);
  }
}

function drawSparkline(p: p5, values: number[], x: number, y: number, w: number, h: number, maxValue: number) {
  p.noFill();
  p.stroke(110, 150, 220, 150);
  p.rect(x, y, w, h, 4);
  if (values.length < 2) return;
  p.noFill();
  p.stroke(120, 220, 255, 200);
  p.strokeWeight(1.4);
  p.beginShape();
  values.forEach((v, i) => {
    const xx = x + (i / (values.length - 1)) * (w - 8) + 4;
    const norm = clamp(v / Math.max(1, maxValue), 0, 1);
    const yy = y + h - 4 - norm * (h - 8);
    p.vertex(xx, yy);
  });
  p.endShape();
}

function ipToTuple(ip: string): [number, number, number, number] {
  const parts = ip.split(".").map((part) => Number(part));
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, parts[3] ?? 0];
}

function prefixMatcher(a: number, b: number, c: number, bits: number) {
  return (ip: [number, number, number, number]) => {
    if (bits === 0) return true;
    if (bits <= 8) return ip[0] === a;
    if (bits <= 16) return ip[0] === a && ip[1] === b;
    return ip[0] === a && ip[1] === b && ip[2] === c;
  };
}

export function LongestPrefixMatchVisualizer() {
  const scenarios = ["10.1.1.5", "10.1.2.10", "10.4.7.2", "11.0.0.9"];
  const routes: PrefixRoute[] = [
    { prefix: "10.0.0.0/8", iface: "0", bits: 8, match: prefixMatcher(10, 0, 0, 8) },
    { prefix: "10.1.0.0/16", iface: "1", bits: 16, match: prefixMatcher(10, 1, 0, 16) },
    { prefix: "10.1.1.0/24", iface: "2", bits: 24, match: prefixMatcher(10, 1, 1, 24) },
    { prefix: "10.1.2.0/24", iface: "1", bits: 24, match: prefixMatcher(10, 1, 2, 24) },
    { prefix: "0.0.0.0/0", iface: "3", bits: 0, match: () => true },
  ];

  let scenarioIndex = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Longest Prefix Match (LPM)");

    if (p.frameCount % 180 === 0) {
      scenarioIndex = (scenarioIndex + 1) % scenarios.length;
    }

    const currentIp = scenarios[scenarioIndex];
    const tuple = ipToTuple(currentIp);

    const matched = routes.filter((route) => route.match(tuple));
    const winner = matched.reduce((best, route) => (route.bits > best.bits ? route : best), matched[0]);

    p.noStroke();
    p.fill(170);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(`Destino atual: ${currentIp}`, 24, 38);
    p.text(`Regra: escolher o maior prefixo que coincide`, 24, 54);

    const rowX = 24;
    const rowY = 84;
    const rowW = p.width - 48;
    const rowH = 42;

    routes.forEach((route, index) => {
      const y = rowY + index * 48;
      const isMatch = route.match(tuple);
      const isWinner = isMatch && route.prefix === winner.prefix;

      p.stroke(isWinner ? 120 : 80, isWinner ? 220 : 100, isWinner ? 120 : 130, isWinner ? 220 : 90);
      p.fill(14, 22, 39);
      p.rect(rowX, y, rowW, rowH, 6);

      p.noStroke();
      p.fill(210);
      p.textAlign(p.LEFT, p.TOP);
      p.textSize(10);
      p.text(`${route.prefix} -> if${route.iface}`, rowX + 10, y + 9);

      p.fill(isMatch ? (isWinner ? 130 : 210) : 120, isMatch ? (isWinner ? 240 : 190) : 120, isMatch ? 130 : 120);
      p.textAlign(p.RIGHT, p.TOP);
      p.text(isWinner ? `MATCH ${route.bits} bits (VENCEDOR)` : isMatch ? `MATCH ${route.bits} bits` : "sem match", rowX + rowW - 10, y + 9);

      const meterX = rowX + 10;
      const meterY = y + 24;
      const meterW = rowW - 20;
      const meterH = 10;

      p.noStroke();
      p.fill(255, 255, 255, 12);
      p.rect(meterX, meterY, meterW, meterH, 2);
      p.fill(isMatch ? (isWinner ? 120 : 95) : 70, isMatch ? (isWinner ? 230 : 180) : 70, isMatch ? 120 : 80, 230);
      p.rect(meterX, meterY, (route.bits / 24) * meterW, meterH, 2);
    });

    p.noStroke();
    p.fill(140);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(`Saida escolhida: interface ${winner.iface}`, p.width / 2, p.height - 10);
  };

  return <P5Sketch setup={setup} draw={draw} height={350} />;
}

export function InputQueueContentionSimulator() {
  let nextId = 1;
  const queues: number[][] = [[], [], []];
  const outputQueue: number[] = [];
  let inTransit: { from: number; to: number; x: number; y: number; id: number } | null = null;
  let delivered = 0;
  let dropped = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Filas de Entrada e Contencao para a Mesma Saida");

    const inputNodes: Vec2[] = [
      { x: 86, y: 88 },
      { x: 86, y: 162 },
      { x: 86, y: 236 },
    ];
    const fabric = { x: p.width / 2, y: 162 };
    const output = { x: p.width - 90, y: 162 };

    p.stroke(75, 95, 135, 120);
    p.strokeWeight(1.4);
    inputNodes.forEach((input) => p.line(input.x + 44, input.y, fabric.x - 68, input.y));
    p.line(fabric.x + 68, fabric.y, output.x - 44, output.y);

    inputNodes.forEach((pos, idx) => drawNode(p, pos, `Entrada ${idx + 1}`, [0, 150, 255]));
    drawNode(p, fabric, "Fabric", [120, 220, 255], 116, 36);
    drawNode(p, output, "Saida 1", [255, 180, 50], 86, 30);

    const maxInputQueue = 8;
    if (p.frameCount % 14 === 0 && queues[0].length < maxInputQueue) queues[0].push(nextId++);
    if (p.frameCount % 21 === 0 && queues[1].length < maxInputQueue) queues[1].push(nextId++);
    if (p.frameCount % 19 === 0 && queues[2].length < maxInputQueue) queues[2].push(nextId++);

    for (let i = 0; i < queues.length; i += 1) {
      if (queues[i].length >= maxInputQueue && p.frameCount % (16 + i * 5) === 0) dropped += 1;
    }

    if (!inTransit) {
      const candidate = queues.findIndex((queue) => queue.length > 0);
      if (candidate >= 0) {
        const id = queues[candidate].shift() ?? 0;
        inTransit = { from: candidate, to: 0, x: inputNodes[candidate].x + 46, y: inputNodes[candidate].y, id };
      }
    }

    if (inTransit) {
      const targetX = fabric.x + 66;
      const targetY = output.y;
      const dx = targetX - inTransit.x;
      const dy = targetY - inTransit.y;
      const dist = Math.hypot(dx, dy);
      const speed = 2.2;
      if (dist <= speed) {
        outputQueue.push(inTransit.id);
        inTransit = null;
      } else {
        inTransit.x += (dx / dist) * speed;
        inTransit.y += (dy / dist) * speed;
      }
    }

    if (p.frameCount % 12 === 0 && outputQueue.length > 0) {
      outputQueue.shift();
      delivered += 1;
    }

    for (let i = 0; i < queues.length; i += 1) {
      const baseX = 185;
      const baseY = inputNodes[i].y;
      queues[i].slice(0, 6).forEach((id, idx) => drawPacket(p, baseX + idx * 14, baseY, [100, 170, 255], id % 100));
    }

    outputQueue.slice(0, 8).forEach((id, idx) => drawPacket(p, p.width - 198 + idx * 14, output.y + 30, [255, 180, 80], id % 100));

    if (inTransit) drawPacket(p, inTransit.x, inTransit.y, [120, 230, 140], inTransit.id % 100);

    p.noStroke();
    p.fill(150);
    p.textSize(9);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Qin1=${queues[0].length}  Qin2=${queues[1].length}  Qin3=${queues[2].length}`, 18, p.height - 44);
    p.text(`Qsaida=${outputQueue.length}  entregues=${delivered}  drops=${dropped}`, 18, p.height - 30);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

export function OutputQueueBottleneckSimulator() {
  let queueSize = 0;
  let delivered = 0;
  let dropped = 0;
  const history: number[] = [];

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Bottleneck: 4 Entradas -> 1 Saida");

    const inNodes: Vec2[] = [
      { x: 90, y: 86 },
      { x: 90, y: 136 },
      { x: 90, y: 186 },
      { x: 90, y: 236 },
    ];
    const outNode = { x: p.width - 96, y: 162 };
    const queueX = p.width / 2 - 26;
    const queueY = 78;
    const queueW = 52;
    const queueH = 170;

    inNodes.forEach((node, i) => {
      drawNode(p, node, `In ${i + 1}`, [0, 150, 255], 70, 24);
      p.stroke(65, 95, 130, 120);
      p.line(node.x + 36, node.y, queueX - 14, node.y + (162 - node.y) * 0.6);
    });

    drawNode(p, outNode, "Out 10G", [255, 180, 50], 90, 30);
    p.stroke(65, 95, 130, 120);
    p.line(queueX + queueW + 14, 162, outNode.x - 46, outNode.y);

    p.noFill();
    p.stroke(120, 220, 255, 120);
    p.rect(queueX, queueY, queueW, queueH, 6);

    const arrivalPerTick = 4;
    const servicePerTick = 1;
    const maxQueue = 36;

    queueSize += arrivalPerTick;
    if (queueSize > maxQueue) {
      dropped += queueSize - maxQueue;
      queueSize = maxQueue;
    }

    queueSize -= servicePerTick;
    queueSize = Math.max(0, queueSize);
    delivered += servicePerTick;

    history.push(queueSize);
    if (history.length > 90) history.shift();

    for (let i = 0; i < queueSize; i += 1) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const x = queueX + 7 + col * 14;
      const y = queueY + queueH - 12 - row * 12;
      drawPacket(p, x, y, [255, 170, 80]);
    }

    drawSparkline(p, history, p.width - 230, 66, 205, 84, maxQueue);

    p.noStroke();
    p.fill(160);
    p.textSize(9);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Taxa de chegada agregada: 40 Gbps", p.width - 230, 158);
    p.text("Taxa de saida: 10 Gbps", p.width - 230, 172);
    p.text(`Fila atual: ${queueSize} pacotes`, p.width - 230, 186);
    p.text(`Entregues: ${delivered}  Drops: ${dropped}`, p.width - 230, 200);

    p.fill(120);
    p.text("Grafico da ocupacao da fila", p.width - 230, 218);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

export function DropTailVsRedComparator() {
  let dtQueue = 0;
  let dtDrops = 0;
  let redQueue = 0;
  let redDrops = 0;
  const dtHistory: number[] = [];
  const redHistory: number[] = [];

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const simulateDropTail = () => {
    const maxQueue = 24;
    dtQueue += 3;
    if (dtQueue > maxQueue) {
      dtDrops += dtQueue - maxQueue;
      dtQueue = maxQueue;
    }
    dtQueue = Math.max(0, dtQueue - 1);
    dtHistory.push(dtQueue);
    if (dtHistory.length > 80) dtHistory.shift();
  };

  const simulateRed = () => {
    const maxQueue = 24;
    const minTh = 12;
    const maxTh = 20;

    for (let i = 0; i < 3; i += 1) {
      const q = redQueue;
      let dropProb = 0;
      if (q >= maxTh) dropProb = 0.7;
      else if (q >= minTh) dropProb = ((q - minTh) / (maxTh - minTh)) * 0.45;

      if (Math.random() < dropProb) redDrops += 1;
      else redQueue += 1;
    }

    if (redQueue > maxQueue) {
      redDrops += redQueue - maxQueue;
      redQueue = maxQueue;
    }

    redQueue = Math.max(0, redQueue - 1);
    redHistory.push(redQueue);
    if (redHistory.length > 80) redHistory.shift();
  };

  const drawPanel = (
    p: p5,
    x: number,
    y: number,
    title: string,
    queueSize: number,
    drops: number,
    history: number[],
    color: [number, number, number],
  ) => {
    const w = p.width / 2 - 26;
    const h = p.height - 52;

    p.stroke(color[0], color[1], color[2], 130);
    p.fill(12, 19, 33);
    p.rect(x, y, w, h, 8);

    p.noStroke();
    p.fill(color[0], color[1], color[2]);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(title, x + 10, y + 10);

    const queueX = x + 12;
    const queueY = y + 34;
    const queueW = w - 24;
    const queueH = 28;

    p.noFill();
    p.stroke(140, 170, 220, 80);
    p.rect(queueX, queueY, queueW, queueH, 4);
    p.noStroke();
    p.fill(color[0], color[1], color[2], 220);
    p.rect(queueX + 1, queueY + 1, ((queueSize / 24) * (queueW - 2)), queueH - 2, 3);

    drawSparkline(p, history, x + 12, y + 76, w - 24, 72, 24);

    p.fill(150);
    p.textSize(9);
    p.text(`Fila: ${queueSize}/24`, x + 12, y + 154);
    p.text(`Drops acumulados: ${drops}`, x + 12, y + 168);
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Drop-Tail vs RED");

    simulateDropTail();
    simulateRed();

    drawPanel(p, 12, 34, "Drop-Tail (descarta ao encher)", dtQueue, dtDrops, dtHistory, [255, 130, 120]);
    drawPanel(p, p.width / 2 + 2, 34, "RED (descarta de forma gradual)", redQueue, redDrops, redHistory, [120, 220, 255]);
  };

  return <P5Sketch setup={setup} draw={draw} height={260} />;
}

export function SchedulingDisciplinesComparator() {
  const labels = ["FIFO", "Prioridade", "Round Robin", "WFQ"];
  const queueStates = [
    { voip: 4, video: 4, bulk: 6 },
    { voip: 4, video: 4, bulk: 6 },
    { voip: 4, video: 4, bulk: 6 },
    { voip: 4, video: 4, bulk: 6 },
  ];

  let rrTurn = 0;
  let wfqDebt = { voip: 0, video: 0, bulk: 0 };

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const replenish = (state: { voip: number; video: number; bulk: number }) => {
    if (Math.random() < 0.35) state.voip += 1;
    if (Math.random() < 0.42) state.video += 1;
    if (Math.random() < 0.6) state.bulk += 1;
    state.voip = Math.min(state.voip, 8);
    state.video = Math.min(state.video, 8);
    state.bulk = Math.min(state.bulk, 8);
  };

  const pickFifo = (state: { voip: number; video: number; bulk: number }) => {
    if (state.bulk > 0) return "bulk" as const;
    if (state.video > 0) return "video" as const;
    if (state.voip > 0) return "voip" as const;
    return null;
  };

  const pickPriority = (state: { voip: number; video: number; bulk: number }) => {
    if (state.voip > 0) return "voip" as const;
    if (state.video > 0) return "video" as const;
    if (state.bulk > 0) return "bulk" as const;
    return null;
  };

  const pickRoundRobin = (state: { voip: number; video: number; bulk: number }) => {
    const order: Array<"voip" | "video" | "bulk"> = ["voip", "video", "bulk"];
    for (let i = 0; i < 3; i += 1) {
      const candidate = order[(rrTurn + i) % 3];
      if (state[candidate] > 0) {
        rrTurn = (rrTurn + i + 1) % 3;
        return candidate;
      }
    }
    return null;
  };

  const pickWfq = (state: { voip: number; video: number; bulk: number }) => {
    wfqDebt.voip += 0.5;
    wfqDebt.video += 0.3;
    wfqDebt.bulk += 0.2;
    const candidates = (["voip", "video", "bulk"] as const).filter((key) => state[key] > 0);
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => wfqDebt[b] - wfqDebt[a]);
    const chosen = candidates[0];
    wfqDebt[chosen] -= 1;
    return chosen;
  };

  const step = (index: number) => {
    const state = queueStates[index];
    let selected: "voip" | "video" | "bulk" | null = null;
    if (index === 0) selected = pickFifo(state);
    if (index === 1) selected = pickPriority(state);
    if (index === 2) selected = pickRoundRobin(state);
    if (index === 3) selected = pickWfq(state);
    if (selected) state[selected] = Math.max(0, state[selected] - 1);
    replenish(state);
    return selected;
  };

  const drawLane = (
    p: p5,
    x: number,
    y: number,
    title: string,
    state: { voip: number; video: number; bulk: number },
    selected: "voip" | "video" | "bulk" | null,
  ) => {
    const w = p.width / 2 - 24;
    const h = 112;

    p.stroke(100, 130, 180, 100);
    p.fill(12, 19, 33);
    p.rect(x, y, w, h, 7);

    p.noStroke();
    p.fill(210);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(title, x + 8, y + 7);

    const drawQueue = (label: string, value: number, color: [number, number, number], row: number) => {
      const yy = y + 28 + row * 24;
      p.fill(150);
      p.textSize(8);
      p.text(label, x + 8, yy + 2);
      for (let i = 0; i < Math.min(value, 8); i += 1) {
        drawPacket(p, x + 52 + i * 12, yy + 5, color);
      }
    };

    drawQueue("VoIP", state.voip, [255, 190, 80], 0);
    drawQueue("Video", state.video, [120, 220, 255], 1);
    drawQueue("Bulk", state.bulk, [190, 190, 190], 2);

    p.fill(130, 230, 140);
    p.textSize(8);
    p.text(`Serve: ${selected ?? "-"}`, x + w - 72, y + h - 14);
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Comparador de Escalonamento");

    let selected: Array<"voip" | "video" | "bulk" | null> = [null, null, null, null];
    if (p.frameCount % 12 === 0) {
      selected = [step(0), step(1), step(2), step(3)];
    }

    drawLane(p, 12, 36, labels[0], queueStates[0], selected[0]);
    drawLane(p, p.width / 2 + 4, 36, labels[1], queueStates[1], selected[1]);
    drawLane(p, 12, 156, labels[2], queueStates[2], selected[2]);
    drawLane(p, p.width / 2 + 4, 156, labels[3], queueStates[3], selected[3]);
  };

  return <P5Sketch setup={setup} draw={draw} height={280} />;
}

export function QueueCongestionTimelineSimulator() {
  const cycleFrames = 400;
  let queue = 20;
  let drops = 0;
  const history: number[] = [];

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const phaseForProgress = (progress: number) => {
    if (progress < 0.25) return { name: "0-10ms cresce", inRate: 10, outRate: 4, red: false };
    if (progress < 0.5) return { name: "10-20ms RED ativo", inRate: 10, outRate: 4, red: true };
    if (progress < 0.75) return { name: "20-30ms reduz", inRate: 6, outRate: 4, red: true };
    return { name: "30-40ms estabiliza", inRate: 3, outRate: 4, red: false };
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Linha do Tempo de Congestionamento");

    const progress = (p.frameCount % cycleFrames) / cycleFrames;
    const phase = phaseForProgress(progress);
    const maxQueue = 60;

    for (let i = 0; i < phase.inRate; i += 1) {
      const shouldDrop = phase.red && queue > 35 && Math.random() < 0.25;
      if (shouldDrop) {
        drops += 1;
      } else {
        queue += 1;
      }
    }

    queue -= phase.outRate;
    if (queue > maxQueue) {
      drops += queue - maxQueue;
      queue = maxQueue;
    }
    queue = Math.max(0, queue);

    history.push(queue);
    if (history.length > 100) history.shift();

    const timelineX = 24;
    const timelineY = 48;
    const timelineW = p.width - 48;

    p.noStroke();
    p.fill(255, 255, 255, 12);
    p.rect(timelineX, timelineY, timelineW, 16, 4);
    p.fill(120, 220, 255, 200);
    p.rect(timelineX, timelineY, timelineW * progress, 16, 4);

    p.fill(160);
    p.textSize(9);
    p.textAlign(p.LEFT, p.TOP);
    p.text("0ms", timelineX, timelineY + 20);
    p.text("10ms", timelineX + timelineW * 0.25 - 10, timelineY + 20);
    p.text("20ms", timelineX + timelineW * 0.5 - 10, timelineY + 20);
    p.text("30ms", timelineX + timelineW * 0.75 - 10, timelineY + 20);
    p.text("40ms", timelineX + timelineW - 20, timelineY + 20);

    const queueX = 56;
    const queueY = 96;
    const queueW = 66;
    const queueH = 170;

    p.noFill();
    p.stroke(120, 220, 255, 120);
    p.rect(queueX, queueY, queueW, queueH, 6);

    for (let i = 0; i < queue; i += 1) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      drawPacket(p, queueX + 10 + col * 13, queueY + queueH - 10 - row * 11, [255, 175, 90]);
    }

    drawSparkline(p, history, 168, 118, p.width - 192, 120, maxQueue);

    p.noStroke();
    p.fill(165);
    p.textSize(10);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Fase: ${phase.name}`, 168, 94);
    p.text(`Taxa entrada: ${phase.inRate} pkt/tick`, 168, 244);
    p.text(`Taxa saida: ${phase.outRate} pkt/tick`, 168, 258);
    p.text(`Fila: ${queue} pkt   Drops: ${drops}`, 168, 272);

    p.fill(phase.red ? 255 : 130, phase.red ? 170 : 220, 120);
    p.text(`RED: ${phase.red ? "ativo" : "inativo"}`, p.width - 140, 94);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}


