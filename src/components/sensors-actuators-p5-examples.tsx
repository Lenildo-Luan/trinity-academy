"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

// Visualization 1: Sensor types — shows different sensors detecting environmental energy
export function SensorTypes() {
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
    p.text("Tipos de Sensores e Formas de Energia", w / 2, 12);

    // Three columns: Luminosa, Térmica, Cinética
    const cols = [
      { label: "Energia Luminosa", sensor: "Fotodiodo", color: [255, 220, 50] as [number, number, number], x: w / 6 },
      { label: "Energia Térmica", sensor: "Termistor", color: [255, 80, 50] as [number, number, number], x: w / 2 },
      { label: "Energia Cinética", sensor: "Acelerômetro", color: [50, 180, 255] as [number, number, number], x: (5 * w) / 6 },
    ];

    // Dividers
    p.stroke(40);
    p.strokeWeight(1);
    p.line(w / 3, 35, w / 3, h - 10);
    p.line((2 * w) / 3, 35, (2 * w) / 3, h - 10);

    cols.forEach((col, idx) => {
      const cx = col.x;
      const baseY = 70;

      // Energy source label
      p.noStroke();
      p.fill(col.color[0], col.color[1], col.color[2]);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text(col.label, cx, baseY - 20);

      // Animated energy waves
      if (idx === 0) {
        // Light rays
        for (let i = 0; i < 5; i++) {
          const angle = -0.4 + i * 0.2;
          const rayLen = 40 + Math.sin(time * 3 + i) * 8;
          p.stroke(255, 220, 50, 150);
          p.strokeWeight(2);
          p.line(
            cx, baseY + 10,
            cx + Math.sin(angle) * rayLen,
            baseY + 10 + Math.cos(angle) * rayLen
          );
        }
        // Sun icon
        p.noStroke();
        p.fill(255, 220, 50);
        p.circle(cx, baseY + 10, 20);
      } else if (idx === 1) {
        // Heat waves
        for (let i = 0; i < 3; i++) {
          const waveOffset = (time * 30 + i * 20) % 60;
          p.noFill();
          p.stroke(255, 80, 50, 200 - waveOffset * 3);
          p.strokeWeight(2);
          p.arc(cx, baseY + 30, 30 + waveOffset, 20 + waveOffset, p.PI, 0);
        }
        // Flame
        p.noStroke();
        p.fill(255, 80, 50);
        p.ellipse(cx, baseY + 15, 14, 20);
        p.fill(255, 160, 50);
        p.ellipse(cx, baseY + 18, 8, 12);
      } else {
        // Motion arrow bouncing
        const offset = Math.sin(time * 4) * 20;
        p.stroke(50, 180, 255);
        p.strokeWeight(2);
        p.line(cx - 20 + offset, baseY + 15, cx + 20 + offset, baseY + 15);
        // Arrowhead
        p.line(cx + 15 + offset, baseY + 10, cx + 20 + offset, baseY + 15);
        p.line(cx + 15 + offset, baseY + 20, cx + 20 + offset, baseY + 15);
        // Moving object
        p.noStroke();
        p.fill(50, 180, 255);
        p.circle(cx - 20 + offset, baseY + 15, 12);
      }

      // Arrow down
      const arrowY = baseY + 65;
      p.stroke(col.color[0], col.color[1], col.color[2], 120);
      p.strokeWeight(2);
      p.line(cx, arrowY, cx, arrowY + 30);
      p.line(cx - 5, arrowY + 25, cx, arrowY + 30);
      p.line(cx + 5, arrowY + 25, cx, arrowY + 30);

      // Sensor box
      const sensorY = arrowY + 45;
      p.noStroke();
      p.fill(30, 40, 60);
      p.rect(cx - 50, sensorY, 100, 45, 8);
      p.fill(col.color[0], col.color[1], col.color[2]);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("SENSOR", cx, sensorY + 14);
      p.fill(200);
      p.textSize(10);
      p.text(col.sensor, cx, sensorY + 32);

      // Arrow down to signal
      const sigArrowY = sensorY + 50;
      p.stroke(100, 200, 100, 120);
      p.strokeWeight(2);
      p.line(cx, sigArrowY, cx, sigArrowY + 25);
      p.line(cx - 5, sigArrowY + 20, cx, sigArrowY + 25);
      p.line(cx + 5, sigArrowY + 20, cx, sigArrowY + 25);

      // Electrical signal output
      const outY = sigArrowY + 35;
      p.noStroke();
      p.fill(20, 35, 20);
      p.rect(cx - 50, outY, 100, 35, 8);
      p.fill(100, 200, 100);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      // Animated signal value
      let val: string;
      if (idx === 0) {
        val = `${(300 + Math.sin(time * 2) * 150).toFixed(0)} lux`;
      } else if (idx === 1) {
        val = `${(25 + Math.sin(time) * 10).toFixed(1)} °C`;
      } else {
        val = `${(Math.sin(time * 4) * 9.8).toFixed(1)} m/s²`;
      }
      p.text(`Sinal: ${val}`, cx, outY + 17);
    });

    // Label
    p.fill(100);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Transdução: energia ambiental → sinal elétrico", w / 2, h - 5);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 2: Actuator types — shows different actuators producing physical actions
export function ActuatorTypes() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.03;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Tipos de Atuadores", w / 2, 12);

    const cols = [
      { label: "Elétrico", sub: "Motor DC", color: [100, 180, 255] as [number, number, number], x: w / 6 },
      { label: "Pneumático", sub: "Cilindro", color: [180, 130, 255] as [number, number, number], x: w / 2 },
      { label: "Piezoelétrico", sub: "Nano-posicionador", color: [255, 180, 80] as [number, number, number], x: (5 * w) / 6 },
    ];

    // Dividers
    p.stroke(40);
    p.strokeWeight(1);
    p.line(w / 3, 35, w / 3, h - 10);
    p.line((2 * w) / 3, 35, (2 * w) / 3, h - 10);

    cols.forEach((col, idx) => {
      const cx = col.x;

      // Input signal box
      const sigY = 50;
      p.noStroke();
      p.fill(20, 35, 20);
      p.rect(cx - 50, sigY, 100, 30, 8);
      p.fill(100, 200, 100);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Sinal de controle", cx, sigY + 15);

      // Arrow
      p.stroke(col.color[0], col.color[1], col.color[2], 120);
      p.strokeWeight(2);
      p.line(cx, sigY + 35, cx, sigY + 55);
      p.line(cx - 5, sigY + 50, cx, sigY + 55);
      p.line(cx + 5, sigY + 50, cx, sigY + 55);

      // Actuator box
      const actY = sigY + 65;
      p.noStroke();
      p.fill(30, 40, 60);
      p.rect(cx - 55, actY, 110, 45, 8);
      p.fill(col.color[0], col.color[1], col.color[2]);
      p.textSize(11);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("ATUADOR", cx, actY + 14);
      p.fill(180);
      p.textSize(10);
      p.text(col.sub, cx, actY + 32);

      // Arrow to animation area
      p.stroke(col.color[0], col.color[1], col.color[2], 120);
      p.strokeWeight(2);
      p.line(cx, actY + 50, cx, actY + 70);
      p.line(cx - 5, actY + 65, cx, actY + 70);
      p.line(cx + 5, actY + 65, cx, actY + 70);

      // Label
      p.noStroke();
      p.fill(col.color[0], col.color[1], col.color[2]);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text(col.label, cx, actY + 75);

      // Animated output
      const animY = actY + 100;

      if (idx === 0) {
        // Rotating motor
        p.push();
        p.translate(cx, animY + 30);
        p.rotate(time * 3);
        p.stroke(100, 180, 255);
        p.strokeWeight(3);
        p.noFill();
        p.circle(0, 0, 50);
        // Spokes
        for (let i = 0; i < 4; i++) {
          const a = (p.TWO_PI / 4) * i;
          p.line(0, 0, Math.cos(a) * 22, Math.sin(a) * 22);
        }
        p.fill(100, 180, 255);
        p.noStroke();
        p.circle(0, 0, 10);
        p.pop();
        p.fill(120);
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.text("Rotação", cx, animY + 65);
      } else if (idx === 1) {
        // Pneumatic piston extending/retracting
        const extend = (Math.sin(time * 2) + 1) / 2; // 0 to 1
        const pistonLen = 20 + extend * 35;
        // Cylinder body
        p.fill(60);
        p.noStroke();
        p.rect(cx - 30, animY + 10, 60, 25, 4);
        // Piston rod
        p.fill(180, 130, 255);
        p.rect(cx - 5, animY + 35, 10, pistonLen, 2);
        // Piston head
        p.fill(140, 100, 220);
        p.rect(cx - 15, animY + 35 + pistonLen, 30, 8, 3);
        p.fill(120);
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.text("Mov. Linear", cx, animY + 95);
      } else {
        // Piezoelectric — very precise micro movement
        const microMove = Math.sin(time * 5) * 4;
        // Base
        p.fill(60);
        p.noStroke();
        p.rect(cx - 25, animY + 30, 50, 20, 4);
        // Crystal
        p.fill(255, 180, 80);
        p.rect(cx - 15, animY + 10, 30, 20, 3);
        // Tip with micro movement
        p.fill(255, 220, 130);
        const tipX = cx + microMove;
        p.triangle(tipX - 4, animY + 10, tipX + 4, animY + 10, tipX, animY);
        // Scale indicator
        p.fill(120);
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.text(`Δx = ${(microMove * 10).toFixed(1)} nm`, cx, animY + 58);
        p.text("Precisão nanométrica", cx, animY + 72);
      }
    });
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 3: Control loop — sensor → controller → actuator feedback loop
export function ControlLoop() {
  let time = 0;
  let temperature = 30;
  const setpoint = 22;
  let actuatorOn = false;
  let particles: Array<{ x: number; y: number; speed: number; alpha: number }> = [];

  const setup = (p: p5) => {
    p.textFont("monospace");
    // initialize data signal particles
    for (let i = 0; i < 8; i++) {
      particles.push({
        x: 0, y: 0,
        speed: 1.5 + Math.random(),
        alpha: 200,
      });
    }
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.016;

    const w = p.width;
    const h = p.height;

    // Title
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Malha de Controle em Tempo Real", w / 2, 10);

    // Simulate temperature dynamics
    if (actuatorOn) {
      temperature -= 0.03; // cooling
    } else {
      temperature += 0.02; // heating up naturally
    }
    // Decide actuator state
    actuatorOn = temperature > setpoint;

    // Clamp
    temperature = Math.max(18, Math.min(35, temperature));

    // Layout: Sensor (left), Controller (center), Actuator (right)
    const sensorX = w * 0.17;
    const controlX = w * 0.5;
    const actuatorX = w * 0.83;
    const boxY = 70;
    const boxW = 110;
    const boxH = 55;

    // === SENSOR BOX ===
    p.noStroke();
    p.fill(30, 40, 60);
    p.rect(sensorX - boxW / 2, boxY, boxW, boxH, 10);
    p.fill(255, 220, 50);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("SENSOR", sensorX, boxY + 16);
    p.fill(200);
    p.textSize(10);
    p.text("Termistor NTC", sensorX, boxY + 34);
    p.fill(255, 220, 50);
    p.textSize(12);
    p.text(`${temperature.toFixed(1)} °C`, sensorX, boxY + 48);

    // === CONTROLLER BOX ===
    p.noStroke();
    p.fill(30, 40, 60);
    p.rect(controlX - boxW / 2, boxY, boxW, boxH, 10);
    p.fill(100, 200, 100);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("CONTROLADOR", controlX, boxY + 16);
    p.fill(200);
    p.textSize(10);
    p.text(`Setpoint: ${setpoint} °C`, controlX, boxY + 34);
    // Status
    if (temperature > setpoint) {
      p.fill(255, 100, 100);
      p.text("RESFRIAR ↓", controlX, boxY + 48);
    } else {
      p.fill(100, 255, 100);
      p.text("OK ✓", controlX, boxY + 48);
    }

    // === ACTUATOR BOX ===
    p.noStroke();
    p.fill(30, 40, 60);
    p.rect(actuatorX - boxW / 2, boxY, boxW, boxH, 10);
    p.fill(100, 150, 255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("ATUADOR", actuatorX, boxY + 16);
    p.fill(200);
    p.textSize(10);
    p.text("Ar-condicionado", actuatorX, boxY + 34);
    if (actuatorOn) {
      p.fill(100, 200, 255);
      p.text("⚡ LIGADO", actuatorX, boxY + 48);
    } else {
      p.fill(120);
      p.text("DESLIGADO", actuatorX, boxY + 48);
    }

    // === ARROWS between boxes ===
    // Sensor → Controller
    drawArrow(p, sensorX + boxW / 2 + 5, boxY + boxH / 2, controlX - boxW / 2 - 5, boxY + boxH / 2, [255, 220, 50]);
    // Controller → Actuator
    drawArrow(p, controlX + boxW / 2 + 5, boxY + boxH / 2, actuatorX - boxW / 2 - 5, boxY + boxH / 2, [100, 200, 100]);

    // === FEEDBACK ARROW (bottom arc) ===
    p.noFill();
    p.stroke(100, 150, 255, 100);
    p.strokeWeight(2);
    const feedY = boxY + boxH + 55;
    // Draw curved feedback arc using manual vertices
    const arcCx = (actuatorX + sensorX) / 2;
    const arcRx = (actuatorX - sensorX) / 2;
    const arcRy = 40;
    const arcStartY = boxY + boxH + 5;
    p.beginShape();
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const angle = p.PI * t; // 0 → PI (top half of ellipse, flipped down)
      const ax = arcCx + arcRx * Math.cos(p.PI - angle);
      const ay = arcStartY + arcRy * Math.sin(angle);
      p.vertex(ax, ay);
    }
    p.endShape();
    // Arrowhead on feedback
    p.line(sensorX, boxY + boxH + 5, sensorX - 5, boxY + boxH + 12);
    p.line(sensorX, boxY + boxH + 5, sensorX + 5, boxY + boxH + 12);
    // Feedback label
    p.noStroke();
    p.fill(100, 150, 255, 150);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Realimentação (Feedback)", w / 2, arcStartY + arcRy - 5);

    // === TEMPERATURE GRAPH ===
    drawTemperatureGraph(p, w, h, temperature, setpoint, time);
  };

  return <P5Sketch setup={setup} draw={draw} height={400} />;
}

function drawArrow(p: p5, x1: number, y1: number, x2: number, y2: number, color: number[]) {
  p.stroke(color[0], color[1], color[2], 180);
  p.strokeWeight(2);
  p.line(x1, y1, x2, y2);
  // Arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 8;
  p.line(x2, y2, x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4));
  p.line(x2, y2, x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4));
}

const tempHistory: number[] = [];

function drawTemperatureGraph(p: p5, w: number, h: number, temp: number, setpoint: number, time: number) {
  // Store temperature history
  tempHistory.push(temp);
  if (tempHistory.length > 200) tempHistory.shift();

  const graphX = 50;
  const graphY = 220;
  const graphW = w - 100;
  const graphH = h - graphY - 40;

  // Graph background
  p.noStroke();
  p.fill(10, 15, 30);
  p.rect(graphX, graphY, graphW, graphH, 6);

  // Y-axis labels
  p.fill(120);
  p.textSize(9);
  p.textAlign(p.RIGHT, p.CENTER);
  const minT = 18;
  const maxT = 35;
  for (let t = 20; t <= 34; t += 4) {
    const y = graphY + graphH - ((t - minT) / (maxT - minT)) * graphH;
    p.text(`${t}°C`, graphX - 5, y);
    p.stroke(40);
    p.strokeWeight(0.5);
    p.line(graphX, y, graphX + graphW, y);
  }

  // Setpoint line
  const spY = graphY + graphH - ((setpoint - minT) / (maxT - minT)) * graphH;
  p.stroke(100, 200, 100, 120);
  p.strokeWeight(1);
    (p.drawingContext as CanvasRenderingContext2D).setLineDash([5, 5]);
    p.line(graphX, spY, graphX + graphW, spY);
    (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);
  p.noStroke();
  p.fill(100, 200, 100);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(9);
  p.text(`Setpoint: ${setpoint}°C`, graphX + graphW + 5, spY);

  // Temperature line
  p.noFill();
  p.stroke(255, 100, 80);
  p.strokeWeight(2);
  p.beginShape();
  for (let i = 0; i < tempHistory.length; i++) {
    const x = graphX + (i / 200) * graphW;
    const y = graphY + graphH - ((tempHistory[i] - minT) / (maxT - minT)) * graphH;
    p.vertex(x, y);
  }
  p.endShape();

  // Labels
  p.noStroke();
  p.fill(200);
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(10);
  p.text("Temperatura ao longo do tempo", graphX + graphW / 2, graphY + graphH + 8);

  // Legend
  p.fill(255, 100, 80);
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(9);
  p.text("● Temperatura medida", graphX + 10, graphY + 8);
}

// Visualization 4: MEMS scale comparison
export function MEMSScale() {
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
    p.text("Escala: do Macro ao Nano", w / 2, 10);

    // Scale bar
    const barY = 55;
    const barH = 30;
    const margin = 60;

    // Gradient scale bar
    for (let x = margin; x < w - margin; x++) {
      const t = (x - margin) / (w - 2 * margin);
      const r = Math.floor(100 + t * 155);
      const g = Math.floor(200 - t * 100);
      const b = Math.floor(255 - t * 155);
      p.stroke(r, g, b);
      p.line(x, barY, x, barY + barH);
    }

    // Scale labels
    const scales = [
      { label: "1 m", pos: 0, desc: "Macro" },
      { label: "1 mm", pos: 0.33, desc: "Mili" },
      { label: "1 μm", pos: 0.66, desc: "Micro" },
      { label: "1 nm", pos: 1.0, desc: "Nano" },
    ];

    scales.forEach((s) => {
      const x = margin + s.pos * (w - 2 * margin);
      p.stroke(200);
      p.strokeWeight(1);
      p.line(x, barY - 5, x, barY + barH + 5);
      p.noStroke();
      p.fill(220);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(10);
      p.text(s.label, x, barY + barH + 10);
      p.fill(150);
      p.textSize(9);
      p.text(s.desc, x, barY + barH + 23);
    });

    // Objects at different scales
    const objY = 140;
    const objects = [
      {
        label: "Sensor industrial",
        size: "~5 cm",
        pos: 0.08,
        color: [100, 180, 255] as [number, number, number],
        drawSize: 55,
      },
      {
        label: "Acelerômetro MEMS",
        size: "~2 mm",
        pos: 0.38,
        color: [180, 130, 255] as [number, number, number],
        drawSize: 40,
      },
      {
        label: "Micro-espelho DMD",
        size: "~10 μm",
        pos: 0.68,
        color: [255, 180, 80] as [number, number, number],
        drawSize: 28,
      },
      {
        label: "Nano-sensor",
        size: "~100 nm",
        pos: 0.92,
        color: [255, 100, 120] as [number, number, number],
        drawSize: 16,
      },
    ];

    objects.forEach((obj, idx) => {
      const x = margin + obj.pos * (w - 2 * margin);
      const pulse = Math.sin(time * 2 + idx) * 3;

      // Connecting line to scale bar
      p.stroke(obj.color[0], obj.color[1], obj.color[2], 60);
      p.strokeWeight(1);
      p.line(x, barY + barH + 40, x, objY);

      // Object circle
      p.noStroke();
      p.fill(obj.color[0], obj.color[1], obj.color[2], 40);
      p.circle(x, objY + 40, obj.drawSize + pulse + 12);
      p.fill(obj.color[0], obj.color[1], obj.color[2]);
      p.circle(x, objY + 40, obj.drawSize + pulse);

      // Label
      p.fill(220);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(9);
      p.text(obj.label, x, objY + 40 + obj.drawSize / 2 + 12);
      p.fill(obj.color[0], obj.color[1], obj.color[2]);
      p.textSize(10);
      p.text(obj.size, x, objY + 40 + obj.drawSize / 2 + 25);
    });

    // Advantages of miniaturization at bottom
    const advY = h - 85;
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(12);
    p.text("Vantagens da Miniaturização", w / 2, advY);

    const advantages = [
      { icon: "⚡", text: "Menor energia", x: w * 0.15 },
      { icon: "🎯", text: "Mais sensível", x: w * 0.37 },
      { icon: "🏭", text: "Fabricação em massa", x: w * 0.62 },
      { icon: "🔗", text: "Integração", x: w * 0.85 },
    ];

    advantages.forEach((adv, i) => {
      const bounce = Math.sin(time * 2 + i * 1.2) * 3;
      p.textSize(18);
      p.text(adv.icon, adv.x, advY + 20 + bounce);
      p.fill(160);
      p.textSize(9);
      p.text(adv.text, adv.x, advY + 45);
      p.fill(200);
    });
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 5: Interactive Sensor Characteristics — sensitivity, range, resolution
export function SensorCharacteristics() {
  let time = 0;
  let selectedChar = 0; // 0 = sensitivity, 1 = range, 2 = resolution

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
    p.text("Características dos Sensores", w / 2, 10);

    // Tabs
    const tabs = ["Sensibilidade", "Faixa de Medição", "Resolução"];
    const tabW = (w - 40) / 3;

    // Auto-cycle tabs
    selectedChar = Math.floor(time / 4) % 3;

    tabs.forEach((tab, i) => {
      const tx = 20 + i * tabW;
      const isActive = i === selectedChar;
      p.noStroke();
      p.fill(isActive ? 40 : 20, isActive ? 55 : 25, isActive ? 80 : 40);
      p.rect(tx, 35, tabW - 5, 28, 6);
      p.fill(isActive ? 255 : 120);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(tab, tx + tabW / 2 - 2, 49);
    });

    const graphX = 80;
    const graphY = 90;
    const graphW = w - 160;
    const graphH = h - 140;

    // Graph area
    p.noStroke();
    p.fill(10, 15, 30);
    p.rect(graphX, graphY, graphW, graphH, 6);

    // Axes
    p.stroke(60);
    p.strokeWeight(1);
    p.line(graphX, graphY + graphH, graphX + graphW, graphY + graphH); // X
    p.line(graphX, graphY, graphX, graphY + graphH); // Y

    if (selectedChar === 0) {
      // SENSITIVITY: Two sensors with different sensitivity
      // X: Input (temperature), Y: Output (voltage)
      p.noStroke();
      p.fill(120);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text("Entrada (Temperatura °C)", graphX + graphW / 2, graphY + graphH + 10);
      p.push();
      p.translate(graphX - 15, graphY + graphH / 2);
      p.rotate(-p.HALF_PI);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Saída (Tensão mV)", 0, 0);
      p.pop();

      // High sensitivity sensor
      p.stroke(255, 100, 80);
      p.strokeWeight(2);
      p.beginShape();
      for (let i = 0; i <= graphW; i += 3) {
        const x = graphX + i;
        const y = graphY + graphH - (i / graphW) * graphH * 0.9;
        p.vertex(x, y);
      }
      p.endShape();

      // Low sensitivity sensor
      p.stroke(100, 180, 255);
      p.strokeWeight(2);
      p.beginShape();
      for (let i = 0; i <= graphW; i += 3) {
        const x = graphX + i;
        const y = graphY + graphH - (i / graphW) * graphH * 0.4;
        p.vertex(x, y);
      }
      p.endShape();

      // Animated input marker
      const markerT = (Math.sin(time * 1.5) + 1) / 2;
      const mx = graphX + markerT * graphW;
      const myHigh = graphY + graphH - markerT * graphH * 0.9;
      const myLow = graphY + graphH - markerT * graphH * 0.4;

      p.noStroke();
      p.fill(255, 100, 80);
      p.circle(mx, myHigh, 8);
      p.fill(100, 180, 255);
      p.circle(mx, myLow, 8);

      // Dashed vertical line
      p.stroke(150, 150, 150, 80);
      p.strokeWeight(1);
      (p.drawingContext as CanvasRenderingContext2D).setLineDash([3, 3]);
      p.line(mx, graphY, mx, graphY + graphH);
      (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);

      // Legend
      p.noStroke();
      p.fill(255, 100, 80);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(10);
      p.text("● Alta sensibilidade", graphX + 10, graphY + 15);
      p.fill(100, 180, 255);
      p.text("● Baixa sensibilidade", graphX + 10, graphY + 30);

    } else if (selectedChar === 1) {
      // RANGE: Sensor working within valid range
      p.noStroke();
      p.fill(120);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text("Entrada (Temperatura °C)", graphX + graphW / 2, graphY + graphH + 10);
      p.push();
      p.translate(graphX - 15, graphY + graphH / 2);
      p.rotate(-p.HALF_PI);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Saída (Tensão mV)", 0, 0);
      p.pop();

      // Valid range highlight
      const rangeStart = 0.2;
      const rangeEnd = 0.8;
      p.noStroke();
      p.fill(100, 200, 100, 20);
      p.rect(graphX + rangeStart * graphW, graphY, (rangeEnd - rangeStart) * graphW, graphH);

      // Range labels
      p.fill(100, 200, 100);
      p.textSize(9);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text("-10°C", graphX + rangeStart * graphW, graphY + graphH + 25);
      p.text("120°C", graphX + rangeEnd * graphW, graphY + graphH + 25);
      p.text("Faixa válida", graphX + (rangeStart + rangeEnd) / 2 * graphW, graphY + 15);

      // Outside range (red)
      p.fill(255, 80, 80, 15);
      p.rect(graphX, graphY, rangeStart * graphW, graphH);
      p.rect(graphX + rangeEnd * graphW, graphY, (1 - rangeEnd) * graphW, graphH);

      // Sensor line (linear in range, flat outside)
      p.stroke(255, 220, 50);
      p.strokeWeight(2);
      p.beginShape();
      for (let i = 0; i <= graphW; i += 3) {
        const t = i / graphW;
        const x = graphX + i;
        let y: number;
        if (t < rangeStart) {
          y = graphY + graphH - rangeStart * graphH * 0.85;
        } else if (t > rangeEnd) {
          y = graphY + graphH - rangeEnd * graphH * 0.85;
        } else {
          y = graphY + graphH - t * graphH * 0.85;
        }
        p.vertex(x, y);
      }
      p.endShape();

      // Animated marker
      const markerT = (Math.sin(time * 1.2) + 1) / 2;
      const mx = graphX + markerT * graphW;
      const inRange = markerT >= rangeStart && markerT <= rangeEnd;
      let my: number;
      if (markerT < rangeStart) {
        my = graphY + graphH - rangeStart * graphH * 0.85;
      } else if (markerT > rangeEnd) {
        my = graphY + graphH - rangeEnd * graphH * 0.85;
      } else {
        my = graphY + graphH - markerT * graphH * 0.85;
      }
      p.noStroke();
      p.fill(inRange ? [100, 255, 100] : [255, 80, 80]);
      p.circle(mx, my, 10);

      // Status text
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(11);
      if (inRange) {
        p.fill(100, 255, 100);
        p.text("✓ Dentro da faixa", graphX + graphW / 2, graphY + graphH + 30);
      } else {
        p.fill(255, 80, 80);
        p.text("✗ Fora da faixa — leitura imprecisa", graphX + graphW / 2, graphY + graphH + 30);
      }

    } else {
      // RESOLUTION: Staircase vs smooth
      p.noStroke();
      p.fill(120);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text("Entrada (Grandeza física)", graphX + graphW / 2, graphY + graphH + 10);
      p.push();
      p.translate(graphX - 15, graphY + graphH / 2);
      p.rotate(-p.HALF_PI);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Leitura do Sensor", 0, 0);
      p.pop();

      // Ideal (high resolution) — smooth diagonal
      p.stroke(100, 200, 100, 100);
      p.strokeWeight(1);
      (p.drawingContext as CanvasRenderingContext2D).setLineDash([4, 4]);
      p.line(graphX, graphY + graphH, graphX + graphW, graphY);
      (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);

      // Low resolution — staircase
      p.stroke(255, 100, 80);
      p.strokeWeight(2);
      const steps = 8;
      const stepW = graphW / steps;
      const stepH = graphH / steps;
      for (let i = 0; i < steps; i++) {
        const x1 = graphX + i * stepW;
        const y = graphY + graphH - (i + 1) * stepH;
        p.line(x1, y + stepH, x1, y); // vertical
        p.line(x1, y, x1 + stepW, y); // horizontal
      }

      // High resolution — smaller staircase
      p.stroke(100, 180, 255);
      p.strokeWeight(2);
      const stepsHigh = 24;
      const stepWH = graphW / stepsHigh;
      const stepHH = graphH / stepsHigh;
      for (let i = 0; i < stepsHigh; i++) {
        const x1 = graphX + i * stepWH;
        const y = graphY + graphH - (i + 1) * stepHH;
        p.line(x1, y + stepHH, x1, y);
        p.line(x1, y, x1 + stepWH, y);
      }

      // Legend
      p.noStroke();
      p.fill(100, 200, 100);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(9);
      p.text("--- Valor real (ideal)", graphX + 10, graphY + 12);
      p.fill(255, 100, 80);
      p.text("● Baixa resolução (8 níveis)", graphX + 10, graphY + 26);
      p.fill(100, 180, 255);
      p.text("● Alta resolução (24 níveis)", graphX + 10, graphY + 40);
    }
  };

  return <P5Sketch setup={setup} draw={draw} height={350} />;
}

// ===== CHAPTER 2 VISUALIZATIONS =====

// Visualization 6: Sensor categories by measured quantity — animated overview
export function SensorCategoryOverview() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.025;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Classificação de Sensores por Grandeza", w / 2, 10);

    const categories: {
      label: string;
      icon: string;
      color: [number, number, number];
      example: string;
    }[] = [
      { label: "Posição", icon: "↕", color: [100, 180, 255], example: "Encoder / Potenciômetro" },
      { label: "Velocidade", icon: "→", color: [80, 220, 160], example: "Tacômetro / Efeito Hall" },
      { label: "Presença", icon: "◎", color: [255, 180, 80], example: "Indutivo / Capacitivo" },
      { label: "Carga", icon: "⚖", color: [220, 130, 255], example: "Célula de carga / Strain gauge" },
      { label: "Pressão", icon: "⬇", color: [255, 100, 120], example: "Piezoelétrico / Manômetro" },
      { label: "Temperatura", icon: "🌡", color: [255, 80, 50], example: "Termopar / RTD / NTC" },
      { label: "Vazão", icon: "≋", color: [50, 180, 255], example: "Turbina / Ultrassônico" },
    ];

    const cols = 4;
    const rows = 2;
    const cellW = (w - 40) / cols;
    const cellH = 130;
    const startY = 42;

    categories.forEach((cat, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cx = 20 + col * cellW + cellW / 2;
      const cy = startY + row * (cellH + 10) + cellH / 2;

      const pulse = Math.sin(time * 2 + idx * 0.8) * 4;

      // Card background
      p.noStroke();
      p.fill(15, 22, 40);
      p.rect(cx - cellW / 2 + 4, cy - cellH / 2, cellW - 8, cellH, 10);

      // Glowing circle
      p.fill(cat.color[0], cat.color[1], cat.color[2], 25);
      p.circle(cx, cy - 20, 56 + pulse);
      p.fill(cat.color[0], cat.color[1], cat.color[2]);
      p.circle(cx, cy - 20, 40 + pulse);

      // Icon
      p.fill(2, 7, 19);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(18);
      p.text(cat.icon, cx, cy - 21);

      // Label
      p.fill(230);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text(cat.label, cx, cy + 10);

      // Example
      p.fill(cat.color[0], cat.color[1], cat.color[2], 180);
      p.textSize(8);
      p.text(cat.example, cx, cy + 28);

      // Animated signal bar
      const barW = cellW - 30;
      const barH = 6;
      const barX = cx - barW / 2;
      const barY = cy + 48;
      p.fill(30, 40, 60);
      p.rect(barX, barY, barW, barH, 3);
      const fillFrac = (Math.sin(time * 1.5 + idx * 1.1) + 1) / 2;
      p.fill(cat.color[0], cat.color[1], cat.color[2]);
      p.rect(barX, barY, barW * fillFrac, barH, 3);
    });
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}

// Visualization 7: Actuator categories — animated overview
export function ActuatorCategoryOverview() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.025;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Categorias de Atuadores", w / 2, 10);

    const actuators: {
      label: string;
      color: [number, number, number];
      type: string;
    }[] = [
      { label: "Válvula Pneumática", color: [180, 130, 255], type: "valve" },
      { label: "Válvula Hidráulica", color: [100, 180, 255], type: "valve-hyd" },
      { label: "Relé", color: [255, 220, 50], type: "relay" },
      { label: "Cilindro", color: [80, 220, 160], type: "cylinder" },
      { label: "Motor Elétrico", color: [255, 100, 120], type: "motor" },
      { label: "Músculo Artificial", color: [255, 160, 80], type: "muscle" },
    ];

    const cols = 3;
    const cellW = (w - 30) / cols;
    const cellH = 150;
    const startY = 38;

    actuators.forEach((act, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cx = 15 + col * cellW + cellW / 2;
      const cy = startY + row * (cellH + 8) + cellH / 2;

      // Card
      p.noStroke();
      p.fill(15, 22, 40);
      p.rect(cx - cellW / 2 + 3, cy - cellH / 2, cellW - 6, cellH, 10);

      const animY = cy - 20;

      // Animated actuator illustration
      if (act.type === "valve" || act.type === "valve-hyd") {
        // Valve opening/closing
        const openness = (Math.sin(time * 2 + idx) + 1) / 2;
        const valveColor = act.color;
        // Pipe
        p.fill(40, 50, 70);
        p.rect(cx - 35, animY - 5, 70, 12, 3);
        // Valve body
        p.fill(valveColor[0], valveColor[1], valveColor[2]);
        p.rect(cx - 8, animY - 18, 16, 14, 3);
        // Flow particles
        for (let i = 0; i < 5; i++) {
          const px = ((time * 60 + i * 16) % 70) - 35;
          if (Math.abs(px) < 6 && openness < 0.3) continue;
          p.fill(valveColor[0], valveColor[1], valveColor[2], 120 + openness * 100);
          p.circle(cx + px, animY + 1, 3 + openness * 2);
        }
        // Gate
        const gateH = 10 * (1 - openness);
        p.fill(80, 90, 110);
        p.rect(cx - 4, animY - 4, 8, gateH);
        // Status
        p.fill(180);
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.text(openness > 0.5 ? "Aberta" : "Fechada", cx, animY + 16);
      } else if (act.type === "relay") {
        // Relay switching
        const on = Math.sin(time * 3) > 0;
        // Coil
        p.noFill();
        p.stroke(255, 220, 50, 150);
        p.strokeWeight(2);
        for (let i = 0; i < 4; i++) {
          p.arc(cx - 15, animY - 8 + i * 6, 14, 8, -p.HALF_PI, p.HALF_PI);
        }
        p.noStroke();
        // Contact arm
        p.stroke(on ? 255 : 120, on ? 220 : 120, on ? 50 : 120);
        p.strokeWeight(3);
        const armAngle = on ? 0 : -0.4;
        p.line(cx + 5, animY + 5, cx + 5 + Math.cos(armAngle) * 25, animY + 5 + Math.sin(armAngle) * 25);
        p.noStroke();
        // Contact point
        p.fill(on ? [100, 255, 100] : [255, 80, 80]);
        p.circle(cx + 30, animY + 5, 8);
        // Spark
        if (on) {
          const sparkAlpha = (Math.sin(time * 20) + 1) * 80;
          p.fill(255, 255, 100, sparkAlpha);
          p.circle(cx + 30, animY + 5, 14);
        }
        p.fill(180);
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.text(on ? "Fechado (ON)" : "Aberto (OFF)", cx, animY + 22);
      } else if (act.type === "cylinder") {
        // Extending/retracting cylinder
        const extend = (Math.sin(time * 1.8 + 1) + 1) / 2;
        const pistonLen = 10 + extend * 30;
        // Cylinder body
        p.fill(50, 65, 85);
        p.rect(cx - 25, animY - 12, 50, 24, 5);
        // Rod
        p.fill(80, 220, 160);
        p.rect(cx + 25, animY - 4, pistonLen, 8, 2);
        // Piston head
        p.fill(60, 180, 130);
        p.rect(cx + 25 + pistonLen, animY - 8, 6, 16, 2);
        // Arrows
        p.fill(180);
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.text(`Ext: ${(extend * 100).toFixed(0)}%`, cx, animY + 20);
      } else if (act.type === "motor") {
        // Rotating motor
        p.push();
        p.translate(cx, animY);
        p.rotate(time * 4);
        p.stroke(255, 100, 120);
        p.strokeWeight(3);
        p.noFill();
        p.circle(0, 0, 36);
        for (let i = 0; i < 4; i++) {
          const a = (p.TWO_PI / 4) * i;
          p.line(0, 0, Math.cos(a) * 16, Math.sin(a) * 16);
        }
        p.fill(255, 100, 120);
        p.noStroke();
        p.circle(0, 0, 8);
        p.pop();
        p.fill(180);
        p.noStroke();
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        const rpm = Math.abs(Math.sin(time * 0.5)) * 3000;
        p.text(`${rpm.toFixed(0)} RPM`, cx, animY + 26);
      } else if (act.type === "muscle") {
        // Artificial muscle contracting/expanding
        const contract = (Math.sin(time * 2.5) + 1) / 2;
        const muscleW = 40 + (1 - contract) * 20;
        const muscleH = 14 + contract * 10;
        p.fill(255, 160, 80);
        p.noStroke();
        // Zigzag pattern to represent fiber
        p.beginShape();
        const segs = 8;
        for (let i = 0; i <= segs; i++) {
          const sx = cx - muscleW / 2 + (muscleW / segs) * i;
          const sy = animY + (i % 2 === 0 ? -muscleH / 2 : muscleH / 2);
          p.vertex(sx, sy);
        }
        for (let i = segs; i >= 0; i--) {
          const sx = cx - muscleW / 2 + (muscleW / segs) * i;
          const sy = animY + (i % 2 === 0 ? -muscleH / 2 + 6 : muscleH / 2 + 6);
          p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
        // Attachment points
        p.fill(200);
        p.circle(cx - muscleW / 2, animY + 3, 6);
        p.circle(cx + muscleW / 2, animY + 3, 6);
        p.fill(180);
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.text(contract > 0.5 ? "Contraído" : "Relaxado", cx, animY + 24);
      }

      // Label
      p.noStroke();
      p.fill(act.color[0], act.color[1], act.color[2]);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(act.label, cx, cy + cellH / 2 - 6);
    });
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 8: Position & velocity sensor demo — interactive
export function PositionVelocitySensor() {
  let objX = 200;
  let objV = 0;
  let prevX = 200;
  let time = 0;
  const posHistory: number[] = [];
  const velHistory: number[] = [];

  const setup = (p: p5) => {
    p.textFont("monospace");
    objX = p.width / 2;
    prevX = objX;
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 1;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Sensor de Posição e Velocidade", w / 2, 8);
    p.fill(120);
    p.textSize(10);
    p.text("Mova o mouse horizontalmente sobre a visualização", w / 2, 26);

    // Track object to mouse X
    const targetX = Math.max(40, Math.min(w - 40, p.mouseX));
    prevX = objX;
    objX += (targetX - objX) * 0.1;
    objV = objX - prevX;

    // Rail
    const railY = 80;
    p.fill(30, 40, 60);
    p.rect(30, railY, w - 60, 8, 4);

    // Object on rail
    p.fill(100, 180, 255);
    p.rect(objX - 15, railY - 18, 30, 26, 6);
    p.fill(60, 140, 220);
    p.rect(objX - 10, railY - 14, 20, 18, 4);

    // Position indicator
    p.stroke(100, 180, 255, 100);
    p.strokeWeight(1);
    (p.drawingContext as CanvasRenderingContext2D).setLineDash([3, 3]);
    p.line(objX, railY + 12, objX, railY + 35);
    (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);
    p.noStroke();

    // Position readout
    const posNorm = ((objX - 30) / (w - 60) * 100).toFixed(1);
    p.fill(100, 180, 255);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(11);
    p.text(`Posição: ${posNorm}%`, w / 4, railY + 40);

    // Velocity readout
    const velColor: [number, number, number] = objV > 0.5 ? [80, 220, 160] : objV < -0.5 ? [255, 100, 120] : [160, 160, 160];
    p.fill(velColor[0], velColor[1], velColor[2]);
    p.text(`Velocidade: ${(objV * 5).toFixed(1)} un/s`, (3 * w) / 4, railY + 40);

    // Direction arrow
    if (Math.abs(objV) > 0.3) {
      p.fill(velColor[0], velColor[1], velColor[2]);
      const arrowDir = objV > 0 ? 1 : -1;
      p.triangle(
        objX + arrowDir * 25, railY - 5,
        objX + arrowDir * 18, railY - 10,
        objX + arrowDir * 18, railY
      );
    }

    // Store history
    posHistory.push(parseFloat(posNorm));
    velHistory.push(objV * 5);
    if (posHistory.length > 180) { posHistory.shift(); velHistory.shift(); }

    // Graphs
    const graphY = railY + 65;
    const graphH = (h - graphY - 30) / 2 - 8;
    const graphW = w - 100;
    const graphX = 70;

    // Position graph
    p.noStroke();
    p.fill(10, 15, 30);
    p.rect(graphX, graphY, graphW, graphH, 6);
    p.fill(120);
    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(9);
    p.text("Pos %", graphX - 5, graphY + graphH / 2);

    p.stroke(100, 180, 255);
    p.strokeWeight(1.5);
    p.noFill();
    p.beginShape();
    for (let i = 0; i < posHistory.length; i++) {
      const x = graphX + (i / 180) * graphW;
      const y = graphY + graphH - (posHistory[i] / 100) * graphH;
      p.vertex(x, y);
    }
    p.endShape();

    // Velocity graph
    const vGraphY = graphY + graphH + 16;
    p.noStroke();
    p.fill(10, 15, 30);
    p.rect(graphX, vGraphY, graphW, graphH, 6);
    p.fill(120);
    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(9);
    p.text("Vel", graphX - 5, vGraphY + graphH / 2);

    // Zero line
    p.stroke(60);
    p.strokeWeight(0.5);
    p.line(graphX, vGraphY + graphH / 2, graphX + graphW, vGraphY + graphH / 2);

    p.stroke(80, 220, 160);
    p.strokeWeight(1.5);
    p.noFill();
    p.beginShape();
    for (let i = 0; i < velHistory.length; i++) {
      const x = graphX + (i / 180) * graphW;
      const clampedV = Math.max(-15, Math.min(15, velHistory[i]));
      const y = vGraphY + graphH / 2 - (clampedV / 15) * (graphH / 2);
      p.vertex(x, y);
    }
    p.endShape();
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 9: Presence sensor demo — object detection zones
export function PresenceSensorDemo() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.02;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Sensores de Presença", w / 2, 10);

    const sensors: {
      label: string;
      type: string;
      color: [number, number, number];
      range: number;
      x: number;
    }[] = [
      { label: "Indutivo", type: "inductive", color: [100, 180, 255], range: 50, x: w * 0.2 },
      { label: "Capacitivo", type: "capacitive", color: [180, 130, 255], range: 70, x: w * 0.5 },
      { label: "Ultrassônico", type: "ultrasonic", color: [80, 220, 160], range: 120, x: w * 0.8 },
    ];

    const sensorY = 100;

    sensors.forEach((s) => {
      // Sensor body
      p.noStroke();
      p.fill(30, 45, 65);
      p.rect(s.x - 18, sensorY - 12, 36, 24, 6);
      p.fill(s.color[0], s.color[1], s.color[2]);
      p.circle(s.x, sensorY, 16);

      // Detection zone (cone expanding downward)
      p.noStroke();
      p.fill(s.color[0], s.color[1], s.color[2], 20);
      p.triangle(
        s.x - 5, sensorY + 14,
        s.x + 5, sensorY + 14,
        s.x + s.range * 0.5, sensorY + 14 + s.range * 1.5
      );
      p.triangle(
        s.x - 5, sensorY + 14,
        s.x + 5, sensorY + 14,
        s.x - s.range * 0.5, sensorY + 14 + s.range * 1.5
      );

      // Animated detection pulses
      for (let i = 0; i < 3; i++) {
        const pulseT = ((time * 1.5 + i * 0.33) % 1);
        const pulseY = sensorY + 14 + pulseT * s.range * 1.5;
        const pulseW = pulseT * s.range * 0.5;
        p.noFill();
        p.stroke(s.color[0], s.color[1], s.color[2], (1 - pulseT) * 150);
        p.strokeWeight(1.5);
        p.arc(s.x, pulseY, pulseW * 2, 10, 0, p.PI);
      }

      // Moving object entering detection zone
      const objCycle = (Math.sin(time * 1.2 + sensors.indexOf(s) * 2) + 1) / 2;
      const objY = sensorY + 30 + objCycle * s.range * 1.2;
      const inRange = objCycle < 0.75;

      // Object
      p.noStroke();
      p.fill(inRange ? [255, 255, 255] : [80, 80, 80]);
      p.rect(s.x - 10, objY - 6, 20, 12, 3);

      // Detection status
      p.noStroke();
      p.fill(inRange ? [100, 255, 100] : [255, 80, 80]);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(10);
      p.text(inRange ? "DETECTADO" : "Fora do alcance", s.x, sensorY + 14 + s.range * 1.5 + 15);

      // Label
      p.fill(s.color[0], s.color[1], s.color[2]);
      p.textSize(11);
      p.text(s.label, s.x, sensorY + 14 + s.range * 1.5 + 32);

      // Range label
      p.fill(100);
      p.textSize(8);
      p.text(`Alcance: ~${s.range === 50 ? '5 mm' : s.range === 70 ? '20 mm' : '2 m'}`, s.x, sensorY + 14 + s.range * 1.5 + 48);
    });
  };

  return <P5Sketch setup={setup} draw={draw} height={370} />;
}

// Visualization 10: Pressure & flow sensor demo
export function PressureFlowDemo() {
  let time = 0;
  const particles: Array<{ x: number; y: number; speed: number }> = [];
  let initialized = false;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.02;

    const w = p.width;
    const h = p.height;

    if (!initialized) {
      for (let i = 0; i < 30; i++) {
        particles.push({ x: Math.random() * (w * 0.35), y: 0, speed: 1 + Math.random() * 2 });
      }
      initialized = true;
    }

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Sensores de Pressão e Vazão", w / 2, 10);

    // === LEFT HALF: Pressure sensor ===
    const leftW = w / 2 - 15;
    p.fill(15, 22, 40);
    p.rect(10, 38, leftW, h - 50, 10);

    p.fill(255, 100, 120);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Sensor de Pressão", 10 + leftW / 2, 48);

    // Tank
    const tankX = 10 + leftW / 2;
    const tankY = 95;
    const tankW = 100;
    const tankH = 120;
    p.fill(30, 45, 65);
    p.rect(tankX - tankW / 2, tankY, tankW, tankH, 6);

    // Animated pressure level
    const pressure = (Math.sin(time * 0.8) + 1) / 2;
    const fillH = pressure * (tankH - 10);
    p.fill(255, 100, 120, 80);
    p.rect(tankX - tankW / 2 + 5, tankY + tankH - 5 - fillH, tankW - 10, fillH, 3);

    // Pressure arrows inside
    for (let i = 0; i < 4; i++) {
      const arrowY = tankY + tankH - 15 - (fillH / 4) * i;
      if (arrowY < tankY + 5) continue;
      const arrowAlpha = 100 + pressure * 120;
      p.fill(255, 100, 120, arrowAlpha);
      const arrowSize = 3 + pressure * 4;
      // Arrows pointing outward
      p.triangle(
        tankX - 20, arrowY,
        tankX - 20 - arrowSize, arrowY - arrowSize / 2,
        tankX - 20 - arrowSize, arrowY + arrowSize / 2
      );
      p.triangle(
        tankX + 20, arrowY,
        tankX + 20 + arrowSize, arrowY - arrowSize / 2,
        tankX + 20 + arrowSize, arrowY + arrowSize / 2
      );
    }

    // Sensor on the side of tank
    p.fill(255, 100, 120);
    p.rect(tankX + tankW / 2, tankY + tankH / 2 - 10, 20, 20, 4);
    p.fill(2, 7, 19);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("P", tankX + tankW / 2 + 10, tankY + tankH / 2);

    // Readout
    const kpa = (pressure * 500).toFixed(0);
    p.fill(255, 100, 120);
    p.textSize(16);
    p.textAlign(p.CENTER, p.TOP);
    p.text(`${kpa} kPa`, tankX, tankY + tankH + 20);
    p.fill(120);
    p.textSize(9);
    p.text("Piezoelétrico", tankX, tankY + tankH + 42);

    // === RIGHT HALF: Flow sensor ===
    const rightX = w / 2 + 5;
    p.noStroke();
    p.fill(15, 22, 40);
    p.rect(rightX, 38, leftW, h - 50, 10);

    p.fill(50, 180, 255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Sensor de Vazão", rightX + leftW / 2, 48);

    // Pipe
    const pipeY = 140;
    const pipeH = 40;
    const pipeLX = rightX + 20;
    const pipeRX = rightX + leftW - 20;
    p.fill(30, 45, 65);
    p.rect(pipeLX, pipeY, pipeRX - pipeLX, pipeH, 6);

    // Flow rate oscillation
    const flowRate = (Math.sin(time * 1.2) + 1) / 2 * 0.8 + 0.2;

    // Flow particles
    particles.forEach((pt) => {
      pt.x += pt.speed * flowRate * 1.5;
      if (pt.x > pipeRX - pipeLX - 10) pt.x = 0;
      const px = pipeLX + 10 + pt.x;
      const py = pipeY + 8 + (Math.sin(pt.x * 0.1 + time * 3) * 0.3 + 0.5) * (pipeH - 16);
      p.fill(50, 180, 255, 120 + flowRate * 100);
      p.noStroke();
      p.circle(px, py, 4 + flowRate * 2);
    });

    // Turbine sensor in middle of pipe
    const turbineX = pipeLX + (pipeRX - pipeLX) / 2;
    p.push();
    p.translate(turbineX, pipeY + pipeH / 2);
    p.rotate(time * flowRate * 8);
    p.stroke(50, 220, 255);
    p.strokeWeight(2);
    for (let i = 0; i < 3; i++) {
      const a = (p.TWO_PI / 3) * i;
      p.line(0, 0, Math.cos(a) * 12, Math.sin(a) * 12);
    }
    p.noStroke();
    p.fill(50, 220, 255);
    p.circle(0, 0, 6);
    p.pop();

    // Readout
    const lpm = (flowRate * 100).toFixed(1);
    p.noStroke();
    p.fill(50, 180, 255);
    p.textSize(16);
    p.textAlign(p.CENTER, p.TOP);
    p.text(`${lpm} L/min`, rightX + leftW / 2, pipeY + pipeH + 25);
    p.fill(120);
    p.textSize(9);
    p.text("Tipo Turbina", rightX + leftW / 2, pipeY + pipeH + 47);

    // Flow direction arrow
    p.fill(50, 180, 255, 100);
    const arrX = pipeLX + 30;
    p.triangle(arrX + 15, pipeY + pipeH / 2, arrX, pipeY + pipeH / 2 - 8, arrX, pipeY + pipeH / 2 + 8);
  };

  return <P5Sketch setup={setup} draw={draw} height={320} />;
}

// ===== CHAPTER 3 — BIOSENSORS VISUALIZATIONS =====

// Visualization 11: Biosensor architecture — biological component + transducer + signal
export function BiosensorArchitecture() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.02;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Arquitetura de um Biossensor", w / 2, 10);

    // Three main blocks: Analito → Biorreceptor → Transdutor → Sinal
    const blockW = 120;
    const blockH = 70;
    const y = 70;
    const gap = 30;
    const totalW = blockW * 4 + gap * 3;
    const startX = (w - totalW) / 2;

    const blocks = [
      {
        label: "ANALITO",
        sub: "Substância-alvo",
        color: [255, 180, 80] as [number, number, number],
        examples: ["Glicose", "Anticorpo", "DNA"],
      },
      {
        label: "BIORRECEPTOR",
        sub: "Componente biológico",
        color: [80, 220, 160] as [number, number, number],
        examples: ["Enzima", "Anticorpo", "Ác. nucleico"],
      },
      {
        label: "TRANSDUTOR",
        sub: "Detector físico-químico",
        color: [100, 150, 255] as [number, number, number],
        examples: ["Eletroquímico", "Óptico", "Piezoelétrico"],
      },
      {
        label: "SINAL",
        sub: "Saída mensurável",
        color: [255, 100, 120] as [number, number, number],
        examples: ["Corrente (A)", "Tensão (V)", "Frequência"],
      },
    ];

    blocks.forEach((block, idx) => {
      const bx = startX + idx * (blockW + gap);
      const cx = bx + blockW / 2;

      // Block background
      p.noStroke();
      p.fill(15, 25, 45);
      p.rect(bx, y, blockW, blockH, 10);

      // Top colored bar
      p.fill(block.color[0], block.color[1], block.color[2]);
      p.rect(bx, y, blockW, 6, 10, 10, 0, 0);

      // Label
      p.fill(block.color[0], block.color[1], block.color[2]);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text(block.label, cx, y + 14);

      // Sub
      p.fill(160);
      p.textSize(9);
      p.text(block.sub, cx, y + 30);

      // Animated cycling examples
      const exIdx = Math.floor(time * 0.8 + idx * 0.5) % block.examples.length;
      p.fill(block.color[0], block.color[1], block.color[2], 180);
      p.textSize(10);
      p.text(block.examples[exIdx], cx, y + 48);

      // Arrow to next block
      if (idx < blocks.length - 1) {
        const ax1 = bx + blockW + 4;
        const ax2 = bx + blockW + gap - 4;
        const ay = y + blockH / 2;

        // Animated traveling dots
        const dotPos = (time * 2 + idx * 0.7) % 1;
        const dotX = ax1 + dotPos * (ax2 - ax1);
        p.fill(block.color[0], block.color[1], block.color[2], 200);
        p.circle(dotX, ay, 6);

        // Arrow line
        p.stroke(block.color[0], block.color[1], block.color[2], 80);
        p.strokeWeight(2);
        p.line(ax1, ay, ax2, ay);
        // Arrowhead
        p.line(ax2 - 6, ay - 4, ax2, ay);
        p.line(ax2 - 6, ay + 4, ax2, ay);
        p.noStroke();
      }
    });

    // Bottom section: biological recognition illustration
    const secY = y + blockH + 30;

    p.fill(180);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(11);
    p.text("Reconhecimento biológico: interação específica analito–biorreceptor", w / 2, secY);

    // Lock-and-key animation
    const lockY = secY + 35;
    const lockCx = w / 2;

    // Bioreceptor (lock shape)
    p.fill(80, 220, 160);
    p.rect(lockCx + 5, lockY - 18, 50, 36, 0, 8, 8, 0);
    // Notch in the lock
    p.fill(2, 7, 19);
    p.rect(lockCx + 5, lockY - 10, 16, 20, 4, 0, 0, 4);

    p.fill(80, 220, 160, 150);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Biorreceptor", lockCx + 30, lockY + 28);

    // Analyte (key shape) — approaches from left
    const approach = Math.min(1, (Math.sin(time * 1.5) + 1) / 2 * 1.3);
    const keyX = lockCx - 60 + approach * 52;

    p.fill(255, 180, 80);
    p.rect(keyX - 40, lockY - 8, 30, 16, 4, 0, 0, 4);
    // Key teeth
    p.rect(keyX - 10, lockY - 10, 14, 20, 3);

    p.fill(255, 180, 80, 150);
    p.textSize(8);
    p.text("Analito", keyX - 25, lockY + 28);

    // Binding indicator
    if (approach > 0.85) {
      p.fill(100, 255, 150, 150 + Math.sin(time * 6) * 80);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("✓ Ligação específica", w / 2, lockY + 45);
    }

    // Four bioreceptor types at the bottom
    const typesY = lockY + 60;
    const types = [
      { name: "Enzimas", icon: "⚡", color: [80, 220, 160] as [number, number, number] },
      { name: "Anticorpos", icon: "Y", color: [255, 180, 80] as [number, number, number] },
      { name: "Ác. Nucleicos", icon: "🧬", color: [180, 130, 255] as [number, number, number] },
      { name: "Tecidos", icon: "◉", color: [255, 100, 120] as [number, number, number] },
    ];

    const typeSpacing = w / (types.length + 1);
    types.forEach((t, i) => {
      const tx = typeSpacing * (i + 1);
      const bounce = Math.sin(time * 2 + i * 1.5) * 3;

      p.fill(t.color[0], t.color[1], t.color[2], 30);
      p.noStroke();
      p.circle(tx, typesY + bounce, 40);
      p.fill(t.color[0], t.color[1], t.color[2]);
      p.circle(tx, typesY + bounce, 28);

      p.fill(2, 7, 19);
      p.textSize(14);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(t.icon, tx, typesY + bounce - 1);

      p.fill(200);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text(t.name, tx, typesY + 22 + bounce);
    });
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

// Visualization 12: Glucose biosensor — step-by-step electrochemical reaction
export function GlucoseBiosensor() {
  let time = 0;
  let step = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.018;

    const w = p.width;
    const h = p.height;

    // Auto-advance steps
    step = Math.floor(time / 3.5) % 4;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Biossensor de Glicose — Funcionamento", w / 2, 8);

    // Step indicators
    const steps = [
      "1. Glicose chega ao eletrodo",
      "2. Enzima GOx catalisa reação",
      "3. H₂O₂ é produzido",
      "4. Eletrodo mede corrente",
    ];

    const tabY = 32;
    const tabW = (w - 20) / 4;
    steps.forEach((s, i) => {
      const tx = 10 + i * tabW;
      const active = i === step;
      p.noStroke();
      p.fill(active ? 25 : 12, active ? 40 : 18, active ? 65 : 30);
      p.rect(tx, tabY, tabW - 4, 24, 6);
      p.fill(active ? 255 : 90);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(s, tx + tabW / 2 - 2, tabY + 12);
    });

    // Main diagram area
    const diagY = 68;
    const diagH = h - diagY - 10;

    // Blood sample area (left)
    const bloodX = 30;
    const bloodW = w * 0.25;
    p.fill(15, 22, 40);
    p.rect(bloodX, diagY, bloodW, diagH - 50, 8);
    p.fill(180, 40, 60, 80);
    p.rect(bloodX + 5, diagY + 5, bloodW - 10, diagH - 60, 6);

    p.fill(255, 180, 180);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Amostra de sangue", bloodX + bloodW / 2, diagY + diagH - 42);

    // Glucose molecules floating in blood
    const glucoseCount = 12;
    for (let i = 0; i < glucoseCount; i++) {
      const gx = bloodX + 15 + ((i * 37 + time * 20) % (bloodW - 30));
      const gy = diagY + 20 + ((i * 23 + Math.sin(time + i) * 15) % (diagH - 90));
      const moving = step >= 0;
      const targetX = step >= 1 ? bloodX + bloodW + 20 : gx;

      const drawX = moving && i < 4
        ? gx + (targetX - gx) * Math.min(1, ((time % 3.5) / 3.5) * 2)
        : gx;

      p.fill(255, 180, 80, i < 4 && step >= 1 ? 100 : 200);
      p.noStroke();
      // Hexagonal glucose shape
      p.push();
      p.translate(drawX, gy);
      p.beginShape();
      for (let a = 0; a < 6; a++) {
        const angle = (p.TWO_PI / 6) * a - p.HALF_PI;
        p.vertex(Math.cos(angle) * 7, Math.sin(angle) * 7);
      }
      p.endShape(p.CLOSE);
      p.pop();
    }

    p.fill(255, 180, 80);
    p.textSize(7);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Glicose", bloodX + bloodW / 2, diagY + diagH - 48);

    // Enzyme layer (middle)
    const enzX = bloodX + bloodW + 10;
    const enzW = w * 0.25;
    p.fill(15, 22, 40);
    p.rect(enzX, diagY, enzW, diagH - 50, 8);

    // Enzyme molecules (GOx)
    const enzCx = enzX + enzW / 2;
    for (let i = 0; i < 5; i++) {
      const ey = diagY + 25 + i * ((diagH - 90) / 5);
      const wobble = Math.sin(time * 3 + i) * 2;
      const active = step >= 1;

      p.fill(active ? 80 : 40, active ? 220 : 120, active ? 160 : 80);
      p.noStroke();
      p.ellipse(enzCx + wobble, ey, 28, 20);
      p.fill(2, 7, 19);
      p.textSize(7);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("GOx", enzCx + wobble, ey);

      // Reaction sparks when active
      if (step >= 2 && active) {
        const sparkAlpha = (Math.sin(time * 8 + i * 2) + 1) * 60;
        p.fill(255, 255, 100, sparkAlpha);
        p.circle(enzCx + wobble + 18, ey - 5, 6);
        p.circle(enzCx + wobble - 16, ey + 4, 5);
      }
    }

    p.fill(80, 220, 160);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Camada enzimática", enzCx, diagY + diagH - 42);
    p.fill(80, 220, 160, 150);
    p.textSize(7);
    p.text("Glicose Oxidase", enzCx, diagY + diagH - 30);

    // H2O2 molecules (appear in step 2+)
    if (step >= 2) {
      const h2o2X = enzX + enzW + 5;
      for (let i = 0; i < 4; i++) {
        const hx = h2o2X + ((time * 25 + i * 20) % 40);
        const hy = diagY + 30 + i * ((diagH - 100) / 4);
        const alpha = Math.min(255, ((time % 3.5) - 1) * 200);
        p.fill(180, 130, 255, Math.max(0, alpha));
        p.noStroke();
        p.circle(hx, hy, 8);
        p.fill(2, 7, 19, Math.max(0, alpha));
        p.textSize(5);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("H₂O₂", hx, hy);
      }
    }

    // Electrode / transducer (right)
    const elecX = enzX + enzW + 45;
    const elecW = w * 0.22;
    p.fill(15, 22, 40);
    p.rect(elecX, diagY, elecW, diagH - 50, 8);

    // Electrode bar
    const barX = elecX + 10;
    const barW = 16;
    p.fill(step >= 3 ? 100 : 50, step >= 3 ? 150 : 70, step >= 3 ? 255 : 120);
    p.rect(barX, diagY + 10, barW, diagH - 70, 4);

    // Electron flow on electrode
    if (step >= 3) {
      for (let i = 0; i < 6; i++) {
        const ey = diagY + 15 + ((time * 50 + i * 30) % (diagH - 80));
        p.fill(100, 200, 255, 180);
        p.circle(barX + barW / 2, ey, 5);
        p.fill(255);
        p.textSize(5);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("e⁻", barX + barW / 2, ey);
      }
    }

    // Current readout
    const readoutX = elecX + barW + 25;
    if (step >= 3) {
      const current = (Math.sin(time * 2) * 0.3 + 5.2).toFixed(1);
      p.fill(100, 200, 255);
      p.textSize(20);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`${current} μA`, readoutX + 30, diagY + diagH / 2 - 20);
      p.fill(160);
      p.textSize(9);
      p.text("Corrente ∝ [Glicose]", readoutX + 30, diagY + diagH / 2 + 5);

      // Concentration indicator
      const concMg = (parseFloat(current) * 20).toFixed(0);
      p.fill(255, 180, 80);
      p.textSize(14);
      p.text(`≈ ${concMg} mg/dL`, readoutX + 30, diagY + diagH / 2 + 30);
    }

    p.fill(100, 150, 255);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Eletrodo transdutor", elecX + elecW / 2, diagY + diagH - 42);

    // Chemical equation at bottom
    p.fill(200);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Glicose + O₂  →  Ácido glucônico + H₂O₂  →  e⁻ (corrente)", w / 2, h - 2);
    p.fill(80, 220, 160, 120);
    p.textSize(8);
    p.text("GOx", w / 2 - 60, h - 14);
  };

  return <P5Sketch setup={setup} draw={draw} height={400} />;
}

// Visualization 13: Transducer types for biosensors
export function BiosensorTransducers() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.025;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Tipos de Transdutores em Biossensores", w / 2, 10);

    const transducers: {
      label: string;
      sub: string;
      color: [number, number, number];
      signal: string;
    }[] = [
      { label: "Eletroquímico", sub: "Amperométrico / Potenciométrico", color: [100, 180, 255], signal: "Corrente / Tensão" },
      { label: "Óptico", sub: "Fluorescência / SPR", color: [80, 220, 160], signal: "Intensidade de luz" },
      { label: "Piezoelétrico", sub: "Microbalança de cristal (QCM)", color: [255, 180, 80], signal: "Freq. de ressonância" },
      { label: "Térmico", sub: "Calorimétrico", color: [255, 100, 120], signal: "Variação de temp." },
    ];

    const colW = (w - 30) / transducers.length;
    const startY = 40;
    const cardH = h - 60;

    // Dividers
    p.stroke(30);
    p.strokeWeight(1);
    for (let i = 1; i < transducers.length; i++) {
      p.line(15 + i * colW, startY, 15 + i * colW, startY + cardH);
    }
    p.noStroke();

    transducers.forEach((tr, idx) => {
      const cx = 15 + idx * colW + colW / 2;

      // Header
      p.fill(tr.color[0], tr.color[1], tr.color[2]);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text(tr.label, cx, startY + 5);
      p.fill(130);
      p.textSize(8);
      p.text(tr.sub, cx, startY + 22);

      // Animation area
      const animY = startY + 55;
      const animH = 140;

      if (idx === 0) {
        // Electrochemical: electrode with electron flow
        // Electrode
        p.fill(60, 80, 120);
        p.rect(cx - 6, animY, 12, animH - 20, 3);
        // Electrolyte
        p.fill(100, 180, 255, 20);
        p.rect(cx - 35, animY + 10, 70, animH - 30, 6);
        // Electrons flowing
        for (let i = 0; i < 5; i++) {
          const ey = animY + 5 + ((time * 40 + i * 25) % (animH - 30));
          p.fill(100, 200, 255, 180);
          p.circle(cx, ey, 6);
          p.fill(2, 7, 19);
          p.textSize(5);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("e⁻", cx, ey);
        }
        // Current meter
        const current = (Math.sin(time * 2) * 0.5 + 3).toFixed(1);
        p.fill(100, 200, 255);
        p.textSize(12);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`${current} μA`, cx, animY + animH + 5);
      } else if (idx === 1) {
        // Optical: light beam hitting surface, fluorescence
        // Light source
        p.fill(80, 220, 160);
        p.circle(cx - 30, animY + 20, 14);
        // Beam
        p.stroke(80, 220, 160, 150);
        p.strokeWeight(2);
        p.line(cx - 23, animY + 20, cx, animY + animH / 2);
        p.noStroke();
        // Surface
        p.fill(40, 55, 80);
        p.rect(cx - 20, animY + animH / 2 - 3, 40, 6, 2);
        // Reflected/fluorescent light
        const fluor = (Math.sin(time * 3) + 1) / 2;
        for (let i = 0; i < 3; i++) {
          const angle = -0.6 + i * 0.6;
          const len = 25 + fluor * 15;
          p.stroke(150, 255, 200, 80 + fluor * 120);
          p.strokeWeight(1.5);
          p.line(
            cx, animY + animH / 2 - 3,
            cx + Math.sin(angle) * len, animY + animH / 2 - 3 - Math.cos(angle) * len
          );
        }
        p.noStroke();
        // Glow
        p.fill(150, 255, 200, fluor * 60);
        p.circle(cx, animY + animH / 2 - 3, 30 + fluor * 15);
        // Intensity
        p.fill(80, 220, 160);
        p.textSize(11);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`${(fluor * 100).toFixed(0)}% int.`, cx, animY + animH + 5);
      } else if (idx === 2) {
        // Piezoelectric: vibrating crystal with mass change
        const freq = 10 + Math.sin(time * 1.5) * 2;
        const vibration = Math.sin(time * freq) * 3;
        // Crystal
        p.fill(255, 180, 80);
        p.push();
        p.translate(cx, animY + animH / 2 + vibration);
        p.rect(-25, -15, 50, 30, 4);
        p.fill(2, 7, 19);
        p.textSize(8);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("Cristal QCM", 0, 0);
        p.pop();
        // Vibration lines
        for (let i = 0; i < 3; i++) {
          const vx = cx + (i - 1) * 18;
          const vAlpha = (Math.sin(time * freq + i) + 1) * 60;
          p.noFill();
          p.stroke(255, 180, 80, vAlpha);
          p.strokeWeight(1);
          p.arc(vx, animY + animH / 2, 10, 20, 0, p.PI);
        }
        p.noStroke();
        // Mass particles landing
        const massT = (time * 0.5) % 2;
        if (massT < 1) {
          for (let i = 0; i < 3; i++) {
            const px = cx - 15 + i * 15;
            const py = animY + 10 + massT * (animH / 2 - 25);
            p.fill(200, 150, 80, 180);
            p.circle(px, py, 5);
          }
        }
        p.fill(255, 180, 80);
        p.textSize(11);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`${freq.toFixed(1)} MHz`, cx, animY + animH + 5);
      } else {
        // Thermal: temperature change from reaction
        // Thermometer
        p.fill(60, 40, 40);
        p.rect(cx - 5, animY + 10, 10, animH - 40, 5);
        const temp = (Math.sin(time * 1.2) + 1) / 2;
        const fillH = temp * (animH - 55);
        p.fill(255, 60 + temp * 60, 60);
        p.rect(cx - 3, animY + animH - 30 - fillH, 6, fillH, 2);
        // Bulb
        p.fill(255, 100, 120);
        p.circle(cx, animY + animH - 25, 18);
        // Heat waves
        for (let i = 0; i < 3; i++) {
          const waveOff = ((time * 30 + i * 15) % 40);
          p.noFill();
          p.stroke(255, 100, 100, 150 - waveOff * 3);
          p.strokeWeight(1.5);
          p.arc(cx + 15, animY + animH / 2, 10 + waveOff, 15 + waveOff, -p.HALF_PI, p.HALF_PI);
        }
        p.noStroke();
        p.fill(255, 100, 120);
        p.textSize(11);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`Δ${(temp * 2).toFixed(2)} °C`, cx, animY + animH + 5);
      }

      // Signal type label
      p.fill(tr.color[0], tr.color[1], tr.color[2], 140);
      p.textSize(8);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(tr.signal, cx, startY + cardH - 5);
    });
  };

  return <P5Sketch setup={setup} draw={draw} height={370} />;
}

// Visualization 14: Glucose concentration vs. current — calibration curve
export function GlucoseCalibrationCurve() {
  let time = 0;
  const dataPoints: Array<{ conc: number; current: number }> = [
    { conc: 0, current: 0.1 },
    { conc: 50, current: 1.2 },
    { conc: 100, current: 2.5 },
    { conc: 150, current: 3.6 },
    { conc: 200, current: 4.5 },
    { conc: 250, current: 5.2 },
    { conc: 300, current: 5.7 },
    { conc: 350, current: 6.0 },
    { conc: 400, current: 6.2 },
    { conc: 450, current: 6.3 },
  ];

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;

    const w = p.width;
    const h = p.height;

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Curva de Calibração — Biossensor de Glicose", w / 2, 10);

    const graphX = 75;
    const graphY = 50;
    const graphW = w - 150;
    const graphH = h - 120;

    // Graph background
    p.fill(10, 15, 30);
    p.rect(graphX, graphY, graphW, graphH, 6);

    // Grid
    p.stroke(30, 40, 55);
    p.strokeWeight(0.5);
    for (let i = 1; i < 5; i++) {
      const gy = graphY + (graphH / 5) * i;
      p.line(graphX, gy, graphX + graphW, gy);
    }
    for (let i = 1; i < 5; i++) {
      const gx = graphX + (graphW / 5) * i;
      p.line(gx, graphY, gx, graphY + graphH);
    }

    // Axes
    p.stroke(80);
    p.strokeWeight(1);
    p.line(graphX, graphY + graphH, graphX + graphW, graphY + graphH);
    p.line(graphX, graphY, graphX, graphY + graphH);
    p.noStroke();

    // Axis labels
    p.fill(160);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Concentração de Glicose (mg/dL)", graphX + graphW / 2, graphY + graphH + 10);

    p.push();
    p.translate(graphX - 20, graphY + graphH / 2);
    p.rotate(-p.HALF_PI);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Corrente (μA)", 0, 0);
    p.pop();

    // X axis ticks
    p.fill(120);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    for (let c = 0; c <= 450; c += 100) {
      const x = graphX + (c / 450) * graphW;
      p.text(`${c}`, x, graphY + graphH + 2);
    }

    // Y axis ticks
    p.textAlign(p.RIGHT, p.CENTER);
    for (let i = 0; i <= 7; i++) {
      const y = graphY + graphH - (i / 7) * graphH;
      p.text(`${i}`, graphX - 5, y);
    }

    // Michaelis-Menten-like saturation curve (smooth)
    p.stroke(100, 180, 255);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let c = 0; c <= 450; c += 3) {
      const x = graphX + (c / 450) * graphW;
      // Michaelis-Menten: I = Imax * c / (Km + c)
      const current = 6.5 * c / (80 + c);
      const y = graphY + graphH - (current / 7) * graphH;
      p.vertex(x, y);
    }
    p.endShape();
    p.noStroke();

    // Data points (appear progressively)
    const pointsToShow = Math.min(dataPoints.length, Math.floor(time * 1.5));
    for (let i = 0; i < pointsToShow; i++) {
      const dp = dataPoints[i];
      const x = graphX + (dp.conc / 450) * graphW;
      const y = graphY + graphH - (dp.current / 7) * graphH;
      p.fill(255, 180, 80);
      p.circle(x, y, 8);
      p.fill(2, 7, 19);
      p.circle(x, y, 4);
    }

    // Animated measurement marker
    const markerConc = ((Math.sin(time * 0.8) + 1) / 2) * 400;
    const markerCurrent = 6.5 * markerConc / (80 + markerConc);
    const markerX = graphX + (markerConc / 450) * graphW;
    const markerY = graphY + graphH - (markerCurrent / 7) * graphH;

    // Dashed crosshair
    p.stroke(255, 100, 120, 100);
    p.strokeWeight(1);
    (p.drawingContext as CanvasRenderingContext2D).setLineDash([4, 4]);
    p.line(markerX, graphY + graphH, markerX, markerY);
    p.line(graphX, markerY, markerX, markerY);
    (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);
    p.noStroke();

    // Marker
    p.fill(255, 100, 120);
    p.circle(markerX, markerY, 10);

    // Readout
    p.fill(255, 100, 120);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(10);
    p.text(`${markerConc.toFixed(0)} mg/dL → ${markerCurrent.toFixed(1)} μA`, markerX + 12, markerY - 2);

    // Regions annotation
    // Linear region
    p.fill(80, 220, 160, 25);
    const linEndConc = 150;
    const linEndX = graphX + (linEndConc / 450) * graphW;
    p.rect(graphX, graphY, linEndX - graphX, graphH);
    p.fill(80, 220, 160);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Região linear", (graphX + linEndX) / 2, graphY + 15);

    // Saturation region
    p.fill(255, 100, 80, 15);
    p.noStroke();
    p.rect(linEndX, graphY, graphX + graphW - linEndX, graphH);
    p.fill(255, 100, 80, 150);
    p.textSize(9);
    p.text("Saturação", (linEndX + graphX + graphW) / 2, graphY + 15);

    // Bottom note
    p.fill(140);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cinética de Michaelis-Menten: I = Imax · [S] / (Km + [S])", w / 2, h - 5);
  };

  return <P5Sketch setup={setup} draw={draw} height={380} />;
}

