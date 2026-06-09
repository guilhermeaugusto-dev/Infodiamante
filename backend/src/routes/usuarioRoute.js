const express = require("express");

const {
  cadastrarUsuario,
  loginUsuario,
  buscarUsuarioLogado,
  listarUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  deletarUsuario,
} = require("../controllers/usuarioController");

const {
  autenticarUsuario,
  verificarAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/cadastro", cadastrarUsuario);
router.post("/login", loginUsuario);

router.get("/me", autenticarUsuario, buscarUsuarioLogado);

router.get("/", autenticarUsuario, verificarAdmin, listarUsuarios);
router.get("/:id", autenticarUsuario, verificarAdmin, buscarUsuarioPorId);

router.put("/:id", autenticarUsuario, verificarAdmin, atualizarUsuario);

router.delete("/:id", autenticarUsuario, verificarAdmin, deletarUsuario);

module.exports = router;