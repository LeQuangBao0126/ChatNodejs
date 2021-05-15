
import groupChatService from './../services/groupChatService';
let addNewGroup = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let arrayMemberIds = req.body.arrayIds;
        let groupChatName = req.body.groupChatName;
        let newGroupChat = await groupChatService.addNewGroup(currentUserId, arrayMemberIds, groupChatName);
        return res.status(200).send({ groupchat: newGroupChat });

    } catch (err) {
        return res.status(500).send(err);
    }
}
module.exports = {
    addNewGroup
}