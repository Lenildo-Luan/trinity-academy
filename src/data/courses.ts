export type Course = {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  available: boolean;
};

export const courses: Course[] = [
  {
    id: "introducao-a-programacao",
    title: "Introdução a Programação",
    description:
      "Uma jornada no universo da programação que te fará entender os conceitos fundamentais da programação utilizando a linguagem mais popular do mundo: JavaScript.",
    backgroundImage:
      "https://ik.imagekit.io/qfmgarse7/js-background.avif?updatedAt=1760284705415",
    available: true,
  },
  {
    id: "vuejs-fundamentals",
    title: "Fundamentos do Vue.js",
    description:
      "Domine os fundamentos do Vue.js, o framework JavaScript progressivo para construir interfaces de usuário reativas e modernas, e eleve suas habilidades de desenvolvimento web para o próximo nível.",
    backgroundImage:
      "https://ik.imagekit.io/qfmgarse7/b286b91b-f5c4-4f25-b0fb-f3a1da720da8.webp",
    available: true,
  },
  {
    id: "github-fundamentals",
    title: "Fundamentos do GitHub",
    description:
      "Domine o Git e o GitHub do zero: controle de versão, colaboração em equipe e as ferramentas essenciais que todo desenvolvedor profissional precisa dominar.",
    backgroundImage:
      "https://ik.imagekit.io/qfmgarse7/roman-synkevych-wX2L8L-fGeA-unsplash.avif",
    available: true,
  },
  {
    id: "materiais-micro-nano-tecnologia",
    title: "Materiais para Micro e Nano Tecnologia",
    description:
      "Explore o fascinante mundo dos materiais para micro e nano tecnologia, compreendendo sensores, atuadores e os princípios fundamentais que impulsionam a engenharia moderna em escala micro e nanométrica.",
    backgroundImage:
      "https://ik.imagekit.io/qfmgarse7/d-koi-5nI9N2wNcBU-unsplash.avif",
    available: true,
  },
  {
    id: "redes-de-computadores",
    title: "Redes de Computadores",
    description:
      "Domine os fundamentos das redes de computadores, desde a camada de transporte até protocolos como TCP e UDP, com foco nos conceitos essenciais para engenharia de computação.",
    backgroundImage:
      "https://ik.imagekit.io/qfmgarse7/jordan-harrison-40XgDxBfYXM-unsplash.avif",
    available: true,
  },
];

