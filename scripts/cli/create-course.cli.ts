#!/usr/bin/env node

/**
 * Trinity Academy CLI - Create Course
 * 
 * Usage:
 *   npx ts-node scripts/cli/create-course.cli.ts --id course-id --title "Course Title" --description "..." --image "url"
 */

import * as fs from 'fs';
import * as path from 'path';

import { createCourse } from '../create-course';
import type { CourseInput } from '../validators/course-validator';

// Parse command line arguments
interface Args {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  modules?: string;
  skipBuild?: boolean;
  verbose?: boolean;
  help?: boolean;
}

function parseArgs(): Args {
  const args: Args = {};
  
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--id') {
      args.id = process.argv[++i];
    } else if (arg === '--title') {
      args.title = process.argv[++i];
    } else if (arg === '--description') {
      args.description = process.argv[++i];
    } else if (arg === '--image') {
      args.image = process.argv[++i];
    } else if (arg === '--modules') {
      args.modules = process.argv[++i];
    } else if (arg === '--skip-build') {
      args.skipBuild = true;
    } else if (arg === '--verbose') {
      args.verbose = true;
    }
  }
  
  return args;
}

function printHelp(): void {
  console.log(`
Trinity Academy - Create Course CLI

Usage:
  npx ts-node scripts/cli/create-course.cli.ts [options]

Options:
  --id <id>                    Course ID (kebab-case, required)
  --title <title>              Course title (required)
  --description <desc>         Course description (50-500 chars, required)
  --image <url>                Background image URL (required)
  --modules <modules>          Initial modules (comma-separated, optional)
                               Format: "id:Title:Description,id2:Title2:Description2"
  --skip-build                 Skip build validation
  --verbose                    Verbose output
  --help                        Show this help message

Example:
  npx ts-node scripts/cli/create-course.cli.ts \\
    --id protocolo-dns \\
    --title "Protocolo DNS" \\
    --description "Compreenda o Sistema de Nomes de Domínios: resolução de nomes, hierarquia de nameservers, tipos de registros DNS." \\
    --image "https://images.unsplash.com/photo-..." \\
    --modules "introducao:Introdução:Conceitos fundamentais do DNS"
`);
}

async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  // Validate required arguments
  if (!args.id || !args.title || !args.description || !args.image) {
    console.error('❌ Missing required arguments');
    console.error('\nRequired:');
    console.error('  --id <id>');
    console.error('  --title <title>');
    console.error('  --description <description>');
    console.error('  --image <url>');
    console.error('\nRun with --help for full usage information');
    process.exit(1);
  }

  // Parse modules if provided
  let initialModules: CourseInput['initialModules'];
  if (args.modules) {
    initialModules = args.modules.split(',').map((mod) => {
      const [id, title, description] = mod.split(':');
      return { id: id.trim(), title: title.trim(), description: description.trim() };
    });
  }

  // Create course input
  const input: CourseInput = {
    id: args.id,
    title: args.title,
    description: args.description,
    backgroundImage: args.image,
    initialModules,
  };

  // Create course
  const result = await createCourse(input, {
    skipBuildValidation: args.skipBuild || false,
    verbose: args.verbose || false,
  });

  if (result.success) {
    console.log(result.message);
    process.exit(0);
  } else {
    console.error(`❌ ${result.message}`);
    if (result.errors) {
      result.errors.forEach((error) => console.error(error));
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

