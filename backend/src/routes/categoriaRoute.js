const express = require("express");
const prisma = require("../services/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    return res.status(200).json({
      categorias,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar categorias.",
      erro: error.message,
    });
  }
});

module.exports = router;