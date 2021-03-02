require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
// const router = require("../Server/Routes/routes");
const sequelize = require("../Server/Database/connection.js");
// const expressSanitizer = require("express-sanitizer");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
// app.use(router);

// app.use(expressSanitizer());
testBdConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('The server connection to the BD has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


app.listen(port, async () => {
    await testBdConnection();
    console.log(`MoitasCars server is online and working on door: ${port}`);
});