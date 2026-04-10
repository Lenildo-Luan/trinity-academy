"use client";

import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

type RouteEntry = {
  prefix: string;
  iface: string;
  bits: number;
  base: number;
};

type CidrScenario = {
  destination: string;
};

function ipToOctets(ip: string): [number, number, number, number] {
  const parts = ip.split(".").map((part) => Number(part));
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, parts[3] ?? 0];
}


function ipToNumber(ip: string): number {
  const [a, b, c, d] = ipToOctets(ip);
  return (((a << 24) >>> 0) | (b << 16) | (c << 8) | d) >>> 0;
}

function numberToIp(value: number): string {
  const a = (value >>> 24) & 255;
  const b = (value >>> 16) & 255;
  const c = (value >>> 8) & 255;
  const d = value & 255;
  return `${a}.${b}.${c}.${d}`;
}

function maskFromPrefix(bits: number): number {
  if (bits <= 0) return 0;
  if (bits >= 32) return 0xffffffff >>> 0;
  return (0xffffffff << (32 - bits)) >>> 0;
}

function ipToBitArray(ip: string): number[] {
  return ipToOctets(ip)
    .map((octet) => octet.toString(2).padStart(8, "0"))
    .join("")
    .split("")
    .map((bit) => Number(bit));
}

function drawTitle(p: p5, title: string) {
  p.noStroke();
  p.fill(215);
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(13);
  p.text(title, p.width / 2, 8);
}

type HeaderField = {
  label: string;
  bits: number;
  color: [number, number, number];
};

function drawHeaderRow(
  p: p5,
  x: number,
  y: number,
  w: number,
  h: number,
  row: HeaderField[],
  activeIndex: number,
  rowOffset: number,
) {
  let cursor = x;
  row.forEach((field, index) => {
    const fieldW = (field.bits / 32) * w;
    const absoluteIndex = rowOffset + index;
    const isActive = absoluteIndex === activeIndex;
    const alpha = isActive ? 220 : 160;

    p.stroke(field.color[0], field.color[1], field.color[2], isActive ? 230 : 145);
    p.fill(16, 24, 42, alpha);
    p.rect(cursor, y, fieldW, h, 4);

    p.noStroke();
    p.fill(field.color[0], field.color[1], field.color[2]);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(9);
    const text = field.bits <= 4 ? field.label : `${field.label} (${field.bits}b)`;
    p.text(text, cursor + fieldW / 2, y + h / 2 + 0.5);

    cursor += fieldW;
  });
}

export function IPv4HeaderDiagram() {
  const rows: HeaderField[][] = [
    [
      { label: "Version", bits: 4, color: [120, 220, 255] },
      { label: "IHL", bits: 4, color: [120, 220, 255] },
      { label: "ToS", bits: 8, color: [255, 188, 90] },
      { label: "Total Length", bits: 16, color: [150, 235, 150] },
    ],
    [
      { label: "Identification", bits: 16, color: [195, 160, 255] },
      { label: "Flags", bits: 3, color: [255, 125, 125] },
      { label: "Fragment Offset", bits: 13, color: [255, 145, 145] },
    ],
    [
      { label: "TTL", bits: 8, color: [255, 205, 100] },
      { label: "Protocol", bits: 8, color: [255, 205, 100] },
      { label: "Header Checksum", bits: 16, color: [130, 230, 185] },
    ],
    [{ label: "Source Address", bits: 32, color: [120, 190, 255] }],
    [{ label: "Destination Address", bits: 32, color: [120, 190, 255] }],
    [{ label: "Options (optional)", bits: 32, color: [170, 170, 170] }],
    [{ label: "Data (payload)", bits: 32, color: [105, 225, 145] }],
  ];

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Estrutura do Datagrama IPv4 (32 bits por linha)");

    const marginX = 24;
    const contentW = p.width - marginX * 2;
    const yStart = 52;
    const rowH = 24;
    const gap = 10;

    p.noStroke();
    p.fill(150);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text("bit 0", marginX, yStart - 16);
    p.textAlign(p.RIGHT, p.TOP);
    p.text("bit 31", marginX + contentW, yStart - 16);

    const totalFields = rows.reduce((sum, row) => sum + row.length, 0);
    const activeField = Math.floor(p.frameCount / 90) % totalFields;

    let rowOffset = 0;
    rows.forEach((row, rowIndex) => {
      const y = yStart + rowIndex * (rowH + gap);
      drawHeaderRow(p, marginX, y, contentW, rowH, row, activeField, rowOffset);
      rowOffset += row.length;
    });

    p.noStroke();
    p.fill(125);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text("Cabecalho minimo: 20 bytes (IHL=5). Campo Options expande o cabecalho.", marginX, p.height - 26);
  };

  return <P5Sketch setup={setup} draw={draw} height={300} />;
}

function drawBitRow(
  p: p5,
  y: number,
  label: string,
  bits: number[],
  maskBits: number[],
  colorizer: (idx: number, bit: number) => [number, number, number, number],
) {
  const startX = 150;
  const cellW = 14;
  const cellH = 16;

  p.noStroke();
  p.fill(170);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(10);
  p.text(label, 22, y + cellH / 2);

  bits.forEach((bit, idx) => {
    const x = startX + idx * cellW;
    const [r, g, b, a] = colorizer(idx, bit);
    p.fill(r, g, b, a);
    p.rect(x, y, cellW - 2, cellH, 2);

    p.fill(232);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(9);
    p.text(String(bit), x + (cellW - 2) / 2, y + cellH / 2 + 0.5);

    if ((idx + 1) % 8 === 0 && idx < 31) {
      p.noStroke();
      p.fill(95);
      p.textSize(11);
      p.text(".", x + cellW + 1, y + cellH / 2 + 1);
    }

    if (maskBits[idx] === 0) {
      p.noFill();
      p.stroke(255, 120, 120, 80);
      p.rect(x, y, cellW - 2, cellH, 2);
    }
  });
}

export function BitwiseAndMaskVisualizer() {
  const scenarios = [
    { ip: "192.168.1.100", prefix: 24 },
    { ip: "172.16.45.200", prefix: 20 },
    { ip: "10.10.10.222", prefix: 26 },
  ];

  let scenarioIndex = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "IP AND Mascara = Endereco de Rede");

    if (p.frameCount % 210 === 0) {
      scenarioIndex = (scenarioIndex + 1) % scenarios.length;
    }

    const scenario = scenarios[scenarioIndex];
    const ipNum = ipToNumber(scenario.ip);
    const mask = maskFromPrefix(scenario.prefix);
    const network = ipNum & mask;

    const ipBits = ipToBitArray(scenario.ip);
    const maskBits = ipToBitArray(numberToIp(mask));
    const netBits = ipToBitArray(numberToIp(network));

    p.noStroke();
    p.fill(155);
    p.textSize(10);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`IP: ${scenario.ip}`, 22, 40);
    p.text(`Mascara: ${numberToIp(mask)} (/${scenario.prefix})`, 22, 56);
    p.text(`Rede: ${numberToIp(network)}`, 22, 72);

    drawBitRow(
      p,
      102,
      "IP",
      ipBits,
      maskBits,
      (idx, bit) => (maskBits[idx] ? [65, 125, 255, bit ? 170 : 95] : [80, 90, 105, 140]),
    );

    drawBitRow(
      p,
      132,
      "MASK",
      maskBits,
      maskBits,
      (_idx, bit) => (bit ? [255, 184, 60, 180] : [96, 96, 96, 125]),
    );

    drawBitRow(
      p,
      162,
      "AND",
      netBits,
      maskBits,
      (idx, bit) => (maskBits[idx] ? [100, 220, 140, bit ? 180 : 105] : [65, 90, 75, 140]),
    );

    p.fill(130);
    p.textSize(9);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Bits de host (mask=0) sao zerados no resultado.", 22, 196);

    p.fill(120);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(`Cenario ${scenarioIndex + 1}/${scenarios.length}`, p.width / 2, p.height - 10);
  };

  return <P5Sketch setup={setup} draw={draw} height={240} />;
}

export function CIDRAggregationVisualizer() {
  let collapsed = false;

  const routes = Array.from({ length: 8 }).map((_, idx) => `200.1.${idx}.0/24`);

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Agregacao CIDR: 8 rotas /24 -> 1 rota /21");

    if (p.frameCount % 220 === 0) {
      collapsed = !collapsed;
    }

    p.noStroke();
    p.fill(160);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text("ISP local anuncia redes contiguas. Agregacao reduz tabela global.", 24, 38);

    const baseX = 36;
    const baseY = 70;
    const rowH = 24;
    const collapsedX = p.width - 250;

    routes.forEach((route, idx) => {
      const y = baseY + idx * rowH;
      const t = collapsed ? 1 : 0;
      const x = baseX + t * (collapsedX - baseX);
      const alpha = collapsed ? Math.max(40, 190 - idx * 18) : 175;

      p.stroke(90, 150, 250, alpha);
      p.fill(16, 24, 43, alpha);
      p.rect(x, y, 180, 18, 4);

      p.noStroke();
      p.fill(220, 220, 230, alpha);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(9);
      p.text(route, x + 8, y + 9);
    });

    p.stroke(130, 215, 140, 210);
    p.fill(16, 34, 26, 210);
    p.rect(p.width - 250, 130, 210, 38, 6);

    p.noStroke();
    p.fill(140, 240, 160);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(11);
    p.text("200.1.0.0/21", p.width - 145, 145);

    p.fill(150);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(collapsed ? "Estado: agregado (1 entrada)" : "Estado: detalhado (8 entradas)", 24, p.height - 36);

    p.textAlign(p.RIGHT, p.TOP);
    p.text(`Economia: ${collapsed ? "87.5%" : "0%"}`, p.width - 24, p.height - 36);
  };

  return <P5Sketch setup={setup} draw={draw} height={250} />;
}

type FragmentInfo = {
  payloadStart: number;
  payloadSize: number;
  totalLength: number;
  offset: number;
  mf: 0 | 1;
};

function fragmentDatagram(totalLength: number, mtu: number, header = 20): FragmentInfo[] {
  const payload = Math.max(0, totalLength - header);
  const maxPayloadPerFragment = Math.max(8, Math.floor((mtu - header) / 8) * 8);
  const fragments: FragmentInfo[] = [];

  let cursor = 0;
  while (cursor < payload) {
    const remaining = payload - cursor;
    const payloadSize = remaining > maxPayloadPerFragment ? maxPayloadPerFragment : remaining;
    const mf: 0 | 1 = cursor + payloadSize < payload ? 1 : 0;
    fragments.push({
      payloadStart: cursor,
      payloadSize,
      totalLength: payloadSize + header,
      offset: Math.floor(cursor / 8),
      mf,
    });
    cursor += payloadSize;
  }

  return fragments;
}

export function IPv4FragmentationSimulator() {
  const scenarios = [
    { totalLength: 4000, mtu: 1500 },
    { totalLength: 3000, mtu: 1200 },
    { totalLength: 2200, mtu: 1000 },
  ];

  let scenarioIndex = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Fragmentacao IPv4 por MTU");

    if (p.frameCount % 230 === 0) {
      scenarioIndex = (scenarioIndex + 1) % scenarios.length;
    }

    const { totalLength, mtu } = scenarios[scenarioIndex];
    const frags = fragmentDatagram(totalLength, mtu);

    p.noStroke();
    p.fill(160);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(`Datagrama total: ${totalLength} bytes`, 24, 40);
    p.text(`MTU do link: ${mtu} bytes`, 24, 56);
    p.text(`Fragmentos: ${frags.length}`, 24, 72);

    const maxW = p.width - 70;
    const originalW = (totalLength / Math.max(totalLength, mtu)) * maxW;

    p.stroke(95, 145, 220, 140);
    p.fill(15, 25, 44);
    p.rect(24, 94, originalW, 18, 4);
    p.noStroke();
    p.fill(220);
    p.textSize(9);
    p.text("Datagrama original", 30, 98);

    const y0 = 130;
    frags.forEach((fragment, idx) => {
      const width = (fragment.totalLength / Math.max(totalLength, mtu)) * maxW;
      const y = y0 + idx * 30;
      p.stroke(120, 220, 150, 160);
      p.fill(13, 34, 24);
      p.rect(24, y, width, 18, 4);

      p.noStroke();
      p.fill(165, 235, 175);
      p.textSize(9);
      p.text(
        `Frag ${idx + 1}: len=${fragment.totalLength}  offset=${fragment.offset}  MF=${fragment.mf}`,
        30,
        y + 4,
      );
    });

    p.fill(130);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text("Offset em unidades de 8 bytes. Ultimo fragmento tem MF=0.", 24, p.height - 22);
  };

  return <P5Sketch setup={setup} draw={draw} height={250} />;
}

export function TTLHopsSimulator() {
  const scenarios = [
    { ttl: 5, hopsNeeded: 8 },
    { ttl: 10, hopsNeeded: 8 },
  ];

  let scenarioIndex = 0;
  let hop = 0;
  let packetX = 0;
  let status = "";

  const setup = (p: p5) => {
    p.textFont("monospace");
    packetX = 70;
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "TTL por salto (hops)");

    const scenario = scenarios[scenarioIndex];
    const pathStartX = 70;
    const pathEndX = p.width - 70;
    const y = 125;

    p.stroke(70, 100, 150, 140);
    p.strokeWeight(1.3);
    p.line(pathStartX, y, pathEndX, y);

    const nodes = scenario.hopsNeeded + 1;
    const step = (pathEndX - pathStartX) / (nodes - 1);

    for (let i = 0; i < nodes; i += 1) {
      const x = pathStartX + i * step;
      const isDest = i === nodes - 1;
      p.noStroke();
      p.fill(isDest ? 240 : 120, isDest ? 190 : 200, isDest ? 90 : 255, isDest ? 230 : 170);
      p.circle(x, y, 16);

      p.fill(180);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(8);
      p.text(isDest ? "Destino" : `R${i}`, x, y + 12);
    }

    if (p.frameCount % 55 === 0) {
      hop += 1;
      if (hop > scenario.hopsNeeded) {
        scenarioIndex = (scenarioIndex + 1) % scenarios.length;
        hop = 0;
        packetX = pathStartX;
      }
    }

    const ttlRemaining = scenario.ttl - hop;
    packetX = Math.min(pathEndX, pathStartX + hop * step);

    if (ttlRemaining <= 0 && hop < scenario.hopsNeeded) {
      status = "TTL expirou: roteador descarta pacote e envia ICMP Time Exceeded";
    } else if (hop >= scenario.hopsNeeded) {
      status = "Pacote chegou ao destino";
    } else {
      status = "Pacote em transito";
    }

    p.noStroke();
    p.fill(ttlRemaining <= 0 ? 255 : 120, ttlRemaining <= 0 ? 90 : 220, 120, 230);
    p.rect(packetX - 8, y - 7, 16, 14, 3);

    p.fill(220);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(9);
    p.text(`TTL atual: ${Math.max(0, ttlRemaining)}`, packetX, y - 10);

    p.fill(150);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(`TTL inicial: ${scenario.ttl} | Hops necessarios: ${scenario.hopsNeeded}`, 24, 42);
    p.text(status, 24, 58);
  };

  return <P5Sketch setup={setup} draw={draw} height={220} />;
}

function parseRoute(prefix: string, iface: string): RouteEntry {
  const [baseIp, bitText] = prefix.split("/");
  const bits = Number(bitText ?? "0");
  const mask = maskFromPrefix(bits);
  return {
    prefix,
    iface,
    bits,
    base: ipToNumber(baseIp) & mask,
  };
}

function matchesRoute(destination: number, route: RouteEntry): boolean {
  const mask = maskFromPrefix(route.bits);
  return (destination & mask) === route.base;
}

export function CIDRLongestPrefixMatchVisualizer() {
  const routes: RouteEntry[] = [
    parseRoute("10.0.0.0/8", "0"),
    parseRoute("10.1.0.0/16", "1"),
    parseRoute("10.1.64.0/18", "4"),
    parseRoute("10.1.1.0/24", "2"),
    parseRoute("0.0.0.0/0", "3"),
  ];

  const scenarios: CidrScenario[] = [
    { destination: "10.1.1.50" },
    { destination: "10.1.70.9" },
    { destination: "10.9.2.8" },
    { destination: "11.0.0.4" },
  ];

  let scenarioIndex = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "LPM com prefixos CIDR");

    if (p.frameCount % 180 === 0) {
      scenarioIndex = (scenarioIndex + 1) % scenarios.length;
    }

    const destination = scenarios[scenarioIndex].destination;
    const destinationNum = ipToNumber(destination);
    const matched = routes.filter((route) => matchesRoute(destinationNum, route));
    const winner = matched.reduce((best, route) => (route.bits > best.bits ? route : best), matched[0]);

    p.noStroke();
    p.fill(165);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(`Destino: ${destination}`, 24, 38);
    p.text("Regra: rota vencedora = maior prefixo que casa", 24, 54);

    const rowX = 24;
    const rowY = 82;
    const rowW = p.width - 48;
    const rowH = 34;

    routes.forEach((route, index) => {
      const y = rowY + index * 42;
      const isMatch = matchesRoute(destinationNum, route);
      const isWinner = isMatch && route.prefix === winner.prefix;

      p.stroke(isWinner ? 120 : 85, isWinner ? 230 : 120, isWinner ? 120 : 150, isWinner ? 210 : 95);
      p.fill(14, 22, 39);
      p.rect(rowX, y, rowW, rowH, 6);

      p.noStroke();
      p.fill(220);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(10);
      p.text(`${route.prefix} -> if${route.iface}`, rowX + 10, y + 17);

      p.fill(isWinner ? 135 : isMatch ? 205 : 115, isWinner ? 240 : isMatch ? 210 : 115, isWinner ? 135 : 115);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(
        isWinner ? `MATCH ${route.bits} (winner)` : isMatch ? `MATCH ${route.bits}` : "no match",
        rowX + rowW - 10,
        y + 17,
      );
    });

    p.noStroke();
    p.fill(130);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(`Saida escolhida: interface ${winner.iface} (${winner.prefix})`, p.width / 2, p.height - 10);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

