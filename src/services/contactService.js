import ContactModel from './../models/contact';
import UserModel from './../models/user';
import NotificationModel from './../models/notification';
import * as _ from 'lodash';

let findUsersContact = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let deprecatedUserIds = [currentUserId];
            let contactsByUser = await ContactModel.findAllByUserId(currentUserId);
            contactsByUser.forEach(contact => {
                deprecatedUserIds.push(contact.userId);
                deprecatedUserIds.push(contact.contactId);
            })
            deprecatedUserIds = _.uniqBy(deprecatedUserIds);
            let users = await UserModel.findAllForContact(deprecatedUserIds, keyword);
            resolve(users)
        } catch (err) {
            reject(err)
        }
    })
}
let addNew = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contactExist = await ContactModel.checkExist(currentUserId, contactId);
            //check ton tai ban ghi ..no da co bạn
            if (contactExist) {
                reject(false);
            }
            let newContactItem = {
                userId: currentUserId,
                contactId: contactId
            }
            let newContact = await ContactModel.createNew(newContactItem);
            //add notification 
            let newNotificationItem = {
                senderId: currentUserId,
                receiverId: contactId,
                type: NotificationModel.types.ADD_CONTACT
            }
            let notification = await NotificationModel.model.createNew(newNotificationItem)
            resolve(newContact)
        } catch (err) {
            reject(err)
        }
    })
}
let removeRequestContactSent = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contactExist = await ContactModel.checkExist(currentUserId, contactId);
            //check ton tai ban ghi ..no da co bạn
            if (!contactExist) {
                reject(false);
            }
            let result = await ContactModel.removeRequestContactSent(currentUserId, contactId);
            //remove notification 
            let resultNotification = await NotificationModel.model.removeRequestContactSendNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);

            if (result.n == 1 && result.ok == 1) {
                return resolve(true);
            }
            reject(false)
        } catch (err) {
            reject(err)
        }
    })
}
//
let getContacts = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(userId, 10);
            let users = contacts.map(async (contact) => {
                if (userId == contact.contactId) {
                    let user = await UserModel.findUserById(contact.userId);
                    return user;
                } else {
                    let user = await UserModel.findUserById(contact.contactId);
                    return user;
                }
            });

            resolve(await Promise.all(users))
        } catch (err) {
            reject(err);
        }
    })
}
let getContactsSend = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContactsSend(userId, 10);
            let users = contacts.map(async (contact) => {
                let user = await UserModel.findUserById(contact.contactId);
                return user;
            })
            resolve(await Promise.all(users))
        } catch (err) {
            reject(err);
        }
    })
}
let getContactsReceived = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContactsReceived(userId, 10);
            let users = contacts.map(async (contact) => {
                let user = await UserModel.findUserById(contact.userId);
                return user;
            })
            resolve(await Promise.all(users))
        } catch (err) {
            reject(err);
        }
    })
}
let countContacts = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await ContactModel.countContacts(userId);
            resolve(count);
        } catch (err) {
            reject(false);
        }
    })
}
let countContactsSend = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await ContactModel.countContactsSend(userId);
            resolve(count);
        } catch (err) {
            reject(err);
        }
    })
}
let countContactsReceived = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await ContactModel.countContactsReceived(userId);
            resolve(count);
        } catch (err) {
            reject(err);
        }
    })
}
let removeRequestContactReceived = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // let contactExist = await ContactModel.checkExist(currentUserId, contactId);
            // if (!contactExist) {
            //     reject(false);
            // }
            let result = await ContactModel.removeRequestContactReceived(currentUserId, contactId);
            //remove notification 
            await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
            if (result.n == 1 && result.ok == 1) {
                return resolve(true);
            }
            reject(false)
        } catch (err) {
            reject(err)
        }
    })
}
let approveRequestContactReceived = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let approveRequestContactReceived = await ContactModel.approveRequestContactReceived(currentUserId, contactId);
            // console.log("approveRequestContactReceived", approveRequestContactReceived);
            //create totification 
            let approveRequestContactReceivedNotification = {
                senderId: contactId,
                receiverId: currentUserId,
                type: NotificationModel.types.APPROVE_CONTACT
            }
            await NotificationModel.model.createNew(approveRequestContactReceivedNotification)

            // if (result.n == 1 && result.ok == 1) {
            //     return resolve(true);
            // }
            //reject(false)
            resolve(true);
        } catch (err) {
            reject(err)
        }
    })
}
let removeContact = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("truoc khi removeContact")
            let contact = await ContactModel.removeContact(currentUserId, contactId);
            resolve(true);
        } catch (err) {
            reject(err);
        }
    })

}
let searchFriends = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let friendIds = [];
            let friends = await ContactModel.getFriends(currentUserId);
            friends.forEach(item => {
                friendIds.push(item.userId);
                friendIds.push(item.contactId);
            })
            friendIds = _.uniqBy(friendIds);
            friendIds = friendIds.filter(id => id != currentUserId);
            let users = await UserModel.findAllToAddGroupchat(friendIds, keyword);
            resolve(users)
        } catch (err) {
            reject(err)
        }
    })
}
module.exports = {
    findUsersContact,
    addNew,
    removeRequestContactSent,
    getContacts,
    getContactsSend,
    getContactsReceived,
    countContacts,
    countContactsSend,
    countContactsReceived,
    removeRequestContactReceived,
    approveRequestContactReceived,
    removeContact,
    searchFriends
}