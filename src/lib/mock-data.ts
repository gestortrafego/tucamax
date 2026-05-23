export type Empresa = {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  cidade: string;
  estado: string;
  segmento: string;
  cnae: string;
  situacao: "Ativa" | "Suspensa" | "Baixada" | "Inapta";
  porte: "MEI" | "ME" | "EPP" | "Demais";
  email?: string;
  telefone?: string;
  capitalSocial: number;
  abertura: string;
  socios?: string[];
  endereco?: string;
};

const segmentos = ["Tecnologia", "Saúde", "Construção", "Varejo", "Educação", "Indústria", "Logística", "Agro", "Serviços", "Financeiro"];
const cidades: [string, string][] = [
  ["São Paulo", "SP"], ["Rio de Janeiro", "RJ"], ["Belo Horizonte", "MG"],
  ["Curitiba", "PR"], ["Porto Alegre", "RS"], ["Salvador", "BA"],
  ["Recife", "PE"], ["Fortaleza", "CE"], ["Brasília", "DF"], ["Manaus", "AM"],
];
const portes: Empresa["porte"][] = ["MEI", "ME", "EPP", "Demais"];
const situacoes: Empresa["situacao"][] = ["Ativa", "Ativa", "Ativa", "Ativa", "Suspensa", "Baixada", "Inapta"];

const nomes = [
  "Aurora", "Bravo", "Cedro", "Delta", "Eclipse", "Falcão", "Granito", "Horizonte",
  "Íris", "Jaguar", "Kairos", "Lótus", "Mirante", "Nimbus", "Orquídea", "Pampa",
  "Quartzo", "Raízes", "Sirius", "Tucano", "União", "Vértice", "Xerox", "Zênite",
];
const sufixos = ["Tecnologia", "Soluções", "Indústria", "Comércio", "Logística", "Sistemas", "Engenharia", "Holding"];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const r = rng(42);

export const empresas: Empresa[] = Array.from({ length: 48 }, (_, i) => {
  const nome = nomes[i % nomes.length];
  const sufixo = sufixos[Math.floor(r() * sufixos.length)];
  const [cidade, estado] = cidades[Math.floor(r() * cidades.length)];
  const cnpjNum = (10000000000000 + Math.floor(r() * 89999999999999)).toString().padStart(14, "0");
  return {
    id: `emp-${i + 1}`,
    cnpj: `${cnpjNum.slice(0, 2)}.${cnpjNum.slice(2, 5)}.${cnpjNum.slice(5, 8)}/${cnpjNum.slice(8, 12)}-${cnpjNum.slice(12)}`,
    razaoSocial: `${nome} ${sufixo} LTDA`,
    nomeFantasia: `${nome} ${sufixo}`,
    cidade,
    estado,
    segmento: segmentos[Math.floor(r() * segmentos.length)],
    cnae: `${Math.floor(r() * 9000 + 1000)}-${Math.floor(r() * 9)}/0${Math.floor(r() * 9)}`,
    situacao: situacoes[Math.floor(r() * situacoes.length)],
    porte: portes[Math.floor(r() * portes.length)],
    email: `contato@${nome.toLowerCase()}.com.br`,
    telefone: `(${10 + Math.floor(r() * 89)}) ${Math.floor(r() * 90000 + 10000)}-${Math.floor(r() * 9000 + 1000)}`,
    capitalSocial: Math.floor(r() * 5000000) + 10000,
    abertura: `${2005 + Math.floor(r() * 19)}-0${1 + Math.floor(r() * 8)}-${10 + Math.floor(r() * 18)}`,
    socios: [`${nome} Silva`, `Maria ${sufixo}`],
    endereco: `Av. ${nome}, ${Math.floor(r() * 9000) + 100} - Centro, ${cidade}/${estado}`,
  };
});

export type Projeto = {
  id: string;
  nome: string;
  descricao: string;
  leads: number;
  criadoEm: string;
  atualizadoEm: string;
  arquivado: boolean;
  cor: string;
};

export const projetos: Projeto[] = [
  { id: "p1", nome: "Prospecção SaaS B2B", descricao: "Empresas de tecnologia com porte EPP+ no Sudeste", leads: 142, criadoEm: "2025-02-10", atualizadoEm: "2025-05-18", arquivado: false, cor: "orange" },
  { id: "p2", nome: "Indústria Sul", descricao: "Indústrias ativas em PR, SC e RS", leads: 87, criadoEm: "2025-03-04", atualizadoEm: "2025-05-15", arquivado: false, cor: "yellow" },
  { id: "p3", nome: "Healthtech 2026", descricao: "Clínicas e startups de saúde abertas em 2024+", leads: 53, criadoEm: "2025-04-22", atualizadoEm: "2025-05-20", arquivado: false, cor: "cyan" },
  { id: "p4", nome: "Varejo Nordeste", descricao: "Comércio varejista de médio porte", leads: 211, criadoEm: "2024-11-08", atualizadoEm: "2025-01-30", arquivado: true, cor: "violet" },
];

export const metricas = {
  empresasEncontradas: 12847,
  leadsSalvos: 493,
  projetosAtivos: 3,
  creditosUtilizados: 6420,
  creditosTotal: 10000,
  empresasAbertasHoje: 218,
};

export const atividadeSemana = [
  { dia: "Seg", buscas: 24, leads: 12 },
  { dia: "Ter", buscas: 38, leads: 18 },
  { dia: "Qua", buscas: 52, leads: 24 },
  { dia: "Qui", buscas: 41, leads: 21 },
  { dia: "Sex", buscas: 67, leads: 33 },
  { dia: "Sáb", buscas: 22, leads: 8 },
  { dia: "Dom", buscas: 11, leads: 4 },
];
