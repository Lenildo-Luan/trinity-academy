# Plano de Implementação - Sistema de Quiz

## Arquitetura

O quiz será implementado como um **componente ao final da página da lesson**. A página da lesson exibe normalmente seu conteúdo MDX, e ao final renderiza o componente de quiz.

**Componente de Quiz**: Possui três estados internos isolados:

1. **Inicial**: Exibe botão "Iniciar Quiz"
2. **Quiz Ativo**: Exibe timer, questões, progresso e navegação
3. **Resultado**: Exibe pontuação, análise e botão "Refazer Quiz"

**Navegação na Página**: O usuário pode **rolar a página livremente** e visualizar o conteúdo da lesson enquanto o quiz está ativo. O quiz fica fixo em sua seção ao final da página.

**Bloqueio de Navegação**: Durante o quiz ativo, tentativas de **sair da página** (navegar para outra lesson, clicar em links externos, voltar/avançar no browser) exibirão um modal de confirmação. Se confirmar, o quiz é finalizado e a navegação prossegue. Caso contrário, permanece na página atual.

---

## 1. Estrutura de Dados (src/data/)

**1.1 Atualizar tipos e funções em lessons.ts**

- Adicionar campo quizId: string | null ao tipo Lesson
- Associar cada lesson existente ao seu respectivo quiz (quiz-1 para charpter-1, etc.)
- Criar arquivo quizzes.ts com:
  - Tipos TypeScript para Quiz, Question, Alternative
  - Função getQuiz(quizId: string) para carregar quiz JSON
  - Função getAllQuizzes() para listar todos os quizzes disponíveis

## 2. Componentes React (src/components/)

**2.1 Criar quiz-section.tsx** (Componente principal)

- Componente container que gerencia os três estados internos do quiz
- Renderizado ao final do conteúdo da lesson em `[slug]/page.tsx`
- Controla qual view exibir: inicial, quiz ativo ou resultado
- Integra use-quiz-state para gerenciar estado
- Integra use-navigation-blocker quando estado é 'active'
- Recebe quizId como prop e carrega dados do quiz

**2.2 Criar quiz-initial-view.tsx**

- View do estado inicial do quiz
- Exibe título, descrição e informações do quiz (número de questões, tempo limite)
- Botão "Iniciar Quiz" que dispara startQuiz()

**2.3 Criar quiz-active-view.tsx**

- View do estado ativo do quiz
- Integra todos os subcomponentes do quiz: timer, progress, question, navigation
- Layout responsivo para exibir questões

**2.4 Criar quiz-timer.tsx**

- Componente de contador regressivo de 15 minutos
- Formatação MM:SS
- Alertas visuais quando tempo está acabando (últimos 2 minutos)
- Callback quando tempo expira

**2.5 Criar quiz-progress-bar.tsx**

- Barra de progresso visual
- Mostra "X de Y questões respondidas"
- Indicador de progresso percentual

**2.6 Criar quiz-question.tsx**

- Exibe número, pergunta e alternativas múltipla escolha
- Radio buttons para seleção de alternativa
- Estado de alternativa selecionada
- Estilo visual consistente com o design do projeto

**2.7 Criar quiz-navigation.tsx**

- Botão "Encerrar Prova" (sempre habilitado)
- Botão "Próxima Questão" (desabilitado até selecionar resposta)
- Modal de confirmação para "Encerrar Prova"

**2.8 Criar quiz-navigation-blocker-modal.tsx**

- Modal exibido ao tentar navegar para fora da página durante o quiz
- Mensagem: "Ao sair desta página, o quiz será finalizado. Deseja continuar?"
- Botão "Continuar no Quiz" (permanece na página)
- Botão "Sair e Finalizar" (navega e finaliza o quiz)
- Integração com Next.js router para interceptar navegação

**2.9 Criar quiz-result-view.tsx**

- View do estado de resultado
- Exibe nota final (porcentagem e X/Y acertos)
- Lista de questões com indicação de correto/incorreto
- Explicações das respostas corretas
- Botão "Refazer Quiz" que reinicia o componente (volta ao estado inicial)
- Botão opcional "Rolar para o Topo" para facilitar navegação

## 3. Hooks Personalizados (src/hooks/)

**3.1 Criar use-quiz-state.ts**

- Gerenciar estado interno do componente quiz-section
- Estados: 'inactive' | 'active' | 'finished'
- Dados: questão atual, respostas do usuário, tempo restante, quiz data
- Funções:
  - `startQuiz()`: inicia o quiz (inactive → active)
  - `selectAnswer(questionId, answerId)`: registra resposta
  - `nextQuestion()`: avança para próxima questão
  - `finishQuiz()`: finaliza e calcula pontuação (active → finished)
  - `resetQuiz()`: reinicia do zero (finished → inactive)
- Calcular pontuação ao finalizar

**3.2 Criar use-quiz-timer.ts**

- Hook para gerenciar contador de 15 minutos
- Auto-finalização quando tempo expira (chama finishQuiz())
- Controle: start, pause, reset
- Retorna tempo restante em segundos

**3.3 Criar use-navigation-blocker.ts**

- Hook para interceptar tentativas de sair da página
- Recebe parâmetro `isActive: boolean` (ativo apenas quando quiz está ativo)
- Detecta mudanças de rota e navegação do browser
- Exibe modal de confirmação via callback
- Integração com Next.js App Router navigation events
- Prevenir navegação via browser back/forward

## 4. Páginas (src/app/)

**4.1 Modificar (sidebar)/[slug]/page.tsx**

- Renderizar conteúdo da lesson normalmente (MDX, video, etc.)
- Ao final do conteúdo, adicionar componente `<QuizSection quizId={lesson.quizId} />`
- Verificar se `lesson.quizId` existe antes de renderizar o componente
- O componente QuizSection gerencia seus próprios estados internamente
- Não precisa gerenciar estado do quiz na página (isolado no componente)

## 5. Estilos e Design

**5.1 Manter consistência visual**

- Usar classes Tailwind seguindo padrão do projeto
- Dark mode support
- Animações suaves para transições entre estados do quiz
- Responsividade mobile
- Separação visual clara entre conteúdo da lesson e seção do quiz

**5.2 Layout do quiz**

- Container com padding e margem adequados
- Border ou background diferenciado para destacar seção do quiz
- Estados visuais distintos para cada view (inicial, ativo, resultado)

## 6. Validações e Edge Cases

**6.1 Tratamento de erros**

- Quiz não encontrado (quizId inválido)
- Dados do quiz corrompidos ou inválidos (validar estrutura JSON)
- Exibir mensagem de erro amigável dentro do componente

**6.2 Navegação e Bloqueio**

- **Scroll permitido**: Usuário pode rolar a página e ver conteúdo da lesson
- **Navegação bloqueada**: Durante quiz ativo, interceptar tentativas de sair da página:
  - Cliques em links da sidebar
  - Cliques em links do breadcrumb
  - Navegação via botão voltar/avançar do browser
  - Mudanças de URL diretas
- Exibir modal de confirmação em todas as tentativas de saída
- Finalizar quiz automaticamente ao confirmar saída
- Permitir navegação livre quando quiz está inativo ou finalizado

**6.3 Comportamento do Timer**

- Timer visível apenas durante quiz ativo
- Pausar timer se usuário minimizar/trocar de aba (opcional)
- Salvar tempo restante em estado do componente

**6.4 Persistência (Opcional - Fase 2)**

- Salvar progresso do quiz em localStorage
- Permitir retomar quiz incompleto ao recarregar página
- Exibir opção "Continuar Quiz" ou "Iniciar Novo Quiz"

## 7. Documentação

**7.1 Atualizar CLAUDE.md**

- Documentar estrutura de quizzes (tipos, funções, JSON)
- Explicar como associar quiz a lesson (campo quizId)
- Formato dos arquivos JSON de quiz (exemplo completo)
- Documentar componente QuizSection (props, estados, comportamento)
- Explicar bloqueio de navegação durante quiz ativo
- Notas sobre scroll livre na página vs navegação bloqueada

---

## Estrutura do Componente Quiz

```tsx
// Exemplo conceitual da estrutura do quiz-section.tsx

<QuizSection quizId="quiz-1">
  {state === 'inactive' && <QuizInitialView onStart={startQuiz} />}

  {state === 'active' && (
    <>
      <NavigationBlockerModal isOpen={showBlocker} onConfirm={finishAndNavigate} />
      <QuizActiveView
        timer={<QuizTimer timeRemaining={timeRemaining} />}
        progress={<QuizProgressBar current={currentQuestion} total={totalQuestions} />}
        question={<QuizQuestion question={currentQuestionData} onSelect={selectAnswer} />}
        navigation={<QuizNavigation onNext={nextQuestion} onFinish={finishQuiz} />}
      />
    </>
  )}

  {state === 'finished' && <QuizResultView score={score} onReset={resetQuiz} />}
</QuizSection>
```

---

## Ordem de Implementação

1. **Estrutura de dados** (lessons.ts, quizzes.ts)
   - Definir tipos TypeScript (Quiz, Question, Alternative)
   - Criar funções de carregamento: getQuiz(quizId), getAllQuizzes()
   - Adicionar campo quizId ao tipo Lesson
   - Associar quizzes às lessons existentes

2. **Hooks de gerenciamento**
   - use-quiz-state (gerenciar estados e dados do quiz)
   - use-quiz-timer (contador de 15 minutos)
   - use-navigation-blocker (interceptar saída da página)

3. **Componentes base (subcomponentes)**
   - quiz-timer (contador regressivo visual)
   - quiz-progress-bar (barra de progresso X/Y)
   - quiz-question (pergunta e alternativas)
   - quiz-navigation (botões próxima/encerrar)
   - quiz-navigation-blocker-modal (modal de confirmação)

4. **Componentes de views**
   - quiz-initial-view (estado inicial - botão "Iniciar Quiz")
   - quiz-active-view (estado ativo - integra timer, progress, question, navigation)
   - quiz-result-view (estado resultado - nota, análise, refazer)

5. **Componente principal**
   - quiz-section (container que gerencia os três estados)
   - Integrar use-quiz-state
   - Integrar use-navigation-blocker
   - Renderização condicional das views

6. **Integração na página da lesson**
   - Modificar (sidebar)/[slug]/page.tsx
   - Adicionar QuizSection ao final do conteúdo
   - Verificar quizId antes de renderizar

7. **Testes e refinamentos**
   - Testar transições entre estados (inactive → active → finished → inactive)
   - Testar bloqueio de navegação (links, browser back/forward)
   - Verificar timer e auto-finalização ao expirar
   - Validar cálculo de pontuação
   - Testar scroll da página com quiz ativo
   - Testar responsividade e dark mode
   - Validar tratamento de erros

8. **Documentação**
   - Atualizar CLAUDE.md com estrutura de quizzes
   - Documentar formato JSON dos quizzes
   - Exemplos de uso do componente QuizSection