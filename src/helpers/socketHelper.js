// push socket id to array 
export const pushSocketIdToArray = (clients, currentUserId, socketId) => {
    if (clients[currentUserId]) {
        clients[currentUserId].push(socketId);
    } else {
        clients[currentUserId] = [socketId];
    }
    return clients;
}
/// loop mang socket ID để bắn thong báo về các client .
export const emitNotifyToArray = (clients, userId, io, eventName, data) => {
    clients[userId].forEach(socketID => {
        io.to(socketID).emit(eventName, data);
    })
}
//
export const removeSocketIdToArray = (clients, userId, socket) => {
    if (!clients[userId].length) {
        delete clients[userId];
    } else {
        clients[userId] = clients[userId].filter(s => s != socket.id);
    }
    return clients;
}