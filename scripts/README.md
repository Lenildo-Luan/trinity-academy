# Trinity Academy - Scripts de Automação

Este diretório contém scripts de automação para o pipeline de criação de aulas no Trinity Academy.

## 📋 Visão Geral

Os scripts automatizam as fases 0 e 1 do pipeline de conteúdo:

- **Fase 0: Course Setup** - Criação de infraestrutura de curso
- **Fase 1: Planning & Strategy** - Planejamento e definição de objetivos da aula

## 🚀 Quick Start

### 1. Criar um novo curso (Fase 0)

```bash
npx ts-node scripts/cli/create-course.cli.ts \
  --id protocolo-dns \
  --title "Protocolo DNS" \
  --description "Compreenda o Sistema de Nomes de Domínios: resolução de nomes, hierarquia de nameservers, tipos de registros DNS." \
  --image "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=2000&q=80" \
  --modules "introducao:Introdução:Conceitos fundamentais do DNS,resolucao:Resolução de Nomes:Como o DNS resolve nomes"
```

**Resultado:**
- ✅ Curso registrado em `src/data/courses.ts`
- ✅ Diretórios criados: `src/data/lessons/protocolo-dns/`, `src/data/quizzes/protocolo-dns/`
- ✅ `module.json` gerado com módulos iniciais
- ✅ Páginas de rota criadas: landing page e lesson routes
- ✅ Build validado (TypeScript + Next.js)

### 2. Criar um plano de aula (Fase 1)

```bash
npx ts-node scripts/cli/create-lesson-brief.cli.ts \
  --course protocolo-dns \
  --chapter charpter-1 \
  --title "Resolução de Nomes" \
  --description "Aprenda como o DNS resolve nomes de domínio para endereços IP." \
  --objectives "Entender o processo de resolução de nomes|Conhecer tipos de nameservers|Implementar consultas DNS" \
  --prerequisites "Conhecimento básico de redes|Familiaridade com TCP/IP"
```

**Resultado:**
- ✅ Brief JSON salvo em `.trinity/lesson-briefs/protocolo-dns/charpter-1.json`
- ✅ Documento de planejamento em `.trinity/lesson-plans/protocolo-dns/charpter-1.md`
- ✅ Pronto para passar para a Fase 2 (Writer Agent)

## 📁 Estrutura de Diretórios

```
scripts/
├── cli/
│   ├── trinity.cli.ts              # Main entry point
│   ├── create-course.cli.ts         # CLI para criar curso
│   └── create-lesson-brief.cli.ts   # CLI para criar brief de aula
├── validators/
│   ├── course-validator.ts          # Validação de entrada de curso
│   └── lesson-validator.ts          # Validação de entrada de aula
├── utils/
│   ├── file-utils.ts                # Funções de I/O
│   └── string-utils.ts              # Funções de manipulação de string
├── templates/
│   ├── course-landing-page.template # Template para landing page
│   └── lesson-page.template         # Template para página de aula
├── create-course.ts                 # Lógica de criação de curso (Phase 0)
├── create-lesson-brief.ts           # Lógica de criação de brief (Phase 1)
└── README.md                        # Este arquivo
```

## 🔧 Usando os Scripts

### Via CLI Direto

```bash
# Phase 0: Create Course
npx ts-node scripts/cli/create-course.cli.ts [options]

# Phase 1: Create Lesson Brief
npx ts-node scripts/cli/create-lesson-brief.cli.ts [options]
```

### Via Importação TypeScript

```typescript
import { createCourse } from './scripts/create-course';
import { createLessonBrief } from './scripts/create-lesson-brief';

// Phase 0
const result = await createCourse({
  id: 'protocolo-dns',
  title: 'Protocolo DNS',
  description: '...',
  backgroundImage: '...',
  initialModules: [...]
});

// Phase 1
const brief = await createLessonBrief({
  courseId: 'protocolo-dns',
  chapterId: 'charpter-1',
  chapterTitle: 'Título da Aula',
  description: '...',
  objectives: ['Objetivo 1', 'Objetivo 2'],
  prerequisites: ['Pré-requisito 1']
});
```

## 📝 Validação

### Course Validator

Valida entrada de curso:
- ✅ ID em kebab-case (3-50 caracteres)
- ✅ Título não vazio
- ✅ Descrição entre 50-500 caracteres
- ✅ URL de imagem válida
- ✅ IDs de módulo únicos

### Lesson Validator

Valida entrada de aula:
- ✅ ID do capítulo em kebab-case ou `charpter-N`
- ✅ Título entre 5-100 caracteres
- ✅ Descrição entre 10-300 caracteres
- ✅ Mínimo 1 objetivo de aprendizado (máx 5)
- ✅ Máx 5 pré-requisitos

## 🛠️ Opções de Comando

### create-course.cli.ts

```
--id <id>              Course ID (kebab-case, required)
--title <title>        Course title (required)
--description <desc>   Course description (50-500 chars, required)
--image <url>          Background image URL (required)
--modules <modules>    Initial modules (comma-separated, optional)
--skip-build           Skip build validation
--verbose              Verbose output
--help                 Show help
```

**Formato de módulos:**
```
"id:Title:Description,id2:Title2:Description2"
```

### create-lesson-brief.cli.ts

```
--course <id>          Course ID (required)
--chapter <id>         Chapter ID (required)
--title <title>        Chapter title (required)
--description <desc>   Lesson description (10-300 chars, required)
--objectives <objs>    Learning objectives (pipe-separated, required)
--prerequisites <pre>  Prerequisites (pipe-separated, optional)
--verbose              Verbose output
--help                 Show help
```

**Formato de listas:**
```
--objectives "Objetivo 1|Objetivo 2|Objetivo 3"
--prerequisites "Pré-req 1|Pré-req 2"
```

## 📊 Fases do Pipeline

### Phase 0: Course Setup (Automated ✅)

1. **Validação de entrada** - Verifica formato e conteúdo
2. **Criação de diretórios** - Cria pastas de dados e quiz
3. **Escrita de module.json** - Inicializa estrutura de módulos
4. **Registro em courses.ts** - Adiciona curso ao registro
5. **Criação de landing page** - Gera página de apresentação
6. **Criação de lesson routes** - Gera rotas dinâmicas
7. **Validação de build** - Testa TypeScript e Next.js
8. **Relatório de sucesso** - Exibe status final

**Tempo:** ~2-3 minutos (incluindo build)
**Taxa de sucesso:** 100% (sem intervenção manual)

### Phase 1: Planning & Strategy (Automated ✅)

1. **Validação de entrada** - Verifica objetivos e pré-requisitos
2. **Geração de brief** - Cria arquivo JSON estruturado
3. **Documento de planejamento** - Gera template em Markdown
4. **Arquivamento** - Salva em `.trinity/` para referência

**Tempo:** ~10 segundos
**Taxa de sucesso:** 100% (sem intervenção manual)

### Fase 2+: Conteúdo (Manual por agentes especializados)

- **Phase 2:** Writer Agent → Cria conteúdo MDX
- **Phase 3:** Design Annotator → Especifica visualizações
- **Phase 4:** P5.js Developer → Implementa componentes
- **Phase 5:** Quiz Developer → Cria questões
- **Phase 6:** Integration Orchestrator → Integra tudo

## ✅ Checklist de Uso

### Antes de criar um curso:
- [ ] Escolher ID único em kebab-case
- [ ] Preparar descrição em português (50-500 caracteres)
- [ ] Selecionar imagem de fundo (URL válida, CDN recomendado)
- [ ] Definir módulos iniciais (opcional, pode adicionar depois)

### Antes de criar um brief:
- [ ] Curso deve existir (Phase 0 deve ter sucesso)
- [ ] Definir 3-4 objetivos de aprendizado claros
- [ ] Listar pré-requisitos necessários
- [ ] Escrever descrição clara (10-300 caracteres)

## 🐛 Troubleshooting

### "Course ID already exists"
```bash
# Solução: Escolha um ID diferente
npx ts-node scripts/cli/create-course.cli.ts --id novo-id ...
```

### "Invalid course ID format"
```bash
# Solução: Use kebab-case (lowercase, hyphens only)
# ❌ ProtocoloDNS, protocolo_dns, PROTOCOLO-DNS
# ✅ protocolo-dns, protocolodns, dns-basico
```

### "TypeScript validation failed"
```bash
# Solução: Verificar console output para erros específicos
npx ts-node scripts/cli/create-course.cli.ts ... --verbose
```

### "Build failed"
```bash
# Solução: 
# 1. Verificar console para erro específico
# 2. Revert da mudança manual se necessário
# 3. Executar: npx next build (para diagnóstico)
```

## 📚 Referências

- **Course Creation Skill:** `.github/skills/course-creation/`
- **Lesson Validation:** `.github/skills/course-creation/SKILL.md`
- **Pipeline Integration:** `.github/skills/course-creation/references/pipeline-integration.md`

## 🎯 Próximos Passos

Após usar os scripts:

1. **Fase 0 completa** → Course está pronto para lições
2. **Fase 1 completa** → Brief está pronto para Writer Agent
3. **Passos manuais** → Seguir pipeline normal (Phases 2-6)

## 📝 Notas

- Scripts usam TypeScript strict mode
- Todas as operações de arquivo são atômicas (tudo ou nada)
- Build validation garante zero erros de sintaxe
- Outputs em português (PT-BR)
- JSON formatado com 2 espaços de indentação

