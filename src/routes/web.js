require('dotenv').config();
import express from 'express';
import { home, auth, user, contact, notification, message, groupChat } from './../controllers/index';
import { authValidate, messageValidate } from './../validation/index';
import initPassportLocal from './../controllers/passportController/local';
import passport from 'passport';
initPassportLocal();
const router = express.Router();

const initRoutes = (app) => {
    router.get("/", auth.checkLogedIn, home.getHome);
    router.get("/login-register", auth.getLoginRegister);
    router.post('/register', authValidate.register, auth.postRegister);

    router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login-register",
        successFlash: true,
        failureFlash: true
    }));
    router.get("/logout", auth.getLogout);
    router.put("/user/update-avatar", auth.checkLogedIn, user.updateAvatar);
    router.put("/user/update-info", auth.checkLogedIn, user.updateInfo);
    router.put("/user/update-password", auth.checkLogedIn, user.updatePassword);

    router.get("/contact/find-users/:keyword", auth.checkLogedIn, contact.findUsersContact);
    router.post("/contact/add-new", auth.checkLogedIn, contact.addNew);
    router.delete("/contact/remove-request-contact-sent", auth.checkLogedIn, contact.removeRequestContactSent);
    router.get("/notification/readMore", auth.checkLogedIn, notification.readMore);
    router.post("/notification/mark-all-as-read", auth.checkLogedIn, notification.markAllAsRead);
    router.delete("/contact/remove-request-contact-received", auth.checkLogedIn, contact.removeRequestContactReceived);
    router.post("/contact/approve-request-contact-received", auth.checkLogedIn, contact.approveRequestContactReceived)
    router.delete("/contact/remove-contact", auth.checkLogedIn, contact.removeContact);

    router.post("/message/add-new-text-emoji", auth.checkLogedIn, messageValidate.checkMessageLength,
        message.addNewMessage);
    router.post("/message/add-new-image", auth.checkLogedIn, message.addNewImage);
    router.post("/message/add-new-attachment", auth.checkLogedIn, message.addNewAttachment);
    router.get("/contact/search-friends/:keyword", auth.checkLogedIn, contact.searchFriends);
    router.post("/group-chat/add-new", auth.checkLogedIn, groupChat.addNewGroup);
    router.get("/message/read-more", auth.checkLogedIn, message.readMore);
    return app.use("/", router);
}
module.exports = initRoutes;