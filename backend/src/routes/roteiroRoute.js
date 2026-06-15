const express = require("express");

const {
  criarRoteiro,
  listarMeusRoteiros,
  buscarRoteiroPorId,
  deletarRoteiro,
} = require("../controllers/roteiroController");

const { autenticarUsuario } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", autenticarUsuario, criarRoteiro);

router.get("/me", autenticarUsuario, listarMeusRoteiros);

router.get("/:id", autenticarUsuario, buscarRoteiroPorId);

router.delete("/:id", autenticarUsuario, deletarRoteiro);

module.exports = router;