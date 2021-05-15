import UserModel from './../models/user';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { transError } from './../../lang/vi';
let saltRound = 7;

let register = (email, gender, password) => {
    return new Promise(async (resolve, reject) => {
        let userByEmail = await UserModel.findByEmail(email);
        if (userByEmail) {
            return reject(transError.account_in_use);
        }
        let salt = bcrypt.genSaltSync(saltRound);
        let userItem = {
            username: email.split("@")[0],
            gender: gender,
            local: {
                email: email,
                password: bcrypt.hashSync(password, salt),
                verifyToken: uuidv4()
            }
        }
        let user = await UserModel.createNew(userItem);
        resolve(user);
    })

}
module.exports = {
    register: register
}