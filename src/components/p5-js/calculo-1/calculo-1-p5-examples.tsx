"use client";

import { useMemo, useState } from "react";
import type p5 from "p5";
import { P5Sketch } from "../p5-sketch";

type Bounds = { xMin: number; xMax: number; yMin: number; yMax: number };

const BOARD_BG: [number, number, number] = [2, 7, 19];
const PANEL_BG: [number, number, number] = [15, 20, 35];
const PANEL_STROKE: [number, number, number] = [80, 100, 140];
const AXIS_NEUTRAL: [number, number, number] = [110, 130, 160];
const GRID_NEUTRAL: [number, number, number] = [55, 70, 95];
const TEXT_PRIMARY: [number, number, number] = [215, 225, 240];
const TEXT_SECONDARY: [number, number, number] = [150, 170, 200];

function drawBoardChrome(p: p5, title: string, footer: string) {
  p.background(...BOARD_BG);

  p.noStroke();
  p.fill(...PANEL_BG);
  p.rect(10, 8, p.width - 20, 28, 8);
  p.rect(10, p.height - 34, p.width - 20, 24, 8);

  p.fill(...TEXT_PRIMARY);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(12);
  p.text(title, p.width / 2, 22);

  p.fill(180, 130, 255);
  p.textSize(10);
  p.text(footer, p.width / 2, p.height - 22);
}

function drawOverlay(p: p5, text: string, color: [number, number, number], x = 14, y = 44) {
  p.noStroke();
  p.fill(...PANEL_BG);
  p.rect(x, y, Math.min(p.width - 28, Math.max(170, text.length * 6.4)), 24, 6);
  p.stroke(color[0], color[1], color[2], 90);
  p.noFill();
  p.rect(x, y, Math.min(p.width - 28, Math.max(170, text.length * 6.4)), 24, 6);
  p.noStroke();
  p.fill(...color);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(11);
  p.text(text, x + 8, y + 12);
}

function mapX(p: p5, x: number, b: Bounds, pad: number) {
  return p.map(x, b.xMin, b.xMax, pad, p.width - pad);
}

function mapY(p: p5, y: number, b: Bounds, pad: number) {
  return p.map(y, b.yMin, b.yMax, p.height - pad, pad);
}

function withDash(p: p5, dash: number[]) {
  (p.drawingContext as CanvasRenderingContext2D).setLineDash(dash);
}

function clearDash(p: p5) {
  (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);
}

function drawAxes(p: p5, b: Bounds, pad = 36, title = "", footer = "") {
  drawBoardChrome(p, title, footer);

  p.fill(...PANEL_BG);
  p.stroke(PANEL_STROKE[0], PANEL_STROKE[1], PANEL_STROKE[2], 90);
  p.strokeWeight(1);
  p.rect(pad - 8, pad - 8, p.width - pad * 2 + 16, p.height - pad * 2 + 16, 10);

  p.stroke(GRID_NEUTRAL[0], GRID_NEUTRAL[1], GRID_NEUTRAL[2], 140);
  p.strokeWeight(1);
  for (let x = Math.ceil(b.xMin); x <= b.xMax; x += 1) {
    const sx = mapX(p, x, b, pad);
    p.line(sx, pad, sx, p.height - pad);
  }
  for (let y = Math.ceil(b.yMin); y <= b.yMax; y += 1) {
    const sy = mapY(p, y, b, pad);
    p.line(pad, sy, p.width - pad, sy);
  }

  p.stroke(...AXIS_NEUTRAL);
  p.strokeWeight(1.5);
  if (b.yMin <= 0 && b.yMax >= 0) {
    p.line(pad, mapY(p, 0, b, pad), p.width - pad, mapY(p, 0, b, pad));
  }
  if (b.xMin <= 0 && b.xMax >= 0) {
    p.line(mapX(p, 0, b, pad), pad, mapX(p, 0, b, pad), p.height - pad);
  }
}

export function VerticalLineTest() {
  const [lineX, setLineX] = useState(0);
  const b: Bounds = { xMin: -8, xMax: 8, yMin: -6, yMax: 6 };

  const draw = (p: p5) => {
    drawAxes(p, b, 36, "Teste da Reta Vertical", "Clique no canvas para mover a reta e contar intersecoes");
    const pad = 36;

    p.noFill();
    p.stroke(37, 99, 235);
    p.strokeWeight(2);
    p.beginShape();
    for (let x = -3; x <= 3; x += 0.03) {
      p.vertex(mapX(p, x - 4.5, b, pad), mapY(p, x * x - 3.5, b, pad));
    }
    p.endShape();

    p.stroke(220, 38, 38);
    p.strokeWeight(2);
    p.noFill();
    const cX = mapX(p, 0, b, pad);
    const cY = mapY(p, 0, b, pad);
    const r = mapX(p, 2.2, b, pad) - mapX(p, 0, b, pad);
    p.circle(cX, cY, r * 2);

    p.stroke(22, 163, 74);
    p.strokeWeight(2);
    p.line(mapX(p, 3.2, b, pad), mapY(p, -4, b, pad), mapX(p, 7.2, b, pad), mapY(p, 4, b, pad));

    p.stroke(245, 158, 11);
    p.strokeWeight(2);
    withDash(p, [6, 6]);
    p.line(mapX(p, lineX, b, pad), pad, mapX(p, lineX, b, pad), p.height - pad);
    clearDash(p);

    let intersections = 0;
    const xp = lineX + 4.5;
    if (lineX >= -7.5 && lineX <= -1.5) {
      const yp = xp * xp - 3.5;
      if (yp >= b.yMin && yp <= b.yMax) intersections += 1;
    }

    if (Math.abs(lineX) <= 2.2) {
      const dy = Math.sqrt(2.2 * 2.2 - lineX * lineX);
      if (dy > 0.0001) intersections += 2;
      else intersections += 1;
    }

    if (lineX >= 3.2 && lineX <= 7.2) intersections += 1;

    drawOverlay(p, `Intersecoes: ${intersections}`, intersections <= 1 ? [100, 200, 100] : [255, 180, 50]);

    p.noStroke();
    p.fill(...TEXT_SECONDARY);
    p.textSize(11);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("Azul: parabola", 14, p.height - 22);
    p.text("Laranja: circulo", 132, p.height - 22);
    p.text("Verde: reta", 258, p.height - 22);
  };

  const mousePressed = (p: p5) => {
    const clamped = p.constrain(p.mouseX, 36, p.width - 36);
    setLineX(p.map(clamped, 36, p.width - 36, b.xMin, b.xMax));
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} height={360} />;
}

export function RootFunctionsComparison() {
  const draw = (p: p5) => {
    drawBoardChrome(p, "Comparacao de Funcoes Raiz", "Esquerda: raiz quadrada | Direita: raiz cubica");
    const pad = 34;
    const half = p.width / 2;

    const left: Bounds = { xMin: -0.2, xMax: 6.2, yMin: -0.2, yMax: 3.2 };
    const right: Bounds = { xMin: -6.2, xMax: 6.2, yMin: -2.2, yMax: 2.2 };

    p.noStroke();
    p.fill(...PANEL_BG);
    p.rect(12, 36, half - 18, p.height - 80, 10);
    p.rect(half + 6, 36, half - 18, p.height - 80, 10);

    p.push();
    p.stroke(GRID_NEUTRAL[0], GRID_NEUTRAL[1], GRID_NEUTRAL[2], 120);
    for (let i = 0; i <= 6; i++) {
      const sx = p.map(i, left.xMin, left.xMax, pad, half - pad);
      p.line(sx, pad, sx, p.height - pad);
    }
    for (let j = 0; j <= 3; j++) {
      const sy = p.map(j, left.yMin, left.yMax, p.height - pad, pad);
      p.line(pad, sy, half - pad, sy);
    }
    p.stroke(...AXIS_NEUTRAL);
    p.line(pad, p.map(0, left.yMin, left.yMax, p.height - pad, pad), half - pad, p.map(0, left.yMin, left.yMax, p.height - pad, pad));
    p.line(p.map(0, left.xMin, left.xMax, pad, half - pad), pad, p.map(0, left.xMin, left.xMax, pad, half - pad), p.height - pad);

    p.noFill();
    p.stroke(37, 99, 235);
    p.strokeWeight(2);
    p.beginShape();
    for (let x = 0; x <= 6; x += 0.02) {
      p.vertex(p.map(x, left.xMin, left.xMax, pad, half - pad), p.map(Math.sqrt(x), left.yMin, left.yMax, p.height - pad, pad));
    }
    p.endShape();
    p.noStroke();
    p.fill(...TEXT_SECONDARY);
    p.textSize(11);
    p.text("sqrt(x) - dominio [0, +inf)", pad, 26);
    p.pop();

    p.push();
    p.stroke(GRID_NEUTRAL[0], GRID_NEUTRAL[1], GRID_NEUTRAL[2], 120);
    for (let i = -6; i <= 6; i++) {
      const sx = p.map(i, right.xMin, right.xMax, half + pad, p.width - pad);
      p.line(sx, pad, sx, p.height - pad);
    }
    for (let j = -2; j <= 2; j++) {
      const sy = p.map(j, right.yMin, right.yMax, p.height - pad, pad);
      p.line(half + pad, sy, p.width - pad, sy);
    }
    p.stroke(...AXIS_NEUTRAL);
    p.line(half + pad, p.map(0, right.yMin, right.yMax, p.height - pad, pad), p.width - pad, p.map(0, right.yMin, right.yMax, p.height - pad, pad));
    p.line(p.map(0, right.xMin, right.xMax, half + pad, p.width - pad), pad, p.map(0, right.xMin, right.xMax, half + pad, p.width - pad), p.height - pad);

    p.noFill();
    p.stroke(255, 180, 50);
    p.strokeWeight(2);
    p.beginShape();
    for (let x = -6; x <= 6; x += 0.03) {
      p.vertex(p.map(x, right.xMin, right.xMax, half + pad, p.width - pad), p.map(Math.cbrt(x), right.yMin, right.yMax, p.height - pad, pad));
    }
    p.endShape();
    p.noStroke();
    p.fill(...TEXT_SECONDARY);
    p.textSize(11);
    p.text("cbrt(x) - dominio R", half + pad, 26);
    p.pop();
  };

  return <P5Sketch setup={() => {}} draw={draw} height={320} />;
}

export function PiecewiseFunctionExample() {
  const [threshold, setThreshold] = useState(100);
  const bounds: Bounds = { xMin: 0, xMax: 220, yMin: 0, yMax: 35 };

  const draw = (p: p5) => {
    drawAxes(p, bounds, 40, "Funcao por Partes (Tarifa de Energia)", "Compare os dois trechos e o ponto de mudanca");
    p.noFill();
    p.stroke(37, 99, 235);
    p.strokeWeight(2.5);
    p.beginShape();
    for (let x = 0; x <= threshold; x += 1) {
      const y = 10 + 0.05 * x;
      p.vertex(mapX(p, x, bounds, 40), mapY(p, y, bounds, 40));
    }
    p.endShape();

    p.beginShape();
    const yThreshold = 10 + 0.05 * threshold;
    for (let x = threshold; x <= 220; x += 1) {
      const y = yThreshold + 0.08 * (x - threshold);
      p.vertex(mapX(p, x, bounds, 40), mapY(p, y, bounds, 40));
    }
    p.endShape();

    p.fill(255, 180, 50);
    p.noStroke();
    p.circle(mapX(p, threshold, bounds, 40), mapY(p, yThreshold, bounds, 40), 8);

    drawOverlay(p, `Ponto de mudanca: ${threshold} kWh`, [180, 130, 255]);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        Limiar (kWh)
        <input
          type="range"
          min={50}
          max={180}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
        <span>{threshold}</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={340} />
    </div>
  );
}

export function ExponentialDecay() {
  const [halfLife, setHalfLife] = useState(5730);
  const bounds: Bounds = { xMin: 0, xMax: 23000, yMin: 0, yMax: 105 };

  const draw = (p: p5) => {
    drawAxes(p, bounds, 44, "Decaimento Exponencial", "Linhas-guia marcam 1, 2 e 3 meias-vidas");
    p.noFill();
    p.stroke(37, 99, 235);
    p.strokeWeight(2.5);
    p.beginShape();
    for (let t = 0; t <= 23000; t += 120) {
      const y = 100 * Math.pow(0.5, t / halfLife);
      p.vertex(mapX(p, t, bounds, 44), mapY(p, y, bounds, 44));
    }
    p.endShape();

    p.stroke(255, 180, 50, 150);
    p.strokeWeight(1.3);
    withDash(p, [5, 5]);
    [0.5, 0.25, 0.125].forEach((f, i) => {
      const t = halfLife * (i + 1);
      const y = 100 * f;
      p.line(mapX(p, 0, bounds, 44), mapY(p, y, bounds, 44), mapX(p, t, bounds, 44), mapY(p, y, bounds, 44));
      p.line(mapX(p, t, bounds, 44), mapY(p, 0, bounds, 44), mapX(p, t, bounds, 44), mapY(p, y, bounds, 44));
    });
    clearDash(p);

    drawOverlay(p, `Meia-vida: ${halfLife} anos`, [100, 200, 100]);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        Meia-vida
        <input
          type="range"
          min={1000}
          max={10000}
          step={50}
          value={halfLife}
          onChange={(e) => setHalfLife(Number(e.target.value))}
        />
        <span>{halfLife}</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={340} />
    </div>
  );
}

export function ExponentialLogInverse() {
  const [zoom, setZoom] = useState(1);
  const bounds = useMemo<Bounds>(() => ({ xMin: -3 / zoom, xMax: 4 / zoom, yMin: -3 / zoom, yMax: 4 / zoom }), [zoom]);

  const draw = (p: p5) => {
    drawAxes(p, bounds, 42, "Exponencial x Logaritmo", "Curvas inversas refletidas em relacao a y=x");

    p.stroke(...TEXT_SECONDARY);
    p.strokeWeight(1.5);
    withDash(p, [4, 4]);
    p.line(mapX(p, bounds.xMin, bounds, 42), mapY(p, bounds.xMin, bounds, 42), mapX(p, bounds.xMax, bounds, 42), mapY(p, bounds.xMax, bounds, 42));
    clearDash(p);

    p.noFill();
    p.stroke(37, 99, 235);
    p.strokeWeight(2.4);
    p.beginShape();
    for (let x = bounds.xMin; x <= bounds.xMax; x += 0.02) {
      p.vertex(mapX(p, x, bounds, 42), mapY(p, Math.exp(x), bounds, 42));
    }
    p.endShape();

    p.stroke(16, 185, 129);
    p.beginShape();
    for (let x = Math.max(0.02, bounds.xMin); x <= bounds.xMax; x += 0.02) {
      p.vertex(mapX(p, x, bounds, 42), mapY(p, Math.log(x), bounds, 42));
    }
    p.endShape();

    const e = Math.E;
    p.noStroke();
    p.fill(255, 180, 50);
    p.circle(mapX(p, 0, bounds, 42), mapY(p, 1, bounds, 42), 7);
    p.circle(mapX(p, 1, bounds, 42), mapY(p, 0, bounds, 42), 7);
    p.circle(mapX(p, 1, bounds, 42), mapY(p, e, bounds, 42), 7);
    p.circle(mapX(p, e, bounds, 42), mapY(p, 1, bounds, 42), 7);

    drawOverlay(p, "azul: e^x | verde: ln(x) | cinza: y=x", [180, 130, 255]);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        Zoom
        <input
          type="range"
          min={0.8}
          max={2.5}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
        <span>{zoom.toFixed(1)}x</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={340} />
    </div>
  );
}

export function UnitCircleInteractive() {
  const [theta, setTheta] = useState(Math.PI / 4);

  const draw = (p: p5) => {
    drawBoardChrome(p, "Circulo Unitario e Projecoes", "Marcador conecta angulo no circulo com seno e cosseno");
    const leftW = p.width * 0.48;
    const cx = leftW / 2;
    const cy = p.height / 2;
    const r = Math.min(leftW, p.height) * 0.32;

    p.noStroke();
    p.fill(...PANEL_BG);
    p.rect(12, 40, leftW - 16, p.height - 84, 10);
    p.rect(leftW + 8, 40, p.width - leftW - 20, p.height - 84, 10);

    p.stroke(GRID_NEUTRAL[0], GRID_NEUTRAL[1], GRID_NEUTRAL[2], 120);
    for (let i = -2; i <= 2; i++) {
      p.line(cx - r * 1.3, cy + i * (r / 2), cx + r * 1.3, cy + i * (r / 2));
      p.line(cx + i * (r / 2), cy - r * 1.3, cx + i * (r / 2), cy + r * 1.3);
    }

    p.stroke(...AXIS_NEUTRAL);
    p.strokeWeight(1.5);
    p.line(cx - r * 1.3, cy, cx + r * 1.3, cy);
    p.line(cx, cy - r * 1.3, cx, cy + r * 1.3);
    p.noFill();
    p.circle(cx, cy, r * 2);

    const px = cx + r * Math.cos(theta);
    const py = cy - r * Math.sin(theta);
    p.stroke(37, 99, 235);
    p.line(cx, cy, px, py);
    p.noStroke();
    p.fill(37, 99, 235);
    p.circle(px, py, 9);

    p.stroke(255, 180, 50);
    withDash(p, [4, 4]);
    p.line(px, py, px, cy);
    p.stroke(16, 185, 129);
    p.line(px, py, cx, py);
    clearDash(p);

    const gx0 = leftW + 20;
    const gw = p.width - gx0 - 16;
    const gy0 = 30;
    const gh = p.height - 60;
    const gyc = gy0 + gh / 2;

    p.stroke(GRID_NEUTRAL[0], GRID_NEUTRAL[1], GRID_NEUTRAL[2], 120);
    for (let i = 0; i <= 4; i++) {
      p.line(gx0 + (gw / 4) * i, gy0, gx0 + (gw / 4) * i, gy0 + gh);
    }
    p.stroke(...AXIS_NEUTRAL);
    p.line(gx0, gyc, gx0 + gw, gyc);

    p.noFill();
    p.stroke(255, 180, 50);
    p.beginShape();
    for (let t = 0; t <= Math.PI * 2; t += 0.03) {
      p.vertex(gx0 + (t / (Math.PI * 2)) * gw, gyc - Math.sin(t) * (gh * 0.38));
    }
    p.endShape();

    p.stroke(16, 185, 129);
    p.beginShape();
    for (let t = 0; t <= Math.PI * 2; t += 0.03) {
      p.vertex(gx0 + (t / (Math.PI * 2)) * gw, gyc - Math.cos(t) * (gh * 0.38));
    }
    p.endShape();

    p.stroke(245, 158, 11);
    withDash(p, [5, 5]);
    const markerX = gx0 + (theta / (Math.PI * 2)) * gw;
    p.line(markerX, gy0, markerX, gy0 + gh);
    clearDash(p);

    p.noStroke();
    drawOverlay(
      p,
      `theta=${theta.toFixed(2)} | sin=${Math.sin(theta).toFixed(3)} | cos=${Math.cos(theta).toFixed(3)}`,
      [0, 150, 255],
    );
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        Angulo
        <input
          type="range"
          min={0}
          max={Math.PI * 2}
          step={0.02}
          value={theta}
          onChange={(e) => setTheta(Number(e.target.value))}
        />
        <span>{theta.toFixed(2)} rad</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={340} />
    </div>
  );
}

export function SinCosTanComparison() {
  const [cycles, setCycles] = useState(2);
  const bounds = useMemo<Bounds>(() => ({ xMin: 0, xMax: cycles * Math.PI * 2, yMin: -3.2, yMax: 3.2 }), [cycles]);

  const draw = (p: p5) => {
    drawAxes(p, bounds, 42, "Seno, Cosseno e Tangente", "Assintotas da tangente aparecem em destaque");

    p.noFill();
    p.stroke(37, 99, 235);
    p.strokeWeight(2.4);
    p.beginShape();
    for (let x = bounds.xMin; x <= bounds.xMax; x += 0.02) {
      p.vertex(mapX(p, x, bounds, 42), mapY(p, Math.sin(x), bounds, 42));
    }
    p.endShape();

    p.stroke(16, 185, 129);
    p.beginShape();
    for (let x = bounds.xMin; x <= bounds.xMax; x += 0.02) {
      p.vertex(mapX(p, x, bounds, 42), mapY(p, Math.cos(x), bounds, 42));
    }
    p.endShape();

    p.stroke(255, 180, 50);
    for (let k = 0; k < cycles * 2; k++) {
      const a = k * Math.PI + 0.04;
      const c = (k + 1) * Math.PI - 0.04;
      p.beginShape();
      for (let x = a; x <= c; x += 0.015) {
        const y = Math.tan(x);
        if (Math.abs(y) < 3.1) {
          p.vertex(mapX(p, x, bounds, 42), mapY(p, y, bounds, 42));
        }
      }
      p.endShape();

      const asym = (k + 0.5) * Math.PI;
      p.stroke(180, 130, 255, 120);
      withDash(p, [4, 4]);
      p.line(mapX(p, asym, bounds, 42), 42, mapX(p, asym, bounds, 42), p.height - 42);
      clearDash(p);
      p.stroke(255, 180, 50);
    }

    drawOverlay(p, "azul: sin | verde: cos | laranja: tan", [180, 130, 255]);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        Ciclos
        <input
          type="range"
          min={1}
          max={4}
          step={1}
          value={cycles}
          onChange={(e) => setCycles(Number(e.target.value))}
        />
        <span>{cycles}</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={340} />
    </div>
  );
}

export function InverseTrigonometric() {
  const [x, setX] = useState(0.5);
  const [mode, setMode] = useState<"arcsin" | "arccos" | "arctan">("arcsin");

  const draw = (p: p5) => {
    drawBoardChrome(p, "Funcoes Trigonometricas Inversas", "Selecione a curva e explore o valor de x");
    const cardW = p.width / 3;

    const drawCard = (i: number, label: string, fn: "arcsin" | "arccos" | "arctan") => {
      const x0 = i * cardW + 18;
      const x1 = (i + 1) * cardW - 12;
      const y0 = 32;
      const y1 = p.height - 28;
      const b: Bounds = fn === "arctan" ? { xMin: -3, xMax: 3, yMin: -2, yMax: 2 } : { xMin: -1.2, xMax: 1.2, yMin: -2, yMax: 3.5 };

      p.fill(...PANEL_BG);
      p.stroke(PANEL_STROKE[0], PANEL_STROKE[1], PANEL_STROKE[2], 100);
      p.rect(x0, y0, x1 - x0, y1 - y0, 8);

      p.stroke(...AXIS_NEUTRAL);
      p.line(p.map(0, b.xMin, b.xMax, x0 + 10, x1 - 10), y0 + 10, p.map(0, b.xMin, b.xMax, x0 + 10, x1 - 10), y1 - 10);
      p.line(x0 + 10, p.map(0, b.yMin, b.yMax, y1 - 10, y0 + 10), x1 - 10, p.map(0, b.yMin, b.yMax, y1 - 10, y0 + 10));

      p.noFill();
      p.stroke(fn === mode ? 37 : 148, fn === mode ? 99 : 163, fn === mode ? 235 : 184);
      p.strokeWeight(fn === mode ? 2.4 : 1.8);
      p.beginShape();
      for (let t = b.xMin; t <= b.xMax; t += 0.02) {
        let y = 0;
        if (fn === "arcsin" && t >= -1 && t <= 1) y = Math.asin(t);
        if (fn === "arccos" && t >= -1 && t <= 1) y = Math.acos(t);
        if (fn === "arctan") y = Math.atan(t);
        if (fn === "arctan" || (t >= -1 && t <= 1)) {
          p.vertex(p.map(t, b.xMin, b.xMax, x0 + 10, x1 - 10), p.map(y, b.yMin, b.yMax, y1 - 10, y0 + 10));
        }
      }
      p.endShape();

      if (fn === mode) {
        const inDomain = fn === "arctan" || (x >= -1 && x <= 1);
        if (inDomain) {
          const y = fn === "arcsin" ? Math.asin(x) : fn === "arccos" ? Math.acos(x) : Math.atan(x);
          p.fill(245, 158, 11);
          p.noStroke();
          p.circle(p.map(x, b.xMin, b.xMax, x0 + 10, x1 - 10), p.map(y, b.yMin, b.yMax, y1 - 10, y0 + 10), 8);
        }
      }

      p.noStroke();
      p.fill(...TEXT_SECONDARY);
      p.textSize(12);
      p.text(label, x0 + 10, 26);
    };

    drawCard(0, "arcsin(x)", "arcsin");
    drawCard(1, "arccos(x)", "arccos");
    drawCard(2, "arctan(x)", "arctan");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button className={`rounded px-2 py-1 ${mode === "arcsin" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setMode("arcsin")}>arcsin</button>
        <button className={`rounded px-2 py-1 ${mode === "arccos" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setMode("arccos")}>arccos</button>
        <button className={`rounded px-2 py-1 ${mode === "arctan" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setMode("arctan")}>arctan</button>
        <input
          type="range"
          min={mode === "arctan" ? -3 : -1}
          max={mode === "arctan" ? 3 : 1}
          step={0.02}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
        />
        <span>x = {x.toFixed(2)}</span>
      </div>
      <P5Sketch setup={() => {}} draw={draw} height={320} />
    </div>
  );
}

export function DampedPendulum() {
  const [tau, setTau] = useState(4);

  const bounds: Bounds = { xMin: 0, xMax: 20, yMin: -1.2, yMax: 1.2 };
  const draw = (p: p5) => {
    drawAxes(p, bounds, 42, "Pendulo Amortecido", "Envelope exponencial limita a oscilacao");

    p.stroke(...TEXT_SECONDARY);
    withDash(p, [4, 4]);
    p.noFill();
    p.beginShape();
    for (let t = 0; t <= 20; t += 0.03) p.vertex(mapX(p, t, bounds, 42), mapY(p, Math.exp(-t / tau), bounds, 42));
    p.endShape();
    p.beginShape();
    for (let t = 0; t <= 20; t += 0.03) p.vertex(mapX(p, t, bounds, 42), mapY(p, -Math.exp(-t / tau), bounds, 42));
    p.endShape();
    clearDash(p);

    p.stroke(37, 99, 235);
    p.strokeWeight(2.5);
    p.noFill();
    p.beginShape();
    for (let t = 0; t <= 20; t += 0.015) {
      const y = Math.exp(-t / tau) * Math.cos(3.2 * t);
      p.vertex(mapX(p, t, bounds, 42), mapY(p, y, bounds, 42));
    }
    p.endShape();

    drawOverlay(p, `tau = ${tau.toFixed(1)}`, [100, 200, 100]);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        Tau
        <input type="range" min={1.5} max={10} step={0.1} value={tau} onChange={(e) => setTau(Number(e.target.value))} />
        <span>{tau.toFixed(1)}</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={330} />
    </div>
  );
}

export function FunctionTransformations() {
  const [h, setH] = useState(0);
  const [k, setK] = useState(0);
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [flipY, setFlipY] = useState(false);

  const bounds: Bounds = { xMin: -8, xMax: 8, yMin: -6, yMax: 10 };
  const draw = (p: p5) => {
    drawAxes(p, bounds, 42, "Transformacoes de Funcoes", "Cinza: base | Azul: funcao transformada");

    p.noFill();
    p.stroke(...TEXT_SECONDARY);
    p.strokeWeight(2);
    p.beginShape();
    for (let x = -8; x <= 8; x += 0.03) {
      p.vertex(mapX(p, x, bounds, 42), mapY(p, (x * x) / 4, bounds, 42));
    }
    p.endShape();

    p.stroke(37, 99, 235);
    p.strokeWeight(2.6);
    p.beginShape();
    for (let x = -8; x <= 8; x += 0.03) {
      const inner = b * (x - h);
      const base = (inner * inner) / 4;
      const y = (flipY ? -1 : 1) * a * base + k;
      p.vertex(mapX(p, x, bounds, 42), mapY(p, y, bounds, 42));
    }
    p.endShape();

    drawOverlay(p, `g(x) = ${flipY ? "-" : ""}${a.toFixed(1)} f(${b.toFixed(1)}(x-${h.toFixed(1)})) + ${k.toFixed(1)}`, [180, 130, 255]);
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="grid gap-2 md:grid-cols-2">
        <label className="flex items-center gap-2">h <input type="range" min={-4} max={4} step={0.1} value={h} onChange={(e) => setH(Number(e.target.value))} /><span>{h.toFixed(1)}</span></label>
        <label className="flex items-center gap-2">k <input type="range" min={-4} max={4} step={0.1} value={k} onChange={(e) => setK(Number(e.target.value))} /><span>{k.toFixed(1)}</span></label>
        <label className="flex items-center gap-2">a <input type="range" min={0.2} max={2.5} step={0.1} value={a} onChange={(e) => setA(Number(e.target.value))} /><span>{a.toFixed(1)}</span></label>
        <label className="flex items-center gap-2">b <input type="range" min={0.3} max={2.5} step={0.1} value={b} onChange={(e) => setB(Number(e.target.value))} /><span>{b.toFixed(1)}</span></label>
      </div>
      <label className="inline-flex items-center gap-2"><input type="checkbox" checked={flipY} onChange={(e) => setFlipY(e.target.checked)} />Reflexao vertical</label>
      <P5Sketch setup={() => {}} draw={draw} height={360} />
    </div>
  );
}

export function EvenOddFunctions() {
  const [mode, setMode] = useState<"par" | "impar" | "nenhuma">("par");
  const bounds: Bounds = { xMin: -6, xMax: 6, yMin: -6, yMax: 10 };

  const draw = (p: p5) => {
    drawAxes(p, bounds, 42, "Funcoes Pares e Impares", "Observe a simetria conforme o modo selecionado");

    p.noFill();
    p.stroke(37, 99, 235);
    p.strokeWeight(2.4);
    p.beginShape();
    for (let x = -6; x <= 6; x += 0.03) {
      let y = 0;
      if (mode === "par") y = 0.35 * x * x;
      if (mode === "impar") y = 0.08 * x * x * x;
      if (mode === "nenhuma") y = 0.22 * x * x + 0.6 * x;
      p.vertex(mapX(p, x, bounds, 42), mapY(p, y, bounds, 42));
    }
    p.endShape();

    p.stroke(180, 130, 255, 130);
    withDash(p, [4, 4]);
    if (mode === "par") {
      p.line(mapX(p, 0, bounds, 42), 42, mapX(p, 0, bounds, 42), p.height - 42);
    }
    if (mode === "impar") {
      p.line(mapX(p, -6, bounds, 42), mapY(p, -6, bounds, 42), mapX(p, 6, bounds, 42), mapY(p, 6, bounds, 42));
    }
    clearDash(p);

    drawOverlay(p, mode === "par" ? "f(-x)=f(x)" : mode === "impar" ? "f(-x)=-f(x)" : "sem simetria", [100, 200, 100]);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 text-sm">
        <button onClick={() => setMode("par")} className={`rounded px-2 py-1 ${mode === "par" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Par</button>
        <button onClick={() => setMode("impar")} className={`rounded px-2 py-1 ${mode === "impar" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Impar</button>
        <button onClick={() => setMode("nenhuma")} className={`rounded px-2 py-1 ${mode === "nenhuma" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Nenhuma</button>
      </div>
      <P5Sketch setup={() => {}} draw={draw} height={330} />
    </div>
  );
}

export function DampedOscillationAnalysis() {
  const [lambda, setLambda] = useState(0.25);
  const [omega, setOmega] = useState(3);
  const bounds: Bounds = { xMin: 0, xMax: 18, yMin: -1.3, yMax: 1.3 };

  const draw = (p: p5) => {
    drawAxes(p, bounds, 42, "Analise de Oscilacao Amortecida", "Corte em 5% mostra o tempo de acomodacao");

    p.stroke(...TEXT_SECONDARY);
    withDash(p, [4, 4]);
    p.noFill();
    p.beginShape();
    for (let t = 0; t <= 18; t += 0.02) p.vertex(mapX(p, t, bounds, 42), mapY(p, Math.exp(-lambda * t), bounds, 42));
    p.endShape();
    p.beginShape();
    for (let t = 0; t <= 18; t += 0.02) p.vertex(mapX(p, t, bounds, 42), mapY(p, -Math.exp(-lambda * t), bounds, 42));
    p.endShape();
    clearDash(p);

    p.stroke(37, 99, 235);
    p.strokeWeight(2.5);
    p.beginShape();
    for (let t = 0; t <= 18; t += 0.01) {
      const y = Math.exp(-lambda * t) * Math.cos(omega * t);
      p.vertex(mapX(p, t, bounds, 42), mapY(p, y, bounds, 42));
    }
    p.endShape();

    const tCut = -Math.log(0.05) / lambda;
    if (tCut < 18) {
      p.stroke(255, 180, 50);
      withDash(p, [5, 5]);
      p.line(mapX(p, tCut, bounds, 42), 42, mapX(p, tCut, bounds, 42), p.height - 42);
      clearDash(p);
    }

    drawOverlay(
      p,
      `lambda=${lambda.toFixed(2)} | omega=${omega.toFixed(2)} | periodo=${(2 * Math.PI / omega).toFixed(2)}s`,
      [180, 130, 255],
    );
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        lambda
        <input type="range" min={0.05} max={0.6} step={0.01} value={lambda} onChange={(e) => setLambda(Number(e.target.value))} />
        <span>{lambda.toFixed(2)}</span>
      </label>
      <label className="flex items-center gap-3 text-sm text-gray-700">
        omega
        <input type="range" min={0.8} max={5} step={0.05} value={omega} onChange={(e) => setOmega(Number(e.target.value))} />
        <span>{omega.toFixed(2)}</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={340} />
    </div>
  );
}

export function IntuitiveLimit() {
  const [targetX, setTargetX] = useState(1.5);
  const [distance, setDistance] = useState(1.2);
  const bounds: Bounds = { xMin: -1, xMax: 4, yMin: -1, yMax: 10 };

  const draw = (p: p5) => {
    drawAxes(p, bounds, 42, "Limite Intuitivo", "Pontos em x=a-d e x=a+d se aproximam do mesmo valor");

    p.noFill();
    p.stroke(37, 99, 235);
    p.strokeWeight(2.5);
    p.beginShape();
    for (let x = bounds.xMin; x <= bounds.xMax; x += 0.02) {
      p.vertex(mapX(p, x, bounds, 42), mapY(p, x * x, bounds, 42));
    }
    p.endShape();

    const leftX = targetX - distance;
    const rightX = targetX + distance;
    const leftY = leftX * leftX;
    const rightY = rightX * rightX;
    const limitY = targetX * targetX;

    p.stroke(180, 130, 255, 140);
    withDash(p, [5, 5]);
    p.line(mapX(p, targetX, bounds, 42), 42, mapX(p, targetX, bounds, 42), p.height - 42);
    p.line(42, mapY(p, limitY, bounds, 42), p.width - 42, mapY(p, limitY, bounds, 42));
    clearDash(p);

    p.noStroke();
    p.fill(16, 185, 129);
    p.circle(mapX(p, leftX, bounds, 42), mapY(p, leftY, bounds, 42), 8);
    p.fill(245, 158, 11);
    p.circle(mapX(p, rightX, bounds, 42), mapY(p, rightY, bounds, 42), 8);
    p.fill(180, 130, 255);
    p.circle(mapX(p, targetX, bounds, 42), mapY(p, limitY, bounds, 42), 9);

    drawOverlay(
      p,
      `a=${targetX.toFixed(2)} | f(a-d)=${leftY.toFixed(2)} | f(a+d)=${rightY.toFixed(2)} | L=${limitY.toFixed(2)}`,
      [100, 200, 100],
    );
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        a
        <input type="range" min={-0.5} max={2.6} step={0.05} value={targetX} onChange={(e) => setTargetX(Number(e.target.value))} />
        <span>{targetX.toFixed(2)}</span>
      </label>
      <label className="flex items-center gap-3 text-sm text-gray-700">
        distancia d
        <input type="range" min={0.1} max={1.8} step={0.05} value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
        <span>{distance.toFixed(2)}</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={340} />
    </div>
  );
}

export function OscillatoryLimit() {
  const [windowSize, setWindowSize] = useState(0.9);
  const bounds: Bounds = { xMin: -1.4, xMax: 1.4, yMin: -1.3, yMax: 1.3 };

  const draw = (p: p5) => {
    drawAxes(p, bounds, 42, "Limite Oscilatorio", "f(x)=sin(1/x) oscila sem convergir quando x->0");

    p.noFill();
    p.stroke(37, 99, 235);
    p.strokeWeight(2);
    p.beginShape();
    for (let x = bounds.xMin; x <= bounds.xMax; x += 0.002) {
      if (Math.abs(x) < 0.02) continue;
      p.vertex(mapX(p, x, bounds, 42), mapY(p, Math.sin(1 / x), bounds, 42));
    }
    p.endShape();

    p.stroke(180, 130, 255, 130);
    withDash(p, [4, 4]);
    p.line(mapX(p, -windowSize, bounds, 42), 42, mapX(p, -windowSize, bounds, 42), p.height - 42);
    p.line(mapX(p, windowSize, bounds, 42), 42, mapX(p, windowSize, bounds, 42), p.height - 42);
    clearDash(p);

    drawOverlay(p, `janela em torno de 0: [-${windowSize.toFixed(2)}, ${windowSize.toFixed(2)}]`, [255, 180, 50]);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        Janela
        <input
          type="range"
          min={0.1}
          max={1.2}
          step={0.02}
          value={windowSize}
          onChange={(e) => setWindowSize(Number(e.target.value))}
        />
        <span>{windowSize.toFixed(2)}</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={330} />
    </div>
  );
}

export function EpsilonDeltaVisualization() {
  const [epsilon, setEpsilon] = useState(0.6);
  const [delta, setDelta] = useState(0.7);
  const a = 2;
  const l = 4;
  const bounds: Bounds = { xMin: 0.2, xMax: 3.8, yMin: 0.2, yMax: 8.2 };

  const draw = (p: p5) => {
    drawAxes(p, bounds, 44, "Epsilon-Delta", "f(x)=x^2 em torno de a=2 e L=4");

    p.noStroke();
    p.fill(16, 185, 129, 28);
    const yTop = mapY(p, l + epsilon, bounds, 44);
    const yBottom = mapY(p, l - epsilon, bounds, 44);
    p.rect(44, yTop, p.width - 88, yBottom - yTop);

    p.fill(245, 158, 11, 28);
    const xLeft = mapX(p, a - delta, bounds, 44);
    const xRight = mapX(p, a + delta, bounds, 44);
    p.rect(xLeft, 44, xRight - xLeft, p.height - 88);

    p.noFill();
    p.stroke(37, 99, 235);
    p.strokeWeight(2.4);
    p.beginShape();
    for (let x = bounds.xMin; x <= bounds.xMax; x += 0.015) {
      p.vertex(mapX(p, x, bounds, 44), mapY(p, x * x, bounds, 44));
    }
    p.endShape();

    p.stroke(180, 130, 255, 140);
    withDash(p, [5, 5]);
    p.line(mapX(p, a, bounds, 44), 44, mapX(p, a, bounds, 44), p.height - 44);
    p.line(44, mapY(p, l, bounds, 44), p.width - 44, mapY(p, l, bounds, 44));
    clearDash(p);

    drawOverlay(p, `epsilon=${epsilon.toFixed(2)} | delta=${delta.toFixed(2)} | a=${a} | L=${l}`, [100, 200, 100]);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        epsilon
        <input type="range" min={0.15} max={1.6} step={0.05} value={epsilon} onChange={(e) => setEpsilon(Number(e.target.value))} />
        <span>{epsilon.toFixed(2)}</span>
      </label>
      <label className="flex items-center gap-3 text-sm text-gray-700">
        delta
        <input type="range" min={0.1} max={1.4} step={0.05} value={delta} onChange={(e) => setDelta(Number(e.target.value))} />
        <span>{delta.toFixed(2)}</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={340} />
    </div>
  );
}

export function SqueezeTheoremVisualization() {
  const [radius, setRadius] = useState(1.6);
  const bounds: Bounds = { xMin: -2.4, xMax: 2.4, yMin: -2.4, yMax: 2.4 };

  const draw = (p: p5) => {
    drawAxes(p, bounds, 42, "Teorema do Sanduiche", "-|x| <= x sin(1/x) <= |x| perto de x=0");

    p.noFill();
    p.stroke(16, 185, 129);
    p.strokeWeight(2);
    p.beginShape();
    for (let x = bounds.xMin; x <= bounds.xMax; x += 0.02) {
      p.vertex(mapX(p, x, bounds, 42), mapY(p, Math.abs(x), bounds, 42));
    }
    p.endShape();
    p.beginShape();
    for (let x = bounds.xMin; x <= bounds.xMax; x += 0.02) {
      p.vertex(mapX(p, x, bounds, 42), mapY(p, -Math.abs(x), bounds, 42));
    }
    p.endShape();

    p.stroke(37, 99, 235);
    p.strokeWeight(2.3);
    p.beginShape();
    for (let x = bounds.xMin; x <= bounds.xMax; x += 0.003) {
      const y = Math.abs(x) < 0.015 ? 0 : x * Math.sin(1 / x);
      p.vertex(mapX(p, x, bounds, 42), mapY(p, y, bounds, 42));
    }
    p.endShape();

    p.stroke(180, 130, 255, 130);
    withDash(p, [4, 4]);
    p.line(mapX(p, -radius, bounds, 42), 42, mapX(p, -radius, bounds, 42), p.height - 42);
    p.line(mapX(p, radius, bounds, 42), 42, mapX(p, radius, bounds, 42), p.height - 42);
    clearDash(p);

    drawOverlay(p, `faixa de analise: |x| < ${radius.toFixed(2)}`, [255, 180, 50]);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        Faixa
        <input type="range" min={0.3} max={2.2} step={0.05} value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
        <span>{radius.toFixed(2)}</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={330} />
    </div>
  );
}

export function GrowthRatesVisualization() {
  const [xMax, setXMax] = useState(8);
  const bounds = useMemo<Bounds>(() => ({ xMin: 0.2, xMax, yMin: -2, yMax: 17 }), [xMax]);

  const draw = (p: p5) => {
    drawAxes(p, bounds, 44, "Taxas de Crescimento", "Comparacao: ln(x), x, x^2/4 e 2^(x/2)");

    const plot = (fn: (x: number) => number, color: [number, number, number]) => {
      p.noFill();
      p.stroke(...color);
      p.strokeWeight(2.2);
      p.beginShape();
      for (let x = bounds.xMin; x <= bounds.xMax; x += 0.02) {
        p.vertex(mapX(p, x, bounds, 44), mapY(p, fn(x), bounds, 44));
      }
      p.endShape();
    };

    plot((x) => Math.log(x), [16, 185, 129]);
    plot((x) => x, [37, 99, 235]);
    plot((x) => (x * x) / 4, [245, 158, 11]);
    plot((x) => Math.pow(2, x / 2), [180, 130, 255]);

    drawOverlay(p, "verde: ln(x) | azul: x | laranja: x^2/4 | roxo: 2^(x/2)", [215, 225, 240]);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        Alcance de x
        <input type="range" min={5} max={12} step={0.5} value={xMax} onChange={(e) => setXMax(Number(e.target.value))} />
        <span>{xMax.toFixed(1)}</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={340} />
    </div>
  );
}

export const __calculo1P5Module = true;
