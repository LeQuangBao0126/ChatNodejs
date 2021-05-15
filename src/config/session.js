import session from 'express-session';
import connectMongo from 'connect-mongo';


let uri = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

let mongoStore = connectMongo(session);
//luu session vao db
let sessionStore = new mongoStore({
    url: uri,
    autoReconnect: true,
    autoRemove: "native"
})
let config = (app) => {
    app.use(session({
        key: "express.sid",
        secret: "mySecret",
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    }))
};

module.exports = {
    config,
    sessionStore
};
