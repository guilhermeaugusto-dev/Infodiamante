const express = require("express");

const {
  alternarFavorito,
  listarMeusFavoritos,
  verificarFavorito,
} = require("../controllers/favoritoController");

const { autenticarUsuario } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", autenticarUsuario, listarMeusFavoritos);

router.get(
  "/verificar/:pontoTuristicoId",
  autenticarUsuario,
  verificarFavorito
);

router.post(
  "/:pontoTuristicoId",
  autenticarUsuario,
  alternarFavorito
);

module.exports = router;