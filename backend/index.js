const express = require("express");
const rootRouter = require("./api/index");

const app = express();

app.use("/api/v1", rootRouter);