import passportSocketIo from 'passport.socketio';
let configSocketIo = (io, cookieParser, sessionStore) => {
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: "express.sid",
        secret: "mySecret",
        store: sessionStore
    }))
}
module.exports = configSocketIo