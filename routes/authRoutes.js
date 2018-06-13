`use strict`;

const passport = require('passport');

module.exports = (app) => {
  app.get('/auth/google', // the route that initializes getting the user's google profile
    passport.authenticate('google', { // google's strategy is known as 'google'
      scope: ['profile', 'email'] // you are stating here what type of info you want from google
    })
  );

  app.get('/auth/google/callback',
    passport.authenticate('google') //google strategy sees that you have retrieved info through the paramters in the url
  );

  app.get('/api/logout', (req, res) => {
    req.logout(); //logout() is automatically attched to the request object by passport
    res.send(req.user);
  })

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

};
