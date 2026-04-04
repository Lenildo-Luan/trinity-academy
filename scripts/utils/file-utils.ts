/**
 * File Utilities
 * Helper functions for file operations
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Ensure directory exists
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Check if file exists
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Check if directory exists
 */
export function dirExists(dirPath: string): boolean {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

/**
 * Read file as string
 */
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Write file
 */
export function writeFile(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

/**
 * Read JSON file
 */
export function readJSON<T>(filePath: string): T {
  const content = readFile(filePath);
  return JSON.parse(content);
}

/**
 * Write JSON file with formatting
 */
export function writeJSON<T>(
  dataOrPath: T | string,
  pathOrData?: string | T,
  indent = 2
): void {
  // Handle both writeJSON(path, data) and writeJSON(data, path) for flexibility
  let filePath: string;
  let data: T;

  if (typeof dataOrPath === 'string') {
    filePath = dataOrPath;
    data = pathOrData as T;
  } else {
    filePath = pathOrData as string;
    data = dataOrPath;
  }

  const content = JSON.stringify(data, null, indent) + '\n';
  writeFile(filePath, content);
}

/**
 * Check if course already exists in courses.ts
 */
export function courseExists(courseId: string): boolean {
  const coursesPath = path.join(process.cwd(), 'src/data/courses.ts');
  if (!fileExists(coursesPath)) {
    return false;
  }

  const content = readFile(coursesPath);
  // Look for id: "courseId" pattern
  const pattern = new RegExp(`id:\\s*["']${courseId}["']`);
  return pattern.test(content);
}

/**
 * Get existing course IDs
 */
export function getExistingCourseIds(): string[] {
  const coursesPath = path.join(process.cwd(), 'src/data/courses.ts');
  if (!fileExists(coursesPath)) {
    return [];
  }

  const content = readFile(coursesPath);
  const matches = content.match(/id:\s*["']([a-z0-9-]+)["']/g);
  if (!matches) {
    return [];
  }

  return matches.map((m) => {
    const match = m.match(/["']([^"']+)["']/);
    return match ? match[1] : '';
  });
}

/**
 * Get template file content
 */
export function getTemplate(templateName: string): string {
  const templatesDir = path.join(__dirname, '../templates');
  const templatePath = path.join(templatesDir, `${templateName}.template`);

  if (!fileExists(templatePath)) {
    throw new Error(`Template not found: ${templateName}`);
  }

  return readFile(templatePath);
}


