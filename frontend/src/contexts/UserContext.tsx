import { createContext, useContext, useState } from "react";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  fotoUrl?: string | null;
  tipo?: string;
  cidade?: string | null;
  bio?: string | null;
  roteiros?: any[];
  avaliacoes?: any[];
  favoritos?: any[];
  agendamentos?: any[];
};

type UserContextType = {
  usuario: Usuario | null;
  setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
  salvarUsuario: (usuario: Usuario) => void;
  carregarUsuario: () => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

function pegarUsuarioSalvo(): Usuario | null {
  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo) {
    return null;
  }

  try {
    return JSON.parse(usuarioSalvo);
  } catch (error) {
    console.log("Erro ao ler usuário salvo:", error);
    localStorage.removeItem("usuario");
    return null;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(pegarUsuarioSalvo);

  function salvarUsuario(usuarioAtualizado: Usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
    setUsuario(usuarioAtualizado);
  }

  async function carregarUsuario() {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem("usuario");
      setUsuario(null);
      return;
    }

    const response = await fetch("http://localhost:3000/usuarios/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      localStorage.clear();
      setUsuario(null);
      throw new Error(data.mensagem || "Erro ao buscar usuário.");
    }

    const usuarioAtualizado = data.usuario || data;

    localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
    setUsuario(usuarioAtualizado);
  }

  function logout() {
    localStorage.clear();
    setUsuario(null);
    window.location.href = "/";
  }

  return (
    <UserContext.Provider
      value={{
        usuario,
        setUsuario,
        salvarUsuario,
        carregarUsuario,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser precisa estar dentro de UserProvider");
  }

  return context;
}