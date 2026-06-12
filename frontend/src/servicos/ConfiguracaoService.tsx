export default function atualizarUsuario(
  nome: string,
  email: string,
  telefone: string,
  cidade: string,
  bio: string,
  fotoArquivo?: File | null,
  novaSenha?: string
) {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("nome", nome.trim());
  formData.append("email", email.trim());
  formData.append("telefone", telefone.trim());
  formData.append("cidade", cidade.trim());
  formData.append("bio", bio.trim());

  if (novaSenha && novaSenha.trim()) {
    formData.append("senha", novaSenha.trim());
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
  });
}