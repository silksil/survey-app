const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')

const Survey = mongoose.model('survey')

module.exports = (app) => {
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.get('/api/surveys',requireLogin, async (req, res) => {

    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false // no need to send back all the recipients
    });

    res.send(surveys)

  });


  /*
  We want to extract data that:
  1.) has the property `event: "click" ,
  2.) has a correct URL
  3.) is not a duplicate (in case somebody clicks twice)

  URL contains surveyId and choice(yes or no)
  Email is used to identify the correct user
  */
  app.post('/api/survey/webhooks', async (req,res) => {
    console.log("jo")
    const path =  new Path('/api/surveys/:surveyId/:choice');

    const events = req.body.map(({ email, url }) => {
      const pathname = new URL(url).pathname; // Extract the path from the url (we only care about: api/surveys/:surveyId/yes)
      const match = path.test(pathname) // Get records with surveyId and choice. Other documents are disgarded and will return undefined
      if (match) {
        return { email, surveyId: match.surveyId, choice: match.choice }
      }
    });

    const compactEvents = _.compact(events); // Remove records that are undefined
    const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId') // Remove duplicate records

    uniqueEvents.forEach(({ surveyId, email, choice }) => {
      Survey.updateOne(
        {
          _id: surveyId,
          recipients: {
            $elemMatch: { email: email, responded: false }
          }
        },
        {
          $inc: { [choice]: 1 },
          $set: { 'recipients.$.responded': true },
          lastResponded: new Date()
        }
      ).exec()
    })
    res.send({})
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
