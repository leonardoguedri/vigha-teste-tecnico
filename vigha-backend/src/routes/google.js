const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      const senhaFake = Math.random().toString(36);
      await db.query('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, senhaFake]);
    }

    const [user] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return done(null, user[0]);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

router.get('/', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:4200/login', session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.redirect(`https://vigha-teste-tecnico.vercel.app/login?token=${token}`);
  }
);

module.exports = router;