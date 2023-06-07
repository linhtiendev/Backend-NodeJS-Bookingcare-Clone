import express from "express";
import bodyParser from "body-parser"; //tv ho tro lay tham so client
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./router/web";
require("dotenv").config(); //tv giup run process.env

let app = express();

// config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

let port = process.env.PORT || 6969;
//port === undefined => port = 6969
app.listen(port, () => {
    //callback
    console.log("Backend NodeJS is running: " + port);
});
