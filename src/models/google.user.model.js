const mongoose = require('mongoose');
const schemas = require('../constants/schemas');
const Schema = mongoose.Schema;

let googleUserSchema = new Schema({
  nickname: { type : String },
  firstname: { type : String },
  lastname: { type : String },
  apiaries: { type : Array }
}, { timestamps: true });

module.exports = mongoose.model(schemas.GOOGE_USER, googleUserSchema);
