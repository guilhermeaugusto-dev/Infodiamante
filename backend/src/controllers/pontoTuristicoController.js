const prisma = require("../services/prisma");

async function listarPontosTuristicos(req, res) {
  try {
    const pontos = await prisma.pontoTuristico.findMany({
      where: {
        ativo: true,
      },
      include: {
        categoria: true,
        regiao: true,
        avaliacoes: true,
        favoritos: true,
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    return res.status(200).json({
      pontos,
    });
  } catch (error) {
    console.log("Erro ao listar pontos turísticos:", error);

    return res.status(500).json({
      mensagem: "Erro ao listar pontos turísticos.",
      erro: error.message,
    });
  }
}

async function buscarPontoTuristicoPorId(req, res) {
  try {
    const { id } = req.params;

    const ponto = await prisma.pontoTuristico.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        categoria: true,
        regiao: true,
        avaliacoes: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                fotoUrl: true,
              },
            },
          },
        },
        favoritos: true,
        pontosDoRoteiro: true,
      },
    });

    if (!ponto) {
      return res.status(404).json({
        mensagem: "Ponto turístico não encontrado.",
      });
    }

    return res.status(200).json({
      ponto,
    });
  } catch (error) {
    console.log("Erro ao buscar ponto turístico:", error);

    return res.status(500).json({
      mensagem: "Erro ao buscar ponto turístico.",
      erro: error.message,
    });
  }
}

async function criarPontoTuristico(req, res) {
  try {
    const {
      nome,
      descricao,
      endereco,
      cidade,
      estado,
      latitude,
      longitude,
      categoriaId,
      regiaoId,
    } = req.body;

    if (!nome || !descricao || !cidade || !estado || !categoriaId) {
      return res.status(400).json({
        mensagem:
          "Nome, descrição, cidade, estado e categoria são obrigatórios.",
      });
    }

    let imagemUrl = req.body.imagemUrl || null;

    if (req.file) {
      imagemUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    const ponto = await prisma.pontoTuristico.create({
      data: {
        nome,
        descricao,
        endereco: endereco || null,
        cidade,
        estado,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        imagemUrl,
        categoriaId: Number(categoriaId),
        regiaoId: regiaoId ? Number(regiaoId) : null,
      },
      include: {
        categoria: true,
        regiao: true,
      },
    });

    return res.status(201).json({
      mensagem: "Ponto turístico criado com sucesso.",
      ponto,
    });
  } catch (error) {
    console.log("Erro ao criar ponto turístico:", error);

    return res.status(500).json({
      mensagem: "Erro ao criar ponto turístico.",
      erro: error.message,
    });
  }
}

async function atualizarPontoTuristico(req, res) {
  try {
    const { id } = req.params;

    const {
      nome,
      descricao,
      endereco,
      cidade,
      estado,
      latitude,
      longitude,
      imagemUrl,
      ativo,
      categoriaId,
      regiaoId,
    } = req.body;

    const pontoExiste = await prisma.pontoTuristico.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!pontoExiste) {
      return res.status(404).json({
        mensagem: "Ponto turístico não encontrado.",
      });
    }

    let novaImagemUrl = imagemUrl;

    if (req.file) {
      novaImagemUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    const pontoAtualizado = await prisma.pontoTuristico.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(nome !== undefined && { nome }),
        ...(descricao !== undefined && { descricao }),
        ...(endereco !== undefined && { endereco: endereco || null }),
        ...(cidade !== undefined && { cidade }),
        ...(estado !== undefined && { estado }),
        ...(latitude !== undefined && {
          latitude: latitude ? Number(latitude) : null,
        }),
        ...(longitude !== undefined && {
          longitude: longitude ? Number(longitude) : null,
        }),
        ...(novaImagemUrl !== undefined && { imagemUrl: novaImagemUrl }),
        ...(ativo !== undefined && { ativo: ativo === "true" || ativo === true }),
        ...(categoriaId !== undefined && { categoriaId: Number(categoriaId) }),
        ...(regiaoId !== undefined && {
          regiaoId: regiaoId ? Number(regiaoId) : null,
        }),
      },
      include: {
        categoria: true,
        regiao: true,
      },
    });

    return res.status(200).json({
      mensagem: "Ponto turístico atualizado com sucesso.",
      ponto: pontoAtualizado,
    });
  } catch (error) {
    console.log("Erro ao atualizar ponto turístico:", error);

    return res.status(500).json({
      mensagem: "Erro ao atualizar ponto turístico.",
      erro: error.message,
    });
  }
}

async function deletarPontoTuristico(req, res) {
  try {
    const { id } = req.params;

    const pontoExiste = await prisma.pontoTuristico.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!pontoExiste) {
      return res.status(404).json({
        mensagem: "Ponto turístico não encontrado.",
      });
    }

    await prisma.pontoTuristico.update({
      where: {
        id: Number(id),
      },
      data: {
        ativo: false,
      },
    });

    return res.status(200).json({
      mensagem: "Ponto turístico removido com sucesso.",
    });
  } catch (error) {
    console.log("Erro ao deletar ponto turístico:", error);

    return res.status(500).json({
      mensagem: "Erro ao deletar ponto turístico.",
      erro: error.message,
    });
  }
}

module.exports = {
  listarPontosTuristicos,
  buscarPontoTuristicoPorId,
  criarPontoTuristico,
  atualizarPontoTuristico,
  deletarPontoTuristico,
};