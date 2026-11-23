export interface Value {
  title: string;
  description: string;
}

export interface Service {
  title: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  image?: string;
  imageAlt?: string;
  link?: string;
}

export interface Site {
  company: {
    name: string;
    headline: string;
    about: string;
  };
  values: Value[];
  services: Service[];
  projects: Project[];
  contact: {
    email: string;
    whatsapp: string;
  };
}

export const site: Site = {
  company: {
    name: 'KM Technology',
    headline: 'Soluções de tecnologia sob medida',
    about:
      'Somos uma Software House dedicada a entregar soluções de tecnologia sob medida, com atenção à segurança, à qualidade e às necessidades de cada cliente.',
  },
  values: [
    {
      title: 'Segurança',
      description: 'Tratamos a proteção de dados e sistemas como prioridade em cada entrega.',
    },
    {
      title: 'Qualidade',
      description: 'Buscamos excelência no código, nos processos e na experiência de uso.',
    },
    {
      title: 'Transparência',
      description: 'Comunicamos com clareza o progresso, os custos e as decisões de cada projeto.',
    },
    {
      title: 'Inovação',
      description: 'Exploramos novas tecnologias para resolver problemas reais com simplicidade.',
    },
  ],
  services: [
    {
      title: 'Marketing Digital',
      description: 'Estratégias e ações para fortalecer a presença digital e gerar resultados.',
    },
    {
      title: 'Design',
      description: 'Interfaces e identidades visuais funcionais, acessíveis e alinhadas à marca.',
    },
    {
      title: 'Segurança da Informação',
      description: 'Práticas e soluções para proteger dados, sistemas e operações.',
    },
    {
      title: 'Desenvolvimento de Software sob Encomenda',
      description: 'Sistemas personalizados, construídos para atender necessidades específicas.',
    },
  ],
  projects: [
    {
      name: 'KM Recupera',
      description:
        'Software de recuperação tributária de ICMS, com módulos da CAT 42 e da CAT 207.',
      technologies: ['React', 'Material UI'],
      image: '/images/recupera.png',
      imageAlt: 'Tela dos módulos do sistema KM Recupera',
      link: 'https://recupera.kmtechnology.com.br',
    },
  ],
  contact: { email: '', whatsapp: '' },
};
