const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const Knex = require("knex");
const Model = require("objection").Model;
const knexConfig = require("./knexfile");

const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);
Model.knex(knex);

app.use(bodyParser.json());
app.use("/members", require("./controllers/members"));
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(process.env.PORT || 5000, function() {
  console.log("App is listening on port " + (process.env.PORT || 5000));
});
