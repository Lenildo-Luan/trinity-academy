# Visual Design Annotator Skill

Uma skill especializada em design educacional visual que funciona como ponte entre escritores de conteúdo e desenvolvedores p5.js na plataforma Trinity Academy.

## O que é?

O **Visual Design Annotator** é um agente especializado que lê artigos educacionais e identifica oportunidades onde elementos visuais — ilustrações, animações, visualizações interativas ou imagens estáticas — melhoram significativamente a compreensão dos alunos.

Em vez de criar código ou visuais, este skill **anota o artigo com especificações detalhadas** que servem como source of truth para um desenvolvedor p5.js implementar.

## Pipeline de Trabalho

```
Escritor (Markdown) 
    ↓
Visual Design Annotator (seu skill)
  • Lê o artigo
  • Identifica oportunidades visuais
  • Insere especificações {{ }}
    ↓
p5.js Developer
  • Lê as especificações
  • Implementa as visualizações
```

## Quando Usar

Use este skill quando precisar:

✅ **Revisar um artigo educacional para oportunidades visuais**
- Identificar conceitos abstratos, processos com movimento, estruturas espaciais ou relações de causa/efeito

✅ **Anotar conteúdo com placeholders de visualização**
- Inserir especificações `{{ }}` que um desenvolvedor possa implementar

✅ **Criar bridge entre conteúdo escrito e desenvolvimento visual**
- Garantir que o desenvolvedor tenha clareza sem depender da leitura do artigo original

## Tipos de Visualizações

| Tipo | Quando Usar | Exemplo |
|------|------------|---------|
| **Ilustração Estática** | Mostrar estrutura, anatomia, relacionamentos que não mudam | Diagrama de pilha de funções, árvore binária |
| **Animação** | Mostrar um processo, transformação ou sequência que se desdobra automaticamente | Algoritmo de bubble sort em ação, propagação de sinal |
| **Visualização Interativa** | Deixar o aluno controlar uma variável e ver o efeito em tempo real | Explorador de ondas seno (ajustar frequência/amplitude) |
| **Animação Passo a Passo** | Mostrar um algoritmo ou processo um passo por vez, controlado pelo aluno | Simulador de step-through de execução |

## Estrutura de uma Especificação

Cada especificação deve incluir, nesta ordem:

```
{{
TYPE: [Tipo de visualização]

TITLE: "Nome descritivo"

EDUCATIONAL PURPOSE:
Explicação clara do conceito ensinado e o que o aluno deve entender.

CANVAS SIZE: [largura] × [altura] px

VISUAL DESCRIPTION:
Descrição detalhada do que o aluno vê: formas, cores, layouts, rótulos.

INITIAL STATE:
[Apenas para animações e interativas] Estado inicial da visualização.

BEHAVIOR:
[Apenas para animações e interativas]
Como a visualização se comporta em resposta a tempo ou interação.

STATES:
[Apenas para interativas e passo a passo]
Todos os estados discretos que a visualização pode alcançar.

LABELS AND TEXT ON CANVAS:
Cada elemento de texto: conteúdo, fonte, tamanho, posição.

EDUCATIONAL ANNOTATIONS:
[Opcional] Callouts, setas ou highlights que aparecem em momentos-chave.

ACCESSIBILITY NOTES:
[Opcional] Considerações de contraste, colorblind-friendly, sensibilidade a movimento.
}}
```

## Exemplo de Decisão de Design

**❌ NÃO inserir visualização quando:**
- O texto já é claro e concreto (um bloco de código + explicação é suficiente)
- O visual seria apenas decorativo
- Adicioná-lo interromperia o fluxo lógico
- O conceito é melhor entendido através de prática que observação

**✅ INSERIR visualização quando:**
- O conceito tem uma **estrutura espacial** que palavras descrevem de forma estranha
- Envolve um **processo com passos** que se desdobra ao longo do tempo
- Envolve **causa e efeito** que o aluno deveria poder disparar
- O texto usa frases como *"imagine..."*, *"pense em..."*, *"visualize..."*
- Uma **analogia-chave** poderia ser ilustrada literalmente
- É um conceito **fundamental** que será referenciado repetidamente

## Boas Práticas

### Especificidade
- ✅ "5 retângulos, cada 60px × 40px, com 10px de espaçamento"
- ❌ "alguns retângulos"

### Nomeação de Controles
- ✅ "um slider labeled 'Speed' com range 1–10, default 3, posicionado abaixo"
- ❌ "o usuário pode mudar a velocidade"

### Cores com Propósito
- ✅ "azul (#3B82F6) para o elemento ativo, cinza claro (#E5E7EB) para inativo"
- ❌ "use azul"

### Transições
- ✅ "o elemento se move da posição atual para a alvo em 30 frames usando lerp() linear"
- ❌ "o elemento se move"

### Densidade de Visualizações
- **Meta:** 1–3 visualizações por artigo
- Mais de 3 deve ser excepcional e justificado
- Cada uma deve ganhar seu espaço

## Estrutura do Arquivo

```
visual-design-annotator/
├── README.md                    # Este arquivo
├── SKILL.md                     # Documentação completa do skill
└── references/
    └── spec-examples.md         # Exemplos detalhados de especificações
```

## Como Começar

1. **Leia `SKILL.md`** — Guia completo sobre como analisar, decidir e especificar
2. **Estude `references/spec-examples.md`** — Exemplos reais de cada tipo de visualização
3. **Aplique o processo de 6 passos:**
   - Ler e analisar o artigo
   - Decidir quais conceitos ganham visualizações
   - Escolher o tipo certo
   - Posicionar o placeholder
   - Escrever a especificação
   - Retornar o artigo completo com as anotações

## Saída Esperada

Quando acionado, o skill retorna:

1. **Sumário de Decisões de Design** — Listando cada visualização adicionada, sua posição e justificativa
2. **Artigo completo original** — Com placeholders `{{ }}` inseridos nos locais apropriados

Nenhum comentário adicional ou resumo — o artigo anotado é a entrega.

## Integração com o Workflow Trinity

Este skill é parte do pipeline de criação de conteúdo educacional:

- **Entrada:** Artigo Markdown do agente escritor
- **Saída:** Artigo Markdown com especificações visuais anotadas
- **Próximo passo:** Desenvolvedor p5.js usa as especificações para criar as visualizações

A qualidade das especificações determina a qualidade do visual implementado — precisão, clareza e completude são essenciais.

## Referências

- **SKILL.md** — Documentação técnica completa do processo
- **spec-examples.md** — Exemplos calibrados para cada tipo de visualização
- **p5.js documentation** — Referência para possibilidades técnicas (desenho, animação, interação)

---

**Última atualização:** Março 2026  
**Parte da:** Trinity Academy - Plataforma Educacional de Ciência da Computação

