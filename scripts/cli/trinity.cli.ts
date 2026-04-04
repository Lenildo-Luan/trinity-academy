#!/usr/bin/env node

/**
 * Trinity Academy CLI - Main Entry Point
 *
 * Usage:
 *   npx ts-node scripts/cli/trinity.cli.ts <command> [options]
 */

import * as fs from 'fs';
import * as path from 'path';

function printHelp(): void {
  console.log(`
Trinity Academy CLI - Content Creation Automation

Usage:
  npx ts-node scripts/cli/trinity.cli.ts <command> [options]

Commands:
  create-course          Create a new course (Phase 0)
  create-lesson-brief    Create a lesson plan/brief (Phase 1)
  help                   Show this help message

Examples:
  # Create a new course
  npx ts-node scripts/cli/trinity.cli.ts create-course \\
    --id protocolo-dns \\
    --title "Protocolo DNS" \\
    --description "..." \\
    --image "https://..."

  # Create a lesson brief
  npx ts-node scripts/cli/trinity.cli.ts create-lesson-brief \\
    --course protocolo-dns \\
    --chapter charpter-1 \\
    --title "Chapter Title" \\
    --description "..." \\
    --objectives "Objective 1|Objective 2"

For detailed help on a command:
  npx ts-node scripts/cli/create-course.cli.ts --help
  npx ts-node scripts/cli/create-lesson-brief.cli.ts --help
`);
}

const command = process.argv[2];

if (!command || command === 'help' || command === '--help' || command === '-h') {
  printHelp();
  process.exit(0);
}

switch (command) {
  case 'create-course':
    // Remove the command from argv before delegating
    process.argv.splice(2, 1);
    require('./create-course.cli.ts');
    break;

  case 'create-lesson-brief':
    // Remove the command from argv before delegating
    process.argv.splice(2, 1);
    require('./create-lesson-brief.cli.ts');
    break;

  default:
    console.error(`❌ Unknown command: ${command}`);
    console.error('\nRun with "help" for available commands');
    process.exit(1);
}

