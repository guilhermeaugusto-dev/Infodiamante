export function atualizarUsuario(
  nome: string,
  email: string,
  telefone: string,
  fotoArquivo: File | null
) {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("nome", nome);
  formData.append("email", email);
  formData.append("telefone", telefone);

  if (fotoArquivo) {
    formData.append("foto", fotoArquivo);
  }

  return fetch("http://localhost:3000/usuarios/perfil", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Erro ao atualizar usuário");
    }

    return response.json();
  });
}