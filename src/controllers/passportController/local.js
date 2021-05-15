import passport from 'passport';
import passportLocal from 'passport-local';
import UserModel from './../../models/user';
import { transSuccess, transError } from './../../../lang/vi';
import ChatGroupModel from './../../models/chatGroup';
let localStrategy = passportLocal.Strategy

let initPassportLocal = () => {
    passport.use(new localStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            let user = await UserModel.findByEmail(email);
            if (!user) {
                return done(null, false, req.flash("errors", "Sai tài khoản hoặc mật khẩu"));
            }
            //compare password 
            let isMatchingPassword = await user.comparePassword(password);
            if (!isMatchingPassword) return done(null, false, req.flash("errors", "Sai tài khoản hoặc mật khẩu"));
            return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
        } catch (err) {
            console.log("lỗi passport local", err);
            done(null, false, request.flash("errors", transError.server_error));
        }
    }));
    //ghi info user vao trong session sau khi done();
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await UserModel.findUserById(id);
            let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);
            user = user.toObject();
            user.chatGroupIds = getChatGroupIds;
            done(null, user)
        } catch (err) {
            done(err, null)
        }
    });
}
module.exports = initPassportLocal;