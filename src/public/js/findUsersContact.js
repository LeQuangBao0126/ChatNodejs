
$(document).ready(function () {
    $("#btn-find-users-contact").bind("keypress", function (e) {
        if (e.which === 13) {
            let keyword = $(this).val();
            if (!keyword.length) {
                alertify.notify("Dữ liệu tìm kiếm không được rỗng", "error", 7);
                return;
            }
            $.get(`/contact/find-users/${keyword}`, function (data) {
                $("#find-user ul").html(data);
                addContact();// trong file js
                removeRequestContactSent(); // trong file js
            });
        }
    });
    //

});
