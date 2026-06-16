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

router.post("/", autenticarUsuario, criarAgendamentoGuia);


router.get("/me", autenticarUsuario, listarMeusAgendamentosGuias);


router.get(
  "/guia/me",
  autenticarUsuario,
  verificarGuia,
  listarAgendamentosDoGuia
);


router.patch(
  "/:id/confirmar",
  autenticarUsuario,
  verificarGuia,
  confirmarAgendamentoGuia
);


router.patch("/:id/cancelar", autenticarUsuario, cancelarAgendamentoGuia);

module.exports = router;