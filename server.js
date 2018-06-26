const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_CONNECTION;
const connectOptions = {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
};

// Models
require('./models/UrlShorten')

// Express
const app = express();
app.use(bodyParser.json());
const PORT = 7000;

// API
require("./routes/urlshorten")(app);

//Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, connectOptions, (err, db) => {
  if (err) console.log(`Error`, err);
  console.log(`Connected to MongoDB`);
});

// Listen
app.listen(PORT, () => {
  console.log(`Server started on port`, PORT);
});
