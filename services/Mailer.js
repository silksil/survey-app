const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

// we want to take the Mail class from sendgrid and add additional custumization
// the customization is the sub-class Mailer
class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content ) { // when you use the new keyword, the constructor is automatically being called, you pass arguments to the constructor
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email('no-reply@emaily.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    this.recipients = this.formatAdresses(recipients);

    this.addContent(this.body); //addContent is build in function of Mail class
    this.addClickTracking();
    this.addRecipients();
  }

  formatAdresses(recipients) {
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalize = new helper.Personalization();
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient); // iterate over recipitiens and for each recipient take them and add them to personalize object
    });
    this.addPersonalization(personalize);
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });

    const response = await this.sgApi.API(request); // API function provided by sendgrid
    return response;
  }
}

module.exports = Mailer;
