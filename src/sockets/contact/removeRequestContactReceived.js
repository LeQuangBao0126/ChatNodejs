import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray } from '../../helpers/socketHelper';

let removeRequestContactReceived = (io) => {
    let clients = {};
    io.on("connection", function (socket) {
        let currentUserId = socket.request.user._id;
        clients = pushSocketIdToArray(clients, currentUserId, socket.id);
        socket.on("remove-request-contact-received", (data => {
            let currentUser = {
                id: socket.request.user._id
            }
            if (clients[data.contactId]) {
                emitNotifyToArray(clients, data.contactId, io, "response-remove-request-contact-received", currentUser)
            }
        }));

        socket.on("disconnect", () => {
            clients = removeSocketIdToArray(clients, currentUserId, socket);
        });
    })
}
module.exports = removeRequestContactReceived;