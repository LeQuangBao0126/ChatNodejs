import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
let UserSchema = new mongoose.Schema({
    username: String,
    gender: { type: String, default: "male" },
    phone: { type: Number, default: 123456 },
    address: { type: String, default: "Viet Nam" },
    avatar: { type: String, default: "avatar-default.jpg" },
    role: { type: String, default: "user" },
    local: {
        email: { type: String, trim: true },
        password: { type: String },
        isActive: { type: Boolean, default: true },
        verifyToken: { type: String, default: null }
    },
    facebook: {
        uid: String,
        email: { type: String, trim: true },
        token: String
    },
    google: {
        uid: String,
        email: { type: String, trim: true },
        token: String
    },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
    deletedAt: { type: Number, default: null }
})
UserSchema.statics = {
    createNew(item) {
        return this.create(item);
    },
    findByEmail(email) {
        return this.findOne({ "local.email": email }).exec();
    },
    findUserById(id) {
        return this.findOne({ _id: id }).select('-local.password').exec();
    },
    updateUser(idUser, item) {
        return this.findByIdAndUpdate(idUser, item, { new: true });
    },
    findAllForContact(deprecatedUserIds, keyword) {
        return this.find({
            $and: [
                { _id: { "$nin": deprecatedUserIds } },
                {
                    $or: [
                        { "username": { $regex: keyword } },
                        { "local.email": { $regex: keyword } }
                    ]
                }
            ]
        }, { "_id": 1, "username": 1, "avatar": 1, "address": 1 }).exec();
    },
    findAllToAddGroupchat(friendIds, keyword) {
        return this.find({
            $and: [
                { _id: { "$in": friendIds } },
                {
                    $or: [
                        { "username": { $regex: keyword } },
                        { "local.email": { $regex: keyword } }
                    ]
                }
            ]
        }, { "_id": 1, "username": 1, "avatar": 1, "address": 1 }).exec();
    }
}
UserSchema.methods = {
    comparePassword(password) {
        return bcrypt.compare(password, this.local.password)
    }
}
module.exports = mongoose.model("user", UserSchema); 