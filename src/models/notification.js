import mongoose from 'mongoose';
let NotificationSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    type: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now }
})
NotificationSchema.statics = {
    createNew(item) {
        return this.create(item);
    },
    removeRequestContactSendNotification(senderId, receiverId, type) {
        return this.remove({
            $and: [
                { senderId: senderId },
                { receiverId: receiverId },
                { type: type }
            ]
        })
    },
    removeRequestContactReceivedNotification(userId, contactId, type) {
        return this.remove({
            $and: [
                { senderId: contactId },
                { receiverId: userId },
                { type: "add_contact" }
            ]
        })
    },
    getByUserIdAndLimit(userId, limit) {
        return this.find({
            receiverId: userId
        }).sort({ "createdAt": -1 }).limit(limit).exec()
    },
    countNotifUnRead(userId) {
        return this.count({
            $and: [
                {
                    receiverId: userId
                }, {
                    isRead: false
                }
            ]
        }
        ).exec()
    },
    readMore(userId, skipNumber, limit) {
        return this.find({
            receiverId: userId
        }).sort({ "createdAt": -1 }).skip(skipNumber).limit(limit).exec();
    },
    markAllAsRead(userId, targetUsers) {
        return this.updateMany({
            $and: [
                { receiverId: userId },
                { senderId: { $in: targetUsers } }
            ]
        }, {
            '$set': {
                'isRead': true
            }
        })
    }
}
const NOTIFICATION_TYPES = {
    ADD_CONTACT: "add_contact",
    APPROVE_CONTACT: "approve_contact"
}
const NOTIFICATION_CONTENTS = {
    getContent: (notificationType, isRead, userId, userName, userAvatar) => {
        if (notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
            return `
                 <div data-uid="${userId}" class=${isRead == false ? 'notif-reader-false' : ''} >
                    <img class="avatar-small" src="images/users/${userAvatar}"
                        alt="">
                    <strong>${userName}</strong> đã gửi cho bạn lời mời kết bạn!
                </div>
            `
        }
        if (notificationType === NOTIFICATION_TYPES.APPROVE_CONTACT) {
            return `
                 <div data-uid="${userId}" class=${isRead == false ? 'notif-reader-false' : ''} >
                    <img class="avatar-small" src="images/users/${userAvatar}"
                        alt="">
                    <strong>${userName}</strong> đã đồng ý lời mời kết bạn!
                </div>
            `
        }
        return "No Matching with any notification types";
    }
}
module.exports = {
    model: mongoose.model("notification", NotificationSchema),
    types: NOTIFICATION_TYPES,
    contents: NOTIFICATION_CONTENTS
}; 