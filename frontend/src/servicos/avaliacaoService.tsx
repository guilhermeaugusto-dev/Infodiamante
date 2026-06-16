export type Avaliacao = {
  id: number;
  usuarioId: number;
  pontoTuristicoId: number;
  nota: number;
  comentario: string;
  criadoEm: string;
  atualizadoEm: string;

  usuario?: {
    id: number;
    nome: string;
    email?: string;
    fotoUrl?: string | null;
  } | null;

  pontoTuristico?: {
    id: number;
    nome: string;
    cidade?: string;
    estado?: string;
    imagemUrl?: string | null;
    categoria?: {
      id: number;
      nome: string;
    } | null;
  } | null;
};

export type DadosCriarAvaliacao = {
  pontoTuristicoId: number;
  nota: number;
  comentario: string;
};

export type DadosAtualizarAvaliacao = {
  nota: number;
  comentario: string;
};

const API_URL = "http://localhost:3000/avaliacoes";

export async function listarAvaliacoes(): Promise<Avaliacao[]> {
  const response = await fetch(API_URL, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || data.erro || "Erro ao listar avaliações.");
  }

  return data.avaliacoes || data;
}
export async function criarAvaliacao(dados: {
  pontoTuristicoId: number;
  nota: number;
  comentario: string;
}) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch("http://localhost:3000/avaliacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao criar avaliação.");
  }

  return data;
}
export async function atualizarAvaliacao(
  id: number,
  dados: DadosAtualizarAvaliacao
) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nota: dados.nota,
      comentario: dados.comentario,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensagem || data.erro || "Erro ao atualizar avaliação."
    );
  }

  return data;
}

export async function deletarAvaliacao(id: number) {
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
    throw new Error(data.mensagem || data.erro || "Erro ao deletar avaliação.");
  }

  return data;
}
export async function listarMinhasAvaliacoes(): Promise<Avaliacao[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch("http://localhost:3000/avaliacoes/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao buscar suas avaliações.");
  }

  return data.avaliacoes || data;
}