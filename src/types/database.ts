/**
 * Tipos TypeScript para as tabelas do banco de dados Supabase
 */

export type QuizAttemptStatus = 'in_progress' | 'completed' | 'abandoned'

export type QuizAttempt = {
  id: string
  user_id: string
  quiz_id: string
  lesson_id: string
  course_id: string
  started_at: string
  finished_at: string | null
  time_spent: number | null
  score: number
  total_questions: number
  status: QuizAttemptStatus
  created_at: string
  updated_at: string
}

export type QuizAnswer = {
  id: string
  attempt_id: string
  question_id: string
  selected_alternative_id: string
  is_correct: boolean
  answered_at: string
}

export type QuizAttemptInsert = {
  user_id: string
  quiz_id: string
  lesson_id: string
  course_id: string
  total_questions: number
  status: QuizAttemptStatus
  started_at?: string
  finished_at?: string | null
  time_spent?: number | null
  score?: number
}

export type QuizAnswerInsert = Omit<QuizAnswer, 'id' | 'answered_at'>

export type QuizAttemptUpdate = Partial<
  Pick<QuizAttempt, 'finished_at' | 'time_spent' | 'score' | 'status'>
>

// Tipos para as views

export type UserProgress = {
  user_id: string
  lessons_completed: number
  quizzes_completed: number
  average_score_percentage: number
  total_correct_answers: number
  total_questions_answered: number
  last_activity: string
}

export type QuizStatistics = {
  user_id: string
  quiz_id: string
  lesson_id: string
  course_id: string
  total_attempts: number
  best_score: number
  total_questions: number
  best_score_percentage: number
  fastest_time_seconds: number
  average_time_seconds: number
  last_attempt_date: string
  completed_attempts: number
}

export type CompletedLesson = {
  user_id: string
  lesson_id: string
  quiz_id: string
  course_id: string
  best_score: number
  total_questions: number
  best_score_percentage: number
  completion_date: string
}

export type QuizAttemptDetail = {
  attempt_id: string
  user_id: string
  quiz_id: string
  lesson_id: string
  course_id: string
  started_at: string
  finished_at: string | null
  time_spent: number | null
  score: number
  total_questions: number
  score_percentage: number
  status: QuizAttemptStatus
  total_answered: number
  correct_answers: number
  incorrect_answers: number
}

// Tipos para perfil de usuário

export type UserProfile = {
  id: string
  full_name: string | null
  photo_url: string | null
  created_at: string
  updated_at: string
}

export type UserProfileInsert = {
  id: string
  full_name?: string | null
  photo_url?: string | null
}

export type UserProfileUpdate = Partial<Pick<UserProfile, 'full_name' | 'photo_url'>>

// Tipos para estatísticas do usuário

export type UserStatistics = {
  total_lessons: number
  completed_lessons: number
  completion_percentage: number
  average_score: number
  total_study_time_seconds: number
  current_streak: number
}
