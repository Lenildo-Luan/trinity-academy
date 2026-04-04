/**
 * Create Lesson Brief - Phase 1 Automation
 *
 * This script automates the planning phase for lesson creation:
 * 1. Validate lesson input
 * 2. Generate lesson brief JSON
 * 3. Create lesson planning document
 */

import * as path from 'path';

import { validateLesson, LessonInput } from '../validators/lesson-validator';
import { ensureDir, writeFile, writeJSON } from '../utils/file-utils';

interface CreateLessonBriefOptions {
  verbose?: boolean;
  outputDir?: string;
}

interface LessonBrief {
  courseId: string;
  chapterId: string;
  chapterTitle: string;
  description: string;
  objectives: string[];
  prerequisites: string[];
  createdAt: string;
}

/**
 * Create lesson brief
 */
export async function createLessonBrief(
  input: LessonInput,
  options: CreateLessonBriefOptions = {}
): Promise<{ success: boolean; message: string; brief?: LessonBrief; errors?: string[] }> {
  const { verbose = false, outputDir = process.cwd() } = options;

  // Step 1: Validate input
  if (verbose) console.log('📋 Step 1: Validating lesson input...');

  const validationErrors = validateLesson(input);
  if (validationErrors.length > 0) {
    const errors = validationErrors.map(
      (e) => `  ❌ ${e.field}: ${e.message}`
    );
    return {
      success: false,
      message: 'Validation failed',
      errors,
    };
  }

  if (verbose) console.log('✅ Input validation passed');

  // Step 2: Generate lesson brief
  if (verbose) console.log('📝 Step 2: Generating lesson brief...');

  const brief: LessonBrief = {
    courseId: input.courseId,
    chapterId: input.chapterId,
    chapterTitle: input.chapterTitle,
    description: input.description,
    objectives: input.objectives || [],
    prerequisites: input.prerequisites || [],
    createdAt: new Date().toISOString(),
  };

  if (verbose) console.log('✅ Lesson brief generated');

  // Step 3: Save brief to file
  if (verbose) console.log('💾 Step 3: Saving brief to file...');

  try {
    const briefsDir = path.join(outputDir, `.trinity/lesson-briefs/${input.courseId}`);
    ensureDir(briefsDir);

    const briefPath = path.join(briefsDir, `${input.chapterId}.json`);
    writeJSON(briefPath, brief);

    if (verbose) console.log(`✅ Brief saved to ${briefPath}`);
  } catch (error) {
    return {
      success: false,
      message: `Failed to save brief: ${error}`,
    };
  }

  // Step 4: Generate planning markdown
  if (verbose) console.log('📄 Step 4: Generating planning document...');

  try {
    const planningDoc = generatePlanningDocument(brief);
    const planPath = path.join(
      outputDir,
      `.trinity/lesson-plans/${input.courseId}/${input.chapterId}.md`
    );

    ensureDir(path.dirname(planPath));
    writeFile(planPath, planningDoc);

    if (verbose) console.log(`✅ Planning document saved to ${planPath}`);
  } catch (error) {
    return {
      success: false,
      message: `Failed to generate planning document: ${error}`,
    };
  }

  return {
    success: true,
    message: `✅ LESSON BRIEF CREATED SUCCESSFULLY

Course: ${input.courseId}
Chapter: ${input.chapterId} - ${input.chapterTitle}
Description: ${input.description}

Learning Objectives:
${input.objectives?.map((obj) => `  • ${obj}`).join('\n')}

Prerequisites:
${input.prerequisites && input.prerequisites.length > 0
  ? input.prerequisites.map((pre) => `  • ${pre}`).join('\n')
  : '  • None'}

Files Created:
  ✓ .trinity/lesson-briefs/${input.courseId}/${input.chapterId}.json
  ✓ .trinity/lesson-plans/${input.courseId}/${input.chapterId}.md

Next Steps:
1. Share brief with Writer Agent for content creation
2. Writer Agent will create MDX content
3. Continue to Phase 3 (Design Annotation)`,
    brief,
  };
}

/**
 * Generate markdown planning document
 */
function generatePlanningDocument(brief: LessonBrief): string {
  return `# Plano de Aula: ${brief.chapterTitle}

**Curso:** ${brief.courseId}
**Capítulo:** ${brief.chapterId}
**Data:** ${brief.createdAt}

## Descrição

${brief.description}

## Objetivos de Aprendizado

${brief.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

## Pré-requisitos

${brief.prerequisites && brief.prerequisites.length > 0
  ? brief.prerequisites.map((pre, i) => `${i + 1}. ${pre}`).join('\n')
  : 'Nenhum'}

## Conteúdo (a ser desenvolvido)

### Seção 1
- [ ] Tópico principal
- [ ] Exemplos práticos
- [ ] Exercícios

### Seção 2
- [ ] Tópico principal
- [ ] Exemplos práticos
- [ ] Exercícios

## Visualizações Necessárias

- [ ] Visualização 1 (tipo a definir)
- [ ] Visualização 2 (tipo a definir)

## Avaliação

- [ ] Quiz com 8-12 questões
- [ ] Tipos de questão a definir

## Notas

- Adicione notas específicas aqui
- Referências úteis
- Considerações de design
`;
}


