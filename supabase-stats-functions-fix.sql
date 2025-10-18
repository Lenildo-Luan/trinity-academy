-- ============================================================================
-- FIX: CORREÇÃO DA FUNÇÃO get_user_streak
-- ============================================================================
-- Este script corrige o erro de tipo na query recursiva
-- Execute este script no Supabase SQL Editor se você recebeu o erro:
-- "recursive query "date_series" column 1 has type date in non-recursive term
--  but type timestamp without time zone overall"

-- ============================================================================
-- FUNÇÃO CORRIGIDA: CALCULAR STREAK DE DIAS CONSECUTIVOS
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

    -- Buscar dia anterior (usar aritmética de datas para manter tipo DATE)
    SELECT
      ds.activity_date - 1,
      ds.streak_count + 1
    FROM date_series ds
    WHERE EXISTS (
      SELECT 1
      FROM quiz_attempts qa
      WHERE qa.user_id = p_user_id
        AND qa.status = 'completed'
        AND DATE(qa.finished_at) = ds.activity_date - 1
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
-- TESTE (OPCIONAL)
-- ============================================================================

/*
-- Testar a função corrigida
SELECT get_user_streak(auth.uid());
*/
