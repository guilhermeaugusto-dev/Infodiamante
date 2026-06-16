export async function alternarFavorito(pontoTuristicoId: number) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch(
    `http://localhost:3000/favoritos/${pontoTuristicoId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao favoritar ponto turístico.");
  }

  return data;
}

export async function verificarFavorito(pontoTuristicoId: number) {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  const response = await fetch(
    `http://localhost:3000/favoritos/verificar/${pontoTuristicoId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return false;
  }

  return data.favoritado;
}

export async function listarMeusFavoritos() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não está logado.");
  }

  const response = await fetch("http://localhost:3000/favoritos/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao buscar favoritos.");
  }

  return data.favoritos || data;
}