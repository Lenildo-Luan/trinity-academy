"use client";

import { P5Sketch } from "../p5-sketch";
import type p5 from "p5"; // signal operations

// Visualization 1: Time shifting — delay and advance
export function TimeShiftDemo() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Deslocamento Temporal \u2014 Atraso e Avanço", w / 2, 6);
    const originX = 55, axisW = w - 90, axH = 38, tMax = 8;
    const trianglePulse = (t: number) => {
      if (t >= 1 && t <= 2) return t - 1;
      if (t > 2 && t <= 3) return 3 - t;
      return 0;
    };
    const signals = [
      { label: "x(t)  (original)", originY: 60, col: [0, 150, 255], fn: (t: number) => trianglePulse(t), shift: 0 },
      { label: "x(t \u2212 2)  (atraso de 2)", originY: 155, col: [255, 180, 50], fn: (t: number) => trianglePulse(t - 2), shift: 2 },
      { label: "x(t + 1)  (avanço de 1)", originY: 250, col: [100, 200, 100], fn: (t: number) => trianglePulse(t + 1), shift: -1 },
    ];
    signals.forEach((sig) => {
      p.stroke(50); p.strokeWeight(0.5);
      p.line(originX, sig.originY - axH - 5, originX, sig.originY + 5);
      p.line(originX - 5, sig.originY, originX + axisW, sig.originY);
      p.noStroke(); p.fill(60); p.textSize(7); p.textAlign(p.CENTER, p.TOP);
      for (let tv = 0; tv <= tMax; tv++) {
        const tx = originX + (tv / tMax) * axisW;
        p.text(tv.toString(), tx, sig.originY + 2);
        p.stroke(30); p.strokeWeight(0.3); p.line(tx, sig.originY - 2, tx, sig.originY + 2); p.noStroke();
      }
      p.fill(80); p.text("t", originX + axisW + 8, sig.originY);
      p.fill(sig.col[0], sig.col[1], sig.col[2], 200); p.textSize(9); p.textAlign(p.LEFT, p.CENTER);
      p.text(sig.label, originX + 5, sig.originY - axH - 10);
      p.stroke(sig.col[0], sig.col[1], sig.col[2]); p.strokeWeight(2); p.noFill();
      p.beginShape();
      for (let i = 0; i <= axisW; i++) { const t = (i / axisW) * tMax; p.vertex(originX + i, sig.originY - sig.fn(t) * axH * 0.9); }
      p.endShape();
      if (sig.shift !== 0) {
        const peakT = sig.shift === 2 ? 4 : 1;
        const origPeakX = originX + (2 / tMax) * axisW;
        const newPeakX = originX + (peakT / tMax) * axisW;
        const arrowY = sig.originY - axH * 0.5;
        p.stroke(sig.col[0], sig.col[1], sig.col[2], 100); p.strokeWeight(1.5);
        p.line(origPeakX, arrowY, newPeakX, arrowY);
        const dir = newPeakX > origPeakX ? 1 : -1;
        p.fill(sig.col[0], sig.col[1], sig.col[2], 100); p.noStroke();
        p.triangle(newPeakX, arrowY, newPeakX - dir * 6, arrowY - 3, newPeakX - dir * 6, arrowY + 3);
        p.fill(sig.col[0], sig.col[1], sig.col[2], 160); p.textSize(7.5); p.textAlign(p.CENTER, p.BOTTOM);
        const shiftLabel = sig.shift > 0 ? "\u2192 atraso " + sig.shift : "\u2190 avanço " + Math.abs(sig.shift);
        p.text(shiftLabel, (origPeakX + newPeakX) / 2, arrowY - 3);
      }
    });
    p.fill(15, 20, 35); p.stroke(180, 130, 255, 40); p.strokeWeight(1);
    p.rect(10, h - 38, w - 20, 28, 5); p.noStroke();
    p.fill(180, 130, 255, 200); p.textSize(9.5); p.textAlign(p.CENTER, p.CENTER);
    p.text("x(t \u2212 t\u2080): t\u2080 > 0 \u2192 DIREITA (atraso)  |  t\u2080 < 0 \u2192 ESQUERDA (avanço)", w / 2, h - 24);
  };
  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 2: Time scaling — compression and expansion
export function TimeScalingDemo() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19); time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Escalamento Temporal \u2014 Compressão e Expansão", w / 2, 6);
    const originX = 55, axisW = w - 90, axH = 38, tMax = 8;
    const pulse = (t: number) => Math.exp(-0.5 * Math.pow((t - 4) / 0.8, 2));
    const signals = [
      { label: "x(t)  (original)", originY: 60, col: [0, 150, 255], a: 1 },
      { label: "x(2t)  (compressão, a=2)", originY: 155, col: [255, 100, 100], a: 2 },
      { label: "x(t/2)  (expansão, a=0.5)", originY: 250, col: [100, 200, 100], a: 0.5 },
    ];
    signals.forEach((sig) => {
      p.stroke(50); p.strokeWeight(0.5);
      p.line(originX, sig.originY - axH - 5, originX, sig.originY + 5);
      p.line(originX - 5, sig.originY, originX + axisW, sig.originY);
      p.noStroke(); p.fill(60); p.textSize(7); p.textAlign(p.CENTER, p.TOP);
      for (let tv = 0; tv <= tMax; tv++) {
        const tx = originX + (tv / tMax) * axisW;
        p.text(tv.toString(), tx, sig.originY + 2);
        p.stroke(30); p.strokeWeight(0.3); p.line(tx, sig.originY - 2, tx, sig.originY + 2); p.noStroke();
      }
      p.fill(80); p.text("t", originX + axisW + 8, sig.originY);
      p.fill(sig.col[0], sig.col[1], sig.col[2], 200); p.textSize(9); p.textAlign(p.LEFT, p.CENTER);
      p.text(sig.label, originX + 5, sig.originY - axH - 10);
      p.stroke(sig.col[0], sig.col[1], sig.col[2]); p.strokeWeight(2); p.noFill(); p.beginShape();
      for (let i = 0; i <= axisW; i++) { const t = (i / axisW) * tMax; p.vertex(originX + i, sig.originY - pulse(sig.a * t) * axH * 0.9); }
      p.endShape();
      const peakT = 4 / sig.a;
      if (peakT >= 0 && peakT <= tMax) {
        const peakX = originX + (peakT / tMax) * axisW;
        p.fill(sig.col[0], sig.col[1], sig.col[2], 100); p.noStroke(); p.ellipse(peakX, sig.originY - axH * 0.9, 6, 6);
        p.fill(sig.col[0], sig.col[1], sig.col[2], 160); p.textSize(7.5); p.textAlign(p.CENTER, p.BOTTOM);
        p.text("pico em t=" + peakT, peakX, sig.originY - axH * 0.9 - 3);
      }
      if (sig.a !== 1) {
        p.fill(sig.col[0], sig.col[1], sig.col[2], 140); p.textSize(7.5); p.textAlign(p.RIGHT, p.CENTER);
        const wf = 1 / sig.a;
        p.text(sig.a > 1 ? "Largura \u00d7" + wf + " (comprime)" : "Largura \u00d7" + wf + " (expande)", originX + axisW - 5, sig.originY - axH * 0.3);
      }
    });
    p.fill(15, 20, 35); p.stroke(180, 130, 255, 40); p.strokeWeight(1);
    p.rect(10, h - 38, w - 20, 28, 5); p.noStroke();
    p.fill(180, 130, 255, 200); p.textSize(9.5); p.textAlign(p.CENTER, p.CENTER);
    p.text("x(at): |a| > 1 \u2192 comprime  |  |a| < 1 \u2192 expande", w / 2, h - 24);
  };
  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// Visualization 3: Time reversal — mirror about t=0
export function TimeReversalDemo() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19); time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Reversão Temporal \u2014 x(\u2212t)", w / 2, 6);
    const originX = w / 2, axisW = w - 80, halfW = axisW / 2, axH = 55;
    const asymSignal = (t: number) => {
      if (t >= 0 && t <= 2) return t / 2;
      if (t > 2 && t <= 3) return 1 - (t - 2) * 0.5;
      if (t > 3 && t <= 4) return 0.5 * Math.exp(-(t - 3) * 2);
      return 0;
    };
    const plots = [
      { label: "x(t)  (original)", originY: 95, col: [0, 150, 255], fn: (t: number) => asymSignal(t) },
      { label: "x(\u2212t)  (invertido)", originY: 225, col: [255, 180, 50], fn: (t: number) => asymSignal(-t) },
    ];
    plots.forEach((plot) => {
      p.stroke(50); p.strokeWeight(0.5);
      p.line(originX, plot.originY - axH - 5, originX, plot.originY + 5);
      p.line(originX - halfW - 5, plot.originY, originX + halfW + 5, plot.originY);
      p.noStroke(); p.fill(60); p.textSize(7); p.textAlign(p.CENTER, p.TOP);
      for (let tv = -5; tv <= 5; tv++) {
        const tx = originX + (tv / 5) * halfW;
        if (tv !== 0) p.text(tv.toString(), tx, plot.originY + 2);
        p.stroke(30); p.strokeWeight(0.3); p.line(tx, plot.originY - 2, tx, plot.originY + 2); p.noStroke();
      }
      p.fill(80); p.text("t", originX + halfW + 12, plot.originY);
      p.text("0", originX + 4, plot.originY + 2);
      p.fill(plot.col[0], plot.col[1], plot.col[2], 200); p.textSize(9); p.textAlign(p.LEFT, p.CENTER);
      p.text(plot.label, originX - halfW, plot.originY - axH - 10);
      p.stroke(plot.col[0], plot.col[1], plot.col[2]); p.strokeWeight(2); p.noFill(); p.beginShape();
      for (let i = 0; i <= axisW; i++) { const t = ((i / axisW) - 0.5) * 10; p.vertex(originX - halfW + i, plot.originY - plot.fn(t) * axH * 0.9); }
      p.endShape();
    });
    p.stroke(180, 130, 255, 60); p.strokeWeight(1);
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    ctx.setLineDash([4, 4]); p.line(originX, 30, originX, h - 50); ctx.setLineDash([]);
    p.noStroke(); p.fill(180, 130, 255, 140); p.textSize(8); p.textAlign(p.CENTER, p.CENTER);
    p.text("eixo de\nespelhamento\nt = 0", originX, (95 + 225) / 2);
    p.fill(15, 20, 35); p.stroke(180, 130, 255, 40); p.strokeWeight(1);
    p.rect(10, h - 38, w - 20, 28, 5); p.noStroke();
    p.fill(180, 130, 255, 200); p.textSize(9.5); p.textAlign(p.CENTER, p.CENTER);
    p.text("x(\u2212t): espelha o sinal em relação ao eixo vertical (t = 0)", w / 2, h - 24);
  };
  return <P5Sketch setup={setup} draw={draw} height={310} />;
}

// Visualization 4: Shift then Scale — Method 1
export function ShiftThenScaleDemo() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19); time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(12);
    p.text("Operações Combinadas: x(2t \u2212 3) \u2014 Método 1", w / 2, 6);
    const oX = 50, axW = w - 85, axH = 28, tMax = 8;
    const rp = (t: number) => (t >= 1 && t <= 3) ? 1 : 0;
    const steps = [
      { label: "\u2460 x(t)  original", y: 48, col: [0, 150, 255], fn: (t: number) => rp(t), desc: "Pulso [1, 3]" },
      { label: "\u2461 x(t \u2212 3)  desloca +3", y: 118, col: [255, 180, 50], fn: (t: number) => rp(t - 3), desc: "Pulso [4, 6]" },
      { label: "\u2462 x(2t \u2212 3)  escala \u00d72", y: 188, col: [100, 200, 100], fn: (t: number) => rp(2 * t - 3), desc: "Pulso [2, 3]" },
    ];
    steps.forEach((s) => {
      p.stroke(50); p.strokeWeight(0.5);
      p.line(oX, s.y - axH - 3, oX, s.y + 3); p.line(oX - 3, s.y, oX + axW, s.y);
      p.noStroke(); p.fill(50); p.textSize(6.5); p.textAlign(p.CENTER, p.TOP);
      for (let tv = 0; tv <= tMax; tv++) p.text(tv.toString(), oX + (tv / tMax) * axW, s.y + 2);
      p.fill(s.col[0], s.col[1], s.col[2], 200); p.textSize(8.5); p.textAlign(p.LEFT, p.CENTER);
      p.text(s.label, oX + 5, s.y - axH - 8);
      p.fill(80); p.textSize(7.5); p.textAlign(p.RIGHT, p.CENTER); p.text(s.desc, oX + axW, s.y - axH - 8);
      p.fill(s.col[0], s.col[1], s.col[2], 40); p.stroke(s.col[0], s.col[1], s.col[2]); p.strokeWeight(2);
      p.beginShape(); p.vertex(oX, s.y);
      for (let i = 0; i <= axW; i++) { const t = (i / axW) * tMax; p.vertex(oX + i, s.y - s.fn(t) * axH * 0.9); }
      p.vertex(oX + axW, s.y); p.endShape(p.CLOSE);
    });
    p.fill(15, 20, 35); p.stroke(180, 130, 255, 40); p.strokeWeight(1);
    p.rect(10, h - 38, w - 20, 28, 5); p.noStroke();
    p.fill(180, 130, 255, 200); p.textSize(9); p.textAlign(p.CENTER, p.CENTER);
    p.text("Método 1: desloca (t\u2212b), depois escala (at)", w / 2, h - 24);
  };
  return <P5Sketch setup={setup} draw={draw} height={270} />;
}

// Visualization 5: Scale then Shift — Method 2
export function ScaleThenShiftDemo() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19); time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(12);
    p.text("Operações Combinadas: x(2t \u2212 3) \u2014 Método 2", w / 2, 6);
    const oX = 50, axW = w - 85, axH = 28, tMax = 8;
    const rp = (t: number) => (t >= 1 && t <= 3) ? 1 : 0;
    const steps = [
      { label: "\u2460 x(t)  original", y: 48, col: [0, 150, 255], fn: (t: number) => rp(t), desc: "Pulso [1, 3]" },
      { label: "\u2461 x(2t)  escala \u00d72", y: 118, col: [255, 100, 100], fn: (t: number) => rp(2 * t), desc: "Pulso [0.5, 1.5]" },
      { label: "\u2462 x(2(t\u22123/2))=x(2t\u22123)", y: 188, col: [100, 200, 100], fn: (t: number) => rp(2 * t - 3), desc: "Pulso [2, 3]" },
    ];
    steps.forEach((s) => {
      p.stroke(50); p.strokeWeight(0.5);
      p.line(oX, s.y - axH - 3, oX, s.y + 3); p.line(oX - 3, s.y, oX + axW, s.y);
      p.noStroke(); p.fill(50); p.textSize(6.5); p.textAlign(p.CENTER, p.TOP);
      for (let tv = 0; tv <= tMax; tv++) p.text(tv.toString(), oX + (tv / tMax) * axW, s.y + 2);
      p.fill(s.col[0], s.col[1], s.col[2], 200); p.textSize(8.5); p.textAlign(p.LEFT, p.CENTER);
      p.text(s.label, oX + 5, s.y - axH - 8);
      p.fill(80); p.textSize(7.5); p.textAlign(p.RIGHT, p.CENTER); p.text(s.desc, oX + axW, s.y - axH - 8);
      p.fill(s.col[0], s.col[1], s.col[2], 40); p.stroke(s.col[0], s.col[1], s.col[2]); p.strokeWeight(2);
      p.beginShape(); p.vertex(oX, s.y);
      for (let i = 0; i <= axW; i++) { const t = (i / axW) * tMax; p.vertex(oX + i, s.y - s.fn(t) * axH * 0.9); }
      p.vertex(oX + axW, s.y); p.endShape(p.CLOSE);
    });
    p.fill(15, 20, 35); p.stroke(180, 130, 255, 40); p.strokeWeight(1);
    p.rect(10, h - 38, w - 20, 28, 5); p.noStroke();
    p.fill(180, 130, 255, 200); p.textSize(9); p.textAlign(p.CENTER, p.CENTER);
    p.text("Método 2: escala (at), depois desloca (t\u2212b/a)", w / 2, h - 24);
  };
  return <P5Sketch setup={setup} draw={draw} height={270} />;
}

// Visualization 6: Combined operations summary
export function CombinedOperationsSummary() {
  let time = 0;
  const setup = (p: p5) => { p.textFont("monospace"); };
  const draw = (p: p5) => {
    p.background(2, 7, 19); time += 0.015;
    const w = p.width, h = p.height;
    p.noStroke(); p.fill(200); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
    p.text("Resumo: Três Operações Fundamentais", w / 2, 6);
    const numCols = 3, margin = 8;
    const colW = (w - margin * (numCols + 1)) / numCols;
    const axH = 35, axTop = 50, tMax = 6;
    const tri = (t: number) => { if (t >= 1 && t <= 2) return t - 1; if (t > 2 && t <= 3) return 3 - t; return 0; };
    const ops = [
      { title: "Deslocamento", sub: "x(t \u2212 t\u2080)", col: [0, 150, 255], origFn: (t: number) => tri(t), transFn: (t: number) => tri(t - 2), transLabel: "x(t\u22122)", rule: "Desloca no eixo t", icon: "\u2192" },
      { title: "Escalamento", sub: "x(at)", col: [255, 180, 50], origFn: (t: number) => tri(t), transFn: (t: number) => tri(2 * t), transLabel: "x(2t)", rule: "Comprime/expande", icon: "\u2194" },
      { title: "Reversão", sub: "x(\u2212t)", col: [100, 200, 100], origFn: (t: number) => tri(t + 3), transFn: (t: number) => tri(-t + 3), transLabel: "x(\u2212t)", rule: "Espelha em t=0", icon: "\u27f7" },
    ];
    ops.forEach((op, oi) => {
      const sx = margin + oi * (colW + margin), midX = sx + colW / 2;
      p.fill(15, 20, 35); p.stroke(op.col[0], op.col[1], op.col[2], 30); p.strokeWeight(1);
      p.rect(sx, 24, colW, h - 55, 6);
      p.noStroke(); p.fill(op.col[0], op.col[1], op.col[2]); p.textSize(9); p.textAlign(p.CENTER, p.TOP);
      p.text(op.title, midX, 28); p.fill(80); p.textSize(8); p.text(op.sub, midX, 39);
      const oXp = sx + 15, axW = colW - 30, oY1 = axTop + axH + 10;
      p.stroke(50); p.strokeWeight(0.3); p.line(oXp, oY1 - axH, oXp, oY1); p.line(oXp, oY1, oXp + axW, oY1);
      p.noStroke(); p.fill(90); p.textSize(6.5); p.textAlign(p.LEFT, p.TOP); p.text("x(t)", oXp, oY1 - axH - 8);
      p.stroke(100, 100, 140); p.strokeWeight(1.5); p.noFill(); p.beginShape();
      for (let i = 0; i <= axW; i++) { const t = (i / axW) * tMax; p.vertex(oXp + i, oY1 - op.origFn(t) * axH * 0.85); }
      p.endShape();
      const amY = oY1 + 18;
      p.fill(op.col[0], op.col[1], op.col[2], 120); p.noStroke();
      p.triangle(midX, amY + 6, midX - 4, amY - 2, midX + 4, amY - 2);
      p.fill(op.col[0], op.col[1], op.col[2], 160); p.textSize(7); p.textAlign(p.CENTER, p.CENTER); p.text(op.icon, midX, amY - 6);
      const oY2 = amY + 20 + axH;
      p.stroke(50); p.strokeWeight(0.3); p.line(oXp, oY2 - axH, oXp, oY2); p.line(oXp, oY2, oXp + axW, oY2);
      p.noStroke(); p.fill(op.col[0], op.col[1], op.col[2], 160); p.textSize(6.5); p.textAlign(p.LEFT, p.TOP);
      p.text(op.transLabel, oXp, oY2 - axH - 8);
      p.stroke(op.col[0], op.col[1], op.col[2]); p.strokeWeight(1.5); p.noFill(); p.beginShape();
      for (let i = 0; i <= axW; i++) { const t = (i / axW) * tMax; p.vertex(oXp + i, oY2 - op.transFn(t) * axH * 0.85); }
      p.endShape();
      p.noStroke(); p.fill(op.col[0], op.col[1], op.col[2], 180); p.textSize(8); p.textAlign(p.CENTER, p.TOP);
      p.text(op.rule, midX, oY2 + 10);
    });
    p.fill(100); p.textSize(9); p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Essas operações podem ser combinadas: x(at \u2212 b)", w / 2, h - 4);
  };
  return <P5Sketch setup={setup} draw={draw} height={310} />;
}

