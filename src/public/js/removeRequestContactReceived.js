function removeRequestContactReceived() {
    $(".user-remove-request-contact-received").on("click", function () {
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact-received",
            type: "delete",
            data: { uid: targetId },
            success: function (data) {
                if (data.success) {
                    $("#request-contact-received").find(`ul li[data-uid = "${targetId}"]`).remove();
                    //-1 cái số lương tren thong báo đi 
                    decreaseNumberNotification("count-request-contact-received");
                    //xóa 1 cái thong bao cua nó 
                    $(".noti_content").find(`div[data-uid="${targetId}"]`).remove();
                    //emit
                    socket.emit("remove-request-contact-received", { contactId: targetId });
                }
            }
        })
    })
}

socket.on("response-remove-request-contact-received", function (user) {
    console.log("response-remove-request-contact-received", user);
    $("#request-contact-sent").find(`ul li[data-uid="${user.id}"]`).remove();
    decreaseNumberNotifContact("count-request-contact-sent");
    $(`.user-remove-request-contact-sent[data-uid="${user.id}"]`).hide(); //màu đỏ hide
    $(`.user-add-new-contact[data-uid="${user.id}"]`).show();
    // $(".noti_content").find(`div[data-uid = "${data.id}"]`).remove();
    // $("#notificationModal .list-notifications").find(`div[data-uid = "${data.id}"]`).remove();

    // //xoa may cai so thong bao;
    // decreaseNumberNotifContact("count-request-contact-received");
    // decreaseNumberNotification("noti_contact_counter");
    // decreaseNumberNotification("noti_counter");
});