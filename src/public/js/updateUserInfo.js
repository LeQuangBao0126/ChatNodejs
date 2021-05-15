let userAvatar = null;
let userInfo = {};
let originUserInfo = {};
let userUpdatePassword = {};

function UpdateUserInfo() {
    $("#input-change-avatar").bind("change", function (element) {
        let fileData = element.target.files[0];
        let math = ['image/png', 'image/jpg', 'image/jpeg'];
        let limit = 1048760;// 1 MB
        if ($.inArray(fileData.type, math) == -1) {
            alertify.notify("Kiểu file khong hợp lệ, chỉ chấp nhận hình ảnh ", "error", 7);
            $(this).val(null);
            return;
        }
        if (limit < fileData.size) {
            alertify.notify("Dung lượng quá lớn không cho phép", "error", 7);
            return;
        }
        //console.log(fileData);
        let imagePreview = $("#image-edit-profile");
        imagePreview.empty();
        let fileReader = new FileReader();
        fileReader.onload = function (e) {
            jQuery('<img/>', {
                "class": 'avatar img-circle user-modal-avatar',
                "src": e.target.result
            }).appendTo(imagePreview);
        }
        fileReader.readAsDataURL(fileData);
        imagePreview.show();

        let formdata = new FormData();
        formdata.append("avatar", fileData);
        userAvatar = formdata;
    });
    $("#input-change-username").on("change", function () {
        userInfo.username = $(this).val();
    });
    $("#input-change-gender-male").on("click", function () {
        userInfo.gender = $("#input-change-gender-male").val();
    });
    $("#input-change-gender-female").on("click", function () {
        userInfo.gender = $("#input-change-gender-female").val();
    });
    $("#input-change-address").on("change", function () {
        userInfo.address = $(this).val();
    });
    $("#input-change-phone").on("change", function () {
        userInfo.phone = $(this).val();
    });
    //viet them cho cap nhat thay đổi mật khẩu cho user
    $("#input-change-current-password").on("change", function () {
        userUpdatePassword.currentPassword = $(this).val();
    });
    $("#input-change-new-password").on("change", function () {
        userUpdatePassword.newPassword = $(this).val();
    });
    $("#input-change-confirm-new-password").on("change", function () {
        userUpdatePassword.confirmNewPassword = $(this).val();
    });
}

function callUpdateAvatar() {
    $.ajax({
        url: "/user/update-avatar",
        type: "put",
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function (res) {
            if (res.result == true) {
                $(".user-update-success-alert").css("display", "block");
                $(".user-update-success-alert").find("span").text("Cập nhật ảnh đại diện thành công");
            }
        }
    })
}
function callUpdateUserInfo() {
    $.ajax({
        url: "/user/update-info",
        type: "put",
        data: userInfo,
        success: function (res) {
            originUserInfo = Object.assign(originUserInfo, userInfo);
            $("#navbar-username").text(originUserInfo.username);
            alertify.notify("Cập nhật thong tin thành công", "error", 7);
        }
    })
}
function UpdatePassword() {
    $.ajax({
        url: "/user/update-password",
        type: "put",
        data: userUpdatePassword,
        success: function (res) {
            // alertify.notify("Đổi mật khẩu thành công và tự động logout", "error", 7);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Đổi mật khẩu thành công và tự động logout sau 3 giây',
                showConfirmButton: false,
                timer: 3000,
                onClose: () => {
                    $.get("/logout", function () {
                        window.location.href = "/login-register"
                    })
                }
            });


        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.status === 404) {
                alertify.notify(xhr.responseJSON.error, "error", 7);
            }
        }
    })
}

$(document).ready(function () {
    originUserInfo = {
        username: $("#input-change-username").val(),
        gender: $("#input-change-gender-male").prop("checked", true) ? "male" : "female",
        address: $("#input-change-address").val(),
        phone: $("#input-change-phone").val(),
    }
    userInfo = originUserInfo;
    UpdateUserInfo();
    let originAvatar = $(".user-modal-avatar").attr("src");
    $("#input-btn-cancel-update-user").on("click", function () {
        userInfo = {};
        userAvatar = null;
        //console.log(originUserInfo)
        $(".user-modal-avatar").attr("src", originAvatar);
        $("#input-change-username").val(originUserInfo.username);
        if (originUserInfo.gender == "male") {
            $("#input-change-gender-male").click();
        } else {
            $("#input-change-gender-female").click();
        }
        $("#input-change-address").val(originUserInfo.address);
        $("#input-change-phone").val(originUserInfo.phone);
    })
    $("#input-btn-update-user").on("click", function () {
        if (userAvatar) {
            callUpdateAvatar();
        }
        if (userInfo) {
            console.log("userInfo", userInfo)
            callUpdateUserInfo();
        }

    });

    //thay doi mat khau
    $("#input-btn-update-user-password").on("click", function () {
        if (userUpdatePassword.currentPassword && userUpdatePassword.newPassword && userUpdatePassword.confirmNewPassword) {
            UpdatePassword();
        } else {
            alertify.notify("Bạn phải điền đủ thông tin", "error", 8);
        }
    });
    $("#input-btn-cancel-update-user-password").on("click", function () {
        userUpdatePassword = {};
        $("#input-change-current-password").val("");
        $("#input-change-new-password").val("");
        $("#input-change-confirm-new-password").val("");
    });
})