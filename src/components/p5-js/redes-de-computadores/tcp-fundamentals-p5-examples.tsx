"use client";

import { P5Sketch } from "../p5-sketch";
import type p5 from "p5";

// Visualization 1: TCP point-to-point full-duplex communication overview
export function TCPPointToPoint() {
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
    p.text("TCP — Comunicação Ponto-a-Ponto Full-Duplex", w / 2, 10);

    // Host A box
    const hostAX = 40;
    const hostY = 55;
    const boxW = 130;
    const boxH = 200;

    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 80);
    p.strokeWeight(2);
    p.rect(hostAX, hostY, boxW, boxH, 8);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Host A", hostAX + boxW / 2, hostY + 8);

    // Application layer A
    p.fill(15, 20, 35);
    p.stroke(100, 200, 100, 60);
    p.strokeWeight(1);
    p.rect(hostAX + 10, hostY + 30, boxW - 20, 35, 6);
    p.noStroke();
    p.fill(100, 200, 100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Aplicação", hostAX + boxW / 2, hostY + 42);
    p.fill(80);
    p.textSize(7);
    p.text("(Processo)", hostAX + boxW / 2, hostY + 55);

    // TCP layer A
    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 60);
    p.strokeWeight(1);
    p.rect(hostAX + 10, hostY + 75, boxW - 20, 45, 6);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("TCP", hostAX + boxW / 2, hostY + 88);
    p.fill(80);
    p.textSize(7);
    p.text("Send buffer", hostAX + boxW / 2, hostY + 100);
    p.text("Recv buffer", hostAX + boxW / 2, hostY + 111);

    // IP layer A
    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(1);
    p.rect(hostAX + 10, hostY + 130, boxW - 20, 30, 6);
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("IP (Rede)", hostAX + boxW / 2, hostY + 145);

    // Host B box
    const hostBX = w - boxW - 40;

    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 80);
    p.strokeWeight(2);
    p.rect(hostBX, hostY, boxW, boxH, 8);
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Host B", hostBX + boxW / 2, hostY + 8);

    // Application layer B
    p.fill(15, 20, 35);
    p.stroke(100, 200, 100, 60);
    p.strokeWeight(1);
    p.rect(hostBX + 10, hostY + 30, boxW - 20, 35, 6);
    p.noStroke();
    p.fill(100, 200, 100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Aplicação", hostBX + boxW / 2, hostY + 42);
    p.fill(80);
    p.textSize(7);
    p.text("(Processo)", hostBX + boxW / 2, hostY + 55);

    // TCP layer B
    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 60);
    p.strokeWeight(1);
    p.rect(hostBX + 10, hostY + 75, boxW - 20, 45, 6);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("TCP", hostBX + boxW / 2, hostY + 88);
    p.fill(80);
    p.textSize(7);
    p.text("Send buffer", hostBX + boxW / 2, hostY + 100);
    p.text("Recv buffer", hostBX + boxW / 2, hostY + 111);

    // IP layer B
    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(1);
    p.rect(hostBX + 10, hostY + 130, boxW - 20, 30, 6);
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("IP (Rede)", hostBX + boxW / 2, hostY + 145);

    // Bidirectional data arrows between hosts
    const arrowY1 = hostY + 95;
    const arrowY2 = hostY + 115;
    const arrowStartX = hostAX + boxW + 5;
    const arrowEndX = hostBX - 5;

    // Data A → B (top arrow)
    const packetAB = ((time * 0.6) % 1);
    const pxAB = p.lerp(arrowStartX, arrowEndX, packetAB);

    p.stroke(0, 150, 255, 100);
    p.strokeWeight(1);
    p.line(arrowStartX, arrowY1, arrowEndX, arrowY1);

    // Arrow head A→B
    p.fill(0, 150, 255, 100);
    p.noStroke();
    p.triangle(arrowEndX, arrowY1, arrowEndX - 8, arrowY1 - 4, arrowEndX - 8, arrowY1 + 4);

    // Packet A→B
    p.fill(0, 150, 255, 200);
    p.noStroke();
    p.rect(pxAB - 18, arrowY1 - 7, 36, 14, 3);
    p.fill(255);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Dados →", pxAB, arrowY1);

    // Data B → A (bottom arrow)
    const packetBA = ((time * 0.5 + 0.5) % 1);
    const pxBA = p.lerp(arrowEndX, arrowStartX, packetBA);

    p.stroke(255, 180, 50, 100);
    p.strokeWeight(1);
    p.line(arrowStartX, arrowY2, arrowEndX, arrowY2);

    // Arrow head B→A
    p.fill(255, 180, 50, 100);
    p.noStroke();
    p.triangle(arrowStartX, arrowY2, arrowStartX + 8, arrowY2 - 4, arrowStartX + 8, arrowY2 + 4);

    // Packet B→A
    p.fill(255, 180, 50, 200);
    p.noStroke();
    p.rect(pxBA - 18, arrowY2 - 7, 36, 14, 3);
    p.fill(255);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("← Dados", pxBA, arrowY2);

    // Labels
    p.noStroke();
    p.fill(0, 150, 255, 180);
    p.textSize(8);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Fluxo A → B", w / 2, arrowY1 - 4);

    p.fill(255, 180, 50, 180);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Fluxo B → A", w / 2, arrowY2 + 5);

    // Features list
    const featY = hostY + boxH + 20;
    p.fill(180, 130, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Características TCP", w / 2, featY);

    const features = [
      "• Ponto-a-ponto (1 emissor, 1 receptor)",
      "• Full-duplex (dados fluem em ambas direções)",
      "• Fluxo de bytes confiável e ordenado",
      "• Orientado a conexão (handshake prévio)",
    ];
    p.fill(140);
    p.textSize(8);
    features.forEach((f, i) => {
      p.text(f, w / 2, featY + 16 + i * 14);
    });

    // Footer
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("TCP: protocolo de transporte confiável, full-duplex e orientado a conexão", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 2: TCP Segment Structure showing all header fields
export function TCPSegmentStructure() {
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
    p.text("Estrutura do Segmento TCP", w / 2, 8);

    const startX = 30;
    const startY = 35;
    const totalW = w - 60;
    const rowH = 28;
    const bitW = totalW / 32;

    // Bit scale at top
    p.fill(80);
    p.textSize(7);
    p.textAlign(p.CENTER, p.TOP);
    for (let i = 0; i <= 32; i += 4) {
      const bx = startX + i * bitW;
      p.text(i.toString(), bx, startY - 12);
      if (i < 32) {
        p.stroke(40);
        p.strokeWeight(0.5);
        p.line(bx, startY, bx, startY + rowH * 7);
      }
    }

    // Row drawing helper
    const drawRow = (
      row: number,
      fields: { name: string; bits: number; color: number[] }[]
    ) => {
      let bitOffset = 0;
      const y = startY + row * rowH;

      fields.forEach((field) => {
        const fx = startX + bitOffset * bitW;
        const fw = field.bits * bitW;

        // Highlight on hover-like pulse
        const pulse = p.sin(time * 2 + row * 0.5 + bitOffset * 0.1) * 15;

        p.fill(15, 20, 35);
        p.stroke(field.color[0], field.color[1], field.color[2], 70 + pulse);
        p.strokeWeight(1.5);
        p.rect(fx, y, fw, rowH, 2);

        p.noStroke();
        p.fill(field.color[0], field.color[1], field.color[2], 220);
        p.textSize(field.bits >= 8 ? 9 : 7);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(field.name, fx + fw / 2, y + rowH / 2 - 3);

        // bit count
        p.fill(80);
        p.textSize(6);
        p.text(`${field.bits} bits`, fx + fw / 2, y + rowH / 2 + 9);

        bitOffset += field.bits;
      });
    };

    // Row 0: Source Port (16) | Destination Port (16)
    drawRow(0, [
      { name: "Porta Origem", bits: 16, color: [0, 150, 255] },
      { name: "Porta Destino", bits: 16, color: [255, 180, 50] },
    ]);

    // Row 1: Sequence Number (32)
    drawRow(1, [
      { name: "Número de Sequência (Sequence Number)", bits: 32, color: [100, 200, 100] },
    ]);

    // Row 2: Acknowledgment Number (32)
    drawRow(2, [
      { name: "Número de Reconhecimento (ACK Number)", bits: 32, color: [180, 130, 255] },
    ]);

    // Row 3: Header Length (4) | Reserved (3) | Flags (9) | Window Size (16)
    drawRow(3, [
      { name: "HL", bits: 4, color: [100, 100, 150] },
      { name: "Res", bits: 3, color: [80, 80, 110] },
      { name: "Flags", bits: 9, color: [255, 100, 100] },
      { name: "Janela (Window)", bits: 16, color: [0, 150, 255] },
    ]);

    // Row 4: Checksum (16) | Urgent Pointer (16)
    drawRow(4, [
      { name: "Checksum", bits: 16, color: [255, 180, 50] },
      { name: "Ponteiro Urgente", bits: 16, color: [100, 180, 255] },
    ]);

    // Row 5: Options (variable)
    drawRow(5, [
      { name: "Opções (variável) + Padding", bits: 32, color: [80, 80, 120] },
    ]);

    // Row 6: Data
    const dataY = startY + 6 * rowH;
    p.fill(15, 20, 35);
    p.stroke(100, 200, 100, 60);
    p.strokeWeight(1.5);
    p.rect(startX, dataY, totalW, rowH + 10, 2);
    p.noStroke();
    p.fill(100, 200, 100, 200);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Dados da Aplicação (payload)", startX + totalW / 2, dataY + (rowH + 10) / 2);

    // Flags detail below
    const flagY = dataY + rowH + 25;
    p.fill(255, 100, 100, 200);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Flags de Controle (9 bits):", w / 2, flagY);

    const flags = ["URG", "ACK", "PSH", "RST", "SYN", "FIN"];
    const flagColors = [
      [100, 180, 255],
      [180, 130, 255],
      [100, 200, 100],
      [255, 100, 100],
      [0, 150, 255],
      [255, 180, 50],
    ];
    const flagStartX = w / 2 - (flags.length * 48) / 2;
    flags.forEach((flag, i) => {
      const fx = flagStartX + i * 48;
      p.fill(15, 20, 35);
      p.stroke(flagColors[i][0], flagColors[i][1], flagColors[i][2], 80);
      p.strokeWeight(1);
      p.rect(fx, flagY + 16, 42, 20, 4);
      p.noStroke();
      p.fill(flagColors[i][0], flagColors[i][1], flagColors[i][2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(flag, fx + 21, flagY + 26);
    });

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cabeçalho TCP: 20 bytes (mínimo) + opções", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={390} />;
}

// Visualization 3: TCP Sequence and ACK Numbers — byte stream illustration
export function TCPSequenceAckNumbers() {
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
    p.text("Números de Sequência e ACK — Fluxo de Bytes", w / 2, 8);

    // Byte stream visualization
    const streamY = 45;
    const byteW = 14;
    const byteH = 22;
    const streamStartX = 20;
    const totalBytes = Math.min(Math.floor((w - 40) / byteW), 35);

    // Draw byte stream
    p.fill(140);
    p.textSize(9);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("Fluxo de bytes da aplicação:", streamStartX, streamY - 4);

    for (let i = 0; i < totalBytes; i++) {
      const bx = streamStartX + i * byteW;

      // Color segments: 0-9 first segment, 10-19 second, 20-29 third
      let col: number[];
      if (i < 10) col = [0, 150, 255];
      else if (i < 20) col = [255, 180, 50];
      else if (i < 30) col = [100, 200, 100];
      else col = [80, 80, 120];

      p.fill(15, 20, 35);
      p.stroke(col[0], col[1], col[2], 80);
      p.strokeWeight(1);
      p.rect(bx, streamY, byteW - 1, byteH, 2);

      p.noStroke();
      p.fill(col[0], col[1], col[2], 200);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(i.toString(), bx + (byteW - 1) / 2, streamY + byteH / 2);
    }

    // Segment brackets below
    const bracketY = streamY + byteH + 8;
    const segments = [
      { start: 0, end: 9, label: "Segmento 1\nSeq# = 0", color: [0, 150, 255] },
      { start: 10, end: 19, label: "Segmento 2\nSeq# = 10", color: [255, 180, 50] },
      { start: 20, end: 29, label: "Segmento 3\nSeq# = 20", color: [100, 200, 100] },
    ];

    segments.forEach((seg) => {
      const sx = streamStartX + seg.start * byteW;
      const ex = streamStartX + (seg.end + 1) * byteW - 1;
      const mx = (sx + ex) / 2;

      p.stroke(seg.color[0], seg.color[1], seg.color[2], 150);
      p.strokeWeight(1.5);
      // Bracket lines
      p.line(sx, bracketY, sx, bracketY + 8);
      p.line(ex, bracketY, ex, bracketY + 8);
      p.line(sx, bracketY + 8, ex, bracketY + 8);
      // Center tick
      p.line(mx, bracketY + 8, mx, bracketY + 14);

      p.noStroke();
      p.fill(seg.color[0], seg.color[1], seg.color[2], 200);
      p.textSize(8);
      p.textAlign(p.CENTER, p.TOP);
      const lines = seg.label.split("\n");
      lines.forEach((line, li) => {
        p.text(line, mx, bracketY + 16 + li * 11);
      });
    });

    // Telnet-like exchange scenario
    const sceneY = bracketY + 60;
    p.fill(180, 130, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Exemplo: Troca de Segmentos (Telnet-like)", w / 2, sceneY);

    // Host A and Host B columns
    const colAX = 80;
    const colBX = w - 80;
    const timelineTop = sceneY + 25;
    const timelineH = 165;

    // Timeline lines
    p.stroke(0, 150, 255, 60);
    p.strokeWeight(1);
    p.line(colAX, timelineTop, colAX, timelineTop + timelineH);
    p.stroke(255, 180, 50, 60);
    p.line(colBX, timelineTop, colBX, timelineTop + timelineH);

    // Labels
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Host A", colAX, timelineTop - 2);
    p.fill(255, 180, 50);
    p.text("Host B", colBX, timelineTop - 2);

    // Message arrows
    const msgs = [
      { y: 0.15, fromA: true, label: "Seq=42, ACK=79, dados='C'", color: [0, 150, 255] },
      { y: 0.45, fromA: false, label: "Seq=79, ACK=43, dados='C'", color: [255, 180, 50] },
      { y: 0.75, fromA: true, label: "Seq=43, ACK=80", color: [0, 150, 255] },
    ];

    msgs.forEach((msg) => {
      const my = timelineTop + msg.y * timelineH;
      const fromX = msg.fromA ? colAX : colBX;
      const toX = msg.fromA ? colBX : colAX;

      // Animated progress
      const arrivalTime = msg.y;
      const msgProgress = p.constrain((time * 0.15 % 1.5 - arrivalTime + 0.3) / 0.3, 0, 1);

      const currentX = p.lerp(fromX, toX, msgProgress);

      p.stroke(msg.color[0], msg.color[1], msg.color[2], 120);
      p.strokeWeight(1.5);
      p.line(fromX, my, currentX, my);

      if (msgProgress >= 1) {
        // Arrow head
        p.fill(msg.color[0], msg.color[1], msg.color[2], 150);
        p.noStroke();
        const dir = msg.fromA ? -1 : 1;
        p.triangle(toX, my, toX + dir * 8, my - 4, toX + dir * 8, my + 4);
      }

      // Label
      p.noStroke();
      p.fill(msg.color[0], msg.color[1], msg.color[2], 200);
      p.textSize(8);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(msg.label, (fromX + toX) / 2, my - 5);
    });

    // Explanation
    p.noStroke();
    p.fill(140);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Seq# = número do primeiro byte do segmento no fluxo", w / 2, timelineTop + timelineH + 8);
    p.text("ACK# = número do próximo byte esperado (cumulativo)", w / 2, timelineTop + timelineH + 21);

    // Footer
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Números de sequência baseados em bytes, ACK cumulativo", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={400} />;
}

// Visualization 4: TCP Cumulative ACK mechanism
export function TCPCumulativeAck() {
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
    p.text("ACK Cumulativo — TCP", w / 2, 8);

    // Receiver buffer visualization
    const bufY = 40;
    const cellW = 38;
    const cellH = 30;
    const bufStartX = w / 2 - (8 * cellW) / 2;

    p.fill(180, 130, 255);
    p.textSize(9);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("Buffer do Receptor:", bufStartX, bufY - 4);

    // Draw 8 buffer cells
    const bufferState = [
      { byte: "0-99", status: "recebido", color: [100, 200, 100] },
      { byte: "100-199", status: "recebido", color: [100, 200, 100] },
      { byte: "200-299", status: "recebido", color: [100, 200, 100] },
      { byte: "300-399", status: "lacuna", color: [255, 100, 100] },
      { byte: "400-499", status: "recebido", color: [100, 200, 100] },
      { byte: "500-599", status: "lacuna", color: [255, 100, 100] },
      { byte: "600-699", status: "vazio", color: [50, 50, 70] },
      { byte: "700-799", status: "vazio", color: [50, 50, 70] },
    ];

    bufferState.forEach((cell, i) => {
      const cx = bufStartX + i * cellW;
      const pulse = cell.status === "lacuna" ? p.sin(time * 3 + i) * 20 : 0;

      p.fill(15, 20, 35);
      p.stroke(cell.color[0], cell.color[1], cell.color[2], 70 + pulse);
      p.strokeWeight(1.5);
      p.rect(cx, bufY, cellW - 2, cellH, 3);

      p.noStroke();
      p.fill(cell.color[0], cell.color[1], cell.color[2], 200);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(cell.byte, cx + (cellW - 2) / 2, bufY + cellH / 2 - 4);

      p.fill(80);
      p.textSize(6);
      p.text(cell.status, cx + (cellW - 2) / 2, bufY + cellH / 2 + 8);
    });

    // ACK pointer
    const ackX = bufStartX + 3 * cellW;
    const ackY = bufY + cellH + 5;

    p.fill(255, 100, 100);
    p.noStroke();
    p.triangle(ackX, ackY, ackX - 6, ackY + 10, ackX + 6, ackY + 10);

    p.fill(255, 100, 100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("ACK = 300", ackX, ackY + 12);

    p.fill(140);
    p.textSize(7);
    p.text("(\"Esperando byte 300\")", ackX, ackY + 24);

    // Explanation box
    const expY = ackY + 45;
    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 50);
    p.strokeWeight(1);
    p.rect(30, expY, w - 60, 75, 8);

    p.noStroke();
    p.fill(0, 150, 255, 220);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Como funciona o ACK Cumulativo?", w / 2, expY + 8);

    p.fill(160);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    const explLines = [
      "• Bytes 0–299 recebidos corretamente → confirmados",
      "• Byte 300 está faltando (lacuna) → ACK não avança!",
      "• Bytes 400–499 recebidos fora de ordem → mantidos no buffer",
      "• ACK = 300: \"recebi tudo ATÉ o byte 299, quero o 300\"",
    ];
    explLines.forEach((line, i) => {
      p.text(line, 45, expY + 24 + i * 13);
    });

    // Timeline showing out-of-order scenario
    const tlY = expY + 90;
    p.fill(180, 130, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Cenário: Segmento fora de ordem", w / 2, tlY);

    const colA = 70;
    const colB = w - 70;
    const tlTop = tlY + 20;
    const tlH = 100;

    // Timeline verticals
    p.stroke(0, 150, 255, 40);
    p.strokeWeight(1);
    p.line(colA, tlTop, colA, tlTop + tlH);
    p.stroke(255, 180, 50, 40);
    p.line(colB, tlTop, colB, tlTop + tlH);

    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Emissor", colA, tlTop - 2);
    p.fill(255, 180, 50);
    p.text("Receptor", colB, tlTop - 2);

    const events = [
      { y: 0.0, fromA: true, label: "Seg: Seq=200", color: [0, 150, 255] },
      { y: 0.25, fromA: true, label: "Seg: Seq=300 (perdido!)", color: [255, 100, 100] },
      { y: 0.5, fromA: true, label: "Seg: Seq=400", color: [0, 150, 255] },
      { y: 0.75, fromA: false, label: "ACK=300 (cumulativo)", color: [255, 180, 50] },
    ];

    events.forEach((ev, idx) => {
      const ey = tlTop + ev.y * tlH + 15;
      const fromX = ev.fromA ? colA : colB;
      const toX = ev.fromA ? colB : colA;

      // Draw arrow
      p.stroke(ev.color[0], ev.color[1], ev.color[2], 100);
      p.strokeWeight(1.2);

      if (idx === 1) {
        // Lost packet — draw dashed with X
        const midX = (fromX + toX) / 2;
        const midY = ey;
        p.line(fromX, ey, midX, ey);
        p.noStroke();
        p.fill(255, 100, 100);
        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("✕", midX + 15, midY);
      } else {
        p.line(fromX, ey, toX, ey);
        // Arrowhead
        p.fill(ev.color[0], ev.color[1], ev.color[2], 120);
        p.noStroke();
        const dir = ev.fromA ? -1 : 1;
        p.triangle(toX, ey, toX + dir * 7, ey - 3, toX + dir * 7, ey + 3);
      }

      // Label
      p.noStroke();
      p.fill(ev.color[0], ev.color[1], ev.color[2], 200);
      p.textSize(7);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(ev.label, (fromX + toX) / 2, ey - 4);
    });

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("ACK cumulativo: confirma todos os bytes até o ponto da lacuna", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={400} />;
}

// Visualization 5: RTT Estimation with EWMA — animated graph
export function TCPRttEstimation() {
  let time = 0;
  const sampleRTTs: number[] = [];
  const estimatedRTTs: number[] = [];
  const alpha = 0.125;

  // Generate sample RTTs with some variation
  let estRTT = 100;
  for (let i = 0; i < 30; i++) {
    const sample = 80 + Math.random() * 80 + (i > 15 ? 30 : 0); // RTT with spike
    sampleRTTs.push(sample);
    estRTT = (1 - alpha) * estRTT + alpha * sample;
    estimatedRTTs.push(estRTT);
  }

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
    p.text("Estimativa de RTT — Média Móvel Exponencial (EWMA)", w / 2, 8);

    // Formula
    p.fill(180, 130, 255);
    p.textSize(9);
    p.text("EstimatedRTT = (1 - α) × EstimatedRTT + α × SampleRTT     (α = 0.125)", w / 2, 28);

    // Graph area
    const graphX = 65;
    const graphY = 50;
    const graphW = w - 90;
    const graphH = 200;

    // Axes
    p.stroke(60);
    p.strokeWeight(1);
    p.line(graphX, graphY, graphX, graphY + graphH);
    p.line(graphX, graphY + graphH, graphX + graphW, graphY + graphH);

    // Y-axis label
    p.noStroke();
    p.fill(120);
    p.textSize(8);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("RTT (ms)", graphX - 5, graphY - 8);

    // X-axis label
    p.textAlign(p.CENTER, p.TOP);
    p.text("Amostras", graphX + graphW / 2, graphY + graphH + 10);

    // Y-axis ticks
    const yMin = 60;
    const yMax = 200;
    for (let v = 80; v <= 180; v += 20) {
      const yy = graphY + graphH - ((v - yMin) / (yMax - yMin)) * graphH;
      p.fill(60);
      p.textSize(7);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(v.toString(), graphX - 4, yy);
      p.stroke(30);
      p.strokeWeight(0.5);
      p.line(graphX, yy, graphX + graphW, yy);
    }

    // Animated reveal
    const visibleCount = Math.min(Math.floor(time * 4), sampleRTTs.length);
    const stepW = graphW / (sampleRTTs.length - 1);

    // Plot SampleRTT as dots
    for (let i = 0; i < visibleCount; i++) {
      const px = graphX + i * stepW;
      const py = graphY + graphH - ((sampleRTTs[i] - yMin) / (yMax - yMin)) * graphH;
      p.fill(100, 180, 255, 150);
      p.noStroke();
      p.ellipse(px, py, 5, 5);
    }

    // Plot EstimatedRTT as line
    p.stroke(255, 180, 50);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let i = 0; i < visibleCount; i++) {
      const px = graphX + i * stepW;
      const py = graphY + graphH - ((estimatedRTTs[i] - yMin) / (yMax - yMin)) * graphH;
      p.vertex(px, py);
    }
    p.endShape();

    // Legend
    const legY = graphY + graphH + 25;
    p.noStroke();

    // SampleRTT dot
    p.fill(100, 180, 255, 200);
    p.ellipse(w / 2 - 90, legY + 5, 6, 6);
    p.fill(140);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("SampleRTT", w / 2 - 83, legY + 5);

    // EstimatedRTT line
    p.stroke(255, 180, 50);
    p.strokeWeight(2);
    p.line(w / 2 + 20, legY + 5, w / 2 + 35, legY + 5);
    p.noStroke();
    p.fill(140);
    p.text("EstimatedRTT", w / 2 + 40, legY + 5);

    // Footer
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("EWMA suaviza variações — amostras recentes têm maior peso", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 6: TCP Timeout Calculation with DevRTT
export function TCPTimeoutCalculation() {
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
    p.text("Cálculo do Timeout Adaptativo — TCP", w / 2, 8);

    // Formulas box
    const formY = 32;
    p.fill(15, 20, 35);
    p.stroke(180, 130, 255, 50);
    p.strokeWeight(1);
    p.rect(20, formY, w - 40, 95, 8);

    p.noStroke();
    p.fill(180, 130, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Fórmulas do Timeout TCP", w / 2, formY + 6);

    p.fill(0, 150, 255);
    p.textSize(9);
    p.textAlign(p.LEFT, p.TOP);
    p.text("1. EstimatedRTT = (1-α)·EstimatedRTT + α·SampleRTT", 35, formY + 24);
    p.fill(80);
    p.textSize(7);
    p.text("    α = 0.125 (peso da amostra recente)", 35, formY + 36);

    p.fill(255, 180, 50);
    p.textSize(9);
    p.text("2. DevRTT = (1-β)·DevRTT + β·|SampleRTT - EstimatedRTT|", 35, formY + 50);
    p.fill(80);
    p.textSize(7);
    p.text("    β = 0.25 (peso do desvio recente)", 35, formY + 62);

    p.fill(255, 100, 100);
    p.textSize(9);
    p.text("3. TimeoutInterval = EstimatedRTT + 4·DevRTT", 35, formY + 78);

    // Visual representation with bars
    const barY = formY + 110;
    p.fill(180, 130, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Exemplo Numérico", w / 2, barY);

    // Simulated values
    const samples = [
      { sample: 100, est: 100, dev: 5, timeout: 120 },
      { sample: 130, est: 103.75, dev: 9.69, timeout: 142.5 },
      { sample: 90, est: 102.03, dev: 10.45, timeout: 143.83 },
      { sample: 115, est: 103.65, dev: 10.93, timeout: 147.37 },
    ];

    const tableStartX = 25;
    const colWidths = [70, 80, 80, 70, 90];
    const rowHeight = 22;
    const tableY = barY + 18;

    // Header
    const headers = ["SampleRTT", "EstimatedRTT", "DevRTT", "4×DevRTT", "Timeout"];
    const headerColors = [
      [100, 180, 255],
      [0, 150, 255],
      [255, 180, 50],
      [255, 180, 50],
      [255, 100, 100],
    ];

    let cx = tableStartX;
    headers.forEach((hdr, i) => {
      p.fill(15, 20, 35);
      p.stroke(headerColors[i][0], headerColors[i][1], headerColors[i][2], 60);
      p.strokeWeight(1);
      p.rect(cx, tableY, colWidths[i], rowHeight, 2);

      p.noStroke();
      p.fill(headerColors[i][0], headerColors[i][1], headerColors[i][2], 220);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(hdr, cx + colWidths[i] / 2, tableY + rowHeight / 2);

      cx += colWidths[i];
    });

    // Data rows
    samples.forEach((s, rowIdx) => {
      const ry = tableY + (rowIdx + 1) * rowHeight;
      const vals = [
        s.sample.toFixed(0),
        s.est.toFixed(2),
        s.dev.toFixed(2),
        (s.dev * 4).toFixed(2),
        s.timeout.toFixed(2),
      ];

      let rcx = tableStartX;
      vals.forEach((val, i) => {
        p.fill(15, 20, 35);
        p.stroke(40);
        p.strokeWeight(0.5);
        p.rect(rcx, ry, colWidths[i], rowHeight, 2);

        p.noStroke();
        p.fill(160);
        p.textSize(8);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(val + " ms", rcx + colWidths[i] / 2, ry + rowHeight / 2);

        rcx += colWidths[i];
      });
    });

    // Visual bar comparison
    const barBaseY = tableY + (samples.length + 1) * rowHeight + 15;
    const lastSample = samples[samples.length - 1];
    const maxVal = 180;
    const barMaxW = w - 80;

    const bars = [
      { label: "EstimatedRTT", value: lastSample.est, color: [0, 150, 255] },
      { label: "4 × DevRTT", value: lastSample.dev * 4, color: [255, 180, 50] },
      { label: "Timeout", value: lastSample.timeout, color: [255, 100, 100] },
    ];

    bars.forEach((bar, i) => {
      const by = barBaseY + i * 22;
      const bw = (bar.value / maxVal) * barMaxW;

      p.fill(15, 20, 35);
      p.stroke(bar.color[0], bar.color[1], bar.color[2], 50);
      p.strokeWeight(1);
      p.rect(65, by, barMaxW, 16, 3);

      p.fill(bar.color[0], bar.color[1], bar.color[2], 150);
      p.noStroke();
      p.rect(65, by, bw, 16, 3);

      p.fill(bar.color[0], bar.color[1], bar.color[2], 200);
      p.textSize(7);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(bar.label, 60, by + 8);

      p.fill(220);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(bar.value.toFixed(1) + " ms", 65 + bw + 5, by + 8);
    });

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Timeout = EstimatedRTT + margem de segurança (4×DevRTT)", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={400} />;
}

// Visualization 7: TCP Retransmission Scenarios
export function TCPRetransmissionScenarios() {
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
    p.textSize(13);
    p.text("Cenários de Retransmissão TCP", w / 2, 6);

    // Three scenarios side by side
    const scenarioW = (w - 20) / 3;
    const scenarios = [
      {
        title: "ACK Perdido",
        color: [255, 100, 100],
        events: [
          { y: 0.05, fromA: true, label: "Seq=92", ok: true },
          { y: 0.30, fromA: false, label: "ACK=100", ok: false },
          { y: 0.50, fromA: true, label: "Timeout!", ok: false },
          { y: 0.55, fromA: true, label: "Seq=92 (retx)", ok: true },
          { y: 0.80, fromA: false, label: "ACK=100", ok: true },
        ],
      },
      {
        title: "Timeout Prematuro",
        color: [255, 180, 50],
        events: [
          { y: 0.05, fromA: true, label: "Seq=92", ok: true },
          { y: 0.10, fromA: true, label: "Seq=100", ok: true },
          { y: 0.35, fromA: true, label: "Timeout!", ok: false },
          { y: 0.40, fromA: true, label: "Seq=92 (retx)", ok: true },
          { y: 0.50, fromA: false, label: "ACK=100", ok: true },
          { y: 0.60, fromA: false, label: "ACK=120", ok: true },
          { y: 0.75, fromA: false, label: "ACK=120", ok: true },
        ],
      },
      {
        title: "ACK Cumulativo",
        color: [0, 150, 255],
        events: [
          { y: 0.05, fromA: true, label: "Seq=92", ok: true },
          { y: 0.12, fromA: true, label: "Seq=100", ok: true },
          { y: 0.35, fromA: true, label: "Timeout!", ok: false },
          { y: 0.30, fromA: false, label: "ACK=100(perdido)", ok: false },
          { y: 0.45, fromA: false, label: "ACK=120", ok: true },
          { y: 0.70, fromA: true, label: "Sem retx!", ok: true },
        ],
      },
    ];

    scenarios.forEach((scenario, sIdx) => {
      const sx = 10 + sIdx * scenarioW;
      const sceneMidX = sx + scenarioW / 2;

      // Scenario box
      p.fill(15, 20, 35);
      p.stroke(scenario.color[0], scenario.color[1], scenario.color[2], 40);
      p.strokeWeight(1);
      p.rect(sx + 2, 24, scenarioW - 4, h - 34, 6);

      // Scenario title
      p.noStroke();
      p.fill(scenario.color[0], scenario.color[1], scenario.color[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text(scenario.title, sceneMidX, 28);

      // Timeline columns
      const colA = sx + 28;
      const colB = sx + scenarioW - 28;
      const tlTop = 50;
      const tlH = h - 75;

      p.stroke(0, 150, 255, 30);
      p.strokeWeight(0.5);
      p.line(colA, tlTop, colA, tlTop + tlH);
      p.stroke(255, 180, 50, 30);
      p.line(colB, tlTop, colB, tlTop + tlH);

      // Labels
      p.noStroke();
      p.fill(0, 150, 255, 180);
      p.textSize(7);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text("A", colA, tlTop - 1);
      p.fill(255, 180, 50, 180);
      p.text("B", colB, tlTop - 1);

      // Events
      scenario.events.forEach((ev) => {
        const ey = tlTop + ev.y * tlH;
        const fromX = ev.fromA ? colA : colB;
        const toX = ev.fromA ? colB : colA;

        if (ev.label.includes("Timeout") || ev.label.includes("Sem retx")) {
          // Timeout marker
          p.noStroke();
          p.fill(ev.ok ? [100, 200, 100] : [255, 100, 100]);
          p.textSize(7);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(ev.label, sceneMidX, ey);
          return;
        }

        if (!ev.ok) {
          // Lost packet/ACK
          const midX = (fromX + toX) / 2;
          p.stroke(255, 100, 100, 80);
          p.strokeWeight(1);
          p.line(fromX, ey, midX, ey);
          p.noStroke();
          p.fill(255, 100, 100);
          p.textSize(10);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("✕", midX + 8, ey);
        } else {
          p.stroke(
            scenario.color[0],
            scenario.color[1],
            scenario.color[2],
            100
          );
          p.strokeWeight(1);
          p.line(fromX, ey, toX, ey);
          // Arrowhead
          p.fill(
            scenario.color[0],
            scenario.color[1],
            scenario.color[2],
            120
          );
          p.noStroke();
          const dir = ev.fromA ? -1 : 1;
          p.triangle(toX, ey, toX + dir * 5, ey - 3, toX + dir * 5, ey + 3);
        }

        // Label
        p.noStroke();
        p.fill(180);
        p.textSize(6);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text(ev.label, (fromX + toX) / 2, ey - 3);
      });
    });

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("O ACK cumulativo pode salvar retransmissões desnecessárias", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 8: TCP Send/Receive Buffers and MSS
export function TCPBuffersAndMSS() {
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
    p.text("Buffers TCP e Tamanho Máximo de Segmento (MSS)", w / 2, 8);

    // Application writing to send buffer
    const appY = 40;

    p.fill(100, 200, 100);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Aplicação escreve dados no socket", w / 2, appY);

    // Arrow down
    p.stroke(100, 200, 100, 120);
    p.strokeWeight(1.5);
    p.line(w / 2, appY + 16, w / 2, appY + 28);
    p.fill(100, 200, 100, 120);
    p.noStroke();
    p.triangle(w / 2, appY + 32, w / 2 - 5, appY + 26, w / 2 + 5, appY + 26);

    // Send buffer
    const bufY = appY + 38;
    const bufW = w - 80;
    const bufH = 40;
    const bufX = 40;

    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 60);
    p.strokeWeight(1.5);
    p.rect(bufX, bufY, bufW, bufH, 6);

    p.noStroke();
    p.fill(0, 150, 255, 180);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Send Buffer TCP", bufX + bufW / 2, bufY + 3);

    // Data in buffer segments
    const numSegs = 6;
    const segW = (bufW - 10) / numSegs;
    for (let i = 0; i < numSegs; i++) {
      const segX = bufX + 5 + i * segW;
      const isFilled = i < 4; // First 4 have data
      const isNext = i === 4; // Next to be filled

      if (isFilled) {
        const fillAmt = 1;
        p.fill(0, 150, 255, 80 * fillAmt);
        p.noStroke();
        p.rect(segX, bufY + 18, segW - 2, 18, 3);

        p.fill(0, 150, 255, 200);
        p.textSize(7);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`Seg ${i + 1}`, segX + (segW - 2) / 2, bufY + 27);
      } else if (isNext) {
        const pulse = (p.sin(time * 3) + 1) / 2;
        p.fill(100, 200, 100, 30 * pulse);
        p.noStroke();
        p.rect(segX, bufY + 18, segW - 2, 18, 3);
      }
    }

    // MSS bracket
    const mssY = bufY + bufH + 5;
    const mssStartX = bufX + 5;
    const mssEndX = bufX + 5 + segW - 2;

    p.stroke(255, 180, 50, 150);
    p.strokeWeight(1);
    p.line(mssStartX, mssY, mssStartX, mssY + 10);
    p.line(mssEndX, mssY, mssEndX, mssY + 10);
    p.line(mssStartX, mssY + 10, mssEndX, mssY + 10);

    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("≤ MSS", (mssStartX + mssEndX) / 2, mssY + 13);

    // Segment encapsulation
    const encapY = mssY + 35;
    p.fill(180, 130, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Encapsulamento do Segmento", w / 2, encapY);

    // TCP header + data
    const hdrX = 60;
    const hdrW = 80;
    const dataW = 160;
    const pktY = encapY + 18;
    const pktH = 30;

    // TCP Header
    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 80);
    p.strokeWeight(1.5);
    p.rect(hdrX, pktY, hdrW, pktH, 4, 0, 0, 4);
    p.noStroke();
    p.fill(0, 150, 255, 200);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Cabeçalho TCP", hdrX + hdrW / 2, pktY + pktH / 2 - 4);
    p.fill(80);
    p.textSize(7);
    p.text("20+ bytes", hdrX + hdrW / 2, pktY + pktH / 2 + 8);

    // Data payload
    p.fill(15, 20, 35);
    p.stroke(100, 200, 100, 80);
    p.strokeWeight(1.5);
    p.rect(hdrX + hdrW, pktY, dataW, pktH, 0, 4, 4, 0);
    p.noStroke();
    p.fill(100, 200, 100, 200);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Dados da Aplicação", hdrX + hdrW + dataW / 2, pktY + pktH / 2 - 4);
    p.fill(80);
    p.textSize(7);
    p.text("≤ MSS bytes", hdrX + hdrW + dataW / 2, pktY + pktH / 2 + 8);

    // IP header wrapping
    const ipX = hdrX - 55;
    const ipW = 55;

    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(1);
    p.rect(ipX, pktY - 5, hdrW + dataW + ipW + 5, pktH + 10, 6);
    p.noStroke();
    p.fill(255, 180, 50, 180);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("IP Hdr", ipX + ipW / 2, pktY + pktH / 2);
    p.fill(80);
    p.textSize(6);
    p.text("20 bytes", ipX + ipW / 2, pktY + pktH / 2 + 10);

    // MSS vs MTU explanation
    const explY = pktY + pktH + 25;
    p.fill(15, 20, 35);
    p.stroke(180, 130, 255, 40);
    p.strokeWeight(1);
    p.rect(30, explY, w - 60, 65, 8);

    p.noStroke();
    p.fill(180, 130, 255, 220);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("MSS vs MTU", w / 2, explY + 6);

    p.fill(150);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    const lines = [
      "• MTU (Maximum Transmission Unit) = tamanho máx. do frame de enlace (ex: 1500 bytes em Ethernet)",
      "• MSS (Maximum Segment Size) = MTU − Cabeçalho IP − Cabeçalho TCP",
      "• MSS típico = 1500 − 20 − 20 = 1460 bytes de dados",
    ];
    lines.forEach((line, i) => {
      p.text(line, 42, explY + 22 + i * 14);
    });

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("O TCP fragmenta o fluxo de bytes em segmentos ≤ MSS", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={370} />;
}

