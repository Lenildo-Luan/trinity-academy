"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

// Example 1: File Chaos Simulation - Life without Git
export function FileChaosSim() {
  const files = [
    "trabalho.doc",
    "trabalho-v2.doc",
    "trabalho-FINAL.doc",
    "trabalho-FINAL-v2.doc",
    "trabalho-FINAL-REAL.doc",
    "trabalho-revisado.doc",
    "trabalho-FINAL(2).doc",
    "trabalho-backup.doc",
    "trabalho-novo.doc",
    "trabalho-ENTREGA.doc",
    "trabalho-corrigido.doc",
    "trabalho-ÚLTIMO.doc",
  ];

  let boxes: Array<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    w: number;
    h: number;
    label: string;
    angle: number;
    opacity: number;
    revealed: boolean;
  }> = [];
  let gitMode = false;
  let transitionProgress = 0;
  let spawnTimer = 0;
  let nextSpawnIndex = 0;
  let buttonHover = false;

  const setup = (p: p5) => {
    p.background(2, 7, 19);
    p.textFont("monospace");
    boxes = [];
    nextSpawnIndex = 0;
    spawnTimer = 0;
    gitMode = false;
    transitionProgress = 0;
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);

    // Spawn files gradually in chaos mode
    if (!gitMode && nextSpawnIndex < files.length) {
      spawnTimer++;
      if (spawnTimer > 30) {
        spawnTimer = 0;
        const fw = p.textWidth(files[nextSpawnIndex]) * 0.7 + 30;
        boxes.push({
          x: p.random(30, p.width - fw - 30),
          y: p.random(30, p.height - 100),
          targetX: 0,
          targetY: 0,
          w: Math.max(fw, 120),
          h: 36,
          label: files[nextSpawnIndex],
          angle: p.random(-0.15, 0.15),
          opacity: 0,
          revealed: false,
        });
        nextSpawnIndex++;
      }
    }

    // Transition to Git mode
    if (gitMode && transitionProgress < 1) {
      transitionProgress = Math.min(1, transitionProgress + 0.02);
    }

    if (gitMode) {
      // Draw Git timeline
      const timelineY = p.height / 2;
      const startX = 60;
      const endX = p.width - 60;

      // Timeline line
      p.stroke(100, 150, 250, 200 * transitionProgress);
      p.strokeWeight(3);
      p.line(startX, timelineY, endX, timelineY);

      // Commits on timeline
      const commitLabels = ["v1", "v2", "v3", "v4", "v5"];
      const spacing = (endX - startX) / (commitLabels.length - 1);

      for (let i = 0; i < commitLabels.length; i++) {
        const cx = startX + i * spacing;
        const alpha = Math.min(
          255,
          255 * Math.max(0, transitionProgress * 5 - i),
        );

        // Commit node
        p.fill(254, 0, 81, alpha);
        p.noStroke();
        p.circle(cx, timelineY, 24);

        // Commit label
        p.fill(255, 255, 255, alpha);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(11);
        p.text(commitLabels[i], cx, timelineY);

        // Commit description
        p.fill(160, 170, 190, alpha);
        p.textSize(10);
        p.text(`commit ${i + 1}`, cx, timelineY + 28);
      }

      // Title
      p.fill(255, 255, 255, 230 * transitionProgress);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16);
      p.noStroke();
      p.text("✓ Histórico organizado com Git", p.width / 2, 40);

      // Single file
      p.fill(30, 40, 60, 220 * transitionProgress);
      p.stroke(100, 150, 250, 150 * transitionProgress);
      p.strokeWeight(1);
      const fW = 140;
      p.rect(p.width / 2 - fW / 2, timelineY - 90, fW, 36, 6);
      p.fill(255, 255, 255, 230 * transitionProgress);
      p.noStroke();
      p.textSize(12);
      p.text("trabalho.doc", p.width / 2, timelineY - 72);
    } else {
      // Draw chaos mode
      for (const box of boxes) {
        box.opacity = Math.min(255, box.opacity + 8);

        p.push();
        p.translate(box.x + box.w / 2, box.y + box.h / 2);
        p.rotate(box.angle);

        // File box
        p.fill(30, 40, 60, box.opacity * 0.85);
        p.stroke(254, 0, 81, box.opacity * 0.5);
        p.strokeWeight(1);
        p.rect(-box.w / 2, -box.h / 2, box.w, box.h, 6);

        // File icon
        p.fill(254, 0, 81, box.opacity * 0.8);
        p.noStroke();
        p.rect(-box.w / 2 + 8, -8, 12, 16, 2);

        // File name
        p.fill(255, 255, 255, box.opacity * 0.9);
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(10);
        p.noStroke();
        p.text(box.label, -box.w / 2 + 26, 0);

        p.pop();
      }

      // Chaos label
      if (boxes.length > 3) {
        p.fill(254, 0, 81, 200);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.noStroke();
        p.text("✗ Caos sem controle de versão", p.width / 2, 24);
      }
    }

    // Draw toggle button
    const btnW = 160;
    const btnH = 36;
    const btnX = p.width / 2 - btnW / 2;
    const btnY = p.height - 52;

    buttonHover =
      p.mouseX > btnX &&
      p.mouseX < btnX + btnW &&
      p.mouseY > btnY &&
      p.mouseY < btnY + btnH;

    p.fill(buttonHover ? 120 : 100, buttonHover ? 170 : 150, 250);
    p.noStroke();
    p.rect(btnX, btnY, btnW, btnH, 8);

    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(13);
    p.text(gitMode ? "Ver sem Git" : "Usar Git ✨", p.width / 2, btnY + btnH / 2);
  };

  const mousePressed = (p: p5) => {
    if (buttonHover) {
      gitMode = !gitMode;
      if (!gitMode) {
        transitionProgress = 0;
      }
    }
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} height={380} />;
}

// Example 2: Git Timeline - History of Git
export function GitTimeline() {
  const milestones = [
    {
      year: 2005,
      title: "Git é criado",
      desc: "Linus Torvalds cria o Git\nem apenas 10 dias!",
    },
    {
      year: 2008,
      title: "GitHub é lançado",
      desc: "A plataforma que\ndemocratizou o Git.",
    },
    {
      year: 2014,
      title: "Git domina o mercado",
      desc: "Mais de 70% dos devs\nusam Git diariamente.",
    },
    {
      year: 2018,
      title: "Microsoft compra GitHub",
      desc: "Aquisição de US$ 7.5 bi\nreforça a importância do Git.",
    },
    {
      year: 2026,
      title: "Padrão universal",
      desc: "100M+ de repositórios.\nGit é indispensável.",
    },
  ];

  let hoveredIndex = -1;
  let animProgress = 0;
  let pulseAngle = 0;

  const setup = (p: p5) => {
    p.background(2, 7, 19);
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    animProgress = Math.min(1, animProgress + 0.015);
    pulseAngle += 0.05;

    const margin = 70;
    const timelineY = p.height / 2 + 10;
    const startX = margin;
    const endX = p.width - margin;
    const totalW = endX - startX;

    // Draw timeline line (animated)
    const lineEnd = startX + totalW * animProgress;
    p.stroke(60, 70, 90);
    p.strokeWeight(2);
    p.line(startX, timelineY, endX, timelineY);

    p.stroke(100, 150, 250);
    p.strokeWeight(3);
    p.line(startX, timelineY, lineEnd, timelineY);

    // Title
    p.fill(255, 255, 255, 220);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(15);
    p.text("A História do Git", p.width / 2, 28);

    // Check hover
    hoveredIndex = -1;

    const spacing = totalW / (milestones.length - 1);

    for (let i = 0; i < milestones.length; i++) {
      const cx = startX + i * spacing;
      const nodeProgress = Math.max(
        0,
        Math.min(1, (animProgress * milestones.length - i) * 2),
      );

      if (nodeProgress <= 0) continue;

      const dist = Math.sqrt(
        (p.mouseX - cx) ** 2 + (p.mouseY - timelineY) ** 2,
      );
      const isHovered = dist < 30;
      if (isHovered) hoveredIndex = i;

      // Node glow
      if (isHovered) {
        p.fill(100, 150, 250, 40);
        p.noStroke();
        p.circle(cx, timelineY, 50 + Math.sin(pulseAngle) * 5);
      }

      // Node
      const nodeSize = isHovered ? 22 : 16;
      p.fill(254, 0, 81, 255 * nodeProgress);
      p.noStroke();
      p.circle(cx, timelineY, nodeSize * nodeProgress);

      // Year label
      p.fill(255, 255, 255, 220 * nodeProgress);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(12);
      p.noStroke();
      p.text(milestones[i].year.toString(), cx, timelineY + 30);

      // Title below year
      p.fill(160, 170, 190, 180 * nodeProgress);
      p.textSize(9);
      p.text(milestones[i].title, cx, timelineY + 46);

      // Hover tooltip
      if (isHovered) {
        const tooltipW = 180;
        const tooltipH = 55;
        const tooltipY = timelineY - 75;
        let tooltipX = cx - tooltipW / 2;

        // Keep tooltip within bounds
        tooltipX = Math.max(10, Math.min(p.width - tooltipW - 10, tooltipX));

        // Tooltip background
        p.fill(20, 25, 40, 240);
        p.stroke(100, 150, 250, 150);
        p.strokeWeight(1);
        p.rect(tooltipX, tooltipY, tooltipW, tooltipH, 8);

        // Tooltip arrow
        p.fill(20, 25, 40, 240);
        p.noStroke();
        p.triangle(cx - 6, tooltipY + tooltipH, cx + 6, tooltipY + tooltipH, cx, tooltipY + tooltipH + 8);

        // Tooltip text
        p.fill(255, 255, 255, 230);
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(10);
        p.text(milestones[i].desc, tooltipX + tooltipW / 2, tooltipY + tooltipH / 2);
      }
    }

    // Hint
    p.fill(100, 110, 130, 120 + Math.sin(pulseAngle) * 40);
    p.noStroke();
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Passe o mouse sobre os pontos para saber mais", p.width / 2, p.height - 20);
  };

  return <P5Sketch setup={setup} draw={draw} height={300} />;
}

// Example 3: Snapshots vs Diffs visualization
export function SnapshotVsDiff() {
  let commits: Array<{
    files: Array<{ name: string; color: number[]; changed: boolean }>;
  }> = [];

  let buttonHover = false;
  let animOffset = 0;

  const initialFiles = [
    { name: "index.html", color: [250, 130, 80], changed: false },
    { name: "style.css", color: [100, 200, 150], changed: false },
    { name: "app.js", color: [100, 150, 250], changed: false },
  ];

  const setup = (p: p5) => {
    p.background(2, 7, 19);
    p.textFont("monospace");
    commits = [{ files: initialFiles.map((f) => ({ ...f })) }];
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    animOffset += 0.03;

    const midX = p.width / 2;

    // Divider line
    p.stroke(50, 55, 70);
    p.strokeWeight(1);
    p.line(midX, 40, midX, p.height - 55);

    // Headers
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);

    p.fill(254, 0, 81, 200);
    p.text("Outras ferramentas", midX / 2, 20);
    p.text("(apenas diferenças)", midX / 2, 36);

    p.fill(100, 150, 250, 200);
    p.text("Git", midX + midX / 2, 20);
    p.text("(snapshots completos)", midX + midX / 2, 36);

    // Draw commits
    const commitStartY = 58;
    const commitH = 55;
    const fileH = 14;
    const fileW = 70;

    for (let c = 0; c < commits.length; c++) {
      const cy = commitStartY + c * (commitH + 10);
      const commit = commits[c];

      if (cy > p.height - 60) break;

      // --- LEFT SIDE: Diffs only ---
      const leftX = 20;
      const leftCenterX = midX / 2;

      // Commit label
      p.fill(180, 180, 190, 180);
      p.textSize(9);
      p.textAlign(p.LEFT, p.CENTER);
      p.noStroke();
      p.text(`commit ${c + 1}`, leftX, cy);

      // Show only changed files (or all for first commit)
      let diffY = cy + 16;
      for (const file of commit.files) {
        if (c === 0 || file.changed) {
          // File block (highlighted)
          p.fill(file.color[0], file.color[1], file.color[2], 180);
          p.noStroke();
          p.rect(leftX, diffY, fileW, fileH, 3);

          p.fill(255, 255, 255, 220);
          p.textSize(8);
          p.textAlign(p.LEFT, p.CENTER);
          p.text(file.name, leftX + 4, diffY + fileH / 2);
          diffY += fileH + 2;
        } else {
          // Faded/skipped
          p.fill(50, 55, 70, 100);
          p.noStroke();
          p.rect(leftX, diffY, fileW, fileH, 3);

          p.fill(90, 95, 110, 100);
          p.textSize(8);
          p.textAlign(p.LEFT, p.CENTER);
          p.text("(sem mudança)", leftX + 4, diffY + fileH / 2);
          diffY += fileH + 2;
        }
      }

      // --- RIGHT SIDE: Full snapshots ---
      const rightX = midX + 20;

      // Commit label
      p.fill(180, 180, 190, 180);
      p.textSize(9);
      p.textAlign(p.LEFT, p.CENTER);
      p.noStroke();
      p.text(`commit ${c + 1}`, rightX, cy);

      // All files always shown
      let snapY = cy + 16;
      for (const file of commit.files) {
        const isChanged = c === 0 || file.changed;
        const alpha = isChanged ? 180 : 120;

        p.fill(file.color[0], file.color[1], file.color[2], alpha);
        p.noStroke();
        p.rect(rightX, snapY, fileW, fileH, 3);

        if (!isChanged) {
          // Draw a small link icon to indicate reference to previous
          p.fill(255, 255, 255, 80);
          p.textSize(7);
          p.textAlign(p.RIGHT, p.CENTER);
          p.text("↑ref", rightX + fileW - 3, snapY + fileH / 2);
        }

        p.fill(255, 255, 255, isChanged ? 220 : 130);
        p.textSize(8);
        p.textAlign(p.LEFT, p.CENTER);
        p.text(file.name, rightX + 4, snapY + fileH / 2);
        snapY += fileH + 2;
      }

      // Connect commits with arrow
      if (c > 0) {
        const prevY = commitStartY + (c - 1) * (commitH + 10) + commitH;
        // Right side arrow
        p.stroke(100, 150, 250, 80);
        p.strokeWeight(1);
        p.line(rightX + fileW / 2, prevY + 4, rightX + fileW / 2, cy - 2);
      }
    }

    // Draw "Novo Commit" button
    const btnW = 140;
    const btnH = 32;
    const btnX = p.width / 2 - btnW / 2;
    const btnY = p.height - 46;

    buttonHover =
      p.mouseX > btnX &&
      p.mouseX < btnX + btnW &&
      p.mouseY > btnY &&
      p.mouseY < btnY + btnH;

    const canAdd = commits.length < 5;

    p.fill(
      canAdd ? (buttonHover ? 120 : 100) : 60,
      canAdd ? (buttonHover ? 170 : 150) : 65,
      canAdd ? 250 : 80,
    );
    p.noStroke();
    p.rect(btnX, btnY, btnW, btnH, 8);

    p.fill(255, 255, 255, canAdd ? 230 : 100);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.text(
      canAdd ? `+ Novo Commit (${commits.length}/5)` : "Máximo atingido",
      p.width / 2,
      btnY + btnH / 2,
    );
  };

  const mousePressed = () => {
    if (buttonHover && commits.length < 5) {
      // Create new commit with random file changed
      const prevFiles = commits[commits.length - 1].files;
      const changedIdx = Math.floor(Math.random() * prevFiles.length);
      const newFiles = prevFiles.map((f, i) => ({
        ...f,
        changed: i === changedIdx,
        color:
          i === changedIdx
            ? [
                f.color[0] + (Math.random() > 0.5 ? 20 : -20),
                f.color[1] + (Math.random() > 0.5 ? 20 : -20),
                f.color[2] + (Math.random() > 0.5 ? 20 : -20),
              ]
            : [...f.color],
      }));
      commits.push({ files: newFiles });
    }
  };

  return (
    <P5Sketch
      setup={setup}
      draw={draw}
      mousePressed={mousePressed}
      height={420}
    />
  );
}

