
# Survey apps
- This App allows you to send out surveys and receive feedback on the survey through email.
- App is build with React-Redux, Node.js and MongoDB.
- App makes use of Google auth to login, SendGrid to send emails and Stripe to add credits to your account.
- The Materialize library is used for styling.
- Notes in relation to this project can be found throughout my [React cheatsheet folder](https://github.com/silksil/best-practices-cheatsheets/tree/master/client/react)

### Visual Representation App
![Survey App](./survey-apps.gif)

### Try it yourself?
`npm install` and include the following variables (requires creating various accounts e.g. Stripe, Google etc.):
- Client => Get stripePublishableKey => include it in `.env.development/production` files
- Server => config dev.js + prod .js => Include googleClientID, googleClientSecret, mongoURI, cookieKey, stripePublishableKey, stripeSecretKey, sendGridKey, redirectDomain

### To-do:
- Improve the design.
- Make it possible to save and update a survey.
- Make an profile page that can be updated.
- Make feedback system more comprehensive e.g. by allowing including comments.
