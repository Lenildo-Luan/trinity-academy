"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

// Visualization 1: Two methods of system analysis
export function TwoAnalysisMethods() {
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Dois Métodos de Análise de Sistemas LIT", w / 2, 8);

    const panelW = (w - 30) / 2;

    // Method 1: Time domain
    {
      const sx = 10;
      p.fill(15, 20, 35); p.stroke(0, 150, 255, 50); p.strokeWeight(1);
      p.rect(sx, 28, panelW, h - 60, 6);
      p.noStroke(); p.fill(0, 150, 255, 220); p.textSize(10.5); p.textAlign(p.CENTER, p.TOP);
      p.text("Domínio do Tempo", sx + panelW / 2, 36);

      const items = [
        { icon: "∫", title: "Ferramenta: EDO", desc: "Equações diferenciais\nlineares com coef. const." },
        { icon: "ℎ", title: "Resposta ao impulso h(t)", desc: "Convolução: y = x * h\n(integral de convolução)" },
        { icon: "⚡", title: "Componentes da resposta", desc: "y = y_zi + y_zs\n(entrada nula + estado nulo)" },
        { icon: "📈", title: "Resultado", desc: "Saída y(t) no tempo\n(forma de onda direta)" },
      ];

      items.forEach((item, i) => {
        const iy = 58 + i * 52;
        p.fill(15, 25, 45); p.stroke(0, 150, 255, 40); p.strokeWeight(1);
        p.rect(sx + 8, iy, panelW - 16, 45, 4);
        p.noStroke(); p.fill(0, 150, 255, 220); p.textSize(14); p.textAlign(p.LEFT, p.CENTER);
        p.text(item.icon, sx + 18, iy + 14);
        p.textSize(9.5); p.textAlign(p.LEFT, p.TOP);
        p.text(item.title, sx + 36, iy + 5);
        p.fill(0, 150, 255, 140); p.textSize(8);
        item.desc.split("\n").forEach((line, li) => {
          p.text(line, sx + 36, iy + 20 + li * 11);
        });
      });
    }

    // Method 2: Frequency domain
    {
      const sx = panelW + 20;
      p.fill(15, 20, 35); p.stroke(255, 180, 50, 50); p.strokeWeight(1);
      p.rect(sx, 28, panelW, h - 60, 6);
      p.noStroke(); p.fill(255, 180, 50, 220); p.textSize(10.5); p.textAlign(p.CENTER, p.TOP);
      p.text("Domínio da Frequência", sx + panelW / 2, 36);

      const items = [
        { icon: "∿", title: "Ferramenta: Fourier / Laplace", desc: "Transformada de Laplace\n(capítulos futuros)" },
        { icon: "H", title: "Função de Transferência H(s)", desc: "Y(s) = H(s) · X(s)\n(multiplicação, não convolução!)" },
        { icon: "◎", title: "Análise de polos e zeros", desc: "Estabilidade, resposta\nde frequência, filtros" },
        { icon: "📊", title: "Resultado", desc: "Espectro de frequências\n(amplitude e fase)" },
      ];

      items.forEach((item, i) => {
        const iy = 58 + i * 52;
        p.fill(15, 25, 45); p.stroke(255, 180, 50, 40); p.strokeWeight(1);
        p.rect(sx + 8, iy, panelW - 16, 45, 4);
        p.noStroke(); p.fill(255, 180, 50, 220); p.textSize(14); p.textAlign(p.LEFT, p.CENTER);
        p.text(item.icon, sx + 18, iy + 14);
        p.textSize(9.5); p.textAlign(p.LEFT, p.TOP);
        p.text(item.title, sx + 36, iy + 5);
        p.fill(255, 180, 50, 140); p.textSize(8);
        item.desc.split("\n").forEach((line, li) => {
          p.text(line, sx + 36, iy + 20 + li * 11);
        });
      });
    }

    // Bridge arrow
    p.stroke(150, 150, 200, 120); p.strokeWeight(2);
    p.line(w / 2 - 8, h / 2, w / 2 + 8, h / 2);
    p.fill(150, 150, 200, 120); p.noStroke();
    p.triangle(w / 2 + 11, h / 2, w / 2 + 3, h / 2 - 4, w / 2 + 3, h / 2 + 4);
    p.triangle(w / 2 - 11, h / 2, w / 2 - 3, h / 2 - 4, w / 2 - 3, h / 2 + 4);
    p.noStroke(); p.fill(150, 150, 200, 160); p.textSize(7.5); p.textAlign(p.CENTER, p.CENTER);
    p.text("dual", w / 2, h / 2 - 8);

    p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Este capítulo cobre o domínio do tempo. Domínio da frequência: módulos futuros.", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 2: Zero-input / Zero-state decomposition
export function ZeroInputZeroStateDecomp() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Decomposição da Resposta Total", w / 2, 8);

    const RC = 1.5;
    const y0 = 1.2; // initial condition
    const ox = 60, oy = h / 2 + 25, aw = w - 95, tMax = 7;
    const tToX = (t: number) => ox + (t / tMax) * aw;
    const scaleY = 50;

    // Axes
    p.stroke(50); p.strokeWeight(0.8);
    p.line(ox - 5, oy, tToX(tMax) + 5, oy);
    p.line(tToX(0), oy - 80, tToX(0), oy + 18);
    p.noStroke(); p.fill(70); p.textSize(7.5); p.textAlign(p.CENTER, p.TOP);
    for (let t = 0; t <= tMax; t++) {
      const tx = tToX(t);
      p.stroke(25); p.strokeWeight(0.3); p.line(tx, oy - 2, tx, oy + 2); p.noStroke();
      p.fill(65); p.text(t.toString(), tx, oy + 4);
    }
    p.fill(90); p.textAlign(p.LEFT, p.CENTER); p.textSize(8); p.text("t", tToX(tMax) + 7, oy);

    // Zero-input response: purely from initial condition
    p.stroke(0, 150, 255); p.strokeWeight(2); p.noFill();
    p.beginShape();
    for (let i = 0; i <= aw; i++) {
      const t = (i / aw) * tMax;
      p.vertex(tToX(t), oy - y0 * Math.exp(-t / RC) * scaleY);
    }
    p.endShape();
    p.noStroke(); p.fill(0, 150, 255, 200); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
    p.text("y_zi(t) = y(0)·e^(−t/RC)  [cond. inicial: y(0)=" + y0 + ", entrada=0]", ox + 5, oy - 78);

    // Zero-state response: purely from input (no initial condition)
    p.stroke(255, 180, 50); p.strokeWeight(2); p.noFill();
    p.beginShape();
    for (let i = 0; i <= aw; i++) {
      const t = (i / aw) * tMax;
      p.vertex(tToX(t), oy - (1 - Math.exp(-t / RC)) * scaleY);
    }
    p.endShape();
    p.noStroke(); p.fill(255, 180, 50, 200); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
    p.text("y_zs(t) = 1 − e^(−t/RC)  [cond. inicial zero, entrada=u(t)]", ox + 5, oy - 64);

    // Total response
    p.stroke(100, 200, 100); p.strokeWeight(2.5); p.noFill();
    p.beginShape();
    for (let i = 0; i <= aw; i++) {
      const t = (i / aw) * tMax;
      const total = y0 * Math.exp(-t / RC) + (1 - Math.exp(-t / RC));
      p.vertex(tToX(t), oy - total * scaleY);
    }
    p.endShape();
    p.noStroke(); p.fill(100, 200, 100, 200); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
    p.text("y(t) = y_zi + y_zs  [resposta total]", ox + 5, oy - 50);

    // Animated reading cursor
    const tC = ((time * 0.5) % tMax);
    const xC = tToX(tC);
    const yziC = y0 * Math.exp(-tC / RC) * scaleY;
    const yzsC = (1 - Math.exp(-tC / RC)) * scaleY;
    const ytotC = yziC + yzsC;
    p.stroke(200, 200, 200, 60); p.strokeWeight(1);
    p.line(xC, oy - 80, xC, oy + 10);
    p.fill(0, 150, 255); p.noStroke(); p.circle(xC, oy - yziC, 6);
    p.fill(255, 180, 50); p.circle(xC, oy - yzsC, 6);
    p.fill(100, 200, 100); p.circle(xC, oy - ytotC, 6);

    // Formula box
    p.fill(15, 20, 35); p.stroke(100, 200, 100, 50); p.strokeWeight(1);
    p.rect(10, h - 42, w - 20, 30, 5);
    p.noStroke(); p.fill(100, 200, 100, 220); p.textSize(10); p.textAlign(p.CENTER, p.CENTER);
    p.text("y(t) = y_zi(t) + y_zs(t)  =  [resposta natural] + [resposta forçada]", w / 2, h - 27);
  };
  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 3: Characteristic modes (natural frequencies)
export function CharacteristicModes() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Modos Característicos — Raízes da Equação Característica", w / 2, 8);

    const tMax = 8;
    const ox = 55, aw = w - 90;
    const tToX = (t: number) => ox + (t / tMax) * aw;
    const scaleY = 50;

    const modes = [
      {
        label: "σ < 0: e^(σt)cos(ωt)  — amortecido (estável)",
        oy: 90, col: [100, 200, 100],
        fn: (t: number) => Math.exp(-0.5 * t) * Math.cos(4 * t),
      },
      {
        label: "σ = 0: cos(ωt)  — oscilatório (limítrofe)",
        oy: 195, col: [255, 180, 50],
        fn: (t: number) => Math.cos(4 * t) * 0.8,
      },
      {
        label: "σ > 0: e^(σt)  — crescente (instável)",
        oy: 300, col: [255, 100, 100],
        fn: (t: number) => Math.exp(0.3 * t) * 0.12,
      },
    ];

    modes.forEach((mode) => {
      // Axis
      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox - 5, mode.oy, tToX(tMax) + 5, mode.oy);
      p.line(tToX(0), mode.oy - 55, tToX(0), mode.oy + 10);
      p.noStroke(); p.fill(70); p.textSize(7.5); p.textAlign(p.CENTER, p.TOP);
      for (let t = 0; t <= tMax; t++) {
        const tx = tToX(t);
        p.stroke(25); p.strokeWeight(0.3); p.line(tx, mode.oy - 2, tx, mode.oy + 2); p.noStroke();
        p.fill(65); p.text(t.toString(), tx, mode.oy + 3);
      }
      p.fill(90); p.textAlign(p.LEFT, p.CENTER); p.textSize(8); p.text("t", tToX(tMax) + 7, mode.oy);

      // Signal
      p.stroke(mode.col[0], mode.col[1], mode.col[2]); p.strokeWeight(2); p.noFill();
      p.beginShape();
      for (let i = 0; i <= aw; i++) {
        const t = (i / aw) * tMax;
        const v = Math.min(Math.max(mode.fn(t), -1.1), 1.1);
        p.vertex(tToX(t), mode.oy - v * scaleY);
      }
      p.endShape();

      // Label
      p.noStroke(); p.fill(mode.col[0], mode.col[1], mode.col[2], 210);
      p.textSize(9); p.textAlign(p.LEFT, p.TOP);
      p.text(mode.label, ox + 5, mode.oy - 66);
    });

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Modos determinados pelas raízes de: aₙλⁿ + ... + a₁λ + a₀ = 0  (σ = Re(λ))", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

// Visualization 4: Convolution integral — graphical interpretation
export function ConvolutionIntegral() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Integral de Convolução  y(t) = ∫ x(τ)·h(t−τ) dτ", w / 2, 8);

    const tauMin = -1, tauMax = 6, tauRange = tauMax - tauMin;
    const ox = 55, aw = w - 90, oy = h / 2 + 10, scaleY = 55;
    const tToX = (tau: number) => ox + ((tau - tauMin) / tauRange) * aw;

    // Animate t
    const tValue = ((time * 0.4) % (tauRange * 0.8)) + tauMin + 0.2;

    // x(τ) — rectangular pulse
    const xFn = (tau: number) => (tau >= 0 && tau < 2) ? 1 : 0;
    // h(τ) — decaying exponential
    const hFn = (tau: number) => (tau >= 0) ? Math.exp(-tau) : 0;
    // h(t - τ): flip and shift h by t
    const hShiftFn = (tau: number) => hFn(tValue - tau);

    // Axes
    p.stroke(50); p.strokeWeight(0.7);
    p.line(ox - 5, oy, tToX(tauMax) + 5, oy);
    p.line(tToX(0), oy - 65, tToX(0), oy + 12);
    p.noStroke(); p.fill(70); p.textSize(7.5); p.textAlign(p.CENTER, p.TOP);
    for (let t = tauMin; t <= tauMax; t++) {
      const tx = tToX(t);
      p.stroke(25); p.strokeWeight(0.3); p.line(tx, oy - 2, tx, oy + 2); p.noStroke();
      p.fill(65); p.text(t.toString(), tx, oy + 3);
    }
    p.fill(90); p.textAlign(p.LEFT, p.CENTER); p.textSize(8); p.text("τ", tToX(tauMax) + 7, oy);

    // Draw x(τ)
    p.stroke(0, 150, 255); p.strokeWeight(2); p.noFill();
    p.beginShape();
    for (let i = 0; i <= aw; i++) {
      const tau = tauMin + (i / aw) * tauRange;
      p.vertex(tToX(tau), oy - xFn(tau) * scaleY);
    }
    p.endShape();
    p.noStroke(); p.fill(0, 150, 255, 200); p.textSize(8.5); p.textAlign(p.LEFT, p.TOP);
    p.text("x(τ)", ox + 5, oy - 62);

    // Draw h(t−τ) — shifted and flipped
    p.stroke(255, 180, 50); p.strokeWeight(2); p.noFill();
    p.beginShape();
    for (let i = 0; i <= aw; i++) {
      const tau = tauMin + (i / aw) * tauRange;
      p.vertex(tToX(tau), oy - hShiftFn(tau) * scaleY);
    }
    p.endShape();
    p.noStroke(); p.fill(255, 180, 50, 200); p.textSize(8.5); p.textAlign(p.LEFT, p.TOP);
    p.text("h(t−τ) t=" + tValue.toFixed(1), ox + 5, oy - 48);

    // Shaded overlap = integrand
    p.noFill();
    for (let i = 0; i < aw; i++) {
      const tau = tauMin + (i / aw) * tauRange;
      const overlap = xFn(tau) * hShiftFn(tau);
      if (overlap > 0.01) {
        const px = tToX(tau);
        p.stroke(100, 200, 100, 50); p.strokeWeight(1);
        p.line(px, oy, px, oy - overlap * scaleY);
      }
    }

    // Output y at tValue
    let yValue = 0;
    for (let i = 0; i <= 500; i++) {
      const tau = tauMin + (i / 500) * tauRange;
      yValue += xFn(tau) * hShiftFn(tau) * (tauRange / 500);
    }

    // t marker
    const tX = tToX(tValue);
    if (tX >= ox && tX <= ox + aw) {
      p.stroke(100, 200, 100); p.strokeWeight(2);
      p.line(tX, oy + 5, tX, oy + 15);
      p.fill(100, 200, 100); p.noStroke(); p.textSize(8); p.textAlign(p.CENTER, p.TOP);
      p.text("t", tX, oy + 16);
    }

    // Result
    p.fill(15, 20, 35); p.stroke(100, 200, 100, 50); p.strokeWeight(1);
    p.rect(10, h - 42, w - 20, 30, 5);
    p.noStroke(); p.fill(100, 200, 100, 220); p.textSize(10); p.textAlign(p.CENTER, p.CENTER);
    p.text("y(t=" + tValue.toFixed(1) + ") = ∫x(τ)·h(t−τ)dτ = " + yValue.toFixed(3) + "  (área da sobreposição sombreada)", w / 2, h - 27);
  };
  return <P5Sketch setup={setup} draw={draw} height={300} />;
}

// Visualization 5: Complete LCIT analysis workflow
export function LCITAnalysisWorkflow() {
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Fluxo de Análise — Sistema LCIT no Domínio do Tempo", w / 2, 8);

    const steps = [
      {
        n: "1", title: "EDO do Sistema",
        expr: "aₙy^(n) + ... + a₀y = bₘx^(m) + ... + b₀x",
        col: [0, 150, 255], icon: "📝",
      },
      {
        n: "2", title: "Eq. Característica",
        expr: "aₙλⁿ + aₙ₋₁λⁿ⁻¹ + ... + a₀ = 0\n→ raízes λ₁, λ₂, ..., λₙ",
        col: [255, 180, 50], icon: "🔍",
      },
      {
        n: "3a", title: "Resposta de Entrada Nula",
        expr: "y_zi(t) = c₁e^(λ₁t) + c₂e^(λ₂t) + ...\n(coef. por cond. iniciais y(0), y'(0)...)",
        col: [100, 200, 100], icon: "⬜",
      },
      {
        n: "3b", title: "Resposta de Estado Nulo",
        expr: "y_zs(t) = x(t) * h(t)\n= ∫₋∞ᵗ x(τ)·h(t−τ)dτ",
        col: [180, 130, 255], icon: "📥",
      },
      {
        n: "4", title: "Resposta Total",
        expr: "y(t) = y_zi(t) + y_zs(t)",
        col: [255, 100, 100], icon: "✅",
      },
    ];

    const cardH = 52;
    const cardW = w - 20;
    const startY = 34;

    // Steps 1 and 2 (full width)
    [0, 1].forEach((i) => {
      const step = steps[i];
      const sy = startY + i * (cardH + 8);
      p.fill(15, 20, 35); p.stroke(step.col[0], step.col[1], step.col[2], 60); p.strokeWeight(1.5);
      p.rect(10, sy, cardW, cardH, 5);
      p.noStroke(); p.fill(step.col[0], step.col[1], step.col[2], 220);
      p.textSize(16); p.textAlign(p.LEFT, p.CENTER); p.text(step.icon, 20, sy + 18);
      p.textSize(10); p.textAlign(p.LEFT, p.TOP); p.text(step.n + ". " + step.title, 45, sy + 5);
      p.fill(step.col[0], step.col[1], step.col[2], 160); p.textSize(8.5);
      step.expr.split("\n").forEach((line, li) => {
        p.text(line, 45, sy + 20 + li * 12);
      });
    });

    // Arrow
    const arrowY = startY + 2 * (cardH + 8) - 4;
    p.stroke(150, 150, 200, 100); p.strokeWeight(1.5);
    p.line(w / 4, arrowY, w / 4, arrowY + 4);
    p.line(3 * w / 4, arrowY, 3 * w / 4, arrowY + 4);
    p.noStroke(); p.fill(150, 150, 200, 130); p.textSize(8.5); p.textAlign(p.CENTER, p.CENTER);
    p.text("↙ entrada nula                    estado nulo ↘", w / 2, arrowY + 2);

    // Steps 3a and 3b (side by side)
    const halfW = (cardW - 8) / 2;
    [2, 3].forEach((i) => {
      const step = steps[i];
      const sy = startY + 2 * (cardH + 8) + 14;
      const sx = 10 + (i - 2) * (halfW + 8);
      p.fill(15, 20, 35); p.stroke(step.col[0], step.col[1], step.col[2], 60); p.strokeWeight(1.5);
      p.rect(sx, sy, halfW, cardH + 10, 5);
      p.noStroke(); p.fill(step.col[0], step.col[1], step.col[2], 220);
      p.textSize(16); p.textAlign(p.LEFT, p.CENTER); p.text(step.icon, sx + 8, sy + 18);
      p.textSize(9.5); p.textAlign(p.LEFT, p.TOP); p.text(step.n + ". " + step.title, sx + 32, sy + 5);
      p.fill(step.col[0], step.col[1], step.col[2], 150); p.textSize(8);
      step.expr.split("\n").forEach((line, li) => {
        p.text(line, sx + 10, sy + 22 + li * 12);
      });
    });

    // Step 4 (full width, bottom)
    const step4 = steps[4];
    const sy4 = startY + 2 * (cardH + 8) + 14 + cardH + 20;
    p.fill(15, 20, 35); p.stroke(step4.col[0], step4.col[1], step4.col[2], 70); p.strokeWeight(2);
    p.rect(10, sy4, cardW, 38, 5);
    p.noStroke(); p.fill(step4.col[0], step4.col[1], step4.col[2], 220);
    p.textSize(16); p.textAlign(p.LEFT, p.CENTER); p.text(step4.icon, 20, sy4 + 18);
    p.textSize(11); p.textAlign(p.LEFT, p.TOP); p.text(step4.n + ". " + step4.title, 45, sy4 + 5);
    p.fill(step4.col[0], step4.col[1], step4.col[2], 200); p.textSize(10);
    p.text(step4.expr, 45, sy4 + 20);

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("O fluxo LCIT é aplicável a qualquer sistema linear, contínuo e invariante no tempo", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

