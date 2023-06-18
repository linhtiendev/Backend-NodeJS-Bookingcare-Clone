import db from "../models/index";
import bcrypt from "bcryptjs"; // dung tv de hashpassword,dung tv de giai ma lai password, so sanh password

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            // isExist viết tắt là có tồn tại hay k;
            let isExist = await checkUserEmail(email);
            if (isExist) {
                // user already exits
                // Dùng sqelize để tìm 1 user
                let user = await db.User.findOne({
                    attributes: ["email", "roleId", "password"],
                    where: { email: email },
                    raw: true,
                });
                if (user) {
                    // compare password: dùng cách 1 hay cách 2 đều chạy đúng cả
                    // Cách 1: dùng asynchronous (bất đồng bộ)
                    // let check = await bcrypt.compare(password, user.password);

                    // Cách 2: dùng synchronous  (đồng bộ)

                    let check = await bcrypt.compare(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`;
                }
            } else {
                // return error
                // trả về mã lỗi là 1
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exits in your system, Pls try other email! `;
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

// function check user có tồn tại trong hệ thống hay chưa
let checkUserEmail = (userEmail) => {
    // check db sẽ tốn thời gian, nên phải dùng Promise để tránh việc bất đồng bộ
    return new Promise(async (resolve, reject) => {
        try {
            // hàm tham chiếu đến table User
            // hàm findOne: chỉ tìm được 1 bản ghi
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
};
