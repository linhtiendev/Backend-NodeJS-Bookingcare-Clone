import db from "../models/index";
import CRUDService from "../services/CRUDService";
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render("homepage.ejs", {
            data: JSON.stringify(data),
        });
    } catch (e) {
        console.log(e);
    }
};

let getAboutPage = (req, res) => {
    return res.render("test/aboutpage.ejs");
};

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("post crud form server");
};

// dung Promise de xu ly bat dong bo nen ham nay phai them async/await
let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render("displayCRUD.ejs", {
        dataTable: data,
    });
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    // lay thong tin nguoi dung thong qua id
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        // check userData not found
        // let user data
        return res.render("editCRUD.ejs", {
            user: userData,
        });
    } else {
        return res.send("User not found");
    }
};
// function lay input tu put-crud
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render("displayCRUD.ejs", {
        dataTable: allUsers,
    });
};

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send("User deleted successfully");
    } else {
        return res.send("User not found");
    }
};

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
};
