function TypingOn(divId) {
    let targetId = $(`#write-chat-${divId}`).data("chat");
    if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        socket.emit("user-is-typing", { groupId: targetId });
    } else {
        socket.emit("user-is-typing", { contactId: targetId });
    }
}
function TypingOff(divId) {
    let targetId = $(`#write-chat-${divId}`).data("chat");
    if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        socket.emit("user-is-not-typing", { groupId: targetId });
    } else {
        socket.emit("user-is-not-typing", { contactId: targetId });
    }
}

$(document).ready(function () {
    socket.on("response-user-is-typing", function (response) {
        let messageTyping = `<div class="bubble you bubble-typing-gif" >
            <img src="/images/chat/typing.gif" />
        </div>`;
        let checkTyping = $(`.chat[data-chat=${response.currentGroupId}]`).find(".bubble-typing-gif");
        if (checkTyping.length) {
            return false;
        }
        if (response.currentGroupId) {
            if (response.currentUserId != $("#dropdown-navbar-user").data("uid")) {
                $(`.chat[data-chat=${response.currentGroupId}]`).append(messageTyping);
                nineScrollRight(response.currentGroupId);
            }
        } else {
            $(`.chat[data-chat=${response.currentUserId}]`).append(messageTyping);
            nineScrollRight(response.currentUserId);
        }
    });
    socket.on("response-user-is-not-typing", function (response) {
        if (response.currentGroupId) {
            if (response.currentUserId != $("#dropdown-navbar-user").data("uid")) {
                $(`.chat[data-chat=${response.currentGroupId}]`).find(".bubble-typing-gif").remove();
                nineScrollRight(response.currentGroupId);
            }
        } else {
            $(`.chat[data-chat=${response.currentUserId}]`).find(".bubble-typing-gif").remove();
            nineScrollRight(response.currentUserId);
        }
    });
});