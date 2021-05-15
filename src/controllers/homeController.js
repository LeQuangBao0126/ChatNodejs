import NotificationService from './../services/notificationService'
import ContactService from './../services/contactService'
import MessageService from './../services/messageService'
import { convertBinaryToBase64, lastItemOfArray, convertTimestampToHumanTime } from './../helpers/clientHelper';
let getHome = async (req, res) => {
    //  console.log("req.user", req.user);
    let notifications = await NotificationService.getNotifications(req.user._id, 10);
    //get amout notification unread
    let countNotifUnRead = await NotificationService.countNotifUnRead(req.user._id);
    // get 10 item one time 
    //get contacts 
    let contacts = await ContactService.getContacts(req.user._id);
    //get contacts send cho ng ta 
    let contactsSend = await ContactService.getContactsSend(req.user._id);
    //get contact recevied (ng ta gửi cho mình)
    let contactsReceived = await ContactService.getContactsReceived(req.user._id);
    //count 
    let countContacts = await ContactService.countContacts(req.user._id);
    let countContactsSend = await ContactService.countContactsSend(req.user._id);
    let countContactsReceived = await ContactService.countContactsReceived(req.user._id);
    // lấy ra nhửng cuộc trò chuyen
    let getAllConversationItems = await MessageService.getAllConversationItems(req.user._id);

    let allConversations = getAllConversationItems.allConversations;
    let userConversation = getAllConversationItems.userConversation;
    let groupConversations = getAllConversationItems.groupConversation;
    let allConversationsWithMessage = getAllConversationItems.allConversationsWithMessage;
    return res.render("main/master", {
        success: req.flash("success"),
        user: req.user,
        notifications: notifications,
        countNotifUnRead: countNotifUnRead,
        contacts: contacts,
        contactsSend: contactsSend,
        contactsReceived: contactsReceived,
        countContacts,
        countContactsSend,
        countContactsReceived,

        allConversations,
        userConversation,
        groupConversations,
        allConversationsWithMessage,
        bufferToBase64: convertBinaryToBase64,
        lastItemOfArray: lastItemOfArray,
        convertTimestampToHumanTime: convertTimestampToHumanTime
    });
};
module.exports = {
    getHome
};