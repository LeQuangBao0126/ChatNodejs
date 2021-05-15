import mongoose from 'mongoose';

let MessageSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    conversationType: String,
    messageType: String,
    sender: {
        id: String,
        name: String,
        avatar: String
    },
    receiver: {
        id: String,
        name: String,
        avatar: String
    },
    text: String,
    file: {
        data: Buffer,
        contentType: String,
        fileName: String
    },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
    deletedAt: { type: Number, default: null }
});
MessageSchema.statics = {
    //lay nhug tin nhan 
    /* 
     *
     */
    getMessagesInPersonal(senderId, receiverId, limit) {
        //receiverId la id cua  contact
        return this.find({
            $or: [
                {
                    $and: [
                        { senderId: senderId },
                        { receiverId: receiverId }
                    ]
                },
                {
                    $and: [
                        { senderId: receiverId },
                        { receiverId: senderId }
                    ]
                }
            ]
        }).sort({ "createdAt": -1 }).limit(limit).exec()
    },
    getMessagesInGroup(receiverId, limit) {
        //receiverId la id cua nhom chat
        return this.find(
            { receiverId: receiverId }
        ).sort({ "createdAt": -1 }).limit(limit).exec()
    },
    createNew(item) {
        return this.create(item);
    },
    readMoreMessagesInGroup(targetId, skipMessage, limit) {
        return this.find({
            receiverId: targetId
        }).sort({ "createdAt": -1 }).skip(skipMessage).limit(limit).exec()
    },
    readMoreMessagesInPersonal(currentUserId, targetId, skipMessage, limit) {
        return this.find({
            $or: [
                {
                    $and: [
                        { senderId: currentUserId },
                        { receiverId: targetId }
                    ]
                },
                {
                    $and: [
                        { senderId: targetId },
                        { receiverId: currentUserId }
                    ]
                }
            ]
        }).sort({ "createdAt": -1 }).skip(skipMessage).limit(limit).exec()
    }

}
const MESSAGE_CONVERSATION_TYPES = {
    PERSONAL: "personal",
    GROUP: "group"
};
const MESSAGE_TYPES = {
    TEXT: "text",
    IMAGE: "image",
    FILE: "file"
};

module.exports = {
    model: mongoose.model("message", MessageSchema),
    conversation_types: MESSAGE_CONVERSATION_TYPES,
    message_types: MESSAGE_TYPES
}