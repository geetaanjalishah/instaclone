const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});
mongoose.connection.on("error", (err) => {
  console.log("error connecting", err);
});

require("./models/user");
require("./models/post");

app.use(express.json());
app.use(cors());

app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/post"));
app.use("/api", require("./routes/user"));

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
