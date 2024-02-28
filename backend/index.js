const express = require("express");
const app = express();
const mainRouter = require("./routes/index")


app.use("/ap1/v1", mainRouter)