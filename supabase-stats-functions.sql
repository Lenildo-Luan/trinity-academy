-- ============================================================================
-- FUNÇÕES SQL - ESTATÍSTICAS DO USUÁRIO
-- ============================================================================
-- Este arquivo contém funções adicionais para calcular estatísticas
-- Execute após o supabase-profile-schema.sql e supabase-quiz-schema.md

-- ============================================================================
-- FUNÇÃO: CALCULAR STREAK DE DIAS CONSECUTIVOS
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_last_activity DATE;
BEGIN
  -- Buscar a data da última atividade
  SELECT DATE(finished_at) INTO v_last_activity
  FROM quiz_attempts
  WHERE user_id = p_user_id
    AND status = 'completed'
  ORDER BY finished_at DESC
  LIMIT 1;

  -- Se não houver atividade, streak é 0
  IF v_last_activity IS NULL THEN
    RETURN 0;
  END IF;

  -- Se a última atividade não foi hoje nem ontem, streak quebrou
  IF v_last_activity < v_current_date - INTERVAL '1 day' THEN
    RETURN 0;
  END IF;

  -- Contar dias consecutivos
  WITH RECURSIVE date_series AS (
    -- Dia base: a data mais recente com atividade
    SELECT
      v_last_activity as activity_date,
      1 as streak_count

    UNION ALL

    -- Buscar dia anterior
    SELECT
      ds.activity_date - INTERVAL '1 day',
      ds.streak_count + 1
    FROM date_series ds
    WHERE EXISTS (
      SELECT 1
      FROM quiz_attempts qa
      WHERE qa.user_id = p_user_id
        AND qa.status = 'completed'
        AND DATE(qa.finished_at) = DATE(ds.activity_date - INTERVAL '1 day')
    )
    -- Limitar recursão para evitar loops infinitos (máximo 365 dias)
    AND ds.streak_count < 365
  )
  SELECT MAX(streak_count) INTO v_streak
  FROM date_series;

  RETURN COALESCE(v_streak, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNÇÃO: CALCULAR TEMPO TOTAL DE ESTUDO
-- ============================================================================

CREATE OR REPLACE FUNCTION get_total_study_time(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_total_seconds INTEGER;
BEGIN
  SELECT COALESCE(SUM(time_spent), 0) INTO v_total_seconds
  FROM quiz_attempts
  WHERE user_id = p_user_id
    AND status = 'completed'
    AND time_spent IS NOT NULL;

  RETURN v_total_seconds;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNÇÃO: OBTER TODAS AS ESTATÍSTICAS DO USUÁRIO
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_statistics(p_user_id UUID)
RETURNS TABLE (
  total_lessons INTEGER,
  completed_lessons BIGINT,
  completion_percentage NUMERIC,
  average_score NUMERIC,
  total_study_time_seconds INTEGER,
  current_streak INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Total de lições no sistema (contagem fixa baseada no código)
    14 as total_lessons,

    -- Lições completadas (nota >= 70%)
    COALESCE(
      (SELECT COUNT(DISTINCT lesson_id)::BIGINT
       FROM completed_lessons
       WHERE user_id = p_user_id),
      0::BIGINT
    ) as completed_lessons,

    -- Percentual de conclusão
    ROUND(
      COALESCE(
        (SELECT COUNT(DISTINCT lesson_id)::DECIMAL
         FROM completed_lessons
         WHERE user_id = p_user_id),
        0
      ) / 14.0 * 100,
      2
    ) as completion_percentage,

    -- Nota média (0-10)
    ROUND(
      COALESCE(
        (SELECT average_score_percentage / 10.0
         FROM user_progress
         WHERE user_id = p_user_id),
        0
      ),
      1
    ) as average_score,

    -- Tempo total de estudo em segundos
    get_total_study_time(p_user_id) as total_study_time_seconds,

    -- Streak de dias consecutivos
    get_user_streak(p_user_id) as current_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANTS (Permissões)
-- ============================================================================

-- Dar permissões para executar as funções
GRANT EXECUTE ON FUNCTION get_user_streak TO authenticated;
GRANT EXECUTE ON FUNCTION get_total_study_time TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_statistics TO authenticated;

-- ============================================================================
-- TESTES (OPCIONAL - COMENTAR EM PRODUÇÃO)
-- ============================================================================

/*
-- Testar função de streak
SELECT get_user_streak(auth.uid());

-- Testar função de tempo total
SELECT get_total_study_time(auth.uid());

-- Testar função de estatísticas completas
SELECT * FROM get_user_statistics(auth.uid());
*/

-- ============================================================================
-- FIM DO ARQUIVO
-- ============================================================================
