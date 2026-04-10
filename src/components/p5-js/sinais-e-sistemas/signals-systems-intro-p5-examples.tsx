"use client";

import { P5Sketch } from "../p5-sketch";
import type p5 from "p5";

// Visualization 1: Signal as a function of time — animated sine wave with labeled axes
export function SignalDefinition() {
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
    p.text("Sinal como Função do Tempo: x(t)", w / 2, 10);

    // Axes
    const originX = 70;
    const originY = h / 2 + 10;
    const axisW = w - 100;
    const axisH = 180;

    // Y axis
    p.stroke(100);
    p.strokeWeight(1);
    p.line(originX, originY - axisH / 2 - 10, originX, originY + axisH / 2 + 10);
    // X axis
    p.line(originX - 10, originY, originX + axisW + 10, originY);

    // Axis labels
    p.noStroke();
    p.fill(150);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("t (tempo)", originX + axisW / 2, originY + axisH / 2 + 16);
    p.push();
    p.translate(originX - 40, originY);
    p.rotate(-p.HALF_PI);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("x(t) (amplitude)", 0, 0);
    p.pop();

    // Arrow tips
    p.fill(100);
    p.noStroke();
    p.triangle(originX + axisW + 10, originY, originX + axisW + 2, originY - 4, originX + axisW + 2, originY + 4);
    p.triangle(originX, originY - axisH / 2 - 10, originX - 4, originY - axisH / 2 - 2, originX + 4, originY - axisH / 2 - 2);

    // Draw animated sine wave
    p.stroke(0, 150, 255);
    p.strokeWeight(2.5);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= axisW; i++) {
      const t = (i / axisW) * 4 * p.PI;
      const amplitude = axisH / 2 - 10;
      const y = originY - amplitude * p.sin(t + time * 3);
      p.vertex(originX + i, y);
    }
    p.endShape();

    // Moving dot on the wave
    const dotProgress = ((time * 0.8) % 1);
    const dotI = dotProgress * axisW;
    const dotT = (dotI / axisW) * 4 * p.PI;
    const dotAmplitude = axisH / 2 - 10;
    const dotX = originX + dotI;
    const dotY = originY - dotAmplitude * p.sin(dotT + time * 3);

    p.fill(255, 180, 50);
    p.noStroke();
    p.ellipse(dotX, dotY, 10, 10);

    // Dashed line from dot to x-axis
    p.stroke(255, 180, 50, 80);
    p.strokeWeight(1);
    for (let dy = Math.min(dotY, originY); dy < Math.max(dotY, originY); dy += 6) {
      p.line(dotX, dy, dotX, dy + 3);
    }

    // Annotation
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(10);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text(`x(t₀)`, dotX + 8, dotY - 4);

    // Formula
    p.fill(0, 150, 255, 200);
    p.textSize(12);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("x(t) = A · sin(2\u03C0ft)", w / 2, h - 30);

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Um sinal é uma função que carrega informação — geralmente no domínio do tempo", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 2: Everyday signal examples — TV, cellular, audio waveforms side by side
export function SignalExamples() {
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
    p.text("Exemplos de Sinais no Cotidiano", w / 2, 10);

    const cols = 3;
    const colW = (w - 60) / cols;
    const waveH = 100;
    const startY = 60;

    const signals = [
      { name: "Sinal de TV", color: [0, 150, 255] as [number, number, number], desc: "Vídeo e áudio transmitidos", waveType: "square" },
      { name: "Sinal de Celular", color: [180, 130, 255] as [number, number, number], desc: "Ondas eletromagnéticas moduladas", waveType: "modulated" },
      { name: "Sinal de Áudio", color: [100, 200, 100] as [number, number, number], desc: "Vibração sonora no tempo", waveType: "audio" },
    ];

    signals.forEach((sig, i) => {
      const cx = 30 + i * colW + colW / 2;
      const cy = startY + waveH / 2 + 20;

      // Box background
      p.fill(15, 20, 35);
      p.stroke(sig.color[0], sig.color[1], sig.color[2], 80);
      p.strokeWeight(2);
      p.rect(30 + i * colW + 5, startY, colW - 10, waveH + 80, 8);

      // Label
      p.noStroke();
      p.fill(sig.color[0], sig.color[1], sig.color[2]);
      p.textSize(12);
      p.textAlign(p.CENTER, p.TOP);
      p.text(sig.name, cx, startY + 8);

      // Wave
      p.stroke(sig.color[0], sig.color[1], sig.color[2]);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      const waveStartX = 30 + i * colW + 15;
      const waveEndX = 30 + (i + 1) * colW - 15;
      for (let x = waveStartX; x <= waveEndX; x++) {
        const t = ((x - waveStartX) / (waveEndX - waveStartX)) * 6 * p.PI;
        let y = 0;
        if (sig.waveType === "square") {
          y = p.sin(t + time * 2) > 0 ? -35 : 35;
          y += p.sin(t * 3 + time) * 5;
        } else if (sig.waveType === "modulated") {
          const envelope = p.sin(t * 0.3 + time * 1.5);
          y = envelope * 35 * p.sin(t * 4 + time * 3);
        } else {
          y = 30 * p.sin(t + time * 2) + 15 * p.sin(t * 2.7 + time * 1.3) + 8 * p.sin(t * 5 + time * 4);
        }
        p.vertex(x, cy + y);
      }
      p.endShape();

      // Description
      p.noStroke();
      p.fill(80);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text(sig.desc, cx, startY + waveH + 50);
    });

    // Bottom section: common property
    const bottomY = startY + waveH + 105;
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Propriedade comum: todos são funções que variam no tempo, carregando informação", w / 2, bottomY);

    // Icons for each (simple representations)
    const iconY = bottomY + 30;
    const iconLabels = ["📺 Broadcast", "📱 Wireless", "🎵 Acústico"];
    const iconColors = signals.map(s => s.color);

    iconLabels.forEach((label, i) => {
      const cx = 30 + i * colW + colW / 2;
      p.fill(iconColors[i][0], iconColors[i][1], iconColors[i][2], 150);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text(label, cx, iconY);
    });

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Sinais estão presentes em comunicação, medicina, entretenimento e engenharia", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

// Visualization 3: System as input-output block diagram with animated signal flow
export function SystemInputOutput() {
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
    p.text("Sistema: Entrada \u2192 Processamento \u2192 Saída", w / 2, 10);

    const centerY = h / 2 + 5;
    const boxW = 160;
    const boxH = 80;
    const boxX = w / 2 - boxW / 2;
    const boxY = centerY - boxH / 2;

    // Input signal wave (left)
    const inputStartX = 40;
    const inputEndX = boxX - 30;
    p.stroke(0, 150, 255);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let x = inputStartX; x <= inputEndX; x++) {
      const t = ((x - inputStartX) / (inputEndX - inputStartX)) * 4 * p.PI;
      const y = centerY - 30 * p.sin(t + time * 2);
      p.vertex(x, y);
    }
    p.endShape();

    // Input label
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("x(t)", (inputStartX + inputEndX) / 2, centerY - 45);
    p.fill(80);
    p.textSize(9);
    p.text("Sinal de Entrada", (inputStartX + inputEndX) / 2, centerY - 32);

    // Arrow into system
    p.stroke(0, 150, 255, 150);
    p.strokeWeight(2);
    p.line(inputEndX + 5, centerY, boxX - 2, centerY);
    p.fill(0, 150, 255);
    p.noStroke();
    p.triangle(boxX - 2, centerY, boxX - 10, centerY - 5, boxX - 10, centerY + 5);

    // System box
    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 100);
    p.strokeWeight(2.5);
    p.rect(boxX, boxY, boxW, boxH, 10);

    // System label
    p.noStroke();
    p.fill(255, 180, 50);
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Sistema", w / 2, centerY - 10);
    p.fill(200);
    p.textSize(10);
    p.text("T{ x(t) }", w / 2, centerY + 14);

    // Gears animation inside box
    const gearX = boxX + boxW - 30;
    const gearY = boxY + 18;
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(1.5);
    p.noFill();
    const gearAngle = time * 3;
    for (let i = 0; i < 6; i++) {
      const a = gearAngle + (i * p.TWO_PI) / 6;
      const gx = gearX + p.cos(a) * 8;
      const gy = gearY + p.sin(a) * 8;
      p.line(gearX, gearY, gx, gy);
    }
    p.ellipse(gearX, gearY, 12, 12);

    // Arrow out of system
    const outputStartX = boxX + boxW + 2;
    const outputEndX = w - 40;

    p.stroke(100, 200, 100, 150);
    p.strokeWeight(2);
    p.line(outputStartX, centerY, outputStartX + 25, centerY);
    p.fill(100, 200, 100);
    p.noStroke();
    p.triangle(outputStartX + 28, centerY, outputStartX + 20, centerY - 5, outputStartX + 20, centerY + 5);

    // Output signal wave (right) — modified wave
    const outWaveStart = outputStartX + 35;
    p.stroke(100, 200, 100);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let x = outWaveStart; x <= outputEndX; x++) {
      const t = ((x - outWaveStart) / (outputEndX - outWaveStart)) * 4 * p.PI;
      const y = centerY - 25 * p.sin(t * 2 + time * 2) * p.exp(-t * 0.05);
      p.vertex(x, y);
    }
    p.endShape();

    // Output label
    p.noStroke();
    p.fill(100, 200, 100);
    p.textSize(12);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("y(t)", (outWaveStart + outputEndX) / 2, centerY - 45);
    p.fill(80);
    p.textSize(9);
    p.text("Sinal de Saída", (outWaveStart + outputEndX) / 2, centerY - 32);

    // Mathematical relation
    p.noStroke();
    p.fill(180, 130, 255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("y(t) = T{ x(t) }", w / 2, boxY + boxH + 20);

    // Animated particles through system
    for (let i = 0; i < 3; i++) {
      const progress = ((time * 0.5 + i * 0.33) % 1);
      let px, py;
      if (progress < 0.4) {
        // Entering system
        const localP = progress / 0.4;
        px = p.lerp(inputEndX, boxX + boxW / 2, localP);
        py = centerY + p.sin(localP * p.PI * 2) * 5;
        p.fill(0, 150, 255, 180);
      } else if (progress < 0.6) {
        // Inside system
        const localP = (progress - 0.4) / 0.2;
        px = p.lerp(boxX + 20, boxX + boxW - 20, localP);
        py = centerY + p.sin(time * 5 + i) * 3;
        p.fill(255, 180, 50, 180);
      } else {
        // Exiting system
        const localP = (progress - 0.6) / 0.4;
        px = p.lerp(boxX + boxW / 2, outputEndX, localP);
        py = centerY + p.sin(localP * p.PI * 3) * 5;
        p.fill(100, 200, 100, 180);
      }
      p.noStroke();
      p.ellipse(px, py, 8, 8);
    }

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Um sistema transforma sinais de entrada em sinais de saída por meio de uma regra definida", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 4: Continuous-time vs Discrete-time signals comparison
export function ContinuousVsDiscrete() {
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
    p.text("Sinal Contínuo x(t) vs. Sinal Discreto x[n]", w / 2, 10);

    const halfW = w / 2 - 20;
    const waveH = 120;
    const waveY = h / 2 + 10;

    // Divider
    p.stroke(50);
    p.strokeWeight(1);
    p.line(w / 2, 40, w / 2, h - 30);

    // === LEFT: Continuous-time signal ===
    const leftOriginX = 50;
    const leftAxisW = halfW - 40;

    // Subtitle
    p.noStroke();
    p.fill(0, 150, 255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Tempo Contínuo", leftOriginX + leftAxisW / 2, 36);

    // Axes
    p.stroke(80);
    p.strokeWeight(1);
    p.line(leftOriginX, waveY - waveH / 2, leftOriginX, waveY + waveH / 2);
    p.line(leftOriginX, waveY, leftOriginX + leftAxisW, waveY);

    // Axis labels
    p.noStroke();
    p.fill(80);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("t", leftOriginX + leftAxisW + 5, waveY + 2);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("x(t)", leftOriginX - 6, waveY - waveH / 2 + 10);

    // Continuous wave
    p.stroke(0, 150, 255);
    p.strokeWeight(2.5);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= leftAxisW; i++) {
      const t = (i / leftAxisW) * 4 * p.PI;
      const amplitude = waveH / 2 - 10;
      const y = waveY - amplitude * (p.sin(t + time * 2) + 0.3 * p.sin(3 * t + time));
      p.vertex(leftOriginX + i, y);
    }
    p.endShape();

    // Label "Definido para todo t"
    p.noStroke();
    p.fill(0, 150, 255, 180);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Definido para todo valor de t", leftOriginX + leftAxisW / 2, waveY + waveH / 2 + 10);

    // Notation
    p.fill(0, 150, 255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("x(t) \u2208 \u211D", leftOriginX + leftAxisW / 2, waveY + waveH / 2 + 28);

    // === RIGHT: Discrete-time signal ===
    const rightOriginX = w / 2 + 30;
    const rightAxisW = halfW - 40;

    // Subtitle
    p.noStroke();
    p.fill(100, 200, 100);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Tempo Discreto", rightOriginX + rightAxisW / 2, 36);

    // Axes
    p.stroke(80);
    p.strokeWeight(1);
    p.line(rightOriginX, waveY - waveH / 2, rightOriginX, waveY + waveH / 2);
    p.line(rightOriginX, waveY, rightOriginX + rightAxisW, waveY);

    // Axis labels
    p.noStroke();
    p.fill(80);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("n", rightOriginX + rightAxisW + 5, waveY + 2);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("x[n]", rightOriginX - 6, waveY - waveH / 2 + 10);

    // Discrete samples (stems)
    const numSamples = 20;
    const sampleSpacing = rightAxisW / (numSamples - 1);

    for (let n = 0; n < numSamples; n++) {
      const t = (n / (numSamples - 1)) * 4 * p.PI;
      const amplitude = waveH / 2 - 10;
      const val = amplitude * (p.sin(t + time * 2) + 0.3 * p.sin(3 * t + time));
      const sx = rightOriginX + n * sampleSpacing;
      const sy = waveY - val;

      // Stem
      p.stroke(100, 200, 100, 100);
      p.strokeWeight(1);
      p.line(sx, waveY, sx, sy);

      // Dot
      p.fill(100, 200, 100);
      p.noStroke();
      p.ellipse(sx, sy, 7, 7);
    }

    // Label "Definido apenas para n inteiro"
    p.noStroke();
    p.fill(100, 200, 100, 180);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Definido apenas para n inteiro", rightOriginX + rightAxisW / 2, waveY + waveH / 2 + 10);

    // Notation
    p.fill(100, 200, 100);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("x[n], n \u2208 \u2124", rightOriginX + rightAxisW / 2, waveY + waveH / 2 + 28);

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("A mesma informação pode ser representada no domínio contínuo ou discreto", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 5: Hardware vs Software system implementations
export function SystemHardwareSoftware() {
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
    p.text("Implementações de Sistemas: Hardware vs. Software", w / 2, 10);

    const rowH = 110;
    const startY = 50;

    // === Row 1: Hardware ===
    const hwY = startY;
    const hwColor: [number, number, number] = [255, 180, 50];

    // Hardware box
    p.fill(15, 20, 35);
    p.stroke(hwColor[0], hwColor[1], hwColor[2], 80);
    p.strokeWeight(2);
    p.rect(20, hwY, w - 40, rowH, 8);

    // Hardware label
    p.noStroke();
    p.fill(hwColor[0], hwColor[1], hwColor[2]);
    p.textSize(12);
    p.textAlign(p.LEFT, p.TOP);
    p.text("\u2699 Sistema em Hardware", 35, hwY + 10);

    // Hardware pipeline: Input → Circuit → Filter → Amplifier → Output
    const hwStages = ["Entrada\nAnalógica", "Circuito\nElétrico", "Filtro\nAnalógico", "Amplificador", "Saída\nAnalógica"];
    const stageW = 85;
    const stageH = 40;
    const totalStagesW = hwStages.length * stageW + (hwStages.length - 1) * 15;
    const stageStartX = (w - totalStagesW) / 2;
    const stageY = hwY + 42;

    hwStages.forEach((label, i) => {
      const sx = stageStartX + i * (stageW + 15);

      // Stage box
      p.fill(20, 30, 45);
      p.stroke(hwColor[0], hwColor[1], hwColor[2], 60);
      p.strokeWeight(1.5);
      p.rect(sx, stageY, stageW, stageH, 6);

      p.noStroke();
      p.fill(200);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(label, sx + stageW / 2, stageY + stageH / 2);

      // Arrow to next
      if (i < hwStages.length - 1) {
        const arrowX = sx + stageW + 2;
        p.stroke(hwColor[0], hwColor[1], hwColor[2], 120);
        p.strokeWeight(1.5);
        p.line(arrowX, stageY + stageH / 2, arrowX + 11, stageY + stageH / 2);
        p.fill(hwColor[0], hwColor[1], hwColor[2], 120);
        p.noStroke();
        p.triangle(arrowX + 13, stageY + stageH / 2, arrowX + 8, stageY + stageH / 2 - 3, arrowX + 8, stageY + stageH / 2 + 3);
      }
    });

    // Animated particle flowing through HW stages
    const hwProgress = (time * 0.4) % 1;
    const hwParticleX = p.lerp(stageStartX, stageStartX + totalStagesW, hwProgress);
    p.fill(hwColor[0], hwColor[1], hwColor[2], 200);
    p.noStroke();
    p.ellipse(hwParticleX, stageY + stageH / 2, 8, 8);

    // === Row 2: Software ===
    const swY = startY + rowH + 20;
    const swColor: [number, number, number] = [0, 150, 255];

    // Software box
    p.fill(15, 20, 35);
    p.stroke(swColor[0], swColor[1], swColor[2], 80);
    p.strokeWeight(2);
    p.rect(20, swY, w - 40, rowH, 8);

    // Software label
    p.noStroke();
    p.fill(swColor[0], swColor[1], swColor[2]);
    p.textSize(12);
    p.textAlign(p.LEFT, p.TOP);
    p.text("\u{1F4BB} Sistema em Software", 35, swY + 10);

    // Software pipeline: Input Digital → Algorithm → DSP → Output Digital
    const swStages = ["Entrada\nDigital", "Algoritmo\n(Código)", "Processamento\nDSP", "Memória/\nBuffer", "Saída\nDigital"];
    const swStageStartX = (w - totalStagesW) / 2;
    const swStageY = swY + 42;

    swStages.forEach((label, i) => {
      const sx = swStageStartX + i * (stageW + 15);

      // Stage box
      p.fill(20, 30, 45);
      p.stroke(swColor[0], swColor[1], swColor[2], 60);
      p.strokeWeight(1.5);
      p.rect(sx, swStageY, stageW, stageH, 6);

      p.noStroke();
      p.fill(200);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(label, sx + stageW / 2, swStageY + stageH / 2);

      // Arrow to next
      if (i < swStages.length - 1) {
        const arrowX = sx + stageW + 2;
        p.stroke(swColor[0], swColor[1], swColor[2], 120);
        p.strokeWeight(1.5);
        p.line(arrowX, swStageY + stageH / 2, arrowX + 11, swStageY + stageH / 2);
        p.fill(swColor[0], swColor[1], swColor[2], 120);
        p.noStroke();
        p.triangle(arrowX + 13, swStageY + stageH / 2, arrowX + 8, swStageY + stageH / 2 - 3, arrowX + 8, swStageY + stageH / 2 + 3);
      }
    });

    // Animated particle flowing through SW stages
    const swProgress = (time * 0.4 + 0.5) % 1;
    const swParticleX = p.lerp(swStageStartX, swStageStartX + totalStagesW, swProgress);
    p.fill(swColor[0], swColor[1], swColor[2], 200);
    p.noStroke();
    p.ellipse(swParticleX, swStageY + stageH / 2, 8, 8);

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Sistemas podem ser implementados com circuitos físicos (hardware) ou programas (software)", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 6: Full signal processing chain — acquisition to output
export function SignalProcessingChain() {
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
    p.text("Cadeia Completa de Processamento de Sinais", w / 2, 10);

    const chainY = h / 2 - 10;
    const blockW = 95;
    const blockH = 65;
    const gap = 14;

    const stages = [
      { label: "Sensor\n(Microfone)", sub: "Mundo Real", color: [100, 200, 100] as [number, number, number] },
      { label: "Conversor\nA/D", sub: "Analógico→Digital", color: [255, 180, 50] as [number, number, number] },
      { label: "Sistema\n(Processamento)", sub: "DSP / Algoritmo", color: [0, 150, 255] as [number, number, number] },
      { label: "Conversor\nD/A", sub: "Digital→Analógico", color: [255, 180, 50] as [number, number, number] },
      { label: "Atuador\n(Alto-falante)", sub: "Mundo Real", color: [180, 130, 255] as [number, number, number] },
    ];

    const totalW = stages.length * blockW + (stages.length - 1) * gap;
    const startX = (w - totalW) / 2;

    stages.forEach((stage, i) => {
      const bx = startX + i * (blockW + gap);
      const by = chainY - blockH / 2;

      // Block
      p.fill(15, 20, 35);
      p.stroke(stage.color[0], stage.color[1], stage.color[2], 80);
      p.strokeWeight(2);
      p.rect(bx, by, blockW, blockH, 8);

      // Label
      p.noStroke();
      p.fill(stage.color[0], stage.color[1], stage.color[2]);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(stage.label, bx + blockW / 2, chainY - 5);

      // Sub label
      p.fill(80);
      p.textSize(8);
      p.text(stage.sub, bx + blockW / 2, by + blockH - 10);

      // Arrow to next
      if (i < stages.length - 1) {
        const arrowStartX = bx + blockW + 2;
        const nextBx = startX + (i + 1) * (blockW + gap);

        p.stroke(150, 150, 150, 120);
        p.strokeWeight(1.5);
        p.line(arrowStartX, chainY, nextBx - 2, chainY);
        p.fill(150, 150, 150, 120);
        p.noStroke();
        p.triangle(nextBx - 1, chainY, nextBx - 7, chainY - 3, nextBx - 7, chainY + 3);
      }
    });

    // Draw small waveforms between stages
    const waveAmplitude = 12;
    const waveWidth = gap - 4;

    // Between sensor and A/D: analog wave
    const wave1X = startX + blockW + 2;
    const wave1CX = wave1X + gap / 2;
    // Small analog wave above arrow
    p.stroke(100, 200, 100, 120);
    p.strokeWeight(1.5);
    p.noFill();
    p.beginShape();
    for (let dx = -10; dx <= 10; dx++) {
      const wy = chainY - 20 - waveAmplitude * 0.6 * p.sin((dx / 10) * p.PI * 2 + time * 3);
      p.vertex(wave1CX + dx, wy);
    }
    p.endShape();

    // Between A/D and System: discrete dots
    const wave2X = startX + 2 * (blockW + gap) - gap;
    const wave2CX = wave2X + gap / 2;
    for (let n = -3; n <= 3; n++) {
      const dy = -waveAmplitude * 0.5 * p.sin((n / 3) * p.PI + time * 3);
      p.fill(255, 180, 50, 150);
      p.noStroke();
      p.ellipse(wave2CX + n * 4, chainY - 22 + dy, 3, 3);
    }

    // Between System and D/A: processed discrete
    const wave3X = startX + 3 * (blockW + gap) - gap;
    const wave3CX = wave3X + gap / 2;
    for (let n = -3; n <= 3; n++) {
      const dy = -waveAmplitude * 0.4 * p.sin((n / 3) * p.PI * 2 + time * 3) * p.exp(-Math.abs(n) * 0.15);
      p.fill(0, 150, 255, 150);
      p.noStroke();
      p.ellipse(wave3CX + n * 4, chainY - 22 + dy, 3, 3);
    }

    // Between D/A and Actuator: analog wave (reconstructed)
    const wave4X = startX + 4 * (blockW + gap) - gap;
    const wave4CX = wave4X + gap / 2;
    p.stroke(180, 130, 255, 120);
    p.strokeWeight(1.5);
    p.noFill();
    p.beginShape();
    for (let dx = -10; dx <= 10; dx++) {
      const wy = chainY - 20 - waveAmplitude * 0.5 * p.sin((dx / 10) * p.PI * 2 + time * 3) * p.exp(-Math.abs(dx) * 0.02);
      p.vertex(wave4CX + dx, wy);
    }
    p.endShape();

    // Animated particle through chain
    for (let i = 0; i < 2; i++) {
      const progress = (time * 0.3 + i * 0.5) % 1;
      const px = p.lerp(startX, startX + totalW, progress);

      // Determine current stage for color
      const stageIndex = Math.floor(progress * stages.length);
      const currentStage = stages[Math.min(stageIndex, stages.length - 1)];

      p.fill(currentStage.color[0], currentStage.color[1], currentStage.color[2], 180);
      p.noStroke();
      p.ellipse(px, chainY + blockH / 2 + 15, 6, 6);
    }

    // Bottom annotations
    const annotY = chainY + blockH / 2 + 35;
    p.noStroke();
    p.textAlign(p.CENTER, p.TOP);

    // Analog domain
    p.fill(100, 200, 100, 100);
    p.textSize(9);
    const analogStart = startX;
    const analogEnd = startX + blockW;
    p.text("Domínio Analógico", (analogStart + analogEnd) / 2, annotY);

    // Digital domain
    p.fill(0, 150, 255, 100);
    const digitalStart = startX + blockW + gap;
    const digitalEnd = startX + 4 * (blockW + gap) - gap;
    p.text("Domínio Digital", (digitalStart + digitalEnd) / 2, annotY);

    // Analog domain (output)
    p.fill(180, 130, 255, 100);
    const analog2Start = startX + 4 * (blockW + gap);
    const analog2End = startX + totalW;
    p.text("Domínio Analógico", (analog2Start + analog2End) / 2, annotY);

    // Footer
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Do mundo real ao processamento digital e de volta — a cadeia completa de processamento de sinais", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

