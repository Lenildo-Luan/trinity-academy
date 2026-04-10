"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

// Visualization 1: Signal energy — area under x²(t)
export function SignalEnergyArea() {
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
    p.text("Energia de um Sinal — Área sob x²(t)", w / 2, 6);

    const originX = 60;
    const originY1 = 100;
    const originY2 = 230;
    const axisW = w - 110;
    const axisH = 70;

    // Sweep progress (animated fill)
    const sweep = ((time * 0.3) % 1);

    // --- Top graph: x(t) = e^(-t) * sin(5t) for t >= 0 ---
    p.stroke(80);
    p.strokeWeight(0.5);
    p.line(originX, originY1 - axisH, originX, originY1 + axisH);
    p.line(originX, originY1, originX + axisW, originY1);

    p.noStroke();
    p.fill(0, 150, 255, 180);
    p.textSize(9);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("x(t)", originX - 35, originY1 - axisH / 2);
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("t", originX + axisW + 10, originY1);
    p.textAlign(p.LEFT, p.TOP);
    p.text("x(t) = e⁻ᵗ · sin(5t)", originX + 5, originY1 - axisH - 12);

    const signalFn = (t: number) => Math.exp(-t) * Math.sin(5 * t);
    const tMax = 5;

    // Draw x(t)
    p.stroke(0, 150, 255);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= axisW; i++) {
      const t = (i / axisW) * tMax;
      const val = signalFn(t);
      p.vertex(originX + i, originY1 - val * axisH * 0.9);
    }
    p.endShape();

    // Sweep line on x(t)
    const sweepX = originX + sweep * axisW;
    p.stroke(255, 180, 50, 120);
    p.strokeWeight(1);
    p.line(sweepX, originY1 - axisH, sweepX, originY1 + axisH);

    // --- Bottom graph: x²(t) with filled area ---
    p.stroke(80);
    p.strokeWeight(0.5);
    p.line(originX, originY2 - 10, originX, originY2 + axisH);
    p.line(originX, originY2 + axisH, originX + axisW, originY2 + axisH);

    p.noStroke();
    p.fill(100, 200, 100, 180);
    p.textSize(9);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("x²(t)", originX - 40, originY2 + axisH / 2 - 10);
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("t", originX + axisW + 10, originY2 + axisH);

    // Filled area under x²(t) up to sweep
    const fillLimit = Math.floor(sweep * axisW);
    p.fill(100, 200, 100, 40);
    p.noStroke();
    p.beginShape();
    p.vertex(originX, originY2 + axisH);
    for (let i = 0; i <= fillLimit; i++) {
      const t = (i / axisW) * tMax;
      const val = signalFn(t);
      const sq = val * val;
      p.vertex(originX + i, originY2 + axisH - sq * axisH * 3.5);
    }
    p.vertex(originX + fillLimit, originY2 + axisH);
    p.endShape(p.CLOSE);

    // Draw x²(t) curve
    p.stroke(100, 200, 100);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= axisW; i++) {
      const t = (i / axisW) * tMax;
      const val = signalFn(t);
      const sq = val * val;
      p.vertex(originX + i, originY2 + axisH - sq * axisH * 3.5);
    }
    p.endShape();

    // Sweep line on x²(t)
    p.stroke(255, 180, 50, 120);
    p.strokeWeight(1);
    p.line(sweepX, originY2 - 10, sweepX, originY2 + axisH);

    // Energy value (approximate integral)
    let energyAccum = 0;
    const dt = tMax / axisW;
    for (let i = 0; i <= fillLimit; i++) {
      const t = (i / axisW) * tMax;
      const val = signalFn(t);
      energyAccum += val * val * dt;
    }

    // Energy display box
    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(1);
    p.rect(w - 160, originY2 - 10, 145, 40, 5);
    p.noStroke();
    p.fill(255, 180, 50, 200);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Energia acumulada", w - 87, originY2 - 6);
    p.fill(255, 180, 50);
    p.textSize(14);
    p.text(`E = ${energyAccum.toFixed(3)}`, w - 87, originY2 + 8);

    // Formula box
    p.fill(15, 20, 35);
    p.stroke(180, 130, 255, 40);
    p.strokeWeight(1);
    p.rect(10, h - 42, w - 20, 32, 5);
    p.noStroke();
    p.fill(180, 130, 255, 200);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("E = ∫₋∞^∞ |x(t)|² dt  — Energia é a área total sob x²(t)", w / 2, h - 26);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("A energia mede o 'conteúdo total' do sinal ao longo de todo o tempo", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 2: Signal power — time-averaged energy for periodic signal
export function SignalPowerAverage() {
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
    p.text("Potência de um Sinal — Média Temporal de x²(t)", w / 2, 6);

    const originX = 60;
    const originY = 140;
    const axisW = w - 100;
    const axisH = 70;

    // x(t) = sin(2πt)
    p.stroke(80);
    p.strokeWeight(0.5);
    p.line(originX, originY - axisH - 5, originX, originY + axisH + 5);
    p.line(originX - 10, originY, originX + axisW, originY);

    p.noStroke();
    p.fill(0, 150, 255, 180);
    p.textSize(9);
    p.textAlign(p.LEFT, p.TOP);
    p.text("x(t) = sin(2πt)", originX + 5, originY - axisH - 18);
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("t", originX + axisW + 8, originY);

    const freq = 2 * Math.PI;
    const tMax = 4;

    // Draw sine wave
    p.stroke(0, 150, 255);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= axisW; i++) {
      const t = (i / axisW) * tMax;
      const val = Math.sin(freq * t);
      p.vertex(originX + i, originY - val * axisH * 0.85);
    }
    p.endShape();

    // Averaging window [-T/2, T/2]
    const windowCenter = axisW * 0.5;
    const windowHalf = (0.3 + Math.abs(Math.sin(time * 0.5)) * 0.3) * axisW;
    const wLeft = Math.max(0, windowCenter - windowHalf);
    const wRight = Math.min(axisW, windowCenter + windowHalf);

    p.fill(255, 180, 50, 25);
    p.noStroke();
    p.rect(originX + wLeft, originY - axisH - 5, wRight - wLeft, axisH * 2 + 10);

    p.stroke(255, 180, 50, 120);
    p.strokeWeight(1.5);
    p.line(originX + wLeft, originY - axisH - 5, originX + wLeft, originY + axisH + 5);
    p.line(originX + wRight, originY - axisH - 5, originX + wRight, originY + axisH + 5);

    p.noStroke();
    p.fill(255, 180, 50, 200);
    p.textSize(8);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("-T/2", originX + wLeft, originY - axisH - 8);
    p.text("+T/2", originX + wRight, originY - axisH - 8);
    p.text("← T →", originX + windowCenter, originY - axisH - 20);

    // Compute power over window
    let powerSum = 0;
    let count = 0;
    for (let i = Math.floor(wLeft); i <= Math.floor(wRight); i++) {
      const t = (i / axisW) * tMax;
      const val = Math.sin(freq * t);
      powerSum += val * val;
      count++;
    }
    const power = count > 0 ? powerSum / count : 0;

    // Power level line (x²(t) area below)
    const graphY2 = h - 100;
    const graphH2 = 50;

    p.stroke(80);
    p.strokeWeight(0.5);
    p.line(originX, graphY2 - graphH2 - 5, originX, graphY2 + 5);
    p.line(originX - 10, graphY2, originX + axisW, graphY2);

    p.noStroke();
    p.fill(100, 200, 100, 180);
    p.textSize(9);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("x²(t)", originX - 40, graphY2 - graphH2 / 2);

    // Draw x²(t)
    p.stroke(100, 200, 100, 150);
    p.strokeWeight(1.5);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= axisW; i++) {
      const t = (i / axisW) * tMax;
      const val = Math.sin(freq * t);
      p.vertex(originX + i, graphY2 - val * val * graphH2 * 0.95);
    }
    p.endShape();

    // Average power line (should be ~0.5 for sin²)
    const avgLineY = graphY2 - power * graphH2 * 0.95;
    p.stroke(255, 100, 100, 150);
    p.strokeWeight(1.5);
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    ctx.setLineDash([5, 5]);
    p.line(originX, avgLineY, originX + axisW, avgLineY);
    ctx.setLineDash([]);

    p.noStroke();
    p.fill(255, 100, 100, 200);
    p.textSize(9);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(`P = ${power.toFixed(3)}`, originX + axisW + 5, avgLineY);

    // Info box
    p.fill(15, 20, 35);
    p.stroke(180, 130, 255, 40);
    p.strokeWeight(1);
    p.rect(10, h - 42, w - 20, 32, 5);
    p.noStroke();
    p.fill(180, 130, 255, 200);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("P = lim(T→∞) (1/T) ∫₋ᵀ/₂^ᵀ/₂ |x(t)|² dt  — Potência é a média temporal de x²(t)", w / 2, h - 26);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Para sin(t): P = 0.5 — metade da potência de pico", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 3: Energy signal vs Power signal comparison
export function EnergyVsPowerSignals() {
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
    p.text("Sinal de Energia vs. Sinal de Potência", w / 2, 6);

    const halfW = w / 2 - 12;
    const panels = [
      { x: 5, title: "Sinal de Energia (E < ∞, P = 0)", col: [0, 150, 255] },
      { x: halfW + 19, title: "Sinal de Potência (E = ∞, P < ∞)", col: [255, 180, 50] },
    ];

    panels.forEach((panel, pi) => {
      const pW = halfW - 2;
      const midX = panel.x + pW / 2;

      p.fill(15, 20, 35);
      p.stroke(panel.col[0], panel.col[1], panel.col[2], 30);
      p.strokeWeight(1);
      p.rect(panel.x, 24, pW, h - 55, 6);

      p.noStroke();
      p.fill(panel.col[0], panel.col[1], panel.col[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text(panel.title, midX, 28);

      // Axes
      const axW = pW - 40;
      const axH = 55;
      const originX = panel.x + 30;
      const originY = 90;

      p.stroke(60);
      p.strokeWeight(0.5);
      p.line(originX, originY - axH, originX, originY + axH);
      p.line(originX, originY, originX + axW, originY);

      p.noStroke();
      p.fill(80);
      p.textSize(7);
      p.textAlign(p.CENTER, p.TOP);
      p.text("t", originX + axW + 5, originY);

      if (pi === 0) {
        // Energy signal: e^(-|t|)
        p.stroke(0, 150, 255);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        for (let i = 0; i <= axW; i++) {
          const t = ((i / axW) - 0.5) * 8;
          const val = Math.exp(-Math.abs(t));
          p.vertex(originX + i, originY - val * axH * 0.85);
        }
        p.endShape();

        p.noStroke();
        p.fill(0, 150, 255, 180);
        p.textSize(8);
        p.textAlign(p.CENTER, p.TOP);
        p.text("x(t) = e⁻|ᵗ|", midX, originY + axH + 5);

        // Characteristics
        const charY = originY + axH + 25;
        const chars = [
          "✓ Amplitude → 0 quando t → ±∞",
          "✓ Energia: E = ∫|x(t)|² dt = 1 (finita)",
          "✓ Potência: P = 0 (média de E→0)",
          "Exemplo: pulso, transiente, resposta ao impulso",
        ];
        chars.forEach((c, i) => {
          p.fill(i < 3 ? 160 : 120);
          p.textSize(7.5);
          p.textAlign(p.LEFT, p.TOP);
          p.text(c, panel.x + 12, charY + i * 14);
        });
      } else {
        // Power signal: cos(t) — persistent oscillation
        p.stroke(255, 180, 50);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        for (let i = 0; i <= axW; i++) {
          const t = (i / axW) * 6 * Math.PI;
          const val = Math.cos(t + time * 2);
          p.vertex(originX + i, originY - val * axH * 0.8);
        }
        p.endShape();

        // Extend arrows
        p.stroke(255, 180, 50, 80);
        p.strokeWeight(1);
        p.fill(255, 180, 50, 80);
        p.triangle(originX + axW + 2, originY, originX + axW - 2, originY - 3, originX + axW - 2, originY + 3);
        p.triangle(originX - 2, originY, originX + 3, originY - 3, originX + 3, originY + 3);

        p.noStroke();
        p.fill(255, 180, 50, 180);
        p.textSize(8);
        p.textAlign(p.CENTER, p.TOP);
        p.text("x(t) = cos(t)  (oscila para sempre)", midX, originY + axH + 5);

        const charY = originY + axH + 25;
        const chars = [
          "✓ Amplitude NÃO decai — oscila para sempre",
          "✓ Energia: E = ∞ (integral diverge)",
          "✓ Potência: P = ½ (finita e constante)",
          "Exemplo: senoide, onda quadrada, constante DC",
        ];
        chars.forEach((c, i) => {
          p.fill(i < 3 ? 160 : 120);
          p.textSize(7.5);
          p.textAlign(p.LEFT, p.TOP);
          p.text(c, panel.x + 12, charY + i * 14);
        });
      }
    });

    // Bottom summary
    p.fill(15, 20, 35);
    p.stroke(180, 130, 255, 40);
    p.strokeWeight(1);
    p.rect(10, h - 28, w - 20, 20, 5);
    p.noStroke();
    p.fill(180, 130, 255, 200);
    p.textSize(8.5);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Sinal de energia: amplitude decai → E finita, P=0  |  Sinal de potência: amplitude persiste → E=∞, P finita", w / 2, h - 18);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 4: RMS value — equivalent DC level
export function RMSValueDemo() {
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
    p.text("Valor RMS — Raiz Quadrada da Potência Média", w / 2, 6);

    const originX = 60;
    const originY = h / 2 - 10;
    const axisW = w - 100;
    const axisH = 80;

    // Axes
    p.stroke(60);
    p.strokeWeight(0.5);
    p.line(originX, originY - axisH - 5, originX, originY + axisH + 5);
    p.line(originX - 10, originY, originX + axisW, originY);

    p.noStroke();
    p.fill(80);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("t", originX + axisW + 8, originY);

    const amplitude = 1.0;
    const tMax = 4;
    const freq = 2 * Math.PI;
    const rms = amplitude / Math.sqrt(2);

    // Draw sine wave
    p.stroke(0, 150, 255);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= axisW; i++) {
      const t = (i / axisW) * tMax;
      const val = amplitude * Math.sin(freq * t + time * 2);
      p.vertex(originX + i, originY - val * axisH * 0.85);
    }
    p.endShape();

    // Peak amplitude lines
    const peakY1 = originY - amplitude * axisH * 0.85;
    const peakY2 = originY + amplitude * axisH * 0.85;
    p.stroke(0, 150, 255, 50);
    p.strokeWeight(1);
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    ctx.setLineDash([3, 3]);
    p.line(originX, peakY1, originX + axisW, peakY1);
    p.line(originX, peakY2, originX + axisW, peakY2);
    ctx.setLineDash([]);

    p.noStroke();
    p.fill(0, 150, 255, 120);
    p.textSize(8);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("A = 1", originX - 5, peakY1);
    p.text("-A", originX - 5, peakY2);

    // RMS level lines
    const rmsY1 = originY - rms * axisH * 0.85;
    const rmsY2 = originY + rms * axisH * 0.85;
    p.stroke(255, 100, 100, 150);
    p.strokeWeight(2);
    ctx.setLineDash([6, 4]);
    p.line(originX, rmsY1, originX + axisW, rmsY1);
    p.line(originX, rmsY2, originX + axisW, rmsY2);
    ctx.setLineDash([]);

    // RMS labels
    p.noStroke();
    p.fill(255, 100, 100, 200);
    p.textSize(9);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(`RMS = A/√2 ≈ ${rms.toFixed(3)}`, originX + axisW + 5, rmsY1);

    // RMS shaded band
    p.fill(255, 100, 100, 15);
    p.noStroke();
    p.rect(originX, rmsY1, axisW, rmsY2 - rmsY1);

    // Equivalent DC arrow
    const dcBoxX = w / 2 - 80;
    const dcBoxY = originY + axisH + 20;
    p.fill(15, 20, 35);
    p.stroke(255, 100, 100, 60);
    p.strokeWeight(1);
    p.rect(dcBoxX, dcBoxY, 160, 36, 5);
    p.noStroke();
    p.fill(255, 100, 100, 200);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Nível DC equivalente:", dcBoxX + 80, dcBoxY + 4);
    p.fill(255, 100, 100);
    p.textSize(11);
    p.text(`x_rms = √P = A/√2 ≈ 0.707A`, dcBoxX + 80, dcBoxY + 18);

    // Formula
    p.fill(15, 20, 35);
    p.stroke(180, 130, 255, 40);
    p.strokeWeight(1);
    p.rect(10, h - 38, w - 20, 28, 5);
    p.noStroke();
    p.fill(180, 130, 255, 200);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("x_rms = √P = √(lim(T→∞) (1/T) ∫|x(t)|² dt)  — Para sin: x_rms = A/√2 ≈ 0.707·A", w / 2, h - 24);
  };

  return <P5Sketch setup={setup} draw={draw} height={330} />;
}

// Visualization 5: Sinusoidal energy and power worked example
export function SinusoidalEnergyPower() {
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
    p.text("Exemplo: Energia e Potência de Sinais Comuns", w / 2, 6);

    // Three small plots side by side
    const cols = 3;
    const margin = 10;
    const colW = (w - margin * (cols + 1)) / cols;
    const axH = 45;
    const axTop = 50;

    const signals = [
      {
        name: "x(t) = A·sin(ωt)",
        sub: "Senoide pura",
        col: [0, 150, 255],
        fn: (t: number) => Math.sin(2 * Math.PI * t),
        E: "∞",
        P: "A²/2",
        Pnum: "0.500",
        rms: "A/√2",
      },
      {
        name: "x(t) = e⁻ᵗ·u(t)",
        sub: "Exponencial causal",
        col: [100, 200, 100],
        fn: (t: number) => t >= 0 ? Math.exp(-t * 2) : 0,
        E: "1/(2a)",
        P: "0",
        Pnum: "0",
        rms: "—",
      },
      {
        name: "x(t) = C (constante)",
        sub: "Sinal DC",
        col: [255, 180, 50],
        fn: (_t: number) => 0.7,
        E: "∞",
        P: "C²",
        Pnum: "C²",
        rms: "|C|",
      },
    ];

    signals.forEach((sig, si) => {
      const sx = margin + si * (colW + margin);
      const midX = sx + colW / 2;

      // Panel bg
      p.fill(15, 20, 35);
      p.stroke(sig.col[0], sig.col[1], sig.col[2], 30);
      p.strokeWeight(1);
      p.rect(sx, 24, colW, h - 55, 6);

      // Title
      p.noStroke();
      p.fill(sig.col[0], sig.col[1], sig.col[2]);
      p.textSize(8);
      p.textAlign(p.CENTER, p.TOP);
      p.text(sig.name, midX, 28);
      p.fill(80);
      p.textSize(7);
      p.text(sig.sub, midX, 39);

      // Mini axes
      const originX = sx + 20;
      const originY = axTop + axH + 10;
      const axW = colW - 40;

      p.stroke(50);
      p.strokeWeight(0.5);
      p.line(originX, axTop, originX, originY + 5);
      p.line(originX - 3, originY, originX + axW, originY);

      // Draw signal
      p.stroke(sig.col[0], sig.col[1], sig.col[2]);
      p.strokeWeight(1.5);
      p.noFill();
      p.beginShape();
      for (let i = 0; i <= axW; i++) {
        const t = ((i / axW) - 0.3) * 4;
        const val = sig.fn(t);
        const plotY = originY - val * axH * 0.85;
        p.vertex(originX + i, plotY);
      }
      p.endShape();

      // Results table
      const tableY = originY + 18;
      const rows = [
        { label: "Energia (E)", value: sig.E },
        { label: "Potência (P)", value: sig.P },
        { label: "RMS", value: sig.rms },
      ];

      rows.forEach((row, ri) => {
        const ry = tableY + ri * 20;
        p.fill(12, 18, 30);
        p.stroke(40);
        p.strokeWeight(0.5);
        p.rect(sx + 6, ry, colW - 12, 18, 2);
        p.noStroke();
        p.fill(130);
        p.textSize(7.5);
        p.textAlign(p.LEFT, p.CENTER);
        p.text(row.label, sx + 10, ry + 9);
        p.fill(sig.col[0], sig.col[1], sig.col[2], 220);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text(row.value, sx + colW - 10, ry + 9);
      });

      // Signal type badge
      const badgeY = tableY + 65;
      const isEnergy = sig.P === "0";
      const isPower = sig.E === "∞" && sig.P !== "0";
      const badgeCol = isEnergy ? [0, 150, 255] : [255, 180, 50];
      const badgeText = isEnergy ? "Sinal de Energia" : isPower ? "Sinal de Potência" : "Nem/Nem";

      p.fill(badgeCol[0], badgeCol[1], badgeCol[2], 30);
      p.stroke(badgeCol[0], badgeCol[1], badgeCol[2], 80);
      p.strokeWeight(1);
      p.rect(sx + 10, badgeY, colW - 20, 18, 4);
      p.noStroke();
      p.fill(badgeCol[0], badgeCol[1], badgeCol[2], 220);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(badgeText, midX, badgeY + 9);
    });

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cada tipo de sinal define qual medida é útil: E para transientes, P para periódicos", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 6: SNR — Signal-to-Noise Ratio
export function SNRVisualization() {
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
    p.text("SNR — Relação Sinal-Ruído", w / 2, 6);

    const originX = 55;
    const axisW = w - 90;
    const axH = 35;
    const tMax = 4;
    const freq = 2 * Math.PI;

    // Three rows: Signal, Noise, Signal+Noise
    const rows = [
      { label: "Sinal s(t)", originY: 60, col: [0, 150, 255], fn: (t: number) => Math.sin(freq * t) },
      { label: "Ruído n(t)", originY: 140, col: [255, 100, 100], fn: (t: number) => {
        // Deterministic noise approximation
        return 0.3 * (Math.sin(17.3 * t + 1.2) + Math.sin(31.7 * t + 0.7) + Math.sin(53.1 * t + 2.1)) / 3 * (1 + 0.3 * Math.sin(time * 3));
      }},
      { label: "s(t) + n(t)", originY: 220, col: [100, 200, 100], fn: (t: number) => {
        const s = Math.sin(freq * t);
        const n = 0.3 * (Math.sin(17.3 * t + 1.2) + Math.sin(31.7 * t + 0.7) + Math.sin(53.1 * t + 2.1)) / 3 * (1 + 0.3 * Math.sin(time * 3));
        return s + n;
      }},
    ];

    rows.forEach((row) => {
      // Axes
      p.stroke(50);
      p.strokeWeight(0.5);
      p.line(originX, row.originY - axH, originX, row.originY + axH);
      p.line(originX, row.originY, originX + axisW, row.originY);

      p.noStroke();
      p.fill(row.col[0], row.col[1], row.col[2], 180);
      p.textSize(8);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(row.label, originX - 5, row.originY - axH + 5);

      // Draw signal
      p.stroke(row.col[0], row.col[1], row.col[2]);
      p.strokeWeight(1.5);
      p.noFill();
      p.beginShape();
      for (let i = 0; i <= axisW; i++) {
        const t = (i / axisW) * tMax;
        const val = row.fn(t);
        p.vertex(originX + i, row.originY - val * axH * 0.85);
      }
      p.endShape();
    });

    // SNR box
    const snrBoxY = 270;
    const Ps = 0.5; // power of sin
    const Pn = 0.03; // approximate noise power
    const snrLinear = Ps / Pn;
    const snrDB = 10 * Math.log10(snrLinear);

    p.fill(15, 20, 35);
    p.stroke(180, 130, 255, 50);
    p.strokeWeight(1);
    p.rect(10, snrBoxY, w - 20, 55, 6);

    p.noStroke();
    p.fill(180, 130, 255, 200);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("SNR = P_sinal / P_ruído", w / 2, snrBoxY + 5);

    // Bars
    const barX = 30;
    const barY = snrBoxY + 22;
    const barMaxW = w / 2 - 50;

    // Signal power bar
    p.fill(0, 150, 255, 150);
    p.noStroke();
    p.rect(barX, barY, barMaxW * 0.8, 12, 3);
    p.fill(200);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(`P_sinal = ${Ps.toFixed(2)}`, barX + barMaxW * 0.8 + 5, barY + 6);

    // Noise power bar
    p.fill(255, 100, 100, 150);
    p.noStroke();
    p.rect(barX, barY + 16, barMaxW * Pn / Ps * 0.8, 12, 3);
    p.fill(200);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(`P_ruído ≈ ${Pn.toFixed(3)}`, barX + barMaxW * Pn / Ps * 0.8 + 5, barY + 22);

    // SNR value
    p.fill(100, 200, 100, 220);
    p.textSize(11);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text(`SNR ≈ ${snrDB.toFixed(1)} dB`, w - 20, barY + 13);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("SNR alto = sinal dominante  |  SNR baixo = ruído domina", w / 2, h - 4);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

