export type Alternative = {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
};

export type Question = {
  id: string;
  question: string;
  alternatives: Alternative[];
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // em segundos (15 minutos = 900)
  questions: Question[];
};

/**
 * Carrega um quiz específico pelo ID
 * @param quizId - ID do quiz (ex: "quiz-1")
 * @returns Quiz ou null se não encontrado
 */
export async function getQuiz(quizId: string): Promise<Quiz | null> {
  try {
    const quiz = await import(`@/data/quizzes/${quizId}.json`);
    return quiz.default as Quiz;
  } catch (error) {
    console.error(`Quiz não encontrado: ${quizId}`, error);
    return null;
  }
}

/**
 * Lista todos os quizzes disponíveis
 * @returns Array de quizzes
 */
export async function getAllQuizzes(): Promise<Quiz[]> {
  // Por enquanto, retorna lista vazia
  // Em produção, poderia usar fs.readdir ou glob pattern
  const quizIds = [
    'quiz-1',
    'quiz-2',
    'quiz-3',
    'quiz-4',
    'quiz-5',
    'quiz-6',
    'quiz-7',
    'quiz-8',
    'quiz-9',
    'quiz-10',
    'quiz-11',
    'quiz-12',
    'quiz-13',
    'quiz-14',
  ];

  const quizzes = await Promise.all(
    quizIds.map(async (id) => {
      const quiz = await getQuiz(id);
      return quiz;
    }),
  );

  return quizzes.filter((quiz): quiz is Quiz => quiz !== null);
}
