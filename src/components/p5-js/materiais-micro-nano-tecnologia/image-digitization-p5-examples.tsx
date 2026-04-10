"use client";

import { P5Sketch } from "../p5-sketch";
import type p5 from "p5";

// Visualization 1: Image as a pixel matrix — shows how an image is a grid of pixels with (row, col) coordinates
export function PixelMatrixVisualization() {
  let time = 0;
  let highlightRow = 0;
  let highlightCol = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.02;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Imagem como Matriz de Pixels", w / 2, 12);

    const gridRows = 8;
    const gridCols = 12;
    const cellSize = Math.min((w - 160) / gridCols, (h - 120) / gridRows);
    const gridW = gridCols * cellSize;
    const gridH = gridRows * cellSize;
    const startX = (w - gridW) / 2;
    const startY = 55;

    // Animate highlighted pixel
    highlightRow = Math.floor((Math.sin(time * 0.8) * 0.5 + 0.5) * gridRows) % gridRows;
    highlightCol = Math.floor((Math.cos(time * 0.6) * 0.5 + 0.5) * gridCols) % gridCols;

    // Draw pixel grid with grayscale gradient (simple image)
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const x = startX + c * cellSize;
        const y = startY + r * cellSize;

        // Generate a simple gradient-like pattern
        const val = Math.floor(
          128 + 80 * Math.sin((r * 0.8) + (c * 0.5)) + 40 * Math.cos(r * 0.3 - c * 0.7)
        );
        const clampedVal = Math.max(0, Math.min(255, val));

        p.fill(clampedVal);
        p.stroke(40);
        p.strokeWeight(1);
        p.rect(x, y, cellSize, cellSize);

        // Show value in cell
        if (cellSize > 22) {
          p.noStroke();
          p.fill(clampedVal > 128 ? 0 : 255);
          p.textSize(8);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(clampedVal.toString(), x + cellSize / 2, y + cellSize / 2);
        }
      }
    }

    // Highlight selected pixel
    const hx = startX + highlightCol * cellSize;
    const hy = startY + highlightRow * cellSize;
    p.noFill();
    p.stroke(0, 200, 255);
    p.strokeWeight(3);
    p.rect(hx, hy, cellSize, cellSize);

    // Row labels
    p.noStroke();
    p.fill(100, 180, 255);
    p.textSize(9);
    p.textAlign(p.RIGHT, p.CENTER);
    for (let r = 0; r < gridRows; r++) {
      p.text(`${r}`, startX - 8, startY + r * cellSize + cellSize / 2);
    }

    // Col labels
    p.textAlign(p.CENTER, p.BOTTOM);
    for (let c = 0; c < gridCols; c++) {
      p.text(`${c}`, startX + c * cellSize + cellSize / 2, startY - 3);
    }

    // Axis labels
    p.fill(150);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("coluna (j)", startX + gridW / 2, startY - 14);
    p.push();
    p.translate(startX - 24, startY + gridH / 2);
    p.rotate(-p.HALF_PI);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("linha (i)", 0, 0);
    p.pop();

    // Info panel for highlighted pixel
    const infoX = startX + gridW + 15;
    const infoY = startY + 10;
    const pixVal = Math.floor(
      128 + 80 * Math.sin((highlightRow * 0.8) + (highlightCol * 0.5)) + 40 * Math.cos(highlightRow * 0.3 - highlightCol * 0.7)
    );
    const clampedPixVal = Math.max(0, Math.min(255, pixVal));

    // Draw connection line
    p.stroke(0, 200, 255, 100);
    p.strokeWeight(1);
    p.line(hx + cellSize, hy + cellSize / 2, infoX, infoY + 30);

    p.noStroke();
    p.fill(20, 30, 50);
    p.rect(infoX, infoY, 120, 80, 8);
    p.fill(0, 200, 255);
    p.textSize(11);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Pixel selecionado:", infoX + 8, infoY + 8);
    p.fill(200);
    p.textSize(10);
    p.text(`Posição: (${highlightRow}, ${highlightCol})`, infoX + 8, infoY + 28);
    p.text(`Valor: ${clampedPixVal}`, infoX + 8, infoY + 44);

    // Mini preview of the pixel color
    p.fill(clampedPixVal);
    p.stroke(80);
    p.strokeWeight(1);
    p.rect(infoX + 80, infoY + 42, 28, 28, 4);

    // Formula
    p.noStroke();
    p.fill(150);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("I(i, j) = intensidade do pixel na posição (linha, coluna)", w / 2, h - 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

// Visualization 2: Grayscale levels — shows how bits determine grayscale levels
export function GrayscaleLevels() {
  let time = 0;
  let currentBits = 3;
  let targetBits = 8;
  let transitionProgress = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    // Auto-cycle through bit depths
    const cycle = Math.floor(time / 3) % 5;
    const bitsOptions = [1, 2, 3, 4, 8];
    targetBits = bitsOptions[cycle];

    if (currentBits !== targetBits) {
      transitionProgress += 0.05;
      if (transitionProgress >= 1) {
        currentBits = targetBits;
        transitionProgress = 0;
      }
    }

    const bits = currentBits;
    const levels = Math.pow(2, bits);

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Escala de Cinza: Níveis por Número de Bits", w / 2, 12);

    // Bit depth indicator
    p.fill(0, 200, 255);
    p.textSize(18);
    p.textAlign(p.CENTER, p.TOP);
    p.text(`b = ${bits} bits → 2${superscript(bits)} = ${levels} níveis`, w / 2, 36);

    // Draw grayscale bar
    const barY = 75;
    const barH = 60;
    const barMargin = 40;
    const barW = w - barMargin * 2;
    const stripW = barW / levels;

    for (let i = 0; i < levels; i++) {
      const val = Math.floor((i / (levels - 1)) * 255);
      const x = barMargin + i * stripW;
      p.fill(val);
      p.noStroke();
      p.rect(x, barY, stripW + 1, barH);

      // Show value labels for small number of levels
      if (levels <= 16) {
        p.fill(val > 128 ? 0 : 255);
        p.textSize(stripW > 30 ? 10 : 7);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`${val}`, x + stripW / 2, barY + barH / 2);
      }
    }

    // Border
    p.noFill();
    p.stroke(60);
    p.strokeWeight(1);
    p.rect(barMargin, barY, barW, barH);

    // Labels
    p.noStroke();
    p.fill(150);
    p.textSize(9);
    p.textAlign(p.LEFT, p.TOP);
    p.text("0 (preto)", barMargin, barY + barH + 5);
    p.textAlign(p.RIGHT, p.TOP);
    p.text(`${levels - 1} (branco)`, barMargin + barW, barY + barH + 5);

    // Example image quantized with current bits
    const imgY = barY + barH + 35;
    const imgRows = 8;
    const imgCols = 16;
    const cellSz = Math.min((w - 80) / imgCols, (h - imgY - 60) / imgRows);
    const imgW = imgCols * cellSz;
    const imgStartX = (w - imgW) / 2;

    p.noStroke();
    p.fill(180);
    p.textSize(11);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(`Imagem quantizada com ${bits} bit${bits > 1 ? 's' : ''} (${levels} tons)`, w / 2, imgY - 4);

    for (let r = 0; r < imgRows; r++) {
      for (let c = 0; c < imgCols; c++) {
        const x = imgStartX + c * cellSz;
        const y = imgY + r * cellSz;

        // Generate a smooth gradient pattern (simulating a real image)
        const rawVal = 128 + 100 * Math.sin(r * 0.5 + c * 0.3) * Math.cos(r * 0.2 - c * 0.4 + 1);
        const clamped = Math.max(0, Math.min(255, rawVal));

        // Quantize to current bit depth
        const step = 255 / (levels - 1);
        const quantized = Math.round(clamped / step) * step;

        p.fill(quantized);
        p.stroke(30);
        p.strokeWeight(0.5);
        p.rect(x, y, cellSz, cellSz);
      }
    }

    // Info text
    p.noStroke();
    p.fill(120);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Com 8 bits (256 níveis), a imagem é suave o bastante para o olho humano", w / 2, h - 8);

    // Bit depth buttons
    const btnY = h - 42;
    const btnW = 50;
    const totalBtnW = bitsOptions.length * (btnW + 8);
    const btnStartX = (w - totalBtnW) / 2;

    for (let i = 0; i < bitsOptions.length; i++) {
      const bx = btnStartX + i * (btnW + 8);
      const isActive = bitsOptions[i] === bits;
      p.fill(isActive ? 0 : 20, isActive ? 120 : 30, isActive ? 200 : 50);
      p.noStroke();
      p.rect(bx, btnY, btnW, 22, 6);
      p.fill(isActive ? 255 : 120);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`${bitsOptions[i]} bit${bitsOptions[i] > 1 ? 's' : ''}`, bx + btnW / 2, btnY + 11);
    }
  };

  return <P5Sketch setup={setup} draw={draw} height={400} />;
}

function superscript(n: number): string {
  const superscripts: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  return n.toString().split('').map(c => superscripts[c] || c).join('');
}

// Visualization 3: RGB color model — shows how R, G, B channels combine to form colors
export function RGBColorModel() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.012;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Modelo de Cores RGB — Mistura Aditiva", w / 2, 12);

    // Animated R, G, B values
    const r = Math.floor(128 + 127 * Math.sin(time * 1.3));
    const g = Math.floor(128 + 127 * Math.sin(time * 0.9 + 2));
    const b = Math.floor(128 + 127 * Math.sin(time * 1.1 + 4));

    // Left side: Three overlapping circles (additive color mixing)
    const circleR = 65;
    const cx = w * 0.28;
    const cy = 170;
    const offset = 35;

    p.blendMode(p.ADD);

    // Red circle
    p.fill(r, 0, 0);
    p.noStroke();
    p.circle(cx - offset * 0.5, cy - offset * 0.6, circleR * 2);

    // Green circle
    p.fill(0, g, 0);
    p.circle(cx + offset * 0.5, cy - offset * 0.6, circleR * 2);

    // Blue circle
    p.fill(0, 0, b);
    p.circle(cx, cy + offset * 0.5, circleR * 2);

    p.blendMode(p.BLEND);

    // Right side: Channel sliders
    const sliderX = w * 0.55;
    const sliderW = w * 0.35;
    const channels = [
      { label: "R (Vermelho)", val: r, color: [255, 60, 60] as [number, number, number] },
      { label: "G (Verde)", val: g, color: [60, 255, 60] as [number, number, number] },
      { label: "B (Azul)", val: b, color: [60, 100, 255] as [number, number, number] },
    ];

    channels.forEach((ch, i) => {
      const sy = 70 + i * 55;

      // Label
      p.noStroke();
      p.fill(ch.color[0], ch.color[1], ch.color[2]);
      p.textSize(11);
      p.textAlign(p.LEFT, p.BOTTOM);
      p.text(ch.label, sliderX, sy);

      // Track
      p.fill(30);
      p.rect(sliderX, sy + 3, sliderW, 14, 7);

      // Filled portion
      const fillW = (ch.val / 255) * sliderW;
      p.fill(ch.color[0], ch.color[1], ch.color[2], 180);
      p.rect(sliderX, sy + 3, fillW, 14, 7);

      // Value
      p.fill(255);
      p.textSize(10);
      p.textAlign(p.LEFT, p.TOP);
      p.text(`${ch.val}`, sliderX + sliderW + 8, sy + 3);

      // Binary
      p.fill(100);
      p.textSize(8);
      p.text(ch.val.toString(2).padStart(8, '0'), sliderX + sliderW + 8, sy + 16);
    });

    // Combined color preview
    const prevX = sliderX;
    const prevY = 245;
    const prevSize = 55;

    p.fill(r, g, b);
    p.stroke(60);
    p.strokeWeight(1);
    p.rect(prevX, prevY, prevSize, prevSize, 8);

    p.noStroke();
    p.fill(200);
    p.textSize(11);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(`Cor resultante`, prevX + prevSize + 12, prevY + 12);
    p.fill(150);
    p.textSize(10);
    p.text(`RGB(${r}, ${g}, ${b})`, prevX + prevSize + 12, prevY + 28);
    p.textSize(9);
    p.fill(100);
    p.text(`#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`, prevX + prevSize + 12, prevY + 42);

    // 24-bit info
    p.noStroke();
    p.fill(100);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("24 bits por pixel (8R + 8G + 8B) = 2²⁴ ≈ 16,7 milhões de cores", w / 2, h - 28);

    // Binary breakdown
    const binY = h - 22;
    const binStr = r.toString(2).padStart(8, '0') + g.toString(2).padStart(8, '0') + b.toString(2).padStart(8, '0');
    const charW = 7;
    const totalW = 24 * charW + 2 * 4; // 24 chars + 2 separators
    const binStartX = (w - totalW) / 2;

    for (let i = 0; i < 24; i++) {
      let xOff = i * charW;
      if (i >= 8) xOff += 4;
      if (i >= 16) xOff += 4;

      const col = i < 8 ? [255, 80, 80] : i < 16 ? [80, 255, 80] : [80, 120, 255];
      p.fill(col[0], col[1], col[2]);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text(binStr[i], binStartX + xOff + charW / 2, binY);
    }
  };

  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

// Visualization 4: RGB Pixel Grid — shows how an image stores 3 values per pixel
export function RGBPixelGrid() {
  let time = 0;
  let selectedChannel = -1; // -1 = all, 0=R, 1=G, 2=B

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    // Auto-cycle through channels
    const phase = Math.floor(time / 2.5) % 4;
    selectedChannel = phase === 0 ? -1 : phase - 1;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    const titles = [
      "Imagem RGB — Todos os Canais",
      "Canal R (Vermelho)",
      "Canal G (Verde)",
      "Canal B (Azul)"
    ];
    p.text(titles[phase], w / 2, 12);

    const gridRows = 6;
    const gridCols = 10;
    const cellSize = Math.min((w - 40) / gridCols, (h - 100) / gridRows);
    const gridW = gridCols * cellSize;
    const gridStartX = (w - gridW) / 2;
    const gridStartY = 45;

    // Generate RGB values for each pixel (deterministic pattern)
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const x = gridStartX + col * cellSize;
        const y = gridStartY + row * cellSize;

        // Create a colorful pattern
        const rv = Math.floor(128 + 120 * Math.sin(row * 0.7 + col * 0.5 + 1));
        const gv = Math.floor(128 + 120 * Math.sin(row * 0.5 - col * 0.3 + 3));
        const bv = Math.floor(128 + 120 * Math.sin(row * 0.3 + col * 0.8 + 5));

        const cr = Math.max(0, Math.min(255, rv));
        const cg = Math.max(0, Math.min(255, gv));
        const cb = Math.max(0, Math.min(255, bv));

        // Display based on selected channel
        if (selectedChannel === -1) {
          p.fill(cr, cg, cb);
        } else if (selectedChannel === 0) {
          p.fill(cr, 0, 0);
        } else if (selectedChannel === 1) {
          p.fill(0, cg, 0);
        } else {
          p.fill(0, 0, cb);
        }

        p.stroke(30);
        p.strokeWeight(0.5);
        p.rect(x, y, cellSize, cellSize);
      }
    }

    // Channel indicators at bottom
    const indY = gridStartY + gridRows * cellSize + 15;
    const channelLabels = ["R", "G", "B"];
    const channelColors = [
      [255, 60, 60],
      [60, 255, 60],
      [60, 100, 255],
    ];
    const indW = 70;
    const totalIndW = 3 * indW + 2 * 20 + indW + 20;
    const indStartX = (w - totalIndW) / 2;

    // "All" button
    p.fill(selectedChannel === -1 ? 60 : 25);
    p.noStroke();
    p.rect(indStartX, indY, indW, 28, 6);
    p.fill(selectedChannel === -1 ? 255 : 100);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Todos", indStartX + indW / 2, indY + 14);

    for (let i = 0; i < 3; i++) {
      const bx = indStartX + (indW + 20) + i * (indW + 10);
      const isActive = selectedChannel === i;
      p.fill(isActive ? channelColors[i][0] : 25, isActive ? channelColors[i][1] : 25, isActive ? channelColors[i][2] : 30);
      p.noStroke();
      p.rect(bx, indY, indW, 28, 6);
      p.fill(isActive ? 255 : 100);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`Canal ${channelLabels[i]}`, bx + indW / 2, indY + 14);
    }

    // Info
    p.noStroke();
    p.fill(120);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(`Cada pixel armazena 3 valores: (R, G, B) — total de ${gridRows}×${gridCols}×3 = ${gridRows * gridCols * 3} valores`, w / 2, h - 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 5: Bit depth comparison — visual side-by-side of different bit depths
export function BitDepthComparison() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.01;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Comparação: Profundidade de Bits", w / 2, 12);

    const configs = [
      { bits: 1, label: "1 bit" },
      { bits: 2, label: "2 bits" },
      { bits: 4, label: "4 bits" },
      { bits: 8, label: "8 bits" },
    ];

    const cols = configs.length;
    const margin = 15;
    const gap = 12;
    const imgW = (w - margin * 2 - gap * (cols - 1)) / cols;
    const imgRows = 16;
    const imgCols = 16;
    const cellSz = Math.min(imgW / imgCols, (h - 100) / imgRows);
    const actualImgW = imgCols * cellSz;
    const actualImgH = imgRows * cellSz;
    const totalW = cols * actualImgW + (cols - 1) * gap;
    const startX = (w - totalW) / 2;
    const startY = 50;

    configs.forEach((cfg, idx) => {
      const ox = startX + idx * (actualImgW + gap);
      const levels = Math.pow(2, cfg.bits);

      // Label
      p.noStroke();
      p.fill(0, 200, 255);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(`${cfg.label} (${levels} tons)`, ox + actualImgW / 2, startY - 4);

      // Draw quantized image
      for (let r = 0; r < imgRows; r++) {
        for (let c = 0; c < imgCols; c++) {
          const x = ox + c * cellSz;
          const y = startY + r * cellSz;

          // Generate smooth circular gradient (like a sphere)
          const cr = imgRows / 2;
          const cc = imgCols / 2;
          const dist = Math.sqrt((r - cr) * (r - cr) + (c - cc) * (c - cc));
          const maxDist = Math.sqrt(cr * cr + cc * cc);
          const rawVal = 255 * (1 - dist / maxDist);
          // Add some texture
          const texture = 30 * Math.sin(r * 1.2 + c * 0.8);
          const val = Math.max(0, Math.min(255, rawVal + texture));

          // Quantize
          const step = 255 / (levels - 1);
          const quantized = Math.round(val / step) * step;

          p.fill(quantized);
          p.noStroke();
          p.rect(x, y, cellSz + 0.5, cellSz + 0.5);
        }
      }

      // Border
      p.noFill();
      p.stroke(50);
      p.strokeWeight(1);
      p.rect(ox, startY, actualImgW, actualImgH);
    });

    // Info
    p.noStroke();
    p.fill(120);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Mais bits → mais níveis → transições mais suaves → imagem mais fiel", w / 2, h - 22);

    // Animated highlight
    const highlightIdx = Math.floor(time * 0.5) % 4;
    const hlX = startX + highlightIdx * (actualImgW + gap);
    p.noFill();
    p.stroke(0, 200, 255, 120 + 80 * Math.sin(time * 4));
    p.strokeWeight(2);
    p.rect(hlX - 2, startY - 2, actualImgW + 4, actualImgH + 4, 4);

    p.noStroke();
    p.fill(150);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("8 bits por pixel é o padrão — 256 tons de cinza são suficientes para a percepção humana", w / 2, h - 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 6: RGB 24-bit color space — interactive cube-like visualization
export function RGBColorSpace() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.008;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Espaço de Cores RGB — 24 bits (16,7 milhões de cores)", w / 2, 12);

    // Draw a 2D projection of color space: vary R and G, with B animated
    const gridSize = 16;
    const cellSz = Math.min((w - 120) / gridSize, (h - 140) / gridSize);
    const gridW = gridSize * cellSz;
    const startX = (w - gridW) / 2;
    const startY = 55;

    // Animated B value
    const bVal = Math.floor(128 + 127 * Math.sin(time * 1.5));

    // Draw the color grid
    for (let ri = 0; ri < gridSize; ri++) {
      for (let gi = 0; gi < gridSize; gi++) {
        const x = startX + gi * cellSz;
        const y = startY + ri * cellSz;

        const rv = Math.floor((ri / (gridSize - 1)) * 255);
        const gv = Math.floor((gi / (gridSize - 1)) * 255);

        p.fill(rv, gv, bVal);
        p.noStroke();
        p.rect(x, y, cellSz + 0.5, cellSz + 0.5);
      }
    }

    // Border
    p.noFill();
    p.stroke(60);
    p.strokeWeight(1);
    p.rect(startX, startY, gridW, gridW);

    // Axis labels
    p.noStroke();
    p.fill(60, 255, 60);
    p.textSize(11);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Verde (G) →", startX + gridW / 2, startY - 5);

    p.fill(255, 60, 60);
    p.push();
    p.translate(startX - 10, startY + gridW / 2);
    p.rotate(-p.HALF_PI);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Vermelho (R) →", 0, 0);
    p.pop();

    // Blue slider
    const sliderX = startX + gridW + 20;
    const sliderY = startY;
    const sliderH = gridW;

    // Blue gradient track
    for (let i = 0; i < sliderH; i++) {
      const bv = Math.floor((i / sliderH) * 255);
      p.stroke(0, 0, bv);
      p.strokeWeight(1);
      p.line(sliderX, sliderY + i, sliderX + 20, sliderY + i);
    }

    // Current B indicator
    const bY = sliderY + (bVal / 255) * sliderH;
    p.noStroke();
    p.fill(80, 130, 255);
    p.triangle(sliderX + 22, bY - 5, sliderX + 22, bY + 5, sliderX + 30, bY);
    p.fill(150);
    p.textSize(10);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(`B=${bVal}`, sliderX + 33, bY);

    // Label
    p.fill(60, 100, 255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.push();
    p.translate(sliderX + 10, sliderY - 8);
    p.text("Azul (B)", 0, 0);
    p.pop();

    // Info
    p.noStroke();
    p.fill(120);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cada eixo (R, G, B) varia de 0 a 255 — o cubo RGB contém 256³ ≈ 16,7 milhões de cores", w / 2, h - 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 7: Analog to Digital — shows continuous signal being sampled and quantized
export function AnalogToDigital() {
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
    p.text("Da Imagem Contínua à Imagem Digital", w / 2, 12);

    // Three stages side by side
    const stageW = (w - 40) / 3;
    const stages = [
      { label: "1. Cena real (contínua)", sub: "Intensidade varia suavemente" },
      { label: "2. Amostragem (sampling)", sub: "Dividida em M×N posições" },
      { label: "3. Quantização", sub: "Valores discretizados (2ᵇ níveis)" },
    ];

    stages.forEach((stage, idx) => {
      const ox = 20 + idx * stageW;
      const imgY = 70;
      const imgSize = Math.min(stageW - 20, h - 140);
      const imgX = ox + (stageW - imgSize) / 2;

      // Label
      p.noStroke();
      p.fill(0, 200, 255);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text(stage.label, ox + stageW / 2, 36);
      p.fill(100);
      p.textSize(9);
      p.text(stage.sub, ox + stageW / 2, 50);

      if (idx === 0) {
        // Continuous: smooth gradient with no grid
        const resolution = 2;
        for (let y = 0; y < imgSize; y += resolution) {
          for (let x = 0; x < imgSize; x += resolution) {
            const nx = x / imgSize;
            const ny = y / imgSize;
            const val = 128 + 100 * Math.sin(nx * 4 + ny * 2) * Math.cos(ny * 3 - nx * 1.5 + 0.5);
            const clamped = Math.max(0, Math.min(255, val));
            p.fill(clamped);
            p.noStroke();
            p.rect(imgX + x, imgY + y, resolution, resolution);
          }
        }
      } else if (idx === 1) {
        // Sampled: grid of sample points
        const samples = 12;
        const cellSz = imgSize / samples;
        for (let r = 0; r < samples; r++) {
          for (let c = 0; c < samples; c++) {
            const nx = c / samples;
            const ny = r / samples;
            const val = 128 + 100 * Math.sin(nx * 4 + ny * 2) * Math.cos(ny * 3 - nx * 1.5 + 0.5);
            const clamped = Math.max(0, Math.min(255, val));
            p.fill(clamped);
            p.stroke(0, 200, 255, 60);
            p.strokeWeight(0.5);
            p.rect(imgX + c * cellSz, imgY + r * cellSz, cellSz, cellSz);
          }
        }
      } else {
        // Quantized: sampled + quantized to few levels
        const samples = 12;
        const cellSz = imgSize / samples;
        const bits = 3;
        const levels = Math.pow(2, bits);
        for (let r = 0; r < samples; r++) {
          for (let c = 0; c < samples; c++) {
            const nx = c / samples;
            const ny = r / samples;
            const val = 128 + 100 * Math.sin(nx * 4 + ny * 2) * Math.cos(ny * 3 - nx * 1.5 + 0.5);
            const clamped = Math.max(0, Math.min(255, val));
            const step = 255 / (levels - 1);
            const quantized = Math.round(clamped / step) * step;
            p.fill(quantized);
            p.stroke(40);
            p.strokeWeight(0.5);
            p.rect(imgX + c * cellSz, imgY + r * cellSz, cellSz, cellSz);
          }
        }
      }

      // Border
      p.noFill();
      p.stroke(60);
      p.strokeWeight(1);
      p.rect(imgX, imgY, imgSize, imgSize);

      // Arrows between stages
      if (idx < 2) {
        const arrowX = imgX + imgSize + 3;
        const arrowY = imgY + imgSize / 2;
        p.stroke(0, 200, 255, 150);
        p.strokeWeight(2);
        p.line(arrowX, arrowY, arrowX + 14, arrowY);
        p.line(arrowX + 10, arrowY - 4, arrowX + 14, arrowY);
        p.line(arrowX + 10, arrowY + 4, arrowX + 14, arrowY);
      }
    });

    // Info
    p.noStroke();
    p.fill(120);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Digitalização = Amostragem (espaço) + Quantização (intensidade)", w / 2, h - 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={350} />;
}

// Visualization 8: Image resolution demo — shows effect of different resolutions
export function ImageResolutionDemo() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.01;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Resolução Espacial — Efeito do Número de Pixels", w / 2, 12);

    const resolutions = [4, 8, 16, 32, 64];
    const count = resolutions.length;
    const gap = 10;
    const totalGap = gap * (count - 1);
    const imgSize = Math.min((w - 30 - totalGap) / count, h - 110);
    const totalW = count * imgSize + totalGap;
    const startX = (w - totalW) / 2;
    const startY = 50;

    resolutions.forEach((res, idx) => {
      const ox = startX + idx * (imgSize + gap);
      const cellSz = imgSize / res;

      // Label
      p.noStroke();
      p.fill(0, 200, 255);
      p.textSize(9);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(`${res}×${res}`, ox + imgSize / 2, startY - 3);

      // Draw image at this resolution
      for (let r = 0; r < res; r++) {
        for (let c = 0; c < res; c++) {
          const nx = c / res;
          const ny = r / res;

          // Simple circle pattern
          const cx2 = 0.5;
          const cy2 = 0.5;
          const dist = Math.sqrt((nx - cx2 + 0.5 / res) ** 2 + (ny - cy2 + 0.5 / res) ** 2);
          const val = dist < 0.4 ? 255 * (1 - dist / 0.4) : 0;
          const texture = 20 * Math.sin(nx * 15) * Math.cos(ny * 12);
          const final2 = Math.max(0, Math.min(255, val + texture));

          p.fill(final2);
          p.noStroke();
          p.rect(ox + c * cellSz, startY + r * cellSz, cellSz + 0.5, cellSz + 0.5);
        }
      }

      // Border
      p.noFill();
      p.stroke(50);
      p.strokeWeight(1);
      p.rect(ox, startY, imgSize, imgSize);

      // Pixel count
      p.noStroke();
      p.fill(100);
      p.textSize(8);
      p.textAlign(p.CENTER, p.TOP);
      p.text(`${res * res} px`, ox + imgSize / 2, startY + imgSize + 4);
    });

    // Animated highlight
    const hlIdx = Math.floor(time * 0.6) % count;
    const hlX = startX + hlIdx * (imgSize + gap);
    p.noFill();
    p.stroke(0, 200, 255, 100 + 80 * Math.sin(time * 5));
    p.strokeWeight(2);
    p.rect(hlX - 2, startY - 2, imgSize + 4, imgSize + 4, 4);

    // Info
    p.noStroke();
    p.fill(120);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Mais pixels (M×N maior) → mais detalhes capturados → maior resolução espacial", w / 2, h - 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

