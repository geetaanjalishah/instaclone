const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000;
const { MONGOURI } = require("./config/keys");

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to mango");
});

mongoose.connection.on("error", (err) => {
  console.log("error connecting", err);
});

require("./models/user");
require('./models/post')

app.use(express.json());
app.use(cors());

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));


// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   const path = require("path");
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
