import UserModel from './../models/user';
import bcrypt from 'bcrypt';

let updateUser = (userId, item) => {
    return UserModel.updateUser(userId, item);
}
let updateInfo = async (userInfo, userId) => {
    let userFind = await UserModel.findOne({ _id: userId });
    userFind.username = userInfo.username;
    userFind.gender = userInfo.gender;
    userFind.address = userInfo.address;
    userFind.phone = userInfo.phone;
    return userFind.save();
}
let updatePassword = (idUser, item) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userFind = await UserModel.findOne({ _id: idUser });
            if (!userFind) {
                return reject("User not found to update password")
            }
            let isMatchingPassword = await userFind.comparePassword(item.currentPassword);
            //console.log("isMatchingPassword", isMatchingPassword);
            if (!isMatchingPassword) {
                return reject("Password not match");
            }
            let passwordNew = bcrypt.hashSync(item.newPassword, 7);
            userFind.local.password = passwordNew;
            let result = await userFind.save();
            // console.log("result", result);
            return resolve(result);
        } catch (err) {
            return reject(err);
        }
    })
}
module.exports = {
    updateUser: updateUser,
    updateInfo,
    updatePassword
}