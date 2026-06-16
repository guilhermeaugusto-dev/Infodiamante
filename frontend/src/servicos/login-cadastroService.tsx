

export async function loginUsuario(email: string, senha: string) {
  const response = await fetch("http://localhost:3000/usuarios/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      senha: senha.trim(),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || data.erro || "Erro ao fazer login");
  }

  return data;
}
export async function cadastrarUsuario(
  nome: string,
  email: string,
  senha: string,
  confirmarSenha: string
) {
  if (senha !== confirmarSenha) {
    throw new Error("As senhas não coincidem");
  }

  const response = await fetch("http://localhost:3000/usuarios/cadastro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome, email, senha, confirmarSenha }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao cadastrar usuário");
  }

  return data;
}