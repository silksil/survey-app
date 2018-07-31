const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema],
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  _user: { type: Schema.Types.ObjectId, ref: 'user'}, //  indicate that is has an type that is the id of the user that owns a record
  dateSent: Date,
  lastResponded: Date
});

mongoose.model('survey', surveySchema);
