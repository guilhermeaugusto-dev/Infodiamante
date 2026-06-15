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

export async function criarAgendamentoGuia(dados: DadosAgendamentoGuia) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch("http://localhost:3000/agendamentos-guias", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || data.mensagem || "Erro ao agendar guia.");
  }

  return data;
}

export async function listarAgendamentosDoGuia() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch(
    "http://localhost:3000/agendamentos-guias/guia/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao buscar agendamentos do guia.");
  }

  return data.agendamentos || data;
}

export async function confirmarAgendamentoGuia(id: number) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch(
    `http://localhost:3000/agendamentos-guias/${id}/confirmar`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao confirmar agendamento.");
  }

  return data;
}

export async function cancelarAgendamentoGuia(id: number) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch(
    `http://localhost:3000/agendamentos-guias/${id}/cancelar`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao cancelar agendamento.");
  }

  return data;
}