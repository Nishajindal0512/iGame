require("dotenv").config();
const userModel = require("../models/userModel");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const options = {};
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET;
options.passReqToCallback = true;

module.exports = (passport) => {
    passport.use(
        new JWTStrategy(options, (req, jwt_payload, done) => {
            userModel.findById(jwt_payload.id, (error, user) => {
                if (error) {
                    done(error, false);
                } else if (user) {
                    req.user = user;
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        })
    );
};
