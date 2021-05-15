import ContactService from './../services/contactService';

let findUsersContact = async (req, res) => {
    try {
        let keyword = req.params.keyword;
        let currentUserId = req.user._id;
        let users = await ContactService.findUsersContact(currentUserId, keyword);
        return res.render("main/contact/sections/_findUserContact", { users: users })
        //res.status(200).json(users)
    } catch (err) {
        return res.status(500).send(err);
    }
}
let addNew = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let newContact = await ContactService.addNew(currentUserId, contactId);
        //console.log(newContact);
        return res.status(200).json({ success: !!newContact });
    } catch (err) {
        return res.status(500).send(err);
    }
}
let removeRequestContactSent = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;
        let removeRequest = await ContactService.removeRequestContactSent(currentUserId, contactId);
        return res.status(200).json({ success: !!removeRequest });
    } catch (err) {
        return res.status(500).send(err);
    }
}
let removeRequestContactReceived = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;
        let removeRequestReceived = await ContactService.removeRequestContactReceived(currentUserId, contactId);
        return res.status(200).json({ success: !!removeRequestReceived });
    } catch (err) {
        return res.status(500).send(err);
    }
}
let approveRequestContactReceived = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;
        let approveRequestContactReceived = await ContactService.approveRequestContactReceived(currentUserId, contactId);
        return res.status(200).json({ success: !!approveRequestContactReceived });
    } catch (err) {
        return res.status(500).send(err);
    }
}
let removeContact = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;
        let removeContact = await ContactService.removeContact(currentUserId, contactId);
        return res.status(200).json({ success: !!removeContact });
    } catch (err) {
        return res.status(500).send(err);
    }
}
let searchFriends = async (req, res) => {
    try {
        let keyword = req.params.keyword;
        let currentUserId = req.user._id;
        let users = await ContactService.searchFriends(currentUserId, keyword);
        return res.render("main/groupchat/section/_searchFriend", { users: users })
    } catch (err) {
        return res.status(500).send(err);
    }
}
module.exports = {
    findUsersContact,
    addNew,
    removeRequestContactSent,
    removeRequestContactReceived,
    approveRequestContactReceived,
    removeContact,
    searchFriends
}