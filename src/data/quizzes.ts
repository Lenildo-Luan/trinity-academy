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
 * Tipo de erro de validação do quiz
 */
export type QuizValidationError = {
  field: string;
  message: string;
};

/**
 * Resultado da validação do quiz
 */
export type QuizValidationResult = {
  isValid: boolean;
  errors: QuizValidationError[];
};

/**
 * Valida a estrutura completa de um quiz
 * @param data - Dados do quiz a serem validados
 * @returns Resultado da validação com possíveis erros
 */
export function validateQuizData(data: unknown): QuizValidationResult {
  const errors: QuizValidationError[] = [];

  // Verifica se é um objeto
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: [{ field: 'quiz', message: 'Dados do quiz inválidos ou ausentes' }],
    };
  }

  const quiz = data as Partial<Quiz>;

  // Validar campos obrigatórios do quiz
  if (!quiz.id || typeof quiz.id !== 'string') {
    errors.push({ field: 'id', message: 'ID do quiz é obrigatório' });
  }

  if (!quiz.title || typeof quiz.title !== 'string') {
    errors.push({ field: 'title', message: 'Título do quiz é obrigatório' });
  }

  if (!quiz.description || typeof quiz.description !== 'string') {
    errors.push({ field: 'description', message: 'Descrição do quiz é obrigatória' });
  }

  if (typeof quiz.timeLimit !== 'number' || quiz.timeLimit <= 0) {
    errors.push({ field: 'timeLimit', message: 'Tempo limite deve ser um número positivo' });
  }

  // Validar questões
  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    errors.push({ field: 'questions', message: 'Quiz deve conter pelo menos uma questão' });
    return { isValid: false, errors };
  }

  // Validar cada questão
  const questionIds = new Set<string>();
  quiz.questions.forEach((question, qIndex) => {
    const qPrefix = `questions[${qIndex}]`;

    // Validar campos da questão
    if (!question.id || typeof question.id !== 'string') {
      errors.push({ field: `${qPrefix}.id`, message: `Questão ${qIndex + 1}: ID é obrigatório` });
    } else {
      // Verificar IDs duplicados
      if (questionIds.has(question.id)) {
        errors.push({ field: `${qPrefix}.id`, message: `Questão ${qIndex + 1}: ID duplicado "${question.id}"` });
      }
      questionIds.add(question.id);
    }

    if (!question.question || typeof question.question !== 'string') {
      errors.push({ field: `${qPrefix}.question`, message: `Questão ${qIndex + 1}: Texto da questão é obrigatório` });
    }

    // Validar alternativas
    if (!Array.isArray(question.alternatives) || question.alternatives.length === 0) {
      errors.push({ field: `${qPrefix}.alternatives`, message: `Questão ${qIndex + 1}: Deve conter pelo menos uma alternativa` });
      return;
    }

    if (question.alternatives.length < 2) {
      errors.push({ field: `${qPrefix}.alternatives`, message: `Questão ${qIndex + 1}: Deve conter pelo menos 2 alternativas` });
    }

    // Validar cada alternativa
    const alternativeIds = new Set<string>();
    let hasCorrectAnswer = false;

    question.alternatives.forEach((alternative, aIndex) => {
      const aPrefix = `${qPrefix}.alternatives[${aIndex}]`;

      if (!alternative.id || typeof alternative.id !== 'string') {
        errors.push({ field: `${aPrefix}.id`, message: `Questão ${qIndex + 1}, Alternativa ${aIndex + 1}: ID é obrigatório` });
      } else {
        // Verificar IDs duplicados
        if (alternativeIds.has(alternative.id)) {
          errors.push({ field: `${aPrefix}.id`, message: `Questão ${qIndex + 1}, Alternativa ${aIndex + 1}: ID duplicado "${alternative.id}"` });
        }
        alternativeIds.add(alternative.id);
      }

      if (!alternative.text || typeof alternative.text !== 'string') {
        errors.push({ field: `${aPrefix}.text`, message: `Questão ${qIndex + 1}, Alternativa ${aIndex + 1}: Texto é obrigatório` });
      }

      if (typeof alternative.isCorrect !== 'boolean') {
        errors.push({ field: `${aPrefix}.isCorrect`, message: `Questão ${qIndex + 1}, Alternativa ${aIndex + 1}: Campo "isCorrect" deve ser booleano` });
      }

      if (alternative.isCorrect) {
        hasCorrectAnswer = true;
      }
    });

    // Verificar se há pelo menos uma resposta correta
    if (!hasCorrectAnswer) {
      errors.push({ field: `${qPrefix}.alternatives`, message: `Questão ${qIndex + 1}: Deve ter pelo menos uma alternativa correta` });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Carrega um quiz específico pelo ID
 * @param quizId - ID do quiz (ex: "quiz-1")
 * @returns Quiz validado ou null se não encontrado ou inválido
 */
export async function getQuiz(module: string, quizId: string): Promise<Quiz | null> {
  try {
    const quiz = await import(`@/data/quizzes/${module}/${quizId}.json`);
    const quizData = quiz.default;

    // Validar estrutura do quiz
    const validation = validateQuizData(quizData);

    if (!validation.isValid) {
      const errorMessages = validation.errors.map(e => `${e.field}: ${e.message}`).join('; ');
      console.error(
        `Quiz "${quizId}" contém dados inválidos:\n`,
        validation.errors.map(e => `  - ${e.field}: ${e.message}`).join('\n')
      );
      return null;
    }

    return quizData as Quiz;
  } catch (error) {
    // Quiz não encontrado
    console.error(`Quiz não encontrado: ${quizId}`, error);
    return null;
  }
}

/**
 * Lista todos os quizzes disponíveis
 * @returns Array de quizzes
 */
export async function getAllQuizzes(module: string): Promise<Quiz[]> {
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
      const quiz = await getQuiz(module, id);
      return quiz;
    }),
  );

  return quizzes.filter((quiz): quiz is Quiz => quiz !== null);
}
