"use client";

import { useMemo, useState } from "react";
import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

type Bounds = { xMin: number; xMax: number; yMin: number; yMax: number };

function mapX(p: p5, x: number, b: Bounds, pad: number) {
  return p.map(x, b.xMin, b.xMax, pad, p.width - pad);
}

function mapY(p: p5, y: number, b: Bounds, pad: number) {
  return p.map(y, b.yMin, b.yMax, p.height - pad, pad);
}

function drawAxes(p: p5, b: Bounds, title: string, pad = 32) {
  p.background(255);
  p.fill("#111827");
  p.noStroke();
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(13);
  p.text(title, p.width / 2, 8);

  p.stroke("#E5E7EB");
  p.strokeWeight(1);
  for (let x = Math.ceil(b.xMin); x <= b.xMax; x += 1) {
    const sx = mapX(p, x, b, pad);
    p.line(sx, pad, sx, p.height - pad);
  }
  for (let y = Math.ceil(b.yMin); y <= b.yMax; y += 1) {
    const sy = mapY(p, y, b, pad);
    p.line(pad, sy, p.width - pad, sy);
  }

  p.stroke("#111827");
  p.strokeWeight(1.4);
  if (b.yMin <= 0 && b.yMax >= 0) p.line(pad, mapY(p, 0, b, pad), p.width - pad, mapY(p, 0, b, pad));
  if (b.xMin <= 0 && b.xMax >= 0) p.line(mapX(p, 0, b, pad), pad, mapX(p, 0, b, pad), p.height - pad);
}

export function DiscontinuityTypesComparison() {
  const draw = (p: p5) => {
    p.background(255);
    const panelW = 300;
    const panelH = 240;
    const top = 58;
    const lefts = [20, 350, 680];

    const drawPanel = (idx: number, label: string) => {
      const x0 = lefts[idx];
      p.fill("#111827");
      p.noStroke();
      p.textAlign(p.CENTER, p.BOTTOM);
      p.textSize(13);
      p.text(label, x0 + panelW / 2, top - 10);

      p.stroke("#E5E7EB");
      for (let i = 0; i <= 6; i++) p.line(x0 + (i * panelW) / 6, top, x0 + (i * panelW) / 6, top + panelH);
      for (let j = 0; j <= 6; j++) p.line(x0, top + (j * panelH) / 6, x0 + panelW, top + (j * panelH) / 6);

      const bx: Bounds = { xMin: -2, xMax: 2, yMin: -3, yMax: 3 };
      p.stroke("#111827");
      p.line(mapX(p, 0, bx, x0), top, mapX(p, 0, bx, x0), top + panelH);
      p.line(x0, mapY(p, 0, bx, top), x0 + panelW, mapY(p, 0, bx, top));
    };

    drawPanel(0, "Removivel");
    drawPanel(1, "Salto");
    drawPanel(2, "Infinita");

    const b0: Bounds = { xMin: -2, xMax: 2, yMin: -3, yMax: 3 };

    p.noFill();
    p.stroke("#3B82F6");
    p.strokeWeight(2.2);
    p.beginShape();
    for (let x = -2; x <= 2; x += 0.03) {
      if (Math.abs(x - 1) < 0.03) continue;
      p.vertex(mapX(p, x, b0, lefts[0]), mapY(p, x + 1, b0, top));
    }
    p.endShape();
    p.fill(255);
    p.stroke("#111827");
    p.circle(mapX(p, 1, b0, lefts[0]), mapY(p, 2, b0, top), 10);

    const yLow = mapY(p, 1, b0, top);
    const yHigh = mapY(p, 2, b0, top);
    const xMid = mapX(p, 0, b0, lefts[1]);
    p.stroke("#3B82F6");
    p.line(lefts[1], yLow, xMid, yLow);
    p.line(xMid, yHigh, lefts[1] + panelW, yHigh);
    p.stroke("#EF4444");
    p.line(xMid, yLow, xMid, yHigh);
    p.fill("#3B82F6");
    p.noStroke();
    p.circle(xMid, yHigh, 9);
    p.fill(255);
    p.stroke("#EF4444");
    p.circle(xMid, yLow, 9);

    p.stroke("#9CA3AF");
    (p.drawingContext as CanvasRenderingContext2D).setLineDash([6, 6]);
    p.line(mapX(p, 0, b0, lefts[2]), top, mapX(p, 0, b0, lefts[2]), top + panelH);
    (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);

    p.noFill();
    p.stroke("#3B82F6");
    p.beginShape();
    for (let x = -2; x <= -0.1; x += 0.02) p.vertex(mapX(p, x, b0, lefts[2]), mapY(p, 1 / x, b0, top));
    p.endShape();
    p.beginShape();
    for (let x = 0.1; x <= 2; x += 0.02) p.vertex(mapX(p, x, b0, lefts[2]), mapY(p, 1 / x, b0, top));
    p.endShape();
  };

  return <P5Sketch setup={() => {}} draw={draw} width={1000} height={350} />;
}

export function DiscontinuityExplorer() {
  const [mode, setMode] = useState<"removivel" | "salto" | "infinita">("removivel");

  const info = useMemo(() => {
    if (mode === "removivel") return { l1: "2.00", l2: "2.00", f: "undefined", color: "bg-blue-500" };
    if (mode === "salto") return { l1: "-1.00", l2: "1.00", f: "1.00", color: "bg-orange-500" };
    return { l1: "-infinito", l2: "+infinito", f: "undefined", color: "bg-red-500" };
  }, [mode]);

  const draw = (p: p5) => {
    const b: Bounds = { xMin: -3, xMax: 3, yMin: -5, yMax: 5 };
    drawAxes(p, b, "Explorador de Descontinuidades", 34);

    p.noFill();
    p.stroke("#3B82F6");
    p.strokeWeight(2.2);

    if (mode === "removivel") {
      p.beginShape();
      for (let x = -3; x <= 3; x += 0.03) {
        if (Math.abs(x - 1) < 0.03) continue;
        p.vertex(mapX(p, x, b, 34), mapY(p, x + 1, b, 34));
      }
      p.endShape();
      p.fill(255);
      p.stroke("#111827");
      p.circle(mapX(p, 1, b, 34), mapY(p, 2, b, 34), 10);
    }

    if (mode === "salto") {
      const xm = mapX(p, 1, b, 34);
      p.stroke("#3B82F6");
      p.line(34, mapY(p, -1, b, 34), xm, mapY(p, -1, b, 34));
      p.line(xm, mapY(p, 1, b, 34), p.width - 34, mapY(p, 1, b, 34));
      p.stroke("#EF4444");
      p.line(xm, mapY(p, -1, b, 34), xm, mapY(p, 1, b, 34));
      p.fill("#3B82F6");
      p.noStroke();
      p.circle(xm, mapY(p, 1, b, 34), 9);
      p.fill(255);
      p.stroke("#EF4444");
      p.circle(xm, mapY(p, -1, b, 34), 9);
    }

    if (mode === "infinita") {
      p.stroke("#9CA3AF");
      (p.drawingContext as CanvasRenderingContext2D).setLineDash([6, 6]);
      p.line(mapX(p, 1, b, 34), 34, mapX(p, 1, b, 34), p.height - 34);
      (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);

      p.noFill();
      p.stroke("#3B82F6");
      p.beginShape();
      for (let x = -3; x <= 0.9; x += 0.02) p.vertex(mapX(p, x, b, 34), mapY(p, 1 / (x - 1), b, 34));
      p.endShape();
      p.beginShape();
      for (let x = 1.1; x <= 3; x += 0.02) p.vertex(mapX(p, x, b, 34), mapY(p, 1 / (x - 1), b, 34));
      p.endShape();
    }
  };

  return (
    <div className="my-8 flex overflow-hidden rounded border border-gray-200">
      <div className="w-[550px] bg-white">
        <P5Sketch setup={() => {}} draw={draw} width={550} height={450} />
      </div>
      <div className="w-[350px] space-y-4 bg-gray-50 p-5">
        <p className="text-sm font-semibold text-gray-800">Escolha um tipo de descontinuidade</p>
        <label className="block rounded border bg-white p-3 text-xs text-gray-700">
          <input type="radio" checked={mode === "removivel"} onChange={() => setMode("removivel")} /> Removivel
        </label>
        <label className="block rounded border bg-white p-3 text-xs text-gray-700">
          <input type="radio" checked={mode === "salto"} onChange={() => setMode("salto")} /> Salto
        </label>
        <label className="block rounded border bg-white p-3 text-xs text-gray-700">
          <input type="radio" checked={mode === "infinita"} onChange={() => setMode("infinita")} /> Infinita
        </label>

        <div className="rounded border bg-gray-100 p-3 font-mono text-sm text-sky-700">
          <div>Limite (x→1-): {info.l1}</div>
          <div>Limite (x→1+): {info.l2}</div>
          <div>f(1): {info.f}</div>
          <div className="mt-2 flex items-center text-xs text-gray-700">
            Tipo:
            <span className={`ml-2 rounded px-2 py-0.5 text-white ${info.color}`}>{mode}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompositionPipeline() {
  const [x, setX] = useState(0.5);
  const gx = x * x;
  const fgx = Math.sin(gx);

  const draw = (p: p5) => {
    p.background(255);
    p.fill("#111827");
    p.noStroke();
    p.textSize(12);
    p.text("Pipeline: x -> g(x)=x^2 -> f(u)=sin(u)", 12, 18);

    const topB: Bounds = { xMin: -2, xMax: 2, yMin: 0, yMax: 4 };
    const botB: Bounds = { xMin: 0, xMax: 4, yMin: -1.2, yMax: 1.2 };

    p.push();
    p.translate(0, 20);
    p.stroke("#E5E7EB");
    p.rect(24, 16, 380, 130);
    p.noFill();
    p.stroke("#10B981");
    p.beginShape();
    for (let v = -2; v <= 2; v += 0.03) p.vertex(mapX(p, v, topB, 40), mapY(p, v * v, topB, 36));
    p.endShape();
    p.fill("#10B981");
    p.noStroke();
    p.circle(mapX(p, x, topB, 40), mapY(p, gx, topB, 36), 10);
    p.pop();

    p.stroke("#EF4444");
    p.strokeWeight(2);
    p.line(214, 160, 214, 195);
    p.fill("#EF4444");
    p.noStroke();
    p.triangle(208, 190, 220, 190, 214, 199);

    p.push();
    p.translate(0, 210);
    p.stroke("#E5E7EB");
    p.rect(24, 16, 380, 130);
    p.noFill();
    p.stroke("#3B82F6");
    p.beginShape();
    for (let u = 0; u <= 4; u += 0.03) p.vertex(mapX(p, u, botB, 40), mapY(p, Math.sin(u), botB, 36));
    p.endShape();
    p.fill("#3B82F6");
    p.noStroke();
    p.circle(mapX(p, gx, botB, 40), mapY(p, fgx, botB, 36), 10);
    p.pop();
  };

  return (
    <div className="my-8 flex overflow-hidden rounded border border-gray-200">
      <div className="w-[760px] bg-white">
        <P5Sketch setup={() => {}} draw={draw} width={760} height={400} />
      </div>
      <div className="w-[240px] bg-gray-50 p-4">
        <label className="mb-2 block font-mono text-xs text-gray-800">x = {x.toFixed(2)}</label>
        <input className="w-full" type="range" min={-2} max={2} step={0.01} value={x} onChange={(e) => setX(Number(e.target.value))} />
        <div className="mt-4 space-y-1 rounded border bg-white p-3 font-mono text-sm">
          <div className="text-emerald-600">g(x) = {gx.toFixed(2)}</div>
          <div className="text-blue-600">f(g(x)) = {fgx.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export function PolynomialGalaxy() {
  const draw = (p: p5) => {
    p.background(255);
    const plots = [
      { t: "Grau 0", f: (x: number) => 1.5, yr: [-2, 3] as [number, number] },
      { t: "Grau 1", f: (x: number) => 0.9 * x, yr: [-3, 3] as [number, number] },
      { t: "Grau 2", f: (x: number) => x * x - 1.2, yr: [-2, 4] as [number, number] },
      { t: "Grau 3", f: (x: number) => (x * x * x) / 2 - x, yr: [-3, 3] as [number, number] },
      { t: "Grau 4", f: (x: number) => (x ** 4) / 3 - x * x, yr: [-2, 3] as [number, number] },
    ];

    plots.forEach((plot, i) => {
      const x0 = 20 + i * 215;
      const w = 200;
      const h = 230;
      const b: Bounds = { xMin: -2, xMax: 2, yMin: plot.yr[0], yMax: plot.yr[1] };

      p.fill("#111827");
      p.noStroke();
      p.textAlign(p.CENTER, p.BOTTOM);
      p.textSize(12);
      p.text(plot.t, x0 + w / 2, 28);

      p.stroke("#E5E7EB");
      p.rect(x0, 36, w, h);
      p.noFill();
      p.stroke("#3B82F6");
      p.beginShape();
      for (let x = -2; x <= 2; x += 0.02) {
        p.vertex(p.map(x, -2, 2, x0 + 10, x0 + w - 10), p.map(plot.f(x), b.yMin, b.yMax, 36 + h - 10, 36 + 10));
      }
      p.endShape();
    });

    p.noStroke();
    p.fill("#D1FAE5");
    p.rect(20, 390, 1060, 40, 8);
    p.fill("#065F46");
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.text("Todos os polinomios sao continuos em R", 550, 410);
  };

  return <P5Sketch setup={() => {}} draw={draw} width={1100} height={450} />;
}

export function IntermediateValueTheorem() {
  const [kind, setKind] = useState<"cubica" | "quadratica" | "quartica">("cubica");
  const [n, setN] = useState(0);

  const fn = useMemo(() => {
    if (kind === "quadratica") return (x: number) => -x * x + 4;
    if (kind === "quartica") return (x: number) => (x ** 4) / 2 - 2 * x * x;
    return (x: number) => x ** 3 - 2 * x;
  }, [kind]);

  const fa = fn(-2);
  const fb = fn(2);
  const guaranteed = n >= Math.min(fa, fb) && n <= Math.max(fa, fb);

  const draw = (p: p5) => {
    const b: Bounds = { xMin: -2, xMax: 2, yMin: -5, yMax: 5 };
    drawAxes(p, b, "Teorema do Valor Intermediario", 34);

    p.noFill();
    p.stroke("#3B82F6");
    p.strokeWeight(2.3);
    p.beginShape();
    for (let x = -2; x <= 2; x += 0.02) p.vertex(mapX(p, x, b, 34), mapY(p, fn(x), b, 34));
    p.endShape();

    p.stroke(guaranteed ? "#EF4444" : "#9CA3AF");
    (p.drawingContext as CanvasRenderingContext2D).setLineDash([6, 6]);
    p.line(34, mapY(p, n, b, 34), p.width - 34, mapY(p, n, b, 34));
    (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);
  };

  return (
    <div className="my-8 flex overflow-hidden rounded border border-gray-200">
      <div className="w-[760px] bg-white">
        <P5Sketch setup={() => {}} draw={draw} width={760} height={460} />
      </div>
      <div className="w-[240px] space-y-3 bg-gray-50 p-4 text-sm">
        <div className="font-semibold">y = N = {n.toFixed(2)}</div>
        <input className="w-full" type="range" min={-5} max={5} step={0.1} value={n} onChange={(e) => setN(Number(e.target.value))} />
        <label className="block"><input type="radio" checked={kind === "cubica"} onChange={() => setKind("cubica")} /> Cubica</label>
        <label className="block"><input type="radio" checked={kind === "quadratica"} onChange={() => setKind("quadratica")} /> Quadratica</label>
        <label className="block"><input type="radio" checked={kind === "quartica"} onChange={() => setKind("quartica")} /> Quartica</label>
        <div className="rounded border bg-white p-2 font-mono text-xs">
          <div>f(a)={fa.toFixed(2)}</div>
          <div>f(b)={fb.toFixed(2)}</div>
          <div className={guaranteed ? "text-emerald-600" : "text-gray-500"}>{guaranteed ? "TVI garantido" : "Sem garantia"}</div>
        </div>
      </div>
    </div>
  );
}

export function BisectionMethod() {
  const steps = [
    { a: 1.5, b: 1.7, m: 1.6, fm: -0.104 },
    { a: 1.6, b: 1.7, m: 1.65, fm: 0.192 },
    { a: 1.6, b: 1.65, m: 1.625, fm: 0.041 },
    { a: 1.6, b: 1.625, m: 1.6125, fm: -0.033 },
    { a: 1.6125, b: 1.625, m: 1.61875, fm: 0.003 },
  ];
  const [idx, setIdx] = useState(0);
  const cur = steps[idx];

  const draw = (p: p5) => {
    const b: Bounds = { xMin: -1, xMax: 3, yMin: -3, yMax: 8 };
    drawAxes(p, b, "Metodo da Bisseccao", 38);

    p.noFill();
    p.stroke("#3B82F6");
    p.strokeWeight(2.2);
    p.beginShape();
    for (let x = -1; x <= 3; x += 0.02) p.vertex(mapX(p, x, b, 38), mapY(p, x ** 3 - 2 * x - 1, b, 38));
    p.endShape();

    p.stroke("#FCD34D");
    p.line(mapX(p, cur.a, b, 38), 38, mapX(p, cur.a, b, 38), p.height - 38);
    p.stroke("#FB923C");
    p.line(mapX(p, cur.b, b, 38), 38, mapX(p, cur.b, b, 38), p.height - 38);
    p.stroke("#EF4444");
    p.line(mapX(p, cur.m, b, 38), 38, mapX(p, cur.m, b, 38), p.height - 38);
  };

  return (
    <div className="my-8 flex overflow-hidden rounded border border-gray-200">
      <div className="w-[760px] bg-white">
        <P5Sketch setup={() => {}} draw={draw} width={760} height={500} />
      </div>
      <div className="w-[340px] bg-gray-50 p-4 text-sm">
        <div className="mb-3 flex gap-2">
          <button className="rounded border bg-white px-3 py-1 disabled:opacity-40" disabled={idx === 0} onClick={() => setIdx((v) => Math.max(0, v - 1))}>Anterior</button>
          <button className="rounded bg-blue-600 px-3 py-1 text-white disabled:opacity-40" disabled={idx === steps.length - 1} onClick={() => setIdx((v) => Math.min(steps.length - 1, v + 1))}>Proximo</button>
          <button className="rounded border bg-gray-200 px-3 py-1" onClick={() => setIdx(0)}>Reset</button>
        </div>
        <div className="space-y-2 font-mono text-xs">
          {steps.slice(0, idx + 1).map((s, i) => (
            <div key={i} className={`rounded border p-2 ${i === idx ? "bg-white" : "bg-gray-100"}`}>
              <div className="font-semibold text-gray-700">Iteracao {i + 1}</div>
              <div>a={s.a.toFixed(5)} b={s.b.toFixed(5)}</div>
              <div>m={s.m.toFixed(5)} f(m)={s.fm.toFixed(3)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const DiscontinuityTypesVisualization = DiscontinuityExplorer;
export const IntermediateValueTheoremVisualization = IntermediateValueTheorem;

