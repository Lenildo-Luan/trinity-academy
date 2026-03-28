# Real Examples from Trinity Academy Quizzes

This document contains fully annotated examples from Trinity's actual quizzes, with analysis of why they work well.

---

## Example 1: Strong Conceptual Definition Question

**Source:** `quiz-1.json` — "Qual é a função central da camada de transporte?"

```json
{
  "id": "q1",
  "question": "Qual é a função central da camada de transporte?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Fornecer comunicação lógica entre processos executando em hosts diferentes",
      "isCorrect": true,
      "explanation": "Correto! A camada de transporte estende a entrega host-a-host da camada de rede para entrega processo-a-processo, usando portas para identificar cada processo."
    },
    {
      "id": "a2",
      "text": "Fornecer comunicação lógica entre hosts (máquinas) na rede",
      "isCorrect": false,
      "explanation": "Comunicação host-a-host é responsabilidade da camada de rede (IP). A camada de transporte vai além."
    },
    {
      "id": "a3",
      "text": "Rotear pacotes entre redes diferentes através de roteadores",
      "isCorrect": false,
      "explanation": "Roteamento é função da camada de rede (IP), não da camada de transporte."
    },
    {
      "id": "a4",
      "text": "Transmitir bits pelo meio físico (cabo, fibra, wireless)",
      "isCorrect": false,
      "explanation": "A transmissão de bits é função da camada física, a mais baixa do modelo."
    }
  ]
}
```

**Why it works:**

1. **Clear learning objective:** Tests whether learner can explain (not just recall) what transport layer does
2. **Plausible distractors:**
   - A2: Adjacent concept (confuses transport with network layer)
   - A3: Layer confusion (network layer responsibility)
   - A4: Wrong layer (physical layer)
3. **No ambiguity:** Correct answer is unambiguously the most complete and accurate
4. **Educational explanations:** Each wrong answer explains a common misconception

---

## Example 2: Comparison/Distinction Question

**Source:** `quiz-15.json` — "Um algoritmo de roteamento Link State (como Dijkstra) diferencia-se..."

```json
{
  "id": "q2",
  "question": "Um algoritmo de roteamento Link State (como Dijkstra) diferencia-se de Distance Vector (como Bellman-Ford) principalmente em quê?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Link State: cada roteador conhece a topologia **completa** e calcula caminhos independentemente; Distance Vector: cada roteador conhece apenas vizinhos diretos e aprende iterativamente",
      "isCorrect": true,
      "explanation": "Correto! LS = 'conheço tudo, calculo tudo'. Ex: R1 em OSPF executa Dijkstra com grafo completo. DV = 'conheço vizinhos, pergunto a eles, aprendo'. Ex: R1 em RIP pede a R2 e R3 suas distâncias a tudo, atualiza seu vetor. Iterativo e distribuído."
    },
    {
      "id": "a2",
      "text": "Link State usa grafos; Distance Vector usa matrizes",
      "isCorrect": false,
      "explanation": "Ambos usam representações matemáticas. Diferença não é representação — é conhecimento (global vs. local)."
    },
    {
      "id": "a3",
      "text": "Link State é para IPv4; Distance Vector é para IPv6",
      "isCorrect": false,
      "explanation": "Ambos funcionam com IPv4 e IPv6. Diferença é algoritmo, não versão IP."
    },
    {
      "id": "a4",
      "text": "Link State converge mais lentamente porque compartilha muita informação",
      "isCorrect": false,
      "explanation": "Inversão! LS converge **rápido** (1 execução) porque tem topologia global. DV converge **lentamente** (O(N) iterações)."
    }
  ]
}
```

**Why it works:**

1. **Tests deep distinction:** Not just definitions, but core difference in approach
2. **Distractors reveal common errors:**
   - A2: Confuses representation with algorithm
   - A3: Confuses layers/versions with algorithm choice
   - A4: Reverses the convergence property
3. **Explanation goes deep:** The correct explanation includes concrete examples (OSPF vs RIP) that reinforce understanding
4. **Language clarity:** Uses bold to emphasize the core distinction ("**completa**" vs "apenas vizinhos")

---

## Example 3: Application/Scenario Question

**Source:** `quiz-15.json` — "Executando Dijkstra em uma rede..."

```json
{
  "id": "q4",
  "question": "Executando Dijkstra em uma rede, chegamos a um ponto onde temos D[R1]=0, D[R2]=5, D[R3]=∞, D[R4]=3, D[R5]=8, e N'={R1, R4}. Qual nó será processado na próxima iteração?",
  "alternatives": [
    {
      "id": "a1",
      "text": "R3, porque tem distância infinita (precisa ser alcançado)",
      "isCorrect": false,
      "explanation": "Dijkstra escolhe o nó com distância **mínima**, não máxima. R3 com ∞ só será visitado se for reachable (custo finito de outro nó)."
    },
    {
      "id": "a2",
      "text": "R2, porque tem a distância mínima entre os não visitados (5 < 8)",
      "isCorrect": true,
      "explanation": "Correto! Entre {R2, R3, R5} (não em N'), a distância mínima é D[R2]=5. Então processamos R2 na próxima iteração, adicionamos a N' e atualizamos distâncias de vizinhos de R2."
    },
    {
      "id": "a3",
      "text": "R2, porque é o próximo alfabeticamente",
      "isCorrect": false,
      "explanation": "Dijkstra não ordena alfabeticamente — ordena por distância."
    },
    {
      "id": "a4",
      "text": "R5, porque é o mais recentemente adicionado a D",
      "isCorrect": false,
      "explanation": "Recência não importa — apenas distância."
    }
  ]
}
```

**Why it works:**

1. **Requires execution/application:** Learner must trace algorithm logic, not just recall
2. **Concrete scenario:** Specific graph state with numbers makes it real
3. **Distractors test understanding:**
   - A1: Confuses optimization goal (choose minimum, not maximum)
   - A3: Confusion about ordering principle (not alphabetical)
   - A4: Confusion about timing (recency doesn't matter)
4. **Explanation shows work:** Guides through reasoning step-by-step

---

## Example 4: Choice Justification Question

**Source:** `quiz-1.json` — "Qual protocolo de transporte seria mais adequado..."

```json
{
  "id": "q7",
  "question": "Qual protocolo de transporte seria mais adequado para uma aplicação de videoconferência ao vivo?",
  "alternatives": [
    {
      "id": "a1",
      "text": "TCP — porque garante que todos os quadros de vídeo cheguem completos",
      "isCorrect": false,
      "explanation": "TCP retransmitiria quadros perdidos, causando atraso. Em videoconferência, é melhor pular um quadro do que esperar a retransmissão."
    },
    {
      "id": "a2",
      "text": "UDP — porque baixa latência é mais importante que entregar todos os pacotes",
      "isCorrect": true,
      "explanation": "Correto! Em videoconferência, perder um quadro é aceitável — o vídeo continua. Mas o atraso causado por retransmissões TCP tornaria a chamada inutilizável."
    },
    {
      "id": "a3",
      "text": "TCP — porque o handshake garante que a conexão é segura",
      "isCorrect": false,
      "explanation": "O handshake do TCP não garante segurança (criptografia é função do TLS), e o overhead adicional prejudica a latência."
    },
    {
      "id": "a4",
      "text": "Nenhum — videoconferência usa diretamente a camada de rede (IP)",
      "isCorrect": false,
      "explanation": "Aplicações sempre usam a camada de transporte (TCP ou UDP) para se comunicar. Não acessam IP diretamente."
    }
  ]
}
```

**Why it works:**

1. **Tests judgment, not memorization:** Requires understanding trade-offs
2. **Realistic scenario:** Real design decision (not abstract)
3. **Distractors exploit real misconceptions:**
   - A1: Understandable reasoning (TCP = reliable) but misses latency cost
   - A3: Confuses TCP safety with TLS security
   - A4: Misunderstands application/protocol stack
4. **Explanation emphasizes why:** "é melhor pular um quadro do que esperar retransmissão" teaches the strategic thinking

---

## Example 5: Conceptual Error with Nuance

**Source:** `quiz-18.json` — "Se um roteador BGP recebe múltiplas rotas..."

```json
{
  "id": "q4",
  "question": "Se um roteador BGP recebe múltiplas rotas para o mesmo prefixo, qual é o **primeiro critério** no algoritmo de seleção de rota?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Verificar viabilidade (reachability): descartar se há loop (ASN próprio em AS-PATH) ou se NEXT-HOP é inalcanável",
      "isCorrect": true,
      "explanation": "Correto! Primeiro filtro: é rota **válida**? Se meu AS está em AS-PATH, é loop — descarta. Se NEXT-HOP não é alcanável (não em tabela de roteamento intra-AS), descarta. Apenas rotas viáveis entram no 'torneio' de seleção. Depois de filtrar loops/inviáveis, aplica LOCAL-PREF, AS-PATH, etc."
    },
    {
      "id": "a2",
      "text": "Escolher a rota com **LOCAL-PREF máximo** (preferência local)",
      "isCorrect": false,
      "explanation": "LOCAL-PREF é **segundo** critério (após viabilidade). Deve-se descartar loops/inviáveis ANTES de considerar preferências."
    },
    {
      "id": "a3",
      "text": "Escolher a rota com **AS-PATH mais curto**",
      "isCorrect": false,
      "explanation": "AS-PATH curto é terceiro critério (após LOCAL-PREF). Viabilidade vem primeiro."
    },
    {
      "id": "a4",
      "text": "Usar a rota que chegou **primeiro** (FIFO)",
      "isCorrect": false,
      "explanation": "BGP não usa FIFO. Usa critérios bem-definidos (RFC 4271). Ordem de chegada não importa."
    }
  ]
}
```

**Why it works:**

1. **Tests understanding of priorities:** Which criterion comes first is crucial (affects all others)
2. **Distractors use real algorithm steps:** But in wrong order
3. **Correct answer emphasizes logic:** Viability must come first because later criteria assume valid route
4. **Explanation is sequential:** Shows thinking order (filter → then select)

---

## Example 6: Terminology Precision

**Source:** `quiz-15.json` — "Na equação de Bellman-Ford, Dx[d] = min..."

```json
{
  "id": "q5",
  "question": "Na equação de Bellman-Ford, D_x[d] = min(D_v[d] + custo(x, v)) para todos vizinhos v, o que representa 'D_v[d]'?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Distância mínima do **vizinho v até o destino d**, compartilhada por v com x",
      "isCorrect": true,
      "explanation": "Correto! Bellman-Ford é distribuído: D_v[d] é a informação que o vizinho v reportou ('posso chegar d com custo D_v[d]'). X usa isso: 'se v diz que chega d com custo D_v[d], então eu chego via v com custo D_v[d] + custo(x,v)'. Escolhe vizinho que minimiza isso."
    },
    {
      "id": "a2",
      "text": "Distância de x até vizinho v (custo do enlace direto)",
      "isCorrect": false,
      "explanation": "Isso é custo(x, v). D_v[d] é informação sobre **d**, não sobre v."
    },
    {
      "id": "a3",
      "text": "Histórico da distância de x a d em iterações anteriores",
      "isCorrect": false,
      "explanation": "D_v[d] é informação **atual** de v, não histórico de x."
    },
    {
      "id": "a4",
      "text": "Distância máxima que v pode reportar para d",
      "isCorrect": false,
      "explanation": "D_v[d] é a distância que v reportou, não máxima."
    }
  ]
}
```

**Why it works:**

1. **Precision in notation:** Uses actual equation from lesson (D_x[d], D_v[d])
2. **Confusion about indices:** Distractors confuse which nodes/indices the notation refers to
3. **Explanation clarifies meaning:** Shows how D_v[d] is used in distributed context
4. **Emphasizes "shared information":** Key insight that DV is about what neighbors report

---

## Pattern Analysis

Across these examples, notice:

1. **Every correct answer is unambiguous** — No clever alternative readings
2. **Every distractor is plausible** — Uses correct terminology and concepts
3. **Distractors cluster mistakes:**
   - Layer/concept confusion (Examples 1, 4)
   - Off-by-one / order confusion (Examples 3, 5)
   - Notation misunderstanding (Example 6)
   - Inverted logic (Example 2)
4. **Explanations are educational:**
   - Correct: Validates reasoning + provides deeper insight
   - Incorrect: Identifies misconception + provides correction
5. **Language is PT-BR:**
   - Formal register
   - Technical terms accurate
   - Accessible to learners

---

## How to Use These Examples

When designing your own questions:

1. **Match the structure** — Use similar question/distractor patterns
2. **Adapt the domain** — Change protocols/algorithms but keep pedagogical logic
3. **Mirror the explanation style** — Explain core concepts in correct answers
4. **Test real misconceptions** — Like these distractors do
5. **Validate with the checklist** — Ensure your questions meet the same criteria

These aren't templates to copy—they're models of *how to think* about quiz design in Trinity.


