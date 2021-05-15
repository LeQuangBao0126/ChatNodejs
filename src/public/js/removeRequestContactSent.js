function decreaseNumberNotifContact(className) {
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue -= 1;
    if (currentValue <= 0) {
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`<em>${currentValue}</em>`);
    }
}

function removeRequestContactSent() {
    $(".user-remove-request-contact-sent").on("click", function () {
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact-sent",
            type: "delete",
            data: { uid: targetId },
            success: function (data) {
                if (data.success) {
                    $(`.user-add-new-contact[data-uid="${targetId}"]`).show();
                    $(`.user-remove-request-contact-sent[data-uid="${targetId}"]`).hide();
                    decreaseNumberNotifContact("count-request-contact-sent");
                    // xóa 1 thang o tab dang chờ xác nhận
                    let userInfoHtml = $("#request-contact-sent").find(`li[data-uid="${targetId}"]`).remove();//outerHtml

                    //socket    
                    socket.emit("remove-request-contact-sent", { contactId: targetId });
                }
            }
        })
    })
}
$(document).ready(function () {
    removeRequestContactSent();
})
socket.on("response-remove-request-contact-sent", function (data) {
    $(".noti_content").find(`div[data-uid = "${data.id}"]`).remove();
    $("#notificationModal .list-notifications").find(`div[data-uid = "${data.id}"]`).remove();
    $("#request-contact-received").find(`ul li[data-uid = "${data.id}"]`).remove();
    //xoa may cai so thong bao;
    decreaseNumberNotifContact("count-request-contact-received");
    decreaseNumberNotification("noti_contact_counter");
    decreaseNumberNotification("noti_counter");
});