export const transValidation = {
    email_incorrect: "Email phải có dạng example@gmail.com",
    password_confirmation_incorrect: "Nhập lại mật khẩu không chính xác",
    message_text_emoji_incorrect: "Tin nhắn không hợp lệ,đảm bảo tối thiểu 1 kí tự , tối đa 400 kí tự"
}
export const transError = {
    account_in_use: "Email này đã đc sử dụng",
    server_error: "Lỗi hệ thống"
}
export const transSuccess = {
    account_in_use: "Email này đã đc sử dụng",
    loginSuccess: (username) => {
        return `Xin chào bạn ${username} đã đăng nhập thành công vào hệ thống`
    },
    logout_success: "Đăng xuất tài khoản thành công"
}
