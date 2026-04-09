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

function drawGrid(p: p5, b: Bounds, pad = 38) {
  p.background(250);
  p.stroke(230);
  p.strokeWeight(1);

  for (let x = Math.ceil(b.xMin); x <= Math.floor(b.xMax); x += 1) {
    p.line(mapX(p, x, b, pad), pad, mapX(p, x, b, pad), p.height - pad);
  }
  for (let y = Math.ceil(b.yMin); y <= Math.floor(b.yMax); y += 1) {
    p.line(pad, mapY(p, y, b, pad), p.width - pad, mapY(p, y, b, pad));
  }

  p.stroke(120);
  if (b.yMin <= 0 && b.yMax >= 0) {
    p.line(pad, mapY(p, 0, b, pad), p.width - pad, mapY(p, 0, b, pad));
  }
  if (b.xMin <= 0 && b.xMax >= 0) {
    p.line(mapX(p, 0, b, pad), pad, mapX(p, 0, b, pad), p.height - pad);
  }
}

function infoBox(p: p5, text: string) {
  p.noStroke();
  p.fill(20, 25, 40, 220);
  p.rect(12, 12, Math.min(p.width - 24, text.length * 7 + 24), 26, 6);
  p.fill(245);
  p.textSize(12);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(text, 20, 25);
}

export function NaturalIntegerSetMap() {
  const [includeZero, setIncludeZero] = useState(true);
  const [selected, setSelected] = useState<number>(0);
  const samples = [-2, 0, 3];

  const draw = (p: p5) => {
    p.background(252);

    p.noStroke();
    p.fill(220, 235, 255);
    p.ellipse(p.width * 0.5, p.height * 0.54, 470, 250);
    p.fill(255, 240, 220);
    p.ellipse(p.width * 0.5, p.height * 0.54, 260, 130);

    p.fill(40);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(17);
    p.text("Z (inteiros)", p.width * 0.5, p.height * 0.34);
    p.text("N (naturais)", p.width * 0.5, p.height * 0.54);

    const inN = includeZero ? selected >= 0 : selected > 0;
    const inZ = Number.isInteger(selected);

    p.fill(inN ? 20 : 120, inN ? 150 : 120, 60);
    p.textSize(20);
    p.text(String(selected), p.width * 0.5, inN ? p.height * 0.54 : p.height * 0.44);

    p.fill(20);
    p.textSize(12);
    p.text(
      `Convencao: N = {${includeZero ? "0,1,2,..." : "1,2,3,..."}}`,
      p.width * 0.5,
      p.height - 30,
    );

    infoBox(p, `Pertence a N: ${inN ? "sim" : "nao"} | Pertence a Z: ${inZ ? "sim" : "nao"}`);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button
          className={`rounded px-2 py-1 ${includeZero ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setIncludeZero(true)}
        >
          N com 0
        </button>
        <button
          className={`rounded px-2 py-1 ${!includeZero ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setIncludeZero(false)}
        >
          N sem 0
        </button>
        <span>Exemplo:</span>
        {samples.map((n) => (
          <button
            key={n}
            className={`rounded px-2 py-1 ${selected === n ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
            onClick={() => setSelected(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <P5Sketch setup={() => {}} draw={draw} height={360} />
    </div>
  );
}

export function IntegerMovementNumberLine() {
  const [start, setStart] = useState(1);
  const [step, setStep] = useState(3);
  const [op, setOp] = useState<"+" | "-">("+");
  const result = op === "+" ? start + step : start - step;

  const draw = (p: p5) => {
    const b: Bounds = { xMin: -12, xMax: 12, yMin: -2, yMax: 2 };
    drawGrid(p, b, 44);

    p.stroke(50, 60, 80);
    p.strokeWeight(2);
    p.line(mapX(p, b.xMin, b, 44), mapY(p, 0, b, 44), mapX(p, b.xMax, b, 44), mapY(p, 0, b, 44));

    p.noStroke();
    for (let x = -12; x <= 12; x += 1) {
      p.fill(80);
      p.circle(mapX(p, x, b, 44), mapY(p, 0, b, 44), 3);
      if (x % 2 === 0) {
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(10);
        p.text(String(x), mapX(p, x, b, 44), mapY(p, 0, b, 44) + 8);
      }
    }

    p.fill(37, 99, 235);
    p.circle(mapX(p, start, b, 44), mapY(p, 0, b, 44), 12);
    p.fill(16, 185, 129);
    p.circle(mapX(p, result, b, 44), mapY(p, 0, b, 44), 12);

    p.stroke(245, 158, 11);
    p.strokeWeight(3);
    p.noFill();
    p.line(mapX(p, start, b, 44), mapY(p, 0, b, 44) - 20, mapX(p, result, b, 44), mapY(p, 0, b, 44) - 20);

    infoBox(p, `${start} ${op} ${step} = ${result}`);
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="grid gap-2 md:grid-cols-3">
        <label className="flex items-center gap-2">
          inicio
          <input type="range" min={-10} max={10} value={start} onChange={(e) => setStart(Number(e.target.value))} />
          <span>{start}</span>
        </label>
        <label className="flex items-center gap-2">
          passo
          <input type="range" min={0} max={10} value={step} onChange={(e) => setStep(Number(e.target.value))} />
          <span>{step}</span>
        </label>
        <div className="flex items-center gap-2">
          <button className={`rounded px-2 py-1 ${op === "+" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setOp("+")}>+</button>
          <button className={`rounded px-2 py-1 ${op === "-" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setOp("-")}>-</button>
        </div>
      </div>
      <P5Sketch setup={() => {}} draw={draw} height={320} />
    </div>
  );
}

export function AbsoluteValueDistanceExplorer() {
  const [a, setA] = useState(-5);

  const draw = (p: p5) => {
    const b: Bounds = { xMin: -12, xMax: 12, yMin: -2, yMax: 2 };
    drawGrid(p, b, 44);

    const y = mapY(p, 0, b, 44);
    p.stroke(50);
    p.line(mapX(p, b.xMin, b, 44), y, mapX(p, b.xMax, b, 44), y);

    p.stroke(245, 158, 11);
    p.strokeWeight(4);
    p.line(mapX(p, 0, b, 44), y - 16, mapX(p, a, b, 44), y - 16);

    p.stroke(16, 185, 129, 180);
    p.strokeWeight(2);
    p.line(mapX(p, 0, b, 44), y - 30, mapX(p, -a, b, 44), y - 30);

    p.noStroke();
    p.fill(37, 99, 235);
    p.circle(mapX(p, a, b, 44), y, 12);
    p.fill(16, 185, 129);
    p.circle(mapX(p, -a, b, 44), y, 9);

    infoBox(p, `a=${a}, -a=${-a}, |a|=${Math.abs(a)}`);
  };

  return (
    <div className="space-y-2 text-sm">
      <label className="flex items-center gap-3">
        a
        <input type="range" min={-12} max={12} value={a} onChange={(e) => setA(Number(e.target.value))} />
        <span>{a}</span>
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={300} />
    </div>
  );
}

function toFractionFromRepeating(period: string) {
  const digits = period.length;
  const denominator = Number("9".repeat(digits));
  const numerator = Number(period);
  return { numerator, denominator };
}

export function RationalDecimalConverter() {
  const [pNum, setPNum] = useState(1);
  const [qDen, setQDen] = useState(3);

  const value = qDen !== 0 ? pNum / qDen : 0;
  const repeating = qDen !== 0 && !Number.isFinite(Number(value.toFixed(8)));
  const fixed = qDen !== 0 ? value.toString() : "indefinido";

  const draw = (p: p5) => {
    p.background(252);
    p.fill(20);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(14);
    p.text(`fracao: ${pNum}/${qDen}`, 20, 24);
    p.text(`decimal aproximado: ${qDen === 0 ? "indefinido" : value.toFixed(8)}`, 20, 50);

    p.textSize(12);
    p.fill(70);
    p.text(`representacao JS: ${fixed}`, 20, 78);

    p.noStroke();
    p.fill(235, 245, 255);
    p.rect(20, 110, p.width - 40, 70, 8);
    p.fill(30, 60, 90);
    p.text(
      "Dica: use denominador com fatores 2 e 5 para decimal finito (ex.: 1/8, 3/20).",
      30,
      130,
      p.width - 60,
      60,
    );

    if (qDen === 3 || qDen === 9 || qDen === 27) {
      const frac = toFractionFromRepeating("3");
      p.fill(20);
      p.text(`exemplo de dizima periodica: 0,overline(3) = ${frac.numerator}/${frac.denominator}`, 20, 200);
    }

    infoBox(p, qDen === 0 ? "q deve ser diferente de 0" : "Explore p/q e observe o decimal.");
    void repeating;
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="grid gap-2 md:grid-cols-2">
        <label className="flex items-center gap-2">
          p
          <input type="range" min={-20} max={20} value={pNum} onChange={(e) => setPNum(Number(e.target.value))} />
          <span>{pNum}</span>
        </label>
        <label className="flex items-center gap-2">
          q
          <input type="range" min={-20} max={20} value={qDen} onChange={(e) => setQDen(Number(e.target.value))} />
          <span>{qDen}</span>
        </label>
      </div>
      <P5Sketch setup={() => {}} draw={draw} height={260} />
    </div>
  );
}

export function Sqrt2IrrationalProofStepper() {
  const steps = [
    "1) Assuma sqrt(2)=p/q na forma irredutivel.",
    "2) 2 = p^2/q^2  =>  2q^2 = p^2.",
    "3) p^2 par => p par => p=2k.",
    "4) Substituindo: q^2 = 2k^2 => q par.",
    "5) p e q pares contradizem forma irredutivel.",
  ];
  const [index, setIndex] = useState(0);

  const draw = (p: p5) => {
    p.background(248);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(15);
    p.fill(20);
    p.text("Prova por contradicao: sqrt(2) e irracional", 18, 18);

    for (let i = 0; i <= index; i += 1) {
      p.fill(i === index ? 20 : 70);
      p.textSize(13);
      p.text(steps[i], 22, 52 + i * 34, p.width - 40, 32);
    }

    infoBox(p, `Passo ${index + 1} de ${steps.length}`);
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <button className="rounded bg-gray-200 px-2 py-1" onClick={() => setIndex((v) => Math.max(0, v - 1))}>anterior</button>
        <button className="rounded bg-blue-600 px-2 py-1 text-white" onClick={() => setIndex((v) => Math.min(steps.length - 1, v + 1))}>proximo</button>
      </div>
      <P5Sketch setup={() => {}} draw={draw} height={260} />
    </div>
  );
}

export function RationalIrrationalDensityLine() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [points, setPoints] = useState<Array<{ x: number; type: "Q" | "I" }>>([]);

  const addRational = () => {
    const num = Math.floor(Math.random() * 40) + 1;
    const den = Math.floor(Math.random() * 20) + 1;
    const x = a + ((b - a) * num) / (den + num);
    setPoints((prev) => [...prev, { x, type: "Q" }]);
  };

  const addIrrational = () => {
    const x = a + (b - a) * (Math.sqrt(2) % 1) * Math.random();
    setPoints((prev) => [...prev, { x, type: "I" }]);
  };

  const draw = (p: p5) => {
    const bds: Bounds = { xMin: Math.min(a, b) - 1, xMax: Math.max(a, b) + 1, yMin: -1, yMax: 1 };
    drawGrid(p, bds, 40);
    const y = mapY(p, 0, bds, 40);

    p.stroke(50);
    p.strokeWeight(2);
    p.line(mapX(p, bds.xMin, bds, 40), y, mapX(p, bds.xMax, bds, 40), y);

    p.noStroke();
    p.fill(20);
    p.circle(mapX(p, a, bds, 40), y, 10);
    p.circle(mapX(p, b, bds, 40), y, 10);

    points.forEach((pt) => {
      p.fill(pt.type === "Q" ? 37 : 245, pt.type === "Q" ? 99 : 158, pt.type === "Q" ? 235 : 11);
      p.circle(mapX(p, pt.x, bds, 40), y, 7);
    });

    infoBox(p, `Pontos gerados: ${points.length} (azul=Q, laranja=I)`);
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="grid gap-2 md:grid-cols-2">
        <label className="flex items-center gap-2">A<input type="range" min={-2} max={4} step={0.1} value={a} onChange={(e) => setA(Number(e.target.value))} /><span>{a.toFixed(1)}</span></label>
        <label className="flex items-center gap-2">B<input type="range" min={-2} max={4} step={0.1} value={b} onChange={(e) => setB(Number(e.target.value))} /><span>{b.toFixed(1)}</span></label>
      </div>
      <div className="flex gap-2">
        <button className="rounded bg-blue-600 px-2 py-1 text-white" onClick={addRational}>gerar racional</button>
        <button className="rounded bg-orange-500 px-2 py-1 text-white" onClick={addIrrational}>gerar irracional</button>
        <button className="rounded bg-gray-200 px-2 py-1" onClick={() => setPoints([])}>limpar</button>
      </div>
      <P5Sketch setup={() => {}} draw={draw} height={300} />
    </div>
  );
}

export function RealSetHierarchyTree() {
  const [sample, setSample] = useState("sqrt(2)");

  const classification = useMemo(() => {
    if (sample === "2") return "2 pertence a N, Z, Q e R";
    if (sample === "-3") return "-3 pertence a Z, Q e R";
    if (sample === "1/2") return "1/2 pertence a Q e R";
    return "sqrt(2) pertence a R, mas nao pertence a Q";
  }, [sample]);

  const draw = (p: p5) => {
    p.background(251);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(14);

    p.fill(20);
    p.text("R", 40, 40);
    p.line(50, 40, 120, 40);
    p.text("Q", 130, 40);
    p.line(140, 40, 210, 40);
    p.text("Z", 220, 40);
    p.line(230, 40, 300, 40);
    p.text("N", 310, 40);

    p.fill(245, 158, 11);
    p.text("Irracionais = R\\Q", 40, 78);

    p.fill(32);
    p.textSize(13);
    p.text(classification, 40, 120, p.width - 60, 90);

    infoBox(p, "Hierarquia: N subset Z subset Q subset R");
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="flex flex-wrap gap-2">
        {[
          ["2", "2"],
          ["-3", "-3"],
          ["1/2", "1/2"],
          ["sqrt(2)", "sqrt(2)"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={`rounded px-2 py-1 ${sample === id ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setSample(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <P5Sketch setup={() => {}} draw={draw} height={220} />
    </div>
  );
}

export function DensityZoomExplorer() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [depth, setDepth] = useState(0);

  const points = useMemo(() => {
    let left = Math.min(a, b);
    let right = Math.max(a, b);
    const arr: number[] = [];
    for (let i = 0; i < depth; i += 1) {
      const mid = (left + right) / 2;
      arr.push(mid);
      right = mid;
    }
    return arr;
  }, [a, b, depth]);

  const draw = (p: p5) => {
    const min = Math.min(a, b) - 0.2;
    const max = Math.max(a, b) + 0.2;
    const bds: Bounds = { xMin: min, xMax: max, yMin: -1, yMax: 1 };
    drawGrid(p, bds, 40);
    const y = mapY(p, 0, bds, 40);

    p.stroke(50);
    p.line(mapX(p, min, bds, 40), y, mapX(p, max, bds, 40), y);

    p.noStroke();
    p.fill(20);
    p.circle(mapX(p, a, bds, 40), y, 9);
    p.circle(mapX(p, b, bds, 40), y, 9);

    points.forEach((x, i) => {
      p.fill(37, 99 + i * 6, 235 - i * 8);
      p.circle(mapX(p, x, bds, 40), y, 7);
    });

    infoBox(p, `Profundidade de refinamento: ${depth}`);
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="grid gap-2 md:grid-cols-3">
        <label className="flex items-center gap-2">A<input type="range" min={0} max={2} step={0.05} value={a} onChange={(e) => setA(Number(e.target.value))} /><span>{a.toFixed(2)}</span></label>
        <label className="flex items-center gap-2">B<input type="range" min={1} max={3} step={0.05} value={b} onChange={(e) => setB(Number(e.target.value))} /><span>{b.toFixed(2)}</span></label>
        <label className="flex items-center gap-2">n<input type="range" min={0} max={10} step={1} value={depth} onChange={(e) => setDepth(Number(e.target.value))} /><span>{depth}</span></label>
      </div>
      <P5Sketch setup={() => {}} draw={draw} height={260} />
    </div>
  );
}

export function SupremumMaximumComparator() {
  const [closedRight, setClosedRight] = useState(false);

  const draw = (p: p5) => {
    const b: Bounds = { xMin: -0.2, xMax: 1.2, yMin: -1, yMax: 1 };
    drawGrid(p, b, 48);
    const yA = p.height * 0.42;
    const yB = p.height * 0.7;

    p.stroke(70);
    p.line(mapX(p, 0, b, 48), yA, mapX(p, 1, b, 48), yA);
    p.line(mapX(p, 0, b, 48), yB, mapX(p, 1, b, 48), yB);

    p.fill(255);
    p.stroke(20);
    p.circle(mapX(p, 1, b, 48), yA, 10);

    if (closedRight) {
      p.noStroke();
      p.fill(20, 120, 70);
      p.circle(mapX(p, 1, b, 48), yB, 10);
    } else {
      p.fill(255);
      p.stroke(20);
      p.circle(mapX(p, 1, b, 48), yB, 10);
    }

    p.noStroke();
    p.fill(20);
    p.textSize(12);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("A=(0,1): sup=1, max inexistente", 52, yA - 14);
    p.text(`B=(0,1${closedRight ? "]" : ")"}: sup=1, max ${closedRight ? "=1" : "inexistente"}`, 52, yB - 14);
    infoBox(p, "Supremo pode existir mesmo sem maximo.");
  };

  return (
    <div className="space-y-2 text-sm">
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={closedRight} onChange={(e) => setClosedRight(e.target.checked)} />
        Fechar extremo direito de B
      </label>
      <P5Sketch setup={() => {}} draw={draw} height={250} />
    </div>
  );
}

export function IntervalNotationBuilder() {
  const [a, setA] = useState(-2);
  const [b, setB] = useState(3);
  const [leftClosed, setLeftClosed] = useState(true);
  const [rightClosed, setRightClosed] = useState(false);

  const notation = `${leftClosed ? "[" : "("}${a.toFixed(1)}, ${b.toFixed(1)}${rightClosed ? "]" : ")"}`;

  const draw = (p: p5) => {
    const bds: Bounds = { xMin: -6, xMax: 6, yMin: -1, yMax: 1 };
    drawGrid(p, bds, 44);
    const y = mapY(p, 0, bds, 44);

    p.stroke(70);
    p.line(mapX(p, bds.xMin, bds, 44), y, mapX(p, bds.xMax, bds, 44), y);

    p.stroke(37, 99, 235);
    p.strokeWeight(4);
    p.line(mapX(p, a, bds, 44), y, mapX(p, b, bds, 44), y);

    p.stroke(20);
    p.strokeWeight(2);
    p.fill(leftClosed ? 37 : 255, leftClosed ? 99 : 255, leftClosed ? 235 : 255);
    p.circle(mapX(p, a, bds, 44), y, 11);
    p.fill(rightClosed ? 37 : 255, rightClosed ? 99 : 255, rightClosed ? 235 : 255);
    p.circle(mapX(p, b, bds, 44), y, 11);

    infoBox(p, `Intervalo: ${notation}`);
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="grid gap-2 md:grid-cols-2">
        <label className="flex items-center gap-2">a<input type="range" min={-5} max={4} step={0.1} value={a} onChange={(e) => setA(Number(e.target.value))} /><span>{a.toFixed(1)}</span></label>
        <label className="flex items-center gap-2">b<input type="range" min={-4} max={5} step={0.1} value={b} onChange={(e) => setB(Number(e.target.value))} /><span>{b.toFixed(1)}</span></label>
      </div>
      <div className="flex gap-4">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={leftClosed} onChange={(e) => setLeftClosed(e.target.checked)} />esquerdo fechado</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={rightClosed} onChange={(e) => setRightClosed(e.target.checked)} />direito fechado</label>
      </div>
      <P5Sketch setup={() => {}} draw={draw} height={260} />
    </div>
  );
}

export function IntervalSetOperationsLab() {
  const [a1, setA1] = useState(0);
  const [a2, setA2] = useState(4);
  const [b1, setB1] = useState(2);
  const [b2, setB2] = useState(6);
  const [op, setOp] = useState<"union" | "inter">("union");

  const draw = (p: p5) => {
    const b: Bounds = { xMin: -1, xMax: 8, yMin: -1, yMax: 3 };
    drawGrid(p, b, 44);
    const yA = p.height * 0.34;
    const yB = p.height * 0.54;
    const yR = p.height * 0.76;

    const drawSegment = (x1: number, x2: number, y: number, color: [number, number, number]) => {
      p.stroke(...color);
      p.strokeWeight(5);
      p.line(mapX(p, x1, b, 44), y, mapX(p, x2, b, 44), y);
    };

    drawSegment(a1, a2, yA, [37, 99, 235]);
    drawSegment(b1, b2, yB, [16, 185, 129]);

    if (op === "union") {
      drawSegment(Math.min(a1, b1), Math.max(a2, b2), yR, [245, 158, 11]);
    } else {
      const l = Math.max(a1, b1);
      const r = Math.min(a2, b2);
      if (l <= r) drawSegment(l, r, yR, [245, 158, 11]);
    }

    p.noStroke();
    p.fill(30);
    p.textSize(12);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("A", 12, yA);
    p.text("B", 12, yB);
    p.text("Resultado", 12, yR);

    infoBox(p, op === "union" ? "Operacao: A uniao B" : "Operacao: A intersecao B");
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="grid gap-2 md:grid-cols-2">
        <label className="flex items-center gap-2">A1<input type="range" min={-1} max={7} step={0.1} value={a1} onChange={(e) => setA1(Number(e.target.value))} /></label>
        <label className="flex items-center gap-2">A2<input type="range" min={-1} max={7} step={0.1} value={a2} onChange={(e) => setA2(Number(e.target.value))} /></label>
        <label className="flex items-center gap-2">B1<input type="range" min={-1} max={7} step={0.1} value={b1} onChange={(e) => setB1(Number(e.target.value))} /></label>
        <label className="flex items-center gap-2">B2<input type="range" min={-1} max={7} step={0.1} value={b2} onChange={(e) => setB2(Number(e.target.value))} /></label>
      </div>
      <div className="flex gap-2">
        <button className={`rounded px-2 py-1 ${op === "union" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setOp("union")}>A ∪ B</button>
        <button className={`rounded px-2 py-1 ${op === "inter" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setOp("inter")}>A ∩ B</button>
      </div>
      <P5Sketch setup={() => {}} draw={draw} height={300} />
    </div>
  );
}

export function FunctionDomainVisualizer() {
  const [preset, setPreset] = useState<"f" | "g" | "h">("f");

  const draw = (p: p5) => {
    const b: Bounds = { xMin: -6, xMax: 6, yMin: -1, yMax: 1 };
    drawGrid(p, b, 44);
    const y = mapY(p, 0, b, 44);
    p.stroke(60);
    p.line(mapX(p, -6, b, 44), y, mapX(p, 6, b, 44), y);

    const paintAllowed = (x1: number, x2: number) => {
      p.stroke(16, 185, 129);
      p.strokeWeight(5);
      p.line(mapX(p, x1, b, 44), y, mapX(p, x2, b, 44), y);
    };

    if (preset === "f") {
      paintAllowed(-6, 2);
      paintAllowed(2, 6);
      p.noStroke();
      p.fill(220, 38, 38);
      p.circle(mapX(p, 2, b, 44), y, 10);
      infoBox(p, "f(x)=1/(x-2), dominio: R\\{2}");
    } else if (preset === "g") {
      paintAllowed(3, 6);
      infoBox(p, "g(x)=sqrt(x-3), dominio: [3,+inf)");
    } else {
      paintAllowed(-1, 6);
      p.noStroke();
      p.fill(220, 38, 38);
      p.circle(mapX(p, -1, b, 44), y, 10);
      infoBox(p, "h(x)=1/sqrt(x+1), dominio: (-1,+inf)");
    }
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="flex gap-2">
        <button className={`rounded px-2 py-1 ${preset === "f" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setPreset("f")}>f(x)=1/(x-2)</button>
        <button className={`rounded px-2 py-1 ${preset === "g" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setPreset("g")}>g(x)=sqrt(x-3)</button>
        <button className={`rounded px-2 py-1 ${preset === "h" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setPreset("h")}>h(x)=1/sqrt(x+1)</button>
      </div>
      <P5Sketch setup={() => {}} draw={draw} height={260} />
    </div>
  );
}

export const __preCalculoP5Module = true;

