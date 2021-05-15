import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray } from '../../helpers/socketHelper';

let typingOn = (io) => {
    let clients = {};
    io.on("connection", function (socket) {
        let currentUserId = socket.request.user._id;
        clients = pushSocketIdToArray(clients, currentUserId, socket.id);
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        })
        //
        socket.on("new-group-created", (data => {
            clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
        }));
        socket.on("members-received-group-chat", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
        });
        socket.on("user-is-typing", (data => {
            if (data.groupId) {
                let response = {
                    currentUserId: socket.request.user._id,
                    currentGroupId: data.groupId
                }
                if (clients[data.groupId]) {
                    emitNotifyToArray(clients, data.groupId, io, "response-user-is-typing", response)
                }
            }
            if (data.contactId) {
                let response = {
                    currentUserId: socket.request.user._id
                }
                if (clients[data.contactId]) {
                    emitNotifyToArray(clients, data.contactId, io, "response-user-is-typing", response)
                }
            }
        }));
        //
        socket.on("disconnect", () => {
            clients = removeSocketIdToArray(clients, currentUserId, socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdToArray(clients, group._id, socket);
            })
        });
    })
}
module.exports = typingOn;