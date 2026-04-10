"use client";

import { P5Sketch } from "../p5-sketch";
import type p5 from "p5";

// Visualization 1: Linearity — superposition principle
export function SuperpositionPrinciple() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Princípio da Superposição — Sistema Linear", w / 2, 8);

    const rowH = (h - 80) / 3;
    const sysW = 60, sysH = 30;
    const colX = [30, w / 2 - 10, w - 50];

    const rows = [
      { inp: "x₁(t)", color: [0, 150, 255], out: "y₁(t)", amp: 1.0, freq: 1.2 },
      { inp: "x₂(t)", color: [255, 180, 50], out: "y₂(t)", amp: 0.6, freq: 2.0 },
      { inp: "a·x₁+b·x₂", color: [100, 200, 100], out: "a·y₁+b·y₂", amp: 1.3, freq: 1.4 },
    ];

    rows.forEach((row, i) => {
      const cy = 36 + i * rowH + rowH / 2;

      // Input waveform mini
      p.stroke(row.color[0], row.color[1], row.color[2]); p.strokeWeight(1.5); p.noFill();
      p.beginShape();
      for (let j = 0; j < 40; j++) {
        const t = (j / 40) * 2 * Math.PI;
        p.vertex(colX[0] - 18 + j, cy + Math.sin(t * row.freq + time) * row.amp * 14);
      }
      p.endShape();
      p.noStroke(); p.fill(row.color[0], row.color[1], row.color[2], 200);
      p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
      p.text(row.inp, colX[0] + 4, cy - 16);

      // Arrow
      p.stroke(120); p.strokeWeight(1.5);
      p.line(colX[0] + 24, cy, colX[1] - sysW / 2 - 4, cy);
      p.fill(120); p.noStroke();
      p.triangle(colX[1] - sysW / 2 - 1, cy, colX[1] - sysW / 2 - 8, cy - 3, colX[1] - sysW / 2 - 8, cy + 3);

      // System block
      p.fill(15, 25, 45); p.stroke(180, 130, 255, 100); p.strokeWeight(1.5);
      p.rect(colX[1] - sysW / 2, cy - sysH / 2, sysW, sysH, 5);
      p.noStroke(); p.fill(180, 130, 255, 200); p.textSize(9); p.textAlign(p.CENTER, p.CENTER);
      p.text("H{·}", colX[1], cy);

      // Arrow out
      p.stroke(row.color[0], row.color[1], row.color[2]); p.strokeWeight(1.5);
      p.line(colX[1] + sysW / 2 + 4, cy, colX[2] - 22, cy);
      p.fill(row.color[0], row.color[1], row.color[2]); p.noStroke();
      p.triangle(colX[2] - 19, cy, colX[2] - 27, cy - 3, colX[2] - 27, cy + 3);

      // Output waveform mini
      p.stroke(row.color[0], row.color[1], row.color[2]); p.strokeWeight(1.5); p.noFill();
      p.beginShape();
      for (let j = 0; j < 40; j++) {
        const t = (j / 40) * 2 * Math.PI;
        p.vertex(colX[2] - 10 + j, cy + Math.sin(t * row.freq + time - 0.6) * row.amp * 8);
      }
      p.endShape();
      p.noStroke(); p.fill(row.color[0], row.color[1], row.color[2], 200);
      p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
      p.text(row.out, colX[2] + 12, cy - 16);

      // Row separator
      if (i < 2) {
        p.stroke(40); p.strokeWeight(0.5);
        p.line(20, cy + rowH / 2, w - 20, cy + rowH / 2);
      }
    });

    // = sign on row 3 (result equals sum of rows 1+2)
    p.noStroke(); p.fill(100, 200, 100, 220); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
    p.text("= H{a·x₁+b·x₂} = a·H{x₁}+b·H{x₂}", w / 2, h - 32);

    p.fill(15, 20, 35); p.stroke(100, 200, 100, 50); p.strokeWeight(1);
    p.rect(10, h - 42, w - 20, 28, 5);
    p.noStroke(); p.fill(100, 200, 100, 210); p.textSize(9.5); p.textAlign(p.CENTER, p.CENTER);
    p.text("Linearidade: H{a·x₁(t) + b·x₂(t)} = a·H{x₁(t)} + b·H{x₂(t)}", w / 2, h - 28);
  };
  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 2: Time invariance — shift in input = shift in output
export function TimeInvarianceDemo() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Invariância no Tempo — Deslocar Entrada = Deslocar Saída", w / 2, 8);

    const tMin = -1, tMax = 8, tRange = tMax - tMin;
    const t0 = 2.5;
    const ox = 55, aw = w - 90;
    const tToX = (t: number) => ox + ((t - tMin) / tRange) * aw;
    const pulse = (t: number) => (t >= 0 && t < 2) ? Math.exp(-0.5 * t) : 0;
    const pulseFilt = (t: number) => (t >= 0 && t < 2) ? Math.exp(-t) * Math.sin(3 * t) * 0.8 : 0;

    const panels = [
      {
        label: "Entrada x(t) e saída H{x(t)}",
        oy: 95, inp: pulse, out: pulseFilt,
        inCol: [0, 150, 255], outCol: [100, 200, 100],
      },
      {
        label: "Entrada deslocada x(t−t₀) e saída H{x(t−t₀)}",
        oy: 245, inp: (t: number) => pulse(t - t0), out: (t: number) => pulseFilt(t - t0),
        inCol: [255, 180, 50], outCol: [180, 130, 255],
      },
    ];

    panels.forEach((panel) => {
      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox - 5, panel.oy, tToX(tMax) + 5, panel.oy);
      p.line(tToX(0), panel.oy - 55, tToX(0), panel.oy + 10);
      p.noStroke(); p.fill(70); p.textSize(7.5); p.textAlign(p.CENTER, p.TOP);
      for (let t = 0; t <= tMax; t++) {
        const tx = tToX(t);
        p.stroke(25); p.strokeWeight(0.3); p.line(tx, panel.oy - 2, tx, panel.oy + 2); p.noStroke();
        p.fill(65); p.text(t.toString(), tx, panel.oy + 3);
      }
      p.fill(90); p.textAlign(p.LEFT, p.CENTER); p.textSize(8); p.text("t", tToX(tMax) + 7, panel.oy);
      p.noStroke(); p.fill(150, 150, 200, 200); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
      p.text(panel.label, ox + 2, panel.oy - 66);

      // Input
      p.stroke(panel.inCol[0], panel.inCol[1], panel.inCol[2]); p.strokeWeight(2); p.noFill();
      p.beginShape();
      for (let i = 0; i <= aw; i++) {
        const t = tMin + (i / aw) * tRange;
        p.vertex(tToX(t), panel.oy - panel.inp(t) * 50);
      }
      p.endShape();

      // Output
      p.stroke(panel.outCol[0], panel.outCol[1], panel.outCol[2]); p.strokeWeight(2); p.noFill();
      p.beginShape();
      for (let i = 0; i <= aw; i++) {
        const t = tMin + (i / aw) * tRange;
        p.vertex(tToX(t), panel.oy - panel.out(t) * 50);
      }
      p.endShape();

      // Legend
      p.noStroke();
      p.fill(panel.inCol[0], panel.inCol[1], panel.inCol[2], 200); p.textSize(8.5); p.textAlign(p.LEFT, p.TOP);
      p.text("↑ entrada", tToX(0.2), panel.oy - 53);
      p.fill(panel.outCol[0], panel.outCol[1], panel.outCol[2], 200);
      p.text("↑ saída", tToX(1.5), panel.oy - 53);
    });

    // Connection arrow
    p.stroke(200, 200, 200, 100); p.strokeWeight(1.5);
    p.line(w / 2, 145, w / 2, 195);
    p.fill(200, 200, 200, 100); p.noStroke();
    p.triangle(w / 2, 198, w / 2 - 5, 190, w / 2 + 5, 190);
    p.noStroke(); p.fill(200, 200, 200, 180); p.textSize(8.5); p.textAlign(p.CENTER, p.CENTER);
    p.text("deslocar entrada de t₀=" + t0 + "s", w / 2, 170);

    p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Invariante no tempo: H{x(t − t₀)} = y(t − t₀) para qualquer t₀", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={330} />;
}

// Visualization 3: Memory vs Memoryless and Causal vs Noncausal
export function MemoryAndCausality() {
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Memória, Causalidade e Classificações Relacionadas", w / 2, 8);

    const cards = [
      {
        title: "Sem Memória (Instantâneo)",
        col: [0, 150, 255],
        desc: "Saída depende APENAS\nda entrada no instante atual\ny(t) = f(x(t))",
        ex: "Resistor: y = Rx\nAmplificador ideal",
      },
      {
        title: "Com Memória (Dinâmico)",
        col: [255, 180, 50],
        desc: "Saída depende de valores\npassados e/ou futuros\ny(t) = f(x(τ), τ ≤ t ou τ > t)",
        ex: "Capacitor: y = (1/C)∫i dt\nFiltro IIR, acumulador",
      },
      {
        title: "Causal",
        col: [100, 200, 100],
        desc: "Saída em t depende apenas\nda entrada para τ ≤ t\n(não usa o 'futuro')",
        ex: "Todo sistema físico em\noperação em tempo real",
      },
      {
        title: "Não Causal",
        col: [180, 130, 255],
        desc: "Saída em t depende de\nentrada para τ > t\n(usa valores futuros de x)",
        ex: "Filtro de média centrada\n(processamento off-line)",
      },
    ];

    const cw = (w - 30) / 2, ch = (h - 70) / 2;

    cards.forEach((card, i) => {
      const cx = 10 + (i % 2) * (cw + 10);
      const cy = 32 + Math.floor(i / 2) * (ch + 10);

      p.fill(15, 20, 35); p.stroke(card.col[0], card.col[1], card.col[2], 70); p.strokeWeight(1.5);
      p.rect(cx, cy, cw, ch, 6);

      p.noStroke(); p.fill(card.col[0], card.col[1], card.col[2], 230);
      p.textSize(10); p.textAlign(p.CENTER, p.TOP);
      p.text(card.title, cx + cw / 2, cy + 8);

      p.fill(card.col[0], card.col[1], card.col[2], 160); p.textSize(8.5);
      card.desc.split("\n").forEach((line, li) => {
        p.text(line, cx + cw / 2, cy + 26 + li * 13);
      });

      p.fill(15, 25, 45); p.stroke(card.col[0], card.col[1], card.col[2], 40); p.strokeWeight(1);
      p.rect(cx + 8, cy + ch - 36, cw - 16, 30, 4);
      p.noStroke(); p.fill(card.col[0], card.col[1], card.col[2], 120); p.textSize(8);
      card.ex.split("\n").forEach((line, li) => {
        p.text(line, cx + cw / 2, cy + ch - 32 + li * 12);
      });
    });

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Todo sistema sem memória é causal. Todo sistema causal pode ter memória.", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 4: BIBO stability
export function BIBOStabilityDemo() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Estabilidade BIBO — Bounded Input, Bounded Output", w / 2, 8);

    const tMax = 6;
    const panelW = (w - 30) / 2;

    const systems = [
      {
        startX: 10, title: "Sistema ESTÁVEL (BIBO)",
        col: [100, 200, 100],
        desc: "h(t) = e^(−2t)u(t) → |h| integrável",
        inFn: (t: number) => Math.sin(2 * t + time) * 0.8,
        outFn: (t: number) => Math.sin(2 * t + time - 0.5) * 0.4 * Math.exp(-0.05 * t),
      },
      {
        startX: panelW + 20, title: "Sistema INSTÁVEL",
        col: [255, 100, 100],
        desc: "h(t) = e^(+0.5t)u(t) → |h| diverge",
        inFn: (t: number) => Math.sin(2 * t + time) * 0.8,
        outFn: (t: number) => Math.sin(2 * t + time - 0.3) * 0.4 * Math.exp(0.5 * t),
      },
    ];

    systems.forEach((sys) => {
      p.fill(15, 20, 35); p.stroke(sys.col[0], sys.col[1], sys.col[2], 50); p.strokeWeight(1);
      p.rect(sys.startX, 28, panelW, h - 60, 6);

      p.noStroke(); p.fill(sys.col[0], sys.col[1], sys.col[2], 220);
      p.textSize(10); p.textAlign(p.CENTER, p.TOP);
      p.text(sys.title, sys.startX + panelW / 2, 36);
      p.fill(sys.col[0], sys.col[1], sys.col[2], 140); p.textSize(8.5);
      p.text(sys.desc, sys.startX + panelW / 2, 52);

      const ox = sys.startX + 30, oy = h / 2 + 20, aw = panelW - 50;
      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox - 5, oy, ox + aw, oy);
      p.line(ox, oy - 70, ox, oy + 10);

      // Bounded input
      p.stroke(0, 150, 255, 150); p.strokeWeight(1.5); p.noFill();
      p.beginShape();
      for (let i = 0; i <= aw; i++) {
        const t = (i / aw) * tMax;
        p.vertex(ox + i, oy - sys.inFn(t) * 50);
      }
      p.endShape();

      // Output
      p.stroke(sys.col[0], sys.col[1], sys.col[2]); p.strokeWeight(2); p.noFill();
      p.beginShape();
      for (let i = 0; i <= aw; i++) {
        const t = (i / aw) * tMax;
        const out = sys.outFn(t);
        if (Math.abs(out) > 1.4) {
          p.endShape(); p.beginShape();
          continue;
        }
        p.vertex(ox + i, oy - out * 50);
      }
      p.endShape();

      p.noStroke(); p.fill(0, 150, 255, 130); p.textSize(8); p.textAlign(p.LEFT, p.TOP);
      p.text("↑ entrada (limitada)", ox + 3, oy - 68);
      p.fill(sys.col[0], sys.col[1], sys.col[2], 180); p.textSize(8);
      p.text("↑ saída", ox + 3, oy - 55);

      // Boundary lines for stable system
      if (sys.col[1] === 200) {
        p.stroke(100, 200, 100, 50); p.strokeWeight(1);
        (p.drawingContext as CanvasRenderingContext2D).setLineDash([3, 3]);
        p.line(ox, oy - 50, ox + aw, oy - 50);
        p.line(ox, oy + 50, ox + aw, oy + 50);
        (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);
        p.noStroke(); p.fill(100, 200, 100, 100); p.textSize(7.5); p.textAlign(p.RIGHT, p.CENTER);
        p.text("±M", ox - 2, oy - 50);
      }
    });

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("BIBO estável: toda entrada limitada produz saída limitada  |  Condição: ∫|h(t)|dt < ∞", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={310} />;
}

// Visualization 5: Invertibility — one-to-one mapping
export function InvertibilityDemo() {
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Inversibilidade — Sistema Invertível vs. Não Invertível", w / 2, 8);

    const panelW = (w - 30) / 2;

    // Invertible system
    {
      const sx = 10;
      p.fill(15, 20, 35); p.stroke(0, 150, 255, 50); p.strokeWeight(1);
      p.rect(sx, 28, panelW, h - 60, 6);
      p.noStroke(); p.fill(0, 150, 255, 220); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
      p.text("Sistema Invertível", sx + panelW / 2, 36);
      p.fill(0, 150, 255, 150); p.textSize(8.5); p.textAlign(p.CENTER, p.TOP);
      p.text("y(t) = 2·x(t)  →  x(t) = y(t)/2", sx + panelW / 2, 52);

      const inputs = [0.2, 0.6, 1.0, 1.5, 2.0];
      const colInX = sx + 30, colOutX = sx + panelW - 30;
      const startY = 90, stepY = 40;

      p.noStroke(); p.fill(0, 150, 255, 140); p.textSize(8.5); p.textAlign(p.CENTER, p.TOP);
      p.text("x(t)", colInX, startY - 14);
      p.text("y(t) = 2x", colOutX, startY - 14);

      inputs.forEach((x, i) => {
        const y = 2 * x;
        const iy = startY + i * stepY;

        p.fill(0, 150, 255); p.noStroke(); p.circle(colInX, iy, 8);
        p.fill(0, 150, 255, 200); p.textSize(8.5); p.textAlign(p.CENTER, p.CENTER);
        p.text(x.toFixed(1), colInX, iy - 10);

        p.fill(100, 200, 100); p.noStroke(); p.circle(colOutX, iy, 8);
        p.fill(100, 200, 100, 200); p.textSize(8.5); p.textAlign(p.CENTER, p.CENTER);
        p.text(y.toFixed(1), colOutX, iy - 10);

        p.stroke(0, 150, 255, 120); p.strokeWeight(1.2);
        p.line(colInX + 5, iy, colOutX - 5, iy);
        p.fill(0, 150, 255, 120); p.noStroke();
        p.triangle(colOutX - 2, iy, colOutX - 9, iy - 3, colOutX - 9, iy + 3);
      });

      p.noStroke(); p.fill(0, 150, 255, 140); p.textSize(8.5); p.textAlign(p.CENTER, p.BOTTOM);
      p.text("✓ Mapeamento 1-para-1: x único → y único → x recuperável", sx + panelW / 2, h - 38);
    }

    // Non-invertible system
    {
      const sx = panelW + 20;
      p.fill(15, 20, 35); p.stroke(255, 100, 100, 50); p.strokeWeight(1);
      p.rect(sx, 28, panelW, h - 60, 6);
      p.noStroke(); p.fill(255, 100, 100, 220); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
      p.text("Sistema Não Invertível", sx + panelW / 2, 36);
      p.fill(255, 100, 100, 150); p.textSize(8.5); p.textAlign(p.CENTER, p.TOP);
      p.text("y(t) = x²(t)  →  x = ±√y  (ambíguo!)", sx + panelW / 2, 52);

      const inputs = [-1.5, -0.8, 0.0, 0.8, 1.5];
      const colInX = sx + 30, colOutX = sx + panelW - 30;
      const startY = 90, stepY = 40;

      p.noStroke(); p.fill(255, 100, 100, 140); p.textSize(8.5); p.textAlign(p.CENTER, p.TOP);
      p.text("x(t)", colInX, startY - 14);
      p.text("y = x²", colOutX, startY - 14);

      inputs.forEach((x, i) => {
        const y = x * x;
        const iy = startY + i * stepY;

        p.fill(255, 100, 100); p.noStroke(); p.circle(colInX, iy, 8);
        p.fill(255, 100, 100, 200); p.textSize(8.5); p.textAlign(p.CENTER, p.CENTER);
        p.text(x.toFixed(1), colInX, iy - 10);

        p.fill(255, 180, 50); p.noStroke(); p.circle(colOutX, iy, 8);
        p.fill(255, 180, 50, 200); p.textSize(8.5); p.textAlign(p.CENTER, p.CENTER);
        p.text(y.toFixed(2), colOutX, iy - 10);

        p.stroke(255, 100, 100, 100); p.strokeWeight(1.2);
        p.line(colInX + 5, iy, colOutX - 5, iy);
        p.fill(255, 100, 100, 100); p.noStroke();
        p.triangle(colOutX - 2, iy, colOutX - 9, iy - 3, colOutX - 9, iy + 3);
      });

      // Highlight pairs with same y
      p.stroke(255, 100, 100, 80); p.strokeWeight(1.5);
      p.line(colOutX + 6, startY, colOutX + 6, startY + 4 * stepY);
      p.noStroke(); p.fill(255, 100, 100, 140); p.textSize(8); p.textAlign(p.LEFT, p.CENTER);
      p.text("mesmo y!", colOutX + 9, startY + 2 * stepY);

      p.noStroke(); p.fill(255, 100, 100, 140); p.textSize(8.5); p.textAlign(p.CENTER, p.BOTTOM);
      p.text("✗ x=+1.5 e x=−1.5 geram y=2.25: não recuperamos x", sx + panelW / 2, h - 38);
    }

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Invertível: cada saída corresponde a exatamente uma entrada  |  Não invertível: x é ambíguo", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={330} />;
}

// Visualization 6: System classification summary
export function SystemClassificationSummary() {
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Resumo das 8 Classificações de Sistemas", w / 2, 8);

    const classes = [
      { a: "Linear",            b: "Não Linear",    key: "Superposição",        col: [0, 150, 255] },
      { a: "Invariante (LCIT)", b: "Variante (LVT)", key: "Deslocar entrada ↔ deslocar saída", col: [255, 180, 50] },
      { a: "Sem Memória",       b: "Com Memória",    key: "Saída depende de passado/futuro?", col: [100, 200, 100] },
      { a: "Causal",            b: "Não Causal",     key: "Usa valores futuros de x?",       col: [180, 130, 255] },
      { a: "Contínuo",          b: "Discreto",       key: "Domínio temporal de x e y",       col: [0, 200, 200] },
      { a: "Analógico",         b: "Digital",        key: "Amplitude de x e y",              col: [255, 100, 100] },
      { a: "Invertível",        b: "Não Invertível", key: "Mapeamento x→y é 1-para-1?",      col: [255, 180, 50] },
      { a: "Estável (BIBO)",    b: "Instável",       key: "Entrada limitada → saída limitada?", col: [100, 200, 100] },
    ];

    const cardW = (w - 25) / 2;
    const cardH = 36;
    const marginY = 32;

    classes.forEach((cls, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = 8 + col * (cardW + 9);
      const cy = marginY + row * (cardH + 6);

      p.fill(15, 20, 35); p.stroke(cls.col[0], cls.col[1], cls.col[2], 50); p.strokeWeight(1);
      p.rect(cx, cy, cardW, cardH, 4);

      // Left option (green check)
      p.noStroke(); p.fill(cls.col[0], cls.col[1], cls.col[2], 220);
      p.textSize(9); p.textAlign(p.LEFT, p.TOP);
      p.text("✓ " + cls.a, cx + 6, cy + 4);

      // Right option (red cross)
      p.fill(cls.col[0], cls.col[1], cls.col[2], 140);
      p.text("✗ " + cls.b, cx + cardW / 2 + 4, cy + 4);

      // Key criterion
      p.fill(cls.col[0], cls.col[1], cls.col[2], 100); p.textSize(7.5); p.textAlign(p.LEFT, p.TOP);
      p.text("→ " + cls.key, cx + 6, cy + 20);
    });

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Um sistema pode pertencer a múltiplas categorias simultaneamente", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={370} />;
}

