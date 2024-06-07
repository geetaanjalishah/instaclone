const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
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

app.use("/api/auth", require("./routes/auth"));
app.use("/api/post", require("./routes/post"));
app.use("/api/user", require("./routes/user"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
