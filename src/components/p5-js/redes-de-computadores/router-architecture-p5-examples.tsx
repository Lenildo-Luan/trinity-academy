"use client";

import type p5 from "p5";
import { P5Sketch } from "../p5-sketch";

type Vec2 = { x: number; y: number };

type FlowPacket = {
  id: number;
  from: number;
  to: number;
  phase: "inputToFabric" | "fabricToOutput";
  x: number;
  y: number;
  speed: number;
  color: [number, number, number];
};

type FabricPacket = {
  id: number;
  from: number;
  to: number;
  phase: "toMemory" | "inMemory" | "toOutput";
  x: number;
  y: number;
  speed: number;
  holdFrames: number;
};

type BusPacket = {
  id: number;
  from: number;
  to: number;
  phase: "toBus" | "onBus" | "toOutput";
  x: number;
  y: number;
  speed: number;
};

type CrossbarPacket = {
  id: number;
  from: number;
  to: number;
  progress: number;
  speed: number;
};

function drawNode(p: p5, pos: Vec2, label: string, color: [number, number, number], w = 100, h = 38) {
  p.fill(15, 20, 35);
  p.stroke(color[0], color[1], color[2], 120);
  p.strokeWeight(1.5);
  p.rect(pos.x - w / 2, pos.y - h / 2, w, h, 8);
  p.noStroke();
  p.fill(color[0], color[1], color[2]);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(9);
  p.text(label, pos.x, pos.y + 0.5);
}

function moveTowards(packet: { x: number; y: number; speed: number }, target: Vec2) {
  const dx = target.x - packet.x;
  const dy = target.y - packet.y;
  const dist = Math.hypot(dx, dy);
  if (dist <= packet.speed) {
    packet.x = target.x;
    packet.y = target.y;
    return true;
  }
  packet.x += (dx / dist) * packet.speed;
  packet.y += (dy / dist) * packet.speed;
  return false;
}

function packetColor(index: number): [number, number, number] {
  const palette: Array<[number, number, number]> = [
    [0, 150, 255],
    [255, 180, 50],
    [100, 220, 140],
    [180, 130, 255],
  ];
  return palette[index % palette.length];
}

// Visualization 1: Global router architecture and packet flow through the main blocks
export function RouterArchitectureOverview() {
  let nextId = 1;
  let packets: FlowPacket[] = [];
  let delivered = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;
    const h = p.height;

    const inputX = w * 0.17;
    const outputX = w * 0.83;
    const fabricX = w * 0.5;

    const inputPorts: Vec2[] = [
      { x: inputX, y: 90 },
      { x: inputX, y: 160 },
      { x: inputX, y: 230 },
    ];
    const outputPorts: Vec2[] = [
      { x: outputX, y: 90 },
      { x: outputX, y: 160 },
      { x: outputX, y: 230 },
    ];

    const fabric = { x: fabricX, y: 160 };
    const control = { x: fabricX, y: 285 };

    p.noStroke();
    p.fill(205);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Arquitetura Geral do Roteador", w / 2, 8);

    p.stroke(70, 95, 130, 130);
    p.strokeWeight(1.3);
    inputPorts.forEach((inPort) => p.line(inPort.x + 52, inPort.y, fabric.x - 85, inPort.y));
    outputPorts.forEach((outPort) => p.line(fabric.x + 85, outPort.y, outPort.x - 52, outPort.y));

    p.stroke(120, 140, 170, 70);
    p.line(fabric.x, fabric.y + 46, control.x, control.y - 24);

    inputPorts.forEach((port, idx) => drawNode(p, port, `Entrada ${idx + 1}`, [0, 150, 255]));
    outputPorts.forEach((port, idx) => drawNode(p, port, `Saida ${idx + 1}`, [255, 180, 50]));

    p.fill(15, 20, 35);
    p.stroke(120, 220, 255, 120);
    p.strokeWeight(1.5);
    p.rect(fabric.x - 85, fabric.y - 48, 170, 96, 10);
    p.noStroke();
    p.fill(120, 220, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Switching\nFabric", fabric.x, fabric.y);

    drawNode(p, control, "Routing Processor", [180, 130, 255], 160, 34);

    if (p.frameCount % 30 === 0) {
      const from = Math.floor(Math.random() * inputPorts.length);
      const to = Math.floor(Math.random() * outputPorts.length);
      const color = packetColor(to);
      packets.push({
        id: nextId,
        from,
        to,
        phase: "inputToFabric",
        x: inputPorts[from].x + 55,
        y: inputPorts[from].y,
        speed: 1.7 + Math.random() * 0.9,
        color,
      });
      nextId += 1;
    }

    packets = packets.filter((packet) => {
      if (packet.phase === "inputToFabric") {
        const reached = moveTowards(packet, { x: fabric.x - 88, y: inputPorts[packet.from].y });
        if (reached) {
          packet.phase = "fabricToOutput";
          packet.x = fabric.x + 88;
          packet.y = outputPorts[packet.to].y;
        }
      } else {
        const reached = moveTowards(packet, { x: outputPorts[packet.to].x - 54, y: outputPorts[packet.to].y });
        if (reached) {
          delivered += 1;
          return false;
        }
      }

      p.noStroke();
      p.fill(packet.color[0], packet.color[1], packet.color[2]);
      p.rect(packet.x - 6, packet.y - 4, 12, 8, 2);
      return true;
    });

    p.noStroke();
    p.fill(140);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text(`Pacotes entregues: ${delivered}`, 16, h - 48);
    p.text(`Pacotes em transito: ${packets.length}`, 16, h - 34);

    p.fill(110);
    p.textSize(8);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(
      "Fluxo: porta de entrada -> fabric -> porta de saida (control plane separado no processor)",
      w / 2,
      h - 8,
    );
  };

  return <P5Sketch setup={setup} draw={draw} height={350} />;
}

// Visualization 2: Memory switching and central-memory bottleneck under contention
export function MemorySwitchingSimulator() {
  let nextId = 1;
  let inputQueues: number[][] = [[], [], []];
  let activePacket: FabricPacket | null = null;
  let generated = 0;
  let delivered = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;
    const h = p.height;

    const inputs: Vec2[] = [
      { x: 80, y: 80 },
      { x: 80, y: 150 },
      { x: 80, y: 220 },
    ];
    const outputs: Vec2[] = [
      { x: w - 80, y: 80 },
      { x: w - 80, y: 150 },
      { x: w - 80, y: 220 },
    ];
    const memory = { x: w / 2, y: 120 };
    const cpu = { x: w / 2, y: 220 };

    p.noStroke();
    p.fill(205);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Comutacao via Memoria", w / 2, 8);

    p.stroke(85, 105, 135, 120);
    p.strokeWeight(1.2);
    p.line(140, memory.y, w - 140, memory.y);
    p.line(memory.x, memory.y + 22, cpu.x, cpu.y - 20);
    p.noStroke();
    p.fill(120, 140, 170);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Barramento compartilhado", w / 2, memory.y + 8);

    inputs.forEach((pos, idx) => drawNode(p, pos, `In ${idx + 1}`, [0, 150, 255], 72, 28));
    outputs.forEach((pos, idx) => drawNode(p, pos, `Out ${idx + 1}`, [255, 180, 50], 72, 28));
    drawNode(p, memory, "Memoria", [180, 130, 255], 112, 34);
    drawNode(p, cpu, "CPU/Lookup", [100, 220, 140], 124, 34);

    // Generate traffic with different rates to create visible contention.
    if (p.frameCount % 18 === 0) {
      const to = Math.floor(Math.random() * outputs.length);
      inputQueues[0].push(to);
      generated += 1;
    }
    if (p.frameCount % 25 === 0) {
      const to = Math.floor(Math.random() * outputs.length);
      inputQueues[1].push(to);
      generated += 1;
    }
    if (p.frameCount % 32 === 0) {
      const to = Math.floor(Math.random() * outputs.length);
      inputQueues[2].push(to);
      generated += 1;
    }

    if (!activePacket) {
      const nextInput = inputQueues.findIndex((queue) => queue.length > 0);
      if (nextInput >= 0) {
        const to = inputQueues[nextInput].shift() ?? 0;
        activePacket = {
          id: nextId,
          from: nextInput,
          to,
          phase: "toMemory",
          x: inputs[nextInput].x + 42,
          y: inputs[nextInput].y,
          speed: 2.2,
          holdFrames: 0,
        };
        nextId += 1;
      }
    }

    if (activePacket) {
      if (activePacket.phase === "toMemory") {
        const reached = moveTowards(activePacket, { x: memory.x - 58, y: memory.y });
        if (reached) {
          activePacket.phase = "inMemory";
          activePacket.holdFrames = 24;
          activePacket.x = memory.x;
          activePacket.y = memory.y;
        }
      } else if (activePacket.phase === "inMemory") {
        activePacket.holdFrames -= 1;
        if (activePacket.holdFrames <= 0) {
          activePacket.phase = "toOutput";
          activePacket.x = memory.x + 58;
          activePacket.y = memory.y;
        }
      } else {
        const reached = moveTowards(activePacket, {
          x: outputs[activePacket.to].x - 42,
          y: outputs[activePacket.to].y,
        });
        if (reached) {
          delivered += 1;
          activePacket = null;
        }
      }

      if (activePacket) {
        const color = packetColor(activePacket.to);
        p.noStroke();
        p.fill(color[0], color[1], color[2]);
        p.rect(activePacket.x - 6, activePacket.y - 4, 12, 8, 2);
      }
    }

    inputQueues.forEach((queue, idx) => {
      const baseX = inputs[idx].x - 34;
      const baseY = inputs[idx].y + 22;
      p.noFill();
      p.stroke(110, 140, 180, 80);
      p.rect(baseX, baseY, 68, 12, 3);
      const fillRatio = Math.min(1, queue.length / 7);
      p.noStroke();
      p.fill(255 * fillRatio, 180 - 70 * fillRatio, 80, 180);
      p.rect(baseX + 1, baseY + 1, (68 - 2) * fillRatio, 10, 2);
      p.fill(150);
      p.textAlign(p.LEFT, p.TOP);
      p.textSize(7);
      p.text(`fila: ${queue.length}`, baseX, baseY + 14);
    });

    const totalQueue = inputQueues[0].length + inputQueues[1].length + inputQueues[2].length;
    const throughput = generated > 0 ? (delivered / generated) * 100 : 0;

    p.noStroke();
    p.fill(14, 22, 38);
    p.stroke(120, 140, 170, 70);
    p.rect(14, h - 86, w - 28, 70, 8);

    p.noStroke();
    p.fill(190);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text(`Pacotes gerados: ${generated}`, 24, h - 74);
    p.text(`Pacotes entregues: ${delivered}`, 24, h - 60);
    p.text(`Fila total de entrada: ${totalQueue}`, 24, h - 46);
    p.text(`Aproveitamento observado: ${throughput.toFixed(1)}%`, 24, h - 32);

    p.fill(110);
    p.textAlign(p.RIGHT, p.TOP);
    p.text("Gargalo: um pacote cruza por vez (entrada->memoria->saida)", w - 24, h - 60);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 3: Shared bus switching with arbitration and contention at high load
export function BusSwitchingSimulator() {
  let nextId = 1;
  let queues: number[][] = [[], [], [], []];
  let active: BusPacket | null = null;
  let rrPointer = 0;

  let generated = 0;
  let forwarded = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;
    const h = p.height;

    const inputs: Vec2[] = [
      { x: 80, y: 70 },
      { x: 80, y: 120 },
      { x: 80, y: 170 },
      { x: 80, y: 220 },
    ];
    const outputs: Vec2[] = [
      { x: w - 80, y: 70 },
      { x: w - 80, y: 120 },
      { x: w - 80, y: 170 },
      { x: w - 80, y: 220 },
    ];

    const busY = 145;
    const busStart = 148;
    const busEnd = w - 148;

    p.noStroke();
    p.fill(205);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Comutacao via Barramento", w / 2, 8);

    p.stroke(120, 200, 255, 140);
    p.strokeWeight(4);
    p.line(busStart, busY, busEnd, busY);
    p.strokeWeight(1);

    p.noStroke();
    p.fill(120, 200, 255);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Barramento compartilhado (apenas um pacote por vez)", w / 2, busY + 8);

    inputs.forEach((pos, idx) => {
      drawNode(p, pos, `In ${idx + 1}`, [0, 150, 255], 66, 26);
      p.stroke(80, 110, 145, 120);
      p.line(pos.x + 36, pos.y, busStart, busY);
    });

    outputs.forEach((pos, idx) => {
      drawNode(p, pos, `Out ${idx + 1}`, [255, 180, 50], 66, 26);
      p.stroke(80, 110, 145, 120);
      p.line(busEnd, busY, pos.x - 36, pos.y);
    });

    if (p.frameCount % 14 === 0) {
      const from = Math.floor(Math.random() * inputs.length);
      const to = Math.floor(Math.random() * outputs.length);
      queues[from].push(to);
      generated += 1;
    }

    if (!active) {
      for (let i = 0; i < queues.length; i += 1) {
        const idx = (rrPointer + i) % queues.length;
        if (queues[idx].length > 0) {
          const to = queues[idx].shift() ?? 0;
          active = {
            id: nextId,
            from: idx,
            to,
            phase: "toBus",
            x: inputs[idx].x + 38,
            y: inputs[idx].y,
            speed: 2.4,
          };
          rrPointer = (idx + 1) % queues.length;
          nextId += 1;
          break;
        }
      }
    }

    if (active) {
      if (active.phase === "toBus") {
        const reached = moveTowards(active, { x: busStart, y: busY });
        if (reached) active.phase = "onBus";
      } else if (active.phase === "onBus") {
        const reached = moveTowards(active, { x: busEnd, y: busY });
        if (reached) active.phase = "toOutput";
      } else {
        const reached = moveTowards(active, { x: outputs[active.to].x - 38, y: outputs[active.to].y });
        if (reached) {
          forwarded += 1;
          active = null;
        }
      }

      if (active) {
        const color = packetColor(active.to);
        p.noStroke();
        p.fill(color[0], color[1], color[2]);
        p.rect(active.x - 6, active.y - 4, 12, 8, 2);
      }
    }

    queues.forEach((queue, idx) => {
      const bx = inputs[idx].x - 32;
      const by = inputs[idx].y + 18;
      p.noFill();
      p.stroke(100, 130, 165, 80);
      p.rect(bx, by, 64, 10, 2);
      const ratio = Math.min(1, queue.length / 8);
      p.noStroke();
      p.fill(255 * ratio, 160, 80, 200);
      p.rect(bx + 1, by + 1, (64 - 2) * ratio, 8, 2);
      p.fill(145);
      p.textSize(7);
      p.textAlign(p.LEFT, p.TOP);
      p.text(`${queue.length}`, bx + 66, by - 1);
    });

    const backlog = queues.reduce((acc, queue) => acc + queue.length, 0);
    const utilization = generated > 0 ? (forwarded / generated) * 100 : 0;

    p.noStroke();
    p.fill(14, 22, 38);
    p.stroke(120, 140, 170, 70);
    p.rect(14, h - 88, w - 28, 72, 8);

    p.noStroke();
    p.fill(190);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text(`Pacotes injetados: ${generated}`, 24, h - 76);
    p.text(`Pacotes encaminhados: ${forwarded}`, 24, h - 62);
    p.text(`Backlog total de entrada: ${backlog}`, 24, h - 48);
    p.text(`Aproveitamento do barramento: ${utilization.toFixed(1)}%`, 24, h - 34);

    p.fill(110);
    p.textAlign(p.RIGHT, p.TOP);
    p.text("Arbitragem round-robin: disputa entre entradas aumenta a espera", w - 24, h - 58);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 4: Crossbar switching with parallel transfers and output conflicts
export function CrossbarSwitchingSimulator() {
  const portCount = 4;
  let nextId = 1;
  let inputQueues: number[][] = [[], [], [], []];
  let active: CrossbarPacket[] = [];

  let generated = 0;
  let delivered = 0;
  let blocked = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;
    const h = p.height;

    const inX = 74;
    const outX = w - 74;
    const topY = 58;
    const spacingY = 42;
    const matrixLeft = w * 0.33;
    const matrixRight = w * 0.67;
    const matrixTop = topY - 8;
    const matrixBottom = topY + (portCount - 1) * spacingY + 8;

    const inPorts = Array.from({ length: portCount }, (_, i) => ({ x: inX, y: topY + i * spacingY }));
    const outPorts = Array.from({ length: portCount }, (_, i) => ({ x: outX, y: topY + i * spacingY }));

    p.noStroke();
    p.fill(205);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Comutacao via Crossbar", w / 2, 8);

    p.stroke(70, 95, 130, 120);
    p.strokeWeight(1.1);
    for (let i = 0; i < portCount; i += 1) {
      p.line(inPorts[i].x + 34, inPorts[i].y, matrixLeft, inPorts[i].y);
      p.line(matrixRight, outPorts[i].y, outPorts[i].x - 34, outPorts[i].y);
    }

    p.stroke(120, 170, 215, 65);
    for (let i = 0; i < portCount; i += 1) {
      const y = topY + i * spacingY;
      p.line(matrixLeft, y, matrixRight, y);
    }
    for (let j = 0; j < portCount; j += 1) {
      const x = p.map(j, 0, portCount - 1, matrixLeft, matrixRight);
      p.line(x, matrixTop, x, matrixBottom);
    }

    p.noFill();
    p.stroke(120, 220, 255, 110);
    p.rect(matrixLeft - 8, matrixTop - 8, matrixRight - matrixLeft + 16, matrixBottom - matrixTop + 16, 8);

    inPorts.forEach((port, idx) => drawNode(p, port, `In ${idx + 1}`, [0, 150, 255], 62, 24));
    outPorts.forEach((port, idx) => drawNode(p, port, `Out ${idx + 1}`, [255, 180, 50], 62, 24));

    if (p.frameCount % 12 === 0) {
      const from = Math.floor(Math.random() * portCount);
      const to = Math.floor(Math.random() * portCount);
      inputQueues[from].push(to);
      generated += 1;
    }

    const usedOutputs = new Set<number>();
    const stillActive: CrossbarPacket[] = [];

    for (const packet of active) {
      packet.progress += packet.speed;
      if (packet.progress >= 1) {
        delivered += 1;
      } else {
        usedOutputs.add(packet.to);
        stillActive.push(packet);
      }
    }
    active = stillActive;

    for (let input = 0; input < portCount; input += 1) {
      if (inputQueues[input].length === 0) continue;

      const target = inputQueues[input][0];
      if (usedOutputs.has(target)) {
        blocked += 1;
        continue;
      }

      inputQueues[input].shift();
      usedOutputs.add(target);
      active.push({
        id: nextId,
        from: input,
        to: target,
        progress: 0,
        speed: 0.038 + Math.random() * 0.012,
      });
      nextId += 1;
    }

    active.forEach((packet) => {
      const start = inPorts[packet.from];
      const end = outPorts[packet.to];
      const col = packetColor(packet.to);

      p.stroke(col[0], col[1], col[2], 130);
      p.strokeWeight(1.4);
      p.line(start.x + 34, start.y, end.x - 34, end.y);

      const px = p.lerp(start.x + 34, end.x - 34, packet.progress);
      const py = p.lerp(start.y, end.y, packet.progress);
      p.noStroke();
      p.fill(col[0], col[1], col[2]);
      p.rect(px - 6, py - 4, 12, 8, 2);

      const switchX = p.map(packet.to, 0, portCount - 1, matrixLeft, matrixRight);
      const switchY = start.y;
      p.fill(col[0], col[1], col[2], 130);
      p.ellipse(switchX, switchY, 8, 8);
    });

    inputQueues.forEach((queue, idx) => {
      const qx = inPorts[idx].x - 30;
      const qy = inPorts[idx].y + 16;
      p.noFill();
      p.stroke(100, 130, 165, 80);
      p.rect(qx, qy, 58, 9, 2);
      const ratio = Math.min(1, queue.length / 7);
      p.noStroke();
      p.fill(255 * ratio, 170, 80, 190);
      p.rect(qx + 1, qy + 1, (58 - 2) * ratio, 7, 2);
    });

    const backlog = inputQueues.reduce((acc, queue) => acc + queue.length, 0);
    const efficiency = generated > 0 ? (delivered / generated) * 100 : 0;

    p.noStroke();
    p.fill(14, 22, 38);
    p.stroke(120, 140, 170, 70);
    p.rect(14, h - 112, w - 28, 96, 8);

    p.noStroke();
    p.fill(190);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text(`Pacotes gerados: ${generated}`, 24, h - 100);
    p.text(`Pacotes entregues: ${delivered}`, 24, h - 86);
    p.text(`Conexoes paralelas ativas: ${active.length}`, 24, h - 72);
    p.text(`Fila total de entrada: ${backlog}`, 24, h - 58);
    p.text(`Eventos de bloqueio por saida ocupada: ${blocked}`, 24, h - 44);
    p.text(`Aproveitamento agregado: ${efficiency.toFixed(1)}%`, 24, h - 30);

    p.fill(110);
    p.textAlign(p.RIGHT, p.TOP);
    p.text(
      "Varios pacotes cruzam ao mesmo tempo; colisao ocorre apenas quando disputam a mesma saida",
      w - 24,
      h - 66,
    );
  };

  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

