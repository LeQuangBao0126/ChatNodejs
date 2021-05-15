import ContactModel from './../models/contact';
import UserModel from './../models/user';
import ChatGroupModel from './../models/chatGroup';
import MessageModel from './../models/message';
import _ from 'lodash';
import fsExtra from 'fs-extra';
const LIMIT_CONVERSATIONS_TAKEN = 10;
const LIMIT_MESSAGES_TAKEN = 20;
let getAllConversationItems = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(userId, LIMIT_CONVERSATIONS_TAKEN);
            let userConversationPromise = contacts.map(async (contact) => {
                if (userId == contact.contactId) {
                    let getUserContact = await UserModel.findUserById(contact.userId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                } else {
                    let getUserContact = await UserModel.findUserById(contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });
            let userConversation = await Promise.all(userConversationPromise);
            let groupConversation = await ChatGroupModel.getChatGroups(userId);
            let allConversations = await userConversation.concat(groupConversation);
            //sap xep tu lon ve nho
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.updatedAt;
            })
            //get tất cả messages để gắn vào màn hình chat
            let allConversationsWithMessagePromise = allConversations.map(async (conversation) => {
                conversation = conversation.toObject();
                if (conversation.members) {
                    //tro chuyen nhom
                    let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
                    // lấy 10 tin nhắn   mới nhất (mới => cũ ) => neu fill ra giao dien thì ngược lại là xong
                    _.reverse(getMessages);
                    conversation.messages = getMessages; //array messages
                } else {
                    //tro chuyen ca nhan
                    let getMessages = await MessageModel.model.getMessagesInPersonal(userId, conversation._id, LIMIT_MESSAGES_TAKEN);
                    _.reverse(getMessages);
                    conversation.messages = getMessages; //array messages 
                }

                return conversation;
            });
            let allConversationsWithMessage = await Promise.all(allConversationsWithMessagePromise);
            //sắp xếp thêm 1 lần nữa .
            allConversationsWithMessage = _.sortBy(allConversationsWithMessage, (item) => {
                return -item.updatedAt;
            })
            // console.log("allConversationsWithMessage", allConversationsWithMessage);
            resolve({
                userConversation: userConversation,
                groupConversation: groupConversation,
                allConversations: allConversations,
                allConversationsWithMessage: allConversationsWithMessage
            });
        } catch (err) {
            reject(err);
        }
    })
}
//sender Object ..ng dung hien tại
//re String 
//messVal : String 
//isChatGroup boolen 
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupReceiver = await ChatGroupModel.getGroupChatById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject("Không Tìm Thấy Cuộc Trò Chuyện");
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: "group-avatar-trungquandev.png"
                }
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiverId,
                    conversationType: MessageModel.conversation_types.GROUP,
                    messageType: MessageModel.message_types.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now()
                }
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                //phai cap nhat lai updateAt cua nhom khi co thong bao mới .. để nó đẩy conversation len trên
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.findUserById(receiverId);
                if (!getUserReceiver) {
                    return reject("Không Tìm Thấy Người Dùng Này");
                }
                let receiverUser = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                }
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiverId,
                    conversationType: MessageModel.conversation_types.PERSONAL,
                    messageType: MessageModel.message_types.TEXT,
                    sender: sender,
                    receiver: receiverUser,
                    text: messageVal,
                    createdAt: Date.now()
                }
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                //cap nhat 
                await ContactModel.UpdateWhenHasNewMessage(sender.id, getUserReceiver._id);
                resolve(newMessage)
            }
        } catch (err) {
            reject(err)
        }
    })
}
//sender Object ..ng dung hien tại
//re String 
//messVal : kieu FIle
//isChatGroup boolen 
let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupReceiver = await ChatGroupModel.getGroupChatById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject("Không Tìm Thấy Cuộc Trò Chuyện");
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: "group-avatar-trungquandev.png"
                }
                //doc file 
                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.filename;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiverId,
                    conversationType: MessageModel.conversation_types.GROUP,
                    messageType: MessageModel.message_types.IMAGE,
                    sender: sender,
                    receiver: receiver,
                    file: {
                        data: imageBuffer,
                        contentType: imageContentType,
                        fileName: imageName
                    },
                    createdAt: Date.now()
                }
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                //phai cap nhat lai updateAt cua nhom khi co thong bao mới .. để nó đẩy conversation len trên
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.findUserById(receiverId);
                if (!getUserReceiver) {
                    return reject("Không Tìm Thấy Người Dùng Này");
                }
                let receiverUser = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                }
                //doc file 
                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.filename;
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiverId,
                    conversationType: MessageModel.conversation_types.PERSONAL,
                    messageType: MessageModel.message_types.IMAGE,
                    sender: sender,
                    receiver: receiverUser,
                    file: {
                        data: imageBuffer,
                        contentType: imageContentType,
                        fileName: imageName
                    },
                    createdAt: Date.now()
                }
                let newMessage = await MessageModel.model.createNew(newMessageItem);

                //cap nhat 
                await ContactModel.UpdateWhenHasNewMessage(sender.id, getUserReceiver._id);
                resolve(newMessage)
            }
        } catch (err) {
            reject(err)
        }
    });
}
let addNewAttachment = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupReceiver = await ChatGroupModel.getGroupChatById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject("Không Tìm Thấy Cuộc Trò Chuyện");
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: "group-avatar-trungquandev.png"
                }
                //doc file phai lam khac với image 
                let attachmentBuffer = await fsExtra.readFile(messageVal.path);
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.filename;
                //
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiverId,
                    conversationType: MessageModel.conversation_types.GROUP,
                    messageType: MessageModel.message_types.FIlE,
                    sender: sender,
                    receiver: receiver,
                    file: {
                        data: attachmentBuffer,
                        contentType: attachmentContentType,
                        fileName: attachmentName
                    },
                    createdAt: Date.now()
                }
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                //phai cap nhat lai updateAt cua nhom khi co thong bao mới .. để nó đẩy conversation len trên
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.findUserById(receiverId);
                if (!getUserReceiver) {
                    return reject("Không Tìm Thấy Người Dùng Này");
                }
                let receiverUser = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                }
                //doc file phai lam khac với image 
                let attachmentBuffer = await fsExtra.readFile(messageVal.path);
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.filename;
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiverId,
                    conversationType: MessageModel.conversation_types.PERSONAL,
                    messageType: MessageModel.message_types.FILE,
                    sender: sender,
                    receiver: receiverUser,
                    file: {
                        data: attachmentBuffer,
                        contentType: attachmentContentType,
                        fileName: attachmentName
                    },
                    createdAt: Date.now()
                }
                let newMessage = await MessageModel.model.createNew(newMessageItem);

                //cap nhat 
                await ContactModel.UpdateWhenHasNewMessage(sender.id, getUserReceiver._id);
                resolve(newMessage)
            }
        } catch (err) {
            reject(err)
        }
    });
}

let readMore = (currentUserId, skipMessage, targetId, chatInGroup) => {
    //get message to apply to screen chat
    return new Promise(async (resolve, reject) => {
        try {
            if (chatInGroup) {
                let getMessages = await MessageModel.model.readMoreMessagesInGroup(targetId, skipMessage, LIMIT_MESSAGES_TAKEN);
                getMessages = _.reverse(getMessages);
                return resolve(getMessages);
            } else {
                let getMessages = await MessageModel.model.readMoreMessagesInPersonal(currentUserId, targetId, skipMessage, LIMIT_MESSAGES_TAKEN)
                getMessages = _.reverse(getMessages);
                return resolve(getMessages);
            }
        } catch (err) {
            reject(err);
        }
    })
}
module.exports = {
    getAllConversationItems,
    addNewTextEmoji,
    addNewImage,
    addNewAttachment,
    readMore
}