"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

// Visualization 1: System as input-output block with RC circuit analogy
export function SystemBlockDiagram() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Sistema como Bloco Entrada–Saída", w / 2, 8);

    // Input signal (animated sine)
    const inX = 35, sysX = w / 2 - 60, sysW = 120, sysY = h / 2 - 35, sysH = 70;
    const outX = w - 35;
    const midY = h / 2;

    // Draw input waveform
    p.stroke(0, 150, 255, 80); p.strokeWeight(1);
    p.line(inX, midY - 50, inX, midY + 50);
    p.noStroke(); p.fill(0, 150, 255, 150); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("x(t)", inX, midY - 52);
    p.stroke(0, 150, 255); p.strokeWeight(1.5); p.noFill();
    p.beginShape();
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * 2 * Math.PI;
      p.vertex(inX - 25 + i * 0.6, midY + Math.sin(t + time) * 30);
    }
    p.endShape();

    // Arrow from input to system
    p.stroke(100, 150, 200); p.strokeWeight(2);
    p.line(inX + 20, midY, sysX - 5, midY);
    p.fill(100, 150, 200); p.noStroke();
    p.triangle(sysX - 2, midY, sysX - 10, midY - 4, sysX - 10, midY + 4);
    p.noStroke(); p.fill(100, 150, 200); p.textSize(8.5); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("entrada", (inX + 20 + sysX - 5) / 2, midY - 4);

    // System block
    p.fill(15, 25, 45); p.stroke(180, 130, 255, 120); p.strokeWeight(2);
    p.rect(sysX, sysY, sysW, sysH, 8);
    p.noStroke(); p.fill(180, 130, 255, 220); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
    p.text("SISTEMA", sysX + sysW / 2, sysY + sysH / 2 - 8);
    p.fill(180, 130, 255, 140); p.textSize(8.5);
    p.text("processa x(t)", sysX + sysW / 2, sysY + sysH / 2 + 8);
    p.text("→ gera y(t)", sysX + sysW / 2, sysY + sysH / 2 + 20);

    // Arrow from system to output
    p.stroke(100, 200, 100); p.strokeWeight(2);
    p.line(sysX + sysW + 5, midY, outX - 20, midY);
    p.fill(100, 200, 100); p.noStroke();
    p.triangle(outX - 17, midY, outX - 25, midY - 4, outX - 25, midY + 4);
    p.noStroke(); p.fill(100, 200, 100); p.textSize(8.5); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("saída", (sysX + sysW + 5 + outX - 20) / 2, midY - 4);

    // Draw output waveform (transformed: attenuated and phase-shifted)
    p.stroke(100, 200, 100, 80); p.strokeWeight(1);
    p.line(outX, midY - 50, outX, midY + 50);
    p.noStroke(); p.fill(100, 200, 100, 150); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("y(t)", outX, midY - 52);
    p.stroke(100, 200, 100); p.strokeWeight(1.5); p.noFill();
    p.beginShape();
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * 2 * Math.PI;
      p.vertex(outX - 10 + i * 0.6, midY + Math.sin(t + time - 0.8) * 18);
    }
    p.endShape();

    // Condition box
    p.fill(15, 20, 35); p.stroke(255, 180, 50, 50); p.strokeWeight(1);
    p.rect(10, h - 52, w - 20, 40, 5);
    p.noStroke(); p.fill(255, 180, 50, 200); p.textSize(9); p.textAlign(p.CENTER, p.CENTER);
    p.text("Sistema = regra matemática que transforma x(t) em y(t)", w / 2, h - 38);
    p.fill(255, 180, 50, 140); p.textSize(8.5);
    p.text("pode ser implementado em hardware (circuito) ou software (algoritmo)", w / 2, h - 24);
  };
  return <P5Sketch setup={setup} draw={draw} height={300} />;
}

// Visualization 2: RC circuit — physical components and equations
export function RCCircuitModel() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Circuito RC — Modelagem Matemática de um Sistema", w / 2, 8);

    // Left panel: circuit diagram
    const panelW = w / 2 - 10;
    p.fill(15, 20, 35); p.stroke(0, 150, 255, 40); p.strokeWeight(1);
    p.rect(8, 28, panelW, h - 60, 6);
    p.noStroke(); p.fill(0, 150, 255, 200); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
    p.text("Circuito RC", 8 + panelW / 2, 36);

    // Draw simplified circuit
    const cx = 8 + panelW / 2, cy = h / 2 + 10;
    const cw = panelW - 40;

    // Top wire
    p.stroke(150); p.strokeWeight(2);
    p.line(cx - cw / 2, cy - 50, cx + cw / 2, cy - 50);
    // Bottom wire
    p.line(cx - cw / 2, cy + 50, cx + cw / 2, cy + 50);
    // Left side (voltage source)
    p.line(cx - cw / 2, cy - 50, cx - cw / 2, cy + 50);
    // Right side
    p.line(cx + cw / 2, cy - 50, cx + cw / 2, cy + 50);

    // Voltage source (circle on left)
    const srcX = cx - cw / 2, srcY = cy;
    p.fill(2, 7, 19); p.stroke(255, 180, 50); p.strokeWeight(2);
    p.circle(srcX, srcY, 28);
    p.noStroke(); p.fill(255, 180, 50); p.textSize(9); p.textAlign(p.CENTER, p.CENTER);
    p.text("x(t)", srcX, srcY);

    // Resistor (zigzag) on top wire
    const rX = cx - 20;
    p.stroke(100, 200, 100); p.strokeWeight(2); p.noFill();
    p.beginShape();
    for (let i = 0; i <= 8; i++) {
      const rx = rX - 20 + i * 5;
      const ry = cy - 50 + (i % 2 === 0 ? 0 : -8);
      p.vertex(rx, ry);
    }
    p.endShape();
    p.noStroke(); p.fill(100, 200, 100, 200); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("R", rX, cy - 60);

    // Capacitor (two lines) on right side
    const capX = cx + cw / 2;
    p.stroke(180, 130, 255); p.strokeWeight(2.5);
    p.line(capX, cy - 18, capX, cy - 8);
    p.line(capX - 14, cy - 8, capX + 14, cy - 8);
    p.line(capX - 14, cy + 8, capX + 14, cy + 8);
    p.line(capX, cy + 8, capX, cy + 18);
    p.noStroke(); p.fill(180, 130, 255, 200); p.textSize(9); p.textAlign(p.LEFT, p.CENTER);
    p.text("C", capX + 17, cy);
    p.fill(180, 130, 255, 180); p.textSize(8.5); p.textAlign(p.CENTER, p.CENTER);
    p.text("y(t)", capX, cy + 30);

    // Right panel: equations
    const rPanelX = w / 2 + 5;
    p.fill(15, 20, 35); p.stroke(255, 180, 50, 40); p.strokeWeight(1);
    p.rect(rPanelX, 28, panelW, h - 60, 6);
    p.noStroke(); p.fill(255, 180, 50, 200); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
    p.text("Equações do Sistema", rPanelX + panelW / 2, 36);

    const eqs = [
      { label: "Lei de Kirchhoff:", expr: "i(t) = i_R(t) = i_C(t)", col: [150, 200, 255] },
      { label: "Corrente no cap.:", expr: "i_C(t) = C · dy(t)/dt", col: [180, 130, 255] },
      { label: "Tensão no res.:", expr: "x(t) − y(t) = R · i(t)", col: [100, 200, 100] },
      { label: "Combinando:", expr: "RC · dy/dt + y(t) = x(t)", col: [255, 180, 50] },
      { label: "Forma padrão:", expr: "dy/dt + (1/RC)·y = (1/RC)·x", col: [255, 100, 100] },
    ];

    eqs.forEach((eq, i) => {
      const ey = 58 + i * 48;
      p.fill(15, 25, 45); p.stroke(eq.col[0], eq.col[1], eq.col[2], 40); p.strokeWeight(1);
      p.rect(rPanelX + 8, ey, panelW - 16, 40, 4);
      p.noStroke(); p.fill(eq.col[0], eq.col[1], eq.col[2], 150); p.textSize(8); p.textAlign(p.LEFT, p.TOP);
      p.text(eq.label, rPanelX + 14, ey + 4);
      p.fill(eq.col[0], eq.col[1], eq.col[2], 230); p.textSize(9.5); p.textAlign(p.LEFT, p.TOP);
      p.text(eq.expr, rPanelX + 14, ey + 18);
    });

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("O circuito RC é descrito por uma EDO de 1ª ordem: RC·dy/dt + y(t) = x(t)", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={350} />;
}

// Visualization 3: RC circuit response — zero-input, zero-state, and total
export function RCCircuitResponse() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Resposta do Circuito RC — Componentes da Saída", w / 2, 8);

    const RC = 1.5;
    const A = 0.8;   // zero-input initial amplitude
    const ox = 55, oy = h / 2 + 20, aw = w - 90, tMax = 6;
    const tToX = (t: number) => ox + (t / tMax) * aw;
    const scaleY = 55;

    // Axes
    p.stroke(50); p.strokeWeight(0.8);
    p.line(ox - 5, oy, tToX(tMax) + 5, oy);
    p.line(tToX(0), oy - scaleY - 15, tToX(0), oy + 15);
    p.noStroke(); p.fill(70); p.textSize(7.5); p.textAlign(p.CENTER, p.TOP);
    for (let t = 0; t <= tMax; t++) {
      const tx = tToX(t);
      p.stroke(25); p.strokeWeight(0.3); p.line(tx, oy - 2, tx, oy + 2); p.noStroke();
      p.fill(65); p.text(t.toString(), tx, oy + 4);
    }
    p.fill(90); p.textAlign(p.LEFT, p.CENTER); p.textSize(8); p.text("t", tToX(tMax) + 7, oy);

    // Zero-input response: y_zi(t) = A·e^(−t/RC)
    p.stroke(0, 150, 255); p.strokeWeight(1.8); p.noFill();
    p.beginShape();
    for (let i = 0; i <= aw; i++) {
      const t = (i / aw) * tMax;
      p.vertex(tToX(t), oy - A * Math.exp(-t / RC) * scaleY);
    }
    p.endShape();
    p.noStroke(); p.fill(0, 150, 255, 200); p.textSize(8.5); p.textAlign(p.LEFT, p.TOP);
    p.text("y_zi(t) = 0.8·e^(−t/RC)  [resposta de entrada nula]", ox + 5, oy - scaleY - 12);

    // Zero-state response: y_zs(t) = (1 − e^(−t/RC))·u(t) for step input
    p.stroke(255, 180, 50); p.strokeWeight(1.8); p.noFill();
    p.beginShape();
    for (let i = 0; i <= aw; i++) {
      const t = (i / aw) * tMax;
      p.vertex(tToX(t), oy - (1 - Math.exp(-t / RC)) * scaleY);
    }
    p.endShape();
    p.noStroke(); p.fill(255, 180, 50, 200); p.textSize(8.5); p.textAlign(p.LEFT, p.TOP);
    p.text("y_zs(t) = 1 − e^(−t/RC)  [resposta de estado nulo]", ox + 5, oy - scaleY + 4);

    // Total response
    p.stroke(100, 200, 100); p.strokeWeight(2.2); p.noFill();
    p.beginShape();
    for (let i = 0; i <= aw; i++) {
      const t = (i / aw) * tMax;
      const total = A * Math.exp(-t / RC) + (1 - Math.exp(-t / RC));
      p.vertex(tToX(t), oy - total * scaleY);
    }
    p.endShape();
    p.noStroke(); p.fill(100, 200, 100, 200); p.textSize(8.5); p.textAlign(p.LEFT, p.TOP);
    p.text("y(t) = y_zi + y_zs  [resposta total]", ox + 5, oy - scaleY + 20);

    // Animated cursor
    const tCursor = ((time * 0.5) % tMax);
    const cx = tToX(tCursor);
    const yZI = A * Math.exp(-tCursor / RC);
    const yZS = 1 - Math.exp(-tCursor / RC);
    const yTot = yZI + yZS;
    p.stroke(200, 200, 200, 80); p.strokeWeight(1);
    p.line(cx, oy - scaleY - 15, cx, oy + 10);
    p.fill(0, 150, 255); p.noStroke(); p.circle(cx, oy - yZI * scaleY, 6);
    p.fill(255, 180, 50); p.circle(cx, oy - yZS * scaleY, 6);
    p.fill(100, 200, 100); p.circle(cx, oy - yTot * scaleY, 6);

    // Amplitude labels
    p.noStroke(); p.fill(100); p.textSize(7.5); p.textAlign(p.RIGHT, p.CENTER);
    p.text("1", tToX(0) - 5, oy - scaleY);

    // Bottom formula
    p.fill(15, 20, 35); p.stroke(100, 200, 100, 50); p.strokeWeight(1);
    p.rect(10, h - 38, w - 20, 28, 5);
    p.noStroke(); p.fill(100, 200, 100, 220); p.textSize(10); p.textAlign(p.CENTER, p.CENTER);
    p.text("Resposta Total = Resposta de Entrada Nula + Resposta de Estado Nulo", w / 2, h - 24);
  };
  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 4: Initial conditions effect on RC response
export function InitialConditionsEffect() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Efeito das Condições Iniciais na Resposta do Sistema", w / 2, 8);

    const RC = 1.2;
    const ox = 55, oy = h / 2 + 10, aw = w - 90, tMax = 5;
    const tToX = (t: number) => ox + (t / tMax) * aw;
    const scaleY = 55;

    // Axes
    p.stroke(50); p.strokeWeight(0.7);
    p.line(ox - 5, oy, tToX(tMax) + 5, oy);
    p.line(tToX(0), oy - scaleY - 20, tToX(0), oy + 15);
    p.noStroke(); p.fill(70); p.textSize(7.5); p.textAlign(p.CENTER, p.TOP);
    for (let t = 0; t <= tMax; t++) {
      const tx = tToX(t);
      p.stroke(25); p.strokeWeight(0.3); p.line(tx, oy - 2, tx, oy + 2); p.noStroke();
      p.fill(65); p.text(t.toString(), tx, oy + 4);
    }
    p.fill(90); p.textAlign(p.LEFT, p.CENTER); p.textSize(8); p.text("t", tToX(tMax) + 7, oy);

    // Steady-state line
    p.stroke(60); p.strokeWeight(1); (p.drawingContext as CanvasRenderingContext2D).setLineDash([4, 4]);
    p.line(ox, oy - scaleY, tToX(tMax), oy - scaleY);
    (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);
    p.noStroke(); p.fill(80); p.textSize(8); p.textAlign(p.RIGHT, p.CENTER);
    p.text("y_∞=1", ox - 5, oy - scaleY);

    // Different initial conditions
    const y0s = [
      { y0: 0.0, col: [255, 100, 100], label: "y(0) = 0.0" },
      { y0: 0.5, col: [255, 180, 50], label: "y(0) = 0.5" },
      { y0: 1.0, col: [100, 200, 100], label: "y(0) = 1.0" },
      { y0: 1.8, col: [0, 150, 255], label: "y(0) = 1.8" },
    ];

    y0s.forEach((sig) => {
      p.stroke(sig.col[0], sig.col[1], sig.col[2]); p.strokeWeight(1.8); p.noFill();
      p.beginShape();
      for (let i = 0; i <= aw; i++) {
        const t = (i / aw) * tMax;
        // y(t) = y_inf + (y0 - y_inf)·e^(−t/RC) for step x(t) = 1
        const y = 1 + (sig.y0 - 1) * Math.exp(-t / RC);
        p.vertex(tToX(t), oy - y * scaleY);
      }
      p.endShape();
      // Label at right end
      const yEnd = 1 + (sig.y0 - 1) * Math.exp(-tMax / RC);
      p.noStroke(); p.fill(sig.col[0], sig.col[1], sig.col[2], 200);
      p.textSize(8.5); p.textAlign(p.LEFT, p.CENTER);
      p.text(sig.label, tToX(tMax) + 4, oy - yEnd * scaleY);
    });

    // Convergence annotation
    p.noStroke(); p.fill(150, 150, 200, 160); p.textSize(8.5); p.textAlign(p.CENTER, p.TOP);
    p.text("Todos os sistemas convergem para y_∞ = 1,", w / 2, oy - scaleY - 18);
    p.text("independente das condições iniciais (sistema estável)", w / 2, oy - scaleY - 6);

    p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Condição inicial y(0): estado do capacitor em t = 0. Determina o transitório, não o regime permanente.", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={300} />;
}

// Visualization 5: Mathematical model pipeline — from physics to equations
export function PhysicsToMathModel() {
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Do Sistema Físico ao Modelo Matemático", w / 2, 8);

    const steps = [
      {
        icon: "⚡", title: "Sistema Físico",
        desc: "Circuito RC, mola-massa-amortecedor,\ntanque de nível, braço robótico",
        col: [0, 150, 255],
      },
      {
        icon: "📐", title: "Leis Físicas",
        desc: "Kirchhoff, Newton, Bernoulli,\nLei de Ohm, Segunda Lei de Newton",
        col: [255, 180, 50],
      },
      {
        icon: "∫", title: "Equação Diferencial",
        desc: "a_n·y^(n) + ... + a_0·y = b_m·x^(m) + ...\n(EDO linear com coef. constantes)",
        col: [100, 200, 100],
      },
      {
        icon: "🔢", title: "Solução Matemática",
        desc: "y(t) = y_zi(t) + y_zs(t)\nresposta natural + resposta forçada",
        col: [180, 130, 255],
      },
    ];

    const stepW = (w - 30) / 4;
    const stepH = h - 80;
    const stepY = 38;

    steps.forEach((step, i) => {
      const sx = 10 + i * (stepW + 5);

      // Card
      p.fill(15, 20, 35); p.stroke(step.col[0], step.col[1], step.col[2], 60); p.strokeWeight(1.5);
      p.rect(sx, stepY, stepW, stepH, 6);

      // Icon
      p.noStroke(); p.fill(step.col[0], step.col[1], step.col[2], 220);
      p.textSize(18); p.textAlign(p.CENTER, p.TOP);
      p.text(step.icon, sx + stepW / 2, stepY + 10);

      // Title
      p.textSize(9.5); p.textAlign(p.CENTER, p.TOP);
      p.text(step.title, sx + stepW / 2, stepY + 36);

      // Desc
      p.fill(step.col[0], step.col[1], step.col[2], 150); p.textSize(8);
      const lines = step.desc.split("\n");
      lines.forEach((line, li) => {
        p.text(line, sx + stepW / 2, stepY + 54 + li * 13);
      });

      // Arrows between steps
      if (i < steps.length - 1) {
        const arrowX = sx + stepW + 2.5;
        p.stroke(150, 150, 180, 120); p.strokeWeight(2);
        p.line(arrowX, h / 2, arrowX + 2, h / 2);
        p.fill(150, 150, 180, 120); p.noStroke();
        p.triangle(arrowX + 3, h / 2, arrowX - 1, h / 2 - 4, arrowX - 1, h / 2 + 4);
      }

      // Step number
      p.noStroke(); p.fill(step.col[0], step.col[1], step.col[2], 100);
      p.textSize(22); p.textAlign(p.RIGHT, p.BOTTOM);
      p.text((i + 1).toString(), sx + stepW - 8, stepY + stepH - 6);
    });

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("A modelagem transforma o problema físico em equações que podem ser analisadas e resolvidas", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={260} />;
}

// Visualization 6: EDO solution — natural vs forced response
export function NaturalVsForcedResponse() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Solução da EDO — Resposta Natural e Forçada", w / 2, 8);

    const RC = 1.5;
    const omega = 1.5; // driving frequency
    const ox = 55, oy = h / 2 + 20, aw = w - 90, tMax = 8;
    const tToX = (t: number) => ox + (t / tMax) * aw;
    const scaleY = 50;

    // Axes
    p.stroke(50); p.strokeWeight(0.7);
    p.line(ox - 5, oy, tToX(tMax) + 5, oy);
    p.line(tToX(0), oy - scaleY - 15, tToX(0), oy + 15);
    p.noStroke(); p.fill(70); p.textSize(7.5); p.textAlign(p.CENTER, p.TOP);
    for (let t = 0; t <= tMax; t++) {
      const tx = tToX(t);
      p.stroke(25); p.strokeWeight(0.3); p.line(tx, oy - 2, tx, oy + 2); p.noStroke();
      p.fill(65); p.text(t.toString(), tx, oy + 4);
    }
    p.fill(90); p.textAlign(p.LEFT, p.CENTER); p.textSize(8); p.text("t", tToX(tMax) + 7, oy);

    // Natural response (homogeneous): decaying exponential
    p.stroke(0, 150, 255); p.strokeWeight(1.8); p.noFill();
    p.beginShape();
    for (let i = 0; i <= aw; i++) {
      const t = (i / aw) * tMax;
      p.vertex(tToX(t), oy - Math.exp(-t / RC) * scaleY);
    }
    p.endShape();

    // Forced response (particular): sinusoidal at driving frequency
    const amp = 0.6;
    const phi = -Math.atan(omega * RC);
    p.stroke(255, 180, 50); p.strokeWeight(1.8); p.noFill();
    p.beginShape();
    for (let i = 0; i <= aw; i++) {
      const t = (i / aw) * tMax;
      p.vertex(tToX(t), oy - amp * Math.sin(omega * t + phi) * scaleY);
    }
    p.endShape();

    // Total response
    p.stroke(100, 200, 100); p.strokeWeight(2.2); p.noFill();
    p.beginShape();
    for (let i = 0; i <= aw; i++) {
      const t = (i / aw) * tMax;
      const natural = Math.exp(-t / RC) * scaleY;
      const forced = amp * Math.sin(omega * t + phi) * scaleY;
      p.vertex(tToX(t), oy - (natural + forced) / scaleY * scaleY);
    }
    p.endShape();

    // Legend
    const legendItems = [
      { col: [0, 150, 255], label: "Resposta Natural (homogênea): decai para 0" },
      { col: [255, 180, 50], label: "Resposta Forçada (particular): segue x(t)" },
      { col: [100, 200, 100], label: "Resposta Total = Natural + Forçada" },
    ];
    legendItems.forEach((item, i) => {
      p.stroke(item.col[0], item.col[1], item.col[2]); p.strokeWeight(2);
      p.line(ox + 5, oy - scaleY - 12 + i * 14, ox + 25, oy - scaleY - 12 + i * 14);
      p.noStroke(); p.fill(item.col[0], item.col[1], item.col[2], 200);
      p.textSize(8.5); p.textAlign(p.LEFT, p.CENTER);
      p.text(item.label, ox + 30, oy - scaleY - 12 + i * 14);
    });

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Resposta natural: modos do sistema (polos). Forçada: imposta pela entrada. Total = soma das duas.", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={300} />;
}

