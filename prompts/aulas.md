Todos os contextos e padrões necessários para realizar esta tarefa estão no arquivo prompts/processo-criacao-aula.md. Antes de iniciar o seu trabalho, certifique-se de ler e entender o conteúdo do arquivo mencionado.

No curso de: Materiais para Micro e Nano Tecnologia (Voltado para estudantes do primeiro semestre de engenhaira de computação).
Crie próximo módulo: Compósitos de Matriz Polimérica
Os capítulos do curso serão:

Capítulo 1: Fundamentos dos Compósitos de Matriz Polimérica
Resumo: Este capítulo introdutório define o que é um compósito de matriz polimérica: um material formado por uma resina polimérica (matriz) combinada com um material de reforço, geralmente fibroso. Serão discutidas as principais vantagens dessa combinação, como a melhora nas propriedades mecânicas (resistência à tração, impacto, abrasão e corrosão), e as desvantagens, como a menor resistência a temperaturas elevadas e o alto coeficiente de expansão térmica. A matriz pode ser de polímero termoplástico (ex: polietileno, nylon) ou termofixo (ex: epóxi), cada um com características distintas de processamento e desempenho.

Use p5.js para ilustrar visualmente os conceitos apresentados.
Use o componente MarkdownTable.tsx para criar tabelas.
Faça o quiz ao final do capítulo.

---

1. Best-Effort vs. QoS (Garantias)
   Descrição: Lado a lado, dois sistemas transmitindo. À esquerda, best-effort (pacotes perdem-se aleatoriamente). À direita, QoS (pacotes passam com sucesso, com fila e prioridade).
   Componentes: Duas filas de pacotes, alguns caindo em best-effort, buffers com limite em QoS
   Métricas: Contador de pacotes perdidos, taxa de sucesso, jitter
   Visual: Pacotes em best-effort "piscam" e desaparecem; em QoS, passam ordenados
2. Datagram vs. Circuito Virtual (Comparação)
   Descrição: Lado a lado, dois fluxos simultâneos. Datagrams (pacotes 1, 2, 3 percorrem caminhos diferentes e chegam fora de ordem). Circuitos virtuais (sequência garantida, mesma rota).
   Componentes: Dois conjuntos de nós com cores/números para rastrear ordem
   Animação: Pacotes datagram com trajetórias diferentes, VC com trajetória única
   Visual: Datagram chega "desordenado", VC chega ordenado na destino
3. Congestionamento e Descarte de Pacotes
   Descrição: Um roteador central com múltiplas entrada (links). Buffer visual mostrando pacotes enfileirados. Quando cheio, novos pacotes são descartados (desaparecem em vermelho).
   Componentes: Fila com capacidade máxima, setas de entrada de diferentes links
   Dinâmica: Taxa de chegada vs. taxa de processamento configurável
   Visual: Buffer cheio = cor vermelha, pacotes descartados saem pelo fundo
4. Algoritmo de Dijkstra Passo-a-Passo
   Descrição: Visualização animada do algoritmo de Dijkstra encontrando o caminho mais curto.
   Componentes: Grafo com nós, arestas com pesos (latência, custo), destaque dos nós visitados
   Animação: Nós mudam cor conforme são processados (cinza → amarelo → verde)
   Tabela: Mostra distâncias atualizadas a cada iteração
   Controle: Play/pause para acompanhar passo-a-passo

#1 (Topologia dinâmica) - Fundamental para entender o conceito
#4 (Best-Effort vs. QoS) - Contraste claro entre modelos
#5 (Datagram vs. VC) - Essencial para compreender diferenças
#7 (Dijkstra) - Algoritmo icônico, visual direto
#6 (Congestionamento) - Problema prático evidente