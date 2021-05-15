function readMoreNotif() {
    $("#link-read-more-notif").on("click", function () {
        let skipNumber = $(".list-notifications").find("li").length;
        $.get(`/notification/readMore/?skipNumber=${skipNumber}`, function (notifications) {
            if (!notifications.length) {
                alertify.notify("Bạn không còn thong báo nào !", "error", 7);
            } else {
                notifications.forEach(notification => {
                    $(".list-notifications").append(`<li>${notification}</li>`)
                })
            }
        })
    })
}
$(document).ready(function () {
    readMoreNotif();
})