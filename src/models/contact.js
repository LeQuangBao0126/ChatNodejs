import mongoose from 'mongoose';

let ContactSchema = new mongoose.Schema({
    userId: String,
    contactId: String,
    status: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
    deletedAt: { type: Number, default: null }
})
ContactSchema.statics = {
    createNew(item) {
        return this.create(item);
    },
    findAllByUserId(userId) {
        return this.find({
            $or: [
                { userId: userId },
                { contactId: userId }
            ]
        }).exec()
    },
    checkExist(userId, contactId) {
        return this.findOne({
            $or: [
                {
                    $and: [
                        { userId: userId },
                        { contactId: contactId }
                    ]
                },
                {
                    $and: [
                        { userId: contactId },
                        { contactId: userId }
                    ]
                }
            ]
        })
    },
    removeRequestContactSent(userId, contactId) {
        return this.remove({
            $and: [
                { userId: userId },
                { contactId: contactId },
                { status: false }
            ]
        })
    },
    getContacts(userId) {
        return this.find({
            $and: [
                {
                    $or: [
                        { userId: userId },
                        { contactId: userId }
                    ]
                },
                { status: true }
            ]
        }).sort({ "createdAt": -1 }).exec();
    },
    getContactsSend(userId) {
        return this.find({
            $and: [
                { userId: userId },
                { status: false }
            ]
        }).sort({ "createdAt": -1 }).exec();
    },
    getContactsReceived(userId) {
        return this.find({
            $and: [
                { contactId: userId },
                { status: false }
            ]
        }).sort({ "createdAt": -1 }).exec();
    },
    countContacts(userId) {
        return this.count({
            $and: [
                {
                    $or: [
                        { userId: userId },
                        { contactId: userId }
                    ]
                },
                { status: true }
            ]
        }).exec();
    },
    countContactsSend(userId) {
        return this.count({
            $and: [
                { userId: userId },
                { status: false }
            ]
        }).exec();
    },
    countContactsReceived(userId) {
        return this.count({
            $and: [
                { contactId: userId },
                { status: false }
            ]
        }).exec();
    },
    removeRequestContactReceived(userId, contactId) {
        return this.remove({
            $and: [
                { userId: contactId },
                { contactId: userId },
                { status: false }
            ]
        })
    },
    approveRequestContactReceived(userId, contactId) {
        return this.findOneAndUpdate({
            $and: [
                { userId: contactId },
                { contactId: userId },
                { status: false }
            ]
        }, { status: true, updatedAt: Date.now() })
    },
    removeContact(userId, contactId) {
        return this.remove({
            $or: [
                {
                    $and: [
                        { userId: userId },
                        { contactId: contactId },
                        { status: true }
                    ]
                },
                {
                    $and: [
                        { userId: contactId },
                        { contactId: userId },
                        { status: true }
                    ]
                }
            ]
        });
    },
    UpdateWhenHasNewMessage(userId, contactId) {
        return this.findOneAndUpdate({
            $or: [
                {
                    $and: [
                        { userId: userId },
                        { contactId: contactId }
                    ]
                },
                {
                    $and: [
                        { userId: contactId },
                        { contactId: userId }
                    ]
                }
            ]
        }, { "updatedAt": Date.now() })
    },
    getFriends(currentUserId) {
        return this.find({
            $and: [
                {
                    $or: [
                        { userId: currentUserId },
                        { contactId: currentUserId }
                    ]
                },
                { status: true }
            ]
        }).exec();
    }
}
module.exports = mongoose.model("contact", ContactSchema); 