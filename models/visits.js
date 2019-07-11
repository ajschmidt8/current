const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  name: String,
  userId: String,
});

module.exports = mongoose.model('Visit', visitSchema);
