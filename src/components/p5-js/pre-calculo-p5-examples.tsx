"use client";

import { useMemo, useRef, useState } from "react";
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

type UIRect = { x: number; y: number; w: number; h: number };

type UISlider = UIRect & {
  min: number;
  max: number;
  value: number;
  step?: number;
  label: string;
};

function hitRect(p: p5, rect: UIRect) {
  return p.mouseX >= rect.x && p.mouseX <= rect.x + rect.w && p.mouseY >= rect.y && p.mouseY <= rect.y + rect.h;
}

function drawCanvasButton(p: p5, rect: UIRect, label: string, active = false) {
  p.noStroke();
  p.fill(active ? p.color(37, 99, 235) : p.color(229, 231, 235));
  p.rect(rect.x, rect.y, rect.w, rect.h, 6);
  p.fill(active ? 255 : 31);
  p.textSize(12);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 0.5);
}

function drawCanvasCheckbox(p: p5, rect: UIRect, label: string, checked: boolean) {
  const boxSize = Math.min(16, rect.h - 2);
  p.stroke(120);
  p.fill(255);
  p.rect(rect.x, rect.y + (rect.h - boxSize) / 2, boxSize, boxSize, 4);
  if (checked) {
    p.noStroke();
    p.fill(37, 99, 235);
    p.rect(rect.x + 3, rect.y + (rect.h - boxSize) / 2 + 3, boxSize - 6, boxSize - 6, 2);
  }
  p.noStroke();
  p.fill(30);
  p.textSize(12);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(label, rect.x + boxSize + 8, rect.y + rect.h / 2 + 0.5);
}

function drawCanvasSlider(p: p5, slider: UISlider) {
  const ratio = (slider.value - slider.min) / (slider.max - slider.min || 1);
  const knobX = slider.x + ratio * slider.w;
  p.noStroke();
  p.fill(30);
  p.textSize(12);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text(`${slider.label}: ${slider.value.toFixed(slider.step && slider.step < 1 ? 2 : 0)}`, slider.x, slider.y - 5);
  p.stroke(180);
  p.strokeWeight(3);
  p.line(slider.x, slider.y + slider.h / 2, slider.x + slider.w, slider.y + slider.h / 2);
  p.noStroke();
  p.fill(37, 99, 235);
  p.circle(knobX, slider.y + slider.h / 2, 12);
}

function sliderValueAtMouse(p: p5, slider: UISlider) {
  const ratio = p.constrain((p.mouseX - slider.x) / slider.w, 0, 1);
  const raw = slider.min + ratio * (slider.max - slider.min);
  const step = slider.step ?? 1;
  return Math.round(raw / step) * step;
}

export function NaturalIntegerSetMap() {
  const [includeZero, setIncludeZero] = useState(true);
  const [selected, setSelected] = useState<number>(0);
  const samples = [-2, 0, 3];

  const getControls = () => ({
    withZero: { x: 20, y: 44, w: 92, h: 26 } satisfies UIRect,
    withoutZero: { x: 122, y: 44, w: 92, h: 26 } satisfies UIRect,
    samples: samples.map((_, i) => ({ x: 20 + i * 62, y: 78, w: 54, h: 24 } satisfies UIRect)),
  });

  const draw = (p: p5) => {
    p.background(252);

    const controls = getControls();
    p.noStroke();
    p.fill(30);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
    p.text("Convencao de N", 20, 30);
    drawCanvasButton(p, controls.withZero, "N com 0", includeZero);
    drawCanvasButton(p, controls.withoutZero, "N sem 0", !includeZero);
    p.text("Exemplo", 20, 118);
    samples.forEach((n, i) => {
      drawCanvasButton(p, controls.samples[i], String(n), selected === n);
    });

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

  const mousePressed = (p: p5) => {
    const controls = getControls();
    if (hitRect(p, controls.withZero)) {
      setIncludeZero(true);
      return;
    }
    if (hitRect(p, controls.withoutZero)) {
      setIncludeZero(false);
      return;
    }
    samples.forEach((n, i) => {
      if (hitRect(p, controls.samples[i])) {
        setSelected(n);
      }
    });
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} height={360} />;
}

export function IntegerMovementNumberLine() {
  const [start, setStart] = useState(1);
  const [step, setStep] = useState(3);
  const [op, setOp] = useState<"+" | "-">("+");
  const activeSlider = useRef<"start" | "step" | null>(null);
  const result = op === "+" ? start + step : start - step;

  const getControls = (p: p5) => ({
    start: { x: 72, y: 24, w: p.width - 92, h: 18, min: -10, max: 10, value: start, step: 1, label: "inicio" } satisfies UISlider,
    step: { x: 72, y: 52, w: p.width - 92, h: 18, min: 0, max: 10, value: step, step: 1, label: "passo" } satisfies UISlider,
    plus: { x: 20, y: 78, w: 48, h: 24 } satisfies UIRect,
    minus: { x: 74, y: 78, w: 48, h: 24 } satisfies UIRect,
  });

  const draw = (p: p5) => {
    const b: Bounds = { xMin: -12, xMax: 12, yMin: -2, yMax: 2 };
    drawGrid(p, b, 44);

    const controls = getControls(p);
    drawCanvasSlider(p, controls.start);
    drawCanvasSlider(p, controls.step);
    drawCanvasButton(p, controls.plus, "+", op === "+");
    drawCanvasButton(p, controls.minus, "-", op === "-");

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

  const mousePressed = (p: p5) => {
    const controls = getControls(p);
    if (hitRect(p, controls.start)) {
      activeSlider.current = "start";
      setStart(sliderValueAtMouse(p, controls.start));
      return;
    }
    if (hitRect(p, controls.step)) {
      activeSlider.current = "step";
      setStep(sliderValueAtMouse(p, controls.step));
      return;
    }
    if (hitRect(p, controls.plus)) {
      setOp("+");
      return;
    }
    if (hitRect(p, controls.minus)) {
      setOp("-");
    }
  };

  const mouseDragged = (p: p5) => {
    const controls = getControls(p);
    if (activeSlider.current === "start") setStart(sliderValueAtMouse(p, controls.start));
    if (activeSlider.current === "step") setStep(sliderValueAtMouse(p, controls.step));
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} mouseDragged={mouseDragged} mouseReleased={() => { activeSlider.current = null; }} height={320} />;
}

export function AbsoluteValueDistanceExplorer() {
  const [a, setA] = useState(-5);
  const activeSlider = useRef<"a" | null>(null);

  const getSlider = (p: p5) =>
    ({ x: 64, y: 24, w: p.width - 84, h: 18, min: -12, max: 12, value: a, step: 1, label: "a" }) satisfies UISlider;

  const draw = (p: p5) => {
    const b: Bounds = { xMin: -12, xMax: 12, yMin: -2, yMax: 2 };
    drawGrid(p, b, 44);

    drawCanvasSlider(p, getSlider(p));

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

  const mousePressed = (p: p5) => {
    const slider = getSlider(p);
    if (hitRect(p, slider)) {
      activeSlider.current = "a";
      setA(sliderValueAtMouse(p, slider));
    }
  };

  const mouseDragged = (p: p5) => {
    if (activeSlider.current !== "a") return;
    setA(sliderValueAtMouse(p, getSlider(p)));
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} mouseDragged={mouseDragged} mouseReleased={() => { activeSlider.current = null; }} height={300} />;
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
  const activeSlider = useRef<"p" | "q" | null>(null);

  const value = qDen !== 0 ? pNum / qDen : 0;
  const repeating = qDen !== 0 && !Number.isFinite(Number(value.toFixed(8)));
  const fixed = qDen !== 0 ? value.toString() : "indefinido";

  const pSlider = (p: p5): UISlider => ({
    x: 28,
    y: p.height - 78,
    w: p.width - 56,
    h: 20,
    min: -20,
    max: 20,
    value: pNum,
    step: 1,
    label: "p",
  });

  const qSlider = (p: p5): UISlider => ({
    x: 28,
    y: p.height - 46,
    w: p.width - 56,
    h: 20,
    min: -20,
    max: 20,
    value: qDen,
    step: 1,
    label: "q",
  });

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

    drawCanvasSlider(p, pSlider(p));
    drawCanvasSlider(p, qSlider(p));

    infoBox(p, qDen === 0 ? "q deve ser diferente de 0" : "Explore p/q e observe o decimal.");
    void repeating;
  };

  const handleSliderInteraction = (p: p5) => {
    const pCtl = pSlider(p);
    const qCtl = qSlider(p);
    if (activeSlider.current === "p") {
      setPNum(sliderValueAtMouse(p, pCtl));
    }
    if (activeSlider.current === "q") {
      setQDen(sliderValueAtMouse(p, qCtl));
    }
  };

  const mousePressed = (p: p5) => {
    const pCtl = pSlider(p);
    const qCtl = qSlider(p);
    if (hitRect(p, pCtl)) {
      activeSlider.current = "p";
      setPNum(sliderValueAtMouse(p, pCtl));
      return;
    }
    if (hitRect(p, qCtl)) {
      activeSlider.current = "q";
      setQDen(sliderValueAtMouse(p, qCtl));
    }
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} mouseDragged={handleSliderInteraction} mouseReleased={() => { activeSlider.current = null; }} height={320} />;
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

    drawCanvasButton(p, { x: 22, y: p.height - 44, w: 96, h: 28 }, "anterior", false);
    drawCanvasButton(p, { x: 128, y: p.height - 44, w: 96, h: 28 }, "proximo", true);

    infoBox(p, `Passo ${index + 1} de ${steps.length}`);
  };

  const mousePressed = (p: p5) => {
    const prevBtn: UIRect = { x: 22, y: p.height - 44, w: 96, h: 28 };
    const nextBtn: UIRect = { x: 128, y: p.height - 44, w: 96, h: 28 };
    if (hitRect(p, prevBtn)) {
      setIndex((v) => Math.max(0, v - 1));
      return;
    }
    if (hitRect(p, nextBtn)) {
      setIndex((v) => Math.min(steps.length - 1, v + 1));
    }
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} height={280} />;
}

export function RationalIrrationalDensityLine() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [points, setPoints] = useState<Array<{ x: number; type: "Q" | "I" }>>([]);
  const activeSlider = useRef<"a" | "b" | null>(null);

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

    const aSlider: UISlider = { x: 70, y: 20, w: p.width - 90, h: 18, min: -2, max: 4, value: a, step: 0.1, label: "A" };
    const bSlider: UISlider = { x: 70, y: 48, w: p.width - 90, h: 18, min: -2, max: 4, value: b, step: 0.1, label: "B" };
    drawCanvasSlider(p, aSlider);
    drawCanvasSlider(p, bSlider);
    drawCanvasButton(p, { x: 18, y: 76, w: 120, h: 26 }, "gerar racional", false);
    drawCanvasButton(p, { x: 148, y: 76, w: 128, h: 26 }, "gerar irracional", true);
    drawCanvasButton(p, { x: 286, y: 76, w: 74, h: 26 }, "limpar", false);

    infoBox(p, `Pontos gerados: ${points.length} (azul=Q, laranja=I)`);
  };

  const mousePressed = (p: p5) => {
    const aSlider: UISlider = { x: 70, y: 20, w: p.width - 90, h: 18, min: -2, max: 4, value: a, step: 0.1, label: "A" };
    const bSlider: UISlider = { x: 70, y: 48, w: p.width - 90, h: 18, min: -2, max: 4, value: b, step: 0.1, label: "B" };
    if (hitRect(p, aSlider)) {
      activeSlider.current = "a";
      setA(sliderValueAtMouse(p, aSlider));
      return;
    }
    if (hitRect(p, bSlider)) {
      activeSlider.current = "b";
      setB(sliderValueAtMouse(p, bSlider));
      return;
    }
    if (hitRect(p, { x: 18, y: 76, w: 120, h: 26 })) {
      addRational();
      return;
    }
    if (hitRect(p, { x: 148, y: 76, w: 128, h: 26 })) {
      addIrrational();
      return;
    }
    if (hitRect(p, { x: 286, y: 76, w: 74, h: 26 })) {
      setPoints([]);
    }
  };

  const mouseDragged = (p: p5) => {
    const aSlider: UISlider = { x: 70, y: 20, w: p.width - 90, h: 18, min: -2, max: 4, value: a, step: 0.1, label: "A" };
    const bSlider: UISlider = { x: 70, y: 48, w: p.width - 90, h: 18, min: -2, max: 4, value: b, step: 0.1, label: "B" };
    if (activeSlider.current === "a") setA(sliderValueAtMouse(p, aSlider));
    if (activeSlider.current === "b") setB(sliderValueAtMouse(p, bSlider));
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} mouseDragged={mouseDragged} mouseReleased={() => { activeSlider.current = null; }} height={320} />;
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

    const options = ["2", "-3", "1/2", "sqrt(2)"];
    options.forEach((id, i) => {
      drawCanvasButton(p, { x: 30 + i * 88, y: p.height - 42, w: 80, h: 26 }, id, sample === id);
    });

    infoBox(p, "Hierarquia: N subset Z subset Q subset R");
  };

  const mousePressed = (p: p5) => {
    const options = ["2", "-3", "1/2", "sqrt(2)"];
    options.forEach((id, i) => {
      if (hitRect(p, { x: 30 + i * 88, y: p.height - 42, w: 80, h: 26 })) {
        setSample(id);
      }
    });
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} height={240} />;
}

export function DensityZoomExplorer() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [depth, setDepth] = useState(0);
  const activeSlider = useRef<"a" | "b" | "n" | null>(null);

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

    const aSlider: UISlider = { x: 58, y: 20, w: p.width - 76, h: 18, min: 0, max: 2, value: a, step: 0.05, label: "A" };
    const bSlider: UISlider = { x: 58, y: 48, w: p.width - 76, h: 18, min: 1, max: 3, value: b, step: 0.05, label: "B" };
    const nSlider: UISlider = { x: 58, y: 76, w: p.width - 76, h: 18, min: 0, max: 10, value: depth, step: 1, label: "n" };
    drawCanvasSlider(p, aSlider);
    drawCanvasSlider(p, bSlider);
    drawCanvasSlider(p, nSlider);

    infoBox(p, `Profundidade de refinamento: ${depth}`);
  };

  const mousePressed = (p: p5) => {
    const aSlider: UISlider = { x: 58, y: 20, w: p.width - 76, h: 18, min: 0, max: 2, value: a, step: 0.05, label: "A" };
    const bSlider: UISlider = { x: 58, y: 48, w: p.width - 76, h: 18, min: 1, max: 3, value: b, step: 0.05, label: "B" };
    const nSlider: UISlider = { x: 58, y: 76, w: p.width - 76, h: 18, min: 0, max: 10, value: depth, step: 1, label: "n" };
    if (hitRect(p, aSlider)) {
      activeSlider.current = "a";
      setA(sliderValueAtMouse(p, aSlider));
      return;
    }
    if (hitRect(p, bSlider)) {
      activeSlider.current = "b";
      setB(sliderValueAtMouse(p, bSlider));
      return;
    }
    if (hitRect(p, nSlider)) {
      activeSlider.current = "n";
      setDepth(sliderValueAtMouse(p, nSlider));
    }
  };

  const mouseDragged = (p: p5) => {
    const aSlider: UISlider = { x: 58, y: 20, w: p.width - 76, h: 18, min: 0, max: 2, value: a, step: 0.05, label: "A" };
    const bSlider: UISlider = { x: 58, y: 48, w: p.width - 76, h: 18, min: 1, max: 3, value: b, step: 0.05, label: "B" };
    const nSlider: UISlider = { x: 58, y: 76, w: p.width - 76, h: 18, min: 0, max: 10, value: depth, step: 1, label: "n" };
    if (activeSlider.current === "a") setA(sliderValueAtMouse(p, aSlider));
    if (activeSlider.current === "b") setB(sliderValueAtMouse(p, bSlider));
    if (activeSlider.current === "n") setDepth(sliderValueAtMouse(p, nSlider));
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} mouseDragged={mouseDragged} mouseReleased={() => { activeSlider.current = null; }} height={300} />;
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
    drawCanvasCheckbox(p, { x: 20, y: p.height - 40, w: 220, h: 24 }, "Fechar extremo direito de B", closedRight);
    infoBox(p, "Supremo pode existir mesmo sem maximo.");
  };

  const mousePressed = (p: p5) => {
    if (hitRect(p, { x: 20, y: p.height - 40, w: 220, h: 24 })) {
      setClosedRight((v) => !v);
    }
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} height={270} />;
}

export function IntervalNotationBuilder() {
  const [a, setA] = useState(-2);
  const [b, setB] = useState(3);
  const [leftClosed, setLeftClosed] = useState(true);
  const [rightClosed, setRightClosed] = useState(false);
  const activeSlider = useRef<"a" | "b" | null>(null);

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

    const aSlider: UISlider = { x: 62, y: 20, w: p.width - 80, h: 18, min: -5, max: 4, value: a, step: 0.1, label: "a" };
    const bSlider: UISlider = { x: 62, y: 48, w: p.width - 80, h: 18, min: -4, max: 5, value: b, step: 0.1, label: "b" };
    drawCanvasSlider(p, aSlider);
    drawCanvasSlider(p, bSlider);
    drawCanvasCheckbox(p, { x: 20, y: p.height - 44, w: 160, h: 24 }, "esquerdo fechado", leftClosed);
    drawCanvasCheckbox(p, { x: 200, y: p.height - 44, w: 160, h: 24 }, "direito fechado", rightClosed);

    infoBox(p, `Intervalo: ${notation}`);
  };

  const mousePressed = (p: p5) => {
    const aSlider: UISlider = { x: 62, y: 20, w: p.width - 80, h: 18, min: -5, max: 4, value: a, step: 0.1, label: "a" };
    const bSlider: UISlider = { x: 62, y: 48, w: p.width - 80, h: 18, min: -4, max: 5, value: b, step: 0.1, label: "b" };
    if (hitRect(p, aSlider)) {
      activeSlider.current = "a";
      setA(sliderValueAtMouse(p, aSlider));
      return;
    }
    if (hitRect(p, bSlider)) {
      activeSlider.current = "b";
      setB(sliderValueAtMouse(p, bSlider));
      return;
    }
    if (hitRect(p, { x: 20, y: p.height - 44, w: 160, h: 24 })) {
      setLeftClosed((v) => !v);
      return;
    }
    if (hitRect(p, { x: 200, y: p.height - 44, w: 160, h: 24 })) {
      setRightClosed((v) => !v);
    }
  };

  const mouseDragged = (p: p5) => {
    const aSlider: UISlider = { x: 62, y: 20, w: p.width - 80, h: 18, min: -5, max: 4, value: a, step: 0.1, label: "a" };
    const bSlider: UISlider = { x: 62, y: 48, w: p.width - 80, h: 18, min: -4, max: 5, value: b, step: 0.1, label: "b" };
    if (activeSlider.current === "a") setA(sliderValueAtMouse(p, aSlider));
    if (activeSlider.current === "b") setB(sliderValueAtMouse(p, bSlider));
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} mouseDragged={mouseDragged} mouseReleased={() => { activeSlider.current = null; }} height={300} />;
}

export function IntervalSetOperationsLab() {
  const [a1, setA1] = useState(0);
  const [a2, setA2] = useState(4);
  const [b1, setB1] = useState(2);
  const [b2, setB2] = useState(6);
  const [op, setOp] = useState<"union" | "inter">("union");
  const activeSlider = useRef<"a1" | "a2" | "b1" | "b2" | null>(null);

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

    drawCanvasSlider(p, { x: 58, y: 18, w: p.width - 76, h: 16, min: -1, max: 7, value: a1, step: 0.1, label: "A1" });
    drawCanvasSlider(p, { x: 58, y: 42, w: p.width - 76, h: 16, min: -1, max: 7, value: a2, step: 0.1, label: "A2" });
    drawCanvasSlider(p, { x: 58, y: 66, w: p.width - 76, h: 16, min: -1, max: 7, value: b1, step: 0.1, label: "B1" });
    drawCanvasSlider(p, { x: 58, y: 90, w: p.width - 76, h: 16, min: -1, max: 7, value: b2, step: 0.1, label: "B2" });
    drawCanvasButton(p, { x: 18, y: p.height - 40, w: 86, h: 26 }, "A U B", op === "union");
    drawCanvasButton(p, { x: 114, y: p.height - 40, w: 86, h: 26 }, "A n B", op === "inter");

    infoBox(p, op === "union" ? "Operacao: A uniao B" : "Operacao: A intersecao B");
  };

  const getSliders = (p: p5) => ({
    a1: { x: 58, y: 18, w: p.width - 76, h: 16, min: -1, max: 7, value: a1, step: 0.1, label: "A1" } satisfies UISlider,
    a2: { x: 58, y: 42, w: p.width - 76, h: 16, min: -1, max: 7, value: a2, step: 0.1, label: "A2" } satisfies UISlider,
    b1: { x: 58, y: 66, w: p.width - 76, h: 16, min: -1, max: 7, value: b1, step: 0.1, label: "B1" } satisfies UISlider,
    b2: { x: 58, y: 90, w: p.width - 76, h: 16, min: -1, max: 7, value: b2, step: 0.1, label: "B2" } satisfies UISlider,
  });

  const mousePressed = (p: p5) => {
    const sliders = getSliders(p);
    if (hitRect(p, sliders.a1)) {
      activeSlider.current = "a1";
      setA1(sliderValueAtMouse(p, sliders.a1));
      return;
    }
    if (hitRect(p, sliders.a2)) {
      activeSlider.current = "a2";
      setA2(sliderValueAtMouse(p, sliders.a2));
      return;
    }
    if (hitRect(p, sliders.b1)) {
      activeSlider.current = "b1";
      setB1(sliderValueAtMouse(p, sliders.b1));
      return;
    }
    if (hitRect(p, sliders.b2)) {
      activeSlider.current = "b2";
      setB2(sliderValueAtMouse(p, sliders.b2));
      return;
    }
    if (hitRect(p, { x: 18, y: p.height - 40, w: 86, h: 26 })) {
      setOp("union");
      return;
    }
    if (hitRect(p, { x: 114, y: p.height - 40, w: 86, h: 26 })) {
      setOp("inter");
    }
  };

  const mouseDragged = (p: p5) => {
    const sliders = getSliders(p);
    if (activeSlider.current === "a1") setA1(sliderValueAtMouse(p, sliders.a1));
    if (activeSlider.current === "a2") setA2(sliderValueAtMouse(p, sliders.a2));
    if (activeSlider.current === "b1") setB1(sliderValueAtMouse(p, sliders.b1));
    if (activeSlider.current === "b2") setB2(sliderValueAtMouse(p, sliders.b2));
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} mouseDragged={mouseDragged} mouseReleased={() => { activeSlider.current = null; }} height={330} />;
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

    drawCanvasButton(p, { x: 20, y: p.height - 40, w: 112, h: 26 }, "f(x)=1/(x-2)", preset === "f");
    drawCanvasButton(p, { x: 142, y: p.height - 40, w: 112, h: 26 }, "g(x)=sqrt(x-3)", preset === "g");
    drawCanvasButton(p, { x: 264, y: p.height - 40, w: 112, h: 26 }, "h(x)=1/sqrt(x+1)", preset === "h");
  };

  const mousePressed = (p: p5) => {
    if (hitRect(p, { x: 20, y: p.height - 40, w: 112, h: 26 })) {
      setPreset("f");
      return;
    }
    if (hitRect(p, { x: 142, y: p.height - 40, w: 112, h: 26 })) {
      setPreset("g");
      return;
    }
    if (hitRect(p, { x: 264, y: p.height - 40, w: 112, h: 26 })) {
      setPreset("h");
    }
  };

  return <P5Sketch setup={() => {}} draw={draw} mousePressed={mousePressed} height={290} />;
}

type NumberLineVariant =
  | "integers-overview"
  | "marked-points"
  | "abs-leq-2"
  | "rational-irrational-reference"
  | "real-compare";

function drawArrow(p: p5, x1: number, y1: number, x2: number, y2: number) {
  p.line(x1, y1, x2, y2);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 8;
  p.line(x2, y2, x2 - size * Math.cos(angle - Math.PI / 6), y2 - size * Math.sin(angle - Math.PI / 6));
  p.line(x2, y2, x2 - size * Math.cos(angle + Math.PI / 6), y2 - size * Math.sin(angle + Math.PI / 6));
}

export function NumberLineReferenceDiagram({ variant = "integers-overview" }: { variant?: NumberLineVariant }) {
  const draw = (p: p5) => {
    p.background(250);

    if (variant === "rational-irrational-reference") {
      const b: Bounds = { xMin: -1.2, xMax: 4.2, yMin: -1, yMax: 1 };
      drawGrid(p, b, 44);
      const y = mapY(p, 0, b, 44);

      p.stroke(50);
      p.strokeWeight(2);
      drawArrow(p, mapX(p, b.xMin, b, 44), y, mapX(p, b.xMax, b, 44), y);

      const rationals = [
        { x: 0.5, label: "1/2" },
        { x: 1.5, label: "1.5" },
        { x: 2.5, label: "2.5" },
      ];
      const irrationals = [
        { x: Math.sqrt(2), label: "sqrt(2)" },
        { x: Math.PI, label: "pi" },
        { x: Math.E, label: "e" },
      ];

      p.noStroke();
      p.fill(30);
      for (let i = -1; i <= 4; i += 1) {
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(10);
        p.text(String(i), mapX(p, i, b, 44), y + 10);
      }

      rationals.forEach((pt) => {
        p.fill(37, 99, 235);
        p.circle(mapX(p, pt.x, b, 44), y, 8);
        p.fill(37, 99, 235);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(10);
        p.text(pt.label, mapX(p, pt.x, b, 44), y - 12);
      });

      irrationals.forEach((pt) => {
        p.fill(245, 158, 11);
        p.circle(mapX(p, pt.x, b, 44), y, 8);
        p.fill(245, 158, 11);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(10);
        p.text(pt.label, mapX(p, pt.x, b, 44), y - 26);
      });

      infoBox(p, "Azul: racionais | Laranja: irracionais");
      return;
    }

    if (variant === "real-compare") {
      const b: Bounds = { xMin: -2.5, xMax: 2.4, yMin: -1, yMax: 1 };
      drawGrid(p, b, 44);
      const y = mapY(p, 0, b, 44);

      p.stroke(50);
      p.strokeWeight(2);
      drawArrow(p, mapX(p, b.xMin, b, 44), y, mapX(p, b.xMax, b, 44), y);

      const points = [-2, -1, 0, 1, Math.sqrt(2), 2];
      const labels = ["-2", "-1", "0", "1", "sqrt(2)", "2"];
      p.noStroke();
      points.forEach((x, i) => {
        p.fill(i === 4 ? 245 : 37, i === 4 ? 158 : 99, i === 4 ? 11 : 235);
        p.circle(mapX(p, x, b, 44), y, 9);
        p.fill(30);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(10);
        p.text(labels[i], mapX(p, x, b, 44), y + 10);
      });

      p.fill(60);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(10);
      p.text("menor", mapX(p, -2.35, b, 44), y - 14);
      p.text("maior", mapX(p, 1.9, b, 44), y - 14);

      infoBox(p, "Ordenacao na reta: esquerda < direita");
      return;
    }

    const b: Bounds = { xMin: -5.8, xMax: 5.8, yMin: -1, yMax: 1 };
    drawGrid(p, b, 44);
    const y = mapY(p, 0, b, 44);

    p.stroke(50);
    p.strokeWeight(2);
    drawArrow(p, mapX(p, b.xMin, b, 44), y, mapX(p, b.xMax, b, 44), y);

    p.noStroke();
    for (let x = -5; x <= 5; x += 1) {
      p.fill(30);
      p.circle(mapX(p, x, b, 44), y, 4);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(10);
      p.text(String(x), mapX(p, x, b, 44), y + 9);
    }

    if (variant === "integers-overview") {
      p.fill(80);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(10);
      p.text("mais negativos", mapX(p, -5.5, b, 44), y - 16);
      p.text("mais positivos", mapX(p, 3.2, b, 44), y - 16);
      infoBox(p, "Zero e referencia; esquerda menor, direita maior");
      return;
    }

    if (variant === "marked-points") {
      const marked = [-4, -1, 0, 2, 3];
      marked.forEach((x) => {
        p.fill(16, 185, 129);
        p.circle(mapX(p, x, b, 44), y, 11);
      });
      infoBox(p, "Pontos marcados: -4, -1, 0, 2, 3");
      return;
    }

    p.stroke(16, 185, 129);
    p.strokeWeight(5);
    p.line(mapX(p, -2, b, 44), y - 16, mapX(p, 2, b, 44), y - 16);
    p.noStroke();
    p.fill(16, 185, 129);
    p.circle(mapX(p, -2, b, 44), y - 16, 11);
    p.circle(mapX(p, 2, b, 44), y - 16, 11);
    infoBox(p, "Intervalo: -2 <= x <= 2");
  };

  return <P5Sketch setup={() => {}} draw={draw} height={230} />;
}

export function RealSetHierarchyStaticDiagram() {
  const draw = (p: p5) => {
    p.background(250);

    p.noStroke();
    p.fill(225, 238, 255);
    p.rect(24, 24, p.width - 48, p.height - 48, 14);

    p.fill(255, 248, 220);
    p.rect(56, 66, p.width - 112, p.height - 128, 12);

    p.fill(232, 250, 240);
    p.rect(88, 100, p.width - 176, p.height - 196, 10);

    p.fill(250, 236, 255);
    p.rect(120, 132, p.width - 240, p.height - 260, 8);

    p.fill(30);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(14);
    p.text("R (Reais)", 36, 34);
    p.text("Q (Racionais)", 68, 74);
    p.text("Z (Inteiros)", 100, 108);
    p.text("N (Naturais)", 132, 140);

    p.textSize(12);
    p.text("Irracionais: sqrt(2), pi, e, ...", p.width - 270, 72);
    p.text("Fracoes nao inteiras", p.width - 210, 108);
    p.text("Negativos + zero", p.width - 190, 140);

    infoBox(p, "Hierarquia: N subset Z subset Q subset R");
  };

  return <P5Sketch setup={() => {}} draw={draw} height={280} />;
}

type IntervalExampleVariant =
  | "closed-13"
  | "open-13"
  | "half-13"
  | "ray-2-inf"
  | "basic-types"
  | "union-13-25"
  | "inter-13-25"
  | "complement-13"
  | "union-02-14"
  | "inter-02-14"
  | "union-complex"
  | "inter-complex"
  | "difference-03-12";

function drawOpenPoint(p: p5, x: number, y: number) {
  p.stroke(20);
  p.strokeWeight(2);
  p.fill(255);
  p.circle(x, y, 10);
}

function drawClosedPoint(p: p5, x: number, y: number, color: [number, number, number]) {
  p.noStroke();
  p.fill(...color);
  p.circle(x, y, 10);
}

export function IntervalWorkedExampleDiagram({ variant = "basic-types" }: { variant?: IntervalExampleVariant }) {
  const drawInterval = (
    p: p5,
    b: Bounds,
    y: number,
    left: number,
    right: number,
    leftClosed: boolean,
    rightClosed: boolean,
    color: [number, number, number],
  ) => {
    p.stroke(...color);
    p.strokeWeight(4);
    p.line(mapX(p, left, b, 44), y, mapX(p, right, b, 44), y);
    if (leftClosed) {
      drawClosedPoint(p, mapX(p, left, b, 44), y, color);
    } else {
      drawOpenPoint(p, mapX(p, left, b, 44), y);
    }
    if (rightClosed) {
      drawClosedPoint(p, mapX(p, right, b, 44), y, color);
    } else {
      drawOpenPoint(p, mapX(p, right, b, 44), y);
    }
  };

  const draw = (p: p5) => {
    p.background(251);
    const b: Bounds = { xMin: -2.6, xMax: 5.2, yMin: -1, yMax: 4 };
    drawGrid(p, b, 44);

    if (variant === "closed-13" || variant === "open-13" || variant === "half-13" || variant === "ray-2-inf") {
      const y = p.height * 0.54;
      if (variant === "closed-13") {
        drawInterval(p, b, y, 1, 3, true, true, [37, 99, 235]);
        infoBox(p, "[1, 3]: extremos incluidos");
      } else if (variant === "open-13") {
        drawInterval(p, b, y, 1, 3, false, false, [37, 99, 235]);
        infoBox(p, "(1, 3): extremos excluidos");
      } else if (variant === "half-13") {
        drawInterval(p, b, y, 1, 3, true, false, [37, 99, 235]);
        infoBox(p, "[1, 3): inclui 1 e exclui 3");
      } else {
        p.stroke(16, 185, 129);
        p.strokeWeight(4);
        p.line(mapX(p, 2, b, 44), y, mapX(p, 5, b, 44), y);
        drawOpenPoint(p, mapX(p, 2, b, 44), y);
        drawArrow(p, mapX(p, 4.6, b, 44), y, mapX(p, 5, b, 44), y);
        infoBox(p, "(2, inf): maior que 2");
      }
      return;
    }

    if (variant === "basic-types") {
      const rows = [
        { y: 62, label: "[1, 3]", l: true, r: true },
        { y: 104, label: "(1, 3)", l: false, r: false },
        { y: 146, label: "[1, 3)", l: true, r: false },
      ];
      rows.forEach((row) => {
        drawInterval(p, b, row.y, 1, 3, row.l, row.r, [37, 99, 235]);
        p.fill(30);
        p.noStroke();
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(11);
        p.text(row.label, 14, row.y);
      });

      const y = 188;
      p.stroke(16, 185, 129);
      p.strokeWeight(4);
      p.line(mapX(p, 2, b, 44), y, mapX(p, 5, b, 44), y);
      drawOpenPoint(p, mapX(p, 2, b, 44), y);
      drawArrow(p, mapX(p, 4.6, b, 44), y, mapX(p, 5, b, 44), y);
      p.noStroke();
      p.fill(30);
      p.textAlign(p.LEFT, p.CENTER);
      p.text("(2, inf)", 14, y);
      infoBox(p, "Comparacao: fechado, aberto, semiaberto e infinito");
      return;
    }

    const yA = 72;
    const yB = 114;
    const yR = 168;

    if (variant === "union-13-25" || variant === "inter-13-25" || variant === "complement-13") {
      drawInterval(p, b, yA, 1, 3, true, true, [37, 99, 235]);
      drawInterval(p, b, yB, 2, 5, false, false, [16, 185, 129]);
      p.noStroke();
      p.fill(30);
      p.text("A=[1,3]", 14, yA + 4);
      p.text("B=(2,5)", 14, yB + 4);

      if (variant === "union-13-25") {
        drawInterval(p, b, yR, 1, 5, true, false, [245, 158, 11]);
        p.fill(30);
        p.text("A union B = [1,5)", 14, yR + 4);
        infoBox(p, "Uniao: todos os pontos de A ou B");
      } else if (variant === "inter-13-25") {
        drawInterval(p, b, yR, 2, 3, false, true, [245, 158, 11]);
        p.fill(30);
        p.text("A inter B = (2,3]", 14, yR + 4);
        infoBox(p, "Intersecao: somente sobreposicao");
      } else {
        p.stroke(245, 158, 11);
        p.strokeWeight(4);
        p.line(mapX(p, -2.5, b, 44), yR, mapX(p, 1, b, 44), yR);
        p.line(mapX(p, 3, b, 44), yR, mapX(p, 5, b, 44), yR);
        drawArrow(p, mapX(p, -2.2, b, 44), yR, mapX(p, -2.5, b, 44), yR);
        drawArrow(p, mapX(p, 4.6, b, 44), yR, mapX(p, 5, b, 44), yR);
        drawOpenPoint(p, mapX(p, 1, b, 44), yR);
        drawOpenPoint(p, mapX(p, 3, b, 44), yR);
        p.noStroke();
        p.fill(30);
        p.text("A^c = (-inf,1) union (3,inf)", 14, yR + 4);
        infoBox(p, "Complementar: tudo que nao esta em A");
      }
      return;
    }

    if (variant === "union-02-14" || variant === "inter-02-14") {
      drawInterval(p, b, yA, 0, 2, true, true, [37, 99, 235]);
      drawInterval(p, b, yB, 1, 4, false, false, [16, 185, 129]);
      p.noStroke();
      p.fill(30);
      p.text("A=[0,2]", 14, yA + 4);
      p.text("B=(1,4)", 14, yB + 4);

      if (variant === "union-02-14") {
        drawInterval(p, b, yR, 0, 4, true, false, [245, 158, 11]);
        p.fill(30);
        p.text("A union B = [0,4)", 14, yR + 4);
        infoBox(p, "Exemplo de uniao para A=[0,2], B=(1,4)");
      } else {
        drawInterval(p, b, yR, 1, 2, false, true, [245, 158, 11]);
        p.fill(30);
        p.text("A inter B = (1,2]", 14, yR + 4);
        infoBox(p, "Exemplo de intersecao para A=[0,2], B=(1,4)");
      }
      return;
    }

    if (variant === "union-complex") {
      drawInterval(p, b, yA, -2, 1, true, false, [37, 99, 235]);
      drawInterval(p, b, yB, 0, 3, false, true, [16, 185, 129]);
      drawInterval(p, b, yR, -2, 3, true, true, [245, 158, 11]);
      p.noStroke();
      p.fill(30);
      p.text("A=[-2,1)", 14, yA + 4);
      p.text("B=(0,3]", 14, yB + 4);
      p.text("A union B = [-2,3]", 14, yR + 4);
      infoBox(p, "Primeiro passo de (A union B) inter C");
      return;
    }

    if (variant === "inter-complex") {
      drawInterval(p, b, yA, -2, 3, true, true, [245, 158, 11]);
      drawInterval(p, b, yB, 1, 2, true, true, [16, 185, 129]);
      drawInterval(p, b, yR, 1, 2, true, true, [37, 99, 235]);
      p.noStroke();
      p.fill(30);
      p.text("A union B = [-2,3]", 14, yA + 4);
      p.text("C=[1,2]", 14, yB + 4);
      p.text("(A union B) inter C = [1,2]", 14, yR + 4);
      infoBox(p, "Segundo passo: interseccao com C");
      return;
    }

    drawInterval(p, b, yA, 0, 3, true, true, [37, 99, 235]);
    drawInterval(p, b, yB, 1, 2, false, false, [220, 38, 38]);
    p.stroke(245, 158, 11);
    p.strokeWeight(4);
    p.line(mapX(p, 0, b, 44), yR, mapX(p, 1, b, 44), yR);
    p.line(mapX(p, 2, b, 44), yR, mapX(p, 3, b, 44), yR);
    drawClosedPoint(p, mapX(p, 0, b, 44), yR, [245, 158, 11]);
    drawClosedPoint(p, mapX(p, 1, b, 44), yR, [245, 158, 11]);
    drawClosedPoint(p, mapX(p, 2, b, 44), yR, [245, 158, 11]);
    drawClosedPoint(p, mapX(p, 3, b, 44), yR, [245, 158, 11]);
    p.noStroke();
    p.fill(30);
    p.text("A=[0,3]", 14, yA + 4);
    p.text("B=(1,2)", 14, yB + 4);
    p.text("A \\ B = [0,1] union [2,3]", 14, yR + 4);
    infoBox(p, "Diferenca: elementos de A que nao estao em B");
  };

  return <P5Sketch setup={() => {}} draw={draw} height={230} />;
}

export const __preCalculoP5Module = true;

