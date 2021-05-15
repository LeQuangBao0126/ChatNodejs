function videoChat(divId) {
    $(`#video-chat-${divId}`).unbind("click").on("click", function () {
        let targetId = $(this).data("chat");
        let callerName = $("#navbar-username").text().trim();
        let dataToEmit = {
            listenerId: targetId,
            callerName: callerName
        }
        console.log(dataToEmit);
        //emit Caller-check-listener-online-or-not
        socket.emit("Caller-check-listener-online-or-not", dataToEmit);
    })
}
function khongnhacmay(response) {
    alertify.notify(`${response.listenerName} không nhấc máy !`, "error", 7);
}
function playVideoStream(videoTagId, stream) {
    let video = document.getElementById(videoTagId);
    video.srcObject = stream;
    video.onloadeddata = function () {
        video.play();
    }
}
function CloseVideoStream(stream) {
    stream.getTracks().forEach(function (track) {
        track.stop();
    });
}
$(document).ready(function () {
    //Step 2 of caller 
    socket.on("server-send-listener-is-offline", function () {
        alertify.notify("Người dùng này hiện không trực tuyến !", "error", 7);
    });
    //Step 3 Listener: tại vì server tra về cho listenerId 
    let getPeerId = "";
    const peer = new Peer({
        key: "peerjs",
        host: "peerjs-server-trungquandev.herokuapp.com",
        path: "/",
        secure: true,
        port: 443,
        debug: 3
    });
    console.log("peer", peer)
    peer.on("open", function (peerId) {
        getPeerId = peerId;
    })
    socket.on("server-request-peerId-of-listener", function (response) {
        //server yeu cầu peerId của listener này 
        //listener name 
        let listenerName = $("#navbar-username").text().trim();
        let dataToEmit = {
            callerId: response.callerId,
            callerName: response.callerName,
            listenerId: response.listenerId,
            listenerName: listenerName,
            listenerPeerId: getPeerId
        };
        //Step 04 Listenner : Listenner gửi dữ liệu và PeerId về server
        socket.emit("listener-emit-peer-id-to-server", dataToEmit);
    });

    let timerInterval;
    //Step 5 Caller : server-request-peerId-of-listener-to-caller
    socket.on("server-request-peerId-of-listener-to-caller", function (response) {
        console.log("caller nhận ", response)
        let dataToEmit = {
            callerId: response.callerId,
            callerName: response.callerName,
            listenerId: response.listenerId,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId
        }
        //Step 6 : Caller  : Caller request call to server 
        socket.emit("caller-request-call-to-server", dataToEmit);

        Swal.fire({
            title: `Đang gọi cho <span style="color:#2ecc71"> ${dataToEmit.listenerName} </span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html: `Thời gian <strong style="color:red;font-weight:bold"></strong> giây
                </br>
                <button id="btn-cancel-call" class="btn btn-danger" >Hủy gọi</button>
            `,
            timer: 30000,
            showConfirmButton: false,
            backdrop: "rgba(85,85,85,0.4)",
            allowOutsideClick: false,
            willOpen: () => {
                $("#btn-cancel-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timerInterval);
                    //Step 07 Caller : Nếu thằng caller gọi thì vẫn có thể hủy cái yeu cầu gọi đó 
                    socket.emit("caller-cancel-request-call-to-server", dataToEmit);
                })
                Swal.showLoading(),
                    timerInterval = setInterval(() => {
                        const content = Swal.getContent()
                        if (content) {
                            const b = content.querySelector('strong')
                            if (b) {
                                b.textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                            }
                        }
                    }, 1000)
            },
            onOpen: () => {
                //server-send-reject-call-to-caller
                socket.on("server-send-reject-call-to-caller", (response) => {
                    Swal.close();
                    clearInterval(timerInterval);
                    // alertify.notify(`${response.listenerName} không nhấc máy !`, "error", 7);
                    //  console.log("Khong nhấc máy")
                })

            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            return false;
        })

    });

    //Step 08 Listener : listen nhận yeu cầu gọi từ server 
    socket.on("server-send-request-call-to-listener", function (response) {
        let dataToEmit = {
            callerId: response.callerId,
            callerName: response.callerName,
            listenerId: response.listenerId,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId
        }

        Swal.fire({
            title: `  <span style="color:#2ecc71"> ${dataToEmit.callerName} </span>  Đang gọi cho bạn <i class="fa fa-volume-control-phone"></i>`,
            html: `Thời gian <strong style="color:red;font-weight:bold"></strong> giây
                </br>
                <button id="btn-reject-call" class="btn btn-danger" >Từ Chối</button>
                <button id="btn-accept-call" class="btn btn-success" >Nghe</button>
            `,
            timer: 30000,
            showConfirmButton: false,
            backdrop: "rgba(85,85,85,0.4)",
            allowOutsideClick: false,
            willOpen: () => {
                $("#btn-reject-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timerInterval);
                    //khi listener từ chối nghe máy .emit 
                    //Step 10: 
                    socket.emit("listener-reject-request-call-to-server", dataToEmit);
                })
                $("#btn-accept-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timerInterval);
                    //Step 11: Đồng ý nghe
                    socket.emit("listener-accept-request-call-to-server", dataToEmit);
                })

                Swal.showLoading(),
                    timerInterval = setInterval(() => {
                        const content = Swal.getContent()
                        if (content) {
                            const b = content.querySelector('strong')
                            if (b) {
                                b.textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                            }
                        }
                    }, 1000)
            },
            onOpen: () => {
                //Step 9 Listener : listener nhận yêu cầu hủy cuộc gọi từ server
                socket.on("server-send-cancel-request-call-to-listener", (response) => {
                    Swal.close();
                    clearInterval(timerInterval);
                    alertify.notify(`${response.callerName} đã hủy cuộc gọi !`, "error", 7);
                });

            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            return false;
        })
    });

    //Step 13 Caller : server-send-accept-request-call-to-caller 
    socket.on("server-send-accept-request-call-to-caller", (response) => {
        Swal.close();
        clearInterval(timerInterval);
        // console.log("caller ready ");
        var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        getUserMedia({ video: true, audio: true }, function (stream) {
            //show modal stream 
            $("#streamModal").modal("show");
            //play stream in local 
            playVideoStream("local-stream", stream);
            //call to listener
            var call = peer.call(response.listenerPeerId, stream);
            //đang dợi listener tra loi 
            call.on('stream', function (remoteStream) {
                // Play stream of listener
                playVideoStream("remote-stream", remoteStream);
            });
            //đóng modal sẽ remove stream đi 
            $("#close-stream").on("click", function () {
                CloseVideoStream(stream);
                Swal.fire({
                    title: 'Goodbye!',
                    text: `Đã kết thúc cuộc gọi với ${response.listenerName}`,
                })
            })
        }, function (err) {
            console.log('Failed to get local stream', err);
        });

    });
    //Step 14 Listner :server-send-accept-request-call-to-listener
    socket.on("server-send-accept-request-call-to-listener", (response) => {
        Swal.close();
        clearInterval(timerInterval);
        //console.log("lisnter ready ");
        var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        peer.on('call', function (call) {
            getUserMedia({ video: true, audio: true }, function (stream) {
                $("#streamModal").modal("show");
                playVideoStream("local-stream", stream);
                call.answer(stream); // Answer the call with an A/V stream.
                call.on('stream', function (remoteStream) {
                    // Show stream in some video/canvas element.
                    playVideoStream("remote-stream", remoteStream);
                });
                $("#close-stream").on("click", function () {
                    CloseVideoStream(stream);
                    Swal.fire({
                        title: 'Goodbye!',
                        text: `Đã kết thúc cuộc gọi với ${response.callerName}`,
                    })
                })
            }, function (err) {
                console.log('Failed to get local stream', err);
            });
        });
    });

})
