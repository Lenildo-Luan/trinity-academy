"use client";

import { P5Sketch } from "../p5-sketch";
import type p5 from "p5";

// Visualization 1: UDP Best-Effort Delivery — packets sent without handshake, some may be lost
export function UDPBestEffort() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("UDP — Entrega de Melhor Esforço", w / 2, 10);

    // Sender host
    const senderX = 40;
    const senderY = 55;
    const hostW = 120;
    const hostH = 160;

    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 80);
    p.strokeWeight(2);
    p.rect(senderX, senderY, hostW, hostH, 8);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Emissor", senderX + hostW / 2, senderY + 8);
    p.fill(80);
    p.textSize(9);
    p.text("Aplicação", senderX + hostW / 2, senderY + 26);

    // Application data blocks
    const dataColors = [
      [100, 200, 100],
      [100, 200, 100],
      [100, 200, 100],
    ];
    for (let i = 0; i < 3; i++) {
      const dy = senderY + 48 + i * 34;
      p.fill(dataColors[i][0], dataColors[i][1], dataColors[i][2], 30);
      p.stroke(dataColors[i][0], dataColors[i][1], dataColors[i][2], 80);
      p.strokeWeight(1);
      p.rect(senderX + 15, dy, hostW - 30, 26, 4);
      p.noStroke();
      p.fill(dataColors[i][0], dataColors[i][1], dataColors[i][2]);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`Dados ${i + 1}`, senderX + hostW / 2, dy + 13);
    }

    // Receiver host
    const receiverX = w - hostW - 40;

    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 80);
    p.strokeWeight(2);
    p.rect(receiverX, senderY, hostW, hostH, 8);
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Receptor", receiverX + hostW / 2, senderY + 8);
    p.fill(80);
    p.textSize(9);
    p.text("Aplicação", receiverX + hostW / 2, senderY + 26);

    // Network cloud in the middle
    const cloudX = w / 2;
    const cloudY = senderY + hostH / 2;

    p.fill(20, 30, 50, 150);
    p.stroke(80, 80, 120, 60);
    p.strokeWeight(1);
    p.ellipse(cloudX, cloudY, 120, 70);
    p.noStroke();
    p.fill(80);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Rede", cloudX, cloudY - 8);
    p.fill(60);
    p.textSize(7);
    p.text("(melhor esforço)", cloudX, cloudY + 6);

    // Animated datagrams
    const datagrams = [
      { delay: 0, lost: false, color: [100, 200, 100], label: "D1" },
      { delay: 1.2, lost: true, color: [255, 100, 100], label: "D2" },
      { delay: 2.4, lost: false, color: [100, 200, 100], label: "D3" },
      { delay: 3.6, lost: false, color: [100, 200, 100], label: "D4" },
      { delay: 4.8, lost: true, color: [255, 100, 100], label: "D5" },
    ];

    const pathStartX = senderX + hostW + 5;
    const pathEndX = receiverX - 5;
    const pathY = cloudY;
    const lostX = cloudX;

    datagrams.forEach((dg) => {
      const phase = ((time * 0.8 - dg.delay) % 7);
      if (phase < 0 || phase > 2.5) return;

      const progress = phase / 2.5;

      if (dg.lost && progress > 0.45 && progress < 0.55) {
        // Show X for lost packet
        const px = pathStartX + progress * (pathEndX - pathStartX);
        p.fill(255, 60, 60);
        p.noStroke();
        p.textSize(16);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("✕", px, pathY);
        p.fill(255, 60, 60);
        p.textSize(7);
        p.text("perdido!", px, pathY + 14);
        return;
      }

      if (dg.lost && progress >= 0.55) return;

      const px = pathStartX + progress * (pathEndX - pathStartX);
      p.fill(dg.color[0], dg.color[1], dg.color[2], 220);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(px, pathY, 26, 16, 3);
      p.fill(255);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(dg.label, px, pathY);
      p.rectMode(p.CORNER);
    });

    // Received data slots on receiver
    const received = ["D1", "—", "D3", "D4", "—"];
    const recvColors = [
      [100, 200, 100],
      [60, 60, 60],
      [100, 200, 100],
      [100, 200, 100],
      [60, 60, 60],
    ];
    for (let i = 0; i < 3; i++) {
      const dy = senderY + 48 + i * 34;
      const idx = i === 0 ? 0 : i === 1 ? 2 : 3;
      p.fill(recvColors[idx][0], recvColors[idx][1], recvColors[idx][2], 30);
      p.stroke(recvColors[idx][0], recvColors[idx][1], recvColors[idx][2], 80);
      p.strokeWeight(1);
      p.rect(receiverX + 15, dy, hostW - 30, 26, 4);
      p.noStroke();
      p.fill(recvColors[idx][0], recvColors[idx][1], recvColors[idx][2]);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(received[idx], receiverX + hostW / 2, dy + 13);
    }

    // Legend
    p.noStroke();
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.fill(100, 200, 100);
    p.rect(senderX, h - 36, 8, 8, 2);
    p.fill(100);
    p.text("Entregue", senderX + 12, h - 36);

    p.fill(255, 60, 60);
    p.rect(senderX + 80, h - 36, 8, 8, 2);
    p.fill(100);
    p.text("Perdido", senderX + 92, h - 36);

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("UDP não retransmite pacotes perdidos — entrega de \"melhor esforço\"", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={280} />;
}

// Visualization 2: UDP vs TCP Handshake — UDP sends immediately, TCP requires 3-way handshake
export function UDPNoHandshake() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("UDP vs TCP — Latência de Conexão", w / 2, 10);

    const halfW = w / 2 - 10;

    // === UDP Side (left) ===
    p.fill(0, 150, 255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("UDP", halfW / 2 + 5, 32);

    // Timeline
    const udpClientX = 50;
    const udpServerX = halfW - 30;
    const udpTopY = 60;
    const udpBottomY = h - 40;

    // Client/Server labels
    p.fill(150);
    p.textSize(9);
    p.text("Cliente", udpClientX, udpTopY - 14);
    p.text("Servidor", udpServerX, udpTopY - 14);

    // Vertical timeline lines
    p.stroke(60);
    p.strokeWeight(1);
    p.line(udpClientX, udpTopY, udpClientX, udpBottomY);
    p.line(udpServerX, udpTopY, udpServerX, udpBottomY);

    // UDP: Direct data send
    const udpPhase = (time * 0.6) % 3;
    const udpArrowY1 = udpTopY + 30;
    const udpArrowY2 = udpTopY + 80;

    // Arrow: Data
    p.stroke(100, 200, 100);
    p.strokeWeight(2);
    const udpProgress1 = Math.min(1, Math.max(0, udpPhase / 0.8));
    if (udpProgress1 > 0) {
      const endX = udpClientX + udpProgress1 * (udpServerX - udpClientX);
      const endY = udpArrowY1 + udpProgress1 * (udpArrowY2 - udpArrowY1);
      p.line(udpClientX, udpArrowY1, endX, endY);
      if (udpProgress1 >= 1) {
        // Arrowhead
        p.fill(100, 200, 100);
        p.noStroke();
        p.triangle(endX, endY, endX - 8, endY - 6, endX - 8, endY + 2);
      }
      p.noStroke();
      p.fill(100, 200, 100);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      const midX = (udpClientX + endX) / 2;
      const midY = (udpArrowY1 + endY) / 2;
      p.text("Dados", midX + 5, midY - 10);
    }

    // Response
    const udpProgress2 = Math.min(1, Math.max(0, (udpPhase - 1) / 0.8));
    if (udpProgress2 > 0) {
      const udpRespY1 = udpArrowY2 + 15;
      const udpRespY2 = udpArrowY2 + 65;
      p.stroke(255, 180, 50);
      p.strokeWeight(2);
      const endX = udpServerX - udpProgress2 * (udpServerX - udpClientX);
      const endY = udpRespY1 + udpProgress2 * (udpRespY2 - udpRespY1);
      p.line(udpServerX, udpRespY1, endX, endY);
      if (udpProgress2 >= 1) {
        p.fill(255, 180, 50);
        p.noStroke();
        p.triangle(endX, endY, endX + 8, endY - 6, endX + 8, endY + 2);
      }
      p.noStroke();
      p.fill(255, 180, 50);
      p.textSize(8);
      const midX = (udpServerX + endX) / 2;
      const midY = (udpRespY1 + endY) / 2;
      p.text("Resposta", midX - 5, midY - 10);
    }

    // Time annotation
    p.noStroke();
    p.fill(100, 200, 100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("⏱ ~1 RTT total", halfW / 2 + 5, h - 20);

    // === Divider ===
    p.stroke(40);
    p.strokeWeight(1);
    p.line(w / 2, 32, w / 2, h - 20);

    // === TCP Side (right) ===
    p.noStroke();
    p.fill(255, 100, 100);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("TCP", w / 2 + halfW / 2 + 5, 32);

    const tcpClientX = w / 2 + 30;
    const tcpServerX = w - 30;

    // Client/Server labels
    p.fill(150);
    p.textSize(9);
    p.text("Cliente", tcpClientX, udpTopY - 14);
    p.text("Servidor", tcpServerX, udpTopY - 14);

    // Vertical timeline lines
    p.stroke(60);
    p.strokeWeight(1);
    p.line(tcpClientX, udpTopY, tcpClientX, udpBottomY);
    p.line(tcpServerX, udpTopY, tcpServerX, udpBottomY);

    const tcpPhase = (time * 0.4) % 5;

    // SYN
    const synY1 = udpTopY + 15;
    const synY2 = udpTopY + 45;
    const synProgress = Math.min(1, Math.max(0, tcpPhase / 0.6));
    if (synProgress > 0) {
      p.stroke(255, 100, 100, 180);
      p.strokeWeight(1.5);
      const endX = tcpClientX + synProgress * (tcpServerX - tcpClientX);
      const endY = synY1 + synProgress * (synY2 - synY1);
      p.line(tcpClientX, synY1, endX, endY);
      p.noStroke();
      p.fill(255, 100, 100);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("SYN", (tcpClientX + endX) / 2 + 5, (synY1 + endY) / 2 - 8);
    }

    // SYN-ACK
    const synAckY1 = synY2 + 8;
    const synAckY2 = synAckY1 + 30;
    const synAckProgress = Math.min(1, Math.max(0, (tcpPhase - 0.7) / 0.6));
    if (synAckProgress > 0) {
      p.stroke(255, 180, 50, 180);
      p.strokeWeight(1.5);
      const endX = tcpServerX - synAckProgress * (tcpServerX - tcpClientX);
      const endY = synAckY1 + synAckProgress * (synAckY2 - synAckY1);
      p.line(tcpServerX, synAckY1, endX, endY);
      p.noStroke();
      p.fill(255, 180, 50);
      p.textSize(7);
      p.text("SYN-ACK", (tcpServerX + endX) / 2 - 5, (synAckY1 + endY) / 2 - 8);
    }

    // ACK
    const ackY1 = synAckY2 + 8;
    const ackY2 = ackY1 + 30;
    const ackProgress = Math.min(1, Math.max(0, (tcpPhase - 1.4) / 0.6));
    if (ackProgress > 0) {
      p.stroke(100, 180, 255, 180);
      p.strokeWeight(1.5);
      const endX = tcpClientX + ackProgress * (tcpServerX - tcpClientX);
      const endY = ackY1 + ackProgress * (ackY2 - ackY1);
      p.line(tcpClientX, ackY1, endX, endY);
      p.noStroke();
      p.fill(100, 180, 255);
      p.textSize(7);
      p.text("ACK", (tcpClientX + endX) / 2 + 5, (ackY1 + endY) / 2 - 8);
    }

    // Data (after handshake)
    const dataY1 = ackY2 + 12;
    const dataY2 = dataY1 + 30;
    const dataProgress = Math.min(1, Math.max(0, (tcpPhase - 2.2) / 0.6));
    if (dataProgress > 0) {
      p.stroke(100, 200, 100);
      p.strokeWeight(2);
      const endX = tcpClientX + dataProgress * (tcpServerX - tcpClientX);
      const endY = dataY1 + dataProgress * (dataY2 - dataY1);
      p.line(tcpClientX, dataY1, endX, endY);
      p.noStroke();
      p.fill(100, 200, 100);
      p.textSize(7);
      p.text("Dados", (tcpClientX + endX) / 2 + 5, (dataY1 + endY) / 2 - 8);
    }

    // Time annotation
    p.noStroke();
    p.fill(255, 100, 100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("⏱ ~2.5 RTT total", w / 2 + halfW / 2 + 5, h - 20);

    // Footer
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("UDP envia dados imediatamente — TCP exige 3-way handshake antes", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 3: UDP Segment Structure — visual breakdown of header fields
export function UDPSegmentStructure() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Estrutura do Segmento UDP", w / 2, 10);

    // Bit ruler
    const rulerX = 40;
    const rulerW = w - 80;
    const rulerY = 40;

    p.fill(80);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    const bitMarks = [0, 8, 16, 24, 31];
    bitMarks.forEach((bit) => {
      const bx = rulerX + (bit / 31) * rulerW;
      p.text(String(bit), bx, rulerY);
    });

    // Header rows
    const rowH = 48;
    const startY = rulerY + 18;

    // Row 1: Source Port (16 bits) | Destination Port (16 bits)
    const halfW2 = rulerW / 2;

    // Source Port
    const srcPortPulse = Math.sin(time * 2) * 0.15 + 0.85;
    p.fill(0, 150, 255, 40 * srcPortPulse);
    p.stroke(0, 150, 255, 120);
    p.strokeWeight(1.5);
    p.rect(rulerX, startY, halfW2, rowH, 0);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Porta de Origem", rulerX + halfW2 / 2, startY + 16);
    p.fill(80);
    p.textSize(8);
    p.text("16 bits", rulerX + halfW2 / 2, startY + 34);

    // Destination Port
    const dstPortPulse = Math.sin(time * 2 + 1) * 0.15 + 0.85;
    p.fill(255, 180, 50, 40 * dstPortPulse);
    p.stroke(255, 180, 50, 120);
    p.strokeWeight(1.5);
    p.rect(rulerX + halfW2, startY, halfW2, rowH, 0);
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Porta de Destino", rulerX + halfW2 + halfW2 / 2, startY + 16);
    p.fill(80);
    p.textSize(8);
    p.text("16 bits", rulerX + halfW2 + halfW2 / 2, startY + 34);

    // Row 2: Length (16 bits) | Checksum (16 bits)
    const row2Y = startY + rowH;

    // Length
    const lenPulse = Math.sin(time * 2 + 2) * 0.15 + 0.85;
    p.fill(100, 255, 100, 35 * lenPulse);
    p.stroke(100, 255, 100, 120);
    p.strokeWeight(1.5);
    p.rect(rulerX, row2Y, halfW2, rowH, 0);
    p.noStroke();
    p.fill(100, 255, 100);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Comprimento", rulerX + halfW2 / 2, row2Y + 16);
    p.fill(80);
    p.textSize(8);
    p.text("16 bits", rulerX + halfW2 / 2, row2Y + 34);

    // Checksum
    const chkPulse = Math.sin(time * 2 + 3) * 0.15 + 0.85;
    p.fill(255, 100, 100, 35 * chkPulse);
    p.stroke(255, 100, 100, 120);
    p.strokeWeight(1.5);
    p.rect(rulerX + halfW2, row2Y, halfW2, rowH, 0);
    p.noStroke();
    p.fill(255, 100, 100);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Checksum", rulerX + halfW2 + halfW2 / 2, row2Y + 16);
    p.fill(80);
    p.textSize(8);
    p.text("16 bits", rulerX + halfW2 + halfW2 / 2, row2Y + 34);

    // Row 3: Data / Payload
    const row3Y = row2Y + rowH;
    const dataH = 60;
    p.fill(100, 200, 100, 20);
    p.stroke(100, 200, 100, 80);
    p.strokeWeight(1.5);
    p.rect(rulerX, row3Y, rulerW, dataH, 0);
    p.noStroke();
    p.fill(100, 200, 100);
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Dados da Aplicação (Payload)", rulerX + rulerW / 2, row3Y + 18);
    p.fill(80);
    p.textSize(9);
    p.text("Tamanho variável", rulerX + rulerW / 2, row3Y + 38);

    // Header size annotation
    p.stroke(150, 150, 150, 80);
    p.strokeWeight(1);
    const bracketX = rulerX + rulerW + 12;
    p.line(bracketX, startY, bracketX, row2Y + rowH);
    p.line(bracketX - 4, startY, bracketX, startY);
    p.line(bracketX - 4, row2Y + rowH, bracketX, row2Y + rowH);
    p.noStroke();
    p.fill(150);
    p.textSize(9);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("8 bytes", bracketX + 6, startY + rowH);
    p.textSize(7);
    p.text("(cabeçalho)", bracketX + 6, startY + rowH + 13);

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cabeçalho mínimo de apenas 8 bytes — o mais simples da camada de transporte", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={310} />;
}

// Visualization 4: UDP Checksum Calculation — step-by-step demonstration
export function UDPChecksumDemo() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Checksum UDP — Detecção de Erros", w / 2, 10);

    // Step indicator — cycles through steps
    const totalSteps = 4;
    const stepDuration = 3;
    const currentStep = Math.floor((time / stepDuration) % totalSteps);

    // Words to sum
    const words = [
      { label: "Palavra 1", hex: "0110 0110 0110 0000", dec: "Porta origem + Porta destino", color: [0, 150, 255] },
      { label: "Palavra 2", hex: "0101 0101 0101 0101", dec: "Comprimento + Checksum (0)", color: [255, 180, 50] },
      { label: "Palavra 3", hex: "1000 1111 0000 1100", dec: "Dados (parte 1)", color: [100, 200, 100] },
    ];

    const startX = 40;
    const startY = 48;
    const wordH = 36;
    const wordW = w - 80;

    // Draw words
    words.forEach((word, i) => {
      const wy = startY + i * wordH;
      const isActive = currentStep >= i;
      const alpha = isActive ? 1 : 0.3;

      p.fill(word.color[0], word.color[1], word.color[2], 30 * alpha);
      p.stroke(word.color[0], word.color[1], word.color[2], 80 * alpha);
      p.strokeWeight(1);
      p.rect(startX, wy, wordW, wordH - 4, 4);

      p.noStroke();
      p.fill(word.color[0], word.color[1], word.color[2], 255 * alpha);
      p.textSize(9);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(word.label, startX + 8, wy + wordH / 2 - 5);
      p.fill(200, 200, 200, 255 * alpha);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(word.hex, startX + wordW / 2, wy + wordH / 2 - 5);
      p.fill(80, 80, 80, 255 * alpha);
      p.textSize(7);
      p.text(word.dec, startX + wordW / 2, wy + wordH / 2 + 10);

      // Plus sign
      if (i < words.length - 1 && currentStep > i) {
        p.fill(200, 200, 200, 200);
        p.textSize(14);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text("+", startX - 5, wy + wordH - 2);
      }
    });

    // Sum line
    const sumY = startY + words.length * wordH + 8;
    if (currentStep >= 2) {
      p.stroke(150, 150, 150, 100);
      p.strokeWeight(1);
      p.line(startX, sumY, startX + wordW, sumY);

      // Soma
      p.noStroke();
      p.fill(200);
      p.textSize(9);
      p.textAlign(p.LEFT, p.TOP);
      p.text("Soma:", startX + 8, sumY + 8);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text("0100 1010 1100 0001", startX + wordW / 2, sumY + 8);

      // Wraparound
      p.fill(80);
      p.textSize(7);
      p.text("(com carry wraparound)", startX + wordW / 2, sumY + 24);
    }

    // Complemento a 1 (checksum)
    const checksumY = sumY + 44;
    if (currentStep >= 3) {
      p.fill(255, 100, 100, 40);
      p.stroke(255, 100, 100, 120);
      p.strokeWeight(2);
      p.rect(startX, checksumY, wordW, 40, 6);

      p.noStroke();
      p.fill(255, 100, 100);
      p.textSize(10);
      p.textAlign(p.LEFT, p.CENTER);
      p.text("Checksum:", startX + 8, checksumY + 14);
      p.fill(255);
      p.textSize(12);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("1011 0101 0011 1110", startX + wordW / 2 + 20, checksumY + 14);
      p.fill(80);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("complemento de 1 da soma → inverte todos os bits", startX + wordW / 2, checksumY + 30);
    }

    // Step indicator dots
    const dotY = h - 25;
    for (let i = 0; i < totalSteps; i++) {
      const dx = w / 2 - (totalSteps * 12) / 2 + i * 16;
      p.fill(i <= currentStep ? 200 : 50);
      p.noStroke();
      p.ellipse(dx, dotY, 6, 6);
    }

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("No receptor: soma todos os campos — se resultado = 1111...1, sem erros detectados", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 5: UDP Use Cases — animated icons showing typical applications
export function UDPUseCases() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Casos de Uso Típicos do UDP", w / 2, 10);

    const useCases = [
      { label: "Streaming\nde Mídia", icon: "▶", color: [255, 100, 100], desc: "Latência > confiabilidade" },
      { label: "DNS", icon: "?", color: [0, 150, 255], desc: "Consultas rápidas" },
      { label: "SNMP", icon: "⚙", color: [255, 180, 50], desc: "Monit. de rede" },
      { label: "HTTP/3\n(QUIC)", icon: "H3", color: [100, 255, 100], desc: "Confiab. na aplicação" },
      { label: "VoIP", icon: "☎", color: [200, 150, 255], desc: "Tempo real" },
    ];

    const cols = useCases.length;
    const cardW = (w - 60) / cols - 8;
    const cardH = 170;
    const cardY = 40;

    useCases.forEach((uc, i) => {
      const cx = 30 + i * (cardW + 8) + cardW / 2;
      const cy = cardY;

      // Pulse effect
      const pulse = Math.sin(time * 2 + i * 0.8) * 0.12 + 0.88;

      // Card background
      p.fill(uc.color[0], uc.color[1], uc.color[2], 15 * pulse);
      p.stroke(uc.color[0], uc.color[1], uc.color[2], 60 * pulse);
      p.strokeWeight(1);
      p.rect(cx - cardW / 2, cy, cardW, cardH, 8);

      // Icon circle
      const iconY = cy + 35;
      p.fill(uc.color[0], uc.color[1], uc.color[2], 30);
      p.stroke(uc.color[0], uc.color[1], uc.color[2], 100);
      p.strokeWeight(1);
      p.ellipse(cx, iconY, 36, 36);

      p.noStroke();
      p.fill(uc.color[0], uc.color[1], uc.color[2]);
      p.textSize(14);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(uc.icon, cx, iconY);

      // Label
      p.fill(200);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      const lines = uc.label.split("\n");
      lines.forEach((line, li) => {
        p.text(line, cx, iconY + 28 + li * 13);
      });

      // Description
      p.fill(80);
      p.textSize(7);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(uc.desc, cx, cy + cardH - 8);

      // Animated data flow dots
      const dotCount = 3;
      for (let d = 0; d < dotCount; d++) {
        const dotPhase = (time * 1.5 + i * 0.4 + d * 0.5) % 2;
        if (dotPhase < 1) {
          const dotY2 = cy + cardH + 5 + dotPhase * 25;
          p.fill(uc.color[0], uc.color[1], uc.color[2], 150 * (1 - dotPhase));
          p.noStroke();
          p.ellipse(cx, dotY2, 4, 4);
        }
      }
    });

    // Bottom annotation
    p.fill(0, 150, 255, 40);
    p.stroke(0, 150, 255, 60);
    p.strokeWeight(1);
    p.rect(30, h - 48, w - 60, 28, 6);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("UDP: ideal quando velocidade é mais importante que garantia de entrega", w / 2, h - 34);

    // Footer
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Aplicações tolerantes a perdas preferem UDP pela menor latência", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={290} />;
}

// Visualization 6: TCP vs UDP Header Size Comparison
export function UDPvsTPHeaderSize() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Overhead do Cabeçalho: UDP vs TCP", w / 2, 10);

    const barMaxW = w - 160;
    const barH = 40;
    const barX = 100;

    // UDP header
    const udpY = 60;
    p.fill(0, 150, 255);
    p.textSize(11);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("UDP", barX - 12, udpY + barH / 2);

    // UDP bar (8 bytes — 20% of max)
    const udpBarW = barMaxW * (8 / 60);
    const udpPulse = Math.sin(time * 1.5) * 0.1 + 0.9;
    p.fill(0, 150, 255, 60 * udpPulse);
    p.stroke(0, 150, 255, 150);
    p.strokeWeight(2);
    p.rect(barX, udpY, udpBarW, barH, 4);

    // UDP header fields inside bar
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(9);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("8 bytes", barX + udpBarW + 10, udpY + barH / 2);

    // UDP field breakdown
    const udpFields = [
      { label: "Src Port", w: udpBarW / 4 },
      { label: "Dst Port", w: udpBarW / 4 },
      { label: "Len", w: udpBarW / 4 },
      { label: "Chk", w: udpBarW / 4 },
    ];
    let fieldX = barX;
    udpFields.forEach((field) => {
      p.stroke(0, 150, 255, 60);
      p.strokeWeight(0.5);
      p.line(fieldX, udpY, fieldX, udpY + barH);
      p.noStroke();
      p.fill(200);
      p.textSize(6);
      p.textAlign(p.CENTER, p.CENTER);
      if (udpBarW / 4 > 20) {
        p.text(field.label, fieldX + field.w / 2, udpY + barH / 2);
      }
      fieldX += field.w;
    });

    // TCP header
    const tcpY = udpY + barH + 30;
    p.fill(255, 100, 100);
    p.textSize(11);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("TCP", barX - 12, tcpY + barH / 2);

    // TCP bar (20 bytes — min, up to 60 bytes)
    const tcpMinBarW = barMaxW * (20 / 60);
    const tcpMaxBarW = barMaxW * (60 / 60);
    const tcpPulse = Math.sin(time * 1.5 + 1) * 0.1 + 0.9;

    // Optional fields area (lighter)
    p.fill(255, 100, 100, 15);
    p.stroke(255, 100, 100, 40);
    p.strokeWeight(1);
    p.rect(barX + tcpMinBarW, tcpY, tcpMaxBarW - tcpMinBarW, barH, 0, 4, 4, 0);

    // Required fields
    p.fill(255, 100, 100, 50 * tcpPulse);
    p.stroke(255, 100, 100, 150);
    p.strokeWeight(2);
    p.rect(barX, tcpY, tcpMinBarW, barH, 4, 0, 0, 4);

    p.noStroke();
    p.fill(255, 100, 100);
    p.textSize(9);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("20–60 bytes", barX + tcpMaxBarW + 10, tcpY + barH / 2);

    // TCP fields labels
    const tcpFields = ["Src", "Dst", "Seq#", "ACK#", "Flags", "Win", "Chk", "Urg"];
    const tcpFieldW = tcpMinBarW / tcpFields.length;
    tcpFields.forEach((field, i) => {
      const fx = barX + i * tcpFieldW;
      p.stroke(255, 100, 100, 40);
      p.strokeWeight(0.5);
      p.line(fx, tcpY, fx, tcpY + barH);
      p.noStroke();
      p.fill(200);
      p.textSize(5);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(field, fx + tcpFieldW / 2, tcpY + barH / 2);
    });

    // Optional area label
    p.fill(255, 100, 100, 100);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Opções (variável)", barX + tcpMinBarW + (tcpMaxBarW - tcpMinBarW) / 2, tcpY + barH / 2);

    // Ratio comparison
    const ratioY = tcpY + barH + 35;
    p.noStroke();
    p.fill(200);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Overhead do UDP é 2.5x a 7.5x menor que o TCP", w / 2, ratioY);

    // Visual ratio
    const ratioBarY = ratioY + 26;
    const ratioBarW = 200;
    const ratioBarH = 18;
    const ratioBarX = w / 2 - ratioBarW / 2;

    // UDP portion
    p.fill(0, 150, 255, 80);
    p.stroke(0, 150, 255, 150);
    p.strokeWeight(1);
    const udpRatio = 8 / 60;
    p.rect(ratioBarX, ratioBarY, ratioBarW * udpRatio, ratioBarH, 3, 0, 0, 3);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("UDP 8B", ratioBarX + ratioBarW * udpRatio / 2, ratioBarY + ratioBarH / 2);

    // TCP portion
    p.fill(255, 100, 100, 40);
    p.stroke(255, 100, 100, 100);
    p.strokeWeight(1);
    p.rect(ratioBarX + ratioBarW * udpRatio, ratioBarY, ratioBarW * (1 - udpRatio), ratioBarH, 0, 3, 3, 0);
    p.noStroke();
    p.fill(255, 100, 100);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("TCP 20–60B", ratioBarX + ratioBarW * udpRatio + ratioBarW * (1 - udpRatio) / 2, ratioBarY + ratioBarH / 2);

    // Footer
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cabeçalho menor = menor overhead por pacote = maior eficiência para dados pequenos", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={300} />;
}

