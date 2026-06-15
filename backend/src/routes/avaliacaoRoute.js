const express = require("express");

const {
  listarAvaliacoes,
  buscarAvaliacaoPorId,
  listarAvaliacoesPorPonto,
  criarAvaliacao,
  atualizarAvaliacao,
  deletarAvaliacao,
} = require("../controllers/avaliacaoController");

const { autenticarUsuario } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", listarAvaliacoes);

router.get("/ponto/:pontoTuristicoId", listarAvaliacoesPorPonto);

router.get("/:id", buscarAvaliacaoPorId);

router.post("/", autenticarUsuario, criarAvaliacao);

router.put("/:id", autenticarUsuario, atualizarAvaliacao);

router.delete("/:id", autenticarUsuario, deletarAvaliacao);

module.exports = router;