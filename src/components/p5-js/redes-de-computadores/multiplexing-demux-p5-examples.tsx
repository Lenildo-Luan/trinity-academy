"use client";

import { P5Sketch } from "../p5-sketch";
import type p5 from "p5";

// Visualization 1: Multiplexing at the sender — multiple sockets being combined into segments
export function MultiplexingSender() {
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
    p.text("Multiplexação no Emissor", w / 2, 10);

    // Application processes (sockets)
    const sockets = [
      { label: "Navegador", port: 49152, destPort: 80, col: [255, 100, 100] },
      { label: "Cliente SSH", port: 49153, destPort: 22, col: [100, 255, 100] },
      { label: "Consulta DNS", port: 49154, destPort: 53, col: [100, 180, 255] },
      { label: "E-mail (SMTP)", port: 49155, destPort: 25, col: [255, 200, 50] },
    ];

    const socketX = 15;
    const socketW = 110;
    const socketH = 50;
    const startY = 40;
    const gap = 10;

    // Draw sockets
    sockets.forEach((sock, i) => {
      const sy = startY + i * (socketH + gap);

      // Socket box
      p.fill(sock.col[0], sock.col[1], sock.col[2], 25);
      p.stroke(sock.col[0], sock.col[1], sock.col[2], 100);
      p.strokeWeight(1);
      p.rect(socketX, sy, socketW, socketH, 6);

      p.noStroke();
      p.fill(sock.col[0], sock.col[1], sock.col[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(sock.label, socketX + socketW / 2, sy + 14);
      p.fill(100);
      p.textSize(7);
      p.text(`Socket ${sock.port}`, socketX + socketW / 2, sy + 28);
      p.text(`→ dest: ${sock.destPort}`, socketX + socketW / 2, sy + 40);
    });

    // Transport layer box
    const tlX = socketX + socketW + 60;
    const tlW = 100;
    const tlH = sockets.length * (socketH + gap) - gap;

    p.fill(15, 25, 45);
    p.stroke(0, 150, 255, 100);
    p.strokeWeight(2);
    p.rect(tlX, startY, tlW, tlH, 8);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Camada de", tlX + tlW / 2, startY + tlH / 2 - 12);
    p.text("Transporte", tlX + tlW / 2, startY + tlH / 2 + 4);
    p.fill(80);
    p.textSize(8);
    p.text("(Multiplexação)", tlX + tlW / 2, startY + tlH / 2 + 22);

    // Animated data blocks from sockets to transport layer
    sockets.forEach((sock, i) => {
      const sy = startY + i * (socketH + gap) + socketH / 2;
      const phase = (time * 1.2 + i * 0.6) % 2.5;

      // Connection line
      p.stroke(sock.col[0], sock.col[1], sock.col[2], 30);
      p.strokeWeight(1);
      p.line(socketX + socketW, sy, tlX, sy);

      if (phase < 1) {
        const px = socketX + socketW + 5 + phase * (tlX - socketX - socketW - 10);
        p.fill(sock.col[0], sock.col[1], sock.col[2], 200);
        p.noStroke();
        p.rectMode(p.CENTER);
        p.rect(px, sy, 18, 12, 3);
        p.fill(255);
        p.textSize(6);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("DATA", px, sy);
        p.rectMode(p.CORNER);
      }
    });

    // Output: segments going to network
    const outX = tlX + tlW + 20;
    const netX = w - 20;
    const midY = startY + tlH / 2;

    // Network pipe
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(3);
    p.line(outX, midY, netX, midY);

    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("→ Camada de Rede (IP)", (outX + netX) / 2, midY - 10);

    // Animated segments on the wire
    for (let i = 0; i < 3; i++) {
      const phase = (time * 1.5 + i) % 3;
      if (phase < 2) {
        const px = outX + (phase / 2) * (netX - outX - 10);
        const sockIdx = (i + Math.floor(time * 0.5)) % sockets.length;
        const sock = sockets[sockIdx];

        // Segment with header
        p.fill(sock.col[0], sock.col[1], sock.col[2], 180);
        p.noStroke();
        p.rectMode(p.CENTER);
        p.rect(px, midY, 40, 16, 3);

        p.fill(255);
        p.textSize(5);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`${sock.port}→${sock.destPort}`, px, midY);
        p.rectMode(p.CORNER);
      }
    }

    // Legend box
    p.fill(15, 20, 30);
    p.stroke(60);
    p.strokeWeight(1);
    p.rect(10, h - 55, w - 20, 45, 6);

    p.noStroke();
    p.fill(150);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("• Cada socket envia dados independentemente para a camada de transporte", 20, h - 40);
    p.text("• A camada de transporte adiciona cabeçalho (porta origem + porta destino) → cria segmentos", 20, h - 26);
    p.text("• Todos os segmentos são enviados pela mesma camada de rede (IP) — isso é multiplexação", 20, h - 14);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 2: Demultiplexing at the receiver — segments being directed to correct sockets
export function DemultiplexingReceiver() {
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
    p.text("Demultiplexação no Receptor", w / 2, 10);

    // Incoming segments from network
    const netX = 15;
    const tlX = 160;
    const midY = h / 2 - 10;

    // Network pipe
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(3);
    p.line(netX, midY, tlX - 10, midY);

    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("← Camada de Rede (IP)", (netX + tlX) / 2, midY - 12);

    // Transport layer box
    const tlW = 100;
    const sockets = [
      { label: "Servidor HTTP", port: 80, col: [255, 100, 100] },
      { label: "Servidor SSH", port: 22, col: [100, 255, 100] },
      { label: "Servidor DNS", port: 53, col: [100, 180, 255] },
    ];

    const socketX = tlX + tlW + 60;
    const socketW = 110;
    const socketH = 50;
    const startY = 40;
    const gap = 15;
    const totalH = sockets.length * (socketH + gap) - gap;

    p.fill(15, 25, 45);
    p.stroke(0, 150, 255, 100);
    p.strokeWeight(2);
    p.rect(tlX, startY, tlW, totalH, 8);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Camada de", tlX + tlW / 2, startY + totalH / 2 - 12);
    p.text("Transporte", tlX + tlW / 2, startY + totalH / 2 + 4);
    p.fill(80);
    p.textSize(8);
    p.text("(Demultiplexação)", tlX + tlW / 2, startY + totalH / 2 + 22);

    // Sockets on the right
    sockets.forEach((sock, i) => {
      const sy = startY + i * (socketH + gap);

      p.fill(sock.col[0], sock.col[1], sock.col[2], 25);
      p.stroke(sock.col[0], sock.col[1], sock.col[2], 100);
      p.strokeWeight(1);
      p.rect(socketX, sy, socketW, socketH, 6);

      p.noStroke();
      p.fill(sock.col[0], sock.col[1], sock.col[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(sock.label, socketX + socketW / 2, sy + 14);
      p.fill(100);
      p.textSize(7);
      p.text(`Socket porta ${sock.port}`, socketX + socketW / 2, sy + 28);

      // Highlight when receiving
      const activeIdx = Math.floor(time * 0.8) % sockets.length;
      if (activeIdx === i) {
        p.noFill();
        p.stroke(sock.col[0], sock.col[1], sock.col[2], 100 + 100 * Math.sin(time * 4));
        p.strokeWeight(2);
        p.rect(socketX - 2, sy - 2, socketW + 4, socketH + 4, 8);
      }

      // Connection lines
      p.stroke(sock.col[0], sock.col[1], sock.col[2], 30);
      p.strokeWeight(1);
      p.line(tlX + tlW, startY + totalH / 2, socketX, sy + socketH / 2);
    });

    // Animated incoming segments
    const activeIdx = Math.floor(time * 0.8) % sockets.length;
    const activeSock = sockets[activeIdx];

    for (let i = 0; i < 2; i++) {
      const phase = (time * 1.8 + i * 1.2) % 3;

      if (phase < 1) {
        // Segment on the wire coming in
        const px = netX + 10 + phase * (tlX - netX - 30);
        p.fill(activeSock.col[0], activeSock.col[1], activeSock.col[2], 180);
        p.noStroke();
        p.rectMode(p.CENTER);
        p.rect(px, midY, 35, 14, 3);
        p.fill(255);
        p.textSize(6);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`dst:${activeSock.port}`, px, midY);
        p.rectMode(p.CORNER);
      } else if (phase < 2) {
        // Segment being routed inside transport layer
        const targetY = startY + activeIdx * (socketH + gap) + socketH / 2;
        const progress = phase - 1;
        const px = tlX + tlW + 5 + progress * (socketX - tlX - tlW - 10);
        const py = midY + (targetY - midY) * progress;

        p.fill(activeSock.col[0], activeSock.col[1], activeSock.col[2], 200);
        p.noStroke();
        p.rectMode(p.CENTER);
        p.rect(px, py, 18, 12, 3);
        p.fill(255);
        p.textSize(6);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("DATA", px, py);
        p.rectMode(p.CORNER);
      }
    }

    // Inspection box
    const boxY = startY + totalH + 15;
    p.fill(15, 25, 40);
    p.stroke(0, 150, 255, 40);
    p.strokeWeight(1);
    p.rect(tlX - 10, boxY, tlW + 20, 50, 6);

    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Examina porta de destino", tlX + tlW / 2, boxY + 14);
    p.text(`no cabeçalho do segmento`, tlX + tlW / 2, boxY + 26);
    p.fill(activeSock.col[0], activeSock.col[1], activeSock.col[2]);
    p.text(`→ porta ${activeSock.port} → ${activeSock.label}`, tlX + tlW / 2, boxY + 40);

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("A camada de transporte examina a porta de destino e entrega os dados ao socket correto", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

// Visualization 3: UDP Demultiplexing — connectionless, based only on destination port
export function UDPDemultiplexing() {
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
    p.text("Demultiplexação UDP (Sem Conexão)", w / 2, 10);

    // Multiple remote senders on the left
    const senders = [
      { label: "Host A", ip: "10.0.0.1", srcPort: 5000, col: [255, 130, 80] },
      { label: "Host B", ip: "10.0.0.2", srcPort: 7000, col: [180, 100, 255] },
      { label: "Host C", ip: "10.0.0.3", srcPort: 5000, col: [80, 220, 180] },
    ];

    const senderX = 10;
    const senderW = 100;
    const senderH = 55;
    const startY = 35;
    const gap = 15;

    senders.forEach((sender, i) => {
      const sy = startY + i * (senderH + gap);

      p.fill(sender.col[0], sender.col[1], sender.col[2], 20);
      p.stroke(sender.col[0], sender.col[1], sender.col[2], 80);
      p.strokeWeight(1);
      p.rect(senderX, sy, senderW, senderH, 6);

      p.noStroke();
      p.fill(sender.col[0], sender.col[1], sender.col[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(sender.label, senderX + senderW / 2, sy + 12);
      p.fill(80);
      p.textSize(7);
      p.text(`IP: ${sender.ip}`, senderX + senderW / 2, sy + 26);
      p.text(`Porta origem: ${sender.srcPort}`, senderX + senderW / 2, sy + 38);
    });

    // Receiver host on the right
    const recvX = w - 160;
    const recvW = 145;
    const recvH = senders.length * (senderH + gap) - gap + 20;

    p.fill(10, 15, 30);
    p.stroke(0, 200, 150, 80);
    p.strokeWeight(2);
    p.rect(recvX, startY - 10, recvW, recvH, 8);
    p.noStroke();
    p.fill(0, 200, 150);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Host Receptor", recvX + recvW / 2, startY - 6);
    p.fill(70);
    p.textSize(8);
    p.text("IP: 192.168.1.5", recvX + recvW / 2, startY + 8);

    // UDP socket on port 9999 (single socket receiving all)
    const sockY = startY + 30;
    const sockH = recvH - 55;

    p.fill(0, 200, 150, 25);
    p.stroke(0, 200, 150, 80);
    p.strokeWeight(1);
    p.rect(recvX + 15, sockY, recvW - 30, sockH, 6);
    p.noStroke();
    p.fill(0, 200, 150);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Socket UDP", recvX + recvW / 2, sockY + 15);
    p.text("Porta 9999", recvX + recvW / 2, sockY + 30);

    p.fill(80);
    p.textSize(7);
    p.text("Recebe de TODOS", recvX + recvW / 2, sockY + 48);
    p.text("os remetentes", recvX + recvW / 2, sockY + 60);

    // Highlight: only dest port matters
    p.fill(255, 220, 50);
    p.textSize(8);
    p.text("Apenas porta destino", recvX + recvW / 2, sockY + sockH - 30);
    p.text("identifica o socket!", recvX + recvW / 2, sockY + sockH - 18);

    // Animated datagrams from senders to the single socket
    senders.forEach((sender, i) => {
      const sy = startY + i * (senderH + gap) + senderH / 2;
      const targetY = sockY + sockH / 2;

      // Connection line
      p.stroke(sender.col[0], sender.col[1], sender.col[2], 25);
      p.strokeWeight(1);
      p.line(senderX + senderW, sy, recvX + 15, targetY);

      const phase = (time + i * 0.9) % 3;
      if (phase < 1.5) {
        const progress = phase / 1.5;
        const px = senderX + senderW + 5 + progress * (recvX + 10 - senderX - senderW);
        const py = sy + (targetY - sy) * progress;

        p.fill(sender.col[0], sender.col[1], sender.col[2], 200);
        p.noStroke();
        p.rectMode(p.CENTER);
        p.rect(px, py, 44, 16, 3);

        // Show the port info
        p.fill(255);
        p.textSize(5);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`src:${sender.srcPort} dst:9999`, px, py);
        p.rectMode(p.CORNER);
      }
    });

    // Bottom info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("UDP: todos os datagramas com dst porta 9999 vão para o mesmo socket, independente da origem", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={330} />;
}

// Visualization 4: TCP Demultiplexing — connection-oriented, based on 4-tuple
export function TCPDemultiplexing() {
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
    p.text("Demultiplexação TCP (Orientada a Conexão)", w / 2, 10);

    // Multiple remote clients on the left
    const clients = [
      { label: "Cliente A", ip: "10.0.0.1", srcPort: 50001, col: [255, 100, 100] },
      { label: "Cliente B", ip: "10.0.0.2", srcPort: 50002, col: [100, 255, 100] },
      { label: "Cliente C", ip: "10.0.0.1", srcPort: 50003, col: [100, 180, 255] },
    ];

    const clientX = 10;
    const clientW = 105;
    const clientH = 55;
    const startY = 35;
    const gap = 15;

    clients.forEach((client, i) => {
      const sy = startY + i * (clientH + gap);

      p.fill(client.col[0], client.col[1], client.col[2], 20);
      p.stroke(client.col[0], client.col[1], client.col[2], 80);
      p.strokeWeight(1);
      p.rect(clientX, sy, clientW, clientH, 6);

      p.noStroke();
      p.fill(client.col[0], client.col[1], client.col[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(client.label, clientX + clientW / 2, sy + 12);
      p.fill(80);
      p.textSize(7);
      p.text(`IP: ${client.ip}`, clientX + clientW / 2, sy + 26);
      p.text(`Porta: ${client.srcPort}`, clientX + clientW / 2, sy + 38);
    });

    // Server host on the right
    const srvX = w - 195;
    const srvW = 180;
    const srvH = clients.length * (clientH + gap) + 35;

    p.fill(10, 15, 30);
    p.stroke(0, 150, 255, 80);
    p.strokeWeight(2);
    p.rect(srvX, startY - 10, srvW, srvH, 8);
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Servidor Web", srvX + srvW / 2, startY - 6);
    p.fill(70);
    p.textSize(8);
    p.text("IP: 192.168.1.100 | Porta: 80", srvX + srvW / 2, startY + 8);

    // Separate TCP sockets for each connection (4-tuple)
    clients.forEach((client, i) => {
      const sy = startY + 28 + i * (clientH + gap);
      const sockW = srvW - 20;

      p.fill(client.col[0], client.col[1], client.col[2], 20);
      p.stroke(client.col[0], client.col[1], client.col[2], 70);
      p.strokeWeight(1);
      p.rect(srvX + 10, sy, sockW, clientH - 5, 5);

      p.noStroke();
      p.fill(client.col[0], client.col[1], client.col[2]);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`Socket TCP #${i + 1}`, srvX + 10 + sockW / 2, sy + 10);

      p.fill(90);
      p.textSize(6);
      p.text(`4-tupla: (${client.ip}, ${client.srcPort}, 192.168.1.100, 80)`, srvX + 10 + sockW / 2, sy + 24);

      // Animated connection line
      p.stroke(client.col[0], client.col[1], client.col[2], 30);
      p.strokeWeight(1);
      const clientCY = startY + i * (clientH + gap) + clientH / 2;
      p.line(clientX + clientW, clientCY, srvX + 10, sy + (clientH - 5) / 2);

      // Animated segments
      const phase = (time * 1.2 + i * 0.8) % 3;
      if (phase < 1.5) {
        const progress = phase / 1.5;
        const startPx = clientX + clientW + 5;
        const endPx = srvX + 5;
        const px = startPx + progress * (endPx - startPx);
        const py = clientCY + (sy + (clientH - 5) / 2 - clientCY) * progress;

        p.fill(client.col[0], client.col[1], client.col[2], 200);
        p.noStroke();
        p.rectMode(p.CENTER);
        p.rect(px, py, 30, 14, 3);
        p.fill(255);
        p.textSize(5);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`${client.srcPort}→80`, px, py);
        p.rectMode(p.CORNER);
      }
    });

    // 4-tuple highlight box
    const boxY = startY + srvH + 5;
    p.fill(15, 20, 35);
    p.stroke(255, 200, 50, 60);
    p.strokeWeight(1);
    p.rect(20, boxY, w - 40, 48, 6);

    p.noStroke();
    p.fill(255, 200, 50);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("TCP identifica cada conexão pela 4-tupla:", w / 2, boxY + 12);
    p.fill(200);
    p.textSize(10);
    p.text("( IP origem,  Porta origem,  IP destino,  Porta destino )", w / 2, boxY + 30);

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cada conexão TCP gera um socket separado — mesmo com porta destino igual, IPs/portas diferentes = sockets diferentes", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 5: UDP vs TCP Demux comparison — side by side
export function UDPvsTCPDemuxComparison() {
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
    p.text("Comparação: Demultiplexação UDP vs TCP", w / 2, 10);

    const halfW = w / 2 - 10;

    // ---- UDP SIDE (left) ----
    const udpX = 5;

    // UDP label
    p.fill(255, 150, 50);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("UDP", udpX + halfW / 2, 30);
    p.fill(100);
    p.textSize(8);
    p.text("Identifica por: porta destino", udpX + halfW / 2, 46);

    // UDP: 2 senders -> 1 socket
    const udpSenders = [
      { label: "A", ip: "10.0.0.1:5000", col: [255, 130, 80] },
      { label: "B", ip: "10.0.0.2:7000", col: [180, 100, 255] },
    ];

    udpSenders.forEach((s, i) => {
      const sy = 70 + i * 55;
      p.fill(s.col[0], s.col[1], s.col[2], 25);
      p.stroke(s.col[0], s.col[1], s.col[2], 80);
      p.strokeWeight(1);
      p.rect(udpX + 5, sy, 70, 40, 5);
      p.noStroke();
      p.fill(s.col[0], s.col[1], s.col[2]);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`Host ${s.label}`, udpX + 40, sy + 12);
      p.fill(70);
      p.textSize(6);
      p.text(s.ip, udpX + 40, sy + 28);

      // Arrow to single socket
      const targetY = 95;
      p.stroke(s.col[0], s.col[1], s.col[2], 40);
      p.strokeWeight(1);
      p.line(udpX + 75, sy + 20, udpX + halfW - 80, targetY);

      // Animated datagram
      const phase = (time * 1.2 + i) % 2.5;
      if (phase < 1.2) {
        const progress = phase / 1.2;
        const px = udpX + 80 + progress * (halfW - 165);
        const py2 = sy + 20 + (targetY - sy - 20) * progress;
        p.fill(s.col[0], s.col[1], s.col[2], 200);
        p.noStroke();
        p.ellipse(px, py2, 10, 10);
      }
    });

    // Single UDP socket
    p.fill(0, 200, 150, 30);
    p.stroke(0, 200, 150, 100);
    p.strokeWeight(1.5);
    p.rect(udpX + halfW - 75, 70, 70, 50, 6);
    p.noStroke();
    p.fill(0, 200, 150);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("1 Socket", udpX + halfW - 40, 85);
    p.fill(80);
    p.textSize(7);
    p.text("porta 9999", udpX + halfW - 40, 100);

    // UDP result
    p.fill(255, 150, 50, 150);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Mesmo socket para", udpX + halfW / 2, 135);
    p.text("ambos os hosts!", udpX + halfW / 2, 147);

    // ---- Divider ----
    p.stroke(50);
    p.strokeWeight(1);
    for (let y = 30; y < h - 30; y += 8) {
      p.line(w / 2, y, w / 2, y + 4);
    }

    // ---- TCP SIDE (right) ----
    const tcpX = w / 2 + 5;

    // TCP label
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("TCP", tcpX + halfW / 2, 30);
    p.fill(100);
    p.textSize(8);
    p.text("Identifica por: 4-tupla completa", tcpX + halfW / 2, 46);

    // TCP: 2 senders -> 2 separate sockets
    const tcpClients = [
      { label: "A", ip: "10.0.0.1:5000", col: [255, 100, 100] },
      { label: "B", ip: "10.0.0.2:7000", col: [100, 255, 100] },
    ];

    tcpClients.forEach((c, i) => {
      const sy = 70 + i * 55;
      p.fill(c.col[0], c.col[1], c.col[2], 25);
      p.stroke(c.col[0], c.col[1], c.col[2], 80);
      p.strokeWeight(1);
      p.rect(tcpX + 5, sy, 70, 40, 5);
      p.noStroke();
      p.fill(c.col[0], c.col[1], c.col[2]);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`Host ${c.label}`, tcpX + 40, sy + 12);
      p.fill(70);
      p.textSize(6);
      p.text(c.ip, tcpX + 40, sy + 28);

      // Arrow to individual socket
      const targetY = 75 + i * 45;
      p.stroke(c.col[0], c.col[1], c.col[2], 40);
      p.strokeWeight(1);
      p.line(tcpX + 75, sy + 20, tcpX + halfW - 80, targetY);

      // Individual socket
      p.fill(c.col[0], c.col[1], c.col[2], 20);
      p.stroke(c.col[0], c.col[1], c.col[2], 80);
      p.strokeWeight(1);
      p.rect(tcpX + halfW - 75, targetY - 15, 70, 35, 5);
      p.noStroke();
      p.fill(c.col[0], c.col[1], c.col[2]);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`Socket #${i + 1}`, tcpX + halfW - 40, targetY - 2);
      p.fill(70);
      p.textSize(6);
      p.text(`porta 80`, tcpX + halfW - 40, targetY + 10);

      // Animated segment
      const phase = (time * 1.2 + i) % 2.5;
      if (phase < 1.2) {
        const progress = phase / 1.2;
        const px = tcpX + 80 + progress * (halfW - 165);
        const py2 = sy + 20 + (targetY - sy - 20) * progress;
        p.fill(c.col[0], c.col[1], c.col[2], 200);
        p.noStroke();
        p.ellipse(px, py2, 10, 10);
      }
    });

    // TCP result
    p.fill(0, 150, 255, 150);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Socket separado para", tcpX + halfW / 2, 135);
    p.text("cada conexão (4-tupla)!", tcpX + halfW / 2, 147);

    // Bottom comparison
    p.fill(15, 20, 35);
    p.stroke(60);
    p.strokeWeight(1);
    p.rect(10, h - 75, w - 20, 65, 6);

    p.noStroke();
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);

    p.fill(255, 150, 50);
    p.text("UDP: 2-tupla (IP dest, porta dest) → mesmo socket para qualquer remetente", 25, h - 58);
    p.fill(0, 150, 255);
    p.text("TCP: 4-tupla (IP orig, porta orig, IP dest, porta dest) → socket por conexão", 25, h - 42);
    p.fill(150);
    p.text("Consequência: um servidor TCP cria um novo socket para cada cliente conectado!", 25, h - 24);
  };

  return <P5Sketch setup={setup} draw={draw} height={280} />;
}

// Visualization 6: Segment header structure — showing source/destination ports in the segment
export function SegmentHeaderPorts() {
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
    p.text("Campos de Porta no Cabeçalho do Segmento", w / 2, 10);

    const centerX = w / 2;

    // Full segment box
    const segW = Math.min(w - 40, 520);
    const segH = 60;
    const segY = 40;

    // Source port field
    const fieldW = segW / 4;
    const fields = [
      { label: "Porta Origem", value: "49152", color: [255, 100, 100], desc: "(16 bits)" },
      { label: "Porta Destino", value: "80", color: [100, 200, 255], desc: "(16 bits)" },
      { label: "Outros campos...", value: "...", color: [100, 100, 100], desc: "" },
      { label: "Dados", value: "payload", color: [100, 200, 100], desc: "" },
    ];

    fields.forEach((field, i) => {
      const fx = centerX - segW / 2 + i * fieldW;
      const fw = i < 2 ? fieldW : (i === 2 ? fieldW : fieldW);

      p.fill(field.color[0], field.color[1], field.color[2], 25);
      p.stroke(field.color[0], field.color[1], field.color[2], 100);
      p.strokeWeight(1.5);
      const r1 = i === 0 ? 6 : 0;
      const r2 = i === fields.length - 1 ? 6 : 0;
      p.rect(fx, segY, fw, segH, r1, r2, r2, r1);

      p.noStroke();
      p.fill(field.color[0], field.color[1], field.color[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(field.label, fx + fw / 2, segY + 16);

      p.fill(255);
      p.textSize(12);
      p.text(field.value, fx + fw / 2, segY + 35);

      if (field.desc) {
        p.fill(70);
        p.textSize(7);
        p.text(field.desc, fx + fw / 2, segY + 50);
      }
    });

    // Highlight animation on key fields
    const highlight = Math.floor(time * 0.6) % 2;
    const hx = centerX - segW / 2 + highlight * fieldW;
    p.noFill();
    p.stroke(fields[highlight].color[0], fields[highlight].color[1], fields[highlight].color[2], 100 + 100 * Math.sin(time * 3));
    p.strokeWeight(3);
    p.rect(hx - 1, segY - 1, fieldW + 2, segH + 2, 6);

    // Explanation section
    const explY = segY + segH + 25;

    // Port origin explanation
    p.noStroke();
    p.fill(255, 100, 100);
    p.textSize(10);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Porta Origem (Source Port):", 30, explY);
    p.fill(150);
    p.textSize(9);
    p.text("• Identifica o processo remetente no host de origem", 30, explY + 16);
    p.text("• Usada pelo receptor como endereço de retorno", 30, explY + 30);

    // Port dest explanation
    p.fill(100, 200, 255);
    p.textSize(10);
    p.text("Porta Destino (Destination Port):", 30, explY + 55);
    p.fill(150);
    p.textSize(9);
    p.text("• Identifica o processo destinatário no host receptor", 30, explY + 71);
    p.text("• Campo-chave para a demultiplexação (direcionar ao socket correto)", 30, explY + 85);

    // Multiplexing role
    p.fill(255, 200, 50);
    p.textSize(10);
    p.text("Papel na Mux/Demux:", 30, explY + 110);
    p.fill(150);
    p.textSize(9);
    p.text("• Multiplexação (emissor): adiciona porta origem + porta destino ao segmento", 30, explY + 126);
    p.text("• Demultiplexação (receptor): examina porta destino para entregar ao socket correto", 30, explY + 140);

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Os campos de porta (16 bits cada) permitem endereçar até 65.536 processos distintos por host", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

