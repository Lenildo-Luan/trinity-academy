# Course Creator Examples

This document provides practical examples of how to use the Course Creator agent.

## Example 1: Simple Course Creation

### Request

```
Create a new course about the DNS Protocol with the following details:

Course ID: protocolo-dns
Title: Protocolo DNS
Description: Compreenda o Sistema de Nomes de Domínios: resolução de nomes, hierarquia de nameservers, tipos de registros DNS, e implementação prática do DNS em redes.
Background Image: https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=2000&q=80

Initial Module:
- ID: introducao
  Title: Introdução
  Description: Conceitos fundamentais do DNS
```

### Agent Processing

The agent would:

1. **Validate inputs**
   - ✓ Course ID `protocolo-dns` is kebab-case and unique
   - ✓ Title and description are in Portuguese
   - ✓ Background image URL is valid
   - ✓ Module ID is kebab-case

2. **Create folders**
   - ✓ `src/data/lessons/protocolo-dns/`
   - ✓ `src/data/quizzes/protocolo-dns/`
   - ✓ `src/app/(sidebar)/protocolo-dns/[slug]/`

3. **Write module.json**
   ```json
   [
     {
       "id": "introducao",
       "title": "Introdução",
       "description": "Conceitos fundamentais do DNS",
       "lessons": []
     }
   ]
   ```

4. **Register in courses.ts**
   - Added entry to `courses` array

5. **Create landing page** (`src/app/(sidebar)/protocolo-dns/page.tsx`)
   - Course title: "Protocolo DNS"
   - Module count displayed
   - Background image shown
   - "Começar" button links to first lesson

6. **Create lesson route** (`src/app/(sidebar)/protocolo-dns/[slug]/page.tsx`)
   - Dynamic lesson loading
   - Quiz support enabled
   - Breadcrumbs configured

7. **Validate build**
   - ✓ TypeScript compilation passes
   - ✓ Next.js build succeeds

### Success Response

```
✅ COURSE CREATED SUCCESSFULLY

Course: Protocolo DNS (protocolo-dns)
Status: Ready for lesson creation

Files Created:
  ✓ src/data/lessons/protocolo-dns/
  ✓ src/data/lessons/protocolo-dns/module.json
  ✓ src/data/quizzes/protocolo-dns/
  ✓ src/app/(sidebar)/protocolo-dns/page.tsx
  ✓ src/app/(sidebar)/protocolo-dns/[slug]/page.tsx

Files Updated:
  ✓ src/data/courses.ts

Validation:
  ✓ TypeScript: OK (no errors)
  ✓ Build: OK (exit code 0)

Course URL: /protocolo-dns
Landing Page: ✅ Active

Next Steps:
1. Create lessons using writer + pipeline agents
2. First lesson ID: charpter-1 (following project convention)
3. Update module.json with lessons as they're created
4. Access course at http://localhost:3000/protocolo-dns
```

---

## Example 2: Multi-Module Course

### Request

```
Create a comprehensive course about web development:

Course ID: desenvolvimento-web
Title: Desenvolvimento Web Moderno
Description: Aprenda a criar aplicações web modernas com HTML, CSS e JavaScript. Domine os fundamentos do desenvolvimento web, de layouts responsivos a aplicações interativas.
Background Image: https://images.unsplash.com/photo-1517694712202-14dd7270c5e1?auto=format&fit=crop&w=2000&q=80

Initial Modules:
1. ID: html-css
   Title: HTML e CSS Fundamentais
   Description: Estruturação semântica e estilização responsiva de páginas web

2. ID: javascript-basico
   Title: JavaScript Básico
   Description: Fundamentos de JavaScript: variáveis, funções, objetos e manipulação do DOM

3. ID: dom-eventos
   Title: DOM e Eventos
   Description: Interatividade web: seletores, manipulação de elementos e tratamento de eventos
```

### File Structure After Creation

```
src/data/
├── lessons/
│   └── desenvolvimento-web/
│       └── module.json
├── quizzes/
│   └── desenvolvimento-web/
└── courses.ts (updated)

src/app/(sidebar)/
└── desenvolvimento-web/
    ├── page.tsx
    └── [slug]/
        └── page.tsx
```

### module.json Result

```json
[
  {
    "id": "html-css",
    "title": "HTML e CSS Fundamentais",
    "description": "Estruturação semântica e estilização responsiva de páginas web",
    "lessons": []
  },
  {
    "id": "javascript-basico",
    "title": "JavaScript Básico",
    "description": "Fundamentos de JavaScript: variáveis, funções, objetos e manipulação do DOM",
    "lessons": []
  },
  {
    "id": "dom-eventos",
    "title": "DOM e Eventos",
    "description": "Interatividade web: seletores, manipulação de elementos e tratamento de eventos",
    "lessons": []
  }
]
```

### courses.ts Addition

```typescript
{
  id: "desenvolvimento-web",
  title: "Desenvolvimento Web Moderno",
  description: "Aprenda a criar aplicações web modernas com HTML, CSS e JavaScript. Domine os fundamentos do desenvolvimento web, de layouts responsivos a aplicações interativas.",
  backgroundImage: "https://images.unsplash.com/photo-1517694712202-14dd7270c5e1?auto=format&fit=crop&w=2000&q=80",
  available: true,
},
```

---

## Example 3: Minimal Course (No Pre-created Modules)

### Request

```
Create a quick course structure:

Course ID: git-basics
Title: Fundamentos do Git
Description: Aprenda controle de versão com Git: repositórios, commits, branches, e colaboração em equipe.
Background Image: https://images.unsplash.com/photo-1633356122544-f134ef2944f5?auto=format&fit=crop&w=2000&q=80
```

### Agent Processing

Without pre-created modules, the agent creates a default structure:

### module.json Result

```json
[
  {
    "id": "introducao",
    "title": "Introdução",
    "description": "Conceitos fundamentais do Git",
    "lessons": []
  }
]
```

The course creator can create a minimal module that will be expanded later.

---

## Example 4: Using Course After Creation

### Directory Structure Ready

After the agent completes, the directory structure is ready:

```
/git-basics              → Course landing page
/git-basics/charpter-1   → First lesson (not created yet, route ready)
/git-basics/charpter-2   → Second lesson (not created yet, route ready)
```

### Next: Create First Lesson

Using the **lesson creation pipeline**:

1. **Writer Agent** creates: `src/data/lessons/git-basics/charpter-1.mdx`
2. **Design Annotator** annotates visual opportunities
3. **P5.js Developer** creates visualizations (if needed)
4. **Quiz Developer** creates: `src/data/quizzes/git-basics/quiz-charpter-1.json`
5. **Integration Orchestrator** integrates everything

### Then: Update module.json

After lesson 1 is created, the integration agent updates module.json:

```json
[
  {
    "id": "introducao",
    "title": "Introdução",
    "description": "Conceitos fundamentais do Git",
    "lessons": [
      {
        "id": "charpter-1",
        "title": "O que é Git e Controle de Versão",
        "description": "Entenda o conceito de controle de versão e por que Git é essencial para desenvolvimento.",
        "video": null,
        "quizId": "quiz-charpter-1"
      }
    ]
  }
]
```

---

## Example 5: Course with Custom Background Image

### Request

```
Create a course about network protocols:

Course ID: protocolos-de-rede
Title: Protocolos de Rede e Comunicação
Description: Explore os principais protocolos de comunicação: TCP/IP, UDP, ICMP, DNS. Aprenda como dados são transmitidos em redes de computadores.
Background Image: https://ik.imagekit.io/qfmgarse7/network-bg.webp?updatedAt=1760284705415
```

### Special Handling

The agent:
1. Validates the background image URL
2. Ensures it's accessible from Next.js
3. Uses it in the landing page
4. Displays it with proper styling and opacity effects

### Result

The course landing page displays:
- Large background image with opacity overlay
- Course title: "Protocolos de Rede e Comunicação"
- Course description
- Module and lesson statistics
- "Começar" button to first lesson

---

## Example 6: Error Case - Duplicate Course ID

### Request

```
Create a course:

Course ID: redes-de-computadores  ← Already exists!
Title: Redes de Computadores Avançado
Description: ...
Background Image: ...
```

### Agent Response

```
❌ COURSE CREATION FAILED

Error: Course ID already exists

Course ID: redes-de-computadores
Status: Already registered in src/data/courses.ts

Files Not Created:
  ✗ Course directory
  ✗ module.json
  ✗ Landing page
  ✗ Lesson route

Recovery Steps:
1. Choose a different course ID (e.g., redes-avancada, redes-nivel-2)
2. Or, use a unique suffix (e.g., redes-de-computadores-v2)
3. If you want to replace the existing course:
   - Delete: src/data/lessons/redes-de-computadores/
   - Delete: src/data/quizzes/redes-de-computadores/
   - Delete: src/app/(sidebar)/redes-de-computadores/
   - Remove entry from src/data/courses.ts
   - Retry course creation

Suggestions for new course ID:
  • redes-avancada
  • redes-nivel-2
  • topicos-avancados-redes
  • redes-computadores-v2
```

---

## Example 7: Testing the Created Course

### After Successful Creation

Test the course locally:

```bash
# Start development server
npm run dev

# Visit the course landing page
open http://localhost:3000/protocolo-dns

# Expected:
# - Course title: "Protocolo DNS"
# - Background image displayed
# - Module count: 1
# - Lesson count: 0 (no lessons created yet)
# - "Começar" button visible
# - Button links to /protocolo-dns/charpter-1 (route exists but no content)
```

### Check Files Created

```bash
# Verify module.json exists and is valid JSON
cat src/data/lessons/protocolo-dns/module.json | jq .

# Verify course.ts updated
grep protocolo-dns src/data/courses.ts

# Verify routes created
ls -la src/app/\(sidebar\)/protocolo-dns/

# Verify no build errors
npm run build
```

### Next: Add First Lesson

```bash
# Use the lesson creation pipeline to add first lesson
# Then test:
open http://localhost:3000/protocolo-dns/charpter-1
```

---

## Example 8: Batch Creating Multiple Courses

### Request

```
Create three courses for a computer science curriculum:

Course 1: ID: algoritmos-estruturas-dados
Title: Algoritmos e Estruturas de Dados
Description: Aprenda estruturas fundamentais: arrays, listas ligadas, árvores, grafos. Estude algoritmos de ordenação e busca.

Course 2: ID: orientacao-a-objetos
Title: Programação Orientada a Objetos
Description: Conceitos de POO: classes, herança, polimorfismo, encapsulamento. Projete aplicações robustas e escaláveis.

Course 3: ID: padroes-design
Title: Padrões de Design
Description: Padrões de software: Criacional, Estrutural, Comportamental. Aplique padrões estabelecidos em seus projetos.
```

### Processing

The agent creates each course sequentially:

1. **Course 1** — `algoritmos-estruturas-dados`
   - ✓ Created and validated
   - ✓ Build passed

2. **Course 2** — `orientacao-a-objetos`
   - ✓ Created and validated
   - ✓ Build passed

3. **Course 3** — `padroes-design`
   - ✓ Created and validated
   - ✓ Build passed

### Result

All three courses are now available:
- `/algoritmos-estruturas-dados`
- `/orientacao-a-objetos`
- `/padroes-design`

All courses appear in the bookshelf navigation.

---

## Integration with Lesson Pipeline

Once a course is created, the full lesson creation pipeline becomes available:

```
Course Created: /protocolo-dns
                    ↓
Lesson 1 Creation:
  Writer → Annotator → P5.js Dev → Quiz Dev → Integration
  Result: /protocolo-dns/charpter-1 (with content, visuals, quiz)
                    ↓
Lesson 2 Creation:
  Writer → Annotator → P5.js Dev → Quiz Dev → Integration
  Result: /protocolo-dns/charpter-2 (with content, visuals, quiz)
                    ↓
Course Complete:
  /protocolo-dns (with all lessons)
```

---

## Key Takeaways

1. **Course Creator prepares infrastructure** — no content creation
2. **One request creates entire course structure** — atomic and complete
3. **Ready for lesson pipeline** — lessons can be added immediately
4. **No conflicts** — prevents accidental overwrites
5. **Build validated** — ensures TypeScript and Next.js compatibility
6. **Portuguese first** — all content in Brazilian Portuguese

---

## Next Steps from Here

After course creation:

1. ✅ **Course infrastructure ready**
2. → **Create first lesson** (use writer agent)
3. → **Add more lessons** (repeat pipeline)
4. → **Publish course** (already available)
5. → **Monitor metrics** (view in student dashboard)

---

## Document Version

- Version: 1.0
- Updated: March 2026
- Examples for Trinity Academy Course Creator

