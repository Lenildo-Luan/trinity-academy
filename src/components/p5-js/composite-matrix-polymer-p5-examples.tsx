"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

// Visualization 1: Estrutura básica de um compósito de matriz polimérica
export function PolymericMatrixStructure() {
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;
    const h = p.height;

    // Título
    p.noStroke();
    p.fill(200);
    p.textFont("monospace");
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Estrutura do Compósito de Matriz Polimérica", w / 2, 10);

    // Caixa esquerda - Matriz Polimérica
    p.fill(15, 20, 35);
    p.stroke(100, 180, 255, 80);
    p.strokeWeight(2);
    p.rect(40, 60, 140, 180, 8);

    p.noStroke();
    p.fill(150);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Matriz Polimérica", 110, 75);

    p.fill(100);
    p.textSize(9);
    p.text("Resina: epóxi, poliéster", 110, 95);
    p.text("ou termoplástico", 110, 108);

    // Desenhar padrão de matriz (círculos)
    p.fill(100, 180, 255, 30);
    p.noStroke();
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        p.ellipse(70 + i * 25, 140 + j * 30, 12, 12);
      }
    }

    // Caixa centro - Reforço
    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 80);
    p.strokeWeight(2);
    p.rect(210, 60, 140, 180, 8);

    p.noStroke();
    p.fill(150);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Reforço Fibroso", 280, 75);

    p.fill(100);
    p.textSize(9);
    p.text("Fibras: vidro, carbono", 280, 95);
    p.text("ou kevlar contínuas", 280, 108);

    // Desenhar padrão de fibras (linhas)
    p.stroke(255, 180, 50, 100);
    p.strokeWeight(2);
    for (let i = 0; i < 6; i++) {
      p.line(230, 140 + i * 20, 370, 140 + i * 20);
    }

    // Caixa direita - Resultado
    p.fill(15, 20, 35);
    p.stroke(100, 255, 100, 80);
    p.strokeWeight(2);
    p.rect(380, 60, 140, 180, 8);

    p.noStroke();
    p.fill(150);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Compósito Final", 450, 75);

    p.fill(100);
    p.textSize(9);
    p.text("Matriz + Reforço", 450, 95);
    p.text("combinados", 450, 108);

    // Desenhar padrão combinado
    p.fill(100, 180, 255, 20);
    p.noStroke();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        p.ellipse(400 + i * 25, 140 + j * 35, 10, 10);
      }
    }
    p.stroke(100, 255, 100, 100);
    p.strokeWeight(1.5);
    for (let i = 0; i < 5; i++) {
      p.line(395, 145 + i * 25, 505, 145 + i * 25);
    }

    // Setas
    p.stroke(200);
    p.strokeWeight(2);
    p.fill(200);
    p.line(185, 150, 210, 150);
    p.triangle(210, 150, 205, 145, 205, 155);

    p.line(355, 150, 380, 150);
    p.triangle(380, 150, 375, 145, 375, 155);

    // Rodapé
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("A combinação da matriz com o reforço resulta em propriedades mecânicas superiores", w / 2, h - 6);
  };

  return <P5Sketch setup={() => {}} draw={draw} height={280} />;
}

// Visualization 2: Comparação de propriedades - Matriz vs Reforço vs Compósito
export function PropertiesComparison() {
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;
    const h = p.height;

    p.textFont("monospace");
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Comparação de Propriedades Mecânicas", w / 2, 10);

    // Eixos do gráfico
    const chartX = 60;
    const chartY = 270;
    const chartW = 400;
    const chartH = 180;

    p.stroke(100);
    p.strokeWeight(1);
    p.line(chartX, chartY, chartX, chartY - chartH);
    p.line(chartX, chartY, chartX + chartW, chartY);

    // Labels dos eixos
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("Resistência (MPa)", chartX - 5, chartY - chartH - 10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Material", chartX + chartW / 2, chartY + 15);

    // Escala
    for (let i = 0; i <= 10; i++) {
      const y = chartY - (i * chartH) / 10;
      p.stroke(50);
      p.strokeWeight(1);
      p.line(chartX - 3, y, chartX, y);
      p.fill(80);
      p.textAlign(p.RIGHT, p.CENTER);
      p.textSize(8);
      p.text((i * 100).toString(), chartX - 8, y);
    }

    // Barras
    const materials = [
      { name: "Matriz", value: 80, color: [100, 180, 255] },
      { name: "Fibra", value: 800, color: [255, 180, 50] },
      { name: "Compósito", value: 600, color: [100, 255, 100] },
    ];

    materials.forEach((mat, idx) => {
      const barX = chartX + 50 + idx * 110;
      const barH = (mat.value / 100) * chartH;
      const barW = 50;

      p.fill(mat.color[0], mat.color[1], mat.color[2]);
      p.stroke(mat.color[0], mat.color[1], mat.color[2], 100);
      p.strokeWeight(2);
      p.rect(barX, chartY - barH, barW, barH, 4);

      // Label
      p.noStroke();
      p.fill(200);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(10);
      p.text(mat.name, barX + barW / 2, chartY + 20);

      p.fill(150);
      p.textSize(9);
      p.text(mat.value.toString(), barX + barW / 2, chartY - barH - 15);
    });

    // Legenda direita
    p.fill(150);
    p.textSize(10);
    p.textAlign(p.LEFT, p.TOP);
    p.text("O compósito combina a", 520, 80);
    p.text("rigidez da fibra com a", 520, 98);
    p.text("flexibilidade da matriz", 520, 116);

    p.fill(100);
    p.textSize(9);
    p.text("• Matriz: flexível, baixa", 520, 150);
    p.text("  resistência", 520, 163);
    p.text("• Fibra: rígida, alta", 520, 181);
    p.text("  resistência", 520, 194);
    p.text("• Compósito: ótimo", 520, 212);
    p.text("  balanço", 520, 225);

    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Fibras proporcionam resistência, enquanto a matriz distribui as cargas", w / 2, h - 6);
  };

  return <P5Sketch setup={() => {}} draw={draw} height={340} />;
}

// Visualization 3: Tipos de reforço - Fibras contínuas vs Não-tecido
export function ReinforcementTypes() {
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;
    const h = p.height;

    p.textFont("monospace");
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Tipos de Reforço Fibroso", w / 2, 10);

    // Tipo 1: Fibras contínuas
    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 80);
    p.strokeWeight(2);
    p.rect(40, 60, 160, 140, 8);

    p.noStroke();
    p.fill(150);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(11);
    p.text("Fibras Contínuas", 120, 75);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Filamentos longos", 120, 95);
    p.text("alinhados", 120, 108);

    p.stroke(0, 150, 255, 150);
    p.strokeWeight(3);
    for (let i = 0; i < 6; i++) {
      p.line(50, 130 + i * 12, 190, 130 + i * 12);
    }

    // Tipo 2: Tecido (woven)
    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 80);
    p.strokeWeight(2);
    p.rect(230, 60, 160, 140, 8);

    p.noStroke();
    p.fill(150);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(11);
    p.text("Tecido (Woven)", 310, 75);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Fios entrelaçados", 310, 95);
    p.text("trama e urdume", 310, 108);

    // Padrão de tecido
    p.stroke(255, 180, 50, 150);
    p.strokeWeight(2);
    for (let i = 0; i < 6; i++) {
      p.line(250, 130 + i * 10, 390, 130 + i * 10);
    }
    for (let i = 0; i < 8; i++) {
      p.line(250 + i * 18, 130, 250 + i * 18, 190);
    }

    // Tipo 3: Não-tecido (non-woven)
    p.fill(15, 20, 35);
    p.stroke(100, 200, 100, 80);
    p.strokeWeight(2);
    p.rect(420, 60, 160, 140, 8);

    p.noStroke();
    p.fill(150);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(11);
    p.text("Não-Tecido (Manta)", 500, 75);

    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Fibras aleatórias", 500, 95);
    p.text("unidas termicamente", 500, 108);

    // Padrão aleatório
    p.stroke(100, 200, 100, 100);
    p.strokeWeight(1.5);
    p.noFill();
    for (let i = 0; i < 15; i++) {
      const startX = 430 + Math.random() * 140;
      const startY = 130 + Math.random() * 50;
      const length = 20 + Math.random() * 30;
      const angle = Math.random() * Math.PI;
      const endX = startX + length * Math.cos(angle);
      const endY = startY + length * Math.sin(angle);
      p.line(startX, startY, endX, endY);
    }

    // Propriedades em baixo
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Alta rigidez", 120, 220);
    p.text("direcional", 120, 232);
    p.text("Resistência", 310, 220);
    p.text("bidirecional", 310, 232);
    p.text("Isotropia", 500, 220);
    p.text("aleatória", 500, 232);

    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("A orientação das fibras determina as propriedades mecânicas e de flexibilidade do compósito", w / 2, h - 6);
  };

  return <P5Sketch setup={() => {}} draw={draw} height={300} />;
}

// Visualization 4: Matriz Termofixo vs Termoplástico
export function MatrixComparison() {
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;
    const h = p.height;

    p.textFont("monospace");
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Comparação: Matriz Termofixo vs Termoplástico", w / 2, 10);

    // Termofixo
    p.fill(15, 20, 35);
    p.stroke(255, 100, 100, 80);
    p.strokeWeight(2);
    p.rect(40, 60, 200, 240, 8);

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(12);
    p.text("Termofixo (Epóxi)", 140, 75);

    const termofixoProps = [
      "✓ Baixa viscosidade",
      "✓ Fácil impregnação",
      "✓ Alta resistência térmica",
      "✗ Cura longa",
      "✗ Frágil, não reciclável",
      "✗ Processamento lento",
    ];

    p.fill(100);
    p.textSize(9);
    termofixoProps.forEach((prop, idx) => {
      const color = prop.startsWith("✓") ? [100, 200, 100] : [255, 100, 100];
      p.fill(color[0], color[1], color[2]);
      p.textAlign(p.LEFT, p.TOP);
      p.text(prop, 60, 110 + idx * 20);
    });

    // Diagrama de cura
    p.fill(15, 20, 35);
    p.stroke(200, 80, 80, 60);
    p.strokeWeight(1);
    p.rect(55, 240, 170, 40, 4);

    p.noStroke();
    p.fill(150);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Moléculas se ligam (reticulação)", 140, 246);

    p.fill(100);
    p.textSize(7);
    p.text("Irreversível - não pode ser reprocessado", 140, 260);

    // Termoplástico
    p.fill(15, 20, 35);
    p.stroke(100, 180, 255, 80);
    p.strokeWeight(2);
    p.rect(280, 60, 200, 240, 8);

    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(12);
    p.text("Termoplástico (Nylon)", 380, 75);

    const termoplasticoProps = [
      "✓ Maior resistência ao impacto",
      "✓ Processamento rápido",
      "✓ Reciclável",
      "✗ Alta viscosidade",
      "✗ Difícil impregnação",
      "✗ Menor resistência térmica",
    ];

    p.fill(100);
    p.textSize(9);
    termoplasticoProps.forEach((prop, idx) => {
      const color = prop.startsWith("✓") ? [100, 200, 100] : [255, 100, 100];
      p.fill(color[0], color[1], color[2]);
      p.textAlign(p.LEFT, p.TOP);
      p.text(prop, 300, 110 + idx * 20);
    });

    // Diagrama de processamento
    p.fill(15, 20, 35);
    p.stroke(100, 150, 255, 60);
    p.strokeWeight(1);
    p.rect(295, 240, 170, 40, 4);

    p.noStroke();
    p.fill(150);
    p.textSize(8);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Resfriamento = solidificação", 380, 246);

    p.fill(100);
    p.textSize(7);
    p.text("Reversível - pode ser reprocessado", 380, 260);

    // Rodapé
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cada tipo tem vantagens: termofixo para alta temperatura, termoplástico para flexibilidade e reciclagem", w / 2, h - 6);
  };

  return <P5Sketch setup={() => {}} draw={draw} height={340} />;
}

// Visualization 5: Processos de Fabricação - Moldagem por Compressão (SMC)
export function SMCMolding() {
  let time = 0;

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width;
    const h = p.height;

    p.textFont("monospace");
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Moldagem por Compressão (SMC)", w / 2, 10);

    // Etapas do processo
    const stages = [
      { title: "1. Pré-forma", x: 40, y: 60 },
      { title: "2. Inserção", x: 160, y: 60 },
      { title: "3. Compressão", x: 280, y: 60 },
      { title: "4. Cura", x: 400, y: 60 },
      { title: "5. Ejeção", x: 520, y: 60 },
    ];

    // Desenhar setas entre etapas
    p.stroke(100);
    p.strokeWeight(1);
    p.fill(100);
    for (let i = 0; i < 4; i++) {
      const x1 = stages[i].x + 100;
      const x2 = stages[i + 1].x;
      p.line(x1, 80, x2, 80);
      p.triangle(x2, 80, x2 - 8, 76, x2 - 8, 84);
    }

    // Desenhar cada etapa
    stages.forEach((stage, idx) => {
      p.fill(15, 20, 35);
      p.stroke(100, 180, 255, 80);
      p.strokeWeight(2);
      p.rect(stage.x, stage.y + 30, 110, 100, 8);

      p.noStroke();
      p.fill(150);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(10);
      p.text(stage.title, stage.x + 55, stage.y + 45);

      // Desenho específico de cada etapa
      if (idx === 0) {
        // Pré-forma: folhas de resina e fibra
        p.stroke(255, 180, 50, 100);
        p.strokeWeight(1);
        p.fill(255, 180, 50, 20);
        p.rect(stage.x + 15, stage.y + 65, 80, 10);
        p.rect(stage.x + 15, stage.y + 80, 80, 10);
      } else if (idx === 1) {
        // Inserção: pré-forma na matriz
        p.stroke(100, 180, 255, 80);
        p.strokeWeight(2);
        p.fill(15, 20, 35);
        p.rect(stage.x + 10, stage.y + 60, 90, 60, 4);
        p.fill(255, 180, 50, 30);
        p.rect(stage.x + 20, stage.y + 75, 70, 30, 2);
      } else if (idx === 2) {
        // Compressão: setas pressionando
        p.stroke(200);
        p.strokeWeight(2);
        p.line(stage.x + 20, stage.y + 55, stage.x + 20, stage.y + 75);
        p.triangle(stage.x + 20, stage.y + 55, stage.x + 16, stage.y + 62, stage.x + 24, stage.y + 62);
        p.line(stage.x + 90, stage.y + 55, stage.x + 90, stage.y + 75);
        p.triangle(stage.x + 90, stage.y + 55, stage.x + 86, stage.y + 62, stage.x + 94, stage.y + 62);
        p.fill(255, 180, 50, 40);
        p.noStroke();
        p.rect(stage.x + 20, stage.y + 75, 70, 25, 2);
      } else if (idx === 3) {
        // Cura: componente finalizado
        p.stroke(100, 255, 100, 100);
        p.strokeWeight(2);
        p.fill(100, 255, 100, 20);
        p.rect(stage.x + 20, stage.y + 70, 70, 50, 6);
        p.noStroke();
        p.fill(100);
        p.textSize(8);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("CURADO", stage.x + 55, stage.y + 95);
      } else if (idx === 4) {
        // Ejeção: peça saindo
        p.stroke(100, 200, 100, 100);
        p.strokeWeight(2);
        p.fill(100, 200, 100, 20);
        p.rect(stage.x + 20, stage.y + 70, 70, 50, 6);
        p.stroke(200);
        p.strokeWeight(1);
        p.line(stage.x + 55, stage.y + 130, stage.x + 55, stage.y + 135);
        p.line(stage.x + 50, stage.y + 133, stage.x + 60, stage.y + 133);
      }
    });

    // Propriedades
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Adequado para: Peças de tamanho médio", 40, 250);
    p.text("Tempo de ciclo: 1-3 minutos por peça", 40, 263);
    p.text("Pressão e temperatura: Moderadas a altas", 40, 276);
    p.text("Acabamento: Excelente superficial", 40, 289);

    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("SMC (Sheet Molding Compound) combina fibras curtas com resina termofixo em folhas pré-preparadas", w / 2, h - 6);
  };

  return <P5Sketch setup={() => {}} draw={draw} height={330} />;
}

// Visualization 6: Pultrusão - Processo Contínuo
export function PultrusionProcess() {
  let time = 0;

  const draw = (p: p5) => {
    p.background(2, 7, 19);
    time += 0.015;
    const w = p.width;
    const h = p.height;

    p.textFont("monospace");
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Pultrusão - Processo Contínuo", w / 2, 10);

    // Descrição do processo
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.LEFT, p.TOP);
    p.text("1. Bobinas de fibra contínua    2. Tanque de resina    3. Matriz molde    4. Aquecimento/Cura    5. Sistema de tração", 40, 40);

    // Bobinas de fibra
    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 80);
    p.strokeWeight(2);
    p.ellipse(60, 120, 40, 50);
    p.ellipse(110, 120, 40, 50);
    p.ellipse(160, 120, 40, 50);

    p.fill(100);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(8);
    p.text("Fibras", 60, 175);
    p.text("Contínuas", 110, 175);
    p.text("em Bobina", 160, 175);

    // Tanque de resina
    p.fill(15, 20, 35);
    p.stroke(100, 180, 255, 80);
    p.strokeWeight(2);
    p.rect(200, 90, 80, 80, 8);

    p.noStroke();
    p.fill(100, 180, 255, 30);
    p.rect(205, 100, 70, 60);

    p.fill(100);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(8);
    p.text("Tanque", 240, 180);
    p.text("de Resina", 240, 190);

    // Fibras passando pelo tanque (animado)
    p.stroke(255, 180, 50, 150);
    p.strokeWeight(3);
    const fiberOffset = (time * 2) % 1;
    p.line(165, 120, 200 - fiberOffset * 30, 120);
    p.line(165, 130, 200 - fiberOffset * 30, 130);
    p.line(165, 140, 200 - fiberOffset * 30, 140);

    // Matriz/Molde
    p.fill(15, 20, 35);
    p.stroke(100, 200, 100, 80);
    p.strokeWeight(2);
    p.rect(310, 85, 100, 90, 8);

    p.noStroke();
    p.fill(100);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(8);
    p.text("Matriz/Molde", 360, 175);
    p.text("(Forma)", 360, 185);

    // Fibras passando pela matriz
    p.stroke(255, 180, 50, 150);
    p.strokeWeight(3);
    p.line(280, 120, 310 - fiberOffset * 50, 120);
    p.line(280, 130, 310 - fiberOffset * 50, 130);

    // Aquecimento/Cura
    p.fill(15, 20, 35);
    p.stroke(200, 100, 100, 80);
    p.strokeWeight(2);
    p.rect(440, 80, 80, 100, 8);

    // Símbolos de aquecimento
    p.noStroke();
    p.fill(255, 150, 100, 100);
    p.ellipse(460, 110, 8, 8);
    p.ellipse(480, 105, 8, 8);
    p.ellipse(500, 115, 8, 8);

    p.fill(100);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(8);
    p.text("Cura", 480, 190);

    // Sistema de tração
    p.stroke(100, 200, 100, 100);
    p.strokeWeight(2);
    p.fill(15, 20, 35);
    p.rect(540, 95, 50, 70, 6);

    p.noStroke();
    p.fill(100, 200, 100, 80);
    p.ellipse(565, 110, 18, 18);
    p.ellipse(565, 155, 18, 18);

    p.fill(100);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(8);
    p.text("Tração", 565, 175);

    // Perfil final
    p.stroke(100, 255, 100, 150);
    p.strokeWeight(3);
    const profileX = 595 + (fiberOffset * 50);
    p.line(profileX, 120, profileX + 20, 120);
    p.rect(profileX + 20, 115, 8, 10, 2);

    // Características
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text("✓ Processo contínuo: perfis longos/infinitos", 40, 240);
    p.text("✓ Fibras perfeitamente alinhadas: máxima rigidez axial", 40, 253);
    p.text("✓ Ideal para: barras, tubos, vigas estruturais", 40, 266);
    p.text("✗ Limitado: formas simples e simétricas", 40, 279);

    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Pultrusão produz perfis com fibras contínuas na direção da tração, oferecendo máxima resistência axial", w / 2, h - 6);
  };

  return <P5Sketch setup={() => {}} draw={draw} height={320} />;
}

// Visualization 7: Compósitos Laminares - Camadas Orientadas
export function LaminateComposites() {
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;
    const h = p.height;

    p.textFont("monospace");
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Compósitos Laminares - Múltiplas Orientações", w / 2, 10);

    // Explicação
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Múltiplas camadas com orientações diferentes para oferecer resistência multidirecional:", 40, 40);

    // Camadas
    const layers = [
      { angle: 0, color: [0, 150, 255], label: "0°" },
      { angle: 45, color: [100, 180, 255], label: "45°" },
      { angle: 90, color: [255, 180, 50], label: "90°" },
      { angle: -45, color: [100, 200, 100], label: "-45°" },
      { angle: 0, color: [0, 150, 255], label: "0°" },
    ];

    let layerY = 100;
    layers.forEach((layer, idx) => {
      // Caixa da camada
      p.fill(15, 20, 35);
      p.stroke(layer.color[0], layer.color[1], layer.color[2], 80);
      p.strokeWeight(2);
      p.rect(40, layerY, 400, 30, 4);

      // Fibras na camada
      p.stroke(layer.color[0], layer.color[1], layer.color[2], 150);
      p.strokeWeight(2);
      const angle = (layer.angle * Math.PI) / 180;
      for (let i = 0; i < 8; i++) {
        const startY = layerY + 5 + i * 5;
        const startX = 45;
        const length = 390;
        const endX = startX + length * Math.cos(angle);
        const endY = startY + length * Math.sin(angle);
        p.line(startX, startY, endX, endY);
      }

      // Label
      p.noStroke();
      p.fill(layer.color[0], layer.color[1], layer.color[2]);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(9);
      p.text(`Camada ${idx + 1} - ${layer.label}`, 460, layerY + 15);

      layerY += 40;
    });

    // Resultado
    p.fill(100);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(8);
    p.text("Resultado: Resistência em múltiplas direções", 40, 310);
    p.text("• 0°: Resistência axial máxima", 40, 323);
    p.text("• 90°: Resistência transversal", 40, 336);
    p.text("• ±45°: Resistência ao cisalhamento e torção", 40, 349);

    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Materiais compostos de múltiplas camadas oferecem balanceamento entre resistência, flexibilidade e rigidez", w / 2, h - 6);
  };

  return <P5Sketch setup={() => {}} draw={draw} height={360} />;
}

// Visualization 8: Painel Sanduíche (Sandwich Panel)
export function SandwichPanel() {
  const draw = (p: p5) => {
    p.background(2, 7, 19);
    const w = p.width;
    const h = p.height;

    p.textFont("monospace");
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Painel Sanduíche - Estrutura Otimizada", w / 2, 10);

    // Painel sanduíche
    const panelX = 80;
    const panelY = 80;
    const panelW = 450;
    const panelH = 200;

    // Face superior
    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 100);
    p.strokeWeight(2);
    p.rect(panelX, panelY, panelW, 20, 4);

    p.noStroke();
    p.fill(100);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(9);
    p.text("Face Superior - Resistência (Fibra de Carbono)", panelX + 10, panelY + 10);

    // Núcleo
    p.fill(15, 20, 35);
    p.stroke(255, 180, 50, 100);
    p.strokeWeight(2);
    p.rect(panelX, panelY + 20, panelW, 160, 4);

    // Padrão do núcleo (espuma)
    p.stroke(255, 180, 50, 60);
    p.strokeWeight(1);
    p.fill(255, 180, 50, 10);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 8; j++) {
        p.rect(
          panelX + 10 + i * 44,
          panelY + 30 + j * 20,
          40,
          18,
          2
        );
      }
    }

    p.noStroke();
    p.fill(150);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Núcleo Leve - Rigidez com Pouco Peso", panelX + panelW / 2, panelY + 100);

    p.fill(100);
    p.textSize(7);
    p.text("(Espuma, Honeycomb ou Cortiça)", panelX + panelW / 2, panelY + 115);

    // Face inferior
    p.fill(15, 20, 35);
    p.stroke(0, 150, 255, 100);
    p.strokeWeight(2);
    p.rect(panelX, panelY + 180, panelW, 20, 4);

    p.noStroke();
    p.fill(100);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(9);
    p.text("Face Inferior - Resistência (Fibra de Carbono)", panelX + 10, panelY + 190);

    // Setas de carga
    p.stroke(200);
    p.strokeWeight(2);
    p.fill(200);
    p.line(panelX - 30, panelY, panelX - 30, panelY + 200);
    p.triangle(panelX - 30, panelY, panelX - 35, panelY + 8, panelX - 25, panelY + 8);
    p.triangle(panelX - 30, panelY + 200, panelX - 35, panelY + 192, panelX - 25, panelY + 192);

    // Comparações
    p.fill(100);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Vantagens do Painel Sanduíche:", 40, 300);
    p.text("✓ Máxima rigidez com mínimo peso (alto índice de rigidez específica)", 60, 315);
    p.text("✓ Resistência ao cisalhamento através das faces", 60, 328);
    p.text("✓ Isolamento térmico e acústico (núcleo espesso)", 60, 341);

    p.fill(100);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Aplicações:", 40, 365);
    p.text("✓ Asas de aeronaves | ✓ Painéis de fuselagem | ✓ Estruturas navais | ✓ Carrocerias automotivas", 60, 380);

    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Painéis sanduíche combinam rigidez extrema com peso mínimo: perfeito para aeronaves e veículos", w / 2, h - 6);
  };

  return <P5Sketch setup={() => {}} draw={draw} height={410} />;
}

