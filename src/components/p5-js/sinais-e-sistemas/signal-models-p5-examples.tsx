"use client";

import { P5Sketch } from "../p5-sketch";
import type p5 from "p5";

// Visualization 1: Unit step function u(t) — definition and visualization
export function UnitStepFunction() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Função Degrau Unitário  u(t)", w / 2, 8);

    const ox = 80, oy = h / 2 - 10, aw = w - 130, tMin = -4, tMax = 6;
    const tRange = tMax - tMin;

    const tToX = (t: number) => ox + ((t - tMin) / tRange) * aw;

    // Axes
    p.stroke(60); p.strokeWeight(0.8);
    p.line(ox - 10, oy, ox + aw + 10, oy);
    p.line(tToX(0), oy - 100, tToX(0), oy + 20);

    // Tick marks & labels
    p.noStroke(); p.fill(70); p.textSize(8); p.textAlign(p.CENTER, p.TOP);
    for (let t = tMin; t <= tMax; t++) {
      if (t === 0) continue;
      const tx = tToX(t);
      p.stroke(30); p.strokeWeight(0.4); p.line(tx, oy - 3, tx, oy + 3); p.noStroke();
      p.fill(70); p.text(t.toString(), tx, oy + 4);
    }
    p.fill(70); p.text("0", tToX(0) + 2, oy + 4);
    p.fill(100); p.textAlign(p.LEFT, p.CENTER); p.textSize(9);
    p.text("t", ox + aw + 15, oy);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("u(t)", tToX(0) - 5, oy - 85);

    // Step function — draw
    p.stroke(0, 150, 255); p.strokeWeight(2.5);
    // t < 0: u(t) = 0
    p.line(tToX(tMin), oy, tToX(0), oy);
    // t >= 0: u(t) = 1
    p.line(tToX(0), oy - 75, tToX(tMax), oy - 75);
    // Vertical jump (dashed)
    p.stroke(0, 150, 255, 100); p.strokeWeight(1.5);
    const dashLen = 4, gapLen = 3;
    for (let yy = oy - 74; yy < oy; yy += dashLen + gapLen) {
      p.line(tToX(0), yy, tToX(0), Math.min(yy + dashLen, oy));
    }
    // Open and filled dots at discontinuity
    p.noStroke(); p.fill(2, 7, 19); p.circle(tToX(0), oy, 8);
    p.stroke(0, 150, 255); p.strokeWeight(2); p.noFill();
    p.circle(tToX(0), oy, 8);
    p.fill(0, 150, 255); p.noStroke(); p.circle(tToX(0), oy - 75, 7);

    // Amplitude labels
    p.noStroke(); p.fill(0, 150, 255, 180); p.textSize(9.5); p.textAlign(p.RIGHT, p.CENTER);
    p.text("1", tToX(0) - 8, oy - 75);
    p.text("0", tToX(0) - 8, oy);

    // Animated "reading" — vertical cursor
    const cursorT = tMin + ((time * 0.8) % tRange);
    const cursorX = tToX(cursorT);
    const cursorVal = cursorT >= 0 ? 75 : 0;
    p.stroke(180, 130, 255, 160); p.strokeWeight(1);
    p.line(cursorX, oy + 15, cursorX, oy - 95);
    p.fill(180, 130, 255, 200); p.noStroke(); p.circle(cursorX, oy - cursorVal, 7);
    p.fill(180, 130, 255, 220); p.textSize(8.5); p.textAlign(p.CENTER, p.BOTTOM);
    const valText = cursorT >= 0 ? "u(t) = 1" : "u(t) = 0";
    p.text(valText, cursorX, oy - 97);

    // Definition box
    p.fill(15, 20, 35); p.stroke(0, 150, 255, 50); p.strokeWeight(1);
    p.rect(10, h - 50, w - 20, 36, 5);
    p.noStroke(); p.fill(0, 150, 255, 200); p.textSize(10); p.textAlign(p.CENTER, p.CENTER);
    p.text("u(t) = 1  se t ≥ 0     |     u(t) = 0  se t < 0", w / 2, h - 32);
  };
  return <P5Sketch setup={setup} draw={draw} height={310} />;
}

// Visualization 2: Causal signals using u(t) — pulse construction
export function CausalSignalWithStep() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Construindo Sinais com u(t) — Pulso Retangular", w / 2, 8);

    const tMin = -1, tMax = 7, tRange = tMax - tMin;

    const signals = [
      {
        label: "u(t)         (degrau em t=0)",
        col: [0, 150, 255], oy: 82,
        fn: (t: number) => t >= 0 ? 1 : 0,
      },
      {
        label: "−u(t − 4)    (degrau negativo em t=4)",
        col: [255, 100, 100], oy: 172,
        fn: (t: number) => t >= 4 ? -1 : 0,
      },
      {
        label: "u(t) − u(t − 4)  =  pulso retangular em [0, 4]",
        col: [100, 200, 100], oy: 262,
        fn: (t: number) => (t >= 0 && t < 4 ? 1 : 0),
      },
    ];

    const ox = 60, aw = w - 100, ampH = 52;

    signals.forEach((sig) => {
      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox - 5, sig.oy, ox + aw, sig.oy);
      p.line(ox + ((0 - tMin) / tRange) * aw, sig.oy - ampH - 10, ox + ((0 - tMin) / tRange) * aw, sig.oy + 10);

      p.noStroke(); p.fill(70); p.textSize(7.5); p.textAlign(p.CENTER, p.TOP);
      for (let t = tMin; t <= tMax; t++) {
        const tx = ox + ((t - tMin) / tRange) * aw;
        p.stroke(25); p.strokeWeight(0.3); p.line(tx, sig.oy - 2, tx, sig.oy + 2); p.noStroke();
        p.fill(65); p.text(t === 0 ? "0" : t.toString(), tx, sig.oy + 3);
      }
      p.fill(90); p.textAlign(p.LEFT, p.CENTER); p.textSize(8); p.text("t", ox + aw + 5, sig.oy);

      // Draw signal
      p.stroke(sig.col[0], sig.col[1], sig.col[2]); p.strokeWeight(2.2); p.noFill();
      const tToX = (t: number) => ox + ((t - tMin) / tRange) * aw;
      const valToY = (v: number) => sig.oy - v * ampH;


      for (let i = 1; i <= aw; i++) {
        const t = tMin + (i / aw) * tRange;
        const v = sig.fn(t);
        const y = valToY(v);
        const prevT = tMin + ((i - 1) / aw) * tRange;
        const prevV = sig.fn(prevT);

        if (Math.abs(v - prevV) > 0.5) {
          p.line(tToX(prevT), valToY(prevV), tToX(prevT), y);
        }
        p.line(tToX(prevT), valToY(prevV), tToX(t), y);
      }

      // Label
      p.noStroke(); p.fill(sig.col[0], sig.col[1], sig.col[2], 200);
      p.textSize(9); p.textAlign(p.LEFT, p.TOP);
      p.text(sig.label, ox + 3, sig.oy - ampH - 22);
    });

    // Plus / equals signs
    p.noStroke(); p.fill(200, 200, 200, 200); p.textSize(16); p.textAlign(p.RIGHT, p.CENTER);
    p.text("+", ox - 6, 172);
    p.text("=", ox - 6, 262);

    p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Pulso retangular: combinar dois degraus para 'ligar' e 'desligar' o sinal", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 3: Unit impulse δ(t) — definition and approximations
export function UnitImpulseFunction() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Função Impulso Unitário  δ(t)  (Delta de Dirac)", w / 2, 8);

    // Left panel: pulse approximations becoming narrower
    const panelW = w / 2 - 15;
    {
      p.fill(15, 20, 35); p.stroke(255, 180, 50, 40); p.strokeWeight(1);
      p.rect(10, 28, panelW, h - 65, 6);
      p.noStroke(); p.fill(255, 180, 50, 220); p.textSize(9.5); p.textAlign(p.CENTER, p.TOP);
      p.text("Aproximações de δ(t)", 10 + panelW / 2, 36);

      const ox = 40, oy = h / 2 + 20, aw = panelW - 50, tMin = -3, tMax = 3, tRange = 6;
      const tToX = (t: number) => ox + ((t - tMin) / tRange) * aw;

      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox - 5, oy, ox + aw, oy);
      p.line(tToX(0), oy - 110, tToX(0), oy + 10);

      p.noStroke(); p.fill(70); p.textSize(8); p.textAlign(p.CENTER, p.TOP);
      for (let t = tMin; t <= tMax; t++) {
        const tx = tToX(t);
        p.stroke(25); p.strokeWeight(0.4); p.line(tx, oy - 2, tx, oy + 2); p.noStroke();
        p.fill(65); p.text(t.toString(), tx, oy + 3);
      }
      p.fill(90); p.textAlign(p.LEFT, p.CENTER); p.textSize(8); p.text("t", ox + aw + 5, oy);

      const pulses = [
        { delta: 2.0, col: [255, 180, 50, 80], label: "Δ=2" },
        { delta: 1.0, col: [255, 180, 50, 130], label: "Δ=1" },
        { delta: 0.5, col: [255, 180, 50, 190], label: "Δ=0.5" },
        { delta: 0.2, col: [255, 180, 50, 255], label: "Δ=0.2" },
      ];

      pulses.forEach((pulse) => {
        const height = 1 / pulse.delta;
        const halfW = (pulse.delta / tRange) * aw / 2;
        const cx = tToX(0);
        const pxH = Math.min(height * 80, 100);
        p.stroke(pulse.col[0], pulse.col[1], pulse.col[2], pulse.col[3]);
        p.strokeWeight(1.5); p.noFill();
        p.rect(cx - halfW, oy - pxH, halfW * 2, pxH);
        p.noStroke(); p.fill(pulse.col[0], pulse.col[1], pulse.col[2], pulse.col[3] * 0.25);
        p.rect(cx - halfW, oy - pxH, halfW * 2, pxH);
        // Label
        p.noStroke(); p.fill(pulse.col[0], pulse.col[1], pulse.col[2], pulse.col[3]);
        p.textSize(7); p.textAlign(p.LEFT, p.TOP);
        p.text(pulse.label, cx + halfW + 2, oy - pxH);
      });

      // Arrow indicating δ(t)
      p.stroke(255, 255, 255, 200); p.strokeWeight(2);
      p.line(tToX(0), oy, tToX(0), oy - 105);
      p.fill(255, 255, 255, 200); p.noStroke();
      p.triangle(tToX(0), oy - 108, tToX(0) - 4, oy - 100, tToX(0) + 4, oy - 100);
      p.fill(255, 255, 255, 220); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
      p.text("δ(t)  (limite)", tToX(0), oy - 110);

      p.noStroke(); p.fill(255, 180, 50, 160); p.textSize(8); p.textAlign(p.CENTER, p.BOTTOM);
      p.text("Conforme Δ → 0: altura → ∞, largura → 0, área = 1", 10 + panelW / 2, h - 38);
    }

    // Right panel: properties
    {
      const startX = panelW + 20;
      p.fill(15, 20, 35); p.stroke(100, 200, 100, 40); p.strokeWeight(1);
      p.rect(startX, 28, panelW, h - 65, 6);
      p.noStroke(); p.fill(100, 200, 100, 220); p.textSize(9.5); p.textAlign(p.CENTER, p.TOP);
      p.text("Propriedades Fundamentais", startX + panelW / 2, 36);

      const props = [
        { sym: "∫ δ(t) dt = 1", desc: "Área unitária (−∞ a +∞)" },
        { sym: "δ(t) = 0,  t ≠ 0", desc: "Zero em todo t exceto origem" },
        { sym: "x(t)·δ(t) = x(0)·δ(t)", desc: "Multiplicação: isola o valor em t=0" },
        { sym: "x(t)·δ(t−t₀) = x(t₀)·δ(t−t₀)", desc: "Multiplicação deslocada" },
        { sym: "∫ x(t)·δ(t−t₀) dt = x(t₀)", desc: "Propriedade de amostragem!" },
      ];

      props.forEach((prop, i) => {
        const py = 60 + i * 48;
        p.fill(15, 25, 40); p.stroke(100, 200, 100, 40); p.strokeWeight(1);
        p.rect(startX + 8, py, panelW - 16, 40, 4);
        p.noStroke(); p.fill(100, 200, 100, 220); p.textSize(9.5); p.textAlign(p.LEFT, p.TOP);
        p.text(prop.sym, startX + 15, py + 5);
        p.fill(100, 200, 100, 140); p.textSize(8); p.textAlign(p.LEFT, p.TOP);
        p.text(prop.desc, startX + 15, py + 20);
      });

      p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
      p.text("δ(t) é a base do processamento de sinais contínuos", startX + panelW / 2, h - 38);
    }

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("O impulso unitário não é uma função clássica, mas uma distribuição (teoria de distribuições de Schwartz)", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

// Visualization 4: Sampling property of δ(t) — interactive demo
export function SamplingProperty() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Propriedade de Amostragem do Impulso", w / 2, 8);

    // Animate t0 moving
    const t0 = 1.5 + Math.sin(time * 0.5) * 1.5;
    const t0Label = t0.toFixed(1);

    const tMin = -2, tMax = 6, tRange = tMax - tMin;
    const ox = 70, oy = h / 2 + 30, aw = w - 120;
    const tToX = (t: number) => ox + ((t - tMin) / tRange) * aw;

    // x(t) = e^(-0.3t) * cos(2t+1) for t in range
    const xFn = (t: number) => Math.exp(-0.3 * t) * Math.cos(2 * t + 1);
    const xt0 = xFn(t0);

    // Axes
    p.stroke(60); p.strokeWeight(0.8);
    p.line(tToX(tMin) - 5, oy, tToX(tMax) + 5, oy);
    p.line(tToX(0), oy - 90, tToX(0), oy + 15);

    p.noStroke(); p.fill(70); p.textSize(7.5); p.textAlign(p.CENTER, p.TOP);
    for (let t = -2; t <= 6; t++) {
      const tx = tToX(t);
      p.stroke(25); p.strokeWeight(0.3); p.line(tx, oy - 2, tx, oy + 2); p.noStroke();
      p.fill(65); p.text(t.toString(), tx, oy + 3);
    }
    p.fill(90); p.textAlign(p.LEFT, p.CENTER); p.textSize(8); p.text("t", tToX(tMax) + 8, oy);

    // Draw x(t)
    p.stroke(0, 150, 255, 180); p.strokeWeight(2); p.noFill();
    p.beginShape();
    for (let i = 0; i <= aw; i++) {
      const t = tMin + (i / aw) * tRange;
      p.vertex(tToX(t), oy - xFn(t) * 65);
    }
    p.endShape();
    p.noStroke(); p.fill(0, 150, 255, 180); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
    p.text("x(t)", tToX(tMin) + 2, oy - 90);

    // Draw δ(t - t0) as arrow at t0
    const impX = tToX(t0);
    p.stroke(255, 180, 50); p.strokeWeight(2.5);
    p.line(impX, oy, impX, oy - 75);
    p.fill(255, 180, 50); p.noStroke();
    p.triangle(impX, oy - 80, impX - 5, oy - 70, impX + 5, oy - 70);
    p.fill(255, 180, 50, 220); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("δ(t − " + t0Label + ")", impX, oy - 82);

    // Highlight x(t0) on the x(t) curve
    const sampleY = oy - xt0 * 65;
    p.stroke(100, 200, 100); p.strokeWeight(1.5);
    p.line(impX, oy, impX, sampleY);
    p.fill(100, 200, 100); p.noStroke(); p.circle(impX, sampleY, 9);

    // Dashed horizontal line from curve to y-axis
    p.stroke(100, 200, 100, 100); p.strokeWeight(1);
    for (let xi = tToX(0); xi < impX; xi += 6) {
      p.line(xi, sampleY, Math.min(xi + 4, impX), sampleY);
    }
    p.noStroke(); p.fill(100, 200, 100, 200); p.textSize(9); p.textAlign(p.RIGHT, p.CENTER);
    p.text("x(" + t0Label + ") = " + xt0.toFixed(3), tToX(0) - 4, sampleY);

    // Result box
    p.fill(15, 20, 35); p.stroke(100, 200, 100, 60); p.strokeWeight(1);
    p.rect(10, h - 55, w - 20, 42, 5);
    p.noStroke(); p.fill(100, 200, 100, 230); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
    p.text("∫ x(t) · δ(t − t₀) dt  =  x(t₀)  =  " + xt0.toFixed(3), w / 2, h - 38);
    p.fill(100, 200, 100, 150); p.textSize(8.5);
    p.text("O impulso 'captura' (amostra) o valor de x(t) no instante t₀ = " + t0Label, w / 2, h - 22);
  };
  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 5: Delayed impulse and shifted step — discrete representation
export function DelayedImpulseAndStep() {
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Degrau e Impulso Deslocados", w / 2, 8);

    const tMin = -2, tMax = 7, tRange = tMax - tMin;
    const signals = [
      {
        label: "u(t − 2)   (degrau deslocado em t=2)",
        col: [0, 150, 255], oy: 100,
        fn: (t: number) => t >= 2 ? 1 : 0,
        isStep: true, t0: 2,
      },
      {
        label: "δ(t − 3)   (impulso em t=3)",
        col: [255, 180, 50], oy: 210,
        fn: (t: number) => t === 3 ? 1 : 0,
        isStep: false, t0: 3,
      },
      {
        label: "u(t − 1) − u(t − 5)   (pulso em [1, 5])",
        col: [100, 200, 100], oy: 310,
        fn: (t: number) => (t >= 1 && t < 5) ? 1 : 0,
        isStep: true, t0: 1,
      },
    ];

    const ox = 60, aw = w - 100, ampH = 60;
    const tToX = (t: number) => ox + ((t - tMin) / tRange) * aw;

    signals.forEach((sig) => {
      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox - 5, sig.oy, ox + aw + 5, sig.oy);
      p.line(tToX(0), sig.oy - ampH - 15, tToX(0), sig.oy + 12);

      p.noStroke(); p.fill(70); p.textSize(7.5); p.textAlign(p.CENTER, p.TOP);
      for (let t = tMin; t <= tMax; t++) {
        const tx = tToX(t);
        p.stroke(25); p.strokeWeight(0.3); p.line(tx, sig.oy - 2, tx, sig.oy + 2); p.noStroke();
        p.fill(65); p.text(t.toString(), tx, sig.oy + 3);
      }
      p.fill(90); p.textAlign(p.LEFT, p.CENTER); p.textSize(8); p.text("t", ox + aw + 8, sig.oy);

      // Label
      p.noStroke(); p.fill(sig.col[0], sig.col[1], sig.col[2], 210);
      p.textSize(9.5); p.textAlign(p.LEFT, p.TOP);
      p.text(sig.label, ox + 4, sig.oy - ampH - 28);

      if (!sig.isStep) {
        // Draw impulse arrow at t0
        const impX = tToX(sig.t0);
        p.stroke(sig.col[0], sig.col[1], sig.col[2]); p.strokeWeight(2.5);
        p.line(impX, sig.oy, impX, sig.oy - ampH);
        p.fill(sig.col[0], sig.col[1], sig.col[2]); p.noStroke();
        p.triangle(impX, sig.oy - ampH - 5, impX - 4, sig.oy - ampH + 5, impX + 4, sig.oy - ampH + 5);
        p.noStroke(); p.fill(sig.col[0], sig.col[1], sig.col[2], 180);
        p.textSize(8.5); p.textAlign(p.CENTER, p.BOTTOM);
        p.text("área = 1", impX, sig.oy - ampH - 8);
      } else {
        // Draw step signal
        p.stroke(sig.col[0], sig.col[1], sig.col[2]); p.strokeWeight(2.2); p.noFill();
        // Before t0
        p.line(tToX(tMin), sig.oy, tToX(sig.t0), sig.oy);
        // After t0
        p.line(tToX(sig.t0), sig.oy - ampH, tToX(tMax), sig.oy - ampH);
        // Vertical
        p.stroke(sig.col[0], sig.col[1], sig.col[2], 100); p.strokeWeight(1.2);
        for (let yy = sig.oy - ampH + 1; yy < sig.oy; yy += 5) {
          p.line(tToX(sig.t0), yy, tToX(sig.t0), Math.min(yy + 3, sig.oy));
        }
        // Dots
        p.noStroke(); p.fill(2, 7, 19); p.circle(tToX(sig.t0), sig.oy, 7);
        p.stroke(sig.col[0], sig.col[1], sig.col[2]); p.strokeWeight(1.8); p.noFill();
        p.circle(tToX(sig.t0), sig.oy, 7);
        p.fill(sig.col[0], sig.col[1], sig.col[2]); p.noStroke();
        p.circle(tToX(sig.t0), sig.oy - ampH, 7);
      }
    });

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Deslocar u(t) e δ(t) permite construir qualquer sinal por composição", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

// Visualization 6: Relationship between u(t) and δ(t)
export function ImpulseStepRelation() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Relação entre δ(t) e u(t)", w / 2, 8);

    // Two panels side by side
    const panelW = (w - 30) / 2;

    // Panel 1: derivative relationship du/dt = δ
    {
      const startX = 10;
      const ox = startX + 45, oy = h / 2 + 5, aw = panelW - 60;
      p.fill(15, 20, 35); p.stroke(0, 150, 255, 40); p.strokeWeight(1);
      p.rect(startX, 28, panelW, h - 65, 6);
      p.noStroke(); p.fill(0, 150, 255, 220); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
      p.text("Derivada: du(t)/dt = δ(t)", startX + panelW / 2, 36);

      const tMin = -3, tMax = 3, tRange = 6;
      const tToX = (t: number) => ox + ((t - tMin) / tRange) * aw;
      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox - 5, oy, ox + aw + 5, oy);
      p.line(tToX(0), oy - 80, tToX(0), oy + 12);

      // Draw u(t)
      p.stroke(0, 150, 255, 120); p.strokeWeight(1.8); p.noFill();
      p.line(tToX(tMin), oy, tToX(0), oy);
      p.line(tToX(0), oy - 55, tToX(tMax), oy - 55);
      p.stroke(0, 150, 255, 60); p.strokeWeight(1);
      for (let yy = oy - 54; yy < oy; yy += 5) {
        p.line(tToX(0), yy, tToX(0), Math.min(yy + 3, oy));
      }
      p.noStroke(); p.fill(0, 150, 255, 120); p.textSize(8); p.textAlign(p.RIGHT, p.CENTER);
      p.text("u(t)", tToX(tMin) - 2, oy);

      // Draw δ(t) arrow
      p.stroke(255, 180, 50); p.strokeWeight(2.5);
      p.line(tToX(0), oy, tToX(0), oy - 75);
      p.fill(255, 180, 50); p.noStroke();
      p.triangle(tToX(0), oy - 78, tToX(0) - 4, oy - 68, tToX(0) + 4, oy - 68);
      p.fill(255, 180, 50, 200); p.textSize(8); p.textAlign(p.CENTER, p.BOTTOM);
      p.text("δ(t) = du/dt", tToX(0), oy - 80);

      p.noStroke(); p.fill(0, 150, 255, 150); p.textSize(8.5); p.textAlign(p.CENTER, p.BOTTOM);
      p.text("A derivada do degrau é o impulso", startX + panelW / 2, h - 36);
    }

    // Panel 2: integral relationship ∫δ = u
    {
      const startX = panelW + 20;
      const ox = startX + 45, oy = h / 2 + 5, aw = panelW - 60;
      p.fill(15, 20, 35); p.stroke(100, 200, 100, 40); p.strokeWeight(1);
      p.rect(startX, 28, panelW, h - 65, 6);
      p.noStroke(); p.fill(100, 200, 100, 220); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
      p.text("Integral: ∫ δ(τ) dτ = u(t)", startX + panelW / 2, 36);

      const tMin = -3, tMax = 3, tRange = 6;
      const tToX = (t: number) => ox + ((t - tMin) / tRange) * aw;
      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox - 5, oy, ox + aw + 5, oy);
      p.line(tToX(0), oy - 80, tToX(0), oy + 12);

      // Animate integration — cursor grows u(t) from the impulse
      const cursor = ((time * 0.4) % 1) * tRange + tMin;

      // Draw δ(0) arrow
      p.stroke(255, 180, 50); p.strokeWeight(2.5);
      p.line(tToX(0), oy, tToX(0), oy - 72);
      p.fill(255, 180, 50); p.noStroke();
      p.triangle(tToX(0), oy - 75, tToX(0) - 4, oy - 65, tToX(0) + 4, oy - 65);
      p.fill(255, 180, 50, 200); p.textSize(8); p.textAlign(p.CENTER, p.BOTTOM);
      p.text("δ(t)", tToX(0), oy - 77);

      // Draw growing u(t)
      p.stroke(100, 200, 100); p.strokeWeight(2.2); p.noFill();
      if (cursor > 0) {
        p.line(tToX(0), oy - 55, tToX(Math.min(cursor, tMax)), oy - 55);
      }
      p.line(tToX(tMin), oy, tToX(0), oy);

      // Growing cursor dot
      if (cursor > 0 && cursor <= tMax) {
        p.fill(100, 200, 100); p.noStroke(); p.circle(tToX(cursor), oy - 55, 7);
      }

      p.noStroke(); p.fill(100, 200, 100, 200); p.textSize(8); p.textAlign(p.LEFT, p.TOP);
      p.text("∫ de −∞ até t:", ox + 3, oy - 80);
      p.text("t < 0: integral = 0", ox + 3, oy - 70);
      p.text("t ≥ 0: integral = 1", ox + 3, oy - 60);

      p.noStroke(); p.fill(100, 200, 100, 150); p.textSize(8.5); p.textAlign(p.CENTER, p.BOTTOM);
      p.text("A integral do impulso 'acumula' até virar o degrau", startX + panelW / 2, h - 36);
    }

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("δ(t) e u(t) são pares derivada/integral — fundamentais em análise de sistemas lineares", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

