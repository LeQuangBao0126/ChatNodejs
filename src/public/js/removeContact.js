function removeContact() {
    $(".user-remove-contact").on("click", function () {
        var targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-contact",
            type: "delete",
            data: { uid: targetId },
            success: function (res) {
                if (res.success) {
                    $("#contacts").find(`ul li[data-uid="${targetId}"]`).remove();
                    decreaseNumberNotification("count-contacts");
                    socket.emit("remove-contact", { contactId: targetId });
                    //all step handle after remove contact
                    let checkActive = $("#all-chat").find(`li[data-chat=${targetId}]`).hasClass("active");
                    //Step 1 : reomve leftside
                    $("#all-chat").find(`ul a[href="#uid_${targetId}"] `).remove();
                    $("#user-chat").find(`ul a[href="#uid_${targetId}"] `).remove();
                    //step 2 :remove right side
                    $("#screen-chat").find(`div#to_${targetId}`).remove();
                    //step 3 : remove image modal 
                    $("body").find(`div#imagesModal_${targetId}`).remove();
                    //step 4 : remove attachment modal 
                    $("body").find(`div#attachmentsModal_${targetId}`).remove();
                    //step 5 : click first conversation 
                    if (checkActive) {
                        $("ul.people").find("a")[0].click();
                    }
                }
            }
        })
    });
    socket.on("response-remove-contact", function (user) {
        $("#contacts").find(`ul li[data-uid="${user.id}"]`).remove();
        decreaseNumberNotification("count-contacts");
        //all step handle after remove contact
        let checkActive = $("#all-chat").find(`li[data-chat=${user.id}]`).hasClass("active");
        //Step 1 : reomve leftside
        $("#all-chat").find(`ul a[href="#uid_${user.id}"] `).remove();
        $("#user-chat").find(`ul a[href="#uid_${user.id}"] `).remove();
        //step 2 :remove right side
        $("#screen-chat").find(`div#to_${user.id}`).remove();
        //step 3 : remove image modal 
        $("body").find(`div#imagesModal_${user.id}`).remove();
        //step 4 : remove attachment modal 
        $("body").find(`div#attachmentsModal_${user.id}`).remove();
        //step 5 : click first conversation 
        if (checkActive) {
            $("ul.people").find("a")[0].click();
        }
    });
}

$(document).ready(function () {
    removeContact();
})