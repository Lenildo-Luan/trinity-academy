"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

// Visualization 1: rdt1.0 — Ideal channel with simple send/receive, no errors or losses
export function RDT10SimpleChannel() {
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
    p.text("rdt1.0 — Canal Perfeitamente Confiável", w / 2, 10);

    // Sender FSM box
    const senderX = 30;
    const senderY = 50;
    const boxW = 140;
    const boxH = 170;

    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 80);
    p.strokeWeight(2);
    p.rect(senderX, senderY, boxW, boxH, 8);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Emissor", senderX + boxW / 2, senderY + 8);

    // Sender FSM state
    const senderStateY = senderY + 40;
    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 60);
    p.strokeWeight(1);
    p.ellipse(senderX + boxW / 2, senderStateY + 30, 110, 50);
    p.noStroke();
    p.fill(0, 150, 255, 200);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Aguardar", senderX + boxW / 2, senderStateY + 22);
    p.text("chamada de cima", senderX + boxW / 2, senderStateY + 34);

    // Sender actions
    p.fill(80);
    p.textSize(7);
    p.text("rdt_send(data)", senderX + boxW / 2, senderY + 110);
    p.fill(100, 200, 100);
    p.text("packet = make_pkt(data)", senderX + boxW / 2, senderY + 125);
    p.text("udt_send(packet)", senderX + boxW / 2, senderY + 138);

    // Receiver FSM box
    const receiverX = w - boxW - 30;

    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 80);
    p.strokeWeight(2);
    p.rect(receiverX, senderY, boxW, boxH, 8);
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Receptor", receiverX + boxW / 2, senderY + 8);

    // Receiver FSM state
    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(1);
    p.ellipse(receiverX + boxW / 2, senderStateY + 30, 110, 50);
    p.noStroke();
    p.fill(255, 180, 50, 200);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Aguardar", receiverX + boxW / 2, senderStateY + 22);
    p.text("chamada de baixo", receiverX + boxW / 2, senderStateY + 34);

    // Receiver actions
    p.fill(80);
    p.textSize(7);
    p.text("rdt_rcv(packet)", receiverX + boxW / 2, senderY + 110);
    p.fill(100, 200, 100);
    p.text("data = extract(packet)", receiverX + boxW / 2, senderY + 125);
    p.text("deliver_data(data)", receiverX + boxW / 2, senderY + 138);

    // Channel in the middle
    const channelY = senderY + boxH + 25;
    const channelStartX = senderX + boxW / 2;
    const channelEndX = receiverX + boxW / 2;
    const channelMidX = w / 2;

    // Channel label
    p.fill(100, 200, 100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Canal Confiável (sem erros, sem perdas)", channelMidX, channelY - 10);

    // Arrow line
    p.stroke(100, 200, 100, 100);
    p.strokeWeight(2);
    p.line(channelStartX, channelY + 5, channelEndX, channelY + 5);

    // Arrowhead
    p.fill(100, 200, 100, 150);
    p.noStroke();
    p.triangle(
      channelEndX, channelY + 5,
      channelEndX - 10, channelY - 2,
      channelEndX - 10, channelY + 12
    );

    // Animated packets
    const numPackets = 3;
    for (let i = 0; i < numPackets; i++) {
      const offset = i * 0.33;
      const progress = ((time * 0.4 + offset) % 1);
      const px = p.lerp(channelStartX, channelEndX, progress);
      const py = channelY + 5;

      p.fill(100, 200, 100, 200);
      p.noStroke();
      p.rect(px - 12, py - 8, 24, 16, 4);
      p.fill(2, 7, 19);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("PKT", px, py);
    }

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Canal ideal: todos os pacotes chegam corretamente — sem necessidade de mecanismos extras", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 2: rdt2.0 — Channel with bit errors, ACK/NAK mechanism
export function RDT20AckNak() {
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
    p.text("rdt2.0 — ACK e NAK (Detecção de Erros)", w / 2, 10);

    // Sender box
    const senderX = 25;
    const senderY = 45;
    const hostW = 100;
    const hostH = 130;

    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 80);
    p.strokeWeight(2);
    p.rect(senderX, senderY, hostW, hostH, 8);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Emissor", senderX + hostW / 2, senderY + 8);

    // Receiver box
    const receiverX = w - hostW - 25;

    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 80);
    p.strokeWeight(2);
    p.rect(receiverX, senderY, hostW, hostH, 8);
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Receptor", receiverX + hostW / 2, senderY + 8);

    // Sender states
    const cycle = time % 4;
    const senderState = cycle < 1 ? "Enviar PKT" : cycle < 2 ? "Aguardar ACK/NAK" : cycle < 3 ? "Retransmitir" : "Aguardar ACK/NAK";

    // State display on sender
    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 40);
    p.strokeWeight(1);
    p.rect(senderX + 8, senderY + 30, hostW - 16, 40, 6);
    p.noStroke();
    p.fill(0, 150, 255, 180);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(senderState, senderX + hostW / 2, senderY + 50);

    // Receiver state
    const recvState = cycle < 1 ? "Aguardar PKT" : cycle < 2 ? "Verificar checksum" : cycle < 3 ? "Erro! Enviar NAK" : "OK! Enviar ACK";
    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 40);
    p.strokeWeight(1);
    p.rect(receiverX + 8, senderY + 30, hostW - 16, 40, 6);
    p.noStroke();
    const recvColor = cycle >= 3 ? [100, 200, 100] : cycle >= 2 ? [255, 100, 100] : [255, 180, 50];
    p.fill(recvColor[0], recvColor[1], recvColor[2], 180);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(recvState, receiverX + hostW / 2, senderY + 50);

    // Checksum indicator on receiver
    if (cycle >= 1 && cycle < 2) {
      p.fill(255, 180, 50, 100 + 100 * Math.abs(p.sin(time * 8)));
      p.textSize(7);
      p.text("Calculando checksum...", receiverX + hostW / 2, senderY + 85);
    }

    // Channel area
    const midY_top = senderY + hostH + 18;
    const midY_bottom = midY_top + 60;
    const startX = senderX + hostW / 2;
    const endX = receiverX + hostW / 2;
    const midX = w / 2;

    // Forward channel
    p.fill(80);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Dados →", midX, midY_top - 8);

    p.stroke(100, 100, 140, 60);
    p.strokeWeight(1);
    p.line(startX, midY_top, endX, midY_top);

    // Backward channel
    p.fill(80);
    p.textSize(8);
    p.text("← ACK / NAK", midX, midY_bottom - 8);

    p.stroke(100, 100, 140, 60);
    p.line(endX, midY_bottom, startX, midY_bottom);

    // Animated packets - forward
    if (cycle < 1 || (cycle >= 2 && cycle < 3)) {
      const progress = cycle < 1 ? cycle : (cycle - 2);
      const px = p.lerp(startX, endX, progress);
      const isCorrupt = cycle >= 2;
      const pktColor = isCorrupt ? [255, 100, 100] : [0, 150, 255];
      p.fill(pktColor[0], pktColor[1], pktColor[2], 200);
      p.noStroke();
      p.rect(px - 18, midY_top - 10, 36, 18, 4);
      p.fill(255);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(isCorrupt ? "PKT ✗" : "PKT ✓", px, midY_top - 1);
    }

    // Animated ACK/NAK - backward
    if (cycle >= 1 && cycle < 2) {
      // NAK going back
      const progress = cycle - 1;
      const px = p.lerp(endX, startX, progress);
      p.fill(255, 100, 100, 200);
      p.noStroke();
      p.rect(px - 15, midY_bottom - 10, 30, 18, 4);
      p.fill(255);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("NAK", px, midY_bottom - 1);
    } else if (cycle >= 3) {
      // ACK going back
      const progress = cycle - 3;
      const px = p.lerp(endX, startX, progress);
      p.fill(100, 200, 100, 200);
      p.noStroke();
      p.rect(px - 15, midY_bottom - 10, 30, 18, 4);
      p.fill(255);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("ACK", px, midY_bottom - 1);
    }

    // Error markers on channel
    if (cycle >= 0.4 && cycle < 1) {
      // Show corruption on packet
      const errX = p.lerp(startX, endX, 0.5);
      p.fill(255, 100, 100, 150 + 100 * p.sin(time * 10));
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("⚡", errX, midY_top - 25);
      p.textSize(7);
      p.fill(255, 100, 100, 200);
      p.text("Erro de bit!", errX, midY_top - 38);
    }

    // Legend at bottom
    const legendY = h - 50;
    p.noStroke();
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);

    p.fill(100, 200, 100);
    p.rect(30, legendY, 8, 8, 2);
    p.fill(100);
    p.text("ACK — pacote recebido corretamente", 44, legendY);

    p.fill(255, 100, 100);
    p.rect(30, legendY + 14, 8, 8, 2);
    p.fill(100);
    p.text("NAK — erro detectado, retransmitir", 44, legendY + 14);

    // Footer
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Receptor usa checksum para detectar erros e responde com ACK ou NAK", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

// Visualization 3: rdt2.1 — Sequence numbers (0/1) to handle duplicates from corrupted ACK/NAK
export function RDT21SequenceNumbers() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.01;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("rdt2.1 — Números de Sequência (0 / 1)", w / 2, 10);

    // Timeline approach - show sequence of events
    const timelineY = 45;
    const senderLineX = 80;
    const receiverLineX = w - 80;
    const timelineH = 230;

    // Sender timeline
    p.stroke(0, 150, 255, 60);
    p.strokeWeight(2);
    p.line(senderLineX, timelineY, senderLineX, timelineY + timelineH);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Emissor", senderLineX, timelineY - 4);

    // Receiver timeline
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(2);
    p.line(receiverLineX, timelineY, receiverLineX, timelineY + timelineH);
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Receptor", receiverLineX, timelineY - 4);

    // Events sequence
    const events = [
      { y: 0, type: "pkt", label: "PKT(seq=0, data)", color: [0, 150, 255] },
      { y: 40, type: "ack", label: "ACK(0) ✗ corrompido!", color: [255, 100, 100] },
      { y: 80, type: "pkt", label: "PKT(seq=0, data) [retransmissão]", color: [180, 130, 255] },
      { y: 120, type: "ack", label: "ACK(0) ✓", color: [100, 200, 100] },
      { y: 160, type: "pkt", label: "PKT(seq=1, data)", color: [0, 150, 255] },
      { y: 200, type: "ack", label: "ACK(1) ✓", color: [100, 200, 100] },
    ];

    const animProgress = (time * 0.6) % (events.length + 1);

    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      const eventY = timelineY + 20 + e.y;

      if (animProgress < i) continue;

      const arrowProgress = Math.min(1, animProgress - i);

      const fromX = e.type === "pkt" ? senderLineX : receiverLineX;
      const toX = e.type === "pkt" ? receiverLineX : senderLineX;
      const currentX = p.lerp(fromX, toX, arrowProgress);

      // Arrow line
      p.stroke(e.color[0], e.color[1], e.color[2], 120);
      p.strokeWeight(1.5);
      p.line(fromX, eventY, currentX, eventY);

      if (arrowProgress >= 1) {
        // Arrowhead
        const dir = toX > fromX ? 1 : -1;
        p.fill(e.color[0], e.color[1], e.color[2], 150);
        p.noStroke();
        p.triangle(
          toX, eventY,
          toX - dir * 8, eventY - 4,
          toX - dir * 8, eventY + 4
        );
      }

      // Label
      p.noStroke();
      p.fill(e.color[0], e.color[1], e.color[2], 200);
      p.textSize(8);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(e.label, (fromX + toX) / 2, eventY - 4);

      // Corruption marker
      if (i === 1 && arrowProgress > 0.3 && arrowProgress < 0.8) {
        const errX = (fromX + toX) / 2;
        p.fill(255, 100, 100, 200);
        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("⚡", errX, eventY + 14);
      }

      // Receiver detects duplicate
      if (i === 2 && arrowProgress >= 1) {
        p.fill(180, 130, 255, 160);
        p.textSize(7);
        p.textAlign(p.LEFT, p.CENTER);
        p.text("seq=0 duplicado → descarta dados", receiverLineX + 8, eventY + 2);
        p.text("mas envia ACK(0)", receiverLineX + 8, eventY + 14);
      }
    }

    // Sequence number boxes on the side
    const seqBoxX = 10;
    const seqBoxY = timelineY + 10;
    p.fill(15, 20, 35);
    p.stroke(180, 130, 255, 60);
    p.strokeWeight(1);
    p.rect(seqBoxX, seqBoxY, 50, 55, 6);
    p.noStroke();
    p.fill(180, 130, 255);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Seq #", seqBoxX + 25, seqBoxY + 4);

    const currentSeq = animProgress < 4 ? 0 : 1;
    p.fill(180, 130, 255, 220);
    p.textSize(24);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(String(currentSeq), seqBoxX + 25, seqBoxY + 36);

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Números de sequência (0/1) permitem detectar e descartar duplicatas", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 4: rdt2.2 — NAK-free protocol using duplicate ACKs
export function RDT22DuplicateAcks() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.01;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("rdt2.2 — Protocolo sem NAK (ACKs Duplicados)", w / 2, 10);

    // Comparison: rdt2.1 vs rdt2.2
    const halfW = w / 2 - 15;

    // Left side: rdt2.1 with NAK
    const leftX = 10;
    p.fill(15, 20, 35);
    p.stroke(255, 100, 100, 40);
    p.strokeWeight(1);
    p.rect(leftX, 38, halfW, 230, 8);
    p.noStroke();
    p.fill(255, 100, 100, 180);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("rdt2.1 — Com NAK", leftX + halfW / 2, 44);

    // rdt2.1 events
    const events21 = [
      { label: "PKT(seq=0)", fromLeft: true, color: [0, 150, 255] },
      { label: "NAK", fromLeft: false, color: [255, 100, 100] },
      { label: "PKT(seq=0) [retransmissão]", fromLeft: true, color: [180, 130, 255] },
      { label: "ACK", fromLeft: false, color: [100, 200, 100] },
    ];

    const sL = leftX + 30;
    const rL = leftX + halfW - 30;
    const baseY = 72;

    // Sender/Receiver labels
    p.fill(0, 150, 255, 150);
    p.textSize(7);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("E", sL, baseY - 2);
    p.fill(255, 180, 50, 150);
    p.text("R", rL, baseY - 2);

    // Timeline lines
    p.stroke(0, 150, 255, 30);
    p.strokeWeight(1);
    p.line(sL, baseY, sL, baseY + 180);
    p.stroke(255, 180, 50, 30);
    p.line(rL, baseY, rL, baseY + 180);

    const anim21 = (time * 0.5) % 5;
    for (let i = 0; i < events21.length; i++) {
      const e = events21[i];
      const evY = baseY + 15 + i * 42;
      if (anim21 < i) break;

      const progress = Math.min(1, anim21 - i);
      const fromX = e.fromLeft ? sL : rL;
      const toX = e.fromLeft ? rL : sL;
      const curX = p.lerp(fromX, toX, progress);

      p.stroke(e.color[0], e.color[1], e.color[2], 100);
      p.strokeWeight(1.5);
      p.line(fromX, evY, curX, evY);

      if (progress >= 1) {
        const dir = toX > fromX ? 1 : -1;
        p.fill(e.color[0], e.color[1], e.color[2], 150);
        p.noStroke();
        p.triangle(toX, evY, toX - dir * 6, evY - 3, toX - dir * 6, evY + 3);
      }

      p.noStroke();
      p.fill(e.color[0], e.color[1], e.color[2], 180);
      p.textSize(7);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(e.label, (sL + rL) / 2, evY - 3);
    }

    // Right side: rdt2.2 without NAK
    const rightX = w / 2 + 5;
    p.fill(15, 20, 35);
    p.stroke(100, 200, 100, 40);
    p.strokeWeight(1);
    p.rect(rightX, 38, halfW, 230, 8);
    p.noStroke();
    p.fill(100, 200, 100, 180);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("rdt2.2 — Sem NAK", rightX + halfW / 2, 44);

    // rdt2.2 events
    const events22 = [
      { label: "PKT(seq=1)", fromLeft: true, color: [0, 150, 255] },
      { label: "ACK(0) [duplicado]", fromLeft: false, color: [255, 180, 50] },
      { label: "PKT(seq=1) [retransmissão]", fromLeft: true, color: [180, 130, 255] },
      { label: "ACK(1) ✓", fromLeft: false, color: [100, 200, 100] },
    ];

    const sR = rightX + 30;
    const rR = rightX + halfW - 30;

    p.fill(0, 150, 255, 150);
    p.textSize(7);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("E", sR, baseY - 2);
    p.fill(255, 180, 50, 150);
    p.text("R", rR, baseY - 2);

    p.stroke(0, 150, 255, 30);
    p.strokeWeight(1);
    p.line(sR, baseY, sR, baseY + 180);
    p.stroke(255, 180, 50, 30);
    p.line(rR, baseY, rR, baseY + 180);

    const anim22 = (time * 0.5) % 5;
    for (let i = 0; i < events22.length; i++) {
      const e = events22[i];
      const evY = baseY + 15 + i * 42;
      if (anim22 < i) break;

      const progress = Math.min(1, anim22 - i);
      const fromX = e.fromLeft ? sR : rR;
      const toX = e.fromLeft ? rR : sR;
      const curX = p.lerp(fromX, toX, progress);

      p.stroke(e.color[0], e.color[1], e.color[2], 100);
      p.strokeWeight(1.5);
      p.line(fromX, evY, curX, evY);

      if (progress >= 1) {
        const dir = toX > fromX ? 1 : -1;
        p.fill(e.color[0], e.color[1], e.color[2], 150);
        p.noStroke();
        p.triangle(toX, evY, toX - dir * 6, evY - 3, toX - dir * 6, evY + 3);
      }

      p.noStroke();
      p.fill(e.color[0], e.color[1], e.color[2], 180);
      p.textSize(7);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(e.label, (sR + rR) / 2, evY - 3);
    }

    // Highlight box
    const hlY = 278;
    p.fill(15, 20, 35);
    p.stroke(100, 200, 100, 40);
    p.strokeWeight(1);
    p.rect(rightX + 10, hlY, halfW - 20, 28, 4);
    p.noStroke();
    p.fill(100, 200, 100, 180);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("ACK duplicado = mesmo efeito do NAK", rightX + halfW / 2, hlY + 14);

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("rdt2.2 elimina o NAK: receptor envia ACK do último pacote recebido corretamente", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 5: rdt3.0 — Channel with losses, timers, and retransmission scenarios
export function RDT30TimerRetransmission() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.008;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("rdt3.0 — Temporizador e Retransmissão", w / 2, 10);

    // Four scenarios side by side
    const scenarios = [
      { title: "Sem perda", type: "normal" },
      { title: "Perda de PKT", type: "pkt-loss" },
      { title: "Perda de ACK", type: "ack-loss" },
      { title: "Timeout prematuro", type: "premature" },
    ];

    const scenW = (w - 20) / 4;
    const scBaseY = 48;
    const scH = 280;

    const anim = (time * 0.4) % 4;

    for (let s = 0; s < scenarios.length; s++) {
      const sc = scenarios[s];
      const scX = 10 + s * scenW;
      const sX = scX + 18;
      const rX = scX + scenW - 18;
      const midScX = scX + scenW / 2;

      // Scenario box
      p.fill(15, 20, 35);
      p.stroke(60, 60, 80, 40);
      p.strokeWeight(1);
      p.rect(scX, scBaseY - 5, scenW - 5, scH, 6);

      // Scenario title
      p.noStroke();
      p.fill(200);
      p.textSize(8);
      p.textAlign(p.CENTER, p.TOP);
      p.text(sc.title, midScX - 2, scBaseY);

      // Sender/Receiver labels
      p.fill(0, 150, 255, 120);
      p.textSize(6);
      p.text("E", sX, scBaseY + 14);
      p.fill(255, 180, 50, 120);
      p.text("R", rX, scBaseY + 14);

      // Timeline lines
      p.stroke(0, 150, 255, 25);
      p.strokeWeight(1);
      p.line(sX, scBaseY + 24, sX, scBaseY + scH - 30);
      p.stroke(255, 180, 50, 25);
      p.line(rX, scBaseY + 24, rX, scBaseY + scH - 30);

      // Draw events based on scenario type
      const evStart = scBaseY + 34;
      const evStep = 40;

      if (sc.type === "normal") {
        // PKT →
        drawArrow(p, sX, rX, evStart, [0, 150, 255], "PKT(0)", anim, 0);
        // ACK ←
        drawArrow(p, rX, sX, evStart + evStep, [100, 200, 100], "ACK(0)", anim, 1);
        // PKT →
        drawArrow(p, sX, rX, evStart + evStep * 2, [0, 150, 255], "PKT(1)", anim, 2);
        // ACK ←
        drawArrow(p, rX, sX, evStart + evStep * 3, [100, 200, 100], "ACK(1)", anim, 3);
        // Check mark
        if (anim > 3.5) {
          p.fill(100, 200, 100, 180);
          p.textSize(10);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("✓", midScX - 2, evStart + evStep * 4 + 10);
        }
      } else if (sc.type === "pkt-loss") {
        // PKT → (lost)
        drawArrowLost(p, sX, rX, evStart, [0, 150, 255], "PKT(0)", anim, 0);
        // Timer icon
        if (anim > 0.8 && anim < 2) {
          drawTimer(p, sX - 2, evStart + evStep, anim - 0.8, 1.2);
        }
        // Retransmit PKT →
        drawArrow(p, sX, rX, evStart + evStep * 2, [180, 130, 255], "PKT(0)", anim, 2);
        // ACK ←
        drawArrow(p, rX, sX, evStart + evStep * 3, [100, 200, 100], "ACK(0)", anim, 3);
      } else if (sc.type === "ack-loss") {
        // PKT →
        drawArrow(p, sX, rX, evStart, [0, 150, 255], "PKT(0)", anim, 0);
        // ACK ← (lost)
        drawArrowLost(p, rX, sX, evStart + evStep, [100, 200, 100], "ACK(0)", anim, 1);
        // Timer
        if (anim > 1.8 && anim < 3) {
          drawTimer(p, sX - 2, evStart + evStep * 1.5, anim - 1.8, 1.2);
        }
        // Retransmit PKT →
        drawArrow(p, sX, rX, evStart + evStep * 2.5, [180, 130, 255], "PKT(0)", anim, 2.5);
        // ACK ←
        drawArrow(p, rX, sX, evStart + evStep * 3.5, [100, 200, 100], "ACK(0)", anim, 3.2);
      } else if (sc.type === "premature") {
        // PKT →
        drawArrow(p, sX, rX, evStart, [0, 150, 255], "PKT(0)", anim, 0);
        // Timer (short)
        if (anim > 0.5 && anim < 1.5) {
          drawTimer(p, sX - 2, evStart + evStep * 0.6, anim - 0.5, 1);
        }
        // Retransmit PKT → (premature)
        drawArrow(p, sX, rX, evStart + evStep * 1.5, [180, 130, 255], "PKT(0)", anim, 1.5);
        // Late ACK ← (arrives late)
        drawArrow(p, rX, sX, evStart + evStep * 2, [100, 200, 100], "ACK(0)", anim, 1.8);
        // Receiver handles duplicate
        if (anim > 2.5) {
          p.fill(180, 130, 255, 120);
          p.textSize(5);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("duplicata", rX + 2, evStart + evStep * 2.5);
          p.text("descartada", rX + 2, evStart + evStep * 2.5 + 10);
        }
        // Duplicate ACK ←
        drawArrow(p, rX, sX, evStart + evStep * 3, [255, 180, 50], "ACK(0)", anim, 2.8);
      }
    }

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("rdt3.0: temporizador garante retransmissão em caso de perda de pacote ou ACK", w / 2, h - 6);
  };

  // Helper: draw animated arrow between two x positions at a given y
  function drawArrow(p: p5, fromX: number, toX: number, y: number, color: number[], label: string, anim: number, threshold: number) {
    if (anim < threshold) return;
    const progress = Math.min(1, (anim - threshold) * 1.5);
    const curX = p.lerp(fromX, toX, progress);

    p.stroke(color[0], color[1], color[2], 80);
    p.strokeWeight(1);
    p.line(fromX, y, curX, y);

    if (progress >= 1) {
      const dir = toX > fromX ? 1 : -1;
      p.fill(color[0], color[1], color[2], 150);
      p.noStroke();
      p.triangle(toX, y, toX - dir * 5, y - 3, toX - dir * 5, y + 3);
    }

    p.noStroke();
    p.fill(color[0], color[1], color[2], 160);
    p.textSize(5);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(label, (fromX + toX) / 2, y - 2);
  }

  // Helper: draw arrow that gets lost midway (X mark)
  function drawArrowLost(p: p5, fromX: number, toX: number, y: number, color: number[], label: string, anim: number, threshold: number) {
    if (anim < threshold) return;
    const progress = Math.min(1, (anim - threshold) * 1.5);
    const midX = (fromX + toX) / 2;
    const curX = p.lerp(fromX, midX, Math.min(1, progress * 2));

    p.stroke(color[0], color[1], color[2], 80);
    p.strokeWeight(1);
    p.line(fromX, y, curX, y);

    if (progress > 0.5) {
      // X mark for loss
      const lossX = midX;
      p.stroke(255, 100, 100, 200);
      p.strokeWeight(2);
      p.line(lossX - 4, y - 4, lossX + 4, y + 4);
      p.line(lossX + 4, y - 4, lossX - 4, y + 4);
    }

    p.noStroke();
    p.fill(color[0], color[1], color[2], 160);
    p.textSize(5);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(label, (fromX + midX) / 2, y - 2);
  }

  // Helper: draw timer indicator
  function drawTimer(p: p5, x: number, y: number, elapsed: number, total: number) {
    const progress = Math.min(1, elapsed / total);
    p.noStroke();
    p.fill(255, 100, 100, 120 + 80 * Math.abs(p.sin(elapsed * 10)));
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("⏱", x, y);

    // Timer bar
    p.fill(255, 100, 100, 40);
    p.rect(x - 6, y + 8, 12, 3, 1);
    p.fill(255, 100, 100, 180);
    p.rect(x - 6, y + 8, 12 * progress, 3, 1);
  }

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 6: Stop-and-Wait utilization — shows poor link utilization
export function StopAndWaitUtilization() {
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
    p.text("Stop-and-Wait — Problema de Utilização", w / 2, 10);

    // Timeline
    const timelineY = 50;
    const senderX = 80;
    const receiverX = w - 80;
    const timelineH = 200;

    // Sender line
    p.stroke(0, 150, 255, 60);
    p.strokeWeight(2);
    p.line(senderX, timelineY, senderX, timelineY + timelineH);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Emissor", senderX, timelineY - 4);

    // Receiver line
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(2);
    p.line(receiverX, timelineY, receiverX, timelineY + timelineH);
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Receptor", receiverX, timelineY - 4);

    const cycleLen = 5;
    const anim = (time * 0.5) % cycleLen;

    // Transmission time (small bar on sender)
    const txHeight = 12;
    const txStartY = timelineY + 10;

    // Show L/R (transmission time) — very small
    p.fill(0, 150, 255, 100);
    p.noStroke();
    p.rect(senderX - 20, txStartY, 20, txHeight, 2);
    p.fill(0, 150, 255, 200);
    p.textSize(6);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("L/R", senderX - 24, txStartY + txHeight / 2);

    // Packet traveling to receiver
    const pktTravelY1 = txStartY + txHeight;
    const pktTravelY2 = txStartY + txHeight + 70;

    if (anim > 0) {
      const pktProgress = Math.min(1, anim / 1.5);
      const pktX = p.lerp(senderX, receiverX, pktProgress);
      const pktY = p.lerp(pktTravelY1, pktTravelY2, pktProgress);

      p.stroke(0, 150, 255, 60);
      p.strokeWeight(1);
      p.line(senderX, pktTravelY1, pktX, pktY);

      if (pktProgress < 1) {
        p.fill(0, 150, 255, 200);
        p.noStroke();
        p.rect(pktX - 10, pktY - 6, 20, 12, 3);
        p.fill(255);
        p.textSize(5);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("PKT", pktX, pktY);
      }
    }

    // ACK traveling back
    const ackTravelY1 = pktTravelY2 + 5;
    const ackTravelY2 = pktTravelY2 + 75;

    if (anim > 1.5) {
      const ackProgress = Math.min(1, (anim - 1.5) / 1.5);
      const ackX = p.lerp(receiverX, senderX, ackProgress);
      const ackY = p.lerp(ackTravelY1, ackTravelY2, ackProgress);

      p.stroke(100, 200, 100, 60);
      p.strokeWeight(1);
      p.line(receiverX, ackTravelY1, ackX, ackY);

      if (ackProgress < 1) {
        p.fill(100, 200, 100, 200);
        p.noStroke();
        p.rect(ackX - 10, ackY - 6, 20, 12, 3);
        p.fill(255);
        p.textSize(5);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("ACK", ackX, ackY);
      }
    }

    // RTT annotation
    const rttY1 = txStartY;
    const rttY2 = ackTravelY2;
    p.stroke(255, 180, 50, 40);
    p.strokeWeight(1);
    p.line(senderX - 40, rttY1, senderX - 40, rttY2);
    // Small horizontal ticks
    p.line(senderX - 44, rttY1, senderX - 36, rttY1);
    p.line(senderX - 44, rttY2, senderX - 36, rttY2);
    p.noStroke();
    p.fill(255, 180, 50, 160);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.push();
    p.translate(senderX - 52, (rttY1 + rttY2) / 2);
    p.rotate(-p.HALF_PI);
    p.text("RTT + L/R", 0, 0);
    p.pop();

    // Idle time annotation
    const idleY1 = txStartY + txHeight;
    p.fill(255, 100, 100, 30);
    p.noStroke();
    p.rect(senderX - 20, idleY1, 20, rttY2 - idleY1, 2);
    p.fill(255, 100, 100, 120);
    p.textSize(6);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("Ocioso", senderX - 24, (idleY1 + rttY2) / 2);

    // Utilization bar and formula (right side)
    const formulaY = timelineY + timelineH + 20;

    p.noStroke();
    p.fill(200);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Utilização do Emissor", w / 2, formulaY);

    // Formula
    p.fill(180);
    p.textSize(9);
    p.text("U = L/R ÷ (RTT + L/R)", w / 2, formulaY + 18);

    // Example values
    p.fill(100);
    p.textSize(8);
    p.text("Exemplo: L=8000 bits, R=1 Gbps, RTT=30ms", w / 2, formulaY + 36);

    // Calculate and show
    const LoverR = 0.008; // ms
    const RTT = 30; // ms
    const utilization = LoverR / (RTT + LoverR);

    // Utilization bar
    const barX = w / 2 - 100;
    const barY = formulaY + 52;
    const barW = 200;
    const barH = 16;

    p.fill(30, 40, 60);
    p.rect(barX, barY, barW, barH, 4);

    const animUtil = Math.min(utilization, (time * 0.01) % (utilization + 0.1));
    p.fill(255, 100, 100);
    p.rect(barX, barY, Math.max(2, barW * animUtil), barH, 4);

    // Percentage
    p.fill(255);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`U ≈ ${(utilization * 100).toFixed(4)}%`, w / 2, barY + barH / 2);

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("O emissor fica ocioso quase todo o tempo esperando pelo ACK", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 7: Pipeline — Go-Back-N vs Selective Repeat side by side
export function PipelineGBNvsSR() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.01;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Pipeline — Go-Back-N vs Repetição Seletiva", w / 2, 10);

    const halfW = w / 2 - 10;

    // === LEFT SIDE: Go-Back-N ===
    const gbnX = 5;
    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 40);
    p.strokeWeight(1);
    p.rect(gbnX, 34, halfW, 320, 8);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Go-Back-N (N=4)", gbnX + halfW / 2, 40);

    // Packet window for GBN
    const pktW = 26;
    const pktH = 20;
    const windowY = 60;
    const numPkts = 8;
    const gbnPktStartX = gbnX + (halfW - numPkts * (pktW + 2)) / 2;

    // Window bracket
    const winSize = 4;

    const gbnAnim = (time * 0.3) % 5;

    // GBN packet states: 0=not sent, 1=sent, 2=acked, 3=lost
    const gbnStates: number[] = [2, 2, 3, 1, 1, 0, 0, 0];
    // After retransmission: all from lost packet onwards are resent
    const gbnRetransmit = gbnAnim > 2.5;
    if (gbnRetransmit) {
      gbnStates[2] = 1; // resending
      gbnStates[3] = 1;
      gbnStates[4] = 1;
    }
    if (gbnAnim > 4) {
      gbnStates[2] = 2;
      gbnStates[3] = 2;
      gbnStates[4] = 2;
    }

    for (let i = 0; i < numPkts; i++) {
      const px = gbnPktStartX + i * (pktW + 2);
      let fillColor: number[];
      let label: string;

      const state = gbnStates[i];
      if (state === 2) {
        fillColor = [100, 200, 100]; // acked
        label = "✓";
      } else if (state === 3) {
        fillColor = [255, 100, 100]; // lost
        label = "✗";
      } else if (state === 1) {
        fillColor = [0, 150, 255]; // sent
        label = "";
      } else {
        fillColor = [60, 60, 80]; // not sent
        label = "";
      }

      p.fill(fillColor[0], fillColor[1], fillColor[2], state === 0 ? 40 : 80);
      p.stroke(fillColor[0], fillColor[1], fillColor[2], state === 0 ? 30 : 120);
      p.strokeWeight(1);
      p.rect(px, windowY, pktW, pktH, 3);
      p.noStroke();
      p.fill(255, 200);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`${i}`, px + pktW / 2, windowY + pktH / 2 - (label ? 3 : 0));
      if (label) {
        p.textSize(7);
        p.text(label, px + pktW / 2, windowY + pktH / 2 + 5);
      }
    }

    // Window bracket
    const winBracketX = gbnPktStartX + (gbnRetransmit ? 2 : gbnAnim > 4 ? 5 : 2) * (pktW + 2);
    p.stroke(255, 180, 50, 120);
    p.strokeWeight(2);
    p.noFill();
    p.rect(winBracketX - 2, windowY - 3, winSize * (pktW + 2), pktH + 6, 4);
    p.noStroke();
    p.fill(255, 180, 50, 150);
    p.textSize(7);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Janela (N=4)", winBracketX + winSize * (pktW + 2) / 2, windowY - 5);

    // GBN Timeline
    const gbnTimeY = windowY + pktH + 20;
    const sX = gbnX + 25;
    const rX = gbnX + halfW - 25;

    p.fill(0, 150, 255, 100);
    p.textSize(6);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("E", sX, gbnTimeY);
    p.fill(255, 180, 50, 100);
    p.text("R", rX, gbnTimeY);

    p.stroke(0, 150, 255, 20);
    p.strokeWeight(1);
    p.line(sX, gbnTimeY + 2, sX, gbnTimeY + 210);
    p.stroke(255, 180, 50, 20);
    p.line(rX, gbnTimeY + 2, rX, gbnTimeY + 210);

    // GBN events
    const gbnEvents = [
      { label: "PKT 0", dir: 1, color: [0, 150, 255], y: 10 },
      { label: "PKT 1", dir: 1, color: [0, 150, 255], y: 22 },
      { label: "PKT 2", dir: 1, color: [255, 100, 100], y: 34, lost: true },
      { label: "PKT 3", dir: 1, color: [0, 150, 255], y: 46 },
      { label: "ACK 0", dir: -1, color: [100, 200, 100], y: 55 },
      { label: "ACK 1", dir: -1, color: [100, 200, 100], y: 67 },
      { label: "descarta 3", dir: 0, color: [255, 100, 100], y: 88 },
      { label: "timeout → retransmite 2,3,4", dir: 0, color: [180, 130, 255], y: 110 },
      { label: "PKT 2", dir: 1, color: [180, 130, 255], y: 125 },
      { label: "PKT 3", dir: 1, color: [180, 130, 255], y: 137 },
      { label: "PKT 4", dir: 1, color: [180, 130, 255], y: 149 },
    ];

    for (let i = 0; i < gbnEvents.length; i++) {
      const e = gbnEvents[i];
      const evY = gbnTimeY + e.y;
      const eventThreshold = i * 0.4;
      if (gbnAnim < eventThreshold) break;

      const progress = Math.min(1, (gbnAnim - eventThreshold) * 2);

      if (e.dir === 0) {
        // Annotation text
        p.noStroke();
        p.fill(e.color[0], e.color[1], e.color[2], 150 * progress);
        p.textSize(6);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(e.label, (sX + rX) / 2, evY);
      } else {
        const fromX = e.dir === 1 ? sX : rX;
        const toX = e.dir === 1 ? rX : sX;
        const curX = p.lerp(fromX, toX, e.lost ? Math.min(0.5, progress) : progress);

        p.stroke(e.color[0], e.color[1], e.color[2], 70);
        p.strokeWeight(1);
        p.line(fromX, evY, curX, evY);

        if (e.lost && progress > 0.5) {
          p.stroke(255, 100, 100, 200);
          p.strokeWeight(1.5);
          const lx = (fromX + toX) / 2;
          p.line(lx - 3, evY - 3, lx + 3, evY + 3);
          p.line(lx + 3, evY - 3, lx - 3, evY + 3);
        }

        if (!e.lost && progress >= 1) {
          const dir = toX > fromX ? 1 : -1;
          p.fill(e.color[0], e.color[1], e.color[2], 150);
          p.noStroke();
          p.triangle(toX, evY, toX - dir * 5, evY - 2, toX - dir * 5, evY + 2);
        }

        p.noStroke();
        p.fill(e.color[0], e.color[1], e.color[2], 130);
        p.textSize(5);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text(e.label, (fromX + toX) / 2, evY - 2);
      }
    }

    // GBN highlight
    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 30);
    p.strokeWeight(1);
    p.rect(gbnX + 8, 330, halfW - 16, 18, 4);
    p.noStroke();
    p.fill(0, 150, 255, 160);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Retransmite TODOS a partir do perdido", gbnX + halfW / 2, 339);

    // === RIGHT SIDE: Selective Repeat ===
    const srX = w / 2 + 5;
    p.fill(15, 20, 35);
    p.stroke(100, 200, 100, 40);
    p.strokeWeight(1);
    p.rect(srX, 34, halfW, 320, 8);
    p.noStroke();
    p.fill(100, 200, 100);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Repetição Seletiva (N=4)", srX + halfW / 2, 40);

    // SR packet window
    const srPktStartX = srX + (halfW - numPkts * (pktW + 2)) / 2;

    const srAnim = (time * 0.3) % 5;

    const srStates: number[] = [2, 2, 3, 1, 1, 0, 0, 0];
    // SR only retransmits lost packet
    if (srAnim > 2.5) {
      srStates[2] = 1; // resending only pkt 2
      srStates[3] = 2; // pkt 3 was buffered and now acked
      srStates[4] = 2;
    }
    if (srAnim > 4) {
      srStates[2] = 2;
    }

    for (let i = 0; i < numPkts; i++) {
      const px = srPktStartX + i * (pktW + 2);
      let fillColor: number[];
      let label: string;

      const state = srStates[i];
      if (state === 2) {
        fillColor = [100, 200, 100];
        label = "✓";
      } else if (state === 3) {
        fillColor = [255, 100, 100];
        label = "✗";
      } else if (state === 1) {
        fillColor = [0, 150, 255];
        label = "";
      } else {
        fillColor = [60, 60, 80];
        label = "";
      }

      p.fill(fillColor[0], fillColor[1], fillColor[2], state === 0 ? 40 : 80);
      p.stroke(fillColor[0], fillColor[1], fillColor[2], state === 0 ? 30 : 120);
      p.strokeWeight(1);
      p.rect(px, windowY, pktW, pktH, 3);
      p.noStroke();
      p.fill(255, 200);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`${i}`, px + pktW / 2, windowY + pktH / 2 - (label ? 3 : 0));
      if (label) {
        p.textSize(7);
        p.text(label, px + pktW / 2, windowY + pktH / 2 + 5);
      }
    }

    // SR Window bracket
    const srWinX = srPktStartX + (srAnim > 4 ? 5 : 2) * (pktW + 2);
    p.stroke(255, 180, 50, 120);
    p.strokeWeight(2);
    p.noFill();
    p.rect(srWinX - 2, windowY - 3, winSize * (pktW + 2), pktH + 6, 4);
    p.noStroke();
    p.fill(255, 180, 50, 150);
    p.textSize(7);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Janela (N=4)", srWinX + winSize * (pktW + 2) / 2, windowY - 5);

    // SR Timeline
    const srTimeY = windowY + pktH + 20;
    const srSX = srX + 25;
    const srRX = srX + halfW - 25;

    p.fill(0, 150, 255, 100);
    p.textSize(6);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("E", srSX, srTimeY);
    p.fill(255, 180, 50, 100);
    p.text("R", srRX, srTimeY);

    p.stroke(0, 150, 255, 20);
    p.strokeWeight(1);
    p.line(srSX, srTimeY + 2, srSX, srTimeY + 210);
    p.stroke(255, 180, 50, 20);
    p.line(srRX, srTimeY + 2, srRX, srTimeY + 210);

    // SR events
    const srEvents = [
      { label: "PKT 0", dir: 1, color: [0, 150, 255], y: 10 },
      { label: "PKT 1", dir: 1, color: [0, 150, 255], y: 22 },
      { label: "PKT 2", dir: 1, color: [255, 100, 100], y: 34, lost: true },
      { label: "PKT 3", dir: 1, color: [0, 150, 255], y: 46 },
      { label: "ACK 0", dir: -1, color: [100, 200, 100], y: 55 },
      { label: "ACK 1", dir: -1, color: [100, 200, 100], y: 67 },
      { label: "buffer 3", dir: 0, color: [100, 180, 255], y: 82 },
      { label: "ACK 3", dir: -1, color: [100, 180, 255], y: 92 },
      { label: "timeout → retransmite SÓ 2", dir: 0, color: [180, 130, 255], y: 115 },
      { label: "PKT 2", dir: 1, color: [180, 130, 255], y: 130 },
      { label: "ACK 2", dir: -1, color: [100, 200, 100], y: 155 },
    ];

    for (let i = 0; i < srEvents.length; i++) {
      const e = srEvents[i];
      const evY = srTimeY + e.y;
      const eventThreshold = i * 0.4;
      if (srAnim < eventThreshold) break;

      const progress = Math.min(1, (srAnim - eventThreshold) * 2);

      if (e.dir === 0) {
        p.noStroke();
        p.fill(e.color[0], e.color[1], e.color[2], 150 * progress);
        p.textSize(6);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(e.label, (srSX + srRX) / 2, evY);
      } else {
        const fromX = e.dir === 1 ? srSX : srRX;
        const toX = e.dir === 1 ? srRX : srSX;
        const curX = p.lerp(fromX, toX, e.lost ? Math.min(0.5, progress) : progress);

        p.stroke(e.color[0], e.color[1], e.color[2], 70);
        p.strokeWeight(1);
        p.line(fromX, evY, curX, evY);

        if (e.lost && progress > 0.5) {
          p.stroke(255, 100, 100, 200);
          p.strokeWeight(1.5);
          const lx = (fromX + toX) / 2;
          p.line(lx - 3, evY - 3, lx + 3, evY + 3);
          p.line(lx + 3, evY - 3, lx - 3, evY + 3);
        }

        if (!e.lost && progress >= 1) {
          const dir = toX > fromX ? 1 : -1;
          p.fill(e.color[0], e.color[1], e.color[2], 150);
          p.noStroke();
          p.triangle(toX, evY, toX - dir * 5, evY - 2, toX - dir * 5, evY + 2);
        }

        p.noStroke();
        p.fill(e.color[0], e.color[1], e.color[2], 130);
        p.textSize(5);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text(e.label, (fromX + toX) / 2, evY - 2);
      }
    }

    // SR highlight
    p.fill(15, 20, 35);
    p.stroke(100, 200, 100, 30);
    p.strokeWeight(1);
    p.rect(srX + 8, 330, halfW - 16, 18, 4);
    p.noStroke();
    p.fill(100, 200, 100, 160);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Retransmite SOMENTE o pacote perdido", srX + halfW / 2, 339);

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Pipeline: múltiplos pacotes em trânsito aumentam a utilização do enlace", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={400} />;
}

