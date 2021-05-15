import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray } from '../../helpers/socketHelper';

let chatTextEmoji = (io) => {
    let clients = {};
    io.on("connection", function (socket) {
        let currentUserId = socket.request.user._id;
        clients = pushSocketIdToArray(clients, currentUserId, socket.id);
        /// console.log("socket groupids", socket.request.user)
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        })
        //
        // console.log("clients ", clients)
        //
        socket.on("new-group-created", (data => {
            clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
        }));
        socket.on("members-received-group-chat", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
        });
        socket.on("chat-text-emoji", (data => {
            console.log(data);
            if (data.groupId) {
                let response = {
                    currentUserId: socket.request.user._id,
                    message: data.message,
                    currentGroupId: data.groupId
                }
                if (clients[data.groupId]) {
                    emitNotifyToArray(clients, data.groupId, io, "response-chat-text-emoji", response)
                }
            }
            if (data.contactId) {
                let response = {
                    currentUserId: socket.request.user._id,
                    message: data.message
                }
                if (clients[data.contactId]) {
                    emitNotifyToArray(clients, data.contactId, io, "response-chat-text-emoji", response)
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
module.exports = chatTextEmoji;