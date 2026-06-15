const prisma = require("../services/prisma");
async function listarGuias(req, res) {
  try {
    const guias = await prisma.guia.findMany({
      where: {
        disponivel: true,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            cidade: true,
            fotoUrl: true,
            bio: true,
            roteiros: true,
          },
        },
        agendamentos: true,
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    return res.status(200).json({ guias });
  } catch (error) {
    console.log("Erro ao listar guias:", error);

    return res.status(500).json({
      mensagem: "Erro ao listar guias.",
      erro: error.message,
    });
  }
}

async function buscarGuiaPorId(req, res) {
  try {
    const { id } = req.params;

    const guia = await prisma.guia.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            cidade: true,
            fotoUrl: true,
            bio: true,
            roteiros: true,
            avaliacoes: true,
            favoritos: true,
            agendamentos: true,
          },
        },
        agendamentos: true,
      },
    });

    if (!guia) {
      return res.status(404).json({
        mensagem: "Guia não encontrado.",
      });
    }

    return res.status(200).json({ guia });
  } catch (error) {
    console.log("Erro ao buscar guia:", error);

    return res.status(500).json({
      mensagem: "Erro ao buscar guia.",
      erro: error.message,
    });
  }
}
async function criarMeuGuia(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const {
      biografia,
      especialidade,
      idiomas,
      precoPorHora,
      anosExperiencia,
    } = req.body;

    if (!especialidade) {
      return res.status(400).json({
        mensagem: "Especialidade é obrigatória.",
      });
    }

    const guiaExiste = await prisma.guia.findUnique({
      where: {
        usuarioId,
      },
    });

    if (guiaExiste) {
      return res.status(400).json({
        mensagem: "Você já possui cadastro como guia.",
      });
    }

    let imagemUrl = null;

    if (req.file) {
      const imagemBase64 = req.file.buffer.toString("base64");
      imagemUrl = `data:${req.file.mimetype};base64,${imagemBase64}`;
    }

    const guia = await prisma.guia.create({
      data: {
        usuarioId,
        biografia: biografia || null,
        especialidade,
        idiomas: idiomas || null,
        precoPorHora: precoPorHora ? Number(precoPorHora) : null,
        anosExperiencia: anosExperiencia ? Number(anosExperiencia) : null,
        imagemUrl,
        verificado: false,
        disponivel: true,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            cidade: true,
            fotoUrl: true,
            roteiros: true,
          },
        },
      },
    });

    return res.status(201).json({
      mensagem: "Solicitação para ser guia enviada com sucesso.",
      guia,
    });
  } catch (error) {
    console.log("Erro ao criar guia:", error);

    return res.status(500).json({
      mensagem: "Erro ao criar guia.",
      erro: error.message,
    });
  }
}

async function atualizarGuiaAdmin(req, res) {
  try {
    const { id } = req.params;

    const {
      nome,
      email,
      telefone,
      cidade,
      biografia,
      especialidade,
      idiomas,
      precoPorHora,
      anosExperiencia,
      verificado,
      disponivel,
    } = req.body;

    const guiaExiste = await prisma.guia.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!guiaExiste) {
      return res.status(404).json({
        mensagem: "Guia não encontrado.",
      });
    }

    if (email && email !== guiaExiste.email) {
      const emailExiste = await prisma.guia.findUnique({
        where: {
          email,
        },
      });

      if (emailExiste) {
        return res.status(400).json({
          mensagem: "Já existe um guia cadastrado com esse e-mail.",
        });
      }
    }

    let imagemUrl;

    if (req.file) {
      const imagemBase64 = req.file.buffer.toString("base64");
      imagemUrl = `data:${req.file.mimetype};base64,${imagemBase64}`;
    }

    const guiaAtualizado = await prisma.guia.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(nome !== undefined && { nome }),
        ...(email !== undefined && { email: email || null }),
        ...(telefone !== undefined && { telefone: telefone || null }),
        ...(cidade !== undefined && { cidade: cidade || null }),
        ...(biografia !== undefined && { biografia: biografia || null }),
        ...(especialidade !== undefined && { especialidade }),
        ...(idiomas !== undefined && { idiomas: idiomas || null }),
        ...(precoPorHora !== undefined && {
          precoPorHora: precoPorHora ? Number(precoPorHora) : null,
        }),
        ...(anosExperiencia !== undefined && {
          anosExperiencia: anosExperiencia ? Number(anosExperiencia) : null,
        }),
        ...(verificado !== undefined && {
          verificado: verificado === true || verificado === "true",
        }),
        ...(disponivel !== undefined && {
          disponivel: disponivel === true || disponivel === "true",
        }),
        ...(imagemUrl && { imagemUrl }),
      },
    });

    return res.status(200).json({
      mensagem: "Guia atualizado com sucesso.",
      guia: guiaAtualizado,
    });
  } catch (error) {
    console.log("Erro ao atualizar guia:", error);

    return res.status(500).json({
      mensagem: "Erro ao atualizar guia.",
      erro: error.message,
      codigo: error.code,
    });
  }
}

async function deletarGuiaAdmin(req, res) {
  try {
    const { id } = req.params;

    const guiaExiste = await prisma.guia.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!guiaExiste) {
      return res.status(404).json({
        mensagem: "Guia não encontrado.",
      });
    }

    await prisma.guia.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      mensagem: "Guia removido com sucesso.",
    });
  } catch (error) {
    console.log("Erro ao deletar guia:", error);

    return res.status(500).json({
      mensagem: "Erro ao deletar guia.",
      erro: error.message,
      codigo: error.code,
    });
  }
}

async function verificarGuia(req, res) {
  try {
    const { id } = req.params;

    const guia = await prisma.guia.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!guia) {
      return res.status(404).json({
        mensagem: "Guia não encontrado.",
      });
    }

    const guiaAtualizado = await prisma.guia.update({
      where: {
        id: Number(id),
      },
      data: {
        verificado: true,
      },
    });

    return res.status(200).json({
      mensagem: "Guia verificado com sucesso.",
      guia: guiaAtualizado,
    });
  } catch (error) {
    console.log("Erro ao verificar guia:", error);

    return res.status(500).json({
      mensagem: "Erro ao verificar guia.",
      erro: error.message,
    });
  }
}

module.exports = {
  listarGuias,
  buscarGuiaPorId,
  criarMeuGuia,
  atualizarGuiaAdmin,
  deletarGuiaAdmin,
  verificarGuia,
};