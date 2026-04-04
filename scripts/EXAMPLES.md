# Scripts de Automação - Exemplos Práticos

Este arquivo contém exemplos reais de uso dos scripts de automação.

## 📚 Exemplo 1: Criar Curso "Protocolo DNS"

### Step 1: Criar a infraestrutura do curso (Phase 0)

```bash
npm run create-course \
  --id protocolo-dns \
  --title "Protocolo DNS" \
  --description "Compreenda o Sistema de Nomes de Domínios: resolução de nomes, hierarquia de nameservers, tipos de registros DNS, e implementação prática do DNS em redes." \
  --image "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=2000&q=80" \
  --modules "introducao:Introdução:Conceitos fundamentais do DNS,resolucao:Resolução de Nomes:Como o DNS resolve nomes,registros:Tipos de Registros:Registros DNS e suas funções"
```

**Output esperado:**
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

Course URL: /protocolo-dns
Landing Page: ✅ Active

Next Steps:
1. Create lessons using the lesson creation pipeline
2. Add quiz content for each lesson
3. Publish lessons one by one
```

### Step 2: Criar brief para primeira aula (Phase 1)

```bash
npm run create-lesson-brief \
  --course protocolo-dns \
  --chapter charpter-1 \
  --title "Introdução ao DNS" \
  --description "Aprenda os fundamentos do Sistema de Nomes de Domínios e sua importância na internet." \
  --objectives "Entender o que é DNS e por que é importante|Conhecer os componentes básicos do DNS|Aprender como funciona uma consulta DNS simples" \
  --prerequisites "Conhecimento básico de redes de computadores|Familiaridade com TCP/IP|Entender modelo cliente-servidor"
```

**Output esperado:**
```
✅ LESSON BRIEF CREATED SUCCESSFULLY

Course: protocolo-dns
Chapter: charpter-1 - Introdução ao DNS
Description: Aprenda os fundamentos do Sistema de Nomes de Domínios e sua importância na internet.

Learning Objectives:
  • Entender o que é DNS e por que é importante
  • Conhecer os componentes básicos do DNS
  • Aprender como funciona uma consulta DNS simples

Prerequisites:
  • Conhecimento básico de redes de computadores
  • Familiaridade com TCP/IP
  • Entender modelo cliente-servidor

Files Created:
  ✓ .trinity/lesson-briefs/protocolo-dns/charpter-1.json
  ✓ .trinity/lesson-plans/protocolo-dns/charpter-1.md

Next Steps:
1. Share brief with Writer Agent for content creation
2. Writer Agent will create MDX content
3. Continue to Phase 3 (Design Annotation)
```

---

## 📚 Exemplo 2: Criar Curso "Git para Iniciantes"

### Step 1: Criar infraestrutura

```bash
npm run create-course \
  --id introducao-ao-git \
  --title "Introdução ao Git" \
  --description "Domine os fundamentos do controle de versão com Git. Aprenda desde conceitos básicos até branching e merge em um projeto colaborativo." \
  --image "https://images.unsplash.com/photo-1618886996022-b1c34bf85e0c?auto=format&fit=crop&w=2000&q=80" \
  --modules "basico:Conceitos Básicos:O que é Git e por que usar,workflow:Workflow Git:Como trabalhar com commits e branches"
```

### Step 2: Criar briefs para as aulas

```bash
# Aula 1
npm run create-lesson-brief \
  --course introducao-ao-git \
  --chapter charpter-1 \
  --title "Começando com Git" \
  --description "Configure Git e crie seu primeiro repositório." \
  --objectives "Instalar e configurar Git|Criar um novo repositório|Fazer o primeiro commit" \
  --prerequisites "Conhecimento básico de terminal/linha de comando"

# Aula 2
npm run create-lesson-brief \
  --course introducao-ao-git \
  --chapter charpter-2 \
  --title "Branches e Merge" \
  --description "Aprenda a trabalhar com branches e fazer merge de mudanças." \
  --objectives "Criar e alternar entre branches|Fazer merge de branches|Resolver conflitos" \
  --prerequisites "Ter completado Aula 1"
```

---

## 📚 Exemplo 3: Criar Curso "Python para Ciência de Dados"

```bash
npm run create-course \
  --id python-ciencia-dados \
  --title "Python para Ciência de Dados" \
  --description "Aprenda Python aplicado à ciência de dados. Trabalhe com bibliotecas como NumPy, Pandas e Matplotlib para análise e visualização de dados." \
  --image "https://images.unsplash.com/photo-1642062008625-aa2d67c62e37?auto=format&fit=crop&w=2000&q=80" \
  --modules "introducao:Introdução a Python:Conceitos básicos de programação,bibliotecas:Bibliotecas NumPy e Pandas:Manipulação de dados,visualizacao:Visualização com Matplotlib:Criando gráficos e visualizações"
```

---

## 🔍 Exemplos de Erro Handling

### Erro 1: ID inválido

```bash
npm run create-course \
  --id "Protocolo DNS" \
  --title "Protocolo DNS" \
  --description "Descrição..." \
  --image "https://..."
```

**Erro:**
```
❌ Validation failed
  ❌ id: Course ID must be kebab-case (lowercase letters, numbers, and hyphens only)
```

**Solução:**
```bash
npm run create-course \
  --id protocolo-dns \
  --title "Protocolo DNS" \
  --description "Descrição..." \
  --image "https://..."
```

### Erro 2: Descrição muito curta

```bash
npm run create-course \
  --id novo-curso \
  --title "Curso" \
  --description "Curto" \
  --image "https://..."
```

**Erro:**
```
❌ Validation failed
  ❌ description: Course description must be between 50 and 500 characters
```

**Solução:** Escrever descrição com pelo menos 50 caracteres

### Erro 3: Curso já existe

```bash
npm run create-course \
  --id redes-de-computadores \
  --title "Novo Curso" \
  --description "Este curso já existe..." \
  --image "https://..."
```

**Erro:**
```
❌ Course "redes-de-computadores" already exists in courses.ts
```

**Solução:** Escolher ID único

### Erro 4: URL de imagem inválida

```bash
npm run create-course \
  --id novo-curso \
  --title "Novo Curso" \
  --description "Descrição válida com pelo menos 50 caracteres..." \
  --image "not-a-valid-url"
```

**Erro:**
```
❌ Validation failed
  ❌ backgroundImage: Background image must be a valid URL
```

**Solução:** Usar URL válida (ex: Unsplash, ImageKit, CDN)

---

## 📊 Validação de Entrada - Checklist

### Course Input Validation

```typescript
{
  id: string;            // ✅ kebab-case, 3-50 chars, único
  title: string;         // ✅ 3-100 chars
  description: string;   // ✅ 50-500 chars
  backgroundImage: string; // ✅ URL válida
  initialModules?: [     // ✅ opcional, mas recomendado
    {
      id: string;        // ✅ kebab-case
      title: string;     // ✅ não vazio
      description: string; // ✅ não vazio
    }
  ]
}
```

### Lesson Brief Input Validation

```typescript
{
  courseId: string;      // ✅ deve existir
  chapterId: string;     // ✅ kebab-case ou charpter-N
  chapterTitle: string;  // ✅ 5-100 chars
  description: string;   // ✅ 10-300 chars
  objectives: string[];  // ✅ 1-5 objetivos
  prerequisites?: string[]; // ✅ opcional, max 5
}
```

---

## 🚀 Workflow Completo: Teoria da Computação

### 1. Criar Curso

```bash
npm run create-course \
  --id teoria-computacao \
  --title "Teoria da Computação" \
  --description "Explore os fundamentos matemáticos da ciência da computação, desde máquinas de Turing até complexidade computacional. Compreenda os limites do que é computável." \
  --image "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?auto=format&fit=crop&w=2000&q=80" \
  --modules "introducao:Introdução:Conceitos básicos,automatos:Autômatos:Máquinas de estados finitos,turing:Máquinas de Turing:O modelo computacional universal,complexidade:Complexidade:P vs NP e problemas computacionais"
```

### 2. Criar Briefs para Cada Aula

#### Aula 1: Autômatos Finitos

```bash
npm run create-lesson-brief \
  --course teoria-computacao \
  --chapter charpter-1 \
  --title "Autômatos Finitos Determinísticos" \
  --description "Aprenda como modelar problemas simples usando autômatos finitos determinísticos." \
  --objectives "Entender a definição formal de DFA|Construir DFA para linguagens simples|Implementar simulador de DFA|Converter descrição verbal para DFA" \
  --prerequisites "Conhecimento básico de conjuntos e lógica matemática"
```

#### Aula 2: Expressões Regulares

```bash
npm run create-lesson-brief \
  --course teoria-computacao \
  --chapter charpter-2 \
  --title "Expressões Regulares e NFA" \
  --description "Aprenda a relação entre expressões regulares e autômatos não-determinísticos." \
  --objectives "Entender NFA e ε-transições|Converter regex para NFA|Compreender equivalência com DFA|Aplicar em processamento de texto" \
  --prerequisites "Ter completado Aula 1 - Autômatos Finitos"
```

#### Aula 3: Máquinas de Turing

```bash
npm run create-lesson-brief \
  --course teoria-computacao \
  --chapter charpter-3 \
  --title "Máquinas de Turing" \
  --description "Explore o modelo universal de computação e suas propriedades." \
  --objectives "Entender definição formal de MT|Simular MT simples|Compreender tese de Church-Turing|Entender problemas indecidíveis" \
  --prerequisites "Ter completado Aulas 1 e 2"
```

### 3. Próximos Passos

Após completar Phase 0 e 1 para todas as aulas:

1. **Writer Agent** → Criar conteúdo MDX para cada aula
2. **Design Annotator** → Especificar visualizações (simuladores, diagramas)
3. **P5.js Developer** → Implementar simuladores interativos
4. **Quiz Developer** → Criar avaliações
5. **Integration Orchestrator** → Integrar tudo
6. **Deploy** → Publicar no Trinity Academy

---

## 💡 Tips & Tricks

### 1. Reutilizar Estrutura de Curso Existente

Se você quer criar um curso similar a um existente:

1. Consulte `src/data/courses.ts` para ver estrutura existente
2. Copie a descrição como base (mude para 50-500 caracteres)
3. Use `--modules` com nomes similares mantendo padrão

### 2. Testar sem Build Validation

Para testes rápidos (evita esperar build):

```bash
npm run create-course \
  --id teste-curso \
  --title "Teste" \
  --description "Descrição com pelo menos 50 caracteres para passar na validação inicial..." \
  --image "https://..." \
  --skip-build
```

### 3. Verbose Mode para Debugging

Para ver todos os steps:

```bash
npm run create-course \
  --id novo-curso \
  --title "Novo Curso" \
  --description "..." \
  --image "https://..." \
  --verbose
```

### 4. Validar Sem Criar

Use os validadores diretamente em TypeScript:

```typescript
import { validateCourse } from './scripts/validators/course-validator';

const errors = validateCourse({
  id: 'meu-curso',
  title: 'Meu Curso',
  description: '...',
  backgroundImage: 'https://...'
});

if (errors.length > 0) {
  console.error('Validation errors:', errors);
}
```

---

## 📞 Support

Para reportar issues ou sugerir melhorias:

1. Verifique os logs (use `--verbose` flag)
2. Consulte `scripts/README.md`
3. Verifique exemplos neste arquivo
4. Abra issue no GitHub com exemplo reproduzível

