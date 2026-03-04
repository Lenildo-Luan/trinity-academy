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
    id: "pre-calculo",
    title: "Pré-cálculo",
    description:
      "Prepare-se para dominar os conceitos essenciais de pré-cálculo, incluindo funções, gráficos e trigonometria, estabelecendo uma base sólida para o sucesso em matemática avançada.",
    backgroundImage:
      "https://ik.imagekit.io/qfmgarse7/thomas-t-OPpCbAAKWv8-unsplash.avif",
    available: false,
  },
];

