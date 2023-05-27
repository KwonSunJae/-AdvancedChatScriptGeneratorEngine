const express = require("express");
const app = express();
const router = require("./routes");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
global.logger || (global.logger = require("./modules/winton"));
const db = require("./models");
dotenv.config();
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db.sequelize.sync();
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/apis", router);

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ status: "failed", message: err.message });
});

app.listen(3000, () => {
    console.log(`server is listening at localhost:${process.env.PORT}`);
});

module.exports = app;