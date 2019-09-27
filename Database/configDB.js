var mysql = require('mysql');

var connection  = mysql.createConnection({
    host: "localhost",
    user: "MartinescuS",
    password: "Cruciada4199!",
    database: "instaMeme"
});

connection.connect((err) => {
    if(err) {
        console.log(err);
        return err;
    }

    console.log("Welcome to InstaMeme:) !");
});

module.exports = connection; 