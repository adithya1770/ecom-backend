const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const data = require('./oauth.json');

const GOOGLE_CLIENT_ID = data.web.client_id;
const GOOGLE_CLIENT_SECRET = data.web.client_secret;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
      try {
          return done(null, profile);
      } catch (err) {
          return done(err);
      }
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
