import NotificationModel from './../models/notification';
import UserModel from './../models/user';

const Limit_number_taken = 10;

let getNotifications = (currentUserId, Limit_number_taken) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, Limit_number_taken);
            //phai lay thong tin senderId để tra ra view;
            let getNotifContents = notifications.map(async (notification) => {
                let sender = await UserModel.findUserById(notification.senderId);
                return NotificationModel.contents.getContent(
                    notification.type,
                    notification.isRead,
                    sender._id != null ? sender._id : "",
                    sender.username != null ? sender.username : "",
                    sender.avatar != null ? sender.avatar : ""
                )
            })
            let arrUserNotifycations = await Promise.all(getNotifContents)
            resolve(arrUserNotifycations);
        } catch (err) {
            reject(err);
        }
    })
}
let countNotifUnRead = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notifUnRead = await NotificationModel.model.countNotifUnRead(currentUserId);
            resolve(notifUnRead);
        } catch (err) {
            reject(err);
        }
    })
}
let readMore = (userId, skipNumber) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newNotifications = await NotificationModel.model.readMore(userId, skipNumber, Limit_number_taken);
            //phai lay thong tin senderId để tra ra view;
            let getNotifContents = newNotifications.map(async (notification) => {
                let sender = await UserModel.findUserById(notification.senderId);
                return NotificationModel.contents.getContent(
                    notification.type,
                    notification.isRead,
                    sender._id,
                    sender.username,
                    sender.avatar
                )
            })
            let arrUserNotifycations = await Promise.all(getNotifContents)
            resolve(arrUserNotifycations);
        } catch (err) {
            reject(err);
        }
    })
}
let markAllAsRead = (userId, targetUsers) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await NotificationModel.model.markAllAsRead(userId, targetUsers);
            //console.log("result sau khi update ", result)
            resolve(true);
        } catch (err) {
            reject(false);
        }
    })
}

module.exports = {
    getNotifications,
    countNotifUnRead,
    readMore,
    markAllAsRead
}