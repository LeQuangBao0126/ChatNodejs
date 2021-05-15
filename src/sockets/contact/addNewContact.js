

//parem io from socket.io lib
let addNewContact = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        let currentUserId = socket.request.user._id;
        if (clients[currentUserId]) {
            clients[currentUserId].push(socket.id);
        } else {
            clients[currentUserId] = [socket.id];
        }

        socket.on("add-new-contact", (data => {
            let currentUser = {
                id: socket.request.user._id,
                name: socket.request.user.username,
                avatar: socket.request.user.avatar,
                address: socket.request.user.address
            }
            if (clients[data.contactId]) {
                clients[data.contactId].forEach(socketID => {
                    io.to(socketID).emit("response-add-new-contact", currentUser);
                })
            }
        }));

        socket.on("disconnect", () => {
            if (!clients[currentUserId].length) {
                delete clients[currentUserId];
            } else {
                clients[currentUserId] = clients[currentUserId].filter(socketId => socketId != socket.id);
            }
        });

    });
}
module.exports = addNewContact;