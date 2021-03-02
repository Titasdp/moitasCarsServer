const {
    response
} = require("express");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    "nunops_moitascars",
    "nunops_titas",
    "PVk5]#;iZZRu", {
        host: "nunops.com",
        port: "3306",
        dialect: "mysql",
        logging: false,
        define: {
            timestamps: false
        }
    }
);

sequelize
    .sync({
        alter: true
    })
    .then(response => {
        console.log("Sequelize is working normally");
    })
    .catch(error => {
        console.log(error);
    });

module.exports = sequelize;