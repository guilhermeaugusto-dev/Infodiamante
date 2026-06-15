const express = require("express");

const {
  criarAgendamentoGuia,
  listarMeusAgendamentosGuias,
  listarAgendamentosDoGuia,
  cancelarAgendamentoGuia,
  confirmarAgendamentoGuia,
} = require("../controllers/agendamentoGuiaController");
const {
  autenticarUsuario,
  verificarGuia,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", autenticarUsuario, verificarGuia, criarAgendamentoGuia);

router.get("/me", autenticarUsuario, verificarGuia, listarMeusAgendamentosGuias);

router.get("/guia/me", autenticarUsuario, verificarGuia, listarAgendamentosDoGuia);

router.patch("/:id/confirmar", autenticarUsuario, verificarGuia, confirmarAgendamentoGuia);

router.patch("/:id/cancelar", autenticarUsuario, verificarGuia, cancelarAgendamentoGuia);

module.exports = router;