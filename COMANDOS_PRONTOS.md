# 📋 Comandos Prontos para Usar

Copie e cole qualquer um desses comandos para testar os scripts:

---

## 🚀 TESTE RÁPIDO (Copie e cole)

### 1. Ver ajuda
```bash
npm run create-course -- --help
npm run create-lesson-brief -- --help
npm run trinity -- --help
```

### 2. Criar um curso de teste
```bash
npm run create-course \
  --id protocolo-dns \
  --title "Protocolo DNS" \
  --description "Compreenda o Sistema de Nomes de Domínios: resolução de nomes, hierarquia de nameservers, tipos de registros DNS." \
  --image "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=2000&q=80" \
  --modules "introducao:Introdução:Conceitos fundamentais do DNS,resolucao:Resolução de Nomes:Como o DNS resolve nomes" \
  --verbose
```

### 3. Criar um lesson brief
```bash
npm run create-lesson-brief \
  --course protocolo-dns \
  --chapter charpter-1 \
  --title "Introdução ao DNS" \
  --description "Aprenda os fundamentos do Sistema de Nomes de Domínios e sua importância na internet." \
  --objectives "Entender o que é DNS e por que é importante|Conhecer os componentes básicos do DNS|Aprender como funciona uma consulta DNS simples" \
  --prerequisites "Conhecimento básico de redes de computadores|Familiaridade com TCP/IP" \
  --verbose
```

### 4. Verificar se foi criado
```bash
ls -la src/data/lessons/protocolo-dns/
grep "protocolo-dns" src/data/courses.ts
npm run dev
# Acesse: http://localhost:3000/protocolo-dns
```

---

## 🔧 EXEMPLOS DE CURSOS REAIS

### Git para Iniciantes
```bash
npm run create-course \
  --id introducao-ao-git \
  --title "Introdução ao Git" \
  --description "Domine os fundamentos do controle de versão com Git. Aprenda desde conceitos básicos até branching e merge em um projeto colaborativo." \
  --image "https://images.unsplash.com/photo-1618886996022-b1c34bf85e0c?auto=format&fit=crop&w=2000&q=80" \
  --modules "basico:Conceitos Básicos:O que é Git e por que usar,workflow:Workflow Git:Como trabalhar com commits e branches"
```

### Python para Ciência de Dados
```bash
npm run create-course \
  --id python-ciencia-dados \
  --title "Python para Ciência de Dados" \
  --description "Aprenda Python aplicado à ciência de dados. Trabalhe com bibliotecas como NumPy, Pandas e Matplotlib para análise e visualização de dados." \
  --image "https://images.unsplash.com/photo-1642062008625-aa2d67c62e37?auto=format&fit=crop&w=2000&q=80" \
  --modules "introducao:Introdução a Python:Conceitos básicos de programação,bibliotecas:Bibliotecas NumPy e Pandas:Manipulação de dados,visualizacao:Visualização com Matplotlib:Criando gráficos"
```

### Fundamentos de Redes
```bash
npm run create-course \
  --id redes-fundamentos \
  --title "Fundamentos de Redes" \
  --description "Domine os conceitos essenciais de redes de computadores, desde a camada física até aplicação. Inclui protocolos TCP/IP, model OSI e práticas de rede." \
  --image "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=80" \
  --modules "basico:Fundamentos:Conceitos básicos de redes,camadas:Modelo OSI:As 7 camadas,protocolos:Protocolos de Rede:TCP/IP e outros"
```

---

## 📖 LESSON BRIEFS (Depois de criar curso)

### Aula 1: Git Basics
```bash
npm run create-lesson-brief \
  --course introducao-ao-git \
  --chapter charpter-1 \
  --title "Começando com Git" \
  --description "Configure Git e crie seu primeiro repositório." \
  --objectives "Instalar e configurar Git|Criar um novo repositório|Fazer o primeiro commit" \
  --prerequisites "Conhecimento básico de terminal/linha de comando"
```

### Aula 2: Branches
```bash
npm run create-lesson-brief \
  --course introducao-ao-git \
  --chapter charpter-2 \
  --title "Branches e Merge" \
  --description "Aprenda a trabalhar com branches e fazer merge de mudanças." \
  --objectives "Criar e alternar entre branches|Fazer merge de branches|Resolver conflitos" \
  --prerequisites "Ter completado Aula 1 - Conceitos Básicos"
```

### Python: NumPy
```bash
npm run create-lesson-brief \
  --course python-ciencia-dados \
  --chapter charpter-1 \
  --title "NumPy: Arrays e Operações" \
  --description "Domine NumPy para manipulação eficiente de dados numéricos." \
  --objectives "Criar e manipular arrays NumPy|Operações matemáticas vetorizadas|Indexação avançada" \
  --prerequisites "Python básico"
```

---

## ✅ VALIDAÇÃO DE ENTRADA

### ❌ Erros Comuns (NÃO funciona)

Título inválido:
```bash
npm run create-course \
  --id ProtocoloDNS \
  --title "DNS" \
  --description "Curto" \
  --image "not-a-url"
```

Solução: ID em kebab-case, descrição 50+ chars, URL válida
```bash
npm run create-course \
  --id protocolo-dns \
  --title "Protocolo DNS" \
  --description "Descrição com mais de 50 caracteres para passar na validação inicial..." \
  --image "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=2000&q=80"
```

---

## 📚 DOCUMENTAÇÃO

Para saber mais, leia:

```bash
# Quick start
cat AUTOMATION_GETTING_STARTED.md

# Referência técnica
cat scripts/README.md

# Exemplos práticos
cat scripts/EXAMPLES.md

# Design técnico
cat scripts/ARCHITECTURE.md

# Índice navegável
cat AUTOMATION_SCRIPTS_INDEX.md

# Status de conclusão
cat AUTOMATION_COMPLETION_STATUS.md

# Resumo executivo
cat RESUMO_FINAL.md
```

---

## 🧪 TESTES

```bash
# Rodar tudo
bash scripts/test.sh

# Testar help
npm run trinity -- --help
npm run create-course -- --help
npm run create-lesson-brief -- --help
```

---

## 🐛 TROUBLESHOOTING

Se receber erro de "Course ID already exists":
```bash
# Escolha um ID diferente
npm run create-course --id novo-id-unico ...
```

Se receber erro de "Invalid course ID format":
```bash
# Use kebab-case (minúsculas com hífens)
# ❌ ProtocoloDNS, protocolo_dns, PROTOCOLO-DNS
# ✅ protocolo-dns
```

Se o build falhar:
```bash
# Tente com skip-build para debug rápido
npm run create-course ... --skip-build --verbose

# Depois, consulte scripts/README.md seção Troubleshooting
cat scripts/README.md | grep -A 20 "Troubleshooting"
```

---

## 🚀 WORKFLOW COMPLETO

```bash
# 1. Criar curso
npm run create-course \
  --id novo-curso \
  --title "Novo Curso" \
  --description "Descrição com 50+ caracteres aqui para passar na validação..." \
  --image "https://images.unsplash.com/..."

# 2. Verificar criação
ls -la src/data/lessons/novo-curso/
grep "novo-curso" src/data/courses.ts

# 3. Criar lesson brief
npm run create-lesson-brief \
  --course novo-curso \
  --chapter charpter-1 \
  --title "Aula 1" \
  --description "Descrição da aula..." \
  --objectives "Objetivo 1|Objetivo 2"

# 4. Verificar brief
cat .trinity/lesson-briefs/novo-curso/charpter-1.json
cat .trinity/lesson-plans/novo-curso/charpter-1.md

# 5. Iniciar dev server e visitar
npm run dev
# Acesse: http://localhost:3000/novo-curso
```

---

## 📊 VERIFICAÇÃO RÁPIDA

```bash
# Checklist rápido
echo "✅ Scripts instalados?"
npm run trinity -- --help

echo "✅ Documentação completa?"
ls -la AUTOMATION_*.md scripts/*.md

echo "✅ Testes passando?"
bash scripts/test.sh

echo "✅ Pronto para usar?"
npm run create-course -- --help
```

---

## 💡 DICAS

1. **Use --verbose** para ver detalhes de cada step
2. **Copie módulos** de cursos existentes como base
3. **Use imagens do Unsplash** para background (free, ótima qualidade)
4. **Comece com--skip-build** para testes rápidos
5. **Consulte scripts/EXAMPLES.md** para inspiração

---

## ❓ PRECISA DE AJUDA?

1. Leia `AUTOMATION_GETTING_STARTED.md` (5 min) ← **START HERE**
2. Consulte `scripts/README.md` para referência técnica
3. Veja exemplos em `scripts/EXAMPLES.md`
4. Estude arquitetura em `scripts/ARCHITECTURE.md`
5. Navegue tudo em `AUTOMATION_SCRIPTS_INDEX.md`

---

**Última atualização:** April 4, 2026
**Status:** ✅ Production Ready
**Versão:** 1.0.0

