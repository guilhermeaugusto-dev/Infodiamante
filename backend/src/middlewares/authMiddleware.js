const jwt = require("jsonwebtoken");
const prisma = require("../services/prisma");

async function autenticarUsuario(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        mensagem: "Token não informado.",
      });
    }

    const [tipo, token] = authHeader.split(" ");

    if (tipo !== "Bearer" || !token) {
      return res.status(401).json({
        mensagem: "Token mal formatado.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: decoded.id,
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

    if (!usuario) {
      return res.status(401).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
}

function verificarAdmin(req, res, next) {
  if (req.usuario.tipo !== "ADMIN") {
    return res.status(403).json({
      mensagem: "Acesso negado. Apenas administradores.",
    });
  }

  next();
}

module.exports = {
  autenticarUsuario,
  verificarAdmin,
};