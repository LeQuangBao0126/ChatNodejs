import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray } from '../../helpers/socketHelper';

let approveRequestContactReceived = (io) => {
    let clients = {};
    io.on("connection", function (socket) {
        let currentUserId = socket.request.user._id;
        clients = pushSocketIdToArray(clients, currentUserId, socket.id);
        socket.on("approve-request-contact-received", (data => {
            let currentUser = {
                id: socket.request.user._id,
                name: socket.request.user.username,
                avatar: socket.request.user.avatar,
                address: socket.request.user.address == null ? " " : socket.request.user.address
            }
            if (clients[data.contactId]) {
                emitNotifyToArray(clients, data.contactId, io, "response-approve-request-contact-received", currentUser)
            }
        }));

        socket.on("disconnect", () => {
            clients = removeSocketIdToArray(clients, currentUserId, socket);
        });
    })
}
module.exports = approveRequestContactReceived;