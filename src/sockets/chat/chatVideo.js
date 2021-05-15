import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray } from '../../helpers/socketHelper';

let chatVideo = (io) => {
    let clients = {};
    io.on("connection", function (socket) {
        let currentUserId = socket.request.user._id;
        clients = pushSocketIdToArray(clients, currentUserId, socket.id);
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        })
        //console.log("clients ", clients);
        //Step 1 : Caller check listen online or not 
        socket.on("Caller-check-listener-online-or-not", (data => {
            if (clients[data.listenerId] && clients[data.listenerId].length) {
                //online 
                let response = {
                    callerId: socket.request.user._id,
                    listenerId: data.listenerId,
                    callerName: data.callerName
                };
                emitNotifyToArray(clients, data.listenerId, io, "server-request-peerId-of-listener", response)
            } else {
                //user đã offline 
                //Step 2 : 
                socket.emit("server-send-listener-is-offline")
            }
        }));
        //Step 
        socket.on("listener-emit-peer-id-to-server", (data) => {
            let response = {
                callerId: data.callerId,
                callerName: data.callerName,
                listenerId: data.listenerId,
                listenerName: data.listenerName,
                listenerPeerId: data.listenerPeerId
            }
            //console.log(response);
            if (clients[data.callerId]) {
                emitNotifyToArray(clients, data.callerId, io, "server-request-peerId-of-listener-to-caller", response)
            }
        });
        // lắng nghe thằng gọi yeu cầu call  và trả về cho thằng nghe
        //Step 8 : Server  send yeu cầu gọi của caller cho listener
        socket.on("caller-request-call-to-server", (data) => {
            let response = {
                callerId: data.callerId,
                callerName: data.callerName,
                listenerId: data.listenerId,
                listenerName: data.listenerName,
                listenerPeerId: data.listenerPeerId
            }
            if (clients[data.listenerId]) {
                emitNotifyToArray(clients, data.listenerId, io, "server-send-request-call-to-listener", response)
            }
        })
        //lắng nghe thằng gọi hủy cuộc goi và trả về cho thằng nghe
        socket.on("caller-cancel-request-call-to-server", (data) => {
            let response = {
                callerId: data.callerId,
                callerName: data.callerName,
                listenerId: data.listenerId,
                listenerName: data.listenerName,
                listenerPeerId: data.listenerPeerId
            }
            if (clients[data.listenerId]) {
                emitNotifyToArray(clients, data.listenerId, io, "server-send-cancel-request-call-to-listener", response)
            }
        })
        // socket lắng nghe thằng listener ko đồng ý nghe 
        socket.on("listener-reject-request-call-to-server", (data) => {
            let response = {
                callerId: data.callerId,
                callerName: data.callerName,
                listenerId: data.listenerId,
                listenerName: data.listenerName,
                listenerPeerId: data.listenerPeerId
            }
            if (clients[data.callerId]) {
                emitNotifyToArray(clients, data.callerId, io, "server-send-reject-call-to-caller", response)
            }
        });
        // socket lắng nghe thằng listener Đồng ý nghe  : bắn về cho 2 thằng 
        socket.on("listener-accept-request-call-to-server", (data) => {
            let response = {
                callerId: data.callerId,
                callerName: data.callerName,
                listenerId: data.listenerId,
                listenerName: data.listenerName,
                listenerPeerId: data.listenerPeerId
            }
            if (clients[data.callerId]) {
                emitNotifyToArray(clients, data.callerId, io, "server-send-accept-request-call-to-caller", response)
            }
            if (clients[data.listenerId]) {
                emitNotifyToArray(clients, data.listenerId, io, "server-send-accept-request-call-to-listener", response)
            }
        })

        socket.on("disconnect", () => {
            clients = removeSocketIdToArray(clients, currentUserId, socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdToArray(clients, group._id, socket);
            })
            // console.log("clients lúc sau ", clients);
        });
    })
}
module.exports = chatVideo;