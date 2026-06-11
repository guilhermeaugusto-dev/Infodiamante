export function atualizarUsuario(
  nome: string,
  email: string,
  telefone: string,
  cidade: string,
  bio: string,
  fotoArquivo: File | null,
  novaSenha?: string
) {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("nome", nome);
  formData.append("email", email);
  formData.append("telefone", telefone);
  formData.append("cidade", cidade);
  formData.append("bio", bio);

  if (novaSenha) {
    formData.append("senha", novaSenha);
  }

  if (fotoArquivo) {
    formData.append("foto", fotoArquivo);
  }

  return fetch("http://localhost:3000/usuarios/perfil", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then(async (response) => {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensagem || "Erro ao atualizar usuário");
    }

    return data;
  });
}