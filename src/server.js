import express from 'express';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import connectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import session from './config/session';
import passport from 'passport';
import http from 'http';
import socketio from 'socket.io';
import initSockets from './sockets/index';
//lay thong tin user tu cookie => socket request

import cookieParser from 'cookie-parser';
import configSocketIo from './config/socketio';
const app = express();
//init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);
require('events').EventEmitter.prototype._maxListeners = 30;

//connect to mongo db 
connectDB();
//config session
session.config(app);
configViewEngine(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(connectFlash());
//user cookie parser 
app.use(cookieParser());
//passport 
app.use(passport.initialize());
app.use(passport.session());

initRoutes(app);
//truoc khi socket thi dùng io passport 
configSocketIo(io, cookieParser, session.sessionStore);
initSockets(io);

server.listen(process.env.PORT || 3333, () => {
    console.log(`Ser ver running in PORT ${process.env.PORT}`)
})