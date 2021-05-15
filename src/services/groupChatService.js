
import _ from 'lodash';
import chatGroupModel from './../models/chatGroup';
let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
    return new Promise(async (resolve, reject) => {
        try {
            arrayMemberIds.unshift({ "userId": currentUserId.toString() });
            arrayMemberIds = _.uniqBy(arrayMemberIds, "userId");
            let newGroupItem = {
                name: groupChatName,
                userAmount: arrayMemberIds.length,
                userId: currentUserId.toString(),
                members: arrayMemberIds
            };
            let newChatGroup = await chatGroupModel.createNew(newGroupItem);
            resolve(newChatGroup);
        } catch (err) {
            reject(err);
        }
    })
}
module.exports = {
    addNewGroup
}