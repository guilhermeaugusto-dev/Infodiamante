type DadosPontoTuristico = {
  nome: string;
  descricao: string;
  endereco: string;
  cidade: string;
  estado: string;
  latitude: string;
  longitude: string;
  categoriaId: string;
  regiaoId: string;
  imagemArquivo: File | null;
};

export function cadastrarPontoTuristico(dados: DadosPontoTuristico) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const formData = new FormData();

  formData.append("nome", dados.nome);
  formData.append("descricao", dados.descricao);
  formData.append("endereco", dados.endereco);
  formData.append("cidade", dados.cidade);
  formData.append("estado", dados.estado);
  formData.append("latitude", dados.latitude);
  formData.append("longitude", dados.longitude);
  formData.append("categoriaId", dados.categoriaId);

  if (dados.regiaoId) {
    formData.append("regiaoId", dados.regiaoId);
  }

  if (dados.imagemArquivo) {
    formData.append("imagem", dados.imagemArquivo);
  }

  return fetch("http://localhost:3000/pontos-turisticos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then(async (response) => {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensagem || "Erro ao cadastrar ponto turístico.");
    }

    return data;
  });
}

export async function listarPontosTuristicos() {
  const response = await fetch("http://localhost:3000/pontos-turisticos", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao buscar pontos turísticos.");
  }

  return data.pontos || data;
}
export async function buscarPontoTuristicoPorId(id: number) {
  const response = await fetch(`http://localhost:3000/pontos-turisticos/${id}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao buscar ponto turístico.");
  }

  return data.ponto || data;
}