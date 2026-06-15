const prisma = require("../services/prisma");

async function criarAgendamentoGuia(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const { guiaId, data, horas, observacoes } = req.body;

    if (!guiaId || !data || !horas) {
      return res.status(400).json({
        mensagem: "Guia, data e quantidade de horas são obrigatórios.",
      });
    }

    const guia = await prisma.guia.findUnique({
      where: {
        id: Number(guiaId),
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
          },
        },
      },
    });

    if (!guia) {
      return res.status(404).json({
        mensagem: "Guia não encontrado.",
      });
    }

    if (!guia.disponivel) {
      return res.status(400).json({
        mensagem: "Este guia não está disponível para agendamento.",
      });
    }

    const horasNumero = Number(horas);

    if (Number.isNaN(horasNumero) || horasNumero <= 0) {
      return res.status(400).json({
        mensagem: "A quantidade de horas deve ser maior que zero.",
      });
    }

    let valorTotal = null;

    if (guia.precoPorHora) {
      valorTotal = Number(guia.precoPorHora) * horasNumero;
    }

    const agendamento = await prisma.agendamentoGuia.create({
      data: {
        usuarioId,
        guiaId: Number(guiaId),
        data: new Date(data),
        horas: horasNumero,
        observacoes: observacoes || null,
        valorTotal,
        status: "PENDENTE",
      },
      include: {
        guia: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                cidade: true,
                fotoUrl: true,
              },
            },
          },
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
      },
    });

    return res.status(201).json({
      mensagem: "Agendamento solicitado com sucesso.",
      agendamento,
    });
  } catch (error) {
    console.log("Erro ao criar agendamento com guia:", error);

    return res.status(500).json({
      mensagem: "Erro ao criar agendamento com guia.",
      erro: error.message,
      codigo: error.code,
    });
  }
}

async function listarMeusAgendamentosGuias(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const agendamentos = await prisma.agendamentoGuia.findMany({
      where: {
        usuarioId,
      },
      include: {
        guia: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                cidade: true,
                fotoUrl: true,
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
      agendamentos,
    });
  } catch (error) {
    console.log("Erro ao listar agendamentos:", error);

    return res.status(500).json({
      mensagem: "Erro ao listar agendamentos.",
      erro: error.message,
    });
  }
}

async function cancelarAgendamentoGuia(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    const agendamento = await prisma.agendamentoGuia.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!agendamento) {
      return res.status(404).json({
        mensagem: "Agendamento não encontrado.",
      });
    }

    if (agendamento.usuarioId !== usuarioId && req.usuario.tipo !== "ADMIN") {
      return res.status(403).json({
        mensagem: "Você não tem permissão para cancelar este agendamento.",
      });
    }

    const agendamentoAtualizado = await prisma.agendamentoGuia.update({
      where: {
        id: Number(id),
      },
      data: {
        status: "CANCELADO",
      },
    });

    return res.status(200).json({
      mensagem: "Agendamento cancelado com sucesso.",
      agendamento: agendamentoAtualizado,
    });
  } catch (error) {
    console.log("Erro ao cancelar agendamento:", error);

    return res.status(500).json({
      mensagem: "Erro ao cancelar agendamento.",
      erro: error.message,
    });
  }
}
async function listarAgendamentosDoGuia(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const guia = await prisma.guia.findUnique({
      where: {
        usuarioId,
      },
    });

    if (!guia) {
      return res.status(404).json({
        mensagem: "Você não possui cadastro como guia.",
      });
    }

    const agendamentos = await prisma.agendamentoGuia.findMany({
      where: {
        guiaId: guia.id,
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
          },
        },
        guia: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                cidade: true,
                fotoUrl: true,
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
      agendamentos,
    });
  } catch (error) {
    console.log("Erro ao listar agendamentos do guia:", error);

    return res.status(500).json({
      mensagem: "Erro ao listar agendamentos do guia.",
      erro: error.message,
    });
  }
}

async function confirmarAgendamentoGuia(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    const guia = await prisma.guia.findUnique({
      where: {
        usuarioId,
      },
    });

    if (!guia) {
      return res.status(404).json({
        mensagem: "Você não possui cadastro como guia.",
      });
    }

    const agendamento = await prisma.agendamentoGuia.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!agendamento) {
      return res.status(404).json({
        mensagem: "Agendamento não encontrado.",
      });
    }

    if (agendamento.guiaId !== guia.id) {
      return res.status(403).json({
        mensagem: "Você não tem permissão para confirmar este agendamento.",
      });
    }

    const agendamentoAtualizado = await prisma.agendamentoGuia.update({
      where: {
        id: Number(id),
      },
      data: {
        status: "CONFIRMADO",
      },
    });

    return res.status(200).json({
      mensagem: "Agendamento confirmado com sucesso.",
      agendamento: agendamentoAtualizado,
    });
  } catch (error) {
    console.log("Erro ao confirmar agendamento:", error);

    return res.status(500).json({
      mensagem: "Erro ao confirmar agendamento.",
      erro: error.message,
    });
  }
}
module.exports = {
  criarAgendamentoGuia,
  listarMeusAgendamentosGuias,
  cancelarAgendamentoGuia,
  listarAgendamentosDoGuia,
  confirmarAgendamentoGuia,
};