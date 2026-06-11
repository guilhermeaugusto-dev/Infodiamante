export function buscarUsuarioLogado() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token não encontrado.");
  }

  return fetch("http://localhost:3000/usuarios/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (response) => {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensagem || "Erro ao buscar usuário logado.");
    }

    return data;
  });
}