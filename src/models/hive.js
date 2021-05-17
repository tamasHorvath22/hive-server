const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemas = require('../constants/schemas');

let hiveSchema = new Schema({
  number: { type : Number },
  creator: { type : String },
  posts: { type : Array },
  site: { type : String },
}, { timestamps: true });

module.exports = mongoose.model(schemas.HIVE, hiveSchema);
