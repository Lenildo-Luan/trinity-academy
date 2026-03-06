"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

// Visualization 1: Ultrasound imaging — shows sound pulses being emitted, reflected, and forming an image
export function UltrasoundImaging() {
  let time = 0;

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
    p.text("Ultrassom — Formação de Imagem por Eco", w / 2, 12);

    // Probe on the left
    const probeX = 60;
    const probeY = h / 2 - 20;
    const probeW = 30;
    const probeH = 100;

    p.fill(80, 90, 110);
    p.stroke(120);
    p.strokeWeight(1);
    p.rect(probeX - probeW, probeY, probeW, probeH, 4);
    p.noStroke();
    p.fill(0, 180, 220);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Sonda", probeX - probeW / 2, probeY - 12);

    // Tissue region
    const tissueX = 120;
    const tissueW = w - tissueX - 20;
    const tissueY = 50;
    const tissueH = h - 100;

    p.fill(15, 10, 25);
    p.stroke(40);
    p.strokeWeight(1);
    p.rect(tissueX, tissueY, tissueW, tissueH, 8);
    p.noStroke();
    p.fill(60);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Tecido / Corpo", tissueX + tissueW / 2, tissueY + 4);

    // Internal structures (organs/boundaries)
    const structures = [
      { x: tissueX + tissueW * 0.25, y: probeY + probeH / 2, r: 30, label: "Órgão A", col: [60, 40, 50] },
      { x: tissueX + tissueW * 0.55, y: probeY + probeH / 2 - 20, r: 40, label: "Órgão B", col: [50, 50, 70] },
      { x: tissueX + tissueW * 0.80, y: probeY + probeH / 2 + 15, r: 25, label: "Órgão C", col: [70, 40, 40] },
    ];

    structures.forEach((s) => {
      p.fill(s.col[0], s.col[1], s.col[2]);
      p.noStroke();
      p.ellipse(s.x, s.y, s.r * 2, s.r * 2);
      p.fill(100);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(s.label, s.x, s.y + s.r + 12);
    });

    // Animated sound pulses (concentric arcs traveling rightward)
    const numPulses = 5;
    for (let i = 0; i < numPulses; i++) {
      const phase = (time * 2 + i * 1.2) % 6;
      const pulseX = probeX + phase * (tissueW / 5);

      if (pulseX < tissueX + tissueW) {
        const alpha = Math.max(0, 200 - phase * 40);
        p.noFill();
        p.stroke(0, 200, 255, alpha);
        p.strokeWeight(2);
        p.arc(probeX, probeY + probeH / 2, pulseX * 1.5, probeH * 0.8, -p.QUARTER_PI, p.QUARTER_PI);
      }
    }

    // Reflected echoes (traveling back)
    for (let i = 0; i < 3; i++) {
      const echoPhase = (time * 2 + i * 2 + 3) % 6;
      const echoX = tissueX + tissueW * 0.5 - echoPhase * (tissueW / 8);

      if (echoX > probeX && echoX < tissueX + tissueW) {
        const alpha = Math.max(0, 150 - echoPhase * 30);
        p.noFill();
        p.stroke(255, 180, 50, alpha);
        p.strokeWeight(1.5);
        p.arc(tissueX + tissueW * 0.5, probeY + probeH / 2, (tissueX + tissueW * 0.5 - echoX) * 2, probeH * 0.6, p.PI - p.QUARTER_PI, p.PI + p.QUARTER_PI);
      }
    }

    // Legend
    const legY = h - 40;
    p.noStroke();

    p.fill(0, 200, 255);
    p.rect(20, legY, 12, 3);
    p.fill(150);
    p.textSize(9);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("Pulso emitido", 38, legY + 2);

    p.fill(255, 180, 50);
    p.rect(160, legY, 12, 3);
    p.fill(150);
    p.text("Eco refletido", 178, legY + 2);

    // Pipeline text
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Pulso → reflexão nas interfaces dos tecidos → tempo do eco → distância → imagem", w / 2, h - 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={360} />;
}

// Visualization 2: Thermal camera (IR) — shows a heat map visualization
export function ThermalCameraView() {
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
    p.text("Câmera Térmica Infravermelha (IR)", w / 2, 12);

    // Left: "Real scene" (simple shapes)
    const sceneX = 30;
    const sceneY = 55;
    const sceneW = (w - 80) / 2;
    const sceneH = h - 120;

    p.fill(20, 25, 35);
    p.stroke(50);
    p.strokeWeight(1);
    p.rect(sceneX, sceneY, sceneW, sceneH, 6);

    p.noStroke();
    p.fill(150);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cena visível", sceneX + sceneW / 2, sceneY - 3);

    // Draw scene objects
    // Transformer (hot)
    p.fill(80, 80, 90);
    p.rect(sceneX + sceneW * 0.15, sceneY + sceneH * 0.3, sceneW * 0.3, sceneH * 0.5, 4);
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Transformador", sceneX + sceneW * 0.3, sceneY + sceneH * 0.55);

    // Person
    p.fill(90, 80, 70);
    p.ellipse(sceneX + sceneW * 0.7, sceneY + sceneH * 0.35, 25, 25);
    p.rect(sceneX + sceneW * 0.7 - 10, sceneY + sceneH * 0.45, 20, 35, 3);
    p.fill(100);
    p.textSize(8);
    p.text("Pessoa", sceneX + sceneW * 0.7, sceneY + sceneH * 0.85);

    // Background building
    p.fill(50, 50, 60);
    p.rect(sceneX + sceneW * 0.45, sceneY + sceneH * 0.1, sceneW * 0.15, sceneH * 0.6, 2);

    // Arrow
    const arrowX = sceneX + sceneW + 10;
    p.stroke(0, 200, 255, 120);
    p.strokeWeight(2);
    p.line(arrowX, h / 2, arrowX + 18, h / 2);
    p.line(arrowX + 14, h / 2 - 4, arrowX + 18, h / 2);
    p.line(arrowX + 14, h / 2 + 4, arrowX + 18, h / 2);

    // Right: Thermal view
    const thermalX = sceneX + sceneW + 35;
    const thermalY = sceneY;
    const thermalW = sceneW;
    const thermalH = sceneH;

    p.noStroke();
    p.fill(150);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Imagem térmica (IR)", thermalX + thermalW / 2, thermalY - 3);

    // Draw thermal image as pixel grid
    const gridRes = 20;
    const cellW = thermalW / gridRes;
    const cellH = thermalH / gridRes;

    for (let r = 0; r < gridRes; r++) {
      for (let c = 0; c < gridRes; c++) {
        const nx = c / gridRes;
        const ny = r / gridRes;

        // Base temperature (ambient ~20°C)
        let temp = 18 + Math.random() * 2;

        // Transformer hotspot (high temperature)
        const tDist = Math.sqrt((nx - 0.3) ** 2 + (ny - 0.55) ** 2);
        if (tDist < 0.25) {
          temp = 70 + 30 * (1 - tDist / 0.25) + 5 * Math.sin(time * 3 + r + c);
        }

        // Person body heat
        const pDist = Math.sqrt((nx - 0.7) ** 2 + (ny - 0.45) ** 2);
        if (pDist < 0.2) {
          temp = 34 + 4 * (1 - pDist / 0.2);
        }

        // Building (slightly warm)
        if (nx > 0.42 && nx < 0.6 && ny > 0.1 && ny < 0.7) {
          temp = Math.max(temp, 22 + 3 * Math.sin(ny * 5));
        }

        // Map temperature to color (blue = cold, green = warm, red/yellow/white = hot)
        let cr: number, cg: number, cb: number;
        if (temp < 25) {
          // Cold: dark blue to blue
          const t2 = (temp - 10) / 15;
          cr = 0;
          cg = 0;
          cb = Math.floor(80 + 120 * t2);
        } else if (temp < 35) {
          // Warm: blue to green
          const t2 = (temp - 25) / 10;
          cr = 0;
          cg = Math.floor(200 * t2);
          cb = Math.floor(200 * (1 - t2));
        } else if (temp < 60) {
          // Hot: green to yellow to red
          const t2 = (temp - 35) / 25;
          cr = Math.floor(255 * t2);
          cg = Math.floor(200 * (1 - t2 * 0.5));
          cb = 0;
        } else {
          // Very hot: red to white
          const t2 = Math.min(1, (temp - 60) / 40);
          cr = 255;
          cg = Math.floor(100 + 155 * t2);
          cb = Math.floor(50 + 205 * t2);
        }

        p.fill(cr, cg, cb);
        p.noStroke();
        p.rect(thermalX + c * cellW, thermalY + r * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    p.noFill();
    p.stroke(50);
    p.strokeWeight(1);
    p.rect(thermalX, thermalY, thermalW, thermalH, 6);

    // Color scale bar
    const barX = thermalX + thermalW + 10;
    const barY = thermalY + 10;
    const barW = 14;
    const barH = thermalH - 20;

    for (let i = 0; i < barH; i++) {
      const t2 = 1 - i / barH;
      const temp = 10 + t2 * 90;
      let cr2: number, cg2: number, cb2: number;
      if (temp < 25) {
        const tt = (temp - 10) / 15;
        cr2 = 0; cg2 = 0; cb2 = Math.floor(80 + 120 * tt);
      } else if (temp < 35) {
        const tt = (temp - 25) / 10;
        cr2 = 0; cg2 = Math.floor(200 * tt); cb2 = Math.floor(200 * (1 - tt));
      } else if (temp < 60) {
        const tt = (temp - 35) / 25;
        cr2 = Math.floor(255 * tt); cg2 = Math.floor(200 * (1 - tt * 0.5)); cb2 = 0;
      } else {
        const tt = Math.min(1, (temp - 60) / 40);
        cr2 = 255; cg2 = Math.floor(100 + 155 * tt); cb2 = Math.floor(50 + 205 * tt);
      }
      p.stroke(cr2, cg2, cb2);
      p.line(barX, barY + i, barX + barW, barY + i);
    }

    p.noStroke();
    p.fill(150);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text("100°C", barX + barW + 3, barY);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("10°C", barX + barW + 3, barY + barH);

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Sensor detecta radiação infravermelha (calor) → mapa de temperaturas em falsa cor", w / 2, h - 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 3: X-Ray sensor — shows how X-rays pass through materials with different absorption
export function XRaySensorView() {
  let time = 0;

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
    p.text("Sensor de Raio-X — Absorção Diferencial", w / 2, 12);

    // Layout: Source → Object → Detector → Image
    const stageW = (w - 40) / 4;

    // X-ray source
    const srcX = 20;
    const srcY = h / 2 - 30;
    p.fill(255, 220, 50);
    p.noStroke();
    p.ellipse(srcX + 25, srcY + 30, 30, 30);
    p.fill(255, 220, 50, 120);
    for (let a = 0; a < 8; a++) {
      const angle = (a / 8) * p.TWO_PI + time;
      const len = 22 + 4 * Math.sin(time * 5 + a);
      p.strokeWeight(2);
      p.stroke(255, 220, 50, 100);
      p.line(
        srcX + 25 + Math.cos(angle) * 18,
        srcY + 30 + Math.sin(angle) * 18,
        srcX + 25 + Math.cos(angle) * len,
        srcY + 30 + Math.sin(angle) * len
      );
    }
    p.noStroke();
    p.fill(200);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Fonte de", srcX + 25, srcY + 55);
    p.text("Raio-X", srcX + 25, srcY + 66);

    // X-ray beams
    const beamStartX = srcX + 50;
    const objX = srcX + stageW + 10;
    const objW = stageW - 10;
    const detX = objX + objW + 20;

    const numBeams = 12;
    for (let i = 0; i < numBeams; i++) {
      const by = 60 + i * ((h - 120) / numBeams);
      const beamPhase = (time * 3 + i * 0.3) % 4;

      // Determine beam attenuation based on what it passes through
      const ny = (i / numBeams);
      let absorption = 0.1; // soft tissue
      if (ny > 0.3 && ny < 0.7) absorption = 0.7; // bone area
      if (ny > 0.45 && ny < 0.55) absorption = 0.9; // dense bone

      // Incoming beam (bright)
      if (beamPhase < 2) {
        p.stroke(100, 220, 255, 180);
        p.strokeWeight(1.5);
        p.line(beamStartX, srcY + 30, objX, by);
      }

      // Outgoing beam (attenuated)
      if (beamPhase > 1 && beamPhase < 3.5) {
        const alpha = (1 - absorption) * 180;
        p.stroke(100, 220, 255, alpha);
        p.strokeWeight(1.5);
        p.line(objX + objW, by, detX, by);
      }
    }

    // Object (body cross-section)
    p.fill(25, 20, 30);
    p.stroke(60);
    p.strokeWeight(1);
    p.rect(objX, 55, objW, h - 115, 8);

    // Internal structures
    p.noStroke();
    // Soft tissue
    p.fill(40, 35, 45);
    p.ellipse(objX + objW / 2, h / 2 - 30, objW * 0.7, 50);
    p.fill(50);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("tecido mole", objX + objW / 2, h / 2 - 30);

    // Bone
    p.fill(120, 110, 100);
    p.rect(objX + objW * 0.3, h / 2 - 5, objW * 0.4, 60, 4);
    p.fill(200);
    p.textSize(7);
    p.text("osso", objX + objW / 2, h / 2 + 25);

    // Metal implant
    p.fill(180, 180, 190);
    p.rect(objX + objW * 0.4, h / 2 + 35, objW * 0.2, 15, 2);
    p.fill(220);
    p.textSize(6);
    p.text("metal", objX + objW / 2, h / 2 + 42);

    p.fill(150);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Objeto", objX + objW / 2, 42);

    // Detector
    p.fill(30, 35, 50);
    p.stroke(80);
    p.strokeWeight(1);
    p.rect(detX, 55, 18, h - 115, 3);
    p.noStroke();
    p.fill(150);
    p.textSize(8);
    p.push();
    p.translate(detX + 9, h / 2);
    p.rotate(p.HALF_PI);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Detector", 0, 0);
    p.pop();

    // Resulting image
    const imgX = detX + 35;
    const imgY = 55;
    const imgH = h - 115;
    const imgW = w - imgX - 15;
    const imgRows = 16;

    p.fill(150);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Imagem", imgX + imgW / 2, 42);

    for (let r = 0; r < imgRows; r++) {
      const ny = r / imgRows;
      let absorption = 0.1;
      if (ny > 0.3 && ny < 0.7) absorption = 0.6;
      if (ny > 0.45 && ny < 0.55) absorption = 0.85;
      if (ny > 0.58 && ny < 0.65) absorption = 0.95;

      const brightness = Math.floor(255 * (1 - absorption));
      const rowH = imgH / imgRows;

      p.fill(brightness);
      p.noStroke();
      p.rect(imgX, imgY + r * rowH, imgW, rowH + 0.5);
    }

    p.noFill();
    p.stroke(50);
    p.strokeWeight(1);
    p.rect(imgX, imgY, imgW, imgH, 4);

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Materiais densos (osso, metal) absorvem mais raios-X → aparecem claros na imagem", w / 2, h - 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={370} />;
}

// Visualization 4: Depth sensor — shows structured light / ToF depth mapping
export function DepthSensorView() {
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
    p.text("Sensor de Profundidade (ToF / Luz Estruturada)", w / 2, 12);

    // Left: side view of scene with objects at different depths
    const sceneX = 30;
    const sceneY = 55;
    const sceneW = (w - 70) / 2;
    const sceneH = h - 110;

    p.fill(10, 12, 20);
    p.stroke(40);
    p.strokeWeight(1);
    p.rect(sceneX, sceneY, sceneW, sceneH, 6);

    p.noStroke();
    p.fill(150);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Vista lateral da cena", sceneX + sceneW / 2, sceneY - 3);

    // Sensor at left edge
    p.fill(0, 180, 220);
    p.noStroke();
    p.rect(sceneX + 5, sceneY + sceneH / 2 - 15, 12, 30, 3);
    p.fill(0, 180, 220);
    p.textSize(7);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Sensor", sceneX + 11, sceneY + sceneH / 2 + 20);

    // Objects at different depths
    const objects = [
      { depth: 0.25, y: 0.3, size: 30, label: "Perto", col: [80, 200, 80] },
      { depth: 0.50, y: 0.55, size: 35, label: "Médio", col: [200, 200, 50] },
      { depth: 0.80, y: 0.4, size: 25, label: "Longe", col: [200, 80, 80] },
    ];

    // Animated light pulses
    const pulseProgress = (time * 1.5) % 3;
    const activeObj = Math.floor(pulseProgress);

    objects.forEach((obj, idx) => {
      const ox = sceneX + 20 + obj.depth * (sceneW - 40);
      const oy = sceneY + obj.y * sceneH;

      // Object
      p.fill(obj.col[0], obj.col[1], obj.col[2], 180);
      p.noStroke();
      p.rect(ox - obj.size / 2, oy - obj.size / 2, obj.size, obj.size, 4);
      p.fill(200);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(obj.label, ox, oy);

      // Light beam from sensor
      if (idx === activeObj) {
        const frac = pulseProgress - activeObj;
        // Outgoing
        if (frac < 0.5) {
          const progress = frac * 2;
          const beamEndX = sceneX + 17 + progress * (ox - sceneX - 17);
          p.stroke(0, 200, 255, 180);
          p.strokeWeight(2);
          p.line(sceneX + 17, sceneY + sceneH / 2, beamEndX, oy);
        } else {
          // Returning
          const progress = (frac - 0.5) * 2;
          const beamStartX = ox - progress * (ox - sceneX - 17);
          p.stroke(255, 180, 50, 150);
          p.strokeWeight(1.5);
          p.line(beamStartX, oy - (oy - sceneY - sceneH / 2) * progress, sceneX + 17, sceneY + sceneH / 2);
        }
      }

      // Depth label
      p.noStroke();
      p.fill(100);
      p.textSize(7);
      p.textAlign(p.CENTER, p.TOP);
      p.text(`d=${(obj.depth * 5).toFixed(1)}m`, ox, oy + obj.size / 2 + 4);
    });

    // Depth axis
    p.stroke(60);
    p.strokeWeight(1);
    p.line(sceneX + 20, sceneY + sceneH - 10, sceneX + sceneW - 10, sceneY + sceneH - 10);
    p.noStroke();
    p.fill(80);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Profundidade →", sceneX + sceneW / 2, sceneY + sceneH - 8);

    // Right: Depth map
    const mapX = sceneX + sceneW + 20;
    const mapY = sceneY;
    const mapW = sceneW;
    const mapH = sceneH;

    p.noStroke();
    p.fill(150);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Mapa de profundidade", mapX + mapW / 2, mapY - 3);

    const gridRes = 16;
    const cellW2 = mapW / gridRes;
    const cellH2 = mapH / gridRes;

    for (let r = 0; r < gridRes; r++) {
      for (let c = 0; c < gridRes; c++) {
        const nx = c / gridRes;
        const ny = r / gridRes;

        // Default: far (dark)
        let depth = 0.95;

        // Near object
        const d1 = Math.sqrt((nx - 0.25) ** 2 + (ny - 0.3) ** 2);
        if (d1 < 0.15) depth = Math.min(depth, 0.25 + d1 * 0.5);

        // Medium object
        const d2 = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.55) ** 2);
        if (d2 < 0.18) depth = Math.min(depth, 0.50 + d2 * 0.3);

        // Far object
        const d3 = Math.sqrt((nx - 0.75) ** 2 + (ny - 0.4) ** 2);
        if (d3 < 0.12) depth = Math.min(depth, 0.80 + d3 * 0.2);

        // Color: near = bright warm, far = dark cool
        const brightness = Math.floor(255 * (1 - depth));
        const cr = Math.min(255, brightness + 50);
        const cg = brightness;
        const cb = Math.max(0, Math.floor(brightness * 0.4));

        p.fill(cr, cg, cb);
        p.noStroke();
        p.rect(mapX + c * cellW2, mapY + r * cellH2, cellW2 + 0.5, cellH2 + 0.5);
      }
    }

    p.noFill();
    p.stroke(50);
    p.strokeWeight(1);
    p.rect(mapX, mapY, mapW, mapH, 6);

    // Color legend
    p.noStroke();
    p.fill(80, 200, 80);
    p.rect(mapX + 5, mapY + mapH + 6, 10, 10, 2);
    p.fill(120);
    p.textSize(8);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("Perto (claro)", mapX + 18, mapY + mapH + 11);

    p.fill(50, 20, 10);
    p.rect(mapX + mapW / 2, mapY + mapH + 6, 10, 10, 2);
    p.fill(120);
    p.text("Longe (escuro)", mapX + mapW / 2 + 14, mapY + mapH + 11);

    // Info
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Sensor emite luz/IR e mede tempo de retorno (ToF) → mapa de distâncias por pixel", w / 2, h - 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 5: Sensor comparison overview — side by side of different sensor types and their spectra
export function SensorSpectrumOverview() {
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
    p.text("Espectro Eletromagnético e Tipos de Sensores", w / 2, 12);

    // Electromagnetic spectrum bar
    const barX = 40;
    const barY = 45;
    const barW = w - 80;
    const barH = 30;

    // Spectrum regions (left = short wavelength, right = long wavelength)
    const regions = [
      { label: "Raio-X", frac: 0.12, col: [150, 100, 255] },
      { label: "UV", frac: 0.08, col: [100, 50, 200] },
      { label: "Visível", frac: 0.15, col: [0, 0, 0] }, // special: rainbow
      { label: "Infravermelho", frac: 0.30, col: [200, 50, 50] },
      { label: "Micro-ondas", frac: 0.15, col: [255, 150, 50] },
      { label: "Ondas de Rádio / Som", frac: 0.20, col: [50, 180, 100] },
    ];

    let currentX = barX;
    regions.forEach((reg) => {
      const regW = reg.frac * barW;

      if (reg.label === "Visível") {
        // Rainbow gradient
        for (let i = 0; i < regW; i++) {
          const t = i / regW;
          const hue = 270 - t * 270; // violet to red
          p.colorMode(p.HSB, 360, 100, 100);
          p.stroke(hue, 90, 90);
          p.line(currentX + i, barY, currentX + i, barY + barH);
          p.colorMode(p.RGB, 255);
        }
      } else {
        p.fill(reg.col[0], reg.col[1], reg.col[2], 150);
        p.noStroke();
        p.rect(currentX, barY, regW, barH);
      }

      // Label
      p.noStroke();
      p.fill(220);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(reg.label, currentX + regW / 2, barY + barH / 2);

      currentX += regW;
    });

    // Border
    p.noFill();
    p.stroke(80);
    p.strokeWeight(1);
    p.rect(barX, barY, barW, barH);

    // Arrow labels
    p.noStroke();
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text("← menor λ (alta energia)", barX, barY + barH + 4);
    p.textAlign(p.RIGHT, p.TOP);
    p.text("maior λ (baixa energia) →", barX + barW, barY + barH + 4);

    // Sensor cards below
    const sensors = [
      {
        name: "Raio-X",
        specPos: 0.06,
        icon: "☢",
        desc: "Detecta absorção de raios-X",
        app: "Medicina, segurança",
        col: [150, 100, 255],
      },
      {
        name: "Câmera (CCD)",
        specPos: 0.27,
        icon: "📷",
        desc: "Detecta luz visível (fótons)",
        app: "Fotografia, visão computacional",
        col: [100, 200, 100],
      },
      {
        name: "Câmera IR",
        specPos: 0.47,
        icon: "🌡",
        desc: "Detecta radiação infravermelha",
        app: "Termografia, vigilância noturna",
        col: [220, 80, 50],
      },
      {
        name: "Ultrassom",
        specPos: 0.85,
        icon: "🔊",
        desc: "Detecta ondas sonoras refletidas",
        app: "Ecografia, sonar, sísmica",
        col: [50, 180, 130],
      },
      {
        name: "Profundidade",
        specPos: 0.40,
        icon: "📐",
        desc: "Mede distância (ToF / luz estruturada)",
        app: "3D scanning, robótica, AR",
        col: [200, 170, 50],
      },
    ];

    const cardY = barY + barH + 30;
    const cardH = 70;
    const cardW = (w - 30) / sensors.length - 6;
    const cardGap = 6;

    sensors.forEach((sensor, idx) => {
      const cx = 15 + idx * (cardW + cardGap);

      // Connection line to spectrum
      const specX = barX + sensor.specPos * barW;
      p.stroke(sensor.col[0], sensor.col[1], sensor.col[2], 80);
      p.strokeWeight(1);
      p.line(specX, barY + barH, cx + cardW / 2, cardY);

      // Card
      const isHighlighted = Math.floor(time * 0.6) % sensors.length === idx;
      p.fill(isHighlighted ? 25 : 15, isHighlighted ? 30 : 18, isHighlighted ? 45 : 28);
      p.stroke(sensor.col[0], sensor.col[1], sensor.col[2], isHighlighted ? 150 : 60);
      p.strokeWeight(isHighlighted ? 2 : 1);
      p.rect(cx, cardY, cardW, cardH, 6);

      // Content
      p.noStroke();
      p.fill(sensor.col[0], sensor.col[1], sensor.col[2]);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text(sensor.name, cx + cardW / 2, cardY + 6);

      p.fill(150);
      p.textSize(7);
      p.text(sensor.desc, cx + cardW / 2, cardY + 22);

      p.fill(100);
      p.textSize(7);
      p.text(sensor.app, cx + cardW / 2, cardY + 42);
    });

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cada sensor é otimizado para uma faixa do espectro — capturando energia de naturezas diferentes", w / 2, h - 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 6: Practical applications — animated dashboard showing real-world use cases
export function SensorApplicationsDashboard() {
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
    p.text("Aplicações Práticas de Sensores de Imagem", w / 2, 12);

    // Three application panels
    const panelW = (w - 50) / 3;
    const panelH = h - 70;
    const panelY = 40;

    const apps = [
      {
        title: "Monitoramento de",
        title2: "Transformadores (IR)",
        col: [220, 80, 50],
      },
      {
        title: "Vigilância",
        title2: "Noturna (IR)",
        col: [100, 200, 100],
      },
      {
        title: "Segurança em",
        title2: "Rodovias (Raio-X)",
        col: [150, 100, 255],
      },
    ];

    apps.forEach((app, idx) => {
      const px = 15 + idx * (panelW + 10);

      // Panel background
      p.fill(10, 14, 25);
      p.stroke(app.col[0], app.col[1], app.col[2], 60);
      p.strokeWeight(1);
      p.rect(px, panelY, panelW, panelH, 8);

      // Title
      p.noStroke();
      p.fill(app.col[0], app.col[1], app.col[2]);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text(app.title, px + panelW / 2, panelY + 8);
      p.text(app.title2, px + panelW / 2, panelY + 21);

      const imgY = panelY + 40;
      const imgH = panelH - 90;
      const imgW = panelW - 20;
      const imgX = px + 10;

      if (idx === 0) {
        // Transformer thermal monitoring
        const gridRes = 12;
        const cw = imgW / gridRes;
        const ch = imgH / gridRes;

        for (let r = 0; r < gridRes; r++) {
          for (let c = 0; c < gridRes; c++) {
            const nx = c / gridRes;
            const ny = r / gridRes;

            // Transformer shape with hotspot
            let temp = 20;
            // Transformer body
            if (nx > 0.15 && nx < 0.85 && ny > 0.2 && ny < 0.9) {
              temp = 40 + 10 * Math.sin(ny * 3);
            }
            // Hotspot (overheating joint)
            const hd = Math.sqrt((nx - 0.6) ** 2 + (ny - 0.4) ** 2);
            if (hd < 0.2) {
              temp = 80 + 30 * (1 - hd / 0.2) + 5 * Math.sin(time * 4);
            }

            let cr: number, cg: number, cb: number;
            if (temp < 30) { cr = 0; cg = 0; cb = 150; }
            else if (temp < 50) { const t2 = (temp - 30) / 20; cr = 0; cg = Math.floor(180 * t2); cb = Math.floor(150 * (1 - t2)); }
            else if (temp < 75) { const t2 = (temp - 50) / 25; cr = Math.floor(255 * t2); cg = Math.floor(180 * (1 - t2 * 0.3)); cb = 0; }
            else { const t2 = Math.min(1, (temp - 75) / 35); cr = 255; cg = Math.floor(150 + 105 * t2); cb = Math.floor(80 * t2); }

            p.fill(cr, cg, cb);
            p.noStroke();
            p.rect(imgX + c * cw, imgY + r * ch, cw + 0.5, ch + 0.5);
          }
        }

        // Alert indicator
        p.fill(255, 60, 60, 150 + 100 * Math.sin(time * 5));
        p.noStroke();
        p.ellipse(imgX + imgW * 0.6, imgY + imgH * 0.4, 10, 10);
        p.fill(255);
        p.textSize(6);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("!", imgX + imgW * 0.6, imgY + imgH * 0.4);

        // Status
        p.noStroke();
        p.fill(255, 80, 50);
        p.textSize(8);
        p.textAlign(p.CENTER, p.TOP);
        p.text(`⚠ Ponto quente: ${(95 + 5 * Math.sin(time * 3)).toFixed(0)}°C`, px + panelW / 2, imgY + imgH + 5);
        p.fill(120);
        p.textSize(7);
        p.text("Detecta superaquecimento", px + panelW / 2, imgY + imgH + 20);
        p.text("antes da falha", px + panelW / 2, imgY + imgH + 31);

      } else if (idx === 1) {
        // Night surveillance
        const gridRes = 14;
        const cw = imgW / gridRes;
        const ch = imgH / gridRes;

        for (let r = 0; r < gridRes; r++) {
          for (let c = 0; c < gridRes; c++) {
            const nx = c / gridRes;
            const ny = r / gridRes;

            // Dark scene with heat signatures
            let brightness = 15 + Math.random() * 5;

            // Person walking (animated)
            const personX = 0.3 + 0.3 * Math.sin(time * 0.5);
            const pd = Math.sqrt((nx - personX) ** 2 + ((ny - 0.5) * 1.5) ** 2);
            if (pd < 0.15) {
              brightness = 180 + 60 * (1 - pd / 0.15);
            }

            // Vehicle
            const vd = Math.sqrt((nx - 0.75) ** 2 + ((ny - 0.65) * 2) ** 2);
            if (vd < 0.12) {
              brightness = 200 + 40 * (1 - vd / 0.12);
            }

            // Green tint (night vision aesthetic)
            p.fill(brightness * 0.2, brightness, brightness * 0.1);
            p.noStroke();
            p.rect(imgX + c * cw, imgY + r * ch, cw + 0.5, ch + 0.5);
          }
        }

        p.noStroke();
        p.fill(100, 200, 100);
        p.textSize(8);
        p.textAlign(p.CENTER, p.TOP);
        p.text("Pessoa e veículo detectados", px + panelW / 2, imgY + imgH + 5);
        p.fill(120);
        p.textSize(7);
        p.text("Visível mesmo na escuridão", px + panelW / 2, imgY + imgH + 20);
        p.text("total (0 lux)", px + panelW / 2, imgY + imgH + 31);

      } else {
        // Highway X-ray security
        const gridRes = 14;
        const cw = imgW / gridRes;
        const ch = imgH / gridRes;

        for (let r = 0; r < gridRes; r++) {
          for (let c = 0; c < gridRes; c++) {
            const nx = c / gridRes;
            const ny = r / gridRes;

            // Truck container outline
            let val = 30;
            if (nx > 0.1 && nx < 0.9 && ny > 0.2 && ny < 0.85) {
              val = 60;
            }

            // Cargo boxes
            if (nx > 0.15 && nx < 0.4 && ny > 0.35 && ny < 0.75) {
              val = 120;
            }
            if (nx > 0.5 && nx < 0.7 && ny > 0.3 && ny < 0.65) {
              val = 100;
            }

            // Suspicious dense object
            const sd = Math.sqrt((nx - 0.8) ** 2 + (ny - 0.55) ** 2);
            if (sd < 0.1) {
              val = 220 + Math.floor(20 * Math.sin(time * 3));
            }

            // Blue-ish X-ray aesthetic
            p.fill(val * 0.3, val * 0.5, val);
            p.noStroke();
            p.rect(imgX + c * cw, imgY + r * ch, cw + 0.5, ch + 0.5);
          }
        }

        // Alert on dense object
        p.noFill();
        p.stroke(255, 80, 80, 150 + 100 * Math.sin(time * 4));
        p.strokeWeight(2);
        p.rect(imgX + imgW * 0.7, imgY + imgH * 0.42, imgW * 0.2, imgH * 0.22, 3);

        p.noStroke();
        p.fill(150, 100, 255);
        p.textSize(8);
        p.textAlign(p.CENTER, p.TOP);
        p.text("Objeto denso detectado", px + panelW / 2, imgY + imgH + 5);
        p.fill(120);
        p.textSize(7);
        p.text("Inspeção de cargas sem", px + panelW / 2, imgY + imgH + 20);
        p.text("abrir o contêiner", px + panelW / 2, imgY + imgH + 31);
      }

      // Border for image
      p.noFill();
      p.stroke(40);
      p.strokeWeight(1);
      p.rect(imgX, imgY, imgW, imgH, 4);
    });

    // Info
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Diferentes sensores revelam informações invisíveis ao olho humano", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={400} />;
}

// Visualization 7: Seismic/Sonar mapping — shows sound waves mapping underground or underwater structures
export function SeismicSonarMapping() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.018;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Mapeamento Sísmico / Sonar — Ondas Sonoras", w / 2, 12);

    // Surface line
    const surfY = 90;
    p.stroke(80, 180, 120);
    p.strokeWeight(2);
    p.line(20, surfY, w - 20, surfY);
    p.noStroke();
    p.fill(80, 180, 120);
    p.textSize(9);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("Superfície", 25, surfY - 4);

    // Source at surface
    const srcX = w * 0.3;
    p.fill(255, 200, 50);
    p.noStroke();
    p.triangle(srcX - 8, surfY, srcX + 8, surfY, srcX, surfY - 15);
    p.fill(200);
    p.textSize(8);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Fonte", srcX, surfY - 18);

    // Receivers at surface
    const numReceivers = 8;
    for (let i = 0; i < numReceivers; i++) {
      const rx = w * 0.4 + i * ((w * 0.55) / numReceivers);
      p.fill(50, 180, 255);
      p.noStroke();
      p.rect(rx - 3, surfY - 6, 6, 6, 1);
    }
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Geofones / Receptores", w * 0.65, surfY - 10);

    // Underground layers
    const layers = [
      { y: surfY + 60, label: "Sedimento", col: [50, 40, 30], density: 0.3 },
      { y: surfY + 130, label: "Rocha porosa", col: [70, 55, 40], density: 0.6 },
      { y: surfY + 190, label: "Rocha densa", col: [90, 80, 70], density: 0.85 },
    ];

    // Draw underground
    p.noStroke();
    // Fill areas
    p.fill(layers[0].col[0], layers[0].col[1], layers[0].col[2]);
    p.rect(20, surfY, w - 40, layers[0].y - surfY + 35);
    p.fill(layers[1].col[0], layers[1].col[1], layers[1].col[2]);
    p.rect(20, layers[0].y + 35, w - 40, layers[1].y - layers[0].y - 5);
    p.fill(layers[2].col[0], layers[2].col[1], layers[2].col[2]);
    p.rect(20, layers[1].y + 30, w - 40, h - layers[1].y - 50);

    // Layer boundaries (wavy lines)
    layers.forEach((layer) => {
      p.stroke(120, 100, 80, 150);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (let x = 20; x < w - 20; x += 3) {
        const wavY = layer.y + 8 * Math.sin(x * 0.02 + layer.density * 5);
        p.vertex(x, wavY);
      }
      p.endShape();

      p.noStroke();
      p.fill(180);
      p.textSize(8);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(layer.label, w - 25, layer.y + 15);
    });

    // Hidden structure (oil reservoir)
    p.fill(30, 30, 20);
    p.noStroke();
    p.ellipse(w * 0.55, layers[1].y + 15, 80, 30);
    p.fill(200, 180, 50, 150);
    p.textSize(7);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Reservatório", w * 0.55, layers[1].y + 15);

    // Animated wavefronts
    const maxRadius = 300;
    const numWaves = 4;
    for (let i = 0; i < numWaves; i++) {
      const waveRadius = ((time * 80 + i * 75) % maxRadius);
      const alpha = Math.max(0, 200 - waveRadius * 0.7);

      p.noFill();
      p.stroke(255, 200, 50, alpha);
      p.strokeWeight(1.5);
      p.arc(srcX, surfY, waveRadius * 2, waveRadius * 2, 0.1, p.PI - 0.1);
    }

    // Reflected waves from layer boundaries
    for (let li = 0; li < layers.length; li++) {
      const reflectY = layers[li].y;
      const reflectPhase = ((time * 80 + 40 + li * 30) % maxRadius);

      if (reflectPhase > 30) {
        const rAlpha = Math.max(0, 150 - reflectPhase * 0.6);
        p.noFill();
        p.stroke(50, 180, 255, rAlpha);
        p.strokeWeight(1);
        p.arc(w * 0.5, reflectY, reflectPhase * 1.5, reflectPhase * 0.8, p.PI + 0.2, p.TWO_PI - 0.2);
      }
    }

    // Info
    p.noStroke();
    p.fill(120);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Ondas sonoras refletem nas camadas geológicas → mapeamento do subsolo sem escavação", w / 2, h - 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

