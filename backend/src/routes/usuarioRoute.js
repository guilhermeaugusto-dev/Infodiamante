const express = require("express");

const {
  cadastrarUsuario,
  loginUsuario,
  buscarUsuarioLogado,
  buscarUsuarioPorId,
  atualizarPerfil,
  deletarUsuario,
} = require("../controllers/usuarioController");
const upload = require("../config/upload");
const {
  autenticarUsuario,
  verificarAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();
router.put("/perfil", autenticarUsuario, upload.single("foto"), atualizarPerfil);
router.post("/cadastro", cadastrarUsuario);
router.post("/login", loginUsuario);
router.get("/me", autenticarUsuario, buscarUsuarioLogado);

router.get("/:id", autenticarUsuario, verificarAdmin, buscarUsuarioPorId);
//router.put("/:id", autenticarUsuario, verificarAdmin, upload.single("foto"), atualizarUsuario);
router.delete("/:id", autenticarUsuario, verificarAdmin, deletarUsuario);

module.exports = router;