export type Guia = {
  id: number;
  usuarioId: number;
  biografia?: string | null;
  especialidade: string;
  idiomas?: string | null;
  precoPorHora?: string | number | null;
  anosExperiencia?: number | null;
  verificado: boolean;
  disponivel: boolean;
  imagemUrl?: string | null;
  criadoEm?: string;
  atualizadoEm?: string;

  usuario?: {
    id: number;
    nome: string;
    email: string;
    telefone?: string | null;
    cidade?: string | null;
    fotoUrl?: string | null;
    bio?: string | null;
    roteiros?: any[];
    avaliacoes?: any[];
    favoritos?: any[];
    agendamentos?: any[];
  };

  agendamentos?: any[];
};
export type DadosSejaGuia = {
  biografia: string;
  especialidade: string;
  idiomas: string;
  precoPorHora: string;
  anosExperiencia: string;
  imagemArquivo: File | null;
};
export type DadosCadastroGuiaAdmin = {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  biografia: string;
  especialidade: string;
  idiomas: string;
  precoPorHora: string;
  anosExperiencia: string;
  imagemArquivo: File | null;
};
const API_URL = "http://localhost:3000/guias";

export async function listarGuias() {
  const response = await fetch(API_URL, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao buscar guias.");
  }

  return data.guias || data;
}

export async function buscarGuiaPorId(id: number) {
  const response = await fetch(`http://localhost:3000/guias/${id}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao buscar guia.");
  }

  return data.guia || data;
}
export async function cadastrarMeuGuia(dados: DadosSejaGuia) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const formData = new FormData();

  formData.append("biografia", dados.biografia);
  formData.append("especialidade", dados.especialidade);
  formData.append("idiomas", dados.idiomas);
  formData.append("precoPorHora", dados.precoPorHora);
  formData.append("anosExperiencia", dados.anosExperiencia);

  if (dados.imagemArquivo) {
    formData.append("imagem", dados.imagemArquivo);
  }

  const response = await fetch("http://localhost:3000/guias/me", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const texto = await response.text();
    console.log("Resposta não JSON:", texto);
    throw new Error(`Erro no backend. Status ${response.status}`);
  }

  const data = await response.json();

  if (!response.ok) {
    console.log("Erro completo do backend:", data);
    throw new Error(data.erro || data.mensagem || "Erro ao cadastrar guia.");
  }

  return data;
}