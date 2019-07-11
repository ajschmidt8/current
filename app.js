const express = require('express');
const app = express();
const mongoose = require('mongoose');
const visits = require('./routes/visits');
const db = mongoose.connection;
const port = process.env.PORT || 3000;
const mongoHost = process.env.MONGO_HOST || 'localhost';

app.use(express.json());
app.use(visits);

mongoose.connect(`mongodb://${mongoHost}/test`, { useNewUrlParser: true });

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(port, () =>
    console.log(`server started @ http://localhost:${port}`),
  );
});
