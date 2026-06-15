const prisma = require("../services/prisma");

async function listarAvaliacoes(req, res) {
  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoUrl: true,
          },
        },
        pontoTuristico: {
          select: {
            id: true,
            nome: true,
            cidade: true,
            estado: true,
            imagemUrl: true,
            categoria: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    return res.status(200).json({
      avaliacoes,
    });
  } catch (error) {
    console.log("Erro ao listar avaliações:", error);

    return res.status(500).json({
      mensagem: "Erro ao listar avaliações.",
      erro: error.message,
    });
  }
}

async function buscarAvaliacaoPorId(req, res) {
  try {
    const { id } = req.params;

    const avaliacao = await prisma.avaliacao.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoUrl: true,
          },
        },
        pontoTuristico: {
          include: {
            categoria: true,
          },
        },
      },
    });

    if (!avaliacao) {
      return res.status(404).json({
        mensagem: "Avaliação não encontrada.",
      });
    }

    return res.status(200).json({
      avaliacao,
    });
  } catch (error) {
    console.log("Erro ao buscar avaliação:", error);

    return res.status(500).json({
      mensagem: "Erro ao buscar avaliação.",
      erro: error.message,
    });
  }
}

async function listarAvaliacoesPorPonto(req, res) {
  try {
    const { pontoTuristicoId } = req.params;

    const avaliacoes = await prisma.avaliacao.findMany({
      where: {
        pontoTuristicoId: Number(pontoTuristicoId),
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoUrl: true,
          },
        },
        pontoTuristico: {
          select: {
            id: true,
            nome: true,
            cidade: true,
            estado: true,
            imagemUrl: true,
            categoria: true,
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    return res.status(200).json({
      avaliacoes,
    });
  } catch (error) {
    console.log("Erro ao listar avaliações do ponto:", error);

    return res.status(500).json({
      mensagem: "Erro ao listar avaliações do ponto turístico.",
      erro: error.message,
    });
  }
}

async function criarAvaliacao(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { pontoTuristicoId, nota, comentario } = req.body;

    if (!pontoTuristicoId || !nota || !comentario) {
      return res.status(400).json({
        mensagem: "Ponto turístico, nota e comentário são obrigatórios.",
      });
    }

    const notaNumero = Number(nota);

    if (Number.isNaN(notaNumero) || notaNumero < 1 || notaNumero > 5) {
      return res.status(400).json({
        mensagem: "A nota deve ser um número entre 1 e 5.",
      });
    }

    const pontoExiste = await prisma.pontoTuristico.findUnique({
      where: {
        id: Number(pontoTuristicoId),
      },
    });

    if (!pontoExiste) {
      return res.status(404).json({
        mensagem: "Ponto turístico não encontrado.",
      });
    }

    const avaliacaoExiste = await prisma.avaliacao.findUnique({
      where: {
        usuarioId_pontoTuristicoId: {
          usuarioId,
          pontoTuristicoId: Number(pontoTuristicoId),
        },
      },
    });

    if (avaliacaoExiste) {
      return res.status(400).json({
        mensagem: "Você já avaliou este ponto turístico.",
      });
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        usuarioId,
        pontoTuristicoId: Number(pontoTuristicoId),
        nota: notaNumero,
        comentario,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoUrl: true,
          },
        },
        pontoTuristico: {
          include: {
            categoria: true,
          },
        },
      },
    });

    return res.status(201).json({
      mensagem: "Avaliação criada com sucesso.",
      avaliacao,
    });
  } catch (error) {
    console.log("Erro ao criar avaliação:", error);

    return res.status(500).json({
      mensagem: "Erro ao criar avaliação.",
      erro: error.message,
      codigo: error.code,
    });
  }
}

async function atualizarAvaliacao(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;
    const { nota, comentario } = req.body;

    const avaliacaoExiste = await prisma.avaliacao.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!avaliacaoExiste) {
      return res.status(404).json({
        mensagem: "Avaliação não encontrada.",
      });
    }

    if (avaliacaoExiste.usuarioId !== usuarioId && req.usuario.tipo !== "ADMIN") {
      return res.status(403).json({
        mensagem: "Você não tem permissão para atualizar esta avaliação.",
      });
    }

    let notaNumero;

    if (nota !== undefined) {
      notaNumero = Number(nota);

      if (Number.isNaN(notaNumero) || notaNumero < 1 || notaNumero > 5) {
        return res.status(400).json({
          mensagem: "A nota deve ser um número entre 1 e 5.",
        });
      }
    }

    const avaliacao = await prisma.avaliacao.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(nota !== undefined && { nota: notaNumero }),
        ...(comentario !== undefined && { comentario }),
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoUrl: true,
          },
        },
        pontoTuristico: {
          include: {
            categoria: true,
          },
        },
      },
    });

    return res.status(200).json({
      mensagem: "Avaliação atualizada com sucesso.",
      avaliacao,
    });
  } catch (error) {
    console.log("Erro ao atualizar avaliação:", error);

    return res.status(500).json({
      mensagem: "Erro ao atualizar avaliação.",
      erro: error.message,
      codigo: error.code,
    });
  }
}

async function deletarAvaliacao(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    const avaliacaoExiste = await prisma.avaliacao.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!avaliacaoExiste) {
      return res.status(404).json({
        mensagem: "Avaliação não encontrada.",
      });
    }

    if (avaliacaoExiste.usuarioId !== usuarioId && req.usuario.tipo !== "ADMIN") {
      return res.status(403).json({
        mensagem: "Você não tem permissão para deletar esta avaliação.",
      });
    }

    await prisma.avaliacao.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      mensagem: "Avaliação removida com sucesso.",
    });
  } catch (error) {
    console.log("Erro ao deletar avaliação:", error);

    return res.status(500).json({
      mensagem: "Erro ao deletar avaliação.",
      erro: error.message,
      codigo: error.code,
    });
  }
}
async function listarMinhasAvaliacoes(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const avaliacoes = await prisma.avaliacao.findMany({
      where: {
        usuarioId,
      },
      include: {
        pontoTuristico: {
          include: {
            categoria: true,
            regiao: true,
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    return res.status(200).json({
      avaliacoes,
    });
  } catch (error) {
    console.log("Erro ao listar minhas avaliações:", error);

    return res.status(500).json({
      mensagem: "Erro ao listar suas avaliações.",
      erro: error.message,
    });
  }
}

module.exports = {
  listarAvaliacoes,
  buscarAvaliacaoPorId,
  listarAvaliacoesPorPonto,
  listarMinhasAvaliacoes,
  criarAvaliacao,
  atualizarAvaliacao,
  deletarAvaliacao,
};