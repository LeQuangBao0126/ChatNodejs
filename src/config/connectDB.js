import mongoose from 'mongoose';
import blueBird from 'bluebird';

let connectDB = () => {
    mongoose.Promise = blueBird;

    let uri = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    mongoose.connect(uri, {
        useNewUrlParser: true, useUnifiedTopology: true
    }, (err) => {
        if (!err) {
            console.log("Database ready");
        }
    });
}
module.exports = connectDB;