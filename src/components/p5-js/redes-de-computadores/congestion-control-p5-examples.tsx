"use client";

import { P5Sketch } from "../p5-sketch";
import type p5 from "p5";

// Helper to access setLineDash safely
const setDash = (p: p5, dash: number[]) =>
  (p.drawingContext as CanvasRenderingContext2D).setLineDash(dash);

// Visualization 1: Congestion costs — throughput vs offered load, queueing delay
export function CongestionCosts() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Custos do Congestionamento", w / 2, 6);

    const gw = (w - 60) / 2;
    const gh = 160;
    const gy = 35;

    // --- Graph 1: Throughput vs Offered Load ---
    const g1x = 20;
    p.noStroke();
    p.fill(0, 150, 255, 180);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Vazão vs Carga Oferecida", g1x + gw / 2, gy - 14);

    p.stroke(50);
    p.strokeWeight(1);
    p.line(g1x, gy + gh, g1x + gw, gy + gh); // x-axis
    p.line(g1x, gy, g1x, gy + gh);             // y-axis

    p.noStroke();
    p.fill(100);
    p.textSize(7);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Carga oferecida (λin)", g1x + gw / 2, gy + gh + 5);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("Vazão\n(λout)", g1x - 3, gy + gh / 2);

    // Ideal line
    p.stroke(100, 200, 100, 80);
    p.strokeWeight(1);
    setDash(p, [3, 3]);
    p.line(g1x, gy + gh, g1x + gw / 2, gy + gh / 2);
    p.line(g1x + gw / 2, gy + gh / 2, g1x + gw, gy + gh / 2);
    setDash(p, []);

    // Actual throughput (saturates and drops to 0 at congestion)
    p.stroke(255, 100, 100);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= 100; i++) {
      const load = i / 100;
      const px = g1x + load * gw;
      let throughput;
      if (load < 0.5) {
        throughput = load;
      } else if (load < 0.85) {
        throughput = 0.5 - (load - 0.5) * 0.8;
      } else {
        throughput = 0.5 - 0.35 * 0.8 - (load - 0.85) * 3.0;
      }
      throughput = Math.max(0, throughput);
      const py = gy + gh - throughput * gh;
      p.vertex(px, py);
    }
    p.endShape();

    // Animate a dot moving along the curve
    const dotLoad = (p.sin(time * 0.5) * 0.5 + 0.5) * 0.95;
    let dotTp;
    if (dotLoad < 0.5) dotTp = dotLoad;
    else if (dotLoad < 0.85) dotTp = 0.5 - (dotLoad - 0.5) * 0.8;
    else dotTp = Math.max(0, 0.5 - 0.35 * 0.8 - (dotLoad - 0.85) * 3.0);
    const dotPx = g1x + dotLoad * gw;
    const dotPy = gy + gh - dotTp * gh;
    p.fill(255, 100, 100);
    p.noStroke();
    p.ellipse(dotPx, dotPy, 7, 7);

    // Labels
    p.noStroke();
    p.fill(100, 200, 100, 160);
    p.textSize(7);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Ideal", g1x + gw * 0.52, gy + gh * 0.46);
    p.fill(255, 100, 100);
    p.text("Real", g1x + gw * 0.6, gy + gh * 0.35);

    // --- Graph 2: Queueing delay vs Offered Load ---
    const g2x = g1x + gw + 20;
    p.noStroke();
    p.fill(255, 180, 50, 180);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Atraso de Fila vs Carga", g2x + gw / 2, gy - 14);

    p.stroke(50);
    p.strokeWeight(1);
    p.line(g2x, gy + gh, g2x + gw, gy + gh);
    p.line(g2x, gy, g2x, gy + gh);

    p.noStroke();
    p.fill(100);
    p.textSize(7);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Carga oferecida (λin)", g2x + gw / 2, gy + gh + 5);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("Atraso", g2x - 3, gy + gh / 2);

    p.stroke(255, 180, 50);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= 95; i++) {
      const load = i / 100;
      const px = g2x + load * gw;
      const delay = Math.pow(load / (1 - load * 0.95), 2) * 0.06;
      const py = gy + gh - Math.min(delay, 1) * gh;
      p.vertex(px, py);
    }
    p.endShape();

    p.fill(255, 180, 50);
    p.noStroke();
    p.textSize(7);
    p.textAlign(p.LEFT, p.TOP);
    p.text("→ ∞", g2x + gw * 0.9, gy + gh * 0.05);

    // Annotation: capacity limit
    p.stroke(255, 100, 100, 80);
    p.strokeWeight(1);
    setDash(p, [2, 2]);
    p.line(g2x + gw * 0.92, gy, g2x + gw * 0.92, gy + gh);
    setDash(p, []);
    p.noStroke();
    p.fill(255, 100, 100, 180);
    p.textSize(7);
    p.text("Capacidade", g2x + gw * 0.7, gy + 4);

    // Costs summary
    const sumY = gy + gh + 25;
    p.fill(15, 20, 35);
    p.stroke(180, 130, 255, 40);
    p.strokeWeight(1);
    p.rect(15, sumY, w - 30, 55, 6);

    p.noStroke();
    p.fill(180, 130, 255);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Custos do Congestionamento", w / 2, sumY + 5);

    const costs = [
      "• Atraso de fila cresce rapidamente quando carga se aproxima da capacidade do enlace",
      "• Retransmissões desperdiçam capacidade (pacote original + cópia ocupam banda)",
      "• Vazão útil cai à zero quando buffers transbordam — trabalho inútil end-to-end",
    ];
    p.fill(140);
    p.textSize(7.5);
    p.textAlign(p.LEFT, p.TOP);
    costs.forEach((c, i) => p.text(c, 25, sumY + 20 + i * 12));

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Congestionamento ≠ sobrecarga do receptor — é sobrecarga da rede", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 2: Three congestion scenarios with router buffers
export function CongestionScenarios() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Três Cenários de Congestionamento", w / 2, 6);

    const scenW = (w - 20) / 3;
    const scenarios = [
      {
        title: "Cenário 1",
        sub: "Buffer infinito, sem retransmissão",
        col: [0, 150, 255],
        bufFill: Math.min(0.95, (p.sin(time * 0.3) * 0.5 + 0.5) * 0.95),
        note: "Atraso → ∞\nVazão ótima possível",
      },
      {
        title: "Cenário 2",
        sub: "Buffer finito, retransmissões",
        col: [255, 180, 50],
        bufFill: Math.min(1.0, (p.sin(time * 0.3 + 1) * 0.5 + 0.5) * 1.05),
        note: "Buffer cheio → drops\nRetransmissões = desperdício",
      },
      {
        title: "Cenário 3",
        sub: "Múltiplos saltos, roteadores",
        col: [255, 100, 100],
        bufFill: 1.0,
        note: "Pacote descartado após\nN saltos = N vezes perdido",
      },
    ];

    scenarios.forEach((sc, idx) => {
      const sx = 10 + idx * scenW;
      const scW = scenW - 8;

      p.fill(15, 20, 35);
      p.stroke(sc.col[0], sc.col[1], sc.col[2], 35);
      p.strokeWeight(1);
      p.rect(sx, 26, scW, h - 36, 6);

      p.noStroke();
      p.fill(sc.col[0], sc.col[1], sc.col[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text(sc.title, sx + scW / 2, 30);
      p.fill(100);
      p.textSize(7);
      p.text(sc.sub, sx + scW / 2, 43);

      const midX = sx + scW / 2;
      const routerY = 80;

      // Router icon (square with rounded corners)
      p.fill(15, 20, 35);
      p.stroke(sc.col[0], sc.col[1], sc.col[2], 60);
      p.strokeWeight(1.5);
      p.rect(midX - 22, routerY - 18, 44, 36, 5);
      p.noStroke();
      p.fill(sc.col[0], sc.col[1], sc.col[2], 200);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Router", midX, routerY - 4);

      // Buffer bar inside router
      const bufW = 36;
      const bufH = 10;
      const bufX = midX - bufW / 2;
      const bufY = routerY + 4;
      const fill = Math.min(sc.bufFill, 1);

      p.fill(20, 30, 50);
      p.stroke(sc.col[0], sc.col[1], sc.col[2], 40);
      p.strokeWeight(1);
      p.rect(bufX, bufY, bufW, bufH, 2);

      const bufColor = fill > 0.9 ? [255, 100, 100] : sc.col;
      p.fill(bufColor[0], bufColor[1], bufColor[2], 160);
      p.noStroke();
      p.rect(bufX, bufY, fill * bufW, bufH, 2);

      // Buffer overflow indicator
      if (sc.bufFill >= 1) {
        const pulse = (p.sin(time * 5) + 1) / 2;
        p.fill(255, 100, 100, 150 + pulse * 80);
        p.textSize(12);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("✕", bufX + bufW + 8, bufY + bufH / 2);
      }

      // Incoming packets animation
      const numPkts = idx === 2 ? 4 : 2;
      for (let p2 = 0; p2 < numPkts; p2++) {
        const pktPhase = ((time * 0.5 + p2 * (1 / numPkts)) % 1);
        const pktX = p.lerp(sx + 15, midX - 25, pktPhase);
        const pktY2 = routerY - 5 + p2 * 6;
        p.fill(sc.col[0], sc.col[1], sc.col[2], 160);
        p.noStroke();
        p.rect(pktX - 8, pktY2, 16, 8, 2);
      }

      // Outgoing packet (only if buffer not full)
      if (sc.bufFill < 0.98) {
        const outPhase = (time * 0.4 + 0.3) % 1;
        const outX = p.lerp(midX + 22, sx + scW - 15, outPhase);
        p.fill(100, 200, 100, 160);
        p.noStroke();
        p.rect(outX - 8, routerY - 5, 16, 10, 2);
      }

      // Note box
      const noteY = routerY + 50;
      p.fill(15, 20, 35);
      p.stroke(sc.col[0], sc.col[1], sc.col[2], 30);
      p.strokeWeight(1);
      p.rect(sx + 5, noteY, scW - 10, 48, 4);
      p.noStroke();
      p.fill(sc.col[0], sc.col[1], sc.col[2], 200);
      p.textSize(7.5);
      p.textAlign(p.CENTER, p.CENTER);
      const noteLines = sc.note.split("\n");
      noteLines.forEach((l, li) => p.text(l, sx + scW / 2, noteY + 14 + li * 13));
    });

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cada cenário adiciona realismo: buffers finitos → perdas → retransmissões → multi-hop", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={290} />;
}

// Visualization 3: AIMD — sawtooth pattern
export function TCPAIMDSawtooth() {
  let time = 0;
  const historyLen = 200;
  const cwndHistory: number[] = [];
  let cwnd = 1;
  let inSlowStart = true;
  let ssthresh = 16;
  let tick = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    tick++;

    // Update cwnd every few frames
    if (tick % 4 === 0) {
      cwndHistory.push(cwnd);
      if (cwndHistory.length > historyLen) cwndHistory.shift();

      if (inSlowStart) {
        cwnd = Math.min(cwnd * 2, ssthresh);
        if (cwnd >= ssthresh) inSlowStart = false;
      } else {
        cwnd += 1; // Additive increase (1 per RTT)
      }

      // Random loss event
      if (cwnd > 30 && Math.random() < 0.04) {
        ssthresh = Math.max(Math.floor(cwnd / 2), 4);
        // Triple dup ACK → fast retransmit: cwnd = ssthresh
        cwnd = ssthresh;
        inSlowStart = false;
      } else if (cwnd > 40 && Math.random() < 0.01) {
        // Timeout → back to slow start
        ssthresh = Math.max(Math.floor(cwnd / 2), 4);
        cwnd = 1;
        inSlowStart = true;
      }
    }

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("AIMD — Padrão Dente-de-Serra da Janela TCP", w / 2, 6);

    const graphX = 55;
    const graphY = 32;
    const graphW = w - 70;
    const graphH = h - 90;
    const maxCwnd = 50;

    // Axes
    p.stroke(50);
    p.strokeWeight(1);
    p.line(graphX, graphY, graphX, graphY + graphH);
    p.line(graphX, graphY + graphH, graphX + graphW, graphY + graphH);

    // Y axis ticks
    p.noStroke();
    p.fill(80);
    p.textSize(7);
    p.textAlign(p.RIGHT, p.CENTER);
    for (let v = 0; v <= maxCwnd; v += 10) {
      const yy = graphY + graphH - (v / maxCwnd) * graphH;
      p.text(v.toString(), graphX - 4, yy);
      p.stroke(25);
      p.strokeWeight(0.5);
      p.line(graphX, yy, graphX + graphW, yy);
      p.noStroke();
    }

    // ssthresh line
    const ssY = graphY + graphH - (ssthresh / maxCwnd) * graphH;
    p.stroke(255, 180, 50, 100);
    p.strokeWeight(1);
    setDash(p, [4, 4]);
    p.line(graphX, ssY, graphX + graphW, ssY);
    setDash(p, []);
    p.noStroke();
    p.fill(255, 180, 50, 200);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`ssthresh=${ssthresh}`, graphX + 4, ssY + 2);

    // Plot cwnd history
    if (cwndHistory.length > 1) {
      const stepW = graphW / historyLen;
      p.noFill();
      p.stroke(0, 150, 255);
      p.strokeWeight(1.5);
      p.beginShape();
      cwndHistory.forEach((v, i) => {
        const px = graphX + (i + (historyLen - cwndHistory.length)) * stepW;
        const py = graphY + graphH - (Math.min(v, maxCwnd) / maxCwnd) * graphH;
        p.vertex(px, py);
      });
      p.endShape();
    }

    // Current cwnd indicator
    const curY = graphY + graphH - (Math.min(cwnd, maxCwnd) / maxCwnd) * graphH;
    p.fill(0, 150, 255);
    p.noStroke();
    p.ellipse(graphX + graphW, curY, 8, 8);
    p.fill(0, 150, 255, 200);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(`cwnd=${cwnd}`, graphX + graphW + 3, curY);

    // Legend
    const legY = graphY + graphH + 10;
    p.noStroke();

    p.fill(0, 150, 255);
    p.rect(graphX, legY + 2, 20, 3);
    p.fill(140);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("cwnd (janela de congestionamento)", graphX + 25, legY + 4);

    p.stroke(255, 180, 50, 150);
    p.strokeWeight(1);
    setDash(p, [3, 3]);
    p.line(graphX + 200, legY + 2, graphX + 220, legY + 2);
    setDash(p, []);
    p.noStroke();
    p.fill(255, 180, 50);
    p.text("ssthresh (limiar slow start)", graphX + 225, legY + 4);

    // Axis labels
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Tempo (RTTs)", graphX + graphW / 2, legY + 16);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("cwnd\n(MSS)", graphX - 18, graphY + graphH / 2);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Aumento Aditivo (+1 MSS/RTT) → perda → Decremento Multiplicativo (÷2)", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={330} />;
}

// Visualization 4: Slow Start, CA, Fast Recovery state machine
export function TCPCongestionFSM() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Estados do Controle de Congestionamento TCP", w / 2, 6);

    const states = [
      {
        id: "SS",
        label: "Slow Start",
        sub: "cwnd += 1 MSS por ACK\n(duplica a cada RTT)",
        x: w / 2 - 160,
        y: 85,
        col: [0, 150, 255],
      },
      {
        id: "CA",
        label: "Prevenção de\nCongestionamento",
        sub: "cwnd += MSS²/cwnd por ACK\n(+1 MSS por RTT)",
        x: w / 2 + 60,
        y: 85,
        col: [100, 200, 100],
      },
      {
        id: "FR",
        label: "Recuperação\nRápida",
        sub: "cwnd = ssthresh + 3\nretransmite pkt perdido",
        x: w / 2 - 50,
        y: 230,
        col: [255, 180, 50],
      },
    ];

    const boxW = 130;
    const boxH = 70;

    // Draw arrows first (behind boxes)
    const arrows = [
      { from: "SS", to: "CA", label: "cwnd ≥ ssthresh", bend: -1 },
      { from: "SS", to: "SS", label: "Timeout:\nssthresh=cwnd/2\ncwnd=1", self: true, selfDir: "left" },
      { from: "CA", to: "SS", label: "Timeout:\nssthresh=cwnd/2\ncwnd=1", bend: 1 },
      { from: "SS", to: "FR", label: "3 ACKs dup:\nssthresh=cwnd/2\ncwnd=ssthresh+3", bend: -0.5 },
      { from: "CA", to: "FR", label: "3 ACKs dup:\nssthresh=cwnd/2\ncwnd=ssthresh+3", bend: 0.5 },
      { from: "FR", to: "CA", label: "ACK novo:\ncwnd=ssthresh", bend: 0 },
      { from: "FR", to: "SS", label: "Timeout:\nssthresh=cwnd/2\ncwnd=1", bend: 0.5 },
    ];

    const getState = (id: string) => states.find((s) => s.id === id)!;
    const cx = (s: (typeof states)[0]) => s.x + boxW / 2;
    const cy = (s: (typeof states)[0]) => s.y + boxH / 2;

    arrows.forEach((arr, i) => {
      const from = getState(arr.from);
      const to = getState(arr.to);
      const fc = from.col;
      const pulse = p.sin(time * 1.5 + i * 0.7) * 0.3 + 0.7;

      p.stroke(fc[0], fc[1], fc[2], 80 * pulse);
      p.strokeWeight(1.2);
      p.noFill();

      if (arr.self) {
        // Self-loop for Timeout in Slow Start
        p.arc(cx(from) - 80, cy(from), 50, 50, p.PI * 0.3, p.PI * 1.7);
        p.noStroke();
        p.fill(fc[0], fc[1], fc[2], 120 * pulse);
        p.textSize(7);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(arr.label, cx(from) - 110, cy(from));
        return;
      }

      // Simple straight arrows
      const fx = cx(from);
      const fy = cy(from);
      const tx = cx(to);
      const ty = cy(to);

      // Offset slightly for bidirectional
      const offX = (arr.bend || 0) * 20;
      const offY = (arr.bend || 0) * 15;

      p.line(fx + offX, fy + offY, tx + offX, ty + offY);

      // Arrow head
      const angle = Math.atan2(ty + offY - fy - offY, tx + offX - fx - offX);
      const ax = tx + offX - 10 * Math.cos(angle);
      const ay = ty + offY - 10 * Math.sin(angle);
      p.fill(fc[0], fc[1], fc[2], 100);
      p.noStroke();
      p.triangle(
        tx + offX,
        ty + offY,
        ax + 5 * Math.sin(angle),
        ay - 5 * Math.cos(angle),
        ax - 5 * Math.sin(angle),
        ay + 5 * Math.cos(angle)
      );

      // Arrow label
      const midX = (fx + tx) / 2 + offX;
      const midY = (fy + ty) / 2 + offY;
      p.fill(fc[0], fc[1], fc[2], 190 * pulse);
      p.textSize(6.5);
      p.textAlign(p.CENTER, p.CENTER);
      const labelLines = arr.label.split("\n");
      labelLines.forEach((l, li) => {
        p.text(l, midX + (arr.bend || 0) * 30, midY + (arr.bend || 0) * 20 + li * 9 - ((labelLines.length - 1) * 9) / 2);
      });
    });

    // Draw state boxes
    states.forEach((st) => {
      const pulse = p.sin(time * 2 + states.indexOf(st) * 1.2) * 10;

      p.fill(15, 20, 35);
      p.stroke(st.col[0], st.col[1], st.col[2], 70 + pulse);
      p.strokeWeight(2);
      p.rect(st.x, st.y, boxW, boxH, 8);

      p.noStroke();
      p.fill(st.col[0], st.col[1], st.col[2], 220);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      const labelLines = st.label.split("\n");
      labelLines.forEach((l, li) => p.text(l, st.x + boxW / 2, st.y + 8 + li * 13));

      p.fill(100);
      p.textSize(7);
      const subLines = st.sub.split("\n");
      subLines.forEach((l, li) =>
        p.text(l, st.x + boxW / 2, st.y + 8 + labelLines.length * 13 + li * 10)
      );
    });

    // Start arrow
    p.stroke(180, 130, 255, 150);
    p.strokeWeight(1.5);
    p.line(w / 2 - 160 + boxW / 2, 35, w / 2 - 160 + boxW / 2, states[0].y);
    p.fill(180, 130, 255, 180);
    p.noStroke();
    p.triangle(
      w / 2 - 160 + boxW / 2, states[0].y,
      w / 2 - 160 + boxW / 2 - 5, states[0].y - 8,
      w / 2 - 160 + boxW / 2 + 5, states[0].y - 8
    );
    p.fill(180, 130, 255, 200);
    p.textSize(8);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Início (cwnd=1, ssthresh=64)", w / 2 - 160 + boxW / 2, 38);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Timeout → Slow Start | 3 ACKs dup → Fast Retransmit/Recovery", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={330} />;
}

// Visualization 5: TCP CUBIC vs AIMD comparison
export function TCPCubicVsReno() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("TCP CUBIC vs TCP Reno (AIMD)", w / 2, 6);

    const graphX = 50;
    const graphY = 30;
    const graphW = w - 70;
    const graphH = h - 100;
    const maxCwnd = 70;
    const maxT = 5.0; // seconds of simulation

    p.stroke(50);
    p.strokeWeight(1);
    p.line(graphX, graphY, graphX, graphY + graphH);
    p.line(graphX, graphY + graphH, graphX + graphW, graphY + graphH);

    // Y ticks
    p.noStroke();
    p.fill(80);
    p.textSize(7);
    for (let v = 0; v <= maxCwnd; v += 10) {
      const yy = graphY + graphH - (v / maxCwnd) * graphH;
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(v.toString(), graphX - 4, yy);
      p.stroke(25);
      p.strokeWeight(0.5);
      p.line(graphX, yy, graphX + graphW, yy);
      p.noStroke();
    }

    // X ticks
    for (let t = 0; t <= maxT; t += 1) {
      const xx = graphX + (t / maxT) * graphW;
      p.fill(80);
      p.textSize(7);
      p.textAlign(p.CENTER, p.TOP);
      p.text(t.toFixed(0), xx, graphY + graphH + 3);
    }

    // Reno AIMD curve (sawtooth)
    const renoCwnd = (t: number): number => {
      // Simple piecewise: losses at t=1.5, 3.0, 4.2
      const lossTimes = [1.5, 3.0, 4.2];
      let cw = 2;
      let phase = t;
      for (const lt of lossTimes) {
        if (t <= lt) break;
        cw = Math.max(cw / 2, 2);
        phase = t - lt;
      }
      const lastLoss = lossTimes.filter((lt) => lt <= t).pop() || 0;
      return Math.min(cw + (t - lastLoss) * 8, maxCwnd);
    };

    // CUBIC curve (faster recovery, cubic growth)
    const cubicCwnd = (t: number): number => {
      const lossTimes = [1.5, 3.0, 4.2];
      let wmax = 40;
      let lastLoss = 0;
      for (const lt of lossTimes) {
        if (t <= lt) break;
        wmax = cubicCwnd(lt - 0.01);
        lastLoss = lt;
      }
      const dt = t - lastLoss;
      const K = Math.pow(wmax * 0.3 / 0.4, 1 / 3);
      return Math.min(0.4 * Math.pow(dt - K, 3) + wmax, maxCwnd);
    };

    const steps = 200;
    const animatedT = (time * 0.3) % (maxT + 1);

    // Draw Reno
    p.stroke(255, 100, 100);
    p.strokeWeight(1.5);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.min(animatedT, maxT);
      const px = graphX + (t / maxT) * graphW;
      const py = graphY + graphH - (renoCwnd(t) / maxCwnd) * graphH;
      p.vertex(px, py);
    }
    p.endShape();

    // Draw CUBIC
    p.stroke(0, 150, 255);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.min(animatedT, maxT);
      const px = graphX + (t / maxT) * graphW;
      const py = graphY + graphH - (Math.max(0, cubicCwnd(t)) / maxCwnd) * graphH;
      p.vertex(px, py);
    }
    p.endShape();

    // Loss markers
    [1.5, 3.0, 4.2].forEach((lt) => {
      if (animatedT < lt) return;
      const lx = graphX + (lt / maxT) * graphW;
      p.stroke(255, 180, 50, 100);
      p.strokeWeight(1);
      setDash(p, [2, 2]);
      p.line(lx, graphY, lx, graphY + graphH);
      setDash(p, []);
      p.noStroke();
      p.fill(255, 180, 50);
      p.textSize(7);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text("perda", lx, graphY + graphH - 2);
    });

    // Legend
    const legY = graphY + graphH + 18;
    p.stroke(255, 100, 100);
    p.strokeWeight(1.5);
    p.line(graphX, legY, graphX + 20, legY);
    p.noStroke();
    p.fill(255, 100, 100);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("TCP Reno (AIMD)", graphX + 25, legY);

    p.stroke(0, 150, 255);
    p.strokeWeight(2);
    p.line(graphX + 120, legY, graphX + 140, legY);
    p.noStroke();
    p.fill(0, 150, 255);
    p.text("TCP CUBIC (padrão Linux)", graphX + 145, legY);

    // Axis labels
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Tempo (s)", graphX + graphW / 2, legY + 10);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("cwnd\n(MSS)", graphX - 20, graphY + graphH / 2);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("CUBIC recupera mais rapidamente após perda — melhor em redes de alta largura de banda", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 6: BBR — delay-based vs loss-based congestion control
export function TCPBBRvsLossBased() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("BBR (Google) — Controle Baseado em Atraso vs Baseado em Perda", w / 2, 6);

    const halfW = w / 2 - 8;

    // Loss-based panel
    const panels = [
      {
        x: 5,
        title: "Baseado em Perda (Reno/CUBIC)",
        col: [255, 100, 100],
        desc: [
          "Usa perda de pacotes como sinal",
          "Enche os buffers antes de recuar",
          "Alto atraso de fila (bufferbloat)",
          "Subutiliza enlace com buffer cheio",
        ],
        phase: 0,
      },
      {
        x: halfW + 11,
        title: "Baseado em Atraso (BBR)",
        col: [0, 150, 255],
        desc: [
          "Mede BtlBw (max bandwidth) e RTprop",
          "Opera no ponto ótimo: BDP = BtlBw × RTprop",
          "Evita encher buffers — baixo atraso",
          "Maximiza banda sem causar congestionamento",
        ],
        phase: 1,
      },
    ];

    panels.forEach((panel) => {
      const pW = halfW - 10;
      const pMid = panel.x + pW / 2;

      p.fill(15, 20, 35);
      p.stroke(panel.col[0], panel.col[1], panel.col[2], 30);
      p.strokeWeight(1);
      p.rect(panel.x, 24, pW, h - 30, 6);

      p.noStroke();
      p.fill(panel.col[0], panel.col[1], panel.col[2]);
      p.textSize(8.5);
      p.textAlign(p.CENTER, p.TOP);
      p.text(panel.title, pMid, 28);

      // Network pipe visualization
      const pipeY = 65;
      const pipeH = 14;
      const pipeW = pW - 30;
      const pipeX = panel.x + 15;

      p.fill(20, 30, 50);
      p.stroke(panel.col[0], panel.col[1], panel.col[2], 40);
      p.strokeWeight(1);
      p.rect(pipeX, pipeY, pipeW, pipeH, 3);

      // Fill based on behavior
      const fillFrac = panel.phase === 0
        ? Math.min(0.95, (p.sin(time * 0.3) * 0.3 + 0.85))
        : 0.65 + p.sin(time * 0.5) * 0.05;
      const fillCol = panel.phase === 0 && fillFrac > 0.9
        ? [255, 100, 100]
        : panel.col;
      p.fill(fillCol[0], fillCol[1], fillCol[2], 130);
      p.noStroke();
      p.rect(pipeX, pipeY, fillFrac * pipeW, pipeH, 3);

      p.fill(200);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(panel.phase === 0 ? "Buffer quase cheio 🔴" : "Buffer ~65% 🟢", pMid, pipeY + 22);

      // RTT meter
      const rttY = pipeY + 40;
      const rtt = panel.phase === 0
        ? 80 + fillFrac * 120
        : 85 + p.sin(time * 0.5) * 5;
      p.fill(100);
      p.textSize(7);
      p.textAlign(p.LEFT, p.TOP);
      p.text("RTT atual:", pipeX, rttY);
      p.fill(panel.phase === 0 && rtt > 140 ? [255, 100, 100] : panel.col);
      p.text(`${rtt.toFixed(0)} ms`, pipeX + 55, rttY);

      // Description bullets
      const descY = rttY + 22;
      p.fill(140);
      p.textSize(7.5);
      p.textAlign(p.LEFT, p.TOP);
      panel.desc.forEach((line, i) => {
        p.fill(i < 2 ? panel.col : [140, 140, 140]);
        p.text("• " + line, panel.x + 12, descY + i * 14);
      });
    });

    // BDP explanation
    const bdpY = h - 55;
    p.fill(15, 20, 35);
    p.stroke(180, 130, 255, 40);
    p.strokeWeight(1);
    p.rect(15, bdpY, w - 30, 30, 5);
    p.noStroke();
    p.fill(180, 130, 255, 200);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("BDP (Bandwidth-Delay Product) = BtlBw × RTprop — quantidade ideal de dados em trânsito", w / 2, bdpY + 10);
    p.fill(140);
    p.textSize(7);
    p.text("BBR mantém cwnd ≈ BDP, operando no ponto ótimo de banda máxima com mínimo atraso", w / 2, bdpY + 22);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("BBR é padrão no YouTube/Google — mede banda disponível sem depender de perdas", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 7: Slow Start detail — exponential growth
export function TCPSlowStartDetail() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Slow Start — Crescimento Exponencial de cwnd", w / 2, 6);

    const graphX = 55;
    const graphY = 32;
    const graphW = w - 75;
    const graphH = h - 90;
    const ssthresh = 32;
    const maxCwnd = 50;

    // Axes
    p.stroke(50);
    p.strokeWeight(1);
    p.line(graphX, graphY, graphX, graphY + graphH);
    p.line(graphX, graphY + graphH, graphX + graphW, graphY + graphH);

    // ssthresh dashed
    const ssY = graphY + graphH - (ssthresh / maxCwnd) * graphH;
    p.stroke(255, 180, 50, 100);
    p.strokeWeight(1);
    setDash(p, [4, 4]);
    p.line(graphX, ssY, graphX + graphW, ssY);
    setDash(p, []);
    p.noStroke();
    p.fill(255, 180, 50, 200);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`ssthresh = ${ssthresh}`, graphX + 4, ssY + 2);

    // Y ticks
    p.fill(80);
    p.textSize(7);
    for (let v = 0; v <= maxCwnd; v += 8) {
      const yy = graphY + graphH - (v / maxCwnd) * graphH;
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(v.toString(), graphX - 4, yy);
      p.stroke(25);
      p.strokeWeight(0.5);
      p.line(graphX, yy, graphX + graphW, yy);
      p.noStroke();
    }

    // Compute cwnd steps
    const rtts: { rtt: number; cwnd: number; phase: string }[] = [];
    let cw = 1;
    for (let rtt = 0; rtt <= 10; rtt++) {
      const phase = cw < ssthresh ? "SS" : "CA";
      rtts.push({ rtt, cwnd: cw, phase });
      if (cw < ssthresh) cw = Math.min(cw * 2, ssthresh);
      else cw = Math.min(cw + 1, maxCwnd);
    }

    const stepW = graphW / (rtts.length - 1);
    const animRTT = (time * 1.2) % (rtts.length + 1);

    // Draw bars for each RTT
    rtts.forEach((pt, i) => {
      if (i >= animRTT) return;
      const px = graphX + i * stepW;
      const py = graphY + graphH - (pt.cwnd / maxCwnd) * graphH;
      const barCol = pt.phase === "SS" ? [0, 150, 255] : [100, 200, 100];

      // Vertical bar
      p.fill(barCol[0], barCol[1], barCol[2], 40);
      p.noStroke();
      p.rect(px - stepW * 0.3, py, stepW * 0.6, graphY + graphH - py, 2);

      // Dot
      p.fill(barCol[0], barCol[1], barCol[2], 220);
      p.ellipse(px, py, 8, 8);

      // cwnd label
      p.fill(barCol[0], barCol[1], barCol[2], 200);
      p.textSize(8);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(pt.cwnd.toString(), px, py - 2);

      // RTT label
      p.fill(80);
      p.textSize(7);
      p.textAlign(p.CENTER, p.TOP);
      p.text(pt.rtt.toString(), px, graphY + graphH + 3);
    });

    // Connect dots
    p.stroke(0, 150, 255);
    p.strokeWeight(1.5);
    p.noFill();
    p.beginShape();
    rtts.forEach((pt, i) => {
      if (i >= animRTT) return;
      const px = graphX + i * stepW;
      const py = graphY + graphH - (pt.cwnd / maxCwnd) * graphH;
      p.vertex(px, py);
    });
    p.endShape();

    // Phase labels
    const transitionRTT = rtts.findIndex((r) => r.phase === "CA");
    if (transitionRTT > 0) {
      const txPx = graphX + transitionRTT * stepW;
      p.noStroke();
      p.fill(0, 150, 255, 150);
      p.textSize(8);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text("Slow Start (exponencial)", txPx - 5, ssY - 12);
      p.fill(100, 200, 100, 150);
      p.textAlign(p.LEFT, p.CENTER);
      p.text("Prev. Congestionamento (+1/RTT)", txPx + 5, ssY - 12);
    }

    // Legend
    const legY = graphY + graphH + 18;
    p.fill(0, 150, 255, 200);
    p.noStroke();
    p.rect(graphX, legY, 12, 10, 2);
    p.fill(140);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("Slow Start (cwnd < ssthresh)", graphX + 16, legY + 5);

    p.fill(100, 200, 100, 200);
    p.noStroke();
    p.rect(graphX + 180, legY, 12, 10, 2);
    p.fill(140);
    p.text("Prevenção de Congestionamento (cwnd ≥ ssthresh)", graphX + 196, legY + 5);

    p.fill(100);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("RTT", graphX + graphW / 2, legY + 16);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("\"Slow\" Start não é lento — é exponencial! Só parece lento em comparação ao ideal.", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

