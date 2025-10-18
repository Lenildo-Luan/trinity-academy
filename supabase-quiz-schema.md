# Schema SQL - Sistema de Quizzes

Este arquivo contém o schema SQL para salvar os resultados dos quizzes dos usuários no Supabase.

## Visão Geral

O sistema armazena:
- Tentativas de quiz (quando o usuário inicia e finaliza um quiz)
- Respostas individuais para cada questão
- Progresso do curso e notas gerais
- Estatísticas e relatórios de desempenho

## Como usar

Cole o SQL abaixo no SQL Editor do Supabase:

1. Acesse seu projeto no Supabase
2. Vá em "SQL Editor"
3. Clique em "New Query"
4. Cole todo o código SQL abaixo
5. Clique em "Run" para executar

---

## Schema SQL

```sql
-- ============================================================================
-- TABELAS PRINCIPAIS
-- ============================================================================

-- Tabela de tentativas de quiz
-- Armazena cada vez que um usuário inicia/finaliza um quiz
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relação com o usuário (auth.users do Supabase)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- IDs do quiz e da lição
  quiz_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE,

  -- Tempo gasto em segundos
  time_spent INTEGER,

  -- Pontuação
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL,

  -- Status da tentativa
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'completed', 'abandoned')),

  -- Timestamps de auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de respostas individuais
-- Armazena cada resposta dada pelo usuário em uma questão
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relação com a tentativa de quiz
  attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,

  -- IDs da questão e alternativa selecionada
  question_id TEXT NOT NULL,
  selected_alternative_id TEXT NOT NULL,

  -- Se a resposta está correta
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,

  -- Quando foi respondida
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Índice para buscar tentativas por usuário
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id
  ON quiz_attempts(user_id);

-- Índice para buscar tentativas por quiz
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id
  ON quiz_attempts(quiz_id);

-- Índice para buscar tentativas por lição
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_lesson_id
  ON quiz_attempts(lesson_id);

-- Índice para ordenar por data
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created_at
  ON quiz_attempts(created_at DESC);

-- Índice composto para buscar tentativas completas de um usuário
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_status
  ON quiz_attempts(user_id, status);

-- Índice para respostas por tentativa
CREATE INDEX IF NOT EXISTS idx_quiz_answers_attempt_id
  ON quiz_answers(attempt_id);

-- ============================================================================
-- TRIGGERS PARA AUTO-UPDATE
-- ============================================================================

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at em quiz_attempts
CREATE TRIGGER update_quiz_attempts_updated_at
  BEFORE UPDATE ON quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Ativar RLS nas tabelas
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas suas próprias tentativas
CREATE POLICY "Users can view their own quiz attempts"
  ON quiz_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem inserir suas próprias tentativas
CREATE POLICY "Users can insert their own quiz attempts"
  ON quiz_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar suas próprias tentativas
CREATE POLICY "Users can update their own quiz attempts"
  ON quiz_attempts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem ver suas próprias respostas
CREATE POLICY "Users can view their own quiz answers"
  ON quiz_answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts
      WHERE quiz_attempts.id = quiz_answers.attempt_id
      AND quiz_attempts.user_id = auth.uid()
    )
  );

-- Política: Usuários podem inserir suas próprias respostas
CREATE POLICY "Users can insert their own quiz answers"
  ON quiz_answers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_attempts
      WHERE quiz_attempts.id = quiz_answers.attempt_id
      AND quiz_attempts.user_id = auth.uid()
    )
  );

-- ============================================================================
-- VIEWS PARA CONSULTAS ÚTEIS
-- ============================================================================

-- View: Progresso geral do usuário
CREATE OR REPLACE VIEW user_progress AS
SELECT
  qa.user_id,
  COUNT(DISTINCT qa.lesson_id) as lessons_completed,
  COUNT(DISTINCT qa.quiz_id) as quizzes_completed,
  ROUND(AVG(CAST(qa.score AS DECIMAL) / qa.total_questions * 100), 2) as average_score_percentage,
  SUM(qa.score) as total_correct_answers,
  SUM(qa.total_questions) as total_questions_answered,
  MAX(qa.finished_at) as last_activity
FROM quiz_attempts qa
WHERE qa.status = 'completed'
GROUP BY qa.user_id;

-- View: Estatísticas por quiz
CREATE OR REPLACE VIEW quiz_statistics AS
SELECT
  qa.user_id,
  qa.quiz_id,
  qa.lesson_id,
  COUNT(*) as total_attempts,
  MAX(qa.score) as best_score,
  MAX(qa.total_questions) as total_questions,
  ROUND(MAX(CAST(qa.score AS DECIMAL) / qa.total_questions * 100), 2) as best_score_percentage,
  MIN(qa.time_spent) as fastest_time_seconds,
  AVG(qa.time_spent) as average_time_seconds,
  MAX(qa.finished_at) as last_attempt_date,
  COUNT(*) FILTER (WHERE qa.status = 'completed') as completed_attempts
FROM quiz_attempts qa
WHERE qa.status = 'completed'
GROUP BY qa.user_id, qa.quiz_id, qa.lesson_id;

-- View: Lições completadas com sucesso (nota >= 70%)
CREATE OR REPLACE VIEW completed_lessons AS
SELECT
  qa.user_id,
  qa.lesson_id,
  qa.quiz_id,
  MAX(qa.score) as best_score,
  MAX(qa.total_questions) as total_questions,
  ROUND(MAX(CAST(qa.score AS DECIMAL) / qa.total_questions * 100), 2) as best_score_percentage,
  MAX(qa.finished_at) as completion_date
FROM quiz_attempts qa
WHERE qa.status = 'completed'
GROUP BY qa.user_id, qa.lesson_id, qa.quiz_id
HAVING MAX(CAST(qa.score AS DECIMAL) / qa.total_questions * 100) >= 70;

-- View: Histórico detalhado de tentativas
CREATE OR REPLACE VIEW quiz_attempt_details AS
SELECT
  qa.id as attempt_id,
  qa.user_id,
  qa.quiz_id,
  qa.lesson_id,
  qa.started_at,
  qa.finished_at,
  qa.time_spent,
  qa.score,
  qa.total_questions,
  ROUND(CAST(qa.score AS DECIMAL) / qa.total_questions * 100, 2) as score_percentage,
  qa.status,
  COUNT(qans.id) as total_answered,
  COUNT(qans.id) FILTER (WHERE qans.is_correct = TRUE) as correct_answers,
  COUNT(qans.id) FILTER (WHERE qans.is_correct = FALSE) as incorrect_answers
FROM quiz_attempts qa
LEFT JOIN quiz_answers qans ON qa.id = qans.attempt_id
GROUP BY qa.id;

-- ============================================================================
-- FUNÇÕES AUXILIARES
-- ============================================================================

-- Função: Obter progresso do usuário
CREATE OR REPLACE FUNCTION get_user_progress(p_user_id UUID)
RETURNS TABLE (
  lessons_completed BIGINT,
  quizzes_completed BIGINT,
  average_score_percentage NUMERIC,
  total_correct_answers BIGINT,
  total_questions_answered BIGINT,
  last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_progress WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função: Obter melhor tentativa de um quiz
CREATE OR REPLACE FUNCTION get_best_quiz_attempt(
  p_user_id UUID,
  p_quiz_id TEXT
)
RETURNS TABLE (
  attempt_id UUID,
  score INTEGER,
  total_questions INTEGER,
  score_percentage NUMERIC,
  finished_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    qa.id,
    qa.score,
    qa.total_questions,
    ROUND(CAST(qa.score AS DECIMAL) / qa.total_questions * 100, 2),
    qa.finished_at,
    qa.time_spent
  FROM quiz_attempts qa
  WHERE qa.user_id = p_user_id
    AND qa.quiz_id = p_quiz_id
    AND qa.status = 'completed'
  ORDER BY qa.score DESC, qa.finished_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função: Verificar se usuário completou uma lição (nota >= 70%)
CREATE OR REPLACE FUNCTION is_lesson_completed(
  p_user_id UUID,
  p_lesson_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_completed BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM completed_lessons
    WHERE user_id = p_user_id AND lesson_id = p_lesson_id
  ) INTO v_completed;

  RETURN v_completed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função: Obter nota geral do curso (média de todos os quizzes completados)
CREATE OR REPLACE FUNCTION get_overall_grade(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_grade NUMERIC;
BEGIN
  SELECT average_score_percentage INTO v_grade
  FROM user_progress
  WHERE user_id = p_user_id;

  RETURN COALESCE(v_grade, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função: Obter respostas de uma tentativa específica
CREATE OR REPLACE FUNCTION get_quiz_attempt_answers(p_attempt_id UUID)
RETURNS TABLE (
  question_id TEXT,
  selected_alternative_id TEXT,
  is_correct BOOLEAN,
  answered_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    qa.question_id,
    qa.selected_alternative_id,
    qa.is_correct,
    qa.answered_at
  FROM quiz_answers qa
  WHERE qa.attempt_id = p_attempt_id
  ORDER BY qa.answered_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANTS (Permissões)
-- ============================================================================

-- Dar permissões para usuários autenticados
GRANT SELECT, INSERT, UPDATE ON quiz_attempts TO authenticated;
GRANT SELECT, INSERT ON quiz_answers TO authenticated;

-- Dar permissões para as views
GRANT SELECT ON user_progress TO authenticated;
GRANT SELECT ON quiz_statistics TO authenticated;
GRANT SELECT ON completed_lessons TO authenticated;
GRANT SELECT ON quiz_attempt_details TO authenticated;

-- Dar permissões para executar as funções
GRANT EXECUTE ON FUNCTION get_user_progress TO authenticated;
GRANT EXECUTE ON FUNCTION get_best_quiz_attempt TO authenticated;
GRANT EXECUTE ON FUNCTION is_lesson_completed TO authenticated;
GRANT EXECUTE ON FUNCTION get_overall_grade TO authenticated;
GRANT EXECUTE ON FUNCTION get_quiz_attempt_answers TO authenticated;

-- ============================================================================
-- DADOS DE EXEMPLO (OPCIONAL - REMOVER EM PRODUÇÃO)
-- ============================================================================

-- Comentar ou remover esta seção em produção
-- Apenas para testes em desenvolvimento

/*
-- Inserir uma tentativa de teste (substitua USER_UUID pelo ID real do usuário)
INSERT INTO quiz_attempts (
  user_id,
  quiz_id,
  lesson_id,
  started_at,
  finished_at,
  time_spent,
  score,
  total_questions,
  status
) VALUES (
  'USER_UUID', -- Substitua pelo UUID do usuário
  'quiz-1',
  'charpter-1',
  NOW() - INTERVAL '20 minutes',
  NOW(),
  1200, -- 20 minutos em segundos
  8,
  10,
  'completed'
);

-- Inserir respostas de teste
INSERT INTO quiz_answers (
  attempt_id,
  question_id,
  selected_alternative_id,
  is_correct
)
SELECT
  (SELECT id FROM quiz_attempts ORDER BY created_at DESC LIMIT 1),
  'q' || generate_series,
  'a2',
  (generate_series % 3) != 0 -- 2 de cada 3 estão corretas
FROM generate_series(1, 10);
*/

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================
```

## Estrutura das Tabelas

### quiz_attempts
Armazena cada tentativa de quiz do usuário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único da tentativa |
| user_id | UUID | ID do usuário (FK para auth.users) |
| quiz_id | TEXT | ID do quiz (ex: "quiz-1") |
| lesson_id | TEXT | ID da lição (ex: "charpter-1") |
| started_at | TIMESTAMP | Quando o quiz foi iniciado |
| finished_at | TIMESTAMP | Quando o quiz foi finalizado (NULL se em andamento) |
| time_spent | INTEGER | Tempo gasto em segundos |
| score | INTEGER | Número de acertos |
| total_questions | INTEGER | Total de questões do quiz |
| status | TEXT | Status: 'in_progress', 'completed', 'abandoned' |
| created_at | TIMESTAMP | Data de criação do registro |
| updated_at | TIMESTAMP | Data da última atualização |

### quiz_answers
Armazena cada resposta individual do usuário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único da resposta |
| attempt_id | UUID | ID da tentativa (FK para quiz_attempts) |
| question_id | TEXT | ID da questão (ex: "q1") |
| selected_alternative_id | TEXT | ID da alternativa selecionada (ex: "a2") |
| is_correct | BOOLEAN | Se a resposta está correta |
| answered_at | TIMESTAMP | Quando foi respondida |

## Views Disponíveis

### user_progress
Mostra o progresso geral do usuário:
- Lições completadas
- Quizzes completados
- Nota média em percentual
- Total de acertos
- Última atividade

### quiz_statistics
Estatísticas detalhadas por quiz:
- Melhor pontuação
- Tempo mais rápido
- Número de tentativas
- Data da última tentativa

### completed_lessons
Lições completadas com sucesso (nota >= 70%):
- Melhor pontuação
- Data de conclusão
- Percentual de acerto

### quiz_attempt_details
Histórico detalhado com todas as tentativas e suas respostas.

## Funções Úteis

### get_user_progress(user_id)
Retorna o progresso completo do usuário.

```sql
SELECT * FROM get_user_progress(auth.uid());
```

### get_best_quiz_attempt(user_id, quiz_id)
Retorna a melhor tentativa do usuário em um quiz específico.

```sql
SELECT * FROM get_best_quiz_attempt(auth.uid(), 'quiz-1');
```

### is_lesson_completed(user_id, lesson_id)
Verifica se o usuário completou uma lição com nota >= 70%.

```sql
SELECT is_lesson_completed(auth.uid(), 'charpter-1');
```

### get_overall_grade(user_id)
Retorna a nota geral do usuário no curso (média de todos os quizzes).

```sql
SELECT get_overall_grade(auth.uid());
```

### get_quiz_attempt_answers(attempt_id)
Retorna todas as respostas de uma tentativa específica.

```sql
SELECT * FROM get_quiz_attempt_answers('attempt-uuid');
```

## Exemplos de Uso

### Criar nova tentativa de quiz

```sql
INSERT INTO quiz_attempts (
  user_id,
  quiz_id,
  lesson_id,
  total_questions,
  status
) VALUES (
  auth.uid(),
  'quiz-1',
  'charpter-1',
  10,
  'in_progress'
) RETURNING id;
```

### Salvar resposta do usuário

```sql
INSERT INTO quiz_answers (
  attempt_id,
  question_id,
  selected_alternative_id,
  is_correct
) VALUES (
  'attempt-uuid',
  'q1',
  'a2',
  true
);
```

### Finalizar quiz

```sql
UPDATE quiz_attempts
SET
  finished_at = NOW(),
  time_spent = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER,
  score = (
    SELECT COUNT(*)
    FROM quiz_answers
    WHERE attempt_id = 'attempt-uuid' AND is_correct = true
  ),
  status = 'completed'
WHERE id = 'attempt-uuid'
  AND user_id = auth.uid();
```

### Buscar histórico de tentativas do usuário

```sql
SELECT * FROM quiz_attempt_details
WHERE user_id = auth.uid()
ORDER BY started_at DESC;
```

### Verificar progresso do curso

```sql
SELECT
  lessons_completed,
  quizzes_completed,
  average_score_percentage,
  total_correct_answers,
  total_questions_answered
FROM user_progress
WHERE user_id = auth.uid();
```

## Segurança

O schema inclui Row Level Security (RLS) para garantir que:
- Usuários só podem ver seus próprios dados
- Usuários só podem criar/editar suas próprias tentativas
- Dados são isolados por usuário automaticamente

## Notas Importantes

1. **Autenticação**: O schema usa `auth.uid()` do Supabase Auth. Certifique-se de que os usuários estão autenticados.

2. **Performance**: Os índices criados otimizam as consultas mais comuns. Para grandes volumes de dados, considere índices adicionais.

3. **Integridade**: As foreign keys garantem que não existam respostas órfãs ou tentativas sem usuário.

4. **Auditoria**: Os campos `created_at` e `updated_at` permitem rastrear quando os dados foram criados/modificados.

5. **Estatísticas**: As views são recalculadas em tempo real. Para melhor performance com muitos dados, considere materializar as views.
