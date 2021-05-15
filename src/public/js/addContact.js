function increaseNumberNotifContact2(className) {
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue += 1;
    if (currentValue <= 0) {
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`<em>${currentValue}</em>`);
    }
}
function addContact() {
    $(".user-add-new-contact").on("click", function () {
        var targetId = $(this).data("uid");
        //console.log(targetId);
        $.post("/contact/add-new", { uid: targetId }, function (data) {
            if (data.success) {
                $(`.user-add-new-contact[data-uid="${targetId}"]`).hide();
                $(`.user-remove-request-contact-sent[data-uid="${targetId}"]`).css("display", "inline-block")
                $(`.user-remove-request-contact-sent[data-uid="${targetId}"]`).show();
                increaseNumberNotifContact2("count-request-contact-sent");

                //gửi thằng mới kết bạn qua tab đang chờ xác nhận
                let userInfoHtml = $("#find-user").find(`ul li[data-uid="${targetId}"]`).get(0).outerHTML;//outerHtml
                $("#request-contact-sent .contactList").prepend(userInfoHtml);
                removeRequestContactSent(); // goi hàm này nó mới biết chạy

                //socket emit
                socket.emit("add-new-contact", { contactId: targetId });
            }
        })
    })
}
socket.on("response-add-new-contact", function (user) {
    let notif = `  <div data-uid="${user.id}">
                    <img class="avatar-small" src="images/users/${user.avatar}"
                        alt="">
                    <strong>${user.name}</strong> đã gửi cho bạn lời mời kết bạn!
                </div>`;
    $(".noti_content").prepend(notif);
    increaseNumberNotifContact("count-request-contact-received");
    increaseNumberNotification("noti_contact_counter");
    increaseNumberNotification("noti_counter");
    //
    //kiem tra coi co chua .. neu co thi ko append nữa vì sẽ có 2 thang
    let existContactReceived = $("#request-contact-received").find(`ul li[data-uid=${user.id}]`)
    console.log("existContactReceived", existContactReceived.length)
    if (existContactReceived.length) {

    } else {
        let userInfoHtml = `
        <li class="_contactList" data-uid="${user.id}">
        <div class="contactPanel">
        <div class="user-avatar">
            <img src="images/users/${user.avatar}" alt="">
        </div>
        <div class="user-name">
            <p>
            ${user.name}
            </p>
        </div>
        <br>
        <div class="user-address">
            <span>Địa Chỉ : ${user.address}</span>
        </div>
        <div class="user-approve-request-contact-received" data-uid="${user.id}">
            Chấp nhận
        </div>
        <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
            Xóa yêu cầu
        </div>
        </div>
    </li>
                `;
        $("#request-contact-received").find("ul").prepend(userInfoHtml);
    }
    removeRequestContactReceived(); //js/removeRequestContactReceived().js
    approveRequestContactReceived();
});

////test received
socket.on("response-remove-request-contact-received", function (user) {
    $("#request-contact-sent").find(`ul li[data-uid=${user.id}]`).remove();
    decreaseNumberNotifContact("count-request-contact-sent");
});


