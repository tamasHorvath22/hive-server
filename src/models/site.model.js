const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemas = require('../constants/schemas');

let siteSchema = new Schema({
  name: { type : String },
  creator: { type : String }
}, { timestamps: true });

module.exports = mongoose.model(schemas.SITE, siteSchema);
