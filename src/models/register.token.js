const mongoose = require('mongoose');
const schemas = require('../constants/schemas');
const Schema = mongoose.Schema;

let registerTokenSchema = new Schema({
  apiaryId: { type : String },
  expiresAt: { type : Number }
}, { timestamps: true });

module.exports = mongoose.model(schemas.REGISTER_TOKEN, registerTokenSchema);
