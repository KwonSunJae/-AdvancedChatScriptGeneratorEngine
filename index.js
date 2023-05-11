const express = require("express");
const app = express();
const router = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
global.logger || (global.logger = require("./modules/winton"));
const db = require("./models");
dotenv.config();
const path = require("path");

app.use(morgan);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

var root = path.resolve(__dirname, '../frontend/build');
app.use(express.static(root));
db.sequelize.sync();
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/apis", router);

app.get('*', (req, res) => { res.sendFile(path.join(root, "index.html")) });
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ status: "failed", message: err.message });
});

module.exports = app;