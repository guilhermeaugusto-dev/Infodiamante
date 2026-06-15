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
    email: string;
    fotoUrl?: string | null;
  };

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
  };
};

const API_URL = "http://localhost:3000/avaliacoes";

export async function listarAvaliacoes() {
  const response = await fetch(API_URL, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao listar avaliações.");
  }

  return data.avaliacoes || data;
}

export async function criarAvaliacao(
  pontoTuristicoId: number,
  nota: number,
  comentario: string
) {
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
    body: JSON.stringify({
      pontoTuristicoId,
      nota,
      comentario,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao criar avaliação.");
  }

  return data;
}

export async function atualizarAvaliacao(
  id: number,
  nota: number,
  comentario: string
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
      nota,
      comentario,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao atualizar avaliação.");
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
    throw new Error(data.mensagem || "Erro ao deletar avaliação.");
  }

  return data;
}