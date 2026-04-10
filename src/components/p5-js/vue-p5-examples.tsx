"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

// Visualization 1: Imperative DOM manipulation vs Reactive (Vue)
// Shows how imperative code manually updates each element, while reactive code
// automatically propagates changes.
export function ImperativeVsReactive() {
  let stateValue = 0;
  let animPhase = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);

    const w = p.width;
    const h = p.height;
    const halfW = w / 2;

    // Divider
    p.stroke(60);
    p.strokeWeight(1);
    p.line(halfW, 0, halfW, h);

    // Labels
    p.noStroke();
    p.fill(150);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Manipulação Manual (Imperativo)", halfW / 2, 15);
    p.text("Reatividade Automática (Vue.js)", halfW + halfW / 2, 15);

    // Animate state changes
    animPhase += 0.02;
    if (animPhase > Math.PI * 2) animPhase -= Math.PI * 2;

    stateValue = Math.floor(Math.sin(animPhase) * 50 + 50);

    // === LEFT SIDE: Imperative ===
    // State box
    p.fill(40);
    p.rect(halfW / 2 - 60, 50, 120, 40, 8);
    p.fill(254, 0, 81);
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`estado = ${stateValue}`, halfW / 2, 70);

    // Manual update arrows with delay
    const impeY = [130, 190, 250];
    for (let i = 0; i < 3; i++) {
      // Delayed update for imperative side
      const delay = i * 15;
      const delayedVal = Math.floor(
        Math.sin(animPhase - delay * 0.02) * 50 + 50,
      );

      // Arrow from state to element
      p.stroke(100, 150, 250, 100);
      p.strokeWeight(1);
      const arrowStartY = 90;
      p.line(halfW / 2, arrowStartY, halfW / 2 - 80 + i * 80, impeY[i] - 15);

      // Element box
      p.noStroke();
      p.fill(30, 40, 60);
      p.rect(halfW / 2 - 80 + i * 80 - 30, impeY[i] - 15, 60, 30, 6);
      p.fill(200);
      p.textSize(12);
      p.text(`${delayedVal}`, halfW / 2 - 80 + i * 80, impeY[i]);

      // Manual update label
      p.fill(100);
      p.textSize(9);
      p.text(`el${i + 1}.textContent = ...`, halfW / 2 - 80 + i * 80, impeY[i] + 25);
    }

    // Show "out of sync" indicator
    p.fill(254, 100, 100);
    p.textSize(11);
    p.text("⚠ Atualizações manuais", halfW / 2, 300);
    p.text("podem ficar dessincronizadas", halfW / 2, 315);

    // === RIGHT SIDE: Reactive (Vue) ===
    // State box
    const rx = halfW + halfW / 2;
    p.noStroke();
    p.fill(40);
    p.rect(rx - 60, 50, 120, 40, 8);
    p.fill(66, 184, 131); // Vue green
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`ref(${stateValue})`, rx, 70);

    // Reactive arrows - all in sync
    const reactY = [130, 190, 250];
    for (let i = 0; i < 3; i++) {
      // Arrow
      p.stroke(66, 184, 131, 150);
      p.strokeWeight(2);
      p.line(rx, 90, rx - 80 + i * 80, reactY[i] - 15);

      // Pulse effect on the arrow
      const pulse = Math.sin(animPhase * 3 + i) * 0.5 + 0.5;
      p.stroke(66, 184, 131, pulse * 200);
      p.strokeWeight(3);
      const midX = (rx + rx - 80 + i * 80) / 2;
      const midY = (90 + reactY[i] - 15) / 2;
      p.point(midX, midY);

      // Element box - all show same value (in sync)
      p.noStroke();
      p.fill(20, 50, 40);
      p.rect(rx - 80 + i * 80 - 30, reactY[i] - 15, 60, 30, 6);
      p.fill(200);
      p.textSize(12);
      p.text(`${stateValue}`, rx - 80 + i * 80, reactY[i]);

      // Auto-update label
      p.fill(80);
      p.textSize(9);
      p.text(`{{ estado }}`, rx - 80 + i * 80, reactY[i] + 25);
    }

    // Show "in sync" indicator
    p.fill(66, 184, 131);
    p.textSize(11);
    p.text("✓ Todas as views atualizadas", rx, 300);
    p.text("automaticamente", rx, 315);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 2: Virtual DOM diffing concept
export function VirtualDomDiff() {
  let currentStep = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const mousePressed = (p: p5) => {
    const w = p.width;
    const h = p.height;
    // Check if a dot was clicked
    for (let i = 0; i < 4; i++) {
      const dotX = w / 2 - 30 + i * 20;
      const dotY = h - 20;
      const d = p.dist(p.mouseX, p.mouseY, dotX, dotY);
      if (d < 10) {
        currentStep = i;
      }
    }
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);

    const step = currentStep;
    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(150);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    const steps = [
      "1. Estado atual do DOM Virtual",
      "2. Estado muda → novo DOM Virtual",
      "3. Vue compara (diff) as duas árvores",
      "4. Aplica apenas as mudanças necessárias no DOM real",
    ];
    p.text(steps[step], w / 2, 10);

    // Draw tree structure
    const drawTree = (
      cx: number,
      cy: number,
      label: string,
      children: string[],
      highlightIdx: number,
      color: number[],
    ) => {
      // Root
      p.fill(color[0], color[1], color[2]);
      p.noStroke();
      p.rect(cx - 30, cy, 60, 25, 6);
      p.fill(255);
      p.textSize(11);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(label, cx, cy + 12);

      // Children
      children.forEach((child, i) => {
        const childX = cx - 60 + i * 60;
        const childY = cy + 55;

        // Line
        p.stroke(80);
        p.strokeWeight(1);
        p.line(cx, cy + 25, childX, childY);

        // Child node
        const isHighlighted = i === highlightIdx;
        p.noStroke();
        if (isHighlighted && step >= 2) {
          p.fill(254, 200, 0, 200);
        } else {
          p.fill(50, 60, 80);
        }
        p.rect(childX - 25, childY, 50, 22, 5);
        p.fill(isHighlighted && step >= 2 ? 0 : 200);
        p.textSize(10);
        p.text(child, childX, childY + 11);
      });
    };

    if (step === 0) {
      drawTree(w / 2, 50, "<div>", ["<h1>", "<p>", "<btn>"], -1, [66, 184, 131]);
      p.fill(100);
      p.textSize(11);
      p.textAlign(p.CENTER);
      p.text("DOM Virtual", w / 2, 150);

      p.fill(40);
      p.rect(w / 2 - 100, 170, 200, 120, 8);
      p.fill(200);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text("  Título", w / 2 - 80, 190);
      p.text("  Parágrafo de texto", w / 2 - 80, 215);
      p.text("  [ Botão ]", w / 2 - 80, 240);
      p.fill(80);
      p.textSize(10);
      p.textAlign(p.CENTER);
      p.text("DOM Real (navegador)", w / 2, 300);
    } else if (step === 1) {
      drawTree(w / 4, 50, "<div>", ["<h1>", "<p>", "<btn>"], -1, [80, 80, 80]);
      p.fill(80);
      p.textSize(10);
      p.textAlign(p.CENTER);
      p.text("anterior", w / 4, 145);

      drawTree(
        (w * 3) / 4,
        50,
        "<div>",
        ["<h1>", "<p>*", "<btn>"],
        1,
        [66, 184, 131],
      );
      p.fill(66, 184, 131);
      p.textSize(10);
      p.textAlign(p.CENTER);
      p.text("novo (após mudança)", (w * 3) / 4, 145);

      p.fill(254, 200, 0);
      p.textSize(20);
      p.text("→", w / 2, 80);
    } else if (step === 2) {
      drawTree(w / 4, 50, "<div>", ["<h1>", "<p>", "<btn>"], 1, [80, 80, 80]);
      drawTree(
        (w * 3) / 4,
        50,
        "<div>",
        ["<h1>", "<p>*", "<btn>"],
        1,
        [66, 184, 131],
      );

      const pulse = Math.sin(p.frameCount * 0.1) * 0.5 + 0.5;
      p.noFill();
      p.stroke(254, 200, 0, 100 + pulse * 155);
      p.strokeWeight(2);
      p.rect(w / 4 - 60 + 60 - 28, 103, 56, 26, 7);
      p.rect((w * 3) / 4 - 60 + 60 - 28, 103, 56, 26, 7);

      p.noStroke();
      p.fill(254, 200, 0);
      p.textSize(12);
      p.textAlign(p.CENTER);
      p.text("diferença encontrada!", w / 2, 160);

      p.fill(150);
      p.textSize(11);
      p.text("Apenas <p> mudou", w / 2, 180);
    } else {
      p.fill(40);
      p.rect(w / 2 - 100, 50, 200, 120, 8);
      p.fill(200);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text("  Título", w / 2 - 80, 70);

      const pulse = Math.sin(p.frameCount * 0.15) * 0.5 + 0.5;
      p.fill(66, 184, 131, 30 + pulse * 40);
      p.rect(w / 2 - 90, 90, 180, 25, 4);
      p.fill(66, 184, 131);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text("  Parágrafo atualizado ✓", w / 2 - 80, 95);

      p.fill(200);
      p.text("  [ Botão ]", w / 2 - 80, 120);

      p.noStroke();
      p.fill(80);
      p.textSize(10);
      p.textAlign(p.CENTER);
      p.text("DOM Real — apenas 1 elemento atualizado!", w / 2, 190);

      p.fill(66, 184, 131);
      p.textSize(14);
      p.text("⚡ Mínimas operações no DOM", w / 2, 220);
    }

    // Instruction label above dots
    // p.noStroke();
    // p.fill(80);
    // p.textSize(10);
    // p.textAlign(p.CENTER);
    // p.text("Clique em um dos pontos para mudar o slide", w / 2, h - 38);

    // Step indicator dots (clickable)
    for (let i = 0; i < 4; i++) {
      const dotX = w / 2 - 30 + i * 20;
      const dotY = h - 20;
      const isHovered = p.dist(p.mouseX, p.mouseY, dotX, dotY) < 10;

      if (i === step) {
        p.fill(66, 184, 131);
      } else if (isHovered) {
        p.fill(100, 100, 100);
      } else {
        p.fill(40, 40, 40);
      }
      p.noStroke();
      p.circle(dotX, dotY, 10);
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={340} />;
}

// Visualization 3: Vue.js ecosystem / progressive framework concept
export function ProgressiveFramework() {
  let hoveredLayer = -1;
  let animOffset = 0;

  const layers = [
    { label: "Vue Core", desc: "Reatividade + Componentes", color: [66, 184, 131], w: 100 },
    { label: "+ Vue Router", desc: "Navegação SPA", color: [52, 152, 219], w: 160 },
    { label: "+ Pinia", desc: "Gerenciamento de estado", color: [155, 89, 182], w: 220 },
    { label: "+ Nuxt.js", desc: "SSR / SSG / Full-stack", color: [230, 126, 34], w: 280 },
    { label: "+ Ecossistema", desc: "Testes, DevTools, UI libs...", color: [231, 76, 60], w: 340 },
  ];

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    animOffset += 0.02;

    const w = p.width;
    const h = p.height;
    const cx = w / 2;
    const startY = 40;
    const layerH = 48;
    const gap = 6;

    // Title
    p.noStroke();
    p.fill(150);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("Framework Progressivo — Use apenas o que precisa", cx, 10);

    // Check mouse hover
    hoveredLayer = -1;
    for (let i = 0; i < layers.length; i++) {
      const ly = startY + i * (layerH + gap);
      const lw = layers[i].w;
      if (
        p.mouseX > cx - lw / 2 &&
        p.mouseX < cx + lw / 2 &&
        p.mouseY > ly &&
        p.mouseY < ly + layerH
      ) {
        hoveredLayer = i;
      }
    }

    // Draw layers
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      const ly = startY + i * (layerH + gap);
      const isHovered = hoveredLayer >= i;

      // Pulse for hovered
      const pulse = isHovered ? Math.sin(animOffset * 3) * 5 : 0;
      const alpha = isHovered ? 255 : 120;

      // Layer rect
      p.fill(layer.color[0], layer.color[1], layer.color[2], alpha);
      p.noStroke();
      p.rect(cx - layer.w / 2 - pulse, ly, layer.w + pulse * 2, layerH, 8);

      // Label
      p.fill(255, 255, 255, alpha);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(12);
      p.text(layer.label, cx, ly + 16);
      p.fill(255, 255, 255, alpha * 0.7);
      p.textSize(10);
      p.text(layer.desc, cx, ly + 33);
    }

    // Instruction
    p.fill(80);
    p.textSize(10);
    p.textAlign(p.CENTER);
    p.text("Passe o mouse para explorar as camadas", cx, h - 15);
  };

  return <P5Sketch setup={setup} draw={draw} height={330} />;
}

