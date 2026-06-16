const prisma = require("../services/prisma");

async function criarRoteiro(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const {
      titulo,
      descricao,
      dataInicio,
      dataFim,
      quantidadePessoas,
      orcamento,
      pontos,
    } = req.body;

    if (!titulo) {
      return res.status(400).json({
        mensagem: "Título do roteiro é obrigatório.",
      });
    }

    if (!pontos || !Array.isArray(pontos) || pontos.length === 0) {
      return res.status(400).json({
        mensagem: "Selecione pelo menos um ponto turístico.",
      });
    }

    const roteiro = await prisma.roteiro.create({
      data: {
        usuarioId,
        titulo,
        descricao: descricao || null,
        dataInicio: dataInicio ? new Date(dataInicio) : null,
        dataFim: dataFim ? new Date(dataFim) : null,
        quantidadePessoas: quantidadePessoas ? Number(quantidadePessoas) : 1,
        orcamento: orcamento ? Number(orcamento) : null,
        status: "RASCUNHO",

        pontos: {
          create: pontos.map((ponto, index) => ({
            pontoTuristicoId: Number(ponto.pontoTuristicoId),
            ordemVisita: ponto.ordemVisita
              ? Number(ponto.ordemVisita)
              : index + 1,
            dataVisita: ponto.dataVisita ? new Date(ponto.dataVisita) : null,
            observacoes: ponto.observacoes || null,
          })),
        },
      },
      include: {
        pontos: {
          include: {
            pontoTuristico: {
              include: {
                categoria: true,
                regiao: true,
              },
            },
          },
          orderBy: {
            ordemVisita: "asc",
          },
        },
      },
    });

    return res.status(201).json({
      mensagem: "Roteiro criado com sucesso.",
      roteiro,
    });
  } catch (error) {
    console.log("Erro ao criar roteiro:", error);

    return res.status(500).json({
      mensagem: "Erro ao criar roteiro.",
      erro: error.message,
      codigo: error.code,
    });
  }
}

async function listarMeusRoteiros(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const roteiros = await prisma.roteiro.findMany({
      where: {
        usuarioId,
      },
      include: {
        pontos: {
          include: {
            pontoTuristico: {
              include: {
                categoria: true,
                regiao: true,
              },
            },
          },
          orderBy: {
            ordemVisita: "asc",
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    return res.status(200).json({
      roteiros,
    });
  } catch (error) {
    console.log("Erro ao listar roteiros:", error);

    return res.status(500).json({
      mensagem: "Erro ao listar roteiros.",
      erro: error.message,
    });
  }
}

async function buscarRoteiroPorId(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    const roteiro = await prisma.roteiro.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        pontos: {
          include: {
            pontoTuristico: {
              include: {
                categoria: true,
                regiao: true,
              },
            },
          },
          orderBy: {
            ordemVisita: "asc",
          },
        },
      },
    });

    if (!roteiro) {
      return res.status(404).json({
        mensagem: "Roteiro não encontrado.",
      });
    }

    if (roteiro.usuarioId !== usuarioId && req.usuario.tipo !== "ADMIN") {
      return res.status(403).json({
        mensagem: "Você não tem permissão para acessar este roteiro.",
      });
    }

    return res.status(200).json({
      roteiro,
    });
  } catch (error) {
    console.log("Erro ao buscar roteiro:", error);

    return res.status(500).json({
      mensagem: "Erro ao buscar roteiro.",
      erro: error.message,
    });
  }
}

async function deletarRoteiro(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    const roteiro = await prisma.roteiro.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!roteiro) {
      return res.status(404).json({
        mensagem: "Roteiro não encontrado.",
      });
    }

    if (roteiro.usuarioId !== usuarioId && req.usuario.tipo !== "ADMIN") {
      return res.status(403).json({
        mensagem: "Você não tem permissão para deletar este roteiro.",
      });
    }

    await prisma.pontoDoRoteiro.deleteMany({
      where: {
        roteiroId: Number(id),
      },
    });

    await prisma.roteiro.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      mensagem: "Roteiro removido com sucesso.",
    });
  } catch (error) {
    console.log("Erro ao deletar roteiro:", error);

    return res.status(500).json({
      mensagem: "Erro ao deletar roteiro.",
      erro: error.message,
    });
  }
}

module.exports = {
  criarRoteiro,
  listarMeusRoteiros,
  buscarRoteiroPorId,
  deletarRoteiro,
};