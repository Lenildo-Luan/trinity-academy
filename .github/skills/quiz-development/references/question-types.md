# Question Types & Templates for Trinity Quizzes

This document provides templates for different types of quiz questions used at Trinity Academy. Each template shows the structure, pedagogical purpose, and a complete example.

---

## Type 1: Conceptual Definition (Explain What)

**Pedagogical Purpose:** Tests if learner can explain a concept in their own context understanding.

**Template:**
```json
{
  "id": "qN",
  "question": "What does [CONCEPT] mean in the context of [DOMAIN]?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Correct explanation with specific context",
      "isCorrect": true,
      "explanation": "Yes! [CONCEPT] specifically refers to [definition]. In [DOMAIN], this matters because [relevance]. Example: [concrete case]."
    },
    {
      "id": "a2",
      "text": "Vague or partially correct definition",
      "isCorrect": false,
      "explanation": "Partially correct, but misses the specificity. [CONCEPT] is not just [partial def]—it also involves [missing nuance]. The key distinction is [clarification]."
    }
  ]
}
```

**Real Example from Trinity:**
```json
{
  "id": "q1",
  "question": "O que é um 'System Autônomo' (AS) no contexto de roteamento inter-AS?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Um conjunto de roteadores sob controle administrativo único, com políticas de roteamento internas consistentes",
      "isCorrect": true,
      "explanation": "Correto! Um AS é uma unidade administrativa — uma ISP, universidade, ou empresa que controla seus roteadores e define suas próprias políticas de roteamento. Exemplos: AS15169 (Google), AS701 (Verizon). Cada AS tem um ASN único (AS Number)."
    },
    {
      "id": "a2",
      "text": "Um único roteador que opera de forma independente",
      "isCorrect": false,
      "explanation": "Não — um AS pode ter centenas de roteadores. A característica-chave é o controle **administrativo único**, não o número de roteadores. Um AS pequeno pode ter 10 roteadores; um grande (ISP) pode ter 10.000+."
    }
  ]
}
```

---

## Type 2: Distinguish Between Similar Concepts (Comparison)

**Pedagogical Purpose:** Learner can identify key differences between related concepts (common source of confusion).

**Template:**
```json
{
  "id": "qN",
  "question": "[CONCEPT_A] differs from [CONCEPT_B] mainly in that [SPECIFICITY]?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Correct difference with specificity",
      "isCorrect": true,
      "explanation": "Correct! The **core difference** is [difference]. [CONCEPT_A] [specific property], while [CONCEPT_B] [opposite property]. This matters because [consequence]."
    },
    {
      "id": "a2",
      "text": "Superficial or partially true difference",
      "isCorrect": false,
      "explanation": "Incorrect. While [statement] might seem true, the key difference is not [this]—it's [core difference]. The misconception here is [why learner might think this]."
    },
    {
      "id": "a3",
      "text": "Opposite of correct difference (confuses A and B)",
      "isCorrect": false,
      "explanation": "You might have confused the two. It's actually [CONCEPT_B] that [property], not [CONCEPT_A]. The distinction is important because [why]."
    }
  ]
}
```

**Real Example from Trinity:**
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
      "text": "Distance Vector converge mais lentamente porque compartilha muita informação",
      "isCorrect": false,
      "explanation": "Inversão! LS converge **rápido** (1 execução) porque tem topologia global. DV converge **lentamente** (O(N) iterações)."
    }
  ]
}
```

---

## Type 3: Application/Scenario (Apply Knowledge)

**Pedagogical Purpose:** Learner can apply concept to new situation, not just recall.

**Template:**
```json
{
  "id": "qN",
  "question": "Given [SCENARIO], what would happen/should you do?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Correct application with justification",
      "isCorrect": true,
      "explanation": "Yes! In this scenario, [reason]. Because [scenario detail], [concept] leads to [outcome]. You could verify this by [validation]."
    },
    {
      "id": "a2",
      "text": "Common misapplication of concept",
      "isCorrect": false,
      "explanation": "This is a common mistake—applying [concept] as if [wrong assumption]. But the scenario specifies [detail], which changes the outcome to [correct outcome]."
    }
  ]
}
```

**Real Example from Trinity:**
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
    }
  ]
}
```

---

## Type 4: Critical Analysis (Evaluate/Analyze)

**Pedagogical Purpose:** Learner can critically examine statements, spot flawed reasoning, or choose optimal solution.

**Template:**
```json
{
  "id": "qN",
  "question": "Why would you choose [OPTION_A] over [OPTION_B] when [CONSTRAINT]?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Correct reasoning with strategic justification",
      "isCorrect": true,
      "explanation": "Correct strategy! Because [constraint], [OPTION_A] is superior because [reason 1] and [reason 2]. [OPTION_B] would fail because [why]. In real systems, [real-world example]."
    },
    {
      "id": "a2",
      "text": "Reasoning that ignores the constraint",
      "isCorrect": false,
      "explanation": "You might think this in general, but given the constraint [constraint], this reasoning breaks down. The constraint changes the calculus because [impact]."
    }
  ]
}
```

**Real Example from Trinity:**
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
      "explanation": "Correto! Em videoconferência, perder um quadro é aceitável — o vídeo continua. Mas o atraso causado por retransmissões TCP tornaria a chamada inutilizável. A estratégia é: melhor qualidade degradada em tempo real do que qualidade perfeita com atraso."
    }
  ]
}
```

---

## Type 5: Sequence/Order Questions

**Pedagogical Purpose:** Tests understanding of process steps or algorithmic flow.

**Template:**
```json
{
  "id": "qN",
  "question": "In [PROCESS], what is the correct **second** step after [FIRST_STEP]?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Correct next step with justification",
      "isCorrect": true,
      "explanation": "Yes! After [FIRST_STEP], the next step is [SECOND_STEP] because [why order matters]. This prepares for [next step]."
    }
  ]
}
```

**Real Example from Trinity:**
```json
{
  "id": "q6",
  "question": "O TCP estabelece uma conexão antes de transmitir dados usando um processo chamado:",
  "alternatives": [
    {
      "id": "a1",
      "text": "2-way handshake (SYN → ACK)",
      "isCorrect": false,
      "explanation": "O TCP usa três mensagens, não duas, para estabelecer a conexão."
    },
    {
      "id": "a2",
      "text": "3-way handshake (SYN → SYN-ACK → ACK)",
      "isCorrect": true,
      "explanation": "Correto! O 3-way handshake sincroniza emissor e receptor em três etapas: o cliente envia SYN, o servidor responde SYN-ACK, e o cliente confirma com ACK."
    }
  ]
}
```

---

## Type 6: True/False with Explanation

**Pedagogical Purpose:** Forces learner to commit to position and justify reasoning.

**Note:** Trinity typically avoids pure true/false (less discrimination) but can use format: "Is the following statement true or false?"

**Template:**
```json
{
  "id": "qN",
  "question": "True or False: [STATEMENT]. Why?",
  "alternatives": [
    {
      "id": "a1",
      "text": "True — [correct reasoning]",
      "isCorrect": true,
      "explanation": "[STATEMENT] is true because [detailed explanation]. Evidence: [proof or example]."
    },
    {
      "id": "a2",
      "text": "True — [incorrect reasoning]",
      "isCorrect": false,
      "explanation": "The statement is indeed true, but your reasoning is wrong. [STATEMENT] is true because [correct reason], not because [your reason]. The difference matters because [why]."
    },
    {
      "id": "a3",
      "text": "False — [plausible reason]",
      "isCorrect": false,
      "explanation": "Actually, the statement IS true. You might think [plausible objection], but [clarification]. Example: [concrete case]."
    }
  ]
}
```

---

## Type 7: Multi-Faceted Problem (Complex Application)

**Pedagogical Purpose:** Tests integration of multiple concepts.

**Template:**
```json
{
  "id": "qN",
  "question": "In [COMPLEX_SCENARIO with multiple constraints], which approach best balances [TRADEOFF_1] and [TRADEOFF_2]?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Approach that optimizes TRADEOFF_1 but fails at TRADEOFF_2",
      "isCorrect": false,
      "explanation": "This optimizes [TRADEOFF_1], but fails because [why TRADEOFF_2 is critical]. In this scenario, [TRADEOFF_2] is more important because [reason]."
    },
    {
      "id": "a2",
      "text": "Approach that balances both tradeoffs appropriately",
      "isCorrect": true,
      "explanation": "Correct! This approach [description] balances both concerns. [TRADEOFF_1] is handled by [mechanism], while [TRADEOFF_2] is addressed by [mechanism]. In the context of [scenario], this is optimal because [why]."
    }
  ]
}
```

---

## Design Principles Summary

Across all types:

1. **Be specific** — Vague questions test vague understanding
2. **Use context** — Show WHY the concept matters
3. **Mix difficulty levels** — Early questions should be accessible; later ones harder
4. **Test misconceptions, not tricks** — Distractors should reflect real errors, not gotchas
5. **Always explain** — Every answer choice is a teaching opportunity
6. **Validate application** — Include scenario-based questions that require application, not just recall


