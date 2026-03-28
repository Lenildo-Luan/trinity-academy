# Educational Writer Skill

Uma skill especializada em criar conteúdo educacional de alta qualidade para plataformas de aprendizado online como a Trinity Academy.

## O que é?

O **Educational Writer** é um agente especializado que produz artigos educacionais claros, engajantes e pedagogicamente estruturados. Este skill transforma requisições genéricas em conteúdo acessível que respeita como as pessoas realmente aprendem.

Em vez de apenas gerar texto, este skill aplica **princípios pedagógicos comprovados** em cada sentença: scaffolding progressivo, gestão de carga cognitiva, e ativação de aprendizagem ativa.

## Quando Usar

Use este skill para criar ou melhorar:

✅ **Artigos de aula** — Explicações completas de conceitos com exemplos e aplicações  
✅ **Introduções de módulos** — Contexto e motivação para um novo tópico  
✅ **Guias passo-a-passo** — Instruções para completar uma tarefa ou processo  
✅ **Artigos de comparação** — Diferenças entre conceitos ou ferramentas similares  
✅ **Estudos de caso** — Aplicações do mundo real de um conceito  
✅ **Resumos e recapitulações** — Revisão de aprendizagem  
✅ **Qualquer conteúdo instrucional** — Para uma plataforma de educação online

## Antes de Começar

O skill funciona melhor quando você fornece:

1. **Tópico** — Qual conceito ou habilidade deve ser ensinado?
2. **Público-alvo** — Quem são os alunos? (iniciantes, devs juniores, etc.)
3. **Posição na sequência** — Onde isto se encaixa no curso? O que veio antes?
4. **Objetivo de aprendizagem** — O que o aluno deveria poder *fazer* ou *entender* após?
5. **Tom** — Formal? Conversacional? Técnico? Amigável?
6. **Comprimento** — Explicador rápido? Artigo completo? Deep-dive?

Se algum desses estiver faltando, o skill fará suposições razoáveis e as declarará.

## Estrutura de um Artigo

Todo artigo educacional segue uma estrutura clara e comprovada:

### 1. Hook (Abertura)
Comece com uma pergunta, cenário real, fato surpreendente ou problema relatable — **nunca** com uma definição seca.

```
❌ Ruim: "Variáveis são containers para armazenar valores de dados."
✅ Bom: "Imagine você criando um app de quiz. Toda vez que um usuário responde uma pergunta, seu app precisa lembrar a pontuação. Como um programa lembra de coisas? É exatamente para isso que variáveis servem."
```

### 2. Objetivos de Aprendizagem
2–4 bullet points com verbos de ação: *explicar, aplicar, identificar, comparar, construir, distinguir, usar*.

```
❌ Ruim: "Entender o que são variáveis"
✅ Bom: "Declarar e inicializar uma variável em JavaScript"
```

### 3. Conteúdo Principal
- Quebrar o tópico em seções lógicas (H2, H3)
- Uma ideia por seção
- **Padrão: Explicar → Exemplo → Aplicar**

### 4. Erros Comuns / Misconceptions (Recomendado)
Proativamente abordar os 2–3 erros mais comuns sobre o tópico.

### 5. Sumário
Recapitular os 3–5 pontos mais importantes. Sem novas informações aqui.

### 6. O que Vem Depois
Fazer bridge para a próxima aula ou módulo.

## Princípios de Escrita

### Clareza em Primeiro Lugar
- Sentenças curtas: média de 15–20 palavras
- Palavras simples: "usar" em vez de "utilizar"
- Definir cada termo técnico na primeira vez
- Evitar jargão a menos que seja o próprio jargão sendo ensinado

### Voz Ativa
```
✅ "A função retorna um valor"
❌ "Um valor é retornado pela função"
```

### Analogias
- Conectar conceitos novos a coisas que o aluno já conhece
- **Uma analogia por conceito** — não misturar metáforas
- Testar se a analogia ilumina ou confunde

### Exemplos
- Sempre concretos e realistas
- Nomes reais, não `foo`, `bar`, `thing`
- Relevantes ao mundo do aluno

### Tom
- Quente mas profissional
- Como um amigo conhecedor, não um livro-texto
- Usar "você" para falar diretamente com o aluno
- Encorajador mas não condescendente

### Pacing
- Um conceito por vez
- Progressão: simples → nuances → edge cases
- Pequenos intervalos após ideias complexas

## Regras de Formatação

```
## Seção principal (H2)
### Subseção (H3)
```

- Listas com 3+ itens paralelos
- Listas numeradas para passos sequenciais
- **Negrito** para termos-chave na primeira menção
- `Código` para código, comandos, sintaxe
- Blocos de citação para dicas, avisos, notas

### Tipos de Callout

> 💡 **Dica:** Conselhos úteis mas não essenciais

> ⚠️ **Aviso:** Erros que quebram coisas ou causam confusão

> 🔑 **Conceito-chave:** A ideia mais importante de uma seção

> 🧪 **Tente isso:** Desafios ou reflexões breves

## Princípios Pedagógicos

### Gestão de Carga Cognitiva
- Introduzir um conceito novo por vez
- Dividir informação em pedaços digeríveis
- Repetir ideias-chave em diferentes formas

### Scaffolding
- Começar do que o aluno já sabe
- Construir complexidade gradualmente
- Usar transições para conectar ideias

### Ativadores de Aprendizagem Ativa
- Prompts de reflexão ("Pense em um momento quando...")
- Perguntas preditivas ("O que você acha que acontece se...?")
- Pequenos desafios ("Tente mudar o valor e veja o que acontece")

### Recuperação e Reforço
- Referenciar aulas anteriores quando relevante
- Resumir ao final de cada seção principal
- A seção de sumário reforça, não apenas repete

## Tipos de Conteúdo

### 1. Explicação de Conceito
Quando: Ensinando uma ideia, termo ou princípio pela primeira vez

Estrutura: Hook → Objetivos → O que é? → Por que importa? → Como funciona? → Misconceptions → Sumário → Próximos passos

### 2. Artigo How-To / Tutorial
Quando: Ensinando um processo que o aluno executará passo a passo

Estrutura: Hook → Objetivos → Pré-requisitos → Passo 1/2/3... → Exemplo completo → Troubleshooting → Sumário → Próximos passos

### 3. Artigo de Comparação
Quando: Explicando diferenças entre coisas similares

Estrutura: Hook → Objetivos → Introdução → Tabela de comparação → Quando usar A → Quando usar B → Guia de decisão → Sumário

### 4. Introdução de Módulo
Quando: Abrindo um novo módulo no curso

Estrutura: Sobre este módulo → Por que importa → O que você aprenderá → O que conseguirá fazer → Pré-requisitos → Estrutura → Encerramento encorajador

### 5. Estudo de Caso
Quando: Mostrando como um conceito se aplica na prática

Estrutura: Hook → Contexto → O desafio → Como foi aplicado → Resultado → O que aprendemos → Pergunta de reflexão

Veja `references/content-type.md` para templates detalhados de cada tipo.

## Checklist de Qualidade

Antes de finalizar qualquer conteúdo:

- [ ] A abertura envolve sem uma definição seca?
- [ ] Os objetivos são específicos e baseados em ações?
- [ ] Cada conceito é explicado, exemplificado e aplicado?
- [ ] Todo termo técnico é definido na primeira menção?
- [ ] O tom é quente, direto e centrado no aluno?
- [ ] Os parágrafos são curtos e bem-espaçados?
- [ ] Há um sumário claro e uma ponte para o próximo?
- [ ] Sem jargão que o aluno não foi preparado?
- [ ] Atende ao objetivo de aprendizagem declarado?

## Estrutura do Arquivo

```
educational-writer/
├── README.md                    # Este arquivo
├── SKILL.md                     # Documentação técnica completa
└── references/
    ├── content-type.md          # Templates para tipos específicos
    ├── tone-examples.md         # Exemplos antes/depois
    └── pedagogy-glossary.md     # Definições de termos pedagógicos
```

## Como Começar

1. **Leia `SKILL.md`** — Guia técnico completo sobre estrutura e princípios
2. **Estude `references/tone-examples.md`** — Calibre seu tom vendo antes/depois
3. **Escolha seu tipo** — Qual tipo de conteúdo você está criando? Veja `references/content-type.md`
4. **Aplique a estrutura** — Use o template apropriado e preencha cada seção
5. **Use o checklist** — Valide seu conteúdo antes de finalizar

## Saída Esperada

O skill retorna:

- **Artigo completo em Markdown** — Pronto para ser usado na plataforma Trinity
- **Bem estruturado** — Seguindo a arquitetura apropriada para o tipo
- **Pedagogicamente sólido** — Aplicando princípios de aprendizagem comprovados
- **Engajante** — Um tom que mantém o aluno interessado e motivado

## Integração com o Workflow Trinity

Este skill é parte do pipeline de criação de conteúdo:

- **Entrada:** Breve descrição do conteúdo desejado
- **Saída:** Artigo MDX-ready com toda estrutura pedagogicamente correta
- **Próximo passo:** Skill de design visual identifica onde adicionar ilustrações/animações (p5.js)

A qualidade da escrita define o sucesso do aprendizado — clareza, engajamento e estrutura são cruciais.

## Referências

- **SKILL.md** — Guia técnico e detalhado
- **content-type.md** — Templates para cada tipo de conteúdo
- **tone-examples.md** — Exemplos calibrados de escrita boa vs. ruim
- **pedagogy-glossary.md** — Definições de termos pedagógicos

---

**Última atualização:** Março 2026  
**Parte da:** Trinity Academy — Plataforma Educacional de Ciência da Computação

