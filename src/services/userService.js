import db from "../models/index";
import bcrypt from "bcryptjs"; // dung tv de hashpassword,dung tv de giai ma lai password, so sanh password

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};

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

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = await db.User.findAll({
                    //không trả ra password
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email is exist?
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage:
                        "Your email is alrealdy in used, plz try another email!",
                });
            } else {
                let hashPasswordFormBcrypt = await hashUserPassword(
                    data.password
                );
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFormBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === "1" ? true : false,
                    roleId: data.roleId,
                });
                resolve({
                    errCode: 0,
                    message: "OK",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: { id: userId },
        });
        if (!foundUser) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`,
            });
        }
        await db.User.destroy({
            where: { id: userId },
        });
        resolve({
            errCode: 0,
            message: `The user was deleted`,
        });
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameters",
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();

                resolve({
                    errCode: 0,
                    message: "Update the user successfully",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters !",
                });
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput },
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
};
