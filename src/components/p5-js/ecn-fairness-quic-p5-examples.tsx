"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

const setDash = (p: p5, dash: number[]) =>
  (p.drawingContext as CanvasRenderingContext2D).setLineDash(dash);

// Visualization 1: ECN — router marks packet instead of dropping
export function ECNSignaling() {
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
    p.text("ECN — Sinalização Explícita de Congestionamento", w / 2, 6);

    // Two scenarios side by side
    const halfW = w / 2 - 8;
    const panels = [
      { x: 5, title: "Sem ECN (Drop)", col: [255, 100, 100], drop: true },
      { x: halfW + 11, title: "Com ECN (Mark)", col: [0, 150, 255], drop: false },
    ];

    panels.forEach((panel) => {
      const pW = halfW - 10;
      const midX = panel.x + pW / 2;

      p.fill(15, 20, 35);
      p.stroke(panel.col[0], panel.col[1], panel.col[2], 30);
      p.strokeWeight(1);
      p.rect(panel.x, 24, pW, h - 56, 6);

      p.noStroke();
      p.fill(panel.col[0], panel.col[1], panel.col[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text(panel.title, midX, 28);

      // Sender
      const sndX = panel.x + 18;
      const sndY = 55;
      p.fill(15, 20, 35);
      p.stroke(0, 150, 255, 60);
      p.strokeWeight(1);
      p.rect(sndX, sndY, 44, 22, 4);
      p.noStroke();
      p.fill(0, 150, 255, 200);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Emissor", sndX + 22, sndY + 11);

      // Router
      const rtrX = midX - 22;
      const rtrY = 55;
      p.fill(15, 20, 35);
      p.stroke(panel.col[0], panel.col[1], panel.col[2], 70);
      p.strokeWeight(1.5);
      p.rect(rtrX, rtrY, 44, 22, 4);
      p.noStroke();
      p.fill(panel.col[0], panel.col[1], panel.col[2], 200);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Roteador", rtrX + 22, rtrY + 11);

      // Buffer fill bar
      const bufFill = 0.85 + p.sin(time * 0.4) * 0.1;
      const bfX = rtrX + 4;
      const bfY = rtrY + 24;
      const bfW = 36;
      const bfH = 6;
      p.fill(20, 30, 50);
      p.stroke(50);
      p.strokeWeight(0.5);
      p.rect(bfX, bfY, bfW, bfH, 2);
      p.fill(bufFill > 0.9 ? 255 : 255, bufFill > 0.9 ? 100 : 180, bufFill > 0.9 ? 100 : 50, 150);
      p.noStroke();
      p.rect(bfX, bfY, bufFill * bfW, bfH, 2);
      p.fill(120);
      p.textSize(6);
      p.textAlign(p.CENTER, p.TOP);
      p.text("buffer", rtrX + 22, bfY + 7);

      // Receiver
      const rcvX = panel.x + pW - 62;
      const rcvY = 55;
      p.fill(15, 20, 35);
      p.stroke(255, 180, 50, 60);
      p.strokeWeight(1);
      p.rect(rcvX, rcvY, 44, 22, 4);
      p.noStroke();
      p.fill(255, 180, 50, 200);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Receptor", rcvX + 22, rcvY + 11);

      // Packet animation
      const pktPhase = (time * 0.45) % 1;
      const pktX = p.lerp(sndX + 44, rtrX, pktPhase);
      const pktY = rtrY + 6;

      if (panel.drop) { p.fill(255, 180, 50, 200); } else { p.fill(0, 150, 255, 200); }
      p.noStroke();
      p.rect(pktX - 14, pktY, 28, 12, 3);
      p.fill(255);
      p.textSize(6.5);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(panel.drop ? "ECT=0" : "ECT=1", pktX, pktY + 6);

      if (panel.drop) {
        // Dropped packet — X after router
        if (pktPhase > 0.6) {
          const dropX = rtrX + 44 + (pktPhase - 0.6) * 30;
          p.fill(255, 100, 100, 200);
          p.textSize(16);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("✕", dropX, pktY + 6);
        }
      } else {
        // Marked packet continues
        if (pktPhase > 0.5) {
          const mkdX = p.lerp(rtrX + 44, rcvX, (pktPhase - 0.5) / 0.5);
          p.fill(255, 100, 100, 200);
          p.noStroke();
          p.rect(mkdX - 14, pktY, 28, 12, 3);
          p.fill(255);
          p.textSize(6.5);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("CE=1 ⚑", mkdX, pktY + 6);
        }
      }

      // Response flow description
      const descY = rtrY + 50;
      const steps = panel.drop
        ? ["1. Buffer quase cheio", "2. Roteador DESCARTA pkt", "3. Emissor detecta via timeout", "   ou 3 ACKs dup (lento)"]
        : ["1. Buffer quase cheio", "2. Roteador MARCA CE=1 no IP", "3. Receptor ecoa CE via ECE no ACK", "4. Emissor reduz cwnd (rápido!)"];

      steps.forEach((s, i) => {
        p.noStroke();
        if (i < 2) { p.fill(panel.col[0], panel.col[1], panel.col[2]); } else { p.fill(140, 140, 160); }
        p.textSize(7.5);
        p.textAlign(p.LEFT, p.TOP);
        p.text(s, panel.x + 10, descY + i * 13);
      });
    });

    // ECN bits explanation
    const bitsY = h - 48;
    p.fill(15, 20, 35);
    p.stroke(180, 130, 255, 40);
    p.strokeWeight(1);
    p.rect(10, bitsY, w - 20, 36, 5);
    p.noStroke();
    p.fill(180, 130, 255, 200);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Bits ECN no cabeçalho IP (campo ToS): ECT(0), ECT(1) = ECN-Capable; CE = Congestion Experienced", w / 2, bitsY + 5);
    p.fill(140);
    p.textSize(7.5);
    p.text("No TCP: bit ECE no ACK (receptor→emissor) + bit CWR no próximo segmento (emissor→receptor)", w / 2, bitsY + 20);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("ECN permite reação ao congestionamento SEM perda de pacotes", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={330} />;
}

// Visualization 2: TCP Fairness — two flows converging to fair share
export function TCPFairnessConvergence() {
  let time = 0;
  let flow1 = 5;
  let flow2 = 30;
  const trailA: [number, number][] = [];
  let tick = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    tick++;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Equidade TCP — Convergência para Compartilhamento Justo", w / 2, 6);

    const graphX = 55;
    const graphY = 30;
    const graphW = w - 80;
    const graphH = h - 90;
    const cap = 40; // total capacity in MSS

    // Update flows
    if (tick % 5 === 0) {
      trailA.push([flow1, flow2]);
      if (trailA.length > 80) trailA.shift();

      const total = flow1 + flow2;
      if (total >= cap) {
        // Loss: multiplicative decrease
        flow1 = Math.max(flow1 / 2, 1);
        flow2 = Math.max(flow2 / 2, 1);
      } else {
        // Additive increase
        flow1 = Math.min(flow1 + 1, cap - 1);
        flow2 = Math.min(flow2 + 1, cap - 1);
      }
    }

    // Axes
    p.stroke(50);
    p.strokeWeight(1);
    p.line(graphX, graphY, graphX, graphY + graphH);
    p.line(graphX, graphY + graphH, graphX + graphW, graphY + graphH);

    p.noStroke();
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Vazão Fluxo 1 (MSS)", graphX + graphW / 2, graphY + graphH + 5);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("Vazão\nFluxo 2\n(MSS)", graphX - 5, graphY + graphH / 2);

    // Tick marks
    for (let v = 0; v <= cap; v += 10) {
      const xx = graphX + (v / cap) * graphW;
      const yy = graphY + graphH - (v / cap) * graphH;
      p.fill(60);
      p.textSize(7);
      p.textAlign(p.CENTER, p.TOP);
      p.text(v.toString(), xx, graphY + graphH + 3);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(v.toString(), graphX - 3, yy);
      p.stroke(25);
      p.strokeWeight(0.5);
      p.line(xx, graphY, xx, graphY + graphH);
      p.line(graphX, yy, graphX + graphW, yy);
      p.noStroke();
    }

    // Equal bandwidth line (x + y = cap)
    p.stroke(100, 200, 100, 80);
    p.strokeWeight(1.5);
    setDash(p, [5, 5]);
    p.line(graphX, graphY + graphH - (cap / cap) * graphH, graphX + graphW, graphY + graphH);
    setDash(p, []);
    p.noStroke();
    p.fill(100, 200, 100, 180);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text("x₁+x₂=C (capacidade)", graphX + 5, graphY + 5);

    // Equal share line (x = y)
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(1);
    setDash(p, [3, 3]);
    p.line(graphX, graphY + graphH, graphX + graphW, graphY);
    setDash(p, []);
    p.noStroke();
    p.fill(255, 180, 50, 160);
    p.textSize(8);
    p.textAlign(p.RIGHT, p.TOP);
    p.text("x₁=x₂ (equidade)", graphX + graphW - 2, graphY + 5);

    // Fair point
    const fairPx = graphX + (cap / 2 / cap) * graphW;
    const fairPy = graphY + graphH - (cap / 2 / cap) * graphH;
    p.fill(100, 200, 100, 180);
    p.noStroke();
    p.ellipse(fairPx, fairPy, 10, 10);
    p.fill(100, 200, 100, 200);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("Ponto justo", fairPx + 6, fairPy);

    // Draw trail
    if (trailA.length > 1) {
      p.stroke(0, 150, 255, 120);
      p.strokeWeight(1.5);
      p.noFill();
      p.beginShape();
      trailA.forEach(([x, y]) => {
        const px = graphX + (x / cap) * graphW;
        const py = graphY + graphH - (y / cap) * graphH;
        p.vertex(px, py);
      });
      p.endShape();
    }

    // Current point
    const curPx = graphX + (flow1 / cap) * graphW;
    const curPy = graphY + graphH - (flow2 / cap) * graphH;
    p.fill(0, 150, 255);
    p.noStroke();
    p.ellipse(curPx, curPy, 8, 8);

    // AI arrow
    const aiLen = 20;
    const aiAngle = Math.PI / 4; // 45 degrees (equal increase)
    p.stroke(0, 150, 255, 150);
    p.strokeWeight(1);
    p.line(curPx, curPy, curPx + Math.cos(aiAngle) * aiLen, curPy - Math.sin(aiAngle) * aiLen);

    // Legend
    const legY = graphY + graphH + 22;
    p.noStroke();
    p.fill(0, 150, 255);
    p.ellipse(graphX + 8, legY + 5, 7, 7);
    p.fill(140);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("Trajetória AIMD (AI diagonal, MD em direção à origem)", graphX + 16, legY + 5);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("AIMD converge para o ponto de operação justo e eficiente", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 3: Fairness limits — UDP and parallel connections
export function TCPFairnessLimits() {
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
    p.text("Limites da Equidade TCP", w / 2, 6);

    const cap = w - 60;
    const barY = 50;
    const barH = 28;
    const barX = 30;

    // Scenario 1: Fair — 4 TCP flows
    const label1Y = barY - 14;
    p.fill(100, 200, 100);
    p.textSize(9);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Cenário 1 — 4 fluxos TCP (equitativo)", barX, label1Y);

    const tcpShare = cap / 4;
    const tcpCols = [[0, 150, 255], [0, 120, 220], [0, 90, 190], [0, 60, 160]];
    let bx = barX;
    for (let i = 0; i < 4; i++) {
      const animate = 1 - Math.max(0, p.sin(time * 2 + i * 0.5)) * 0.05;
      const bw = tcpShare * animate;
      p.fill(tcpCols[i][0], tcpCols[i][1], tcpCols[i][2], 150);
      p.noStroke();
      p.rect(bx, barY, bw, barH, 2);
      p.fill(220);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`TCP ${i + 1}\n${Math.round(bw / cap * 100)}%`, bx + bw / 2, barY + barH / 2);
      bx += bw;
    }

    // Scenario 2: UDP stealing bandwidth
    const barY2 = barY + barH + 35;
    p.fill(255, 100, 100);
    p.textSize(9);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Cenário 2 — 1 fluxo UDP agressivo + 3 fluxos TCP (injusto!)", barX, barY2 - 14);

    const udpShare = cap * 0.55;
    const tcpShareReduced = (cap - udpShare) / 3;

    // UDP bar (pulsing)
    const udpPulse = p.sin(time * 3) * 0.03 + 0.55;
    p.fill(255, 100, 100, 170);
    p.noStroke();
    p.rect(barX, barY2, cap * udpPulse, barH, 2);
    p.fill(255);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`UDP (sem controle)\n${Math.round(udpPulse * 100)}%`, barX + cap * udpPulse / 2, barY2 + barH / 2);

    let bx2 = barX + cap * udpPulse;
    for (let i = 0; i < 3; i++) {
      const bw = tcpShareReduced * (1 - udpPulse + 0.55);
      p.fill(0, 100, 200, 120);
      p.noStroke();
      p.rect(bx2, barY2, bw, barH, 2);
      p.fill(180);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`T${i + 1}`, bx2 + bw / 2, barY2 + barH / 2);
      bx2 += bw;
    }

    // Scenario 3: parallel TCP connections
    const barY3 = barY2 + barH + 35;
    p.fill(255, 180, 50);
    p.textSize(9);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Cenário 3 — 1 app com 9 conexões TCP vs 1 app com 1 conexão (injusto!)", barX, barY3 - 14);

    const parallelShare = cap * 0.9;
    const singleShare = cap * 0.1;

    p.fill(255, 180, 50, 160);
    p.noStroke();
    p.rect(barX, barY3, parallelShare, barH, 2);
    p.fill(255);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("App A (9 conexões TCP) — 90% da banda", barX + parallelShare / 2, barY3 + barH / 2);

    p.fill(0, 150, 255, 130);
    p.noStroke();
    p.rect(barX + parallelShare, barY3, singleShare, barH, 2);
    p.fill(200);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("App B\n10%", barX + parallelShare + singleShare / 2, barY3 + barH / 2);

    // Summary
    const sumY = barY3 + barH + 20;
    p.fill(15, 20, 35);
    p.stroke(255, 100, 100, 40);
    p.strokeWeight(1);
    p.rect(barX - 10, sumY, cap + 20, 38, 5);
    p.noStroke();
    p.fill(255, 100, 100, 200);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text("⚠ Limites da equidade:", barX, sumY + 5);
    p.fill(160);
    p.text("• UDP não implementa controle de congestionamento — pode monopolizar banda", barX + 5, sumY + 18);
    p.text("• Múltiplas conexões TCP paralelas contornam a equidade — cada uma recebe 1 share", barX + 5, sumY + 30);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Equidade funciona entre fluxos TCP honestos — mas não é universal", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={330} />;
}

// Visualization 4: QUIC architecture — UDP + TLS + HTTP/3 in one handshake
export function QUICArchitecture() {
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
    p.text("Arquitetura QUIC — Camadas Integradas", w / 2, 6);

    const halfW = w / 2 - 10;

    // TCP/TLS stack
    const tcpLayers = [
      { label: "HTTP/2", col: [100, 200, 100], h: 28 },
      { label: "TLS 1.3", col: [180, 130, 255], h: 28 },
      { label: "TCP", col: [0, 150, 255], h: 28 },
      { label: "IP", col: [255, 180, 50], h: 28 },
    ];

    // QUIC stack
    const quicLayers = [
      { label: "HTTP/3", col: [100, 200, 100], h: 28 },
      { label: "QUIC (streams + TLS + CC)", col: [180, 130, 255], h: 28 },
      { label: "UDP", col: [0, 150, 255], h: 28 },
      { label: "IP", col: [255, 180, 50], h: 28 },
    ];

    const stackW = halfW - 40;
    const stackStartY = 38;

    const drawStack = (layers: typeof tcpLayers, sx: number, title: string) => {
      p.noStroke();
      p.fill(140);
      p.textSize(9);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(title, sx + stackW / 2, stackStartY - 2);

      let ly = stackStartY;
      layers.forEach((layer) => {
        const pulse = p.sin(time * 1.5 + layers.indexOf(layer) * 0.8) * 8;
        p.fill(15, 20, 35);
        p.stroke(layer.col[0], layer.col[1], layer.col[2], 60 + pulse);
        p.strokeWeight(1.5);
        p.rect(sx, ly, stackW, layer.h, 4);
        p.noStroke();
        p.fill(layer.col[0], layer.col[1], layer.col[2], 220);
        p.textSize(9);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(layer.label, sx + stackW / 2, ly + layer.h / 2);
        ly += layer.h + 3;
      });
    };

    drawStack(tcpLayers, 20, "TCP/TLS/HTTP2");
    drawStack(quicLayers, halfW + 30, "QUIC/HTTP3");

    // Brace annotations for TCP stack
    const tcpBraceX = 20 + stackW + 5;
    const tcpBraceY = stackStartY;
    const tcpBraceH = (28 + 3) * 3 - 3;

    p.stroke(255, 100, 100, 100);
    p.strokeWeight(1);
    p.line(tcpBraceX, tcpBraceY, tcpBraceX + 5, tcpBraceY);
    p.line(tcpBraceX + 5, tcpBraceY, tcpBraceX + 5, tcpBraceY + tcpBraceH);
    p.line(tcpBraceX + 5, tcpBraceY + tcpBraceH, tcpBraceX, tcpBraceY + tcpBraceH);
    p.noStroke();
    p.fill(255, 100, 100, 180);
    p.textSize(7);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("3 camadas\nseparadas\n→ 3 RTTs", tcpBraceX + 8, tcpBraceY + tcpBraceH / 2);

    // Brace for QUIC — single layer
    const quicBraceX = halfW + 30 - 22;
    const quicBraceY = stackStartY + 28 + 3;
    const quicBraceH = 28;

    p.stroke(100, 200, 100, 100);
    p.strokeWeight(1);
    p.line(quicBraceX, quicBraceY, quicBraceX - 5, quicBraceY);
    p.line(quicBraceX - 5, quicBraceY, quicBraceX - 5, quicBraceY + quicBraceH);
    p.line(quicBraceX - 5, quicBraceY + quicBraceH, quicBraceX, quicBraceY + quicBraceH);
    p.noStroke();
    p.fill(100, 200, 100, 180);
    p.textSize(7);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("1 camada\nunificada\n→ 1 RTT", quicBraceX - 8, quicBraceY + quicBraceH / 2);

    // Feature comparison below
    const featY = stackStartY + (28 + 3) * 4 + 10;

    const features = [
      { label: "Confiabilidade", tcp: "TCP", quic: "QUIC" },
      { label: "Criptografia", tcp: "TLS (separado)", quic: "Integrada" },
      { label: "Controle de Congestionamento", tcp: "TCP", quic: "QUIC" },
      { label: "Multiplexação de streams", tcp: "Não (HOL block)", quic: "Sim (nativo)" },
      { label: "Handshake inicial", tcp: "1.5 RTT (TCP) + 1 RTT (TLS)", quic: "1 RTT (ou 0-RTT)" },
    ];

    const colW = (w - 40) / 3;
    p.fill(80);
    p.textSize(7.5);
    p.textAlign(p.CENTER, p.CENTER);
    ["Funcionalidade", "TCP + TLS", "QUIC"].forEach((hdr, i) => {
      p.fill(15, 20, 35);
      p.stroke(60);
      p.strokeWeight(0.5);
      p.rect(20 + i * colW, featY, colW, 16, 2);
      p.noStroke();
      p.fill(160);
      p.text(hdr, 20 + i * colW + colW / 2, featY + 8);
    });

    features.forEach((f, ri) => {
      const ry = featY + 16 + ri * 16;
      [f.label, f.tcp, f.quic].forEach((cell, ci) => {
        p.fill(12, 18, 30);
        p.stroke(35);
        p.strokeWeight(0.5);
        p.rect(20 + ci * colW, ry, colW, 16, 1);
        p.noStroke();
        const col = ci === 2
          ? [100, 200, 100]
          : ci === 1
          ? [255, 100, 100]
          : [160, 160, 160];
        p.fill(col[0], col[1], col[2], ci === 0 ? 180 : 220);
        p.textSize(7);
        p.text(cell, 20 + ci * colW + colW / 2, ry + 8);
      });
    });

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("QUIC integra transporte, segurança e controle em uma única camada sobre UDP", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={370} />;
}

// Visualization 5: QUIC 1-RTT handshake vs TCP+TLS
export function QUICHandshakeComparison() {
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
    p.text("Handshake: TCP+TLS vs QUIC", w / 2, 6);

    const halfW = w / 2 - 8;
    const panels = [
      {
        x: 5, title: "TCP + TLS 1.3",
        col: [255, 100, 100],
        msgs: [
          { y: 0.07, fromA: true,  label: "TCP SYN",           sub: "" },
          { y: 0.18, fromA: false, label: "TCP SYNACK",         sub: "" },
          { y: 0.29, fromA: true,  label: "TCP ACK + TLS CH",   sub: "" },
          { y: 0.42, fromA: false, label: "TLS ServerHello+Cert",sub: "" },
          { y: 0.53, fromA: true,  label: "TLS Finished",       sub: "" },
          { y: 0.68, fromA: true,  label: "HTTP GET",           sub: "Primeiro dado útil" },
          { y: 0.82, fromA: false, label: "HTTP Response",      sub: "" },
        ],
        rttLabels: [
          { y1: 0.07, y2: 0.18, label: "1 RTT (TCP)" },
          { y1: 0.29, y2: 0.53, label: "1 RTT (TLS)" },
          { y1: 0.53, y2: 0.68, label: "½ RTT" },
        ],
      },
      {
        x: halfW + 11, title: "QUIC",
        col: [0, 150, 255],
        msgs: [
          { y: 0.10, fromA: true,  label: "Initial (CRYPTO)",    sub: "chaves+params" },
          { y: 0.28, fromA: false, label: "Initial+Handshake",   sub: "chaves servidor" },
          { y: 0.45, fromA: true,  label: "Handshake+HTTP GET",  sub: "Primeiro dado útil!" },
          { y: 0.65, fromA: false, label: "HTTP Response",       sub: "" },
        ],
        rttLabels: [
          { y1: 0.10, y2: 0.45, label: "1 RTT total" },
        ],
      },
    ];

    panels.forEach((panel) => {
      const pW = halfW - 10;
      const colA = panel.x + 40;
      const colB = panel.x + pW - 40;
      const tlTop = 38;
      const tlH = h - 75;

      p.fill(15, 20, 35);
      p.stroke(panel.col[0], panel.col[1], panel.col[2], 30);
      p.strokeWeight(1);
      p.rect(panel.x, 24, pW, h - 30, 6);

      p.noStroke();
      p.fill(panel.col[0], panel.col[1], panel.col[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text(panel.title, panel.x + pW / 2, 28);

      // Timeline
      p.stroke(0, 150, 255, 25);
      p.strokeWeight(0.5);
      p.line(colA, tlTop, colA, tlTop + tlH);
      p.stroke(255, 180, 50, 25);
      p.line(colB, tlTop, colB, tlTop + tlH);

      p.noStroke();
      p.fill(0, 150, 255, 150);
      p.textSize(7);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text("Cliente", colA, tlTop - 1);
      p.fill(255, 180, 50, 150);
      p.text("Servidor", colB, tlTop - 1);

      // RTT bracket annotations
      panel.rttLabels.forEach((rl) => {
        const y1 = tlTop + rl.y1 * tlH;
        const y2 = tlTop + rl.y2 * tlH;
        const bx = colB + 8;
        p.stroke(100, 200, 100, 80);
        p.strokeWeight(1);
        p.line(bx, y1, bx + 4, y1);
        p.line(bx + 4, y1, bx + 4, y2);
        p.line(bx + 4, y2, bx, y2);
        p.noStroke();
        p.fill(100, 200, 100, 180);
        p.textSize(7);
        p.textAlign(p.LEFT, p.CENTER);
        p.text(rl.label, bx + 6, (y1 + y2) / 2);
      });

      // Messages
      const loopT = (time * 0.08) % 1;
      panel.msgs.forEach((msg) => {
        const my = tlTop + msg.y * tlH;
        const fromX = msg.fromA ? colA : colB;
        const toX = msg.fromA ? colB : colA;
        const prog = p.constrain((loopT - msg.y + 0.15) / 0.12, 0, 1);
        const curX = p.lerp(fromX, toX, prog);

        const isData = msg.sub === "Primeiro dado útil" || msg.sub === "Primeiro dado útil!";
        const col = isData ? [100, 200, 100] : panel.col;

        p.stroke(col[0], col[1], col[2], 90);
        p.strokeWeight(1.2);
        p.line(fromX, my, curX, my);

        if (prog >= 1) {
          p.fill(col[0], col[1], col[2], 110);
          p.noStroke();
          const dir = msg.fromA ? -1 : 1;
          p.triangle(toX, my, toX + dir * 6, my - 3, toX + dir * 6, my + 3);
        }

        p.noStroke();
        p.fill(col[0], col[1], col[2], 200);
        p.textSize(7.5);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text(msg.label, (fromX + toX) / 2, my - 3);
        if (msg.sub) {
          if (isData) { p.fill(100, 200, 100, 200); } else { p.fill(120, 120, 140, 200); }
          p.textSize(6.5);
          p.text(msg.sub, (fromX + toX) / 2, my + 9);
        }
      });
    });

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("QUIC: 1 RTT para conexão + criptografia + primeiro dado | TCP+TLS: 2.5 RTTs", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={370} />;
}

// Visualization 6: HOL Blocking — TCP vs QUIC streams
export function QUICHOLBlocking() {
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
    p.text("HOL Blocking — TCP/HTTP2 vs QUIC/HTTP3", w / 2, 6);

    const halfW = w / 2 - 8;

    // TCP/HTTP2 panel
    const tcpX = 5;
    const quicX = halfW + 11;
    const pW = halfW - 10;

    [
      { x: tcpX,  title: "HTTP/2 sobre TCP (HOL Block)",  col: [255, 100, 100], blocked: true  },
      { x: quicX, title: "HTTP/3 sobre QUIC (Sem HOL)",   col: [0, 150, 255],  blocked: false },
    ].forEach((panel) => {
      p.fill(15, 20, 35);
      p.stroke(panel.col[0], panel.col[1], panel.col[2], 30);
      p.strokeWeight(1);
      p.rect(panel.x, 24, pW, h - 30, 6);

      p.noStroke();
      p.fill(panel.col[0], panel.col[1], panel.col[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text(panel.title, panel.x + pW / 2, 28);

      const streamColors = [[0, 150, 255], [255, 180, 50], [100, 200, 100]];
      const streamLabels = ["HTML", "CSS", "JS"];
      const streamY = [50, 85, 120];
      const pipeX = panel.x + 12;
      const pipeW = pW - 24;
      const pktH = 18;

      if (panel.blocked) {
        // TCP: single stream — packet 1 lost blocks everything

        p.fill(80);
        p.textSize(7.5);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Conexão TCP única (todos os streams):", pipeX, 44);

        // Single pipe
        p.fill(20, 30, 50);
        p.stroke(80);
        p.strokeWeight(0.5);
        p.rect(pipeX, 58, pipeW, pktH * 3 + 8, 3);

        streamColors.forEach((col, si) => {
          const py = 60 + si * (pktH + 2);
          // Packets before loss
          for (let i = 0; i < 3; i++) {
            const px = pipeX + 2 + i * (pktH + 2);
            if (i === 1 && si === 0) {
              // Lost packet — blinking
              const blink = p.sin(time * 6) > 0;
              if (blink) {
                p.fill(255, 100, 100, 180);
                p.noStroke();
                p.rect(px, py, pktH, pktH, 3);
                p.fill(255);
                p.textSize(7);
                p.textAlign(p.CENTER, p.CENTER);
                p.text("✕", px + pktH / 2, py + pktH / 2);
              }
            } else {
              p.fill(col[0], col[1], col[2], 160);
              p.noStroke();
              p.rect(px, py, pktH, pktH, 3);
            }
          }
        });

        // Blocked indicator
        const blkX = pipeX + 2 + 1 * (pktH + 2) + pktH + 60;
        p.fill(255, 100, 100, 80);
        p.noStroke();
        p.rect(blkX, 58, pipeW - blkX + pipeX, pktH * 3 + 8, 3);
        p.fill(255, 100, 100, 200);
        p.textSize(8);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("BLOQUEADO ⚠", blkX + (pipeW - blkX + pipeX) / 2, 58 + (pktH * 3 + 8) / 2);

        p.fill(255, 100, 100, 180);
        p.textSize(7.5);
        p.textAlign(p.LEFT, p.TOP);
        p.text("1 pacote perdido bloqueia", pipeX, 125);
        p.text("TODOS os streams HTTP/2", pipeX, 137);

      } else {
        // QUIC: independent streams
        p.fill(80);
        p.textSize(7.5);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Streams QUIC independentes:", pipeX, 44);

        streamColors.forEach((col, si) => {
          const py = streamY[si] + 12;
          const pipeYs = py;

          // Stream label
          p.fill(col[0], col[1], col[2], 180);
          p.textSize(7.5);
          p.textAlign(p.LEFT, p.CENTER);
          p.text(`Stream ${streamLabels[si]}:`, pipeX, pipeYs - 8);

          // Individual pipe
          p.fill(20, 30, 50);
          p.stroke(col[0], col[1], col[2], 40);
          p.strokeWeight(0.5);
          p.rect(pipeX + 65, pipeYs - pktH / 2, pipeW - 65, pktH, 3);

          // Packets flowing
          for (let i = 0; i < 4; i++) {
            const pktPhase = ((time * 0.5 + si * 0.25 + i * 0.25) % 1);
            if (si === 1 && i === 1) {
              // Lost packet on stream 2 — only affects stream 2
              const blink = p.sin(time * 6) > 0;
              if (blink && pktPhase < 0.4) {
                const pkx = pipeX + 65 + pktPhase * (pipeW - 65 - pktH);
                p.fill(255, 100, 100, 180);
                p.noStroke();
                p.rect(pkx, pipeYs - pktH / 2, pktH, pktH, 3);
                p.fill(255);
                p.textSize(7);
                p.textAlign(p.CENTER, p.CENTER);
                p.text("✕", pkx + pktH / 2, pipeYs);
              }
            } else {
              const pkx = pipeX + 65 + pktPhase * (pipeW - 65 - pktH);
              p.fill(col[0], col[1], col[2], 160);
              p.noStroke();
              p.rect(pkx, pipeYs - pktH / 2, pktH, pktH, 3);
            }
          }
        });

        p.fill(100, 200, 100, 180);
        p.textSize(7.5);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Stream 2 perdida →", pipeX, 150);
        p.text("streams 1 e 3 não afetadas", pipeX, 162);
      }

      // Bottom explanation
      const exY = h - 60;
      p.fill(15, 20, 35);
      p.stroke(panel.col[0], panel.col[1], panel.col[2], 30);
      p.strokeWeight(1);
      p.rect(panel.x + 5, exY, pW - 10, 26, 4);
      p.noStroke();
      p.fill(panel.col[0], panel.col[1], panel.col[2], 180);
      p.textSize(7.5);
      p.textAlign(p.CENTER, p.CENTER);
      const msg = panel.blocked
        ? "TCP garante ordem → perda bloqueia tudo"
        : "QUIC streams independentes → perda isola";
      p.text(msg, panel.x + pW / 2, exY + 13);
    });

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("QUIC elimina o HOL blocking do TCP mantendo entrega ordenada por stream", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

