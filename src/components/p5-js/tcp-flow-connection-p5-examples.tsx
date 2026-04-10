"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

// Visualization 1: Flow control — rwnd buffer fill/drain animation
export function TCPFlowControlBuffer() {
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
    p.textSize(14);
    p.text("Controle de Fluxo — Janela de Recepção (rwnd)", w / 2, 8);

    // Simulate fill oscillation
    const bufferCapacity = 4096;
    const fillRaw = ((p.sin(time * 0.4) + 1) / 2) * 0.85;
    const bufferFill = fillRaw * bufferCapacity;
    const rwnd = bufferCapacity - bufferFill;

    // Sender
    const sndX = 30;
    const sndY = 55;
    const sndW = 120;
    const sndH = 170;

    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 80);
    p.strokeWeight(2);
    p.rect(sndX, sndY, sndW, sndH, 8);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Emissor", sndX + sndW / 2, sndY + 8);

    p.fill(80);
    p.textSize(8);
    p.text("Só envia até", sndX + sndW / 2, sndY + 30);
    p.fill(0, 150, 255, 200);
    p.textSize(9);
    p.text(`rwnd = ${Math.round(rwnd)} bytes`, sndX + sndW / 2, sndY + 44);

    // Sliding window bar
    const winBarX = sndX + 10;
    const winBarY = sndY + 62;
    const winBarW = sndW - 20;
    const winBarH = 14;
    p.fill(20, 30, 50);
    p.stroke(0, 150, 255, 40);
    p.strokeWeight(1);
    p.rect(winBarX, winBarY, winBarW, winBarH, 3);
    p.fill(0, 150, 255, 150);
    p.noStroke();
    p.rect(winBarX, winBarY, (rwnd / bufferCapacity) * winBarW, winBarH, 3);
    p.fill(180);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Janela de envio", winBarX + winBarW / 2, winBarY + 7);

    p.fill(80);
    p.textSize(7);
    p.textAlign(p.CENTER, p.TOP);
    p.text("LastByteSent", sndX + sndW / 2, sndY + 85);
    p.text("- LastByteAcked", sndX + sndW / 2, sndY + 96);
    p.fill(255, 180, 50, 180);
    p.textSize(8);
    p.text("≤ rwnd", sndX + sndW / 2, sndY + 110);

    // Receiver buffer
    const rcvX = w - 180;
    const rcvY = sndY;
    const rcvW = 150;
    const rcvH = sndH;

    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 80);
    p.strokeWeight(2);
    p.rect(rcvX, rcvY, rcvW, rcvH, 8);
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Receptor", rcvX + rcvW / 2, rcvY + 8);

    // Buffer visualization (vertical bar)
    const bvX = rcvX + 15;
    const bvY = rcvY + 28;
    const bvW = rcvW - 30;
    const bvH = 90;

    // Background
    p.fill(20, 30, 50);
    p.stroke(60);
    p.strokeWeight(1);
    p.rect(bvX, bvY, bvW, bvH, 3);

    // Filled portion
    const fillH = (bufferFill / bufferCapacity) * bvH;
    p.fill(255, 100, 100, 120);
    p.noStroke();
    p.rect(bvX, bvY + bvH - fillH, bvW, fillH, 0, 0, 3, 3);

    // Free portion label
    p.fill(100, 200, 100, 180);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    const freeH = bvH - fillH;
    if (freeH > 12) {
      p.text("Livre", bvX + bvW / 2, bvY + freeH / 2);
    }
    if (fillH > 12) {
      p.fill(255, 100, 100, 200);
      p.text("Dados", bvX + bvW / 2, bvY + bvH - fillH / 2);
    }

    // Labels
    p.fill(100, 200, 100, 200);
    p.textSize(8);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text(`rwnd=${Math.round(rwnd)}`, bvX - 3, bvY + freeH / 2);

    p.fill(255, 100, 100, 200);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text(`${Math.round(bufferFill)}B`, bvX - 3, bvY + bvH - fillH / 2);

    // Capacity label
    p.fill(180, 130, 255);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Buffer: ${bufferCapacity}B`, rcvX + 12, rcvY + 125);

    // Arrow with rwnd value
    const arrowMidY = sndY + sndH / 2 + 20;
    const arrowStartX = rcvX;
    const arrowEndX = sndX + sndW;

    p.stroke(100, 200, 100, 150);
    p.strokeWeight(1.5);
    p.line(arrowEndX, arrowMidY, arrowStartX, arrowMidY);
    p.fill(100, 200, 100, 150);
    p.noStroke();
    p.triangle(arrowEndX, arrowMidY, arrowEndX + 8, arrowMidY - 4, arrowEndX + 8, arrowMidY + 4);

    p.fill(100, 200, 100, 220);
    p.textSize(8);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(`ACK + rwnd = ${Math.round(rwnd)}`, (arrowStartX + arrowEndX) / 2, arrowMidY - 3);

    // Data packets A→B
    const pktProgress = (time * 0.5) % 1;
    const pktX = p.lerp(sndX + sndW + 5, rcvX - 5, pktProgress);

    p.fill(0, 150, 255, 180);
    p.noStroke();
    p.rect(pktX - 20, arrowMidY - 30, 40, 14, 3);
    p.fill(255);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Dados", pktX, arrowMidY - 23);

    // App draining buffer
    const drainY = rcvY + rcvH - 15;
    p.fill(80);
    p.textSize(7);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Aplicação lê → libera espaço", rcvX + rcvW / 2, drainY);

    // Footer
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("O emissor ajusta sua janela ao rwnd anunciado pelo receptor", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={310} />;
}

// Visualization 2: rwnd = 0 problem and persist timer
export function TCPRwndZeroProblem() {
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
    p.textSize(14);
    p.text("Problema do rwnd = 0 e Persist Timer", w / 2, 8);

    const colA = 70;
    const colB = w - 70;
    const tlTop = 42;
    const tlH = h - 90;

    p.stroke(0, 150, 255, 40);

    p.strokeWeight(1);
    p.line(colA, tlTop, colA, tlTop + tlH);
    p.stroke(255, 180, 50, 40);
    p.line(colB, tlTop, colB, tlTop + tlH);

    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Emissor", colA, tlTop - 2);
    p.fill(255, 180, 50);
    p.text("Receptor", colB, tlTop - 2);

    const events = [
      { y: 0.05, fromA: true, label: "Dados (até rwnd)", col: [0, 150, 255] },
      { y: 0.18, fromA: false, label: "ACK + rwnd = 0 ⚠️", col: [255, 100, 100] },
      { y: 0.30, isNote: true, side: "A", label: "Emissor BLOQUEADO\n(rwnd = 0)", col: [255, 100, 100] },
      { y: 0.42, isNote: true, side: "B", label: "App lê dados\nbuffer libera", col: [100, 200, 100] },
      { y: 0.52, fromA: true, label: "Persist Timer → sonda 1 byte", col: [180, 130, 255] },
      { y: 0.65, fromA: false, label: "ACK + rwnd = 2048", col: [100, 200, 100] },
      { y: 0.80, fromA: true, label: "Retoma envio normal", col: [0, 150, 255] },
    ];

    events.forEach((ev: any) => {
      const ey = tlTop + ev.y * tlH;

        if (ev.isNote) {
          const nx = ev.side === "A" ? colA : colB;
          p.fill(15, 20, 35);
          p.stroke(ev.col[0], ev.col[1], ev.col[2], 50);
          p.strokeWeight(1);
          const noteW = 120;
          const lines = ev.label.split("\n");
          p.rect(nx - noteW / 2, ey - 10, noteW, lines.length * 14 + 6, 5);
          p.noStroke();
          p.fill(ev.col[0], ev.col[1], ev.col[2], 220);
          p.textSize(8);
          p.textAlign(p.CENTER, p.CENTER);
          lines.forEach((line: string, i: number) => {
            p.text(line, nx, ey - 3 + i * 14);
          });
          return;
        }

      const fromX = ev.fromA ? colA : colB;
      const toX = ev.fromA ? colB : colA;

      p.stroke(ev.col[0], ev.col[1], ev.col[2], 100);
      p.strokeWeight(1.5);
      p.line(fromX, ey, toX, ey);
      p.fill(ev.col[0], ev.col[1], ev.col[2], 130);
      p.noStroke();
      const dir = ev.fromA ? -1 : 1;
      p.triangle(toX, ey, toX + dir * 7, ey - 4, toX + dir * 7, ey + 4);

      p.fill(ev.col[0], ev.col[1], ev.col[2], 220);
      p.textSize(8);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(ev.label, (fromX + toX) / 2, ey - 4);
    });

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Persist timer evita deadlock quando o receptor anuncia rwnd = 0", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 3: 3-way handshake — SYN, SYNACK, ACK
export function TCPThreeWayHandshake() {
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
    p.textSize(14);
    p.text("Handshake de 3 Vias — Estabelecimento de Conexão TCP", w / 2, 8);

    const colA = 80;
    const colB = w - 80;
    const tlTop = 50;
    const tlH = h - 100;

    // State labels
    const stateA = ["CLOSED", "SYN_SENT", "ESTAB"];
    const stateB = ["LISTEN", "SYN_RCVD", "ESTAB"];
    const stateY = [0.0, 0.22, 0.55];

    stateY.forEach((sy, i) => {
      const ay = tlTop + sy * tlH;

      p.fill(15, 20, 35);
      p.stroke(0, 150, 255, 40);
      p.strokeWeight(1);
      p.rect(colA - 42, ay - 8, 84, 16, 4);
      p.noStroke();
      p.fill(0, 150, 255, 180);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(stateA[i], colA, ay);

      p.fill(15, 20, 35);
      p.stroke(255, 180, 50, 40);
      p.strokeWeight(1);
      p.rect(colB - 42, ay - 8, 84, 16, 4);
      p.noStroke();
      p.fill(255, 180, 50, 180);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(stateB[i], colB, ay);
    });

    // Timeline lines
    p.stroke(0, 150, 255, 30);
    p.strokeWeight(1);
    p.line(colA, tlTop + 10, colA, tlTop + tlH);
    p.stroke(255, 180, 50, 30);
    p.line(colB, tlTop + 10, colB, tlTop + tlH);

    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cliente (A)", colA, tlTop - 2);
    p.fill(255, 180, 50);
    p.text("Servidor (B)", colB, tlTop - 2);

    // Messages
    const msgs = [
      {
        y: 0.22,
        fromA: true,
        label1: "SYN",
        label2: "seq=x, SYN=1",
        col: [0, 150, 255],
        step: "1",
      },
      {
        y: 0.42,
        fromA: false,
        label1: "SYNACK",
        label2: "seq=y, ACK=x+1, SYN=1",
        col: [255, 180, 50],
        step: "2",
      },
      {
        y: 0.62,
        fromA: true,
        label1: "ACK",
        label2: "seq=x+1, ACK=y+1",
        col: [100, 200, 100],
        step: "3",
      },
      {
        y: 0.80,
        fromA: true,
        label1: "Dados HTTP",
        label2: "(pode enviar dados já no ACK!)",
        col: [180, 130, 255],
        step: "",
      },
    ];

    // Animate with looping phase
    const loopTime = (time * 0.12) % 1;

    msgs.forEach((msg) => {
      const my = tlTop + msg.y * tlH;
      const fromX = msg.fromA ? colA : colB;
      const toX = msg.fromA ? colB : colA;

      const progress = p.constrain((loopTime - msg.y + 0.2) / 0.15, 0, 1);
      const curX = p.lerp(fromX, toX, progress);

      p.stroke(msg.col[0], msg.col[1], msg.col[2], 100);
      p.strokeWeight(1.5);
      p.line(fromX, my, curX, my);

      if (progress >= 1) {
        p.fill(msg.col[0], msg.col[1], msg.col[2], 130);
        p.noStroke();
        const dir = msg.fromA ? -1 : 1;
        p.triangle(toX, my, toX + dir * 7, my - 4, toX + dir * 7, my + 4);
      }

      // Step badge
      if (msg.step) {
        const badgeX = msg.fromA ? fromX + 10 : fromX - 10;
        p.fill(msg.col[0], msg.col[1], msg.col[2]);
        p.noStroke();
        p.ellipse(badgeX, my - 14, 16, 16);
        p.fill(15, 20, 35);
        p.textSize(9);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(msg.step, badgeX, my - 14);
      }

      // Labels
      p.noStroke();
      p.fill(msg.col[0], msg.col[1], msg.col[2], 220);
      p.textSize(9);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(msg.label1, (fromX + toX) / 2, my - 10);
      p.fill(100);
      p.textSize(7);
      p.text(msg.label2, (fromX + toX) / 2, my - 1);
    });

    // Legend box
    const legY = tlTop + tlH + 8;
    p.fill(15, 20, 35);
    p.stroke(100, 200, 100, 40);
    p.strokeWeight(1);
    p.rect(20, legY, w - 40, 30, 5);
    p.noStroke();
    p.fill(100, 200, 100, 180);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(
      "3 mensagens — 1.5 RTTs de latência até o primeiro dado útil ser enviado",
      w / 2,
      legY + 15
    );

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Handshake garante que ambos estão prontos e sincronizam números de sequência", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={390} />;
}

// Visualization 4: Why 2-way handshake fails in real networks
export function TCPTwoWayHandshakeProblem() {
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
    p.text("Por que o Handshake de 2 Vias é Insuficiente?", w / 2, 8);

    const halfW = w / 2 - 10;
    const scenarios = [
      {
        x: 5,
        title: "Cenário 1: SYN Atrasado",
        titleCol: [255, 100, 100],
        events: [
          { y: 0.1, fromA: true, label: "SYN (atrasado)", ok: true, col: [255, 100, 100] },
          { y: 0.25, fromA: true, label: "SYN (novo)", ok: true, col: [0, 150, 255] },
          { y: 0.45, fromA: false, label: "SYNACK", ok: true, col: [255, 180, 50] },
          { y: 0.6, fromA: true, label: "Conexão encerrada", isNote: true, col: [100, 200, 100] },
          { y: 0.78, fromA: false, label: "SYN antigo chega!\nServidor abre 2ª conexão órfã", isNote: true, col: [255, 100, 100] },
        ],
      },
      {
        x: halfW + 15,
        title: "Cenário 2: Dados Antigos",
        titleCol: [255, 180, 50],
        events: [
          { y: 0.1, fromA: true, label: "SYN (seq=x)", ok: true, col: [0, 150, 255] },
          { y: 0.3, fromA: false, label: "SYNACK", ok: true, col: [255, 180, 50] },
          { y: 0.48, fromA: false, label: "Dados antigos chegam!\n(seq# igual ao da nova conexão)", isNote: true, col: [255, 100, 100] },
          { y: 0.72, fromA: true, label: "App recebe dados corrompidos", isNote: true, col: [255, 100, 100] },
        ],
      },
    ];

    scenarios.forEach((sc) => {
      const scW = halfW - 10;
      const colA = sc.x + 50;
      const colB = sc.x + scW - 50;
      const tlTop = 38;
      const tlH = h - 80;

      // Box
      p.fill(15, 20, 35);
      p.stroke(sc.titleCol[0], sc.titleCol[1], sc.titleCol[2], 30);
      p.strokeWeight(1);
      p.rect(sc.x, 24, scW, h - 34, 6);

      // Title
      p.noStroke();
      p.fill(sc.titleCol[0], sc.titleCol[1], sc.titleCol[2]);
      p.textSize(8);
      p.textAlign(p.CENTER, p.TOP);
      p.text(sc.title, sc.x + scW / 2, 27);

      // Timeline lines
      p.stroke(0, 150, 255, 25);
      p.strokeWeight(0.5);
      p.line(colA, tlTop, colA, tlTop + tlH);
      p.stroke(255, 180, 50, 25);
      p.line(colB, tlTop, colB, tlTop + tlH);

      p.noStroke();
      p.fill(0, 150, 255, 150);
      p.textSize(7);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text("A", colA, tlTop - 1);
      p.fill(255, 180, 50, 150);
      p.text("B", colB, tlTop - 1);

      sc.events.forEach((ev: any) => {
        const ey = tlTop + ev.y * tlH;

        if (ev.isNote) {
          const nx = ev.fromA ? colA : colB;
          p.fill(15, 20, 35);
          p.stroke(ev.col[0], ev.col[1], ev.col[2], 40);
          p.strokeWeight(1);
          const nw = scW - 20;
          const lines = ev.label.split("\n");
          p.rect(sc.x + 10, ey - 8, nw, lines.length * 13 + 6, 4);
          p.noStroke();
          p.fill(ev.col[0], ev.col[1], ev.col[2], 200);
          p.textSize(7);
          p.textAlign(p.CENTER, p.CENTER);
          lines.forEach((line: string, i: number) => {
            p.text(line, sc.x + nw / 2 + 10, ey - 2 + i * 13);
          });
          return;
        }

        const fromX = ev.fromA ? colA : colB;
        const toX = ev.fromA ? colB : colA;

        p.stroke(ev.col[0], ev.col[1], ev.col[2], 90);
        p.strokeWeight(1.2);
        p.line(fromX, ey, toX, ey);
        p.fill(ev.col[0], ev.col[1], ev.col[2], 110);
        p.noStroke();
        const dir = ev.fromA ? -1 : 1;
        p.triangle(toX, ey, toX + dir * 6, ey - 3, toX + dir * 6, ey + 3);

        p.noStroke();
        p.fill(ev.col[0], ev.col[1], ev.col[2], 200);
        p.textSize(7);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text(ev.label, (fromX + toX) / 2, ey - 3);
      });
    });

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("O 3-way handshake resolve ambos os problemas com ISN aleatório e confirmação mútua", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

// Visualization 5: TCP connection teardown FIN/ACK
export function TCPConnectionTeardown() {
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
    p.textSize(14);
    p.text("Encerramento de Conexão TCP — FIN/ACK", w / 2, 8);

    const colA = 80;
    const colB = w - 80;
    const tlTop = 50;
    const tlH = h - 100;

    // States
    const stateData = [
      { yFrac: 0.0, stA: "ESTAB", stB: "ESTAB" },
      { yFrac: 0.22, stA: "FIN_WAIT_1", stB: "ESTAB" },
      { yFrac: 0.40, stA: "FIN_WAIT_2", stB: "CLOSE_WAIT" },
      { yFrac: 0.62, stA: "TIME_WAIT", stB: "LAST_ACK" },
      { yFrac: 0.85, stA: "CLOSED", stB: "CLOSED" },
    ];

    stateData.forEach((s) => {
      const sy = tlTop + s.yFrac * tlH;
      [[colA, s.stA, [0, 150, 255]], [colB, s.stB, [255, 180, 50]]].forEach(
        ([cx, label, col]: any) => {
          p.fill(15, 20, 35);
          p.stroke(col[0], col[1], col[2], 35);
          p.strokeWeight(1);
          p.rect(cx - 45, sy - 8, 90, 16, 4);
          p.noStroke();
          p.fill(col[0], col[1], col[2], 160);
          p.textSize(7);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(label, cx, sy);
        }
      );
    });

    p.stroke(0, 150, 255, 25);
    p.strokeWeight(1);
    p.line(colA, tlTop + 10, colA, tlTop + tlH);
    p.stroke(255, 180, 50, 25);
    p.line(colB, tlTop + 10, colB, tlTop + tlH);

    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cliente (A)", colA, tlTop - 2);
    p.fill(255, 180, 50);
    p.text("Servidor (B)", colB, tlTop - 2);

    const loopT = (time * 0.1) % 1;

    const msgs = [
      { y: 0.22, fromA: true, l1: "FIN", l2: "FIN=1, seq=x", col: [255, 180, 50], step: "1" },
      { y: 0.40, fromA: false, l1: "ACK", l2: "ACK=x+1", col: [100, 200, 100], step: "2" },
      { y: 0.55, fromA: false, l1: "FIN", l2: "FIN=1, seq=y", col: [255, 180, 50], step: "3" },
      { y: 0.72, fromA: true, l1: "ACK", l2: "ACK=y+1", col: [100, 200, 100], step: "4" },
    ];

    msgs.forEach((msg) => {
      const my = tlTop + msg.y * tlH;
      const fromX = msg.fromA ? colA : colB;
      const toX = msg.fromA ? colB : colA;
      const prog = p.constrain((loopT - msg.y + 0.2) / 0.12, 0, 1);
      const curX = p.lerp(fromX, toX, prog);

      p.stroke(msg.col[0], msg.col[1], msg.col[2], 100);
      p.strokeWeight(1.5);
      p.line(fromX, my, curX, my);

      if (prog >= 1) {
        p.fill(msg.col[0], msg.col[1], msg.col[2], 130);
        p.noStroke();
        const dir = msg.fromA ? -1 : 1;
        p.triangle(toX, my, toX + dir * 7, my - 4, toX + dir * 7, my + 4);
      }

      if (msg.step) {
        const bx = msg.fromA ? fromX + 10 : fromX - 10;
        p.fill(msg.col[0], msg.col[1], msg.col[2]);
        p.noStroke();
        p.ellipse(bx, my - 14, 16, 16);
        p.fill(15, 20, 35);
        p.textSize(9);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(msg.step, bx, my - 14);
      }

      p.noStroke();
      p.fill(msg.col[0], msg.col[1], msg.col[2], 220);
      p.textSize(9);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(msg.l1, (fromX + toX) / 2, my - 10);
      p.fill(100);
      p.textSize(7);
      p.text(msg.l2, (fromX + toX) / 2, my - 1);
    });

    // TIME_WAIT note
    const twY = tlTop + 0.72 * tlH + 10;
    p.fill(15, 20, 35);
    p.stroke(180, 130, 255, 50);
    p.strokeWeight(1);
    p.rect(20, twY, 160, 28, 5);
    p.noStroke();
    p.fill(180, 130, 255, 200);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("TIME_WAIT: espera 2×MSL", 100, twY + 9);
    p.fill(100);
    p.textSize(7);
    p.text("(garante que o ACK chegou)", 100, twY + 21);

    // Legend
    const legY = tlTop + tlH + 6;
    p.fill(15, 20, 35);
    p.stroke(100, 200, 100, 40);
    p.strokeWeight(1);
    p.rect(20, legY, w - 40, 22, 4);
    p.noStroke();
    p.fill(140);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("4 mensagens (half-close): cada lado encerra independentemente", w / 2, legY + 11);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("FIN encerra apenas o fluxo de um lado — o outro pode ainda enviar dados", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={390} />;
}

// Visualization 6: RST — abrupt connection reset
export function TCPResetFlag() {
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
    p.textSize(14);
    p.text("Flag RST — Encerramento Abrupto de Conexão", w / 2, 8);

    const halfW = w / 2 - 8;
    const panels = [
      {
        x: 5,
        title: "Porta Fechada",
        titleCol: [255, 100, 100],
        events: [
          { y: 0.15, fromA: true, label: "SYN porta 9999", col: [0, 150, 255] },
          { y: 0.45, fromA: false, label: "RST (porta não escuta!)", col: [255, 100, 100] },
          { y: 0.7, isNote: true, label: "Cliente recebe RST\n→ Conexão recusada", col: [255, 100, 100] },
        ],
      },
      {
        x: halfW + 11,
        title: "Encerramento Abrupto",
        titleCol: [255, 180, 50],
        events: [
          { y: 0.1, fromA: true, label: "Dados (seq=100)", col: [0, 150, 255] },
          { y: 0.3, fromA: false, label: "Dados (seq=200)", col: [255, 180, 50] },
          { y: 0.52, fromA: true, label: "RST (erro fatal / crash)", col: [255, 100, 100] },
          { y: 0.72, isNote: true, label: "Receptor descarta\ntudo e fecha socket", col: [255, 100, 100] },
        ],
      },
    ];

    panels.forEach((panel) => {
      const pW = halfW - 10;
      const colA = panel.x + 48;
      const colB = panel.x + pW - 48;
      const tlTop = 36;
      const tlH = h - 76;

      p.fill(15, 20, 35);
      p.stroke(panel.titleCol[0], panel.titleCol[1], panel.titleCol[2], 30);
      p.strokeWeight(1);
      p.rect(panel.x, 24, pW, h - 30, 6);

      p.noStroke();
      p.fill(panel.titleCol[0], panel.titleCol[1], panel.titleCol[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text(panel.title, panel.x + pW / 2, 28);

      p.stroke(0, 150, 255, 20);
      p.strokeWeight(0.5);
      p.line(colA, tlTop, colA, tlTop + tlH);
      p.stroke(255, 180, 50, 20);
      p.line(colB, tlTop, colB, tlTop + tlH);

      p.noStroke();
      p.fill(0, 150, 255, 150);
      p.textSize(7);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text("A", colA, tlTop - 1);
      p.fill(255, 180, 50, 150);
      p.text("B", colB, tlTop - 1);

      panel.events.forEach((ev: any) => {
        const ey = tlTop + ev.y * tlH;

        if (ev.isNote) {
          p.fill(15, 20, 35);
          p.stroke(ev.col[0], ev.col[1], ev.col[2], 40);
          p.strokeWeight(1);
          const nw = pW - 20;
          const lines = ev.label.split("\n");
          p.rect(panel.x + 10, ey - 8, nw, lines.length * 13 + 6, 4);
          p.noStroke();
          p.fill(ev.col[0], ev.col[1], ev.col[2], 200);
          p.textSize(7);
          p.textAlign(p.CENTER, p.CENTER);
          lines.forEach((l: string, i: number) => {
            p.text(l, panel.x + nw / 2 + 10, ey - 2 + i * 13);
          });
          return;
        }

        const fromX = ev.fromA !== false ? colA : colB;
        const toX = ev.fromA !== false ? colB : colA;

        p.stroke(ev.col[0], ev.col[1], ev.col[2], 100);
        p.strokeWeight(1.5);
        p.line(fromX, ey, toX, ey);
        p.fill(ev.col[0], ev.col[1], ev.col[2], 120);
        p.noStroke();
        const dir = ev.fromA !== false ? -1 : 1;
        p.triangle(toX, ey, toX + dir * 7, ey - 4, toX + dir * 7, ey + 4);

        p.noStroke();
        p.fill(ev.col[0], ev.col[1], ev.col[2], 220);
        p.textSize(8);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text(ev.label, (fromX + toX) / 2, ey - 4);
      });
    });

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("RST = encerramento imediato — sem handshake de encerramento, dados em trânsito são perdidos", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

