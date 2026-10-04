const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ================= CONFIG CHECK =================

const isGoogleConfigured =
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'dummy_google_client_id';

const isFacebookConfigured =
    process.env.FACEBOOK_APP_ID &&
    process.env.FACEBOOK_APP_SECRET &&
    process.env.FACEBOOK_APP_ID !== 'dummy_facebook_app_id';

console.log("Google Configured:", isGoogleConfigured);
console.log("Facebook Configured:", isFacebookConfigured);

// ================= GOOGLE STRATEGY =================

if (isGoogleConfigured) {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(new Error("No email found from Google"), null);
                }

                let user = await User.findOne({
                    $or: [
                        { email: email },
                        { googleId: profile.id }
                    ]
                });

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: email,
                        password: await bcrypt.hash(Math.random().toString(36), 10),
                        role: 'student',
                        preferred_language: 'en',
                        total_points: 0,
                        level: 1,
                        current_streak: 0,
                        longest_streak: 0
                    });

                    await user.save();
                }

                return done(null, user);

            } catch (error) {
                return done(error, null);
            }
        }
    ));
}

// ================= FACEBOOK STRATEGY =================

if (isFacebookConfigured) {
    passport.use(new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: '/api/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(new Error('No email found from Facebook'), null);
                }

                let user = await User.findOne({
                    $or: [
                        { email: email },
                        { facebookId: profile.id }
                    ]
                });

                if (!user) {
                    user = new User({
                        facebookId: profile.id,
                        name: profile.displayName,
                        email: email,
                        password: await bcrypt.hash(Math.random().toString(36), 10),
                        role: 'student',
                        preferred_language: 'en',
                        total_points: 0,
                        level: 1
                    });

                    await user.save();
                }

                return done(null, user);

            } catch (error) {
                return done(error, null);
            }
        }
    ));
}

// ================= SESSION HANDLING =================

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;