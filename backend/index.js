const express = require("express");
const app = express();
const mainRouter = require("./routes/index");
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(3000, function (err) {
    if (err) console.log("Error in server setup");
    console.log("Server is Listenign of Port", 3000);
})