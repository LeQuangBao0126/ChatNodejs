function ajaxMarkNotifAsRead(targetUsers) {
    $.ajax({
        url: "/notification/mark-all-as-read",
        type: "post",
        data: { targetUsers: targetUsers },
        success: function (resp) {
            console.log(resp)
            if (resp.success == true) {
                $(".list-notifications").find("div.notif-reader-false").removeClass("notif-reader-false");
            }
        }
    })
}
function markNotifAsRead() {
    $("#popup-mark-all-as-read").on("click", function () {
        let targetUsers = [];
        $(".list-notifications").find("div.notif-reader-false").each(function (index, notification) {
            targetUsers.push($(notification).data("uid"));
        });
        if (!targetUsers.length) {
            alertify.notify("Bạn đã đọc hết thong báo", "error", 7);
            return;
        }
        ajaxMarkNotifAsRead(targetUsers);
    })
}