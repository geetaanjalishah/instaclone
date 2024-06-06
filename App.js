const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000;
const { MONGOURI } = require("./config/keys");

// MongoDB connection
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

// Require models
require("./models/user");
require('./models/post');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
