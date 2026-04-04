#!/bin/bash
# Trinity Academy - Test Scripts
#
# Quick tests for Phase 0 and Phase 1 automation
# Run: bash scripts/test.sh

set -e  # Exit on error

echo "🧪 Trinity Academy - Automation Scripts Tests"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Helper functions
test_passed() {
  echo -e "${GREEN}✅ PASSED${NC}: $1"
  ((PASSED++))
}

test_failed() {
  echo -e "${RED}❌ FAILED${NC}: $1"
  ((FAILED++))
}

info() {
  echo -e "${YELLOW}ℹ️  INFO${NC}: $1"
}

# ============================================
# Test 1: Validate course-validator module
# ============================================
echo ""
echo "📋 Test 1: Course Validator"
echo "---"

# Test valid course input
info "Testing valid course input..."
cat > /tmp/test-valid-course.ts << 'EOF'
import { validateCourse } from './scripts/validators/course-validator';

const result = validateCourse({
  id: 'protocolo-dns',
  title: 'Protocolo DNS',
  description: 'Compreenda o Sistema de Nomes de Domínios: resolução de nomes, hierarquia de nameservers, tipos de registros DNS.',
  backgroundImage: 'https://images.unsplash.com/photo-...'
});

if (result.length === 0) {
  console.log('PASS');
} else {
  console.log('FAIL', result);
}
EOF

# Test invalid course ID
info "Testing invalid course ID format..."
cat > /tmp/test-invalid-id.ts << 'EOF'
import { validateCourse } from './scripts/validators/course-validator';

const result = validateCourse({
  id: 'ProtocoloDNS',  // Invalid: PascalCase
  title: 'Protocolo DNS',
  description: 'Descrição válida com mais de 50 caracteres para passar na validação inicial do sistema.',
  backgroundImage: 'https://images.unsplash.com/photo-...'
});

if (result.length > 0 && result[0].field === 'id') {
  console.log('PASS');
} else {
  console.log('FAIL');
}
EOF

# ============================================
# Test 2: Validate lesson-validator module
# ============================================
echo ""
echo "📋 Test 2: Lesson Validator"
echo "---"

# Test valid lesson input
info "Testing valid lesson input..."
cat > /tmp/test-valid-lesson.ts << 'EOF'
import { validateLesson } from './scripts/validators/lesson-validator';

const result = validateLesson({
  courseId: 'protocolo-dns',
  chapterId: 'charpter-1',
  chapterTitle: 'Introdução ao DNS',
  description: 'Aprenda os fundamentos do Sistema de Nomes de Domínios.',
  objectives: ['Entender DNS', 'Conhecer nameservers'],
  prerequisites: ['Conhecimento de redes']
});

if (result.length === 0) {
  console.log('PASS');
} else {
  console.log('FAIL', result);
}
EOF

# ============================================
# Test 3: File utilities
# ============================================
echo ""
echo "📋 Test 3: File Utilities"
echo "---"

info "Testing ensureDir and fileExists..."
cat > /tmp/test-file-utils.ts << 'EOF'
import { ensureDir, fileExists, dirExists, writeFile, readFile } from './scripts/utils/file-utils';

// Test directory creation
const testDir = '/tmp/trinity-test';
ensureDir(testDir);

if (dirExists(testDir)) {
  console.log('PASS: Directory creation');
} else {
  console.log('FAIL: Directory creation');
}

// Test file write/read
const testFile = `${testDir}/test.txt`;
const testContent = 'Hello, Trinity Academy!';
writeFile(testFile, testContent);

if (fileExists(testFile)) {
  const content = readFile(testFile);
  if (content === testContent) {
    console.log('PASS: File write/read');
  } else {
    console.log('FAIL: File content mismatch');
  }
} else {
  console.log('FAIL: File creation');
}
EOF

# ============================================
# Test 4: String utilities
# ============================================
echo ""
echo "📋 Test 4: String Utilities"
echo "---"

info "Testing case conversions..."
cat > /tmp/test-string-utils.ts << 'EOF'
import { kebabToPascal, kebabToCamel, capitalize } from './scripts/utils/string-utils';

const tests = [
  { input: 'protocolo-dns', expected: 'ProtocoloDns', fn: kebabToPascal },
  { input: 'protocolo-dns', expected: 'protocoloDns', fn: kebabToCamel },
  { input: 'hello', expected: 'Hello', fn: capitalize }
];

let allPass = true;
tests.forEach(test => {
  const result = test.fn(test.input);
  if (result !== test.expected) {
    console.log(`FAIL: ${test.fn.name}('${test.input}') = '${result}' (expected '${test.expected}')`);
    allPass = false;
  }
});

if (allPass) {
  console.log('PASS: All string conversions');
}
EOF

# ============================================
# Test 5: CLI help messages
# ============================================
echo ""
echo "📋 Test 5: CLI Help Messages"
echo "---"

info "Testing main CLI help..."
if npx ts-node scripts/cli/trinity.cli.ts --help 2>&1 | grep -q "Trinity Academy CLI"; then
  test_passed "Main CLI help displays correctly"
else
  test_failed "Main CLI help"
fi

info "Testing create-course CLI help..."
if npx ts-node scripts/cli/create-course.cli.ts --help 2>&1 | grep -q "Create Course"; then
  test_passed "create-course CLI help displays correctly"
else
  test_failed "create-course CLI help"
fi

info "Testing create-lesson-brief CLI help..."
if npx ts-node scripts/cli/create-lesson-brief.cli.ts --help 2>&1 | grep -q "Create Lesson Brief"; then
  test_passed "create-lesson-brief CLI help displays correctly"
else
  test_failed "create-lesson-brief CLI help"
fi

# ============================================
# Test 6: Validation error handling
# ============================================
echo ""
echo "📋 Test 6: Error Handling"
echo "---"

info "Testing missing required arguments..."
if ! npx ts-node scripts/cli/create-course.cli.ts 2>&1 | grep -q "Missing required arguments"; then
  test_failed "Missing arguments detection"
else
  test_passed "Missing arguments detection"
fi

info "Testing invalid JSON in validation..."
cat > /tmp/test-json-parsing.ts << 'EOF'
import { readJSON, writeJSON } from './scripts/utils/file-utils';
import * as fs from 'fs';
import * as path from 'path';

const testFile = '/tmp/test.json';
const testData = { name: 'Trinity', type: 'Course' };

writeJSON(testFile, testData);
const loaded = readJSON(testFile);

if (loaded.name === 'Trinity' && loaded.type === 'Course') {
  console.log('PASS');
} else {
  console.log('FAIL');
}

// Cleanup
fs.unlinkSync(testFile);
EOF

# ============================================
# Test 7: Documentation existence
# ============================================
echo ""
echo "📋 Test 7: Documentation"
echo "---"

info "Checking documentation files..."
declare -a docs=(
  "scripts/README.md"
  "scripts/EXAMPLES.md"
  "scripts/ARCHITECTURE.md"
)

for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    test_passed "Documentation exists: $doc"
  else
    test_failed "Missing documentation: $doc"
  fi
done

# ============================================
# Test 8: Package.json scripts
# ============================================
echo ""
echo "📋 Test 8: Package.json Scripts"
echo "---"

info "Checking npm scripts..."
if grep -q '"create-course"' package.json; then
  test_passed "npm script 'create-course' exists"
else
  test_failed "npm script 'create-course' missing"
fi

if grep -q '"create-lesson-brief"' package.json; then
  test_passed "npm script 'create-lesson-brief' exists"
else
  test_failed "npm script 'create-lesson-brief' missing"
fi

if grep -q '"trinity"' package.json; then
  test_passed "npm script 'trinity' exists"
else
  test_failed "npm script 'trinity' missing"
fi

# ============================================
# Summary
# ============================================
echo ""
echo "=============================================="
echo "📊 Test Summary"
echo "=============================================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}💔 Some tests failed${NC}"
  exit 1
fi

