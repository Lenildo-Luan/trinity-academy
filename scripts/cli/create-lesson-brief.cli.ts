#!/usr/bin/env node

/**
 * Trinity Academy CLI - Create Lesson Brief
 * 
 * Usage:
 *   npx ts-node scripts/cli/create-lesson-brief.cli.ts --course course-id --chapter charpter-1 --title "Chapter Title" --description "..."
 */

import { createLessonBrief } from '../create-lesson-brief';
import type { LessonInput } from '../validators/lesson-validator';

// Parse command line arguments
interface Args {
  course?: string;
  chapter?: string;
  title?: string;
  description?: string;
  objectives?: string;
  prerequisites?: string;
  verbose?: boolean;
  help?: boolean;
}

function parseArgs(): Args {
  const args: Args = {};
  
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--course') {
      args.course = process.argv[++i];
    } else if (arg === '--chapter') {
      args.chapter = process.argv[++i];
    } else if (arg === '--title') {
      args.title = process.argv[++i];
    } else if (arg === '--description') {
      args.description = process.argv[++i];
    } else if (arg === '--objectives') {
      args.objectives = process.argv[++i];
    } else if (arg === '--prerequisites') {
      args.prerequisites = process.argv[++i];
    } else if (arg === '--verbose') {
      args.verbose = true;
    }
  }
  
  return args;
}

function printHelp(): void {
  console.log(`
Trinity Academy - Create Lesson Brief CLI

Usage:
  npx ts-node scripts/cli/create-lesson-brief.cli.ts [options]

Options:
  --course <id>                Course ID (required)
  --chapter <id>               Chapter ID (required)
  --title <title>              Chapter title (required)
  --description <desc>         Lesson description (10-300 chars, required)
  --objectives <objectives>    Learning objectives (pipe-separated, required)
  --prerequisites <prereqs>    Prerequisites (pipe-separated, optional)
  --verbose                    Verbose output
  --help                        Show this help message

Example:
  npx ts-node scripts/cli/create-lesson-brief.cli.ts \\
    --course protocolo-dns \\
    --chapter charpter-1 \\
    --title "Resolução de Nomes" \\
    --description "Aprenda como o DNS resolve nomes de domínio para endereços IP." \\
    --objectives "Entender o processo de resolução de nomes|Conhecer tipos de nameservers|Implementar consultas DNS" \\
    --prerequisites "Conhecimento básico de redes|Familiaridade com TCP/IP"
`);
}

async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  // Validate required arguments
  if (!args.course || !args.chapter || !args.title || !args.description || !args.objectives) {
    console.error('❌ Missing required arguments');
    console.error('\nRequired:');
    console.error('  --course <id>');
    console.error('  --chapter <id>');
    console.error('  --title <title>');
    console.error('  --description <description>');
    console.error('  --objectives <objectives>');
    console.error('\nRun with --help for full usage information');
    process.exit(1);
  }

  // Parse objectives (pipe-separated)
  const objectives = args.objectives.split('|').map((obj) => obj.trim());

  // Parse prerequisites (pipe-separated, optional)
  const prerequisites = args.prerequisites
    ? args.prerequisites.split('|').map((pre) => pre.trim())
    : undefined;

  // Create lesson input
  const input: LessonInput = {
    courseId: args.course,
    chapterId: args.chapter,
    chapterTitle: args.title,
    description: args.description,
    objectives,
    prerequisites,
  };

  // Create lesson brief
  const result = await createLessonBrief(input, {
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

