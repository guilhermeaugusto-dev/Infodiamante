const express = require("express");

const {
  listarPontosTuristicos,
  buscarPontoTuristicoPorId,
  criarPontoTuristico,
  atualizarPontoTuristico,
  deletarPontoTuristico,
} = require("../controllers/pontoTuristicoController");

const upload = require("../config/upload");

const {
  autenticarUsuario,
  verificarAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", listarPontosTuristicos);
router.get("/:id", buscarPontoTuristicoPorId);

router.post(
  "/",
  autenticarUsuario,
  verificarAdmin,
  upload.single("imagem"),
  criarPontoTuristico
);

router.put(
  "/:id",
  autenticarUsuario,
  verificarAdmin,
  upload.single("imagem"),
  atualizarPontoTuristico
);

router.delete(
  "/:id",
  autenticarUsuario,
  verificarAdmin,
  deletarPontoTuristico
);

module.exports = router;