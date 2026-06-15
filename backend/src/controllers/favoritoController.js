const prisma = require("../services/prisma");

async function alternarFavorito(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { pontoTuristicoId } = req.params;

    const pontoId = Number(pontoTuristicoId);

    if (Number.isNaN(pontoId)) {
      return res.status(400).json({
        mensagem: "ID do ponto turístico inválido.",
      });
    }

    const pontoExiste = await prisma.pontoTuristico.findUnique({
      where: {
        id: pontoId,
      },
    });

    if (!pontoExiste) {
      return res.status(404).json({
        mensagem: "Ponto turístico não encontrado.",
      });
    }

    const favoritoExiste = await prisma.favorito.findUnique({
      where: {
        usuarioId_pontoTuristicoId: {
          usuarioId,
          pontoTuristicoId: pontoId,
        },
      },
    });

    if (favoritoExiste) {
      await prisma.favorito.delete({
        where: {
          id: favoritoExiste.id,
        },
      });

      return res.status(200).json({
        mensagem: "Ponto removido dos favoritos.",
        favoritado: false,
      });
    }

    const favorito = await prisma.favorito.create({
      data: {
        usuarioId,
        pontoTuristicoId: pontoId,
      },
      include: {
        pontoTuristico: true,
      },
    });

    return res.status(201).json({
      mensagem: "Ponto adicionado aos favoritos.",
      favoritado: true,
      favorito,
    });
  } catch (error) {
    console.log("Erro ao alternar favorito:", error);

    return res.status(500).json({
      mensagem: "Erro ao favoritar ponto turístico.",
      erro: error.message,
    });
  }
}

async function listarMeusFavoritos(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const favoritos = await prisma.favorito.findMany({
      where: {
        usuarioId,
      },
      include: {
        pontoTuristico: {
          include: {
            categoria: true,
            regiao: true,
            avaliacoes: true,
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    return res.status(200).json({
      favoritos,
    });
  } catch (error) {
    console.log("Erro ao listar favoritos:", error);

    return res.status(500).json({
      mensagem: "Erro ao listar favoritos.",
      erro: error.message,
    });
  }
}

async function verificarFavorito(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { pontoTuristicoId } = req.params;

    const favorito = await prisma.favorito.findUnique({
      where: {
        usuarioId_pontoTuristicoId: {
          usuarioId,
          pontoTuristicoId: Number(pontoTuristicoId),
        },
      },
    });

    return res.status(200).json({
      favoritado: !!favorito,
    });
  } catch (error) {
    console.log("Erro ao verificar favorito:", error);

    return res.status(500).json({
      mensagem: "Erro ao verificar favorito.",
      erro: error.message,
    });
  }
}

module.exports = {
  alternarFavorito,
  listarMeusFavoritos,
  verificarFavorito,
};