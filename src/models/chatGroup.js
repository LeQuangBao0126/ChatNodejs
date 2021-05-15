import mongoose from 'mongoose';

let ChatGroupSchema = new mongoose.Schema({

    name: String,
    userAmount: Number,
    messageAmount: { type: Number, default: 0 },
    userId: String,
    members: [
        {
            userId: String,
        }
    ],
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
    deletedAt: { type: Number, default: null }
})
ChatGroupSchema.statics = {
    //get chat groups by current userId
    getChatGroups(userId) {
        return this.find({
            "members": { $elemMatch: { "userId": userId } }
        }).sort({ "createdAt": -1 }).exec();
    },
    getGroupChatById(groupChatId) {
        return this.findOne({
            _id: groupChatId
        }).exec();
    },
    updateWhenHasNewMessage(groupId, messageAmount) {
        return this.findOneAndUpdate({
            _id: groupId
        }, {
            $set: {
                "updatedAt": Date.now(),
                "messageAmount": messageAmount
            }
        }).exec();
    },
    getChatGroupIdsByUser(id) {
        return this.find({
            "members": { $elemMatch: { "userId": id } }
        }, { "_id": 1 }).exec();
    },
    createNew(item) {
        return this.create(item);
    }
}
module.exports = mongoose.model("chat-group", ChatGroupSchema); 