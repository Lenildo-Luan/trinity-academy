"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

// Example 1: Simple Animation - Bouncing Ball
export function BouncingBall() {
  let x = 200;
  let y = 200;
  let xSpeed = 3;
  let ySpeed = 2;

  const setup = (p: p5) => {
    p.background(2, 7, 19);
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);

    // Draw the ball
    p.fill(254, 0, 81);
    p.noStroke();
    p.circle(x, y, 30);

    // Update position
    x += xSpeed;
    y += ySpeed;

    // Bounce off edges
    if (x > p.width - 15 || x < 15) {
      xSpeed *= -1;
    }
    if (y > p.height - 15 || y < 15) {
      ySpeed *= -1;
    }
  };

  return <P5Sketch setup={setup} draw={draw}  height={400} />;
}

// Example 2: Interactive - Follow Mouse
export function FollowMouse() {
  const setup = (p: p5) => {
    p.background(0);
  };

  const draw = (p: p5) => {
    p.background(0);

    // Calculate distance from center
    const dx = p.mouseX - p.width / 2;
    const dy = p.mouseY - p.height / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Draw center point
    p.fill(200);
    p.noStroke();
    p.circle(p.width / 2, p.height / 2, 20);

    // Draw line to mouse
    p.stroke(100, 150, 250);
    p.strokeWeight(2);
    p.line(p.width / 2, p.height / 2, p.mouseX, p.mouseY);

    // Draw circle at mouse
    p.fill(250, 100, 100);
    p.noStroke();
    p.circle(p.mouseX, p.mouseY, 30);

    // Display distance
    p.fill(0);
    p.textAlign(p.CENTER);
    p.textSize(16);
    p.text(`Distância: ${Math.round(distance)}px`, p.width / 2, 30);
  };

  return <P5Sketch setup={setup} draw={draw}  height={400} />;
}

// Example 3: Sine Wave Animation
export function SineWave() {
  let angle = 0;

  const setup = (p: p5) => {
    p.background(0);
  };

  const draw = (p: p5) => {
    p.background(0);

    p.stroke(100, 150, 250);
    p.strokeWeight(2);
    p.noFill();

    p.beginShape();
    for (let x = 0; x < p.width; x += 5) {
      const y = p.height / 2 + Math.sin(x * 0.02 + angle) * 100;
      p.vertex(x, y);
    }
    p.endShape();

    angle += 0.05;
  };

  return <P5Sketch setup={setup} draw={draw}  height={300} />;
}

// Example 4: For Loop Visualization - Circles
export function CirclePattern() {
  const setup = (p: p5) => {
    p.background(0);
  };

  const draw = (p: p5) => {
    p.background(0);

    const time = p.frameCount * 0.02;

    // Draw concentric circles
    for (let i = 1; i <= 8; i++) {
      const radius = i * 30;
      const hue = (i * 30 + time * 50) % 360;

      p.noFill();
      p.stroke(hue, 70, 80);
      p.strokeWeight(3);
      p.circle(p.width / 2, p.height / 2, radius * 2);
    }
  };

  return <P5Sketch setup={setup} draw={draw}  height={400} />;
}

// Example 5: Array Visualization - Particles
export function Particles() {
  const particles: Array<{ x: number; y: number; vx: number; vy: number }> =
    [];

  const setup = (p: p5) => {
    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * p.width,
        y: Math.random() * p.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }
  };

  const draw = (p: p5) => {
    p.background(0); // Fading trail effect

    particles.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;

      // Draw particle
      p.fill(100, 150, 250);
      p.noStroke();
      p.circle(particle.x, particle.y, 8);
    });
  };

  return <P5Sketch setup={setup} draw={draw}  height={400} />;
}

// Example 6: Conditional Logic - Traffic Light
export function TrafficLight() {
  let state = 0; // 0 = red, 1 = yellow, 2 = green
  let timer = 0;

  const setup = (p: p5) => {
    p.background(0);
  };

  const draw = (p: p5) => {
    p.background(0);

    // Update timer
    timer++;

    // Change state based on timer
    if (state === 0 && timer > 120) {
      // Red -> Yellow
      state = 1;
      timer = 0;
    } else if (state === 1 && timer > 30) {
      // Yellow -> Green
      state = 2;
      timer = 0;
    } else if (state === 2 && timer > 120) {
      // Green -> Red
      state = 0;
      timer = 0;
    }

    // Draw traffic light box
    p.fill(50);
    p.rect(150, 50, 100, 300, 10);

    // Draw lights
    const lights = [
      { y: 100, active: state === 0, color: [255, 0, 0] },
      { y: 200, active: state === 1, color: [255, 200, 0] },
      { y: 300, active: state === 2, color: [0, 255, 0] },
    ];

    lights.forEach((light) => {
      if (light.active) {
        p.fill(light.color[0], light.color[1], light.color[2]);
      } else {
        p.fill(80);
      }
      p.circle(200, light.y, 60);
    });

    // Display state name
    p.fill(0);
    p.textAlign(p.CENTER);
    p.textSize(20);
    const stateName = ["PARE", "ATENÇÃO", "SIGA"][state];
    p.text(stateName, 200, 380);
  };

  return <P5Sketch setup={setup} draw={draw}  height={400} />;
}
