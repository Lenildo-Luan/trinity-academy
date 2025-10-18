# Sistema de Persistência de Quizzes

Este documento descreve como o sistema de salvamento de quizzes funciona na plataforma.

## Visão Geral

O sistema salva automaticamente todas as tentativas de quiz dos usuários no Supabase, incluindo:
- Quando o quiz é iniciado
- Cada resposta selecionada pelo usuário
- Quando o quiz é finalizado
- Pontuação final e tempo gasto

## Arquitetura

### Componentes Principais

1. **Tipos TypeScript** (`src/types/database.ts`)
   - Define os tipos para as tabelas do banco de dados
   - `QuizAttempt`: Tentativa de quiz
   - `QuizAnswer`: Resposta individual
   - Views para estatísticas e progresso

2. **Serviço de Quiz** (`src/lib/quiz-service.ts`)
   - Funções para interagir com o Supabase
   - `createQuizAttempt()`: Cria nova tentativa
   - `saveQuizAnswer()`: Salva resposta
   - `finishQuizAttempt()`: Finaliza tentativa
   - `getBestQuizAttempt()`: Busca melhor pontuação
   - Funções para estatísticas e progresso

3. **Hook de Persistência** (`src/hooks/use-quiz-persistence.ts`)
   - Sincroniza automaticamente o estado do quiz com o banco
   - Usa `useEffect` para detectar mudanças de estado
   - Salva dados em tempo real

4. **Componentes UI**
   - `QuizSection`: Componente principal que usa o hook
   - `QuizBestAttempt`: Mostra melhor tentativa anterior
   - `QuizInitialView`: Tela inicial com informações do quiz

## Fluxo de Dados

### 1. Iniciar Quiz

Quando o usuário clica em "Iniciar Quiz":

```typescript
// 1. Estado muda para 'active'
quizState.startQuiz()

// 2. Hook detecta mudança e cria tentativa no banco
useQuizPersistence -> createQuizAttempt()

// 3. Attempt ID é armazenado em ref
attemptIdRef.current = data.id
```

### 2. Responder Questão

Quando o usuário seleciona uma alternativa:

```typescript
// 1. Resposta é adicionada ao estado local
quizState.selectAnswer(questionId, alternativeId)

// 2. Hook detecta nova resposta e salva no banco
useQuizPersistence -> saveQuizAnswer()

// 3. ID da questão é marcado como salvo
savedAnswersRef.current.add(questionId)
```

### 3. Finalizar Quiz

Quando o quiz termina (tempo esgota ou usuário finaliza):

```typescript
// 1. Estado muda para 'finished' e resultado é calculado
quizState.finishQuiz()

// 2. Hook detecta mudança e atualiza tentativa no banco
useQuizPersistence -> finishQuizAttempt()

// 3. Tentativa é marcada como 'completed' com pontuação final
```

## Funcionalidades

### Melhor Tentativa Anterior

O componente `QuizBestAttempt` mostra automaticamente a melhor pontuação anterior do usuário:

- Exibe percentual de acertos
- Mostra tempo gasto
- Indica se a lição foi completada (≥ 70%)
- Carrega de forma assíncrona

```tsx
<QuizBestAttempt quizId={quiz.id} />
```

### Progresso do Usuário

Funções disponíveis para buscar progresso:

```typescript
// Progresso geral
const { data: progress } = await getUserProgress()
// Retorna: lições completadas, nota média, etc.

// Estatísticas de um quiz específico
const { data: stats } = await getQuizStatistics('quiz-1')
// Retorna: melhor pontuação, número de tentativas, etc.

// Verificar se lição foi completada
const { data: completed } = await isLessonCompleted('charpter-1')
// Retorna: true se nota >= 70%
```

### Múltiplos Dispositivos

Todos os dados são salvos no Supabase com autenticação:
- Usuário pode acessar de qualquer dispositivo
- Progresso sincronizado automaticamente
- Histórico completo de tentativas preservado

## Segurança

### Row Level Security (RLS)

Todas as tabelas têm políticas RLS ativas:

```sql
-- Usuários só podem ver seus próprios dados
CREATE POLICY "Users can view their own quiz attempts"
  ON quiz_attempts
  FOR SELECT
  USING (auth.uid() = user_id);
```

### Autenticação

O sistema verifica autenticação antes de qualquer operação:

```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  throw new Error('Usuário não autenticado')
}
```

## Tratamento de Erros

Todas as funções retornam objeto com `data` e `error`:

```typescript
const { data, error } = await createQuizAttempt(...)

if (error) {
  console.error('Erro ao criar tentativa:', error)
  // Continua funcionando localmente
  return
}

// Usa os dados
console.log('Tentativa criada:', data.id)
```

**Importante**: Mesmo se houver erro ao salvar no banco, o quiz continua funcionando normalmente no cliente.

## Estados de Loading

O componente `QuizBestAttempt` mostra skeleton durante carregamento:

```tsx
{loading && (
  <div className="animate-pulse">
    <div className="h-4 w-32 bg-gray-200" />
  </div>
)}
```

## Como Usar em Novos Componentes

### Exemplo: Mostrar Progresso do Usuário

```tsx
'use client'

import { useEffect, useState } from 'react'
import { getUserProgress } from '@/lib/quiz-service'
import type { UserProgress } from '@/types/database'

export function UserProgressCard() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserProgress()
      .then(({ data, error }) => {
        if (error) {
          console.error('Erro:', error)
          return
        }
        setProgress(data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Carregando...</div>

  if (!progress) return null

  return (
    <div>
      <h2>Seu Progresso</h2>
      <p>Lições completadas: {progress.lessons_completed}</p>
      <p>Nota média: {progress.average_score_percentage}%</p>
      <p>Quizzes completos: {progress.quizzes_completed}</p>
    </div>
  )
}
```

### Exemplo: Histórico de Tentativas

```tsx
'use client'

import { useEffect, useState } from 'react'
import { getUserQuizAttempts } from '@/lib/quiz-service'
import type { QuizAttempt } from '@/types/database'

export function QuizHistory({ quizId }: { quizId: string }) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])

  useEffect(() => {
    getUserQuizAttempts(quizId)
      .then(({ data, error }) => {
        if (error || !data) return
        setAttempts(data)
      })
  }, [quizId])

  return (
    <div>
      <h3>Histórico de Tentativas</h3>
      <ul>
        {attempts.map(attempt => (
          <li key={attempt.id}>
            {attempt.score}/{attempt.total_questions} -
            {new Date(attempt.finished_at!).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Consultas Diretas ao Banco

Se precisar fazer consultas customizadas:

```typescript
import { createClient } from '@/lib/supabase/client'

async function getCustomData() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*, quiz_answers(*)')
    .eq('quiz_id', 'quiz-1')
    .order('created_at', { ascending: false })
    .limit(10)

  return { data, error }
}
```

## Estrutura do Banco de Dados

### Tabela: quiz_attempts

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único |
| user_id | UUID | ID do usuário |
| quiz_id | TEXT | ID do quiz |
| lesson_id | TEXT | ID da lição |
| started_at | TIMESTAMP | Quando iniciou |
| finished_at | TIMESTAMP | Quando finalizou |
| time_spent | INTEGER | Tempo em segundos |
| score | INTEGER | Número de acertos |
| total_questions | INTEGER | Total de questões |
| status | TEXT | in_progress, completed, abandoned |

### Tabela: quiz_answers

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único |
| attempt_id | UUID | ID da tentativa |
| question_id | TEXT | ID da questão |
| selected_alternative_id | TEXT | ID da alternativa |
| is_correct | BOOLEAN | Se está correta |
| answered_at | TIMESTAMP | Quando respondeu |

## Views Disponíveis

### user_progress
Progresso geral do usuário (lições, média, etc.)

### quiz_statistics
Estatísticas por quiz (melhor nota, tentativas, etc.)

### completed_lessons
Lições completadas com nota ≥ 70%

### quiz_attempt_details
Histórico detalhado com todas as respostas

## Troubleshooting

### Dados não estão sendo salvos

1. Verifique se usuário está autenticado:
```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

2. Verifique console do navegador para erros

3. Verifique RLS policies no Supabase Dashboard

### Melhor tentativa não aparece

1. Verifique se há tentativas completadas no banco
2. Verifique se status é 'completed'
3. Verifique console para erros de autenticação

### Performance lenta

1. Verifique se índices foram criados (ver `supabase-quiz-schema.md`)
2. Considere adicionar cache com React Query
3. Use views ao invés de queries complexas

## Melhorias Futuras

Possíveis adições ao sistema:

1. **Cache com React Query**
   - Reduzir chamadas ao banco
   - Invalidar cache automaticamente

2. **Modo Offline**
   - Salvar localmente com IndexedDB
   - Sincronizar quando online

3. **Ranking/Leaderboard**
   - Comparar pontuações entre usuários
   - View com melhores notas

4. **Análise de Erros Comuns**
   - Identificar questões mais difíceis
   - Sugerir revisão de conteúdo

5. **Exportar Progresso**
   - PDF com histórico completo
   - Certificado de conclusão
