`use strict`;

const passport = require ('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose');
const keys = require ('../config/keys')

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  done(null, user.id); // the first argument is related to an error. user.id is not the same as the profile id from google > it's the _id property created by MongooDB
});

passport.deserializeUser((id, done) => { //search over db, and return specific user
  User.findById(id)
  .then(user => {
    done(null, user)
  });
});

passport.use(
  new GoogleStrategy({ // states: hey passport, I want you to know that the google strategy is available and this is the config to set it up.
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  },
    (accessToken, refreshToken, profile, done) => {  //callback that is being called from the google flow
      User.findOne({googleId: profile.id})
      .then(existingUser => {
        if (existingUser) {
          done(null, existingUser) //  first argument is error, second user. Done tells passport that we have finished creating a user and that we can resume the auth process
        } else {
          new User({googleId: profile.id})
            .save() //will take the model instance and save it to the DB
            .then(user => done(null, user));
        }
      });
    }
  )
);
