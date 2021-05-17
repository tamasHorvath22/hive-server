const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemas = require('../constants/schemas');

let hivePostSchema = new Schema({
  spleen: { type : String },
  population: { type : Number },
  spawning: { type : String },
  honey: { type : String },
  comment: { type : String },
  feeding: { type : String },
  diseases: { type : String },
  newQueen: { type : String },
  certification: { type : String },
  creator: { type : String },
}, { timestamps: true });

module.exports = mongoose.model(schemas.HIVE_POST, hivePostSchema);
