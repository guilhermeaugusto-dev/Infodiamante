export type AgendamentoGuia = {
  id: number;
  usuarioId: number;
  guiaId: number;
  data: string;
  horas: number;
  observacoes?: string | null;
  valorTotal?: string | number | null;
  status: "PENDENTE" | "CONFIRMADO" | "CANCELADO";

  usuario?: {
    id: number;
    nome: string;
    email: string;
    telefone?: string | null;
    cidade?: string | null;
    fotoUrl?: string | null;
  };

  guia?: {
    id: number;
    especialidade: string;
    biografia?: string | null;
    precoPorHora?: string | number | null;
    usuario?: {
      id: number;
      nome: string;
      email: string;
      telefone?: string | null;
      cidade?: string | null;
      fotoUrl?: string | null;
    };
  };
};

export type DadosAgendamentoGuia = {
  guiaId: number;
  data: string;
  horas: string;
  observacoes: string;
};

const API_URL = "http://localhost:3000/agendamentos-guias";

function pegarToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  return token;
}

async function lerResposta(response: Response) {
  const texto = await response.text();

  try {
    return texto ? JSON.parse(texto) : {};
  } catch {
    throw new Error(
      "A resposta do servidor não veio em JSON. Verifique se a rota do backend existe e se o servidor está rodando na porta 3000."
    );
  }
}

export async function criarAgendamentoGuia(dados: DadosAgendamentoGuia) {
  const token = pegarToken();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  const data = await lerResposta(response);

  if (!response.ok) {
    throw new Error(data.erro || data.mensagem || "Erro ao agendar guia.");
  }

  return data;
}

export async function listarMeusAgendamentosGuias(): Promise<AgendamentoGuia[]> {
  const token = pegarToken();

  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await lerResposta(response);

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao buscar seus agendamentos.");
  }

  return data.agendamentos || data;
}

export async function listarAgendamentosDoGuia(): Promise<AgendamentoGuia[]> {
  const token = pegarToken();

  const response = await fetch(`${API_URL}/guia/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await lerResposta(response);

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao buscar agendamentos do guia.");
  }

  return data.agendamentos || data;
}

export async function confirmarAgendamentoGuia(id: number) {
  const token = pegarToken();

  const response = await fetch(`${API_URL}/${id}/confirmar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await lerResposta(response);

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao confirmar agendamento.");
  }

  return data;
}

export async function cancelarAgendamentoGuia(id: number) {
  const token = pegarToken();

  const response = await fetch(`${API_URL}/${id}/cancelar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await lerResposta(response);

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao cancelar agendamento.");
  }

  return data;
}