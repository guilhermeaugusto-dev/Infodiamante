require("dotenv").config();

const express = require("express");
const cors = require("cors");

const usuarioRoutes = require("./routes/usuarioRoute");
const pontoTuristicoRoute = require("./routes/pontoTuristicoRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    mensagem: "API funcionando.",
  });
});
app.use("/usuarios", usuarioRoutes);
app.use("/pontos-turisticos", pontoTuristicoRoute);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});