const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemas = require('../constants/schemas');

let apiarySchema = new Schema({
  name: { type : String },
  owner: { type : String },
  sites: { type : Array },
  hives: { type : Array },
  collaborators: { type : Array }
}, { timestamps: true });

module.exports = mongoose.model(schemas.APIARY, apiarySchema);
