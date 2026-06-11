const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },

  filename: function (req, file, callback) {
    const nomeArquivo = Date.now() + "-" + file.originalname;
    callback(null, nomeArquivo);
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, callback) {
    const extensoesPermitidas = /jpeg|jpg|png|webp/;
    const extname = extensoesPermitidas.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype = extensoesPermitidas.test(file.mimetype);

    if (extname && mimetype) {
      callback(null, true);
    } else {
      callback(new Error("Apenas imagens são permitidas."));
    }
  },
});

module.exports = upload;