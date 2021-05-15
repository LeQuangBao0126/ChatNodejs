
import { validationResult } from 'express-validator';
import auth from './../services/authService';
import { transSuccess } from './../../lang/vi';
let getLoginRegister = (req, res) => {
    return res.render("auth/master", {
        errors: req.flash("errors"),
        success: req.flash("success")
    });
}
let postRegister = async (req, res) => {
    let errors = validationResult(req).errors;
    let errorArr = [];
    let successArr = []
    if (!errors.length) {
    } else {
        errorArr = errors.map(error => error.msg);
        req.flash("errors", errorArr);
        return res.redirect('/login-register');
    }
    try {
        let user = await auth.register(req.body.email, req.body.gender, req.body.password);
        successArr.push("Đăng kí tài khoản thành công");
        req.flash("success", successArr);
        return res.redirect('/login-register');
    } catch (err) {
        errorArr.push(err);
        req.flash("errors", errorArr);
        return res.redirect('/login-register');
    }
}
let getLogout = (req, res) => {
    req.logout();
    req.flash("success", transSuccess.logout_success);
    return res.redirect('/login-register');
}
let checkLogedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login-register');
    }
    next()
}

module.exports = {
    getLoginRegister,
    postRegister,
    getLogout,
    checkLogedIn
}