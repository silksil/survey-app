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
  __user: { type: Schema.Types.ObjectId, ref: 'user'},
  dateSent: Date,
  lastResponded: Date
  // underscore is not required, but it is convention to indicate it is a reference/relationship field
  // we indicate that is has an type that is the id of the user that owns a record
  // the reference we are making belongs to the user collection
});

mongoose.model('survey', surveySchema);
