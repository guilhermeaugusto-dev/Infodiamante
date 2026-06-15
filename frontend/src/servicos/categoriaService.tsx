export type Categoria = {
  id: number;
  nome: string;
  cor?: string | null;
};

const API_URL = "http://localhost:3000/categorias";

export async function listarCategorias(): Promise<Categoria[]> {
  const response = await fetch(API_URL, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao listar categorias.");
  }

  return data.categorias || data;
}