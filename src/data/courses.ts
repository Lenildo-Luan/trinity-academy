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
    id: "pre-calculo",
    title: "Pré-cálculo",
    description:
      "Prepare-se para dominar os conceitos essenciais de pré-cálculo, incluindo funções, gráficos e trigonometria, estabelecendo uma base sólida para o sucesso em matemática avançada.",
    backgroundImage:
      "https://ik.imagekit.io/qfmgarse7/thomas-t-OPpCbAAKWv8-unsplash.avif",
    available: false,
  },
];

