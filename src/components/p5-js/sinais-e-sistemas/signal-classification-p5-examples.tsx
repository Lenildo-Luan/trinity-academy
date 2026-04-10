"use client";

import { P5Sketch } from "../p5-sketch";
import type p5 from "p5";

// Visualization 1: Continuous-time vs Discrete-time signals
export function ContinuousVsDiscreteTime() {
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Sinal Contínuo vs. Sinal Discreto no Tempo", w / 2, 8);

    const panelW = (w - 30) / 2;
    const panels = [
      { x: 10, label: "Sinal Contínuo no Tempo  x(t)", col: [0, 150, 255] },
      { x: 20 + panelW, label: "Sinal Discreto no Tempo  x[n]", col: [255, 180, 50] },
    ];

    panels.forEach((panel, idx) => {
      // Panel background
      p.fill(15, 20, 35);
      p.stroke(panel.col[0], panel.col[1], panel.col[2], 50);
      p.strokeWeight(1);
      p.rect(panel.x, 28, panelW, h - 60, 6);

      // Axis
      const ox = panel.x + 30;
      const oy = 28 + (h - 60) / 2 + 10;
      const aw = panelW - 50;
      p.stroke(60); p.strokeWeight(0.8);
      p.line(ox, oy, ox + aw, oy); // x-axis
      p.line(ox, oy - 65, ox, oy + 15); // y-axis
      p.noStroke(); p.fill(70); p.textSize(8); p.textAlign(p.CENTER, p.TOP);
      const axLabel = idx === 0 ? "t" : "n";
      p.fill(100); p.textAlign(p.LEFT, p.CENTER);
      p.text(axLabel, ox + aw + 5, oy);
      p.textAlign(p.CENTER, p.TOP); p.fill(70);

      if (idx === 0) {
        // Continuous: smooth sine wave
        p.stroke(panel.col[0], panel.col[1], panel.col[2]);
        p.strokeWeight(2); p.noFill();
        p.beginShape();
        for (let i = 0; i <= aw; i++) {
          const t = (i / aw) * 3 * Math.PI;
          const y = -Math.sin(t) * 50 * Math.exp(-t / 10);
          p.vertex(ox + i, oy + y);
        }
        p.endShape();
        // Label
        p.noStroke(); p.fill(panel.col[0], panel.col[1], panel.col[2], 200);
        p.textSize(9); p.textAlign(p.LEFT, p.TOP);
        p.text("Definido para todo t ∈ ℝ", ox + 5, oy - 80);
        p.text("(infinitos valores)", ox + 5, oy - 68);
      } else {
        // Discrete: stems
        const N = 14;
        for (let n = 0; n <= N; n++) {
          const t = (n / N) * 3 * Math.PI;
          const val = -Math.sin(t) * 50 * Math.exp(-t / 10);
          const sx = ox + (n / N) * aw;
          p.stroke(panel.col[0], panel.col[1], panel.col[2], 160);
          p.strokeWeight(1.5);
          p.line(sx, oy, sx, oy + val);
          p.fill(panel.col[0], panel.col[1], panel.col[2]);
          p.noStroke();
          p.circle(sx, oy + val, 5);
        }
        // Label
        p.noStroke(); p.fill(panel.col[0], panel.col[1], panel.col[2], 200);
        p.textSize(9); p.textAlign(p.LEFT, p.TOP);
        p.text("Definido apenas para n ∈ ℤ", ox + 5, oy - 80);
        p.text("(sequência de amostras)", ox + 5, oy - 68);
      }

      // Panel label
      p.noStroke(); p.fill(panel.col[0], panel.col[1], panel.col[2], 220);
      p.textSize(10); p.textAlign(p.CENTER, p.CENTER);
      p.text(panel.label, panel.x + panelW / 2, 38);
    });

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Sinal contínuo: infinitos pontos entre quaisquer dois instantes  |  Sinal discreto: apenas instantes inteiros", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 2: Analog vs Digital signal
export function AnalogVsDigitalSignal() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Sinal Analógico vs. Sinal Digital", w / 2, 8);

    const panelW = (w - 30) / 2;

    // Analog panel
    {
      const ox = 40, oy = h / 2 - 10, aw = panelW - 60;
      p.fill(15, 20, 35); p.stroke(0, 150, 255, 40); p.strokeWeight(1);
      p.rect(10, 28, panelW, h - 60, 6);
      p.stroke(60); p.strokeWeight(0.8);
      p.line(ox, oy + 60, ox + aw, oy + 60);
      p.line(ox, oy - 70, ox, oy + 65);
      p.noStroke(); p.fill(0, 150, 255, 220); p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text("Sinal Analógico", 10 + panelW / 2, 38);
      p.fill(0, 150, 255, 150); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
      p.text("Amplitude contínua", ox + 3, oy - 82);
      p.text("(infinitos níveis)", ox + 3, oy - 71);
      // Smooth wave
      p.stroke(0, 150, 255); p.strokeWeight(2.5); p.noFill();
      p.beginShape();
      for (let i = 0; i <= aw; i++) {
        const t = (i / aw) * 2 * Math.PI;
        const y = -Math.sin(t + time) * 52 - Math.sin(2.3 * t + time * 0.7) * 18;
        p.vertex(ox + i, oy + 60 + y);
      }
      p.endShape();
    }

    // Digital panel
    {
      const startX = 20 + panelW;
      const ox = startX + 30, oy = h / 2 - 10, aw = panelW - 60;
      p.fill(15, 20, 35); p.stroke(100, 200, 100, 40); p.strokeWeight(1);
      p.rect(startX, 28, panelW, h - 60, 6);
      p.stroke(60); p.strokeWeight(0.8);
      p.line(ox, oy + 60, ox + aw, oy + 60);
      p.line(ox, oy - 70, ox, oy + 65);
      p.noStroke(); p.fill(100, 200, 100, 220); p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text("Sinal Digital", startX + panelW / 2, 38);
      p.fill(100, 200, 100, 150); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
      p.text("Amplitude discreta", ox + 3, oy - 82);
      p.text("(conjunto finito de níveis)", ox + 3, oy - 71);
      // 3-bit quantized wave
      const levels = 8;
      const levelH = 100 / levels;
      const nSteps = 20;
      p.stroke(100, 200, 100); p.strokeWeight(2); p.noFill();
      p.beginShape();
      for (let i = 0; i <= nSteps; i++) {
        const t = (i / nSteps) * 2 * Math.PI;
        const raw = -Math.sin(t) * 52 - Math.sin(2.3 * t) * 18;
        const quantized = Math.round(raw / levelH) * levelH;
        const x1 = ox + (i / nSteps) * aw;
        const x2 = ox + ((i + 1) / nSteps) * aw;
        if (i < nSteps) {
          const rawNext = -Math.sin(((i + 1) / nSteps) * 2 * Math.PI) * 52 - Math.sin(2.3 * ((i + 1) / nSteps) * 2 * Math.PI) * 18;
          const quantNext = Math.round(rawNext / levelH) * levelH;
          p.line(x1, oy + 60 + quantized, x2, oy + 60 + quantized);
          if (i < nSteps - 1) p.line(x2, oy + 60 + quantized, x2, oy + 60 + quantNext);
        }
      }
    }

    // Distinction note
    p.noStroke(); p.fill(180, 130, 255, 180); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Analógico ≠ Contínuo  |  Digital ≠ Discreto  (são classificações independentes!)", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={300} />;
}

// Visualization 3: Periodic vs Aperiodic signals
export function PeriodicVsAperiodic() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Sinal Periódico vs. Não Periódico (Aperiódico)", w / 2, 8);

    const rows = [
      {
        label: "Periódico: x(t) = cos(2t)  [T₀ = π]",
        oy: 95, col: [0, 150, 255],
        fn: (t: number) => Math.cos(2 * t) * 45,
      },
      {
        label: "Causal e de duração finita: u(t) − u(t − 4)",
        oy: 195, col: [255, 180, 50],
        fn: (t: number) => (t >= 0 && t <= 4 ? 45 : 0),
      },
      {
        label: "Aperiódico com duração infinita: e^(−t)u(t)",
        oy: 290, col: [100, 200, 100],
        fn: (t: number) => (t >= 0 ? Math.exp(-t * 0.6) * 45 : 0),
      },
    ];

    const ox = 50, aw = w - 80, tRange = 10;

    rows.forEach((row) => {
      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox, row.oy - 55, ox, row.oy + 10);
      p.line(ox - 8, row.oy, ox + aw, row.oy);
      p.noStroke(); p.fill(80); p.textSize(7.5); p.textAlign(p.CENTER, p.TOP);
      for (let i = 0; i <= tRange; i++) {
        const tx = ox + (i / tRange) * aw;
        p.text(i.toString(), tx, row.oy + 2);
      }
      p.fill(100); p.textAlign(p.LEFT, p.CENTER); p.textSize(8);
      p.text("t", ox + aw + 5, row.oy);

      // Signal
      p.stroke(row.col[0], row.col[1], row.col[2]); p.strokeWeight(2); p.noFill();
      p.beginShape();
      for (let i = 0; i <= aw; i++) {
        const t = (i / aw) * tRange;
        p.vertex(ox + i, row.oy - row.fn(t));
      }
      p.endShape();

      // Label
      p.noStroke(); p.fill(row.col[0], row.col[1], row.col[2], 200);
      p.textSize(9.5); p.textAlign(p.LEFT, p.TOP);
      p.text(row.label, ox + 5, row.oy - 66);
    });

    // Period annotation for periodic signal
    const T0x1 = ox + (2 / tRange) * aw;
    const T0x2 = ox + ((2 + Math.PI) / tRange) * aw;
    p.stroke(0, 150, 255, 120); p.strokeWeight(1.2);
    p.line(T0x1, 62, T0x2, 62);
    p.fill(0, 150, 255, 180); p.noStroke(); p.textSize(8); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("T₀ = π", (T0x1 + T0x2) / 2, 60);

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Periódico: x(t) = x(t + T₀) para todo t  |  Aperiódico: não repete o padrão", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 4: Energy vs Power signals
export function EnergyVsPowerClassification() {
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Sinais de Energia vs. Sinais de Potência", w / 2, 8);

    const panelW = (w - 30) / 2;

    // Energy signal panel
    {
      const startX = 10;
      const ox = startX + 35, oy = h / 2 + 20, aw = panelW - 55;
      p.fill(15, 20, 35); p.stroke(0, 150, 255, 50); p.strokeWeight(1);
      p.rect(startX, 28, panelW, h - 60, 6);
      p.noStroke(); p.fill(0, 150, 255, 220); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
      p.text("Sinal de Energia", startX + panelW / 2, 38);
      p.fill(0, 150, 255, 150); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
      p.text("E < ∞,  P = 0", ox + 3, 56);
      p.text("Ex: pulso, decaimento exp.", ox + 3, 67);
      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox, oy - 70, ox, oy + 15);
      p.line(ox - 5, oy, ox + aw, oy);
      p.noStroke(); p.fill(80); p.textSize(7.5); p.textAlign(p.LEFT, p.CENTER);
      p.text("t", ox + aw + 5, oy);

      // Decaying exponential
      p.stroke(0, 150, 255); p.strokeWeight(2.5); p.noFill();
      p.beginShape();
      for (let i = 0; i <= aw; i++) {
        const t = (i / aw) * 8;
        const y = t >= 0 ? Math.exp(-t * 0.6) * 55 : 0;
        p.vertex(ox + i, oy - y);
      }
      p.endShape();

      // Energy shading
      p.fill(0, 150, 255, 20); p.noStroke();
      p.beginShape();
      p.vertex(ox, oy);
      for (let i = 0; i <= aw; i++) {
        const t = (i / aw) * 8;
        const y = t >= 0 ? Math.exp(-t * 0.6) * 55 : 0;
        p.vertex(ox + i, oy - y);
      }
      p.vertex(ox + aw, oy);
      p.endShape(p.CLOSE);

      p.noStroke(); p.fill(0, 150, 255, 160); p.textSize(9.5); p.textAlign(p.CENTER, p.CENTER);
      p.text("Área finita = Energia finita", ox + aw / 2, oy - 30);
    }

    // Power signal panel
    {
      const startX = 20 + panelW;
      const ox = startX + 35, oy = h / 2 + 20, aw = panelW - 55;
      p.fill(15, 20, 35); p.stroke(255, 180, 50, 50); p.strokeWeight(1);
      p.rect(startX, 28, panelW, h - 60, 6);
      p.noStroke(); p.fill(255, 180, 50, 220); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
      p.text("Sinal de Potência", startX + panelW / 2, 38);
      p.fill(255, 180, 50, 150); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
      p.text("P < ∞,  E → ∞", ox + 3, 56);
      p.text("Ex: senoide, degrau unitário", ox + 3, 67);
      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox, oy - 70, ox, oy + 15);
      p.line(ox - 5, oy, ox + aw, oy);
      p.noStroke(); p.fill(80); p.textSize(7.5); p.textAlign(p.LEFT, p.CENTER);
      p.text("t", ox + aw + 5, oy);

      // Sine wave (infinite energy)
      p.stroke(255, 180, 50); p.strokeWeight(2.5); p.noFill();
      p.beginShape();
      for (let i = 0; i <= aw; i++) {
        const t = (i / aw) * 4 * Math.PI;
        p.vertex(ox + i, oy - Math.sin(t) * 50);
      }
      p.endShape();

      p.noStroke(); p.fill(255, 180, 50, 160); p.textSize(9.5); p.textAlign(p.CENTER, p.CENTER);
      p.text("Amplitude constante → E → ∞", ox + aw / 2, oy - 60);
    }

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Sinais de energia: E = ∫|x(t)|² dt < ∞  |  Sinais de potência: P = lim(1/2T)∫|x(t)|² dt < ∞", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 5: Deterministic vs random signals
export function DeterministicVsRandom() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Sinal Determinístico vs. Sinal Aleatório", w / 2, 8);

    const panelW = (w - 30) / 2;

    // Deterministic
    {
      const startX = 10;
      const ox = startX + 30, oy = h / 2 + 15, aw = panelW - 50;
      p.fill(15, 20, 35); p.stroke(0, 150, 255, 50); p.strokeWeight(1);
      p.rect(startX, 28, panelW, h - 60, 6);
      p.noStroke(); p.fill(0, 150, 255, 220); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
      p.text("Determinístico", startX + panelW / 2, 38);
      p.fill(0, 150, 255, 150); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
      p.text("Descrito por equação exata", ox, 54);
      p.text("x(t) = A·cos(ω₀t + φ)", ox, 65);
      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox, oy - 65, ox, oy + 10);
      p.line(ox - 5, oy, ox + aw, oy);
      p.noStroke(); p.fill(80); p.textSize(7.5); p.textAlign(p.LEFT, p.CENTER);
      p.text("t", ox + aw + 5, oy);

      p.stroke(0, 150, 255); p.strokeWeight(2.5); p.noFill();
      p.beginShape();
      for (let i = 0; i <= aw; i++) {
        const t = (i / aw) * 4 * Math.PI;
        p.vertex(ox + i, oy - Math.cos(t + time) * 50);
      }
      p.endShape();

      // Formula overlay
      p.noStroke(); p.fill(0, 150, 255, 120); p.textSize(8.5); p.textAlign(p.CENTER, p.BOTTOM);
      p.text("Valor em qualquer t é conhecido a priori", startX + panelW / 2, h - 38);
    }

    // Random
    {
      const startX = 20 + panelW;
      const ox = startX + 30, oy = h / 2 + 15, aw = panelW - 50;
      p.fill(15, 20, 35); p.stroke(180, 130, 255, 50); p.strokeWeight(1);
      p.rect(startX, 28, panelW, h - 60, 6);
      p.noStroke(); p.fill(180, 130, 255, 220); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
      p.text("Aleatório (Estocástico)", startX + panelW / 2, 38);
      p.fill(180, 130, 255, 150); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
      p.text("Descrito por distribuição de prob.", ox, 54);
      p.text("Ex: ruído térmico, fala", ox, 65);
      p.stroke(50); p.strokeWeight(0.7);
      p.line(ox, oy - 65, ox, oy + 10);
      p.line(ox - 5, oy, ox + aw, oy);
      p.noStroke(); p.fill(80); p.textSize(7.5); p.textAlign(p.LEFT, p.CENTER);
      p.text("t", ox + aw + 5, oy);

      // Noise + slow drift using time for pseudo-random
      p.stroke(180, 130, 255); p.strokeWeight(1.5); p.noFill();
      p.beginShape();
      for (let i = 0; i <= aw; i++) {
        const t = (i / aw) * 8;
        const noise = (Math.sin(t * 13.1 + time * 2.3) + Math.sin(t * 7.3 + time * 3.7) +
          Math.sin(t * 19.7 + time * 1.1)) * 16;
        p.vertex(ox + i, oy + noise);
      }
      p.endShape();

      p.noStroke(); p.fill(180, 130, 255, 120); p.textSize(8.5); p.textAlign(p.CENTER, p.BOTTOM);
      p.text("Valor em qualquer t só é conhecido probabilisticamente", startX + panelW / 2, h - 38);
    }

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Determinístico: equação fechada  |  Aleatório: tratado com estatística e processos estocásticos", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={310} />;
}

// Visualization 6: Signal classification summary map
export function SignalClassificationMap() {
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Mapa das Classificações de Sinais", w / 2, 8);

    // Cards layout - 3 rows x 2 cols (6 classification pairs)
    const classifications = [
      {
        title: "Domínio do Tempo",
        a: "Contínuo no Tempo",    aCol: [0, 150, 255],    aDesc: "Definido para todo t ∈ ℝ",
        b: "Discreto no Tempo",    bCol: [255, 180, 50],   bDesc: "Definido apenas para n ∈ ℤ",
      },
      {
        title: "Amplitude",
        a: "Analógico",            aCol: [100, 200, 100],  aDesc: "Amplitude contínua (infinitos níveis)",
        b: "Digital",              bCol: [255, 100, 100],  bDesc: "Amplitude discreta (2ⁿ níveis)",
      },
      {
        title: "Repetição",
        a: "Periódico",            aCol: [0, 150, 255],    aDesc: "x(t) = x(t + T₀) para todo t",
        b: "Aperiódico",           bCol: [180, 130, 255],  bDesc: "Não se repete com período fixo",
      },
      {
        title: "Energia / Potência",
        a: "Sinal de Energia",     aCol: [255, 180, 50],   aDesc: "E < ∞,  P = 0",
        b: "Sinal de Potência",    bCol: [100, 200, 100],  bDesc: "P < ∞,  E = ∞",
      },
      {
        title: "Previsibilidade",
        a: "Determinístico",       aCol: [0, 150, 255],    aDesc: "Descrito por equação exata",
        b: "Aleatório",            bCol: [180, 130, 255],  bDesc: "Descrito probabilisticamente",
      },
    ];

    const cardW = (w - 40) / 2;
    const cardH = 50;
    const startY = 38;

    // Draw 5 classification pairs
    for (let i = 0; i < classifications.length; i++) {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const cx = 10 + col * (cardW + 10);
      const cy = startY + row * (cardH + 10);

      const cls = classifications[i];

      // Category title
      p.fill(15, 20, 35); p.stroke(60, 60, 80, 80); p.strokeWeight(1);
      p.rect(cx, cy, cardW, cardH, 5);

      p.noStroke(); p.fill(160, 160, 200, 180); p.textSize(8); p.textAlign(p.LEFT, p.TOP);
      p.text(cls.title.toUpperCase(), cx + 6, cy + 4);

      // Option A
      p.fill(cls.aCol[0], cls.aCol[1], cls.aCol[2], 200); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
      p.text("● " + cls.a, cx + 6, cy + 15);
      p.fill(cls.aCol[0], cls.aCol[1], cls.aCol[2], 100); p.textSize(7.5);
      p.text(cls.aDesc, cx + 14, cy + 25);

      // Option B
      p.fill(cls.bCol[0], cls.bCol[1], cls.bCol[2], 200); p.textSize(9); p.textAlign(p.LEFT, p.TOP);
      p.text("● " + cls.b, cx + cardW / 2 + 2, cy + 15);
      p.fill(cls.bCol[0], cls.bCol[1], cls.bCol[2], 100); p.textSize(7.5);
      p.text(cls.bDesc, cx + cardW / 2 + 10, cy + 25);
    }

    // 5th card centred at the bottom
    const lastIdx = 4;
    const lastRow = Math.floor(lastIdx / 2);
    const leftCx = 10;
    const rightCx = 10 + cardW + 10;
    // The 5th card was placed at col=0, row=2. Center it:
    // We already drew it above. Draw an extra note below all cards.
    const notesY = startY + 3 * (cardH + 10) + 5;
    p.noStroke(); p.fill(80, 80, 100, 180); p.textSize(8.5); p.textAlign(p.CENTER, p.TOP);
    p.text("Nota: Contínuo ≠ Analógico  |  Discreto ≠ Digital  (confusão muito comum!)", w / 2, notesY);

    p.noStroke(); p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Um sinal pode pertencer a múltiplas categorias simultaneamente", w / 2, h - 6);
  };
  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

