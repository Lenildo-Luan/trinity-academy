export type Module = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  video: {
    thumbnail: string;
    duration: number;
    url: string;
  } | null;
  quizId: string | null;
};

export function getModules(): Module[] {
  return lessons;
}

export async function getLesson(
  slug: string,
): Promise<(Lesson & { module: Module; next: Lesson | null }) | null> {
  let module = lessons.find(({ lessons }) =>
    lessons.some(({ id }) => id === slug),
  );

  if (!module) {
    return null;
  }

  let index = module.lessons.findIndex(({ id }) => id === slug);

  return {
    ...module.lessons[index],
    module,
    next: index < module.lessons.length - 1 ? module.lessons[index + 1] : null,
  };
}

export async function getLessonContent(slug: string) {
  return (await import(`@/data/lessons/${slug}.mdx`)).default;
}

const lessons = [
  {
    id: "introduction",
    title: "Fundamentos",
    description:
      "Uma introdução ao JavaScript, a linguagem de programação mais popular do mundo.",
    lessons: [
      {
        id: "charpter-1",
        title: "Bem-vindos ao Futuro",
        description:
          "Vamos viajar no tempo para entender como chegamos até aqui.",
        video: null,
        quizId: "quiz-1",
      },
      {
        id: "charpter-2",
        title: "Os Primeiros Blocos da Programação",
        description:
          "Nesta aula, você vai descobrir como criar essas 'caixas digitais'.",
        video: null,
        quizId: "quiz-2",
      },
      {
        id: "charpter-3",
        title: "Tipos de Dados em JavaScript",
        description:
          "Vamos explorar os diferentes tipos de dados que você pode usar para armazenar informações em JavaScript.",
        video: null,
        quizId: "quiz-3",
      },
      {
        id: "charpter-4",
        title: "A Matemática na Programação",
        description:
          "Vamos explorar como os operadores matemáticos são usados para manipular dados em JavaScript.",
        video: null,
        quizId: "quiz-4",
      },
    ],
  },
  {
    id: "code-flow",
    title: "Mudando o fluxo de execução",
    description:
      "Aprenda a mudar o fluxo de execução do código usando estruturas condicionais e loops.",
    lessons: [
      {
        id: "charpter-5",
        title: "Operadores de comparação e lógicos",
        description:
          "Vamos aprender a usar operadores de comparação e lógicos para criar condições mais complexas em nossos programas.",
        video: null,
        quizId: "quiz-5",
      },
      {
        id: "charpter-6",
        title: "Tomando Decisões",
        description:
          "Vamos aprender a usar estruturas condicionais para que nossos programas possam tomar decisões com base em diferentes condições.",
        video: null,
        quizId: "quiz-6",
      },
      {
        id: "charpter-8",
        title: "O Poder da Repetição",
        description:
          "Vamos aprender a usar loops para repetir ações em nossos programas, tornando-os mais eficientes e poderosos.",
        video: null,
        quizId: "quiz-8",
      },
      {
        id: "charpter-9",
        title: "Organizando seu Código com funções",
        description:
          "Vamos aprender a criar e usar funções para organizar nosso código, tornando-o mais modular e reutilizável.",
        video: null,
        quizId: "quiz-9",
      },
      {
        id: "charpter-10",
        title: "Funções Avançadas em JavaScript",
        description:
          "Vamos explorar conceitos avançados de funções em JavaScript, como funções anônimas, funções de flecha e closures.",
        video: null,
        quizId: "quiz-10",
      },
    ],
  },
  {
    id: "basic-data-structures",
    title: "Estruturas de dados básicas",
    description:
      "Vamos nos aprofundar nas estruturas de dados mais comuns em JavaScript: arrays, objetos e strings.",
    lessons: [
      {
        id: "charpter-7",
        title: "Trabalhando com Texto em JavaScript",
        description:
          "Vamos aprender a manipular strings em JavaScript, incluindo métodos comuns para modificar e analisar texto.",
        video: null,
        quizId: "quiz-7",
      },
      {
        id: "charpter-11",
        title: "O Poder das Listas em Programação",
        description:
          "Vamos aprender a usar arrays para armazenar e manipular coleções de dados em JavaScript.",
        video: null,
        quizId: "quiz-11",
      },
      {
        id: "charpter-12",
        title: "Dominando a Busca, Filtragem e Transformação de Dados",
        description:
          "Vamos explorar métodos avançados de arrays, como map, filter e reduce, para processar dados de forma eficiente.",
        video: null,
        quizId: "quiz-12",
      },
      {
        id: "charpter-13",
        title: "Organizando Informações com Objetos",
        description:
          "Vamos aprender a usar objetos para armazenar dados estruturados em JavaScript.",
        video: null,
        quizId: "quiz-13",
      },
      {
        id: "charpter-14",
        title: "O Problema das Cópias de Objetos",
        description:
          "Vamos entender como a atribuição e cópia de objetos funcionam em JavaScript, e como evitar armadilhas comuns.",
        video: null,
        quizId: "quiz-14",
      },
    ],
  },
  {
    id: "final-project",
    title: "Projeto Final",
    description:
      "Vamos aplicar tudo o que aprendemos em um projeto prático.",
    lessons: [
      {
        id: "charpter-15",
        title: "Planejamento do Projeto",
        description:
          "Vamos planejar nosso projeto final, definindo os requisitos e funcionalidades que queremos implementar.",
        video: null,
        quizId: null,
      },
      {
        id: "charpter-16",
        title: "Implementação do Sistema",
        description:
          "Vamos começar a implementar nosso projeto final, colocando em prática tudo o que aprendemos até agora.",
        video: null,
        quizId: null,
      },
      {
        id: "charpter-17",
        title: "Testando o Sistema",
        description:
          "Vamos testar nosso projeto final para garantir que tudo esteja funcionando.",
        video: null,
        quizId: null,
      },
      {
        id: "charpter-18",
        title: "Conclusão",
        description:
          "Vamos revisar o que aprendemos e discutir os próximos passos para continuar sua jornada na programação.",
        video: null,
        quizId: null,
      },
    ],
  },
];
