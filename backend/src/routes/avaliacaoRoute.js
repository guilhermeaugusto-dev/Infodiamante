const express = require("express");

const {
  listarAvaliacoes,
  criarAvaliacao,
  atualizarAvaliacao,
  deletarAvaliacao,
  listarMinhasAvaliacoes,
} = require("../controllers/avaliacaoController");

const { autenticarUsuario } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", listarAvaliacoes);

router.get("/me", autenticarUsuario, listarMinhasAvaliacoes);

router.post("/", autenticarUsuario, criarAvaliacao);

router.put("/:id", autenticarUsuario, atualizarAvaliacao);

router.delete("/:id", autenticarUsuario, deletarAvaliacao);

module.exports = router;