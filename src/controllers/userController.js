import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    // kiểm tra email, password
    if (!email || !password) {
        // không nhập 2 thông tin trễ sẽ trả về status lỗi 500
        return res.status(500).json({
            // tra ve khi bo trong email hay password
            errCode: 1, // mã lỗi khi login kh thành công
            message: "Missing inputs parameter!",
        });
    }

    let userData = await userService.handleUserLogin(email, password);
    console.log(userData);
    // check email exits, bắt lỗi email người dùng có trong hệ thống hay không
    // compare password, bắt lỗi người dùng nhập vào k hợp lệ khi biết chắn chắc người dùng đó có trong hệ thống hay k
    // return userInfor
    // access_token: JWT (json web token)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
};

module.exports = {
    handleLogin: handleLogin,
};