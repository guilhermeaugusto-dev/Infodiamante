require("dotenv").config();

const express = require("express");
const cors = require("cors");

const usuarioRoutes = require("./routes/usuarioRoute");
const pontoTuristicoRoute = require("./routes/pontoTuristicoRoute");
const guiaRoute = require("./routes/guiaRoute");
const avaliacaoRoute = require("./routes/avaliacaoRoute");
const favoritoRoute = require("./routes/favoritoRoute");
const agendamentoGuiaRoute = require("./routes/agendamentoGuiaRoute");
const roteiroRoute = require("./routes/roteiroRoute");
const categoriaRoute = require("./routes/categoriaRoute");
const app = express();


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    mensagem: "API funcionando.",
  });
});
app.use("/usuarios", usuarioRoutes);
app.use("/favoritos", favoritoRoute);
app.use("/pontos-turisticos", pontoTuristicoRoute);
app.use("/uploads", express.static("uploads"));
app.use("/guias", guiaRoute);
app.use("/agendamentos-guias", agendamentoGuiaRoute);
app.use("/roteiros", roteiroRoute);
app.use("/avaliacoes", avaliacaoRoute);
app.use("/categorias", categoriaRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});