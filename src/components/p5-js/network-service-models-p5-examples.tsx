"use client";

import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

type Vec2 = { x: number; y: number };

type TransitPacket = {
  id: number;
  x: number;
  y: number;
  speed: number;
  phase: "toRouter" | "toDst";
  dropped?: boolean;
  dropTtl?: number;
  queuedAt?: number;
  sentAt?: number;
  priority?: "high" | "low";
};

function drawLabeledNode(
  p: p5,
  pos: Vec2,
  label: string,
  color: [number, number, number],
  w = 62,
  h = 28,
) {
  p.stroke(color[0], color[1], color[2], 170);
  p.strokeWeight(1.2);
  p.fill(12, 18, 32);
  p.rect(pos.x - w / 2, pos.y - h / 2, w, h, 6);
  p.noStroke();
  p.fill(color[0], color[1], color[2]);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(9);
  p.text(label, pos.x, pos.y + 0.5);
}

function jitterFromArrivalFrames(frames: number[]) {
  if (frames.length < 3) return 0;
  const gaps: number[] = [];
  for (let i = 1; i < frames.length; i += 1) {
    gaps.push(frames[i] - frames[i - 1]);
  }
  let acc = 0;
  for (let i = 1; i < gaps.length; i += 1) {
    acc += Math.abs(gaps[i] - gaps[i - 1]);
  }
  return acc / (gaps.length - 1);
}

export function BestEffortVsQoSGuarantees() {
  let nextId = 1;
  let bestEffortPackets: TransitPacket[] = [];
  let qosTransit: TransitPacket[] = [];
  let qosHighQueue: TransitPacket[] = [];
  let qosLowQueue: TransitPacket[] = [];

  let beSent = 0;
  let beDelivered = 0;
  let beDropped = 0;
  let qosSent = 0;
  let qosDelivered = 0;
  let qosDropped = 0;

  const beArrivals: number[] = [];
  const qosArrivals: number[] = [];

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const drawBestEffort = (p: p5, leftX: number, rightX: number, yMid: number) => {
    const src = { x: leftX + 34, y: yMid };
    const router = { x: leftX + (rightX - leftX) * 0.5, y: yMid };
    const dst = { x: rightX - 34, y: yMid };

    p.stroke(70, 90, 130);
    p.strokeWeight(1.5);
    p.line(src.x + 32, yMid, router.x - 34, yMid);
    p.line(router.x + 34, yMid, dst.x - 32, yMid);

    drawLabeledNode(p, src, "Origem", [110, 180, 255]);
    drawLabeledNode(p, router, "Best-Effort", [255, 120, 120]);
    drawLabeledNode(p, dst, "Destino", [120, 230, 140]);

    if (p.frameCount % 18 === 0) {
      beSent += 1;
      bestEffortPackets.push({
        id: nextId,
        x: src.x + 36,
        y: yMid,
        speed: 1.5 + Math.random() * 1.4,
        phase: "toRouter",
      });
      nextId += 1;
    }

    bestEffortPackets = bestEffortPackets.filter((packet) => {
      if (packet.dropped) {
        packet.dropTtl = (packet.dropTtl ?? 0) - 1;
        packet.y += 1.2;
        const blinkOn = packet.dropTtl !== undefined && packet.dropTtl % 8 < 4;
        if (blinkOn) {
          p.noStroke();
          p.fill(255, 70, 70, 170);
          p.rect(packet.x - 5, packet.y - 5, 10, 10, 2);
        }
        return (packet.dropTtl ?? 0) > 0;
      }

      if (packet.phase === "toRouter") {
        packet.x += packet.speed;
        if (packet.x >= router.x - 36) {
          if (Math.random() < 0.28) {
            packet.dropped = true;
            packet.dropTtl = 28;
            beDropped += 1;
            return true;
          }

          packet.phase = "toDst";
          packet.sentAt = p.frameCount;

          if (Math.random() < 0.24) {
            packet.speed *= 0.5;
          }
        }
      } else {
        packet.x += packet.speed;
        if (packet.x >= dst.x - 30) {
          beDelivered += 1;
          beArrivals.push(p.frameCount);
          if (beArrivals.length > 40) beArrivals.shift();
          return false;
        }
      }

      p.noStroke();
      p.fill(255, 140, 120);
      p.rect(packet.x - 5, packet.y - 5, 10, 10, 2);
      return true;
    });

    p.noStroke();
    p.fill(120);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text("perda aleatoria + variacao de atraso", leftX + 12, yMid + 24);
  };

  const drawQoS = (p: p5, leftX: number, rightX: number, yMid: number) => {
    const src = { x: leftX + 34, y: yMid };
    const router = { x: leftX + (rightX - leftX) * 0.5, y: yMid };
    const dst = { x: rightX - 34, y: yMid };

    const queueX = router.x - 28;
    const queueY = yMid + 34;
    const slotH = 11;
    const maxHigh = 4;
    const maxLow = 4;

    p.stroke(70, 90, 130);
    p.strokeWeight(1.5);
    p.line(src.x + 32, yMid, router.x - 34, yMid);
    p.line(router.x + 34, yMid, dst.x - 32, yMid);

    drawLabeledNode(p, src, "Origem", [110, 180, 255]);
    drawLabeledNode(p, router, "QoS", [120, 220, 255]);
    drawLabeledNode(p, dst, "Destino", [120, 230, 140]);

    if (p.frameCount % 16 === 0) {
      const priority: "high" | "low" = Math.random() < 0.45 ? "high" : "low";
      qosSent += 1;
      qosTransit.push({
        id: nextId,
        x: src.x + 36,
        y: yMid,
        speed: 2.1,
        phase: "toRouter",
        priority,
      });
      nextId += 1;
    }

    qosTransit = qosTransit.filter((packet) => {
      if (packet.dropped) {
        packet.dropTtl = (packet.dropTtl ?? 0) - 1;
        packet.y += 1.4;
        p.noStroke();
        p.fill(255, 70, 70, 170);
        p.rect(packet.x - 5, packet.y - 5, 10, 10, 2);
        return (packet.dropTtl ?? 0) > 0;
      }

      if (packet.phase === "toRouter") {
        packet.x += packet.speed;
        if (packet.x >= router.x - 36) {
          const highSize = qosHighQueue.length;
          const lowSize = qosLowQueue.length;

          if (packet.priority === "high" && highSize < maxHigh) {
            packet.queuedAt = p.frameCount;
            qosHighQueue.push(packet);
          } else if (packet.priority === "low" && lowSize < maxLow) {
            packet.queuedAt = p.frameCount;
            qosLowQueue.push(packet);
          } else {
            packet.dropped = true;
            packet.dropTtl = 26;
            packet.x = router.x;
            packet.y = yMid + 8;
            qosDropped += 1;
            return true;
          }
          return false;
        }
      } else {
        packet.x += packet.speed;
        if (packet.x >= dst.x - 30) {
          qosDelivered += 1;
          qosArrivals.push(p.frameCount);
          if (qosArrivals.length > 40) qosArrivals.shift();
          return false;
        }
      }

      p.noStroke();
      p.fill(packet.priority === "high" ? 255 : 120, 200, packet.priority === "high" ? 90 : 255);
      p.rect(packet.x - 5, packet.y - 5, 10, 10, 2);
      return true;
    });

    if (p.frameCount % 11 === 0) {
      const queued = qosHighQueue.length > 0 ? qosHighQueue.shift() : qosLowQueue.shift();
      if (queued) {
        queued.phase = "toDst";
        queued.x = router.x + 18;
        queued.y = yMid;
        queued.speed = 2.25;
        qosTransit.push(queued);
      }
    }

    p.noFill();
    p.stroke(120, 200, 255, 120);
    p.rect(queueX, queueY, 56, slotH * 8 + 4, 5);

    for (let i = 0; i < 8; i += 1) {
      const y = queueY + 2 + i * slotH;
      p.noStroke();
      p.fill(255, 255, 255, 8);
      p.rect(queueX + 2, y, 52, slotH - 2, 2);
    }

    qosHighQueue.forEach((packet, index) => {
      const y = queueY + 2 + index * slotH;
      p.noStroke();
      p.fill(255, 190, 80);
      p.rect(queueX + 6, y + 1, 18, slotH - 4, 2);
      p.fill(255);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(String(packet.id % 100), queueX + 15, y + slotH / 2);
    });

    qosLowQueue.forEach((packet, index) => {
      const y = queueY + 2 + (index + maxHigh) * slotH;
      p.noStroke();
      p.fill(100, 170, 255);
      p.rect(queueX + 32, y + 1, 18, slotH - 4, 2);
      p.fill(255);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(String(packet.id % 100), queueX + 41, y + slotH / 2);
    });

    p.noStroke();
    p.fill(140);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text("fila com prioridade", leftX + 14, yMid + 24);
    p.text("H", queueX + 8, queueY - 10);
    p.text("L", queueX + 36, queueY - 10);
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;

    p.noStroke();
    p.fill(205);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Best-Effort vs QoS (Garantias)", w / 2, 8);

    const mid = w / 2;
    p.stroke(70, 90, 120, 90);
    p.line(mid, 30, mid, p.height - 16);

    p.noStroke();
    p.textSize(10);
    p.fill(255, 130, 120);
    p.text("Best-Effort", w * 0.25, 30);
    p.fill(120, 215, 255);
    p.text("QoS", w * 0.75, 30);

    drawBestEffort(p, 10, mid - 10, 94);
    drawQoS(p, mid + 10, w - 10, 94);

    const beSuccessRate = beSent > 0 ? (beDelivered / beSent) * 100 : 0;
    const qosSuccessRate = qosSent > 0 ? (qosDelivered / qosSent) * 100 : 0;

    p.fill(14, 22, 38);
    p.stroke(120, 140, 170, 70);
    p.rect(16, 172, w - 32, 98, 8);

    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.fill(255, 145, 130);
    p.text(
      `Best-Effort | perdas: ${beDropped} | sucesso: ${beSuccessRate.toFixed(1)}% | jitter: ${jitterFromArrivalFrames(beArrivals).toFixed(2)}`,
      26,
      187,
    );
    p.fill(125, 220, 255);
    p.text(
      `QoS         | perdas: ${qosDropped} | sucesso: ${qosSuccessRate.toFixed(1)}% | jitter: ${jitterFromArrivalFrames(qosArrivals).toFixed(2)}`,
      26,
      203,
    );

    p.fill(130);
    p.text(
      "Best-effort descarta e varia atraso; QoS aplica fila, limite de buffer e prioridade.",
      26,
      226,
    );
  };

  return <P5Sketch setup={setup} draw={draw} height={286} />;
}

type PathPacket = {
  seq: number;
  route: Vec2[];
  x: number;
  y: number;
  segment: number;
  t: number;
  speed: number;
};

export function DatagramVsVirtualCircuitComparison() {
  let datagramPackets: PathPacket[] = [];
  let vcPackets: PathPacket[] = [];
  let datagramSeq = 1;
  let vcSeq = 1;

  let datagramArrivals: number[] = [];
  let vcArrivals: number[] = [];

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const advanceOnPath = (packet: PathPacket) => {
    packet.t += packet.speed;
    while (packet.t >= 1) {
      packet.t -= 1;
      packet.segment += 1;
      if (packet.segment >= packet.route.length - 1) return true;
    }
    const from = packet.route[packet.segment];
    const to = packet.route[packet.segment + 1];
    packet.x = from.x + (to.x - from.x) * packet.t;
    packet.y = from.y + (to.y - from.y) * packet.t;
    return false;
  };

  const drawTrack = (p: p5, path: Vec2[], color: [number, number, number], alpha = 65) => {
    p.stroke(color[0], color[1], color[2], alpha);
    p.strokeWeight(2);
    for (let i = 0; i < path.length - 1; i += 1) {
      p.line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
    }
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(205);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Datagram vs Circuito Virtual", w / 2, 8);

    const half = w / 2;
    p.stroke(70, 90, 120, 90);
    p.line(half, 30, half, h - 16);

    const srcL = { x: 38, y: 92 };
    const dstL = { x: half - 40, y: 92 };
    const midTopL = { x: half * 0.34, y: 58 };
    const midMidL = { x: half * 0.34, y: 92 };
    const midLowL = { x: half * 0.34, y: 128 };

    const srcR = { x: half + 38, y: 92 };
    const dstR = { x: w - 40, y: 92 };
    const vcHop1 = { x: half + half * 0.34, y: 70 };
    const vcHop2 = { x: half + half * 0.34, y: 114 };

    p.fill(255, 150, 120);
    p.textSize(10);
    p.text("Datagram (sem conexao)", half * 0.5, 30);
    p.fill(120, 220, 255);
    p.text("Circuito virtual (conexao)", half + half * 0.5, 30);

    const dgRoutes = [
      [srcL, midTopL, dstL],
      [srcL, midLowL, dstL],
      [srcL, midMidL, dstL],
    ];
    dgRoutes.forEach((route, i) => drawTrack(p, route, i === 2 ? [210, 210, 210] : [255, 130, 120], 55));
    drawTrack(p, [srcR, vcHop1, vcHop2, dstR], [120, 220, 255], 90);

    [srcL, dstL, midTopL, midMidL, midLowL].forEach((node, index) => {
      const label = index === 0 ? "S" : index === 1 ? "D" : `R${index - 1}`;
      drawLabeledNode(p, node, label, [255, 140, 120], 40, 22);
    });

    [srcR, vcHop1, vcHop2, dstR].forEach((node, index) => {
      const label = index === 0 ? "S" : index === 3 ? "D" : `VC${index}`;
      drawLabeledNode(p, node, label, [120, 220, 255], 42, 22);
    });

    if (p.frameCount % 36 === 0) {
      const routeIndex = (datagramSeq * 2) % 3;
      const baseSpeed = routeIndex === 0 ? 0.021 : routeIndex === 1 ? 0.014 : 0.018;
      datagramPackets.push({
        seq: datagramSeq,
        route: dgRoutes[routeIndex],
        x: srcL.x,
        y: srcL.y,
        segment: 0,
        t: 0,
        speed: baseSpeed,
      });
      datagramSeq += 1;
      if (datagramSeq > 8) {
        datagramSeq = 1;
        datagramArrivals = [];
      }
    }

    if (p.frameCount % 36 === 0) {
      vcPackets.push({
        seq: vcSeq,
        route: [srcR, vcHop1, vcHop2, dstR],
        x: srcR.x,
        y: srcR.y,
        segment: 0,
        t: 0,
        speed: 0.018,
      });
      vcSeq += 1;
      if (vcSeq > 8) {
        vcSeq = 1;
        vcArrivals = [];
      }
    }

    datagramPackets = datagramPackets.filter((packet) => {
      const arrived = advanceOnPath(packet);
      if (arrived) {
        datagramArrivals.push(packet.seq);
        return false;
      }
      p.noStroke();
      p.fill(255, 150, 120);
      p.circle(packet.x, packet.y, 14);
      p.fill(10, 10, 15);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(String(packet.seq), packet.x, packet.y + 0.5);
      return true;
    });

    vcPackets = vcPackets.filter((packet) => {
      const arrived = advanceOnPath(packet);
      if (arrived) {
        vcArrivals.push(packet.seq);
        return false;
      }
      p.noStroke();
      p.fill(120, 220, 255);
      p.circle(packet.x, packet.y, 14);
      p.fill(10, 10, 15);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(String(packet.seq), packet.x, packet.y + 0.5);
      return true;
    });

    const datagramInOrder = datagramArrivals.every((seq, i) => i === 0 || seq >= datagramArrivals[i - 1]);

    p.fill(15, 21, 35);
    p.stroke(120, 140, 170, 70);
    p.rect(16, 156, w - 32, 74, 8);

    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.fill(datagramInOrder ? 255 : 255, datagramInOrder ? 180 : 110, 120);
    p.text(`Datagram chegou: ${datagramArrivals.join(" -> ") || "-"}`, 26, 170);
    p.fill(120, 220, 255);
    p.text(`VC chegou:       ${vcArrivals.join(" -> ") || "-"}`, 26, 186);
    p.fill(130);
    p.text(
      "Datagram usa rotas diferentes (ordem pode quebrar). VC fixa uma rota e preserva sequencia.",
      26,
      205,
    );
  };

  return <P5Sketch setup={setup} draw={draw} height={248} />;
}

type IncomingPacket = {
  lane: number;
  x: number;
  y: number;
  speed: number;
};

type OutgoingPacket = {
  x: number;
  y: number;
  speed: number;
};

export function CongestionAndPacketDropSimulator() {
  const capacity = 12;
  let arrivalRate = 20;
  let processingRate = 12;
  let nextArrivalId = 1;

  let incoming: IncomingPacket[] = [];
  let queue: number[] = [];
  let outgoing: OutgoingPacket[] = [];
  let droppedBursts: Vec2[] = [];

  let totalArrived = 0;
  let totalDropped = 0;
  let totalProcessed = 0;

  let serviceBudget = 0;

  const buttons: Array<{ id: string; x: number; y: number; w: number; h: number }> = [];

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const drawButton = (p: p5, id: string, x: number, y: number, label: string) => {
    const w = 20;
    const h = 16;
    buttons.push({ id, x, y, w, h });
    p.stroke(130, 170, 210, 120);
    p.fill(12, 22, 38);
    p.rect(x, y, w, h, 4);
    p.noStroke();
    p.fill(210);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(label, x + w / 2, y + h / 2 + 0.5);
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;
    const h = p.height;

    buttons.length = 0;

    p.noStroke();
    p.fill(205);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Congestionamento e Descarte de Pacotes", w / 2, 8);

    const router = { x: w * 0.52, y: h * 0.45 };
    const inStart = [
      { x: 40, y: router.y - 44 },
      { x: 40, y: router.y },
      { x: 40, y: router.y + 44 },
    ];
    const outEnd = { x: w - 56, y: router.y };

    inStart.forEach((src) => {
      p.stroke(80, 110, 150);
      p.strokeWeight(1.6);
      p.line(src.x, src.y, router.x - 50, src.y);
      p.line(router.x - 50, src.y, router.x - 26, router.y);
    });

    p.stroke(90, 170, 255);
    p.strokeWeight(1.8);
    p.line(router.x + 30, router.y, outEnd.x, outEnd.y);

    const queueUsage = queue.length / capacity;
    const queueColor: [number, number, number] = queueUsage > 0.85 ? [255, 100, 100] : [120, 210, 255];

    p.stroke(queueColor[0], queueColor[1], queueColor[2], 200);
    p.fill(12, 20, 35);
    p.rect(router.x - 30, router.y - 30, 60, 60, 8);

    p.noStroke();
    p.fill(queueColor[0], queueColor[1], queueColor[2]);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(9);
    p.text("ROTEADOR", router.x, router.y - 14);

    const bufferX = router.x - 24;
    const bufferY = router.y - 2;
    const slotW = 4;

    p.stroke(130, 150, 180, 120);
    p.noFill();
    p.rect(bufferX - 2, bufferY - 2, capacity * (slotW + 1) + 4, 12, 4);

    for (let i = 0; i < capacity; i += 1) {
      const x = bufferX + i * (slotW + 1);
      p.noStroke();
      p.fill(255, 255, 255, 8);
      p.rect(x, bufferY, slotW, 8, 1);
    }

    for (let i = 0; i < queue.length; i += 1) {
      const x = bufferX + i * (slotW + 1);
      p.noStroke();
      p.fill(queueColor[0], queueColor[1], queueColor[2]);
      p.rect(x, bufferY, slotW, 8, 1);
    }

    p.noStroke();
    p.fill(130);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Buffer: ${queue.length}/${capacity}`, router.x - 29, router.y + 15);

    const arrivalProbPerLane = (arrivalRate / 60) / 3;
    inStart.forEach((src, lane) => {
      if (Math.random() < arrivalProbPerLane) {
        incoming.push({
          lane,
          x: src.x,
          y: src.y,
          speed: 1.9 + lane * 0.35,
        });
      }
    });

    incoming = incoming.filter((packet) => {
      packet.x += packet.speed;
      if (packet.x >= router.x - 31) {
        totalArrived += 1;
        if (queue.length >= capacity) {
          totalDropped += 1;
          droppedBursts.push({ x: router.x, y: router.y + 34 });
        } else {
          queue.push(nextArrivalId);
          nextArrivalId += 1;
        }
        return false;
      }

      p.noStroke();
      p.fill(255, 180, 90);
      p.rect(packet.x - 4, packet.y - 4, 8, 8, 2);
      return true;
    });

    serviceBudget += processingRate / 60;
    while (serviceBudget >= 1 && queue.length > 0) {
      queue.shift();
      totalProcessed += 1;
      serviceBudget -= 1;
      outgoing.push({ x: router.x + 34, y: router.y, speed: 2.3 });
    }

    outgoing = outgoing.filter((packet) => {
      packet.x += packet.speed;
      p.noStroke();
      p.fill(120, 220, 255);
      p.rect(packet.x - 4, packet.y - 4, 8, 8, 2);
      return packet.x < outEnd.x;
    });

    droppedBursts = droppedBursts
      .map((burst) => ({ x: burst.x + (Math.random() - 0.5) * 1.6, y: burst.y + 1.4 }))
      .filter((burst) => {
        p.noStroke();
        p.fill(255, 80, 80, 170);
        p.circle(burst.x, burst.y, 5);
        return burst.y < h - 10;
      });

    p.stroke(255, 90, 90, 130);
    p.strokeWeight(1.4);
    p.line(router.x - 10, router.y + 34, router.x + 10, router.y + 34);
    p.line(router.x, router.y + 34, router.x, h - 20);

    p.noStroke();
    p.fill(255, 100, 100);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("DESCARTE", router.x, h - 18);

    p.fill(15, 22, 38);
    p.stroke(120, 140, 170, 70);
    p.rect(16, h - 94, w - 32, 82, 8);

    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.fill(210);
    p.text(`Pacotes que chegaram ao roteador: ${totalArrived}`, 26, h - 82);
    p.fill(255, 130, 120);
    p.text(`Pacotes descartados: ${totalDropped}`, 26, h - 66);
    p.fill(120, 220, 255);
    p.text(`Pacotes processados: ${totalProcessed}`, 26, h - 50);
    p.fill(130);
    p.text(`Taxa de chegada: ${arrivalRate.toFixed(0)} pps | Taxa de processamento: ${processingRate.toFixed(0)} pps`, 26, h - 34);

    p.fill(130);
    p.text("Taxa de chegada", w - 208, h - 84);
    drawButton(p, "arr-", w - 206, h - 68, "-");
    drawButton(p, "arr+", w - 182, h - 68, "+");

    p.text("Taxa de processamento", w - 208, h - 46);
    drawButton(p, "proc-", w - 206, h - 30, "-");
    drawButton(p, "proc+", w - 182, h - 30, "+");
  };

  const mousePressed = (p: p5) => {
    const hit = buttons.find(
      (button) =>
        p.mouseX >= button.x &&
        p.mouseX <= button.x + button.w &&
        p.mouseY >= button.y &&
        p.mouseY <= button.y + button.h,
    );

    if (!hit) return;

    if (hit.id === "arr-") arrivalRate = Math.max(6, arrivalRate - 2);
    if (hit.id === "arr+") arrivalRate = Math.min(40, arrivalRate + 2);
    if (hit.id === "proc-") processingRate = Math.max(4, processingRate - 2);
    if (hit.id === "proc+") processingRate = Math.min(36, processingRate + 2);
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={332} />;
}

type GraphNodeId = "A" | "B" | "C" | "D" | "E" | "F";

type GraphNode = {
  id: GraphNodeId;
  x: number;
  y: number;
};

type GraphEdge = {
  from: GraphNodeId;
  to: GraphNodeId;
  w: number;
};

export function DijkstraStepByStep() {
  const nodes: GraphNode[] = [
    { id: "A", x: 90, y: 72 },
    { id: "B", x: 205, y: 50 },
    { id: "C", x: 205, y: 122 },
    { id: "D", x: 335, y: 50 },
    { id: "E", x: 335, y: 122 },
    { id: "F", x: 462, y: 86 },
  ];

  const edges: GraphEdge[] = [
    { from: "A", to: "B", w: 4 },
    { from: "A", to: "C", w: 2 },
    { from: "B", to: "C", w: 1 },
    { from: "B", to: "D", w: 5 },
    { from: "C", to: "D", w: 8 },
    { from: "C", to: "E", w: 10 },
    { from: "D", to: "E", w: 2 },
    { from: "D", to: "F", w: 6 },
    { from: "E", to: "F", w: 3 },
  ];

  const adjacency: Record<GraphNodeId, Array<{ to: GraphNodeId; w: number }>> = {
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    F: [],
  };

  edges.forEach((edge) => {
    adjacency[edge.from].push({ to: edge.to, w: edge.w });
    adjacency[edge.to].push({ to: edge.from, w: edge.w });
  });

  const allIds: GraphNodeId[] = ["A", "B", "C", "D", "E", "F"];

  let dist: Record<GraphNodeId, number> = {
    A: 0,
    B: Number.POSITIVE_INFINITY,
    C: Number.POSITIVE_INFINITY,
    D: Number.POSITIVE_INFINITY,
    E: Number.POSITIVE_INFINITY,
    F: Number.POSITIVE_INFINITY,
  };
  let prev: Partial<Record<GraphNodeId, GraphNodeId>> = {};
  let visited = new Set<GraphNodeId>();
  let current: GraphNodeId | null = null;
  let playing = true;
  let iteration = 0;
  let done = false;

  let phase: "select" | "relax" = "select";
  let lastStepFrame = 0;

  const buttons: Array<{ id: string; x: number; y: number; w: number; h: number }> = [];

  const reset = () => {
    dist = {
      A: 0,
      B: Number.POSITIVE_INFINITY,
      C: Number.POSITIVE_INFINITY,
      D: Number.POSITIVE_INFINITY,
      E: Number.POSITIVE_INFINITY,
      F: Number.POSITIVE_INFINITY,
    };
    prev = {};
    visited = new Set<GraphNodeId>();
    current = null;
    iteration = 0;
    done = false;
    phase = "select";
  };

  const pickNextNode = () => {
    let best: GraphNodeId | null = null;
    let bestDist = Number.POSITIVE_INFINITY;
    allIds.forEach((id) => {
      if (!visited.has(id) && dist[id] < bestDist) {
        best = id;
        bestDist = dist[id];
      }
    });
    return best;
  };

  const step = () => {
    if (done) return;

    if (phase === "select") {
      const next = pickNextNode();
      if (!next) {
        done = true;
        return;
      }
      current = next;
      phase = "relax";
      return;
    }

    if (!current) return;

    adjacency[current].forEach((edge) => {
      if (visited.has(edge.to)) return;
      const candidate = dist[current!] + edge.w;
      if (candidate < dist[edge.to]) {
        dist[edge.to] = candidate;
        prev[edge.to] = current!;
      }
    });

    visited.add(current);
    iteration += 1;
    current = null;
    phase = "select";

    if (visited.size === allIds.length) done = true;
  };

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const drawButton = (p: p5, id: string, x: number, y: number, text: string, active = false) => {
    const w = 74;
    const h = 22;
    buttons.push({ id, x, y, w, h });
    p.stroke(active ? 120 : 90, active ? 220 : 140, 255, active ? 220 : 120);
    p.fill(active ? 22 : 12, active ? 42 : 22, 48);
    p.rect(x, y, w, h, 6);
    p.noStroke();
    p.fill(205);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(9);
    p.text(text, x + w / 2, y + h / 2 + 0.5);
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;

    buttons.length = 0;

    p.noStroke();
    p.fill(205);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Algoritmo de Dijkstra - Passo a Passo", w / 2, 8);

    if (playing && !done && p.frameCount - lastStepFrame > 38) {
      step();
      lastStepFrame = p.frameCount;
    }

    edges.forEach((edge) => {
      const from = nodes.find((n) => n.id === edge.from);
      const to = nodes.find((n) => n.id === edge.to);
      if (!from || !to) return;

      const treeEdge = prev[edge.to] === edge.from || prev[edge.from] === edge.to;
      p.stroke(treeEdge ? 120 : 80, treeEdge ? 220 : 100, treeEdge ? 255 : 130, treeEdge ? 210 : 120);
      p.strokeWeight(treeEdge ? 2.5 : 1.5);
      p.line(from.x, from.y, to.x, to.y);

      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      p.noStroke();
      p.fill(8, 14, 26);
      p.rect(mx - 8, my - 7, 16, 12, 3);
      p.fill(180);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(8);
      p.text(String(edge.w), mx, my - 0.5);
    });

    nodes.forEach((node) => {
      const isVisited = visited.has(node.id);
      const isCurrent = current === node.id;
      const c: [number, number, number] = isVisited
        ? [120, 220, 140]
        : isCurrent
          ? [255, 220, 90]
          : [120, 130, 150];

      p.stroke(c[0], c[1], c[2], 220);
      p.strokeWeight(2);
      p.fill(14, 22, 35);
      p.circle(node.x, node.y, 30);

      p.noStroke();
      p.fill(c[0], c[1], c[2]);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(11);
      p.text(node.id, node.x, node.y - 1);
    });

    const panelX = 520;
    const panelY = 40;
    const panelW = w - panelX - 16;

    p.fill(12, 20, 35);
    p.stroke(120, 140, 170, 90);
    p.rect(panelX, panelY, panelW, 196, 8);

    p.noStroke();
    p.fill(190);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(`Origem: A | iteracao: ${iteration}${done ? " (concluido)" : ""}`, panelX + 10, panelY + 10);

    p.fill(120);
    p.textSize(8);
    p.text("No", panelX + 10, panelY + 30);
    p.text("Dist", panelX + 52, panelY + 30);
    p.text("Prev", panelX + 100, panelY + 30);
    p.text("Estado", panelX + 148, panelY + 30);

    allIds.forEach((id, index) => {
      const y = panelY + 44 + index * 23;
      p.noStroke();
      p.fill(index % 2 === 0 ? 255 : 255, 255, 255, index % 2 === 0 ? 10 : 5);
      p.rect(panelX + 8, y - 2, panelW - 16, 18, 3);

      const status = visited.has(id) ? "fixado" : current === id ? "ativo" : "pendente";
      p.fill(180);
      p.textSize(9);
      p.text(id, panelX + 10, y);
      p.text(dist[id] === Number.POSITIVE_INFINITY ? "inf" : String(dist[id]), panelX + 52, y);
      p.text(prev[id] ?? "-", panelX + 100, y);

      const statusColor: [number, number, number] =
        status === "fixado" ? [120, 220, 140] : status === "ativo" ? [255, 220, 90] : [140, 150, 170];
      p.fill(statusColor[0], statusColor[1], statusColor[2]);
      p.text(status, panelX + 148, y);
    });

    drawButton(p, "toggle", panelX, 244, playing ? "Pause" : "Play", playing);
    drawButton(p, "step", panelX + 82, 244, "Passo", false);
    drawButton(p, "reset", panelX + 164, 244, "Reiniciar", false);

    p.noStroke();
    p.fill(130);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(8.5);
    p.text("Cores dos nos: cinza = nao visitado, amarelo = em processamento, verde = fixado.", 20, 246);
  };

  const mousePressed = (p: p5) => {
    const hit = buttons.find(
      (button) =>
        p.mouseX >= button.x &&
        p.mouseX <= button.x + button.w &&
        p.mouseY >= button.y &&
        p.mouseY <= button.y + button.h,
    );

    if (!hit) return;

    if (hit.id === "toggle") {
      playing = !playing;
      return;
    }

    if (hit.id === "step") {
      if (!done) step();
      return;
    }

    if (hit.id === "reset") {
      reset();
      playing = false;
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={290} />;
}

