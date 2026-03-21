"use client";

import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

type Vec2 = { x: number; y: number };

type DHCPStep = {
  label: string;
  from: "client" | "server";
  to: "client" | "server";
  color: [number, number, number];
  detail: string;
};

function drawTitle(p: p5, title: string) {
  p.noStroke();
  p.fill(220);
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(13);
  p.text(title, p.width / 2, 8);
}

function drawNode(p: p5, pos: Vec2, label: string, subLabel: string, color: [number, number, number]) {
  p.stroke(color[0], color[1], color[2], 170);
  p.fill(14, 20, 34);
  p.strokeWeight(1.6);
  p.rect(pos.x - 88, pos.y - 28, 176, 56, 8);

  p.noStroke();
  p.fill(color[0], color[1], color[2]);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(10);
  p.text(label, pos.x, pos.y - 8);

  p.fill(180);
  p.textSize(9);
  p.text(subLabel, pos.x, pos.y + 10);
}

export function DhcpDoraSimulator() {
  const steps: DHCPStep[] = [
    {
      label: "DISCOVER",
      from: "client",
      to: "server",
      color: [255, 95, 95],
      detail: "0.0.0.0 -> 255.255.255.255",
    },
    {
      label: "OFFER",
      from: "server",
      to: "client",
      color: [255, 190, 80],
      detail: "oferta: 192.168.1.100 /24",
    },
    {
      label: "REQUEST",
      from: "client",
      to: "server",
      color: [120, 220, 140],
      detail: "confirmo 192.168.1.100",
    },
    {
      label: "ACK",
      from: "server",
      to: "client",
      color: [120, 170, 255],
      detail: "lease 24h + gateway + DNS",
    },
  ];

  let stepIndex = 0;
  let t = 0;
  const speed = 0.012;
  const pauseFrames = 44;
  let pauseCounter = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    const client = { x: p.width * 0.2, y: 136 };
    const server = { x: p.width * 0.8, y: 136 };

    p.background(2, 7, 19);
    drawTitle(p, "DHCP DORA: Discover -> Offer -> Request -> ACK");

    const current = steps[stepIndex];

    if (t < 1) {
      t += speed * (p.deltaTime / 16.67);
      if (t > 1) t = 1;
    } else {
      pauseCounter += 1;
      if (pauseCounter >= pauseFrames) {
        pauseCounter = 0;
        t = 0;
        stepIndex = (stepIndex + 1) % steps.length;
      }
    }

    const source = current.from === "client" ? client : server;
    const target = current.to === "client" ? client : server;

    p.stroke(75, 95, 130, 130);
    p.strokeWeight(2);
    p.line(client.x + 88, client.y, server.x - 88, server.y);

    drawNode(
      p,
      client,
      "Cliente DHCP",
      stepIndex === 3 && t > 0.6 ? "IP: 192.168.1.100" : "IP: 0.0.0.0",
      [110, 195, 255],
    );
    drawNode(p, server, "Servidor DHCP", "Pool: 192.168.1.100-115", [140, 235, 140]);

    const px = p.lerp(source.x, target.x, t);
    const py = p.lerp(source.y, target.y, t);

    p.noStroke();
    p.fill(current.color[0], current.color[1], current.color[2]);
    p.rectMode(p.CENTER);
    p.rect(px, py, 22, 14, 3);
    p.rectMode(p.CORNER);

    p.noStroke();
    p.fill(220);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(11);
    p.text(current.label, p.width / 2, 184);
    p.fill(150);
    p.textSize(9);
    p.text(current.detail, p.width / 2, 200);

    const barX = 42;
    const barY = 226;
    const stepW = (p.width - 84) / steps.length;

    steps.forEach((step, i) => {
      const isActive = i === stepIndex;
      p.stroke(step.color[0], step.color[1], step.color[2], isActive ? 220 : 90);
      p.fill(12, 18, 30);
      p.rect(barX + i * stepW, barY, stepW - 6, 32, 6);
      p.noStroke();
      p.fill(isActive ? 230 : 140);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(step.label, barX + i * stepW + (stepW - 6) / 2, barY + 16);
    });
  };

  return <P5Sketch setup={setup} draw={draw} height={270} />;
}

type TimelineRow = {
  tempo: string;
  cliente: string;
  servidor: string;
  evento: string;
  color: [number, number, number];
};

export function DhcpDoraTimelineVisualizer() {
  const rows: TimelineRow[] = [
    {
      tempo: "0ms",
      cliente: "0.0.0.0",
      servidor: "BROADCAST",
      evento: "DISCOVER",
      color: [255, 95, 95],
    },
    {
      tempo: "50ms",
      cliente: "0.0.0.0",
      servidor: "192.168.1.1",
      evento: "OFFER",
      color: [255, 190, 80],
    },
    {
      tempo: "100ms",
      cliente: "0.0.0.0",
      servidor: "BROADCAST",
      evento: "REQUEST",
      color: [120, 220, 140],
    },
    {
      tempo: "150ms",
      cliente: "192.168.1.100",
      servidor: "192.168.1.1",
      evento: "ACK",
      color: [120, 170, 255],
    },
  ];

  let phase = 0;
  let markerT = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Timeline DHCP DORA (baseada no diagrama da tabela)");

    markerT += 0.014 * (p.deltaTime / 16.67);
    if (markerT >= 1) {
      markerT = 0;
      phase = (phase + 1) % rows.length;
    }

    const tableX = 20;
    const tableY = 42;
    const tableW = p.width - 40;
    const rowH = 32;
    const headerH = 28;

    const colTempo = 70;
    const colCliente = 130;
    const colServidor = 140;
    const colEvento = tableW - colTempo - colCliente - colServidor;

    p.stroke(100, 125, 170, 140);
    p.fill(10, 16, 28, 236);
    p.rect(tableX, tableY, tableW, headerH + rows.length * rowH + 18, 8);

    const drawCellText = (text: string, x: number, y: number, w: number, h: number, color: number[]) => {
      p.noStroke();
      p.fill(color[0], color[1], color[2]);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(9);
      p.text(text, x + 8, y + h / 2);
    };

    const headerY = tableY + 6;
    p.noStroke();
    p.fill(200);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(9);
    p.text("Tempo", tableX + 8, headerY + 10);
    p.text("Cliente", tableX + colTempo + 8, headerY + 10);
    p.text("Servidor", tableX + colTempo + colCliente + 8, headerY + 10);
    p.text("Evento", tableX + colTempo + colCliente + colServidor + 8, headerY + 10);

    for (let i = 0; i <= rows.length; i += 1) {
      const y = tableY + headerH + i * rowH;
      p.stroke(80, 100, 140, 120);
      p.line(tableX, y, tableX + tableW, y);
    }

    const separators = [
      tableX + colTempo,
      tableX + colTempo + colCliente,
      tableX + colTempo + colCliente + colServidor,
    ];
    separators.forEach((x) => {
      p.stroke(80, 100, 140, 120);
      p.line(x, tableY + 2, x, tableY + headerH + rows.length * rowH);
    });

    rows.forEach((row, i) => {
      const y = tableY + headerH + i * rowH;
      const active = i === phase;

      if (active) {
        p.noStroke();
        p.fill(row.color[0], row.color[1], row.color[2], 45);
        p.rect(tableX + 1, y + 1, tableW - 2, rowH - 2, 4);
      }

      drawCellText(row.tempo, tableX, y, colTempo, rowH, active ? [230, 230, 230] : [165, 165, 165]);
      drawCellText(row.cliente, tableX + colTempo, y, colCliente, rowH, active ? [230, 230, 230] : [165, 165, 165]);
      drawCellText(row.servidor, tableX + colTempo + colCliente, y, colServidor, rowH, active ? [230, 230, 230] : [165, 165, 165]);
      drawCellText(row.evento, tableX + colTempo + colCliente + colServidor, y, colEvento, rowH, active ? [row.color[0], row.color[1], row.color[2]] : [165, 165, 165]);
    });

    const current = rows[phase];
    const markerY = tableY + headerH + phase * rowH + rowH / 2;
    const markerStartX = tableX + colTempo + colCliente + colServidor + 16;
    const markerEndX = tableX + tableW - 16;
    const markerX = p.lerp(markerStartX, markerEndX, markerT);

    p.noStroke();
    p.fill(current.color[0], current.color[1], current.color[2]);
    p.circle(markerX, markerY, 8);

    p.fill(145);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text(`Evento ativo: ${current.tempo} - ${current.evento}`, tableX, p.height - 32);
    p.text("Sequencia: DISCOVER -> OFFER -> REQUEST -> ACK", tableX, p.height - 18);
  };

  return <P5Sketch setup={setup} draw={draw} height={250} />;
}

type HierarchyLevel = {
  name: string;
  subtitle: string;
  color: [number, number, number];
};

export function AddressAllocationHierarchyVisualizer() {
  const levels: HierarchyLevel[] = [
    { name: "ICANN / IANA", subtitle: "aloca blocos globais", color: [120, 220, 255] },
    { name: "RIRs", subtitle: "ARIN, LACNIC, RIPE, APNIC, AFRINIC", color: [150, 235, 150] },
    { name: "ISPs / LIRs", subtitle: "alocam para empresas e universidades", color: [255, 200, 120] },
    { name: "DHCP Local", subtitle: "aloca hosts na LAN", color: [200, 170, 255] },
  ];

  let pulse = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Hierarquia de Alocacao: ICANN -> RIRs -> ISPs -> DHCP");

    pulse += 0.02 * (p.deltaTime / 16.67);
    const yBase = 56;
    const rowGap = 56;

    levels.forEach((level, i) => {
      const y = yBase + i * rowGap;
      const width = p.width - 80 - i * 56;
      const x = (p.width - width) / 2;
      const active = Math.floor(pulse) % levels.length === i;

      p.stroke(level.color[0], level.color[1], level.color[2], active ? 230 : 110);
      p.fill(14, 20, 34, active ? 230 : 190);
      p.strokeWeight(active ? 2 : 1.2);
      p.rect(x, y, width, 42, 8);

      p.noStroke();
      p.fill(level.color[0], level.color[1], level.color[2]);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(10);
      p.text(level.name, p.width / 2, y + 8);
      p.fill(160);
      p.textSize(9);
      p.text(level.subtitle, p.width / 2, y + 22);

      if (i < levels.length - 1) {
        const nextY = y + rowGap;
        const progress = Math.min(1, Math.max(0, pulse - i));
        const arrowY = p.lerp(y + 42, nextY - 8, progress);

        p.stroke(110, 150, 210, 120);
        p.line(p.width / 2, y + 42, p.width / 2, nextY - 8);

        p.noStroke();
        p.fill(120, 200, 255, 200);
        p.triangle(p.width / 2 - 5, arrowY - 2, p.width / 2 + 5, arrowY - 2, p.width / 2, arrowY + 6);
      }
    });

    p.noStroke();
    p.fill(145);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(9);
    p.text("Exemplo: 200.0.0.0/8 -> 200.1.0.0/16 -> 200.1.50.0/24 -> 200.1.50.100", p.width / 2, p.height - 10);
  };

  return <P5Sketch setup={setup} draw={draw} height={292} />;
}

type PoolSlot = {
  ip: string;
  owner: number | null;
};

type Client = {
  id: number;
  connected: boolean;
  leaseSlot: number | null;
  leaseRemaining: number;
};

export function DhcpPoolAllocatorSimulator() {
  const pool: PoolSlot[] = Array.from({ length: 16 }, (_, i) => ({
    ip: `192.168.1.${100 + i}`,
    owner: null,
  }));

  const clients: Client[] = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    connected: i < 3,
    leaseSlot: null,
    leaseRemaining: 0,
  }));

  let failures = 0;

  const colorForClient = (id: number): [number, number, number] => {
    const palette: Array<[number, number, number]> = [
      [120, 205, 255],
      [255, 195, 120],
      [140, 230, 150],
      [205, 170, 255],
      [255, 140, 150],
      [145, 230, 230],
    ];
    return palette[(id - 1) % palette.length];
  };

  const releaseLease = (client: Client) => {
    if (client.leaseSlot !== null) {
      pool[client.leaseSlot].owner = null;
      client.leaseSlot = null;
    }
    client.leaseRemaining = 0;
  };

  const allocateLease = (client: Client) => {
    const freeSlot = pool.findIndex((slot) => slot.owner === null);
    if (freeSlot < 0) {
      failures += 1;
      return;
    }
    pool[freeSlot].owner = client.id;
    client.leaseSlot = freeSlot;
    client.leaseRemaining = 420;
  };

  const setup = (p: p5) => {
    p.textFont("monospace");
    clients.forEach((client) => {
      if (client.connected) allocateLease(client);
    });
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Pool DHCP: alocacao e reciclagem de leases");

    if (p.frameCount % 90 === 0) {
      const randomClient = clients[Math.floor(Math.random() * clients.length)];
      if (randomClient.connected && Math.random() < 0.5) {
        randomClient.connected = false;
        releaseLease(randomClient);
      } else if (!randomClient.connected) {
        randomClient.connected = true;
        allocateLease(randomClient);
      }
    }

    clients.forEach((client) => {
      if (client.connected) {
        client.leaseRemaining -= 1;
        if (client.leaseRemaining <= 0) {
          releaseLease(client);
          allocateLease(client);
        }
      }
    });

    const startX = 44;
    const startY = 56;
    const cellW = 130;
    const cellH = 34;

    pool.forEach((slot, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = startX + col * (cellW + 10);
      const y = startY + row * (cellH + 10);

      const owner = slot.owner;
      const color = owner ? colorForClient(owner) : ([110, 120, 140] as [number, number, number]);

      p.stroke(color[0], color[1], color[2], owner ? 220 : 80);
      p.fill(14, 20, 34);
      p.rect(x, y, cellW, cellH, 6);

      p.noStroke();
      p.fill(210);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(9);
      p.text(slot.ip, x + 8, y + 11);
      p.fill(owner ? color[0] : 140, owner ? color[1] : 140, owner ? color[2] : 140);
      p.text(owner ? `host ${owner}` : "livre", x + 8, y + 23);
    });

    p.noStroke();
    p.fill(150);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);

    const used = pool.filter((slot) => slot.owner !== null).length;
    const connected = clients.filter((client) => client.connected).length;
    p.text(`Leases ativos: ${used}/16`, 44, p.height - 46);
    p.text(`Clientes conectados: ${connected}/6`, 44, p.height - 32);
    p.text(`Falhas por pool cheio: ${failures}`, 220, p.height - 46);
  };

  return <P5Sketch setup={setup} draw={draw} height={288} />;
}

type NatFlow = {
  hostIndex: number;
  t: number;
  stage: "toRouter" | "toInternet" | "backToRouter" | "toHost";
  natPort: number;
};

type NatEntry = {
  privateIp: string;
  privatePort: number;
  publicPort: number;
  ttl: number;
};

export function NatTranslationSimulator() {
  const privateIps = [
    "192.168.1.100",
    "192.168.1.101",
    "192.168.1.102",
    "192.168.1.103",
    "192.168.1.104",
  ];

  const hostColors: Array<[number, number, number]> = [
    [120, 205, 255],
    [255, 200, 120],
    [150, 230, 150],
    [205, 170, 255],
    [255, 150, 160],
  ];

  let nextPort = 40000;
  let flows: NatFlow[] = [];
  const table: NatEntry[] = [];

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "NAT: varios hosts privados compartilhando 1 IP publico");

    const hosts = privateIps.map((_, i) => ({ x: 86, y: 62 + i * 42 }));
    const router = { x: p.width * 0.48, y: 146 };
    const internet = { x: p.width * 0.84, y: 146 };

    if (p.frameCount % 72 === 0) {
      const hostIndex = Math.floor(Math.random() * privateIps.length);
      const natPort = nextPort;
      nextPort += 1;

      flows.push({ hostIndex, t: 0, stage: "toRouter", natPort });

      table.unshift({
        privateIp: privateIps[hostIndex],
        privatePort: 52000 + hostIndex,
        publicPort: natPort,
        ttl: 620,
      });
      if (table.length > 6) table.pop();
    }

    table.forEach((entry) => {
      entry.ttl -= 1;
    });
    while (table.length > 0 && table[table.length - 1].ttl <= 0) {
      table.pop();
    }

    p.stroke(80, 100, 140, 120);
    p.strokeWeight(1.5);
    hosts.forEach((host) => p.line(host.x + 62, host.y, router.x - 58, router.y));
    p.line(router.x + 58, router.y, internet.x - 58, internet.y);

    hosts.forEach((host, i) => {
      const color = hostColors[i];
      p.stroke(color[0], color[1], color[2], 150);
      p.fill(14, 20, 34);
      p.rect(host.x - 62, host.y - 14, 124, 28, 6);
      p.noStroke();
      p.fill(color[0], color[1], color[2]);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(9);
      p.text(privateIps[i], host.x, host.y);
    });

    p.stroke(130, 220, 255, 170);
    p.fill(14, 20, 34);
    p.rect(router.x - 58, router.y - 24, 116, 48, 8);
    p.noStroke();
    p.fill(130, 220, 255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(10);
    p.text("Router NAT", router.x, router.y - 6);
    p.fill(175);
    p.textSize(9);
    p.text("IP publico: 200.1.50.1", router.x, router.y + 10);

    p.stroke(150, 235, 150, 170);
    p.fill(14, 20, 34);
    p.rect(internet.x - 58, internet.y - 24, 116, 48, 8);
    p.noStroke();
    p.fill(150, 235, 150);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(10);
    p.text("Internet", internet.x, internet.y - 6);
    p.fill(175);
    p.textSize(9);
    p.text("destino 8.8.8.8", internet.x, internet.y + 10);

    flows = flows.filter((flow) => {
      flow.t += 0.018 * (p.deltaTime / 16.67);
      if (flow.t >= 1) {
        flow.t = 0;
        if (flow.stage === "toRouter") flow.stage = "toInternet";
        else if (flow.stage === "toInternet") flow.stage = "backToRouter";
        else if (flow.stage === "backToRouter") flow.stage = "toHost";
        else return false;
      }

      const host = hosts[flow.hostIndex];
      const color = hostColors[flow.hostIndex];
      let from = host;
      let to = router;

      if (flow.stage === "toInternet") {
        from = router;
        to = internet;
      } else if (flow.stage === "backToRouter") {
        from = internet;
        to = router;
      } else if (flow.stage === "toHost") {
        from = router;
        to = host;
      }

      const x = p.lerp(from.x, to.x, flow.t);
      const y = p.lerp(from.y, to.y, flow.t);

      p.noStroke();
      p.fill(color[0], color[1], color[2]);
      p.rectMode(p.CENTER);
      p.rect(x, y, 14, 10, 2);
      p.rectMode(p.CORNER);

      return true;
    });

    const tableX = p.width - 264;
    const tableY = 214;
    p.stroke(100, 125, 175, 110);
    p.fill(10, 16, 28, 232);
    p.rect(tableX, tableY, 246, 90, 8);

    p.noStroke();
    p.fill(190);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text("Tabela NAT (privado -> publico)", tableX + 8, tableY + 6);

    table.slice(0, 4).forEach((entry, i) => {
      const y = tableY + 24 + i * 15;
      p.fill(160);
      p.text(`${entry.privateIp}:${entry.privatePort} -> 200.1.50.1:${entry.publicPort}`, tableX + 8, y);
    });
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

type FlowNode = {
  label: string;
  subtitle: string;
};

type FlowEdge = {
  label: string;
};

export function DhcpToInternetFlowVisualizer() {
  const nodes: FlowNode[] = [
    { label: "Host novo", subtitle: "entra na rede" },
    { label: "Servidor DHCP local", subtitle: "aloca 192.168.1.100" },
    { label: "Router NAT domestico", subtitle: "traduz para 200.1.50.1" },
    { label: "ISP - Brasil Telecom", subtitle: "prefixo 200.1.50.0/24" },
    { label: "RIR - LACNIC", subtitle: "aloca 200.0.0.0/8 ao ISP" },
    { label: "ICANN / IANA", subtitle: "governanca do espaco IPv4" },
    { label: "Internet Global", subtitle: "destino final" },
  ];

  const edges: FlowEdge[] = [
    { label: "DHCP DISCOVER" },
    { label: "IP privado concedido" },
    { label: "NAT para IP publico" },
    { label: "bloco do LACNIC" },
    { label: "bloco raiz do ICANN" },
    { label: "alcance global" },
  ];

  let stepIndex = 0;
  let t = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const drawNode = (
    p: p5,
    x: number,
    y: number,
    node: FlowNode,
    active: boolean,
    passed: boolean,
  ) => {
    const strokeColor: [number, number, number] = active
      ? [120, 210, 255]
      : passed
      ? [130, 175, 230]
      : [95, 110, 135];

    p.stroke(strokeColor[0], strokeColor[1], strokeColor[2], active ? 230 : 130);
    p.strokeWeight(active ? 2 : 1.2);
    p.fill(active ? 16 : 12, active ? 28 : 20, active ? 44 : 32, active ? 240 : 220);
    p.rect(x - 120, y - 18, 240, 36, 7);

    p.noStroke();
    p.fill(active ? 230 : 185);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(10);
    p.text(node.label, x, y - 5);

    p.fill(active ? 170 : 145);
    p.textSize(8);
    p.text(node.subtitle, x, y + 9);
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Fluxo Completo: Do DHCP ao Mundo");

    t += 0.012 * (p.deltaTime / 16.67);
    if (t >= 1) {
      t = 0;
      stepIndex = (stepIndex + 1) % edges.length;
    }

    const top = 44;
    const gap = 42;
    const centerX = p.width / 2;
    const positions = nodes.map((_, i) => ({ x: centerX, y: top + i * gap }));

    edges.forEach((edge, i) => {
      const from = positions[i];
      const to = positions[i + 1];
      const isActive = i === stepIndex;
      const passed = i < stepIndex;

      const color: [number, number, number] = isActive
        ? [110, 205, 255]
        : passed
        ? [120, 170, 230]
        : [85, 100, 130];

      p.stroke(color[0], color[1], color[2], isActive ? 230 : 120);
      p.strokeWeight(isActive ? 2 : 1.3);
      p.line(from.x, from.y + 18, to.x, to.y - 18);

      const midX = from.x;
      const midY = (from.y + to.y) / 2;
      p.noStroke();
      p.fill(isActive ? 185 : 130);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(8);
      p.text(edge.label, midX, midY);

      const arrowY = p.lerp(from.y + 18, to.y - 18, isActive ? t : passed ? 1 : 0);
      p.fill(color[0], color[1], color[2], isActive ? 235 : 145);
      p.triangle(midX - 4, arrowY - 2, midX + 4, arrowY - 2, midX, arrowY + 4);
    });

    nodes.forEach((node, i) => {
      drawNode(p, positions[i].x, positions[i].y, node, i === stepIndex || i === stepIndex + 1, i < stepIndex + 1);
    });

    p.noStroke();
    p.fill(145);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(9);
    p.text(`Etapa ativa: ${edges[stepIndex].label}`, 22, p.height - 10);
  };

  return <P5Sketch setup={setup} draw={draw} height={315} />;
}

