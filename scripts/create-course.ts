/**
 * Create Course - Phase 0 Automation
 * 
 * This script automates the creation of a complete course infrastructure:
 * 1. Validate course input
 * 2. Create course directories
 * 3. Write module.json
 * 4. Register course in courses.ts
 * 5. Create landing page
 * 6. Create lesson routes
 * 7. Validate build
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

import { validateCourse, CourseInput } from './validators/course-validator';
import {
  ensureDir,
  fileExists,
  dirExists,
  readFile,
  writeFile,
  writeJSON,
  courseExists,
  getTemplate,
} from './utils/file-utils';

interface CreateCourseOptions {
  skipBuildValidation?: boolean;
  verbose?: boolean;
}

/**
 * Create course infrastructure
 */
export async function createCourse(
  input: CourseInput,
  options: CreateCourseOptions = {}
): Promise<{ success: boolean; message: string; errors?: string[] }> {
  const { skipBuildValidation = false, verbose = false } = options;

  // Step 1: Validate input
  if (verbose) console.log('📋 Step 1: Validating input...');

  const validationErrors = validateCourse(input);
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

  // Step 2: Check for conflicts
  if (verbose) console.log('🔍 Step 2: Checking for conflicts...');

  if (courseExists(input.id)) {
    return {
      success: false,
      message: `Course "${input.id}" already exists in courses.ts`,
    };
  }

  const lessonDir = path.join(process.cwd(), `src/data/lessons/${input.id}`);
  if (dirExists(lessonDir)) {
    return {
      success: false,
      message: `Course directory already exists at ${lessonDir}`,
    };
  }

  if (verbose) console.log('✅ No conflicts detected');

  // Step 3: Create directories
  if (verbose) console.log('📁 Step 3: Creating directories...');

  try {
    ensureDir(path.join(process.cwd(), `src/data/lessons/${input.id}`));
    ensureDir(path.join(process.cwd(), `src/data/quizzes/${input.id}`));
    ensureDir(path.join(process.cwd(), `src/app/(sidebar)/${input.id}/[slug]`));
    if (verbose) console.log('✅ Directories created');
  } catch (error) {
    return {
      success: false,
      message: `Failed to create directories: ${error}`,
    };
  }

  // Step 4: Write module.json
  if (verbose) console.log('📝 Step 4: Writing module.json...');

  try {
    const modules = input.initialModules || [
      {
        id: 'modulo-1',
        title: 'Módulo 1',
        description: 'Primeiro módulo do curso',
      },
    ];

    const moduleData = modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      lessons: [],
    }));

    const modulePath = path.join(
      process.cwd(),
      `src/data/lessons/${input.id}/module.json`
    );
    writeJSON(moduleData, modulePath);
    if (verbose) console.log('✅ module.json created');
  } catch (error) {
    return {
      success: false,
      message: `Failed to write module.json: ${error}`,
    };
  }

  // Step 5: Register course in courses.ts
  if (verbose) console.log('🔐 Step 5: Registering course in courses.ts...');

  try {
    const coursesPath = path.join(process.cwd(), 'src/data/courses.ts');
    let coursesContent = readFile(coursesPath);

    // Find the courses array and add the new course
    const newCourseEntry = `  {
    id: "${input.id}",
    title: "${input.title}",
    description: "${input.description}",
    backgroundImage: "${input.backgroundImage}",
    available: true,
  },`;

    // Insert before the closing bracket
    coursesContent = coursesContent.replace(
      /(\];)$/m,
      `  ${newCourseEntry}\n];`
    );

    writeFile(coursesPath, coursesContent);
    if (verbose) console.log('✅ Course registered in courses.ts');
  } catch (error) {
    return {
      success: false,
      message: `Failed to register course: ${error}`,
    };
  }

  // Step 6: Create landing page
  if (verbose) console.log('🏠 Step 6: Creating landing page...');

  try {
    const templateContent = getTemplate('course-landing-page');
    const pageContent = templateContent
      .replace(/{{COURSE_ID}}/g, input.id)
      .replace(/{{COURSE_TITLE}}/g, input.title)
      .replace(/{{COURSE_DESCRIPTION}}/g, input.description);

    const pagePath = path.join(
      process.cwd(),
      `src/app/(sidebar)/${input.id}/page.tsx`
    );
    writeFile(pagePath, pageContent);
    if (verbose) console.log('✅ Landing page created');
  } catch (error) {
    return {
      success: false,
      message: `Failed to create landing page: ${error}`,
    };
  }

  // Step 7: Create lesson routes
  if (verbose) console.log('📄 Step 7: Creating lesson routes...');

  try {
    const templateContent = getTemplate('lesson-page');
    const pageContent = templateContent
      .replace(/{{COURSE_ID}}/g, input.id)
      .replace(/{{COURSE_TITLE}}/g, input.title);

    const routePath = path.join(
      process.cwd(),
      `src/app/(sidebar)/${input.id}/[slug]/page.tsx`
    );
    writeFile(routePath, pageContent);
    if (verbose) console.log('✅ Lesson routes created');
  } catch (error) {
    return {
      success: false,
      message: `Failed to create lesson routes: ${error}`,
    };
  }

  // Step 8: Validate build
  if (!skipBuildValidation) {
    if (verbose) console.log('🔨 Step 8: Validating build...');

    try {
      // TypeScript check
      execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: process.cwd() });
      if (verbose) console.log('✅ TypeScript validation passed');

      // Next.js build
      execSync('npx next build', { stdio: 'pipe', cwd: process.cwd() });
      if (verbose) console.log('✅ Build validation passed');
    } catch (error: any) {
      return {
        success: false,
        message: `Build validation failed: ${error.message}`,
      };
    }
  }

  // Step 9: Report success
  return {
    success: true,
    message: `✅ COURSE CREATED SUCCESSFULLY

Course: ${input.title} (${input.id})
Status: Ready for lesson creation

Files Created:
  ✓ src/data/lessons/${input.id}/
  ✓ src/data/lessons/${input.id}/module.json
  ✓ src/data/quizzes/${input.id}/
  ✓ src/app/(sidebar)/${input.id}/page.tsx
  ✓ src/app/(sidebar)/${input.id}/[slug]/page.tsx

Files Updated:
  ✓ src/data/courses.ts

Course URL: /${input.id}
Landing Page: ✅ Active

Next Steps:
1. Create lessons using the lesson creation pipeline
2. Add quiz content for each lesson
3. Publish lessons one by one`,
  };
}

