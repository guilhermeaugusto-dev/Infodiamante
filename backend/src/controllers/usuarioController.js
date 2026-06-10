const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../services/prisma");

const SALT_ROUNDS = 10;

function gerarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      tipo: usuario.tipo,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    }
  );
}

async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha, confirmarSenha } = req.body;
    if (senha !== confirmarSenha) {
      return res.status(400).json({
        error: "As senhas não coincidem.",
      });
    }
    if (!nome || !email || !senha) {
      return res.status(400).json({
        error: "Nome, e-mail e senha são obrigatórios.",
      });
    }

    if (senha.length < 8) {
      return res.status(400).json({
        error: "A senha precisa ter pelo menos 8 caracteres.",
      });
    }

    const usuarioExiste = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExiste) {
      return res.status(409).json({
        error: "Este e-mail já está cadastrado.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, SALT_ROUNDS);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        tipo: "USUARIO",
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        criadoEm: true,
        atualizadoEm: true,
      },
    });

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao cadastrar usuário.",
    });
  }
}

async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: "E-mail e senha são obrigatórios.",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return res.status(401).json({
        error: "E-mail ou senha inválidos.",
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({
        error: "E-mail ou senha inválidos.",
      });
    }

    const token = gerarToken(usuario);

    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        criadoEm: usuario.criadoEm,
        atualizadoEm: usuario.atualizadoEm,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao fazer login.",
    });
  }
}

async function buscarUsuarioLogado(req, res) {
  return res.status(200).json(req.usuario);
}


async function buscarUsuarioPorId(req, res) {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        fotoUrl: true,
        tipo: true,
        criadoEm: true,
        atualizadoEm: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        error: "Usuário não encontrado.",
      });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao buscar usuário.",
    });
  }
}

async function atualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nome   } = req.body;

    const usuarioId = Number(id);

    if (req.usuario.id !== usuarioId && req.usuario.tipo !== "ADMIN") {
      return res.status(403).json({
        error: "Você só pode atualizar sua própria conta.",
      });
    }

    const usuarioExiste = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuarioExiste) {
      return res.status(404).json({
        error: "Usuário não encontrado.",
      });
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        nome,
        telefone,
        fotoUrl,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        fotoUrl: true,
        tipo: true,
        criadoEm: true,
        atualizadoEm: true,
      },
    });

    return res.status(200).json({
      mensagem: "Usuário atualizado com sucesso.",
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao atualizar usuário.",
    });
  }
}

async function deletarUsuario(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = Number(id);

    const usuarioExiste = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuarioExiste) {
      return res.status(404).json({
        error: "Usuário não encontrado.",
      });
    }

    await prisma.usuario.delete({
      where: { id: usuarioId },
    });

    return res.status(200).json({
      mensagem: "Usuário deletado com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao deletar usuário.",
    });
  }
}

module.exports = {
  cadastrarUsuario,
  loginUsuario,
  buscarUsuarioLogado,
  buscarUsuarioPorId,
  atualizarUsuario,
  deletarUsuario,
};