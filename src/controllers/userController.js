import multer from 'multer';
import { app } from './../config/app';
import userService from './../services/userService';
let storageAvatar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, app.avatar_directory);
    },
    filename: (req, file, cb) => {
        let avatarName = `${Date.now()}-${file.originalname}`;
        cb(null, avatarName);
    }
})
let avatarUploadFile = multer({ storage: storageAvatar }).single("avatar");

let updateAvatar = (req, res, next) => {
    avatarUploadFile(req, res, async (err) => {
        if (err) {
            console.log(err);
            return;
        }
        let updateAvatarItem = {
            avatar: req.file.filename,
            updatedAt: Date.now()
        }
        let user = await userService.updateUser(req.user._id, updateAvatarItem);
        res.status(200).json({ result: true, data: user })
    });
}
let updateInfo = async (req, res, next) => {
    let userInfo = req.body;
    let userId = req.user._id;
    let user = await userService.updateInfo(userInfo, userId);
    res.status(200).json({ result: true, data: user })
}
let updatePassword = async (req, res) => {
    try {
        let result = await userService.updatePassword(req.user._id, req.body);
        res.status(200).json(result)
    } catch (err) {
        res.status(404).json({ error: err })
    }
}
module.exports = {
    updateAvatar,
    updateInfo,
    updatePassword
}