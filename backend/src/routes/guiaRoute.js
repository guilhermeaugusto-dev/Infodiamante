const express = require("express");

const {
  listarGuias,
  buscarGuiaPorId,
  criarMeuGuia,
  atualizarGuiaAdmin ,
  deletarGuiaAdmin,
  verificarGuia,
} = require("../controllers/guiaController");

const upload = require("../config/upload");

const {
  autenticarUsuario,
  verificarAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", listarGuias);
router.get("/:id", buscarGuiaPorId);

router.post(
  "/me",
  autenticarUsuario,
  upload.single("imagem"),
  criarMeuGuia
);

router.put(
  "/me",
  autenticarUsuario,
  upload.single("imagem"),
  atualizarGuiaAdmin
);

router.delete("/me", autenticarUsuario, deletarGuiaAdmin);

router.patch(
  "/:id/verificar",
  autenticarUsuario,
  verificarAdmin,
  verificarGuia
);

module.exports = router;