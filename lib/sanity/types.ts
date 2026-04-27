export interface Plano {
  _id: string;
  nome: string;
  slug: { current: string };
  linha: 'amil-facil' | 'amil' | 'amil-one';
  tipo: 'empresarial' | 'individual' | 'familiar';
  cobertura: 'nacional' | 'regional';
  coparticipacao: boolean;
  reembolso: boolean;
  telemedicina: boolean;
  features: string[];
  hospitais_destaque: string[];
  preco_base: number;
  conteudo: unknown[];
  meta_title: string;
  meta_description: string;
  faqs: FAQ[];
}

export interface Cidade {
  _id: string;
  nome: string;
  slug: { current: string };
  estado: string;
  uf: string;
  populacao: number;
  hospitais_amil: Array<{
    nome: string;
    endereco: string;
    tipo: 'hospital' | 'laboratorio' | 'clinica';
  }>;
  tem_espaco_saude: boolean;
  espaco_saude_endereco: string;
  planos_disponiveis: Pick<Plano, 'nome' | 'slug' | 'preco_base'>[];
  conteudo_local: unknown[];
  meta_title: string;
  meta_description: string;
}

export interface BlogPost {
  _id: string;
  titulo: string;
  slug: { current: string };
  categoria: string;
  conteudo: unknown[];
  excerpt: string;
  imagem_destaque: unknown;
  published_at: string;
  meta_title: string;
  meta_description: string;
  faqs: FAQ[];
}

export interface FAQ {
  _id?: string;
  pergunta: string;
  resposta: string | unknown[];
  categoria?: string;
  slug?: { current: string };
}

export interface Lead {
  nome: string;
  whatsapp: string;
  tipo_empresa: 'empresa' | 'mei' | 'familia' | 'individual';
  qtd_vidas: string;
  cidade: string;
  plano_interesse?: string;
  utm_source?: string;
  utm_medium?: string;
}
