import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray } from '../../helpers/socketHelper';

let typingOn = (io) => {
   let clients = {};
   io.on("connection", function (socket) {
      let currentUserId = socket.request.user._id;
      clients = pushSocketIdToArray(clients, currentUserId, socket.id);
      socket.request.user.chatGroupIds.forEach(group => {
         clients = pushSocketIdToArray(clients, group._id, socket.id);
      })
      socket.on("new-group-created", (data => {
         clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
         let response = {
            groupchat: data.groupChat
         }
         data.groupChat.members.forEach(member => {
            if (clients[member.userId] && (member.userId != currentUserId)) {
               emitNotifyToArray(clients, member.userId, io, "response-new-group-created", response)
            }
         })
      }));
      socket.on("members-received-group-chat", (data) => {
         clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
         // console.log("clients", clients)
      });
      socket.on("disconnect", () => {
         clients = removeSocketIdToArray(clients, currentUserId, socket);
         socket.request.user.chatGroupIds.forEach(group => {
            clients = removeSocketIdToArray(clients, group._id, socket);
         })
      });
   })
}
module.exports = typingOn;