"use client";

import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

type Vec2 = { x: number; y: number };

type NatStage = {
  label: string;
  from: "host" | "router" | "server";
  to: "host" | "router" | "server";
  color: [number, number, number];
  subtitle: string;
  packet: string;
};

type NatEntry = {
  id: number;
  privateIp: string;
  privatePort: number;
  publicPort: number;
  destination: string;
  ttl: number;
  maxTtl: number;
  progress: number;
  direction: 1 | -1;
  color: [number, number, number];
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

function lerpPos(p: p5, a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: p.lerp(a.x, b.x, t), y: p.lerp(a.y, b.y, t) };
}

export function NatPacketFlowVisualizer() {
  const stages: NatStage[] = [
    {
      label: "1) Envio interno",
      from: "host",
      to: "router",
      color: [100, 205, 255],
      subtitle: "Host envia pacote privado",
      packet: "192.168.1.100:54321 -> 8.8.8.8:80",
    },
    {
      label: "2) NAT reescreve",
      from: "router",
      to: "router",
      color: [255, 190, 80],
      subtitle: "Router cria mapeamento NAT",
      packet: "200.1.50.1:40000 -> 8.8.8.8:80",
    },
    {
      label: "3) Saida para internet",
      from: "router",
      to: "server",
      color: [120, 220, 140],
      subtitle: "Pacote segue com IP publico",
      packet: "200.1.50.1:40000 -> 8.8.8.8:80",
    },
    {
      label: "4) Resposta do servidor",
      from: "server",
      to: "router",
      color: [180, 150, 255],
      subtitle: "Servidor responde ao IP publico",
      packet: "8.8.8.8:80 -> 200.1.50.1:40000",
    },
    {
      label: "5) NAT reverte",
      from: "router",
      to: "host",
      color: [255, 120, 120],
      subtitle: "Router restaura destino privado",
      packet: "8.8.8.8:80 -> 192.168.1.100:54321",
    },
  ];

  let stageIndex = 0;
  let t = 0;
  let pauseFrames = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    const host = { x: p.width * 0.18, y: 130 };
    const router = { x: p.width * 0.5, y: 130 };
    const server = { x: p.width * 0.82, y: 130 };

    p.background(2, 7, 19);
    drawTitle(p, "Fluxo de Pacotes NAT (saida e retorno)");

    drawNode(p, host, "Host interno", "192.168.1.100", [95, 190, 255]);
    drawNode(p, router, "Router NAT", "200.1.50.1", [255, 190, 80]);
    drawNode(p, server, "Servidor remoto", "8.8.8.8", [125, 220, 150]);

    p.stroke(70, 95, 130, 130);
    p.strokeWeight(2);
    p.line(host.x + 90, host.y, router.x - 90, router.y);
    p.line(router.x + 90, router.y, server.x - 90, server.y);

    const current = stages[stageIndex];
    const speed = 0.016 * (p.deltaTime / 16.67);

    if (t < 1) {
      t = Math.min(1, t + speed);
    } else {
      pauseFrames += 1;
      if (pauseFrames > 42) {
        pauseFrames = 0;
        t = 0;
        stageIndex = (stageIndex + 1) % stages.length;
      }
    }

    const nodeByName = { host, router, server };
    const src = nodeByName[current.from];
    const dst = nodeByName[current.to];

    if (current.from === current.to) {
      const pulse = 12 + 8 * Math.sin(p.frameCount * 0.18);
      p.noFill();
      p.stroke(current.color[0], current.color[1], current.color[2], 180);
      p.strokeWeight(2);
      p.circle(src.x, src.y, 50 + pulse);
      p.circle(src.x, src.y, 30 + pulse * 0.5);
    } else {
      const pos = lerpPos(p, src, dst, t);
      p.noStroke();
      p.fill(current.color[0], current.color[1], current.color[2]);
      p.rectMode(p.CENTER);
      p.rect(pos.x, pos.y, 26, 14, 3);
      p.rectMode(p.CORNER);
    }

    const boxY = 188;
    p.stroke(current.color[0], current.color[1], current.color[2], 170);
    p.fill(10, 16, 28, 230);
    p.rect(24, boxY, p.width - 48, 64, 8);

    p.noStroke();
    p.fill(230);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(current.label, 36, boxY + 10);
    p.fill(165);
    p.text(current.subtitle, 36, boxY + 26);
    p.fill(current.color[0], current.color[1], current.color[2]);
    p.text(current.packet, 36, boxY + 42);

    const barX = 24;
    const barY = 262;
    const stepW = (p.width - 48) / stages.length;

    stages.forEach((step, i) => {
      const active = i === stageIndex;
      p.stroke(step.color[0], step.color[1], step.color[2], active ? 220 : 85);
      p.fill(12, 18, 30);
      p.rect(barX + i * stepW, barY, stepW - 5, 22, 6);
      p.noStroke();
      p.fill(active ? 230 : 135);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(8);
      p.text(String(i + 1), barX + i * stepW + (stepW - 5) / 2, barY + 11);
    });
  };

  return <P5Sketch setup={setup} draw={draw} height={294} />;
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

export function NatTableDynamicSimulator() {
  const privateHosts = ["192.168.1.100", "192.168.1.101", "192.168.1.102", "192.168.1.103"];
  const publicIp = "200.1.50.1";
  const destinations = ["8.8.8.8:80", "1.1.1.1:443", "172.217.28.78:443", "151.101.1.69:80"];
  const palette: Array<[number, number, number]> = [
    [100, 205, 255],
    [255, 190, 80],
    [125, 220, 150],
    [200, 155, 255],
    [255, 125, 125],
  ];

  let entries: NatEntry[] = [];
  let nextId = 1;
  let tick = 0;

  const spawnEntry = () => {
    if (entries.length >= 8) return;

    const privateIp = randomFrom(privateHosts);
    const privatePort = 40000 + Math.floor(Math.random() * 20000);
    const publicPort = 30000 + Math.floor(Math.random() * 30000);
    const destination = randomFrom(destinations);
    const maxTtl = 360 + Math.floor(Math.random() * 240);

    entries.push({
      id: nextId,
      privateIp,
      privatePort,
      publicPort,
      destination,
      ttl: maxTtl,
      maxTtl,
      progress: Math.random(),
      direction: Math.random() > 0.5 ? 1 : -1,
      color: palette[nextId % palette.length] as [number, number, number],
    });

    nextId += 1;
  };

  const setup = (p: p5) => {
    p.textFont("monospace");
    for (let i = 0; i < 4; i += 1) spawnEntry();
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    drawTitle(p, "Tabela NAT dinamica (mapeamentos e expiracao)");

    tick += 1;
    if (tick % 40 === 0) spawnEntry();

    entries = entries
      .map((entry) => {
        entry.ttl -= 1;
        entry.progress += 0.01 * entry.direction;

        if (entry.progress >= 1) {
          entry.progress = 1;
          entry.direction = -1;
        } else if (entry.progress <= 0) {
          entry.progress = 0;
          entry.direction = 1;
        }

        return entry;
      })
      .filter((entry) => entry.ttl > 0);

    const hostPos = { x: p.width * 0.16, y: 96 };
    const routerPos = { x: p.width * 0.5, y: 96 };
    const internetPos = { x: p.width * 0.84, y: 96 };

    drawNode(p, hostPos, "LAN privada", "192.168.1.0/24", [100, 205, 255]);
    drawNode(p, routerPos, "Router NAT", publicIp, [255, 190, 80]);
    drawNode(p, internetPos, "Internet", "destinos publicos", [125, 220, 150]);

    p.stroke(70, 95, 130, 130);
    p.strokeWeight(2);
    p.line(hostPos.x + 90, hostPos.y, routerPos.x - 90, routerPos.y);
    p.line(routerPos.x + 90, routerPos.y, internetPos.x - 90, internetPos.y);

    entries.forEach((entry) => {
      const left = lerpPos(p, hostPos, routerPos, entry.progress);
      const right = lerpPos(p, routerPos, internetPos, entry.progress);

      p.noStroke();
      p.fill(entry.color[0], entry.color[1], entry.color[2], 220);
      p.circle(left.x, left.y - 8, 6);
      p.circle(right.x, right.y + 8, 6);
    });

    const tableX = 24;
    const tableY = 150;
    const tableW = p.width - 48;
    const rowH = 24;
    const headerH = 24;

    p.stroke(95, 120, 170, 140);
    p.fill(10, 16, 28, 236);
    p.rect(tableX, tableY, tableW, headerH + rowH * 8 + 12, 8);

    const colA = 170;
    const colB = 170;
    const colC = 170;
    const colD = tableW - colA - colB - colC;

    p.noStroke();
    p.fill(205);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(9);
    p.text("Privado (IP:porta)", tableX + 8, tableY + 12);
    p.text("Publico (IP:porta)", tableX + colA + 8, tableY + 12);
    p.text("Destino", tableX + colA + colB + 8, tableY + 12);
    p.text("TTL", tableX + colA + colB + colC + 8, tableY + 12);

    const sepXs = [tableX + colA, tableX + colA + colB, tableX + colA + colB + colC];
    sepXs.forEach((x) => {
      p.stroke(80, 100, 140, 120);
      p.line(x, tableY + 2, x, tableY + headerH + rowH * 8 + 8);
    });

    for (let i = 0; i <= 8; i += 1) {
      const y = tableY + headerH + i * rowH;
      p.stroke(80, 100, 140, 120);
      p.line(tableX, y, tableX + tableW, y);
    }

    entries.slice(0, 8).forEach((entry, i) => {
      const y = tableY + headerH + i * rowH;
      const ttlRatio = entry.ttl / entry.maxTtl;

      p.noStroke();
      p.fill(entry.color[0], entry.color[1], entry.color[2], 35);
      p.rect(tableX + 1, y + 1, tableW - 2, rowH - 2, 4);

      p.fill(225);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(8);
      p.text(`${entry.privateIp}:${entry.privatePort}`, tableX + 8, y + rowH / 2);
      p.text(`${publicIp}:${entry.publicPort}`, tableX + colA + 8, y + rowH / 2);
      p.text(entry.destination, tableX + colA + colB + 8, y + rowH / 2);

      const barX = tableX + colA + colB + colC + 8;
      const barY = y + 6;
      const barW = colD - 18;
      const barH = 12;

      p.fill(40, 55, 80);
      p.rect(barX, barY, barW, barH, 3);
      p.fill(255 * (1 - ttlRatio), 210 * ttlRatio, 90, 220);
      p.rect(barX, barY, barW * ttlRatio, barH, 3);
    });

    p.noStroke();
    p.fill(140);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text(`Entradas ativas: ${entries.length}  |  Mapeamento: (privado:porta) <-> (${publicIp}:porta)`, tableX, p.height - 16);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

export function SLAACAutoConfigSimulator() {
  const steps = [
    "1) Link-local gerado (fe80::)",
    "2) Host envia Router Solicitation",
    "3) Router responde com prefixo /64",
    "4) Host monta endereco global",
  ];

  let stepIndex = 0;
  let t = 0;
  let pause = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    const host = { x: p.width * 0.25, y: 120 };
    const router = { x: p.width * 0.75, y: 120 };

    p.background(2, 7, 19);
    drawTitle(p, "SLAAC: configuracao automatica IPv6 sem DHCP");

    drawNode(p, host, "Host IPv6", "interface id derivado do MAC", [100, 205, 255]);
    drawNode(p, router, "Router IPv6", "prefixo: 2001:db8::/64", [125, 220, 150]);

    p.stroke(70, 95, 130, 130);
    p.strokeWeight(2);
    p.line(host.x + 90, host.y, router.x - 90, router.y);

    const speed = 0.015 * (p.deltaTime / 16.67);
    if (t < 1) {
      t = Math.min(1, t + speed);
    } else {
      pause += 1;
      if (pause > 42) {
        pause = 0;
        t = 0;
        stepIndex = (stepIndex + 1) % steps.length;
      }
    }

    if (stepIndex === 1) {
      const pos = lerpPos(p, host, router, t);
      p.noStroke();
      p.fill(255, 190, 80);
      p.rectMode(p.CENTER);
      p.rect(pos.x, pos.y, 24, 12, 3);
      p.rectMode(p.CORNER);
    }

    if (stepIndex === 2) {
      const pos = lerpPos(p, router, host, t);
      p.noStroke();
      p.fill(125, 220, 150);
      p.rectMode(p.CENTER);
      p.rect(pos.x, pos.y, 24, 12, 3);
      p.rectMode(p.CORNER);
    }

    const boxX = 26;
    const boxY = 170;
    const boxW = p.width - 52;
    const boxH = 120;

    p.stroke(100, 125, 170, 140);
    p.fill(10, 16, 28, 236);
    p.rect(boxX, boxY, boxW, boxH, 8);

    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);

    const linkLocal = "fe80::1234:5678:90ab:cdef";
    const prefix = "2001:db8:abcd:42::/64";
    const global = "2001:db8:abcd:42:1234:5678:90ab:cdef";

    p.fill(stepIndex >= 0 ? 225 : 120);
    p.text(`Link-local: ${linkLocal}`, boxX + 12, boxY + 14);

    p.fill(stepIndex >= 2 ? 225 : 120);
    p.text(`Prefixo do router: ${prefix}`, boxX + 12, boxY + 34);

    p.fill(stepIndex >= 3 ? 225 : 120);
    p.text(`Endereco global final: ${global}`, boxX + 12, boxY + 54);

    p.fill(150);
    p.text(steps[stepIndex], boxX + 12, boxY + 84);

    const timelineY = 304;
    const stepW = (p.width - 52) / steps.length;
    steps.forEach((_step, i) => {
      const active = i === stepIndex;
      p.stroke(active ? 140 : 85, active ? 220 : 120, active ? 255 : 160, active ? 220 : 90);
      p.fill(12, 18, 30);
      p.rect(26 + i * stepW, timelineY, stepW - 5, 20, 6);
      p.noStroke();
      p.fill(active ? 230 : 140);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(8);
      p.text(String(i + 1), 26 + i * stepW + (stepW - 5) / 2, timelineY + 10);
    });
  };

  return <P5Sketch setup={setup} draw={draw} height={332} />;
}

export function DualStackTransitionSimulator() {
  const scenarios = [
    {
      name: "Servidor IPv6-only",
      supportsV6: true,
      supportsV4: false,
      v6Ms: 40,
      v4Ms: 0,
    },
    {
      name: "Servidor IPv4-only",
      supportsV6: false,
      supportsV4: true,
      v6Ms: 80,
      v4Ms: 65,
    },
    {
      name: "Servidor Dual-Stack",
      supportsV6: true,
      supportsV4: true,
      v6Ms: 35,
      v4Ms: 75,
    },
  ];

  let scenarioIndex = 0;
  let phase: "tryV6" | "fallbackV4" | "done" = "tryV6";
  let t = 0;
  let hold = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const resetScenario = () => {
    phase = "tryV6";
    t = 0;
    hold = 0;
  };

  const draw = (p: p5) => {
    const client = { x: p.width * 0.23, y: 120 };
    const server = { x: p.width * 0.77, y: 120 };
    const scenario = scenarios[scenarioIndex] as (typeof scenarios)[number];

    p.background(2, 7, 19);
    drawTitle(p, "Dual-Stack: tentativa em IPv6 com fallback para IPv4");

    drawNode(p, client, "Cliente", "IPv6 + IPv4", [100, 205, 255]);
    drawNode(
      p,
      server,
      scenario.name,
      `IPv6=${scenario.supportsV6 ? "sim" : "nao"} | IPv4=${scenario.supportsV4 ? "sim" : "nao"}`,
      [125, 220, 150],
    );

    p.stroke(70, 95, 130, 130);
    p.strokeWeight(2);
    p.line(client.x + 90, client.y - 10, server.x - 90, server.y - 10);
    p.line(client.x + 90, client.y + 14, server.x - 90, server.y + 14);

    const speed = 0.018 * (p.deltaTime / 16.67);

    if (phase === "tryV6") {
      t = Math.min(1, t + speed);
      const pos = lerpPos(p, { x: client.x, y: client.y - 10 }, { x: server.x, y: server.y - 10 }, t);
      p.noStroke();
      p.fill(180, 150, 255);
      p.rectMode(p.CENTER);
      p.rect(pos.x, pos.y, 24, 12, 3);
      p.rectMode(p.CORNER);

      if (t >= 1) {
        if (scenario.supportsV6) {
          phase = "done";
          hold = 0;
        } else {
          phase = "fallbackV4";
          t = 0;
        }
      }
    } else if (phase === "fallbackV4") {
      t = Math.min(1, t + speed);
      const pos = lerpPos(p, { x: client.x, y: client.y + 14 }, { x: server.x, y: server.y + 14 }, t);
      p.noStroke();
      p.fill(100, 205, 255);
      p.rectMode(p.CENTER);
      p.rect(pos.x, pos.y, 24, 12, 3);
      p.rectMode(p.CORNER);

      if (t >= 1) {
        phase = "done";
        hold = 0;
      }
    } else {
      hold += 1;
      if (hold > 90) {
        scenarioIndex = (scenarioIndex + 1) % scenarios.length;
        resetScenario();
      }
    }

    const panelX = 24;
    const panelY = 176;
    const panelW = p.width - 48;
    const panelH = 102;

    p.stroke(100, 125, 170, 140);
    p.fill(10, 16, 28, 236);
    p.rect(panelX, panelY, panelW, panelH, 8);

    const status =
      phase === "tryV6"
        ? "Tentando IPv6"
        : phase === "fallbackV4"
          ? "Fallback para IPv4"
          : scenario.supportsV6
            ? "Conectado via IPv6"
            : scenario.supportsV4
              ? "Conectado via IPv4"
              : "Falha";

    p.noStroke();
    p.fill(225);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(`Cenario: ${scenario.name}`, panelX + 12, panelY + 12);
    p.fill(160);
    p.text(`Status: ${status}`, panelX + 12, panelY + 30);

    p.fill(190, 160, 255);
    p.text(`Tempo IPv6: ${scenario.v6Ms} ms`, panelX + 12, panelY + 50);
    p.fill(110, 205, 255);
    p.text(`Tempo IPv4: ${scenario.v4Ms > 0 ? `${scenario.v4Ms} ms` : "-"}`, panelX + 12, panelY + 66);

    const total = Math.max(1, scenario.v6Ms + scenario.v4Ms);
    const barX = panelX + 220;
    const barY = panelY + 48;
    const barW = panelW - 240;
    const barH = 12;

    p.fill(40, 55, 80);
    p.rect(barX, barY, barW, barH, 3);

    const v6W = (scenario.v6Ms / total) * barW;
    const v4W = (scenario.v4Ms / total) * barW;

    p.fill(180, 150, 255, 220);
    p.rect(barX, barY, v6W, barH, 3);
    p.fill(100, 205, 255, 220);
    p.rect(barX + v6W, barY, v4W, barH, 3);
  };

  return <P5Sketch setup={setup} draw={draw} height={300} />;
}

