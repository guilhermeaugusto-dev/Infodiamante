export type PontoDoRoteiro = {
  id: number;
  roteiroId: number;
  pontoTuristicoId: number;
  ordemVisita: number;
  dataVisita?: string | null;
  observacoes?: string | null;

  pontoTuristico?: {
    id: number;
    nome: string;
    descricao?: string;
    cidade?: string;
    estado?: string;
    imagemUrl?: string | null;
    valorIngresso?: string | number | null;
    acessivel?: boolean;
    categoria?: {
      id: number;
      nome: string;
    } | null;
    regiao?: {
      id: number;
      nome: string;
    } | null;
  };
};

export type Roteiro = {
  id: number;
  usuarioId: number;
  titulo: string;
  descricao?: string | null;
  dataInicio?: string | null;
  dataFim?: string | null;
  quantidadePessoas: number;
  orcamento?: string | number | null;
  status: string;
  criadoEm: string;
  atualizadoEm: string;
  pontos?: PontoDoRoteiro[];
};

export type DadosCriarRoteiro = {
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  quantidadePessoas: number;
  orcamento: string;
  pontos: {
    pontoTuristicoId: number;
    ordemVisita: number;
    dataVisita?: string | null;
    observacoes?: string | null;
  }[];
};

const API_URL = "http://localhost:3000/roteiros";

export async function criarRoteiro(dados: DadosCriarRoteiro) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao criar roteiro.");
  }

  return data;
}

export async function listarMeusRoteiros(): Promise<Roteiro[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao listar seus roteiros.");
  }

  return data.roteiros || data;
}

export async function buscarRoteiroPorId(id: number): Promise<Roteiro> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao buscar roteiro.");
  }

  return data.roteiro || data;
}

export async function deletarRoteiro(id: number) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao deletar roteiro.");
  }

  return data;
}