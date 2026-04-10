"use client";

import { P5Sketch } from "../p5-sketch";
import type p5 from "p5";

// Visualization 1: Logical communication between processes — two hosts with processes communicating
export function LogicalCommunication() {
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
    p.text("Comunicação Lógica entre Processos", w / 2, 10);

    // Two hosts
    const hostW = 160;
    const hostH = 220;
    const hostAx = 50;
    const hostBx = w - hostW - 50;
    const hostY = 55;

    // Host A
    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 80);
    p.strokeWeight(2);
    p.rect(hostAx, hostY, hostW, hostH, 8);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Host A", hostAx + hostW / 2, hostY + 8);
    p.fill(80);
    p.textSize(9);
    p.text("192.168.1.10", hostAx + hostW / 2, hostY + 24);

    // Processes on Host A
    const procColors = [
      [255, 100, 100],
      [100, 255, 100],
      [100, 180, 255],
    ];
    const procLabels = ["HTTP (80)", "SSH (22)", "DNS (53)"];
    for (let i = 0; i < 3; i++) {
      const py = hostY + 50 + i * 55;
      p.fill(procColors[i][0], procColors[i][1], procColors[i][2], 30);
      p.stroke(procColors[i][0], procColors[i][1], procColors[i][2], 100);
      p.strokeWeight(1);
      p.rect(hostAx + 15, py, hostW - 30, 40, 6);
      p.noStroke();
      p.fill(procColors[i][0], procColors[i][1], procColors[i][2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`Processo: ${procLabels[i]}`, hostAx + hostW / 2, py + 14);
      p.fill(100);
      p.textSize(8);
      p.text(`Porta ${procLabels[i].split("(")[1].replace(")", "")}`, hostAx + hostW / 2, py + 28);
    }

    // Host B
    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 80);
    p.strokeWeight(2);
    p.rect(hostBx, hostY, hostW, hostH, 8);
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Host B", hostBx + hostW / 2, hostY + 8);
    p.fill(80);
    p.textSize(9);
    p.text("203.0.113.5", hostBx + hostW / 2, hostY + 24);

    // Processes on Host B
    const procLabelsB = ["HTTP (80)", "SMTP (25)", "FTP (21)"];
    for (let i = 0; i < 3; i++) {
      const py = hostY + 50 + i * 55;
      p.fill(procColors[i][0], procColors[i][1], procColors[i][2], 30);
      p.stroke(procColors[i][0], procColors[i][1], procColors[i][2], 100);
      p.strokeWeight(1);
      p.rect(hostBx + 15, py, hostW - 30, 40, 6);
      p.noStroke();
      p.fill(procColors[i][0], procColors[i][1], procColors[i][2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`Processo: ${procLabelsB[i]}`, hostBx + hostW / 2, py + 14);
      p.fill(100);
      p.textSize(8);
      p.text(`Porta ${procLabelsB[i].split("(")[1].replace(")", "")}`, hostBx + hostW / 2, py + 28);
    }

    // Animated segment between matching processes
    const activeProc = Math.floor(time * 0.5) % 3;
    const py1 = hostY + 50 + activeProc * 55 + 20;

    // Draw logical connection line (dashed)
    const startX = hostAx + hostW;
    const endX = hostBx;
    const midY = py1;

    p.stroke(procColors[activeProc][0], procColors[activeProc][1], procColors[activeProc][2], 100);
    p.strokeWeight(1);
    for (let x = startX + 5; x < endX - 5; x += 12) {
      p.line(x, midY, Math.min(x + 6, endX - 5), midY);
    }

    // Animated segment (packet traveling)
    const progress = (time * 1.2) % 2;
    let segX: number, dir: number;
    if (progress < 1) {
      segX = startX + progress * (endX - startX);
      dir = 1;
    } else {
      segX = endX - (progress - 1) * (endX - startX);
      dir = -1;
    }

    p.fill(procColors[activeProc][0], procColors[activeProc][1], procColors[activeProc][2]);
    p.noStroke();
    p.rectMode(p.CENTER);
    p.rect(segX, midY, 20, 12, 3);
    p.fill(255);
    p.textSize(6);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("SEG", segX, midY);
    p.rectMode(p.CORNER);

    // Arrow
    const arrowX = dir > 0 ? segX + 13 : segX - 13;
    p.fill(procColors[activeProc][0], procColors[activeProc][1], procColors[activeProc][2]);
    p.noStroke();
    p.triangle(arrowX, midY - 4, arrowX, midY + 4, arrowX + dir * 6, midY);

    // Label: "Comunicação lógica"
    p.noStroke();
    p.fill(150);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("↕ Comunicação lógica processo-a-processo", w / 2, hostY + hostH + 25);

    // Network cloud
    const cloudY = hostY + hostH + 40;
    p.fill(20, 25, 40);
    p.stroke(60);
    p.strokeWeight(1);
    p.ellipse(w / 2, cloudY + 20, w * 0.55, 40);
    p.noStroke();
    p.fill(80);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Rede física (roteadores, links, switches…)", w / 2, cloudY + 20);

    // Connection lines host to cloud
    p.stroke(60);
    p.strokeWeight(1);
    p.line(hostAx + hostW / 2, hostY + hostH, hostAx + hostW / 2, cloudY + 5);
    p.line(hostBx + hostW / 2, hostY + hostH, hostBx + hostW / 2, cloudY + 5);

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("A camada de transporte abstrai a rede física → processos se comunicam como se estivessem conectados diretamente", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={400} />;
}

// Visualization 2: House & Letter analogy — two houses with family members sending letters
export function HouseLetterAnalogy() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.012;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text('Analogia: Casas, Pessoas e Cartas', w / 2, 10);

    // House A (left)
    const houseW = 170;
    const houseH = 160;
    const houseAx = 30;
    const houseBx = w - houseW - 30;
    const houseY = 45;

    // Draw house A
    p.fill(25, 20, 15);
    p.stroke(180, 120, 60, 80);
    p.strokeWeight(2);
    p.rect(houseAx, houseY + 30, houseW, houseH - 30, 0, 0, 6, 6);
    // Roof
    p.fill(150, 80, 40);
    p.noStroke();
    p.triangle(houseAx - 10, houseY + 30, houseAx + houseW + 10, houseY + 30, houseAx + houseW / 2, houseY);
    p.fill(180, 120, 60);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Casa do João", houseAx + houseW / 2, houseY + 35);

    // Family members (processes)
    const familyA = ["Ana", "Pedro", "Maria"];
    for (let i = 0; i < 3; i++) {
      const px = houseAx + 20 + i * 52;
      const py = houseY + 65;
      p.fill(200, 180, 100);
      p.noStroke();
      p.ellipse(px + 15, py, 18, 18);
      p.rect(px + 7, py + 9, 16, 20, 3);
      p.fill(220);
      p.textSize(8);
      p.textAlign(p.CENTER, p.TOP);
      p.text(familyA[i], px + 15, py + 32);
    }

    // Mailbox A (transport layer)
    const mailAx = houseAx + houseW / 2 - 15;
    const mailAy = houseY + houseH + 5;
    p.fill(50, 100, 200);
    p.stroke(80, 140, 255, 100);
    p.strokeWeight(1);
    p.rect(mailAx, mailAy, 30, 22, 4);
    p.noStroke();
    p.fill(255);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("📬", mailAx + 15, mailAy + 11);

    // Label
    p.fill(80, 140, 255);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("João (transporte)", houseAx + houseW / 2, mailAy + 26);

    // House B
    p.fill(25, 20, 15);
    p.stroke(180, 120, 60, 80);
    p.strokeWeight(2);
    p.rect(houseBx, houseY + 30, houseW, houseH - 30, 0, 0, 6, 6);
    p.fill(150, 80, 40);
    p.noStroke();
    p.triangle(houseBx - 10, houseY + 30, houseBx + houseW + 10, houseY + 30, houseBx + houseW / 2, houseY);
    p.fill(180, 120, 60);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Casa da Lúcia", houseBx + houseW / 2, houseY + 35);

    // Family members B
    const familyB = ["Carlos", "Luísa", "Bruno"];
    for (let i = 0; i < 3; i++) {
      const px = houseBx + 20 + i * 52;
      const py = houseY + 65;
      p.fill(200, 180, 100);
      p.noStroke();
      p.ellipse(px + 15, py, 18, 18);
      p.rect(px + 7, py + 9, 16, 20, 3);
      p.fill(220);
      p.textSize(8);
      p.textAlign(p.CENTER, p.TOP);
      p.text(familyB[i], px + 15, py + 32);
    }

    // Mailbox B
    const mailBx = houseBx + houseW / 2 - 15;
    const mailBy = houseY + houseH + 5;
    p.fill(50, 100, 200);
    p.stroke(80, 140, 255, 100);
    p.strokeWeight(1);
    p.rect(mailBx, mailBy, 30, 22, 4);
    p.noStroke();
    p.fill(255);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("📬", mailBx + 15, mailBy + 11);

    p.fill(80, 140, 255);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Lúcia (transporte)", houseBx + houseW / 2, mailBy + 26);

    // Postal service (network layer)
    const postY = mailAy + 55;
    p.fill(20, 25, 35);
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(1);
    p.rect(w * 0.2, postY, w * 0.6, 30, 6);
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("🚚 Serviço Postal (Camada de Rede)", w / 2, postY + 15);

    // Vertical lines from mailboxes to postal service
    p.stroke(80, 140, 255, 60);
    p.strokeWeight(1);
    p.line(mailAx + 15, mailAy + 22, mailAx + 15, postY);
    p.line(mailBx + 15, mailBy + 22, mailBx + 15, postY);

    // Animated letter
    const letterProgress = (time * 0.8) % 2;
    const letterStartX = mailAx + 15;
    const letterEndX = mailBx + 15;

    if (letterProgress < 1) {
      // Going right
      const lx = letterStartX + letterProgress * (letterEndX - letterStartX);
      const ly = postY + 15;
      p.fill(255, 220, 100);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(lx, ly, 18, 12, 2);
      p.fill(100, 60, 20);
      p.textSize(6);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("✉", lx, ly);
      p.rectMode(p.CORNER);
    } else {
      // Going left
      const lx = letterEndX - (letterProgress - 1) * (letterEndX - letterStartX);
      const ly = postY + 15;
      p.fill(255, 220, 100);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(lx, ly, 18, 12, 2);
      p.fill(100, 60, 20);
      p.textSize(6);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("✉", lx, ly);
      p.rectMode(p.CORNER);
    }

    // Mapping table
    const tableY = postY + 45;
    p.noStroke();
    p.fill(150);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Analogia:", w / 2, tableY);

    const mappings = [
      ["Pessoas = Processos", "Casas = Hosts", "João/Lúcia = Camada de Transporte"],
      ["Cartas = Segmentos", "Serviço Postal = Camada de Rede", "Endereço = IP + Porta"],
    ];

    p.textSize(8);
    let ty = tableY + 16;
    for (let row = 0; row < mappings.length; row++) {
      for (let col = 0; col < mappings[row].length; col++) {
        const tx = w * 0.17 + col * w * 0.33;
        p.fill(row === 0 ? [80, 180, 255] : [200, 150, 80]);
        p.textAlign(p.CENTER, p.TOP);
        p.text(mappings[row][col], tx, ty);
      }
      ty += 14;
    }

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("João e Lúcia coletam/entregam cartas (segmentos) para cada pessoa (processo) na casa (host)", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={420} />;
}

// Visualization 3: Transport vs Network layer — side-by-side comparison
export function TransportVsNetworkLayer() {
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
    p.text("Camada de Transporte vs. Camada de Rede", w / 2, 10);

    // OSI-like stack in center
    const stackX = w / 2 - 90;
    const stackW = 180;
    const stackY = 40;
    const layerH = 36;

    const layers = [
      { name: "Aplicação", col: [100, 200, 100], alpha: 60 },
      { name: "Transporte", col: [0, 150, 255], alpha: 180 },
      { name: "Rede", col: [255, 180, 50], alpha: 180 },
      { name: "Enlace", col: [180, 100, 200], alpha: 60 },
      { name: "Física", col: [150, 150, 150], alpha: 60 },
    ];

    for (let i = 0; i < layers.length; i++) {
      const ly = stackY + i * (layerH + 4);
      const isHighlighted = i === 1 || i === 2;

      p.fill(layers[i].col[0], layers[i].col[1], layers[i].col[2], isHighlighted ? 40 : 15);
      p.stroke(layers[i].col[0], layers[i].col[1], layers[i].col[2], isHighlighted ? 150 : 40);
      p.strokeWeight(isHighlighted ? 2 : 1);
      p.rect(stackX, ly, stackW, layerH, 6);

      p.noStroke();
      p.fill(layers[i].col[0], layers[i].col[1], layers[i].col[2], isHighlighted ? 255 : 100);
      p.textSize(isHighlighted ? 11 : 9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(layers[i].name, stackX + stackW / 2, ly + layerH / 2);
    }

    // Transport layer description (left)
    const descX = 15;
    const descW = stackX - 30;
    const transY = stackY + (layerH + 4);

    p.fill(0, 150, 255);
    p.noStroke();
    p.textSize(10);
    p.textAlign(p.RIGHT, p.TOP);
    p.text("Camada de Transporte", descX + descW, transY);

    p.fill(120);
    p.textSize(8);
    const transDescs = [
      "• Comunicação processo-a-processo",
      "• Usa portas (0–65535)",
      "• Segmentos (TCP) / Datagramas (UDP)",
      "• Pode garantir confiabilidade",
    ];
    transDescs.forEach((desc, i) => {
      p.textAlign(p.RIGHT, p.TOP);
      p.text(desc, descX + descW, transY + 16 + i * 13);
    });

    // Arrow from description to layer
    p.stroke(0, 150, 255, 80);
    p.strokeWeight(1);
    p.line(descX + descW + 5, transY + layerH / 2, stackX - 3, transY + layerH / 2);

    // Network layer description (right)
    const netY = stackY + 2 * (layerH + 4);
    const rightDescX = stackX + stackW + 15;

    p.fill(255, 180, 50);
    p.noStroke();
    p.textSize(10);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Camada de Rede", rightDescX, netY);

    p.fill(120);
    p.textSize(8);
    const netDescs = [
      "• Comunicação host-a-host",
      "• Usa endereços IP",
      "• Datagramas IP",
      "• Melhor esforço (sem garantias)",
    ];
    netDescs.forEach((desc, i) => {
      p.textAlign(p.LEFT, p.TOP);
      p.text(desc, rightDescX, netY + 16 + i * 13);
    });

    // Arrow
    p.stroke(255, 180, 50, 80);
    p.strokeWeight(1);
    p.line(stackX + stackW + 3, netY + layerH / 2, rightDescX - 5, netY + layerH / 2);

    // Bottom comparison
    const compY = stackY + layers.length * (layerH + 4) + 15;

    // Animated pulse highlighting the difference
    const pulse = Math.sin(time * 2) * 0.5 + 0.5;

    // Transport: process to process
    p.fill(0, 150, 255, 80 + pulse * 100);
    p.noStroke();
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Processo ↔ Processo", w * 0.25, compY);
    p.fill(80);
    p.textSize(8);
    p.text("(endereço IP + porta)", w * 0.25, compY + 16);

    // vs
    p.fill(150);
    p.textSize(12);
    p.text("vs", w / 2, compY + 5);

    // Network: host to host
    p.fill(255, 180, 50, 80 + (1 - pulse) * 100);
    p.textSize(11);
    p.text("Host ↔ Host", w * 0.75, compY);
    p.fill(80);
    p.textSize(8);
    p.text("(apenas endereço IP)", w * 0.75, compY + 16);

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("A camada de transporte estende a entrega host-a-host da rede para entrega processo-a-processo", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={370} />;
}

// Visualization 4: TCP vs UDP comparison — side by side showing reliability vs speed
export function TCPvsUDP() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.018;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("TCP vs UDP — Confiável vs Rápido", w / 2, 10);

    const halfW = w / 2 - 15;

    // === TCP side (left) ===
    const tcpX = 10;
    p.fill(15, 25, 40);
    p.stroke(0, 150, 255, 50);
    p.strokeWeight(1);
    p.rect(tcpX, 35, halfW, h - 60, 8);

    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("TCP (Transmission Control Protocol)", tcpX + halfW / 2, 42);

    // Sender and receiver
    const senderX = tcpX + 25;
    const receiverX = tcpX + halfW - 45;
    const baseY = 70;

    // Sender box
    p.fill(0, 100, 200, 40);
    p.stroke(0, 150, 255, 80);
    p.rect(senderX, baseY, 50, 30, 4);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Emissor", senderX + 25, baseY + 15);

    // Receiver box
    p.fill(0, 100, 200, 40);
    p.stroke(0, 150, 255, 80);
    p.rect(receiverX, baseY, 50, 30, 4);
    p.noStroke();
    p.fill(0, 150, 255);
    p.text("Receptor", receiverX + 25, baseY + 15);

    // TCP: ordered packets with ACKs
    const numPackets = 5;
    const tcpStartY = baseY + 45;
    const tcpRowH = 28;

    for (let i = 0; i < numPackets; i++) {
      const rowY = tcpStartY + i * tcpRowH;
      const packetPhase = (time * 2 - i * 0.4) % 3;

      if (packetPhase > 0 && packetPhase < 3) {
        // Packet going right
        if (packetPhase < 1.2) {
          const px = senderX + 55 + (packetPhase / 1.2) * (receiverX - senderX - 60);
          p.fill(0, 150, 255, 200);
          p.noStroke();
          p.rectMode(p.CENTER);
          p.rect(px, rowY + 8, 22, 12, 3);
          p.fill(255);
          p.textSize(6);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(`#${i + 1}`, px, rowY + 8);
          p.rectMode(p.CORNER);
        }
        // ACK going left
        if (packetPhase > 1.3 && packetPhase < 2.5) {
          const ackProgress = (packetPhase - 1.3) / 1.2;
          const ax = receiverX - 5 - ackProgress * (receiverX - senderX - 60);
          p.fill(100, 255, 100, 180);
          p.noStroke();
          p.rectMode(p.CENTER);
          p.rect(ax, rowY + 8, 22, 10, 3);
          p.fill(0);
          p.textSize(5);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(`ACK${i + 1}`, ax, rowY + 8);
          p.rectMode(p.CORNER);
        }
      }

      // Sequence number labels
      p.noStroke();
      p.fill(70);
      p.textSize(7);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(`seq=${i + 1}`, senderX, rowY + 8);
    }

    // TCP features
    const featY = tcpStartY + numPackets * tcpRowH + 10;
    p.fill(0, 150, 255, 180);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    const tcpFeats = ["✓ Orientado a conexão", "✓ Entrega ordenada", "✓ Retransmissão (ACK)", "✓ Controle de fluxo"];
    tcpFeats.forEach((f, i) => {
      p.text(f, tcpX + 15, featY + i * 13);
    });

    // === UDP side (right) ===
    const udpX = w / 2 + 5;
    p.fill(25, 15, 15);
    p.stroke(255, 100, 50, 50);
    p.strokeWeight(1);
    p.rect(udpX, 35, halfW, h - 60, 8);

    p.noStroke();
    p.fill(255, 100, 50);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("UDP (User Datagram Protocol)", udpX + halfW / 2, 42);

    // Sender and receiver
    const udpSenderX = udpX + 25;
    const udpReceiverX = udpX + halfW - 45;

    p.fill(200, 60, 30, 40);
    p.stroke(255, 100, 50, 80);
    p.rect(udpSenderX, baseY, 50, 30, 4);
    p.noStroke();
    p.fill(255, 100, 50);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Emissor", udpSenderX + 25, baseY + 15);

    p.fill(200, 60, 30, 40);
    p.stroke(255, 100, 50, 80);
    p.rect(udpReceiverX, baseY, 50, 30, 4);
    p.noStroke();
    p.fill(255, 100, 50);
    p.text("Receptor", udpReceiverX + 25, baseY + 15);

    // UDP: packets fired rapidly, some lost, no order guarantee
    for (let i = 0; i < 6; i++) {
      const rowY = tcpStartY + i * (tcpRowH - 4);
      const packetPhase = (time * 3 - i * 0.25) % 2;

      if (packetPhase > 0 && packetPhase < 1.5) {
        const progress = packetPhase / 1.5;
        const px = udpSenderX + 55 + progress * (udpReceiverX - udpSenderX - 60);
        const wobble = Math.sin(time * 10 + i * 2) * 3;

        // Some packets "lost" (disappear partway)
        const isLost = i === 2 || i === 4;

        if (isLost && progress > 0.5) {
          // Packet lost — show X
          if (progress < 0.65) {
            p.fill(255, 80, 80, 200);
            p.noStroke();
            p.textSize(12);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("✕", px, rowY + 6 + wobble);
          }
        } else {
          p.fill(255, 100, 50, 200);
          p.noStroke();
          p.rectMode(p.CENTER);
          p.rect(px, rowY + 6 + wobble, 20, 11, 3);
          p.fill(255);
          p.textSize(6);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(`#${i + 1}`, px, rowY + 6 + wobble);
          p.rectMode(p.CORNER);
        }
      }
    }

    // UDP features
    const udpFeatY = featY;
    p.fill(255, 100, 50, 180);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    const udpFeats = ["✗ Sem conexão", "✗ Sem garantia de ordem", "✗ Sem retransmissão", "✓ Baixa latência / rápido"];
    udpFeats.forEach((f, i) => {
      p.text(f, udpX + 15, udpFeatY + i * 13);
    });

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("TCP garante entrega confiável e ordenada | UDP prioriza velocidade sem garantias", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 5: Multiplexing / Demultiplexing — packets from multiple processes being combined and split
export function MultiplexingDemux() {
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
    p.text("Multiplexação e Demultiplexação", w / 2, 10);

    // Left: Multiple processes sending (Multiplexing)
    const procs = [
      { label: "HTTP", port: 80, col: [255, 100, 100] },
      { label: "SSH", port: 22, col: [100, 255, 100] },
      { label: "DNS", port: 53, col: [100, 180, 255] },
    ];

    const procX = 20;
    const procW = 80;
    const procH = 35;
    const funnelX = procX + procW + 50;
    const funnelW = 40;

    // Label
    p.noStroke();
    p.fill(150);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Multiplexação", funnelX + funnelW / 2, 35);

    // Draw processes
    procs.forEach((proc, i) => {
      const py = 50 + i * 55;

      p.fill(proc.col[0], proc.col[1], proc.col[2], 30);
      p.stroke(proc.col[0], proc.col[1], proc.col[2], 100);
      p.strokeWeight(1);
      p.rect(procX, py, procW, procH, 5);

      p.noStroke();
      p.fill(proc.col[0], proc.col[1], proc.col[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`${proc.label}`, procX + procW / 2, py + 12);
      p.fill(100);
      p.textSize(7);
      p.text(`Porta ${proc.port}`, procX + procW / 2, py + 26);

      // Animated packet from process to funnel
      const phase = (time * 1.5 + i * 0.8) % 2.5;
      if (phase < 1) {
        const px2 = procX + procW + 5 + phase * 40;
        p.fill(proc.col[0], proc.col[1], proc.col[2], 200);
        p.noStroke();
        p.rectMode(p.CENTER);
        p.rect(px2, py + procH / 2, 14, 10, 2);
        p.rectMode(p.CORNER);
      }

      // Lines to funnel
      p.stroke(proc.col[0], proc.col[1], proc.col[2], 40);
      p.strokeWeight(1);
      p.line(procX + procW, py + procH / 2, funnelX, h / 2);
    });

    // Funnel (transport layer)
    p.fill(30, 40, 60);
    p.stroke(0, 150, 255, 100);
    p.strokeWeight(2);
    // Trapezoid shape
    p.quad(funnelX, 50, funnelX + funnelW, h / 2 - 20, funnelX + funnelW, h / 2 + 20, funnelX, 50 + 2 * 55 + procH);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(8);
    p.push();
    p.translate(funnelX + funnelW / 2, h / 2);
    p.rotate(-p.HALF_PI);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Transporte", 0, 0);
    p.pop();

    // Single stream in the middle (network)
    const netStartX = funnelX + funnelW + 5;
    const netEndX = w - funnelX - funnelW - 5;

    p.stroke(255, 180, 50, 60);
    p.strokeWeight(2);
    p.line(netStartX, h / 2, w - netEndX, h / 2);

    // Animated mixed packets on the wire
    for (let i = 0; i < 4; i++) {
      const pPhase = (time * 2 + i * 0.7) % 3;
      if (pPhase < 2) {
        const px2 = netStartX + (pPhase / 2) * (w - netEndX - netStartX);
        const procIdx = (i + Math.floor(time)) % 3;
        p.fill(procs[procIdx].col[0], procs[procIdx].col[1], procs[procIdx].col[2], 200);
        p.noStroke();
        p.rectMode(p.CENTER);
        p.rect(px2, h / 2, 16, 10, 2);
        p.fill(255);
        p.textSize(5);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`${procs[procIdx].port}`, px2, h / 2);
        p.rectMode(p.CORNER);
      }
    }

    // Network label
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Rede (IP)", w / 2, h / 2 - 10);

    // Right: Demultiplexing funnel
    const demuxFunnelX = w - funnelX - funnelW;

    p.fill(150);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Demultiplexação", demuxFunnelX + funnelW / 2, 35);

    // Funnel reverse
    p.fill(30, 40, 60);
    p.stroke(0, 150, 255, 100);
    p.strokeWeight(2);
    p.quad(demuxFunnelX, h / 2 - 20, demuxFunnelX + funnelW, 50, demuxFunnelX + funnelW, 50 + 2 * 55 + procH, demuxFunnelX, h / 2 + 20);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(8);
    p.push();
    p.translate(demuxFunnelX + funnelW / 2, h / 2);
    p.rotate(-p.HALF_PI);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Transporte", 0, 0);
    p.pop();

    // Right processes
    const rightProcX = demuxFunnelX + funnelW + 50;
    procs.forEach((proc, i) => {
      const py = 50 + i * 55;

      p.fill(proc.col[0], proc.col[1], proc.col[2], 30);
      p.stroke(proc.col[0], proc.col[1], proc.col[2], 100);
      p.strokeWeight(1);
      p.rect(rightProcX, py, procW, procH, 5);

      p.noStroke();
      p.fill(proc.col[0], proc.col[1], proc.col[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`${proc.label}`, rightProcX + procW / 2, py + 12);
      p.fill(100);
      p.textSize(7);
      p.text(`Porta ${proc.port}`, rightProcX + procW / 2, py + 26);

      // Lines from funnel to processes
      p.stroke(proc.col[0], proc.col[1], proc.col[2], 40);
      p.strokeWeight(1);
      p.line(demuxFunnelX + funnelW, h / 2, rightProcX, py + procH / 2);
    });

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Multiplexação: combina dados de vários processos | Demultiplexação: entrega ao processo correto pela porta", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 6: Segment encapsulation — shows how application data becomes a segment then a datagram
export function SegmentEncapsulation() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.012;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Encapsulamento: Dados → Segmento → Datagrama", w / 2, 10);

    const centerX = w / 2;
    const stepH = 70;

    // Step 1: Application data
    const step1Y = 45;
    p.fill(100, 200, 100, 30);
    p.stroke(100, 200, 100, 100);
    p.strokeWeight(1);
    const dataW = 200;
    p.rect(centerX - dataW / 2, step1Y, dataW, 40, 6);
    p.noStroke();
    p.fill(100, 200, 100);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Dados da Aplicação (mensagem)", centerX, step1Y + 20);

    p.fill(100);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("Camada de Aplicação", centerX + dataW / 2 + 10, step1Y + 20);

    // Arrow down
    p.fill(150);
    p.noStroke();
    p.triangle(centerX - 5, step1Y + 48, centerX + 5, step1Y + 48, centerX, step1Y + 56);

    // Step 2: Transport header + data = Segment
    const step2Y = step1Y + stepH;
    const headerW = 80;
    const segW = headerW + dataW;

    // Transport header
    p.fill(0, 150, 255, 50);
    p.stroke(0, 150, 255, 150);
    p.strokeWeight(1);
    p.rect(centerX - segW / 2, step2Y, headerW, 40, 6, 0, 0, 6);

    // Data payload
    p.fill(100, 200, 100, 20);
    p.stroke(100, 200, 100, 60);
    p.rect(centerX - segW / 2 + headerW, step2Y, dataW, 40, 0, 6, 6, 0);

    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Header TCP/UDP", centerX - segW / 2 + headerW / 2, step2Y + 13);
    p.fill(70);
    p.textSize(7);
    p.text("(portas, seq, flags)", centerX - segW / 2 + headerW / 2, step2Y + 28);

    p.fill(100, 200, 100, 150);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Dados da Aplicação", centerX - segW / 2 + headerW + dataW / 2, step2Y + 20);

    p.fill(100);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("Camada de Transporte", centerX + segW / 2 + 10, step2Y + 10);
    p.fill(0, 150, 255);
    p.text("= Segmento", centerX + segW / 2 + 10, step2Y + 25);

    // Arrow down
    p.fill(150);
    p.noStroke();
    p.triangle(centerX - 5, step2Y + 48, centerX + 5, step2Y + 48, centerX, step2Y + 56);

    // Step 3: IP header + segment = Datagram
    const step3Y = step2Y + stepH;
    const ipHeaderW = 60;
    const dgW = ipHeaderW + segW;

    // IP header
    p.fill(255, 180, 50, 50);
    p.stroke(255, 180, 50, 150);
    p.strokeWeight(1);
    p.rect(centerX - dgW / 2, step3Y, ipHeaderW, 40, 6, 0, 0, 6);

    // Transport header
    p.fill(0, 150, 255, 30);
    p.stroke(0, 150, 255, 80);
    p.rect(centerX - dgW / 2 + ipHeaderW, step3Y, headerW, 40);

    // Data payload
    p.fill(100, 200, 100, 15);
    p.stroke(100, 200, 100, 40);
    p.rect(centerX - dgW / 2 + ipHeaderW + headerW, step3Y, dataW, 40, 0, 6, 6, 0);

    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Header IP", centerX - dgW / 2 + ipHeaderW / 2, step3Y + 13);
    p.fill(70);
    p.textSize(7);
    p.text("(IPs, TTL)", centerX - dgW / 2 + ipHeaderW / 2, step3Y + 28);

    p.fill(0, 100, 200, 150);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Hdr TCP/UDP", centerX - dgW / 2 + ipHeaderW + headerW / 2, step3Y + 20);

    p.fill(80, 160, 80, 120);
    p.textSize(8);
    p.text("Dados App", centerX - dgW / 2 + ipHeaderW + headerW + dataW / 2, step3Y + 20);

    p.fill(100);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("Camada de Rede", centerX + dgW / 2 + 10, step3Y + 10);
    p.fill(255, 180, 50);
    p.text("= Datagrama IP", centerX + dgW / 2 + 10, step3Y + 25);

    // Animated highlight showing the encapsulation growing
    const animPhase = (time * 0.5) % 3;
    if (animPhase < 1) {
      p.noFill();
      p.stroke(100, 200, 100, 100 + 100 * Math.sin(time * 4));
      p.strokeWeight(2);
      p.rect(centerX - dataW / 2 - 2, step1Y - 2, dataW + 4, 44, 8);
    } else if (animPhase < 2) {
      p.noFill();
      p.stroke(0, 150, 255, 100 + 100 * Math.sin(time * 4));
      p.strokeWeight(2);
      p.rect(centerX - segW / 2 - 2, step2Y - 2, segW + 4, 44, 8);
    } else {
      p.noFill();
      p.stroke(255, 180, 50, 100 + 100 * Math.sin(time * 4));
      p.strokeWeight(2);
      p.rect(centerX - dgW / 2 - 2, step3Y - 2, dgW + 4, 44, 8);
    }

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cada camada adiciona seu cabeçalho (header) aos dados da camada superior — isso é encapsulamento", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

