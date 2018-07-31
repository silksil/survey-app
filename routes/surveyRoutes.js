const _ = require('lodash');
const path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')

const Survey = mongoose.model('survey')

module.exports = app => {
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.get('/api/surveys',requireLogin, async (req, res) => {

    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false // no need to send back all the recipients
    });

    console.log(surveys)

    res.send(surveys)

  });

  app.post('/api/survey/webhooks', (req,res) => {

    console.log(req.body)
     // 1. Get the body
    const events = _map(req.body, ({email, url})=> {
      // 2. extract the path from the url (we only care about the last part: api/surveys/:surveyId/yes)
      const pathname = new URL(url).pathname;
      // 3. get only the surveysId and the choice
      const p = new Path('/api/surveys/:surveyId/:choice');
      // 4. return survey id, email and choice, discarding records without surveyId and choice
      const match = p.test(pathname)
      if (match) {
        return { email, surveyId: match.surveyId, choice: match.choice }
      }
      // 5 remove the elements that are undefined
      const compactEvents = _.compact(events) // will only return event objects, not elements that are undefined
      // 6. make sure we the same user can not have multiple votes on the same survey
      const uniqueEvents = _.uniqBy(compactEvents, 'email', surveyId)

      const runQuery = uniqueEvents.forEach(event => {
        Survey.updateOne({
          _id: event.surveyId,
          recipients: {
            $elemMatch: { email: event.email, responded: false} // for every survey, look through recipients and find a subdocument with this criteria
          }
        }, {
          $inc: { [event.choice]: 1}, // find the choice property, get that property (either yes or no) and increment it by 1
          $set: { 'recipients.$.responded': true}, //we want to set set in the survey found, look into recipients, get the right recipients ($ refers to elemMatch), look to their response and set that property to true
          lastResponded: newDate()
        }).exec(); //in order to send it to the database

      })
      res.send({})
    })
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res)=> {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    // Great place to send an email!
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
